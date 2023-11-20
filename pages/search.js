import Link from 'next/link';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 100;
  const router = useRouter();


  // useEffect(() => {
  //   // Check if the query parameter 'term' is available
  //   if (router.query.query) {
  //     setQuery(router.query.query);
  //     handleSearch();
  //     // Optionally, trigger the search automatically based on the query parameter
  //     // handleSearch(router.query.term);
  //   }
  // }, [router.query.term]);


  const handleSearch = async () => {
    //const searchTerm = query; // replace with your dynamic search term
    const queryParams = {
        "insc": {
          "words": [
            `${query}`
          ]
        }
      // 'map': {
      //   "type": "post"
      // }
    }
  const stringified = JSON.stringify(queryParams)
  const base64 = Buffer.from(stringified).toString("base64");
  

  const url = `https://v3.ordinals.gorillapool.io/api/inscriptions/search?q=${base64}&sort=asc`;
  console.log(url)
  const res = await fetch(url, {
      method: 'GET'
    });

    const data = await res.json();
    console.log(JSON.stringify(data));
    const resultDetails = await Promise.all(data.map(async (item) => {
        const response = await fetch(`https://v3.ordinals.gorillapool.io/content/${item.outpoint}`);
        let details = {title: '', body: await response.text()};
        try{
          if(JSON.parse(details.body)){
            console.log("can parse body", JSON.parse(details.body))
            let bodyJson = JSON.parse(details.body);
            console.log({bodyJson});
            let details = {title: bodyJson.title, body: bodyJson.content}
          }
        }catch(err){console.log("Not JSON")}
        return {
            details,
            outpoint: item.outpoint
        };
    }));
    
      setResults(resultDetails);
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Search Posts</h1>
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border p-2 rounded-md w-full text-gray-700"
        />
        <button onClick={handleSearch} className="bg-black text-white px-4 py-2 rounded mt-2">Search</button>
      </div>
      {/* Display results */}
      <div className="grid grid-cols-1 gap-4" style={{ wordWrap: 'break-word' }}>
        {results.map((result, index) => (
        <div key={index} className="break-word border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow" style={{ wordWrap: 'break-word' }}>
            <h2 className="text-2xl font-semibold mb-2">
            {result.details.title}
            </h2>
            <h4> {result.details.author}</h4>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}><ReactMarkdown>{result.details.body}</ReactMarkdown></pre>
            <div> <Link href={`/transaction-details/${result.outpoint}`} > View Post </Link></div>
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
