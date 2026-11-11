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
