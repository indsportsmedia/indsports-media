import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from './logo.svg';
import { IndLogo } from './components/IndLogo';
import LiveBroadcastHub from './components/LiveBroadcastHub';
import RecruitmentReels from './components/RecruitmentReels';
import ServiceDetailPage from './components/ServiceDetailPage';
import CreatorApplicationModal from './components/CreatorApplicationModal';
import { 
  Play, 
  Camera, 
  Video, 
  Trophy, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  Instagram, 
  Youtube,
  Facebook,
  Star
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
    title: 'Recruitment Reels',
    description: 'The reel that gets you recruited. Cinematic editing designed to catch the eyes of college scouts.',
    icon: <Play className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'girls-flag-football',
    title: 'Girls Flag Football',
    description: 'Immersive media coverage for the nations fastest-growing sport, spotlighting flagship athletes.',
    icon: <Trophy className="w-8 h-8" />,
    image: 'https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&q=80&w=800'
  }
];

const TESTIMONIALS = [
  {
    name: "Marcus Thompson",
    role: "Quarterback, Central High",
    content: "The recruitment reel IND created for me was the turning point. Two weeks after sending it out, I had three Division I offers.",
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
    name: 'Softball',
    image: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80&w=800',
    sportKey: 'Softball',
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
  },
  {
    name: 'Soccer',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6edd1dec1d?auto=format&fit=crop&q=80&w=800',
    sportKey: 'Soccer',
    count: '2 ATHLETES'
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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'reels' | 'game-coverage' | 'girls-flag-football'>('home');
  const [selectedReelSport, setSelectedReelSport] = useState<string>('All');
  const [currentHeroVideoIdx, setCurrentHeroVideoIdx] = useState(0);

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

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'home') {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 bg-black/95 backdrop-blur-md shadow-lg border-b border-white/10 ${
          scrolled ? 'py-3' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => scrollTo('home')}
            id="nav-logo"
          >
            <IndLogo size="md" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 font-display uppercase text-sm tracking-widest font-bold text-white">
            <button 
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black px-5 py-2 rounded-sm transition-all uppercase tracking-widest font-black cursor-pointer shadow-lg shadow-[#00BFFF]/20 flex items-center gap-2 border border-[#00BFFF]"
            >
              <Camera size={16} /> Apply Now
            </button>
            <button 
              onClick={() => { setCurrentView('reels'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`hover:opacity-70 transition-colors cursor-pointer ${currentView === 'reels' ? 'text-[#00BFFF] font-extrabold' : ''}`}
            >
              Recruit Reels
            </button>
            <button onClick={() => scrollTo('live-broadcast-hub')} className="hover:opacity-70 transition-colors cursor-pointer relative flex items-center gap-1.5">
              Live Feed
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BFFF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BFFF]"></span>
              </span>
            </button>
            <button onClick={() => scrollTo('testimonials')} className="hover:opacity-70 transition-colors cursor-pointer">Social Proof</button>
            <button 
              onClick={() => scrollTo('booking')}
              className="bg-white text-black px-6 py-2 rounded-sm hover:bg-zinc-200 transition-all uppercase tracking-widest font-black cursor-pointer shadow-xl shadow-white/5"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-black border-t border-white/10 p-6 md:hidden flex flex-col gap-6 font-display uppercase text-lg text-white"
            >
              <button 
                onClick={() => { setIsMenuOpen(false); setIsApplyModalOpen(true); }}
                className="bg-[#00BFFF] text-black py-3 px-4 rounded-sm font-black flex items-center justify-between uppercase tracking-widest text-sm"
              >
                <span className="flex items-center gap-2"><Camera size={18} /> Apply Now (Photographers & Videographers)</span>
                <span>→</span>
              </button>
              <button 
                onClick={() => { setCurrentView('reels'); setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="text-left py-2 flex items-center justify-between text-[#00BFFF] font-extrabold"
              >
                Recruit Reels <span className="bg-[#00BFFF]/10 text-[#00BFFF] text-[10px] px-2.5 py-0.5 rounded border border-[#00BFFF]/30">Portal →</span>
              </button>
              <button onClick={() => scrollTo('live-broadcast-hub')} className="text-left py-2 flex items-center gap-2">
                Live Feed
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BFFF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00BFFF]"></span>
                </span>
              </button>
              <button onClick={() => scrollTo('testimonials')} className="text-left py-2">Social Proof</button>
              <button 
                onClick={() => scrollTo('booking')}
                className="bg-white text-black py-4 rounded-sm text-center font-black"
              >
                Book Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {currentView === 'reels' ? (
        <RecruitmentReels 
          initialSport={selectedReelSport}
          onBack={() => { 
            setCurrentView('home'); 
            setSelectedReelSport('All');
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
          }} 
        />
      ) : currentView === 'game-coverage' || currentView === 'girls-flag-football' ? (
        <ServiceDetailPage 
          serviceId={currentView}
          onBack={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBookNow={() => {
            setCurrentView('home');
            setTimeout(() => {
              scrollTo('booking');
            }, 100);
          }}
        />
      ) : (
        <>
          {/* Hero Section */}
          <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.12)_0%,transparent_70%)]" />

          {/* Gradient Overlays */}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Centered IND Logo */}
            <div className="mb-6">
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
                className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-sm sm:text-base px-8 py-3.5 rounded-full transition-all cursor-pointer uppercase tracking-wider shadow-lg shadow-[#00BFFF]/30 hover:scale-105 active:scale-95"
              >
                SIGN UP
              </button>
            </div>

            {/* Carousel Pagination Dots */}
            <div className="flex items-center gap-2.5">
              {HERO_HIGHLIGHT_VIDEOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentHeroVideoIdx(i)}
                  className={`transition-all cursor-pointer rounded-full ${
                    i === currentHeroVideoIdx 
                      ? 'w-3 h-3 bg-[#00BFFF] shadow-[0_0_10px_#00BFFF]' 
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] tracking-widest font-bold uppercase text-white">Scroll</span>
          <div className="w-[1px] h-10 bg-white" />
        </motion.div>
      </section>

      {/* The Problem / Solution Section */}
      <section className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-left text-black">
              <h2 className="text-5xl md:text-7xl font-black leading-none">
                STOP <span className="italic opacity-30">MISSING</span> <br /> THE MOMENT
              </h2>
              <div className="space-y-6 text-lg text-black/70 leading-relaxed font-sans">
                <p>
                  You're in the stand, trying to hold your phone steady while your kid makes the winning play. 
                  By the time you hit record, the moment is gone. Or worse, it's blurry, out of frame, and unusable for recruitment.
                </p>
                <p className="font-bold border-l-4 border-black pl-6">
                  Your work on the field deserves to be seen. Your legacy deserves to be preserved.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[
                { title: "No Blurry Videos", text: "4K High-speed capture that makes every second count." },
                { title: "Recruitment Focused", text: "Strategically edited to highlight scouts' key metrics." },
                { title: "Social Proof", text: "Ready-to-post content that builds your athletic brand." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 10 }}
                  className="bg-black/5 p-6 border-l-4 border-black flex items-start gap-4 text-left"
                >
                  <CheckCircle2 className="text-black flex-shrink-0" />
                  <div>
                    <h4 className="font-display font-black text-xl text-black">{item.title}</h4>
                    <p className="text-black/60">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-8xl font-black mb-4 text-white">OUR <span className="text-stroke">PLAYBOOK</span></h2>
            <div className="w-24 h-2 bg-white mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                onClick={() => {
                  if (service.id === 'highlight-reels') {
                    setCurrentView('reels');
                  } else if (service.id === 'game-coverage') {
                    setCurrentView('game-coverage');
                  } else if (service.id === 'girls-flag-football') {
                    setCurrentView('girls-flag-football');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative overflow-hidden bg-white/5 rounded-sm border border-white/5 hover:border-white transition-all text-left cursor-pointer"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                  <div className="absolute top-6 left-6 bg-white text-black p-3 rounded-full shadow-lg">
                    {service.icon}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-black mb-4 text-white uppercase">{service.title}</h3>
                  <p className="text-white/60 mb-8 font-sans leading-relaxed">
                    {service.description}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (service.id === 'highlight-reels') {
                        setCurrentView('reels');
                      } else if (service.id === 'game-coverage') {
                        setCurrentView('game-coverage');
                      } else if (service.id === 'girls-flag-football') {
                        setCurrentView('girls-flag-football');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-white border-b-2 border-white pb-1 font-display font-black tracking-widest flex items-center gap-2 hover:opacity-50 transition-all cursor-pointer"
                  >
                    {service.id === 'highlight-reels' ? 'OPEN PORTAL' : 'LEARN MORE'} <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" className="py-24 bg-brand-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
            <div>
              <h2 className="text-5xl md:text-8xl font-black leading-none text-white">THE <span className="italic opacity-40">REEL</span> GALLERY</h2>
              <p className="mt-4 text-white/50 tracking-widest uppercase font-display">Watch the athletes taking their game to the next level.</p>
            </div>
            <button 
              onClick={() => { 
                setSelectedReelSport('All');
                setCurrentView('reels'); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="bg-[#00BFFF] hover:bg-[#00A3D9] text-black border-none px-8 py-4 font-display font-black hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer rounded-sm shadow-lg shadow-[#00BFFF]/20"
            >
              VIEW ALL MEDIA
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_CATEGORIES.map((category, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                onClick={() => {
                  setSelectedReelSport(category.sportKey);
                  setCurrentView('reels');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative aspect-[4/3] group cursor-pointer overflow-hidden rounded-sm border border-white/5 bg-neutral-900"
              >
                <img 
                  src={category.image} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  alt={`${category.name} Gallery`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/20 transition-all flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between items-end">
                    <div>
                      <span className="text-[10px] font-mono text-[#00BFFF] font-bold block mb-1 uppercase tracking-widest">
                        {category.count}
                      </span>
                      <h3 className="text-xl font-display font-black text-white uppercase leading-none group-hover:text-[#00BFFF] transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-[#00BFFF] text-black rounded-full flex items-center justify-center shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                    >
                      <Play className="fill-black text-black ml-0.5" size={12} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Broadcast Hub Section */}
      <LiveBroadcastHub />

      {/* Social Proof Section */}
      <section id="testimonials" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white">TRUSTED BY THE <span className="opacity-30 italic">ELITE</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/5 p-8 border border-white/10 relative text-left">
                <Star className="text-white w-10 h-10 absolute -top-5 -right-5 fill-white opacity-10" />
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-white fill-white" />
                  ))}
                </div>
                <p className="italic text-lg mb-8 text-white/80 font-sans leading-relaxed">"{t.content}"</p>
                <div>
                  <h5 className="font-display font-black text-xl text-white">{t.name}</h5>
                  <p className="text-white/40 text-sm uppercase tracking-widest font-bold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Booking Section */}
      <section id="booking" className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-black text-white p-6 md:p-16 rounded-sm shadow-2xl grid lg:grid-cols-2 gap-16 text-left border border-white/10">
            <div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase text-white">LET'S <span className="italic opacity-30">CLUTCH</span> IT</h2>
              <p className="text-xl text-white/70 mb-12 font-sans">Ready to book your game or media day? Fill out the form below and our team will get in touch within 24 hours.</p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Users className="text-white" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-white uppercase">Dedicated Producer</h5>
                    <p className="text-sm text-white/50">One person to handle your entire season.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Video className="text-white" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-white uppercase">Fast Turnaround</h5>
                    <p className="text-sm text-white/50">Highlights delivered in 48 hours or less.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-white">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/20 p-4 rounded-sm focus:border-white outline-none transition-all text-white" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-white">Email Address</label>
                  <input type="email" className="w-full bg-white/5 border border-white/20 p-4 rounded-sm focus:border-white outline-none transition-all text-white" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-white">Service Interest</label>
                <select className="w-full bg-white/5 border border-white/20 p-4 rounded-sm focus:border-white outline-none transition-all text-white appearance-none cursor-pointer">
                  <option className="bg-black">Recruitment Highlight Reel</option>
                  <option className="bg-black">Game Coverage (Full Season)</option>
                  <option className="bg-black">Team Media Day</option>
                  <option className="bg-black">Tournament Coverage</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-white">Game Date / Team Details</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/20 p-4 rounded-sm focus:border-white outline-none transition-all text-white" placeholder="Tell us about the event or athlete..."></textarea>
              </div>
              <button className="w-full bg-white text-black py-5 font-display font-black text-xl hover:bg-zinc-200 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-white/10 uppercase tracking-widest">
                SEND BOOKING REQUEST
              </button>
            </form>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-black py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IndLogo size="md" />
              </div>
              <p className="text-white/40 max-w-sm font-sans leading-relaxed italic text-sm">
                "Don't lead your legacy to chance."
              </p>
            </div>

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
            
            <div className="space-y-6">
              <h5 className="font-display font-bold uppercase tracking-widest text-white text-sm">Navigation</h5>
              <ul className="space-y-3 text-white/50 font-display uppercase text-sm tracking-widest font-black">
                <li><button onClick={() => scrollTo('home')} className="hover:text-white transition-all cursor-pointer">Home</button></li>
                <li><button onClick={() => scrollTo('services')} className="hover:text-white transition-all cursor-pointer">Services</button></li>
                <li><button onClick={() => { setCurrentView('reels'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[#00BFFF] hover:text-white transition-all cursor-pointer">RECRUIT PORTAL</button></li>
                <li><button onClick={() => scrollTo('booking')} className="hover:text-white transition-all cursor-pointer">Booking</button></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h5 className="font-display font-bold uppercase tracking-widest text-white text-sm">Contact</h5>
              <ul className="space-y-3 text-white/50 font-sans text-sm">
                <li>hq@indsportsmedia.com</li>
                <li className="text-white/80 font-bold font-mono">317-420-1722</li>
                <li className="text-white/80 font-medium">Based in Indianapolis, IN</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] uppercase font-bold tracking-widest text-white/30 gap-4">
            <p>&copy; 2024 IND SPORTS MEDIA. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <button className="hover:text-white transition-all cursor-pointer">Privacy Policy</button>
              <button className="hover:text-white transition-all cursor-pointer">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      <CreatorApplicationModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
