import { useEffect, useState } from 'react';
import { subscribeToPublishedArticles, formatTime, type Article } from '../lib/articles';

const SPORT_FILTERS = ['All', 'Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football'];

const go = (slug: string) => (window.location.href = `/news/${slug}`);

function Thumb({ a }: { a: Article }) {
  if (a.coverUrl && a.coverType !== 'video') return <img src={a.coverUrl} alt="" className="w-full h-full object-cover" />;
  if (a.coverUrl) return <video src={a.coverUrl} muted playsInline preload="metadata" className="w-full h-full object-cover" />;
  return <div className="w-full h-full bg-panel flex items-center justify-center"><img src="/logo.png" alt="" className="w-1/3 opacity-30" /></div>;
}

/** News index: published stories from the Newsroom, live games first. */
export const ArticlesSection = ({ initialSport = 'All' }: { initialSport?: string }) => {
  const [sport, setSport] = useState(initialSport);
  const [stories, setStories] = useState<Article[] | null>(null);
  useEffect(() => subscribeToPublishedArticles(setStories), []);

  const all = stories || [];
  const filtered = (sport === 'All' ? all : all.filter((a) => a.sport.toLowerCase() === sport.toLowerCase()))
    .slice()
    .sort((a, b) => Number(b.isLive) - Number(a.isLive));

  return (
    <div className="pt-16 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-white pb-3">
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white">News</h1>
          <div className="flex flex-wrap gap-1" role="tablist" aria-label="Filter by sport">
            {SPORT_FILTERS.map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={sport === s}
                onClick={() => setSport(s)}
                className={`px-3 py-1.5 text-[15px] font-semibold rounded-sm cursor-pointer transition-colors ${
                  sport === s ? 'bg-white text-black' : 'text-white/70 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {stories === null && <p className="text-mute py-16">Loading stories…</p>}
        {stories !== null && filtered.length === 0 && (
          <p className="text-mute py-16">No {sport === 'All' ? '' : `${sport.toLowerCase()} `}stories yet. Check back on game night.</p>
        )}

        <ul>
          {filtered.map((a) => (
            <li key={a.slug} className="border-b border-rule">
              <button onClick={() => go(a.slug)} className="group w-full text-left py-6 grid grid-cols-[1fr_auto] sm:grid-cols-[240px_1fr] gap-5 cursor-pointer">
                <div className="order-2 sm:order-1 w-28 sm:w-full aspect-[16/10] overflow-hidden bg-panel">
                  <Thumb a={a} />
                </div>
                <div className="order-1 sm:order-2 min-w-0">
                  <div className="flex items-center gap-3 text-[14px] mb-1.5">
                    {a.isLive && (
                      <span className="bg-[#E4002B] text-white font-display font-bold text-[13px] px-2 py-0.5 rounded-sm">LIVE</span>
                    )}
                    <span className="text-ind font-semibold">{a.sport}</span>
                    <span className="text-mute">{formatTime(a.isLive ? a.updatedAt : a.publishedAt)}</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-[28px] leading-tight text-white group-hover:text-ind transition-colors">
                    {a.title}
                  </h2>
                  {a.excerpt && <p className="hidden sm:block mt-2 text-white/70 leading-relaxed max-w-[70ch]">{a.excerpt}</p>}
                  <p className="mt-2 text-mute text-sm">By {a.authorName}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArticlesSection;
