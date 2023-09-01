import { useState } from 'react';
import { usePrivateKeys } from '@/hooks/usePrivateKeys';

function ProfilePage() {
  const {
    payPrivKey,
    payAddress,
    objPrivKey,
    objAddress,
    generateNewPayKey,
    generateNewObjKey,
    setCustomPayKey,
    setCustomObjKey
  } = usePrivateKeys();

  const [customPayKey, setCustomPayKeyInput] = useState('');
  const [customObjKey, setCustomObjKeyInput] = useState('');

  const handleSetCustomPayKey = () => {
    setCustomPayKey(customPayKey);
  };

  const handleSetCustomObjKey = () => {
    setCustomObjKey(customObjKey);
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px 5px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#000',
    color: '#fff'
  };
  const downloadKeys = () => {
    const data = {
        payPk: payPrivKey,
        ordPk: objPrivKey,
        ordAddress: objAddress,
        payAddress: payAddress,
      };
  
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "keys.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid black', paddingBottom: '10px' }}>Profile Page</h1>
      
      <div style={{ margin: '20px 0', padding: '20px', borderRadius: '10px', border: '1px solid #ccc' }}>
        <h2 className='text-lg font-black'>Bitcoin Key</h2>
        <p style={{ wordBreak: 'break-all' }}>{payPrivKey}</p>
        <p style={{ wordBreak: 'break-all' }}>{payAddress}</p>
        <button  style={buttonStyle} onClick={generateNewPayKey}>Generate Random</button>
        <br></br>
        <input 
          type="text" 
          value={customPayKey} 
          onChange={e => setCustomPayKeyInput(e.target.value)} 
          placeholder="Enter Your Own Key" 
          style={{ padding: '10px', marginRight: '20px' }}
        />
        <button  style={buttonStyle} onClick={handleSetCustomPayKey}>Set Custom</button>
      </div>
      
      <div style={{ margin: '20px 0', padding: '20px', borderRadius: '10px', border: '1px solid #ccc' }}>
        <h2 className='text-lg font-black'>Ordinals Key</h2>
        <p style={{ wordBreak: 'break-all' }}>{objPrivKey}</p>
        <p style={{ wordBreak: 'break-all' }}>{objAddress}</p>
        <button  style={buttonStyle} onClick={generateNewObjKey}>Generate Random</button>
        <br></br>
        <input 
          type="text" 
          value={customObjKey} 
          onChange={e => setCustomObjKeyInput(e.target.value)} 
          placeholder="Enter Your Own Key" 
          style={{ padding: '10px', marginRight: '20px' }}
        />
        <button  style={buttonStyle} onClick={handleSetCustomObjKey}>Set Custom</button>
      </div>
      <button style={buttonStyle} onClick={downloadKeys}>Download Keys</button>
    </div>
  );
}

export default ProfilePage;
