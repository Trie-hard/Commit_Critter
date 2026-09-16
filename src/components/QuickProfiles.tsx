import React from 'react';
import { CURATED_PROFILES } from '../services/githubService';
import { GitHubActivityData } from '../types/critter';
import { soundFx } from '../services/audioEngine';

interface QuickProfilesProps {
  currentUsername: string;
  onSelectProfile: (data: GitHubActivityData) => void;
}

export const QuickProfiles: React.FC<QuickProfilesProps> = ({
  currentUsername,
  onSelectProfile,
}) => {
  const profiles = [
    { key: 'torvalds',    label: 'Linus Torvalds',      sub: 'Linux / C' },
    { key: 'gaearon',     label: 'Dan Abramov',          sub: 'React / JS' },
    { key: 'sindresorhus',label: 'Sindre Sorhus',        sub: 'OSS / TS' },
    { key: 'firstcommit', label: 'First Commit Hero',    sub: 'Beginner' },
  ];

  const handleSelect = (key: string) => {
    soundFx.playChirp();
    const data = CURATED_PROFILES[key];
    if (data) onSelectProfile(data);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-ink-400 font-mono mr-1">Try a demo:</span>
      {profiles.map((p) => {
        const isActive =
          currentUsername.toLowerCase() ===
          CURATED_PROFILES[p.key]?.username.toLowerCase();
        return (
          <button
            key={p.key}
            onClick={() => handleSelect(p.key)}
            className={`px-3 py-1 rounded-xl text-xs font-display font-medium border transition-all ${
              isActive
                ? 'bg-ember-dim border-ember-muted text-ember-light'
                : 'bg-ink-800 border-ink-600 text-ink-300 hover:text-ink-100 hover:border-ink-500'
            }`}
          >
            {p.label}
            <span className="text-[10px] font-mono ml-1.5 opacity-60">
              {p.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
};
