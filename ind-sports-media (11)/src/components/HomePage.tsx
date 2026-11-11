import { useEffect, useState } from 'react';
import { Camera, Star, Newspaper, Megaphone } from 'lucide-react';
import { IndLogo } from './IndLogo';
import { subscribeToPublishedArticles, formatTime, type Article } from '../lib/articles';
import GamesBoard from './GamesBoard';

type SportKey = 'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football';

interface HomePageProps {
  onOpenScores: (gameId?: string) => void;
  onOpenArticles: (sport?: string) => void;
  onOpenSport: (sport: SportKey) => void;
  onOpenPhotos: () => void;
  onOpenAthletes: () => void;
  onOpenPartners: () => void;
  onOpenAdvertise: () => void;
}

// Hero background clips. Swap these for IND's own game footage (upload to
// Firebase Storage and paste the links) when you have it.
const HERO_VIDEOS = [
  {
    sport: 'Football',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-american-football-match-under-the-rain-40348-large.mp4',
    poster: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=1920',
  },
  {
    sport: 'Basketball',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-basketball-player-dunking-40018-large.mp4',
    poster: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1920',
  },
  {
    sport: 'Track and field',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-athletes-in-a-running-race-40351-large.mp4',
    poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1920',
  },
];

const PILLARS = [
  { title: 'Professional capture', body: 'High-quality photo and video that keeps every big moment, from warmups to the final whistle.' },
  { title: 'Athlete exposure', body: 'Media built to show off performance, skills and accomplishments to fans, schools and recruiters.' },
  { title: 'Social-ready content', body: 'Vertical and widescreen cuts ready to post on Instagram, TikTok, X and recruiting profiles.' },
];

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
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => subscribeToPublishedArticles(setStories), []);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_VIDEOS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const sorted = (stories || []).slice().sort((a, b) => Number(b.isLive) - Number(a.isLive));
  const live = sorted.find((s) => s.isLive);
  const latest = sorted.slice(0, 4);
  const hero = HERO_VIDEOS[heroIdx];

  const HUB = [
    { icon: Camera, title: 'Action photos', body: 'Sideline galleries from football, basketball, volleyball and more.', onClick: p.onOpenPhotos },
    { icon: Star, title: 'Athlete features', body: 'Spotlights on the players driving Indiana programs.', onClick: p.onOpenAthletes },
    { icon: Newspaper, title: 'Stories and recaps', body: 'Live game coverage, recaps and tournament previews.', onClick: () => p.onOpenArticles('All') },
    { icon: Megaphone, title: 'Advertise with us', body: 'Reach Indiana sports fans on game night and on social.', onClick: p.onOpenAdvertise },
  ];

  return (
    <div className="bg-black">
      {/* ---------------- Hero ---------------- */}
      <section className="relative min-h-[78vh] sm:min-h-[86vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            key={hero.url}
            autoPlay
            loop
            muted
            playsInline
            poster={hero.poster}
            className="w-full h-full object-cover opacity-55"
          >
            <source src={hero.url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <IndLogo size="xl" className="mb-8" />
          <h1 className="font-display font-bold uppercase text-white text-[40px] sm:text-6xl lg:text-7xl leading-[1.02] tracking-[0.01em] max-w-[18ch]">
            Capturing the pulse of sports
          </h1>
          <p className="mt-5 text-white/80 text-lg sm:text-xl max-w-[48ch]">
            Indiana high school and college sports, covered live with scores, photos, highlights and stories.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={p.onOpenPartners} className="bg-ind hover:bg-white text-black font-display font-semibold uppercase tracking-wide text-lg px-8 py-3 rounded-sm transition-colors cursor-pointer">
              Partner with us
            </button>
            <button onClick={() => p.onOpenScores()} className="border-2 border-white/70 hover:border-white hover:bg-white hover:text-black text-white font-display font-semibold uppercase tracking-wide text-lg px-8 py-[10px] rounded-sm transition-colors cursor-pointer">
              Live scores
            </button>
          </div>
          <div className="mt-8 flex items-center gap-2.5">
            {HERO_VIDEOS.map((v, i) => (
              <button
                key={v.sport}
                onClick={() => setHeroIdx(i)}
                aria-label={`Show ${v.sport} video`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${i === heroIdx ? 'w-8 bg-ind' : 'w-3 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>

        {live && (
          <button
            onClick={() => go(live.slug)}
            className="absolute bottom-0 inset-x-0 z-10 bg-black/85 border-t border-rule hover:bg-black cursor-pointer"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 text-left">
              <LiveTag />
              <span className="font-display font-semibold text-white text-lg truncate">{live.title}</span>
              <span className="ml-auto text-ind text-sm shrink-0">Follow live</span>
            </div>
          </button>
        )}
      </section>

      {/* ---------------- Latest stories ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-baseline justify-between border-b-2 border-white pb-2 mb-6">
          <h2 className="font-display font-semibold uppercase text-2xl text-white">Latest stories</h2>
          <button onClick={() => p.onOpenArticles('All')} className="text-ind hover:text-white text-[15px] cursor-pointer">
            All stories
          </button>
        </div>
        {stories === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[16/10] bg-panel animate-pulse motion-reduce:animate-none" />)}
          </div>
        ) : latest.length === 0 ? (
          <p className="text-mute">Game-night stories will show up here. Follow along on the <button onClick={() => p.onOpenScores()} className="text-ind underline cursor-pointer">live scoreboard</button> in the meantime.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((s) => (
              <button key={s.slug} onClick={() => go(s.slug)} className="group text-left cursor-pointer">
                <div className="aspect-[16/10] overflow-hidden bg-panel relative">
                  <Cover a={s} className="group-hover:scale-[1.02] transition-transform duration-500" />
                  {s.isLive && <span className="absolute top-2 left-2"><LiveTag /></span>}
                </div>
                <p className="mt-3 text-[13px]">
                  <span className="text-ind font-semibold">{s.sport}</span>
                  <span className="text-mute ml-2">{formatTime(s.isLive ? s.updatedAt : s.publishedAt)}</span>
                </p>
                <p className="mt-1 font-display font-semibold text-xl leading-snug text-white group-hover:text-ind transition-colors">{s.title}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- Games (live from the Scorekeeper) ---------------- */}
      <section id="games" className="border-y border-rule">
        <GamesBoard onOpenGame={(id) => p.onOpenScores(id)} />
      </section>

      {/* ---------------- The IND standard ---------------- */}
      <section className="bg-panel border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold uppercase text-4xl sm:text-5xl text-white">The IND standard</h2>
            <p className="mt-3 text-white/70 text-lg leading-relaxed">
              Independent, high-quality sports media built to celebrate Indiana athletes at every level.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            {PILLARS.map((x) => (
              <div key={x.title} className="border-t-[3px] border-ind pt-5">
                <h3 className="font-display font-semibold uppercase text-2xl text-white">{x.title}</h3>
                <p className="mt-2 text-white/70 leading-relaxed">{x.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Quick hub ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HUB.map(({ icon: Icon, title, body, onClick }) => (
            <button key={title} onClick={onClick} className="group text-left border border-rule hover:border-ind bg-black p-6 rounded-sm transition-colors cursor-pointer">
              <Icon size={26} className="text-ind" />
              <h3 className="mt-4 font-display font-semibold uppercase text-xl text-white group-hover:text-ind transition-colors">{title}</h3>
              <p className="mt-1.5 text-white/65 text-[15px] leading-relaxed">{body}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- Sports index ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <h2 className="font-display font-semibold uppercase text-2xl text-white mb-5">Coverage by sport</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-t border-l border-rule">
          {SPORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => p.onOpenSport(s.key)}
              className="group text-left border-r border-b border-rule px-5 py-6 hover:bg-panel transition-colors cursor-pointer"
            >
              <span className="block text-mute text-sm">{s.season}</span>
              <span className="block font-display font-semibold uppercase text-2xl text-white group-hover:text-ind transition-colors">{s.key}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- For schools ---------------- */}
      <section className="bg-ind text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <h2 className="font-display font-bold uppercase text-[40px] sm:text-[54px] leading-[1.04] max-w-[18ch]">
              Your games deserve coverage like this
            </h2>
            <p className="mt-4 text-[18px] leading-relaxed max-w-[56ch] text-black/80">
              We partner with athletic directors to cover home games and postseason runs: live updates, sideline photos,
              highlight video and stories your community and recruiters can find.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <button onClick={p.onOpenPartners} className="bg-black hover:bg-white text-white hover:text-black font-display font-semibold uppercase tracking-wide text-xl px-6 py-3 rounded-sm cursor-pointer transition-colors">
              Partner with IND
            </button>
            <a href="tel:+13174201722" className="border-2 border-black hover:bg-black hover:text-white font-display font-semibold text-xl px-6 py-[10px] rounded-sm transition-colors tabular">
              (317) 420-1722
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
