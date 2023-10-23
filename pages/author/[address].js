import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import Link from 'next/link';

const AddressDetails = () => {
  const router = useRouter();
  const { address } = router.query;
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (address) {
        const fetchTransactions = async () => {
            const queryParams = {
                "sigma": [
                {
                    "address": address
                }
                ],
              };
            const stringified = JSON.stringify(queryParams)
            const base64 = Buffer.from(stringified).toString("base64");
            

            const url = `https://v3.ordinals.gorillapool.io/api/inscriptions/search?q=${base64}`;
            console.log(url)
            const res = await fetch(url, {
                method: 'GET'
              });
    
            console.log(res)
            if (res.ok) {
                const data = await res.json();
                console.log({data});
                const transactionsWithContent = await Promise.all(
                    data.map(async (tx) => {
                        const contentRes = await fetch(`https://v3.ordinals.gorillapool.io/content/${tx.txid}_0`);
                        const content = await contentRes.text();
                        return { ...tx, content };
                    })
                );
                setTransactions(transactionsWithContent);
            }
        };
        fetchTransactions();
    }
}, [address, page]);


  return (
    <div className="container mx-auto p-6 overflow-y-scroll max-h-screen">
      <h1 className="  font-bold mb-4"><span className='title text-4xl'>Posts from </span> {address}</h1>
      <div className="grid grid-cols-1 gap-4">
          {transactions.map((tx, index) => (
              <div key={index} className="border p-4 rounded-md shadow-xl hover:shadow-md transition-shadow">
              <Link href={`/transaction-details/${tx.txid}_0`}>
                  <h2 className="text-2xl font-semibold mb-2 title">
                      {tx.data.map ? tx.data.map.title : 'No Title'}
                  </h2>
                  <ReactMarkdown>{tx.content? tx.content : ""}</ReactMarkdown>
                  <p className="mb-2 text-sm">
                      author: <span className="">{tx.data.sigma ? tx.data.sigma[0].address : 'Unknown'}</span>
                  </p>
                  
                </Link>
              </div>
          ))}
      </div>
      <div className="mt-6 flex justify-between">
          {page > 1 && (
              <button
                  onClick={() => setPage(page - 1)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                  Previous
              </button>
          )}
          <button
              onClick={() => setPage(page + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
              Next
          </button>
      </div>
    </div>
  );
};

export default AddressDetails;
