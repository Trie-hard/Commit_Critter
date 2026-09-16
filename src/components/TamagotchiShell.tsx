import React, { useState } from 'react';
import { ShellTheme, CritterStats } from '../types/critter';
import { CritterSprite } from './CritterSprite';
import { soundFx } from '../services/audioEngine';
import { Heart, Utensils, Sparkles, Wifi, BatteryCharging, Moon, Sun } from 'lucide-react';

interface TamagotchiShellProps {
  stats: CritterStats;
  theme: ShellTheme;
  onPet: () => void;
  onFeed: () => void;
  onCheer: () => void;
  onSelectTheme: (theme: ShellTheme) => void;
}

const SHELL_STYLES: Record<ShellTheme, {
  outer: string;
  bezel: string;
  screenBg: string;
  buttonA: string;
  buttonB: string;
  buttonC: string;
  accentText: string;
  label: string;
}> = {
  GAMEBOY: {
    outer: 'bg-[#c8c6be] border-[#a09e96] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)]',
    bezel: 'bg-[#595d66] border-[#42454c]',
    screenBg: 'pixel-lcd-bg text-[#0f380f]',
    buttonA: 'bg-[#9e2261] active:translate-y-1 shadow-[0_4px_0_#69123e]',
    buttonB: 'bg-[#9e2261] active:translate-y-1 shadow-[0_4px_0_#69123e]',
    buttonC: 'bg-[#4b5563] active:translate-y-1 shadow-[0_4px_0_#1f2937]',
    accentText: 'text-[#002fbe]',
    label: 'DMG-01 Classic',
  },
  CYBER: {
    outer: 'bg-[#0f172a] border-[#1e293b] shadow-[0_20px_50px_rgba(0,240,255,0.15),inset_0_2px_4px_rgba(0,240,255,0.2)]',
    bezel: 'bg-[#0b111e] border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]',
    screenBg: 'cyber-lcd-bg text-cyan-200',
    buttonA: 'bg-[#00f0ff] text-black active:translate-y-1 shadow-[0_4px_0_#0284c7]',
    buttonB: 'bg-[#ff007f] text-white active:translate-y-1 shadow-[0_4px_0_#be185d]',
    buttonC: 'bg-[#ffe600] text-black active:translate-y-1 shadow-[0_4px_0_#ca8a04]',
    accentText: 'text-cyan-400',
    label: 'Cyberpunk 2077',
  },
  SAKURA: {
    outer: 'bg-[#ffd1dc] border-[#f4a6b8] shadow-[0_20px_50px_rgba(255,105,180,0.2),inset_0_2px_4px_rgba(255,255,255,0.8)]',
    bezel: 'bg-[#fff0f3] border-[#ffccd5]',
    screenBg: 'bg-[#fff5f7] text-[#9d174d]',
    buttonA: 'bg-[#ff758f] active:translate-y-1 shadow-[0_4px_0_#d90429] text-white',
    buttonB: 'bg-[#ff8fa3] active:translate-y-1 shadow-[0_4px_0_#c9184a] text-white',
    buttonC: 'bg-[#ffb3c1] active:translate-y-1 shadow-[0_4px_0_#a4133c] text-white',
    accentText: 'text-[#ff4d6d]',
    label: 'Sakura Kawaii',
  },
  ATOMIC_PURPLE: {
    outer: 'bg-[#581c87]/90 backdrop-blur-md border-[#7e22ce] shadow-[0_20px_50px_rgba(147,51,234,0.3),inset_0_2px_4px_rgba(216,180,254,0.3)]',
    bezel: 'bg-[#3b0764] border-[#6b21a8]',
    screenBg: 'bg-[#1e1035] text-purple-200',
    buttonA: 'bg-[#a855f7] active:translate-y-1 shadow-[0_4px_0_#6b21a8]',
    buttonB: 'bg-[#9333ea] active:translate-y-1 shadow-[0_4px_0_#581c87]',
    buttonC: 'bg-[#7e22ce] active:translate-y-1 shadow-[0_4px_0_#3b0764]',
    accentText: 'text-purple-300',
    label: 'Atomic 90s',
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
  const [scanlines, setScanlines] = useState<boolean>(true);
  const shellStyle = SHELL_STYLES[theme] || SHELL_STYLES.GAMEBOY;

  const handleAction = (callback: () => void) => {
    soundFx.playClick();
    callback();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Shell Selector Tabs */}
      <div className="flex items-center gap-2 mb-4 bg-slate-900/80 p-1.5 rounded-full border border-slate-800 text-xs font-mono">
        <span className="text-slate-400 pl-2">Shell:</span>
        {(Object.keys(SHELL_STYLES) as ShellTheme[]).map((t) => (
          <button
            key={t}
            onClick={() => onSelectTheme(t)}
            className={`px-3 py-1 rounded-full transition-all text-[11px] font-bold ${
              theme === t 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {SHELL_STYLES[t].label}
          </button>
        ))}
      </div>

      {/* Main Handheld Device Body */}
      <div className={`relative w-[340px] sm:w-[380px] p-6 sm:p-7 rounded-[48px] border-4 transition-colors duration-500 ${shellStyle.outer}`}>
        
        {/* Device Brand Header */}
        <div className="flex items-center justify-between px-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-pixel text-[9px] tracking-wider uppercase text-slate-700 font-extrabold">
              BATTERY
            </span>
          </div>
          <span className="font-pixel text-[11px] font-black tracking-widest text-slate-700">
            COMMIT CRITTER™
          </span>
          <button
            onClick={() => setScanlines(!scanlines)}
            className="text-[10px] text-slate-700 hover:text-black font-pixel underline"
            title="Toggle retro CRT scanlines"
          >
            {scanlines ? 'CRT' : 'FLAT'}
          </button>
        </div>

        {/* Bezel Frame */}
        <div className={`p-4 rounded-[28px] border-2 shadow-inner ${shellStyle.bezel}`}>
          
          {/* LCD Screen Display */}
          <div className={`relative rounded-xl overflow-hidden p-3 border-2 border-black/30 shadow-2xl ${shellStyle.screenBg} ${scanlines ? 'scanlines' : ''}`}>
            
            {/* Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-current/20 pb-1 mb-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Wifi className="w-3.5 h-3.5" />
                <span className="font-pixel text-[8px] uppercase">{stats.stage}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-pixel text-[9px]">{stats.mood}</span>
                {stats.mood === 'SLEEPING' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </div>
              <div className="flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span className="font-bold">{stats.energy}%</span>
              </div>
            </div>

            {/* Central Sprite Canvas Area */}
            <div className="h-64 flex flex-col items-center justify-center relative">
              <CritterSprite
                stage={stats.stage}
                element={stats.element}
                mood={stats.mood}
                onPet={onPet}
              />
            </div>

            {/* Bottom Screen Ticker / Subtitle */}
            <div className="mt-1 pt-1.5 border-t border-current/20 flex items-center justify-between text-[10px] font-mono font-semibold">
              <span className="truncate max-w-[170px]">{stats.title}</span>
              <span className="font-pixel text-[8px]">LVL {stats.level}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Physical Tactile Buttons */}
        <div className="mt-6 flex flex-col gap-4">
          
          {/* Main 3 Action Buttons */}
          <div className="flex items-center justify-around px-2">
            
            {/* Button A: Pet */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleAction(onPet)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${shellStyle.buttonA}`}
                title="Pet your critter"
              >
                <Heart className="w-6 h-6 fill-current" />
              </button>
              <span className="font-pixel text-[9px] text-slate-700 font-bold uppercase mt-1">
                A • PET
              </span>
            </div>

            {/* Button B: Feed */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleAction(onFeed)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${shellStyle.buttonB}`}
                title="Feed a commit snack"
              >
                <Utensils className="w-6 h-6" />
              </button>
              <span className="font-pixel text-[9px] text-slate-700 font-bold uppercase mt-1">
                B • FEED
              </span>
            </div>

            {/* Button C: Cheer */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleAction(onCheer)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${shellStyle.buttonC}`}
                title="Cheer up your critter"
              >
                <Sparkles className="w-6 h-6" />
              </button>
              <span className="font-pixel text-[9px] text-slate-700 font-bold uppercase mt-1">
                C • CHEER
              </span>
            </div>

          </div>

          {/* Speaker Grille Detail */}
          <div className="flex justify-end gap-1.5 pr-6 mt-1">
            <div className="w-1.5 h-6 rounded-full bg-slate-700/30 transform rotate-45" />
            <div className="w-1.5 h-6 rounded-full bg-slate-700/30 transform rotate-45" />
            <div className="w-1.5 h-6 rounded-full bg-slate-700/30 transform rotate-45" />
          </div>

        </div>

      </div>
    </div>
  );
};
