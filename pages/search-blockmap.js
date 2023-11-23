import Link from 'next/link';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';
import SearchBlockmapComponent from '@/components/search/blockmap';

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
      <h1 className="text-4xl font-bold mb-4">Search Blockmaps, BSVMaps, or Bitmaps</h1>
      <SearchBlockmapComponent />
    </div>
  );
}
