import { useState } from 'react';
import { useLiveGames } from '../lib/gamesStore';
import { displayClock, sportKind } from '../lib/scorekeeper';
import { isFinal, isStale, isUpcoming, startMs, whenLabel } from '../lib/gameTime';
import type { GameState } from '../types';
import TeamLogo from './TeamLogo';

const SPORT_FILTERS = ['All', 'Football', 'Basketball', 'Volleyball'] as const;

/**
 * Real games from the Scorekeeper, grouped Live / Upcoming / Final.
 * Archived games and out-of-date "upcoming" games are hidden automatically.
 */
export default function GamesBoard({
  onOpenGame,
  activeGameId,
  title = 'Games',
  maxFinals = 9,
}: {
  onOpenGame: (id: string) => void;
  activeGameId?: string;
  title?: string;
  maxFinals?: number;
}) {
  const { games, loaded } = useLiveGames();
  const [sport, setSport] = useState<(typeof SPORT_FILTERS)[number]>('All');

  const visible = games.filter(
    (g) => !g.isArchived && !isStale(g) && (sport === 'All' || sportKind(g.sport) === sport.toLowerCase())
  );
  const live = visible.filter((g) => g.isLive);
  const upcoming = visible
    .filter(isUpcoming)
    .sort((a, b) => (startMs(a) ?? Infinity) - (startMs(b) ?? Infinity));
  const finals = visible
    .filter(isFinal)
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    .slice(0, maxFinals);

  const Section = ({ label, list }: { label: string; list: GameState[] }) =>
    list.length === 0 ? null : (
      <div className="mt-8 first:mt-0">
        <h3 className="font-display font-semibold uppercase text-white/70 text-[15px] mb-3">{label}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((g) => (
            <GameCard key={g.id} g={g} active={g.id === activeGameId} onOpen={() => onOpenGame(g.id)} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-white pb-2 mb-6">
        <h2 className="font-display font-semibold uppercase text-2xl text-white">{title}</h2>
        <div className="flex gap-1" role="tablist" aria-label="Filter games by sport">
          {SPORT_FILTERS.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={sport === s}
              onClick={() => setSport(s)}
              className={`px-3 py-1 text-[14px] font-semibold rounded-sm cursor-pointer ${sport === s ? 'bg-white text-black' : 'text-white/65 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {!loaded && <p className="text-mute">Loading games…</p>}
      {loaded && live.length + upcoming.length + finals.length === 0 && (
        <p className="text-mute">No {sport === 'All' ? '' : `${sport.toLowerCase()} `}games scheduled right now. Check back on game night.</p>
      )}
      <Section label="Live now" list={live} />
      <Section label="Upcoming" list={upcoming} />
      <Section label="Final" list={finals} />
    </div>
  );
}

function GameCard({ g, active, onOpen }: { g: GameState; active: boolean; onOpen: () => void }) {
  const final = isFinal(g);
  const kind = sportKind(g.sport);
  const status = g.isLive
    ? `${g.quarter}${kind === 'basketball' ? ` ${displayClock(g)}` : ''}${kind === 'volleyball' ? `  Sets ${g.awaySetsWon || 0}-${g.homeSetsWon || 0}` : ''}`
    : final
      ? 'Final'
      : whenLabel(g);
  return (
    <button
      onClick={onOpen}
      className={`text-left bg-panel border rounded-sm px-4 py-3 cursor-pointer hover:border-white/40 transition-colors ${active ? 'border-ind' : 'border-rule'}`}
    >
      <div className="flex items-center justify-between gap-2 text-[12px] mb-2">
        <span className={g.isLive ? 'text-[#FF4D5E] font-semibold' : 'text-mute'}>
          {g.isLive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E4002B] mr-1.5 align-middle" aria-hidden />}
          {status}
        </span>
        <span className="text-ind truncate">{g.sport.replace(/varsity\s*/i, '')}</span>
      </div>
      {[g.awayTeam, g.homeTeam].map((t, i) => {
        const other = i === 0 ? g.homeTeam : g.awayTeam;
        const lost = final && t.score < other.score;
        return (
          <div key={i} className="flex items-center gap-2.5 py-0.5">
            <TeamLogo name={t.name} url={t.logoUrl} color={t.color} className="w-6 h-6" textClass="text-[9px]" />
            <span className={`flex-1 font-semibold truncate ${lost ? 'text-white/50' : 'text-white'}`}>{t.name}</span>
            {(g.isLive || final) && (
              <span className={`font-display text-lg tabular ${lost ? 'text-white/50' : 'text-white'}`}>{t.score}</span>
            )}
          </div>
        );
      })}
      {(g.title || g.venue) && (
        <p className="mt-2 text-[12px] text-mute truncate">{[g.title, g.venue].filter(Boolean).join(' at ')}</p>
      )}
    </button>
  );
}
