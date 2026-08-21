import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IndLogo } from './IndLogo';
import { 
  Tv, 
  Radio, 
  Volume2, 
  VolumeX, 
  Send, 
  Calendar, 
  Clock, 
  Bell, 
  BellRing, 
  Share2, 
  Users, 
  Flame, 
  Sparkles, 
  Shield, 
  CheckCircle2, 
  Cpu, 
  Info,
  ChevronRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface Game {
  id: string;
  isLive: boolean;
  sport: 'Football' | '7v7 Football' | 'Basketball' | 'Soccer';
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  description: string;
  timeString: string;
  venue: string;
  videoUrl: string;
  stats: {
    homeScore: number;
    awayScore: number;
    quarter?: string;
    timeLeft?: string;
    possession?: 'home' | 'away';
    downDistance?: string;
    passingYds: { home: number; away: number };
    rushingYds: { home: number; away: number };
    turnovers: { home: number; away: number };
  };
  roster: {
    home: Array<{ number: number; name: string; pos: string }>;
    away: Array<{ number: number; name: string; pos: string }>;
  };
}

const GAMES_DATA: Game[] = [
  {
    id: 'wlk-vs-oak',
    isLive: true,
    sport: 'Football',
    homeTeam: 'Westlake Warriors',
    homeLogo: '🛡️',
    awayTeam: 'Oak Christian Lions',
    awayLogo: '🦁',
    description: 'Varsity Football - Week 9 Showdown',
    timeString: 'LIVE NOW (Friday Night Lights)',
    venue: 'Warrior Stadium, CA',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-american-football-match-under-the-rain-40348-large.mp4',
    stats: {
      homeScore: 24,
      awayScore: 21,
      quarter: '3rd Qtr',
      timeLeft: '06:12',
      possession: 'home',
      downDistance: '3rd & 4',
      passingYds: { home: 184, away: 210 },
      rushingYds: { home: 92, away: 48 },
      turnovers: { home: 1, away: 2 }
    },
    roster: {
      home: [
        { number: 12, name: 'Taylor Vance', pos: 'QB' },
        { number: 5, name: 'Devon Carter', pos: 'RB' },
        { number: 88, name: 'Hunter Jax', pos: 'WR' },
        { number: 54, name: 'Kobe Miller', pos: 'DE' }
      ],
      away: [
        { number: 7, name: 'Chase Rivers', pos: 'QB' },
        { number: 22, name: 'Marcus Sterling', pos: 'RB' },
        { number: 11, name: 'Landon Wade', pos: 'WR' },
        { number: 99, name: 'Brody Stone', pos: 'DT' }
      ]
    }
  },
  {
    id: 'mat-vs-bos',
    isLive: false,
    sport: '7v7 Football',
    homeTeam: 'Mater Dei Monarchs',
    homeLogo: '👑',
    awayTeam: 'Bosco Braves',
    awayLogo: '🏹',
    description: 'California Elite 7v7 Championship Matchup',
    timeString: 'REPLAY AVAILABLE (Broadcasted Yesterday)',
    venue: 'Spry Field Complex, CA',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-football-player-running-on-the-field-34250-large.mp4',
    stats: {
      homeScore: 35,
      awayScore: 28,
      quarter: 'Final',
      timeLeft: '00:00',
      possession: undefined,
      downDistance: undefined,
      passingYds: { home: 340, away: 295 },
      rushingYds: { home: 0, away: 0 }, // 7v7 passing only
      turnovers: { home: 1, away: 3 }
    },
    roster: {
      home: [
        { number: 10, name: 'Elijah Brown', pos: 'QB' },
        { number: 1, name: 'Zackariah Harris', pos: 'WR' },
        { number: 2, name: 'Jonah Williams', pos: 'WR' },
        { number: 24, name: 'Malik Dixon', pos: 'DB' }
      ],
      away: [
        { number: 8, name: 'Pierce Wood', pos: 'QB' },
        { number: 14, name: 'Trenton Cole', pos: 'WR' },
        { number: 3, name: 'Deandre Smith', pos: 'WR' },
        { number: 21, name: 'Kayden Vance', pos: 'DB' }
      ]
    }
  },
  {
    id: 'soc-vs-cyn',
    isLive: false,
    sport: 'Soccer',
    homeTeam: 'Redondo Seahawks',
    homeLogo: '🦅',
    awayTeam: 'Centennial Golden Hawks',
    awayLogo: '⚡',
    description: 'State Prep Soccer Semifinals',
    timeString: 'REPLAY AVAILABLE (Broadcasted May 28)',
    venue: 'Seahawk Field, Redondo Beach',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-soccer-player-kicking-ball-in-the-stadium-1547-large.mp4',
    stats: {
      homeScore: 3,
      awayScore: 2,
      quarter: 'FT (AET)',
      timeLeft: '90:00',
      possession: undefined,
      downDistance: undefined,
      passingYds: { home: 0, away: 0 },
      rushingYds: { home: 0, away: 0 },
      turnovers: { home: 0, away: 0 }
    },
    roster: {
      home: [
        { number: 10, name: 'Santiago Russo', pos: 'FW' },
        { number: 8, name: 'Liam Davies', pos: 'MF' },
        { number: 4, name: 'Ethan Cooper', pos: 'DF' },
        { number: 1, name: 'Nate Henderson', pos: 'GK' }
      ],
      away: [
        { number: 9, name: 'Lucas Bennett', pos: 'FW' },
        { number: 7, name: 'Mason Clark', pos: 'MF' },
        { number: 5, name: 'Nolan Brooks', pos: 'DF' },
        { number: 12, name: 'Gavin Ryder', pos: 'GK' }
      ]
    }
  }
];

const UPCOMING_SCHEDULE = [
  {
    id: 'sc-co-01',
    sport: 'Football',
    homeTeam: 'Sierra Canyon Trailblazers',
    homeLogo: '🏔️',
    awayTeam: 'Corona Huskies',
    awayLogo: '🐺',
    time: 'Friday, June 12 at 7:30 PM PST',
    displayDate: 'June 12',
    displayTime: '7:30 PM',
    venue: 'Sierra Canyon Arena',
    description: 'Highly-anticipated varsity kickoff under stadium lights. Live 4K stream starts with a 15-minute pregame analysis.',
    sponsored: false
  },
  {
    id: 'cc-vs-hw',
    sport: 'Basketball',
    homeTeam: 'Harvard-Westlake Wolverines',
    homeLogo: '🐾',
    awayTeam: 'Chino Hills Huskies',
    awayLogo: '🔥',
    time: 'Saturday, June 13 at 5:00 PM PST',
    displayDate: 'June 13',
    displayTime: '5:00 PM',
    venue: 'Wolverine Gymnasium',
    description: 'California Hoops elite exhibition. Complete multple-angle stream with automated instant replay clips on Twitter/X.',
    sponsored: true
  },
  {
    id: 'st-vs-md',
    sport: 'Soccer',
    homeTeam: 'San Clemente Tritons',
    homeLogo: '🔱',
    awayTeam: 'Mater Dei Monarchs',
    awayLogo: '👑',
    time: 'Wednesday, June 17 at 4:30 PM PST',
    displayDate: 'June 17',
    displayTime: '4:30 PM',
    venue: 'Triton Soccer Stadium',
    description: 'Varsity Soccer Divisional Rivalry. Cinematic drone view coverage included for highlight compilations.',
    sponsored: false
  }
];

const CHAT_CREW_NAMES = [
  'Scout_Matt', 'WarriorMom', 'IND_Fanatic', 'GridironGuru', 'Rivers_QB_Recruit',
  'BleacherCoach', 'WestlakePride', 'BallerDad', 'ScoutingHQ', 'TouchdownToby'
];

const CHAT_CREW_MESSAGES = [
  'What a pass by Vance! Perfect placement dial 🎯',
  'This coverage quality is literally ESPN level, credit to IND Media! 🔥',
  'Is that Brody Stone with the tackle? Kid is a beast.',
  'Westlake defense is bending but not breaking yet.',
  'Let’s go Lions! Rally time! 🦁⚡',
  'Scouts are absolutely watching this. What a match.',
  'Vance has that Division 1 composure right there.',
  'Rivers is showing great pocket awareness tonight.',
  'Great cameras can actually see the grip on the ball. Unbelievable production.',
  'Touchdown!!! What a sequence! 🔥🏈🏈🏈',
  'They need to run a play-action bootleg next.',
  'Ref missed that pass interference! Outrageous!',
  'Unbelievable catch! 🤯🤯🤯'
];

export default function LiveBroadcastHub() {
  const [activeGameId, setActiveGameId] = useState('wlk-vs-oak');
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; user: string; text: string; time: string; badge?: string }>>([
    { id: 101, user: 'ScoutingHQ', text: 'Scouts logged in to observe prospects Vance & Rivers. Let\'s go!', time: '1m ago', badge: 'Scout VIP' },
    { id: 102, user: 'IND_Fanatic', text: 'Crisp 1080p, thank goodness. Love watching Westlake live! 🛡️', time: '1m ago', badge: 'Subscriber' },
    { id: 103, user: 'GridironGuru', text: 'Warrior Stadium is packed! Excellent work on the audio setup', time: '45s ago' },
    { id: 104, user: 'Rivers_QB_Recruit', text: 'Chase Rivers looks comfortable. That connection on 2nd down was elite!', time: '15s ago' }
  ]);
  
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'stats' | 'roster'>('chat');
  const [videoMuted, setVideoMuted] = useState(true);
  const [liveScore, setLiveScore] = useState({ home: 24, away: 21 });
  const [gameTimeLeft, setGameTimeLeft] = useState('06:12');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertDetails, setAlertDetails] = useState({ title: '', message: '' });
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [sponsorGame, setSponsorGame] = useState('');
  const [isSponsorSuccess, setIsSponsorSuccess] = useState(false);
  const [isDemoNotificationActive, setIsDemoNotificationActive] = useState(false);
  const [demoNotificationMessage, setDemoNotificationMessage] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Retrieve current active game details
  const activeGame = GAMES_DATA.find(g => g.id === activeGameId) || GAMES_DATA[0];

  // Sync state when active game changes
  useEffect(() => {
    setLiveScore({
      home: activeGame.stats.homeScore,
      away: activeGame.stats.awayScore
    });
    setGameTimeLeft(activeGame.stats.timeLeft || '12:00');
  }, [activeGameId, activeGame]);

  // Simulate dynamic clock and live score updates ONLY if the game is Live
  useEffect(() => {
    if (!activeGame.isLive) return;

    const interval = setInterval(() => {
      // 1. Update Game Clock
      setGameTimeLeft(prev => {
        const [minutesStr, secondsStr] = prev.split(':');
        let m = parseInt(minutesStr);
        let s = parseInt(secondsStr);

        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }

        if (m < 0) {
          m = 12;
          s = 0;
          // Randomly trigger quarter advancement or turnover event in scoreboard
          triggerRandomNotification('Quarter End', '3rd Quarter has ended! Quarterbreak broadcast analysis rolling.');
        }

        const mStr = m.toString().padStart(2, '0');
        const sStr = s.toString().padStart(2, '0');
        return `${mStr}:${sStr}`;
      });

      // 2. Random Chance of Score Increase (Touchdown, Field goal, etc.)
      const scoreEventChance = Math.random();
      if (scoreEventChance < 0.03) {
        const isHome = Math.random() > 0.45; // slightly favor home team for exciting display
        const isTouchdown = Math.random() > 0.3;
        const pts = isTouchdown ? 7 : 3;

        setLiveScore(prev => {
          const nextHome = isHome ? prev.home + pts : prev.home;
          const nextAway = !isHome ? prev.away + pts : prev.away;
          
          triggerRandomNotification(
            isTouchdown ? '🏈 TOUCHDOWN!' : '🎯 FIELD GOAL!',
            `${isHome ? activeGame.homeTeam : activeGame.awayTeam} gets putting points on the scoreboard! +${pts} pts!`
          );

          // Add a custom live chat commentary message
          setChatMessages(msgs => [
            ...msgs,
            {
              id: Date.now() + 1,
              user: '⚡ BROADCAST_BOT',
              text: `🚨 SCORE EVENT! ${isHome ? activeGame.homeTeam : activeGame.awayTeam} scored! New score: WLK ${nextHome} - OAK ${nextAway}`,
              time: 'Just now',
              badge: 'Broadcast Bot'
            }
          ]);

          return { home: nextHome, away: nextAway };
        });
      }

      // 3. Random active chat message from community
      const chatChance = Math.random();
      if (chatChance < 0.25) {
        const randomUser = CHAT_CREW_NAMES[Math.floor(Math.random() * CHAT_CREW_NAMES.length)];
        const randomMsg = CHAT_CREW_MESSAGES[Math.floor(Math.random() * CHAT_CREW_MESSAGES.length)];
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            user: randomUser,
            text: randomMsg,
            time: 'Just now',
            badge: Math.random() > 0.8 ? 'Viewer VIP' : undefined
          }
        ]);
      }

    }, 3000);

    return () => clearInterval(interval);
  }, [activeGameId, activeGame.isLive, activeGame.homeTeam, activeGame.awayTeam]);

  // Handle auto-scrolling live chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const triggerRandomNotification = (title: string, message: string) => {
    setDemoNotificationMessage(`${title}: ${message}`);
    setIsDemoNotificationActive(true);
    setTimeout(() => {
      setIsDemoNotificationActive(false);
    }, 5000);
  };

  const handlePostChat = (e: FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    const name = userName.trim() ? userName.trim() : 'Anonymous Fan';
    const newMsg = {
      id: Date.now(),
      user: name,
      text: userComment.trim(),
      time: 'Just now',
      badge: userName.trim() ? 'Producer Seat' : 'Fan Guest'
    };

    setChatMessages(prev => [...prev, newMsg]);
    setUserComment('');
    
    // Simulate other chat reactions to user comment
    setTimeout(() => {
      const reactions = [
        `Agreed with @${name}!`,
        `Facts right there.`,
        `Let's gooo @${name}`,
        `100% true! 😄🙌`
      ];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 500,
          user: CHAT_CREW_NAMES[Math.floor(Math.random() * CHAT_CREW_NAMES.length)],
          text: randomReaction,
          time: 'Just now'
        }
      ]);
    }, 1500);
  };

  const setGameReminder = (scheduleId: string, gameName: string) => {
    const isSet = reminders[scheduleId];
    setReminders(prev => ({
      ...prev,
      [scheduleId]: !isSet
    }));

    if (!isSet) {
      setAlertDetails({
        title: '🔔 Game Reminder Enabled!',
        message: `You will receive a push notification and system alert 15 minutes before kick-off for: "${gameName}".`
      });
      setIsAlertModalOpen(true);
    }
  };

  const handleSponsorSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!sponsorName || !sponsorEmail || !sponsorGame) return;
    setIsSponsorSuccess(true);
    setTimeout(() => {
      setIsSponsorSuccess(false);
      setSponsorName('');
      setSponsorEmail('');
      setSponsorGame('');
    }, 4000);
  };

  return (
    <div id="live-broadcast-hub" className="bg-neutral-950 text-white py-24 border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Fancy glowing live indicator in header */}
        <div className="text-center mb-16 relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
            </span>
            <span className="font-display font-black tracking-widest text-sm uppercase text-red-500">IND SPORTS BROADCAST NETWORK</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-4 uppercase">
            LIVE <span className="text-stroke">STREAMING</span>
          </h2>
          <p className="max-w-2xl mx-auto text-neutral-400 font-sans text-base leading-relaxed">
            Experience high-definition live action, recruitment scoring bugs, and digital sports commentary built directly for high school elite games.
          </p>
          <div className="w-24 h-1.5 bg-red-600 mx-auto mt-6" />
        </div>

        {/* Dynamic score ticker warning / alert toast */}
        <AnimatePresence>
          {isDemoNotificationActive && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-red-950 border-2 border-red-500 text-white rounded-lg p-4 shadow-2xl max-w-lg flex items-center gap-3"
            >
              <div className="p-2 bg-red-600 rounded-full animate-bounce">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-display font-black text-xs uppercase tracking-widest text-red-400">Broadcast Highlight Alert</p>
                <p className="text-sm font-sans text-neutral-100 font-medium">{demoNotificationMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main interactive grid framework */}
        <div id="broadcast-frame-grid" className="grid lg:grid-cols-3 gap-8 mb-20">
          
          {/* Col 1 & 2: Video Player & Controls Overlay & Action Center */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Elegant high-school-tv formatted player stage */}
            <div className="relative aspect-video bg-black border border-white/10 rounded-sm overflow-hidden group shadow-2xl">
              
              {/* Loop stock sport videos dynamically matched to active selection */}
              <video
                ref={videoRef}
                key={activeGame.videoUrl}
                src={activeGame.videoUrl}
                autoPlay
                loop
                muted={videoMuted}
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />

              {/* FOX Sports / ESPN inspired dynamic broadcast ScoreBug overlay */}
              <div className="absolute top-4 left-4 z-20 flex items-center bg-black/90 backdrop-blur-md rounded-md overflow-hidden text-sm border border-neutral-800 shadow-2xl font-mono text-white select-none">
                <div className="bg-neutral-900 border-r border-neutral-800 px-3 py-2 flex items-center gap-1.5 font-sans font-black text-xs uppercase tracking-wider text-red-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  {activeGame.isLive ? 'LIVE' : 'REPLAY'}
                </div>
                
                {/* Home team */}
                <div className="px-3.5 py-2 flex items-center gap-2">
                  <span className="text-lg leading-none">{activeGame.homeLogo}</span>
                  <span className="font-extrabold tracking-tight">{activeGame.homeTeam.split(' ')[0].toUpperCase()}</span>
                  <span className="text-red-400 font-black text-base pl-1">{liveScore.home}</span>
                  {activeGame.isLive && activeGame.stats.possession === 'home' && (
                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  )}
                </div>

                <div className="bg-neutral-800 w-[1px] h-6" />

                {/* Away team */}
                <div className="px-3.5 py-2 flex items-center gap-2">
                  <span className="text-lg leading-none">{activeGame.awayLogo}</span>
                  <span className="font-extrabold tracking-tight">{activeGame.awayTeam.split(' ')[0].toUpperCase()}</span>
                  <span className="text-red-400 font-black text-base pl-1">{liveScore.away}</span>
                  {activeGame.isLive && activeGame.stats.possession === 'away' && (
                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  )}
                </div>

                {/* Football Stats overlay (Quarters, Down) */}
                {activeGame.stats.quarter && (
                  <>
                    <div className="bg-neutral-800 w-[1px] h-6" />
                    <div className="bg-red-950/40 text-red-400 px-3 py-2 font-bold tracking-wider text-xs">
                      {activeGame.stats.quarter}
                    </div>
                    <div className="bg-neutral-850 px-3 py-2 font-bold">
                      {gameTimeLeft}
                    </div>
                  </>
                )}

                {activeGame.isLive && activeGame.stats.downDistance && (
                  <>
                    <div className="bg-neutral-800 w-[1px] h-6" />
                    <div className="bg-yellow-400 text-neutral-950 px-3 py-2 text-xs font-bold font-sans">
                      {activeGame.stats.downDistance}
                    </div>
                  </>
                )}
              </div>

              {/* IND branded watermarks watermark */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none select-none">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded flex items-center gap-2">
                  <IndLogo size="sm" className="h-6" />
                </div>
              </div>

              {/* Live Audio & Streaming Controls bar overlay on video hover */}
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <button 
                    onClick={() => setVideoMuted(!videoMuted)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all cursor-pointer border border-white/10"
                    title={videoMuted ? "Unmute broadcast sound" : "Mute broadcast sound"}
                  >
                    {videoMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-xs font-mono bg-black/60 px-3 py-1 rounded border border-white/5 uppercase tracking-wider">
                    {videoMuted ? 'Muted (Click to play Audio)' : 'Live Feed Sound Active'}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex gap-1 items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-neutral-800 text-[10px] font-mono tracking-wider">
                    <Users className="w-3.5 h-3.5 text-red-500 mr-1" />
                    <span className="text-white font-bold animate-pulse">1,482 VIEWING NOW</span>
                  </div>
                </div>
              </div>

              {/* If video doesn't play or remains dark, show elegant backup fallback poster */}
              <div className="absolute inset-0 z-0 bg-neutral-900 flex items-center justify-center opacity-0 pointer-events-none transition-opacity">
                <div className="text-center font-display">
                  <Radio className="w-12 h-12 text-neutral-600 mx-auto mb-3 animate-pulse" />
                  <p className="font-bold text-neutral-400">CONNECTING STREAM FEED...</p>
                </div>
              </div>
            </div>

            {/* Under-player Broadcast description and interactive selector card */}
            <div className="bg-neutral-900 border border-white/5 p-6 text-left relative overflow-hidden">
              <div className="absolute right-0 top-0 h-32 w-32 bg-red-650 opacity-[0.02] blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-red-600/10 text-red-500 border border-red-500/20 px-2 py-0.5 text-[9px] font-display uppercase tracking-widest font-black rounded-sm">
                      {activeGame.sport}
                    </span>
                    <span className="text-neutral-400 text-xs font-mono">{activeGame.venue}</span>
                  </div>
                  <h3 className="font-display font-black text-xl md:text-2xl text-white">
                    {activeGame.homeTeam} vs {activeGame.awayTeam}
                  </h3>
                </div>
                
                {/* Rapid Selection list buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-display tracking-widest text-neutral-500 font-bold uppercase mr-1">Switch Feed:</span>
                  <div className="flex rounded-sm overflow-hidden border border-white/10">
                    {GAMES_DATA.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setActiveGameId(game.id)}
                        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-300 pointer-events-auto cursor-pointer ${
                          activeGameId === game.id 
                            ? 'bg-red-600 text-white font-black' 
                            : 'bg-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-800'
                        }`}
                      >
                        {game.id === 'wlk-vs-oak' ? 'LIVE 🛡️' : game.id === 'mat-vs-bos' ? 'REPLAY 👑' : 'REPLAY ⚽'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-neutral-300 font-sans text-neutral-400 text-sm leading-relaxed mb-6">
                {activeGame.description}. Enjoy broadcast-quality camera coverage provided with advanced high-speed focal lenses, real-time recruiting statistics overlays, and multi-mic sideline sport capture.
              </p>

              {/* Dynamic quick features bento cards */}
              <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans">
                <div className="bg-neutral-950 p-4 border border-white/5 rounded">
                  <p className="text-neutral-500 uppercase tracking-widest text-[9px] font-black mb-1 font-display">Video Quality</p>
                  <p className="text-white font-semibold flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Ultra HD 4K (Auto)
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 border border-white/5 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-neutral-500 uppercase tracking-widest text-[9px] font-black font-display">Sideline Audio</p>
                    <span className="text-[8px] bg-red-600/10 text-red-500 border border-red-500/20 px-1 uppercase font-bold tracking-widest">Digital Dolby</span>
                  </div>
                  <p className="text-white font-semibold flex items-center gap-1.5 font-mono">
                    Stereo Atmos Mix
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 border border-white/5 rounded flex flex-col justify-center">
                  <p className="text-neutral-500 uppercase tracking-widest text-[9px] font-black mb-1 font-display">Crew Coverage</p>
                  <p className="text-white font-semibold">
                    3 Static + 1 Endzone Crane
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Col 3: Right Panel with Interactive Live Chat & LiveStats */}
          <div className="lg:col-span-1 flex flex-col h-[520px] lg:h-auto bg-neutral-900 border border-white/10 rounded-sm overflow-hidden text-left relative">
            
            {/* Column tabs config */}
            <div className="grid grid-cols-3 border-b border-white/10 bg-neutral-950 text-xs font-display font-black tracking-widest uppercase">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`py-4 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'chat' 
                    ? 'border-red-600 text-white bg-neutral-900' 
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                LIVE CHAT
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`py-4 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'stats' 
                    ? 'border-red-600 text-white bg-neutral-900' 
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                GAME STATS
              </button>
              <button 
                onClick={() => setActiveTab('roster')}
                className={`py-4 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'roster' 
                    ? 'border-red-600 text-white bg-neutral-900' 
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                ROSTERS
              </button>
            </div>

            {/* TAB INTERACTIVE WORKSPACE */}
            <div className="flex-1 overflow-hidden flex flex-col bg-neutral-900 relative">
              
              {/* TAB 1: Chat interface */}
              {activeTab === 'chat' && (
                <>
                  {/* Scrolling chat frame */}
                  <div 
                    ref={chatContainerRef} 
                    className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[380px] lg:max-h-[340px] font-sans text-xs scrollbar-thin scrollbar-thumb-white/10"
                  >
                    <div className="p-3 bg-red-950/20 border border-red-500/10 rounded text-neutral-300 leading-relaxed">
                      <p className="font-bold text-red-400 flex items-center gap-1 mb-1 font-display uppercase tracking-wider text-[9px]">
                        <Info className="w-3 h-3" /> Broadcaster Guidelines
                      </p>
                      Welcome to the IND live stream showcase. Support the athletes positively inside the feed chat comments!
                    </div>

                    <AnimatePresence initial={false}>
                      {chatMessages.map((msg) => (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-0.5 border-l-2 border-neutral-800 pl-2.5"
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-white tracking-wide font-mono">{msg.user}</span>
                            {msg.badge && (
                              <span className="bg-red-600/10 text-red-400 border border-red-500/20 text-[8px] px-1 font-display uppercase font-extrabold tracking-widest rounded-sm scale-90">
                                {msg.badge}
                              </span>
                            )}
                            <span className="text-[9px] text-neutral-500 ml-auto font-mono">{msg.time}</span>
                          </div>
                          <p className="text-neutral-300 leading-relaxed font-sans">{msg.text}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Submit chat form block */}
                  <form onSubmit={handlePostChat} className="p-4 border-t border-white/10 bg-neutral-950 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Alias (e.g. Coach_A)" 
                        className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded text-xs text-white focus:border-red-600 outline-none transition-all placeholder:text-neutral-500"
                        maxLength={15}
                      />
                      <div className="flex items-center text-[10px] text-neutral-450 uppercase tracking-widest font-bold text-neutral-400 font-sans pl-1">
                        Posting to Live Feed
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Say something to the live crowd..." 
                        className="w-full bg-neutral-900 border border-white/10 pl-3 pr-10 py-2.5 rounded text-xs text-white focus:border-red-600 outline-none transition-all placeholder:text-neutral-500"
                        maxLength={100}
                        required
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-450 hover:text-white transition-colors cursor-pointer"
                        title="Send comment"
                      >
                        <Send className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* TAB 2: Live Game Stats sheet */}
              {activeTab === 'stats' && (
                <div className="p-4 space-y-6 overflow-y-auto max-h-[460px] font-sans">
                  <div className="text-center bg-black/40 py-2.5 rounded border border-white/5 mb-3">
                    <p className="text-[10px] font-display uppercase tracking-widest text-neutral-400 font-bold mb-0.5">TEAM COMPREHENSIVE OVERVIEW</p>
                    <p className="text-xs font-mono text-neutral-500 font-semibold">{activeGame.venue}</p>
                  </div>

                  <div className="space-y-4">
                    {/* Stat Row: Passing Yards */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-neutral-300">
                        <span>{activeGame.stats.passingYds.home} YDS</span>
                        <span className="font-display uppercase tracking-widest text-[9px] font-black text-neutral-500">PASSING YARDS</span>
                        <span>{activeGame.stats.passingYds.away} YDS</span>
                      </div>
                      <div className="h-2 bg-neutral-950 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-red-600 h-full transition-all duration-1000" 
                          style={{ width: `${(activeGame.stats.passingYds.home / (activeGame.stats.passingYds.home + activeGame.stats.passingYds.away || 1)) * 100}%` }}
                        />
                        <div 
                          className="bg-neutral-650 h-full transition-all duration-1000" 
                          style={{ width: `${(activeGame.stats.passingYds.away / (activeGame.stats.passingYds.home + activeGame.stats.passingYds.away || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Stat Row: Rushing Yards */}
                    {activeGame.sport === 'Football' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono text-neutral-300">
                          <span>{activeGame.stats.rushingYds.home} YDS</span>
                          <span className="font-display uppercase tracking-widest text-[9px] font-black text-neutral-500">RUSHING YARDS</span>
                          <span>{activeGame.stats.rushingYds.away} YDS</span>
                        </div>
                        <div className="h-2 bg-neutral-950 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-red-600 h-full transition-all duration-1000" 
                            style={{ width: `${(activeGame.stats.rushingYds.home / (activeGame.stats.rushingYds.home + activeGame.stats.rushingYds.away || 1)) * 100}%` }}
                          />
                          <div 
                            className="bg-neutral-650 h-full transition-all duration-1000" 
                            style={{ width: `${(activeGame.stats.rushingYds.away / (activeGame.stats.rushingYds.home + activeGame.stats.rushingYds.away || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Stat Row: Turnovers */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-neutral-300">
                        <span>{activeGame.stats.turnovers.home} TO</span>
                        <span className="font-display uppercase tracking-widest text-[9px] font-black text-neutral-500">TURNOVERS</span>
                        <span>{activeGame.stats.turnovers.away} TO</span>
                      </div>
                      <div className="h-2 bg-neutral-950 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-red-600 h-full transition-all duration-1000" 
                          style={{ width: `${(activeGame.stats.turnovers.home / ((activeGame.stats.turnovers.home + activeGame.stats.turnovers.away) || 1)) * 100}%` }}
                        />
                        <div 
                          className="bg-neutral-650 h-full transition-all duration-1000" 
                          style={{ width: `${(activeGame.stats.turnovers.away / ((activeGame.stats.turnovers.home + activeGame.stats.turnovers.away) || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-950 p-4 border border-white/5 rounded text-neutral-450 leading-relaxed text-xs text-neutral-400">
                    <p className="font-bold text-neutral-300 mb-1 flex items-center gap-1 font-display uppercase tracking-wider text-[9px]">
                      <Cpu className="w-3.5 h-3.5 text-red-500" /> Automated Play Tracker
                    </p>
                    Game analytics are generated in real-time via multi-angle computer vision software tracking player movements.
                  </div>
                </div>
              )}

              {/* TAB 3: Team Roster details */}
              {activeTab === 'roster' && (
                <div className="p-4 space-y-5 overflow-y-auto max-h-[460px] font-sans text-xs">
                  {/* Home Team Roster list */}
                  <div>
                    <h4 className="font-display font-black text-sm text-red-500 uppercase pb-1.5 border-b border-red-500/20 mb-3 tracking-wide">
                      {activeGame.homeTeam} Roster
                    </h4>
                    <div className="space-y-2">
                      {activeGame.roster.home.map((p) => (
                        <div key={p.number} className="flex justify-between items-center py-2 bg-black/20 px-3 rounded text-neutral-300">
                          <span className="font-mono bg-red-600/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            #{p.number}
                          </span>
                          <span className="font-semibold text-white ml-2 text-left flex-1">{p.name}</span>
                          <span className="font-mono text-[10px] font-bold tracking-widest uppercase bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                            {p.pos}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Away Team Roster list */}
                  <div>
                    <h4 className="font-display font-black text-sm text-neutral-300 uppercase pb-1.5 border-b border-neutral-700 mb-3 tracking-wide">
                      {activeGame.awayTeam} Roster
                    </h4>
                    <div className="space-y-2">
                      {activeGame.roster.away.map((p) => (
                        <div key={p.number} className="flex justify-between items-center py-2 bg-black/20 px-3 rounded text-neutral-300">
                          <span className="font-mono bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            #{p.number}
                          </span>
                          <span className="font-semibold text-white ml-2 text-left flex-1">{p.name}</span>
                          <span className="font-mono text-[10px] font-bold tracking-widest uppercase bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                            {p.pos}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* SECTION 2 OF HUB: Upcoming Schedules Board & Sponsoring options */}
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 text-left space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-red-500 w-6 h-6" />
              <h3 className="font-display font-black text-2xl uppercase tracking-wider text-white">UPCOMING STREAM SCHEDULE</h3>
            </div>
            
            <div className="space-y-4">
              {UPCOMING_SCHEDULE.map((sched) => (
                <div 
                  key={sched.id} 
                  className="bg-neutral-900 border border-white/5 hover:border-red-500/40 p-5 rounded-sm transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
                >
                  {sched.sponsored && (
                    <div className="absolute top-0 right-0 bg-red-650/10 border-l border-b border-red-500/20 text-red-400 text-[8px] font-display uppercase tracking-widest font-black px-2.5 py-1 rounded-bl">
                      ★ SPONSORED BROADCAST
                    </div>
                  )}

                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-neutral-800 text-neutral-100 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        {sched.sport}
                      </span>
                      <span className="text-red-500 font-mono text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {sched.time}
                      </span>
                    </div>

                    <h4 className="font-display font-black text-lg text-white">
                      {sched.homeLogo} {sched.homeTeam} vs {sched.awayLogo} {sched.awayTeam}
                    </h4>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      {sched.description} Stream will load cleanly with high-speed 60fps framerates.
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono uppercase">🏟️ {sched.venue}</p>
                  </div>

                  <button
                    onClick={() => setGameReminder(sched.id, `${sched.homeTeam} vs ${sched.awayTeam}`)}
                    className={`sm:flex-shrink-0 px-5 py-3 text-xs font-display font-black tracking-widest uppercase transition-all rounded-sm flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center ${
                      reminders[sched.id]
                        ? 'bg-red-600 text-white border border-red-600 hover:bg-red-700'
                        : 'bg-neutral-950 hover:bg-neutral-800 text-white border border-white/10 hover:border-white/30'
                    }`}
                  >
                    {reminders[sched.id] ? (
                      <>
                        <BellRing className="w-4 h-4 text-white animate-swing" /> REMINDER SET
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 text-neutral-400" /> CET REMINDER
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sponsoring/Booking Box segment */}
          <div className="md:col-span-1 text-left bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 border border-white/10 rounded-sm flex flex-col justify-between relative relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 h-40 w-40 bg-red-600 opacity-5 blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="p-3 bg-red-600 rounded-full inline-block shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-wider text-white">SPONSOR A LIVE BROADCAST</h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Connect your brand to local elite sports. Sponsor next week's games to feature your logo inside the broadcast SCOREBUG overlay, get custom vocal sponsor shout-outs at quarterbacks, and support 100% free streaming.
              </p>
            </div>

            {isSponsorSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="my-4 bg-red-950/20 border border-red-500/20 rounded p-4 text-center font-display space-y-1.5"
              >
                <CheckCircle2 className="w-8 h-8 text-red-500 mx-auto" />
                <h4 className="font-black text-sm uppercase text-white">Proposal Stream Sent!</h4>
                <p className="text-[10px] text-neutral-400 font-sans">Our Production Executive will contact you in less than 12 hours with package rates.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSponsorSubmit} className="space-y-3 mt-6">
                <input 
                  type="text" 
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="Your Name / Business" 
                  className="w-full bg-neutral-950 border border-white/10 p-3 rounded text-xs text-white focus:border-red-600 outline-none transition-all placeholder:text-neutral-500"
                  required
                />
                <input 
                  type="email" 
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                  placeholder="Contact Email Address" 
                  className="w-full bg-neutral-950 border border-white/10 p-3 rounded text-xs text-white focus:border-red-600 outline-none transition-all placeholder:text-neutral-505"
                  required
                />
                <select 
                  value={sponsorGame}
                  onChange={(e) => setSponsorGame(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 p-3 rounded text-xs text-white focus:border-red-600 outline-none transition-all cursor-pointer text-neutral-300"
                  required
                >
                  <option value="" disabled>Choose Game to Sponsor</option>
                  <option value="sierra-canyon">Sierra Canyon vs Corona (June 12)</option>
                  <option value="harvard">Wolverines vs Chino Hills (June 13)</option>
                  <option value="ttritons">Tritons vs Mater Dei (June 17)</option>
                </select>
                
                <button 
                  type="submit"
                  className="w-full bg-white text-black py-3.5 rounded-sm font-display font-black text-xs hover:bg-neutral-200 uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-98"
                >
                  SUBMIT INQUIRY
                </button>
              </form>
            )}

            <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center text-[10px] text-neutral-550 font-mono text-neutral-500 uppercase tracking-wide">
              <span>RATES START AT $150/GAME</span>
              <a href="#booking" className="text-red-400 hover:underline flex items-center gap-0.5 font-bold font-display tracking-widest text-[9px] uppercase">
                PRODUCTION INFO <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* ALERT / INFO REMINDER CONFIRMATION DIALOG */}
      <AnimatePresence>
        {isAlertModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAlertModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Dialog Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-neutral-900 border border-white/15 rounded p-6 shadow-2xl text-left"
            >
              <h4 className="font-display font-black text-lg text-white mb-2 uppercase flex items-center gap-2">
                {alertDetails.title}
              </h4>
              <p className="text-sm font-sans text-neutral-300 leading-relaxed mb-6">
                {alertDetails.message} All streams utilize automated reminder engines connected to standard web browser notifications.
              </p>
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsAlertModalOpen(false)}
                  className="bg-white text-black px-6 py-2.5 font-display font-black text-xs rounded-sm hover:bg-neutral-200 transition-colors uppercase tracking-widest cursor-pointer"
                >
                  AWESOME, THANKS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
