import React, { useState, useEffect } from 'react';
import { Radio, ChevronRight } from 'lucide-react';
import type { GameState } from '../types';
import { subscribeToGames } from '../lib/firebase';

interface LiveScoreTickerProps {
  onNavigateToScoreboard: (gameId?: string) => void;
}

export const LiveScoreTicker: React.FC<LiveScoreTickerProps> = ({ onNavigateToScoreboard }) => {
  const [games, setGames] = useState<GameState[]>([]);

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

  // Filter ONLY current week matchups (Week 2) for the homepage
  const currentWeekGames = (games || []).filter(g => {
    if (g.isArchived) return false;
    if ((g.week || '').includes('1')) return false;
    return (g.week || '').includes('2') || g.isLive || !g.isArchived;
  });

  if (!currentWeekGames || currentWeekGames.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#0c0c0c]/98 border-y border-[#00BFFF]/30 py-2.5 px-4 sm:px-6 shadow-2xl relative z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Badge / Label */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/20 border border-red-500/60 rounded-full text-red-400 text-xs font-black font-display uppercase tracking-wider shadow-[0_0_12px_rgba(239,68,68,0.35)] animate-pulse">
            <Radio size={13} className="text-red-500 animate-ping" />
            <span>Week 2 Live Matchups</span>
          </div>
        </div>

        {/* Touch Swipeable Game Cards Ticker (Scrollbar Completely Hidden) */}
        <div 
          className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full py-1 scroll-smooth overscroll-x-contain touch-pan-x cursor-grab active:cursor-grabbing select-none"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {currentWeekGames.map((game) => {
            const isLive = game.isLive;
            const homeWon = !isLive && game.homeTeam.score > game.awayTeam.score;
            const awayWon = !isLive && game.awayTeam.score > game.homeTeam.score;

            return (
              <div
                key={game.id}
                onClick={() => onNavigateToScoreboard(game.id)}
                className={`shrink-0 bg-white/5 hover:bg-white/10 border ${
                  isLive 
                    ? 'border-[#00BFFF]/50 hover:border-[#00BFFF] shadow-[0_0_12px_rgba(0,191,255,0.2)]' 
                    : 'border-white/10 hover:border-white/30'
                } rounded-md p-2.5 min-w-[220px] sm:min-w-[250px] cursor-pointer transition-all duration-200 group hover:scale-[1.02]`}
              >
                {/* Header: Sport & Status */}
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-1.5 border-b border-white/5 pb-1">
                  <span className="text-[#00BFFF] font-bold">{game.sport}</span>
                  <div className="flex items-center gap-1">
                    {isLive ? (
                      <span className="text-red-400 font-black flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {game.quarter} • {game.clock}
                      </span>
                    ) : (
                      <span className="text-white/50 font-bold">{game.statusText || 'FINAL'}</span>
                    )}
                  </div>
                </div>

                {/* Teams & Scores */}
                <div className="space-y-1">
                  {/* Away Team */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      {game.awayTeam.logoUrl && (
                        <img 
                          src={game.awayTeam.logoUrl} 
                          alt="" 
                          referrerPolicy="no-referrer" 
                          className="w-4 h-4 object-contain rounded-full bg-white/10" 
                        />
                      )}
                      <span className={`font-display font-bold truncate ${game.possession === 'away' && isLive ? 'text-[#00BFFF]' : 'text-white'}`}>
                        {game.awayTeam.name}
                      </span>
                      {game.possession === 'away' && isLive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-ping" title="Possession" />
                      )}
                    </div>
                    <span className={`font-display font-black text-xs tabular-nums ${(isLive && game.awayTeam.score > game.homeTeam.score) || awayWon ? 'text-[#00BFFF]' : 'text-white'}`}>
                      {game.awayTeam.score}
                    </span>
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate pr-2">
                      {game.homeTeam.logoUrl && (
                        <img 
                          src={game.homeTeam.logoUrl} 
                          alt="" 
                          referrerPolicy="no-referrer" 
                          className="w-4 h-4 object-contain rounded-full bg-white/10" 
                        />
                      )}
                      <span className={`font-display font-bold truncate ${game.possession === 'home' && isLive ? 'text-[#00BFFF]' : 'text-white'}`}>
                        {game.homeTeam.name}
                      </span>
                      {game.possession === 'home' && isLive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-ping" title="Possession" />
                      )}
                    </div>
                    <span className={`font-display font-black text-xs tabular-nums ${(isLive && game.homeTeam.score > game.awayTeam.score) || homeWon ? 'text-[#00BFFF]' : 'text-white'}`}>
                      {game.homeTeam.score}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-1.5 pt-1 border-t border-white/5 flex items-center justify-between text-[9px] text-white/40 font-mono">
                  <span className="truncate max-w-[150px]">
                    {isLive && game.down ? `${game.down} & ${game.distance}` : game.venue || game.statusText}
                  </span>
                  <span className="text-[#00BFFF] group-hover:translate-x-0.5 transition-transform font-bold">
                    View GameCast →
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
