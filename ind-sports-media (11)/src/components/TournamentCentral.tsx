import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  MapPin, 
  Radio, 
  ChevronRight, 
  Calendar, 
  Share2, 
  Sparkles, 
  Shield, 
  Users, 
  ExternalLink,
  Activity,
  CheckCircle2,
  Tv,
  ArrowRight
} from 'lucide-react';

export interface TournamentMatch {
  id: string;
  matchNumber?: string;
  time: string;
  date: string;
  round: string;
  team1: {
    name: string;
    shortName: string;
    seed?: string;
    record?: string;
    color: string;
    textColor: string;
    score?: number;
    sets?: number[];
  };
  team2: {
    name: string;
    shortName: string;
    seed?: string;
    record?: string;
    color: string;
    textColor: string;
    score?: number;
    sets?: number[];
  };
  isChampionship?: boolean;
  court?: string;
  notes?: string;
}

export interface TournamentSite {
  id: string;
  siteName: string;
  location: string;
  sport: string;
  date: string;
  description: string;
  matches: TournamentMatch[];
}

interface TournamentCentralProps {
  onNavigateToGame?: (gameId: string) => void;
  onNavigateToLiveScoreboard?: () => void;
  isScoreboardEmbedded?: boolean;
}

export const TOURNAMENT_FOOTBALL_MATCHUPS = [
  {
    id: 'westfield-vs-carmel-sectionals-2026',
    title: 'IHSAA Sectionals • Round 1',
    classification: 'Class 6A Sectional 4',
    time: '7:00 PM Tonight',
    date: 'Friday, Oct 30 • 7:00 PM EST',
    venue: 'Riverview Health Stadium • Westfield, IN',
    status: '7:00 PM KICKOFF',
    isTonight: true,
    streamAvailable: true,
    homeTeam: {
      name: 'Westfield Shamrocks',
      shortName: 'Westfield',
      mascot: 'Shamrocks',
      role: 'Home',
      record: '8-1',
      color: '#00843D',
      textColor: '#FFD100',
      badgeBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
    },
    awayTeam: {
      name: 'Carmel Greyhounds',
      shortName: 'Carmel',
      mascot: 'Greyhounds',
      role: 'Away',
      record: '6-3',
      color: '#002D62',
      textColor: '#C5B358',
      badgeBg: 'bg-blue-950/60 border-blue-500/40 text-blue-300'
    },
    highlightNote: 'Top-10 ranked rivalry clash in Central Indiana. Winner advances to Sectional Semifinals.'
  },
  {
    id: 'avon-vs-ben-davis-sectionals-2026',
    title: 'IHSAA Sectionals • Round 1',
    classification: 'Class 6A Sectional 5',
    time: '7:00 PM Tonight',
    date: 'Friday, Oct 30 • 7:00 PM EST',
    venue: 'Orioles Stadium • Avon, IN',
    status: '7:00 PM KICKOFF',
    isTonight: true,
    streamAvailable: true,
    homeTeam: {
      name: 'Avon Orioles',
      shortName: 'Avon',
      mascot: 'Orioles',
      role: 'Home',
      record: '7-2',
      color: '#1A1A1A',
      textColor: '#FFC72C',
      badgeBg: 'bg-amber-950/60 border-amber-500/40 text-amber-300'
    },
    awayTeam: {
      name: 'Ben Davis Giants',
      shortName: 'Ben Davis',
      mascot: 'Giants',
      role: 'Away',
      record: '5-4',
      color: '#4B2E83',
      textColor: '#FFFFFF',
      badgeBg: 'bg-purple-950/60 border-purple-500/40 text-purple-300'
    },
    highlightNote: 'West-side powerhouse battle. Explosive offenses meet under Friday Night Lights.'
  },
  {
    id: 'snider-vs-southside-sectionals-2026',
    title: 'IHSAA Sectionals • Round 1',
    classification: 'Class 5A / 6A Sectional',
    time: '7:00 PM Tonight',
    date: 'Friday, Oct 30 • 7:00 PM EST',
    venue: 'Spuller Stadium • Fort Wayne, IN',
    status: '7:00 PM KICKOFF',
    isTonight: true,
    streamAvailable: true,
    homeTeam: {
      name: 'FW Snider Panthers',
      shortName: 'FW Snider',
      mascot: 'Panthers',
      role: 'Home',
      record: '7-2',
      color: '#1A1A1A',
      textColor: '#F1B82D',
      badgeBg: 'bg-yellow-950/60 border-yellow-500/40 text-yellow-300'
    },
    awayTeam: {
      name: 'South Side Archers',
      shortName: 'South Side',
      mascot: 'Archers',
      role: 'Away',
      record: '4-5',
      color: '#0F5132',
      textColor: '#FFFFFF',
      badgeBg: 'bg-green-950/60 border-green-500/40 text-green-300'
    },
    highlightNote: 'Historic Fort Wayne rivalry with postseason elimination on the line.'
  }
];

export const VOLLEYBALL_TOURNAMENT_SITES: TournamentSite[] = [
  {
    id: 'huntington-north',
    siteName: 'Huntington North Site',
    location: 'Huntington North High School Arena • Huntington, IN',
    sport: 'Varsity Volleyball',
    date: 'Tomorrow • Saturday, Oct 31',
    description: 'Northern Indiana Regional Championship Hub featuring 4 powerhouse contenders battling for the title.',
    matches: [
      {
        id: 'vb-hn-m1',
        matchNumber: 'Match 1',
        time: '10:00 AM',
        date: 'Saturday Morning',
        round: 'Tournament Semifinal 1',
        court: 'Court 1 - North Gym',
        team1: {
          name: 'Carroll (Fort Wayne)',
          shortName: 'Carroll (FW)',
          color: '#0033A0',
          textColor: '#FFFFFF',
          record: '24-4'
        },
        team2: {
          name: 'Penn Kingsmen',
          shortName: 'Penn',
          color: '#111111',
          textColor: '#C5B358',
          record: '22-6'
        },
        notes: 'Opening match of the Huntington North tournament.'
      },
      {
        id: 'vb-hn-m2',
        matchNumber: 'Match 2',
        time: '12:00 PM',
        date: 'Saturday Afternoon',
        round: 'Tournament Semifinal 2',
        court: 'Court 1 - North Gym',
        team1: {
          name: 'Westfield Shamrocks',
          shortName: 'Westfield',
          color: '#00843D',
          textColor: '#FFD100',
          record: '23-5'
        },
        team2: {
          name: 'Crown Point Bulldogs',
          shortName: 'Crown Point',
          color: '#C8102E',
          textColor: '#FFFFFF',
          record: '21-7'
        },
        notes: 'Winner advances to face M1 Winner in tonight\'s Championship.'
      },
      {
        id: 'vb-hn-champ',
        matchNumber: 'Championship',
        time: '7:00 PM',
        date: 'Saturday Night',
        round: 'Championship Match',
        isChampionship: true,
        court: 'Main Arena Court',
        team1: {
          name: 'M1 Winner (Carroll or Penn)',
          shortName: 'M1 Winner',
          color: '#00BFFF',
          textColor: '#000000'
        },
        team2: {
          name: 'M2 Winner (Westfield or Crown Point)',
          shortName: 'M2 Winner',
          color: '#FFD700',
          textColor: '#000000'
        },
        notes: 'Huntington North Tournament Championship Trophy Match.'
      }
    ]
  },
  {
    id: 'jennings-county',
    siteName: 'Jennings County Site',
    location: 'Jennings County High School Gymnasium • North Vernon, IN',
    sport: 'Varsity Volleyball',
    date: 'Tomorrow • Saturday, Oct 31',
    description: 'Southern Indiana Regional Championship Hub showcasing elite programs in high-stakes tournament play.',
    matches: [
      {
        id: 'vb-jc-m1',
        matchNumber: 'Match 1',
        time: '10:30 AM',
        date: 'Saturday Morning',
        round: 'Tournament Semifinal 1',
        court: 'Main Gymnasium',
        team1: {
          name: 'Floyd Central Highlanders',
          shortName: 'Floyd Central',
          color: '#1B4D3E',
          textColor: '#F5BD02',
          record: '25-3'
        },
        team2: {
          name: 'Yorktown Tigers',
          shortName: 'Yorktown',
          color: '#006341',
          textColor: '#FFFFFF',
          record: '23-6'
        },
        notes: 'Clash of state-ranked titans in opening round.'
      },
      {
        id: 'vb-jc-m2',
        matchNumber: 'Match 2',
        time: '12:30 PM',
        date: 'Saturday Afternoon',
        round: 'Tournament Semifinal 2',
        court: 'Main Gymnasium',
        team1: {
          name: 'Bloomington South Panthers',
          shortName: 'Bloomington South',
          color: '#512888',
          textColor: '#FFFFFF',
          record: '20-7'
        },
        team2: {
          name: 'Center Grove Trojans',
          shortName: 'Center Grove',
          color: '#990000',
          textColor: '#FFFFFF',
          record: '26-4'
        },
        notes: 'Winner earns a ticket to tonight\'s 6:30 PM Final.'
      },
      {
        id: 'vb-jc-champ',
        matchNumber: 'Championship',
        time: '6:30 PM',
        date: 'Saturday Night',
        round: 'Championship Match',
        isChampionship: true,
        court: 'Championship Arena Court',
        team1: {
          name: 'M1 Winner (Floyd Central or Yorktown)',
          shortName: 'M1 Winner',
          color: '#00BFFF',
          textColor: '#000000'
        },
        team2: {
          name: 'M2 Winner (Bloomington South or Center Grove)',
          shortName: 'M2 Winner',
          color: '#FFD700',
          textColor: '#000000'
        },
        notes: 'Jennings County Tournament Championship Trophy Match.'
      }
    ]
  }
];

export const TournamentCentral: React.FC<TournamentCentralProps> = ({
  onNavigateToGame,
  onNavigateToLiveScoreboard,
  isScoreboardEmbedded = false
}) => {
  const [activeFilter, setActiveFilter] = useState<'football' | 'volleyball' | 'bracket'>('football');
  const [selectedVbSite, setSelectedVbSite] = useState<string>('huntington-north');
  const [copiedLink, setCopiedLink] = useState(false);

  const activeSiteData = VOLLEYBALL_TOURNAMENT_SITES.find(s => s.id === selectedVbSite) || VOLLEYBALL_TOURNAMENT_SITES[0];

  const handleShareTournament = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className={`w-full ${isScoreboardEmbedded ? 'py-4' : 'py-12 bg-gradient-to-b from-black via-[#0c0c0c] to-black'} relative`}>
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#00BFFF_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. HEADER & TOURNAMENT ALERT BANNER */}
        {/* ========================================================================= */}
        <div className="bg-[#121212]/95 border border-[#00BFFF]/30 rounded-sm p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#00BFFF]/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {/* Badge Row */}
              <div className="flex items-center gap-2.5 flex-wrap mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-red-400 text-xs font-bold font-display uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <Radio size={13} className="text-red-500" />
                  IHSAA Postseason Tournament Central
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full text-[#00BFFF] text-xs font-mono font-bold uppercase">
                  <Sparkles size={12} />
                  Live On-Site Coverage
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-mono font-bold uppercase">
                  <Trophy size={12} />
                  Start of Tournaments
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display uppercase tracking-tight text-white">
                TOURNAMENT <span className="text-[#00BFFF]">KICKOFF HUB</span>
              </h1>
              <p className="text-white/70 font-sans text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                The road to the State Finals begins now. Track real-time live scores, play-by-play, and sideline photo highlights for <span className="text-white font-bold">Tonight&apos;s Football Sectionals Round 1 (7:00 PM)</span> and <span className="text-[#00BFFF] font-bold">Tomorrow&apos;s Volleyball Championship Tournaments</span> at Huntington North and Jennings County.
              </p>
            </div>

            {/* Quick Actions / Share */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {onNavigateToLiveScoreboard && !isScoreboardEmbedded && (
                <button
                  onClick={onNavigateToLiveScoreboard}
                  className="px-5 py-3 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <Activity size={16} />
                  <span>Launch Live Scoreboard</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <button
                onClick={handleShareTournament}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white font-display font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Share2 size={15} className="text-[#00BFFF]" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Hub'}</span>
              </button>
            </div>
          </div>

          {/* Quick Schedule Micro Ticker */}
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 bg-black/40 p-2.5 rounded-lg border border-white/5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-bold">Tonight • 7:00 PM</span>
                <span className="text-white font-bold">Football: 3 Sectional Openers</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-black/40 p-2.5 rounded-lg border border-white/5">
              <span className="w-2 h-2 rounded-full bg-[#00BFFF]" />
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-bold">Saturday • Huntington North</span>
                <span className="text-white font-bold">Volleyball: 10am, 12pm & 7pm Final</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-black/40 p-2.5 rounded-lg border border-white/5 sm:col-span-2 lg:col-span-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-bold">Saturday • Jennings County</span>
                <span className="text-white font-bold">Volleyball: 10:30am, 12:30pm & 6:30pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TAB NAVIGATION */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <button
            onClick={() => setActiveFilter('football')}
            className={`px-5 py-3 rounded-sm text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
              activeFilter === 'football'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-100 ring-2 ring-red-400'
                : 'bg-[#151515] hover:bg-[#1a1a1a] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Tonight&apos;s Football Sectionals (7:00 PM)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 font-bold">
              3 Games
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('volleyball')}
            className={`px-5 py-3 rounded-sm text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
              activeFilter === 'volleyball'
                ? 'bg-[#00BFFF] text-black scale-100 ring-2 ring-[#00BFFF]'
                : 'bg-[#151515] hover:bg-[#1a1a1a] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Trophy size={14} />
            <span>Saturday Volleyball Tournaments</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${activeFilter === 'volleyball' ? 'bg-black/30 text-black' : 'bg-white/10 text-white/70'}`}>
              2 Sites • 6 Matches
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('bracket')}
            className={`px-5 py-3 rounded-sm text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
              activeFilter === 'bracket'
                ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-100 ring-2 ring-amber-300'
                : 'bg-[#151515] hover:bg-[#1a1a1a] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles size={14} />
            <span>Interactive Tournament Bracket View</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. TAB CONTENT: TONIGHT'S FOOTBALL SECTIONALS (ROUND 1) */}
        {/* ========================================================================= */}
        {activeFilter === 'football' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
                  Sectionals Round 1 • Friday Night Primetime
                </h2>
              </div>
              <span className="text-xs font-mono text-white/50">
                Kickoff: 7:00 PM EDT • Single Elimination
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {TOURNAMENT_FOOTBALL_MATCHUPS.map((matchup) => (
                <div
                  key={matchup.id}
                  className="bg-[#141414] border border-white/10 hover:border-[#00BFFF]/60 rounded-sm p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-4 border-b border-white/10 pb-3">
                      <span className="px-2.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                        <Clock size={11} />
                        {matchup.time}
                      </span>
                      <span className="text-[#00BFFF] font-bold uppercase">
                        {matchup.classification}
                      </span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-1.5 text-xs text-white/50 font-sans mb-4">
                      <MapPin size={13} className="text-[#00BFFF] shrink-0" />
                      <span className="truncate">{matchup.venue}</span>
                    </div>

                    {/* Matchup Board */}
                    <div className="space-y-3 bg-black/50 p-4 rounded-sm border border-white/5">
                      
                      {/* Away Team */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm uppercase shadow-md shrink-0"
                            style={{ backgroundColor: matchup.awayTeam.color, color: matchup.awayTeam.textColor }}
                          >
                            {matchup.awayTeam.shortName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-base text-white">
                                {matchup.awayTeam.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                                {matchup.awayTeam.role}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-white/40">
                              Record: {matchup.awayTeam.record} • {matchup.awayTeam.mascot}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* VS Divider */}
                      <div className="flex items-center justify-center my-1 relative">
                        <div className="h-px w-full bg-white/10" />
                        <span className="absolute bg-[#1a1a1a] px-3 text-[10px] font-mono text-white/40 uppercase font-bold">
                          AT
                        </span>
                      </div>

                      {/* Home Team */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm uppercase shadow-md shrink-0"
                            style={{ backgroundColor: matchup.homeTeam.color, color: matchup.homeTeam.textColor }}
                          >
                            {matchup.homeTeam.shortName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-base text-white">
                                {matchup.homeTeam.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#00BFFF]/20 text-[#00BFFF] font-bold">
                                {matchup.homeTeam.role}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-white/40">
                              Record: {matchup.homeTeam.record} • {matchup.homeTeam.mascot}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Matchup Note */}
                    <p className="text-white/60 text-xs font-sans mt-3.5 leading-relaxed ">
                      &quot;{matchup.highlightNote}&quot;
                    </p>
                  </div>

                  {/* Card Footer / Action */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-white/40 flex items-center gap-1.5">
                      <Tv size={13} className="text-[#00BFFF]" />
                      IND GameCast
                    </span>
                    <button
                      onClick={() => {
                        if (onNavigateToGame) {
                          onNavigateToGame(matchup.id);
                        } else if (onNavigateToLiveScoreboard) {
                          onNavigateToLiveScoreboard();
                        }
                      }}
                      className="px-4 py-2 bg-[#00BFFF]/10 hover:bg-[#00BFFF] border border-[#00BFFF]/40 hover:border-[#00BFFF] text-[#00BFFF] hover:text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Track Live</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 4. TAB CONTENT: SATURDAY VOLLEYBALL TOURNAMENT SITES */}
        {/* ========================================================================= */}
        {activeFilter === 'volleyball' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Site Switcher */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-[#141414] p-3 rounded-sm border border-white/10">
              <span className="text-xs font-mono text-white/60 font-bold uppercase pl-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#00BFFF]" />
                Select Tournament Location:
              </span>
              <div className="flex items-center gap-2">
                {VOLLEYBALL_TOURNAMENT_SITES.map((site) => {
                  const isSelected = selectedVbSite === site.id;
                  return (
                    <button
                      key={site.id}
                      onClick={() => setSelectedVbSite(site.id)}
                      className={`px-4 py-2 rounded-sm text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#00BFFF] text-black shadow-lg/20'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      <Trophy size={13} />
                      <span>{site.siteName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Site Details Card */}
            <div className="bg-[#121212] border border-[#00BFFF]/30 rounded-sm p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00BFFF]/20 text-[#00BFFF] font-bold uppercase">
                      Saturday Tournament Hub
                    </span>
                    <span className="text-xs font-mono text-white/40">
                      Tomorrow • Oct 31
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
                    {activeSiteData.siteName}
                  </h3>
                  <p className="text-white/60 font-sans text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#00BFFF]" />
                    {activeSiteData.location}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70">
                    3 Matches • Semifinals & Championship
                  </span>
                </div>
              </div>

              {/* Tournament Matches Progression Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeSiteData.matches.map((match, idx) => (
                  <div
                    key={match.id}
                    className={`rounded-sm p-5 border flex flex-col justify-between relative transition-all duration-300 ${
                      match.isChampionship
                        ? 'bg-gradient-to-b from-amber-950/30 via-[#181818] to-black border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] md:col-span-1'
                        : 'bg-[#161616] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Top Match Tag */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-4 border-b border-white/10 pb-2.5">
                        <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 ${
                          match.isChampionship 
                            ? 'bg-amber-400 text-black font-extrabold' 
                            : 'bg-[#00BFFF]/20 text-[#00BFFF]'
                        }`}>
                          {match.isChampionship && <Trophy size={11} />}
                          {match.matchNumber}
                        </span>
                        <span className="text-white/70 font-bold flex items-center gap-1">
                          <Clock size={12} className={match.isChampionship ? 'text-amber-400' : 'text-[#00BFFF]'} />
                          {match.time}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-white/40 mb-3">
                        {match.round} • {match.court}
                      </div>

                      {/* Teams */}
                      <div className="space-y-3 bg-black/40 p-3.5 rounded-sm border border-white/5">
                        {/* Team 1 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-7 h-7 rounded-md flex items-center justify-center font-display font-bold text-xs uppercase"
                              style={{ backgroundColor: match.team1.color, color: match.team1.textColor }}
                            >
                              {match.team1.shortName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-display font-bold text-sm text-white block">
                                {match.team1.name}
                              </span>
                              {match.team1.record && (
                                <span className="text-[10px] font-mono text-white/40">
                                  Rec: {match.team1.record}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* VS */}
                        <div className="text-center text-[10px] font-mono text-white/30 uppercase font-bold py-0.5">
                          VS
                        </div>

                        {/* Team 2 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-7 h-7 rounded-md flex items-center justify-center font-display font-bold text-xs uppercase"
                              style={{ backgroundColor: match.team2.color, color: match.team2.textColor }}
                            >
                              {match.team2.shortName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-display font-bold text-sm text-white block">
                                {match.team2.name}
                              </span>
                              {match.team2.record && (
                                <span className="text-[10px] font-mono text-white/40">
                                  Rec: {match.team2.record}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-white/50 text-[11px] font-sans mt-3">
                        {match.notes}
                      </p>
                    </div>

                    {/* Footer Status */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-white/40">
                        Best of 5 Sets
                      </span>
                      <span className={`font-bold ${match.isChampionship ? 'text-amber-400' : 'text-[#00BFFF]'}`}>
                        {match.isChampionship ? 'Trophy Match' : 'Semifinal'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 5. TAB CONTENT: FULL INTERACTIVE BRACKET OVERVIEW */}
        {/* ========================================================================= */}
        {activeFilter === 'bracket' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Dual Bracket Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Bracket 1: Huntington North Site */}
              <div className="bg-[#131313] border border-white/15 rounded-sm p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#00BFFF] uppercase font-bold tracking-wider">
                      Tournament Bracket A
                    </span>
                    <h3 className="text-xl font-display font-bold text-white uppercase">
                      Huntington North Site
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-white/5 rounded-lg text-xs font-mono text-white/60">
                    Saturday • Oct 31
                  </span>
                </div>

                {/* Bracket Tree Visualizer */}
                <div className="space-y-6 relative py-2">
                  
                  {/* Semifinals */}
                  <div className="space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/50 font-bold block">
                      Round 1: Semifinals
                    </span>

                    {/* M1 */}
                    <div className="bg-black/60 p-3.5 rounded-sm border border-white/10 relative">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-2">
                        <span className="text-[#00BFFF] font-bold">MATCH 1 • 10:00 AM</span>
                        <span>Court 1</span>
                      </div>
                      <div className="space-y-1.5 text-xs font-display font-bold">
                        <div className="flex items-center justify-between text-white">
                          <span>Carroll (Fort Wayne)</span>
                          <span className="text-white/40 font-mono text-[10px]">24-4</span>
                        </div>
                        <div className="flex items-center justify-between text-white/70">
                          <span>Penn</span>
                          <span className="text-white/40 font-mono text-[10px]">22-6</span>
                        </div>
                      </div>
                    </div>

                    {/* M2 */}
                    <div className="bg-black/60 p-3.5 rounded-sm border border-white/10 relative">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-2">
                        <span className="text-[#00BFFF] font-bold">MATCH 2 • 12:00 PM</span>
                        <span>Court 1</span>
                      </div>
                      <div className="space-y-1.5 text-xs font-display font-bold">
                        <div className="flex items-center justify-between text-white">
                          <span>Westfield</span>
                          <span className="text-white/40 font-mono text-[10px]">23-5</span>
                        </div>
                        <div className="flex items-center justify-between text-white/70">
                          <span>Crown Point</span>
                          <span className="text-white/40 font-mono text-[10px]">21-7</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#00BFFF]">
                    <span>Both winners advance to tonight&apos;s title bout</span>
                    <ArrowRight size={14} />
                  </div>

                  {/* Championship */}
                  <div className="bg-gradient-to-r from-amber-950/40 via-[#1a1a1a] to-amber-950/40 p-4 rounded-sm border border-amber-500/40 shadow-xl">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-bold uppercase flex items-center gap-1">
                        <Trophy size={11} /> CHAMPIONSHIP • 7:00 PM
                      </span>
                      <span className="text-amber-400 font-bold">Huntington North Trophy</span>
                    </div>
                    <div className="space-y-2 text-sm font-display font-bold pt-1">
                      <div className="flex items-center justify-between text-white">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-[#00BFFF]" />
                          Winner Match 1 (Carroll / Penn)
                        </span>
                        <span className="text-xs font-mono text-[#00BFFF]">M1 Advancer</span>
                      </div>
                      <div className="flex items-center justify-between text-white">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-[#00BFFF]" />
                          Winner Match 2 (Westfield / Crown Point)
                        </span>
                        <span className="text-xs font-mono text-[#00BFFF]">M2 Advancer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bracket 2: Jennings County Site */}
              <div className="bg-[#131313] border border-white/15 rounded-sm p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                      Tournament Bracket B
                    </span>
                    <h3 className="text-xl font-display font-bold text-white uppercase">
                      Jennings County Site
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-white/5 rounded-lg text-xs font-mono text-white/60">
                    Saturday • Oct 31
                  </span>
                </div>

                {/* Bracket Tree Visualizer */}
                <div className="space-y-6 relative py-2">
                  
                  {/* Semifinals */}
                  <div className="space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/50 font-bold block">
                      Round 1: Semifinals
                    </span>

                    {/* M1 */}
                    <div className="bg-black/60 p-3.5 rounded-sm border border-white/10 relative">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-2">
                        <span className="text-amber-400 font-bold">MATCH 1 • 10:30 AM</span>
                        <span>Main Gym</span>
                      </div>
                      <div className="space-y-1.5 text-xs font-display font-bold">
                        <div className="flex items-center justify-between text-white">
                          <span>Floyd Central</span>
                          <span className="text-white/40 font-mono text-[10px]">25-3</span>
                        </div>
                        <div className="flex items-center justify-between text-white/70">
                          <span>Yorktown</span>
                          <span className="text-white/40 font-mono text-[10px]">23-6</span>
                        </div>
                      </div>
                    </div>

                    {/* M2 */}
                    <div className="bg-black/60 p-3.5 rounded-sm border border-white/10 relative">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-2">
                        <span className="text-amber-400 font-bold">MATCH 2 • 12:30 PM</span>
                        <span>Main Gym</span>
                      </div>
                      <div className="space-y-1.5 text-xs font-display font-bold">
                        <div className="flex items-center justify-between text-white">
                          <span>Bloomington South</span>
                          <span className="text-white/40 font-mono text-[10px]">20-7</span>
                        </div>
                        <div className="flex items-center justify-between text-white/70">
                          <span>Center Grove</span>
                          <span className="text-white/40 font-mono text-[10px]">26-4</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400">
                    <span>Both winners advance to tonight&apos;s title bout</span>
                    <ArrowRight size={14} />
                  </div>

                  {/* Championship */}
                  <div className="bg-gradient-to-r from-amber-950/40 via-[#1a1a1a] to-amber-950/40 p-4 rounded-sm border border-amber-500/40 shadow-xl">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-bold uppercase flex items-center gap-1">
                        <Trophy size={11} /> CHAMPIONSHIP • 6:30 PM
                      </span>
                      <span className="text-amber-400 font-bold">Jennings County Trophy</span>
                    </div>
                    <div className="space-y-2 text-sm font-display font-bold pt-1">
                      <div className="flex items-center justify-between text-white">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-amber-400" />
                          Winner Match 1 (Floyd Central / Yorktown)
                        </span>
                        <span className="text-xs font-mono text-amber-400">M1 Advancer</span>
                      </div>
                      <div className="flex items-center justify-between text-white">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-amber-400" />
                          Winner Match 2 (Bloomington South / Center Grove)
                        </span>
                        <span className="text-xs font-mono text-amber-400">M2 Advancer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default TournamentCentral;
