import { useEffect, useState } from 'react';
import { getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Team access for IND Sports Media.
 *
 * Staff sign in with Google. A person can post only if a document exists at
 * staff/{their-google-email-lowercase} in Firestore. The same check is enforced
 * by firestore.rules and storage.rules, so hiding buttons is not the only lock.
 *
 * staff/{email} fields: { name: string, role: 'admin' | 'writer' }
 * Admins can add and remove other staff from the Newsroom "Team" tab.
 */

export const auth = getAuth(getApp());

export interface StaffProfile {
  email: string;
  name: string;
  role: 'admin' | 'writer';
  photoURL?: string | null;
}

export interface StaffState {
  loading: boolean;
  user: User | null;
  staff: StaffProfile | null;
  isStaff: boolean;
  isAdmin: boolean;
}

export async function signInStaff(): Promise<void> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(auth, provider);
  } catch (err: any) {
    // Some phone browsers block popups; fall back to a full-page redirect.
    if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/operation-not-supported-in-this-environment') {
      await signInWithRedirect(auth, provider);
      return;
    }
    if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') return;
    throw err;
  }
}

export function signOutStaff(): Promise<void> {
  return signOut(auth);
}

async function loadStaffProfile(user: User): Promise<StaffProfile | null> {
  const email = (user.email || '').toLowerCase();
  if (!email) return null;
  try {
    const snap = await getDoc(doc(db, 'staff', email));
    if (!snap.exists()) return null;
    const data = snap.data() as Partial<StaffProfile>;
    return {
      email,
      name: data.name || user.displayName || email,
      role: data.role === 'admin' ? 'admin' : 'writer',
      photoURL: user.photoURL,
    };
  } catch {
    // Rules deny reading staff/ to non-staff, which lands here.
    return null;
  }
}

export function useStaff(): StaffState {
  const [state, setState] = useState<StaffState>({
    loading: true,
    user: auth.currentUser,
    staff: null,
    isStaff: false,
    isAdmin: false,
  });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ loading: false, user: null, staff: null, isStaff: false, isAdmin: false });
        return;
      }
      setState((s) => ({ ...s, loading: true, user }));
      const staff = await loadStaffProfile(user);
      setState({
        loading: false,
        user,
        staff,
        isStaff: !!staff,
        isAdmin: staff?.role === 'admin',
      });
    });
  }, []);

  return state;
}
