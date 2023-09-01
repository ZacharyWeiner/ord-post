// pages/article-details/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'markdown-to-jsx';
import Head from 'next/head';

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
    <main className={`p-6 flex min-h-screen flex-col items-center justify-between lg:p-24`}>
      {!article && 
        <div>Loading...</div>
      }
      { article && 
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">{article.title}</h1>
          <p><a href={article.link}>{article.link}</a></p>
          <p>By: {article.author}</p>
          <div>
            <pre>
              <ReactMarkdown>{article.body}</ReactMarkdown>
            </pre>
          </div>
          <p className='pt-4'><a target='_blank' noopen='true' noref='true' href={`https://www.whatsonchain.com/tx/${article.txid}`}>view tx: {article.txid}</a></p> 
        </div>
      }
    </main>
    </>
  );
}

export default ArticleDetails;