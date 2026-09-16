import React, { useState } from 'react';
import { ShellTheme, CritterStats } from '../types/critter';
import { CritterSprite } from './CritterSprite';
import { soundFx } from '../services/audioEngine';
import { Heart, Utensils, Sparkles, BatteryCharging, Moon, Sun } from 'lucide-react';

interface TamagotchiShellProps {
  stats: CritterStats;
  theme: ShellTheme;
  onPet: () => void;
  onFeed: () => void;
  onCheer: () => void;
  onSelectTheme: (theme: ShellTheme) => void;
}

// Element-specific glow colors for the halo ring
const ELEMENT_HALO: Record<string, { glow: string; ring: string; orb: string }> = {
  FLORA: { glow: 'rgba(34,197,94,0.35)', ring: 'rgba(34,197,94,0.4)',  orb: 'rgba(34,197,94,0.7)' },
  VOLT:  { glow: 'rgba(234,179,8,0.35)', ring: 'rgba(234,179,8,0.4)',  orb: 'rgba(234,179,8,0.7)' },
  FERRO: { glow: 'rgba(249,115,22,0.35)',ring: 'rgba(249,115,22,0.4)', orb: 'rgba(249,115,22,0.7)' },
  TIDAL: { glow: 'rgba(56,189,248,0.35)',ring: 'rgba(56,189,248,0.4)', orb: 'rgba(56,189,248,0.7)' },
  PRISM: { glow: 'rgba(236,72,153,0.35)',ring: 'rgba(236,72,153,0.4)', orb: 'rgba(236,72,153,0.7)' },
  VOID:  { glow: 'rgba(139,92,246,0.35)',ring: 'rgba(139,92,246,0.4)', orb: 'rgba(139,92,246,0.7)' },
};

// Shell cosmetic themes still available (used to tint the device body)
const SHELL_META: Record<ShellTheme, { label: string; bodyGrad: string; accent: string }> = {
  GAMEBOY: {
    label: 'DMG-01',
    bodyGrad: 'linear-gradient(160deg, #c8c6be 0%, #a09e96 100%)',
    accent: '#9e2261',
  },
  CYBER: {
    label: 'Cyber',
    bodyGrad: 'linear-gradient(160deg, #0d1526 0%, #070b16 100%)',
    accent: '#00f0ff',
  },
  SAKURA: {
    label: 'Sakura',
    bodyGrad: 'linear-gradient(160deg, #ffd1dc 0%, #f4a6b8 100%)',
    accent: '#ff758f',
  },
  ATOMIC_PURPLE: {
    label: 'Atomic',
    bodyGrad: 'linear-gradient(160deg, #4c1d95 0%, #2e1065 100%)',
    accent: '#a855f7',
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
  const [plasmaTarget, setPlasmaTarget] = useState<'pet' | 'feed' | 'cheer' | null>(null);
  const halo = ELEMENT_HALO[stats.element] ?? ELEMENT_HALO.VOID;
  const shell = SHELL_META[theme];

  const triggerPlasma = (btn: 'pet' | 'feed' | 'cheer', cb: () => void) => {
    soundFx.playClick();
    cb();
    setPlasmaTarget(btn);
    setTimeout(() => setPlasmaTarget(null), 700);
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none">

      {/* ── Shell Theme Selector ── */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-cosmic-deep/80 border border-white/[0.06]">
        {(Object.keys(SHELL_META) as ShellTheme[]).map((t) => (
          <button
            key={t}
            onClick={() => onSelectTheme(t)}
            className={`px-3 py-1 rounded-xl text-[10px] font-mono font-semibold transition-all duration-200 ${
              theme === t
                ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {SHELL_META[t].label}
          </button>
        ))}
        <button
          onClick={() => setScanlines(!scanlines)}
          className={`ml-1 px-2 py-1 rounded-xl text-[10px] font-mono transition-all ${
            scanlines ? 'text-cyan-400 border border-cyan-500/30 bg-cyan-500/10' : 'text-slate-500'
          }`}
          title="Toggle CRT scanlines"
        >CRT</button>
      </div>

      {/* ── Main Specimen Case ── */}
      <div className="relative" style={{ width: '320px' }}>

        {/* Outermost halo / element glow pulse */}
        <div
          className="absolute inset-0 rounded-[44px] animate-halo-pulse pointer-events-none"
          style={{
            boxShadow: `0 0 60px 10px ${halo.glow}, 0 0 120px 20px ${halo.glow.replace('0.35', '0.1')}`,
          }}
        />

        {/* Orbital decorative arcs — steampunk-inspired concentric rings */}
        <div
          className="absolute animate-orbit-spin pointer-events-none"
          style={{
            width: '370px', height: '370px',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="orbital-ring w-full h-full"
            style={{ borderColor: `${halo.ring.replace('0.4', '0.15')}` }}
          />
          {/* Orbital dot marker */}
          <div
            className="absolute w-2 h-2 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1"
            style={{ background: halo.ring, boxShadow: `0 0 8px ${halo.ring}` }}
          />
        </div>
        <div
          className="absolute animate-orbit-spin-rev pointer-events-none"
          style={{
            width: '410px', height: '410px',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="orbital-ring w-full h-full"
            style={{ borderColor: `${halo.ring.replace('0.4', '0.08')}`, borderStyle: 'dashed' }}
          />
        </div>

        {/* Glass Specimen Case — main body */}
        <div
          className="relative rounded-[40px] overflow-hidden riveted"
          style={{
            background: shell.bodyGrad,
            border: `2px solid rgba(255,255,255,0.1)`,
            boxShadow: `
              0 24px 80px rgba(0,0,0,0.7),
              0 2px 0 rgba(255,255,255,0.1) inset,
              0 -2px 0 rgba(0,0,0,0.4) inset,
              0 0 0 1px rgba(255,255,255,0.04) inset
            `,
          }}
        >
          {/* Inner top-edge highlight (rivet-level sheen) */}
          <div
            className="absolute top-0 left-4 right-4 h-px opacity-40 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
          />

          <div className="p-5">
            {/* Device Status Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono mb-3 px-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: shell.accent, boxShadow: `0 0 6px ${shell.accent}` }}
                />
                <span className="font-pixel text-[7px] text-white/50 uppercase tracking-widest">
                  {stats.stage}
                </span>
              </div>
              <span className="font-pixel text-[8px] text-white/70 tracking-widest">
                COMMIT CRITTER™
              </span>
              <div className="flex items-center gap-1 text-white/50">
                <BatteryCharging className="w-3 h-3" />
                <span>{stats.energy}%</span>
              </div>
            </div>

            {/* LCD Viewport */}
            <div
              className={`relative rounded-3xl overflow-hidden ${scanlines ? 'scanlines' : ''}`}
              style={{
                background: 'radial-gradient(ellipse at 50% 30%, #0d1f3c 0%, #060e1c 100%)',
                border: '2px solid rgba(0,0,0,0.5)',
                boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.6)',
                minHeight: '280px',
              }}
            >
              {/* Screen inner glow from element */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background: `radial-gradient(ellipse at 50% 80%, ${halo.glow.replace('0.35', '0.12')} 0%, transparent 65%)`,
                }}
              />

              {/* Mood / Stage status */}
              <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono"
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: `1px solid ${halo.ring.replace('0.4', '0.3')}`,
                    color: halo.ring,
                  }}
                >
                  {stats.mood === 'SLEEPING' ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
                  <span>{stats.mood}</span>
                  <span className="opacity-50">·</span>
                  <span>{stats.element}</span>
                </div>
              </div>

              {/* Critter Sprite */}
              <div className="flex items-center justify-center py-4" style={{ minHeight: '240px' }}>
                <CritterSprite
                  stage={stats.stage}
                  element={stats.element}
                  mood={stats.mood}
                  onPet={onPet}
                />
              </div>

              {/* Level badge */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div
                  className="font-pixel text-[8px] px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    color: shell.accent,
                    border: `1px solid ${shell.accent}40`,
                  }}
                >
                  {stats.title} — LVL {stats.level}
                </div>
              </div>
            </div>

            {/* Action Buttons Row — Glass Orbs */}
            <div className="flex items-center justify-around mt-5 px-2">
              {[
                { id: 'pet' as const,   icon: Heart,     label: 'PET',   color: '#ec4899', cb: onPet },
                { id: 'feed' as const,  icon: Utensils,  label: 'FEED',  color: '#22c55e', cb: onFeed },
                { id: 'cheer' as const, icon: Sparkles,  label: 'CHEER', color: shell.accent, cb: onCheer },
              ].map(({ id, icon: Icon, label, color, cb }) => (
                <div key={id} className="flex flex-col items-center gap-2">
                  <button
                    className="glass-orb w-14 h-14 flex items-center justify-center relative"
                    onClick={() => triggerPlasma(id, cb)}
                    style={{
                      background: `radial-gradient(ellipse at 38% 32%, ${color}25 0%, ${color}08 55%, rgba(0,0,0,0.3) 100%)`,
                      borderColor: `${color}30`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5 relative z-10"
                      style={{ color }}
                    />
                    {/* Plasma ripple on click */}
                    {plasmaTarget === id && (
                      <div
                        className="absolute inset-0 rounded-full animate-plasma-ripple pointer-events-none"
                        style={{ background: `${color}20`, border: `2px solid ${color}60` }}
                      />
                    )}
                  </button>
                  <span className="font-pixel text-[7px] text-white/40 uppercase tracking-widest">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Speaker Grille dots (Steampunk decorative detail) */}
            <div className="flex justify-center gap-1.5 mt-4 opacity-30">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white/60" />
              ))}
            </div>
          </div>
        </div>

        {/* Rivet bolts at corners (Steampunk influence) */}
        {[
          { top: '12px', left: '12px' },
          { top: '12px', right: '12px' },
          { bottom: '12px', left: '12px' },
          { bottom: '12px', right: '12px' },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full pointer-events-none z-20"
            style={{
              ...pos,
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7), rgba(80,80,80,0.4))',
              boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          />
        ))}
      </div>

      {/* EXP bar beneath the case */}
      <div className="w-full max-w-[320px]">
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1.5 px-1">
          <span>EXP</span>
          <span>{stats.exp} / {stats.maxExp}</span>
        </div>
        <div
          className="h-1.5 w-full rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.round((stats.exp / stats.maxExp) * 100))}%`,
              background: `linear-gradient(90deg, ${halo.ring.replace('0.4', '0.9')}, ${halo.ring.replace('0.4', '0.5')})`,
              boxShadow: `0 0 8px ${halo.ring}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
