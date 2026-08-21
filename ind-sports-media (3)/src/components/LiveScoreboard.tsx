import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  ChevronRight, 
  Share2, 
  RotateCcw, 
  Plus, 
  Check, 
  Sliders, 
  Radio, 
  Shield, 
  Zap, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Edit3, 
  ArrowLeft,
  Activity,
  Send,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Lock,
  Unlock,
  EyeOff
} from 'lucide-react';
import { IndLogo } from './IndLogo';

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
  statusText: string; // "Q1", "Q2", "HALFTIME", "Q3", "Q4", "FINAL", "FINAL/OT"
  quarter: string; // "1st Qtr", "2nd Qtr", "Halftime", "3rd Qtr", "4th Qtr", "Final", "OT"
  clock: string; // "10:45"
  homeTeam: {
    name: string;
    shortName: string;
    mascot: string;
    record: string;
    color: string;
    textColor: string;
    logoUrl?: string;
    score: number;
    qScores: [number, number, number, number, number]; // Q1, Q2, Q3, Q4, OT
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
  down: string; // "1st", "2nd", "3rd", "4th"
  distance: string; // "10", "4", "Goal", "inches"
  ballOn: string; // "BB 35", "LN 48", "50"
  redZone: boolean;
  lastPlay: string;
  plays: PlayEvent[];
}

const DEFAULT_BROWNSBURG_LN_GAME: GameState = {
  id: 'brownsburg-vs-lawrence-north-2026',
  sport: 'Varsity Football',
  title: 'Indiana High School Showcase Matchup',
  venue: 'Roark Stadium • Brownsburg, IN',
  dateString: 'Upcoming Matchup',
  isLive: false,
  statusText: 'SCHEDULED',
  quarter: 'Pre-Game',
  clock: '00:00',
  homeTeam: {
    name: 'Brownsburg Bulldogs',
    shortName: 'Brownsburg',
    mascot: 'Bulldogs',
    record: '0-0',
    color: '#4A154B', // Purple
    textColor: '#FFFFFF',
    logoUrl: '/brownsburg_bulldog.jpg',
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
    name: 'Lawrence North Wildcats',
    shortName: 'Lawrence North',
    mascot: 'Wildcats',
    record: '0-0',
    color: '#BF1515', // Red
    textColor: '#FFFFFF',
    logoUrl: '/lawrence_north_wildcats.png',
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
};

interface LiveScoreboardProps {
  onBack: () => void;
}

export default function LiveScoreboard({ onBack }: LiveScoreboardProps) {
  const [game, setGame] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('ind_live_scoreboard_game');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_BROWNSBURG_LN_GAME;
  });

  // HIDDEN ACCESS STATE:
  // Hidden by default from regular viewers. Unlocks via URL hash #sideline or PIN modal.
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
  const [customPlayText, setCustomPlayText] = useState('');
  const [selectedPlayTeam, setSelectedPlayTeam] = useState<'home' | 'away' | 'neutral'>('home');
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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ind_live_scoreboard_game', JSON.stringify(game));
  }, [game]);

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
    if (isClockRunning && game.isLive) {
      timer = setInterval(() => {
        setGame(prev => {
          const parts = prev.clock.split(':');
          let minutes = parseInt(parts[0], 10) || 0;
          let seconds = parseInt(parts[1], 10) || 0;
          if (minutes === 0 && seconds === 0) {
            setIsClockRunning(false);
            return prev;
          }
          if (seconds === 0) {
            minutes -= 1;
            seconds = 59;
          } else {
            seconds -= 1;
          }
          const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          return { ...prev, clock: formatted };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClockRunning, game.isLive]);

  // Handle Score Adjustments
  const adjustScore = (team: 'home' | 'away', delta: number, description?: string) => {
    playScoreSound();
    setGame(prev => {
      const isHome = team === 'home';
      const targetTeam = isHome ? prev.homeTeam : prev.awayTeam;
      const newScore = Math.max(0, targetTeam.score + delta);
      
      // Determine which quarter score to bump
      const currentQIdx = prev.quarter.includes('1') ? 0 :
                          prev.quarter.includes('2') ? 1 :
                          prev.quarter.includes('3') ? 2 :
                          prev.quarter.includes('4') ? 3 : 4;

      const newQScores = [...targetTeam.qScores] as [number, number, number, number, number];
      newQScores[currentQIdx] = Math.max(0, newQScores[currentQIdx] + delta);

      const updatedTarget = {
        ...targetTeam,
        score: newScore,
        qScores: newQScores
      };

      const updatedHome = isHome ? updatedTarget : prev.homeTeam;
      const updatedAway = !isHome ? updatedTarget : prev.awayTeam;

      // Auto-create play event for score
      const playDesc = description || (delta === 6 ? `🏈 TOUCHDOWN ${targetTeam.shortName}!` : 
                                        delta === 1 ? `🎯 Extra point is GOOD for ${targetTeam.shortName}.` : 
                                        delta === 2 ? `⚡ 2-Point Conversion GOOD for ${targetTeam.shortName}!` : 
                                        delta === 3 ? `🎯 FIELD GOAL is GOOD for ${targetTeam.shortName}!` : 
                                        delta === 2 ? `💥 SAFETY awarded to ${targetTeam.shortName}!` : 
                                        `Score update for ${targetTeam.shortName} (+${delta})`);

      const newPlay: PlayEvent = {
        id: `p-${Date.now()}`,
        time: prev.clock,
        quarter: prev.quarter,
        team,
        teamName: targetTeam.shortName,
        text: playDesc,
        isScoring: delta > 0,
        scoreChange: `${updatedHome.shortName} ${updatedHome.score} - ${updatedAway.shortName} ${updatedAway.score}`,
        downInfo: `${prev.down} & ${prev.distance} at ${prev.ballOn}`
      };

      return {
        ...prev,
        homeTeam: updatedHome,
        awayTeam: updatedAway,
        lastPlay: playDesc,
        plays: [newPlay, ...prev.plays]
      };
    });
  };

  // Add Custom Play
  const handleAddPlay = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customPlayText.trim()) return;

    const teamObj = selectedPlayTeam === 'home' ? game.homeTeam : selectedPlayTeam === 'away' ? game.awayTeam : null;
    const teamName = teamObj ? teamObj.shortName : 'Official';

    const newPlay: PlayEvent = {
      id: `p-${Date.now()}`,
      time: game.clock,
      quarter: game.quarter,
      team: selectedPlayTeam,
      teamName,
      text: customPlayText.trim(),
      downInfo: `${game.down} & ${game.distance} at ${game.ballOn}`
    };

    setGame(prev => ({
      ...prev,
      lastPlay: customPlayText.trim(),
      plays: [newPlay, ...prev.plays]
    }));

    setCustomPlayText('');
  };

  // Quick Preset Play Action
  const logPresetPlay = (text: string, team: 'home' | 'away' | 'neutral', scoring: boolean = false, scoreDelta: number = 0) => {
    if (scoring && scoreDelta !== 0 && team !== 'neutral') {
      adjustScore(team, scoreDelta, text);
    } else {
      const teamName = team === 'home' ? game.homeTeam.shortName : team === 'away' ? game.awayTeam.shortName : 'Official';
      const newPlay: PlayEvent = {
        id: `p-${Date.now()}`,
        time: game.clock,
        quarter: game.quarter,
        team,
        teamName,
        text,
        downInfo: `${game.down} & ${game.distance} at ${game.ballOn}`
      };
      setGame(prev => ({
        ...prev,
        lastPlay: text,
        plays: [newPlay, ...prev.plays]
      }));
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const resetGame = () => {
    if (window.confirm('Reset the scoreboard and play log to default kickoff state?')) {
      setGame(DEFAULT_BROWNSBURG_LN_GAME);
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
            {/* Live Indicator Badge */}
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE GAMECAST
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

            {/* Hidden Sideline Operator Access: Only visible when authorized via URL hash #sideline or secret PIN */}
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
                        SIDELINE OPERATOR CONTROLLER <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">FAST PHONE INPUT</span>
                      </h3>
                      <p className="text-white/50 text-xs font-sans">
                        Tap below to update scores, clock, timeouts, and down & distance instantly from the sideline.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetGame}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-mono uppercase bg-red-950/40 border border-red-800/40 px-2.5 py-1 rounded"
                    >
                      <RotateCcw size={12} /> Reset Game
                    </button>
                  </div>
                </div>

                {/* Score Controls: Team 1 (Home) & Team 2 (Away) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  
                  {/* Home Team: Brownsburg */}
                  <div className="bg-[#181818] border border-purple-500/40 rounded-lg p-4 relative overflow-hidden">
                    {/* Background watermark logo */}
                    <div 
                      className="absolute -right-4 -bottom-4 w-32 h-32 opacity-15 pointer-events-none bg-contain bg-no-repeat bg-right-bottom"
                      style={{ backgroundImage: `url(${game.homeTeam.logoUrl || '/brownsburg_bulldog.jpg'})` }}
                    />
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={game.homeTeam.logoUrl || '/brownsburg_bulldog.jpg'} 
                          alt={game.homeTeam.name}
                          className="w-7 h-7 rounded-full object-contain bg-black/50 border border-purple-400/40 p-0.5"
                        />
                        <span className="font-display font-black uppercase text-sm text-purple-300">{game.homeTeam.name}</span>
                      </div>
                      <span className="font-display font-black text-2xl text-white">{game.homeTeam.score} PTS</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 relative z-10">
                      <button 
                        onClick={() => adjustScore('home', 6)}
                        className="py-2.5 bg-purple-900/60 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/40 cursor-pointer active:scale-95 transition-all"
                      >
                        +6 TD
                      </button>
                      <button 
                        onClick={() => adjustScore('home', 1)}
                        className="py-2.5 bg-purple-900/40 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +1 PAT
                      </button>
                      <button 
                        onClick={() => adjustScore('home', 2)}
                        className="py-2.5 bg-purple-900/40 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +2 2PT
                      </button>
                      <button 
                        onClick={() => adjustScore('home', 3)}
                        className="py-2.5 bg-purple-900/50 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +3 FG
                      </button>
                      <button 
                        onClick={() => adjustScore('home', 2, `💥 SAFETY awarded to ${game.homeTeam.shortName}!`)}
                        className="py-2.5 bg-purple-900/30 hover:bg-purple-800 text-white font-display font-black text-xs rounded border border-purple-500/20 cursor-pointer active:scale-95 transition-all"
                      >
                        +2 SFTY
                      </button>
                      <button 
                        onClick={() => adjustScore('home', -1, `Correction: -1 point for ${game.homeTeam.shortName}`)}
                        className="py-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-display font-black text-xs rounded border border-white/10 cursor-pointer active:scale-95 transition-all"
                      >
                        -1 Undo
                      </button>
                    </div>
                  </div>

                  {/* Away Team: Lawrence North */}
                  <div className="bg-[#181818] border border-red-500/40 rounded-lg p-4 relative overflow-hidden">
                    {/* Background watermark logo */}
                    <div 
                      className="absolute -right-4 -bottom-4 w-32 h-32 opacity-15 pointer-events-none bg-contain bg-no-repeat bg-right-bottom"
                      style={{ backgroundImage: `url(${game.awayTeam.logoUrl || '/lawrence_north_wildcats.png'})` }}
                    />
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={game.awayTeam.logoUrl || '/lawrence_north_wildcats.png'} 
                          alt={game.awayTeam.name}
                          className="w-7 h-7 rounded-full object-contain bg-black/50 border border-red-400/40 p-0.5"
                        />
                        <span className="font-display font-black uppercase text-sm text-red-300">{game.awayTeam.name}</span>
                      </div>
                      <span className="font-display font-black text-2xl text-white">{game.awayTeam.score} PTS</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      <button 
                        onClick={() => adjustScore('away', 6)}
                        className="py-2.5 bg-red-900/60 hover:bg-red-800 text-white font-display font-black text-xs rounded border border-red-500/40 cursor-pointer active:scale-95 transition-all"
                      >
                        +6 TD
                      </button>
                      <button 
                        onClick={() => adjustScore('away', 1)}
                        className="py-2.5 bg-red-900/40 hover:bg-red-800 text-white font-display font-black text-xs rounded border border-red-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +1 PAT
                      </button>
                      <button 
                        onClick={() => adjustScore('away', 2)}
                        className="py-2.5 bg-red-900/40 hover:bg-red-800 text-white font-display font-black text-xs rounded border border-red-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +2 2PT
                      </button>
                      <button 
                        onClick={() => adjustScore('away', 3)}
                        className="py-2.5 bg-red-900/50 hover:bg-red-800 text-white font-display font-black text-xs rounded border border-red-500/30 cursor-pointer active:scale-95 transition-all"
                      >
                        +3 FG
                      </button>
                      <button 
                        onClick={() => adjustScore('away', 2, `💥 SAFETY awarded to ${game.awayTeam.shortName}!`)}
                        className="py-2.5 bg-red-900/30 hover:bg-red-800 text-white font-display font-black text-xs rounded border border-red-500/20 cursor-pointer active:scale-95 transition-all"
                      >
                        +2 SFTY
                      </button>
                      <button 
                        onClick={() => adjustScore('away', -1, `Correction: -1 point for ${game.awayTeam.shortName}`)}
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
                          onClick={() => setGame(prev => ({ ...prev, quarter: q, statusText: q.toUpperCase() }))}
                          className={`py-1.5 text-xs font-display font-black rounded uppercase transition-all cursor-pointer ${
                            game.quarter === q 
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
                        value={game.clock}
                        onChange={(e) => setGame(prev => ({ ...prev, clock: e.target.value }))}
                        className="w-24 bg-black border border-white/20 rounded px-2.5 py-1.5 text-center font-mono font-bold text-white text-base focus:border-[#00BFFF] outline-none"
                      />
                      <button
                        onClick={() => setIsClockRunning(!isClockRunning)}
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
                    <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-2">Possession & Field Position</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGame(prev => ({ ...prev, possession: 'home' }))}
                        className={`flex-1 py-1.5 text-xs font-display font-black rounded uppercase transition-all cursor-pointer ${
                          game.possession === 'home' ? 'bg-purple-600 text-white border border-purple-400' : 'bg-white/5 text-white/50'
                        }`}
                      >
                        🏈 Brownsburg Ball
                      </button>
                      <button
                        onClick={() => setGame(prev => ({ ...prev, possession: 'away' }))}
                        className={`flex-1 py-1.5 text-xs font-display font-black rounded uppercase transition-all cursor-pointer ${
                          game.possession === 'away' ? 'bg-red-600 text-white border border-red-400' : 'bg-white/5 text-white/50'
                        }`}
                      >
                        🏈 Lawrence N. Ball
                      </button>
                    </div>
                  </div>

                </div>

                {/* Down & Distance Grid */}
                <div className="bg-[#161616] p-3 rounded-lg border border-white/10 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">Down</label>
                      <div className="grid grid-cols-4 gap-1">
                        {['1st', '2nd', '3rd', '4th'].map(d => (
                          <button
                            key={d}
                            onClick={() => setGame(prev => ({ ...prev, down: d }))}
                            className={`py-1 text-xs font-display font-black rounded ${game.down === d ? 'bg-[#00BFFF] text-black' : 'bg-white/5 text-white/70'}`}
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
                            onClick={() => setGame(prev => ({ ...prev, distance: dist }))}
                            className={`py-1 text-xs font-display font-black rounded ${game.distance === dist ? 'bg-[#00BFFF] text-black' : 'bg-white/5 text-white/70'}`}
                          >
                            & {dist}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">Ball Spot (e.g. BB 45 / LN 30)</label>
                      <input 
                        type="text" 
                        value={game.ballOn}
                        onChange={(e) => setGame(prev => ({ ...prev, ballOn: e.target.value }))}
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
        {/* MAIN PUBLIC SCOREBOARD DISPLAY (Clean, High-Contrast Broadcast Grade) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl mb-10 relative overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-purple-900/10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-red-900/10 blur-3xl pointer-events-none" />

          {/* Matchup Header Details */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-display font-black tracking-widest uppercase mb-2">
                <Flame size={14} /> {game.sport} • {game.title}
              </div>
              <h2 className="text-sm sm:text-base font-display font-bold text-white/60 flex items-center gap-2">
                <span>{game.venue}</span>
                <span>•</span>
                <span className="text-[#00BFFF] font-mono">{game.dateString}</span>
              </h2>
            </div>

            {/* Quarter & Game Clock Badge */}
            <div className="bg-black/80 border border-white/15 px-5 py-2.5 rounded-xl flex items-center gap-4 shadow-inner">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">PERIOD</span>
                <span className="text-base sm:text-lg font-display font-black text-white uppercase">{game.quarter}</span>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">GAME CLOCK</span>
                <span className="text-base sm:text-lg font-mono font-black text-[#00BFFF] flex items-center gap-1.5">
                  <Clock size={16} /> {game.clock}
                </span>
              </div>
            </div>
          </div>

          {/* Big Scoreboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
            
            {/* Team 1: Brownsburg (Left) */}
            <div className="md:col-span-4 bg-[#181818]/95 border-2 border-purple-500/40 rounded-xl p-6 sm:p-8 flex items-center justify-between relative group hover:border-purple-400 transition-all shadow-xl overflow-hidden min-h-[140px]">
              {/* Mascot Logo in the Background of the Team Name */}
              <div 
                className="absolute inset-y-0 left-0 w-3/4 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-300 bg-no-repeat bg-contain bg-left-center mix-blend-screen"
                style={{ 
                  backgroundImage: `url(${game.homeTeam.logoUrl || '/brownsburg_bulldog.jpg'})`,
                  maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)'
                }}
              />

              {game.possession === 'home' && (
                <div className="absolute -top-3 left-6 bg-[#00BFFF] text-black font-display font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-[#00BFFF]/30 z-10">
                  <Zap size={12} /> POSSESSION
                </div>
              )}
              
              <div className="relative z-10 flex items-center gap-4">
                <img 
                  src={game.homeTeam.logoUrl || '/brownsburg_bulldog.jpg'} 
                  alt={game.homeTeam.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain bg-black/60 border-2 border-purple-400/50 p-1 shrink-0 shadow-lg shadow-purple-950/60"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-purple-400 font-bold">HOME</span>
                    <span className="text-xs text-white/40">({game.homeTeam.record})</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-white tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {game.homeTeam.name}
                  </h3>
                  <span className="text-xs text-white/70 font-sans font-medium">{game.homeTeam.mascot}</span>
                </div>
              </div>
              
              <div className="text-center pl-4 border-l border-white/10 relative z-10">
                <span className="text-5xl sm:text-7xl font-display font-black text-white tracking-tighter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]">
                  {game.homeTeam.score}
                </span>
              </div>
            </div>

            {/* Middle Game Situation / Down & Distance (Center) */}
            <div className="md:col-span-3 text-center bg-black/60 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00BFFF] font-black block mb-1">
                CURRENT SITUATION
              </span>
              <div className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-2">
                {game.down} & {game.distance}
              </div>
              <div className="text-xs font-mono text-white/70 bg-white/5 py-1 px-2.5 rounded border border-white/5 inline-block mx-auto mb-2">
                BALL ON <span className="text-white font-bold">{game.ballOn}</span>
              </div>
              <div className="text-[11px] font-sans text-white/50 italic line-clamp-1">
                {game.possession === 'home' ? `${game.homeTeam.shortName} offense` : `${game.awayTeam.shortName} offense`}
              </div>
            </div>

            {/* Team 2: Lawrence North (Right) */}
            <div className="md:col-span-4 bg-[#181818]/95 border-2 border-red-500/40 rounded-xl p-6 sm:p-8 flex items-center justify-between relative group hover:border-red-400 transition-all shadow-xl overflow-hidden min-h-[140px]">
              {/* Mascot Logo in the Background of the Team Name */}
              <div 
                className="absolute inset-y-0 right-0 w-3/4 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-300 bg-no-repeat bg-contain bg-right-center mix-blend-screen"
                style={{ 
                  backgroundImage: `url(${game.awayTeam.logoUrl || '/lawrence_north_wildcats.png'})`,
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)'
                }}
              />

              {game.possession === 'away' && (
                <div className="absolute -top-3 right-6 bg-[#00BFFF] text-black font-display font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-[#00BFFF]/30 z-10">
                  <Zap size={12} /> POSSESSION
                </div>
              )}
              
              <div className="text-center pr-4 border-r border-white/10 order-2 md:order-1 relative z-10">
                <span className="text-5xl sm:text-7xl font-display font-black text-white tracking-tighter drop-shadow-[0_4px_16px_rgba(255,255,255,0.2)]">
                  {game.awayTeam.score}
                </span>
              </div>

              <div className="order-1 md:order-2 text-right relative z-10 flex items-center gap-4 flex-row-reverse">
                <img 
                  src={game.awayTeam.logoUrl || '/lawrence_north_wildcats.png'} 
                  alt={game.awayTeam.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain bg-black/60 border-2 border-red-400/50 p-1 shrink-0 shadow-lg shadow-red-950/60"
                />
                <div>
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-xs text-white/40">({game.awayTeam.record})</span>
                    <span className="text-xs font-mono text-red-400 font-bold">AWAY</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-white tracking-tight leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {game.awayTeam.name}
                  </h3>
                  <span className="text-xs text-white/70 font-sans font-medium">{game.awayTeam.mascot}</span>
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
                      <tr className="border-b border-white/5 bg-purple-950/20">
                        <td className="py-4 px-4 font-display font-black text-white flex items-center gap-3">
                          <img 
                            src={game.homeTeam.logoUrl || '/brownsburg_bulldog.jpg'} 
                            alt={game.homeTeam.name}
                            className="w-6 h-6 rounded-full object-contain bg-black/40 border border-purple-400/50 p-0.5"
                          />
                          <span>{game.homeTeam.name}</span>
                        </td>
                        <td className="py-4 px-4 text-center text-white/80">{game.homeTeam.qScores[0]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{game.homeTeam.qScores[1]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{game.homeTeam.qScores[2]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{game.homeTeam.qScores[3]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{game.homeTeam.qScores[4]}</td>
                        <td className="py-4 px-4 text-center font-display font-black text-xl text-white">{game.homeTeam.score}</td>
                      </tr>
                      <tr className="border-b border-white/5 bg-red-950/20">
                        <td className="py-4 px-4 font-display font-black text-white flex items-center gap-3">
                          <img 
                            src={game.awayTeam.logoUrl || '/lawrence_north_wildcats.png'} 
                            alt={game.awayTeam.name}
                            className="w-6 h-6 rounded-full object-contain bg-black/40 border border-red-400/50 p-0.5"
                          />
                          <span>{game.awayTeam.name}</span>
                        </td>
                        <td className="py-4 px-4 text-center text-white/80">{game.awayTeam.qScores[0]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{game.awayTeam.qScores[1]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{game.awayTeam.qScores[2]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{game.awayTeam.qScores[3]}</td>
                        <td className="py-4 px-4 text-center text-white/80">{game.awayTeam.qScores[4]}</td>
                        <td className="py-4 px-4 text-center font-display font-black text-xl text-white">{game.awayTeam.score}</td>
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
                      <span className="text-purple-400 font-bold">{game.homeTeam.stats.passingYds} YDS</span>
                      <span className="text-white/60 uppercase font-black">Passing Yards</span>
                      <span className="text-red-400 font-bold">{game.awayTeam.stats.passingYds} YDS</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full flex overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full"
                        style={{ width: `${(game.homeTeam.stats.passingYds / (game.homeTeam.stats.passingYds + game.awayTeam.stats.passingYds || 1)) * 100}%` }}
                      />
                      <div 
                        className="bg-red-600 h-full"
                        style={{ width: `${(game.awayTeam.stats.passingYds / (game.homeTeam.stats.passingYds + game.awayTeam.stats.passingYds || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Rushing Yards */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-purple-400 font-bold">{game.homeTeam.stats.rushingYds} YDS</span>
                      <span className="text-white/60 uppercase font-black">Rushing Yards</span>
                      <span className="text-red-400 font-bold">{game.awayTeam.stats.rushingYds} YDS</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full flex overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full"
                        style={{ width: `${(game.homeTeam.stats.rushingYds / (game.homeTeam.stats.rushingYds + game.awayTeam.stats.rushingYds || 1)) * 100}%` }}
                      />
                      <div 
                        className="bg-red-600 h-full"
                        style={{ width: `${(game.awayTeam.stats.rushingYds / (game.homeTeam.stats.rushingYds + game.awayTeam.stats.rushingYds || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* First Downs */}
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-purple-400 font-bold">{game.homeTeam.stats.firstDowns}</span>
                      <span className="text-white/60 uppercase font-black">1st Downs</span>
                      <span className="text-red-400 font-bold">{game.awayTeam.stats.firstDowns}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full flex overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full"
                        style={{ width: `${(game.homeTeam.stats.firstDowns / (game.homeTeam.stats.firstDowns + game.awayTeam.stats.firstDowns || 1)) * 100}%` }}
                      />
                      <div 
                        className="bg-red-600 h-full"
                        style={{ width: `${(game.awayTeam.stats.firstDowns / (game.homeTeam.stats.firstDowns + game.awayTeam.stats.firstDowns || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Turnovers */}
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-mono">
                    <span className="text-purple-400 font-bold">{game.homeTeam.stats.turnovers}</span>
                    <span className="text-white/60 uppercase font-black">Turnovers</span>
                    <span className="text-red-400 font-bold">{game.awayTeam.stats.turnovers}</span>
                  </div>

                  {/* Penalties */}
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-mono">
                    <span className="text-purple-400 font-bold">{game.homeTeam.stats.penalties}</span>
                    <span className="text-white/60 uppercase font-black">Penalties (No.-Yds)</span>
                    <span className="text-red-400 font-bold">{game.awayTeam.stats.penalties}</span>
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
                Enter your staff PIN (e.g. 2026) to unlock score & clock controls.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (enteredPin === '2026' || enteredPin === '1234') {
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
                  placeholder="Enter PIN (2026)"
                  autoFocus
                  className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-lg px-4 py-3 text-center text-xl font-mono tracking-widest text-white outline-none"
                />

                {pinError && (
                  <div className="text-xs font-mono text-red-400 bg-red-950/40 py-1.5 px-3 rounded border border-red-800/40">
                    Incorrect PIN. Default is <span className="font-bold text-white">2026</span>
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
