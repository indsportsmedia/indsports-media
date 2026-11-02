import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Trophy, Award, TrendingUp, Play, Flame, ExternalLink, Calendar, MapPin, School } from 'lucide-react';

interface AthleteProfile {
  id: string;
  name: string;
  sport: string;
  position: string;
  school: string;
  classYear: string;
  hometown: string;
  status: string;
  stats: { label: string; value: string }[];
  scoutSummary: string;
  image: string;
  featuredStory: string;
  offers: string[];
}

const ATHLETES_DATA: AthleteProfile[] = [
  {
    id: 'a1',
    name: 'Jaylen "Flash" Mercer',
    sport: 'Football',
    position: 'Wide Receiver / Returner',
    school: 'Mater Dei High School',
    classYear: 'Class of 2026',
    hometown: 'Santa Ana, CA',
    status: 'All-State Selection • State MVP Candidate',
    stats: [
      { label: 'Rec Yards', value: '1,420' },
      { label: 'Touchdowns', value: '19' },
      { label: '40-Yard Dash', value: '4.34s' },
      { label: 'Yards/Catch', value: '21.4' }
    ],
    scoutSummary: 'Elite separation speed with crisp route tree discipline. Breaks tackles in open field and possesses unbelievable hand-eye coordination under pressure.',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=800',
    featuredStory: 'How Jaylen Mercer turned off-season track work into a nation-leading 19-touchdown junior campaign for the top-ranked Monarchs.',
    offers: ['1st Team All-State', 'MaxPreps All-American', 'Trinity League MVP', 'State Champion']
  },
  {
    id: 'a2',
    name: 'Amari Vance',
    sport: 'Basketball',
    position: 'Point Guard',
    school: 'Sierra Canyon',
    classYear: 'Class of 2026',
    hometown: 'Chatsworth, CA',
    status: 'All-American Watchlist • Open Division Leader',
    stats: [
      { label: 'PPG', value: '24.8' },
      { label: 'APG', value: '8.4' },
      { label: '3PT %', value: '41.2%' },
      { label: 'Steals', value: '2.9' }
    ],
    scoutSummary: 'Floor general with supreme court vision and deep range off the dribble. Calms down frenetic games and hits clutch step-backs with ease.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
    featuredStory: 'Poise under pressure: Inside Amari Vance’s game-winning playoff buzzer beaters and leadership style in the Open Division.',
    offers: ['All-CIF Open Division', 'Tournament MVP', 'Wooden Award Finalist', 'All-State 1st Team']
  },
  {
    id: 'a3',
    name: 'Chloe "The Wall" Martinez',
    sport: 'Volleyball',
    position: 'Outside Hitter / Libero',
    school: 'Cathedral Catholic',
    classYear: 'Class of 2027',
    hometown: 'San Diego, CA',
    status: 'National Sophomore of the Year',
    stats: [
      { label: 'Kills', value: '512' },
      { label: 'Digs', value: '380' },
      { label: 'Aces', value: '64' },
      { label: 'Hit %', value: '.438' }
    ],
    scoutSummary: 'Dynamic leaping ability paired with a heavy arm swing. Outstanding back-row defense makes her a rare six-rotation powerhouse.',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800',
    featuredStory: 'Leading Cathedral Catholic to an undefeated 38-0 state championship run while dominating both indoor and beach circuits.',
    offers: ['State Final MVP', 'All-American 1st Team', 'CIF Player of the Year', 'Under Armour All-American']
  },
  {
    id: 'a4',
    name: 'Mateo "Iron" Rodriguez',
    sport: 'Wrestling',
    position: '165 lbs',
    school: 'Buchanan High School',
    classYear: 'Class of 2026',
    hometown: 'Clovis, CA',
    status: '2x State Champion • Undefeated 48-0',
    stats: [
      { label: 'Record', value: '48-0' },
      { label: 'Pins', value: '34' },
      { label: 'Takedowns', value: '142' },
      { label: 'Tech Falls', value: '9' }
    ],
    scoutSummary: 'Relentless hand fighting, suffocating top pressure, and lightning re-attacks. Unquestioned #1 pound-for-pound wrestler in the state.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    featuredStory: 'Mateo Rodriguez breaks down the mental grit and 5:00 AM routines behind back-to-back state tournament sweeps.',
    offers: ['2x State Champion', 'NHSCA National Champion', 'Fargo Freestyle All-American', 'Doc Buchanan Champion']
  },
  {
    id: 'a5',
    name: 'Kayla Reynolds',
    sport: 'Flag Football',
    position: 'Quarterback / Safety',
    school: 'Newport Harbor',
    classYear: 'Class of 2026',
    hometown: 'Newport Beach, CA',
    status: 'USA National Team Developmental Pool',
    stats: [
      { label: 'Pass TDs', value: '52' },
      { label: 'Rush TDs', value: '18' },
      { label: 'Interceptions', value: '11' },
      { label: 'Pass Yds', value: '3,200' }
    ],
    scoutSummary: 'Pinpoint field processor with rapid release and unmatched evasive scrambling. Also leads the state in defensive pick-sixes.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    featuredStory: 'Pioneering the Girls Flag Football revolution: Kayla Reynolds is redefining quarterback mechanics and inspiring thousands.',
    offers: ['USA Flag Select Team', 'CIF Champion', 'Orange County Player of the Year', 'National Tournament MVP']
  }
];

export const AthleteFeatures: React.FC<{ onBookReel?: () => void }> = ({ onBookReel }) => {
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile>(ATHLETES_DATA[0]);

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-bold uppercase tracking-widest mb-4">
          <Star size={14} /> IND Sports Media Spotlight
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black uppercase text-white tracking-tight mb-4">
          Athlete <span className="text-[#00BFFF]">Features</span>
        </h1>
        <p className="text-white/60 font-sans text-base leading-relaxed">
          In-depth profiles, performance breakdowns, and athletic showcases of high school and youth athletes making local, regional, and national waves.
        </p>
      </div>

      {/* Featured Spotlight Showcase */}
      <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-2xl mb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Athlete Media Column */}
          <div className="lg:col-span-5 relative aspect-square lg:aspect-auto">
            <img
              src={selectedAthlete.image}
              alt={selectedAthlete.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-[#111111]" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-[#00BFFF] text-black font-black text-xs uppercase px-3 py-1 rounded inline-block mb-2">
                {selectedAthlete.sport}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
                {selectedAthlete.name}
              </h2>
              <p className="text-white/70 text-sm font-semibold flex items-center gap-2 mt-1">
                <School size={14} /> {selectedAthlete.school} • {selectedAthlete.classYear}
              </p>
            </div>
          </div>

          {/* Athlete Details Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00BFFF] mb-3">
                <Award size={16} /> {selectedAthlete.status}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-display font-black text-white mb-4">
                "{selectedAthlete.featuredStory}"
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {selectedAthlete.stats.map(s => (
                  <div key={s.label} className="bg-black/60 border border-white/10 rounded p-3 text-center">
                    <div className="text-[#00BFFF] font-display font-black text-xl">{s.value}</div>
                    <div className="text-white/40 text-[10px] uppercase font-bold tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 border-l-2 border-[#00BFFF] p-4 rounded-r mb-6">
                <div className="text-xs uppercase font-black text-white/50 mb-1">IND Media Performance Breakdown</div>
                <p className="text-white/80 text-sm leading-relaxed font-sans">
                  {selectedAthlete.scoutSummary}
                </p>
              </div>

              <div>
                <div className="text-xs uppercase font-black text-white/40 mb-2">Athletic Honors & Recognition</div>
                <div className="flex flex-wrap gap-2">
                  {selectedAthlete.offers.map(offer => (
                    <span key={offer} className="bg-white/10 text-white font-bold text-xs px-3 py-1 rounded border border-white/10">
                      {offer}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <MapPin size={14} /> {selectedAthlete.hometown}
              </div>

              <button
                onClick={onBookReel}
                className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-all shadow-lg shadow-[#00BFFF]/20 cursor-pointer"
              >
                Request Custom Athlete Reel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Roster of Featured Athletes */}
      <h3 className="text-2xl font-display font-black uppercase text-white mb-6 flex items-center gap-2">
        <TrendingUp className="text-[#00BFFF]" /> More Athlete Spotlights
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ATHLETES_DATA.map((athlete) => (
          <div
            key={athlete.id}
            onClick={() => setSelectedAthlete(athlete)}
            className={`p-4 rounded-lg cursor-pointer border transition-all duration-300 ${
              selectedAthlete.id === athlete.id
                ? 'bg-[#00BFFF]/10 border-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.2)]'
                : 'bg-[#111111] border-white/10 hover:border-white/30'
            }`}
          >
            <img
              src={athlete.image}
              alt={athlete.name}
              referrerPolicy="no-referrer"
              className="w-full aspect-square object-cover rounded mb-3"
            />
            <div className="text-[10px] font-black uppercase tracking-wider text-[#00BFFF] mb-1">
              {athlete.sport} • {athlete.position}
            </div>
            <h4 className="text-white font-display font-bold text-sm line-clamp-1">
              {athlete.name}
            </h4>
            <p className="text-white/40 text-[11px] font-sans line-clamp-1">
              {athlete.school}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AthleteFeatures;
