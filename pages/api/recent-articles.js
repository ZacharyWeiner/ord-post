// pages/api/recentArticles.js
const admin = require('./../../utils/firebaseAdmin.js'); // Adjust the path as needed

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const articlesRef = admin.firestore().collection('articles');
    const snapshot = await articlesRef.orderBy('publishedAt', 'desc').limit(5).get();

    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching recent articles' });
  }
};
