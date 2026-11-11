import type { GameState } from '../types';

/** When the game starts (ms), if the scorekeeper set a start time. */
export function startMs(g: GameState): number | null {
  if (!g.startsAt) return null;
  const t = Date.parse(g.startsAt);
  return Number.isNaN(t) ? null : t;
}

export function isFinal(g: GameState) {
  return !g.isLive && /final/i.test(`${g.quarter || ''} ${g.statusText || ''}`);
}

export function isUpcoming(g: GameState) {
  return !g.isLive && !isFinal(g);
}

/**
 * Upcoming games whose start time passed more than 6 hours ago without ever going
 * live are probably out of date (cancelled, or nobody kept score). They're hidden
 * from fans automatically and flagged in the Scorekeeper.
 */
export function isStale(g: GameState, now = Date.now()) {
  const t = startMs(g);
  return isUpcoming(g) && t != null && now - t > 6 * 3600 * 1000;
}

/** "Tonight 7:00 PM", "Tomorrow 6:30 PM", "Sat, Nov 14 7:00 PM", or the typed text. */
export function whenLabel(g: GameState, now = new Date()): string {
  const t = startMs(g);
  if (t == null) return g.dateString || g.statusText || '';
  const d = new Date(t);
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(d) - day(now)) / 86400000);
  if (diff === 0) return `${d.getHours() >= 17 ? 'Tonight' : 'Today'} ${time}`;
  if (diff === 1) return `Tomorrow ${time}`;
  if (diff === -1) return `Yesterday ${time}`;
  return `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} ${time}`;
}

/** Value for <input type="datetime-local"> */
export function toLocalInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
