import React, { useEffect, useState } from 'react';
import { Newspaper, Calendar, ChevronRight } from 'lucide-react';
import { subscribeToPublishedArticles, readTime, type Article as StoredArticle } from '../lib/articles';

// Card shape used by this page. Stories now come from Firestore (written in /newsroom)
// instead of being typed into the code.
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  sport: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  isLive?: boolean;
}

function toCard(a: StoredArticle): Article {
  return {
    id: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    sport: a.sport,
    author: a.authorName,
    authorRole: 'IND Sports Media',
    date: a.publishedAt ? a.publishedAt.toDate().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
    readTime: a.isLive ? 'Live coverage' : readTime(a.body || ''),
    image: a.coverType === 'video' ? '' : a.coverUrl || '',
    featured: a.isLive,
    isLive: a.isLive,
  };
}

export const ArticlesSection: React.FC<{ initialSport?: string }> = ({ initialSport = 'All' }) => {
  const [selectedSport, setSelectedSport] = useState<string>(initialSport);
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => subscribeToPublishedArticles((list) => setArticles(list.map(toCard))), []);

  const sportsList = ['All', 'Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football'];
  const all = articles || [];

  const filteredArticles = selectedSport === 'All'
    ? all
    : all.filter(a => a.sport.toLowerCase() === selectedSport.toLowerCase());

  // Live games lead the page; otherwise the newest story.
  const featuredArticle = all.find(a => a.featured) || all[0];
  const gridArticles = selectedSport === 'All' ? filteredArticles.filter(a => a !== featuredArticle) : filteredArticles;
  const setActiveArticle = (a: Article) => { window.location.href = `/news/${a.id}`; };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-bold uppercase tracking-widest mb-4">
          <Newspaper size={14} /> IND Sports Media Editorial
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black uppercase text-white tracking-tight mb-4">
          Articles & <span className="text-[#00BFFF]">Game Recaps</span>
        </h1>
        <p className="text-white/60 font-sans text-base leading-relaxed">
          Sideline reporting, tournament analytics, scouting breakdowns, and inside stories from the high school and youth sports landscape.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
        {sportsList.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-5 py-2.5 rounded-sm font-display text-xs uppercase tracking-widest font-bold transition-all cursor-pointer border ${
              selectedSport === sport
                ? 'bg-[#00BFFF] text-black border-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.4)]'
                : 'bg-white/5 text-white/70 border-white/10 hover:border-[#00BFFF]/40 hover:text-white'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Featured Headline Story */}
      {selectedSport === 'All' && featuredArticle && (
        <div 
          onClick={() => setActiveArticle(featuredArticle)}
          className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl mb-14 cursor-pointer group hover:border-[#00BFFF]/60 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative aspect-16/9 lg:aspect-auto overflow-hidden">
              <img
                src={featuredArticle.image || '/logo.png'}
                alt={featuredArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 bg-[#00BFFF] text-black text-xs font-black uppercase px-3 py-1 rounded">
                Featured Cover Story
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-bold text-[#00BFFF] uppercase tracking-wider mb-3">
                  <span>{featuredArticle.sport}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase leading-tight mb-4 group-hover:text-[#00BFFF] transition-colors">
                  {featuredArticle.title}
                </h2>

                <p className="text-white/60 font-sans text-sm leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-xs">{featuredArticle.author}</div>
                  <div className="text-white/40 text-[10px]">{featuredArticle.authorRole}</div>
                </div>
                <span className="text-[#00BFFF] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  Read Article <ChevronRight size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {articles === null && (
        <p className="text-center text-white/40 py-16">Loading stories…</p>
      )}
      {articles !== null && filteredArticles.length === 0 && (
        <p className="text-center text-white/40 py-16">No {selectedSport === 'All' ? '' : selectedSport + ' '}stories yet. Check back on game night.</p>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gridArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="bg-[#111111] border border-white/10 hover:border-[#00BFFF]/50 rounded-lg overflow-hidden flex flex-col justify-between p-0 cursor-pointer group transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="relative aspect-16/9 overflow-hidden">
                <img
                  src={article.image || '/logo.png'}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-[#00BFFF] border border-[#00BFFF]/30">
                  {article.sport}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] text-white/40 mb-2">
                  <Calendar size={12} /> {article.date} • {article.readTime}
                </div>
                <h3 className="text-white font-display font-bold text-lg mb-3 line-clamp-2 group-hover:text-[#00BFFF] transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-white/60 text-xs font-sans line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4 text-xs">
              <span className="text-white/50 text-[11px]">By {article.author}</span>
              <span className="text-[#00BFFF] font-black uppercase tracking-wider text-[11px] flex items-center gap-1">
                Read <ChevronRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ArticlesSection;
