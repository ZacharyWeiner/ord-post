import React, { useState, useEffect } from 'react';

function OrbinalEncoder({ initialTxid }) {
  const [txid, setTxid] = useState(initialTxid || '');
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (initialTxid) {
      handleEncode(initialTxid);
    }
  }, [initialTxid]);

  const handleEncode = async (txidToEncode = txid) => {
    const response = await fetch('/api/encode-orbinal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sub_txid: txidToEncode }),
    });

    const data = await response.json();
    setImageData(data.base64Img);
  };

  return (
    <div>
      {imageData && (
        <img src={`data:image/png;base64,${imageData}`} alt="Encoded txid" />
      )}
    </div>
  );
}

export default OrbinalEncoder;
