
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'reseller';
  createdAt: Date;
}
