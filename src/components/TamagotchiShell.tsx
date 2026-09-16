import React, { useState } from 'react';
import { ShellTheme, CritterStats } from '../types/critter';
import { CritterSprite } from './CritterSprite';
import { soundFx } from '../services/audioEngine';
import { Heart, Utensils, Sparkles, Sun, Moon, BatteryCharging } from 'lucide-react';

interface TamagotchiShellProps {
  stats: CritterStats;
  theme: ShellTheme;
  onPet: () => void;
  onFeed: () => void;
  onCheer: () => void;
  onSelectTheme: (theme: ShellTheme) => void;
}

// Minimal, elegant hardware finishes inspired by industrial product design
const SHELL_STYLES: Record<ShellTheme, {
  label: string;
  body: string;
  screenBg: string;
  accent: string;
  buttonFill: string;
  buttonText: string;
}> = {
  GAMEBOY: {
    label: 'DMG Classic',
    body: '#e8e6df',
    screenBg: '#8fae1b',
    accent: '#8f2d56',
    buttonFill: '#8f2d56',
    buttonText: '#ffffff',
  },
  CYBER: {
    label: 'Paper White',
    body: '#ffffff',
    screenBg: '#f8f8fa',
    accent: '#17191c',
    buttonFill: '#17191c',
    buttonText: '#ffffff',
  },
  SAKURA: {
    label: 'Blush Peach',
    body: '#fbe1d1',
    screenBg: '#fffbf8',
    accent: '#5d2a1a',
    buttonFill: '#5d2a1a',
    buttonText: '#fbe1d1',
  },
  ATOMIC_PURPLE: {
    label: 'Mist Sage',
    body: '#e9ece6',
    screenBg: '#f6f8f5',
    accent: '#2d4a34',
    buttonFill: '#2d4a34',
    buttonText: '#ffffff',
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
  const s = SHELL_STYLES[theme] || SHELL_STYLES.CYBER;

  const handleAction = (cb: () => void) => {
    soundFx.playClick();
    cb();
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none w-full max-w-[320px]">
      
      {/* Shell Finish Selector — Pill Toggle */}
      <div className="flex items-center gap-1 bg-mist-gray p-1 rounded-full border border-black/[0.04] w-full">
        {(Object.keys(SHELL_STYLES) as ShellTheme[]).map((t) => (
          <button
            key={t}
            onClick={() => onSelectTheme(t)}
            className={`flex-1 py-1.5 rounded-full text-[12px] font-medium transition-all ${
              theme === t
                ? 'bg-white text-ink-black shadow-sm font-semibold'
                : 'text-slate-gray hover:text-ink-black'
            }`}
          >
            {SHELL_STYLES[t].label}
          </button>
        ))}
        <button
          onClick={() => setScanlines(!scanlines)}
          title="Toggle CRT display lines"
          className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
            scanlines ? 'bg-ink-black text-white' : 'text-slate-gray hover:text-ink-black'
          }`}
        >
          CRT
        </button>
      </div>

      {/* ─── Hardware Specimen Device ─── */}
      <div
        className="relative rounded-[36px] w-full designer-device-shell overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: s.body,
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Top Header Strip */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: s.accent }}
            />
            <span
              className="font-mono text-[10px] tracking-wider uppercase font-semibold opacity-75"
              style={{ color: s.accent }}
            >
              CRITTER #{stats.level.toString().padStart(3, '0')}
            </span>
          </div>

          <div
            className="flex items-center gap-1 text-[11px] font-mono font-medium opacity-75"
            style={{ color: s.accent }}
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>{stats.energy}%</span>
          </div>
        </div>

        {/* ─── Screen Window ─── */}
        <div className="px-5 py-2">
          <div
            className={`relative rounded-2xl overflow-hidden border border-black/[0.08] transition-all ${
              scanlines ? 'scanlines' : ''
            }`}
            style={{
              backgroundColor: s.screenBg,
              minHeight: '260px',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Mood & Element Pill Badge */}
            <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sans font-medium bg-white/90 backdrop-blur-sm border border-black/[0.06] text-ink-black shadow-sm">
                {stats.mood === 'SLEEPING' ? (
                  <Moon className="w-3 h-3 text-slate-gray" />
                ) : (
                  <Sun className="w-3 h-3 text-amber-500" />
                )}
                <span>{stats.mood.toLowerCase()}</span>
                <span className="text-black/20">·</span>
                <span className="font-mono text-[10px] text-slate-gray uppercase">
                  {stats.element}
                </span>
              </div>
            </div>

            {/* Critter Sprite SVG */}
            <div className="flex items-center justify-center pt-2" style={{ minHeight: '230px' }}>
              <CritterSprite
                stage={stats.stage}
                element={stats.element}
                mood={stats.mood}
                onPet={onPet}
              />
            </div>

            {/* Stage / Name Bottom Pill */}
            <div className="absolute bottom-2.5 left-0 right-0 flex justify-center">
              <span className="font-mono text-[10px] px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-black/[0.06] text-ink-black shadow-xs font-medium">
                {stats.title} — Stage {stats.stage}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Tactile Action Buttons ─── */}
        <div className="px-6 pt-3 pb-3 flex items-center justify-around">
          {[
            { label: 'Pet', icon: Heart, cb: onPet },
            { label: 'Feed', icon: Utensils, cb: onFeed },
            { label: 'Cheer', icon: Sparkles, cb: onCheer },
          ].map(({ label, icon: Icon, cb }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => handleAction(cb)}
                className="w-13 h-13 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 hover:opacity-90 shadow-sm"
                style={{
                  backgroundColor: s.buttonFill,
                  color: s.buttonText,
                }}
                title={`${label} your critter`}
              >
                <Icon className="w-5 h-5" />
              </button>
              <span
                className="text-[11px] font-sans font-medium tracking-wide uppercase"
                style={{ color: s.accent, opacity: 0.8 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Minimal Speaker Grille */}
        <div className="flex justify-center gap-1.5 pb-4 opacity-25">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: s.accent }}
            />
          ))}
        </div>
      </div>

      {/* Stage Evolution EXP Progress */}
      <div className="w-full card-neutral p-3.5 flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline text-[12px] font-mono text-slate-gray">
          <span>Evolution Progress</span>
          <span className="font-semibold text-ink-black">
            {stats.exp} / {stats.maxExp} XP
          </span>
        </div>
        <div className="stat-bar-track-light">
          <div
            className="stat-bar-fill-light bg-ink-black"
            style={{ width: `${Math.min(100, (stats.exp / stats.maxExp) * 100)}%` }}
          />
        </div>
      </div>

    </div>
  );
};
