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
  Smartphone, 
  ArrowLeft,
  Lock,
  EyeOff,
  Check,
  RefreshCw,
  Globe,
  Video,
  Play,
  Heart,
  ExternalLink,
  Trash2,
  Copy,
  Sparkles,
  Camera,
  Film,
  UploadCloud,
  X,
  MessageSquare,
  CloudLightning,
  Wifi
} from 'lucide-react';
import brownsburgLogo from '../assets/brownsburg_bulldog.jpg';
import lawrenceNorthLogo from '../assets/lawrence_north_wildcats.png';
import southsideLogo from '../assets/southside_archers.jpg';
import marionLogo from '../assets/marion_giants.jpg';
import { 
  subscribeToGames, 
  syncGameToFirestore, 
  seedInitialGamesIfEmpty, 
  testFirestoreConnection,
  compressImageFile,
  uploadPhotoToFirestore 
} from '../lib/firebase';
import type { PlayEvent, SocialClip, GameState } from '../types';

export type { PlayEvent, SocialClip, GameState };

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
    plays: [],
    socialClips: [
      {
        id: 'clip-ln-1',
        platform: 'x',
        type: 'video',
        title: '🔥 Pregame Tunnel Walkout & Student Section',
        author: '@INDSportsMedia',
        url: 'https://x.com/INDSportsMedia/status/178923019',
        mediaUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        caption: 'The energy at Wildcat Stadium is through the roof! Watch live score updates & recruitment reels at indsportsmedia.com #MICshowcase #FridayNightLights',
        time: 'Pre-Game',
        team: 'home',
        likes: 124,
        createdAt: new Date().toISOString()
      },
      {
        id: 'clip-bb-1',
        platform: 'instagram',
        type: 'photo',
        title: '📸 Bulldogs Warmups Under the Friday Night Lights',
        author: 'Brandon Blume (IND Field Team)',
        url: 'https://instagram.com/p/C99238jkl',
        mediaUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1000&q=80',
        caption: 'Brownsburg secondary dialed in during 7-on-7 drills. Tag your favorite athlete in the comments! #BrownsburgBulldogs #INDMedia',
        time: 'Pre-Game',
        team: 'away',
        likes: 89,
        createdAt: new Date().toISOString()
      }
    ]
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
    plays: [],
    socialClips: [
      {
        id: 'clip-fw-1',
        platform: 'tiktok',
        type: 'video',
        title: '⚡ Archers Marching Band Entrance',
        author: '@IND_Sideline',
        url: 'https://tiktok.com/@IND_Sideline/video/7391823901',
        mediaUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
        caption: 'Fort Wayne is electric tonight! Track live box score and in-game reels at indsportsmedia.com #FWArchers #MarionGiants',
        time: 'Pre-Game',
        team: 'home',
        likes: 67,
        createdAt: new Date().toISOString()
      }
    ]
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
  const [activeTab, setActiveTab] = useState<'highlights' | 'boxscore' | 'stats'>('highlights');
  const [isClockRunning, setIsClockRunning] = useState(false);

  // In-Stands Social & Clips Uploader State
  const [clipPlatform, setClipPlatform] = useState<'x' | 'instagram' | 'tiktok' | 'youtube' | 'custom' | 'upload'>('x');
  const [clipType, setClipType] = useState<'video' | 'photo' | 'post'>('video');
  const [clipTitle, setClipTitle] = useState('');
  const [clipUrl, setClipUrl] = useState('');
  const [clipMediaUrl, setClipMediaUrl] = useState('');
  const [clipCaption, setClipCaption] = useState('');
  const [clipTeam, setClipTeam] = useState<'home' | 'away' | 'neutral'>('neutral');
  const [isPostingClip, setIsPostingClip] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [clipFilter, setClipFilter] = useState<'all' | 'home' | 'away'>('all');
  const [previewMediaModal, setPreviewMediaModal] = useState<SocialClip | null>(null);
  const [likedClips, setLikedClips] = useState<Record<string, boolean>>({});
  const [clipImageFilePreview, setClipImageFilePreview] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(true);

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

  // 1. Primary Sync: Real-Time Firebase Firestore onSnapshot listener across all devices
  useEffect(() => {
    // Test initial connection and seed if empty
    testFirestoreConnection().catch(console.warn);
    seedInitialGamesIfEmpty(DEFAULT_GAMES_LIST).catch(console.warn);

    const unsubscribe = subscribeToGames(
      (firestoreGames) => {
        if (firestoreGames && firestoreGames.length > 0) {
          setGames(prev => {
            const updated = firestoreGames.map((fGame) => {
              const localMatch = DEFAULT_GAMES_LIST.find(d => d.id === fGame.id);
              return {
                ...fGame,
                socialClips: fGame.socialClips || localMatch?.socialClips || [],
                homeTeam: {
                  ...fGame.homeTeam,
                  logoUrl: fGame.homeTeam?.logoUrl || localMatch?.homeTeam.logoUrl
                },
                awayTeam: {
                  ...fGame.awayTeam,
                  logoUrl: fGame.awayTeam?.logoUrl || localMatch?.awayTeam.logoUrl
                }
              };
            });
            localStorage.setItem('ind_live_scoreboard_games_v2', JSON.stringify(updated));
            return updated;
          });
          setFirestoreConnected(true);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      },
      (err) => {
        console.warn('Firestore subscription offline fallback:', err);
        setFirestoreConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Secondary Server Fallback Polling (Keeps Express backend & local cache in sync)
  const fetchServerGames = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/games');
      if (res.ok) {
        const data = await res.json();
        if (data.games && Array.isArray(data.games) && data.games.length > 0) {
          setGames(prev => {
            const updated = data.games.map((serverGame: GameState) => {
              const localMatch = DEFAULT_GAMES_LIST.find(d => d.id === serverGame.id);
              return {
                ...serverGame,
                socialClips: serverGame.socialClips || localMatch?.socialClips || [],
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
      // Offline fallback
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchServerGames();
    const interval = setInterval(fetchServerGames, 5000);
    return () => clearInterval(interval);
  }, []);

  // Broadcast single game update to Firebase Firestore and Express backend
  const broadcastGameUpdate = async (updatedGame: GameState) => {
    // 1. Optimistic local state update
    setGames(prev => {
      const next = prev.map(g => g.id === updatedGame.id ? updatedGame : g);
      localStorage.setItem('ind_live_scoreboard_games_v2', JSON.stringify(next));
      return next;
    });

    // 2. Push to Firebase Firestore (instantly pushes via onSnapshot to every device)
    try {
      await syncGameToFirestore(updatedGame);
      setFirestoreConnected(true);
    } catch (e: any) {
      console.warn('Could not sync to Firebase Firestore:', e);
      setFirestoreConnected(false);
      throw e;
    }

    // 3. Push to Express backend API as server backup
    try {
      await fetch(`/api/games/${updatedGame.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: updatedGame })
      });
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.warn('Could not push live update to server backup:', e);
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

  // Handle Score Adjustments (Silent, no audio tone)
  const adjustScore = (team: 'home' | 'away', delta: number, description?: string) => {
    const isHome = team === 'home';
    const targetTeam = isHome ? activeGame.homeTeam : activeGame.awayTeam;
    const newScore = Math.max(0, targetTeam.score + delta);

    // Quarter score tracking
    const qIndexMap: Record<string, number> = {
      '1st Qtr': 0, '1st': 0,
      '2nd Qtr': 1, '2nd': 1,
      '3rd Qtr': 2, '3rd': 2,
      '4th Qtr': 3, '4th': 3,
      'OT': 4, 'Final': 3
    };
    const currentQIdx = qIndexMap[activeGame.quarter] ?? 0;
    const newQScores = [...targetTeam.qScores] as [number, number, number, number, number];
    newQScores[currentQIdx] = Math.max(0, newQScores[currentQIdx] + delta);

    // Auto Play description if not provided
    let playDesc = description;
    if (!playDesc) {
      if (delta === 6) playDesc = `🏈 TOUCHDOWN ${targetTeam.shortName}! (+6 pts)`;
      else if (delta === 1) playDesc = `👟 Extra Point (PAT) GOOD for ${targetTeam.shortName}. (+1 pt)`;
      else if (delta === 2) playDesc = `⚡ 2-Point Conversion SUCCESSFUL for ${targetTeam.shortName}! (+2 pts)`;
      else if (delta === 3) playDesc = `🎯 Field Goal GOOD for ${targetTeam.shortName}! (+3 pts)`;
      else if (delta < 0) playDesc = `Score adjustment: ${delta} point for ${targetTeam.shortName}`;
      else playDesc = `${targetTeam.shortName} scores +${delta} points.`;
    }

    const newPlay: PlayEvent = {
      id: `play-${Date.now()}`,
      time: activeGame.clock,
      quarter: activeGame.quarter,
      team,
      teamName: targetTeam.shortName,
      text: playDesc,
      isScoring: delta > 0,
      scoreChange: delta > 0 ? `+${delta}` : `${delta}`,
      downInfo: `${activeGame.down} & ${activeGame.distance}`
    };

    const updatedGame: GameState = {
      ...activeGame,
      isLive: true,
      lastPlay: playDesc,
      plays: [newPlay, ...(activeGame.plays || [])],
      homeTeam: isHome 
        ? { ...activeGame.homeTeam, score: newScore, qScores: newQScores }
        : activeGame.homeTeam,
      awayTeam: !isHome
        ? { ...activeGame.awayTeam, score: newScore, qScores: newQScores }
        : activeGame.awayTeam
    };

    broadcastGameUpdate(updatedGame);
  };

  // Helper for quick field updates
  const updateGameField = (fields: Partial<GameState>) => {
    const updated = { ...activeGame, ...fields };
    broadcastGameUpdate(updated);
  };

  // Copy share URL to clipboard
  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Reset only the currently active game
  const resetCurrentGame = async () => {
    const confirmReset = window.confirm(`Reset "${activeGame.homeTeam.name} vs ${activeGame.awayTeam.name}" to 0-0 pre-game? (Only this game will be reset)`);
    if (confirmReset) {
      const defaultTemplate = DEFAULT_GAMES_LIST.find(d => d.id === activeGame.id) || DEFAULT_GAMES_LIST[0];
      const freshState: GameState = JSON.parse(JSON.stringify(defaultTemplate));
      
      setIsClockRunning(false);
      await broadcastGameUpdate(freshState);

      try {
        const res = await fetch(`/api/games/reset/${activeGame.id}`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.game) {
            setGames(prev => prev.map(g => g.id === activeGame.id ? data.game : g));
          }
        }
      } catch (err) {
        console.error('Error resetting game:', err);
      }
    }
  };

  // Handle in-stands camera/file upload for local preview
  const handleFileMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        setClipMediaUrl(resultUrl);
        setClipType(isVideo ? 'video' : 'photo');
        setClipPlatform('upload');
        if (!clipTitle) {
          setClipTitle(isVideo ? '⚡ Sideline Video Highlight' : '📸 Live Sideline Photo');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick hashtag append for social captions
  const appendTag = (tag: string) => {
    setClipCaption(prev => prev ? `${prev} ${tag}` : tag);
  };

  // Copy ready-to-post caption for phone social apps
  const copySocialCaption = () => {
    const schoolTags = activeGame.id.includes('lawrence') 
      ? '#LNWFootball #BrownsburgBulldogs #MICShowcase' 
      : '#SouthSideArchers #MarionGiants #FWHighSchoolFootball';
    const finalCaption = `${clipTitle ? clipTitle + '\n\n' : ''}${clipCaption}\n\n👉 Track live score & 4K photo gallery at indsports.media\n${schoolTags} #INDMedia #FridayNightLights`;
    navigator.clipboard.writeText(finalCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // File input change for instant in-game photo upload & compression
  const handleFileSelectForClip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedUrl = await compressImageFile(file, 1400, 0.82);
      setClipImageFilePreview(compressedUrl);
      setClipMediaUrl(compressedUrl);
      setClipType('photo');
      setClipPlatform('upload');
    } catch (err) {
      console.error('Error compressing clip image:', err);
    }
  };

  // Publish Social Clip / Highlight / Photo live to website
  const handlePublishClip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clipTitle.trim()) {
      alert('Please enter a headline / play title for this highlight.');
      return;
    }

    setIsPostingClip(true);
    try {
      const defaultMedia = clipType === 'video' 
        ? 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80'
        : 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1000&q=80';

      const finalMediaUrl = clipImageFilePreview || clipMediaUrl.trim() || defaultMedia;

      const newClip: SocialClip = {
        id: `clip-${Date.now()}`,
        platform: clipPlatform,
        type: clipType,
        title: clipTitle.trim(),
        author: clipPlatform === 'x' ? '@INDSportsMedia' : 'Brandon Blume (IND Field Staff)',
        url: clipUrl.trim() || (clipType === 'photo' ? finalMediaUrl : ''),
        mediaUrl: finalMediaUrl,
        caption: clipCaption.trim(),
        time: `${activeGame.quarter} • ${activeGame.clock}`,
        team: clipTeam,
        likes: 0,
        createdAt: new Date().toISOString()
      };

      const updatedGame: GameState = {
        ...activeGame,
        socialClips: [newClip, ...(activeGame.socialClips || [])]
      };

      // 1. Push to Firestore & Server for the live game
      await broadcastGameUpdate(updatedGame);

      // 2. Also automatically broadcast to the global Photos Gallery if it's a photo!
      if (clipType === 'photo' || clipImageFilePreview) {
        try {
          await uploadPhotoToFirestore({
            sport: (activeGame.sport.includes('Basketball') ? 'Basketball' : 'Football') as any,
            title: clipTitle.trim(),
            match: `${activeGame.homeTeam.name} vs. ${activeGame.awayTeam.name}`,
            photographer: 'Brandon Blume (IND Sideline)',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            src: finalMediaUrl,
            tags: ['Live Game', 'Sideline', activeGame.quarter.replace(' Qtr', '')],
            isLiveGamePhoto: true,
            gameId: activeGame.id,
            createdAt: new Date().toISOString()
          });
        } catch (photoErr) {
          console.warn('Could not sync to global photo gallery:', photoErr);
        }
      }

      // Reset form
      setClipTitle('');
      setClipUrl('');
      setClipMediaUrl('');
      setClipImageFilePreview('');
      setClipCaption('');
      setActiveTab('highlights');
      alert('🎉 Published live! Synced to Scoreboard, Highlights & Photos Gallery in real-time.');
    } catch (err) {
      console.error('Error publishing clip:', err);
      alert('Failed to publish clip to live feed.');
    } finally {
      setIsPostingClip(false);
    }
  };

  // Like a clip in real-time across devices
  const handleLikeClip = async (clipId: string) => {
    if (likedClips[clipId]) return;
    setLikedClips(prev => ({ ...prev, [clipId]: true }));

    const updatedGame: GameState = {
      ...activeGame,
      socialClips: (activeGame.socialClips || []).map(c => 
        c.id === clipId ? { ...c, likes: (c.likes || 0) + 1 } : c
      )
    };

    broadcastGameUpdate(updatedGame);
  };

  // Delete a clip across devices
  const handleDeleteClip = async (clipId: string) => {
    if (window.confirm('Delete this highlight from the live feed?')) {
      const updatedGame: GameState = {
        ...activeGame,
        socialClips: (activeGame.socialClips || []).filter(c => c.id !== clipId)
      };

      await broadcastGameUpdate(updatedGame);
    }
  };

  // Filtered clips
  const currentClips = activeGame.socialClips || [];
  const filteredClips = currentClips.filter(c => {
    if (clipFilter === 'home') return c.team === 'home';
    if (clipFilter === 'away') return c.team === 'away';
    return true;
  });

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

            <div 
              title={`Firebase Real-Time Cloud Database: pelagic-airline-s1ttq\nConnected to domain: indsports.media\nStatus: ${firestoreConnected ? 'Live & Connected' : 'Connecting...'}`}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                firestoreConnected 
                  ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 shadow-sm shadow-emerald-500/20' 
                  : 'bg-amber-950/60 border border-amber-500/50 text-amber-300'
              }`}
            >
              <CloudLightning size={13} className={firestoreConnected ? "text-emerald-400 animate-pulse" : "text-amber-400"} />
              <span className="font-bold">{firestoreConnected ? 'indsports.media LIVE SYNC' : 'CONNECTING...'}</span>
              <span className={`w-2 h-2 rounded-full ${firestoreConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            </div>

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
        {/* GAME SELECTOR TABS (SWITCH BETWEEN SHOWCASES) */}
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
              <div className="bg-[#121212] border-2 border-amber-400/80 rounded-xl p-5 sm:p-7 shadow-2xl relative space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
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
                      onClick={async () => {
                        const testTime = new Date().toLocaleTimeString();
                        try {
                          await broadcastGameUpdate({
                            ...activeGame,
                            lastPlay: `⚡ Firebase live sync ping verified at ${testTime}`
                          });
                          alert(`✅ Firebase test successful!\n\nConnected to database project:\npelagic-airline-s1ttq (IND Sports Media)\n\nYour update synced live to all devices!`);
                        } catch (e) {
                          alert(`⚠️ Firebase sync error: ${e}`);
                        }
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono uppercase bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-1 rounded cursor-pointer"
                    >
                      <CloudLightning size={12} /> Test Firebase Ping
                    </button>
                    <button
                      onClick={resetCurrentGame}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-mono uppercase bg-red-950/40 border border-red-800/40 px-2.5 py-1 rounded cursor-pointer"
                    >
                      <RotateCcw size={12} /> Reset Scoreboard
                    </button>
                  </div>
                </div>

                {/* Score Controls: Team 1 (Home) & Team 2 (Away) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
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
                <div className="bg-[#161616] p-3 rounded-lg border border-white/10">
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

                {/* ================================================================= */}
                {/* STRATEGY B: IN-STANDS REAL-TIME SOCIAL & CLIPS UPLOADER */}
                {/* ================================================================= */}
                <div className="bg-gradient-to-r from-blue-950/40 via-[#161616] to-purple-950/40 border-2 border-[#00BFFF]/60 rounded-xl p-5 shadow-2xl">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-[#00BFFF] text-black flex items-center justify-center font-black">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h4 className="font-display font-black uppercase text-sm sm:text-base text-white flex items-center gap-2">
                          IN-STANDS SOCIAL & HIGHLIGHTS BROADCASTER
                          <span className="text-[10px] font-mono bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/40 px-2 py-0.5 rounded">STRATEGY B</span>
                        </h4>
                        <p className="text-white/50 text-[11px]">
                          Quickly paste a social link (X, IG Reel, TikTok) or snap a clip from your phone to publish live to all website visitors.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-display font-black text-xs uppercase rounded border border-white/20 cursor-pointer"
                    >
                      <Camera size={14} className="text-[#00BFFF]" />
                      <span>Take Photo / Choose Video</span>
                    </button>
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*,video/*" 
                      onChange={handleFileMediaSelect} 
                      className="hidden" 
                    />
                  </div>

                  <form onSubmit={handlePublishClip} className="space-y-4">
                    {/* Platform Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'x', label: '𝕏 / Twitter Post', icon: MessageSquare },
                        { id: 'instagram', label: '📸 Instagram Reel', icon: Camera },
                        { id: 'tiktok', label: '🎵 TikTok Video', icon: Film },
                        { id: 'youtube', label: '▶️ YouTube Short', icon: Video },
                        { id: 'upload', label: '📁 Media Upload', icon: UploadCloud },
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setClipPlatform(p.id as any)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            clipPlatform === p.id 
                              ? 'bg-[#00BFFF] text-black shadow-lg shadow-[#00BFFF]/20 font-black' 
                              : 'bg-black/50 text-white/60 hover:text-white border border-white/10'
                          }`}
                        >
                          <p.icon size={13} />
                          <span className="truncate">{p.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Column: Title & Link */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-mono text-white/70 uppercase font-black block mb-1">
                            Highlight Headline / Title *
                          </label>
                          <input 
                            type="text"
                            required
                            value={clipTitle}
                            onChange={(e) => setClipTitle(e.target.value)}
                            placeholder="e.g. ⚡ 54-yard Touchdown Catch by #7 in 2nd Quarter"
                            className="w-full bg-black border border-white/20 rounded px-3 py-2 text-xs font-sans text-white focus:border-[#00BFFF] outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-white/70 uppercase font-black block mb-1">
                            {clipPlatform === 'upload' ? 'Media File URL or Selected Image' : `${clipPlatform.toUpperCase()} Post / Video Link URL`}
                          </label>
                          <input 
                            type="text"
                            value={clipUrl}
                            onChange={(e) => {
                              setClipUrl(e.target.value);
                              if (!clipMediaUrl && (e.target.value.includes('.jpg') || e.target.value.includes('.png') || e.target.value.includes('unsplash'))) {
                                setClipMediaUrl(e.target.value);
                              }
                            }}
                            placeholder={
                              clipPlatform === 'x' ? 'https://x.com/yourhandle/status/123456789' :
                              clipPlatform === 'instagram' ? 'https://www.instagram.com/reel/C...' :
                              clipPlatform === 'tiktok' ? 'https://www.tiktok.com/@handle/video/123...' :
                              clipPlatform === 'youtube' ? 'https://youtube.com/shorts/...' : 'Direct Image / Video URL'
                            }
                            className="w-full bg-black border border-white/20 rounded px-3 py-2 text-xs font-mono text-white focus:border-[#00BFFF] outline-none"
                          />
                        </div>

                        {/* Direct Photo Camera or Image Upload */}
                        <div>
                          <label className="text-[11px] font-mono text-white/70 uppercase font-black block mb-1">
                            📸 Camera Snapshot or Image File
                          </label>
                          <input 
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={fileInputRef}
                            onChange={handleFileSelectForClip}
                            className="hidden"
                            id="sideline-photo-capture-input"
                          />
                          {clipImageFilePreview ? (
                            <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-[#00BFFF]/60 bg-black mb-2">
                              <img 
                                src={clipImageFilePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setClipImageFilePreview('');
                                  setClipMediaUrl('');
                                  if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                              >
                                <X size={14} />
                              </button>
                              <div className="absolute bottom-1.5 left-2 bg-black/80 text-[#00BFFF] px-2 py-0.5 rounded text-[10px] font-mono">
                                ✓ Compressed for Live Broadcast
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-2.5 px-3 bg-white/5 hover:bg-[#00BFFF]/10 border border-dashed border-white/20 hover:border-[#00BFFF]/50 rounded text-xs font-display font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                            >
                              <Camera size={16} className="text-[#00BFFF]" />
                              <span>Take Photo with Phone / Pick File</span>
                            </button>
                          )}
                        </div>

                        {/* Direct Photo or Thumbnail link */}
                        <div>
                          <label className="text-[11px] font-mono text-white/70 uppercase font-black block mb-1">
                            Or Direct Image / Thumbnail URL (Optional)
                          </label>
                          <input 
                            type="text"
                            value={clipMediaUrl}
                            onChange={(e) => setClipMediaUrl(e.target.value)}
                            placeholder="https://... (Or use the camera button above)"
                            className="w-full bg-black border border-white/20 rounded px-3 py-2 text-xs font-mono text-white focus:border-[#00BFFF] outline-none"
                          />
                        </div>
                      </div>

                      {/* Right Column: Caption, Tags & Team */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-mono text-white/70 uppercase font-black block mb-1">Associated Team</label>
                            <select
                              value={clipTeam}
                              onChange={(e) => setClipTeam(e.target.value as any)}
                              className="w-full bg-black border border-white/20 rounded px-2.5 py-1.5 text-xs text-white outline-none"
                            >
                              <option value="neutral">Game Sideline / Both</option>
                              <option value="home">{activeGame.homeTeam.shortName} (Home)</option>
                              <option value="away">{activeGame.awayTeam.shortName} (Away)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-mono text-white/70 uppercase font-black block mb-1">Media Type</label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setClipType('video')}
                                className={`flex-1 py-1.5 text-xs font-display font-black rounded uppercase cursor-pointer ${
                                  clipType === 'video' ? 'bg-[#00BFFF] text-black' : 'bg-black border border-white/10 text-white/60'
                                }`}
                              >
                                Video
                              </button>
                              <button
                                type="button"
                                onClick={() => setClipType('photo')}
                                className={`flex-1 py-1.5 text-xs font-display font-black rounded uppercase cursor-pointer ${
                                  clipType === 'photo' ? 'bg-[#00BFFF] text-black' : 'bg-black border border-white/10 text-white/60'
                                }`}
                              >
                                Photo
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-mono text-white/70 uppercase font-black">Caption / Description</label>
                            <button
                              type="button"
                              onClick={copySocialCaption}
                              className="text-[10px] font-mono text-[#00BFFF] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCaption ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                              <span>{copiedCaption ? 'COPIED TO CLIPBOARD!' : 'COPY PREPARED SOCIAL CAPTION'}</span>
                            </button>
                          </div>
                          <textarea 
                            rows={2}
                            value={clipCaption}
                            onChange={(e) => setClipCaption(e.target.value)}
                            placeholder="Add commentary or tag the athletes involved..."
                            className="w-full bg-black border border-white/20 rounded px-3 py-1.5 text-xs text-white focus:border-[#00BFFF] outline-none"
                          />

                          {/* Quick 1-Tap Hashtag Presets to increase views */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {[
                              '#INHighSchoolFootball',
                              '#FridayNightLights',
                              '#INDMedia',
                              activeGame.id.includes('lawrence') ? '#LNWFootball' : '#FWArchers',
                              activeGame.id.includes('lawrence') ? '#BrownsburgBulldogs' : '#MarionGiants',
                              '👉 Track live at indsportsmedia.com'
                            ].map(tag => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => appendTag(tag)}
                                className="text-[10px] font-mono bg-white/5 hover:bg-white/10 text-white/70 px-2 py-0.5 rounded border border-white/10 transition-colors cursor-pointer"
                              >
                                + {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-white/10">
                      <div className="text-[11px] font-sans text-white/50 flex items-center gap-1.5">
                        <Globe size={13} className="text-emerald-400" />
                        <span>Highlights immediately sync to the public Live Scoreboard & Highlights reel for all fans.</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={copySocialCaption}
                          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-display font-black text-xs uppercase rounded cursor-pointer flex items-center gap-1.5"
                        >
                          <Copy size={14} />
                          {copiedCaption ? 'CAPTION COPIED!' : 'COPY FOR PHONE SOCIAL APP'}
                        </button>

                        <button
                          type="submit"
                          disabled={isPostingClip}
                          className="px-6 py-2 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase rounded cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#00BFFF]/30 active:scale-95 transition-all"
                        >
                          <Sparkles size={14} />
                          {isPostingClip ? 'BROADCASTING...' : '🚀 BROADCAST CLIP LIVE TO WEBSITE'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* MAIN PUBLIC SCOREBOARD DISPLAY (Broadcast Grade) */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-b from-[#141414] to-[#0d0d0d] border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl mb-8 relative overflow-hidden">
          
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
        {/* TABBED INTERFACE: LIVE HIGHLIGHTS / BOX SCORE / STATS */}
        {/* ========================================================================= */}
        <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 bg-[#161616]">
            <button
              onClick={() => setActiveTab('highlights')}
              className={`flex-1 py-4 text-xs sm:text-sm font-display font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'highlights' 
                  ? 'bg-[#121212] text-[#00BFFF] border-b-2 border-[#00BFFF]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={16} /> 
              <span>LIVE CLIPS & SOCIAL STREAM</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00BFFF]/20 text-[#00BFFF]">
                {currentClips.length}
              </span>
            </button>
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

            {/* 1. LIVE HIGHLIGHTS & SOCIAL STREAM TAB (Strategy B) */}
            {activeTab === 'highlights' && (
              <div>
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <h4 className="text-xs font-mono font-black uppercase tracking-widest text-[#00BFFF] flex items-center gap-2 mb-1">
                      <Film size={14} /> REAL-TIME SIDELINE HIGHLIGHTS & REELS
                    </h4>
                    <p className="text-white/50 text-xs font-sans">
                      Uploaded live from the stadium stands by IND Sports Media sideline operators.
                    </p>
                  </div>

                  {/* Filter by Team */}
                  <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-white/10">
                    <button
                      onClick={() => setClipFilter('all')}
                      className={`px-3 py-1 rounded text-xs font-display font-black uppercase transition-all cursor-pointer ${
                        clipFilter === 'all' ? 'bg-[#00BFFF] text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      All Clips
                    </button>
                    <button
                      onClick={() => setClipFilter('home')}
                      className={`px-3 py-1 rounded text-xs font-display font-black uppercase transition-all cursor-pointer ${
                        clipFilter === 'home' ? 'bg-[#00BFFF] text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {activeGame.homeTeam.shortName}
                    </button>
                    <button
                      onClick={() => setClipFilter('away')}
                      className={`px-3 py-1 rounded text-xs font-display font-black uppercase transition-all cursor-pointer ${
                        clipFilter === 'away' ? 'bg-[#00BFFF] text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {activeGame.awayTeam.shortName}
                    </button>
                  </div>
                </div>

                {filteredClips.length === 0 ? (
                  <div className="text-center py-16 bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
                    <Video size={36} className="text-white/20 mx-auto mb-3" />
                    <h5 className="font-display font-black uppercase text-sm text-white/60 mb-1">No highlights uploaded for this filter yet</h5>
                    <p className="text-xs text-white/40 max-w-sm mx-auto">
                      Sideline staff will post live video clips, photos, and social reels during game action.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClips.map((clip) => {
                      const isHome = clip.team === 'home';
                      const isAway = clip.team === 'away';
                      const teamTag = isHome ? activeGame.homeTeam.shortName : isAway ? activeGame.awayTeam.shortName : 'Game Atmosphere';

                      return (
                        <div 
                          key={clip.id}
                          className="bg-[#181818] border border-white/10 hover:border-[#00BFFF]/40 rounded-xl overflow-hidden shadow-xl transition-all flex flex-col group"
                        >
                          {/* Media Preview Area */}
                          <div className="relative aspect-video bg-black overflow-hidden cursor-pointer" onClick={() => setPreviewMediaModal(clip)}>
                            <img 
                              src={clip.mediaUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'} 
                              alt={clip.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* Play Button Overlay for Videos */}
                            {clip.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-12 h-12 rounded-full bg-[#00BFFF]/90 text-black flex items-center justify-center shadow-lg shadow-[#00BFFF]/50 group-hover:scale-110 transition-transform">
                                  <Play size={20} className="fill-black ml-0.5" />
                                </div>
                              </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-black tracking-wider shadow ${
                                isHome ? 'bg-red-600 text-white' : isAway ? 'bg-purple-600 text-white' : 'bg-[#00BFFF] text-black'
                              }`}>
                                {teamTag}
                              </span>
                              <span className="text-[10px] font-mono bg-black/80 text-white/80 px-2 py-0.5 rounded border border-white/20">
                                {clip.time}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3 z-10">
                              <span className="text-[10px] font-display font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-white/90 border border-white/20 flex items-center gap-1">
                                {clip.platform === 'x' && '𝕏 Post'}
                                {clip.platform === 'instagram' && '📸 IG Reel'}
                                {clip.platform === 'tiktok' && '🎵 TikTok'}
                                {clip.platform === 'youtube' && '▶️ YT Short'}
                                {clip.platform === 'upload' && '⚡ 4K Sideline'}
                              </span>
                            </div>
                          </div>

                          {/* Info Area */}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h5 className="font-display font-black uppercase text-sm text-white tracking-wide mb-1.5 group-hover:text-[#00BFFF] transition-colors line-clamp-2">
                                {clip.title}
                              </h5>
                              <p className="text-white/60 text-xs font-sans line-clamp-2 mb-3">
                                {clip.caption || 'Live sideline capture from tonight\'s matchup.'}
                              </p>
                            </div>

                            {/* Footer Interaction Bar */}
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                {/* Like / Fire Reaction */}
                                <button
                                  onClick={() => handleLikeClip(clip.id)}
                                  className={`flex items-center gap-1 font-mono cursor-pointer transition-colors ${
                                    likedClips[clip.id] ? 'text-red-400 font-bold' : 'text-white/60 hover:text-red-400'
                                  }`}
                                >
                                  <Heart size={14} className={likedClips[clip.id] ? 'fill-red-400' : ''} />
                                  <span>{clip.likes}</span>
                                </button>

                                {/* Staff author */}
                                <span className="text-[11px] font-mono text-white/40 truncate max-w-[110px]">
                                  {clip.author}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {clip.url && (
                                  <a
                                    href={clip.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
                                    title="Open Original Social Post"
                                  >
                                    <ExternalLink size={13} />
                                  </a>
                                )}

                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(clip.url || window.location.href);
                                    alert('Link copied to clipboard! Share on social media.');
                                  }}
                                  className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors cursor-pointer"
                                  title="Share clip"
                                >
                                  <Share2 size={13} />
                                </button>

                                {isAuthorized && (
                                  <button
                                    onClick={() => handleDeleteClip(clip.id)}
                                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 rounded transition-colors cursor-pointer"
                                    title="Delete clip (staff only)"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. BOX SCORE BREAKDOWN */}
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

            {/* 3. TEAM STAT COMPARISON */}
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
      {/* MEDIA PREVIEW / LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewMediaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setPreviewMediaModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-white/20 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewMediaModal(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/80 text-white/80 hover:text-white flex items-center justify-center border border-white/20 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="aspect-video bg-black relative flex items-center justify-center">
                <img 
                  src={previewMediaModal.mediaUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'} 
                  alt={previewMediaModal.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-xs font-mono text-[#00BFFF] uppercase font-bold tracking-wider">
                    {previewMediaModal.time} • {previewMediaModal.platform.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-white/50">{previewMediaModal.author}</span>
                </div>
                <h4 className="font-display font-black uppercase text-lg text-white mb-2">
                  {previewMediaModal.title}
                </h4>
                <p className="text-white/70 text-sm font-sans mb-4">
                  {previewMediaModal.caption}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleLikeClip(previewMediaModal.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white font-display font-black text-xs uppercase cursor-pointer"
                  >
                    <Heart size={15} className={likedClips[previewMediaModal.id] ? 'fill-red-400 text-red-400' : ''} />
                    <span>{previewMediaModal.likes} LIKES</span>
                  </button>

                  {previewMediaModal.url && (
                    <a
                      href={previewMediaModal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-black text-xs uppercase transition-all"
                    >
                      <span>VIEW ON {previewMediaModal.platform.toUpperCase()}</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                Enter PIN number to unlock score, clock & sideline media broadcasting.
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
