
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  // When running in a Google Cloud environment like Firebase App Hosting,
  // the Admin SDK is automatically authenticated.
  admin.initializeApp();
}

const db = getFirestore();

export { db };
