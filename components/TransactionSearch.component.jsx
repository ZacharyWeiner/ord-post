// components/TransactionSearchComponent.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const TransactionSearchComponent = () => {
  const [txid, setTxid] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    setTxid(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/transaction-details/${txid}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <label htmlFor="txid">TXID:</label>
      <input type="text" name="txid" className="p-2 border border-gray-300 rounded-md focus:border-black focus:ring-0" value={txid} onChange={handleInputChange} required />
      <button type="submit" className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition duration-200 ease-in-out">Search</button>
    </form>
  );
};

export default TransactionSearchComponent;