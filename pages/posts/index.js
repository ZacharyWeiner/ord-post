import Link from 'next/link';
import { useState, useEffect } from 'react';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch(`/api/articles?page=${page}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    };

    fetchArticles();
  }, [page]);

  return (
    <div className="container mx-auto p-6 overflow-y-scroll max-h-screen">
        <h1 className="title text-4xl font-bold mb-4 ">Posts</h1>
        <div className="grid grid-cols-1 gap-4">
            {articles.map((article) => (
                <div key={article.id} className="border p-4 rounded-md shadow-xl hover:shadow-md transition-shadow">
                <Link href={`/articles/${article.id}`}>
                    <h2 className="text-2xl font-semibold mb-2">
                        {article.title}
                    </h2>
                    
                    <a href={article.link} className="text-blue-600 hover:underline mb-2 block">
                        {article.link}
                    </a>
                    <p className="overflow-ellipsis overflow-hidden h-20">
                        {article.body}
                    </p>
                    <p className="mb-2 text-sm">
                        <Link href={`/blog/${article.author}`}><span className="">{article.author}</span> </Link>
                    </p>
                    </Link>
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-between">
            {page > 1 && (
                <button
                    onClick={() => setPage(page - 1)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                    Previous
                </button>
            )}
            <button
                onClick={() => setPage(page + 1)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
                Next
            </button>
        </div>
    </div>

  );
};

export default Articles;
