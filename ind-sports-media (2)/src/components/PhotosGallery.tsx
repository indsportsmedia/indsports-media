import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Download, Share2, Eye, Filter, X, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

export interface PhotoItem {
  id: string;
  sport: 'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football';
  title: string;
  match: string;
  photographer: string;
  date: string;
  src: string;
  tags: string[];
}

const PHOTOS_DATABASE: PhotoItem[] = [
  {
    id: 'p1',
    sport: 'Football',
    title: '4th Quarter Game-Winning Touchdown Catch',
    match: 'Centennial vs. Mater Dei',
    photographer: 'Marcus Vance / IND Sports',
    date: 'Oct 24, 2025',
    src: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=1200',
    tags: ['Varsity', 'Friday Night Lights', 'Playoffs']
  },
  {
    id: 'p2',
    sport: 'Basketball',
    title: 'Posterizing Fastbreak Tomahawk Slam',
    match: 'Sierra Canyon vs. Oak Hill',
    photographer: 'Devon Reed / IND Sports',
    date: 'Nov 12, 2025',
    src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200',
    tags: ['Dunk', 'Championship', 'Top 100']
  },
  {
    id: 'p3',
    sport: 'Volleyball',
    title: 'State Championship Match Point Spike',
    match: 'Cathedral Catholic vs. Mira Costa',
    photographer: 'Sarah Lin / IND Sports',
    date: 'Nov 18, 2025',
    src: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=1200',
    tags: ['State Final', 'Clutch Play', 'Girls Varsity']
  },
  {
    id: 'p4',
    sport: 'Wrestling',
    title: '152lb Final Period Takedown & Pin',
    match: 'Clovis High vs. Buchanan High',
    photographer: 'Tyler Cruz / IND Sports',
    date: 'Dec 02, 2025',
    src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    tags: ['State Duals', 'Pin', 'All-American']
  },
  {
    id: 'p5',
    sport: 'Flag Football',
    title: 'Red-Zone Sideline Interception for 6',
    match: 'Esperanza vs. Newport Harbor',
    photographer: 'Jordan Hayes / IND Sports',
    date: 'Dec 08, 2025',
    src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
    tags: ['Girls Flag', 'Pick-Six', 'CIF Finals']
  },
  {
    id: 'p6',
    sport: 'Football',
    title: 'Goal Line Stand in the Mud',
    match: 'St. John Bosco vs. Servite',
    photographer: 'Marcus Vance / IND Sports',
    date: 'Oct 17, 2025',
    src: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=1200',
    tags: ['Defense', 'Trinity League', 'Hit of the Year']
  },
  {
    id: 'p7',
    sport: 'Basketball',
    title: 'Clutch Step-Back Buzzer Beater',
    match: 'Harvard-Westlake vs. Corona Centennial',
    photographer: 'Devon Reed / IND Sports',
    date: 'Jan 15, 2026',
    src: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&q=80&w=1200',
    tags: ['Game Winner', 'Open Division', 'Clutch']
  },
  {
    id: 'p8',
    sport: 'Volleyball',
    title: 'Diving Libero Pancake Save',
    match: 'Torrey Pines vs. Marymount',
    photographer: 'Sarah Lin / IND Sports',
    date: 'Oct 30, 2025',
    src: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=1200',
    tags: ['Defense', 'Rally of the Year', 'Varsity']
  },
  {
    id: 'p9',
    sport: 'Flag Football',
    title: 'Spin Move Touchdown in Championship',
    match: 'Orange Vista vs. Corona del Mar',
    photographer: 'Jordan Hayes / IND Sports',
    date: 'Nov 29, 2025',
    src: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    tags: ['Girls Flag', 'Touchdown', 'Highlight Reel']
  },
  {
    id: 'p10',
    sport: 'Wrestling',
    title: 'Heavyweight Championship Overtime Suplex',
    match: 'Bakersfield vs. Poway',
    photographer: 'Tyler Cruz / IND Sports',
    date: 'Jan 22, 2026',
    src: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
    tags: ['Overtime', 'Ranked #1', 'State Medalist']
  }
];

export const PhotosGallery: React.FC<{ initialSport?: string; onBackToHome: () => void }> = ({
  initialSport = 'All',
  onBackToHome
}) => {
  const [selectedSport, setSelectedSport] = useState<string>(initialSport);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const sportsList = ['All', 'Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football'];

  const filteredPhotos = selectedSport === 'All'
    ? PHOTOS_DATABASE
    : PHOTOS_DATABASE.filter(p => p.sport.toLowerCase() === selectedSport.toLowerCase());

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredPhotos.length);
  };

  const prevPhoto = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-bold uppercase tracking-widest mb-4">
          <Camera size={14} /> IND Sports Media Photography
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black uppercase text-white tracking-tight mb-4">
          High School & Youth <span className="text-[#00BFFF]">Action Photos</span>
        </h1>
        <p className="text-white/60 font-sans text-base leading-relaxed">
          High-definition sideline coverage captured by IND Sports Media's accredited field photographers. Download, share, or request raw galleries for athletic recruitment.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
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

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="group relative bg-[#111111] rounded-lg overflow-hidden border border-white/10 hover:border-[#00BFFF]/50 transition-all duration-300 shadow-xl"
          >
            {/* Image Thumbnail */}
            <div 
              className="relative aspect-4/3 overflow-hidden cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              {/* Badge */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider text-[#00BFFF] border border-[#00BFFF]/30">
                {photo.sport}
              </div>

              {/* Hover View Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-[#00BFFF] text-black px-4 py-2 rounded font-black font-display text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
                  <Eye size={16} /> View High-Res
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-5">
              <h3 className="text-white font-display font-bold text-base mb-1 line-clamp-1 group-hover:text-[#00BFFF] transition-colors">
                {photo.title}
              </h3>
              <p className="text-white/60 text-xs font-sans mb-3">
                {photo.match}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-white/40">
                <span>📸 {photo.photographer}</span>
                <span>{photo.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && filteredPhotos[activeLightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-3">
                <span className="bg-[#00BFFF] text-black px-2.5 py-0.5 rounded font-black text-xs uppercase tracking-wider">
                  {filteredPhotos[activeLightboxIndex].sport}
                </span>
                <span className="text-white/60 text-xs font-mono">
                  {activeLightboxIndex + 1} / {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={filteredPhotos[activeLightboxIndex].src}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                  title="Open Full Image"
                >
                  <Download size={18} />
                </a>
                <button
                  onClick={closeLightbox}
                  className="bg-white/10 hover:bg-red-500/80 text-white p-2 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative flex-1 flex items-center justify-center my-4 max-w-7xl mx-auto w-full">
              <button
                onClick={prevPhoto}
                className="absolute left-2 sm:left-4 z-10 bg-black/60 hover:bg-[#00BFFF] hover:text-black text-white p-3 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <img
                src={filteredPhotos[activeLightboxIndex].src}
                alt={filteredPhotos[activeLightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full object-contain rounded shadow-2xl border border-white/10"
              />

              <button
                onClick={nextPhoto}
                className="absolute right-2 sm:right-4 z-10 bg-black/60 hover:bg-[#00BFFF] hover:text-black text-white p-3 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="max-w-4xl mx-auto w-full text-center bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
              <h4 className="text-white font-display font-black text-lg sm:text-xl">
                {filteredPhotos[activeLightboxIndex].title}
              </h4>
              <p className="text-[#00BFFF] text-xs font-semibold mt-1">
                {filteredPhotos[activeLightboxIndex].match} • Photo by {filteredPhotos[activeLightboxIndex].photographer}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {filteredPhotos[activeLightboxIndex].tags.map(t => (
                  <span key={t} className="text-[10px] text-white/50 bg-black/50 px-2 py-0.5 rounded border border-white/10">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotosGallery;
