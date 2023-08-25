// components/BalanceControl.js
import { useEffect, useState } from 'react';

const BalanceControl = ({ address, network }) => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
      // Fetch the balance from the external API
      const fetchBalance = async () => {
        const address = '15zjLK5UVaAJKAJE2WGCNZqG1wTQga2dbS'; // Replace with the desired address
        const network = 'main'; // Replace with the desired network (e.g., 'main')
        const url = `https://api.whatsonchain.com/v1/bsv/${network}/address/${address}/balance`;
  
        const res = await fetch(url);
        const data = await res.json();
  
        setBalance(data.confirmed + data.unconfirmed);
      };
  
      fetchBalance();
    }, []);
  
    return (
      <div className="container mx-auto">
        {/* ... other controls ... */}
        <div>
          <p className='font-black'>{balance ? `Balance: ${balance}` : 'Loading...'}</p>
          <h3> Donate to 15zjLK5UVaAJKAJE2WGCNZqG1wTQga2dbS</h3>
        </div>
      </div>
    );
  }

export default BalanceControl;