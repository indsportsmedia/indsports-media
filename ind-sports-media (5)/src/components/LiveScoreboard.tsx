import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Share2, 
  RotateCcw, 
  Sliders, 
  Radio, 
  Zap, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  ArrowLeft,
  Lock,
  EyeOff,
  Check,
  RefreshCw,
  Globe
} from 'lucide-react';
import brownsburgLogo from '../assets/brownsburg_bulldog.jpg';
import lawrenceNorthLogo from '../assets/lawrence_north_wildcats.png';
import southsideLogo from '../assets/southside_archers.jpg';
import marionLogo from '../assets/marion_giants.jpg';

export interface PlayEvent {
  id: string;
  time: string;
  quarter: string;
  team: 'home' | 'away' | 'neutral';
  teamName: string;
  text: string;
  isScoring?: boolean;
  scoreChange?: string;
  downInfo?: string;
}

export interface GameState {
  id: string;
  sport: string;
  title: string;
  venue: string;
  dateString: string;
  isLive: boolean;
  statusText: string;
  quarter: string;
  clock: string;
  homeTeam: {
    name: string;
    shortName: string;
    mascot: string;
    record: string;
    color: string;
    textColor: string;
    logoUrl?: string;
    score: number;
    qScores: [number, number, number, number, number];
    stats: {
      passingYds: number;
      rushingYds: number;
      firstDowns: number;
      turnovers: number;
      penalties: string;
    };
  };
  awayTeam: {
    name: string;
    shortName: string;
    mascot: string;
    record: string;
    color: string;
    textColor: string;
    logoUrl?: string;
    score: number;
    qScores: [number, number, number, number, number];
    stats: {
      passingYds: number;
      rushingYds: number;
      firstDowns: number;
      turnovers: number;
      penalties: string;
    };
  };
  possession: 'home' | 'away';
  down: string;
  distance: string;
  ballOn: string;
  redZone: boolean;
  lastPlay: string;
  plays: PlayEvent[];
}

export const DEFAULT_GAMES_LIST: GameState[] = [
  {
    id: 'lawrence-north-vs-brownsburg-2026',
    sport: 'Varsity Football',
    title: 'Metropolitan Interscholastic Conference Showcase',
    venue: 'Wildcat Stadium • Indianapolis, IN',
    dateString: 'Upcoming Matchup',
    isLive: false,
    statusText: 'SCHEDULED',
    quarter: 'Pre-Game',
    clock: '00:00',
    homeTeam: {
      name: 'Lawrence North Wildcats',
      shortName: 'Lawrence North',
      mascot: 'Wildcats',
      record: '0-0',
      color: '#BF1515', // Red
      textColor: '#FFFFFF',
      logoUrl: lawrenceNorthLogo,
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: {
        passingYds: 0,
        rushingYds: 0,
        firstDowns: 0,
        turnovers: 0,
        penalties: '0-0'
      }
    },
    awayTeam: {
      name: 'Brownsburg Bulldogs',
      shortName: 'Brownsburg',
      mascot: 'Bulldogs',
      record: '0-0',
      color: '#4A154B', // Purple
      textColor: '#FFFFFF',
      logoUrl: brownsburgLogo,
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: {
        passingYds: 0,
        rushingYds: 0,
        firstDowns: 0,
        turnovers: 0,
        penalties: '0-0'
      }
    },
    possession: 'home',
    down: '1st',
    distance: '10',
    ballOn: '--',
    redZone: false,
    lastPlay: 'No plays recorded yet. Gamecast updates will appear live as action starts.',
    plays: []
  },
  {
    id: 'southside-fw-vs-marion-giants-2026',
    sport: 'Varsity Football',
    title: 'Northeast Indiana Friday Night Feature',
    venue: 'South Side Stadium • Fort Wayne, IN',
    dateString: 'Upcoming Matchup',
    isLive: false,
    statusText: 'SCHEDULED',
    quarter: 'Pre-Game',
    clock: '00:00',
    homeTeam: {
      name: 'Fort Wayne South Side Archers',
      shortName: 'South Side (FW)',
      mascot: 'Archers',
      record: '0-0',
      color: '#0F5132', // Forest Green
      textColor: '#FFFFFF',
      logoUrl: southsideLogo,
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: {
        passingYds: 0,
        rushingYds: 0,
        firstDowns: 0,
        turnovers: 0,
        penalties: '0-0'
      }
    },
    awayTeam: {
      name: 'Marion Giants',
      shortName: 'Marion',
      mascot: 'Giants',
      record: '0-0',
      color: '#4A154B', // Purple
      textColor: '#FFFFFF',
      logoUrl: marionLogo,
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: {
        passingYds: 0,
        rushingYds: 0,
        firstDowns: 0,
        turnovers: 0,
        penalties: '0-0'
      }
    },
    possession: 'home',
    down: '1st',
    distance: '10',
    ballOn: '--',
    redZone: false,
    lastPlay: 'No plays recorded yet. Gamecast updates will appear live as action starts.',
    plays: []
  }
];

interface LiveScoreboardProps {
  onBack: () => void;
}

export default function LiveScoreboard({ onBack }: LiveScoreboardProps) {
  // Games list with real-time multi-device sync
  const [games, setGames] = useState<GameState[]>(() => {
    try {
      const saved = localStorage.getItem('ind_live_scoreboard_games_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_GAMES_LIST;
  });

  const [selectedGameId, setSelectedGameId] = useState<string>(DEFAULT_GAMES_LIST[0].id);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Currently active game
  const activeGame = games.find(g => g.id === selectedGameId) || games[0] || DEFAULT_GAMES_LIST[0];

  // Hidden staff access
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return window.location.hash.includes('sideline') || 
           window.location.hash.includes('operator') || 
           sessionStorage.getItem('ind_operator_auth') === 'true';
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'boxscore' | 'stats'>('boxscore');
  const [isClockRunning, setIsClockRunning] = useState(false);

  // Check URL hash for direct secret access (e.g. yoursite.com/#sideline)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.includes('sideline') || window.location.hash.includes('operator')) {
        setIsAuthorized(true);
        setIsAdminOpen(true);
        sessionStorage.setItem('ind_operator_auth', 'true');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Fetch games from server on mount & interval for multi-device live sync
  const fetchServerGames = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/games');
      if (res.ok) {
        const data = await res.json();
        if (data.games && Array.isArray(data.games) && data.games.length > 0) {
          setGames(prev => {
            // Map server games with fallback to local logo assets
            const updated = data.games.map((serverGame: GameState) => {
              const localMatch = DEFAULT_GAMES_LIST.find(d => d.id === serverGame.id);
              return {
                ...serverGame,
                homeTeam: {
                  ...serverGame.homeTeam,
                  logoUrl: serverGame.homeTeam.logoUrl || localMatch?.homeTeam.logoUrl
                },
                awayTeam: {
                  ...serverGame.awayTeam,
                  logoUrl: serverGame.awayTeam.logoUrl || localMatch?.awayTeam.logoUrl
                }
              };
            });
            localStorage.setItem('ind_live_scoreboard_games_v2', JSON.stringify(updated));
            return updated;
          });
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch {
      // Offline fallback to local state
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchServerGames();
    const interval = setInterval(fetchServerGames, 2500);
    return () => clearInterval(interval);
  }, []);

  // Broadcast single game update to backend server
  const broadcastGameUpdate = async (updatedGame: GameState) => {
    // 1. Optimistic local update
    setGames(prev => {
      const next = prev.map(g => g.id === updatedGame.id ? updatedGame : g);
      localStorage.setItem('ind_live_scoreboard_games_v2', JSON.stringify(next));
      return next;
    });

    // 2. Push to server API
    try {
      await fetch(`/api/games/${updatedGame.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: updatedGame })
      });
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('Could not push live update to server:', e);
    }
  };

  // Audio tone generator for scoring events
  const playScoreSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable
    }
  };

  // Clock runner simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isClockRunning && activeGame.isLive) {
      timer = setInterval(() => {
        const parts = activeGame.clock.split(':');
        let minutes = parseInt(parts[0], 10) || 0;
        let seconds = parseInt(parts[1], 10) || 0;
        if (minutes === 0 && seconds === 0) {
          setIsClockRunning(false);
          return;
        }
        if (seconds === 0) {
          minutes -= 1;
          seconds = 59;
        } else {
          seconds -= 1;
        }
        const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const updated = { ...activeGame, clock: formatted };
        broadcastGameUpdate(updated);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClockRunning, activeGame.isLive, activeGame.clock]);

  // Handle Score Adjustments
  const adjustScore = (team: 'home' | 'away', delta: number, description?: string) => {
    playScoreSound();
    const isHome = team === 'home';
    const targetTeam = isHome ? activeGame.homeTeam : activeGame.awayTeam;
    const newScore = Math.max(0, targetTeam.score + delta);
    
    // Determine which quarter score to bump
    const currentQIdx = activeGame.quarter.includes('1') ? 0 :
                        activeGame.quarter.includes('2') ? 1 :
                        activeGame.quarter.includes('3') ? 2 :
                        activeGame.quarter.includes('4') ? 3 : 4;

    const newQScores = [...targetTeam.qScores] as [number, number, number, number, number];
    newQScores[currentQIdx] = Math.max(0, newQScores[currentQIdx] + delta);

    const updatedTarget = {
      ...targetTeam,
      score: newScore,
      qScores: newQScores
    };

    const updatedHome = isHome ? updatedTarget : activeGame.homeTeam;
    const updatedAway = !isHome ? updatedTarget : activeGame.awayTeam;

    const playDesc = description || (delta === 6 ? `🏈 TOUCHDOWN ${targetTeam.shortName}!` : 
                                      delta === 1 ? `🎯 Extra point is GOOD for ${targetTeam.shortName}.` : 
                                      delta === 2 ? `⚡ 2-Point Conversion GOOD for ${targetTeam.shortName}!` : 
                                      delta === 3 ? `🎯 FIELD GOAL is GOOD for ${targetTeam.shortName}!` : 
                                      delta === 2 ? `💥 SAFETY awarded to ${targetTeam.shortName}!` : 
                                      `Score update for ${targetTeam.shortName} (+${delta})`);

    const newPlay: PlayEvent = {
      id: `p-${Date.now()}`,
      time: activeGame.clock,
      quarter: activeGame.quarter,
      team,
      teamName: targetTeam.shortName,
      text: playDesc,
      isScoring: delta > 0,
      scoreChange: `${updatedHome.shortName} ${updatedHome.score} - ${updatedAway.shortName} ${updatedAway.score}`,
      downInfo: `${activeGame.down} & ${activeGame.distance} at ${activeGame.ballOn}`
    };

    const updatedGame: GameState = {
      ...activeGame,
      isLive: true,
      homeTeam: updatedHome,
      awayTeam: updatedAway,
      lastPlay: playDesc,
      plays: [newPlay, ...activeGame.plays]
    };

    broadcastGameUpdate(updatedGame);
  };

  const updateGameField = (fields: Partial<GameState>) => {
    const updated = { ...activeGame, ...fields };
    broadcastGameUpdate(updated);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const resetCurrentGame = async () => {
    if (window.confirm(`Reset "${activeGame.homeTeam.name} vs ${activeGame.awayTeam.name}" scoreboard to 0-0 pre-game state?`)) {
      const defaultState = DEFAULT_GAMES_LIST.find(d => d.id === activeGame.id) || DEFAULT_GAMES_LIST[0];
      await broadcastGameUpdate(defaultState);
      try {
        await fetch(`/api/games/reset/${activeGame.id}`, { method: 'POST' });
      } catch {
        // Fallback
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-24 pb-24 font-sans selection:bg-[#00BFFF] selection:text-black">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-display font-black uppercase tracking-wider group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#00BFFF]" />
            Back to Home
          </button>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Live Indicator Badge & Cloud Sync Status */}
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE GAMECAST
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/60">
              <Globe size={12} className="text-emerald-400" />
              <span>LIVE CLOUD SYNC</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute score sounds" : "Enable score sounds"}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 size={16} className="text-[#00BFFF]" /> : <VolumeX size={16} />}
            </button>

            {/* Share Scoreboard */}
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-display font-black uppercase tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              {copiedLink ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
              {copiedLink ? 'COPIED!' : 'SHARE'}
            </button>

            {/* Hidden Sideline Operator Access: Only visible when authorized via URL hash #sideline or secret PIN 1802 */}
            {isAuthorized ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdminOpen(!isAdminOpen)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-display font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                    isAdminOpen 
                      ? 'bg-amber-400 text-black border border-amber-300' 
                      : 'bg-[#00BFFF] hover:bg-[#00A3D9] text-black border border-[#00BFFF]'
                  }`}
                >
                  <Smartphone size={14} />
                  {isAdminOpen ? 'CLOSE OPERATOR CONSOLE' : 'SIDELINE OPERATOR CONSOLE'}
                </button>
                <button
                  onClick={() => {
                    setIsAuthorized(false);
                    setIsAdminOpen(false);
                    sessionStorage.removeItem('ind_operator_auth');
                    if (window.location.hash) {
                      history.replaceState(null, '', window.location.pathname);
                    }
                  }}
                  title="Lock and hide console"
                  className="p-1.5 bg-white/5 hover:bg-red-950/60 border border-white/10 hover:border-red-500/40 text-white/40 hover:text-red-300 rounded text-xs transition-colors cursor-pointer"
                >
                  <EyeOff size={14} />
                </button>
              </div>
            ) : (
              /* Ultra-discrete lock icon for staff only */
              <button
                onClick={() => setPinModalOpen(true)}
                title="Staff login"
                className="p-2 text-white/20 hover:text-white/60 transition-colors rounded cursor-pointer"
              >
                <Lock size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ========================================================================= */}
        {/* GAME SELECTOR TABS (SWITCH BETWEEN LAWRENCE NORTH VS BROWNSBURG & SOUTHSIDE VS MARION) */}
        {/* ========================================================================= */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
              <Radio size={14} className="text-[#00BFFF] animate-pulse" />
              SELECT LIVE SHOWCASE GAME:
            </span>
            <span className="text-[11px] font-mono text-white/40 flex items-center gap-1">
              <RefreshCw size={11} className={isSyncing ? 'animate-spin text-[#00BFFF]' : ''} />
              Updated: {lastSyncTime}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {games.map((g) => {
              const isSelected = g.id === activeGame.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGameId(g.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#181818] border-[#00BFFF] shadow-lg shadow-[#00BFFF]/10 ring-1 ring-[#00BFFF]'
                      : 'bg-[#101010] border-white/10 hover:border-white/25 hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 overflow-hidden">
                      <img 
                        src={g.homeTeam.logoUrl} 
                        alt={g.homeTeam.name} 
                        className="inline-block h-9 w-9 rounded-full object-contain bg-black/60 border border-white/20 p-0.5" 
                      />
                      <img 
                        src={g.awayTeam.logoUrl} 
                        alt={g.awayTeam.name} 
                        className="inline-block h-9 w-9 rounded-full object-contain bg-black/60 border border-white/20 p-0.5" 
                      />
                    </div>
                    <div>
                      <div className="font-display font-black text-sm text-white tracking-wide flex items-center gap-2">
                        <span>{g.homeTeam.shortName}</span>
                        <span className="text-white/40 text-xs">vs</span>
                        <span>{g.awayTeam.shortName}</span>
                      </div>
                      <div className="text-[11px] font-sans text-white/50">
                        {g.homeTeam.mascot} (Home) • {g.awayTeam.mascot} (Away)
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-base text-white">
                      {g.homeTeam.score} - {g.awayTeam.score}
                    </div>
                    <div className="text-[10px] font-mono uppercase text-[#00BFFF] font-bold">
                      {g.quarter}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OPERATOR / SIDELINE CONTROL CONSOLE (Mobile-friendly Drawer) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isAuthorized && isAdminOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-[#121212] border-2 border-amber-400/80 rounded-xl p-5 sm:p-7 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-amber-400 text-black flex items-center justify-center font-black">
                      <Sliders size={18} />
                    </div>
                    <div>
                      <h3 className="font-display font-black uppercase text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
                        SIDELINE OPERATOR CONTROLLER <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">BROADCASTING LIVE TO ALL DEVICES</span>
                      </h3>
                      <p className="text-white/50 text-xs font-sans">
                        Managing: <strong className="text-white">{activeGame.homeTeam.name} (HOME)</strong> vs <strong className="text-white">{activeGame.awayTeam.name} (AWAY)</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetCurrentGame}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-mono uppercase bg-red-950/40 border border-red-800/40 px-2.5 py-1 rounded cursor-pointer"
                    >
                      <RotateCcw size={12} /> Reset Scoreboard
                    </button>
                  </div>
                </div>

                {/* Score Controls: Team 1 (Home) & Team 2 (Away) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  
                  {/* Home Team */}
                  <div className="bg-[#181818] border border-white/20 rounded-lg p-4 relative overflow-hidden">
                    <div 
                      className="absolute -right-4 -bottom-4 w-32 h-32 opacity-15 pointer-events-none bg-contain bg-no-repeat bg-right-bottom"
                      style={{ backgroundImage: `url(${activeGame.homeTeam.logoUrl})` }}
                    />
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={activeGame.homeTeam.logoUrl} 
                          alt={activeGame.homeTeam.name}
                          className="w-7 h-7 rounded-full object-contain bg-black/50 border border-white/20 p-0.5"
                        />
                        <div>
                          <span className="font-display font-black uppercase text-sm text-white block">{activeGame.homeTeam.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">HOME TEAM</span>
                        </div>
                      </div>
                      <span className="font-display font-black text-2xl text-white">{activeGame.homeTeam.score} PTS</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 relative z-10">
                      <button 
                        onClick={() => adjustScore('home', 6)}
                        className="py-2.5 bg-emerald-900/60 hover:bg-emerald-800 text-white font-display font-black text-xs rounded border border-emerald-500/40 cursor-pointer active:scale-95 transition-all"
                      >
                        +6 TD
                      </button>
                      <button 
                        onClick={() => adjustScore('home', 1)}
                        className="py-2.5 bg-emerald-900/40 hover:bg-emerald-800 text-white font-display font-black text-xs rounded border border-emerald-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +1 PAT
                      </button>
                      <button 
                        onClick={() => adjustScore('home', 2)}
                        className="py-2.5 bg-emerald-900/40 hover:bg-emerald-800 text-white font-display font-black text-xs rounded border border-emerald-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +2 2PT
                      </button>
                      <button 
                        onClick={() => adjustScore('home', 3)}
                        className="py-2.5 bg-emerald-900/50 hover:bg-emerald-800 text-white font-display font-black text-xs rounded border border-emerald-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +3 FG
                      </button>
                      <button 
                        onClick={() => adjustScore('home', 2, `💥 SAFETY awarded to ${activeGame.homeTeam.shortName}!`)}
                        className="py-2.5 bg-emerald-900/30 hover:bg-emerald-800 text-white font-display font-black text-xs rounded border border-emerald-500/20 cursor-pointer active:scale-95 transition-all"
                      >
                        +2 SFTY
                      </button>
                      <button 
                        onClick={() => adjustScore('home', -1, `Correction: -1 point for ${activeGame.homeTeam.shortName}`)}
                        className="py-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-display font-black text-xs rounded border border-white/10 cursor-pointer active:scale-95 transition-all"
                      >
                        -1 Undo
                      </button>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="bg-[#181818] border border-white/20 rounded-lg p-4 relative overflow-hidden">
                    <div 
                      className="absolute -right-4 -bottom-4 w-32 h-32 opacity-15 pointer-events-none bg-contain bg-no-repeat bg-right-bottom"
                      style={{ backgroundImage: `url(${activeGame.awayTeam.logoUrl})` }}
                    />
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={activeGame.awayTeam.logoUrl} 
                          alt={activeGame.awayTeam.name}
                          className="w-7 h-7 rounded-full object-contain bg-black/50 border border-white/20 p-0.5"
                        />
                        <div>
                          <span className="font-display font-black uppercase text-sm text-white block">{activeGame.awayTeam.name}</span>
                          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">AWAY TEAM</span>
                        </div>
                      </div>
                      <span className="font-display font-black text-2xl text-white">{activeGame.awayTeam.score} PTS</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 relative z-10">
                      <button 
                        onClick={() => adjustScore('away', 6)}
                        className="py-2.5 bg-purple-900/60 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/40 cursor-pointer active:scale-95 transition-all"
                      >
                        +6 TD
                      </button>
                      <button 
                        onClick={() => adjustScore('away', 1)}
                        className="py-2.5 bg-purple-900/40 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +1 PAT
                      </button>
                      <button 
                        onClick={() => adjustScore('away', 2)}
                        className="py-2.5 bg-purple-900/40 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +2 2PT
                      </button>
                      <button 
                        onClick={() => adjustScore('away', 3)}
                        className="py-2.5 bg-purple-900/50 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +3 FG
                      </button>
                      <button 
                        onClick={() => adjustScore('away', 2, `💥 SAFETY awarded to ${activeGame.awayTeam.shortName}!`)}
                        className="py-2.5 bg-purple-900/30 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/20 cursor-pointer active:scale-95 transition-all"
                      >
                        +2 SFTY
                      </button>
                      <button 
                        onClick={() => adjustScore('away', -1, `Correction: -1 point for ${activeGame.awayTeam.shortName}`)}
                        className="py-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-display font-black text-xs rounded border border-white/10 cursor-pointer active:scale-95 transition-all"
                      >
                        -1 Undo
                      </button>
                    </div>
                  </div>

                </div>

                {/* Period, Clock & Game Situation Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  
                  {/* Period Picker */}
                  <div className="bg-[#161616] p-3 rounded-lg border border-white/10">
                    <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-2">Quarter / Period</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {['1st Qtr', '2nd Qtr', 'Halftime', '3rd Qtr', '4th Qtr', 'Final'].map(q => (
                        <button
                          key={q}
                          onClick={() => updateGameField({ quarter: q, statusText: q.toUpperCase(), isLive: q !== 'Final' && q !== 'Pre-Game' })}
                          className={`py-1.5 text-xs font-display font-black rounded uppercase transition-all cursor-pointer ${
                            activeGame.quarter === q 
                              ? 'bg-[#00BFFF] text-black' 
                              : 'bg-white/5 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {q.replace(' Qtr', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clock Adjuster & Runner */}
                  <div className="bg-[#161616] p-3 rounded-lg border border-white/10">
                    <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-2">Game Clock (MM:SS)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={activeGame.clock}
                        onChange={(e) => updateGameField({ clock: e.target.value })}
                        className="w-24 bg-black border border-white/20 rounded px-2.5 py-1.5 text-center font-mono font-bold text-white text-base focus:border-[#00BFFF] outline-none"
                      />
                      <button
                        onClick={() => {
                          const nextState = !isClockRunning;
                          setIsClockRunning(nextState);
                          if (nextState) updateGameField({ isLive: true });
                        }}
                        className={`flex-1 py-1.5 px-3 rounded font-display font-black text-xs uppercase transition-all cursor-pointer ${
                          isClockRunning ? 'bg-amber-400 text-black' : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                      >
                        {isClockRunning ? 'PAUSE CLOCK' : 'START CLOCK'}
                      </button>
                    </div>
                  </div>

                  {/* Possession & Ball Spot */}
                  <div className="bg-[#161616] p-3 rounded-lg border border-white/10">
                    <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-2">Possession</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateGameField({ possession: 'home' })}
                        className={`flex-1 py-1.5 text-xs font-display font-black rounded uppercase transition-all cursor-pointer ${
                          activeGame.possession === 'home' ? 'bg-[#00BFFF] text-black font-black' : 'bg-white/5 text-white/50'
                        }`}
                      >
                        🏈 {activeGame.homeTeam.shortName} (Home)
                      </button>
                      <button
                        onClick={() => updateGameField({ possession: 'away' })}
                        className={`flex-1 py-1.5 text-xs font-display font-black rounded uppercase transition-all cursor-pointer ${
                          activeGame.possession === 'away' ? 'bg-[#00BFFF] text-black font-black' : 'bg-white/5 text-white/50'
                        }`}
                      >
                        🏈 {activeGame.awayTeam.shortName} (Away)
                      </button>
                    </div>
                  </div>

                </div>

                {/* Down & Distance Grid */}
                <div className="bg-[#161616] p-3 rounded-lg border border-white/10 mb-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">Down</label>
                      <div className="grid grid-cols-4 gap-1">
                        {['1st', '2nd', '3rd', '4th'].map(d => (
                          <button
                            key={d}
                            onClick={() => updateGameField({ down: d })}
                            className={`py-1 text-xs font-display font-black rounded cursor-pointer ${activeGame.down === d ? 'bg-[#00BFFF] text-black' : 'bg-white/5 text-white/70'}`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">Distance</label>
                      <div className="grid grid-cols-4 gap-1">
                        {['10', '5', '2', 'Goal'].map(dist => (
                          <button
                            key={dist}
                            onClick={() => updateGameField({ distance: dist })}
                            className={`py-1 text-xs font-display font-black rounded cursor-pointer ${activeGame.distance === dist ? 'bg-[#00BFFF] text-black' : 'bg-white/5 text-white/70'}`}
                          >
                            & {dist}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">Ball Spot (e.g. LN 35 / BB 45)</label>
                      <input 
                        type="text" 
                        value={activeGame.ballOn}
                        onChange={(e) => updateGameField({ ballOn: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded px-2.5 py-1 text-xs font-mono font-bold text-white uppercase focus:border-[#00BFFF] outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* MAIN PUBLIC SCOREBOARD DISPLAY (Broadcast Grade) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl mb-10 relative overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-emerald-900/10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-900/10 blur-3xl pointer-events-none" />

          {/* Matchup Header Details */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-display font-black tracking-widest uppercase mb-2">
                <Flame size={14} /> {activeGame.sport} • {activeGame.title}
              </div>
              <h2 className="text-sm sm:text-base font-display font-bold text-white/60 flex items-center gap-2">
                <span>{activeGame.venue}</span>
                <span>•</span>
                <span className="text-[#00BFFF] font-mono">{activeGame.dateString}</span>
              </h2>
            </div>

            {/* Quarter & Game Clock Badge */}
            <div className="bg-black/80 border border-white/15 px-5 py-2.5 rounded-xl flex items-center gap-4 shadow-inner">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">PERIOD</span>
                <span className="text-base sm:text-lg font-display font-black text-white uppercase">{activeGame.quarter}</span>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">GAME CLOCK</span>
                <span className="text-base sm:text-lg font-mono font-black text-[#00BFFF] flex items-center gap-1.5">
                  <Clock size={16} /> {activeGame.clock}
                </span>
              </div>
            </div>
          </div>

          {/* Big Scoreboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
            
            {/* Team 1: HOME (Left) */}
            <div className="md:col-span-4 bg-[#181818]/95 border-2 border-white/20 rounded-xl p-6 sm:p-8 flex items-center justify-between relative group hover:border-[#00BFFF]/60 transition-all shadow-xl overflow-hidden min-h-[140px]">
              {/* Mascot Logo in the Background */}
              <div 
                className="absolute inset-y-0 left-0 w-3/4 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-300 bg-no-repeat bg-contain bg-left-center mix-blend-screen"
                style={{ 
                  backgroundImage: `url(${activeGame.homeTeam.logoUrl})`,
                  maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)'
                }}
              />

              {activeGame.possession === 'home' && (
                <div className="absolute -top-3 left-6 bg-[#00BFFF] text-black font-display font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-[#00BFFF]/30 z-10">
                  <Zap size={12} /> POSSESSION
                </div>
              )}
              
              <div className="relative z-10 flex items-center gap-4">
                <img 
                  src={activeGame.homeTeam.logoUrl} 
                  alt={activeGame.homeTeam.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain bg-black/60 border-2 border-white/30 p-1 shrink-0 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-emerald-400 font-bold">HOME</span>
                    <span className="text-xs text-white/40">({activeGame.homeTeam.record})</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-white tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {activeGame.homeTeam.name}
                  </h3>
                  <span className="text-xs text-white/70 font-sans font-medium">{activeGame.homeTeam.mascot}</span>
                </div>
              </div>
              
              <div className="text-center pl-4 border-l border-white/10 relative z-10">
                <span className="text-5xl sm:text-7xl font-display font-black text-white tracking-tighter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]">
                  {activeGame.homeTeam.score}
                </span>
              </div>
            </div>

            {/* Middle Game Situation / Down & Distance (Center) */}
            <div className="md:col-span-3 text-center bg-black/60 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00BFFF] font-black block mb-1">
                CURRENT SITUATION
              </span>
              <div className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-2">
                {activeGame.down} & {activeGame.distance}
              </div>
              <div className="text-xs font-mono text-white/70 bg-white/5 py-1 px-2.5 rounded border border-white/5 inline-block mx-auto mb-2">
                BALL ON <span className="text-white font-bold">{activeGame.ballOn}</span>
              </div>
              <div className="text-[11px] font-sans text-white/50 italic line-clamp-1">
                {activeGame.possession === 'home' ? `${activeGame.homeTeam.shortName} offense` : `${activeGame.awayTeam.shortName} offense`}
              </div>
            </div>

            {/* Team 2: AWAY (Right) */}
            <div className="md:col-span-4 bg-[#181818]/95 border-2 border-white/20 rounded-xl p-6 sm:p-8 flex items-center justify-between relative group hover:border-[#00BFFF]/60 transition-all shadow-xl overflow-hidden min-h-[140px]">
              {/* Mascot Logo in the Background */}
              <div 
                className="absolute inset-y-0 right-0 w-3/4 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-300 bg-no-repeat bg-contain bg-right-center mix-blend-screen"
                style={{ 
                  backgroundImage: `url(${activeGame.awayTeam.logoUrl})`,
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)'
                }}
              />

              {activeGame.possession === 'away' && (
                <div className="absolute -top-3 right-6 bg-[#00BFFF] text-black font-display font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-[#00BFFF]/30 z-10">
                  <Zap size={12} /> POSSESSION
                </div>
              )}
              
              <div className="text-center pr-4 border-r border-white/10 order-2 md:order-1 relative z-10">
                <span className="text-5xl sm:text-7xl font-display font-black text-white tracking-tighter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]">
                  {activeGame.awayTeam.score}
                </span>
              </div>

              <div className="order-1 md:order-2 text-right relative z-10 flex items-center gap-4 flex-row-reverse">
                <img 
                  src={activeGame.awayTeam.logoUrl} 
                  alt={activeGame.awayTeam.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain bg-black/60 border-2 border-white/30 p-1 shrink-0 shadow-lg"
                />
                <div>
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-xs text-white/40">({activeGame.awayTeam.record})</span>
                    <span className="text-xs font-mono text-amber-400 font-bold">AWAY</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-white tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {activeGame.awayTeam.name}
                  </h3>
                  <span className="text-xs text-white/70 font-sans font-medium">{activeGame.awayTeam.mascot}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* TABBED INTERFACE: BOX SCORE BREAKDOWN / TEAM STAT COMPARISON */}
        {/* ========================================================================= */}
        <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 bg-[#161616]">
            <button
              onClick={() => setActiveTab('boxscore')}
              className={`flex-1 py-4 text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'boxscore' 
                  ? 'bg-[#121212] text-[#00BFFF] border-b-2 border-[#00BFFF]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy size={16} /> BOX SCORE BREAKDOWN
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-4 text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'stats' 
                  ? 'bg-[#121212] text-[#00BFFF] border-b-2 border-[#00BFFF]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders size={16} /> TEAM STAT COMPARISON
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="p-6 sm:p-8">

            {/* 1. BOX SCORE BREAKDOWN */}
            {activeTab === 'boxscore' && (
              <div>
                <h4 className="text-xs font-mono font-black uppercase tracking-widest text-white/50 mb-6">
                  QUARTER-BY-QUARTER SCORING TABLE
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs">
                        <th className="py-3 px-4 font-black">TEAM</th>
                        <th className="py-3 px-4 text-center">Q1</th>
                        <th className="py-3 px-4 text-center">Q2</th>
                        <th className="py-3 px-4 text-center">Q3</th>
                        <th className="py-3 px-4 text-center">Q4</th>
                        <th className="py-3 px-4 text-center">OT</th>
                        <th className="py-3 px-4 text-center font-black text-white">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 bg-white/5">
                        <td className="py-4 px-4 font-display font-black text-white flex items-center gap-3">
                          <img 
                            src={activeGame.homeTeam.logoUrl} 
                            alt={activeGame.homeTeam.name}
                            className="w-6 h-6 rounded-full object-contain bg-black/40 border border-white/20 p-0.5"
                          />
                          <span>{activeGame.homeTeam.name}</span>
                        </td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.homeTeam.qScores[0]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.homeTeam.qScores[1]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.homeTeam.qScores[2]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.homeTeam.qScores[3]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.homeTeam.qScores[4]}</td>
                        <td className="py-4 px-4 text-center font-display font-black text-xl text-white">{activeGame.homeTeam.score}</td>
                      </tr>
                      <tr className="border-b border-white/5 bg-black/40">
                        <td className="py-4 px-4 font-display font-black text-white flex items-center gap-3">
                          <img 
                            src={activeGame.awayTeam.logoUrl} 
                            alt={activeGame.awayTeam.name}
                            className="w-6 h-6 rounded-full object-contain bg-black/40 border border-white/20 p-0.5"
                          />
                          <span>{activeGame.awayTeam.name}</span>
                        </td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.awayTeam.qScores[0]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.awayTeam.qScores[1]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.awayTeam.qScores[2]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.awayTeam.qScores[3]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{activeGame.awayTeam.qScores[4]}</td>
                        <td className="py-4 px-4 text-center font-display font-black text-xl text-white">{activeGame.awayTeam.score}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. TEAM STAT COMPARISON */}
            {activeTab === 'stats' && (
              <div>
                <h4 className="text-xs font-mono font-black uppercase tracking-widest text-white/50 mb-6">
                  IN-GAME METRIC COMPARISON
                </h4>

                <div className="space-y-6 max-w-2xl mx-auto">
                  
                  {/* Passing Yards */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.passingYds} YDS</span>
                      <span className="text-white/60 uppercase font-black">Passing Yards</span>
                      <span className="text-amber-400 font-bold">{activeGame.awayTeam.stats.passingYds} YDS</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full flex overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(activeGame.homeTeam.stats.passingYds / (activeGame.homeTeam.stats.passingYds + activeGame.awayTeam.stats.passingYds || 1)) * 100}%` }}
                      />
                      <div 
                        className="bg-amber-500 h-full"
                        style={{ width: `${(activeGame.awayTeam.stats.passingYds / (activeGame.homeTeam.stats.passingYds + activeGame.awayTeam.stats.passingYds || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Rushing Yards */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.rushingYds} YDS</span>
                      <span className="text-white/60 uppercase font-black">Rushing Yards</span>
                      <span className="text-amber-400 font-bold">{activeGame.awayTeam.stats.rushingYds} YDS</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full flex overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(activeGame.homeTeam.stats.rushingYds / (activeGame.homeTeam.stats.rushingYds + activeGame.awayTeam.stats.rushingYds || 1)) * 100}%` }}
                      />
                      <div 
                        className="bg-amber-500 h-full"
                        style={{ width: `${(activeGame.awayTeam.stats.rushingYds / (activeGame.homeTeam.stats.rushingYds + activeGame.awayTeam.stats.rushingYds || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* First Downs */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.firstDowns}</span>
                      <span className="text-white/60 uppercase font-black">1st Downs</span>
                      <span className="text-amber-400 font-bold">{activeGame.awayTeam.stats.firstDowns}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full flex overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(activeGame.homeTeam.stats.firstDowns / (activeGame.homeTeam.stats.firstDowns + activeGame.awayTeam.stats.firstDowns || 1)) * 100}%` }}
                      />
                      <div 
                        className="bg-amber-500 h-full"
                        style={{ width: `${(activeGame.awayTeam.stats.firstDowns / (activeGame.homeTeam.stats.firstDowns + activeGame.awayTeam.stats.firstDowns || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Turnovers */}
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-mono">
                    <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.turnovers}</span>
                    <span className="text-white/60 uppercase font-black">Turnovers</span>
                    <span className="text-amber-400 font-bold">{activeGame.awayTeam.stats.turnovers}</span>
                  </div>

                  {/* Penalties */}
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-mono">
                    <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.penalties}</span>
                    <span className="text-white/60 uppercase font-black">Penalties (No.-Yds)</span>
                    <span className="text-amber-400 font-bold">{activeGame.awayTeam.stats.penalties}</span>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      {/* ========================================================================= */}
      {/* SECRET PIN MODAL FOR SIDELINE STAFF */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {pinModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-white/20 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF] flex items-center justify-center mx-auto mb-4">
                <Lock size={20} />
              </div>
              
              <h3 className="font-display font-black text-lg uppercase text-white tracking-wide mb-1">
                Sideline Operator Access
              </h3>
              <p className="text-white/50 text-xs font-sans mb-5">
                Enter PIN number to unlock score & clock controls.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (enteredPin === '1802') {
                    setIsAuthorized(true);
                    setIsAdminOpen(true);
                    sessionStorage.setItem('ind_operator_auth', 'true');
                    setPinModalOpen(false);
                    setEnteredPin('');
                    setPinError(false);
                  } else {
                    setPinError(true);
                  }
                }} 
                className="space-y-4"
              >
                <input
                  type="password"
                  maxLength={6}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter PIN number"
                  autoFocus
                  className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-lg px-4 py-3 text-center text-xl font-mono tracking-widest text-white outline-none"
                />

                {pinError && (
                  <div className="text-xs font-mono text-red-400 bg-red-950/40 py-1.5 px-3 rounded border border-red-800/40">
                    Incorrect PIN number. Please try again.
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPinModalOpen(false);
                      setEnteredPin('');
                      setPinError(false);
                    }}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-display font-black text-xs uppercase rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase rounded cursor-pointer font-black"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
