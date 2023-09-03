// pages/article-details/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const router = useRouter();
  const { id } = router.query; // Get the article ID from the URL query

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        const res = await fetch(`/api/article?id=${id}`);

        if (res.ok) {
          const articleData = await res.json();
          setArticle(articleData);
        } else {
          console.error('Error fetching article');
        }
      };

      fetchArticle();
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Ord Post</title>
        <meta property="twitter:card" content="https://pbs.twimg.com/profile_images/1693010455025840128/sYW3qBAt_400x400.jpg" />
        <meta property="twitter:description" content="News on Bitcoin - Satoshi Vision"></meta>
      </Head>

      {/* Wrap the existing container in a flexbox layout */}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow mx-auto p-6 overflow-y-scroll">
          {!article && 
            <div>Loading...</div>
          }
          {article && 
            <div key={article.id} className="border p-4 rounded-md shadow-xl hover:shadow-md transition-shadow">
              <Link href={`/articles/${article.id}`}>
                <h2 className="text-2xl font-semibold mb-2 title">
                  {article.title}
                </h2>
              </Link>
              <a href={article.link} className="text-blue-600 hover:underline mb-2 block">
                {article.link}
              </a>
              <p className="text-gray-800 ">
                {article.body}
              </p>
              <p className="text-gray-600 mb-2 title text-sm">
                Author: <span className="">{article.author}</span>
              </p>
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default ArticleDetails;
