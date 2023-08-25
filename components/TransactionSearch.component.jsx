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
      <label htmlFor="txid">Transaction ID:</label>
      <input type="text" name="txid" value={txid} onChange={handleInputChange} required />
      <button type="submit">Search</button>
    </form>
  );
};

export default TransactionSearchComponent;