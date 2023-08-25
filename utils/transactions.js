export async function getUnspentTransactions(minimumSats, address) {
    let endpoint; 
    if(!address){
       endpoint = `https://api.whatsonchain.com/v1/bsv/main/address/${process.env.NEWS_CHANGE_ADDRESS}/unspent`;
    } else {
       endpoint = `https://api.whatsonchain.com/v1/bsv/main/address/${address}/unspent`;
    }
    
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log('UTXOs: ',  data);
        // Find an entry with a value of at least 10000
        const eligibleEntry = data.find(entry => (entry.value >= minimumSats));
        // If an eligible entry is found, use the tx_hash to get transaction details
        if (eligibleEntry) {
          return await getTransactionDetails(eligibleEntry.tx_hash, minimumSats);
        } else {
          console.log('No eligible entry found with value >=', minimumSats);
          return null;
        }
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
    
    export async function getTransactionDetails(tx_hash, minimumSats) {
      const endpoint = `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${tx_hash}`;
    
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        // Find an entry in vout with value of more than 10000
        const eligibleVout = data.vout.find(voutEntry => voutEntry.value * 100000000 > minimumSats);
        // If an eligible entry is found, return the txid, vout, and value
        if (eligibleVout) {
          const result = {
            txid: data.txid,
            vout: eligibleVout.n,
            value: bitcoinToSatoshis(eligibleVout.value)
          };
          return result;
        } else {
          console.log('No eligible entry found with value > 10000 in vout');
          return null;
        }
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
  
    export function bitcoinToSatoshis(fractionOfBitcoin) {
      // The number of satoshis in one bitcoin
      const satoshisInOneBitcoin = 100000000;
      
      // Calculate the number of satoshis in the given fraction of a bitcoin
      const satoshis = fractionOfBitcoin * satoshisInOneBitcoin;
      
      // Return the result as an integer
      return Math.round(satoshis);
    }