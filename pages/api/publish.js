// pages/api/publish.js
// pages/api/publish.js
const admin = require('./../../utils/firebaseAdmin.js'); // Adjust the path as needed
import { createOrdinal, sendOrdinal } from './../../ordinals/ordinals'
import { PrivateKey, P2PKHAddress } from 'bsv-wasm'
import { getTransactionDetails, getUnspentTransactions, bitcoinToSatoshis } from './../../utils/transactions'

const handleInscribing = async (fileAsBase64, mimeType, receiverAddress, metadata, signerKey) => {
    if (!fileAsBase64 || fileAsBase64.length === 0) {
        return {error: "No File"};
      }
      const base64Image = fileAsBase64.split(';base64,').pop();
      //fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });
      const minimumSatoshis = Math.ceil(fileAsBase64.length / 5) + 5;
      console.log({ minimumSatoshis })
      const paymentPk = PrivateKey.from_wif(process.env.NEWS_MINT_KEY);
      let signKey = PrivateKey.from_wif(signerKey ? signerKey.toString() : process.env.NEWS_SIGN_KEY);
      const changeAddress =  process.env.NEWS_CHANGE_ADDRESS//process.env.HTML_ART_MINT_CHANGE_ADDRESS;
      let utxoResponse = await getUnspentTransactions(minimumSatoshis, changeAddress);
      console.log({utxoResponse, metadata});
      if(metadata?.subTypeData?.traits){
        console.log("Traits ", metadata.subTypeData.traits);
      }
      const inscriptionInputTxid = utxoResponse?.txid ? utxoResponse?.txid : 0;
      const satoshiCount = utxoResponse?.value ? utxoResponse.value : 0;
      const vout = utxoResponse?.vout ? utxoResponse?.vout : 0;
      console.log({inscriptionInputTxid, satoshiCount, vout})
      console.log({paymentPk, receiverAddress, changeAddress})
        let p2Script = P2PKHAddress.from_string(changeAddress ? changeAddress : '' );
        console.log("P2Script", p2Script.get_locking_script().to_asm_string())
        const utxo = {
          satoshis: satoshiCount,
          txid: inscriptionInputTxid,
          script: p2Script.get_locking_script().to_asm_string(),
          vout: vout,
        };
  
        const inscription = { dataB64: base64Image, contentType: mimeType };
       console.log(utxo, receiverAddress, paymentPk, changeAddress ? changeAddress : '', 0.01, inscription, metadata, signKey)
        let tx;
        if(metadata){
           tx =
            await createOrdinal(utxo, receiverAddress, paymentPk, changeAddress ? changeAddress : '', 0.01, inscription, metadata, signKey );
        } else {
          tx =
          await createOrdinal(utxo, receiverAddress, paymentPk, changeAddress ? changeAddress : '', 0.01, inscription, null, signKey );
        }
       
          //console.log(tx.to_hex());
          console.log(tx.to_hex().length);
          let response = await fetch("https://api.whatsonchain.com/v1/bsv/main/tx/raw", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              txhex: tx.to_hex()
            })
          })
          // Check if the request was successful
          if (response.ok) {
            // Parse the response as JSON
            let data = await response.json();
            console.log(data);
          } else {
            console.log("HTTP-Error: " + response.status);
          };
          if(response.status === 400){console.log('400 Error')}
          else{
            console.log(tx.get_id_hex())
            return tx.get_id_hex();
          }
          return response.status;
};

const publishArticle = async (req, res) => {
    console.log(0)
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
  
    const { title, link, author, body, receiverAddress } = req.body;
    let { signerKey } = req.body;
    console.log(title, link, author, body, receiverAddress, signerKey);
    if(signerKey.length < 30){
      signerKey = undefined;
    }

    // Validate the input
    if (!title ||  !author || body.length > 1000) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const jsonToSubmit = {
        "p": "news",
        "type": "post",
        "app": "ord-post",
        "title": title,
        "url": link,
        "author":author,
        "body": body,
      }
    const base64Json = btoa(JSON.stringify(jsonToSubmit));
    let sendTo = receiverAddress.lengh > 30 ? receiverAddress : process.env.NEWS_OWNER_ADDRESS;
    console.log({receiverAddress, signerKey})
   
    try {
      const completion = await handleInscribing( 
        base64Json,
       'application/json',  
       sendTo,
       jsonToSubmit,
       signerKey)
     // Add the article to the database
     console.log({completion})

      const articleRef = await admin.firestore().collection('articles').add({
        title,
        link,
        author,
        body,
        txid: completion,
        publishedAt: admin.firestore.Timestamp.now(),
      });
  
      return res.status(200).json({ id: articleRef.id });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'An error occurred while publishing the article' });
    }
};

export default publishArticle;