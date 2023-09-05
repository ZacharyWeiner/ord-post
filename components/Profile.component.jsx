import { useState, useEffect } from 'react';
import { usePrivateKeys } from '@/hooks/usePrivateKeys';
import Link from 'next/link';
import ReactMarkdown from 'markdown-to-jsx';
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
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

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
    a.download = "ordpost-keys.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    if (objAddress) {
        const fetchTransactions = async () => {
            const res = await fetch(`https://ordinals.gorillapool.io/api/inscriptions/sigma/${objAddress}?page=${page}&limit=100`);
            console.log(res)
            if (res.ok) {
                const data = await res.json();
                const transactionsWithContent = await Promise.all(
                    data.map(async (tx) => {
                        const contentRes = await fetch(`https://ordinals.gorillapool.io/api/files/inscriptions/${tx.txid}_0`);
                        const content = await contentRes.text();
                        return { ...tx, content };
                    })
                );
                setTransactions(transactionsWithContent);
            }
        };
        fetchTransactions();
    }
}, [objAddress, page]);
  return (
    <div className="p-5 font-sans">
      <h1 className="border-b-2 pb-2 mb-5">Profile Page</h1>
      
      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row">
        {/* Left column */}
        <div className="md:w-1/2 md:pr-5 mb-5 md:mb-0">
          {/* Bitcoin Key Section */}
          <div className="border rounded p-5 mb-5">
            <h2 className='text-lg font-black'>Bitcoin Key</h2>
            <p className='text-xs' style={{ wordBreak: 'break-all' }}>{payPrivKey}</p>
            <p className='text-xs' style={{ wordBreak: 'break-all' }}>{payAddress}</p>
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
          
          {/* Ordinals Key Section */}
          <div className="border rounded p-5 mb-5">
            <h2 className='text-lg font-black'>Ordinals Key</h2>
            <p className='text-xs' style={{ wordBreak: 'break-all' }}>{objPrivKey}</p>
            <p className='text-xs' style={{ wordBreak: 'break-all' }}>{objAddress}</p>
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
          
          <button className="bg-black text-white px-4 py-2 rounded" onClick={downloadKeys}>Download Keys</button>
        </div>
        
        {/* Right column */}
        <div className="md:w-1/2 md:pl-5 flex flex-col">
          {/* Articles Panel */}
          <h3> My Posts</h3>
          <div className="flex-1 overflow-y-auto border rounded p-5">
            {transactions.map((tx, index) => (
              <div key={index} className="border p-4 rounded-md shadow-xl hover:shadow-md transition-shadow">
                <Link href={`/transaction-details/${tx.txid}_0`}>
                    <h2 className="text-2xl font-semibold mb-2 title">
                        {tx.MAP ? tx.MAP.title : 'No Title'}
                    </h2>
                    <ReactMarkdown>{tx.content? tx.content : ""}</ReactMarkdown>
                </Link>
                <p className="mb-2 text-sm">
                    author: <span className="">{tx.SIGMA ? tx.SIGMA[0].address : 'Unknown'}</span>
                </p>
                {tx.MAP.tx && 
                  <div> <Link href={`/transaction-details/${tx.MAP.tx}`}><p className='text-xs'> this is a comment. view OP here Post </p></Link></div>
                }
                
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-5 flex justify-between">
            {page > 1 && (
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Previous
              </button>
            )}
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}

export default ProfilePage;
