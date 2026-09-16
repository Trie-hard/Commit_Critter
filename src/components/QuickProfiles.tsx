import React from 'react';
import { CURATED_PROFILES } from '../services/githubService';
import { GitHubActivityData } from '../types/critter';
import { soundFx } from '../services/audioEngine';
import { Sparkles } from 'lucide-react';

interface QuickProfilesProps {
  currentUsername: string;
  onSelectProfile: (data: GitHubActivityData) => void;
}

export const QuickProfiles: React.FC<QuickProfilesProps> = ({
  currentUsername,
  onSelectProfile,
}) => {
  const profiles = [
    { key: 'torvalds', label: 'Linus Torvalds', sub: 'Linux / C' },
    { key: 'gaearon', label: 'Dan Abramov', sub: 'React / JS' },
    { key: 'sindresorhus', label: 'Sindre Sorhus', sub: 'Open Source / TS' },
    { key: 'firstcommit', label: 'First Commit Hero', sub: 'Hackathon Beginner / Py' },
  ];

  const handleSelect = (key: string) => {
    soundFx.playChirp();
    const data = CURATED_PROFILES[key];
    if (data) {
      onSelectProfile(data);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
      <span className="text-slate-400 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Quick Demo Profiles:</span>
      </span>
      {profiles.map((p) => {
        const isActive = currentUsername.toLowerCase() === CURATED_PROFILES[p.key]?.username.toLowerCase();
        return (
          <button
            key={p.key}
            onClick={() => handleSelect(p.key)}
            className={`px-3 py-1 rounded-xl transition-all border ${
              isActive 
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{p.label}</span>
            <span className="text-[10px] text-slate-400 ml-1.5 opacity-80">({p.sub})</span>
          </button>
        );
      })}
    </div>
  );
};
