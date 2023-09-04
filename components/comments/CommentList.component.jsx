import { useEffect, useState } from 'react';
import ReactMarkdown from 'markdown-to-jsx';

const CommentList = ({ txid }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (txid) {
      const fetchComments = async () => {
        try {
          const res = await fetch('https://ordinals.gorillapool.io/api/inscriptions/search/map', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: {
                type: 'post',
                context: 'tx',
                tx: txid,
              },
            }),
          });

          if (res.ok) {
            const commentMetadata = await res.json();

            // Fetch content for each comment
            const commentPromises = commentMetadata.map(async (comment) => {
              const contentRes = await fetch(`https://ordinals.gorillapool.io/api/files/inscriptions/${comment.txid}_0`);
              const content = await contentRes.text();
              return { ...comment, content };
            });

            const fullComments = await Promise.all(commentPromises);
            setComments(fullComments);
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
                <p className="m-4 text-sm">Signed By: {comment.signedBy}</p>
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
