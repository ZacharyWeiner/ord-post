import React, { useState } from 'react';
function OrbinalEncoder() {
    const [txid, setTxid] = useState('');
    const [imageData, setImageData] = useState(null);
  
    const handleEncode = async () => {
      const response = await fetch('/api/encode-orbinal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sub_txid: txid }),
      });
      
      const data = await response.json();
      setImageData(data.base64Img);
    };
  
    return (
      <div>
        <h2>Encode a Txid</h2>
        <input 
          className='text-gray-700'
          type="text" 
          value={txid} 
          onChange={(e) => setTxid(e.target.value)} 
          placeholder="Enter txid"
        />
        <button onClick={handleEncode}>Encode</button>
        {imageData && (
          <img 
            src={`data:image/png;base64,${imageData}`} 
            alt="Encoded txid" 
          />
        )}
      </div>
    );
  };
  
  export default OrbinalEncoder;