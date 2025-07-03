import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user' | 'reseller';
  createdAt: Timestamp | Date;
}
