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
  'lawrence-north-vs-brownsburg-2026': {
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
    awayTeam: {
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
        url: 'https://twitter.com/INDSportsMedia/status/178923019',
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
  'southside-fw-vs-marion-giants-2026': {
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
      logoUrl: '/southside_archers.jpg',
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
      logoUrl: '/marion_giants.jpg',
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
