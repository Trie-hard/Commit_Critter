import React from 'react';
import { CommitItem } from '../types/critter';
import { GitCommit } from 'lucide-react';

interface CommitTickerProps {
  commits: CommitItem[];
  element: string;
}

// Element-specific accent colors for the ticker
const ELEMENT_TICKER_COLOR: Record<string, string> = {
  FLORA: 'text-emerald-400',
  VOLT:  'text-yellow-400',
  FERRO: 'text-orange-400',
  TIDAL: 'text-sky-400',
  PRISM: 'text-pink-400',
  VOID:  'text-violet-400',
};

export const CommitTicker: React.FC<CommitTickerProps> = ({ commits, element }) => {
  if (!commits || commits.length === 0) return null;

  const accentColor = ELEMENT_TICKER_COLOR[element] ?? 'text-cyan-400';

  // Duplicate the list so the marquee loops seamlessly
  const items = [...commits, ...commits];

  return (
    <div
      className="relative overflow-hidden border-y border-white/[0.05] bg-cosmic-deep/60"
      style={{ height: '36px' }}
      aria-label="Recent commit ticker"
    >
      {/* Left fade mask */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #070b16, transparent)' }} />
      {/* Right fade mask */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #070b16, transparent)' }} />

      <div className="ticker-track flex items-center h-full gap-0">
        {items.map((c, i) => (
          <div
            key={`${c.id}-${i}`}
            className="flex items-center gap-2.5 px-6 shrink-0 whitespace-nowrap"
          >
            <GitCommit className={`w-3 h-3 ${accentColor} shrink-0`} />
            <span className={`font-pixel text-[9px] ${accentColor} opacity-80`}>
              {c.repo.split('/')[1] ?? c.repo}
            </span>
            <span className="text-[11px] font-mono text-slate-300/70">
              {c.message}
            </span>
            {/* Separator dot */}
            <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
