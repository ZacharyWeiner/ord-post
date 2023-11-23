import React, { useState } from 'react';
import DynamicFileRenderer from '../DynamicFileRenderer';
import Link from 'next/link';
const SearchComponent = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const resultsPerPage = 100;

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const fetchSearchResults = async (page) => {
    setIsLoading(true);
    const offset = (page - 1) * resultsPerPage;
    const url = `https://v3.ordinals.gorillapool.io/api/inscriptions/search?sort=ASC&limit=${resultsPerPage}&offset=${offset}`;
    
    const requestBody = {
      insc: { text: searchInput }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log({data})
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSearchResults(1);
  };

  const handleNext = () => {
    setSearchResults([])
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSearchResults(nextPage);
  };

  const handlePrevious = () => {
    setSearchResults([])
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchSearchResults(prevPage);
    }
  };

  return (
    <div>
        <div class="mt-2 px-6 py-4 my-4 bg-white rounded-lg shadow w-full">
        <div class=" inline-flex items-center justify-between w-full">
        <div class="inline-flex items-center">
            <img src="https://cdn-icons-png.flaticon.com/128/763/763812.png" alt="Training Icon" class="w-6 h-6 mr-3" />
            <h3 class="font-bold text-base text-gray-800">Searching for Blockmaps</h3>
        </div>
        <p class="text-xs text-gray-500">
            Notification
        </p>
        </div>
        <p class="mt-1 text-sm">
        Search Here for Blockmaps, Bitmaps, or BSVMaps
        </p>
        <p class="pt-2 text-sm">
            <Link className='' href="/search"> Click Here To Search by Words </Link> 
        </p>
    </div>
      <input type="text" value={searchInput} onChange={handleSearchChange} />
      <button className='focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900' onClick={handleSearch}>Search</button>
      {isLoading && <div>Loading...</div>}
      <div>
        {!isLoading && (!searchResults || searchResults.length === 0) && <div>No results</div>}
        {searchResults.map((item, index) => (
          <div key={index} className='bg-gray-400 rounded-xl p-2 m-2'>
            <DynamicFileRenderer txid={item.origin.outpoint} url={`https://v3.ordinals.gorillapool.io/content/${item.origin.outpoint}`}></DynamicFileRenderer>
          </div>
        ))}
      </div>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          <button onClick={handlePrevious}>Previous</button>
          <button onClick={handleNext}>Next</button>
        </>
      )}
    </div>
  );
};

export default SearchComponent;
