// pages/index.js
import { useState } from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import BalanceControl from './Balance.component';

export default function PublishControl() {
  const [formData, setFormData] = useState({ title: '', link: '', author: '', body: '', receiverAddress: '', signerKey: '' });
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
    <div className='w-full flex items-justify-center p-2'> <div className="mx-auto flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"> <BalanceControl /> </div></div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md w-full mx-auto">
       <div className='md:flex md:space-x-4'> 
        <div className='w-full space-y-4'> 
          <div className="flex flex-col">
            <label htmlFor="title" className="text-lg font-semibold text-gray-700">Title:</label>
            <input type="text" name="title" required onChange={handleChange} className="p-2 border border-gray-300 rounded-md focus:border-black focus:ring-0" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="link" className="text-lg font-semibold text-gray-700">Link: (optional)</label>
            <input type="url" name="link" onChange={handleChange} className="p-2 border border-gray-300 rounded-md focus:border-black focus:ring-0" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="author" className="text-lg font-semibold text-gray-700">Author Name:</label>
            <input type="text" name="author" required onChange={handleChange} className="p-2 border border-gray-300 rounded-md focus:border-black focus:ring-0" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="receiverAddress" className="text-lg font-semibold text-gray-700">Reciever 1sat Address: (if you want to own this)</label>
            <input type="text" name="receiverAddress"  onChange={handleChange} className="p-2 border border-gray-300 rounded-md focus:border-black focus:ring-0" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="signerKey" className="text-lg font-semibold text-gray-700">Signer Key: (optional)</label>
            <input type="text" name="signerKey"  onChange={handleChange} className="p-2 border border-gray-300 rounded-md focus:border-black focus:ring-0" />
          </div>
        </div>
        <div className='w-full flex'> 
          <div className="flex flex-col flex-grow">
            <label htmlFor="body" className="text-lg font-semibold text-gray-700 flex-grow">Body (1000 characters max):</label>
            <textarea rows={10} name="body" maxLength="1000" required onChange={handleChange} className="h-full p-2 border border-gray-300 rounded-md h-32 focus:border-black focus:ring-0"></textarea>
          </div>
        </div>
       </div>
        
       
        <button type="submit" className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition duration-200 ease-in-out">Publish</button>
        {error && <div className="text-red-500">{error}</div>}
        
      </form>
     
      <div className='w-full flex items-justify-center'> 
        <div className='mx-auto border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30'> 
          <h1 className='text-2xl'> Preview</h1>
          {!formData['title'] && "No Title"}
          {
            <div className="container mx-auto">
              <h1 className="text-3xl font-bold">{formData['title']}</h1>
              <p><a href={formData['link']}>{formData['link']}</a></p>
              <p>By: {formData['author']}</p>
              <div>
                <pre>
                  <ReactMarkdown>{formData['body']}</ReactMarkdown>
                </pre>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
}