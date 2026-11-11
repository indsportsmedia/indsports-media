import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import Newsroom from './components/Newsroom';
import ArticlePage from './components/ArticlePage';
import Scorekeeper from './components/Scorekeeper';
import './index.css';

// Simple path routing for the new pages; everything else is the existing site.
//   /newsroom          -> team publishing tools (sign-in required)
//   /news/{story-slug} -> public story / live game page (shareable)
//   /score             -> scorekeeper for football, basketball, volleyball (sign-in required)
const path = window.location.pathname.replace(/\/+$/, '');
const newsMatch = path.match(/^\/news\/([^/]+)$/);

// Staff pages install as the separate "IND Crew" app; everything else is "IND Sports".
if (path === '/newsroom' || path === '/score') {
  document.getElementById('app-manifest')?.setAttribute('href', '/manifest-crew.webmanifest');
  document.getElementById('apple-icon')?.setAttribute('href', '/apple-touch-icon-crew.png');
  document.getElementById('apple-title')?.setAttribute('content', 'IND Crew');
}

// Offline support + installability (production only, so local development isn't cached).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

let page = <App />;
if (path === '/newsroom') page = <Newsroom />;
else if (path === '/score') page = <Scorekeeper />;
else if (newsMatch) page = <ArticlePage slug={decodeURIComponent(newsMatch[1])} />;

// Hide broken images (e.g. dead logo links) instead of showing a "?" box.
document.addEventListener(
  'error',
  (e) => {
    const t = e.target;
    if (t instanceof HTMLImageElement && !t.dataset.broken) {
      t.dataset.broken = '1';
      t.style.visibility = 'hidden';
    }
  },
  true
);

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
