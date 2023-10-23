// pages/api/delete-comment.js
const admin = require('./../../utils/firebaseAdmin.js'); // Adjust the path as needed

export default async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Comment ID is required' });
  }

  try {
    // Delete the comment from the Firestore database
    await admin.firestore().collection('comments').doc(id).delete();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'An error occurred while deleting the comment' });
  }
};
