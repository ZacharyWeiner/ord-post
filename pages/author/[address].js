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
            const res = await fetch(`https://ordinals.gorillapool.io/api/inscriptions/sigma/${address}?page=${page}&limit=100`);
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
}, [address, page]);


  return (
    <div className="container mx-auto p-6 overflow-y-scroll max-h-screen">
      <h1 className="title text-4xl font-bold mb-4">Transactions for {address}</h1>
      <div className="grid grid-cols-1 gap-4">
          {transactions.map((tx, index) => (
              <div key={index} className="border p-4 rounded-md shadow-xl hover:shadow-md transition-shadow">
              <Link href={`/transaction-details/${tx.txid}_0`}>
                  <h2 className="text-2xl font-semibold mb-2 title">
                      {tx.MAP ? tx.MAP.title : 'No Title'}
                  </h2>
                  <ReactMarkdown>{tx.content? tx.content : ""}</ReactMarkdown>
                  <p className="mb-2 text-sm">
                      author: <span className="">{tx.SIGMA ? tx.SIGMA[0].address : 'Unknown'}</span>
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
