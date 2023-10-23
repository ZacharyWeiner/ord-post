const admin = require('./../../utils/firebaseAdmin'); // Adjust the path as needed

export default async (req, res) => {
    try {
      const txid = req.query.txid;
  
      if (!txid) {
        return res.status(400).json({ error: 'txid is required' });
      }
  
      const commentsQuery = admin.firestore().collection('comments').where('context', '==', txid);
      const commentsSnapshot = await commentsQuery.get();

  
      const comments = [];
      commentsSnapshot.forEach(doc => {
        comments.push(doc.data());
      });
  
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  };
  