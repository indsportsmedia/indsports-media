import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Play, Camera, Star, Users, Calendar, ArrowRight, ShieldCheck, Video, Flame } from 'lucide-react';

interface SportCoveragePageProps {
  sportName: 'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football';
  onNavigateToPhotos: (sport: string) => void;
  onNavigateToArticles: (sport: string) => void;
  onBookReel: () => void;
}

const SPORT_DATA = {
  Football: {
    tagline: 'Varsity Friday Night Lights & State Playoff Dominance',
    description: '4K sideline cinematography, mic’d up athlete features, top 100 recruit reels, and complete game film packages.',
    heroImage: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=1920',
    stats: [
      { label: 'Varsity Games Filmed', value: '350+' },
      { label: 'D1 College Commits Covered', value: '85+' },
      { label: 'Highlight Views', value: '12.4M' }
    ],
    features: [
      'Multi-angle 4K Endzone & Sideline Video',
      'Custom D1 Recruiting Mixes with Verified Timestamps',
      'Coach Sideline Interviews & Locker Room Access',
      'Live Scorecast & Real-time Social Clips'
    ]
  },
  Basketball: {
    tagline: 'High-Flying Open Division & AAU Circuit Coverage',
    description: 'Floor-level slow-motion mixtape edits, posterizing dunk reels, clutch game-winner highlights, and national scout packages.',
    heroImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1920',
    stats: [
      { label: 'Gyms Covered', value: '120+' },
      { label: 'Viral Reel Drops', value: '450+' },
      { label: 'Total Views', value: '18.9M' }
    ],
    features: [
      'Fastbreak & Rim-Rocker 120fps Slow-Mo Highlights',
      'AAU & CIF State Tournament Live Coverage',
      'Player Spotlight & Scouting Dossiers',
      'Custom NIL-Ready Social Content Suites'
    ]
  },
  Volleyball: {
    tagline: 'Explosive Spikes, Libero Digs & Championship Rallies',
    description: 'Precision net-side tracking, multi-angle spike reels, and comprehensive college recruiting packages for indoor and beach athletes.',
    heroImage: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=1920',
    stats: [
      { label: 'Sets Captured', value: '920+' },
      { label: 'NCAA Commits', value: '60+' },
      { label: 'Broadcast Reach', value: '4.2M' }
    ],
    features: [
      'Overhead & Court-level High-Speed Tracking',
      'Rotation & Serving Sequence Breakdown Edits',
      'All-State & CIF Championship Highlight Feeds',
      'Recruitment Video Reels for College Coaches'
    ]
  },
  Wrestling: {
    tagline: 'Mat-Side Intensity, Takedown Reels & State Tournament Glory',
    description: 'Intimate mat-side dual coverage, pin compilation reels, weight class rankings, and pound-for-pound athlete features.',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1920',
    stats: [
      { label: 'Dual Meets Covered', value: '140+' },
      { label: 'State Placers', value: '110+' },
      { label: 'Social Engagements', value: '3.1M' }
    ],
    features: [
      'Mat-Side 4K Camera Rig & Ultra Slow-Mo Pins',
      'Round-by-Round Tournament Brackets & Recaps',
      'Grit & Grind Athlete Preparation Documentaries',
      'High School All-American Scouting Profiles'
    ]
  },
  'Flag Football': {
    tagline: 'The Fastest Growing Varsity Phenomenon in America',
    description: 'Dedicated high-energy coverage for high school girls and youth flag football. Aerial drone angles, pick-six reels, and tournament showcases.',
    heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1920',
    stats: [
      { label: 'Teams Spotlighted', value: '80+' },
      { label: 'Tournaments Filmed', value: '45+' },
      { label: 'Media Impressions', value: '6.8M' }
    ],
    features: [
      'Sideline & Aerial Drone Cinematic Tracking',
      'Red-Zone Route Running & Juke Breakdown Reels',
      'USA Flag Football Developmental Scouting Spotlights',
      'Full Varsity Match Filming & Team Highlight Packages'
    ]
  }
};

export const SportCoveragePage: React.FC<SportCoveragePageProps> = ({
  sportName,
  onNavigateToPhotos,
  onNavigateToArticles,
  onBookReel
}) => {
  const sport = SPORT_DATA[sportName] || SPORT_DATA['Football'];

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[65vh] min-h-[460px] flex items-center justify-center overflow-hidden border-b border-white/10">
        <img
          src={sport.heroImage}
          alt={sportName}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/20 border border-[#00BFFF]/40 rounded-full text-[#00BFFF] text-xs font-black uppercase tracking-widest mb-4">
            <Trophy size={14} /> IND Sports Media • Official Coverage
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase text-white tracking-tight mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {sportName} <span className="text-[#00BFFF]">Coverage</span>
          </h1>
          <p className="text-white/80 font-sans text-base sm:text-lg max-w-2xl mx-auto mb-8 font-medium">
            {sport.tagline}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onBookReel}
              className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-xl shadow-[#00BFFF]/25 cursor-pointer"
            >
              Book {sportName} Video Package
            </button>
            <button
              onClick={() => onNavigateToPhotos(sportName)}
              className="bg-white/10 hover:bg-white/20 text-white font-display font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Camera size={16} /> View {sportName} Photos
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sport.stats.map((st) => (
            <div key={st.label} className="bg-[#111111]/95 backdrop-blur-md border border-white/10 p-6 rounded-lg text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-display font-black text-[#00BFFF] mb-1">{st.value}</div>
              <div className="text-white/50 text-xs uppercase font-bold tracking-widest">{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Capabilities */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[#00BFFF] font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <Flame size={16} /> Pro-Tier Media Standard
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-white mb-6">
              How IND Covers {sportName}
            </h2>
            <p className="text-white/70 font-sans text-base leading-relaxed mb-8">
              {sport.description}
            </p>

            <div className="space-y-4 mb-8">
              {sport.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded">
                  <div className="w-2 h-2 bg-[#00BFFF] rounded-full" />
                  <span className="text-white font-display font-bold text-sm tracking-wide">{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigateToArticles(sportName)}
                className="bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase tracking-widest px-6 py-3 rounded transition-colors flex items-center gap-2 cursor-pointer"
              >
                Read {sportName} Articles <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-2xl font-display font-black uppercase text-white mb-4">
              Get Your Program Covered
            </h3>
            <p className="text-white/60 text-sm font-sans mb-6">
              Are you an athlete, coach, athletic director, or booster club looking for live broadcast streaming, game photos, or highlight reels?
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-black/60 border border-white/10 rounded flex justify-between items-center text-xs">
                <span className="text-white font-bold">Individual Athlete Highlight Package</span>
                <span className="text-[#00BFFF] font-black">4K Edits Included</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/10 rounded flex justify-between items-center text-xs">
                <span className="text-white font-bold">Full Varsity Season Pass Coverage</span>
                <span className="text-[#00BFFF] font-black">Photo + Video</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/10 rounded flex justify-between items-center text-xs">
                <span className="text-white font-bold">High-Definition Live Stream Broadcast</span>
                <span className="text-[#00BFFF] font-black">Play-by-Play</span>
              </div>
            </div>

            <button
              onClick={onBookReel}
              className="w-full mt-6 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase tracking-widest py-3.5 rounded transition-all cursor-pointer shadow-lg shadow-[#00BFFF]/20"
            >
              Submit Coverage Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportCoveragePage;
