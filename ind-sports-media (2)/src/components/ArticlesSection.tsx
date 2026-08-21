import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Clock, User, Calendar, Tag, ChevronRight, X, ArrowLeft, Share2 } from 'lucide-react';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  sport: 'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football';
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const ARTICLES_DATA: Article[] = [
  {
    id: 'art-1',
    title: 'Trinity League Showdown: How Mater Dei Stifled Centennial in Defensive Masterclass',
    excerpt: 'Behind an aggressive front seven and timely red-zone takeaways, the Monarchs secured the top seed heading into the Southern Section Division 1 playoffs.',
    content: [
      'In front of a sold-out capacity crowd of over 11,000 roaring fans, Friday night delivered another unforgettable chapter in high school football lore.',
      'Mater Dei’s defensive line dictated the line of scrimmage from the opening snap, holding Centennial’s high-octane rushing attack to under 2.8 yards per carry.',
      '“We knew their offensive scheme relies on fast tempo and perimeter bubbles,” said head defensive coordinator. “Our linebackers stayed disciplined, played through the whistle, and trusted the coverage shell.”',
      'The turning point occurred late in the third quarter when a forced fumble on Centennial’s 14-yard line gave the Monarchs short field position, which they quickly converted into a game-sealing touchdown strike.'
    ],
    sport: 'Football',
    author: 'Darnell Watkins',
    authorRole: 'Senior Football Analyst',
    date: 'Oct 28, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=1200',
    featured: true
  },
  {
    id: 'art-2',
    title: 'The Unstoppable Surge: Inside the Rapid Growth of High School Girls Flag Football',
    excerpt: 'With state sanctioning and upcoming Olympic inclusion in 2028, girls flag football has become the fastest growing sport in high school athletic history.',
    content: [
      'What started as an experimental pilot program has evolved into a premier varsity spectacle drawing packed bleachers, national scouts, and collegiate recruiters.',
      'High school athletes across the state are commanding college NIL partnerships and earning direct roster invitations to USA Football development combines.',
      '“The level of speed, precision passing, and defensive scheme sophistication has skyrocketed,” noted IND Sports Media analyst Jordan Hayes. “These girls are true technicians of the game.”'
    ],
    sport: 'Flag Football',
    author: 'Jordan Hayes',
    authorRole: 'High School Flag & Olympic Sports Editor',
    date: 'Nov 14, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    featured: false
  },
  {
    id: 'art-3',
    title: 'Open Division Basketball Power Rankings: Sierra Canyon Takes #1 Spot',
    excerpt: 'Evaluating the top 10 boys varsity basketball programs as conference play heats up. Key stats, breakout performers, and state tournament projections.',
    content: [
      'As December tournaments conclude, the hierarchy of high school basketball is coming into razor-sharp focus.',
      'Sierra Canyon’s balanced five-out offensive attack has proved nearly impossible to game plan against, boasting three starters shooting over 40% from beyond the arc.',
      'Meanwhile, Harvard-Westlake’s perimeter defense continues to suffocate opponents in transition, holding foes to a meager 52 points per contest.'
    ],
    sport: 'Basketball',
    author: 'Marcus Brody',
    authorRole: 'Hoops Scout & Recruiting Director',
    date: 'Dec 10, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200',
    featured: false
  },
  {
    id: 'art-4',
    title: 'State Duals Preview: Why Buchanan vs. Clovis is High School Wrestling’s Greatest Rivalry',
    excerpt: 'Two perennial national powerhouses clash once again with state hardware and pound-for-pound supremacy on the line.',
    content: [
      'In Central California, wrestling is not just a varsity sport—it is a community heritage. Buchanan and Clovis have traded state crowns for a decade.',
      'Key matchups at 138, 165, and heavyweight will determine the dual. Both coaching staffs have prepared grueling conditioning circuits specifically for this showdown.'
    ],
    sport: 'Wrestling',
    author: 'Tyler Cruz',
    authorRole: 'Combat Sports Lead',
    date: 'Jan 08, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    featured: false
  },
  {
    id: 'art-5',
    title: 'Cathedral Catholic’s Historic Volleyball Run: 38-0 and CIF Supremacy',
    excerpt: 'An inside look into the selfless culture, brutal serving efficiency, and team chemistry that engineered an undefeated championship volleyball season.',
    content: [
      'Winning a state championship is difficult. Doing so without dropping a single set across three consecutive playoff weekends is historic.',
      'Led by sophomore sensation Chloe Martinez and senior setter Avery Bennett, Cathedral Catholic put on a clinic in high-speed transition offense.'
    ],
    sport: 'Volleyball',
    author: 'Sarah Lin',
    authorRole: 'Volleyball & Olympic Sports Writer',
    date: 'Nov 22, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=1200',
    featured: false
  }
];

export const ArticlesSection: React.FC<{ initialSport?: string }> = ({ initialSport = 'All' }) => {
  const [selectedSport, setSelectedSport] = useState<string>(initialSport);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const sportsList = ['All', 'Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football'];

  const filteredArticles = selectedSport === 'All'
    ? ARTICLES_DATA
    : ARTICLES_DATA.filter(a => a.sport.toLowerCase() === selectedSport.toLowerCase());

  const featuredArticle = ARTICLES_DATA.find(a => a.featured) || ARTICLES_DATA[0];

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
                src={featuredArticle.image}
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

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="bg-[#111111] border border-white/10 hover:border-[#00BFFF]/50 rounded-lg overflow-hidden flex flex-col justify-between p-0 cursor-pointer group transition-all duration-300 shadow-xl"
          >
            <div>
              <div className="relative aspect-16/9 overflow-hidden">
                <img
                  src={article.image}
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

      {/* Article Detail Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto p-4 sm:p-8 flex justify-center"
          >
            <div className="bg-[#111111] border border-white/10 rounded-xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 z-20 bg-black/80 hover:bg-[#00BFFF] hover:text-black text-white p-2 rounded-full border border-white/20 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Header Image */}
              <div className="relative aspect-21/9 w-full">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-[#00BFFF] text-black text-xs font-black uppercase px-3 py-1 rounded">
                    {activeArticle.sport}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-10">
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-4 pb-4 border-b border-white/10">
                  <span>By <strong className="text-white">{activeArticle.author}</strong> ({activeArticle.authorRole})</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mb-6 leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="space-y-4 text-white/80 font-sans text-base leading-relaxed">
                  {activeArticle.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Footer Back */}
                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Back to Articles
                  </button>

                  <div className="text-xs text-white/40 italic">
                    Published by IND Sports Media Editorial Board
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticlesSection;
