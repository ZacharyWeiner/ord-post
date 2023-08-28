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
    <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <div className="grid grid-cols-1 gap-4">
            {articles.map((article) => (
                <div key={article.id} className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-2xl font-semibold mb-2">
                        {article.title}
                    </h2>
                    <p className="text-gray-600 mb-2">
                        Author: <span className="font-medium">{article.author}</span>
                    </p>
                    <a href={article.link} className="text-blue-600 hover:underline mb-2 block">
                        {article.link}
                    </a>
                    <p className="text-gray-800 overflow-ellipsis overflow-hidden h-20">
                        {article.body}
                    </p>
                    <div> <Link href={`/article-details/${article.id}`}> View </Link> </div>
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
