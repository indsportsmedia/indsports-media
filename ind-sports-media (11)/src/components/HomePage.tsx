import { useEffect, useState } from 'react';
import { subscribeToPublishedArticles, formatTime, type Article } from '../lib/articles';
import TournamentCentral from './TournamentCentral';

type SportKey = 'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football';

interface HomePageProps {
  onOpenScores: (gameId?: string) => void;
  onOpenArticles: (sport?: string) => void;
  onOpenSport: (sport: SportKey) => void;
  onOpenPhotos: () => void;
  onOpenAthletes: () => void;
  onOpenPartners: () => void;
}

const SPORTS: { key: SportKey; season: string }[] = [
  { key: 'Football', season: 'Fall' },
  { key: 'Volleyball', season: 'Fall' },
  { key: 'Basketball', season: 'Winter' },
  { key: 'Wrestling', season: 'Winter' },
  { key: 'Flag Football', season: 'Spring' },
];

function LiveTag() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#E4002B] text-white font-display font-bold text-[13px] tracking-wide px-2 py-0.5 rounded-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse motion-reduce:animate-none" aria-hidden />
      LIVE
    </span>
  );
}

function Cover({ a, className = '' }: { a: Article; className?: string }) {
  if (a.coverUrl && a.coverType === 'video') {
    return <video src={a.coverUrl} muted playsInline preload="metadata" className={`w-full h-full object-cover ${className}`} />;
  }
  if (a.coverUrl) return <img src={a.coverUrl} alt="" className={`w-full h-full object-cover ${className}`} />;
  return (
    <div className={`w-full h-full bg-panel flex items-center justify-center ${className}`}>
      <img src="/logo.png" alt="" className="w-1/3 opacity-30" />
    </div>
  );
}

const go = (slug: string) => (window.location.href = `/news/${slug}`);

export default function HomePage(p: HomePageProps) {
  const [stories, setStories] = useState<Article[] | null>(null);
  useEffect(() => subscribeToPublishedArticles(setStories), []);

  const live = (stories || []).filter((s) => s.isLive);
  const lead = live[0] || stories?.[0];
  const rail = (stories || []).filter((s) => s !== lead).slice(0, 6);
  const more = (stories || []).filter((s) => s !== lead && !rail.includes(s)).slice(0, 3);

  return (
    <div className="bg-black">
      {/* ---------------- Top stories ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-8">
          {/* Lead */}
          <div className="lg:col-span-8">
            {stories === null ? (
              <div className="aspect-video bg-panel animate-pulse motion-reduce:animate-none" />
            ) : lead ? (
              <button onClick={() => go(lead.slug)} className="group block text-left w-full cursor-pointer">
                <div className="aspect-video overflow-hidden bg-panel">
                  <Cover a={lead} className="group-hover:scale-[1.015] transition-transform duration-500" />
                </div>
                <div className="flex items-center gap-3 mt-4 text-[14px]">
                  {lead.isLive && <LiveTag />}
                  <span className="text-ind font-semibold">{lead.sport}</span>
                  <span className="text-mute">{lead.isLive ? `Updated ${formatTime(lead.updatedAt)}` : formatTime(lead.publishedAt)}</span>
                </div>
                <h1 className="mt-2 font-display font-bold text-white text-[34px] sm:text-[44px] lg:text-[52px] leading-[1.08] group-hover:text-ind transition-colors max-w-[22ch]">
                  {lead.title}
                </h1>
                {lead.excerpt && <p className="mt-3 text-white/75 text-[17px] leading-relaxed max-w-[62ch]">{lead.excerpt}</p>}
                <p className="mt-3 text-mute text-sm">By {lead.authorName}</p>
              </button>
            ) : (
              <div className="border-t-4 border-ind pt-6">
                <h1 className="font-display font-bold text-white text-[40px] sm:text-[56px] leading-[1.04] max-w-[16ch]">
                  Indiana high school sports, covered live.
                </h1>
                <p className="mt-4 text-white/70 text-lg max-w-[52ch]">
                  Scores, sideline photos, highlights and game stories from across the state, posted while the game is still going.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => p.onOpenScores()} className="bg-ind hover:bg-white text-black font-display font-bold text-lg px-5 py-2 rounded-sm cursor-pointer transition-colors">
                    Today's scores
                  </button>
                  <button onClick={p.onOpenPhotos} className="border border-white/30 hover:border-white text-white font-display font-bold text-lg px-5 py-2 rounded-sm cursor-pointer transition-colors">
                    Game photos
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right rail */}
          <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
            <div className="flex items-baseline justify-between border-b-2 border-white pb-2 mb-1">
              <h2 className="font-display font-bold text-xl text-white">Latest</h2>
              <button onClick={() => p.onOpenArticles('All')} className="text-sm text-ind hover:text-white cursor-pointer">
                All stories
              </button>
            </div>
            {stories !== null && rail.length === 0 && (
              <p className="text-mute text-sm py-4">New stories from game nights will show up here.</p>
            )}
            <ul>
              {rail.map((s) => (
                <li key={s.slug} className="border-b border-rule">
                  <button onClick={() => go(s.slug)} className="group w-full text-left py-3.5 cursor-pointer flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[13px] mb-1">
                        {s.isLive && <LiveTag />}
                        <span className="text-ind font-semibold">{s.sport}</span>
                        <span className="text-mute">{formatTime(s.isLive ? s.updatedAt : s.publishedAt)}</span>
                      </div>
                      <p className="font-display font-semibold text-[19px] leading-tight text-white group-hover:text-ind transition-colors">
                        {s.title}
                      </p>
                    </div>
                    {s.coverUrl && s.coverType !== 'video' && (
                      <img src={s.coverUrl} alt="" className="w-20 h-14 object-cover shrink-0 mt-1" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => p.onOpenScores()}
              className="mt-5 w-full flex items-center justify-between bg-panel hover:bg-[#1a1d20] border border-rule px-4 py-3 rounded-sm cursor-pointer transition-colors"
            >
              <span className="font-display font-bold text-lg text-white">Live scoreboard</span>
              <span className="text-ind text-sm">Open</span>
            </button>
          </aside>
        </div>

        {more.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-rule">
            {more.map((s) => (
              <button key={s.slug} onClick={() => go(s.slug)} className="group text-left cursor-pointer">
                <div className="aspect-[16/10] overflow-hidden bg-panel"><Cover a={s} /></div>
                <p className="mt-3 text-[13px]"><span className="text-ind font-semibold">{s.sport}</span> <span className="text-mute ml-1">{formatTime(s.publishedAt)}</span></p>
                <p className="mt-1 font-display font-semibold text-xl leading-tight text-white group-hover:text-ind transition-colors">{s.title}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- Tournament central (existing) ---------------- */}
      <section id="tournament-hub" className="border-y border-rule">
        <TournamentCentral onNavigateToGame={(id) => p.onOpenScores(id)} onNavigateToLiveScoreboard={() => p.onOpenScores()} />
      </section>

      {/* ---------------- Sports index ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display font-bold text-2xl text-white mb-5">Coverage by sport</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-t border-l border-rule">
          {SPORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => p.onOpenSport(s.key)}
              className="group text-left border-r border-b border-rule px-5 py-6 hover:bg-panel transition-colors cursor-pointer"
            >
              <span className="block text-mute text-sm">{s.season}</span>
              <span className="block font-display font-bold text-2xl text-white group-hover:text-ind transition-colors">{s.key}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-[15px]">
          <button onClick={p.onOpenPhotos} className="text-white/80 hover:text-ind cursor-pointer underline-offset-4 hover:underline">Photo galleries</button>
          <button onClick={p.onOpenAthletes} className="text-white/80 hover:text-ind cursor-pointer underline-offset-4 hover:underline">Athlete features</button>
          <button onClick={() => p.onOpenArticles('All')} className="text-white/80 hover:text-ind cursor-pointer underline-offset-4 hover:underline">Stories and recaps</button>
        </div>
      </section>

      {/* ---------------- For schools (the one loud moment) ---------------- */}
      <section className="bg-ind text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-display font-extrabold text-[40px] sm:text-[56px] leading-[1.04] max-w-[18ch]">
              Your games deserve coverage like this.
            </h2>
            <p className="mt-4 text-[18px] leading-relaxed max-w-[56ch] text-black/80">
              We partner with athletic directors to cover home games and postseason runs: live updates, sideline photos,
              highlight video and stories your community and recruiters can find.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <button onClick={p.onOpenPartners} className="bg-black hover:bg-white text-white hover:text-black font-display font-bold text-xl px-6 py-3 rounded-sm cursor-pointer transition-colors">
              Partner with IND
            </button>
            <a href="tel:+13174201722" className="border-2 border-black hover:bg-black hover:text-white font-display font-bold text-xl px-6 py-[10px] rounded-sm transition-colors">
              (317) 420-1722
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
