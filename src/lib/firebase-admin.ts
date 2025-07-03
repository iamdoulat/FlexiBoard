import admin from 'firebase-admin';

if (!admin.apps.length) {
  // When running in a Google Cloud environment like Firebase App Hosting,
  // the Admin SDK is automatically authenticated.
  admin.initializeApp();
}

const db = admin.firestore();

export { db };
