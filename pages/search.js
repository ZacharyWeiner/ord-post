import Link from 'next/link';
import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 100;

  const handleSearch = async () => {
    const searchTerm = query; // replace with your dynamic search term
    const res = await fetch("https://ordinals.gorillapool.io/api/inscriptions/search/map?limit=100&offset=0", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
        body: JSON.stringify({
            query: {
                author: searchTerm
            }
        })
    });
    const data = await res.json();
    console.log(data);
    const resultDetails = await Promise.all(data.map(async (item) => {
        const response = await fetch(`https://ordinals.gorillapool.io/api/files/inscriptions/${item.outpoint}`);
        let details = await response.json();
        return {
            details,
            outpoint: item.outpoint
        };
    }));
    
      setResults(resultDetails);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Search Inscriptions By Author</h1>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border p-2 rounded-md w-full text-gray-700"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Search</button>
      </div>
      {/* Display results */}
      <div className="grid grid-cols-1 gap-4">
        {results.map((result, index) => (
        <div key={index} className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">
            {result.details.title}
            </h2>
            <h4> {result.details.author}</h4>
            <p className="text-gray-300 overflow-ellipsis overflow-hidden h-20">
                {result.details.body.substring(0, 100)}
            </p>
            <Link href={`/transaction-details/${result.outpoint}`} > View Post </Link>
        </div>
        ))}
    </div>
      <div className="mt-6 flex justify-between">
        {page > 0 && (
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
}
