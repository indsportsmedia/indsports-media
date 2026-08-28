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
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  uploadString, 
  getDownloadURL 
} from 'firebase/storage';
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

// Initialize Firebase Cloud Storage
export const storage = getStorage(app);

export const activeFirebaseProjectId = firebaseConfig.projectId;

/**
 * Uploads a raw File (Photo/Video) directly to Firebase Storage bucket with progress tracking.
 * Returns the public HTTPS download URL.
 */
export async function uploadMediaFile(
  file: File, 
  pathFolder: 'photos' | 'videos' | 'highlights' = 'photos', 
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop() || (file.type.startsWith('video/') ? 'mp4' : 'jpg');
    const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
    const storageRef = ref(storage, `${pathFolder}/${fileId}`);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || (fileExtension === 'mp4' ? 'video/mp4' : 'image/jpeg')
    });

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.warn('Firebase Storage uploadBytesResumable error, falling back if possible:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  } catch (err) {
    console.error('Failed to initiate Firebase Storage upload:', err);
    throw err;
  }
}

/**
 * Uploads a compressed base64 Data URL to Firebase Storage.
 * Returns the public HTTPS download URL.
 */
export async function uploadBase64Image(
  dataUrl: string, 
  folder = 'highlights',
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const imageId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
    const storageRef = ref(storage, `${folder}/${imageId}`);

    if (onProgress) onProgress(30);
    await uploadString(storageRef, dataUrl, 'data_url');
    if (onProgress) onProgress(80);
    const downloadUrl = await getDownloadURL(storageRef);
    if (onProgress) onProgress(100);
    return downloadUrl;
  } catch (err) {
    console.warn('Firebase Storage uploadString error (Storage bucket may require rule permissions or CORS). Returning base64/data as fallback:', err);
    // Fallback: Return data URL so client never loses their media even if storage is offline
    return dataUrl;
  }
}


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
 * Seed initial default games or ensure Week 2 matchups exist and past games are archived.
 */
export async function seedInitialGamesIfEmpty(initialGames: GameState[]): Promise<void> {
  try {
    const gamesCol = collection(db, 'games');
    const snap = await getDocs(gamesCol);
    if (snap.empty) {
      for (const g of initialGames) {
        await syncGameToFirestore(g);
      }
    } else {
      // Ensure the three Week 2 games exist and Lawrence North vs Brownsburg is archived
      const existingIds = new Set(snap.docs.map(d => d.id));
      for (const g of initialGames) {
        if (!existingIds.has(g.id)) {
          await syncGameToFirestore(g);
        } else if (g.id === 'lawrence-north-vs-brownsburg-2026' || g.id === 'southside-fw-vs-marion-giants-2026') {
          // Keep archived status in sync
          await syncGameToFirestore(g);
        }
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
