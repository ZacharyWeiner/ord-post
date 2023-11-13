import {admin, db} from '../../utils/firebaseAdmin';

export default async function handler(req, res) {
  try {
    console.log("Hit API")
    const targetBlockHeight = req.query.blockHeight - 144;
    const locksPerBlock = {};

    const querySnapshot = await db.collection('contentLocks')
                                  .where('lockedInBlock', ">", targetBlockHeight)
                                  .get();

    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let blockHeight = data.lockedInBlock;
      locksPerBlock[blockHeight] = (locksPerBlock[blockHeight] || 0) + 1;
    });

    res.status(200).json({
      labels: Object.keys(locksPerBlock),
      data: Object.values(locksPerBlock)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
