'use server';

import { db } from '@/lib/firebase-admin';
import type { UserProfile } from '@/types/user';
import { revalidatePath } from 'next/cache';

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

  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.update(data);
    
    revalidatePath('/dashboard/settings/manage-user');
    revalidatePath('/dashboard/settings/manage-reseller');
    
    return { success: true, message: 'User data updated successfully.' };
  } catch (error) {
    console.error('Error updating user data:', error);
    return { success: false, message: 'Failed to update user data.' };
  }
};