import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Camera, ExternalLink, Loader2, Trash2, Gauge } from 'lucide-react';
import { useLiveGames } from '../lib/gamesStore';
import { subscribeToSchools, type School } from '../lib/firebase';
import { uploadStoryMedia, newUpdateRef, postAutoUpdate, postLiveUpdate } from '../lib/articles';
import {
  addGameClip, removeGameClip, addGameNote, setScoreAndStatus, gameStatus, sportKind, archiveGame, deleteGame,
  type GameStatus, type Side,
} from '../lib/scorekeeper';
import type { StaffProfile } from '../lib/staff';
import type { GameState, SocialClip } from '../types';
import { GamePicker, EditDetails, StoryLink } from './Scorekeeper';

const field = 'w-full bg-black border border-white/15 focus:border-[#00BFFF] rounded-lg px-3 py-3 text-white text-base outline-none placeholder:text-white/30';
const label = 'block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1.5';
const card = 'bg-[#141414] border border-white/10 rounded-xl p-4 space-y-3';
const primary = 'w-full flex items-center justify-center gap-2 bg-[#00BFFF] text-black font-display font-semibold uppercase rounded-lg py-3 cursor-pointer disabled:opacity-50';

/** Newsroom → Games: fix any game behind the scenes and add media/updates to it. */
export default function NewsroomGames({ staff }: { staff: StaffProfile }) {
  const { games } = useLiveGames();
  const [schools, setSchools] = useState<School[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => subscribeToSchools(setSchools), []);
  const game = games.find((g) => g.id === openId) || null;

  if (!game) {
    return (
      <div className="space-y-4">
        <p className="text-white/60 text-sm">
          Tap any game to change teams, scores, time or status, and to add photos, videos and updates. For scoring a game live, use the{' '}
          <a href="/score" className="text-[#00BFFF] underline">Scorekeeper</a>.
        </p>
        <GamePicker games={games} schools={schools} staffEmail={staff.email} onPick={setOpenId} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={() => setOpenId(null)} className="text-white/60 text-sm flex items-center gap-1 cursor-pointer">
        <ArrowLeft size={16} /> All games
      </button>
      <div>
        <p className="text-[#00BFFF] text-xs">{game.sport}</p>
        <p className="text-white font-display font-semibold uppercase text-xl leading-tight">
          {game.awayTeam.name} at {game.homeTeam.name}
        </p>
      </div>

      <EditDetails g={game} schools={schools} />
      <ScoreFixer g={game} />
      <MediaManager g={game} staff={staff} />
      <NotePoster g={game} staff={staff} />
      <StoryLink g={game} staff={staff} />

      <div className="flex flex-wrap gap-2 pt-1">
        <a href={`/score?game=${encodeURIComponent(game.id)}`} className="flex items-center gap-1.5 border border-white/15 rounded-lg px-3 py-2 text-white/85 text-sm">
          <Gauge size={14} /> Live scorekeeper
        </a>
        <a href={`/?scores=${encodeURIComponent(game.id)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-white/15 rounded-lg px-3 py-2 text-white/85 text-sm">
          <ExternalLink size={14} /> Fan view
        </a>
        <button onClick={() => archiveGame(game.id, !game.isArchived)} className="border border-white/15 rounded-lg px-3 py-2 text-white/85 text-sm cursor-pointer">
          {game.isArchived ? 'Unarchive' : 'Archive'}
        </button>
        <button
          onClick={() => confirm(`Delete ${game.awayTeam.shortName} at ${game.homeTeam.shortName} for good? This can't be undone.`) && deleteGame(game.id).then(() => setOpenId(null))}
          className="border border-white/15 rounded-lg px-3 py-2 text-red-300 text-sm cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function ScoreFixer({ g }: { g: GameState }) {
  const vb = sportKind(g.sport) === 'volleyball';
  const [away, setAway] = useState(String(g.awayTeam.score));
  const [home, setHome] = useState(String(g.homeTeam.score));
  const [awaySets, setAwaySets] = useState(String(g.awaySetsWon || 0));
  const [homeSets, setHomeSets] = useState(String(g.homeSetsWon || 0));
  const [status, setStatus] = useState<GameStatus>(gameStatus(g));
  const [period, setPeriod] = useState(g.quarter || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setAway(String(g.awayTeam.score)); setHome(String(g.homeTeam.score));
    setAwaySets(String(g.awaySetsWon || 0)); setHomeSets(String(g.homeSetsWon || 0));
    setStatus(gameStatus(g)); setPeriod(g.quarter || '');
  }, [g.id, g.awayTeam.score, g.homeTeam.score, g.awaySetsWon, g.homeSetsWon, g.isLive, g.quarter]);

  const save = async () => {
    setBusy(true); setMsg('');
    try {
      await setScoreAndStatus(g, {
        away: Number(away) || 0, home: Number(home) || 0, status, period,
        ...(vb ? { awaySets: Number(awaySets) || 0, homeSets: Number(homeSets) || 0 } : {}),
      });
      setMsg('Saved. Fans see it now.');
    } catch (e: any) {
      setMsg(e?.message || 'Not saved');
    } finally {
      setBusy(false);
    }
  };

  const num = (v: string, set: (s: string) => void) => (
    <input inputMode="numeric" value={v} onChange={(e) => set(e.target.value.replace(/\D/g, ''))} className={`${field} text-center font-display text-2xl`} />
  );

  return (
    <div className={card}>
      <p className="text-white font-semibold">Score and status</p>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={label}>{g.awayTeam.shortName} {vb && '(final sets)'}</label>{vb ? num(awaySets, setAwaySets) : num(away, setAway)}</div>
        <div><label className={label}>{g.homeTeam.shortName} {vb && '(final sets)'}</label>{vb ? num(homeSets, setHomeSets) : num(home, setHome)}</div>
      </div>
      {vb && (
        <div className="grid grid-cols-2 gap-3">
          <div><label className={label}>{g.awayTeam.shortName} points (current set)</label>{num(away, setAway)}</div>
          <div><label className={label}>{g.homeTeam.shortName} points (current set)</label>{num(home, setHome)}</div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {(['upcoming', 'live', 'final'] as GameStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); if (vb && s === 'final') { setAway(awaySets); setHome(homeSets); } }}
            className={`py-2.5 rounded-lg font-display font-semibold uppercase text-sm cursor-pointer border ${status === s ? 'bg-[#00BFFF] text-black border-[#00BFFF]' : 'bg-black text-white border-white/15'}`}
          >
            {s}
          </button>
        ))}
      </div>
      {status === 'live' && (
        <div>
          <label className={label}>Quarter / set</label>
          <input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder={vb ? 'Set 2' : '3rd Qtr'} className={field} />
        </div>
      )}
      {msg && <p className={`text-sm ${msg.startsWith('Saved') ? 'text-emerald-400' : 'text-red-400'}`}>{msg}</p>}
      <button onClick={save} disabled={busy} className={primary}>{busy && <Loader2 size={16} className="animate-spin" />} Save score</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
function MediaManager({ g, staff }: { g: GameState; staff: StaffProfile }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [team, setTeam] = useState<Side | 'neutral'>('neutral');
  const [alsoStory, setAlsoStory] = useState(true);
  const [progress, setProgress] = useState<number | null>(null);
  const [err, setErr] = useState('');
  const clips = (g.socialClips || []).slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  const upload = async (file?: File) => {
    if (!file) return;
    setErr(''); setProgress(0);
    try {
      const media = await uploadStoryMedia(file, setProgress);
      const text = caption.trim();
      const clip: SocialClip = {
        id: `c${Date.now()}`,
        platform: 'upload',
        type: media.type === 'video' ? 'video' : 'photo',
        title: text.split('\n')[0].slice(0, 90) || `${g.awayTeam.shortName} at ${g.homeTeam.shortName}`,
        author: staff.name,
        mediaUrl: media.url,
        ...(media.type === 'image' ? { thumbnailUrl: media.url } : {}),
        caption: text,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        team,
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      await addGameClip(g, clip);
      if (alsoStory && g.articleSlug) await postLiveUpdate(staff, g.articleSlug, text, media);
      setCaption('');
    } catch (e: any) {
      setErr(e?.message || 'Upload failed');
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className={card}>
      <p className="text-white font-semibold">Photos and videos</p>
      <p className="text-white/50 text-[13px] -mt-2">Shows in this game's Live Clips on the scoreboard.</p>
      <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} placeholder="Caption (optional)" className={field} />
      <div className="grid grid-cols-3 gap-2">
        {([['away', g.awayTeam.shortName], ['neutral', 'Both'], ['home', g.homeTeam.shortName]] as [Side | 'neutral', string][]).map(([k, l]) => (
          <button key={k} onClick={() => setTeam(k)} className={`py-2 rounded-lg text-sm cursor-pointer border truncate px-1 ${team === k ? 'bg-white text-black border-white' : 'bg-black text-white/80 border-white/15'}`}>{l}</button>
        ))}
      </div>
      {g.articleSlug && (
        <label className="flex items-center gap-2 text-white/80 text-sm">
          <input type="checkbox" checked={alsoStory} onChange={(e) => setAlsoStory(e.target.checked)} className="w-4 h-4" />
          Also post to the live story
        </label>
      )}
      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      <button onClick={() => fileRef.current?.click()} disabled={progress !== null} className={primary}>
        {progress !== null ? <><Loader2 size={16} className="animate-spin" /> Uploading {progress}%</> : <><Camera size={16} /> Add photo or video</>}
      </button>
      {err && <p className="text-red-400 text-sm">{err}</p>}

      {clips.length > 0 && (
        <div className="grid grid-cols-3 gap-2 pt-1">
          {clips.map((c) => (
            <div key={c.id} className="relative aspect-square bg-black rounded overflow-hidden border border-white/10">
              {c.type === 'video' && !c.thumbnailUrl ? (
                <video src={`${c.mediaUrl}#t=0.5`} muted playsInline preload="metadata" className="w-full h-full object-cover" />
              ) : (
                <img src={c.thumbnailUrl || c.mediaUrl} alt="" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => confirm('Remove this from the game?') && removeGameClip(g, c.id)}
                className="absolute top-1 right-1 bg-black/80 rounded-full p-1.5 text-white/80 cursor-pointer"
                aria-label="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
function NotePoster({ g, staff }: { g: GameState; staff: StaffProfile }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const post = async () => {
    const t = text.trim();
    if (!t) return;
    setBusy(true); setMsg('');
    try {
      await addGameNote(g, 'neutral', t);
      if (g.articleSlug) {
        const ref = newUpdateRef(g.articleSlug);
        await postAutoUpdate(staff, g.articleSlug, ref.id, t);
      }
      setText('');
      setMsg(g.articleSlug ? 'Posted to the scoreboard and the live story.' : 'Posted to the scoreboard.');
    } catch (e: any) {
      setMsg(e?.message || 'Not posted');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={card}>
      <p className="text-white font-semibold">Post an update</p>
      <p className="text-white/50 text-[13px] -mt-2">Shows as the game's "Last play"{g.articleSlug ? ' and in the live story' : ''}.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Westfield and Crown Point advance to Saturday's championship." className={field} />
      {msg && <p className={`text-sm ${msg.startsWith('Posted') ? 'text-emerald-400' : 'text-red-400'}`}>{msg}</p>}
      <button onClick={post} disabled={busy || !text.trim()} className={primary}>{busy && <Loader2 size={16} className="animate-spin" />} Post update</button>
    </div>
  );
}
