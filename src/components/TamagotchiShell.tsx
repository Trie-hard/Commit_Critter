import React, { useState } from 'react';
import { ShellTheme, CritterStats } from '../types/critter';
import { CritterSprite } from './CritterSprite';
import { soundFx } from '../services/audioEngine';
import { Heart, Utensils, Sparkles, Sun, Moon, BatteryMedium } from 'lucide-react';

interface TamagotchiShellProps {
  stats: CritterStats;
  theme: ShellTheme;
  onPet: () => void;
  onFeed: () => void;
  onCheer: () => void;
  onSelectTheme: (theme: ShellTheme) => void;
}

// Shell body colors — warm and varied, not neon
const SHELL_STYLES: Record<ShellTheme, {
  label: string;
  body: string;
  bodyBottom: string;
  buttonRing: string;
  screenBg: string;
}> = {
  GAMEBOY: {
    label: 'DMG-01',
    body: '#c4c2ba',
    bodyBottom: '#aeaca4',
    buttonRing: '#9e2261',
    screenBg: '#8fae1b',
  },
  CYBER: {
    label: 'Midnight',
    body: '#1e1a26',
    bodyBottom: '#161320',
    buttonRing: '#5a4f8c',
    screenBg: '#0d0a14',
  },
  SAKURA: {
    label: 'Sakura',
    body: '#f0c4ce',
    bodyBottom: '#e4b0bc',
    buttonRing: '#c45870',
    screenBg: '#fef0f3',
  },
  ATOMIC_PURPLE: {
    label: 'Grape',
    body: '#3a2060',
    bodyBottom: '#2c1848',
    buttonRing: '#7c4db8',
    screenBg: '#180e30',
  },
};

export const TamagotchiShell: React.FC<TamagotchiShellProps> = ({
  stats,
  theme,
  onPet,
  onFeed,
  onCheer,
  onSelectTheme,
}) => {
  const [scanlines, setScanlines] = useState(false);
  const s = SHELL_STYLES[theme];

  // Element-aware screen tint (subtle, not screaming)
  const ELEMENT_TINT: Record<string, string> = {
    FLORA: 'rgba(52,211,153,0.05)',
    VOLT:  'rgba(251,191,36,0.06)',
    FERRO: 'rgba(249,115,22,0.06)',
    TIDAL: 'rgba(56,189,248,0.05)',
    PRISM: 'rgba(236,72,153,0.05)',
    VOID:  'rgba(139,92,246,0.06)',
  };
  const screenTint = ELEMENT_TINT[stats.element] ?? 'transparent';

  const handleAction = (cb: () => void) => {
    soundFx.playClick();
    cb();
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none w-full max-w-[300px]">

      {/* Theme picker */}
      <div className="flex items-center gap-1 bg-ink-800 border border-ink-600 rounded-2xl p-1 w-full">
        {(Object.keys(SHELL_STYLES) as ShellTheme[]).map((t) => (
          <button
            key={t}
            onClick={() => onSelectTheme(t)}
            className={`flex-1 py-1 rounded-xl text-[10px] font-display font-semibold transition-all ${
              theme === t
                ? 'bg-ink-600 text-ink-50 shadow-sm'
                : 'text-ink-400 hover:text-ink-200'
            }`}
          >
            {SHELL_STYLES[t].label}
          </button>
        ))}
        <button
          onClick={() => setScanlines(!scanlines)}
          title="Toggle CRT scanlines"
          className={`px-2 py-1 rounded-xl text-[10px] font-mono transition-all ml-0.5 ${
            scanlines ? 'bg-ink-500 text-ink-100' : 'text-ink-500 hover:text-ink-300'
          }`}
        >
          CRT
        </button>
      </div>

      {/* ─── Device body ─── */}
      <div
        className="relative rounded-[36px] w-full device-shell overflow-hidden"
        style={{
          background: `linear-gradient(175deg, ${s.body} 0%, ${s.bodyBottom} 100%)`,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Top label strip */}
        <div className="px-6 pt-5 pb-1 flex items-center justify-between">
          <span
            className="font-pixel text-[7px] tracking-widest opacity-50"
            style={{ color: s.buttonRing }}
          >
            COMMIT CRITTER™
          </span>
          <div className="flex items-center gap-1.5 text-[9px] font-mono opacity-50"
            style={{ color: s.buttonRing }}>
            <BatteryMedium className="w-3 h-3" />
            {stats.energy}%
          </div>
        </div>

        {/* ─── LCD Screen ─── */}
        <div className="px-4 py-2">
          <div
            className={`relative rounded-2xl overflow-hidden ${scanlines ? 'scanlines' : ''}`}
            style={{
              background: theme === 'GAMEBOY' ? '#8fae1b' : s.screenBg,
              minHeight: '248px',
              border: '3px solid rgba(0,0,0,0.35)',
              boxShadow: 'inset 0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            {/* Subtle element screen tint */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: screenTint }}
            />

            {/* Mood chip */}
            <div className="absolute top-2.5 left-0 right-0 flex justify-center z-10">
              <div
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono"
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {stats.mood === 'SLEEPING' ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
                <span>{stats.mood}</span>
                <span className="opacity-40">·</span>
                <span>{stats.element}</span>
              </div>
            </div>

            {/* Critter */}
            <div className="flex items-center justify-center" style={{ minHeight: '220px' }}>
              <CritterSprite
                stage={stats.stage}
                element={stats.element}
                mood={stats.mood}
                onPet={onPet}
              />
            </div>

            {/* Level label */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <span
                className="font-pixel text-[7px] px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                {stats.title} — LVL {stats.level}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Action Buttons ─── */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-around">
          {[
            { label: 'PET',   icon: Heart,    cb: onPet,   color: '#e06b8a' },
            { label: 'FEED',  icon: Utensils, cb: onFeed,  color: '#5a9e72' },
            { label: 'CHEER', icon: Sparkles, cb: onCheer, color: '#e8b44a' },
          ].map(({ label, icon: Icon, cb, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => handleAction(cb)}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 active:shadow-none hover:opacity-90"
                style={{
                  background: `${color}22`,
                  border: `2px solid ${color}50`,
                  boxShadow: `0 3px 10px rgba(0,0,0,0.4)`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </button>
              <span
                className="font-pixel text-[7px] tracking-widest"
                style={{ color: s.buttonRing, opacity: 0.6 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Speaker dots */}
        <div className="flex justify-center gap-1.5 pb-5 opacity-20">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full" style={{ background: s.buttonRing }} />
          ))}
        </div>
      </div>

      {/* EXP bar below device */}
      <div className="w-full">
        <div className="flex justify-between text-[11px] font-mono text-ink-400 mb-1.5">
          <span>Progress to next stage</span>
          <span>{stats.exp} / {stats.maxExp} XP</span>
        </div>
        <div className="stat-bar-track">
          <div
            className="stat-bar-fill bg-ember-DEFAULT"
            style={{ width: `${Math.min(100, (stats.exp / stats.maxExp) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
