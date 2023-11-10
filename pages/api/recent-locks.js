// pages/api/recent-locks.js
import { db } from './../../utils/firebaseAdmin'; // Adjust the import path as necessary

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection('locks')
      .orderBy('timestamp', 'desc') // Replace 'timestamp' with your actual field name for the timestamp
      .limit(10) // Adjust the number to however many recent entries you want
      .get();

    const recentLocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(recentLocks);
  } catch (error) {
    console.error('Error getting recent locks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}