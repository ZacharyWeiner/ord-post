// pages/transaction-details/[txid].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'markdown-to-jsx';
import OrbinalEncoder from '@/components/orbinals/forTxid';

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
        .then((res) => res.json())
        .then((data) => {
          if(data[0].SIGMA[0]){
            setSignBy(data[0].SIGMA[0].address);
          }
          if(data && data[0] && data[0].MAP){
            setDetails(data[0].MAP);
          }
        })
        .catch((error) => console.error('Error fetching transaction details:', error));
    }
  }, [txid]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow mx-auto p-6 overflow-y-scroll" style={{ maxWidth: '100%' }}>
        {(!details && !content) &&
          <div>Loading...</div>
        }
        {content && 
          <div key={txid} className="border p-4 rounded-md shadow-xl hover:shadow-md transition-shadow overflow-auto" style={{ wordWrap: 'break-word' }}>
            {details && details['title'] && 
              <h1 className="text-4xl font-bold p-2 title">{details['title']}</h1>
            }
            <div className="py-2">
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </pre>
            </div>
            <p className="m-4 text-sm">
              Signed By: <Link href={`/author/${signedBy}`}><span className="underline">{signedBy}</span></Link>
            </p>
            <p><a target="_blank" href={`https://www.whatsonchain.com/tx/${txid.split('_')[0]}`}>View on chain</a></p>
          </div>
        }
        <div>
          {txid && 
            <div className="flex">
              <div className="mx-auto"> 
                <OrbinalEncoder initialTxid={txid.split('_')[0] }/>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
