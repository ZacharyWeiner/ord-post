import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'markdown-to-jsx';

const RecentArticlesControl = () => {
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    const fetchRecentArticles = async () => {
        const res = await fetch('/api/recent-articles');
        console.log('Response status:', res.status);
        const text = await res.text();
        console.log('Response text:', text);
        if (res.ok) {
          const articles = JSON.parse(text);
          setRecentArticles(articles);
        } else {
          console.error('Error fetching recent articles:', text);
        }
      };

    fetchRecentArticles();
  }, []);

  // Make sure to return the JSX
  return (
    <div className='w-full'>
      <div className='w-full flex items-justify-center'>
        <h2 className="text-2xl font-bold mx-auto title">Recent Posts</h2>
      </div>
      <div className='w-full items-justify-center overflow-y-scroll'>

          {recentArticles.map((article) => (
            <div key={article.id} className="border p-4 m-2 rounded-md shadow-xl hover:shadow-md transition-shadow overflow-auto" style={{ wordWrap: 'break-word' }}>
               <Link className='text-lg font-bold' href={`/articles/${article.id}`}>
                  {article.title && <div className='text-sm' >{article.title}</div> }
                  <div className='text-sm max-w-md' ><ReactMarkdown>{article.body? article.body : ""}</ReactMarkdown></div> 
                  <div className='text-xs'>By: {article.author}</div> 
               </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentArticlesControl;