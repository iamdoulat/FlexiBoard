import type { Timestamp } from "firebase/firestore";

export type TransactionType = 'credit' | 'debit' | 'adjustment';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date | Timestamp;
  oldBalance: number;
  newBalance: number;
  description: string;
  performedBy: string;
}
