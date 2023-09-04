// pages/article-details/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'markdown-to-jsx';
import OrbitalEncoder from '@/components/orbinals/forTxid'; // Update import as per your project structure

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const router = useRouter();
  const { id } = router.query;

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

      <div className="flex flex-col min-h-screen">
        <div className="flex-grow mx-auto p-6 overflow-y-scroll" style={{ maxWidth: '100%' }}>
          {!article && 
            <div>Loading...</div>
          }
          {article && 
            <div key={article.id} className="border p-4 rounded-md shadow-xl hover:shadow-md transition-shadow overflow-auto" style={{ wordWrap: 'break-word' }}>
              <Link href={`/articles/${article.id}`}>
                <h2 className="text-2xl font-semibold mb-2 title">
                  {article.title}
                </h2>
              </Link>
              <a href={article.link} className="text-blue-600 hover:underline mb-2 block transition-colors">
                {article.link}
              </a>
              <div className="transition-colors">
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  <ReactMarkdown>{article.body}</ReactMarkdown>
                </pre>
              </div>
              <p className="transition-colors m-4 text-sm">
                author: <Link href={`/author/${article.author}`}><span className="underline">{article.author}</span> </Link>
              </p>
              <p className='m-2 text-right'><a target="_blank" href={`https://www.whatsonchain.com/tx/${article.txid.split('_')[0]}`}>View on chain</a></p> 
            </div>
          }
          <div>
            {article && 
              <div className='flex'>
                <div className='mx-auto'> 
                  <OrbitalEncoder initialTxid={article.txid.split('_')[0] }/>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetails;
