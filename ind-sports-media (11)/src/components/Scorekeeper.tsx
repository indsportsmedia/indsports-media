import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Play, Pause, Plus, Undo2, Wifi, WifiOff, ExternalLink } from 'lucide-react';
import { subscribeToGames, subscribeToSchools, type School } from '../lib/firebase';
import { useStaff, signInStaff, signOutStaff } from '../lib/staff';
import type { GameState } from '../types';
import TeamLogo from './TeamLogo';
import {
  type Action, type Side, apply, undo, watchGame, sportKind, score, setFields, foul,
  clockStart, clockStop, clockSet, displayClock, secondsLeft, vbPoint, vbEndSet, vbSetWinner, vbTarget,
  startGame, endGame, createGame, archiveGame, deleteGame,
} from '../lib/scorekeeper';

const chip = (on: boolean) =>
  `px-3 py-2.5 rounded-md font-display font-semibold uppercase text-[15px] cursor-pointer border transition-colors ${
    on ? 'bg-ind text-black border-ind' : 'bg-[#16191c] text-white border-white/10 active:bg-white/10'
  }`;
const bigBtn =
  'rounded-lg bg-[#16191c] border border-white/10 active:bg-ind active:text-black text-white font-display font-semibold uppercase cursor-pointer select-none touch-manipulation';
const field = 'w-full bg-black border border-white/15 focus:border-ind rounded-md px-3 py-3 text-white text-base outline-none';
const label = 'block text-[12px] font-semibold text-mute mb-1.5';

const buzz = () => { try { navigator.vibrate?.(12); } catch { /* not supported */ } };

// ---------------------------------------------------------------------------
// Game list + new game
// ---------------------------------------------------------------------------
function GamePicker({ games, schools, staffEmail, onPick }: { games: GameState[]; schools: School[]; staffEmail: string; onPick: (id: string) => void }) {
  const [creating, setCreating] = useState(false);
  const [sport, setSport] = useState('Varsity Football');
  const [away, setAway] = useState('');
  const [home, setHome] = useState('');
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [when, setWhen] = useState('Tonight, 7:00 PM');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showOld, setShowOld] = useState(false);

  const visible = games
    .filter((g) => showOld || !g.isArchived)
    .sort((a, b) => Number(b.isLive) - Number(a.isLive) || (b.updatedAt || '').localeCompare(a.updatedAt || ''));

  const create = async () => {
    if (!away.trim() || !home.trim()) return setError('Enter both teams.');
    setBusy(true);
    setError('');
    try {
      const id = await createGame({ sport, away, home, schools, title, venue, dateString: when, createdBy: staffEmail });
      onPick(id);
    } catch (e: any) {
      setError(e?.message || 'Game not created.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {!creating ? (
        <button onClick={() => setCreating(true)} className="w-full flex items-center justify-center gap-2 bg-ind text-black font-display font-semibold uppercase text-lg rounded-lg py-3.5 cursor-pointer">
          <Plus size={20} /> New game
        </button>
      ) : (
        <div className="bg-panel border border-rule rounded-lg p-4 space-y-3">
          <p className="font-display font-semibold uppercase text-white text-lg">New game</p>
          <div className="grid grid-cols-3 gap-2">
            {['Varsity Football', 'Varsity Basketball', 'Varsity Volleyball'].map((s) => (
              <button key={s} onClick={() => setSport(s)} className={chip(sport === s)}>{s.replace('Varsity ', '')}</button>
            ))}
          </div>
          <datalist id="school-list">{schools.map((s) => <option key={s.id} value={s.name} />)}</datalist>
          <div>
            <label className={label}>Away team</label>
            <input list="school-list" value={away} onChange={(e) => setAway(e.target.value)} placeholder="Carmel" className={field} />
          </div>
          <div>
            <label className={label}>Home team</label>
            <input list="school-list" value={home} onChange={(e) => setHome(e.target.value)} placeholder="Westfield" className={field} />
          </div>
          <p className="text-mute text-[13px] -mt-1">Pick from your Schools list and the logo and mascot fill in automatically.</p>
          <div>
            <label className={label}>Game title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="IHSAA Sectional 4, Round 1" className={field} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={label}>Venue</label>
              <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Westfield, IN" className={field} />
            </div>
            <div>
              <label className={label}>Date and time</label>
              <input value={when} onChange={(e) => setWhen(e.target.value)} className={field} />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setCreating(false)} className="rounded-lg border border-white/15 py-3 text-white font-display uppercase cursor-pointer">Cancel</button>
            <button onClick={create} disabled={busy} className="rounded-lg bg-ind text-black py-3 font-display font-semibold uppercase cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              {busy && <Loader2 size={16} className="animate-spin" />} Create game
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="font-display font-semibold uppercase text-white">Games</p>
        <button onClick={() => setShowOld(!showOld)} className="text-ind text-sm cursor-pointer">{showOld ? 'Hide archived' : 'Show archived'}</button>
      </div>
      {visible.length === 0 && <p className="text-mute text-sm">No games yet. Tap New game to set one up.</p>}
      <ul className="space-y-2">
        {visible.map((g) => (
          <li key={g.id}>
            <button onClick={() => onPick(g.id)} className="w-full text-left bg-panel border border-rule rounded-lg px-4 py-3 cursor-pointer active:border-ind">
              <div className="flex items-center gap-2 text-[12px] mb-1.5">
                {g.isLive ? <span className="bg-[#E4002B] text-white font-display px-1.5 rounded-sm">LIVE</span> : <span className="text-mute">{g.statusText || g.quarter}</span>}
                <span className="text-ind">{g.sport.replace('Varsity ', '')}</span>
                {g.isArchived && <span className="text-mute">Archived</span>}
              </div>
              {[g.awayTeam, g.homeTeam].map((t, i) => (
                <div key={i} className="flex items-center gap-2 py-0.5">
                  <TeamLogo name={t.name} url={t.logoUrl} color={t.color} className="w-5 h-5" textClass="text-[9px]" />
                  <span className="text-white font-semibold flex-1 truncate">{t.name}</span>
                  <span className="font-display text-white tabular">{t.score}</span>
                </div>
              ))}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sport pads
// ---------------------------------------------------------------------------
function TeamHeader({ g, side }: { g: GameState; side: Side }) {
  const t = side === 'home' ? g.homeTeam : g.awayTeam;
  return (
    <div className="flex items-center gap-2 min-w-0 mb-2">
      <TeamLogo name={t.name} url={t.logoUrl} color={t.color} className="w-6 h-6" textClass="text-[9px]" />
      <span className="font-display font-semibold uppercase text-white truncate">{t.shortName || t.name}</span>
      <span className="text-mute text-xs">{side === 'home' ? 'Home' : 'Away'}</span>
    </div>
  );
}

function FootballPad({ g, run }: { g: GameState; run: (a: Action) => void }) {
  const [ballOn, setBallOn] = useState(g.ballOn || '');
  useEffect(() => setBallOn(g.ballOn || ''), [g.ballOn]);
  const plays: [string, number][] = [['TD', 6], ['PAT', 1], ['2-PT', 2], ['FG', 3], ['Safety', 2]];
  const names: Record<string, string> = { TD: 'Touchdown', PAT: 'Extra point', '2-PT': 'Two-point conversion', FG: 'Field goal', Safety: 'Safety' };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {(['away', 'home'] as Side[]).map((side) => (
          <div key={side}>
            <TeamHeader g={g} side={side} />
            <div className="grid grid-cols-2 gap-2">
              {plays.map(([k, pts]) => (
                <button key={k} onClick={() => run(score(g, side, pts, names[k]))} className={`${bigBtn} h-16 text-lg ${k === 'TD' ? 'col-span-2 h-20 text-2xl' : ''}`}>
                  {k} <span className="text-mute text-sm ml-1">+{pts}</span>
                </button>
              ))}
              <button onClick={() => run(score(g, side, -1, 'Correction'))} className="col-span-2 h-10 rounded-lg border border-white/10 text-mute text-sm cursor-pointer">−1 correction</button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <p className={label}>Quarter</p>
        <div className="grid grid-cols-6 gap-1.5">
          {['1st Qtr', '2nd Qtr', 'Halftime', '3rd Qtr', '4th Qtr', 'OT'].map((q) => (
            <button key={q} onClick={() => run(setFields(q, g, { quarter: q, statusText: q }))} className={`${chip(g.quarter === q)} !px-1 !text-[13px]`}>
              {q.replace(' Qtr', '').replace('Halftime', 'Half')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={label}>Ball</p>
        <div className="grid grid-cols-2 gap-2">
          {(['away', 'home'] as Side[]).map((side) => (
            <button key={side} onClick={() => run(setFields('Possession', g, { possession: side }))} className={chip(g.possession === side)}>
              {(side === 'home' ? g.homeTeam : g.awayTeam).shortName} ball
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={label}>Down and distance</p>
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {['1st', '2nd', '3rd', '4th'].map((d) => (
            <button key={d} onClick={() => run(setFields(`${d} down`, g, { down: d, ...(d === '1st' && g.distance !== 'Goal' ? { distance: '10' } : {}) }))} className={chip(g.down === d)}>{d}</button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => run(setFields('Distance', g, { distance: String(Math.max(1, (parseInt(g.distance) || 10) - 1)) }))} className={`${chip(false)} w-12`}>−</button>
          <span className="flex-1 text-center font-display text-2xl text-white tabular">{g.distance || '10'}</span>
          <button onClick={() => run(setFields('Distance', g, { distance: String((parseInt(g.distance) || 0) + 1) }))} className={`${chip(false)} w-12`}>+</button>
          {['5', '10', 'Goal'].map((d) => (
            <button key={d} onClick={() => run(setFields('Distance', g, { distance: d }))} className={chip(g.distance === d)}>{d}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
        <div>
          <label className={label}>Ball on</label>
          <input
            value={ballOn}
            onChange={(e) => setBallOn(e.target.value.toUpperCase())}
            onBlur={() => ballOn !== (g.ballOn || '') && run(setFields('Ball on', g, { ballOn }))}
            placeholder="WST 35"
            className={field}
          />
        </div>
        <button onClick={() => run(setFields('Red zone', g, { redZone: !g.redZone }))} className={`${chip(!!g.redZone)} h-[50px]`}>Red zone</button>
      </div>
    </div>
  );
}

function BasketballPad({ g, run }: { g: GameState; run: (a: Action) => void }) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!g.clockRunning) return;
    const t = setInterval(() => tick((n) => n + 1), 200);
    return () => clearInterval(t);
  }, [g.clockRunning]);
  const left = secondsLeft(g) ?? 480;

  const setCustom = () => {
    const v = prompt('Set clock (m:ss)', displayClock(g) || '8:00');
    if (!v) return;
    const [m, s] = v.split(':').map((x) => parseInt(x) || 0);
    run(clockSet(g, v.includes(':') ? m * 60 + s : m));
  };

  return (
    <div className="space-y-5">
      <div className="bg-panel border border-rule rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-5xl text-white tabular">{displayClock(g) || '8:00'}</span>
          <button
            onClick={() => run(g.clockRunning ? clockStop(g) : clockStart(g))}
            className={`flex items-center gap-2 rounded-lg px-6 py-4 font-display font-semibold uppercase text-xl cursor-pointer ${g.clockRunning ? 'bg-[#E4002B] text-white' : 'bg-ind text-black'}`}
          >
            {g.clockRunning ? <><Pause size={22} /> Stop</> : <><Play size={22} /> Start</>}
          </button>
        </div>
        <div className="grid grid-cols-5 gap-1.5 mt-3">
          <button onClick={() => run(clockSet(g, Math.max(0, left - 10)))} className={chip(false)}>−10s</button>
          <button onClick={() => run(clockSet(g, Math.max(0, left - 1)))} className={chip(false)}>−1s</button>
          <button onClick={() => run(clockSet(g, left + 1))} className={chip(false)}>+1s</button>
          <button onClick={() => run(clockSet(g, 480))} className={chip(false)}>8:00</button>
          <button onClick={setCustom} className={chip(false)}>Set</button>
        </div>
        <p className="text-mute text-[12px] mt-2">Fans' screens count down on their own. You only tap Start and Stop.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(['away', 'home'] as Side[]).map((side) => {
          const fouls = (side === 'home' ? g.homeFouls : g.awayFouls) || 0;
          return (
            <div key={side}>
              <TeamHeader g={g} side={side} />
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => run(score(g, side, 1, 'Free throw'))} className={`${bigBtn} h-16 text-2xl`}>+1</button>
                <button onClick={() => run(score(g, side, 2, 'Field goal'))} className={`${bigBtn} h-16 text-2xl`}>+2</button>
                <button onClick={() => run(score(g, side, 3, '3-pointer'))} className={`${bigBtn} h-16 text-2xl`}>+3</button>
              </div>
              <button onClick={() => run(score(g, side, -1, 'Correction'))} className="w-full mt-2 h-10 rounded-lg border border-white/10 text-mute text-sm cursor-pointer">−1 correction</button>
              <div className="flex items-center justify-between mt-3 bg-panel border border-rule rounded-lg px-2 py-1.5">
                <button onClick={() => run(foul(g, side, -1))} className="w-9 h-9 text-white text-xl cursor-pointer">−</button>
                <span className="text-white text-sm">Fouls <span className={`font-display text-lg tabular ${fouls >= 7 ? 'text-[#FF4D5E]' : ''}`}>{fouls}</span></span>
                <button onClick={() => run(foul(g, side, 1))} className="w-9 h-9 text-white text-xl cursor-pointer">+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <p className={label}>Period</p>
        <div className="grid grid-cols-6 gap-1.5">
          {['1st Qtr', '2nd Qtr', 'Halftime', '3rd Qtr', '4th Qtr', 'OT'].map((q) => (
            <button
              key={q}
              onClick={() =>
                run(setFields(q, g, {
                  quarter: q,
                  statusText: q,
                  ...(q !== g.quarter && q !== 'Halftime' ? { clockRunning: false, clockSeconds: q === 'OT' ? 240 : 480, clock: q === 'OT' ? '4:00' : '8:00' } : {}),
                  ...(q === '3rd Qtr' && g.quarter !== '3rd Qtr' ? { homeFouls: 0, awayFouls: 0 } : {}),
                }))
              }
              className={`${chip(g.quarter === q)} !px-1 !text-[13px]`}
            >
              {q.replace(' Qtr', '').replace('Halftime', 'Half')}
            </button>
          ))}
        </div>
        <p className="text-mute text-[12px] mt-1.5">Changing quarters resets the clock to 8:00 (OT 4:00). Fouls reset at the 3rd quarter.</p>
      </div>
    </div>
  );
}

function VolleyballPad({ g, run }: { g: GameState; run: (a: Action) => void }) {
  const winner = vbSetWinner(g);
  const set = g.vbSet || 1;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-panel border border-rule rounded-lg px-4 py-3">
        <span className="font-display uppercase text-white text-xl">Set {set}</span>
        <span className="text-white/80">
          Sets <span className="font-display tabular text-white">{g.awaySetsWon || 0}-{g.homeSetsWon || 0}</span>
          <span className="text-mute ml-2 text-sm">to {vbTarget(g)}</span>
        </span>
      </div>
      {(g.vbSets || []).length > 0 && (
        <p className="text-mute text-sm">
          {(g.vbSets || []).map((s, i) => `Set ${i + 1}: ${s.away}-${s.home}`).join('   ')}
        </p>
      )}

      {winner && (
        <div className="bg-ind/10 border border-ind rounded-lg p-3 flex items-center justify-between gap-3">
          <span className="text-white text-sm">
            Set {set} to <strong>{(winner === 'home' ? g.homeTeam : g.awayTeam).shortName}</strong>, {Math.max(g.homeTeam.score, g.awayTeam.score)}-{Math.min(g.homeTeam.score, g.awayTeam.score)}
          </span>
          <button onClick={() => run(vbEndSet(g))} className="bg-ind text-black font-display font-semibold uppercase rounded-md px-4 py-2 cursor-pointer shrink-0">End set</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {(['away', 'home'] as Side[]).map((side) => {
          const t = side === 'home' ? g.homeTeam : g.awayTeam;
          return (
            <div key={side}>
              <TeamHeader g={g} side={side} />
              <button onClick={() => run(vbPoint(g, side, 1))} className={`${bigBtn} w-full h-40 flex flex-col items-center justify-center`}>
                <span className="text-6xl tabular">{t.score}</span>
                <span className="text-mute text-sm mt-1">Tap for point</span>
              </button>
              <button onClick={() => t.score > 0 && run(vbPoint(g, side, -1))} className="w-full mt-2 h-10 rounded-lg border border-white/10 text-mute text-sm cursor-pointer">−1 correction</button>
            </div>
          );
        })}
      </div>
      {!winner && (
        <button onClick={() => confirm(`End set ${set} at ${g.awayTeam.score}-${g.homeTeam.score}?`) && run(vbEndSet(g))} className="w-full h-11 rounded-lg border border-white/15 text-white/80 font-display uppercase cursor-pointer">
          End set early
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Scorekeeper() {
  const { loading, user, staff, isStaff } = useStaff();
  const [games, setGames] = useState<GameState[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [gameId, setGameId] = useState<string | null>(() => new URLSearchParams(location.search).get('game'));
  const [game, setGame] = useState<GameState | null>(null);
  const [pending, setPending] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [history, setHistory] = useState<Action[]>([]);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isStaff) return;
    const a = subscribeToGames(setGames);
    const b = subscribeToSchools(setSchools);
    return () => { a(); b(); };
  }, [isStaff]);

  useEffect(() => {
    if (!gameId || !isStaff) return setGame(null);
    return watchGame(gameId, (g, p) => { setGame(g); setPending(p); });
  }, [gameId, isStaff]);

  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const pick = (id: string | null) => {
    setGameId(id);
    setHistory([]);
    const url = id ? `/score?game=${encodeURIComponent(id)}` : '/score';
    window.history.replaceState(null, '', url);
  };

  const flash = (msg: string) => {
    setToast(msg);
    window.clearTimeout((flash as any)._t);
    (flash as any)._t = window.setTimeout(() => setToast(''), 1800);
  };

  const run = (a: Action) => {
    if (!game) return;
    buzz();
    setHistory((h) => [...h.slice(-49), a]);
    flash(a.label);
    // Not awaited: Firestore saves on the phone first and sends when signal returns.
    apply(game.id, a).catch((e) => setError(e?.message || 'Update failed. Check you are signed in as staff.'));
  };

  const undoLast = () => {
    const a = history[history.length - 1];
    if (!game || !a) return;
    buzz();
    setHistory((h) => h.slice(0, -1));
    flash(`Undid: ${a.label}`);
    undo(game.id, a).catch((e) => setError(e?.message || 'Undo failed.'));
  };

  const kind = game ? sportKind(game.sport) : 'football';
  const [, tick] = useState(0);
  useEffect(() => {
    if (!game?.clockRunning) return;
    const t = setInterval(() => tick((n) => n + 1), 500);
    return () => clearInterval(t);
  }, [game?.clockRunning]);


  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-mute"><Loader2 className="animate-spin" /></div>;

  if (!user || !isStaff || !staff) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-panel border border-rule rounded-xl p-6 text-center">
          <img src="/logo.png" alt="IND Sports Media" className="h-12 mx-auto mb-4" />
          <h1 className="font-display font-semibold uppercase text-white text-2xl mb-2">Scorekeeper</h1>
          {user && !isStaff ? (
            <>
              <p className="text-amber-300 text-sm mb-4">{user.email} isn't on the IND team list. Ask an admin to add you in the Newsroom.</p>
              <button className="w-full border border-white/15 rounded-lg py-3 text-white cursor-pointer" onClick={() => signOutStaff()}>Use a different account</button>
            </>
          ) : (
            <button className="w-full bg-ind text-black font-display font-semibold uppercase rounded-lg py-3 cursor-pointer" onClick={() => signInStaff().catch((e) => alert(e.message))}>
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-28 select-none">
      <header className="sticky top-0 z-20 bg-black/95 backdrop-blur border-b border-rule">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center gap-3">
          {game ? (
            <button onClick={() => pick(null)} className="text-white/70 cursor-pointer flex items-center gap-1 text-sm"><ArrowLeft size={18} /> Games</button>
          ) : (
            <a href="/newsroom" className="text-white/70 flex items-center gap-1 text-sm"><ArrowLeft size={18} /> Newsroom</a>
          )}
          <span className="font-display font-semibold uppercase text-white">Scorekeeper</span>
          <span className={`ml-auto flex items-center gap-1.5 text-[12px] ${!online ? 'text-amber-300' : pending ? 'text-mute' : 'text-emerald-400'}`}>
            {online ? <Wifi size={14} /> : <WifiOff size={14} />}
            {!online ? 'No signal, saving on phone' : pending ? 'Sending…' : 'Saved'}
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-4">
        {error && (
          <p className="mb-3 text-red-300 bg-red-950/40 border border-red-800/50 rounded-md px-3 py-2 text-sm" onClick={() => setError('')}>{error}</p>
        )}

        {!gameId && <GamePicker games={games} schools={schools} staffEmail={staff.email} onPick={pick} />}

        {gameId && !game && <p className="text-mute py-10 text-center">Loading game…</p>}

        {game && (
          <div className="space-y-5">
            {/* Scoreboard summary */}
            <div className="bg-panel border border-rule rounded-lg p-4">
              <div className="flex items-center justify-between text-[13px] mb-3">
                <span className="text-ind">{game.sport.replace('Varsity ', '')}</span>
                {game.isLive ? (
                  <span className="text-white"><span className="bg-[#E4002B] text-white font-display px-1.5 rounded-sm mr-2">LIVE</span>{game.quarter}{kind === 'basketball' && ` ${displayClock(game)}`}</span>
                ) : (
                  <span className="text-mute">{game.statusText || game.quarter}</span>
                )}
              </div>
              {(['away', 'home'] as Side[]).map((side) => {
                const t = side === 'home' ? game.homeTeam : game.awayTeam;
                return (
                  <div key={side} className="flex items-center gap-3 py-1">
                    <TeamLogo name={t.name} url={t.logoUrl} color={t.color} className="w-8 h-8" />
                    <span className="flex-1 font-display font-semibold uppercase text-white text-xl truncate">{t.name}</span>
                    <span className="font-display text-4xl text-white tabular">{t.score}</span>
                  </div>
                );
              })}
              {game.lastPlay && <p className="mt-2 text-mute text-[13px] line-clamp-2">{game.lastPlay}</p>}
            </div>

            {!game.isLive && game.quarter !== 'Final' && (
              <button onClick={() => run(startGame(game))} className="w-full bg-[#E4002B] text-white font-display font-semibold uppercase text-xl rounded-lg py-4 cursor-pointer">
                Start game (go live)
              </button>
            )}

            {kind === 'football' && <FootballPad g={game} run={run} />}
            {kind === 'basketball' && <BasketballPad g={game} run={run} />}
            {kind === 'volleyball' && <VolleyballPad g={game} run={run} />}

            <div className="flex flex-wrap gap-2 pt-2">
              <a href={`/?scores=${encodeURIComponent(game.id)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-white/15 rounded-lg px-3 py-2 text-white/80 text-sm">
                <ExternalLink size={14} /> Fan view
              </a>
              <button
                onClick={() => archiveGame(game.id, !game.isArchived).then(() => !game.isArchived && pick(null))}
                className="border border-white/15 rounded-lg px-3 py-2 text-white/80 text-sm cursor-pointer"
              >
                {game.isArchived ? 'Unarchive' : 'Archive game'}
              </button>
              <button
                onClick={() => confirm(`Delete ${game.awayTeam.shortName} at ${game.homeTeam.shortName} for good? This can't be undone.`) && deleteGame(game.id).then(() => pick(null))}
                className="border border-white/15 rounded-lg px-3 py-2 text-red-300 text-sm cursor-pointer"
              >
                Delete game
              </button>
            </div>
          </div>
        )}
      </main>

      {game && (
        <div className="fixed bottom-0 inset-x-0 z-20 bg-black/95 backdrop-blur border-t border-rule">
          {toast && <p className="text-center text-[13px] text-white/80 pt-2 truncate px-4">{toast}</p>}
          <div className="max-w-xl mx-auto px-4 py-3 grid grid-cols-2 gap-3">
            <button
              onClick={undoLast}
              disabled={!history.length}
              className="flex items-center justify-center gap-2 h-14 rounded-lg border border-white/20 text-white font-display font-semibold uppercase text-lg cursor-pointer disabled:opacity-30"
            >
              <Undo2 size={20} /> Undo
            </button>
            {game.isLive ? (
              <button onClick={() => confirm('End the game and mark it Final?') && run(endGame(game))} className="h-14 rounded-lg bg-white text-black font-display font-semibold uppercase text-lg cursor-pointer">
                End game
              </button>
            ) : (
              <button onClick={() => run(startGame(game))} disabled={game.quarter === 'Final'} className="h-14 rounded-lg bg-[#E4002B] text-white font-display font-semibold uppercase text-lg cursor-pointer disabled:opacity-30">
                {game.quarter === 'Final' ? 'Final' : 'Go live'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
