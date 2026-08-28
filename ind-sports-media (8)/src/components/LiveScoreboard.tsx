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
  uploadPhotoToFirestore,
  uploadMediaFile,
  uploadBase64Image
} from '../lib/firebase';
import type { PlayEvent, SocialClip, GameState } from '../types';

export type { PlayEvent, SocialClip, GameState };

export const DEFAULT_GAMES_LIST: GameState[] = [
  // =========================================================================
  // THIS WEEK: WEEK 2 LIVE MARQUEE SHOWCASES (7:00 PM FRIDAY)
  // =========================================================================
  {
    id: 'franklin-central-vs-roncalli-2026',
    sport: 'Varsity Football',
    title: 'Southside Indianapolis Rivalry Showdown',
    venue: 'Bob Tully Field at Roncalli • Indianapolis, IN',
    dateString: 'Friday, Aug 29 • 7:00 PM',
    week: 'Week 2',
    season: '2025-26 Season',
    isArchived: false,
    isLive: true,
    statusText: 'LIVE - 1ST QTR',
    quarter: '1st Qtr',
    clock: '08:45',
    homeTeam: {
      name: 'Roncalli Royals',
      shortName: 'Roncalli',
      mascot: 'Royals',
      record: '1-0',
      color: '#990000',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=300&q=80',
      score: 7,
      qScores: [7, 0, 0, 0, 0],
      stats: {
        passingYds: 68,
        rushingYds: 45,
        firstDowns: 5,
        turnovers: 0,
        penalties: '1-5'
      }
    },
    awayTeam: {
      name: 'Franklin Central Flashes',
      shortName: 'Franklin Central',
      mascot: 'Flashes',
      record: '1-0',
      color: '#00205B',
      textColor: '#FFC72C',
      logoUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=300&q=80',
      score: 3,
      qScores: [3, 0, 0, 0, 0],
      stats: {
        passingYds: 42,
        rushingYds: 31,
        firstDowns: 3,
        turnovers: 0,
        penalties: '2-10'
      }
    },
    possession: 'home',
    down: '2nd',
    distance: '6',
    ballOn: 'FC 38',
    redZone: false,
    lastPlay: 'Royals QB keeper up the middle for 5 yards to the Flashes 38 yard line.',
    plays: [
      {
        id: 'p-fc-1',
        time: '10:14',
        quarter: '1st Qtr',
        team: 'away',
        teamName: 'Franklin Central',
        text: '37-yard Field Goal is GOOD by Franklin Central kicker.',
        isScoring: true,
        scoreChange: '+3 FG',
        downInfo: '4th & 7 at RNC 20'
      },
      {
        id: 'p-rnc-1',
        time: '09:02',
        quarter: '1st Qtr',
        team: 'home',
        teamName: 'Roncalli',
        text: 'TOUCHDOWN Roncalli! 44-yard deep post pass to the end zone! PAT Good.',
        isScoring: true,
        scoreChange: '+6 TD, +1 PAT',
        downInfo: '2nd & 8 at FC 44'
      }
    ],
    socialClips: [
      {
        id: 'clip-roncalli-1',
        platform: 'upload',
        type: 'photo',
        title: '📸 Bob Tully Field Packed Student Section & Coin Toss',
        author: 'Brandon Blume (IND Field Staff)',
        mediaUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        caption: 'Electric atmosphere at Roncalli for tonight\'s Southside rivalry showdown! #INDMedia #FridayNightLights',
        time: '1st Qtr • 11:50',
        team: 'home',
        likes: 48,
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'center-grove-vs-carroll-2026',
    sport: 'Varsity Football',
    title: 'Class 6A State Contender Feature',
    venue: 'Ray Skillman Stadium at Center Grove • Greenwood, IN',
    dateString: 'Friday, Aug 29 • 7:00 PM',
    week: 'Week 2',
    season: '2025-26 Season',
    isArchived: false,
    isLive: true,
    statusText: 'LIVE - 2ND QTR',
    quarter: '2nd Qtr',
    clock: '05:30',
    homeTeam: {
      name: 'Center Grove Trojans',
      shortName: 'Center Grove',
      mascot: 'Trojans',
      record: '1-0',
      color: '#C8102E',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=300&q=80',
      score: 14,
      qScores: [7, 7, 0, 0, 0],
      stats: {
        passingYds: 112,
        rushingYds: 135,
        firstDowns: 9,
        turnovers: 0,
        penalties: '1-5'
      }
    },
    awayTeam: {
      name: 'Carroll Chargers',
      shortName: 'Carroll (FW)',
      mascot: 'Chargers',
      record: '1-0',
      color: '#0033A0',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80',
      score: 10,
      qScores: [3, 7, 0, 0, 0],
      stats: {
        passingYds: 94,
        rushingYds: 48,
        firstDowns: 6,
        turnovers: 1,
        penalties: '3-15'
      }
    },
    possession: 'home',
    down: '1st',
    distance: '10',
    ballOn: 'CG 45',
    redZone: false,
    lastPlay: 'Trojans power rush off left tackle for a gain of 12 yards and a first down.',
    plays: [
      {
        id: 'p-cg-1',
        time: '07:20',
        quarter: '1st Qtr',
        team: 'away',
        teamName: 'Carroll',
        text: 'Carroll 32-yd Field Goal is through the uprights.',
        isScoring: true,
        scoreChange: '+3 FG',
        downInfo: '4th & 4 at CG 15'
      },
      {
        id: 'p-cg-2',
        time: '02:15',
        quarter: '1st Qtr',
        team: 'home',
        teamName: 'Center Grove',
        text: 'TOUCHDOWN Center Grove! 6-yard rushing TD by Trojans RB. PAT Good.',
        isScoring: true,
        scoreChange: '+6 TD, +1 PAT',
        downInfo: '2nd & Goal at CRR 6'
      },
      {
        id: 'p-cg-3',
        time: '08:40',
        quarter: '2nd Qtr',
        team: 'away',
        teamName: 'Carroll',
        text: 'TOUCHDOWN Carroll! 28-yard TD completion down the right sideline! PAT Good.',
        isScoring: true,
        scoreChange: '+6 TD, +1 PAT',
        downInfo: '3rd & 5 at CG 28'
      },
      {
        id: 'p-cg-4',
        time: '06:12',
        quarter: '2nd Qtr',
        team: 'home',
        teamName: 'Center Grove',
        text: 'TOUCHDOWN Center Grove! 19-yard play-action pass to the tight end! PAT Good.',
        isScoring: true,
        scoreChange: '+6 TD, +1 PAT',
        downInfo: '1st & 10 at CRR 19'
      }
    ],
    socialClips: []
  },
  {
    id: 'carmel-vs-westfield-2026',
    sport: 'Varsity Football',
    title: 'Hoosier Crossroads Conference Rivalry Clash',
    venue: 'Riverview Health Stadium at Westfield • Westfield, IN',
    dateString: 'Friday, Aug 29 • 7:00 PM',
    week: 'Week 2',
    season: '2025-26 Season',
    isArchived: false,
    isLive: true,
    statusText: 'LIVE - 3RD QTR',
    quarter: '3rd Qtr',
    clock: '03:18',
    homeTeam: {
      name: 'Westfield Shamrocks',
      shortName: 'Westfield',
      mascot: 'Shamrocks',
      record: '1-0',
      color: '#00843D',
      textColor: '#FFD100',
      logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80',
      score: 21,
      qScores: [7, 7, 7, 0, 0],
      stats: {
        passingYds: 145,
        rushingYds: 118,
        firstDowns: 11,
        turnovers: 0,
        penalties: '2-10'
      }
    },
    awayTeam: {
      name: 'Carmel Greyhounds',
      shortName: 'Carmel',
      mascot: 'Greyhounds',
      record: '1-0',
      color: '#002D62',
      textColor: '#FFD100',
      logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80',
      score: 17,
      qScores: [3, 7, 7, 0, 0],
      stats: {
        passingYds: 160,
        rushingYds: 72,
        firstDowns: 10,
        turnovers: 1,
        penalties: '3-25'
      }
    },
    possession: 'away',
    down: '3rd',
    distance: '4',
    ballOn: 'WST 34',
    redZone: false,
    lastPlay: 'Greyhounds slant pass complete for 8 yards into Shamrocks territory.',
    plays: [
      { id: 'p-cw-1', time: '08:11', quarter: '1st Qtr', team: 'away', teamName: 'Carmel', text: 'Carmel nails 41-yard FG.', isScoring: true, scoreChange: '+3 FG' },
      { id: 'p-cw-2', time: '03:45', quarter: '1st Qtr', team: 'home', teamName: 'Westfield', text: 'TOUCHDOWN Shamrocks! 14-yard rushing score. PAT Good.', isScoring: true, scoreChange: '+6 TD, +1 PAT' },
      { id: 'p-cw-3', time: '09:30', quarter: '2nd Qtr', team: 'home', teamName: 'Westfield', text: 'TOUCHDOWN Shamrocks! 35-yard deep ball touchdown! PAT Good.', isScoring: true, scoreChange: '+6 TD, +1 PAT' },
      { id: 'p-cw-4', time: '01:05', quarter: '2nd Qtr', team: 'away', teamName: 'Carmel', text: 'TOUCHDOWN Greyhounds! 2-yard dive into endzone with 1:05 left in half. PAT Good.', isScoring: true, scoreChange: '+6 TD, +1 PAT' },
      { id: 'p-cw-5', time: '08:14', quarter: '3rd Qtr', team: 'home', teamName: 'Westfield', text: 'TOUCHDOWN Shamrocks! 52-yard explosive breakaway run! PAT Good.', isScoring: true, scoreChange: '+6 TD, +1 PAT' },
      { id: 'p-cw-6', time: '04:50', quarter: '3rd Qtr', team: 'away', teamName: 'Carmel', text: 'TOUCHDOWN Carmel! 22-yard corner fade touchdown catch! PAT Good.', isScoring: true, scoreChange: '+6 TD, +1 PAT' }
    ],
    socialClips: []
  },

  // =========================================================================
  // WEEK 1 ARCHIVE (SEASON OPENERS - FINAL BOX SCORES)
  // =========================================================================
  {
    id: 'lawrence-north-vs-brownsburg-2026',
    sport: 'Varsity Football',
    title: 'Season Opener Showcase',
    venue: 'Wildcat Stadium • Indianapolis, IN',
    dateString: 'Friday, Aug 22 • Week 1 Final',
    week: 'Week 1',
    season: '2025-26 Season',
    isArchived: true,
    isLive: false,
    statusText: 'FINAL',
    quarter: 'Final',
    clock: '00:00',
    homeTeam: {
      name: 'Lawrence North Wildcats',
      shortName: 'Lawrence North',
      mascot: 'Wildcats',
      record: '0-1',
      color: '#BF1515',
      textColor: '#FFFFFF',
      logoUrl: lawrenceNorthLogo,
      score: 25,
      qScores: [7, 6, 6, 6, 0],
      stats: {
        passingYds: 185,
        rushingYds: 120,
        firstDowns: 14,
        turnovers: 2,
        penalties: '5-40'
      }
    },
    awayTeam: {
      name: 'Brownsburg Bulldogs',
      shortName: 'Brownsburg',
      mascot: 'Bulldogs',
      record: '1-0',
      color: '#4A154B',
      textColor: '#FFFFFF',
      logoUrl: brownsburgLogo,
      score: 42,
      qScores: [14, 14, 7, 7, 0],
      stats: {
        passingYds: 245,
        rushingYds: 180,
        firstDowns: 21,
        turnovers: 1,
        penalties: '3-25'
      }
    },
    possession: 'home',
    down: 'Final',
    distance: 'Score',
    ballOn: 'Final',
    redZone: false,
    lastPlay: 'Brownsburg seals 42-25 season opening victory with goal-line interception.',
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
        caption: 'The energy at Wildcat Stadium is through the roof! #MICshowcase #FridayNightLights',
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
        caption: 'Brownsburg secondary dialed in during 7-on-7 drills. Tag your favorite athlete! #BrownsburgBulldogs #INDMedia',
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
    title: 'Northeast Indiana Kickoff Feature',
    venue: 'South Side Stadium • Fort Wayne, IN',
    dateString: 'Friday, Aug 22 • Week 1 Final',
    week: 'Week 1',
    season: '2025-26 Season',
    isArchived: true,
    isLive: false,
    statusText: 'FINAL',
    quarter: 'Final',
    clock: '00:00',
    homeTeam: {
      name: 'Fort Wayne South Side Archers',
      shortName: 'South Side (FW)',
      mascot: 'Archers',
      record: '0-1',
      color: '#0F5132',
      textColor: '#FFFFFF',
      logoUrl: southsideLogo,
      score: 14,
      qScores: [0, 7, 7, 0, 0],
      stats: {
        passingYds: 120,
        rushingYds: 95,
        firstDowns: 11,
        turnovers: 2,
        penalties: '4-30'
      }
    },
    awayTeam: {
      name: 'Marion Giants',
      shortName: 'Marion',
      mascot: 'Giants',
      record: '1-0',
      color: '#4A154B',
      textColor: '#FFFFFF',
      logoUrl: marionLogo,
      score: 28,
      qScores: [7, 7, 7, 7, 0],
      stats: {
        passingYds: 165,
        rushingYds: 145,
        firstDowns: 16,
        turnovers: 0,
        penalties: '2-15'
      }
    },
    possession: 'home',
    down: 'Final',
    distance: 'Score',
    ballOn: 'Final',
    redZone: false,
    lastPlay: 'Marion Giants claim Week 1 opening victory on the road.',
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
        caption: 'Fort Wayne was electric! #FWArchers #MarionGiants',
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
      const saved = localStorage.getItem('ind_live_scoreboard_games_v3');
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

  // In-Stands Frictionless 2-Step Story Uploader State
  const [storyMedia, setStoryMedia] = useState<{ url: string; type: 'photo' | 'video'; file?: File } | null>(null);
  const [storyCaption, setStoryCaption] = useState('');
  const [storyTeam, setStoryTeam] = useState<'home' | 'away' | 'neutral'>('neutral');
  const [isPostingStory, setIsPostingStory] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [clipFilter, setClipFilter] = useState<'all' | 'home' | 'away'>('all');
  const [previewMediaModal, setPreviewMediaModal] = useState<SocialClip | null>(null);
  const [likedClips, setLikedClips] = useState<Record<string, boolean>>({});
  
  // Week & Season Archive Filtering (Default to Week 2 Live)
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('Week 2');

  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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
            localStorage.setItem('ind_live_scoreboard_games_v3', JSON.stringify(updated));
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
            localStorage.setItem('ind_live_scoreboard_games_v3', JSON.stringify(updated));
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
      localStorage.setItem('ind_live_scoreboard_games_v3', JSON.stringify(next));
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

  // Matchup-specific dynamic hashtags generator
  const getMatchupHashtags = () => {
    const homeTag = `#${activeGame.homeTeam.name.replace(/[^a-zA-Z0-9]/g, '')}`;
    const awayTag = `#${activeGame.awayTeam.name.replace(/[^a-zA-Z0-9]/g, '')}`;
    const homeShortTag = `#${activeGame.homeTeam.shortName.replace(/[^a-zA-Z0-9]/g, '')}`;
    const awayShortTag = `#${activeGame.awayTeam.shortName.replace(/[^a-zA-Z0-9]/g, '')}`;
    return `${homeTag} ${awayTag} ${homeShortTag}vs${awayShortTag} #IHSAA #FridayNightLights #INDSportsMedia`;
  };

  // Step 1: Handle native camera capture or gallery selection
  const handleMediaCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    try {
      if (isVideo) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setStoryMedia({
            url: event.target?.result as string,
            type: 'video',
            file
          });
        };
        reader.readAsDataURL(file);
      } else {
        // Compress image client-side before preview/upload
        const compressedDataUrl = await compressImageFile(file, 1400, 0.85);
        setStoryMedia({
          url: compressedDataUrl,
          type: 'photo',
          file
        });
      }
    } catch (err) {
      console.error('Error processing media:', err);
      alert('Unable to load photo from device.');
    }
  };

  // Step 2: Publish Instagram-story style highlight with automatic pre-set matchup hashtags
  const handlePublishStory = async () => {
    if (!storyMedia) return;

    setIsPostingStory(true);
    setUploadProgress(10);
    try {
      let finalStorageUrl = storyMedia.url;

      // 1. Upload to Firebase Cloud Storage bucket to get permanent download URL
      if (storyMedia.file) {
        try {
          finalStorageUrl = await uploadMediaFile(
            storyMedia.file,
            storyMedia.type === 'video' ? 'videos' : 'highlights',
            (pct) => setUploadProgress(Math.min(95, pct))
          );
        } catch (storageErr) {
          console.warn('Direct file storage upload fell back:', storageErr);
          // If file upload failed, try base64 if available or keep dataUrl
          if (storyMedia.url.startsWith('data:')) {
            finalStorageUrl = await uploadBase64Image(storyMedia.url, 'highlights', (pct) => setUploadProgress(pct));
          }
        }
      } else if (storyMedia.url.startsWith('data:')) {
        finalStorageUrl = await uploadBase64Image(storyMedia.url, 'highlights', (pct) => setUploadProgress(pct));
      }

      setUploadProgress(98);

      const autoTags = getMatchupHashtags();
      const userText = storyCaption.trim();
      const fullCaption = userText ? `${userText}\n\n${autoTags}` : autoTags;
      const headline = userText.length > 0 
        ? (userText.length > 40 ? userText.slice(0, 40) + '...' : userText)
        : (storyMedia.type === 'video' ? '⚡ Sideline Game Highlight' : '📸 Sideline Photo');

      const newClip: SocialClip = {
        id: `story-${Date.now()}`,
        platform: 'upload',
        type: storyMedia.type,
        title: headline,
        author: 'Brandon Blume (IND Sideline)',
        url: finalStorageUrl,
        mediaUrl: finalStorageUrl,
        caption: fullCaption,
        time: `${activeGame.quarter} • ${activeGame.clock}`,
        team: storyTeam,
        likes: 1,
        createdAt: new Date().toISOString()
      };

      const updatedGame: GameState = {
        ...activeGame,
        socialClips: [newClip, ...(activeGame.socialClips || [])]
      };

      // 2. Broadcast updated game with Storage download URL to Firestore & Server
      await broadcastGameUpdate(updatedGame);

      // 3. Also automatically sync photos to the global Photos Gallery with the Storage download URL
      if (storyMedia.type === 'photo') {
        try {
          await uploadPhotoToFirestore({
            sport: (activeGame.sport.includes('Basketball') ? 'Basketball' : 'Football') as any,
            title: headline,
            match: `${activeGame.homeTeam.name} vs. ${activeGame.awayTeam.name}`,
            photographer: 'Brandon Blume (IND Sideline)',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            src: finalStorageUrl,
            tags: ['Live Game', 'Sideline', activeGame.quarter.replace(' Qtr', '')],
            isLiveGamePhoto: true,
            gameId: activeGame.id,
            createdAt: new Date().toISOString()
          });
        } catch (photoErr) {
          console.warn('Could not sync to global photo gallery:', photoErr);
        }
      }

      setUploadProgress(100);

      // Reset story form
      setTimeout(() => {
        setStoryMedia(null);
        setStoryCaption('');
        setStoryTeam('neutral');
        setUploadProgress(null);
        setActiveTab('highlights');
        alert('🎉 Posted! Your highlight is live with Firebase Cloud Storage hosting.');
      }, 400);

    } catch (err) {
      console.error('Error publishing story highlight:', err);
      alert('Failed to publish highlight. Please check cellular connection.');
    } finally {
      setIsPostingStory(false);
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
        {/* SEASON & WEEK ARCHIVE NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="mb-6 bg-[#121212] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00BFFF] flex items-center gap-2">
                <Radio size={14} className="text-red-500 animate-pulse" />
                2025-26 Indiana High School Football Hub
              </span>
              <h2 className="text-base sm:text-lg font-black font-display uppercase tracking-tight text-white mt-0.5">
                Season Schedule & Archived Box Scores
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-white/50 flex items-center gap-1">
                <RefreshCw size={11} className={isSyncing ? 'animate-spin text-[#00BFFF]' : ''} />
                Live Sync: {lastSyncTime}
              </span>
            </div>
          </div>

          {/* Week Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'ALL', label: 'All Matchups & Archives', count: games.length },
              { id: 'Week 2', label: '⚡ Week 2 (This Week • Marquee Live)', count: games.filter(g => (g.week || '').includes('2') || (!g.isArchived && g.isLive)).length },
              { id: 'Week 1', label: '📁 Week 1 (Archived Finals)', count: games.filter(g => (g.week || '').includes('1') || g.isArchived).length },
            ].map(tab => {
              const isActive = selectedWeekFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedWeekFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-display font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#00BFFF] text-black shadow-[0_0_15px_rgba(0,191,255,0.4)] scale-100'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-black font-bold' : 'bg-white/10 text-white/60'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filtered Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {games
              .filter(g => {
                if (selectedWeekFilter === 'ALL') return true;
                if (selectedWeekFilter === 'Week 2') return (g.week || '').includes('2') || (!g.isArchived && g.isLive);
                if (selectedWeekFilter === 'Week 1') return (g.week || '').includes('1') || g.isArchived;
                return true;
              })
              .map((g) => {
                const isSelected = g.id === activeGame.id;
                const isFinal = g.isArchived || g.statusText === 'FINAL' || g.quarter === 'Final';
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGameId(g.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#181818] border-[#00BFFF] shadow-lg shadow-[#00BFFF]/15 ring-2 ring-[#00BFFF]'
                        : 'bg-[#101010] border-white/10 hover:border-white/25 hover:bg-[#141414]'
                    }`}
                  >
                    {/* Top Row: Week Badge & Live/Final Status */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded font-bold uppercase">
                        {g.week || 'Week 3'}
                      </span>
                      {isFinal ? (
                        <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                          FINAL
                        </span>
                      ) : (
                        <span className="bg-red-600/20 border border-red-500/50 text-red-400 px-2 py-0.5 rounded font-black tracking-wider uppercase flex items-center gap-1 animate-pulse">
                          <Radio size={10} className="text-red-500" />
                          {g.quarter || 'LIVE'}
                        </span>
                      )}
                    </div>

                    {/* Middle: Teams & Matchup */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2 overflow-hidden shrink-0">
                        <img 
                          src={g.homeTeam.logoUrl} 
                          alt={g.homeTeam.name} 
                          className="inline-block h-8 w-8 rounded-full object-contain bg-black/60 border border-white/20 p-0.5" 
                        />
                        <img 
                          src={g.awayTeam.logoUrl} 
                          alt={g.awayTeam.name} 
                          className="inline-block h-8 w-8 rounded-full object-contain bg-black/60 border border-white/20 p-0.5" 
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-black text-xs sm:text-sm text-white tracking-wide truncate">
                          {g.homeTeam.shortName} vs {g.awayTeam.shortName}
                        </div>
                        <div className="text-[10px] font-sans text-white/50 truncate">
                          {g.venue}
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Score & Clock */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-0.5">
                      <div className="text-[11px] font-sans text-white/60">
                        {g.dateString}
                      </div>
                      <div className="font-mono font-black text-sm text-white">
                        {g.homeTeam.score} - {g.awayTeam.score}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OPERATOR / SIDELINE CONTROL CONSOLE (Strictly Mobile-First & Focused) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isAuthorized && isAdminOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-[#101010] border-2 border-amber-400/90 rounded-2xl p-4 sm:p-6 shadow-2xl relative space-y-4 text-white">
                
                {/* Operator Header Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-black shrink-0">
                      <Sliders size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black uppercase text-sm sm:text-base text-white tracking-wide">
                          SIDELINE OPERATOR CONTROLLER
                        </h3>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                          LIVE CLOUD SYNC
                        </span>
                      </div>
                      <p className="text-white/50 text-[11px] font-sans">
                        Managing: <strong className="text-white">{activeGame.homeTeam.shortName}</strong> vs <strong className="text-white">{activeGame.awayTeam.shortName}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Header Utility Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={async () => {
                        const testTime = new Date().toLocaleTimeString();
                        try {
                          await broadcastGameUpdate({
                            ...activeGame,
                            lastPlay: `⚡ Firebase live sync ping verified at ${testTime}`
                          });
                          alert(`✅ Firebase test successful!\n\nConnected to project:\npelagic-airline-s1ttq (IND Sports Media)\n\nLive ping synced to all devices!`);
                        } catch (e) {
                          alert(`⚠️ Firebase sync error: ${e}`);
                        }
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono uppercase bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-1.5 rounded cursor-pointer"
                      title="Test cloud ping"
                    >
                      <CloudLightning size={12} /> Ping Live Cloud
                    </button>

                    <button
                      onClick={resetCurrentGame}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-mono uppercase bg-red-950/40 border border-red-800/40 px-2.5 py-1.5 rounded cursor-pointer"
                      title="Reset game to 0-0"
                    >
                      <RotateCcw size={12} /> Reset 0-0
                    </button>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 1. DIRECT INLINE LIVE SCORING CONTROLS (FAST, RELIABLE, NO MODALS) */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  
                  {/* Home Team Card */}
                  <div className="bg-[#181818] border-2 border-emerald-500/50 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between gap-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={activeGame.homeTeam.logoUrl} 
                          alt={activeGame.homeTeam.name} 
                          className="w-12 h-12 rounded-full object-contain bg-black/60 border border-white/20 p-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-display font-black uppercase text-base text-white block truncate">
                            {activeGame.homeTeam.name}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                            HOME TEAM
                          </span>
                        </div>
                      </div>

                      {/* Big Score Digit Display */}
                      <div className="text-right px-4 py-1.5 bg-black/80 border-2 border-emerald-500/60 rounded-xl min-w-[70px]">
                        <span className="font-mono font-black text-4xl text-white block leading-none">
                          {activeGame.homeTeam.score}
                        </span>
                        <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold block mt-0.5">
                          PTS
                        </span>
                      </div>
                    </div>

                    {/* Direct 1-Tap Scoring Buttons Row */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="grid grid-cols-4 gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustScore('home', 6, `Touchdown ${activeGame.homeTeam.shortName} (+6)`)}
                          className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-xs uppercase rounded-lg border border-emerald-400/50 shadow-md cursor-pointer active:scale-95 transition-all text-center"
                        >
                          +6 TD
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('home', 1, `Extra Point ${activeGame.homeTeam.shortName} (+1)`)}
                          className="py-2.5 bg-white/10 hover:bg-emerald-700 text-white font-display font-black text-xs uppercase rounded-lg border border-white/15 cursor-pointer active:scale-95 transition-all text-center"
                        >
                          +1 PAT
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('home', 2, `2-Pt Conversion ${activeGame.homeTeam.shortName} (+2)`)}
                          className="py-2.5 bg-white/10 hover:bg-emerald-700 text-white font-display font-black text-xs uppercase rounded-lg border border-white/15 cursor-pointer active:scale-95 transition-all text-center"
                        >
                          +2 2PT
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('home', 3, `Field Goal ${activeGame.homeTeam.shortName} (+3)`)}
                          className="py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-display font-black text-xs uppercase rounded-lg border border-emerald-400/30 cursor-pointer active:scale-95 transition-all text-center"
                        >
                          +3 FG
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustScore('home', 2, `Safety ${activeGame.homeTeam.shortName} (+2)`)}
                          className="py-2 bg-white/5 hover:bg-emerald-800 text-white/80 hover:text-white font-display font-bold text-xs uppercase rounded-md border border-white/10 cursor-pointer active:scale-95"
                        >
                          +2 Safety
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('home', -1, `Correction: -1 pt for ${activeGame.homeTeam.shortName}`)}
                          className="py-2 bg-red-950/40 hover:bg-red-900 text-red-300 font-display font-bold text-xs uppercase rounded-md border border-red-800/40 cursor-pointer active:scale-95"
                        >
                          ↺ -1 Undo
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('home', -6, `Correction: -6 TD for ${activeGame.homeTeam.shortName}`)}
                          className="py-2 bg-red-950/40 hover:bg-red-900 text-red-300 font-display font-bold text-xs uppercase rounded-md border border-red-800/40 cursor-pointer active:scale-95"
                        >
                          ↺ -6 TD
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Away Team Card */}
                  <div className="bg-[#181818] border-2 border-purple-500/50 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between gap-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={activeGame.awayTeam.logoUrl} 
                          alt={activeGame.awayTeam.name} 
                          className="w-12 h-12 rounded-full object-contain bg-black/60 border border-white/20 p-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-display font-black uppercase text-base text-white block truncate">
                            {activeGame.awayTeam.name}
                          </span>
                          <span className="text-[11px] font-mono text-purple-400 uppercase font-bold">
                            AWAY TEAM
                          </span>
                        </div>
                      </div>

                      {/* Big Score Digit Display */}
                      <div className="text-right px-4 py-1.5 bg-black/80 border-2 border-purple-500/60 rounded-xl min-w-[70px]">
                        <span className="font-mono font-black text-4xl text-white block leading-none">
                          {activeGame.awayTeam.score}
                        </span>
                        <span className="text-[9px] font-mono uppercase text-purple-400 font-bold block mt-0.5">
                          PTS
                        </span>
                      </div>
                    </div>

                    {/* Direct 1-Tap Scoring Buttons Row */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="grid grid-cols-4 gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustScore('away', 6, `Touchdown ${activeGame.awayTeam.shortName} (+6)`)}
                          className="py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-display font-black text-xs uppercase rounded-lg border border-purple-400/50 shadow-md cursor-pointer active:scale-95 transition-all text-center"
                        >
                          +6 TD
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('away', 1, `Extra Point ${activeGame.awayTeam.shortName} (+1)`)}
                          className="py-2.5 bg-white/10 hover:bg-purple-700 text-white font-display font-black text-xs uppercase rounded-lg border border-white/15 cursor-pointer active:scale-95 transition-all text-center"
                        >
                          +1 PAT
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('away', 2, `2-Pt Conversion ${activeGame.awayTeam.shortName} (+2)`)}
                          className="py-2.5 bg-white/10 hover:bg-purple-700 text-white font-display font-black text-xs uppercase rounded-lg border border-white/15 cursor-pointer active:scale-95 transition-all text-center"
                        >
                          +2 2PT
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('away', 3, `Field Goal ${activeGame.awayTeam.shortName} (+3)`)}
                          className="py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-display font-black text-xs uppercase rounded-lg border border-purple-400/30 cursor-pointer active:scale-95 transition-all text-center"
                        >
                          +3 FG
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustScore('away', 2, `Safety ${activeGame.awayTeam.shortName} (+2)`)}
                          className="py-2 bg-white/5 hover:bg-purple-800 text-white/80 hover:text-white font-display font-bold text-xs uppercase rounded-md border border-white/10 cursor-pointer active:scale-95"
                        >
                          +2 Safety
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('away', -1, `Correction: -1 pt for ${activeGame.awayTeam.shortName}`)}
                          className="py-2 bg-red-950/40 hover:bg-red-900 text-red-300 font-display font-bold text-xs uppercase rounded-md border border-red-800/40 cursor-pointer active:scale-95"
                        >
                          ↺ -1 Undo
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustScore('away', -6, `Correction: -6 TD for ${activeGame.awayTeam.shortName}`)}
                          className="py-2 bg-red-950/40 hover:bg-red-900 text-red-300 font-display font-bold text-xs uppercase rounded-md border border-red-800/40 cursor-pointer active:scale-95"
                        >
                          ↺ -6 TD
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ========================================================================= */}
                {/* 2. GAME CLOCK & PERIOD CONTROLLER (CENTRAL FOCUS) */}
                {/* ========================================================================= */}
                <div className="bg-[#161616] p-4 rounded-xl border border-white/10 space-y-3">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    
                    {/* Big Digital Game Clock & Start/Stop Button */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-mono text-white/60 uppercase font-black flex items-center gap-1.5">
                          <Clock size={13} className="text-[#00BFFF]" />
                          Game Clock
                        </label>
                        <span className="text-[10px] font-mono text-white/40">
                          {isClockRunning ? '⏱️ Running' : '⏸️ Paused'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={activeGame.clock}
                          onChange={(e) => updateGameField({ clock: e.target.value })}
                          className="w-28 bg-black border-2 border-white/20 rounded-xl px-3 py-2.5 text-center font-mono font-black text-white text-xl focus:border-[#00BFFF] outline-none shadow-inner"
                        />

                        <button
                          onClick={() => {
                            const nextState = !isClockRunning;
                            setIsClockRunning(nextState);
                            if (nextState) updateGameField({ isLive: true });
                          }}
                          className={`flex-1 py-3 px-4 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                            isClockRunning 
                              ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-900/30' 
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                          }`}
                        >
                          <Play size={15} className={isClockRunning ? 'fill-black' : 'fill-white'} />
                          <span>{isClockRunning ? 'PAUSE CLOCK' : 'START CLOCK'}</span>
                        </button>
                      </div>

                      {/* Fast Clock Adjuster Chips */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {[
                          { label: '+1m', delta: 60 },
                          { label: '-1m', delta: -60 },
                          { label: '+10s', delta: 10 },
                          { label: '-10s', delta: -10 },
                          { label: '12:00', set: '12:00' },
                          { label: '0:00', set: '00:00' },
                        ].map((btn, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (btn.set) {
                                updateGameField({ clock: btn.set });
                                return;
                              }
                              const parts = activeGame.clock.split(':');
                              let m = parseInt(parts[0], 10) || 0;
                              let s = parseInt(parts[1], 10) || 0;
                              let totalSecs = Math.max(0, m * 60 + s + (btn.delta || 0));
                              const newM = Math.floor(totalSecs / 60);
                              const newS = totalSecs % 60;
                              updateGameField({ 
                                clock: `${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}` 
                              });
                            }}
                            className="flex-1 py-1 text-[11px] font-mono font-bold bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded border border-white/10 cursor-pointer active:scale-95 transition-colors text-center"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quarter / Period Selector */}
                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1.5">
                        Quarter / Period
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {['1st Qtr', '2nd Qtr', 'Halftime', '3rd Qtr', '4th Qtr', 'Final'].map(q => (
                          <button
                            key={q}
                            onClick={() => updateGameField({ quarter: q, statusText: q.toUpperCase(), isLive: q !== 'Final' && q !== 'Pre-Game' })}
                            className={`py-2 text-xs font-display font-black rounded-lg uppercase transition-all cursor-pointer ${
                              activeGame.quarter === q 
                                ? 'bg-[#00BFFF] text-black shadow-md shadow-[#00BFFF]/30 scale-100' 
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/5'
                            }`}
                          >
                            {q.replace(' Qtr', '')}
                          </button>
                        ))}
                      </div>

                      {/* Possession Toggle */}
                      <div className="mt-3">
                        <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">
                          Possession (Ball in Hand)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => updateGameField({ possession: 'home' })}
                            className={`py-2 px-3 rounded-lg text-xs font-display font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              activeGame.possession === 'home' 
                                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30' 
                                : 'bg-white/5 text-white/50 hover:bg-white/10'
                            }`}
                          >
                            <span>🏈 {activeGame.homeTeam.shortName} (Home)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateGameField({ possession: 'away' })}
                            className={`py-2 px-3 rounded-lg text-xs font-display font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              activeGame.possession === 'away' 
                                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30' 
                                : 'bg-white/5 text-white/50 hover:bg-white/10'
                            }`}
                          >
                            <span>🏈 {activeGame.awayTeam.shortName} (Away)</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* ========================================================================= */}
                {/* 3. DOWN & DISTANCE & BALL SPOT (COMPACT 1-TOUCH ROW) */}
                {/* ========================================================================= */}
                <div className="bg-[#161616] p-3.5 rounded-xl border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Down */}
                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">
                        Down
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {['1st', '2nd', '3rd', '4th'].map(d => (
                          <button
                            key={d}
                            onClick={() => updateGameField({ down: d })}
                            className={`py-1.5 text-xs font-display font-black rounded-lg cursor-pointer transition-all ${
                              activeGame.down === d 
                                ? 'bg-[#00BFFF] text-black shadow-md shadow-[#00BFFF]/20' 
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">
                        Distance
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {['10', '5', '2', 'Goal'].map(dist => (
                          <button
                            key={dist}
                            onClick={() => updateGameField({ distance: dist })}
                            className={`py-1.5 text-xs font-display font-black rounded-lg cursor-pointer transition-all ${
                              activeGame.distance === dist 
                                ? 'bg-[#00BFFF] text-black shadow-md shadow-[#00BFFF]/20' 
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            & {dist}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ball Spot */}
                    <div>
                      <label className="text-[11px] font-mono text-white/60 uppercase font-black block mb-1">
                        Ball Spot (Yard Line)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="text" 
                          value={activeGame.ballOn}
                          onChange={(e) => updateGameField({ ballOn: e.target.value })}
                          placeholder="e.g. LN 35"
                          className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-white uppercase focus:border-[#00BFFF] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateGameField({ ballOn: '50 YD' })}
                          className="px-2 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 font-mono text-xs rounded uppercase font-bold"
                        >
                          50
                        </button>
                        <button
                          type="button"
                          onClick={() => updateGameField({ ballOn: 'Red Zone (15 YD)' })}
                          className="px-2 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-xs rounded uppercase font-bold"
                        >
                          RedZone
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 4. FAST PLAY LOGGER (1-LINE STATUS UPDATE) */}
                {/* ========================================================================= */}
                <div className="bg-[#161616] p-3.5 rounded-xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-white/60 uppercase font-black">
                      ⚡ Quick Playcast Log (Broadcasted to Live Feed)
                    </label>
                    <span className="text-[10px] font-mono text-white/40">
                      Current: {activeGame.lastPlay ? activeGame.lastPlay.slice(0, 45) + '...' : 'None'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={activeGame.lastPlay || ''}
                      onChange={(e) => updateGameField({ lastPlay: e.target.value })}
                      placeholder="e.g. 15-yard completion for 1st down to midfield"
                      className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00BFFF] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (activeGame.lastPlay) {
                          const newPlay: PlayEvent = {
                            id: `play-${Date.now()}`,
                            time: activeGame.clock,
                            quarter: activeGame.quarter,
                            team: activeGame.possession || 'home',
                            teamName: activeGame.possession === 'away' ? activeGame.awayTeam.shortName : activeGame.homeTeam.shortName,
                            text: activeGame.lastPlay,
                            isScoring: false,
                            downInfo: `${activeGame.down} & ${activeGame.distance}`
                          };
                          updateGameField({ plays: [newPlay, ...(activeGame.plays || [])] });
                          alert('✓ Play logged to live play-by-play stream!');
                        }
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-[#00BFFF] hover:text-black text-white font-display font-black text-xs uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      Log Play
                    </button>
                  </div>

                  {/* 1-Tap Situation Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      '🏈 Touchdown!',
                      '🛑 Turnover on Downs',
                      '⚡ Interception!',
                      '💥 Fumble Turnover!',
                      '👟 Field Goal Good!',
                      '⏱️ Timeout LN',
                      '⏱️ Timeout BB',
                      '🏁 End of Quarter'
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateGameField({ lastPlay: `${preset} (${activeGame.quarter} • ${activeGame.clock})` })}
                        className="text-[10px] font-mono bg-white/5 hover:bg-white/15 text-white/70 hover:text-white px-2 py-0.5 rounded border border-white/10 transition-colors cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* 5. IN-STANDS SOCIAL & HIGHLIGHTS BROADCASTER (FRICTIONLESS 2-STEP STORY UPLOAD) */}
                {/* ========================================================================= */}
                <div className="bg-[#141414] p-4 sm:p-5 rounded-xl border border-[#00BFFF]/30 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-md">
                        <Camera size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-display font-black uppercase text-white tracking-wide flex items-center gap-2">
                          <span>In-Stands Highlights Story Broadcaster</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/40">
                            2-STEP INSTANT POST
                          </span>
                        </h4>
                        <p className="text-[11px] font-sans text-white/50">
                          Direct camera upload + auto-appended matchup hashtags for {activeGame.homeTeam.shortName} vs {activeGame.awayTeam.shortName}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hidden Native Camera & Gallery Inputs */}
                  <input
                    ref={nativeCameraInputRef}
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleMediaCapture}
                  />
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleMediaCapture}
                  />

                  {/* STEP 1: Direct Native Device Camera Trigger */}
                  {!storyMedia ? (
                    <div className="bg-black/60 border-2 border-dashed border-white/20 hover:border-[#00BFFF]/60 rounded-2xl p-6 sm:p-8 text-center transition-all group">
                      <div className="max-w-md mx-auto space-y-4">
                        <div className="flex justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => nativeCameraInputRef.current?.click()}
                            className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#0090D0] hover:from-[#33c9ff] hover:to-[#00BFFF] text-black font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-[#00BFFF]/30 flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-all"
                          >
                            <Camera size={22} className="shrink-0" />
                            <span>Take Photo / Video</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            title="Upload from photo library"
                            className="px-4 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                          >
                            <UploadCloud size={20} />
                          </button>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-white/50">
                          <span className="flex items-center gap-1">📸 Opens Native Rear Camera</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">⚡ Auto-Compacts for Stadium Data</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* STEP 2: Quick Caption + Auto Matchup Hashtags (Instagram Story Style) */
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        {/* Media Preview Thumbnail */}
                        <div className="md:col-span-4 relative aspect-video md:aspect-[4/3] bg-black rounded-xl overflow-hidden border border-white/20 shadow-inner group">
                          {storyMedia.type === 'video' ? (
                            <video 
                              src={storyMedia.url} 
                              controls 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <img 
                              src={storyMedia.url} 
                              alt="Sideline Capture Preview" 
                              className="w-full h-full object-cover" 
                            />
                          )}

                          <button
                            type="button"
                            onClick={() => setStoryMedia(null)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-white/80 hover:text-white border border-white/20 cursor-pointer shadow-md"
                            title="Retake photo"
                          >
                            <X size={14} />
                          </button>

                          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 font-bold border border-white/10">
                            ✓ {storyMedia.type === 'video' ? 'Video Ready' : 'Compressed & Ready'}
                          </div>
                        </div>

                        {/* Single Text Input & Matchup Team Attribution */}
                        <div className="md:col-span-8 space-y-3">
                          {/* Team Attribution Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-white/60 uppercase font-black">Tag:</span>
                            <div className="flex gap-1.5 flex-1">
                              <button
                                type="button"
                                onClick={() => setStoryTeam('home')}
                                className={`px-2.5 py-1 rounded text-xs font-display font-black uppercase transition-all cursor-pointer ${
                                  storyTeam === 'home' ? 'bg-emerald-500 text-black shadow-md' : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                              >
                                {activeGame.homeTeam.shortName}
                              </button>
                              <button
                                type="button"
                                onClick={() => setStoryTeam('away')}
                                className={`px-2.5 py-1 rounded text-xs font-display font-black uppercase transition-all cursor-pointer ${
                                  storyTeam === 'away' ? 'bg-purple-500 text-white shadow-md' : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                              >
                                {activeGame.awayTeam.shortName}
                              </button>
                              <button
                                type="button"
                                onClick={() => setStoryTeam('neutral')}
                                className={`px-2.5 py-1 rounded text-xs font-display font-black uppercase transition-all cursor-pointer ${
                                  storyTeam === 'neutral' ? 'bg-[#00BFFF] text-black shadow-md' : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                              >
                                Crowd / General
                              </button>
                            </div>
                          </div>

                          {/* Quick Caption Input */}
                          <div>
                            <input
                              type="text"
                              value={storyCaption}
                              onChange={(e) => setStoryCaption(e.target.value)}
                              placeholder="Write a quick caption (e.g. 45-yard bomb to the endzone!)..."
                              autoFocus
                              className="w-full bg-black border border-white/25 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00BFFF] focus:ring-1 focus:ring-[#00BFFF] outline-none shadow-inner"
                            />
                          </div>

                          {/* Auto-Appended Hashtags Preview */}
                          <div className="bg-black/50 border border-white/10 rounded-lg p-2.5">
                            <span className="text-[10px] font-mono text-white/40 block mb-0.5 uppercase tracking-wider">
                              Auto-Appended Matchup Hashtags:
                            </span>
                            <p className="text-xs font-mono text-[#00BFFF] font-semibold tracking-tight">
                              {getMatchupHashtags()}
                            </p>
                          </div>

                          {/* Actions: Retake or Share Story */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setStoryMedia(null)}
                              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-display font-black text-xs uppercase cursor-pointer"
                            >
                              Retake
                            </button>

                            <button
                              type="button"
                              onClick={handlePublishStory}
                              disabled={isPostingStory}
                              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                            >
                              <Sparkles size={16} />
                              <span>{isPostingStory ? `Posting Story ${uploadProgress ? `(${uploadProgress}%)` : '...'}` : 'Post Story to Live Stream'}</span>
                            </button>
                          </div>

                          {/* Cellular Upload Progress Indicator */}
                          {uploadProgress !== null && (
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#00BFFF] h-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

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
