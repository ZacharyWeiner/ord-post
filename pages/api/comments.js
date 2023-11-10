const {admin} = require('./../../utils/firebaseAdmin');

export default async (req, res) => {
  try {
    const txid = req.query.txid;
    const lastVisible = req.query.lastVisible; // This will be the ID of the last visible comment
    const pageSize = 100; // Number of comments per page

    if (!txid) {
      return res.status(400).json({ error: 'txid is required' });
    }

    let commentsQuery = admin.firestore().collection('comments').where('context', '==', txid).orderBy('publishedAt').limit(pageSize);

    if (lastVisible) {
      const lastVisibleDoc = await admin.firestore().collection('comments').doc(lastVisible).get();
      commentsQuery = commentsQuery.startAfter(lastVisibleDoc);
    }

    const commentsSnapshot = await commentsQuery.get();

    const comments = [];
    commentsSnapshot.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() }); // Include the ID for pagination purposes
    });
    console.log(comments)

    return res.status(200).json(comments);
  } catch (error) {
    console.log("There was an error", error);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
