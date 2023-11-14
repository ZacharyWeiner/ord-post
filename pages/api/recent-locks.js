import {admin, db} from '../../utils/firebaseAdmin';
export default async function handler(req, res) {
  try {
    const uniqueContentRefs = new Set();
    const hydratedLikes = [];
    const batchSize = 100;
    let lastDoc = null;

    while (hydratedLikes.length < 25) {
      let query = db.collection('likesCollection')
                    .orderBy('lockedInBlock', 'desc')
                    .limit(batchSize);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();
      if (snapshot.empty) break;

      for (const doc of snapshot.docs) {
        const like = doc.data();

        // Check if contentRef is a DocumentReference and not already processed
        if (like.contentRef instanceof admin.firestore.DocumentReference && !uniqueContentRefs.has(like.contentRef.path)) {
          const contentDoc = await like.contentRef.get();
          if (contentDoc.exists) {
            hydratedLikes.push({ likeId: doc.id, likeData: like, contentData: contentDoc.data() });
            uniqueContentRefs.add(like.contentRef.path);

            if (hydratedLikes.length === 25) break;
          }
        }
      }

      lastDoc = snapshot.docs[snapshot.docs.length - 1];
    }
    console.log(hydratedLikes);
    res.status(200).json(hydratedLikes);
  } catch (error) {
    console.error('Error getting unique likes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

