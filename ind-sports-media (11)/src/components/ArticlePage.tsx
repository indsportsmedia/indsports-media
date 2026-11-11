import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Pin, Loader2 } from 'lucide-react';
import {
  type Article, type LiveUpdate, subscribeToArticle, subscribeToUpdates, articleUrl, formatTime, readTime,
} from '../lib/articles';
import ShareBar from './ShareBar';

/** Public page for one story: indsports.media/news/{slug} */
export default function ArticlePage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null | undefined>(undefined);
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  const seen = useRef<Set<string> | null>(null);
  const [, forceTick] = useState(0);

  useEffect(() => subscribeToArticle(slug, setArticle), [slug]);
  useEffect(
    () =>
      subscribeToUpdates(slug, (list) => {
        // Briefly highlight updates that arrive while the page is open.
        if (seen.current) {
          const fresh = list.filter((u) => !seen.current!.has(u.id)).map((u) => u.id);
          if (fresh.length) {
            setFreshIds(new Set(fresh));
            setTimeout(() => setFreshIds(new Set()), 4000);
          }
        }
        seen.current = new Set(list.map((u) => u.id));
        setUpdates(list);
      }),
    [slug]
  );

  // Keep "5m ago" labels current.
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  // Jump to a shared update (#u-{id}) once it loads.
  useEffect(() => {
    if (!updates.length || !window.location.hash.startsWith('#u-')) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [updates.length > 0]);

  useEffect(() => {
    if (article) document.title = `${article.isLive ? 'LIVE: ' : ''}${article.title} | IND Sports Media`;
  }, [article?.title, article?.isLive]);

  const ordered = useMemo(
    () => [...updates.filter((u) => u.pinned), ...updates.filter((u) => !u.pinned)],
    [updates]
  );

  if (article === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (article === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center p-6">
        <p className="text-white text-3xl font-display font-bold mb-2">Story not found</p>
        <p className="text-white/50 mb-6">It may have been moved or taken down.</p>
        <a href="/" className="text-[#00BFFF] underline">Back to IND Sports Media</a>
      </div>
    );
  }

  const paragraphs = article.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white/70 hover:text-white text-sm">
            <ArrowLeft size={16} /> <img src="/logo.png" alt="IND Sports Media" className="h-7" />
          </a>
          {article.isLive && (
            <span className="flex items-center gap-1.5 bg-[#E4002B] text-white font-display font-bold text-[13px] px-2 py-0.5 rounded-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live
            </span>
          )}
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 pb-20">
        {article.coverUrl && (
          <div className="mt-6 overflow-hidden border border-white/10 bg-black">
            {article.coverType === 'video' ? (
              <video src={article.coverUrl} controls playsInline className="w-full max-h-[70vh] object-contain" />
            ) : (
              <img src={article.coverUrl} alt="" className="w-full max-h-[70vh] object-cover" />
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
          <span className="text-ind font-semibold text-[14px]">{article.sport}</span>
          <span>By <strong className="text-white">{article.authorName}</strong></span>
          <span>{formatTime(article.publishedAt)}</span>
          {paragraphs.length > 0 && (
            <>
              <span>{readTime(article.body)}</span>
            </>
          )}
        </div>

        <h1 className="mt-3 text-[34px] sm:text-[48px] font-display font-bold leading-[1.02] max-w-[24ch]">{article.title}</h1>
        {article.excerpt && <p className="mt-3 text-white/70 text-lg leading-relaxed">{article.excerpt}</p>}

        <div className="mt-5">
          <ShareBar url={articleUrl(article.slug)} text={`${article.isLive ? 'LIVE: ' : ''}${article.title}`} />
        </div>

        {paragraphs.length > 0 && (
          <div className="mt-8 space-y-5 text-white/85 text-[18px] leading-[1.65] max-w-[66ch]">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-wrap">{p}</p>
            ))}
          </div>
        )}

        {(article.isLive || ordered.length > 0) && (
          <section className="mt-10">
            <h2 className="font-display font-bold text-2xl text-white mb-4 flex items-baseline gap-3 border-b-2 border-white pb-2">
              {article.isLive ? 'Live updates' : 'Game updates'}
              {article.isLive && <span className="font-sans text-sm font-normal text-mute">Updates appear automatically</span>}
            </h2>
            {ordered.length === 0 && <p className="text-white/40 text-sm">Coverage starts soon. Stay on this page.</p>}
            <ol className="relative border-l border-white/10 ml-2 space-y-6">
              {ordered.map((u) => (
                <li
                  key={u.id}
                  id={`u-${u.id}`}
                  className={`ml-5 rounded-sm p-4 transition-colors duration-1000 ${
                    freshIds.has(u.id) ? 'bg-[#00BFFF]/15' : u.pinned ? 'bg-white/5' : ''
                  }`}
                >
                  <span className="absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full bg-[#00BFFF]" />
                  <div className="flex items-center gap-2 text-[11px] text-white/40 mb-1">
                    {u.pinned && (
                      <span className="flex items-center gap-1 text-ind font-semibold">
                        <Pin size={11} /> Pinned
                      </span>
                    )}
                    <span>{formatTime(u.createdAt)}</span>
                    <span>{u.authorName}</span>
                  </div>
                  {u.text && <p className="text-white text-[17px] leading-relaxed whitespace-pre-wrap">{u.text}</p>}
                  {u.mediaUrl && u.mediaType === 'image' && (
                    <img src={u.mediaUrl} alt="" loading="lazy" className="mt-3 w-full max-h-[70vh] object-contain bg-black" />
                  )}
                  {u.mediaUrl && u.mediaType === 'video' && (
                    <video src={u.mediaUrl} controls playsInline preload="metadata" className="mt-3 w-full max-h-[70vh] bg-black" />
                  )}
                  <div className="mt-3">
                    <ShareBar compact url={articleUrl(article.slug, u.id)} text={u.text || article.title} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </div>
  );
}
