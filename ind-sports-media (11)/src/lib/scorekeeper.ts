import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, logoForTeam, schoolKey, type School } from './firebase';
import type { GameState, PlayEvent, TeamData } from '../types';

/**
 * Scorekeeper data layer.
 *
 * Every tap saves only the fields it changes (scores use Firestore increment),
 * so two phones working the same game can't erase each other's updates.
 * Each action also records its exact opposite, which is what Undo applies.
 */

export type Side = 'home' | 'away';
export type SportKind = 'football' | 'basketball' | 'volleyball';

export function sportKind(sport: string): SportKind {
  if (/basket/i.test(sport)) return 'basketball';
  if (/volley/i.test(sport)) return 'volleyball';
  return 'football';
}

export interface Action {
  label: string;
  updates: Record<string, unknown>;
  inverse: Record<string, unknown>;
}

const stamp = () => ({ updatedAt: new Date().toISOString() });

export async function apply(gameId: string, a: Action) {
  await updateDoc(doc(db, 'games', gameId), { ...a.updates, ...stamp() });
}

export async function undo(gameId: string, a: Action) {
  await updateDoc(doc(db, 'games', gameId), { ...a.inverse, ...stamp() });
}

/** Live listener that also reports whether saves are still waiting for signal. */
export function watchGame(
  gameId: string,
  onChange: (game: GameState | null, pending: boolean) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'games', gameId),
    { includeMetadataChanges: true },
    (snap) => {
      if (!snap.exists()) return onChange(null, false);
      const g = { ...(snap.data() as GameState), id: snap.id };
      g.homeTeam = { ...g.homeTeam, logoUrl: logoForTeam(g.homeTeam) };
      g.awayTeam = { ...g.awayTeam, logoUrl: logoForTeam(g.awayTeam) };
      onChange(g, snap.metadata.hasPendingWrites);
    },
    () => onChange(null, false)
  );
}

// ---------------------------------------------------------------------------
// Clock (basketball). Viewers compute the time themselves from these fields.
// ---------------------------------------------------------------------------

export function secondsLeft(g: Pick<GameState, 'clockRunning' | 'clockSeconds' | 'clockStartedAt'>, now = Date.now()) {
  if (g.clockSeconds == null) return null;
  if (!g.clockRunning || !g.clockStartedAt) return Math.max(0, g.clockSeconds);
  return Math.max(0, g.clockSeconds - (now - g.clockStartedAt) / 1000);
}

export function fmtClock(sec: number | null): string {
  if (sec == null) return '';
  if (sec < 60) return `${Math.floor(sec)}.${Math.floor((sec % 1) * 10)}`;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** What to show for the clock anywhere on the site. */
export function displayClock(g: GameState, now = Date.now()): string {
  const left = secondsLeft(g, now);
  return left == null ? g.clock || '' : fmtClock(left);
}

export function clockStart(g: GameState): Action {
  const left = secondsLeft(g) ?? 480;
  return {
    label: 'Clock started',
    updates: { clockRunning: true, clockSeconds: left, clockStartedAt: Date.now() },
    inverse: { clockRunning: false, clockSeconds: left, clock: fmtClock(left) },
  };
}

export function clockStop(g: GameState): Action {
  const left = secondsLeft(g) ?? 0;
  return {
    label: 'Clock stopped',
    updates: { clockRunning: false, clockSeconds: left, clock: fmtClock(left) },
    inverse: { clockRunning: true, clockSeconds: left, clockStartedAt: Date.now() },
  };
}

export function clockSet(g: GameState, seconds: number): Action {
  const prev = secondsLeft(g) ?? 0;
  return {
    label: `Clock set to ${fmtClock(seconds)}`,
    updates: { clockRunning: false, clockSeconds: seconds, clock: fmtClock(seconds) },
    inverse: { clockRunning: false, clockSeconds: prev, clock: fmtClock(prev) },
  };
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function periodIndex(period: string): number {
  const m = period.match(/(\d)/);
  if (/ot|overtime/i.test(period)) return 4;
  return m ? Math.min(4, Math.max(0, Number(m[1]) - 1)) : 0;
}

function play(g: GameState, side: Side, text: string, scoring: boolean, scoreChange?: string): PlayEvent {
  const team = side === 'home' ? g.homeTeam : g.awayTeam;
  const p: PlayEvent = {
    id: `p${Date.now()}${Math.random().toString(36).slice(2, 5)}`,
    time: sportKind(g.sport) === 'basketball' ? displayClock(g) : new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    quarter: g.quarter,
    team: side,
    teamName: team.shortName || team.name,
    text,
    isScoring: scoring,
  };
  if (scoreChange) p.scoreChange = scoreChange;
  return p;
}

/** Add (or with negative points, correct) a score. Football & basketball. */
export function score(g: GameState, side: Side, points: number, what: string): Action {
  const key = side === 'home' ? 'homeTeam' : 'awayTeam';
  const team = g[key];
  const other = side === 'home' ? g.awayTeam : g.homeTeam;
  const newScore = team.score + points;
  const q = [...(team.qScores || [0, 0, 0, 0, 0])] as TeamData['qScores'];
  const prevQ = [...q] as TeamData['qScores'];
  q[periodIndex(g.quarter)] = Math.max(0, (q[periodIndex(g.quarter)] || 0) + points);
  const line =
    side === 'home'
      ? `${other.shortName} ${other.score}, ${team.shortName} ${newScore}`
      : `${team.shortName} ${newScore}, ${other.shortName} ${other.score}`;
  const text = points > 0 ? `${what}, ${team.shortName || team.name}. ${line}` : `Score correction (${points}), ${team.shortName}. ${line}`;
  const p = play(g, side, text, points > 0, points > 0 ? `+${points}` : String(points));
  return {
    label: `${team.shortName} ${points > 0 ? '+' : ''}${points} ${what}`,
    updates: { [`${key}.score`]: increment(points), [`${key}.qScores`]: q, lastPlay: text, plays: arrayUnion(p) },
    inverse: { [`${key}.score`]: increment(-points), [`${key}.qScores`]: prevQ, lastPlay: g.lastPlay || '', plays: arrayRemove(p) },
  };
}

export function setFields(label: string, g: GameState, fields: Partial<Record<string, unknown>>): Action {
  const inverse: Record<string, unknown> = {};
  for (const k of Object.keys(fields)) {
    const v = k.split('.').reduce<any>((o, part) => (o == null ? undefined : o[part]), g);
    inverse[k] = v === undefined ? '' : v;
  }
  return { label, updates: fields as Record<string, unknown>, inverse };
}

export function foul(g: GameState, side: Side, delta: 1 | -1): Action {
  const k = side === 'home' ? 'homeFouls' : 'awayFouls';
  return { label: `${side === 'home' ? g.homeTeam.shortName : g.awayTeam.shortName} foul ${delta > 0 ? '+1' : '-1'}`, updates: { [k]: increment(delta) }, inverse: { [k]: increment(-delta) } };
}

// ---------------------------------------------------------------------------
// Volleyball: current-set points live in team.score; finished sets in vbSets.
// ---------------------------------------------------------------------------

export function vbTarget(g: GameState) {
  return (g.vbSet || 1) >= 5 ? 15 : 25;
}

/** Set is over when a team reaches 25 (15 in set 5) and leads by 2. */
export function vbSetWinner(g: GameState): Side | null {
  const h = g.homeTeam.score, a = g.awayTeam.score, t = vbTarget(g);
  if (h >= t && h - a >= 2) return 'home';
  if (a >= t && a - h >= 2) return 'away';
  return null;
}

export function vbPoint(g: GameState, side: Side, delta: 1 | -1): Action {
  const key = side === 'home' ? 'homeTeam' : 'awayTeam';
  const team = g[key];
  return {
    label: `${team.shortName} ${delta > 0 ? '+1' : '-1'}`,
    updates: { [`${key}.score`]: increment(delta) },
    inverse: { [`${key}.score`]: increment(-delta) },
  };
}

export function vbEndSet(g: GameState): Action {
  const winner = vbSetWinner(g) || (g.homeTeam.score >= g.awayTeam.score ? 'home' : 'away');
  const set = g.vbSet || 1;
  const result = { home: g.homeTeam.score, away: g.awayTeam.score };
  const hw = (g.homeSetsWon || 0) + (winner === 'home' ? 1 : 0);
  const aw = (g.awaySetsWon || 0) + (winner === 'away' ? 1 : 0);
  const matchOver = hw === 3 || aw === 3;
  const wTeam = winner === 'home' ? g.homeTeam : g.awayTeam;
  const text = `Set ${set} to ${wTeam.shortName}, ${Math.max(result.home, result.away)}-${Math.min(result.home, result.away)}. Sets: ${g.awayTeam.shortName} ${aw}, ${g.homeTeam.shortName} ${hw}.`;
  const p = play(g, winner, text, true);
  const updates: Record<string, unknown> = {
    vbSets: [...(g.vbSets || []), result],
    homeSetsWon: hw,
    awaySetsWon: aw,
    lastPlay: text,
    plays: arrayUnion(p),
  };
  if (matchOver) {
    Object.assign(updates, {
      isLive: false,
      quarter: 'Final',
      statusText: 'Final',
      'homeTeam.score': hw,
      'awayTeam.score': aw,
    });
  } else {
    Object.assign(updates, {
      vbSet: set + 1,
      quarter: `Set ${set + 1}`,
      statusText: `Set ${set + 1}`,
      'homeTeam.score': 0,
      'awayTeam.score': 0,
    });
  }
  return {
    label: matchOver ? 'Match final' : `End set ${set}`,
    updates,
    inverse: {
      vbSets: g.vbSets || [],
      homeSetsWon: g.homeSetsWon || 0,
      awaySetsWon: g.awaySetsWon || 0,
      vbSet: set,
      quarter: g.quarter,
      statusText: g.statusText,
      isLive: g.isLive,
      'homeTeam.score': result.home,
      'awayTeam.score': result.away,
      lastPlay: g.lastPlay || '',
      plays: arrayRemove(p),
    },
  };
}

// ---------------------------------------------------------------------------
// Game lifecycle
// ---------------------------------------------------------------------------

export function startGame(g: GameState): Action {
  const kind = sportKind(g.sport);
  const first = kind === 'volleyball' ? 'Set 1' : '1st Qtr';
  const quarter = /pre|upcoming|^$/i.test(g.quarter || '') ? first : g.quarter;
  return setFields('Game started', g, {
    isLive: true,
    isArchived: false,
    quarter,
    statusText: quarter,
    ...(kind === 'volleyball' && !g.vbSet ? { vbSet: 1 } : {}),
  });
}

export function endGame(g: GameState): Action {
  const kind = sportKind(g.sport);
  const fields: Record<string, unknown> = { isLive: false, quarter: 'Final', statusText: 'Final', clockRunning: false };
  if (kind === 'volleyball') {
    fields['homeTeam.score'] = g.homeSetsWon || 0;
    fields['awayTeam.score'] = g.awaySetsWon || 0;
  }
  return setFields('Game final', g, fields);
}

const emptyStats = { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' };

function makeTeam(name: string, school?: School, color = '#262A2F'): TeamData {
  const shortName = name.replace(/\s+(high school|hs)$/i, '').trim();
  return {
    name: school?.name || shortName,
    shortName: school?.name || shortName,
    mascot: school?.mascot || '',
    record: '',
    color,
    textColor: '#FFFFFF',
    logoUrl: school?.logoUrl || '',
    score: 0,
    qScores: [0, 0, 0, 0, 0],
    stats: { ...emptyStats },
  };
}

export async function createGame(opts: {
  sport: 'Varsity Football' | 'Varsity Basketball' | 'Varsity Volleyball' | string;
  away: string;
  home: string;
  schools: School[];
  title: string;
  venue: string;
  dateString: string;
  createdBy: string;
}): Promise<string> {
  const find = (n: string) => opts.schools.find((s) => schoolKey(s.name) === schoolKey(n) || (s.aliases || []).some((a) => schoolKey(a) === schoolKey(n)));
  const away = makeTeam(opts.away, find(opts.away));
  const home = makeTeam(opts.home, find(opts.home));
  const id = `${schoolKey(away.shortName)}-at-${schoolKey(home.shortName)}-${Date.now().toString(36)}`.slice(0, 120);
  const kind = sportKind(opts.sport);
  const game: GameState = {
    id,
    sport: opts.sport,
    title: opts.title || `${away.shortName} at ${home.shortName}`,
    venue: opts.venue,
    dateString: opts.dateString,
    isArchived: false,
    isLive: false,
    statusText: opts.dateString || 'Upcoming',
    quarter: 'Pregame',
    clock: '',
    homeTeam: home,
    awayTeam: away,
    possession: 'home',
    down: kind === 'football' ? '1st' : '',
    distance: kind === 'football' ? '10' : '',
    ballOn: '',
    redZone: false,
    lastPlay: '',
    plays: [],
    socialClips: [],
    updatedAt: new Date().toISOString(),
    createdBy: opts.createdBy,
    ...(kind === 'basketball' ? { clockRunning: false, clockSeconds: 480, clock: '8:00', homeFouls: 0, awayFouls: 0 } : {}),
    ...(kind === 'volleyball' ? { vbSet: 1, vbSets: [], homeSetsWon: 0, awaySetsWon: 0 } : {}),
  };
  await setDoc(doc(db, 'games', id), game);
  return id;
}

export async function archiveGame(id: string, archived: boolean) {
  await updateDoc(doc(db, 'games', id), { isArchived: archived, ...stamp() });
}

export async function deleteGame(id: string) {
  await deleteDoc(doc(db, 'games', id));
}
