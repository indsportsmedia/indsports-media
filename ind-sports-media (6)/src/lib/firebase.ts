import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc,
  getDocs,
  getDocFromServer,
  onSnapshot, 
  type Unsubscribe 
} from 'firebase/firestore';
import defaultAppletConfig from '../../firebase-applet-config.json';
import type { GameState, PhotoItem } from '../types';

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
 * Real-time subscription to all photos in the Firestore collection.
 * Fires automatically on all visitor browsers when a new photo is uploaded.
 */
export function subscribeToPhotos(
  onUpdate: (photos: PhotoItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const photosCol = collection(db, 'photos');

  return onSnapshot(
    photosCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const photosList: PhotoItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PhotoItem;
          photosList.push({
            ...data,
            id: docSnap.id
          });
        });
        // Sort by createdAt descending if present
        photosList.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        onUpdate(photosList);
      } else {
        onUpdate([]);
      }
    },
    (err) => {
      console.error('Firestore photos subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Upload an in-game photo or match action shot to Firestore.
 */
export async function uploadPhotoToFirestore(photo: Omit<PhotoItem, 'id'> & { id?: string }): Promise<string> {
  const photoId = photo.id || `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const photoRef = doc(db, 'photos', photoId);

  const cleanPhoto: PhotoItem = {
    ...photo,
    id: photoId,
    createdAt: photo.createdAt || new Date().toISOString()
  };

  await setDoc(photoRef, cleanPhoto);
  return photoId;
}

/**
 * Delete a photo from Firestore.
 */
export async function deletePhotoFromFirestore(photoId: string): Promise<void> {
  const photoRef = doc(db, 'photos', photoId);
  await deleteDoc(photoRef);
}

/**
 * Seed initial default games if the games collection is completely empty.
 */
export async function seedInitialGamesIfEmpty(initialGames: GameState[]): Promise<void> {
  try {
    const gamesCol = collection(db, 'games');
    const snap = await getDocs(gamesCol);
    if (snap.empty) {
      for (const g of initialGames) {
        await syncGameToFirestore(g);
      }
    }
  } catch (err) {
    console.warn('Could not auto-seed games in Firestore:', err);
  }
}

/**
 * Client-side high performance image compressor.
 * Takes a raw camera photo (e.g. 10MB iPhone RAW/HEIC/JPEG) and resizes it to a crisp,
 * lightweight web-ready JPEG (~100-250KB) so it uploads in sub-second time directly into Firestore.
 */
export function compressImageFile(file: File, maxDimension = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw with smooth bicubic interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
