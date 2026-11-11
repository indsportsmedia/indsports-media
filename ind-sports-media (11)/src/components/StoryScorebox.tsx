import { useEffect, useState } from 'react';
import { watchGame, displayClock, sportKind } from '../lib/scorekeeper';
import type { GameState } from '../types';
import TeamLogo from './TeamLogo';

/** Live score box shown on a story that's linked to a scoreboard game. */
export default function StoryScorebox({ gameId }: { gameId: string }) {
  const [g, setG] = useState<GameState | null>(null);
  const [, tick] = useState(0);
  useEffect(() => watchGame(gameId, (game) => setG(game)), [gameId]);
  useEffect(() => {
    if (!g?.clockRunning) return;
    const t = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, [g?.clockRunning]);
  if (!g) return null;

  const kind = sportKind(g.sport);
  const final = !g.isLive && /final/i.test(`${g.quarter} ${g.statusText}`);
  const status = g.isLive
    ? `${g.quarter}${kind === 'basketball' ? ` ${displayClock(g)}` : ''}${kind === 'volleyball' ? `  Sets ${g.awaySetsWon || 0}-${g.homeSetsWon || 0}` : ''}`
    : g.statusText || g.quarter;

  return (
    <a href={`/?scores=${encodeURIComponent(g.id)}`} className="block mt-6 bg-panel border border-rule rounded-sm hover:border-white/30 transition-colors">
      <div className="flex items-center justify-between px-4 py-2 border-b border-rule text-[13px]">
        <span className={g.isLive ? 'text-[#FF4D5E] font-semibold' : 'text-mute'}>
          {g.isLive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E4002B] mr-1.5 align-middle" aria-hidden />}
          {status}
        </span>
        <span className="text-ind">Full scoreboard</span>
      </div>
      {[g.awayTeam, g.homeTeam].map((t, i) => {
        const other = i === 0 ? g.homeTeam : g.awayTeam;
        const lost = final && t.score < other.score;
        return (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
            <TeamLogo name={t.name} url={t.logoUrl} color={t.color} className="w-8 h-8" />
            <span className={`flex-1 font-display font-semibold uppercase text-lg truncate ${lost ? 'text-white/50' : 'text-white'}`}>{t.name}</span>
            <span className={`font-display text-3xl tabular ${lost ? 'text-white/50' : 'text-white'}`}>{t.score}</span>
          </div>
        );
      })}
      {g.isLive && kind === 'football' && g.down && (
        <p className="px-4 pb-3 text-[13px] text-white/70">
          {g.down} &amp; {g.distance}
          {g.ballOn && ` at ${g.ballOn}`}, {(g.possession === 'home' ? g.homeTeam : g.awayTeam).shortName} ball
        </p>
      )}
    </a>
  );
}
