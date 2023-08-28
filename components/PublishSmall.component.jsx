// pages/index.js
import { useState } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import BalanceControl from './Balance.component';

export default function PublishSmall() {
  const [formData, setFormData] = useState({ title: '', link: '', author: '', body: '', receiverAddress: ''}); //, signerKey: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("publishing");
    // Post the data to the /api/publish endpoint
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.status === 200) {
      // Redirect to the article details page
      window.location.href = `/article-details/${data.id}`;
    } else {
      // Show an error message
      setError(data.error);
    }
  };

  return (
    <div className="">
    
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-300 p-4 rounded-xl shadow-md w-full mx-auto">
       <div className='md:space-x-4 text-gray-700'> 
         
            <div className="flex flex-col flex-grow">
                <label htmlFor="body" className="text-lg font-semibold text-gray-700 flex-grow">Body (1000 characters max):</label>
                <textarea rows={10} name="body" maxLength="1000" required onChange={handleChange} className="h-full p-2 border border-gray-300 rounded-md h-32 focus:border-black focus:ring-0"></textarea>
            </div>
        
        
            <div className="flex flex-col">
                <label htmlFor="receiverAddress" className="text-sm font-semibold text-gray-700">Reciever 1sat Address: (if you want to own this)</label>
                <input type="text" name="receiverAddress"  onChange={handleChange} className="p-2 border border-gray-300 rounded-md focus:border-black focus:ring-0" />
            </div>
            
            <div className="flex flex-col">
                <label htmlFor="signerKey" className="text-sm font-semibold text-gray-700">Signer Key: (optional)</label>
                <input type="text" name="signerKey"  onChange={handleChange} className="p-2 border border-gray-300 rounded-md focus:border-black focus:ring-0" />
            </div>
            
            </div>
        
        
        <button type="submit" className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition duration-200 ease-in-out">Publish</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
}