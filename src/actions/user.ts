'use server';

import { db } from '@/lib/firebase-admin';
import type { UserProfile } from '@/types/user';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

export const updateUserRole = async (uid: string, role: UserProfile['role']) => {
  if (!uid || !role) {
    throw new Error('User ID and role are required.');
  }

  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.update({ role });
    
    revalidatePath('/dashboard/settings/manage-user');
    revalidatePath('/dashboard/settings/manage-reseller');
    
    return { success: true, message: 'User role updated successfully.' };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, message: 'Failed to update user role.' };
  }
};

export const updateUserData = async (uid: string, data: Partial<Pick<UserProfile, 'balance'>>) => {
  if (!uid) {
    throw new Error('User ID is required.');
  }

  // This function is now specifically for balance updates that require transaction logging.
  if (data.balance === undefined) {
    return { success: false, message: 'Balance data is required for this operation.' };
  }

  const newBalance = data.balance;
  
  try {
    await db.runTransaction(async (t) => {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await t.get(userRef);

      if (!userDoc.exists) {
        throw new Error("User not found.");
      }

      const userData = userDoc.data() as UserProfile;
      const oldBalance = userData.balance ?? 0;
      const amount = newBalance - oldBalance;

      if (amount === 0) return; // No change, no transaction needed

      // 1. Update user balance
      t.update(userRef, { balance: newBalance });

      // 2. Create transaction record
      const trxRef = db.collection('transactions').doc(); // Auto-generate ID
      t.set(trxRef, {
        id: trxRef.id,
        uid: uid,
        userName: userData.name,
        userEmail: userData.email,
        amount: Math.abs(amount),
        type: amount > 0 ? 'credit' : 'debit',
        status: 'completed',
        createdAt: FieldValue.serverTimestamp(),
        oldBalance: oldBalance,
        newBalance: newBalance,
        description: `Admin updated balance.`,
        performedBy: 'admin', // In a real app, this would be the admin's UID
      });
    });

    revalidatePath('/dashboard/settings/manage-user');
    revalidatePath('/dashboard/settings/manage-reseller');
    revalidatePath('/dashboard/settings/trx-history');
    
    return { success: true, message: 'User balance updated and transaction recorded.' };
  } catch (error) {
    console.error('Error in balance update transaction:', error);
    const message = error instanceof Error ? error.message : 'Failed to update user balance.';
    return { success: false, message };
  }
};