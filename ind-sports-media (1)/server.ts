import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
