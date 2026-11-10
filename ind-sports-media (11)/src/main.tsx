import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import Newsroom from './components/Newsroom';
import ArticlePage from './components/ArticlePage';
import './index.css';

// Simple path routing for the new pages; everything else is the existing site.
//   /newsroom          -> team publishing tools (sign-in required)
//   /news/{story-slug} -> public story / live game page (shareable)
const path = window.location.pathname.replace(/\/+$/, '');
const newsMatch = path.match(/^\/news\/([^/]+)$/);

let page = <App />;
if (path === '/newsroom') page = <Newsroom />;
else if (newsMatch) page = <ArticlePage slug={decodeURIComponent(newsMatch[1])} />;

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
