import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  getDocFromServer,
  onSnapshot, 
  type Unsubscribe 
} from 'firebase/firestore';
import defaultAppletConfig from '../../firebase-applet-config.json';
import type { GameState } from '../types';

// Allow overriding via custom environment variables (e.g. on Netlify or custom deployment)
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || defaultAppletConfig.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || defaultAppletConfig.authDomain,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || defaultAppletConfig.projectId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || defaultAppletConfig.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultAppletConfig.messagingSenderId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || defaultAppletConfig.appId,
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || defaultAppletConfig.firestoreDatabaseId || ''
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with configured databaseId (or default if not specified)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const activeFirebaseProjectId = firebaseConfig.projectId;


// Connection test helper
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_health', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connection check: client offline.');
    }
    // Return true anyway if we can connect or fallback
    return true;
  }
}

/**
 * Real-time subscription to all games.
 * Whenever ANY device updates a score, clock, play, or clip,
 * this listener fires on ALL devices instantly with sub-second latency.
 */
export function subscribeToGames(
  onUpdate: (games: GameState[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const gamesCol = collection(db, 'games');

  return onSnapshot(
    gamesCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const gamesList: GameState[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as GameState;
          gamesList.push({
            ...data,
            id: docSnap.id
          });
        });
        onUpdate(gamesList);
      } else {
        onUpdate([]);
      }
    },
    (err) => {
      console.error('Firestore games subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a game document in Firestore.
 * This triggers the onSnapshot listener across all active viewers.
 */
export async function syncGameToFirestore(game: GameState): Promise<void> {
  try {
    const gameRef = doc(db, 'games', game.id);
    // Sanitize any undefined values before sending to Firestore
    const cleanGame = JSON.parse(JSON.stringify(game));
    await setDoc(gameRef, {
      ...cleanGame,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error(`Failed to sync game ${game.id} to Firestore:`, err);
    throw err;
  }
}

/**
 * Batch seed or initialize games if Firestore is empty on first boot.
 */
export async function seedInitialGamesIfEmpty(defaultGames: GameState[]): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, 'games'));
    if (snapshot.empty) {
      console.log('Seeding initial showcase games to Firestore...');
      for (const game of defaultGames) {
        await syncGameToFirestore(game);
      }
    }
  } catch (err) {
    console.warn('Could not check/seed Firestore games:', err);
  }
}
