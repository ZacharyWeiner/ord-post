// pages/api/article.js
const admin = require('./../../utils/firebaseAdmin'); // Adjust the path as needed

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { id } = req.query; // Get the article ID from the URL query

  try {
    const docRef = admin.firestore().collection('articles').doc(id);
    const doc = await docRef.get();

    if (doc.exists) {
      const article = { id: doc.id, ...doc.data() };
      return res.status(200).json(article);
    } else {
      return res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching the article' });
  }
};