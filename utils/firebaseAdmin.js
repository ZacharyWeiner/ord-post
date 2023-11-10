// lib/firebaseAdmin.js
const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      privateKeyId: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      clientId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
      authUri: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
      tokenUri: process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_CERT_URL,
      clientX509CertUrl: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_CERT_URL,
      universe_domain: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_UNIVERSE_DOMAIN
    }),
  });
}
const db = admin.firestore();
module.exports = {db, admin};