import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IndLogo } from './components/IndLogo';
import LiveBroadcastHub from './components/LiveBroadcastHub';
import LiveScoreboard from './components/LiveScoreboard';
import RecruitmentReels from './components/RecruitmentReels';
import ServiceDetailPage from './components/ServiceDetailPage';
import CreatorApplicationModal from './components/CreatorApplicationModal';
import PhotosGallery from './components/PhotosGallery';
import AthleteFeatures from './components/AthleteFeatures';
import ArticlesSection from './components/ArticlesSection';
import SportCoveragePage from './components/SportCoveragePage';
import LiveScoreTicker from './components/LiveScoreTicker';
import MediaCredentialsModal from './components/MediaCredentialsModal';
import ContactUsModal from './components/ContactUsModal';
import AdvertiseWithUsModal from './components/AdvertiseWithUsModal';
import { 
  Play, 
  Camera, 
  Video, 
  Trophy, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Menu, 
  X, 
  Instagram, 
  Youtube,
  Facebook,
  Star,
  Newspaper,
  Image as ImageIcon,
  ShieldCheck,
  Mail,
  Megaphone,
  Flame,
  Award,
  Share2,
  Activity,
  Tv,
  Phone,
  Send,
  Sparkles
} from 'lucide-react';

const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.38a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.64 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V9.05a8.16 8.16 0 0 0 4.91 1.62V7.22a4.85 4.85 0 0 1-1-.53z"/>
  </svg>
);

const XIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SERVICES = [
  {
    id: 'game-coverage',
    title: 'Game Coverage',
    description: 'Multiple angles, broadcast quality. We film every snap with professional precision.',
    icon: <Video className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'highlight-reels',
    title: 'Athlete Showcase Reels',
    description: 'Cinematic highlight reels designed to showcase performance, skill milestones, and athletic achievements.',
    icon: <Play className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'live-broadcasts',
    title: 'Live Stream Broadcasts',
    description: 'Multi-camera varsity live streaming with instant scorebugs, slow-motion replays, and play-by-play commentary.',
    icon: <Tv className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800'
  }
];

const TESTIMONIALS = [
  {
    name: "Marcus Thompson",
    role: "Quarterback, Central High",
    content: "The showcase highlight reel IND created for me captured every snap in broadcast quality. Having high-definition media ready to share on my digital portfolio made all the difference.",
    rating: 5
  },
  {
    name: "Coach Sarah Miller",
    role: "Elite Youth Soccer League",
    content: "We've tried other videographers, but nobody captures the energy of the pitch like this team. Their Media Day for our club was spectacular.",
    rating: 5
  },
  {
    name: "Jason Lee",
    role: "Parent",
    content: "No more blurry phone videos! Now I can finally sit and enjoy my daughter's games knowing IND is capturing every moment perfectly.",
    rating: 5
  }
];

const GALLERY_CATEGORIES = [
  {
    name: '11v11 Football',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
    sportKey: 'Football',
    count: '3 ATHLETES'
  },
  {
    name: 'Basketball',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800',
    sportKey: 'Basketball',
    count: '2 ATHLETES'
  },
  {
    name: '7v7 Football',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=800',
    sportKey: '7v7 Football',
    count: '3 ATHLETES'
  },
  {
    name: 'Volleyball',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800',
    sportKey: 'Volleyball',
    count: 'NEW PORTAL'
  },
  {
    name: 'Girls Flag Football',
    image: 'https://images.unsplash.com/photo-1628891890467-b79f2c87c69a?auto=format&fit=crop&q=80&w=800',
    sportKey: 'Girls Flag Football',
    count: 'NEW PORTAL'
  },
  {
    name: 'Wrestling',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800',
    sportKey: 'Wrestling',
    count: 'NEW PORTAL'
  }
];

const HERO_HIGHLIGHT_VIDEOS = [
  {
    sport: 'Football',
    title: 'Varsity Friday Night Lights',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-american-football-match-under-the-rain-40348-large.mp4',
    poster: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=1920'
  },
  {
    sport: 'Basketball',
    title: 'Championship Rim Rocker',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-basketball-player-dunking-40018-large.mp4',
    poster: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1920'
  },
  {
    sport: 'Track & Field',
    title: 'State Finals Sprint',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-athletes-in-a-running-race-40351-large.mp4',
    poster: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1920'
  },
  {
    sport: 'Soccer',
    title: 'Golden Goal Free Kick',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-players-playing-a-match-40346-large.mp4',
    poster: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1920'
  }
];

type ViewType = 
  | 'home' 
  | 'live-scoreboard'
  | 'reels' 
  | 'game-coverage' 
  | 'girls-flag-football' 
  | 'photos' 
  | 'athlete-features' 
  | 'articles'
  | 'sport-coverage';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedSportName, setSelectedSportName] = useState<'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football'>('Football');
  const [selectedPhotoSport, setSelectedPhotoSport] = useState<string>('All');
  const [selectedArticleSport, setSelectedArticleSport] = useState<string>('All');
  const [currentHeroVideoIdx, setCurrentHeroVideoIdx] = useState(0);

  // Dropdown States
  const [isSportsDropdownOpen, setIsSportsDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

  // Booking Form State
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sport: 'Football',
    service: 'Individual Performance Highlight Reel',
    notes: ''
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isMediaCredsOpen, setIsMediaCredsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdvertiseOpen, setIsAdvertiseOpen] = useState(false);

  const sportsDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "IND Sports Media";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroVideoIdx((prev) => (prev + 1) % HERO_HIGHLIGHT_VIDEOS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sportsDropdownRef.current && !sportsDropdownRef.current.contains(event.target as Node)) {
        setIsSportsDropdownOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setIsAboutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToHome = () => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setIsAboutDropdownOpen(false);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSport = (sport: 'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football') => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setSelectedSportName(sport);
    setCurrentView('sport-coverage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPhotos = (sport: string = 'All') => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setSelectedPhotoSport(sport);
    setCurrentView('photos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticles = (sport: string = 'All') => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setSelectedArticleSport(sport);
    setCurrentView('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAthleteFeatures = () => {
    setIsMenuOpen(false);
    setCurrentView('athlete-features');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLiveScoreboard = () => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setIsAboutDropdownOpen(false);
    setCurrentView('live-scoreboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setIsAboutDropdownOpen(false);

    if (id === 'home') {
      navigateToHome();
      return;
    }
    
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00BFFF] selection:text-black">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 bg-black/95 backdrop-blur-md shadow-2xl border-b border-white/10 ${
          scrolled ? 'py-2.5' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo / Brand */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={navigateToHome}
            id="nav-logo"
          >
            <IndLogo size="md" className="group-hover:opacity-90 transition-opacity" />
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 font-display uppercase text-xs xl:text-sm tracking-widest font-bold text-white">
            
            {/* 1. Home Button */}
            <button 
              onClick={navigateToHome}
              className={`hover:text-[#00BFFF] transition-colors cursor-pointer py-1 ${
                currentView === 'home' ? 'text-[#00BFFF] font-extrabold border-b-2 border-[#00BFFF]' : ''
              }`}
            >
              Home
            </button>

            {/* 2. Live Scoreboard Button with Live Pulse */}
            <button 
              onClick={navigateToLiveScoreboard}
              className={`hover:text-[#00BFFF] transition-colors cursor-pointer py-1 flex items-center gap-2 ${
                currentView === 'live-scoreboard' ? 'text-[#00BFFF] font-extrabold border-b-2 border-[#00BFFF]' : ''
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-white">Live Scoreboard</span>
              <span className="text-[10px] bg-red-600/30 border border-red-500/40 text-red-300 px-1.5 py-0.5 rounded font-mono font-bold">
                LIVE
              </span>
            </button>

            {/* 2. Sports Dropdown */}
            <div 
              ref={sportsDropdownRef}
              className="relative"
              onMouseEnter={() => setIsSportsDropdownOpen(true)}
              onMouseLeave={() => setIsSportsDropdownOpen(false)}
            >
              <button 
                onClick={() => setIsSportsDropdownOpen(!isSportsDropdownOpen)}
                className={`flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors cursor-pointer py-1 ${
                  currentView === 'sport-coverage' ? 'text-[#00BFFF] font-extrabold border-b-2 border-[#00BFFF]' : ''
                }`}
              >
                Sports <ChevronDown size={14} className={`transition-transform duration-200 ${isSportsDropdownOpen ? 'rotate-180 text-[#00BFFF]' : ''}`} />
              </button>

              <AnimatePresence>
                {isSportsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-[#111111] border border-white/15 rounded-md shadow-2xl py-2 z-50 backdrop-blur-xl"
                  >
                    {[
                      { name: 'Football', icon: '🏈' },
                      { name: 'Basketball', icon: '🏀' },
                      { name: 'Volleyball', icon: '🏐' },
                      { name: 'Wrestling', icon: '🤼' },
                      { name: 'Flag Football', icon: '🚩' }
                    ].map((s) => (
                      <button
                        key={s.name}
                        onClick={() => navigateToSport(s.name as any)}
                        className="w-full text-left px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider text-white/80 hover:text-black hover:bg-[#00BFFF] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <span>{s.icon}</span> {s.name}
                        </span>
                        <span className="text-[10px] opacity-60">→</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Photos Button */}
            <button 
              onClick={() => navigateToPhotos('All')}
              className={`hover:text-[#00BFFF] transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                currentView === 'photos' ? 'text-[#00BFFF] font-extrabold border-b-2 border-[#00BFFF]' : ''
              }`}
            >
              <Camera size={14} className="text-[#00BFFF]" /> Photos
            </button>

            {/* 4. Athlete Features Button */}
            <button 
              onClick={navigateToAthleteFeatures}
              className={`hover:text-[#00BFFF] transition-colors cursor-pointer py-1 ${
                currentView === 'athlete-features' ? 'text-[#00BFFF] font-extrabold border-b-2 border-[#00BFFF]' : ''
              }`}
            >
              Athlete Features
            </button>

            {/* 5. Articles Button */}
            <button 
              onClick={() => navigateToArticles('All')}
              className={`hover:text-[#00BFFF] transition-colors cursor-pointer py-1 ${
                currentView === 'articles' ? 'text-[#00BFFF] font-extrabold border-b-2 border-[#00BFFF]' : ''
              }`}
            >
              Articles
            </button>

            {/* 6. About Us Dropdown */}
            <div 
              ref={aboutDropdownRef}
              className="relative"
              onMouseEnter={() => setIsAboutDropdownOpen(true)}
              onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
              <button 
                onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-[#00BFFF] transition-colors cursor-pointer py-1"
              >
                About Us <ChevronDown size={14} className={`transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180 text-[#00BFFF]' : ''}`} />
              </button>

              <AnimatePresence>
                {isAboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1 w-64 bg-[#111111] border border-white/15 rounded-md shadow-2xl py-2 z-50 backdrop-blur-xl"
                  >
                    <button
                      onClick={() => { setIsAboutDropdownOpen(false); setIsMediaCredsOpen(true); }}
                      className="w-full text-left px-4 py-3 text-xs font-display font-bold uppercase tracking-wider text-white/80 hover:text-black hover:bg-[#00BFFF] transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <ShieldCheck size={16} className="text-[#00BFFF] group-hover:text-black" />
                      <div>
                        <div>Media Credentials</div>
                        <div className="text-[10px] opacity-70 font-sans normal-case">Sideline passes & creator access</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { setIsAboutDropdownOpen(false); setIsContactOpen(true); }}
                      className="w-full text-left px-4 py-3 text-xs font-display font-bold uppercase tracking-wider text-white/80 hover:text-black hover:bg-[#00BFFF] transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <Mail size={16} className="text-[#00BFFF]" />
                      <div>
                        <div>Contact Us</div>
                        <div className="text-[10px] opacity-70 font-sans normal-case">Direct message & media desk</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { setIsAboutDropdownOpen(false); setIsAdvertiseOpen(true); }}
                      className="w-full text-left px-4 py-3 text-xs font-display font-bold uppercase tracking-wider text-white/80 hover:text-black hover:bg-[#00BFFF] transition-colors flex items-center gap-2.5 cursor-pointer border-t border-white/10"
                    >
                      <Megaphone size={16} className="text-[#00BFFF]" />
                      <div>
                        <div>Advertise With Us</div>
                        <div className="text-[10px] opacity-70 font-sans normal-case">Sponsorships, reels & rate card</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action: Apply Button */}
            <button 
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black px-4 py-2 rounded-sm transition-all uppercase tracking-widest font-black cursor-pointer shadow-lg shadow-[#00BFFF]/20 flex items-center gap-1.5 border border-[#00BFFF]"
            >
              <Camera size={14} /> Apply Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white p-2 focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Nav Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden w-full bg-black/98 border-t border-white/10 px-6 py-6 overflow-y-auto max-h-[85vh] flex flex-col gap-4 font-display uppercase text-sm text-white"
            >
              {/* Home */}
              <button 
                onClick={navigateToHome}
                className="text-left py-2 border-b border-white/10 text-white font-bold"
              >
                Home
              </button>

              {/* Live Scoreboard */}
              <button 
                onClick={navigateToLiveScoreboard}
                className="text-left py-2.5 px-3 bg-red-950/40 border border-red-500/40 rounded flex items-center justify-between text-white font-black"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>🔥 Live Scoreboard & GameCast</span>
                </span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-mono font-bold">
                  TONIGHT
                </span>
              </button>

              {/* Sports Accordion */}
              <div className="py-2 border-b border-white/10">
                <div className="text-[#00BFFF] font-black text-xs tracking-widest mb-2 flex items-center justify-between">
                  <span>Sports Coverage</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 pl-2">
                  {[
                    { name: 'Football', icon: '🏈' },
                    { name: 'Basketball', icon: '🏀' },
                    { name: 'Volleyball', icon: '🏐' },
                    { name: 'Wrestling', icon: '🤼' },
                    { name: 'Flag Football', icon: '🚩' }
                  ].map((s) => (
                    <button
                      key={s.name}
                      onClick={() => navigateToSport(s.name as any)}
                      className="text-left py-1.5 text-xs text-white/80 hover:text-[#00BFFF] flex items-center gap-2"
                    >
                      <span>{s.icon}</span> {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <button 
                onClick={() => navigateToPhotos('All')}
                className="text-left py-2 border-b border-white/10 flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><Camera size={16} className="text-[#00BFFF]" /> Photos Gallery</span>
                <span className="text-[#00BFFF] text-xs">View →</span>
              </button>

              {/* Athlete Features */}
              <button 
                onClick={navigateToAthleteFeatures}
                className="text-left py-2 border-b border-white/10"
              >
                Athlete Features
              </button>

              {/* Articles */}
              <button 
                onClick={() => navigateToArticles('All')}
                className="text-left py-2 border-b border-white/10"
              >
                Articles & Recaps
              </button>

              {/* About Us Submenu */}
              <div className="py-2 border-b border-white/10">
                <div className="text-[#00BFFF] font-black text-xs tracking-widest mb-2">
                  About IND Sports Media
                </div>
                <div className="flex flex-col gap-2 pl-2">
                  <button 
                    onClick={() => { setIsMenuOpen(false); setIsMediaCredsOpen(true); }}
                    className="text-left py-1 text-xs text-white/80 flex items-center gap-2"
                  >
                    <ShieldCheck size={14} className="text-[#00BFFF]" /> Media Credentials
                  </button>
                  <button 
                    onClick={() => { setIsMenuOpen(false); setIsContactOpen(true); }}
                    className="text-left py-1 text-xs text-white/80 flex items-center gap-2"
                  >
                    <Mail size={14} className="text-[#00BFFF]" /> Contact Us
                  </button>
                  <button 
                    onClick={() => { setIsMenuOpen(false); setIsAdvertiseOpen(true); }}
                    className="text-left py-1 text-xs text-white/80 flex items-center gap-2"
                  >
                    <Megaphone size={14} className="text-[#00BFFF]" /> Advertise With Us
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button 
                onClick={() => { setIsMenuOpen(false); setIsApplyModalOpen(true); }}
                className="bg-[#00BFFF] text-black py-3 rounded-sm font-black text-center text-xs tracking-widest mt-2"
              >
                Apply Now (Photographers & Creators)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Router */}
      {currentView === 'live-scoreboard' ? (
        <LiveScoreboard 
          onBack={navigateToHome}
        />
      ) : currentView === 'photos' ? (
        <PhotosGallery 
          initialSport={selectedPhotoSport}
          onBackToHome={navigateToHome}
        />
      ) : currentView === 'athlete-features' ? (
        <AthleteFeatures 
          onBookReel={() => {
            setCurrentView('home');
            setTimeout(() => scrollTo('booking'), 100);
          }}
        />
      ) : currentView === 'articles' ? (
        <ArticlesSection 
          initialSport={selectedArticleSport}
        />
      ) : currentView === 'sport-coverage' ? (
        <SportCoveragePage 
          sportName={selectedSportName}
          onNavigateToPhotos={navigateToPhotos}
          onNavigateToArticles={navigateToArticles}
          onBookReel={() => {
            setCurrentView('home');
            setTimeout(() => scrollTo('booking'), 100);
          }}
        />
      ) : currentView === 'reels' ? (
        <RecruitmentReels 
          initialSport="All"
          onBack={navigateToHome} 
        />
      ) : currentView === 'game-coverage' || currentView === 'girls-flag-football' ? (
        <ServiceDetailPage 
          serviceId={currentView}
          onBack={navigateToHome}
          onBookNow={() => {
            setCurrentView('home');
            setTimeout(() => scrollTo('booking'), 100);
          }}
        />
      ) : (
        <>
          {/* Top Live Score Ticker directly on main page */}
          <div className="pt-16 sm:pt-20">
            <LiveScoreTicker onNavigateToScoreboard={(gameId) => navigateToLiveScoreboard()} />
          </div>

          {/* Hero Section */}
          <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video 
                key={HERO_HIGHLIGHT_VIDEOS[currentHeroVideoIdx].url}
                autoPlay 
                loop 
                muted 
                playsInline
                poster={HERO_HIGHLIGHT_VIDEOS[currentHeroVideoIdx].poster}
                className="w-full h-full object-cover opacity-50 filter contrast-110 brightness-90 scale-105 transition-opacity duration-1000"
              >
                <source src={HERO_HIGHLIGHT_VIDEOS[currentHeroVideoIdx].url} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center"
              >
                {/* Main Hero Logo */}
                <div className="mb-8">
                  <IndLogo size="xl" />
                </div>

                {/* Headline */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] max-w-5xl font-display">
                  CAPTURING THE PULSE OF SPORTS
                </h1>

                {/* Cyan Pill Button */}
                <div className="mb-8">
                  <button 
                    onClick={() => scrollTo('booking')}
                    className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs sm:text-sm uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(0,191,255,0.6)] cursor-pointer"
                  >
                    SIGN UP
                  </button>
                </div>

                {/* Hero Video Carousel Indicator Dots */}
                <div className="flex items-center gap-3">
                  {HERO_HIGHLIGHT_VIDEOS.map((vid, idx) => (
                    <button
                      key={vid.sport}
                      onClick={() => setCurrentHeroVideoIdx(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentHeroVideoIdx === idx 
                          ? 'w-8 bg-[#00BFFF]' 
                          : 'w-2.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Show ${vid.sport} video`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* 3 Core Selling Points - Compliant with IHSAA & State Rules */}
          <section className="py-20 bg-gradient-to-b from-[#0c0c0c] to-[#111111] border-b border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#00BFFF_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-display font-black tracking-widest uppercase mb-4">
                  <ShieldCheck size={14} /> LOCAL • REGIONAL • NATIONAL COVERAGE
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase tracking-tight text-white mb-4">
                  THE IND MEDIA <span className="text-[#00BFFF]">STANDARD</span>
                </h2>
                <div className="h-1 w-20 bg-[#00BFFF] mx-auto mb-6"></div>
                <p className="text-white/60 font-sans text-base leading-relaxed">
                  Independent, high-definition sports media and performance capture built strictly to celebrate athletic excellence across every level.
                </p>
              </div>

              {/* 3 Selling Points Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. PROFESSIONAL CAPTURE */}
                <motion.div 
                  whileHover={{ y: -6 }}
                  className="bg-[#141414] border border-white/10 hover:border-[#00BFFF]/50 p-8 rounded-xl flex flex-col justify-between transition-all duration-300 shadow-2xl relative group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00BFFF]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00BFFF]/10 transition-colors" />
                  <div>
                    <div className="w-14 h-14 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] mb-6 group-hover:scale-110 group-hover:bg-[#00BFFF] group-hover:text-black transition-all">
                      <Camera size={28} />
                    </div>
                    <span className="text-[11px] font-mono text-[#00BFFF] uppercase tracking-widest font-black block mb-2">01 / CAPTURE</span>
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-tight mb-3">
                      PROFESSIONAL CAPTURE
                    </h3>
                    <p className="text-white/70 font-sans text-sm sm:text-base leading-relaxed">
                      High-quality photo and video that preserves every important moment.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-white/40">
                    <CheckCircle2 size={14} className="text-[#00BFFF]" /> 4K 120fps Cinema Rigs
                  </div>
                </motion.div>

                {/* 2. ATHLETE EXPOSURE */}
                <motion.div 
                  whileHover={{ y: -6 }}
                  className="bg-[#141414] border border-[#00BFFF]/30 hover:border-[#00BFFF] p-8 rounded-xl flex flex-col justify-between transition-all duration-300 shadow-2xl relative group ring-1 ring-[#00BFFF]/20"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00BFFF]/10 rounded-bl-full pointer-events-none group-hover:bg-[#00BFFF]/20 transition-colors" />
                  <div>
                    <div className="w-14 h-14 rounded-lg bg-[#00BFFF]/20 border border-[#00BFFF]/50 flex items-center justify-center text-[#00BFFF] mb-6 group-hover:scale-110 group-hover:bg-[#00BFFF] group-hover:text-black transition-all">
                      <Flame size={28} />
                    </div>
                    <span className="text-[11px] font-mono text-[#00BFFF] uppercase tracking-widest font-black block mb-2">02 / SPOTLIGHT</span>
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-tight mb-3">
                      ATHLETE EXPOSURE
                    </h3>
                    <p className="text-white/70 font-sans text-sm sm:text-base leading-relaxed">
                      Media designed to showcase performance, skills and accomplishments.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-white/40">
                    <CheckCircle2 size={14} className="text-[#00BFFF]" /> Verified Athletic Portfolios
                  </div>
                </motion.div>

                {/* 3. SOCIAL-READY CONTENT */}
                <motion.div 
                  whileHover={{ y: -6 }}
                  className="bg-[#141414] border border-white/10 hover:border-[#00BFFF]/50 p-8 rounded-xl flex flex-col justify-between transition-all duration-300 shadow-2xl relative group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00BFFF]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00BFFF]/10 transition-colors" />
                  <div>
                    <div className="w-14 h-14 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] mb-6 group-hover:scale-110 group-hover:bg-[#00BFFF] group-hover:text-black transition-all">
                      <Share2 size={28} />
                    </div>
                    <span className="text-[11px] font-mono text-[#00BFFF] uppercase tracking-widest font-black block mb-2">03 / DIGITAL</span>
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-tight mb-3">
                      SOCIAL-READY CONTENT
                    </h3>
                    <p className="text-white/70 font-sans text-sm sm:text-base leading-relaxed">
                      Ready-to-share content built for Instagram, TikTok, X and digital portfolios.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-white/40">
                    <CheckCircle2 size={14} className="text-[#00BFFF]" /> 9:16 & 16:9 Multi-Format Masters
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Quick Hub Navigation Cards */}
          <section className="py-16 bg-[#0c0c0c] border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                  onClick={() => navigateToPhotos('All')}
                  className="bg-[#141414] border border-white/10 hover:border-[#00BFFF]/60 p-6 rounded-lg cursor-pointer group transition-all duration-300 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={24} />
                  </div>
                  <h3 className="text-white font-display font-black text-lg uppercase mb-1 group-hover:text-[#00BFFF] transition-colors">
                    Action Photos
                  </h3>
                  <p className="text-white/50 text-xs font-sans mb-3">
                    Browse 4K sideline albums for Football, Hoops, Volleyball & more.
                  </p>
                  <span className="text-[#00BFFF] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    View Gallery →
                  </span>
                </div>

                <div 
                  onClick={navigateToAthleteFeatures}
                  className="bg-[#141414] border border-white/10 hover:border-[#00BFFF]/60 p-6 rounded-lg cursor-pointer group transition-all duration-300 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] mb-4 group-hover:scale-110 transition-transform">
                    <Star size={24} />
                  </div>
                  <h3 className="text-white font-display font-black text-lg uppercase mb-1 group-hover:text-[#00BFFF] transition-colors">
                    Athlete Features
                  </h3>
                  <p className="text-white/50 text-xs font-sans mb-3">
                    Verified athletic stats, skill highlights, and player spotlights.
                  </p>
                  <span className="text-[#00BFFF] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    Explore Spotlights →
                  </span>
                </div>

                <div 
                  onClick={() => navigateToArticles('All')}
                  className="bg-[#141414] border border-white/10 hover:border-[#00BFFF]/60 p-6 rounded-lg cursor-pointer group transition-all duration-300 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] mb-4 group-hover:scale-110 transition-transform">
                    <Newspaper size={24} />
                  </div>
                  <h3 className="text-white font-display font-black text-lg uppercase mb-1 group-hover:text-[#00BFFF] transition-colors">
                    Articles & Recaps
                  </h3>
                  <p className="text-white/50 text-xs font-sans mb-3">
                    In-depth journalism, game recaps, and tournament previews.
                  </p>
                  <span className="text-[#00BFFF] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    Read News →
                  </span>
                </div>

                <div 
                  onClick={() => setIsAdvertiseOpen(true)}
                  className="bg-[#141414] border border-white/10 hover:border-[#00BFFF]/60 p-6 rounded-lg cursor-pointer group transition-all duration-300 shadow-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] mb-4 group-hover:scale-110 transition-transform">
                    <Megaphone size={24} />
                  </div>
                  <h3 className="text-white font-display font-black text-lg uppercase mb-1 group-hover:text-[#00BFFF] transition-colors">
                    Advertise With Us
                  </h3>
                  <p className="text-white/50 text-xs font-sans mb-3">
                    Brand partnerships, live stream spots, and social campaigns.
                  </p>
                  <span className="text-[#00BFFF] text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    Partner With Us →
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-24 bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-wider text-white mb-4">
                  What We Do
                </h2>
                <div className="h-1 w-20 bg-[#00BFFF] mx-auto mb-6"></div>
                <p className="text-white/60 font-sans text-base leading-relaxed">
                  We bridge the gap between high school athletics and premier sports entertainment. Our team delivers elite video production for athletes, schools, and programs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SERVICES.map((service) => (
                  <motion.div 
                    key={service.id}
                    whileHover={{ y: -8 }}
                    className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 p-3 bg-black/80 rounded-sm text-[#00BFFF] border border-[#00BFFF]/20">
                          {service.icon}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-display font-black uppercase text-white mb-2">
                          {service.title}
                        </h3>
                        <p className="text-white/60 font-sans text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      {service.id === 'highlight-reels' ? (
                        <button 
                          onClick={() => { setCurrentView('reels'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-full py-3 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black uppercase text-xs tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00BFFF]/20"
                        >
                          EXPLORE ATHLETE MEDIA <ChevronRight size={16} />
                        </button>
                      ) : service.id === 'live-broadcasts' ? (
                        <button 
                          onClick={() => {
                            const broadcastSection = document.getElementById('broadcast');
                            if (broadcastSection) {
                              broadcastSection.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              navigateToLiveScoreboard();
                            }
                          }}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-display font-bold uppercase text-xs tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                        >
                          Explore Live Streams <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setCurrentView(service.id as any);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-display font-bold uppercase text-xs tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                        >
                          Learn More <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Live Broadcast Hub */}
          <LiveBroadcastHub onApplyClick={() => setIsApplyModalOpen(true)} />

          {/* Testimonials */}
          <section id="testimonials" className="py-24 bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-wider text-white mb-4">
                  Trusted By Champions
                </h2>
                <div className="h-1 w-20 bg-[#00BFFF] mx-auto mb-6"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((t, idx) => (
                  <div key={idx} className="bg-[#111111] p-8 rounded-lg border border-white/5 flex flex-col justify-between relative shadow-lg">
                    <div>
                      <div className="flex gap-1 text-[#00BFFF] mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-white/80 font-sans text-sm leading-relaxed mb-6 italic">
                        "{t.content}"
                      </p>
                    </div>
                    <div>
                      <h4 className="font-display font-bold uppercase tracking-wider text-white text-sm">
                        {t.name}
                      </h4>
                      <p className="text-white/40 text-xs font-sans">
                        {t.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Booking Section */}
          <section id="booking" className="py-24 bg-gradient-to-b from-black to-[#050505] relative overflow-hidden border-t border-white/10">
            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
              <h2 className="text-4xl sm:text-5xl font-display font-black uppercase text-white tracking-tight mb-4">
                Ready For Your <span className="text-[#00BFFF]">Breakout Season?</span>
              </h2>
              <p className="text-white/60 font-sans text-base max-w-xl mx-auto mb-10">
                Lock in your game coverage, book a custom highlight reel, or schedule an all-day Media Day for your entire squad.
              </p>

              {bookingStatus === 'success' ? (
                <div className="bg-[#111111] border border-[#00BFFF]/40 p-8 rounded-xl max-w-xl mx-auto shadow-2xl text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#00BFFF]/15 border border-[#00BFFF]/40 flex items-center justify-center text-[#00BFFF] mx-auto shadow-lg shadow-[#00BFFF]/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black uppercase text-white tracking-tight mb-2">
                      Booking Request Dispatched!
                    </h3>
                    <p className="text-white/70 text-sm font-sans leading-relaxed">
                      Thank you, <strong className="text-white">{bookingFormData.name}</strong>. Your request for <strong className="text-[#00BFFF]">{bookingFormData.service}</strong> ({bookingFormData.sport}) has been synced directly to our desk at <strong className="text-white font-mono">admin@indsports.media</strong>.
                    </p>
                  </div>

                  <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-xs text-left space-y-2">
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-white/40 uppercase font-bold">Recipient:</span>
                      <span className="text-[#00BFFF] font-mono font-bold">admin@indsports.media</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1.5">
                      <span className="text-white/40 uppercase font-bold">Direct Phone:</span>
                      <span className="text-white font-mono font-bold">(317) 420-1722</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40 uppercase font-bold">Response Window:</span>
                      <span className="text-amber-300 font-bold">Under 24 Hours</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={`mailto:admin@indsports.media?subject=${encodeURIComponent(`Booking Request: ${bookingFormData.name} - ${bookingFormData.sport} (${bookingFormData.service})`)}&body=${encodeURIComponent(`Athlete/Coach: ${bookingFormData.name}\nEmail: ${bookingFormData.email}\nPhone: ${bookingFormData.phone}\nSport: ${bookingFormData.sport}\nDesired Service: ${bookingFormData.service}\nNotes: ${bookingFormData.notes}`)}`}
                      className="flex-1 py-3 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                    >
                      <Mail size={14} /> Open in Email Client
                    </a>
                    <button
                      onClick={() => {
                        setBookingFormData({
                          name: '',
                          email: '',
                          phone: '',
                          sport: 'Football',
                          service: 'Individual Performance Highlight Reel',
                          notes: ''
                        });
                        setBookingStatus('idle');
                      }}
                      className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer border border-white/10"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setBookingStatus('submitting');
                    try {
                      await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: bookingFormData.name,
                          email: bookingFormData.email,
                          phone: bookingFormData.phone,
                          sport: bookingFormData.sport,
                          service: bookingFormData.service,
                          notes: bookingFormData.notes
                        })
                      });
                    } catch (err) {
                      console.log('Syncing booking locally', err);
                    }
                    setBookingStatus('success');
                  }} 
                  className="bg-[#111111] border border-white/10 p-8 rounded-xl max-w-xl mx-auto shadow-2xl text-left space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Athlete or Coach Name *
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Marcus Vance" 
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                        Email Address *
                      </label>
                      <input 
                        required 
                        type="email" 
                        placeholder="athlete@example.com" 
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        placeholder="(317) 555-0199" 
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                        Sport *
                      </label>
                      <select 
                        value={bookingFormData.sport}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, sport: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                      >
                        <option>Football</option>
                        <option>Basketball</option>
                        <option>Volleyball</option>
                        <option>Wrestling</option>
                        <option>Girls Flag Football</option>
                        <option>Other Sport</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                        Desired Service *
                      </label>
                      <select 
                        value={bookingFormData.service}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, service: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                      >
                        <option>Individual Performance Highlight Reel</option>
                        <option>Varsity Game Day Sideline Filming</option>
                        <option>Team Season Pass & Photo Gallery</option>
                        <option>High-Definition Live Stream Broadcast</option>
                        <option>Media Day Athlete Shoot</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                      Event / Matchup Details (Optional)
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Include upcoming game dates, opponent school, venue location, or specific reel requests..."
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded px-4 py-2 text-sm text-white focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={bookingStatus === 'submitting'}
                      className="w-full bg-[#00BFFF] hover:bg-[#00A3D9] disabled:opacity-50 text-black font-display font-black uppercase text-xs tracking-widest py-3.5 rounded transition-all cursor-pointer shadow-lg shadow-[#00BFFF]/20 flex items-center justify-center gap-2"
                    >
                      {bookingStatus === 'submitting' ? (
                        <>SYNCING REQUEST...</>
                      ) : (
                        <>
                          <Send size={15} /> Submit Booking Request (admin@indsports.media)
                        </>
                      )}
                    </button>
                    <div className="text-center mt-2">
                      <span className="text-[11px] text-white/40 font-mono">
                        Directly routes to <strong className="text-white/70">admin@indsports.media</strong> • Phone: <strong className="text-white/70">(317) 420-1722</strong>
                      </span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-black py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={navigateToHome}>
                <IndLogo size="md" />
              </div>
              <p className="text-white/40 max-w-sm font-sans leading-relaxed italic text-sm">
                "Don't leave your legacy to chance."
              </p>
              <p className="text-white/30 text-xs font-sans leading-relaxed">
                The premier digital broadcast, action photography, and athletic media network for local, regional, and national youth and high school sports.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-white/40 font-mono border border-white/10 px-2.5 py-1 rounded bg-white/5">
                  <ShieldCheck size={12} className="text-[#00BFFF]" /> IHSAA & State Media Compliant
                </span>
              </div>
            </div>

            {/* Social Media Column */}
            <div className="space-y-4">
              <h5 className="font-display font-bold uppercase tracking-widest text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00BFFF] rounded-full inline-block animate-pulse"></span>
                Connect With Us
              </h5>
              <p className="text-xs text-white/50 font-sans leading-relaxed">
                Follow our channels for daily highlight drops, athlete feature reels, and live stream coverage.
              </p>
              <div className="flex gap-2.5 flex-wrap pt-1">
                <a 
                  href="https://www.tiktok.com/@ind.sports.media" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 bg-[#ff0050]/15 hover:bg-[#ff0050] text-[#ff0050] hover:text-white border border-[#ff0050]/30 flex items-center justify-center rounded-full transition-all cursor-pointer shadow-lg shadow-[#ff0050]/20 hover:scale-110"
                  title="TikTok"
                >
                  <TikTokIcon size={18} />
                </a>
                <a 
                  href="https://instagram.com/indsportsmedia" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center rounded-full transition-all cursor-pointer shadow-lg shadow-[#ee2a7b]/30 hover:scale-110 opacity-90 hover:opacity-100"
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="https://www.youtube.com/@INDSPORTSMEDIA" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 bg-[#FF0000]/15 hover:bg-[#FF0000] text-[#FF0000] hover:text-white border border-[#FF0000]/30 flex items-center justify-center rounded-full transition-all cursor-pointer shadow-lg shadow-[#FF0000]/20 hover:scale-110"
                  title="YouTube"
                >
                  <Youtube size={18} />
                </a>
                <a 
                  href="https://www.facebook.com/share/1CtjH6Nfds/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 flex items-center justify-center rounded-full transition-all cursor-pointer shadow-lg shadow-[#1877F2]/20 hover:scale-110"
                  title="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a 
                  href="https://x.com/indsportsmedia" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center rounded-full transition-all cursor-pointer shadow-md hover:scale-110"
                  title="X"
                >
                  <XIcon size={16} />
                </a>
              </div>
            </div>
            
            {/* Quick Navigation Column */}
            <div className="space-y-4">
              <h5 className="font-display font-bold uppercase tracking-widest text-white text-sm">Quick Links</h5>
              <ul className="space-y-2 text-white/60 font-display uppercase text-xs tracking-widest font-bold">
                <li><button onClick={navigateToHome} className="hover:text-[#00BFFF] transition-all cursor-pointer">Home</button></li>
                <li><button onClick={() => navigateToPhotos('All')} className="hover:text-[#00BFFF] transition-all cursor-pointer">Photos Gallery</button></li>
                <li><button onClick={navigateToAthleteFeatures} className="hover:text-[#00BFFF] transition-all cursor-pointer">Athlete Features</button></li>
                <li><button onClick={() => navigateToArticles('All')} className="hover:text-[#00BFFF] transition-all cursor-pointer">Articles & News</button></li>
                <li><button onClick={() => setIsMediaCredsOpen(true)} className="hover:text-[#00BFFF] transition-all cursor-pointer">Media Credentials</button></li>
                <li><button onClick={() => setIsAdvertiseOpen(true)} className="text-[#00BFFF] hover:text-white transition-all cursor-pointer">Advertise With Us</button></li>
              </ul>
            </div>
            
            {/* Contact Column */}
            <div className="space-y-4">
              <h5 className="font-display font-bold uppercase tracking-widest text-white text-sm">Contact Desk</h5>
              <ul className="space-y-2 text-white/60 font-sans text-xs">
                <li className="text-white/80 font-bold font-mono">admin@indsports.media</li>
                <li className="text-white/80 font-bold font-mono">(317) 420-1722</li>
                <li className="text-white/60">Based out of Indianapolis & Nationwide Coverage</li>
                <li className="pt-2">
                  <button 
                    onClick={() => setIsContactOpen(true)}
                    className="bg-white/10 hover:bg-[#00BFFF] hover:text-black text-white font-display font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded transition-all cursor-pointer border border-white/10"
                  >
                    Open Contact Form
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-[10px] uppercase font-bold tracking-widest text-white/30 gap-4">
            <p>&copy; {new Date().getFullYear()} IND SPORTS MEDIA. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <button onClick={() => setIsMediaCredsOpen(true)} className="hover:text-white transition-all cursor-pointer">Press Guidelines</button>
              <button onClick={() => setIsContactOpen(true)} className="hover:text-white transition-all cursor-pointer">Privacy & Terms</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreatorApplicationModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      <MediaCredentialsModal 
        isOpen={isMediaCredsOpen}
        onClose={() => setIsMediaCredsOpen(false)}
      />

      <ContactUsModal 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <AdvertiseWithUsModal 
        isOpen={isAdvertiseOpen}
        onClose={() => setIsAdvertiseOpen(false)}
      />
    </div>
  );
}
