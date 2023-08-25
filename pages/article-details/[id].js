// pages/article-details/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'markdown-to-jsx';

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
    
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
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
          <p>{article.txid}</p> 
        </div>
      }
    </main>
  );
}

export default ArticleDetails;