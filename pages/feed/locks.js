// pages/index.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import ContentComponent from "./../../components/content/ContentComponent"

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [locks, setLocks] = useState([]);

  const axiosInstance = axios.create({
    // You can set base URLs, headers, timeout limits, etc.
  });
  function autoLink(content) {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return content.replace(urlRegex, function(url) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }
  const fetchRecentLocks = async () => {
    try {
      console.log("trying")
      const response = await axios.get('/api/recent-locks');
      console.log(response.data);
      setLocks(response.data);
    } catch (error) {
      console.error('Error fetching recent locks:', error);
    }
  };
  useEffect(() => {

    // Subscribe to the SSE endpoint
    const eventSource = new EventSource('/api/events');

    // Listen for the 'transaction' event
    eventSource.addEventListener('transaction', (event) => {
        // const data = JSON.parse(event.data);
        // console.log('New transaction:', data);
        // // Add the new transaction to the state
        // setTransactions(currentTransactions =>[data, ...currentTransactions]);
        fetchRecentLocks();
    });

    eventSource.onerror = (error) => {
      // Handle errors here
      console.error('EventSource failed:', error);
      eventSource.close();
    };
    console.log({transactions})
    if(transactions?.length === 0){
        console.log("hits fetch locks");
        fetchRecentLocks();
    }
    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
    <h1 className='text-lg mt-8'>Recent Locks</h1>
      <div>
        {transactions.length > 0 && transactions.map(tx => (
            <div key={tx.id} className="border p-4 m-2 rounded-md shadow-xl hover:shadow-md transition-shadow overflow-auto" style={{ wordWrap: 'break-word' }}>
                <div><span className='text-yellow-600'>{tx.author}</span> got a lock from <span className='text-blue-600'>{tx.locker}</span>  </div>    
                <div className=''><ContentComponent content={tx['postContent']}></ContentComponent></div>
            </div>
        ))}
        {transactions.length === 0 && locks.map(tx => (
            <div key={tx.id} className="border p-4 m-2 rounded-md shadow-xl hover:shadow-md transition-shadow overflow-auto" style={{ wordWrap: 'break-word' }}>
            <div className=''><ContentComponent content={tx['content']}></ContentComponent></div>
                    <div>  <span className='text-yellow-600'>{tx['posterHandle']}</span> got a lock from: <span className='text-blue-600'>{tx['lockerHandle']}</span> </div>
                </div>
            ))   
        }
      </div>
    </div>
  );
}

