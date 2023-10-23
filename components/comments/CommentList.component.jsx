import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'markdown-to-jsx';

const CommentList = ({ txid }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (txid) {
      const fetchComments = async () => {
        console.log("Fetching Comments")
        try {
          // const res = await fetch('https://v3.ordinals.gorillapool.io/api/inscriptions/search', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //       map:{
          //         type: 'comment',
          //         context: 'tx',
          //         tx: txid,
          //       }
          //   }),
          // });

          // console.log("Comments API reponse:", res)
          // if (res.ok) {
          //   let response = await res.json();
          //   console.log(response);
          //   const commentMetadata = response;

          //   // Fetch content for each comment
          //   const commentPromises = commentMetadata.map(async (comment) => {
          //     const contentRes = await fetch(`https://v3.ordinals.gorillapool.io/content/${comment.txid}_0`);
          //     const content = await contentRes.text();
          //     return { ...comment, content };
          //   });

          //   const fullComments = await Promise.all(commentPromises);
          //   setComments(fullComments);
          // } else {
          //   console.error('Error fetching comment metadata');
          // }
          // Fetch comments from your own API
          const res = await fetch(`/api/comments?txid=${txid}`);
          console.log("Comments API response:", res);
          
          if (res.ok) {
            const fetchedComments = await res.json();
            console.log(fetchedComments);

            // Directly update the comments state
            setComments(fetchedComments);
          } else {
            console.error('Error fetching comment metadata');
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchComments();
    }
  }, [txid]);

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div>Loading comments...</div>
      ) : (
        <>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="border p-4 rounded-md shadow-xl hover:shadow-md transition-shadow overflow-auto" style={{ wordWrap: 'break-word' }}>
                <div className="py-2">
                  <pre style={{ whiteSpace: 'pre-wrap' }}>
                    <ReactMarkdown>{comment.content}</ReactMarkdown>
                  </pre>
                </div>
                {comment && comment.data && comment.data.sigma[0] && <Link href={`/author/${comment.data.sigma[0].address}`}> 
                    <p className="m-4 text-sm">Signed By: 
                        {comment.data.sigma[0].address} 
                    </p>
                </Link> }
                {comment && comment.author && <Link href={`/author/${comment.author}`}> 
                    <p className="m-4 text-sm">Signed By: 
                        {comment.author} 
                    </p>
                </Link> }
               
              </div>
            ))
          ) : (
            <div>No comments available.</div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentList;
