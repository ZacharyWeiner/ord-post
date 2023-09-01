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
    <main className={`p-6 flex min-h-screen flex-col items-center justify-between lg:p-24`}>
      {(!details && !content) &&
        <div>Loading...</div>
      }
      { content && 
        <div className="container mx-auto">
          {details && details['title'] && 
            <h1 className="text-4xl font-bold">{details['title']}</h1>
          }
          <p><a href={''}>{''}</a></p>
          <p>By: {signedBy}</p>
          <div>
            <pre>
            <ReactMarkdown>{content}</ReactMarkdown>
            </pre>
          </div>
          <p><a target="_blank" href={`https://www.whatsonchain.com/tx/${txid.split('_')[0]}`}>View on chain</a></p> 
        </div>
      }
    </main>
  );
};

export default TransactionDetails;
