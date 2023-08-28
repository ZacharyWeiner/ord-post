// pages/transaction-details/[txid].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
const TransactionDetails = () => {
  const router = useRouter();
  const { txid } = router.query;
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (txid) {
      fetch(`https://ordinals.gorillapool.io/api/files/inscriptions/${txid}`)
        .then((res) => res.json())
        .then((data) => setDetails(data))
        .catch((error) => console.error('Error fetching transaction details:', error));
    }
  }, [txid]);

  return (
    <main className={`p-6 flex min-h-screen flex-col items-center justify-between lg:p-24`}>
      {!details && 
        <div>Loading...</div>
      }
      { details && 
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">{details.title}</h1>
          <p><a href={details.url}>{details.url}</a></p>
          <p>By: {details.author}</p>
          <div>
            <pre>
            <ReactMarkdown>{details.body ? details.body : ""}</ReactMarkdown>
            </pre>
          </div>
          <p><a target="_blank" href={`https://www.whatsonchain.com/tx/${txid.split('_')[0]}`}>View on chain</a></p> 
        </div>
      }
    </main>
  );
};

export default TransactionDetails;
