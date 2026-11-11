import { useEffect, useMemo, useRef, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  Camera, Radio, PenSquare, ListChecks, Users, LogOut, Send, Pin, PinOff, Trash2,
  ExternalLink, Loader2, X, ArrowLeft, School as SchoolIcon,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { useStaff, signInStaff, signOutStaff, type StaffProfile } from '../lib/staff';
import {
  SPORTS, type Article, type ArticleDraft, type LiveUpdate, type MediaType,
  subscribeToAllArticles, subscribeToUpdates, saveArticle, setArticleStatus, setArticleLive,
  deleteArticle, postLiveUpdate, setUpdatePinned, deleteLiveUpdate, uploadStoryMedia,
  articleUrl, formatTime,
} from '../lib/articles';
import ShareBar from './ShareBar';
import SchoolsManager from './SchoolsManager';

type Tab = 'live' | 'write' | 'stories' | 'schools' | 'team';

const input =
  'w-full bg-black border border-white/15 focus:border-[#00BFFF] rounded-lg px-3 py-3 text-white text-base outline-none placeholder:text-white/30';
const label = 'block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1.5';
const primaryBtn =
  'inline-flex items-center justify-center gap-2 bg-[#00BFFF] hover:bg-[#00A3D9] disabled:opacity-40 text-black font-display font-black uppercase tracking-wider rounded-lg px-4 py-3 text-sm cursor-pointer';
const ghostBtn =
  'inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-display font-bold uppercase tracking-wider rounded-lg px-4 py-3 text-xs cursor-pointer disabled:opacity-40';

// ---------------------------------------------------------------------------
// Media picker: opens the phone camera roll / camera, uploads, shows progress
// ---------------------------------------------------------------------------
function MediaPicker({
  value,
  onChange,
}: {
  value?: { url: string; type: MediaType } | null;
  onChange: (m: { url: string; type: MediaType } | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  const pick = async (file?: File) => {
    if (!file) return;
    setError('');
    setProgress(0);
    try {
      const media = await uploadStoryMedia(file, setProgress);
      onChange(media);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-white/15 bg-black">
          {value.type === 'video' ? (
            <video src={value.url} controls playsInline className="w-full max-h-72 object-contain" />
          ) : (
            <img src={value.url} alt="" className="w-full max-h-72 object-contain" />
          )}
          <button
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1.5 border border-white/20 cursor-pointer"
            aria-label="Remove media"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
          className={`${ghostBtn} w-full py-4`}
        >
          {progress !== null ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Uploading {progress}%
            </>
          ) : (
            <>
              <Camera size={16} /> Add photo or video
            </>
          )}
        </button>
      )}
      {progress !== null && (
        <div className="h-1.5 bg-white/10 rounded mt-2 overflow-hidden">
          <div className="h-full bg-[#00BFFF] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LIVE tab: post quick updates to an in-progress game
// ---------------------------------------------------------------------------
function LiveDesk({
  staff,
  articles,
  onNewLiveStory,
}: {
  staff: StaffProfile;
  articles: Article[];
  onNewLiveStory: () => void;
}) {
  const liveArticles = articles.filter((a) => a.isLive);
  const [slug, setSlug] = useState<string>('');
  const [text, setText] = useState('');
  const [media, setMedia] = useState<{ url: string; type: MediaType } | null>(null);
  const [posting, setPosting] = useState(false);
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug && liveArticles[0]) setSlug(liveArticles[0].slug);
    if (slug && !liveArticles.find((a) => a.slug === slug)) setSlug(liveArticles[0]?.slug || '');
  }, [liveArticles.map((a) => a.slug).join(',')]);

  useEffect(() => {
    if (!slug) return setUpdates([]);
    return subscribeToUpdates(slug, setUpdates);
  }, [slug]);

  const current = liveArticles.find((a) => a.slug === slug);

  const post = async () => {
    if (!slug || (!text.trim() && !media)) return;
    setPosting(true);
    setError('');
    try {
      await postLiveUpdate(staff, slug, text, media || undefined);
      setText('');
      setMedia(null);
    } catch (e: any) {
      setError(e?.message || 'Could not post. Check your connection and try again.');
    } finally {
      setPosting(false);
    }
  };

  if (!liveArticles.length) {
    return (
      <div className="text-center py-12">
        <Radio className="mx-auto text-white/30 mb-3" size={32} />
        <p className="text-white/70 mb-1 font-bold">No live games right now</p>
        <p className="text-white/40 text-sm mb-6">Start a live story for the game you're at, then post updates here.</p>
        <button onClick={onNewLiveStory} className={primaryBtn}>
          <Radio size={16} /> Start live coverage
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={label}>Posting to</label>
        <select value={slug} onChange={(e) => setSlug(e.target.value)} className={input}>
          {liveArticles.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.status === 'draft' ? '(Draft) ' : ''}
              {a.title}
            </option>
          ))}
        </select>
        {current?.status === 'draft' && (
          <p className="text-amber-300 text-xs mt-2">
            This story is still a draft, so fans can't see it yet.{' '}
            <button className="underline cursor-pointer" onClick={() => setArticleStatus(current.slug, 'published')}>
              Publish it now
            </button>
          </p>
        )}
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-sm p-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="What just happened? e.g. TOUCHDOWN Westfield! 45-yd strike, 28-21 with 2:10 left"
          className={input}
        />
        <MediaPicker value={media} onChange={setMedia} />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button onClick={post} disabled={posting || (!text.trim() && !media)} className={`${primaryBtn} w-full py-4 text-base`}>
          {posting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Post update
        </button>
      </div>

      {current && (
        <div className="flex flex-wrap gap-2">
          <a href={`/news/${current.slug}`} target="_blank" rel="noopener noreferrer" className={ghostBtn}>
            <ExternalLink size={14} /> View live page
          </a>
          <button
            className={ghostBtn}
            onClick={() => {
              if (confirm('End live coverage? The page stays up as a finished story.')) setArticleLive(current.slug, false);
            }}
          >
            End live coverage
          </button>
        </div>
      )}

      <div className="space-y-3">
        {updates.map((u) => (
          <div key={u.id} className={`bg-[#111] border rounded-lg p-3 ${u.pinned ? 'border-[#00BFFF]/60' : 'border-white/10'}`}>
            <div className="flex items-center justify-between text-[11px] text-white/40 mb-1">
              <span>
                {u.authorName} • {formatTime(u.createdAt)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 hover:text-white cursor-pointer"
                  title={u.pinned ? 'Unpin' : 'Pin to top'}
                  onClick={() => setUpdatePinned(slug, u.id, !u.pinned)}
                >
                  {u.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
                <button
                  className="p-1.5 hover:text-red-400 cursor-pointer"
                  title="Delete"
                  onClick={() => confirm('Delete this update?') && deleteLiveUpdate(slug, u.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {u.text && <p className="text-white text-sm whitespace-pre-wrap">{u.text}</p>}
            {u.mediaUrl && u.mediaType === 'image' && <img src={u.mediaUrl} alt="" className="mt-2 rounded max-h-48" />}
            {u.mediaUrl && u.mediaType === 'video' && (
              <video src={u.mediaUrl} controls playsInline className="mt-2 rounded max-h-48" />
            )}
            <div className="mt-2">
              <ShareBar compact url={articleUrl(slug, u.id)} text={u.text || current?.title || 'IND Sports Media'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WRITE tab: full article / recap, or set up a new live story
// ---------------------------------------------------------------------------
const emptyDraft = (isLive = false): ArticleDraft => ({
  title: '',
  excerpt: '',
  body: '',
  sport: 'Football',
  coverUrl: '',
  coverType: 'image',
  isLive,
});

function Editor({
  staff,
  editing,
  startLive,
  onDone,
}: {
  staff: StaffProfile;
  editing: Article | null;
  startLive: boolean;
  onDone: (goTo: Tab) => void;
}) {
  const [draft, setDraft] = useState<ArticleDraft>(() =>
    editing
      ? {
          title: editing.title,
          excerpt: editing.excerpt,
          body: editing.body,
          sport: editing.sport,
          coverUrl: editing.coverUrl,
          coverType: editing.coverType,
          isLive: editing.isLive,
        }
      : emptyDraft(startLive)
  );
  const [saving, setSaving] = useState<null | 'draft' | 'publish'>(null);
  const [error, setError] = useState('');
  const set = <K extends keyof ArticleDraft>(k: K, v: ArticleDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const save = async (publish: boolean) => {
    if (!draft.title.trim()) return setError('Add a headline first.');
    setSaving(publish ? 'publish' : 'draft');
    setError('');
    try {
      await saveArticle(staff, draft, publish, editing);
      onDone(draft.isLive ? 'live' : 'stories');
    } catch (e: any) {
      setError(e?.message || 'Could not save.');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-4">
      {editing && (
        <button onClick={() => onDone('stories')} className="text-white/50 text-xs flex items-center gap-1 cursor-pointer">
          <ArrowLeft size={14} /> Back to stories
        </button>
      )}
      <label className="flex items-center gap-3 bg-red-950/30 border border-red-800/40 rounded-lg p-3 cursor-pointer">
        <input type="checkbox" checked={draft.isLive} onChange={(e) => set('isLive', e.target.checked)} className="w-5 h-5" />
        <span>
          <span className="text-white font-bold text-sm block">Live game coverage</span>
          <span className="text-white/50 text-xs">Shows a LIVE badge and a real-time feed of updates you post from the Live tab.</span>
        </span>
      </label>
      <div>
        <label className={label}>Headline</label>
        <input value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="LIVE: Westfield vs. Carmel" className={input} />
      </div>
      <div>
        <label className={label}>Sport</label>
        <select value={draft.sport} onChange={(e) => set('sport', e.target.value as ArticleDraft['sport'])} className={input}>
          {SPORTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label}>Cover photo or video</label>
        <MediaPicker
          value={draft.coverUrl ? { url: draft.coverUrl, type: draft.coverType || 'image' } : null}
          onChange={(m) => setDraft((d) => ({ ...d, coverUrl: m?.url || '', coverType: m?.type || 'image' }))}
        />
      </div>
      <div>
        <label className={label}>Summary (1–2 sentences, shown on social previews)</label>
        <textarea value={draft.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2} className={input} />
      </div>
      <div>
        <label className={label}>Story {draft.isLive && '(optional for live games — you can write the recap after)'}</label>
        <textarea
          value={draft.body}
          onChange={(e) => set('body', e.target.value)}
          rows={10}
          placeholder="Leave a blank line between paragraphs."
          className={input}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="grid grid-cols-2 gap-2 sticky bottom-3">
        <button onClick={() => save(false)} disabled={!!saving} className={ghostBtn}>
          {saving === 'draft' && <Loader2 size={14} className="animate-spin" />} Save draft
        </button>
        <button onClick={() => save(true)} disabled={!!saving} className={primaryBtn}>
          {saving === 'publish' && <Loader2 size={14} className="animate-spin" />}
          {editing?.status === 'published' ? 'Update' : 'Publish'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// STORIES tab
// ---------------------------------------------------------------------------
function StoryList({ articles, onEdit }: { articles: Article[]; onEdit: (a: Article) => void }) {
  if (!articles.length) return <p className="text-white/40 text-center py-10">No stories yet. Start one in the Write tab.</p>;
  return (
    <div className="space-y-3">
      {articles.map((a) => (
        <div key={a.slug} className="bg-[#111] border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1 text-[10px] font-bold uppercase tracking-wider">
            {a.isLive && <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">Live</span>}
            <span className={a.status === 'published' ? 'text-emerald-400' : 'text-amber-300'}>{a.status}</span>
            <span className="text-white/30">{a.sport}</span>
            <span className="text-white/30 ml-auto normal-case font-normal">{formatTime(a.updatedAt)}</span>
          </div>
          <p className="text-white font-bold text-sm mb-1">{a.title}</p>
          <p className="text-white/40 text-xs mb-3">By {a.authorName}</p>
          <div className="flex flex-wrap gap-2">
            <button className={`${ghostBtn} !py-2`} onClick={() => onEdit(a)}>
              <PenSquare size={13} /> Edit
            </button>
            {a.status === 'published' ? (
              <>
                <a className={`${ghostBtn} !py-2`} href={`/news/${a.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={13} /> View
                </a>
                <button className={`${ghostBtn} !py-2`} onClick={() => setArticleStatus(a.slug, 'draft')}>
                  Unpublish
                </button>
              </>
            ) : (
              <button className={`${ghostBtn} !py-2`} onClick={() => setArticleStatus(a.slug, 'published')}>
                Publish
              </button>
            )}
            {!a.isLive && (
              <button className={`${ghostBtn} !py-2`} onClick={() => setArticleLive(a.slug, true)}>
                <Radio size={13} /> Go live
              </button>
            )}
            <button
              className={`${ghostBtn} !py-2 hover:!text-red-400`}
              onClick={() => confirm(`Delete "${a.title}"? This can't be undone.`) && deleteArticle(a.slug)}
            >
              <Trash2 size={13} />
            </button>
          </div>
          {a.status === 'published' && (
            <div className="mt-3">
              <ShareBar compact url={articleUrl(a.slug)} text={a.title} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TEAM tab (admins): who can post
// ---------------------------------------------------------------------------
function TeamManager({ me }: { me: StaffProfile }) {
  const [team, setTeam] = useState<{ email: string; name: string; role: string }[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'writer' | 'admin'>('writer');
  const [error, setError] = useState('');

  useEffect(
    () =>
      onSnapshot(collection(db, 'staff'), (snap) =>
        setTeam(snap.docs.map((d) => ({ email: d.id, name: d.data().name || '', role: d.data().role || 'writer' })))
      ),
    []
  );

  const add = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return setError('Enter a valid Google email.');
    setError('');
    try {
      await setDoc(doc(db, 'staff', e), { name: name.trim() || e, role });
      setEmail('');
      setName('');
      setRole('writer');
    } catch (err: any) {
      setError(err?.message || 'Could not add.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#141414] border border-white/10 rounded-sm p-4 space-y-3">
        <p className="text-white font-bold text-sm">Add a team member</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="their Google email" className={input} type="email" autoCapitalize="none" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name shown on their posts" className={input} />
        <select value={role} onChange={(e) => setRole(e.target.value as 'writer' | 'admin')} className={input}>
          <option value="writer">Writer — can post, edit and publish</option>
          <option value="admin">Admin — writer + can manage the team</option>
        </select>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button onClick={add} className={`${primaryBtn} w-full`}>
          Add to team
        </button>
      </div>
      <div className="space-y-2">
        {team.map((t) => (
          <div key={t.email} className="flex items-center justify-between bg-[#111] border border-white/10 rounded-lg px-3 py-2">
            <div>
              <p className="text-white text-sm font-bold">{t.name}</p>
              <p className="text-white/40 text-xs">
                {t.email} • {t.role}
              </p>
            </div>
            {t.email !== me.email && (
              <button
                className="p-2 text-white/40 hover:text-red-400 cursor-pointer"
                onClick={() => confirm(`Remove ${t.email}?`) && deleteDoc(doc(db, 'staff', t.email))}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------
export default function Newsroom() {
  const { loading, user, staff, isStaff, isAdmin } = useStaff();
  const [tab, setTab] = useState<Tab>('live');
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [startLive, setStartLive] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!isStaff) return;
    return subscribeToAllArticles(setArticles);
  }, [isStaff]);

  const tabs = useMemo(
    () =>
      [
        { id: 'live' as Tab, label: 'Live', icon: Radio },
        { id: 'write' as Tab, label: 'Write', icon: PenSquare },
        { id: 'stories' as Tab, label: 'Stories', icon: ListChecks },
        { id: 'schools' as Tab, label: 'Schools', icon: SchoolIcon },
        ...(isAdmin ? [{ id: 'team' as Tab, label: 'Team', icon: Users }] : []),
      ],
    [isAdmin]
  );

  const openEditor = (article: Article | null, live = false) => {
    setEditing(article);
    setStartLive(live);
    setEditorKey((k) => k + 1);
    setTab('write');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/50">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user || !isStaff || !staff) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-[#141414] border border-white/15 rounded-sm p-6 text-center">
          <img src="/logo.png" alt="IND Sports Media" className="h-12 mx-auto mb-4" />
          <h1 className="font-display font-bold uppercase text-white text-xl mb-2">IND Newsroom</h1>
          {user && !isStaff ? (
            <>
              <p className="text-amber-300 text-sm mb-4">
                {user.email} isn't on the IND team list yet. Ask an admin to add you, then sign in again.
              </p>
              <button className={`${ghostBtn} w-full`} onClick={() => signOutStaff()}>
                Use a different account
              </button>
            </>
          ) : (
            <>
              <p className="text-white/50 text-sm mb-6">Team sign-in for posting articles and live game updates.</p>
              <button className={`${primaryBtn} w-full`} onClick={() => signInStaff().catch((e) => alert(e.message))}>
                Sign in with Google
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="h-7" />
            <span className="font-display font-bold uppercase text-white text-sm tracking-wider">Newsroom</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/score" className="text-[#00BFFF] text-xs font-bold uppercase tracking-wide border border-[#00BFFF]/50 rounded px-2.5 py-1.5">Scorekeeper</a>
            <span className="text-white/40 text-xs hidden sm:block">{staff.name}</span>
            <button onClick={() => signOutStaff()} className="text-white/40 hover:text-white p-1 cursor-pointer" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5">
        {tab === 'live' && <LiveDesk staff={staff} articles={articles} onNewLiveStory={() => openEditor(null, true)} />}
        {tab === 'write' && (
          <Editor
            key={editorKey}
            staff={staff}
            editing={editing}
            startLive={startLive}
            onDone={(goTo) => {
              setEditing(null);
              setStartLive(false);
              setEditorKey((k) => k + 1);
              setTab(goTo);
            }}
          />
        )}
        {tab === 'stories' && <StoryList articles={articles} onEdit={(a) => openEditor(a)} />}
        {tab === 'schools' && <SchoolsManager />}
        {tab === 'team' && isAdmin && <TeamManager me={staff} />}
      </main>

      {/* Bottom tab bar, thumb-friendly on phones */}
      <nav className="fixed bottom-0 inset-x-0 z-20 bg-[#111]/95 backdrop-blur border-t border-white/10">
        <div className="max-w-2xl mx-auto grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map(({ id, label: l, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                if (id === 'write' && tab !== 'write') openEditor(null);
                else setTab(id);
              }}
              className={`flex flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer ${
                tab === id ? 'text-[#00BFFF]' : 'text-white/50'
              }`}
            >
              <Icon size={20} />
              {l}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

