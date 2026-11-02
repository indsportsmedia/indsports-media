import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IndLogo } from './IndLogo';
import { IndIcon } from './IndIcon';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Upload, 
  Play, 
  Trophy, 
  GraduationCap, 
  Ruler, 
  Scale, 
  Share2, 
  Check, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  Trash2, 
  Video, 
  ChevronRight, 
  Eye,
  SlidersHorizontal,
  Mail,
  UserCheck
} from 'lucide-react';

interface AthleteReel {
  id: string;
  name: string;
  sport: string;
  position: string;
  gradYear: string;
  school: string;
  gpa: string;
  height: string;
  weight: string;
  videoUrl: string;
  thumbnailUrl: string;
  achievements: string[];
  contactEmail: string;
  hudlUrl?: string;
  isCustom?: boolean;
}

const INITIAL_REELS: AthleteReel[] = [
  {
    id: 'devon-carter-wr',
    name: 'Devon Carter',
    sport: 'Football',
    position: 'Wide Receiver / Returner',
    gradYear: '2025',
    school: 'Westlake Warriors HS',
    gpa: '3.9',
    height: "6'2\"",
    weight: '190 lbs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-american-football-match-under-the-rain-40348-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=850',
    achievements: [
      'First Team All-CIF Wide Receiver',
      '1,240 Receiving Yards, 14 Touchdowns in 2024 season',
      '4.38s Laser-Timed 40-Yard Dash',
      'Top 50 State Wideout Prospect'
    ],
    contactEmail: 'devon.carter2025@recruit.com',
    hudlUrl: 'https://www.hudl.com/profile/devon-carter-demo'
  },
  {
    id: 'eli-harris-pg',
    name: 'Elijah Harris',
    sport: 'Basketball',
    position: 'Point Guard',
    gradYear: '2026',
    school: 'Mater Dei Monarchs',
    gpa: '4.1',
    height: "6'1\"",
    weight: '175 lbs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-basketball-players-training-in-a-stadium-14781-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=850',
    achievements: [
      'Trinity League Defensive Player of the Year',
      'Averaged 18.2 PPG, 7.4 APG, 2.8 SPG in Junior Season',
      '38-inch Vertical Jump',
      'Voted tournament MVP at California Classic Showcase'
    ],
    contactEmail: 'e.harris2026@recruit.com',
    hudlUrl: 'https://www.hudl.com/profile/elijah-harris-demo'
  },
  {
    id: 'samatha-diaz-st',
    name: 'Samantha Diaz',
    sport: 'Soccer',
    position: 'Striker / Forward',
    gradYear: '2025',
    school: 'Redondo Seahawks',
    gpa: '4.0',
    height: "5'7\"",
    weight: '140 lbs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-ball-in-the-stadium-1547-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=850',
    achievements: [
      'Bay League Offensive MVP (Back-to-Back Seasons)',
      '28 Goals in 20 Matches during 2024 regular season',
      'US Youth National Team Regional Representative',
      'Ranked #8 Attacking Prospect in Southern California'
    ],
    contactEmail: 's.diaz2025@recruit.com'
  },
  {
    id: 'marcus-sterling-rb',
    name: 'Marcus Sterling',
    sport: '7v7 Football',
    position: 'Running Back / Slot',
    gradYear: '2026',
    school: 'Oak Christian Lions',
    gpa: '3.7',
    height: "5'11\"",
    weight: '205 lbs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=850',
    achievements: [
      'Led CIF-SS Division 2 in Rushing with 1,510 Yards',
      '18 rushing TDs, 4 receiving TDs',
      'Squats 455 lbs, Power Cleans 295 lbs',
      'All-Area Scholar-Athlete Honors'
    ],
    contactEmail: 'm.sterling2026@recruit.com',
    hudlUrl: 'https://www.hudl.com/profile/marcus-sterling-demo'
  },
  {
    id: 'haley-vance-vb',
    name: 'Haley Vance',
    sport: 'Volleyball',
    position: 'Outside Hitter / Libero',
    gradYear: '2026',
    school: 'Redondo Union High School',
    gpa: '3.95',
    height: "6'1\"",
    weight: '155 lbs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-playing-volleyball-on-a-sandy-beach-25012-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547347298-4074fc58e110?auto=format&fit=crop&q=80&w=850',
    achievements: [
      'First Team All-State Outside Hitter',
      'Led league with 420 kills in 25 appearances',
      '31-inch vertical block jump reach',
      'Redondo Seahawks team MVP'
    ],
    contactEmail: 'haley.vance2026@volleyballnet.com'
  },
  {
    id: 'maya-rodriguez-sb',
    name: 'Maya Rodriguez',
    sport: 'Softball',
    position: 'Starting Pitcher / Infielder',
    gradYear: '2025',
    school: 'Oaks Christian School',
    gpa: '4.2',
    height: "5'8\"",
    weight: '145 lbs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-softball-players-throwing-and-catching-ball-43209-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=850',
    achievements: [
      'League MVP & Pitcher of the Year',
      '0.85 ERA with 230 strikeouts last season',
      'Batted .412 with 8 home runs',
      'Gold Glove selection for infield play'
    ],
    contactEmail: 'm.rodriguez2025@softballdir.com'
  },
  {
    id: 'alisha-taylor-gff',
    name: 'Alisha Taylor',
    sport: 'Girls Flag Football',
    position: 'Quarterback / Safety',
    gradYear: '2026',
    school: 'Corona del Mar High School',
    gpa: '3.85',
    height: "5'9\"",
    weight: '135 lbs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=850',
    achievements: [
      'Orange County Flag Football Player of the Year',
      'Passed for 3,100 yards and 42 touchdowns in 2025',
      'Voted Top Dual-Threat QB Prospect',
      'Defensive captain with 9 interceptions'
    ],
    contactEmail: 'alishat.qbfs@flagprospect.com'
  },
  {
    id: 'jordan-brooks-wr',
    name: 'Jordan Brooks',
    sport: 'Wrestling',
    position: '145 lbs Weight Class',
    gradYear: '2025',
    school: 'Clovis West Golden Eagles',
    gpa: '3.65',
    height: "5'10\"",
    weight: '145 lbs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&q=80&w=850',
    achievements: [
      'State Champion in the 145 lb Division',
      'Season match record: 42-2 with 28 pins',
      'Nationally ranked Top 15 recruit at weight class',
      'Voted Most Outstanding Wrestler at Mid-Cal Classic'
    ],
    contactEmail: 'jbrooks2025@wrestlingelite.com'
  }
];

const SPORT_STOCKS = {
  'Football': {
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-american-football-match-under-the-rain-40348-large.mp4'
  },
  '7v7 Football': {
    thumbnail: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4'
  },
  'Basketball': {
    thumbnail: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-basketball-players-training-in-a-stadium-14781-large.mp4'
  },
  'Soccer': {
    thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-ball-in-the-stadium-1547-large.mp4'
  },
  'Volleyball': {
    thumbnail: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-girl-playing-volleyball-on-a-sandy-beach-25012-large.mp4'
  },
  'Softball': {
    thumbnail: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-softball-players-throwing-and-catching-ball-43209-large.mp4'
  },
  'Girls Flag Football': {
    thumbnail: 'https://images.unsplash.com/photo-1628891890467-b79f2c87c69a?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4'
  },
  'Wrestling': {
    thumbnail: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4'
  },
  'Default': {
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=850',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4'
  }
};

interface RecruitmentReelsProps {
  onBack: () => void;
  initialSport?: string;
}

export default function RecruitmentReels({ onBack, initialSport }: RecruitmentReelsProps) {
  const [reels, setReels] = useState<AthleteReel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState(initialSport || 'All');
  
  // Modal toggle state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeReel, setActiveReel] = useState<AthleteReel | null>(null);
  
  // Clipboard/Share indicators
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom temporary video URLs storage (so they can be previewed/played)
  const [videoObjectUrls, setVideoObjectUrls] = useState<Record<string, string>>({});
  
  // New Upload Form state variables
  const [formData, setFormData] = useState({
    name: '',
    sport: 'Football',
    position: '',
    gradYear: '2025',
    school: '',
    gpa: '',
    height: '',
    weight: '',
    contactEmail: '',
    hudlUrl: '',
    achievementsText: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load reels from localStorage and combine with initial data
  useEffect(() => {
    const saved = localStorage.getItem('ind_recruitment_reels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AthleteReel[];
        // Filter out any corruption, merge with core dataset
        const customReels = parsed.map(r => ({ ...r, isCustom: true }));
        setReels([...INITIAL_REELS, ...customReels]);
      } catch (e) {
        setReels(INITIAL_REELS);
      }
    } else {
      setReels(INITIAL_REELS);
    }
  }, []);

  // Sync back to local storage whenever list expands
  const saveCustomReels = (newReels: AthleteReel[]) => {
    const customOnly = newReels.filter(r => r.isCustom);
    localStorage.setItem('ind_recruitment_reels', JSON.stringify(customOnly));
  };

  // Handle Search & Filter logic
  const filteredReels = reels.filter(reel => {
    const matchesSearch = 
      reel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reel.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reel.school.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (sportFilter === 'All') return matchesSearch;
    return matchesSearch && reel.sport === sportFilter;
  });

  // Handle Copy / Share Action
  const triggerShareAthlete = (e: React.MouseEvent, reel: AthleteReel) => {
    e.stopPropagation();
    const mockUrl = `${window.location.origin}/reels/${reel.id}`;
    navigator.clipboard.writeText(mockUrl).then(() => {
      setCopiedId(reel.id);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  // Upload Form File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic size & format validation (under 100MB is safest)
      if (file.size > 100 * 1024 * 1024) {
        setFileError('File size must be under 100MB to upload.');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Submit Uploader logic
  const handleUploaderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.position || !formData.school || !formData.contactEmail) {
      setFileError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate real upload processing lag
    setTimeout(() => {
      let finalVideoUrl = '';
      const sportKey = formData.sport as keyof typeof SPORT_STOCKS;
      const defaultSportStock = SPORT_STOCKS[sportKey] || SPORT_STOCKS['Default'];
      
      // If a real local video file was specified, hook up dynamic URL
      if (selectedFile) {
        const objUrl = URL.createObjectURL(selectedFile);
        finalVideoUrl = objUrl;
        
        // Save the reference locally so when played during this browsing session, it loads their file
        const uniqueId = `recruit-${Date.now()}`;
        setVideoObjectUrls(prev => ({
          ...prev,
          [uniqueId]: objUrl
        }));
      } else {
        // Fallback standard high-quality mixkit loop
        finalVideoUrl = defaultSportStock.video;
      }

      const achievementsArray = formData.achievementsText
        ? formData.achievementsText.split('\n').filter(line => line.trim().length > 0)
        : ['Prospect Athlete Video Showcase', 'Verifiable game coverage reel'];

      const newAthlete: AthleteReel = {
        id: `recruit-${Date.now()}`,
        name: formData.name,
        sport: formData.sport,
        position: formData.position,
        gradYear: formData.gradYear,
        school: formData.school,
        gpa: formData.gpa || 'N/A',
        height: formData.height || 'N/A',
        weight: formData.weight ? `${formData.weight} lbs` : 'N/A',
        videoUrl: finalVideoUrl,
        thumbnailUrl: defaultSportStock.thumbnail,
        achievements: achievementsArray,
        contactEmail: formData.contactEmail,
        hudlUrl: formData.hudlUrl || undefined,
        isCustom: true
      };

      const updatedList = [newAthlete, ...reels];
      setReels(updatedList);
      saveCustomReels(updatedList);

      setIsSubmitting(false);
      setValidationSuccess(true);
      
      // Reset form variables
      setTimeout(() => {
        setValidationSuccess(false);
        setIsUploadOpen(false);
        setSelectedFile(null);
        setFormData({
          name: '',
          sport: 'Football',
          position: '',
          gradYear: '2025',
          school: '',
          gpa: '',
          height: '',
          weight: '',
          contactEmail: '',
          hudlUrl: '',
          achievementsText: ''
        });
      }, 1500);

    }, 2000);
  };

  // Form Field helpers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Delete custom uploaded recruit card configuration
  const handleRemoveReel = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to remove this recruit reel?');
    if (confirmed) {
      const remaining = reels.filter(r => r.id !== id);
      setReels(remaining);
      saveCustomReels(remaining);
      if (activeReel?.id === id) {
        setActiveReel(null);
      }
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white pt-28 pb-20 select-none">
      
      {/* Dynamic Alert Banner for feedback share */}
      <AnimatePresence>
        {copiedId && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-650 border border-red-500 text-white rounded-md px-6 py-3.5 shadow-2xl font-sans text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-white" />
            <span>Athlete Profile Link copied to Clipboard! Ready to share.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back and Add Buttons top row navigation bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-white/5 pb-6">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-neutral-400 hover:text-white font-display text-xs font-black tracking-widest uppercase transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            BACK TO HOME
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-[#00BFFF]/10 text-[#00BFFF] border border-[#00BFFF]/20 px-2.5 py-1 uppercase font-display font-black tracking-wider rounded-sm">
              DIGITAL ATHLETE PORTFOLIO
            </span>
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-black px-5 py-3 font-display text-xs uppercase tracking-widest flex items-center gap-2 rounded-sm cursor-pointer shadow-lg shadow-[#00BFFF]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" /> SUBMIT HIGHLIGHT REEL
            </button>
          </div>
        </div>

        {/* Hero Section of showcase page */}
        <div className="text-left mb-16 relative">
          <div className="absolute right-0 top-0 h-44 w-44 bg-[#00BFFF] opacity-10 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-2 text-[#00BFFF] mb-3">
            <Trophy className="w-5 h-5" />
            <span className="font-display font-extrabold tracking-widest text-xs uppercase">ATHLETE MEDIA SHOWCASE</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black uppercase mb-4 leading-none">
            ATHLETE <span className="text-stroke">PERFORMANCE</span> SHOWCASE
          </h1>
          <p className="max-w-2xl text-neutral-400 text-sm md:text-base font-sans leading-relaxed">
            Explore high-definition highlight reels, verified athletic stats, and digital performance portfolios produced across local, regional, and national matchups.
          </p>
        </div>

        {/* Search, Filter & Sort interactive bar segment */}
        <div className="grid md:grid-cols-3 gap-4 items-center bg-neutral-900/60 p-4 border border-white/5 rounded-sm mb-10 text-xs">
          
          {/* Athlete search input focus */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search athletes by name, position, school..." 
              className="w-full bg-neutral-950 border border-white/5 p-3.5 pl-11 rounded-sm text-white focus:border-[#00BFFF] outline-none transition-all placeholder:text-neutral-500 font-sans"
            />
          </div>

          {/* Sport Selector items */}
          <div className="md:col-span-1 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-neutral-500 shrink-0" />
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full bg-neutral-950 border border-white/5 p-3.5 rounded-sm text-white focus:border-[#00BFFF] outline-none transition-all cursor-pointer font-sans"
            >
              <option value="All">All Sports</option>
              <option value="Football">11v11 Football</option>
              <option value="7v7 Football">7v7 Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Soccer">Soccer</option>
              <option value="Volleyball">Volleyball</option>
              <option value="Softball">Softball</option>
              <option value="Girls Flag Football">Girls Flag Football</option>
              <option value="Wrestling">Wrestling</option>
            </select>
          </div>

        </div>

        {/* Dynamic Athlete Cards gallery grid */}
        {filteredReels.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-neutral-900/40 rounded-sm">
            <AlertCircle className="w-12 h-12 text-neutral-600 mx-auto mb-3 animate-pulse" />
            <h3 className="font-display font-black text-xl text-white uppercase mb-1">NO ATHLETES FOUND</h3>
            <p className="text-xs text-neutral-500 font-sans max-w-sm mx-auto">
              We couldn't find any athlete matches matching that exact spelling or filter criteria. Add a custom reel using the top-right button!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReels.map((reel, index) => {
              // Retrieve temporary Object URLs if they exist
              const displayVideoUrl = videoObjectUrls[reel.id] || reel.videoUrl;
              
              return (
                <motion.div 
                  key={reel.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: (index % 6) * 0.08, ease: "easeOut" }}
                  onClick={() => setActiveReel({ ...reel, videoUrl: displayVideoUrl })}
                  className="group relative bg-neutral-900 border border-white/5 hover:border-[#00BFFF]/50 hover:scale-[1.01] transition-all duration-300 rounded-sm overflow-hidden text-left cursor-pointer flex flex-col justify-between shadow-2xl h-full"
                >
                  <div className="h-56 relative overflow-hidden shrink-0">
                    <img 
                      src={reel.thumbnailUrl} 
                      alt={reel.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient mapping */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
                    
                    {/* Hover state Play Circle */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 bg-[#00BFFF] text-black rounded-full flex items-center justify-center shadow-xl shadow-[#00BFFF]/40 transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="fill-black ml-1 text-black" size={20} />
                      </div>
                    </div>

                    {/* Left top indicator badging */}
                    <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                      <span className="bg-[#00BFFF] text-black px-2.5 py-1 text-[9px] font-display font-black uppercase tracking-wider rounded-sm shadow-md">
                        {reel.sport}
                      </span>
                      <span className="bg-black/80 text-white px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-sm border border-white/5">
                        CLASS OF {reel.gradYear}
                      </span>
                    </div>

                    {/* Delete button option for custom added items */}
                    {reel.isCustom && (
                      <button
                        onClick={(e) => handleRemoveReel(e, reel.id)}
                        className="absolute top-4 right-4 p-2 bg-neutral-950/90 border border-white/10 text-neutral-400 hover:text-[#00BFFF] rounded-full transition-all cursor-pointer hover:bg-neutral-900"
                        title="Delete Recruit Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Body particulars and statistics */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-neutral-500 font-mono uppercase tracking-widest mb-1">{reel.position}</div>
                      <h3 className="font-display font-black text-2xl text-white group-hover:text-[#00BFFF] transition-colors uppercase leading-none mb-3">
                        {reel.name}
                      </h3>
                      
                      {/* School name mapping */}
                      <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-sans mb-5">
                        <MapPin className="w-3.5 h-3.5 text-[#00BFFF] shrink-0" />
                        <span className="truncate">{reel.school}</span>
                      </div>

                      {/* Micro metric grid detail */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-white/5 mb-5 font-mono text-center">
                        <div>
                          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">GPA</div>
                          <div className="text-xs text-white font-extrabold flex items-center justify-center gap-1.5 mt-0.5">
                            <GraduationCap className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            {reel.gpa}
                          </div>
                        </div>
                        <div className="border-l border-white/5">
                          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">HEIGHT</div>
                          <div className="text-xs text-white font-extrabold mt-0.5">{reel.height}</div>
                        </div>
                        <div className="border-l border-white/5">
                          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">WEIGHT</div>
                          <div className="text-xs text-white font-extrabold mt-0.5">{reel.weight}</div>
                        </div>
                      </div>

                      {/* Main bullet review accolade snippet */}
                      <ul className="space-y-1.5 text-xs text-neutral-400 font-sans mb-3 text-left">
                        {reel.achievements.slice(0, 2).map((ach, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#00BFFF] mt-0.5">•</span>
                            <span className="leading-snug truncate">{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Open / Share Trigger buttons footer row */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4 shrink-0">
                      <button 
                        className="flex-1 bg-white/5 group-hover:bg-[#00BFFF] hover:bg-[#00A3D9] group-hover:text-black border border-white/5 hover:border-[#00BFFF] px-3 py-2 text-neutral-300 font-display font-black text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1.5 rounded-sm"
                      >
                        <Eye className="w-3.5 h-3.5 mt-[-1px]" /> STREAM REEL
                      </button>
                      <button
                        onClick={(e) => triggerShareAthlete(e, reel)}
                        className="p-2.5 bg-neutral-950 border border-white/10 hover:border-[#00BFFF]/50 text-neutral-400 hover:text-white rounded-sm transition-all cursor-pointer flex items-center justify-center"
                        title="Copy Shareable Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* COMPONENT 1: FULL LIGHTBOX/PLAYER SCOUT PORTFOLIO MODAL */}
      <AnimatePresence>
        {activeReel && (
          <div 
            onClick={() => setActiveReel(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-white/10 w-full max-w-5xl rounded-sm overflow-hidden text-left shadow-2xl flex flex-col md:flex-row relative"
            >
              
              {/* Close Button element upper right */}
              <button 
                onClick={() => setActiveReel(null)}
                className="absolute top-4 right-4 z-35 p-2 bg-neutral-950/80 border border-white/10 text-neutral-400 hover:text-white rounded-full cursor-pointer transition-colors"
                title="Close Portal"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>

              {/* Left Column: Stream Player framework */}
              <div className="w-full md:w-[58%] bg-black flex flex-col justify-between relative aspect-video md:aspect-auto">
                <video
                  src={activeReel.videoUrl}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain md:max-h-[580px] bg-black"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual live logo branding inside lightbox */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
                  <IndIcon size={20} />
                  <span className="text-[#00BFFF] font-display text-[10px] font-black uppercase tracking-widest">
                    CINEMATIC REEL
                  </span>
                </div>
              </div>

              {/* Right Column: Complete Scout card stats particulars */}
              <div className="w-full md:w-[42%] p-6 md:p-8 flex flex-col justify-between max-h-[580px] overflow-y-auto border-t md:border-t-0 md:border-l border-white/10 bg-neutral-900 font-sans text-xs line-relaxed">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#00BFFF]/10 text-[#00BFFF] border border-[#00BFFF]/20 px-2 py-0.5 text-[9px] font-display uppercase tracking-widest font-black rounded-sm">
                      {activeReel.sport}
                    </span>
                    <span className="bg-neutral-800 text-neutral-300 font-mono text-[9px] px-2 py-0.5 rounded-sm">
                      CLASS OF {activeReel.gradYear}
                    </span>
                  </div>

                  <h2 className="font-display font-black text-3xl text-white uppercase leading-none mb-1">
                    {activeReel.name}
                  </h2>
                  <p className="text-neutral-500 uppercase font-mono tracking-widest mb-4">{activeReel.position}</p>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    {/* General Location Info */}
                    <div className="flex items-start gap-2.5 text-neutral-300">
                      <MapPin className="text-[#00BFFF] w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">{activeReel.school}</p>
                        <p className="text-[10px] text-neutral-500 uppercase font-mono">Current High School</p>
                      </div>
                    </div>

                    {/* Academic Stat card snippet row */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-white/5 my-4 font-mono text-center">
                      <div className="bg-neutral-950 p-2 border border-white/5 rounded">
                        <p className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest mb-1">GPA</p>
                        <p className="text-sm text-green-500 font-black flex items-center justify-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          {activeReel.gpa}
                        </p>
                      </div>
                      <div className="bg-neutral-950 p-2 border border-white/5 rounded">
                        <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-1">HEIGHT</p>
                        <p className="text-sm text-white font-extrabold">{activeReel.height}</p>
                      </div>
                      <div className="bg-neutral-950 p-2 border border-white/5 rounded">
                        <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest mb-1">WEIGHT</p>
                        <p className="text-sm text-white font-extrabold">{activeReel.weight}</p>
                      </div>
                    </div>

                    {/* Verified Performance Achievements List */}
                    <div>
                      <h4 className="font-display font-black text-[10px] text-white uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#00BFFF]" /> VERIFIED PERFORMANCE METRICS & HONORS
                      </h4>
                      <ul className="space-y-2 text-neutral-400 text-xs">
                        {activeReel.achievements.map((ach, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-neutral-950/60 p-2.5 rounded border border-white/5">
                            <span className="w-1.5 h-1.5 bg-[#00BFFF] rounded-full mt-1.5 shrink-0" />
                            <span className="leading-snug">{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Lightbox button interface controls */}
                <div className="space-y-3 pt-6 border-t border-white/5 mt-6 shrink-0 font-sans">
                  <div className="flex gap-2">
                    <a 
                      href={`mailto:${activeReel.contactEmail}`}
                      className="flex-1 bg-[#00BFFF] hover:bg-[#00A3D9] text-black px-4 py-3 font-display font-black tracking-widest uppercase flex items-center justify-center gap-2 text-[10px] rounded-sm transition-all shadow-lg shadow-[#00BFFF]/20"
                    >
                      <Mail className="w-3.5 h-3.5" /> CONTACT ATHLETE / COACH
                    </a>
                    
                    <button 
                      onClick={(e) => triggerShareAthlete(e, activeReel)}
                      className="bg-neutral-950 hover:bg-neutral-800 text-white border border-white/10 hover:border-[#00BFFF]/40 p-3 rounded-sm transition-all"
                      title="Copy Share Link"
                    >
                      <Share2 className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>
                  
                  {activeReel.hudlUrl && (
                    <a 
                      href={activeReel.hudlUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-neutral-950 hover:bg-neutral-800 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white px-4 py-3 font-display font-black tracking-widest uppercase flex items-center justify-center gap-2 text-[10px] rounded-sm transition-all"
                    >
                      VIEW HUDL PROFILE <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <p className="text-[9px] text-neutral-500 text-center font-mono uppercase tracking-wider">
                    ATHLETE MEDIA ID: {activeReel.id} • IND BROADCAST PORTFOLIO
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPONENT 2: SUBMIT REEL FLOATING MULTIPART SLIDEOVER MODAL */}
      <AnimatePresence>
        {isUploadOpen && (
          <div 
            onClick={() => setIsUploadOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto select-none font-sans text-xs text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-white/10 w-full max-w-xl rounded-sm overflow-hidden text-left shadow-2xl relative"
            >
              
              {/* Form Close trigger */}
              <button 
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-4 right-4 z-40 p-2 bg-neutral-950/80 border border-white/10 text-neutral-450 hover:text-white rounded-full cursor-pointer transition-transform"
                title="Cancel submit"
              >
                <Plus className="w-4 h-4 rotate-45" />
              </button>

              <div className="p-6 md:p-8 bg-neutral-950 border-b border-white/5 relative">
                <div className="absolute top-0 right-0 h-28 w-28 bg-[#00BFFF] opacity-10 blur-2xl pointer-events-none" />
                <div className="flex items-center gap-1.5 text-[#00BFFF] font-display font-black tracking-wider text-[9px] uppercase mb-1.5">
                  <Upload className="w-4 h-4 text-[#00BFFF]" /> SECURED FILE INGESTION
                </div>
                <h3 className="font-display font-black text-2xl text-white uppercase leading-none">
                  SUBMIT ATHLETE REEL
                </h3>
                <p className="text-neutral-450 text-[11px] text-neutral-400 font-sans leading-relaxed mt-1">
                  Submit your highlight reel to the digital showcase directory. Share your performance portfolio across social media, athletic resumes, and personal archives.
                </p>
              </div>

              {/* Form implementation panel */}
              {isSubmitting ? (
                <div className="p-10 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#00BFFF]/20 border-t-[#00BFFF] rounded-full animate-spin mx-auto" />
                  <p className="font-display font-black text-sm uppercase text-white animate-pulse">PROCESSING ACTION VIDEO...</p>
                  <p className="text-[10px] text-neutral-500 font-mono">Syncing fields, securing player credentials and generating thumbnails.</p>
                </div>
              ) : validationSuccess ? (
                <div className="p-10 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#00BFFF] rounded-full flex items-center justify-center mx-auto text-black shadow-2xl shadow-[#00BFFF]/30">
                    <Check className="w-6 h-6 text-black" />
                  </div>
                  <h4 className="font-display font-black text-lg uppercase text-white">REEL INGESTED SUCCESSFULLY!</h4>
                  <p className="text-[11px] text-neutral-400 font-sans max-w-xs mx-auto">Your athlete showcase reel has been processed and is now live in the showcase directory.</p>
                </div>
              ) : (
                <form onSubmit={handleUploaderSubmit} className="p-6 md:p-8 space-y-5 max-h-[460px] overflow-y-auto">
                  
                  {fileError && (
                    <div className="bg-red-950/40 border border-red-500/25 p-3 rounded text-red-400 text-xs flex items-start gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  {/* Section 1: Ingest Video File */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-white font-display">ATHLETE HIGHLIGHT VIDEO FILE</label>
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all ${
                        selectedFile 
                          ? 'border-[#00BFFF] bg-[#00BFFF]/10' 
                          : 'border-white/10 bg-neutral-950 hover:border-white/30'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/mp4,video/quicktime,video/x-msvideo" 
                        className="hidden" 
                      />
                      <Upload className={`w-8 h-8 mx-auto mb-2.5 transition-colors ${selectedFile ? 'text-[#00BFFF]' : 'text-neutral-500'}`} />
                      
                      {selectedFile ? (
                        <div className="space-y-1">
                          <p className="text-white font-mono text-[11px] truncate font-bold">{selectedFile.name}</p>
                          <p className="text-[10px] text-neutral-450 uppercase font-mono tracking-wider">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Click to replace file
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-white font-semibold text-xs">Drag and drop or Click to browse your MP4 video</p>
                          <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Supported formats: MP4, MOV • Max size 100MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Core Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-bold opacity-60 text-white font-display">Athlete Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Hunter Vance" 
                        className="w-full bg-neutral-950 border border-white/5 px-3 py-2.5 rounded text-xs text-white focus:border-[#00BFFF] outline-none transition-all placeholder:text-neutral-500"
                        required
                        maxLength={30}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-bold opacity-60 text-white font-display">Sport Channel *</label>
                      <select 
                        name="sport"
                        value={formData.sport}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-white/5 px-3 py-2.5 rounded text-xs text-white focus:border-[#00BFFF] outline-none cursor-pointer"
                      >
                        <option value="Football">Football</option>
                        <option value="7v7 Football">7v7 Football</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Soccer">Soccer</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Softball">Softball</option>
                        <option value="Girls Flag Football">Girls Flag Football</option>
                        <option value="Wrestling">Wrestling</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-bold opacity-60 text-white font-display">Position *</label>
                      <input 
                        type="text" 
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="e.g. Cornerback / WR" 
                        className="w-full bg-neutral-950 border border-white/5 px-3 py-2.5 rounded text-xs text-white focus:border-[#00BFFF] outline-none transition-all placeholder:text-neutral-500"
                        required
                        maxLength={35}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-bold opacity-60 text-white font-display">High School *</label>
                      <input 
                        type="text" 
                        name="school"
                        value={formData.school}
                        onChange={handleInputChange}
                        placeholder="e.g. Sierra Canyon HS, CA" 
                        className="w-full bg-neutral-950 border border-white/5 px-3 py-2.5 rounded text-xs text-white focus:border-[#00BFFF] outline-none transition-all placeholder:text-neutral-500"
                        required
                        maxLength={40}
                      />
                    </div>
                  </div>

                  {/* Section 3: Physical & Academic particulars */}
                  <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
                    <div className="space-y-1.5">
                      <label className="uppercase tracking-widest font-bold text-neutral-400 font-display text-[9px]">GRAD YEAR</label>
                      <select 
                        name="gradYear"
                        value={formData.gradYear}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-white/5 p-2 rounded text-white focus:border-[#00BFFF] cursor-pointer"
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="uppercase tracking-widest font-bold text-neutral-400 font-display text-[9px]">GPA</label>
                      <input 
                        type="text" 
                        name="gpa"
                        value={formData.gpa}
                        onChange={handleInputChange}
                        placeholder="e.g. 4.0" 
                        className="w-full bg-neutral-950 border border-white/5 p-2 rounded text-white focus:border-[#00BFFF] outline-none placeholder:text-neutral-600"
                        maxLength={4}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="uppercase tracking-widest font-bold text-neutral-400 font-display text-[9px]">HEIGHT</label>
                      <input 
                        type="text" 
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="e.g. 6'2\" 
                        className="w-full bg-neutral-950 border border-white/5 p-2 rounded text-white focus:border-[#00BFFF] outline-none placeholder:text-neutral-600"
                        maxLength={7}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="uppercase tracking-widest font-bold text-neutral-400 font-display text-[9px]">WEIGHT (lbs)</label>
                      <input 
                        type="number" 
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g. 195" 
                        className="w-full bg-neutral-950 border border-white/5 p-2 rounded text-white focus:border-[#00BFFF] outline-none placeholder:text-neutral-600"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  {/* Section 4: Contact details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-bold opacity-60 text-white font-display">Contact Email *</label>
                      <input 
                        type="email" 
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="e.g. quarterback@gmail.com" 
                        className="w-full bg-neutral-950 border border-white/5 px-3 py-2.5 rounded text-xs text-white focus:border-[#00BFFF] outline-none transition-all placeholder:text-neutral-501"
                        required
                        maxLength={42}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-widest font-bold opacity-60 text-white font-display">Hudl Profile Link (Optional)</label>
                      <input 
                        type="url" 
                        name="hudlUrl"
                        value={formData.hudlUrl}
                        onChange={handleInputChange}
                        placeholder="https://hudl.com/profile/..." 
                        className="w-full bg-neutral-950 border border-white/5 px-3 py-2.5 rounded text-xs text-white focus:border-[#00BFFF] outline-none transition-all placeholder:text-neutral-501"
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-bold opacity-60 text-white font-display">Athletic Acclodes / Stats List (one per line)</label>
                    <textarea 
                      name="achievementsText"
                      value={formData.achievementsText}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="e.g. First-Team All-League&#10;Averaged 220 rushing yards per game&#10;Squats 420 lbs, 40yd dash: 4.45s" 
                      className="w-full bg-neutral-950 border border-white/5 p-3 rounded text-xs text-white focus:border-[#00BFFF] outline-none transition-all placeholder:text-neutral-501 font-sans"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-sm uppercase tracking-widest transition-all rounded-sm cursor-pointer shadow-lg shadow-[#00BFFF]/20 active:scale-[0.99] hover:scale-[1.01]"
                  >
                    COMPLETE UPLOAD & PUBLISH
                  </button>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
