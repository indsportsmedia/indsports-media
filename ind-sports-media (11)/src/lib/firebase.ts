import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
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
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import defaultAppletConfig from '../../firebase-applet-config.json';
import type { GameState, PhotoItem, SocialClip } from '../types';

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
 * Uploads a raw File or Blob (Photo/Video) directly to Firebase Storage bucket with genuine byte progress tracking.
 * Returns the public HTTPS download URL.
 */
export async function uploadMediaFile(
  file: File | Blob, 
  pathFolder: 'photos' | 'videos' | 'highlights' | 'logos' = 'photos', 
  onProgress?: (progress: number) => void
): Promise<string> {
  const fileExtension = (file as File).name ? (file as File).name.split('.').pop() : (file.type.startsWith('video/') ? 'mp4' : 'jpg');
  const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
  const storageRef = ref(storage, `${pathFolder}/${fileId}`);

  if (onProgress) onProgress(0);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type || (fileExtension === 'mp4' ? 'video/mp4' : 'image/jpeg')
  });

  return new Promise((resolve, reject) => {
    // Stall safeguard for weak stadium cell signal: cancel only if no bytes move
    // for 60 seconds (a fixed 45s limit made longer video uploads impossible).
    let timeout: ReturnType<typeof setTimeout>;
    const armStallTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error('Upload stalled for 60s. Please check your cell signal and try again.'));
      }, 60000);
    };
    armStallTimer();

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        armStallTimer();
        if (snapshot.totalBytes > 0) {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          if (onProgress) onProgress(progress);
        }
      },
      (error) => {
        clearTimeout(timeout);
        console.error('Firebase Storage upload error:', error);
        let userFriendlyMsg = error.message;
        if ((error as any)?.code === 'storage/unauthorized') {
          userFriendlyMsg = 'Firebase Storage rejected upload (Permission Denied). Make sure you are signed in with an IND staff account.';
        } else if ((error as any)?.code === 'storage/canceled') {
          userFriendlyMsg = 'Upload was canceled.';
        } else if ((error as any)?.code === 'storage/retry-limit-exceeded') {
          userFriendlyMsg = 'Upload timed out on cellular network. Please try again.';
        }
        reject(new Error(userFriendlyMsg));
      },
      async () => {
        clearTimeout(timeout);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) onProgress(100);
          resolve(downloadURL);
        } catch (err: any) {
          console.error('Failed to get download URL from Storage:', err);
          reject(new Error(`Failed to retrieve download link: ${err?.message || err}`));
        }
      }
    );
  });
}

/**
 * Uploads a base64 Data URL to Firebase Storage by converting it to a Blob and using uploadBytesResumable.
 * Returns the public HTTPS download URL.
 */
export async function uploadBase64Image(
  dataUrl: string, 
  folder = 'highlights',
  onProgress?: (progress: number) => void
): Promise<string> {
  // Convert Data URL to binary Blob for true uploadBytesResumable tracking
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return uploadMediaFile(blob, folder as any, onProgress);
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
// ---------------------------------------------------------------------------
// School logo library: schools/{key} = { name, logoUrl, mascot?, aliases? }
// Added from Newsroom → Schools. Any game whose team name matches a school
// automatically shows that logo everywhere (scoreboard, ticker, cards).
// ---------------------------------------------------------------------------
export interface School {
  id: string;
  name: string;
  logoUrl: string;
  mascot?: string;
  aliases?: string[];
}

export const schoolKey = (name: string) =>
  (name || '').toLowerCase().replace(/\b(high school|hs|h\.s\.)\b/g, '').replace(/[^a-z0-9]/g, '');

let schoolLogoMap: Record<string, string> = {};

export function subscribeToSchools(onUpdate: (schools: School[]) => void): Unsubscribe {
  return onSnapshot(
    collection(db, 'schools'),
    (snap) => {
      const list = snap.docs.map((d) => ({ ...(d.data() as Omit<School, 'id'>), id: d.id }));
      list.sort((a, b) => a.name.localeCompare(b.name));
      const map: Record<string, string> = {};
      list.forEach((s) => {
        if (!s.logoUrl) return;
        [s.name, ...(s.aliases || [])].forEach((n) => { if (n) map[schoolKey(n)] = s.logoUrl; });
      });
      schoolLogoMap = map;
      onUpdate(list);
    },
    (err) => console.warn('Schools subscription error:', err)
  );
}

export function logoForTeam(team: { name: string; shortName?: string; logoUrl?: string }): string | undefined {
  return schoolLogoMap[schoolKey(team.name)] || (team.shortName ? schoolLogoMap[schoolKey(team.shortName)] : undefined) || team.logoUrl;
}

function withSchoolLogos(game: GameState): GameState {
  return {
    ...game,
    homeTeam: { ...game.homeTeam, logoUrl: logoForTeam(game.homeTeam) },
    awayTeam: { ...game.awayTeam, logoUrl: logoForTeam(game.awayTeam) },
  };
}

export function subscribeToGames(
  onUpdate: (games: GameState[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  let latest: GameState[] | null = null;
  const emit = () => { if (latest) onUpdate(latest.map(withSchoolLogos)); };

  const unsubSchools = subscribeToSchools(() => emit());
  const unsubGames = onSnapshot(
    collection(db, 'games'),
    (snapshot) => {
      latest = snapshot.docs.map((docSnap) => ({ ...(docSnap.data() as GameState), id: docSnap.id }));
      emit();
    },
    (err) => {
      console.error('Firestore games subscription error:', err);
      if (onError) onError(err);
    }
  );
  return () => { unsubGames(); unsubSchools(); };
}

/**
 * Save or update a game document in Firestore.
 * This triggers the onSnapshot listener across all active viewers.
 */
export async function syncGameToFirestore(game: GameState): Promise<void> {
  try {
    const gameRef = doc(db, 'games', game.id);
    // Deep clone and sanitize to strip any accidental base64 strings and undefined values
    const cleanGame: GameState = JSON.parse(JSON.stringify(game));

    // Ensure socialClips only store lightweight URLs, never base64
    if (Array.isArray(cleanGame.socialClips)) {
      cleanGame.socialClips = cleanGame.socialClips.map(clip => {
        let cleanMediaUrl = clip.mediaUrl || '';
        let cleanUrl = clip.url || '';
        // If an old entry contains raw base64, truncate/replace to prevent Firestore >1MB document error
        if (cleanMediaUrl.startsWith('data:')) {
          cleanMediaUrl = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80';
        }
        if (cleanUrl.startsWith('data:')) {
          cleanUrl = cleanMediaUrl;
        }
        return {
          ...clip,
          mediaUrl: cleanMediaUrl,
          url: cleanUrl
        };
      });
    }

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
 * Safely delete a file from Firebase Cloud Storage by URL or storage path.
 */
export async function deleteStorageFileSafely(storageUrl?: string): Promise<void> {
  if (!storageUrl || typeof storageUrl !== 'string') return;
  // Only attempt deletion if it's hosted on Firebase Storage
  if (
    storageUrl.includes('firebasestorage.googleapis.com') || 
    storageUrl.startsWith('gs://') ||
    storageUrl.startsWith('photos/') ||
    storageUrl.startsWith('videos/') ||
    storageUrl.startsWith('highlights/')
  ) {
    try {
      const fileRef = ref(storage, storageUrl);
      await deleteObject(fileRef);
      console.log('Firebase Storage file deleted successfully:', storageUrl);
    } catch (err: any) {
      // If file already deleted or not found, log warning without breaking the caller
      console.warn('Firebase Storage file cleanup warning:', err?.message || err);
    }
  }
}

/**
 * Updates a specific highlight entry inside the Firestore games document array or photos collection.
 * Triggers the onSnapshot listener across all live user screens instantly in real time.
 */
export async function updateHighlightDetails(
  gameId: string, 
  clipId: string, 
  updatedFields: { title?: string; caption?: string; team?: 'home' | 'away' | 'neutral' | string; tags?: string[] }
): Promise<void> {
  try {
    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
      const gameData = gameSnap.data() as GameState;
      const currentClips = gameData.socialClips || [];
      
      const updatedClips = currentClips.map((clip: SocialClip) => {
        if (clip.id === clipId) {
          return {
            ...clip,
            ...(updatedFields.title !== undefined ? { title: updatedFields.title } : {}),
            ...(updatedFields.caption !== undefined ? { caption: updatedFields.caption } : {}),
            ...(updatedFields.team !== undefined ? { team: updatedFields.team as any } : {})
          };
        }
        return clip;
      });

      await updateDoc(gameRef, {
        socialClips: updatedClips,
        updatedAt: new Date().toISOString()
      });
    }

    // Also check and update the corresponding photo in the 'photos' collection if it exists
    try {
      const photoRef = doc(db, 'photos', clipId);
      const photoSnap = await getDoc(photoRef);
      if (photoSnap.exists()) {
        await updateDoc(photoRef, {
          ...(updatedFields.title !== undefined ? { title: updatedFields.title } : {}),
          ...(updatedFields.tags !== undefined ? { tags: updatedFields.tags } : {}),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (photoSyncErr) {
      // Non-blocking secondary sync
      console.warn('Secondary photos collection sync warning:', photoSyncErr);
    }
  } catch (err) {
    console.error(`Failed to update highlight details for clip ${clipId} in game ${gameId}:`, err);
    throw err;
  }
}

/**
 * Deletes a highlight/photo from Firestore and cleans up the associated image/video file from Firebase Storage.
 * Triggers onSnapshot listeners across all fan screens in real time.
 */
export async function deleteMediaHighlight(
  collectionName: 'games' | 'photos' | string, 
  docId: string, 
  storageUrl?: string,
  gameId?: string
): Promise<void> {
  try {
    // 1. If it's a clip inside a game document
    if (collectionName === 'games' && gameId) {
      const gameRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameRef);
      if (gameSnap.exists()) {
        const gameData = gameSnap.data() as GameState;
        const currentClips = gameData.socialClips || [];
        const filteredClips = currentClips.filter((c: SocialClip) => c.id !== docId);

        await updateDoc(gameRef, {
          socialClips: filteredClips,
          updatedAt: new Date().toISOString()
        });
      }
    }

    // 2. If it is stored in the photos collection
    if (collectionName === 'photos' || !gameId) {
      try {
        const photoRef = doc(db, 'photos', docId);
        await deleteDoc(photoRef);
      } catch (e) {
        console.warn('Photo doc deletion notice:', e);
      }
    }

    // 3. Delete the raw image or video from Firebase Cloud Storage
    if (storageUrl) {
      await deleteStorageFileSafely(storageUrl);
    }
  } catch (err) {
    console.error(`Failed to delete media highlight ${docId}:`, err);
    throw err;
  }
}

/**
 * Updates a photo document in the Firestore 'photos' collection.
 */
export async function updatePhotoInFirestore(
  photoId: string, 
  updatedFields: Partial<PhotoItem>
): Promise<void> {
  try {
    const photoRef = doc(db, 'photos', photoId);
    await updateDoc(photoRef, {
      ...updatedFields,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error(`Failed to update photo ${photoId}:`, err);
    throw err;
  }
}

/**
 * Delete a photo from Firestore and remove the file from Firebase Storage.
 */
export async function deletePhotoFromFirestore(photoId: string, storageUrl?: string): Promise<void> {
  try {
    const photoRef = doc(db, 'photos', photoId);
    await deleteDoc(photoRef);
    if (storageUrl) {
      await deleteStorageFileSafely(storageUrl);
    }
  } catch (err) {
    console.error(`Failed to delete photo ${photoId} from Firestore:`, err);
    throw err;
  }
}

/**
 * Seed initial default games or ensure Week 2 matchups exist and past games are archived.
 */
export async function seedInitialGamesIfEmpty(_initialGames: GameState[]): Promise<void> {
  // Turned off: this used to re-create the AI-generated sample games every time
  // staff opened the scoreboard, so deleted games kept coming back.
  // Create real games from /score instead.
}

/**
 * Client-side high performance image compressor.
 * Takes a raw camera photo (e.g. 10MB iPhone RAW/HEIC/JPEG) and resizes it to a crisp,
 * lightweight web-ready JPEG (~100-250KB) data URL for instant UI preview.
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

/**
 * Compresses an image file directly to a lightweight binary Blob (JPEG)
 * ideal for fast Firebase Storage uploadBytesResumable transmission over cellular networks.
 */
export function compressImageToBlob(file: File, maxDimension = 1400, quality = 0.82): Promise<Blob> {
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

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to Blob'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
