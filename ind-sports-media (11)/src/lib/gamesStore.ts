import { useEffect, useState } from 'react';
import { subscribeToGames } from './firebase';
import type { GameState } from '../types';

/**
 * One shared, live list of games for the whole site.
 *
 * The score ticker, the scoreboard page and everything else read from this single
 * Firestore subscription, so they can never show different scores for the same game.
 * Nothing is cached in the browser between visits (old cached copies are cleared).
 */

let games: GameState[] = [];
let loaded = false;
let started = false;
const listeners = new Set<() => void>();

// Remove stale copies the old scoreboard saved in the browser.
try {
  ['ind_live_scoreboard_games_v3', 'ind_live_scoreboard_games_v4'].forEach((k) => localStorage.removeItem(k));
} catch {
  /* private mode */
}

function start() {
  if (started) return;
  started = true;
  subscribeToGames(
    (list) => {
      games = list;
      loaded = true;
      listeners.forEach((l) => l());
    },
    (err) => console.warn('Games feed error:', err)
  );
}

export function useLiveGames(): { games: GameState[]; loaded: boolean } {
  const [, force] = useState(0);
  useEffect(() => {
    start();
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (loaded) l();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { games, loaded };
}
