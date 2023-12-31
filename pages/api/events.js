import { JungleBusClient, ControlMessageStatusCode } from "@gorillapool/js-junglebus";
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { db, admin } from './../../utils/firebaseAdmin'; // Adjust the import path as necessary
import chalk from "chalk";
const filePath = path.join(process.cwd(), 'state.txt');

// Create an instance of axios with default configuration
const axiosInstance = axios.create({
  // You can set base URLs, headers, timeout limits, etc.
});

// A simple in-memory cache to store responses
const responseCache = new Map();

// Utility function to check if the content type is text
const isTextContentType = (contentType) => {
  return contentType && contentType.startsWith('text');
};

// Function to append state to the file
const appendStateToFile = async (state) => {
  try {
    const stateString = JSON.stringify(state, null, 2) + '\n';
    await fs.promises.appendFile(filePath, stateString);
  } catch (error) {
    console.error("Error writing to file", error);
  }
};

// Example function to add a document to Firestore
const saveTransaction = async (txid, satoshis, lockedInBlock, lockDuration, contentTxid, content, author) => {
  let shouldSave = false;
  console.log(chalk.bgCyan("Beginning Save", txid, satoshis, lockedInBlock, lockDuration, contentTxid, content, author))
  try {
    // References to the collections
    const contentCollectionRef = db.collection('contentCollection');
    const likesCollectionRef = db.collection('likesCollection').doc(txid);

    // Check if content exists
    const contentDoc = await contentCollectionRef.doc(contentTxid).get();
    if (!contentDoc.exists) {
      // Save the content if it doesn't exist
      await contentCollectionRef.doc(contentTxid).set({
        contentTxid,
        content,
        author: author ? author : "",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(chalk.bgGreen('Content saved:', contentTxid));
    } else {
      console.log(chalk.bgYellow('Content already exists:', contentTxid));
    }

    // Check if the like already exists
    const likeDoc = await likesCollectionRef.get();
    if (!likeDoc.exists) {
      shouldSave = true;
      // Save the like if it doesn't exist
      await likesCollectionRef.set({
        txid,
        contentTxid,
        satoshis,
        lockedInBlock,
        lockDuration,
        contentAuthor: author ? author : "",
        contentRef: contentCollectionRef.doc(contentTxid),  // Reference to the content
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(chalk.bgGreen('Like saved:', txid));
    } else {
      console.log(chalk.bgYellow('Like already exists:', txid));
    }
  } catch (err) {
    console.log(chalk.bgRed("There was an error", err.message));
  }
  return shouldSave;
};

// Example function to update a document in Firestore
// const updateTotalCoinsLocked = async (txid, additionalSatoshis) => {
//   const transactionRef = db.collection('transactions').doc(txid);
//   await transactionRef.update({
//     satoshis: admin.firestore.FieldValue.increment(additionalSatoshis)
//   });
// };

export default async function handler(req, res) {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Flush the headers to establish SSE with client

  // Fetch the latest block information
  let currentBlockNumber;
  try {
    const response = await axios.get('https://api.whatsonchain.com/v1/bsv/main/chain/info');
    const data = response.data;
    currentBlockNumber = data.blocks -144; // Use the correct property that contains the latest block number
  } catch (error) {
    console.error('Error fetching current block number:', error);
    res.write(`event: error\ndata: Error fetching current block number: ${error.message}\n\n`);
    res.end();
    return;
  }

  const client = new JungleBusClient("junglebus.gorillapool.io", {
    useSSL: true,
    onConnected(ctx) {
      console.log("CONNECTED", ctx);
      res.write(`event: connected\ndata: ${JSON.stringify(ctx)}\n\n`);
    },
    onConnecting(ctx) {
      console.log("CONNECTING", ctx);
      res.write(`event: connecting\ndata: ${JSON.stringify(ctx)}\n\n`);
    },
    onDisconnected(ctx) {
      console.log("DISCONNECTED", ctx);
      res.write(`event: disconnected\ndata: ${JSON.stringify(ctx)}\n\n`);
      res.end(); // End the SSE connection if the client disconnects
    },
    onError(ctx) {
      console.error("Error:", ctx);
      res.write(`event: error\ndata: ${JSON.stringify(ctx)}\n\n`);
    },
  });

  // Define the onStatus, onError, onMempool, and onPublish functions here
  const onStatus = function(message) {
    if (message.statusCode === ControlMessageStatusCode.BLOCK_DONE) {
        //console.log("BLOCK DONE", message.block);
    } else if (message.statusCode === ControlMessageStatusCode.WAITING) {
        console.log("WAITING FOR NEW BLOCK...", message);
    } else if (message.statusCode === ControlMessageStatusCode.REORG) {
        console.log("REORG TRIGGERED", message);
    } else if (message.statusCode === ControlMessageStatusCode.ERROR) {
        console.error("Error message:", message);
    }
};

const onError = function(err) {
    console.error("Error:", err);
};

const onMempool = function(tx) {
    console.log("MEMPOOL TRANSACTION", tx);
};
const onPublish = async function(tx) {
  console.log(chalk.green("Pushing new tx into the stack"))
  // transactionsToInspect.push(tx)
  try{
      let {lockedForBlocks, satoshisLocked} = await processTransaction(tx)
      console.log(chalk.cyan(`Updating Stats - Total Blocks Locked: ${lockedForBlocks} Total Satoshis: ${satoshisLocked}`))
      if((satoshisLocked || lockedForBlocks)){
          try{
              let bitcoinLocked = satoshisLocked / 100000000;
              await updateLockStatistics(bitcoinLocked, lockedForBlocks) 
              console.log(chalk.cyan(`Updated Stats`))
          }catch(err){"There was an error updating the stats: ", err.message}
      }
  }catch(err){console.log("Error in main: ", err.message)}
  
};
const processTransaction = async function(tx) {
    let lockID = tx.id;
    let lockedTo; 
    let lockerHandle; 
    let lockedToHandle; 
    let updateStats;
    let lockedForBlocks;
    let satoshisLocked;

    // 1: We get a streaming feed of lock transactions. 
    // Generally the lock is in the _0 outout and the context (MAP DATA) is in the _1 output 
    // 2: Get information about all of the outputs in the transaction with a lock
  console.log("Repsponding to a new Lock with TransactionID: ", tx.id);
  try {
    let locksResponseData;
    if (responseCache.has(tx.id)) {
      locksResponseData = responseCache.get(tx.id);
    } else {
      const locksResponse = await axiosInstance.get(`https://ordinals.gorillapool.io/api/locks/txid/${tx.id}`);
      locksResponseData = locksResponse.data;
      responseCache.set(tx.id, locksResponseData); // Cache the response
    }
    
    // locksResponseData.forEach((x) => {
    //     try{
    //         console.log("start lock response interation")
    //         console.log(x)
    //         console.log(x.data)
    //         console.log(x.data?.lock)
    //         console.log(x.data?.lock?.until)
    //         console.log(x.data?.lock?.address)
    //         console.log("end lock response iteration")
    //     } catch(err){console.log(err)}
       
    // })
    // console.log("Lock Response Iteration Completed");

     // 3: Check if the lock is significant.
    //   If not - do nothing
    //   If it is then lets take a look at what they were locking to. 
    satoshisLocked = locksResponseData[0].satoshis
    if (locksResponseData && locksResponseData.length > 1 && satoshisLocked) {
      let lockedInBlock = locksResponseData[0].height;
      let lockedUntil = locksResponseData[0].data?.lock?.until;
      lockedForBlocks = lockedUntil - lockedInBlock;
      console.log(chalk.blue(`Locked in Block ${lockedInBlock} Until: ${lockedUntil} For ${lockedForBlocks} Blocks`))
  
      // 4: Retrieve the output with the data/context 
      const hasContext = locksResponseData[1];
      // 5: Check to make sure that there is map data in this output, and that it refrences another transaction
      if (hasContext.data && hasContext.data.map && 'tx' in hasContext.data.map) {
        let contentTx = hasContext.data.map.tx;
        lockedTo = contentTx;
        lockerHandle = hasContext.data.map.paymail
        // 6: fetch the content of the referenced transaction
        const ordinalResponse = await axiosInstance.get(`https://v3.ordinals.gorillapool.io/content/${contentTx}`, { responseType: 'arraybuffer' });
        const contentType = ordinalResponse.headers['content-type'];
        
        // Check the Content-Type of the response
        //if (isTextContentType(contentType)) {
          // If it's text, it's safe to convert to string
          const content = Buffer.from(ordinalResponse.data).toString();
          // check to make sure its not an image. 
          //if (!content.includes(';base64,') && content.includes('/mint')) {
            const mapDataResponse = await axiosInstance.get(`https://locks.gorillapool.io/api/txos/${contentTx}_1`);
            // NOTE: At this point we have the content to which the lock has been applied.
            //.      Details about the lock its self
            //console.log( "mint command ",  "got a lock of ",  locksResponseData[0].satoshis, "satoshis - ", "comand-author:", mapDataResponse.data.data.map.paymail, "content:", content);
            const state = {
              lockTxid: tx.id,
              satoshisLocked: locksResponseData[0].satoshis,
              contentTxid: contentTx,
              postContent: content,
              locks: locksResponseData,
              author: mapDataResponse.data.data.map.paymail,
              locker: lockerHandle
            };
            console.log(`event: transaction\ndata: ${JSON.stringify(state)}\n\n`);
            res.write(`event: transaction\ndata: ${JSON.stringify(state)}\n\n`);
            updateStats = await saveTransaction(tx.id, locksResponseData[0].satoshis, lockedInBlock, lockedForBlocks,  contentTx, content, mapDataResponse.data.data.map.paymail)
            //await appendStateToFile(state);
          //}
        // } else {
        //   console.log(`The content of the post that received the lock is of type '${contentType}' and cannot be displayed as text.`);
        // }
      }
    } else {console.log("Locks response was not well formed")}
  } catch (error) {
    console.error("Error handling published transaction:", error.message);
  }
  return {updateStats, lockedForBlocks, satoshisLocked};
};

  // Subscribe to the JungleBus
  (async () => {
    try {
      await client.Subscribe(
        "c239392d594beb0fd8329c3fc079ca7d6eadea08ccec043527513090666b0eb4",
        currentBlockNumber,
        onPublish,
        onStatus,
        onError
      );
    } catch (error) {
      console.error("Error during subscription:", error.message);
      res.write(`event: subscriptionError\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
    }
  })();

  // When the request is closed by the client, unsubscribe and end the SSE connection
  req.on('close', () => {
    console.log('Client closed connection');
    client.unsubscribe();
    res.end();
  });
}
