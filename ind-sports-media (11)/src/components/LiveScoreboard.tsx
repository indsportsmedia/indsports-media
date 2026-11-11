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
  Edit3,
  Save,
  Copy,
  Sparkles,
  Camera,
  Film,
  UploadCloud,
  X,
  MessageSquare,
  CloudLightning,
  Wifi,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';
import brownsburgLogo from '../assets/brownsburg_bulldog.jpg';
import lawrenceNorthLogo from '../assets/lawrence_north_wildcats.png';
import southsideLogo from '../assets/southside_archers.jpg';
import marionLogo from '../assets/marion_giants.jpg';
import TournamentCentral from './TournamentCentral';
import { 
  subscribeToGames, 
  syncGameToFirestore, 
  seedInitialGamesIfEmpty, 
  testFirestoreConnection,
  compressImageFile,
  compressImageToBlob,
  uploadPhotoToFirestore,
  uploadMediaFile,
  uploadBase64Image,
  updateHighlightDetails,
  deleteMediaHighlight
} from '../lib/firebase';
import { useStaff, signInStaff, signOutStaff } from '../lib/staff';
import TeamLogo from './TeamLogo';
import { useLiveGames } from '../lib/gamesStore';
import GamesBoard from './GamesBoard';
import { whenLabel } from '../lib/gameTime';
import { displayClock } from '../lib/scorekeeper';
import { subscribeToUpdates, formatTime, type LiveUpdate } from '../lib/articles';
import type { PlayEvent, SocialClip, GameState } from '../types';

export type { PlayEvent, SocialClip, GameState };

export const DEFAULT_GAMES_LIST: GameState[] = [
  // =========================================================================
  // TONIGHT: FIRST ROUND OF SECTIONALS (7:00 PM KICKOFF)
  // =========================================================================
  {
    id: 'westfield-vs-carmel-sectionals-2026',
    sport: 'Varsity Football',
    title: 'IHSAA Sectionals • Round 1 (Class 6A Sectional 4)',
    venue: 'Riverview Health Stadium at Westfield • Westfield, IN',
    dateString: 'Tonight • 7:00 PM Kickoff',
    week: 'Sectionals R1',
    season: '2026 IHSAA Football Tournament',
    isArchived: false,
    isLive: true,
    statusText: '7:00 PM TONIGHT',
    quarter: 'Pre-Game',
    clock: '7:00 PM',
    homeTeam: {
      name: 'Westfield Shamrocks',
      shortName: 'Westfield',
      mascot: 'Shamrocks',
      record: '8-1',
      color: '#00843D',
      textColor: '#FFD100',
      logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80',
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
      name: 'Carmel Greyhounds',
      shortName: 'Carmel',
      mascot: 'Greyhounds',
      record: '6-3',
      color: '#002D62',
      textColor: '#C5B358',
      logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80',
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
    ballOn: 'WST 35',
    redZone: false,
    lastPlay: 'Pregame warmups underway at Riverview Health Stadium for Sectionals Round 1.',
    plays: [],
    socialClips: [
      {
        id: 'clip-wst-carmel-pre',
        platform: 'upload',
        type: 'photo',
        title: 'Sectionals R1 Pregame Warmups: Westfield vs Carmel',
        author: 'Brandon Blume (IND Field Staff)',
        mediaUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        caption: 'Packed house in Westfield for tonight\'s 6A Sectional opener! #SectionalsTonight #INDMedia',
        time: 'Pregame • 6:40 PM',
        team: 'home',
        likes: 54,
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'avon-vs-ben-davis-sectionals-2026',
    sport: 'Varsity Football',
    title: 'IHSAA Sectionals • Round 1 (Class 6A Sectional 5)',
    venue: 'Orioles Stadium at Avon • Avon, IN',
    dateString: 'Tonight • 7:00 PM Kickoff',
    week: 'Sectionals R1',
    season: '2026 IHSAA Football Tournament',
    isArchived: false,
    isLive: true,
    statusText: '7:00 PM TONIGHT',
    quarter: 'Pre-Game',
    clock: '7:00 PM',
    homeTeam: {
      name: 'Avon Orioles',
      shortName: 'Avon',
      mascot: 'Orioles',
      record: '7-2',
      color: '#1A1A1A',
      textColor: '#FFC72C',
      logoUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=300&q=80',
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
      name: 'Ben Davis Giants',
      shortName: 'Ben Davis',
      mascot: 'Giants',
      record: '5-4',
      color: '#4B2E83',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=300&q=80',
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
    ballOn: 'AVN 35',
    redZone: false,
    lastPlay: 'Orioles Stadium student section filling in. Kickoff set for 7:00 PM.',
    plays: [],
    socialClips: [
      {
        id: 'clip-avon-bd-pre',
        platform: 'upload',
        type: 'photo',
        title: 'Avon vs Ben Davis Sectional Spotlight',
        author: 'IND Sideline Crew',
        mediaUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1000&q=80',
        url: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1000&q=80',
        caption: 'West-side Sectional 1st round clash between Avon and Ben Davis! #INDLiveScore',
        time: 'Pregame • 6:45 PM',
        team: 'home',
        likes: 38,
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'snider-vs-southside-sectionals-2026',
    sport: 'Varsity Football',
    title: 'IHSAA Sectionals • Round 1 (Fort Wayne Showdown)',
    venue: 'Spuller Stadium at Snider • Fort Wayne, IN',
    dateString: 'Tonight • 7:00 PM Kickoff',
    week: 'Sectionals R1',
    season: '2026 IHSAA Football Tournament',
    isArchived: false,
    isLive: true,
    statusText: '7:00 PM TONIGHT',
    quarter: 'Pre-Game',
    clock: '7:00 PM',
    homeTeam: {
      name: 'FW Snider Panthers',
      shortName: 'FW Snider',
      mascot: 'Panthers',
      record: '7-2',
      color: '#1A1A1A',
      textColor: '#F1B82D',
      logoUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=300&q=80',
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
      name: 'South Side Archers',
      shortName: 'South Side',
      mascot: 'Archers',
      record: '4-5',
      color: '#0F5132',
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
    possession: 'home',
    down: '1st',
    distance: '10',
    ballOn: 'SNID 35',
    redZone: false,
    lastPlay: 'Historic Fort Wayne rivalry opens postseason play at Spuller Stadium.',
    plays: [],
    socialClips: []
  },

  // =========================================================================
  // TOMORROW: SATURDAY VOLLEYBALL TOURNAMENT (HUNTINGTON NORTH SITE)
  // =========================================================================
  {
    id: 'vb-huntington-m1-carroll-vs-penn',
    sport: 'Varsity Volleyball',
    title: 'Huntington North Tournament • Match 1 (Semifinal)',
    venue: 'Huntington North Arena • Huntington, IN',
    dateString: 'Saturday • 10:00 AM',
    week: 'Volleyball Tournament',
    season: '2026 IHSAA Postseason',
    isArchived: false,
    isLive: false,
    statusText: 'SAT 10:00 AM',
    quarter: 'Match 1',
    clock: '10:00 AM',
    homeTeam: {
      name: 'Carroll (Fort Wayne)',
      shortName: 'Carroll (FW)',
      mascot: 'Chargers',
      record: '24-4',
      color: '#0033A0',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    awayTeam: {
      name: 'Penn Kingsmen',
      shortName: 'Penn',
      mascot: 'Kingsmen',
      record: '22-6',
      color: '#111111',
      textColor: '#C5B358',
      logoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    possession: 'home',
    down: 'Set 1',
    distance: '0-0',
    ballOn: 'Court 1',
    redZone: false,
    lastPlay: 'Huntington North Tournament Match 1 scheduled for 10:00 AM Saturday.',
    plays: [],
    socialClips: []
  },
  {
    id: 'vb-huntington-m2-westfield-vs-crownpoint',
    sport: 'Varsity Volleyball',
    title: 'Huntington North Tournament • Match 2 (Semifinal)',
    venue: 'Huntington North Arena • Huntington, IN',
    dateString: 'Saturday • 12:00 PM',
    week: 'Volleyball Tournament',
    season: '2026 IHSAA Postseason',
    isArchived: false,
    isLive: false,
    statusText: 'SAT 12:00 PM',
    quarter: 'Match 2',
    clock: '12:00 PM',
    homeTeam: {
      name: 'Westfield Shamrocks',
      shortName: 'Westfield',
      mascot: 'Shamrocks',
      record: '23-5',
      color: '#00843D',
      textColor: '#FFD100',
      logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    awayTeam: {
      name: 'Crown Point Bulldogs',
      shortName: 'Crown Point',
      mascot: 'Bulldogs',
      record: '21-7',
      color: '#C8102E',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    possession: 'home',
    down: 'Set 1',
    distance: '0-0',
    ballOn: 'Court 1',
    redZone: false,
    lastPlay: 'Winner advances to Huntington North Championship Match at 7:00 PM.',
    plays: [],
    socialClips: []
  },
  {
    id: 'vb-huntington-champ',
    sport: 'Varsity Volleyball',
    title: 'Huntington North Tournament • Championship Match',
    venue: 'Huntington North Arena • Huntington, IN',
    dateString: 'Saturday • 7:00 PM Championship',
    week: 'Volleyball Tournament',
    season: '2026 IHSAA Postseason',
    isArchived: false,
    isLive: false,
    statusText: 'CHAMPIONSHIP 7:00 PM',
    quarter: 'Championship',
    clock: '7:00 PM',
    homeTeam: {
      name: 'M1 Winner (Carroll or Penn)',
      shortName: 'M1 Winner',
      mascot: 'Advancer',
      record: 'Semifinal Winner',
      color: '#00BFFF',
      textColor: '#000000',
      logoUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    awayTeam: {
      name: 'M2 Winner (Westfield or Crown Point)',
      shortName: 'M2 Winner',
      mascot: 'Advancer',
      record: 'Semifinal Winner',
      color: '#FFD700',
      textColor: '#000000',
      logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    possession: 'home',
    down: 'Set 1',
    distance: '0-0',
    ballOn: 'Championship Court',
    redZone: false,
    lastPlay: 'Huntington North Championship Trophy match Saturday night at 7:00 PM.',
    plays: [],
    socialClips: []
  },

  // =========================================================================
  // TOMORROW: SATURDAY VOLLEYBALL TOURNAMENT (JENNINGS COUNTY SITE)
  // =========================================================================
  {
    id: 'vb-jennings-m1-floydcentral-vs-yorktown',
    sport: 'Varsity Volleyball',
    title: 'Jennings County Tournament • Match 1 (Semifinal)',
    venue: 'Jennings County Gymnasium • North Vernon, IN',
    dateString: 'Saturday • 10:30 AM',
    week: 'Volleyball Tournament',
    season: '2026 IHSAA Postseason',
    isArchived: false,
    isLive: false,
    statusText: 'SAT 10:30 AM',
    quarter: 'Match 1',
    clock: '10:30 AM',
    homeTeam: {
      name: 'Floyd Central Highlanders',
      shortName: 'Floyd Central',
      mascot: 'Highlanders',
      record: '25-3',
      color: '#1B4D3E',
      textColor: '#F5BD02',
      logoUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    awayTeam: {
      name: 'Yorktown Tigers',
      shortName: 'Yorktown',
      mascot: 'Tigers',
      record: '23-6',
      color: '#006341',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    possession: 'home',
    down: 'Set 1',
    distance: '0-0',
    ballOn: 'Main Gym',
    redZone: false,
    lastPlay: 'Jennings County Tournament Match 1 scheduled for 10:30 AM Saturday.',
    plays: [],
    socialClips: []
  },
  {
    id: 'vb-jennings-m2-bloomingtonsouth-vs-centergrove',
    sport: 'Varsity Volleyball',
    title: 'Jennings County Tournament • Match 2 (Semifinal)',
    venue: 'Jennings County Gymnasium • North Vernon, IN',
    dateString: 'Saturday • 12:30 PM',
    week: 'Volleyball Tournament',
    season: '2026 IHSAA Postseason',
    isArchived: false,
    isLive: false,
    statusText: 'SAT 12:30 PM',
    quarter: 'Match 2',
    clock: '12:30 PM',
    homeTeam: {
      name: 'Bloomington South Panthers',
      shortName: 'Bloomington South',
      mascot: 'Panthers',
      record: '20-7',
      color: '#512888',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    awayTeam: {
      name: 'Center Grove Trojans',
      shortName: 'Center Grove',
      mascot: 'Trojans',
      record: '26-4',
      color: '#990000',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    possession: 'home',
    down: 'Set 1',
    distance: '0-0',
    ballOn: 'Main Gym',
    redZone: false,
    lastPlay: 'Winner advances to Jennings County Championship Match at 6:30 PM.',
    plays: [],
    socialClips: []
  },
  {
    id: 'vb-jennings-champ',
    sport: 'Varsity Volleyball',
    title: 'Jennings County Tournament • Championship Match',
    venue: 'Jennings County Gymnasium • North Vernon, IN',
    dateString: 'Saturday • 6:30 PM Championship',
    week: 'Volleyball Tournament',
    season: '2026 IHSAA Postseason',
    isArchived: false,
    isLive: false,
    statusText: 'CHAMPIONSHIP 6:30 PM',
    quarter: 'Championship',
    clock: '6:30 PM',
    homeTeam: {
      name: 'M1 Winner (Floyd Central or Yorktown)',
      shortName: 'M1 Winner',
      mascot: 'Advancer',
      record: 'Semifinal Winner',
      color: '#00BFFF',
      textColor: '#000000',
      logoUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    awayTeam: {
      name: 'M2 Winner (Bloomington South or Center Grove)',
      shortName: 'M2 Winner',
      mascot: 'Advancer',
      record: 'Semifinal Winner',
      color: '#FFD700',
      textColor: '#000000',
      logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    possession: 'home',
    down: 'Set 1',
    distance: '0-0',
    ballOn: 'Championship Court',
    redZone: false,
    lastPlay: 'Jennings County Championship Trophy match Saturday night at 6:30 PM.',
    plays: [],
    socialClips: []
  },

  // =========================================================================
  // REGULAR SEASON SHOWCASES
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
        title: 'Bob Tully Field Packed Student Section & Coin Toss',
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
        title: 'Pregame Tunnel Walkout & Student Section',
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
        title: 'Bulldogs Warmups Under the Friday Night Lights',
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
        title: 'Archers Marching Band Entrance',
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
  initialGameId?: string;
  /** Tells the page which game is open, so the ticker can highlight it. */
  onGameChange?: (gameId: string) => void;
}

export default function LiveScoreboard({ onBack, initialGameId, onGameChange }: LiveScoreboardProps) {
  // Games come from the one shared live feed (same source as the score ticker).
  const { games: liveGames, loaded: gamesLoaded } = useLiveGames();
  const [games, setGames] = useState<GameState[]>(liveGames);
  useEffect(() => {
    if (gamesLoaded) setGames(liveGames);
  }, [liveGames, gamesLoaded]);

  const [selectedGameId, setSelectedGameId] = useState<string>(initialGameId || '');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  useEffect(() => {
    if (initialGameId) {
      setSelectedGameId(initialGameId);
    }
  }, [initialGameId]);

  // Currently active game: the one asked for, else a live game, else the newest.
  const activeGame =
    games.find(g => g.id === selectedGameId) ||
    games.find(g => g.isLive && !g.isArchived) ||
    [...games].filter(g => !g.isArchived).sort((x, y) => (y.updatedAt || '').localeCompare(x.updatedAt || ''))[0] ||
    games[0] ||
    DEFAULT_GAMES_LIST[0];
  useEffect(() => {
    if (gamesLoaded && activeGame?.id) onGameChange?.(activeGame.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame?.id, gamesLoaded]);

  // Basketball clock counts down on each viewer's screen (set by /score).
  const [, setClockTick] = useState(0);
  useEffect(() => {
    if (!activeGame?.clockRunning) return;
    const t = setInterval(() => setClockTick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, [activeGame?.clockRunning, activeGame?.id]);

  // Hidden staff access
  // Staff access: Google sign-in + staff allowlist (see src/lib/staff.ts).
  // The old PIN lived in public code and could be read by anyone.
  const staffAuth = useStaff();
  const isAuthorized = staffAuth.isStaff;
  const setIsAuthorized = (value: boolean) => {
    if (!value) signOutStaff().catch(console.warn);
  };

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'highlights' | 'boxscore' | 'stats'>('highlights');
  const [isClockRunning, setIsClockRunning] = useState(false);

  // In-Stands Frictionless 2-Step Story Uploader State
  const [storyMedia, setStoryMedia] = useState<{ url: string; type: 'photo' | 'video'; file?: File | Blob } | null>(null);
  const [storyCaption, setStoryCaption] = useState('');
  const [storyTeam, setStoryTeam] = useState<'home' | 'away' | 'neutral'>('neutral');
  const [isPostingStory, setIsPostingStory] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [clipFilter, setClipFilter] = useState<'all' | 'home' | 'away'>('all');
  const [storyUpdates, setStoryUpdates] = useState<LiveUpdate[]>([]);
  useEffect(() => {
    if (!activeGame?.articleSlug) { setStoryUpdates([]); return; }
    return subscribeToUpdates(activeGame.articleSlug, setStoryUpdates);
  }, [activeGame?.articleSlug]);
  const [previewMediaModal, setPreviewMediaModal] = useState<SocialClip | null>(null);
  const [likedClips, setLikedClips] = useState<Record<string, boolean>>({});

  // Real-Time Highlight Edit Modal State for Sideline Operators
  const [editingClip, setEditingClip] = useState<{
    id: string;
    title: string;
    caption: string;
    team: 'home' | 'away' | 'neutral';
    mediaUrl?: string;
    type?: string;
  } | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  
  // Week & Tournament Archive Filtering (Default to Tonight's Sectionals)
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('Sectionals');

  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(true);


  // Broadcast single game update to Firebase Firestore and Express backend
  const broadcastGameUpdate = async (updatedGame: GameState) => {
    // 1. Optimistic local state update
    setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));

    // 2. Push to Firebase Firestore (instantly pushes via onSnapshot to every device)
    try {
      await syncGameToFirestore(updatedGame);
      setFirestoreConnected(true);
    } catch (e: any) {
      console.warn('Could not sync to Firebase Firestore:', e);
      setFirestoreConnected(false);
      throw e;
    }

    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
      if (delta === 6) playDesc = `TOUCHDOWN ${targetTeam.shortName}! (+6 pts)`;
      else if (delta === 1) playDesc = `Extra Point (PAT) GOOD for ${targetTeam.shortName}. (+1 pt)`;
      else if (delta === 2) playDesc = `2-Point Conversion SUCCESSFUL for ${targetTeam.shortName}! (+2 pts)`;
      else if (delta === 3) playDesc = `Field Goal GOOD for ${targetTeam.shortName}! (+3 pts)`;
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
        if (file.size > 40 * 1024 * 1024) {
          alert('Video is large (>40MB). For faster sideline upload on stadium cellular data, 10-30 second clips are recommended.');
        }
        const previewUrl = URL.createObjectURL(file);
        setStoryMedia({
          url: previewUrl,
          type: 'video',
          file
        });
      } else {
        // Compress client-side into both preview dataUrl and compact binary Blob (<200KB)
        const compressedDataUrl = await compressImageFile(file, 1400, 0.85);
        const compressedBlob = await compressImageToBlob(file, 1400, 0.85);
        setStoryMedia({
          url: compressedDataUrl,
          type: 'photo',
          file: compressedBlob
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
    setUploadProgress(0);

    try {
      let finalStorageUrl = '';

      // STEP A: Upload the binary file/blob to Firebase Cloud Storage with real byte progress
      if (storyMedia.file) {
        finalStorageUrl = await uploadMediaFile(
          storyMedia.file,
          storyMedia.type === 'video' ? 'videos' : 'highlights',
          (pct) => setUploadProgress(pct)
        );
      } else if (storyMedia.url.startsWith('http')) {
        finalStorageUrl = storyMedia.url;
      } else if (storyMedia.url.startsWith('data:')) {
        finalStorageUrl = await uploadBase64Image(
          storyMedia.url,
          'highlights',
          (pct) => setUploadProgress(pct)
        );
      }

      // Strict validation: Must have received a public HTTPS storage URL
      if (!finalStorageUrl || !finalStorageUrl.startsWith('http') || finalStorageUrl.startsWith('data:')) {
        throw new Error('Firebase Storage did not return a valid download URL. Please check Firebase Storage Security Rules in your Firebase Console.');
      }

      setUploadProgress(100);

      const autoTags = getMatchupHashtags();
      const userText = storyCaption.trim();
      const fullCaption = userText ? `${userText}\n\n${autoTags}` : autoTags;
      const headline = userText.length > 0 
        ? (userText.length > 40 ? userText.slice(0, 40) + '...' : userText)
        : (storyMedia.type === 'video' ? 'Sideline Game Highlight' : 'Sideline Photo');

      // Lightweight clip metadata (storing strictly the short public download URL)
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

      // Strip any legacy base64 entries from local clip history to keep Firestore doc <50KB
      const cleanExistingClips = (activeGame.socialClips || []).filter(c => !c.mediaUrl?.startsWith('data:') && !c.url?.startsWith('data:'));

      const updatedGame: GameState = {
        ...activeGame,
        socialClips: [newClip, ...cleanExistingClips]
      };

      // STEP B: Write ONLY clean metadata & short download link to Firestore
      await broadcastGameUpdate(updatedGame);

      // STEP C: Also sync the short Storage URL to the global Photos Gallery if it's a photo
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

      // Reset story form
      setTimeout(() => {
        setStoryMedia(null);
        setStoryCaption('');
        setStoryTeam('neutral');
        setUploadProgress(null);
        setActiveTab('highlights');
        alert('Posted! Your highlight is live across all scoreboards.');
      }, 300);

    } catch (err: any) {
      console.error('Error publishing story highlight:', err);
      const msg = err?.message || 'Check stadium cellular connection and Firebase Storage permissions.';
      alert(`Upload Error:\n${msg}`);
    } finally {
      setIsPostingStory(false);
      setUploadProgress(null);
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

  // Edit highlight details across all devices in real-time
  const handleOpenEditClip = (clip: SocialClip) => {
    setEditingClip({
      id: clip.id,
      title: clip.title,
      caption: clip.caption || '',
      team: clip.team || 'neutral',
      mediaUrl: clip.mediaUrl || clip.url,
      type: clip.type
    });
  };

  const handleSaveClipEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingClip) return;
    setIsSavingEdit(true);
    try {
      await updateHighlightDetails(activeGame.id, editingClip.id, {
        title: editingClip.title,
        caption: editingClip.caption,
        team: editingClip.team
      });
      // Also update local state for immediate feedback
      const updatedGame: GameState = {
        ...activeGame,
        socialClips: (activeGame.socialClips || []).map(c => 
          c.id === editingClip.id 
            ? { ...c, title: editingClip.title, caption: editingClip.caption, team: editingClip.team }
            : c
        )
      };
      setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
      setEditingClip(null);
    } catch (err: any) {
      console.error('Failed to update highlight details:', err);
      alert(`Failed to update highlight:\n${err?.message || 'Please check network connection.'}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete a clip across devices and clean up Firebase Storage
  const handleDeleteClip = async (clipId: string, mediaUrl?: string) => {
    if (window.confirm('Delete this highlight from the live feed and remove media from Cloud Storage?')) {
      try {
        await deleteMediaHighlight('games', clipId, mediaUrl, activeGame.id);
        // Immediate local state update
        const updatedGame: GameState = {
          ...activeGame,
          socialClips: (activeGame.socialClips || []).filter(c => c.id !== clipId)
        };
        setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
      } catch (err) {
        console.error('Failed to delete highlight:', err);
        // Fallback local broadcast
        const updatedGame: GameState = {
          ...activeGame,
          socialClips: (activeGame.socialClips || []).filter(c => c.id !== clipId)
        };
        await broadcastGameUpdate(updatedGame);
      }
    }
  };

  // Filtered clips
  // Photos and videos posted to this game's live story (Newsroom → Live) show
  // here automatically, newest first, ahead of any older uploaded clips.
  const storyClips: SocialClip[] = storyUpdates
    .filter((u) => u.mediaUrl)
    .map((u) => {
      const t = (u.text || '').toLowerCase();
      const homeHit = t.includes((activeGame.homeTeam.shortName || '').toLowerCase());
      const awayHit = t.includes((activeGame.awayTeam.shortName || '').toLowerCase());
      return {
        id: `story-${u.id}`,
        platform: 'upload' as const,
        type: u.mediaType === 'video' ? ('video' as const) : ('photo' as const),
        title: u.text ? u.text.split('\n')[0].slice(0, 90) : activeGame.title,
        author: u.authorName,
        mediaUrl: u.mediaUrl,
        thumbnailUrl: u.mediaType === 'video' ? undefined : u.mediaUrl,
        caption: u.text || '',
        time: formatTime(u.createdAt),
        team: homeHit && !awayHit ? ('home' as const) : awayHit && !homeHit ? ('away' as const) : ('neutral' as const),
        likes: 0,
        createdAt: u.createdAt?.toDate?.().toISOString?.() || new Date().toISOString(),
      };
    });
  const currentClips = [...storyClips, ...(activeGame.socialClips || [])];
  const filteredClips = currentClips.filter(c => {
    if (clipFilter === 'home') return c.team === 'home';
    if (clipFilter === 'away') return c.team === 'away';
    return true;
  });

  if (!gamesLoaded) {
    return <div className="min-h-screen bg-black pt-24 text-center text-mute">Loading scores…</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-24 font-sans selection:bg-[#00BFFF] selection:text-black">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-display font-bold uppercase tracking-wider group cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#00BFFF]" />
            Back to Home
          </button>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        

        {/* ========================================================================= */}
        {/* MAIN PUBLIC SCOREBOARD DISPLAY (game header, broadcast style) */}
        {/* ========================================================================= */}
        <section className="mb-6 bg-panel border border-rule rounded-sm overflow-hidden" aria-label="Scoreboard">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 sm:px-6 py-2.5 border-b border-rule text-[14px]">
            <p className="text-white/85 min-w-0">
              <span className="text-ind font-semibold mr-2">{activeGame.sport}</span>
              {activeGame.title}
            </p>
            <p className="text-mute">
              {activeGame.venue}
              {(activeGame.startsAt || activeGame.dateString) && <span className="ml-3">{activeGame.startsAt ? whenLabel(activeGame) : activeGame.dateString}</span>}
            </p>
          </div>

          {(() => {
            const away = activeGame.awayTeam;
            const home = activeGame.homeTeam;
            const isFinal = !activeGame.isLive && /final/i.test(activeGame.statusText || activeGame.quarter || '');
            const awayLeads = away.score > home.score;
            const homeLeads = home.score > away.score;
            const scoreClass = (leading: boolean) =>
              `font-display font-bold tabular leading-none text-[72px] lg:text-[88px] ${isFinal && !leading ? 'text-white/45' : 'text-white'}`;
            const statusBlock = (big: boolean) =>
              activeGame.isLive ? (
                <div className={big ? 'text-center' : 'flex items-center gap-3'}>
                  <span className="inline-flex items-center gap-1.5 bg-[#E4002B] text-white font-display font-semibold text-[13px] px-2 py-0.5 rounded-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse motion-reduce:animate-none" aria-hidden />
                    LIVE
                  </span>
                  <p className={`${big ? 'mt-2 text-lg' : 'text-[15px]'} font-display font-semibold uppercase text-white`}>{activeGame.quarter}</p>
                  {/volley/i.test(activeGame.sport) ? (
                    <p className={`${big ? 'text-base' : 'text-[14px]'} text-white/75 tabular`}>
                      Sets {activeGame.awaySetsWon || 0}-{activeGame.homeSetsWon || 0}
                    </p>
                  ) : /basket/i.test(activeGame.sport) || /:/.test(activeGame.clock || '') ? (
                    <p className={`${big ? 'text-2xl' : 'text-[15px]'} font-display text-ind tabular`}>{displayClock(activeGame)}</p>
                  ) : null}
                </div>
              ) : (
                <p className={`font-display font-semibold uppercase text-white ${big ? 'text-xl text-center' : 'text-[15px]'}`}>
                  {!activeGame.isLive && activeGame.startsAt && !/final/i.test(`${activeGame.quarter} ${activeGame.statusText}`)
                    ? whenLabel(activeGame)
                    : activeGame.statusText || activeGame.quarter}
                </p>
              );

            // Phones: stacked rows so full school names fit.
            const Row = ({ team, side, leading }: { team: typeof home; side: 'home' | 'away'; leading: boolean }) => (
              <div className="flex items-center gap-3 py-3">
                <TeamLogo name={team.name} url={team.logoUrl} color={team.color} className="w-11 h-11" textClass="text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold uppercase text-white text-[19px] leading-tight break-words">
                    {team.name}
                    {activeGame.isLive && activeGame.possession === side && (
                      <span className="ml-2 align-middle inline-block w-2 h-2 rounded-full bg-ind" title="Has the ball" />
                    )}
                  </p>
                  <p className="text-mute text-[13px]">
                    {team.mascot}
                    {team.record && <span className="ml-2 tabular">({team.record})</span>}
                  </p>
                </div>
                <span className={`font-display font-bold tabular text-[44px] leading-none ${isFinal && !leading ? 'text-white/45' : 'text-white'}`}>
                  {team.score}
                </span>
              </div>
            );

            // Tablets and up: side-by-side broadcast layout.
            const Side = ({ team, side }: { team: typeof home; side: 'home' | 'away' }) => (
              <div className={`flex items-center gap-5 min-w-0 ${side === 'home' ? 'flex-row-reverse text-right' : ''}`}>
                <TeamLogo name={team.name} url={team.logoUrl} color={team.color} className="w-16 h-16 lg:w-20 lg:h-20" textClass="text-xl" />
                <div className="min-w-0">
                  <p className="font-display font-semibold uppercase text-white text-2xl lg:text-3xl leading-tight">{team.name}</p>
                  <p className="text-mute text-sm">
                    {team.mascot}
                    {team.record && <span className="ml-2 tabular">({team.record})</span>}
                  </p>
                  {activeGame.isLive && activeGame.possession === side && (
                    <p className="mt-1 text-ind text-[13px] font-semibold">Ball</p>
                  )}
                </div>
              </div>
            );
            return (
              <>
                <div className="sm:hidden px-4 pt-3 pb-1">
                  {statusBlock(false)}
                  <div className="divide-y divide-rule">
                    <Row team={away} side="away" leading={awayLeads} />
                    <Row team={home} side="home" leading={homeLeads} />
                  </div>
                </div>
                <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-6 px-8 py-9">
                  <Side team={away} side="away" />
                  <span className={scoreClass(awayLeads)}>{away.score}</span>
                  <div className="px-4 min-w-[96px]">{statusBlock(true)}</div>
                  <span className={scoreClass(homeLeads)}>{home.score}</span>
                  <Side team={home} side="home" />
                </div>
              </>
            );
          })()}

          {activeGame.isLive && /football/i.test(activeGame.sport) && activeGame.down && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 sm:px-6 py-2.5 border-t border-rule text-[14px]">
              <span className="font-display font-semibold uppercase text-white">
                {activeGame.down} &amp; {activeGame.distance}
              </span>
              {activeGame.ballOn && <span className="text-white/75">Ball on {activeGame.ballOn}</span>}
              <span className="text-white/75">
                {(activeGame.possession === 'home' ? activeGame.homeTeam : activeGame.awayTeam).shortName} ball
              </span>
              {activeGame.redZone && (
                <span className="bg-[#E4002B] text-white font-display font-semibold text-[12px] px-2 py-0.5 rounded-sm">RED ZONE</span>
              )}
            </div>
          )}

          {activeGame.lastPlay && (
            <div className="px-4 sm:px-6 py-3 border-t border-rule bg-black/40 text-[15px]">
              <span className="text-mute mr-2">Last play</span>
              <span className="text-white">{activeGame.lastPlay}</span>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* TABBED INTERFACE: LIVE HIGHLIGHTS / BOX SCORE / STATS */}
        {/* ========================================================================= */}
        <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 bg-[#161616]">
            <button
              onClick={() => setActiveTab('highlights')}
              className={`flex-1 py-4 text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'highlights' 
                  ? 'bg-[#121212] text-[#00BFFF] border-b-2 border-[#00BFFF]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={16} /> 
              <span>LIVE CLIPS & SOCIAL STREAM</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans tabular bg-[#00BFFF]/20 text-[#00BFFF]">
                {currentClips.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('boxscore')}
              className={`flex-1 py-4 text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'boxscore' 
                  ? 'bg-[#121212] text-[#00BFFF] border-b-2 border-[#00BFFF]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy size={16} /> BOX SCORE BREAKDOWN
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-4 text-xs sm:text-sm font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
                    <h4 className="text-xs font-sans tabular font-bold uppercase tracking-wide text-[#00BFFF] flex items-center gap-2 mb-1">
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
                      className={`px-3 py-1 rounded text-xs font-display font-bold uppercase transition-all cursor-pointer ${
                        clipFilter === 'all' ? 'bg-[#00BFFF] text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      All Clips
                    </button>
                    <button
                      onClick={() => setClipFilter('home')}
                      className={`px-3 py-1 rounded text-xs font-display font-bold uppercase transition-all cursor-pointer ${
                        clipFilter === 'home' ? 'bg-[#00BFFF] text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {activeGame.homeTeam.shortName}
                    </button>
                    <button
                      onClick={() => setClipFilter('away')}
                      className={`px-3 py-1 rounded text-xs font-display font-bold uppercase transition-all cursor-pointer ${
                        clipFilter === 'away' ? 'bg-[#00BFFF] text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {activeGame.awayTeam.shortName}
                    </button>
                  </div>
                </div>

                {filteredClips.length === 0 ? (
                  <div className="text-center py-16 bg-white/[0.02] border border-dashed border-white/10 rounded-sm">
                    <Video size={36} className="text-white/20 mx-auto mb-3" />
                    <h5 className="font-display font-bold uppercase text-sm text-white/60 mb-1">No highlights uploaded for this filter yet</h5>
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
                          className="bg-[#181818] border border-white/10 hover:border-[#00BFFF]/40 rounded-sm overflow-hidden shadow-xl transition-all flex flex-col group"
                        >
                          {/* Media Preview Area */}
                          <div className="relative aspect-video bg-black overflow-hidden cursor-pointer" onClick={() => setPreviewMediaModal(clip)}>
                            {clip.type === 'video' && clip.mediaUrl && !clip.thumbnailUrl ? (
                              <video
                                src={`${clip.mediaUrl}#t=0.5`}
                                muted
                                playsInline
                                preload="metadata"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={clip.thumbnailUrl || clip.mediaUrl || '/logo.png'}
                                alt={clip.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* Play Button Overlay for Videos */}
                            {clip.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-12 h-12 rounded-full bg-[#00BFFF]/90 text-black flex items-center justify-center shadow-lg/50 group-hover:scale-110 transition-transform">
                                  <Play size={20} className="fill-black ml-0.5" />
                                </div>
                              </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                              <span className={`text-[10px] font-sans tabular uppercase px-2 py-0.5 rounded font-bold tracking-wide shadow ${
                                isHome ? 'bg-red-600 text-white' : isAway ? 'bg-purple-600 text-white' : 'bg-[#00BFFF] text-black'
                              }`}>
                                {teamTag}
                              </span>
                              <span className="text-[10px] font-sans tabular bg-black/80 text-white/80 px-2 py-0.5 rounded border border-white/20">
                                {clip.time}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3 z-10">
                              <span className="text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-white/90 border border-white/20 flex items-center gap-1">
                                {clip.platform === 'x' && '𝕏 Post'}
                                {clip.platform === 'instagram' && 'IG Reel'}
                                {clip.platform === 'tiktok' && 'TikTok'}
                                {clip.platform === 'youtube' && '▶YT Short'}
                                {clip.platform === 'upload' && 'Sideline'}
                              </span>
                            </div>
                          </div>

                          {/* Info Area */}
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h5 className="font-display font-bold uppercase text-sm text-white tracking-wide mb-1.5 group-hover:text-[#00BFFF] transition-colors line-clamp-2">
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
                                  className={`flex items-center gap-1 font-sans tabular cursor-pointer transition-colors ${
                                    likedClips[clip.id] ? 'text-red-400 font-bold' : 'text-white/60 hover:text-red-400'
                                  }`}
                                >
                                  <Heart size={14} className={likedClips[clip.id] ? 'fill-red-400' : ''} />
                                  <span>{clip.likes}</span>
                                </button>

                                {/* Staff author */}
                                <span className="text-[11px] font-sans tabular text-white/40 truncate max-w-[110px]">
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
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditClip(clip)}
                                      className="p-1.5 text-[#00BFFF] hover:text-white bg-[#00BFFF]/10 hover:bg-[#00BFFF]/30 rounded transition-colors cursor-pointer"
                                      title="Edit highlight details (staff only)"
                                    >
                                      <Edit3 size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteClip(clip.id, clip.mediaUrl || clip.url)}
                                      className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 rounded transition-colors cursor-pointer"
                                      title="Delete clip (staff only)"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </>
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
                <h4 className="text-xs font-sans tabular font-bold uppercase tracking-wide text-white/50 mb-6">
                  QUARTER-BY-QUARTER SCORING TABLE
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans tabular text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs">
                        <th className="py-3 px-4 font-bold">TEAM</th>
                        <th className="py-3 px-4 text-center">Q1</th>
                        <th className="py-3 px-4 text-center">Q2</th>
                        <th className="py-3 px-4 text-center">Q3</th>
                        <th className="py-3 px-4 text-center">Q4</th>
                        <th className="py-3 px-4 text-center">OT</th>
                        <th className="py-3 px-4 text-center font-bold text-white">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 bg-white/5">
                        <td className="py-4 px-4 font-display font-bold text-white flex items-center gap-3">
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
                        <td className="py-4 px-4 text-center font-display font-bold text-xl text-white">{activeGame.homeTeam.score}</td>
                      </tr>
                      <tr className="border-b border-white/5 bg-black/40">
                        <td className="py-4 px-4 font-display font-bold text-white flex items-center gap-3">
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
                        <td className="py-4 px-4 text-center font-display font-bold text-xl text-white">{activeGame.awayTeam.score}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. TEAM STAT COMPARISON */}
            {activeTab === 'stats' && (
              <div>
                <h4 className="text-xs font-sans tabular font-bold uppercase tracking-wide text-white/50 mb-6">
                  IN-GAME METRIC COMPARISON
                </h4>

                <div className="space-y-6 max-w-2xl mx-auto">
                  
                  {/* Passing Yards */}
                  <div>
                    <div className="flex justify-between text-xs font-sans tabular mb-1.5">
                      <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.passingYds} YDS</span>
                      <span className="text-white/60 uppercase font-bold">Passing Yards</span>
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
                    <div className="flex justify-between text-xs font-sans tabular mb-1.5">
                      <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.rushingYds} YDS</span>
                      <span className="text-white/60 uppercase font-bold">Rushing Yards</span>
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
                    <div className="flex justify-between text-xs font-sans tabular mb-1.5">
                      <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.firstDowns}</span>
                      <span className="text-white/60 uppercase font-bold">1st Downs</span>
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
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-sans tabular">
                    <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.turnovers}</span>
                    <span className="text-white/60 uppercase font-bold">Turnovers</span>
                    <span className="text-amber-400 font-bold">{activeGame.awayTeam.stats.turnovers}</span>
                  </div>

                  {/* Penalties */}
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-sans tabular">
                    <span className="text-emerald-400 font-bold">{activeGame.homeTeam.stats.penalties}</span>
                    <span className="text-white/60 uppercase font-bold">Penalties (No.-Yds)</span>
                    <span className="text-amber-400 font-bold">{activeGame.awayTeam.stats.penalties}</span>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

        {/* More games: real games from the Scorekeeper */}
        <div className="mt-10 -mx-4 sm:-mx-6">
          <GamesBoard
            title="More games"
            activeGameId={activeGame?.id}
            onOpenGame={(id) => {
              setSelectedGameId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
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
              className="bg-[#141414] border border-white/20 rounded-sm max-w-3xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewMediaModal(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/80 text-white/80 hover:text-white flex items-center justify-center border border-white/20 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="aspect-video bg-black relative flex items-center justify-center">
                {previewMediaModal.type === 'video' && previewMediaModal.mediaUrl ? (
                  <video
                    src={previewMediaModal.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <img
                    src={previewMediaModal.mediaUrl || '/logo.png'}
                    alt={previewMediaModal.title}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-xs font-sans tabular text-[#00BFFF] uppercase font-bold tracking-wide">
                    {previewMediaModal.time} • {previewMediaModal.platform.toUpperCase()}
                  </span>
                  <span className="text-xs font-sans tabular text-white/50">{previewMediaModal.author}</span>
                </div>
                <h4 className="font-display font-bold uppercase text-lg text-white mb-2">
                  {previewMediaModal.title}
                </h4>
                <p className="text-white/70 text-sm font-sans mb-4">
                  {previewMediaModal.caption}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleLikeClip(previewMediaModal.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white font-display font-bold text-xs uppercase cursor-pointer"
                  >
                    <Heart size={15} className={likedClips[previewMediaModal.id] ? 'fill-red-400 text-red-400' : ''} />
                    <span>{previewMediaModal.likes} LIKES</span>
                  </button>

                  {previewMediaModal.url && (
                    <a
                      href={previewMediaModal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-bold text-xs uppercase transition-all"
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
              className="bg-[#141414] border border-white/20 rounded-sm max-w-sm w-full p-6 text-center shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/30 text-[#00BFFF] flex items-center justify-center mx-auto mb-4">
                <Lock size={20} />
              </div>
              
              <h3 className="font-display font-bold text-lg uppercase text-white tracking-wide mb-1">
                Sideline Operator Access
              </h3>
              <p className="text-white/50 text-xs font-sans mb-5">
                Sign in with your IND staff Google account to run the score, clock & sideline media.
              </p>
              {staffAuth.user && !staffAuth.isStaff && !staffAuth.loading && (
                <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-700/40 rounded px-3 py-2 mb-4">
                  {staffAuth.user.email} isn't on the IND staff list yet. Ask an admin to add you in the Newsroom.
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setPinError(false);
                  signInStaff()
                    .then(() => {
                      setPinModalOpen(false);
                      setIsAdminOpen(true);
                    })
                    .catch((err) => {
                      console.warn(err);
                      setPinError(true);
                    });
                }} 
                className="space-y-4"
              >
                {pinError && (
                  <div className="text-xs font-sans tabular text-red-400 bg-red-950/40 py-1.5 px-3 rounded border border-red-800/40">
                    Sign-in didn't finish. Please try again.
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
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-display font-bold text-xs uppercase rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-display font-bold text-xs uppercase rounded cursor-pointer font-bold"
                  >
                    Sign in with Google
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* REAL-TIME HIGHLIGHT EDIT MODAL (FOR SIDELINE OPERATORS) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingClip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => !isSavingEdit && setEditingClip(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-[#00BFFF]/40 rounded-sm max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00BFFF]/20 border border-[#00BFFF]/40 flex items-center justify-center text-[#00BFFF]">
                    <Edit3 size={16} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base uppercase text-white tracking-wide">
                      Edit Highlight Details
                    </h3>
                    <p className="text-[11px] font-sans text-white/50">
                      Saves instantly to Firestore and updates all live viewers.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => !isSavingEdit && setEditingClip(null)}
                  disabled={isSavingEdit}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveClipEdit} className="space-y-4">
                {/* Media Preview */}
                {editingClip.mediaUrl && (
                  <div className="relative aspect-video rounded-sm overflow-hidden bg-black border border-white/10 max-h-40">
                    {editingClip.type === 'video' ? (
                      <video 
                        src={editingClip.mediaUrl} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <img 
                        src={editingClip.mediaUrl} 
                        alt="Highlight preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-sans tabular text-white/80 border border-white/10">
                      {editingClip.type === 'video' ? 'VIDEO HIGHLIGHT' : 'PHOTO HIGHLIGHT'}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="text-[11px] font-sans tabular uppercase text-white/60 font-bold block mb-1">
                    Highlight Title
                  </label>
                  <input
                    type="text"
                    value={editingClip.title}
                    onChange={(e) => setEditingClip({ ...editingClip, title: e.target.value })}
                    required
                    placeholder="e.g. 45-Yard Touchdown Run"
                    className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-sm px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="text-[11px] font-sans tabular uppercase text-white/60 font-bold block mb-1">
                    Caption & Description
                  </label>
                  <textarea
                    value={editingClip.caption}
                    onChange={(e) => setEditingClip({ ...editingClip, caption: e.target.value })}
                    rows={3}
                    placeholder="Add details, play context, or player tags..."
                    className="w-full bg-black border border-white/20 focus:border-[#00BFFF] rounded-sm px-3.5 py-2.5 text-xs text-white outline-none resize-none"
                  />
                </div>

                {/* Team Tag Attribution */}
                <div>
                  <label className="text-[11px] font-sans tabular uppercase text-white/60 font-bold block mb-1.5">
                    Team Attribution
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingClip({ ...editingClip, team: 'home' })}
                      className={`py-2 px-2.5 rounded-lg text-xs font-display font-bold uppercase transition-all cursor-pointer truncate ${
                        editingClip.team === 'home'
                          ? 'bg-emerald-500 text-black shadow-md'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {activeGame.homeTeam.shortName}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingClip({ ...editingClip, team: 'away' })}
                      className={`py-2 px-2.5 rounded-lg text-xs font-display font-bold uppercase transition-all cursor-pointer truncate ${
                        editingClip.team === 'away'
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {activeGame.awayTeam.shortName}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingClip({ ...editingClip, team: 'neutral' })}
                      className={`py-2 px-2.5 rounded-lg text-xs font-display font-bold uppercase transition-all cursor-pointer truncate ${
                        editingClip.team === 'neutral'
                          ? 'bg-[#00BFFF] text-black shadow-md'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      Crowd / General
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => !isSavingEdit && setEditingClip(null)}
                    disabled={isSavingEdit}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-display font-bold text-xs uppercase rounded-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-display font-bold text-xs uppercase tracking-wider rounded-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Save size={15} />
                    <span>{isSavingEdit ? 'Saving to Live Feed...' : 'Save Changes'}</span>
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
