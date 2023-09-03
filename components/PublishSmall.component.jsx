// pages/index.js
import { useState } from 'react';
import { usePrivateKeys } from '@/hooks/usePrivateKeys';
import ReactMarkdown from 'markdown-to-jsx';
import BalanceControl from './Balance.component';
import Link from 'next/link';

export default function PublishSmall() {
  const {
    payPrivKey,
    payAddress,
    objPrivKey,
    objAddress,
    generateNewPayKey,
    generateNewObjKey,
    setCustomPayKey,
    setCustomObjKey
  } = usePrivateKeys();

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
    formData['signerKey'] = objPrivKey;
    formData['receiverAddress'] = objAddress;
    const res = await fetch('/api/publish-new', {
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
                <label htmlFor="body" className="text-sm font-semibold text-gray-700 flex-grow">Post (markdown):</label>
                <textarea rows={5} name="body" maxLength="1000" required onChange={handleChange} className="h-full p-2 border border-gray-300 rounded-md h-32 focus:border-black focus:ring-0"></textarea>
            </div>
            </div>
        
        
        <button type="submit" className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition duration-200 ease-in-out">Publish</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <Link href="/new" className='p-8' > include more details -&gt; </Link>
    </div>
  );
}