const admin = require('./../../utils/firebaseAdmin.js'); // Adjust the path as needed

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  // Parse the page and limit from the request
  const { page = '0', limit = '10' } = req.query;
  console.log({page}, {limit})
  // Convert the page and limit to numbers
  const parsedPage = parseInt(page, 10);
  let parsedLimit = parseInt(limit, 10);

  // Validate the parsed values
  if (isNaN(parsedPage) || isNaN(parsedLimit)) {
    return res.status(400).json({ error: 'Invalid page or limit value' });
  }

  // Define articlesRef at this level so it can be accessed throughout the function
  const articlesRef = admin.firestore().collection('articles');

  // Start building the query
  let query = articlesRef.orderBy('publishedAt', 'desc').limit(parsedLimit);

  // If it's not the first page, use the lastDoc to paginate
  if (parsedPage !== 0 && req.query.lastDoc) {
    const lastDoc = await articlesRef.doc(req.query.lastDoc).get();
    if (lastDoc.exists) {
      query = query.startAfter(lastDoc);
    }
  }

  try {
    const snapshot = await query.get();

    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(articles);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching paginated articles' });
  }
};
