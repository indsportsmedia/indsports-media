import React, { useState, useEffect } from 'react';
import { Radio, ChevronRight, Trophy, Flame, Sparkles } from 'lucide-react';
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

  // Filter unarchived active games, prioritizing Sectionals and Volleyball Tournaments
  const activeGames = (games.length > 0 ? games : DEFAULT_GAMES_LIST).filter(g => !g.isArchived);

  // If none active, fallback to DEFAULT_GAMES_LIST
  const displayGames = activeGames.length > 0 ? activeGames : DEFAULT_GAMES_LIST;

  return (
    <div className="w-full bg-[#0c0c0c]/98 border-y border-[#00BFFF]/30 py-2.5 px-4 sm:px-6 shadow-2xl relative z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Badge / Label */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div 
            onClick={() => onNavigateToScoreboard()} 
            className="flex items-center gap-1.5 px-3 py-1 bg-red-600/20 border border-red-500/60 rounded-full text-red-400 text-xs font-bold font-display uppercase tracking-wider shadow-[0_0_12px_rgba(239,68,68,0.35)] animate-pulse cursor-pointer hover:bg-red-600/30 transition-colors"
          >
            <Radio size={13} className="text-red-500" />
            <span>Sectionals Tonight &amp; Tournaments</span>
          </div>

          <div 
            onClick={() => onNavigateToScoreboard()}
            className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-amber-400 uppercase font-bold cursor-pointer hover:underline"
          >
            <Trophy size={12} />
            <span>Postseason Hub</span>
          </div>
        </div>

        {/* Touch Swipeable Game Cards Ticker */}
        <div 
          className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full py-1 scroll-smooth overscroll-x-contain touch-pan-x cursor-grab active:cursor-grabbing select-none"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {displayGames.map((game) => {
            const isLive = game.isLive;
            const homeWon = !isLive && game.homeTeam.score > game.awayTeam.score;
            const awayWon = !isLive && game.awayTeam.score > game.homeTeam.score;
            const isSectional = (game.week || '').includes('Sectional') || game.title.includes('Sectional');
            const isVolleyball = game.sport.includes('Volleyball');

            return (
              <div
                key={game.id}
                onClick={() => onNavigateToScoreboard(game.id)}
                className={`shrink-0 bg-white/5 hover:bg-white/10 border ${
                  isSectional
                    ? 'border-red-500/40 hover:border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                    : isVolleyball
                    ? 'border-[#00BFFF]/40 hover:border-[#00BFFF]'
                    : 'border-white/10 hover:border-white/30'
                } rounded-md p-2.5 min-w-[220px] sm:min-w-[260px] cursor-pointer transition-all duration-200 group hover:scale-[1.02]`}
              >
                {/* Header: Sport & Status */}
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5 border-b border-white/5 pb-1">
                  <span className={`font-bold ${isSectional ? 'text-red-400' : 'text-[#00BFFF]'}`}>
                    {isSectional ? '🏈 Sectionals R1' : isVolleyball ? '🏐 VB Tournament' : game.sport}
                  </span>
                  <div className="flex items-center gap-1">
                    {isLive && game.clock !== '00:00' && game.quarter !== 'Final' ? (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {game.clock.includes(':') ? `${game.quarter} • ${game.clock}` : game.statusText}
                      </span>
                    ) : (
                      <span className="text-white/60 font-bold">{game.statusText || 'UPCOMING'}</span>
                    )}
                  </div>
                </div>

                {/* Teams & Scores */}
                <div className="space-y-1">
                  {/* Away Team */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <div 
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ backgroundColor: game.awayTeam.color || '#333' }}
                      >
                        {game.awayTeam.shortName.charAt(0)}
                      </div>
                      <span className={`font-display font-bold truncate ${game.possession === 'away' && isLive ? 'text-[#00BFFF]' : 'text-white'}`}>
                        {game.awayTeam.name}
                      </span>
                      {game.possession === 'away' && isLive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-ping" title="Possession" />
                      )}
                    </div>
                    <span className={`font-display font-bold text-xs tabular-nums ${(isLive && game.awayTeam.score > game.homeTeam.score) || awayWon ? 'text-[#00BFFF]' : 'text-white/90'}`}>
                      {game.awayTeam.score}
                    </span>
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      <div 
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ backgroundColor: game.homeTeam.color || '#333' }}
                      >
                        {game.homeTeam.shortName.charAt(0)}
                      </div>
                      <span className={`font-display font-bold truncate ${game.possession === 'home' && isLive ? 'text-[#00BFFF]' : 'text-white'}`}>
                        {game.homeTeam.name}
                      </span>
                      {game.possession === 'home' && isLive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-ping" title="Possession" />
                      )}
                    </div>
                    <span className={`font-display font-bold text-xs tabular-nums ${(isLive && game.homeTeam.score > game.awayTeam.score) || homeWon ? 'text-[#00BFFF]' : 'text-white/90'}`}>
                      {game.homeTeam.score}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-1.5 pt-1 border-t border-white/5 flex items-center justify-between text-[9px] text-white/40 font-mono">
                  <span className="truncate max-w-[150px]">
                    {game.dateString || game.venue || game.statusText}
                  </span>
                  <span className="text-[#00BFFF] group-hover:translate-x-0.5 transition-transform font-bold">
                    Scoreboard →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveScoreTicker;
