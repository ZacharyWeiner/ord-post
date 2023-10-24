import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'markdown-to-jsx';

const CommentList = ({ txid }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);

  // useEffect(() => {
  //   if (txid) {
  //     const fetchComments = async () => {
  //       console.log("Fetching Comments")
  //       try {
  //         // const res = await fetch('https://v3.ordinals.gorillapool.io/api/inscriptions/search', {
  //         //   method: 'POST',
  //         //   headers: {
  //         //     'Content-Type': 'application/json',
  //         //   },
  //         //   body: JSON.stringify({
  //         //       map:{
  //         //         type: 'comment',
  //         //         context: 'tx',
  //         //         tx: txid,
  //         //       }
  //         //   }),
  //         // });

  //         // console.log("Comments API reponse:", res)
  //         // if (res.ok) {
  //         //   let response = await res.json();
  //         //   console.log(response);
  //         //   const commentMetadata = response;

  //         //   // Fetch content for each comment
  //         //   const commentPromises = commentMetadata.map(async (comment) => {
  //         //     const contentRes = await fetch(`https://v3.ordinals.gorillapool.io/content/${comment.txid}_0`);
  //         //     const content = await contentRes.text();
  //         //     return { ...comment, content };
  //         //   });

  //         //   const fullComments = await Promise.all(commentPromises);
  //         //   setComments(fullComments);
  //         // } else {
  //         //   console.error('Error fetching comment metadata');
  //         // }
  //         // Fetch comments from your own API
  //         const res = await fetch(`/api/comments?txid=${txid}`);
  //         console.log("Comments API response:", res);
          
  //         if (res.ok) {
  //           const fetchedComments = await res.json();
  //           console.log(fetchedComments);

  //           // Directly update the comments state
  //           setComments(fetchedComments);
  //         } else {
  //           console.error('Error fetching comment metadata');
  //         }
  //       } catch (error) {
  //         console.error('Error fetching comments:', error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchComments();
  //   }
  // }, [txid]);

  useEffect(() => {
    if (txid) {
      fetchComments();
    }
  }, [txid]);

  const fetchComments = async (afterId) => {
    console.log("Fetching Comments");
    try {
      const res = await fetch(`/api/comments?txid=${txid}${afterId ? `&lastVisible=${afterId}` : ''}`);
      console.log("Comments API response:", res);

      const fetchedComments = await res.json();

      // Check if the response contains an error key
      if (fetchedComments.error) {
        console.error('Error from the server:', fetchedComments.error);
        return;  // Don't proceed further
      }

      if (fetchedComments.length > 0) {
        setLastVisible(fetchedComments[fetchedComments.length - 1].id);
        setComments(prevComments => {
          const newComments = fetchedComments.filter(fetchedComment => 
            !prevComments.some(prevComment => prevComment.id === fetchedComment.id)
          );
          return [...prevComments, ...newComments];
        });
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
};


  const loadMoreComments = () => {
    if (lastVisible) {
      fetchComments(lastVisible);
    }
  };


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
              </div>
            ))
          ) : (
            <div>No comments available.</div>
          )}
        </>
      )}
     {comments.length > 99 ? ( <button onClick={loadMoreComments}>Load More</button>) : (<></>)}
    </div>
  );
};

export default CommentList;

{ /* comment && comment.data && comment.data.sigma[0] && <Link href={`/author/${comment.data.sigma[0].address}`}> 
                    <p className="m-4 text-sm">Signed By: 
                        {comment.data.sigma[0].address} 
                    </p>
                </Link> }
                {comment && comment.author && <Link href={`/author/${comment.author}`}> 
                    <p className="m-4 text-sm">Signed By: 
                        {comment.author} 
                    </p>
                </Link> }
                {comment && comment.txid && <Link href={`https://www.whatsonchain.com/tx/${comment.txid}`}> 
                    <p className="m-4 text-sm">On-Chain: 
                        {comment.txid} 
                    </p>
</Link> */}