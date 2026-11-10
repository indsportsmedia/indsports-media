import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { db, uploadMediaFile, compressImageToBlob } from './firebase';
import type { StaffProfile } from './staff';

export const SPORTS = ['Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football', 'Baseball', 'Softball', 'Soccer', 'Other'] as const;
export type Sport = (typeof SPORTS)[number];

export type MediaType = 'image' | 'video';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string; // plain text; blank lines separate paragraphs
  sport: Sport;
  authorName: string;
  authorEmail: string;
  coverUrl?: string;
  coverType?: MediaType;
  status: 'draft' | 'published';
  isLive: boolean; // true while a game is in progress: shows LIVE badge + update feed
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  publishedAt?: Timestamp | null;
}

export interface LiveUpdate {
  id: string;
  text: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  authorName: string;
  authorEmail: string;
  pinned?: boolean;
  createdAt?: Timestamp | null;
}

// ---------- helpers ----------

export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || 'story'}-${suffix}`;
}

export function articleUrl(slug: string, updateId?: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://indsports.media';
  return `${origin}/news/${slug}${updateId ? `#u-${updateId}` : ''}`;
}

export function formatTime(ts?: Timestamp | null): string {
  if (!ts) return 'Just now';
  const d = ts.toDate();
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400 && d.getDate() === new Date().getDate()) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export function readTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

/**
 * Upload a photo or video from a phone. Photos are shrunk to web size first
 * (2000px long edge) so they upload fast over stadium cell signal.
 */
export async function uploadStoryMedia(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; type: MediaType }> {
  if (file.type.startsWith('video/')) {
    const url = await uploadMediaFile(file, 'videos', onProgress);
    return { url, type: 'video' };
  }
  let blob: Blob = file;
  try {
    blob = await compressImageToBlob(file, 2000, 0.85);
  } catch {
    // HEIC or unusual formats the browser can't redraw: upload the original.
  }
  const url = await uploadMediaFile(blob, 'photos', onProgress);
  return { url, type: 'image' };
}

// ---------- reading ----------

export function subscribeToPublishedArticles(onChange: (articles: Article[]) => void) {
  // Sorted in the browser so Firestore doesn't need a custom index.
  const q = query(collection(db, 'articles'), where('status', '==', 'published'));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => ({ ...(d.data() as Article), slug: d.id }));
      list.sort((a, b) => (b.publishedAt?.toMillis?.() ?? Date.now()) - (a.publishedAt?.toMillis?.() ?? Date.now()));
      onChange(list);
    },
    (err) => {
      console.warn('Articles feed error:', err);
      onChange([]);
    }
  );
}

/** Staff only: every article including drafts, newest first. */
export function subscribeToAllArticles(onChange: (articles: Article[]) => void, max = 100) {
  const q = query(collection(db, 'articles'), orderBy('updatedAt', 'desc'), limit(max));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ ...(d.data() as Article), slug: d.id }))),
    (err) => console.warn('Newsroom feed error:', err)
  );
}

export function subscribeToArticle(slug: string, onChange: (article: Article | null) => void) {
  return onSnapshot(
    doc(db, 'articles', slug),
    (snap) => onChange(snap.exists() ? ({ ...(snap.data() as Article), slug: snap.id }) : null),
    () => onChange(null)
  );
}

export function subscribeToUpdates(slug: string, onChange: (updates: LiveUpdate[]) => void) {
  const q = query(collection(db, 'articles', slug, 'updates'), orderBy('createdAt', 'desc'), limit(300));
  return onSnapshot(
    q,
    { includeMetadataChanges: false },
    (snap) => onChange(snap.docs.map((d) => ({ ...(d.data() as LiveUpdate), id: d.id }))),
    (err) => console.warn('Live updates error:', err)
  );
}

export async function getArticle(slug: string): Promise<Article | null> {
  const snap = await getDoc(doc(db, 'articles', slug));
  return snap.exists() ? ({ ...(snap.data() as Article), slug: snap.id }) : null;
}

// ---------- writing (staff) ----------

export interface ArticleDraft {
  title: string;
  excerpt: string;
  body: string;
  sport: Sport;
  coverUrl?: string;
  coverType?: MediaType;
  isLive: boolean;
}

export async function saveArticle(
  author: StaffProfile,
  draft: ArticleDraft,
  publish: boolean,
  existing?: Article | null
): Promise<string> {
  const slug = existing?.slug || slugify(draft.title);
  const ref = doc(db, 'articles', slug);
  const wasPublished = existing?.status === 'published';
  const data: Record<string, unknown> = {
    title: draft.title.trim(),
    excerpt: draft.excerpt.trim(),
    body: draft.body,
    sport: draft.sport,
    coverUrl: draft.coverUrl || '',
    coverType: draft.coverType || 'image',
    isLive: draft.isLive,
    status: publish ? 'published' : existing?.status || 'draft',
    updatedAt: serverTimestamp(),
  };
  if (!existing) {
    data.createdAt = serverTimestamp();
    data.authorName = author.name;
    data.authorEmail = author.email;
  }
  if (publish && !wasPublished) data.publishedAt = serverTimestamp();
  await setDoc(ref, data, { merge: true });
  return slug;
}

export async function setArticleStatus(slug: string, status: 'draft' | 'published') {
  await updateDoc(doc(db, 'articles', slug), {
    status,
    updatedAt: serverTimestamp(),
    ...(status === 'published' ? { publishedAt: serverTimestamp() } : {}),
  });
}

export async function setArticleLive(slug: string, isLive: boolean) {
  await updateDoc(doc(db, 'articles', slug), { isLive, updatedAt: serverTimestamp() });
}

export async function deleteArticle(slug: string) {
  await deleteDoc(doc(db, 'articles', slug));
}

export async function postLiveUpdate(
  author: StaffProfile,
  slug: string,
  text: string,
  media?: { url: string; type: MediaType }
): Promise<string> {
  const ref = doc(collection(db, 'articles', slug, 'updates'));
  await setDoc(ref, {
    text: text.trim(),
    mediaUrl: media?.url || '',
    mediaType: media?.type || '',
    authorName: author.name,
    authorEmail: author.email,
    pinned: false,
    createdAt: serverTimestamp(),
  });
  // Bump the article so it rises to the top of the newsroom list.
  await updateDoc(doc(db, 'articles', slug), { updatedAt: serverTimestamp() }).catch(() => {});
  return ref.id;
}

export async function setUpdatePinned(slug: string, updateId: string, pinned: boolean) {
  await updateDoc(doc(db, 'articles', slug, 'updates', updateId), { pinned });
}

export async function deleteLiveUpdate(slug: string, updateId: string) {
  await deleteDoc(doc(db, 'articles', slug, 'updates', updateId));
}
