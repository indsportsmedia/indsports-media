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

const GAMES_DATA: Game[] = [];

const UPCOMING_SCHEDULE: Array<{
  id: string;
  sport: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  time: string;
  displayDate: string;
  displayTime: string;
  venue: string;
  description: string;
  sponsored?: boolean;
}> = [];

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
  const [activeGameId, setActiveGameId] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; user: string; text: string; time: string; badge?: string }>>([]);
  
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'stats' | 'roster'>('chat');
  const [videoMuted, setVideoMuted] = useState(true);
  const [liveScore, setLiveScore] = useState({ home: 0, away: 0 });
  const [gameTimeLeft, setGameTimeLeft] = useState('00:00');
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
  const activeGame = GAMES_DATA.find(g => g.id === activeGameId) || (GAMES_DATA.length > 0 ? GAMES_DATA[0] : null);

  // Sync state when active game changes
  useEffect(() => {
    if (activeGame) {
      setLiveScore({
        home: activeGame.stats.homeScore,
        away: activeGame.stats.awayScore
      });
      setGameTimeLeft(activeGame.stats.timeLeft || '12:00');
    }
  }, [activeGameId, activeGame]);

  // Simulate dynamic clock and live score updates ONLY if the game is Live
  useEffect(() => {
    if (!activeGame || !activeGame.isLive) return;

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
        const isHome = Math.random() > 0.45;
        const isTouchdown = Math.random() > 0.3;
        const pts = isTouchdown ? 7 : 3;

        setLiveScore(prev => {
          const nextHome = isHome ? prev.home + pts : prev.home;
          const nextAway = !isHome ? prev.away + pts : prev.away;
          
          triggerRandomNotification(
            isTouchdown ? '🏈 TOUCHDOWN!' : '🎯 FIELD GOAL!',
            `${isHome ? activeGame.homeTeam : activeGame.awayTeam} puts points on the scoreboard! +${pts} pts!`
          );

          // Add a custom live chat commentary message
          setChatMessages(msgs => [
            ...msgs,
            {
              id: Date.now() + 1,
              user: '⚡ BROADCAST_BOT',
              text: `🚨 SCORE EVENT! ${isHome ? activeGame.homeTeam : activeGame.awayTeam} scored! New score: ${nextHome} - ${nextAway}`,
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
  }, [activeGameId, activeGame]);

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
            <div className="relative aspect-video bg-black border border-white/10 rounded-sm overflow-hidden group shadow-2xl flex items-center justify-center">
              
              {activeGame ? (
                <>
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
                    </div>

                    <div className="bg-neutral-800 w-[1px] h-6" />

                    {/* Away team */}
                    <div className="px-3.5 py-2 flex items-center gap-2">
                      <span className="text-lg leading-none">{activeGame.awayLogo}</span>
                      <span className="font-extrabold tracking-tight">{activeGame.awayTeam.split(' ')[0].toUpperCase()}</span>
                      <span className="text-red-400 font-black text-base pl-1">{liveScore.away}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Pristine Standby Slate when no live stream is active */
                <div className="relative w-full h-full bg-gradient-to-br from-neutral-950 via-black to-neutral-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06)_0%,transparent_70%)] pointer-events-none" />
                  
                  {/* Subtle Grid scanlines */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mb-4 text-red-500 shadow-xl">
                      <Tv className="w-8 h-8 opacity-80" />
                    </div>

                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-3">
                      <span className="w-2 h-2 rounded-full bg-neutral-600" />
                      OFFLINE • STANDBY MODE
                    </div>

                    <h4 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wider mb-2">
                      No Live Stream Currently Broadcasting
                    </h4>
                    
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm">
                      Our multi-angle live stream feed, scoreboard overlay, and sideline commentary will go live right here when game action begins.
                    </p>
                  </div>
                </div>
              )}

              {/* IND branded watermarks watermark */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none select-none">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded flex items-center gap-2">
                  <IndLogo size="sm" className="h-6" />
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
                      {activeGame ? activeGame.sport : 'IND BROADCAST NETWORK'}
                    </span>
                    <span className="text-neutral-400 text-xs font-mono">
                      {activeGame ? activeGame.venue : 'Indiana High School Sports'}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-xl md:text-2xl text-white">
                    {activeGame ? `${activeGame.homeTeam} vs ${activeGame.awayTeam}` : 'IND Sports Media Live Broadcast Desk'}
                  </h3>
                </div>
              </div>

              <p className="text-neutral-300 font-sans text-neutral-400 text-sm leading-relaxed mb-6">
                {activeGame 
                  ? activeGame.description 
                  : 'IND Sports Media delivers multi-angle varsity coverage, sideline audio capture, recruiting statistics overlays, and 4K ultra-definition streaming. Check back during game days or review scheduled streams below.'}
              </p>

              {/* Dynamic quick features bento cards */}
              <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans">
                <div className="bg-neutral-950 p-4 border border-white/5 rounded">
                  <p className="text-neutral-500 uppercase tracking-widest text-[9px] font-black mb-1 font-display">Video Quality</p>
                  <p className="text-white font-semibold flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Ultra HD 4K (60fps)
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 border border-white/5 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-neutral-500 uppercase tracking-widest text-[9px] font-black font-display">Sideline Audio</p>
                    <span className="text-[8px] bg-red-600/10 text-red-500 border border-red-500/20 px-1 uppercase font-bold tracking-widest">Dolby Mix</span>
                  </div>
                  <p className="text-white font-semibold flex items-center gap-1.5 font-mono">
                    Multi-Mic Sound
                  </p>
                </div>
                <div className="bg-neutral-950 p-4 border border-white/5 rounded flex flex-col justify-center">
                  <p className="text-neutral-500 uppercase tracking-widest text-[9px] font-black mb-1 font-display">Coverage Setup</p>
                  <p className="text-white font-semibold">
                    Multi-Angle Camera Feeds
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

                    {chatMessages.length === 0 ? (
                      <div className="text-center py-12 px-4">
                        <p className="text-neutral-500 font-sans text-xs mb-1">No live stream messages yet.</p>
                        <p className="text-neutral-600 text-[11px]">Chat will be active during scheduled broadcasts.</p>
                      </div>
                    ) : (
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
                    )}
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
                        Live Stream Chat
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
                  {activeGame ? (
                    <>
                      <div className="text-center bg-black/40 py-2.5 rounded border border-white/5 mb-3">
                        <p className="text-[10px] font-display uppercase tracking-widest text-neutral-400 font-bold mb-0.5">TEAM COMPREHENSIVE OVERVIEW</p>
                        <p className="text-xs font-mono text-neutral-500 font-semibold">{activeGame.venue}</p>
                      </div>

                      <div className="space-y-4">
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
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-16 px-4">
                      <p className="text-neutral-400 font-display font-bold uppercase text-xs mb-1">No Active Matchup Stats</p>
                      <p className="text-neutral-500 text-xs font-sans">Real-time drive charts, passing, and rushing statistics will display here during live games.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Team Roster details */}
              {activeTab === 'roster' && (
                <div className="p-4 space-y-5 overflow-y-auto max-h-[460px] font-sans text-xs">
                  {activeGame ? (
                    <>
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
                    </>
                  ) : (
                    <div className="text-center py-16 px-4">
                      <p className="text-neutral-400 font-display font-bold uppercase text-xs mb-1">No Active Rosters</p>
                      <p className="text-neutral-500 text-xs font-sans">Verified varsity rosters and prospect numbers will be listed here prior to kickoff.</p>
                    </div>
                  )}
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
              {UPCOMING_SCHEDULE.length === 0 ? (
                <div className="bg-neutral-900/60 border border-white/10 rounded-sm p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                    No Live Streams Currently Scheduled
                  </h4>
                  <p className="text-xs text-neutral-400 font-sans max-w-md mx-auto leading-relaxed">
                    Check back soon! Upcoming high school varsity matchups, showcase games, and tournament broadcasts will be posted here once dates and times are finalized.
                  </p>
                </div>
              ) : (
                UPCOMING_SCHEDULE.map((sched) => (
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
                          <Bell className="w-4 h-4 text-neutral-400" /> SET REMINDER
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
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
