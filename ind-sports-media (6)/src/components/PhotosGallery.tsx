import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Download, 
  Share2, 
  Eye, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Trophy,
  Upload,
  Plus,
  Sparkles,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Flame,
  Radio
} from 'lucide-react';
import type { PhotoItem } from '../types';
import { 
  subscribeToPhotos, 
  uploadPhotoToFirestore, 
  deletePhotoFromFirestore,
  compressImageFile 
} from '../lib/firebase';

const SEED_PHOTOS: PhotoItem[] = [
  {
    id: 'p1',
    sport: 'Football',
    title: '4th Quarter Game-Winning Touchdown Catch',
    match: 'Centennial vs. Mater Dei',
    photographer: 'Marcus Vance / IND Sports',
    date: 'Oct 24, 2025',
    src: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=1200',
    tags: ['Varsity', 'Friday Night Lights', 'Playoffs'],
    isLiveGamePhoto: true
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
  const [firestorePhotos, setFirestorePhotos] = useState<PhotoItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [filterLiveOnly, setFilterLiveOnly] = useState(false);

  // Form State for In-Game Photo Upload
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadMatch, setUploadMatch] = useState('');
  const [uploadSport, setUploadSport] = useState<PhotoItem['sport']>('Football');
  const [uploadPhotographer, setUploadPhotographer] = useState('IND Sideline Crew');
  const [uploadTags, setUploadTags] = useState('Live Game, Sideline, Q4');
  const [uploadImagePreview, setUploadImagePreview] = useState<string>('');
  const [uploadImageUrlInput, setUploadImageUrlInput] = useState('');
  const [uploadIsLiveGame, setUploadIsLiveGame] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sportsList = ['All', 'Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football'];

  // Subscribe to real-time Firestore photo updates
  useEffect(() => {
    const unsubscribe = subscribeToPhotos(
      (photos) => {
        setFirestorePhotos(photos);
      },
      (err) => {
        console.warn('Firestore photos subscribe error:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  // Merge Firestore photos with fallback seed photos
  const allPhotos: PhotoItem[] = [
    ...firestorePhotos,
    ...SEED_PHOTOS.filter(seed => !firestorePhotos.some(fp => fp.id === seed.id))
  ];

  let filteredPhotos = selectedSport === 'All'
    ? allPhotos
    : allPhotos.filter(p => p.sport.toLowerCase() === selectedSport.toLowerCase());

  if (filterLiveOnly) {
    filteredPhotos = filteredPhotos.filter(p => p.isLiveGamePhoto);
  }

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

  // Handle Photo File Selection from phone camera or computer
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Auto compress the image so it uploads instantly into Firestore
      const compressedDataUrl = await compressImageFile(file, 1400, 0.82);
      setUploadImagePreview(compressedDataUrl);
      setUploadImageUrlInput('');
    } catch (err) {
      console.error('Image compression error:', err);
      // Fallback to standard FileReader
      const reader = new FileReader();
      reader.onload = () => {
        setUploadImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit in-game photo to Firestore
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageSrc = uploadImagePreview || uploadImageUrlInput.trim();
    if (!imageSrc) {
      alert('Please snap or choose a photo, or paste an image URL.');
      return;
    }

    setUploading(true);
    try {
      const tagsArray = uploadTags
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      await uploadPhotoToFirestore({
        sport: uploadSport,
        title: uploadTitle.trim() || 'Live Game Action Shot',
        match: uploadMatch.trim() || 'Varsity Matchup',
        photographer: uploadPhotographer.trim() || 'IND Field Reporter',
        date: dateFormatted,
        src: imageSrc,
        tags: tagsArray.length ? tagsArray : ['Live Action', 'Sideline'],
        isLiveGamePhoto: uploadIsLiveGame,
        createdAt: now.toISOString()
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadModalOpen(false);
        setUploadImagePreview('');
        setUploadImageUrlInput('');
        setUploadTitle('');
        setUploadMatch('');
      }, 1200);
    } catch (err: any) {
      console.error('Failed to post photo to Firestore:', err);
      alert('Error uploading photo to Firebase. Please check connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this photo from the live website?')) {
      try {
        await deletePhotoFromFirestore(photoId);
        if (activeLightboxIndex !== null) {
          setActiveLightboxIndex(null);
        }
      } catch (err) {
        console.error('Failed to delete photo:', err);
      }
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header & Upload Action */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8 rounded-2xl border border-white/10">
        <div className="text-center md:text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera size={14} /> IND Sports Media Field Photography
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight mb-3">
            Sideline & Live <span className="text-[#00BFFF]">Game Photos</span>
          </h1>
          <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed">
            High-definition action captured live from the sidelines. Photos uploaded by our field photographers appear here in real-time as the game happens.
          </p>
        </div>

        {/* Live Upload CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            id="open-live-photo-upload-modal-btn"
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto bg-[#00BFFF] hover:bg-[#009cd0] text-black px-6 py-3.5 rounded font-black font-display text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,191,255,0.4)] transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Camera size={18} />
            Post In-Game Photo Live
          </button>
        </div>
      </div>

      {/* Filter Tabs & Live Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap justify-center items-center gap-2">
          {sportsList.map((sport) => (
            <button
              key={sport}
              id={`filter-sport-${sport.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-sm font-display text-xs uppercase tracking-widest font-bold transition-all cursor-pointer border ${
                selectedSport === sport
                  ? 'bg-[#00BFFF] text-black border-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.4)]'
                  : 'bg-white/5 text-white/70 border-white/10 hover:border-[#00BFFF]/40 hover:text-white'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        <button
          id="toggle-live-photos-filter-btn"
          onClick={() => setFilterLiveOnly(!filterLiveOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
            filterLiveOnly
              ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filterLiveOnly ? 'bg-red-500 animate-pulse' : 'bg-white/40'}`} />
          {filterLiveOnly ? 'Showing In-Game Live Only' : 'Filter In-Game Live'}
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
            className="group relative bg-[#111111] rounded-lg overflow-hidden border border-white/10 hover:border-[#00BFFF]/50 transition-all duration-300 shadow-xl"
          >
            {/* Image Thumbnail */}
            <div 
              className="relative aspect-4/3 overflow-hidden cursor-pointer bg-black/40"
              onClick={() => openLightbox(idx)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider text-[#00BFFF] border border-[#00BFFF]/30">
                  {photo.sport}
                </span>
                {photo.isLiveGamePhoto && (
                  <span className="bg-red-600/90 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> Live In-Game
                  </span>
                )}
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
              <p className="text-white/60 text-xs font-sans mb-3 line-clamp-1">
                {photo.match}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-white/40">
                <span className="truncate max-w-[160px]">📸 {photo.photographer}</span>
                <span>{photo.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl p-8">
          <Camera size={48} className="mx-auto text-[#00BFFF] mb-4 opacity-60" />
          <h3 className="text-xl font-bold font-display text-white uppercase mb-2">No Photos Found</h3>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
            No photos match the selected filter. Be the first to snap and post an in-game action photo from the sideline!
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-[#00BFFF] text-black px-6 py-2.5 rounded font-black font-display text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            <Camera size={16} /> Post Game Photo
          </button>
        </div>
      )}

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
                {filteredPhotos[activeLightboxIndex].isLiveGamePhoto && (
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Live In-Game
                  </span>
                )}
                <span className="text-white/60 text-xs font-mono">
                  {activeLightboxIndex + 1} / {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {firestorePhotos.some(fp => fp.id === filteredPhotos[activeLightboxIndex].id) && (
                  <button
                    onClick={(e) => handleDeletePhoto(filteredPhotos[activeLightboxIndex].id, e)}
                    className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white p-2 rounded-full transition-colors cursor-pointer"
                    title="Delete photo from live website"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
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
                  id="close-lightbox-modal-btn"
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
                id="lightbox-prev-photo-btn"
                onClick={prevPhoto}
                className="absolute left-2 sm:left-4 z-10 bg-black/60 hover:bg-[#00BFFF] hover:text-black text-white p-3 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <img
                src={filteredPhotos[activeLightboxIndex].src}
                alt={filteredPhotos[activeLightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] max-w-full object-contain rounded shadow-2xl border border-white/10"
              />

              <button
                id="lightbox-next-photo-btn"
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

      {/* In-Game Live Photo Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-white/20 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 text-[#00BFFF] text-xs font-bold font-display uppercase tracking-widest mb-2">
                <Radio size={16} className="animate-pulse text-red-500" /> Real-Time Live Feed Upload
              </div>
              <h3 className="text-2xl font-black font-display uppercase text-white mb-1">
                Post In-Game Photo
              </h3>
              <p className="text-white/60 text-xs font-sans mb-6">
                Take a photo directly with your phone camera or upload a file. It appears instantly across the entire website for all viewers.
              </p>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Photo Capture / File Selection */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
                    1. Snap Camera Photo or Select File
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="live-game-photo-file-input"
                  />

                  {uploadImagePreview ? (
                    <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-[#00BFFF]/50 bg-black mb-3">
                      <img
                        src={uploadImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadImagePreview('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/80 text-[#00BFFF] px-2 py-1 rounded text-[10px] font-mono">
                        ✓ Compressed & Ready to Broadcast
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-[#00BFFF]/60 bg-white/5 hover:bg-[#00BFFF]/5 rounded-xl p-6 text-center cursor-pointer transition-all mb-3 group"
                    >
                      <Camera size={36} className="mx-auto text-[#00BFFF] mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-white font-display uppercase tracking-wider">
                        Take Photo with Phone / Upload File
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        Tap here to open smartphone camera or select image from gallery
                      </p>
                    </div>
                  )}

                  {/* Alternative URL Input */}
                  {!uploadImagePreview && (
                    <div>
                      <div className="text-[11px] text-white/40 mb-1">Or paste image URL:</div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={uploadImageUrlInput}
                        onChange={(e) => setUploadImageUrlInput(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#00BFFF] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Sport Category & Live Badge */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                      Sport
                    </label>
                    <select
                      value={uploadSport}
                      onChange={(e) => setUploadSport(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/15 rounded px-3 py-2.5 text-xs text-white focus:border-[#00BFFF] focus:outline-none"
                    >
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Volleyball">Volleyball</option>
                      <option value="Wrestling">Wrestling</option>
                      <option value="Flag Football">Flag Football</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                      Live In-Game Tag
                    </label>
                    <button
                      type="button"
                      onClick={() => setUploadIsLiveGame(!uploadIsLiveGame)}
                      className={`w-full py-2.5 px-3 rounded text-xs font-bold font-display uppercase tracking-wider border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        uploadIsLiveGame
                          ? 'bg-red-600/20 border-red-500 text-red-400'
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${uploadIsLiveGame ? 'bg-red-500 animate-ping' : 'bg-white/30'}`} />
                      {uploadIsLiveGame ? 'Live Action' : 'Showcase'}
                    </button>
                  </div>
                </div>

                {/* Title / Action Description */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                    Photo Title / Play Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4th Quarter TD Catch or Pregame Warmups"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#00BFFF] focus:outline-none"
                  />
                </div>

                {/* Matchup / School */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                    Game / Matchup
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Centennial vs. Mater Dei"
                    value={uploadMatch}
                    onChange={(e) => setUploadMatch(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#00BFFF] focus:outline-none"
                  />
                </div>

                {/* Photographer & Tags */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                      Photographer / Credit
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Marcus Vance / IND"
                      value={uploadPhotographer}
                      onChange={(e) => setUploadPhotographer(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="TD, Sideline, Q4"
                      value={uploadTags}
                      onChange={(e) => setUploadTags(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 rounded px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={uploading || (!uploadImagePreview && !uploadImageUrlInput.trim())}
                    id="submit-live-photo-upload-btn"
                    className="w-full bg-[#00BFFF] hover:bg-[#009cd0] disabled:opacity-40 text-black py-3.5 rounded font-black font-display text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,191,255,0.4)] transition-all cursor-pointer"
                  >
                    {uploadSuccess ? (
                      <>
                        <CheckCircle2 size={18} className="text-green-900 animate-bounce" />
                        Broadcasted Live to Website!
                      </>
                    ) : uploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Pushing Live to Website...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Publish Photo Live to Website
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotosGallery;
