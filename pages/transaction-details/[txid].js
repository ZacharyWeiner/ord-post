// pages/transaction-details/[txid].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
const TransactionDetails = () => {
  const router = useRouter();
  const { txid } = router.query;
  const [details, setDetails] = useState(null);
  const [content, setContent] = useState(null);
  const [signedBy, setSignBy] = useState(null);

  useEffect(() => {
    if (txid) {
      fetch(`https://ordinals.gorillapool.io/api/files/inscriptions/${txid}`)
        .then((res) => res.text())  // Get the response as text
        .then((base64Data) => {
          console.log("Base64 Data:", base64Data);  // Debugging line
          setContent(base64Data);
        })
        .catch((error) => console.error('Error fetching transaction details:', error));
    }
  }, [txid]);

  useEffect(() => {
    if (txid) {
      fetch(`https://ordinals.gorillapool.io/api/inscriptions/txid/${txid}`)
        .then((res) => {console.log("Response from txid enpoint", res); return res.json()})
        .then((data) => {
          if(data[0].SIGMA[0]){
            console.log(data[0].SIGMA[0])
            setSignBy(data[0].SIGMA[0].address)
          }
          console.log("Details Data", data[0].MAP); 
          if(data && data[0] && data[0].MAP){
            setDetails(data[0].MAP)
          }
        })
        .catch((error) => console.error('Error fetching transaction details:', error));
    }
  }, [txid]);

  return (
    // Wrap the existing container in a flexbox layout
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto p-6 overflow-y-scroll">
        {(!details && !content) &&
          <div>Loading...</div>
        }
        { content && 
          <div className='shadow-xl hover:shadow-md transition-shadow p-6 rounded'>
            {details && details['title'] && 
              <h1 className="text-4xl font-bold p-2 title">{details['title']}</h1>
            }
            <p><a href={''}>{''}</a></p>
            
            <div className='py-2'>
              <pre>
                <ReactMarkdown>{content}</ReactMarkdown>
              </pre>
            </div>
            <p className='title text-sm'>By: {signedBy}</p>
            <p><a target="_blank" href={`https://www.whatsonchain.com/tx/${txid.split('_')[0]}`}>View on chain</a></p> 
          </div>
        }
      </div>
    </div>
  );
};

export default TransactionDetails;
