import React, { useState, useEffect } from 'react';
import TeamLogo from './TeamLogo';
import { displayClock } from '../lib/scorekeeper';
import type { GameState } from '../types';
import { subscribeToGames } from '../lib/firebase';
import { DEFAULT_GAMES_LIST } from './LiveScoreboard';

interface LiveScoreTickerProps {
  onNavigateToScoreboard: (gameId?: string) => void;
}

export const LiveScoreTicker: React.FC<LiveScoreTickerProps> = ({ onNavigateToScoreboard }) => {
  const [games, setGames] = useState<GameState[]>(() => {
    try {
      const saved = localStorage.getItem('ind_live_scoreboard_games_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_GAMES_LIST;
  });

  useEffect(() => {
    const unsubscribe = subscribeToGames(
      (liveGames) => {
        if (liveGames && liveGames.length > 0) {
          setGames(liveGames);
        }
      },
      (err) => {
        console.warn('Live ticker subscription error:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  const [, setTick] = useState(0);
  const anyClock = games.some((g) => g.clockRunning);
  useEffect(() => {
    if (!anyClock) return;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [anyClock]);

  const active = (games.length > 0 ? games : DEFAULT_GAMES_LIST).filter((g) => !g.isArchived);
  const list = (active.length > 0 ? active : DEFAULT_GAMES_LIST)
    .slice()
    .sort((a, b) => Number(b.isLive) - Number(a.isLive));

  const status = (g: GameState) => {
    const final = !g.isLive && /final/i.test(`${g.statusText} ${g.quarter}`);
    if (final) return { text: 'Final', live: false };
    if (g.isLive && /volley/i.test(g.sport)) return { text: `${g.quarter}  Sets ${g.awaySetsWon || 0}-${g.homeSetsWon || 0}`, live: true };
    const clk = displayClock(g);
    if (g.isLive && clk && !/pre|half/i.test(g.quarter)) return { text: `${g.quarter} ${clk}`, live: true };
    if (g.isLive) return { text: g.quarter || 'Live', live: true };
    return { text: g.statusText || g.quarter || 'Upcoming', live: g.isLive };
  };

  return (
    <div className="h-[60px] bg-black border-b border-rule">
      <div className="max-w-7xl mx-auto h-full flex items-stretch">
        <button
          onClick={() => onNavigateToScoreboard()}
          className="shrink-0 flex flex-col justify-center px-4 sm:px-6 border-r border-rule hover:bg-panel cursor-pointer text-left"
        >
          <span className="font-display font-semibold uppercase text-white text-[15px] leading-none">Scores</span>
          <span className="text-ind text-[12px] mt-1 leading-none">All games</span>
        </button>
        <div className="flex items-stretch overflow-x-auto no-scrollbar overscroll-x-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          {list.map((g) => {
            const st = status(g);
            const final = st.text === 'Final';
            const awayWin = final && g.awayTeam.score > g.homeTeam.score;
            const homeWin = final && g.homeTeam.score > g.awayTeam.score;
            const row = (t: GameState['homeTeam'], win: boolean, lose: boolean) => (
              <div className="flex items-center gap-2 leading-none">
                <TeamLogo name={t.name} url={t.logoUrl} color={t.color} className="w-4 h-4" textClass="text-[8px]" />
                <span className={`text-[13px] font-semibold truncate max-w-[110px] ${lose ? 'text-white/50' : 'text-white'}`}>{t.shortName || t.name}</span>
                <span className={`ml-auto pl-3 font-display text-[14px] tabular ${lose ? 'text-white/50' : 'text-white'} ${win ? 'font-bold' : ''}`}>
                  {t.score}
                </span>
              </div>
            );
            return (
              <button
                key={g.id}
                onClick={() => onNavigateToScoreboard(g.id)}
                className="shrink-0 w-[172px] flex flex-col justify-center gap-1.5 px-3 border-r border-rule hover:bg-panel cursor-pointer text-left"
              >
                <span className={`text-[11px] font-semibold leading-none truncate ${st.live ? 'text-[#FF4D5E]' : 'text-mute'}`}>
                  {st.live && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E4002B] mr-1 align-middle" aria-hidden />}
                  {st.text}
                </span>
                {row(g.awayTeam, awayWin, homeWin)}
                {row(g.homeTeam, homeWin, awayWin)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveScoreTicker;
