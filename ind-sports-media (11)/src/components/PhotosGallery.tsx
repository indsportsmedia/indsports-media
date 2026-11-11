import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Trash2,
  Edit3,
  Save,
  Tag,
  User,
  Trophy
} from 'lucide-react';
import type { PhotoItem } from '../types';
import { 
  subscribeToPhotos, 
  deletePhotoFromFirestore,
  updatePhotoInFirestore
} from '../lib/firebase';

const SEED_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-pregame-brownsburg',
    sport: 'Football',
    title: 'PREGAME BROWNSBURG',
    match: 'Fort Wayne South Side Archers vs. Marion Giants',
    photographer: 'IND Sports Media',
    date: 'Aug 28, 2026',
    src: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=1200',
    tags: ['Varsity', 'Pregame', 'Brownsburg'],
    isLiveGamePhoto: false
  }
];

export const PhotosGallery: React.FC<{ initialSport?: string; onBackToHome: () => void }> = ({
  initialSport = 'All'
}) => {
  const [selectedSport, setSelectedSport] = useState<string>(initialSport);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [firestorePhotos, setFirestorePhotos] = useState<PhotoItem[]>([]);

  // Real-Time Photo Edit Modal State for Sideline Operators
  const [editingPhoto, setEditingPhoto] = useState<{
    id: string;
    title: string;
    match: string;
    sport: 'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football';
    photographer: string;
    tags: string;
    src: string;
  } | null>(null);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  // IND Sports Media Staff Authorization for management
  const [isStaffAuthorized] = useState<boolean>(() => {
    return window.location.hash.includes('sideline') || 
           window.location.hash.includes('operator') || 
           window.location.hash.includes('media') ||
           sessionStorage.getItem('ind_operator_auth') === 'true';
  });

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

  // Filter out any broken test uploads and ensure live in-game status is cleared
  const validFirestorePhotos = firestorePhotos
    .filter(p => {
      if (p.title.toUpperCase().includes('RUSHING TOUCHDOWN')) return false;
      if (!p.src || p.src.trim() === '') return false;
      return true;
    })
    .map(p => ({
      ...p,
      isLiveGamePhoto: false
    }));

  // Merge valid Firestore photos or use the single Pregame Brownsburg seed photo
  const allPhotos: PhotoItem[] = validFirestorePhotos.length > 0
    ? validFirestorePhotos
    : SEED_PHOTOS;

  const filteredPhotos = selectedSport === 'All'
    ? allPhotos
    : allPhotos.filter(p => p.sport.toLowerCase() === selectedSport.toLowerCase());

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

  const handleOpenEditPhoto = (photo: PhotoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPhoto({
      id: photo.id,
      title: photo.title,
      match: photo.match || '',
      sport: photo.sport || 'Football',
      photographer: photo.photographer || 'IND Sports Media',
      tags: (photo.tags || []).join(', '),
      src: photo.src
    });
  };

  const handleSavePhotoEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setIsSavingPhoto(true);
    try {
      const parsedTags = editingPhoto.tags
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      await updatePhotoInFirestore(editingPhoto.id, {
        title: editingPhoto.title,
        match: editingPhoto.match,
        sport: editingPhoto.sport,
        photographer: editingPhoto.photographer,
        tags: parsedTags
      });
      setEditingPhoto(null);
    } catch (err: any) {
      console.error('Failed to update photo:', err);
      alert(`⚠️ Failed to update photo:\n${err?.message || 'Check network connection.'}`);
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photo: PhotoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isStaffAuthorized) return;
    if (confirm(`Delete "${photo.title}" from the live gallery and remove media from Cloud Storage?`)) {
      try {
        await deletePhotoFromFirestore(photo.id, photo.src);
        if (activeLightboxIndex !== null) {
          setActiveLightboxIndex(null);
        }
      } catch (err: any) {
        console.error('Failed to delete photo:', err);
        alert(`⚠️ Failed to delete photo:\n${err?.message || 'Check network connection.'}`);
      }
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8 rounded-sm border border-white/10">
        <div className="text-center md:text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-bold uppercase tracking-widest mb-3">
            <Camera size={14} /> IND Sports Media Field Photography
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase text-white tracking-tight mb-3">
            Sideline & Game <span className="text-[#00BFFF]">Photos</span>
          </h1>
          <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed">
            High-definition action captured exclusively by the IND Sports Media sideline photo crew.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
        {sportsList.map((sport) => (
          <button
            key={sport}
            id={`filter-sport-${sport.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-2 rounded-sm font-display text-xs uppercase tracking-widest font-bold transition-all cursor-pointer border ${
              selectedSport === sport
                ? 'bg-[#00BFFF] text-black border-[#00BFFF]'
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
                <span className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-[#00BFFF] border border-[#00BFFF]/30">
                  {photo.sport}
                </span>
              </div>

              {/* Staff Action Controls Overlay */}
              {isStaffAuthorized && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditPhoto(photo, e)}
                    className="p-1.5 bg-black/80 hover:bg-[#00BFFF] hover:text-black text-white rounded border border-white/20 transition-colors shadow-lg cursor-pointer"
                    title="Edit photo details"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeletePhoto(photo, e)}
                    className="p-1.5 bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white rounded border border-red-800/40 transition-colors shadow-lg cursor-pointer"
                    title="Delete photo and storage file"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}

              {/* Hover View Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-[#00BFFF] text-black px-4 py-2 rounded font-bold font-display text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
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
                <span className="truncate max-w-[150px]">📸 {photo.photographer}</span>
                <span>{photo.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-sm p-8">
          <Camera size={48} className="mx-auto text-[#00BFFF] mb-4 opacity-60" />
          <h3 className="text-xl font-bold font-display text-white uppercase mb-2">No Photos Found</h3>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            No photos match the selected filter. Check back soon for new photography from the IND Sports Media sideline crew.
          </p>
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
                <span className="bg-[#00BFFF] text-black px-2.5 py-0.5 rounded font-bold text-xs uppercase tracking-wider">
                  {filteredPhotos[activeLightboxIndex].sport}
                </span>
                <span className="text-white/60 text-xs font-sans tabular">
                  {activeLightboxIndex + 1} / {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {isStaffAuthorized && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPhoto(filteredPhotos[activeLightboxIndex])}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[#00BFFF] hover:text-black text-white rounded text-xs font-display font-bold uppercase transition-colors cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Edit Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(filteredPhotos[activeLightboxIndex])}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white rounded text-xs font-display font-bold uppercase transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </>
                )}

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
              <h4 className="text-white font-display font-bold text-lg sm:text-xl">
                {filteredPhotos[activeLightboxIndex].title}
              </h4>
              <p className="text-[#00BFFF] text-xs font-semibold mt-1">
                {filteredPhotos[activeLightboxIndex].match}
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

      {/* Edit Photo Details Modal */}
      <AnimatePresence>
        {editingPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => !isSavingPhoto && setEditingPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-[#00BFFF]/40 rounded-sm max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00BFFF]/20 border border-[#00BFFF]/40 flex items-center justify-center text-[#00BFFF]">
                    <Edit3 size={16} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base uppercase text-white tracking-wide">
                      Edit Photo Details
                    </h3>
                    <p className="text-[11px] font-sans text-white/50">
                      Saves instantly to Firestore and syncs across all live devices.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => !isSavingPhoto && setEditingPhoto(null)}
                  disabled={isSavingPhoto}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePhotoEdit} className="space-y-4">
                {/* Photo Thumbnail */}
                <div className="relative aspect-video rounded-sm overflow-hidden bg-black border border-white/10 max-h-36">
                  <img
                    src={editingPhoto.src}
                    alt={editingPhoto.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="text-[11px] font-sans tabular uppercase text-white/60 font-bold block mb-1">
                    Photo Title
                  </label>
                  <input
                    type="text"
                    value={editingPhoto.title}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                    required
                    className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-sm px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                {/* Matchup / Event */}
                <div>
                  <label className="text-[11px] font-sans tabular uppercase text-white/60 font-bold block mb-1">
                    Matchup / Description
                  </label>
                  <input
                    type="text"
                    value={editingPhoto.match}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, match: e.target.value })}
                    className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-sm px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                {/* Sport & Photographer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-sans tabular uppercase text-white/60 font-bold block mb-1">
                      Sport Category
                    </label>
                    <select
                      value={editingPhoto.sport}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, sport: e.target.value as any })}
                      className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-sm px-3.5 py-2.5 text-xs text-white outline-none"
                    >
                      {['Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-sans tabular uppercase text-white/60 font-bold block mb-1">
                      Photographer
                    </label>
                    <input
                      type="text"
                      value={editingPhoto.photographer}
                      onChange={(e) => setEditingPhoto({ ...editingPhoto, photographer: e.target.value })}
                      className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-sm px-3.5 py-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-[11px] font-sans tabular uppercase text-white/60 font-bold block mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={editingPhoto.tags}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, tags: e.target.value })}
                    placeholder="Varsity, Sideline, Touchdown, Rivalry"
                    className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-sm px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => !isSavingPhoto && setEditingPhoto(null)}
                    disabled={isSavingPhoto}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-display font-bold text-xs uppercase rounded-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingPhoto}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-display font-bold text-xs uppercase tracking-wider rounded-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Save size={15} />
                    <span>{isSavingPhoto ? 'Saving...' : 'Save Changes'}</span>
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
