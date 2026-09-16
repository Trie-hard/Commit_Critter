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
    { key: 'torvalds',     label: 'Linus Torvalds',      sub: 'Linux' },
    { key: 'gaearon',      label: 'Dan Abramov',          sub: 'React' },
    { key: 'sindresorhus', label: 'Sindre Sorhus',        sub: 'OSS' },
    { key: 'firstcommit',  label: 'First Commit Hero',    sub: 'Beginner' },
  ];

  const handleSelect = (key: string) => {
    soundFx.playChirp();
    const data = CURATED_PROFILES[key];
    if (data) onSelectProfile(data);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-[13px] text-slate-gray font-normal mr-1">
        Try sample profiles:
      </span>
      {profiles.map((p) => {
        const isActive =
          currentUsername.toLowerCase() ===
          CURATED_PROFILES[p.key]?.username.toLowerCase();
        return (
          <button
            key={p.key}
            onClick={() => handleSelect(p.key)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] transition-all flex items-center gap-1.5 ${
              isActive
                ? 'bg-ink-black text-white font-medium shadow-sm'
                : 'bg-mist-gray text-ink-black hover:bg-[#e7e7e9] font-normal'
            }`}
          >
            <span>{p.label}</span>
            <span className={`text-[11px] ${isActive ? 'text-white/60' : 'text-slate-gray'}`}>
              · {p.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
};
