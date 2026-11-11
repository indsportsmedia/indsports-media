import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IndLogo } from './components/IndLogo';
import LiveScoreboard from './components/LiveScoreboard';
import RecruitmentReels from './components/RecruitmentReels';
import ServiceDetailPage from './components/ServiceDetailPage';
import PhotosGallery from './components/PhotosGallery';
import AthleteFeatures from './components/AthleteFeatures';
import ArticlesSection from './components/ArticlesSection';
import SportCoveragePage from './components/SportCoveragePage';
import LiveScoreTicker from './components/LiveScoreTicker';
import MediaCredentialsModal from './components/MediaCredentialsModal';
import ContactUsModal from './components/ContactUsModal';
import AdvertiseWithUsModal from './components/AdvertiseWithUsModal';
import HomePage from './components/HomePage';
import PartnersPage from './components/PartnersPage';
import InstallApp from './components/InstallApp';
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

type ViewType = 
  | 'home' 
  | 'live-scoreboard'
  | 'reels' 
  | 'game-coverage' 
  | 'girls-flag-football' 
  | 'photos' 
  | 'athlete-features' 
  | 'articles'
  | 'sport-coverage'
  | 'partners';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedSportName, setSelectedSportName] = useState<'Football' | 'Basketball' | 'Volleyball' | 'Wrestling' | 'Flag Football'>('Football');
  const [selectedPhotoSport, setSelectedPhotoSport] = useState<string>('All');
  const [selectedArticleSport, setSelectedArticleSport] = useState<string>('All');

  // Dropdown States
  const [isSportsDropdownOpen, setIsSportsDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

  // Booking Form State

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isMediaCredsOpen, setIsMediaCredsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdvertiseOpen, setIsAdvertiseOpen] = useState(false);

  const sportsDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);

  // Deep link to a game: indsports.media/?scores={gameId}
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get('scores');
    if (g) navigateToLiveScoreboard(g === 'all' ? undefined : g);
    else if (params.get('view') === 'articles') navigateToArticles('All');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = currentView === 'partners' ? 'Partner with IND Sports Media' : 'IND Sports Media';
  }, [currentView]);


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

  const navigateToPartners = () => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setIsAboutDropdownOpen(false);
    if (currentView === 'partners') {
      // Already here: jump to the inquiry form so the tap visibly does something.
      document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setCurrentView('partners');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const navigateToAthleteFeatures = () => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setIsAboutDropdownOpen(false);
    setCurrentView('athlete-features');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedScoreboardGameId, setSelectedScoreboardGameId] = useState<string | undefined>(undefined);

  const navigateToLiveScoreboard = (gameId?: string) => {
    setIsMenuOpen(false);
    setIsSportsDropdownOpen(false);
    setIsAboutDropdownOpen(false);
    setSelectedScoreboardGameId(gameId);
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
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-black border-b border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
          <button onClick={navigateToHome} className="shrink-0 cursor-pointer" id="nav-logo" aria-label="IND Sports Media home">
            <IndLogo size="sm" />
          </button>

          <nav className="hidden lg:flex items-center h-full gap-1 font-display font-semibold text-[17px]" aria-label="Main">
            {([
              ['Scores', () => navigateToLiveScoreboard(), currentView === 'live-scoreboard'],
              ['Articles', () => navigateToArticles('All'), currentView === 'articles'],
              ['Photos', () => navigateToPhotos('All'), currentView === 'photos'],
              ['Athletes', navigateToAthleteFeatures, currentView === 'athlete-features'],
            ] as [string, () => void, boolean][]).map(([label, onClick, active]) => (
              <button
                key={label}
                onClick={onClick}
                className={`h-full px-3 border-b-[3px] cursor-pointer transition-colors ${
                  active ? 'border-ind text-white' : 'border-transparent text-white/75 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}

            <div className="relative h-full" ref={sportsDropdownRef}>
              <button
                onClick={() => { setIsSportsDropdownOpen(!isSportsDropdownOpen); setIsAboutDropdownOpen(false); }}
                aria-expanded={isSportsDropdownOpen}
                className={`h-full px-3 border-b-[3px] cursor-pointer flex items-center gap-1 transition-colors ${
                  currentView === 'sport-coverage' ? 'border-ind text-white' : 'border-transparent text-white/75 hover:text-white'
                }`}
              >
                Sports <ChevronDown size={15} className={`transition-transform ${isSportsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSportsDropdownOpen && (
                <div className="absolute left-0 top-full w-56 bg-black border border-rule border-t-0 py-1 shadow-xl">
                  {(['Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football'] as const).map((s) => (
                    <button key={s} onClick={() => navigateToSport(s)} className="block w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-panel cursor-pointer">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={navigateToPartners}
              className={`h-full px-3 border-b-[3px] cursor-pointer transition-colors ${
                currentView === 'partners' ? 'border-ind text-white' : 'border-transparent text-white/75 hover:text-white'
              }`}
            >
              For schools
            </button>

            <div className="relative h-full" ref={aboutDropdownRef}>
              <button
                onClick={() => { setIsAboutDropdownOpen(!isAboutDropdownOpen); setIsSportsDropdownOpen(false); }}
                aria-expanded={isAboutDropdownOpen}
                className="h-full px-3 border-b-[3px] border-transparent text-white/75 hover:text-white cursor-pointer flex items-center gap-1"
              >
                More <ChevronDown size={15} className={`transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAboutDropdownOpen && (
                <div className="absolute left-0 top-full w-56 bg-black border border-rule border-t-0 py-1 shadow-xl font-sans font-medium text-[15px]">
                  <button onClick={() => { setIsAboutDropdownOpen(false); setIsAdvertiseOpen(true); }} className="block w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-panel cursor-pointer">Advertise with us</button>
                  <button onClick={() => { setIsAboutDropdownOpen(false); setIsMediaCredsOpen(true); }} className="block w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-panel cursor-pointer">Media credentials</button>
                  <button onClick={() => { setIsAboutDropdownOpen(false); setIsContactOpen(true); }} className="block w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-panel cursor-pointer">Contact</button>
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={navigateToPartners}
              className="hidden sm:inline-flex bg-ind hover:bg-white text-black font-display font-bold text-[17px] px-4 py-1.5 rounded-sm transition-colors cursor-pointer"
            >
              Partner with us
            </button>
            <button
              className="lg:hidden p-2 text-white cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Score ticker stays pinned under the nav on every page */}
        <div className="border-t border-rule">
          <LiveScoreTicker
            onNavigateToScoreboard={(gameId) => navigateToLiveScoreboard(gameId)}
            activeGameId={currentView === 'live-scoreboard' ? selectedScoreboardGameId : undefined}
          />
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-rule bg-black max-h-[calc(100vh-8rem)] overflow-y-auto">
            <nav className="px-4 py-2 font-display font-semibold text-xl" aria-label="Mobile">
              {([
                ['Home', navigateToHome],
                ['Scores', () => navigateToLiveScoreboard()],
                ['Articles', () => navigateToArticles('All')],
                ['Photos', () => navigateToPhotos('All')],
                ['Athletes', navigateToAthleteFeatures],
                ['For schools', navigateToPartners],
              ] as [string, () => void][]).map(([label, onClick]) => (
                <button key={label} onClick={onClick} className="block w-full text-left py-3 border-b border-rule text-white cursor-pointer">{label}</button>
              ))}
              <p className="pt-4 pb-1 text-mute text-sm font-sans font-medium">Sports</p>
              <div className="grid grid-cols-2 gap-x-4">
                {(['Football', 'Basketball', 'Volleyball', 'Wrestling', 'Flag Football'] as const).map((s) => (
                  <button key={s} onClick={() => navigateToSport(s)} className="text-left py-2 text-white/85 cursor-pointer">{s}</button>
                ))}
              </div>
              <div className="flex flex-col gap-1 pt-4 pb-5 font-sans font-medium text-base text-white/70">
                <button onClick={() => { setIsMenuOpen(false); setIsAdvertiseOpen(true); }} className="text-left py-1.5 cursor-pointer">Advertise with us</button>
                <button onClick={() => { setIsMenuOpen(false); setIsMediaCredsOpen(true); }} className="text-left py-1.5 cursor-pointer">Media credentials</button>
                <button onClick={() => { setIsMenuOpen(false); setIsContactOpen(true); }} className="text-left py-1.5 cursor-pointer">Contact</button>
              </div>
              <button onClick={navigateToPartners} className="w-full mb-5 bg-ind text-black font-display font-bold text-xl py-3 rounded-sm cursor-pointer">Partner with us</button>
            </nav>
          </div>
        )}
      </header>
      {/* Space for the pinned ticker (pages already pad for the nav bar) */}
      <div className="h-[61px]" aria-hidden />
      {/* Main Content Router */}
      {currentView === 'live-scoreboard' ? (
        <LiveScoreboard 
          onBack={navigateToHome}
          initialGameId={selectedScoreboardGameId}
          onGameChange={setSelectedScoreboardGameId}
        />
      ) : currentView === 'photos' ? (
        <PhotosGallery 
          initialSport={selectedPhotoSport}
          onBackToHome={navigateToHome}
        />
      ) : currentView === 'athlete-features' ? (
        <AthleteFeatures 
          onBookReel={() => {
            navigateToPartners();
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
            navigateToPartners();
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
            navigateToPartners();
          }}
        />
      ) : currentView === 'partners' ? (
        <div className="pt-16">
          <PartnersPage onOpenScores={() => navigateToLiveScoreboard()} />
        </div>
      ) : (
        <div className="pt-16">
          <HomePage
            onOpenScores={(gameId) => navigateToLiveScoreboard(gameId)}
            onOpenArticles={(sport) => navigateToArticles(sport || 'All')}
            onOpenSport={navigateToSport}
            onOpenPhotos={() => navigateToPhotos('All')}
            onOpenAthletes={navigateToAthleteFeatures}
            onOpenPartners={navigateToPartners}
            onOpenAdvertise={() => setIsAdvertiseOpen(true)}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-12 gap-8 text-[15px]">
          <div className="col-span-2 md:col-span-4">
            <button onClick={navigateToHome} className="cursor-pointer" aria-label="IND Sports Media home"><IndLogo size="sm" /></button>
            <p className="mt-4 text-mute leading-relaxed max-w-[36ch]">
              Indiana high school and college sports coverage, based in Indianapolis.
            </p>
            <div className="mt-5 flex items-center gap-4 text-white/70">
              <a href="https://instagram.com/indsportsmedia" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-ind"><Instagram size={20} /></a>
              <a href="https://www.tiktok.com/@ind.sports.media" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-ind"><TikTokIcon size={20} /></a>
              <a href="https://x.com/indsportsmedia" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-ind"><XIcon size={18} /></a>
              <a href="https://www.youtube.com/@INDSPORTSMEDIA" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-ind"><Youtube size={22} /></a>
              <a href="https://www.facebook.com/share/1CtjH6Nfds/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-ind"><Facebook size={20} /></a>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="font-display font-bold text-white text-lg mb-3">Coverage</p>
            <ul className="space-y-2 text-white/70">
              <li><button onClick={() => navigateToLiveScoreboard()} className="hover:text-white cursor-pointer">Scores</button></li>
              <li><button onClick={() => navigateToArticles('All')} className="hover:text-white cursor-pointer">Articles</button></li>
              <li><button onClick={() => navigateToPhotos('All')} className="hover:text-white cursor-pointer">Photos</button></li>
              <li><button onClick={navigateToAthleteFeatures} className="hover:text-white cursor-pointer">Athletes</button></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-display font-bold text-white text-lg mb-3">Work with us</p>
            <ul className="space-y-2 text-white/70">
              <li><button onClick={navigateToPartners} className="hover:text-white cursor-pointer">For schools</button></li>
              <li><button onClick={() => setIsAdvertiseOpen(true)} className="hover:text-white cursor-pointer">Advertise</button></li>
              <li><button onClick={() => setIsMediaCredsOpen(true)} className="hover:text-white cursor-pointer">Media credentials</button></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-4">
            <p className="font-display font-bold text-white text-lg mb-3">Contact</p>
            <ul className="space-y-2 text-white/70">
              <li><a href="mailto:admin@indsports.media" className="hover:text-white">admin@indsports.media</a></li>
              <li><a href="tel:+13174201722" className="hover:text-white tabular">(317) 420-1722</a></li>
              <li><button onClick={() => setIsContactOpen(true)} className="hover:text-white cursor-pointer">Send a message</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-rule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap justify-between gap-3 text-[13px] text-mute">
            <span>© {new Date().getFullYear()} IND Sports Media</span>
            <InstallApp className="text-ind hover:text-white" />
            <a href="/newsroom" className="hover:text-white">Staff sign-in</a>
          </div>
        </div>
      </footer>
      {/* Modals */}

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
