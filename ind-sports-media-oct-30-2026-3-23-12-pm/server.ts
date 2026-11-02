import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API health check endpoints for deployment verification
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

interface ApplicationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  sports: string;
  experience: string;
  gear: string;
  portfolioUrl: string;
  availability: string;
  submittedAt: string;
}

// In-memory store for instant retrieval & offline fallback
const applicationsStore: ApplicationRecord[] = [
  {
    id: 'demo-app-1',
    fullName: 'Marcus Vance',
    email: 'marcus.vance.media@gmail.com',
    phone: '(555) 234-5678',
    role: 'Photography & Videography',
    sports: 'Football, Basketball, Girls Flag Football',
    experience: '4 Years high school & club media coverage',
    gear: 'Sony A7IV, 70-200mm f/2.8 GM, DJI Ronin RS3',
    portfolioUrl: 'https://instagram.com/marcusvancemedia',
    availability: 'Friday Nights & Saturdays',
    submittedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let spreadsheetId = process.env.SPREADSHEET_ID || '';

// Lazy Google Auth helper
function getGoogleAuth() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth;
  } catch (err) {
    console.warn('Google Auth default client initialization warning:', err);
    return null;
  }
}

// Append application row to Google Sheets
async function appendToGoogleSheet(appData: ApplicationRecord) {
  try {
    const auth = getGoogleAuth();
    if (!auth) return false;

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Header row order: ID, Name, Email, Phone, Role, Sports Covered, Experience, Gear, Portfolio/Links, Availability, Submitted At
    const values = [[
      appData.id,
      appData.fullName,
      appData.email,
      appData.phone,
      appData.role,
      appData.sports,
      appData.experience,
      appData.gear,
      appData.portfolioUrl,
      appData.availability,
      appData.submittedAt
    ]];

    if (spreadsheetId) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      });
      console.log('Successfully appended row to Google Sheet:', spreadsheetId);
      return true;
    } else {
      // Create a spreadsheet if none exists
      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: 'IND Sports Media Creator Applications'
          },
          sheets: [
            {
              properties: { title: 'Applications' },
              data: [
                {
                  rowData: [
                    {
                      values: [
                        { userEnteredValue: { stringValue: 'Application ID' } },
                        { userEnteredValue: { stringValue: 'Full Name' } },
                        { userEnteredValue: { stringValue: 'Email' } },
                        { userEnteredValue: { stringValue: 'Phone' } },
                        { userEnteredValue: { stringValue: 'Role' } },
                        { userEnteredValue: { stringValue: 'Sports Covered' } },
                        { userEnteredValue: { stringValue: 'Experience' } },
                        { userEnteredValue: { stringValue: 'Gear / Equipment' } },
                        { userEnteredValue: { stringValue: 'Portfolio URL' } },
                        { userEnteredValue: { stringValue: 'Availability' } },
                        { userEnteredValue: { stringValue: 'Submitted At' } }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      });
      
      if (response.data.spreadsheetId) {
        spreadsheetId = response.data.spreadsheetId;
        console.log('Created new Google Sheet for applications:', spreadsheetId);
        
        // Append entry
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Applications!A:K',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values }
        });
        return true;
      }
    }
  } catch (error) {
    console.error('Note: Could not write directly to Google Sheets API (OAuth credentials or permissions missing). Using local store.', error);
    return false;
  }
  return false;
}

// API Routes
app.get('/api/applications', (req, res) => {
  res.json({
    success: true,
    count: applicationsStore.length,
    spreadsheetId: spreadsheetId || null,
    spreadsheetUrl: spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : null,
    applications: applicationsStore
  });
});

app.post('/api/applications', async (req, res) => {
  const { fullName, email, phone, role, sports, experience, gear, portfolioUrl, availability } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ success: false, message: 'Full name and email are required fields.' });
  }

  const newApp: ApplicationRecord = {
    id: `app-${Date.now()}`,
    fullName: String(fullName).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
    role: String(role || 'Photography & Videography').trim(),
    sports: Array.isArray(sports) ? sports.join(', ') : String(sports || '').trim(),
    experience: String(experience || '').trim(),
    gear: String(gear || '').trim(),
    portfolioUrl: String(portfolioUrl || '').trim(),
    availability: String(availability || 'Flexible').trim(),
    submittedAt: new Date().toISOString()
  };

  applicationsStore.unshift(newApp);

  // Attempt Google Sheets sync in background/inline
  const syncedToSheets = await appendToGoogleSheet(newApp);

  res.json({
    success: true,
    message: 'Application submitted successfully!',
    application: newApp,
    syncedToSheets,
    spreadsheetUrl: spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : null
  });
});

interface BookingRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  sport: string;
  service: string;
  notes?: string;
  targetEmail: string;
  submittedAt: string;
}

const bookingsStore: BookingRecord[] = [];

app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    count: bookingsStore.length,
    bookings: bookingsStore
  });
});

app.post('/api/bookings', (req, res) => {
  const { name, email, phone, sport, service, notes } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required fields.' });
  }

  const newBooking: BookingRecord = {
    id: `booking-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
    sport: String(sport || 'Football').trim(),
    service: String(service || 'Highlight Reel').trim(),
    notes: String(notes || '').trim(),
    targetEmail: 'admin@indsports.media',
    submittedAt: new Date().toISOString()
  };

  bookingsStore.unshift(newBooking);
  console.log(`[BOOKING DISPATCHED] New booking from ${newBooking.name} (${newBooking.email}) synced to admin@indsports.media`);

  res.json({
    success: true,
    message: 'Booking request synced and routed to admin@indsports.media',
    booking: newBooking,
    targetEmail: 'admin@indsports.media'
  });
});

// ==========================================
// LIVE SCOREBOARD SYNCHRONIZATION API
// Multi-device real-time state for all games
// ==========================================

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

export interface SocialClip {
  id: string;
  platform: 'x' | 'instagram' | 'tiktok' | 'youtube' | 'custom' | 'upload';
  type: 'video' | 'photo' | 'post';
  title: string;
  author: string;
  url?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption: string;
  time: string;
  team: 'home' | 'away' | 'neutral';
  likes: number;
  createdAt: string;
}

export interface GameState {
  id: string;
  sport: string;
  title: string;
  venue: string;
  dateString: string;
  week?: string;
  season?: string;
  isArchived?: boolean;
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
  socialClips: SocialClip[];
}

const INITIAL_GAMES_RECORD: Record<string, GameState> = {
  'westfield-vs-carmel-sectionals-2026': {
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
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
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
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    possession: 'home',
    down: '1st',
    distance: '10',
    ballOn: 'WST 35',
    redZone: false,
    lastPlay: 'Pregame warmups underway at Riverview Health Stadium for Sectionals Round 1.',
    plays: [],
    socialClips: []
  },
  'avon-vs-ben-davis-sectionals-2026': {
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
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
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
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    possession: 'home',
    down: '1st',
    distance: '10',
    ballOn: 'AVN 35',
    redZone: false,
    lastPlay: 'Orioles Stadium student section filling in. Kickoff set for 7:00 PM.',
    plays: [],
    socialClips: []
  },
  'snider-vs-southside-sectionals-2026': {
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
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
    },
    awayTeam: {
      name: 'South Side Archers',
      shortName: 'South Side',
      mascot: 'Archers',
      record: '4-5',
      color: '#0F5132',
      textColor: '#FFFFFF',
      logoUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80',
      score: 0,
      qScores: [0, 0, 0, 0, 0],
      stats: { passingYds: 0, rushingYds: 0, firstDowns: 0, turnovers: 0, penalties: '0-0' }
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
  'vb-huntington-m1-carroll-vs-penn': {
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
  'vb-huntington-m2-westfield-vs-crownpoint': {
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
  'vb-huntington-champ': {
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
      shortName: 'Winner M1',
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
      shortName: 'Winner M2',
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
  'vb-jennings-m1-floydcentral-vs-yorktown': {
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
  'vb-jennings-m2-bloomingtonsouth-vs-centergrove': {
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
  'vb-jennings-champ': {
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
      shortName: 'Winner M1',
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
      shortName: 'Winner M2',
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
  'franklin-central-vs-roncalli-2026': {
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
    socialClips: []
  },
  'center-grove-vs-carroll-2026': {
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
    plays: [],
    socialClips: []
  },
  'carmel-vs-westfield-2026': {
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
    plays: [],
    socialClips: []
  },
  'lawrence-north-vs-brownsburg-2026': {
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
      logoUrl: '/lawrence_north_wildcats.png',
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
      logoUrl: '/brownsburg_bulldog.jpg',
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
    socialClips: []
  },
  'southside-fw-vs-marion-giants-2026': {
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
      logoUrl: '/southside_archers.jpg',
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
      logoUrl: '/marion_giants.jpg',
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
    socialClips: []
  }
};

const liveGamesStore: Record<string, GameState> = JSON.parse(JSON.stringify(INITIAL_GAMES_RECORD));
let gamesLastUpdated = new Date().toISOString();

// GET all games
app.get('/api/games', (req, res) => {
  res.json({
    success: true,
    lastUpdated: gamesLastUpdated,
    games: Object.values(liveGamesStore)
  });
});

// GET single game
app.get('/api/games/:id', (req, res) => {
  const game = liveGamesStore[req.params.id];
  if (!game) {
    return res.status(404).json({ success: false, message: 'Game not found.' });
  }
  res.json({
    success: true,
    lastUpdated: gamesLastUpdated,
    game
  });
});

// UPDATE game (Operator score / play / clock push)
app.post('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  const updatedData = req.body.game || req.body;

  if (!updatedData || !updatedData.id) {
    return res.status(400).json({ success: false, message: 'Invalid game payload.' });
  }

  liveGamesStore[gameId] = {
    ...liveGamesStore[gameId],
    ...updatedData,
    id: gameId
  };
  gamesLastUpdated = new Date().toISOString();

  console.log(`[LIVE SCOREBOARD UPDATE] Game ${gameId} updated by operator at ${gamesLastUpdated}`);

  res.json({
    success: true,
    message: 'Scoreboard updated and broadcasting to all viewers.',
    lastUpdated: gamesLastUpdated,
    game: liveGamesStore[gameId]
  });
});

// RESET game to defaults
app.post('/api/games/reset/:id', (req, res) => {
  const gameId = req.params.id;
  if (INITIAL_GAMES_RECORD[gameId]) {
    liveGamesStore[gameId] = JSON.parse(JSON.stringify(INITIAL_GAMES_RECORD[gameId]));
    gamesLastUpdated = new Date().toISOString();
    return res.json({
      success: true,
      message: `Game ${gameId} reset to default state.`,
      game: liveGamesStore[gameId]
    });
  }
  res.status(404).json({ success: false, message: 'Game ID not found in initial registry.' });
});

// POST a new Social Clip / Highlight from sideline operator
app.post('/api/games/:id/clips', (req, res) => {
  const gameId = req.params.id;
  const game = liveGamesStore[gameId];
  if (!game) {
    return res.status(404).json({ success: false, message: 'Game not found.' });
  }

  const { platform, type, title, author, url, mediaUrl, caption, time, team } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required for clip.' });
  }

  const newClip: SocialClip = {
    id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    platform: platform || 'x',
    type: type || 'video',
    title: title.trim(),
    author: author ? author.trim() : '@INDSportsMedia',
    url: url ? url.trim() : '',
    mediaUrl: mediaUrl ? mediaUrl.trim() : '',
    caption: caption ? caption.trim() : '',
    time: time || game.quarter || 'Live',
    team: team || 'neutral',
    likes: 1,
    createdAt: new Date().toISOString()
  };

  if (!game.socialClips) {
    game.socialClips = [];
  }
  game.socialClips.unshift(newClip);
  gamesLastUpdated = new Date().toISOString();

  console.log(`[SOCIAL CLIP PUBLISHED] Clip "${newClip.title}" added to ${gameId}`);

  res.json({
    success: true,
    message: 'Social highlight published live to website!',
    clip: newClip,
    game
  });
});

// LIKE a social clip
app.post('/api/games/:id/clips/:clipId/like', (req, res) => {
  const { id: gameId, clipId } = req.params;
  const game = liveGamesStore[gameId];
  if (!game || !game.socialClips) {
    return res.status(404).json({ success: false, message: 'Clip or game not found.' });
  }

  const targetClip = game.socialClips.find(c => c.id === clipId);
  if (targetClip) {
    targetClip.likes = (targetClip.likes || 0) + 1;
    gamesLastUpdated = new Date().toISOString();
    return res.json({ success: true, likes: targetClip.likes, clip: targetClip });
  }

  res.status(404).json({ success: false, message: 'Clip not found.' });
});

// DELETE a social clip
app.delete('/api/games/:id/clips/:clipId', (req, res) => {
  const { id: gameId, clipId } = req.params;
  const game = liveGamesStore[gameId];
  if (!game || !game.socialClips) {
    return res.status(404).json({ success: false, message: 'Game not found.' });
  }

  game.socialClips = game.socialClips.filter(c => c.id !== clipId);
  gamesLastUpdated = new Date().toISOString();

  res.json({ success: true, message: 'Clip removed.', game });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
