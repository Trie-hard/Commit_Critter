import React, { useState } from 'react';
import { 
  SandboxOverrides, 
  CritterStage, 
  CritterElement 
} from '../types/critter';
import { 
  Wrench, 
  ChevronUp, 
  ChevronDown, 
  RotateCcw, 
  Plus, 
  FastForward, 
  Layers,
  Palette
} from 'lucide-react';

interface SandboxControlsProps {
  overrides: SandboxOverrides;
  onSimulatePush: (count: number) => void;
  onSimulateDaysIdle: (days: number) => void;
  onForceStage: (stage: CritterStage) => void;
  onForceElement: (element: CritterElement) => void;
  onReset: () => void;
}

const STAGES: CritterStage[] = ['EGG', 'HATCHLING', 'JUVENILE', 'ADULT', 'MYTHIC'];
const ELEMENTS: { key: CritterElement; label: string; icon: string }[] = [
  { key: 'FLORA', label: 'Flora (Python)', icon: '🍃' },
  { key: 'VOLT', label: 'Volt (JS/TS)', icon: '⚡' },
  { key: 'FERRO', label: 'Ferro (Rust/C++)', icon: '🦀' },
  { key: 'TIDAL', label: 'Tidal (Go/Ruby)', icon: '🌊' },
  { key: 'PRISM', label: 'Prism (Design/CSS)', icon: '💎' },
  { key: 'VOID', label: 'Void (Cosmic)', icon: '🌌' },
];

export const SandboxControls: React.FC<SandboxControlsProps> = ({
  overrides,
  onSimulatePush,
  onSimulateDaysIdle,
  onForceStage,
  onForceElement,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
      <div className="pointer-events-auto bg-slate-900/95 border-2 border-cyan-500/40 rounded-3xl shadow-[0_10px_35px_rgba(0,240,255,0.2)] backdrop-blur-xl transition-all overflow-hidden">
        
        {/* Header Bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-slate-800/60 transition-colors select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="font-pixel text-xs text-white">Judge Time Machine & Sandbox</span>
              <p className="text-[11px] text-slate-400 font-mono">
                Simulate commits, streaks & instant evolutions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {overrides.active && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold animate-pulse">
                Sandbox Overrides Active
              </span>
            )}
            <button className="text-slate-400 hover:text-white p-1">
              {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Controls Panel */}
        {isOpen && (
          <div className="p-5 border-t border-slate-800 flex flex-col gap-4 font-mono text-xs">
            
            {/* 1. Push Commits & Idle Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Simulate Git Commits */}
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-2">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simulate Git Push:</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSimulatePush(1)}
                    className="flex-1 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold transition-all"
                  >
                    +1 Commit
                  </button>
                  <button
                    onClick={() => onSimulatePush(5)}
                    className="flex-1 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold transition-all"
                  >
                    +5 Commits
                  </button>
                  <button
                    onClick={() => onSimulatePush(20)}
                    className="flex-1 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 rounded-xl font-bold transition-all"
                  >
                    +20 🚀
                  </button>
                </div>
              </div>

              {/* Simulate Inactivity / Time Forward */}
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-2">
                  <FastForward className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate Inactivity (Decay):</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSimulateDaysIdle(1)}
                    className="flex-1 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 rounded-xl font-bold transition-all"
                  >
                    +1 Day
                  </button>
                  <button
                    onClick={() => onSimulateDaysIdle(3)}
                    className="flex-1 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 rounded-xl font-bold transition-all"
                  >
                    +3d (Sleepy)
                  </button>
                  <button
                    onClick={() => onSimulateDaysIdle(7)}
                    className="flex-1 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 rounded-xl font-bold transition-all"
                  >
                    +7d (Droopy)
                  </button>
                </div>
              </div>

            </div>

            {/* 2. Instant Evolution Jump */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Fast-Forward Evolution Stage:
                </span>
                <span className="text-[10px] text-slate-400">Trigger instant metamorphosis</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    onClick={() => onForceStage(s)}
                    className="px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-700/50 text-cyan-200 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Elemental Affinity Swap */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Palette className="w-3.5 h-3.5 text-pink-400" /> Switch Elemental Skin:
                </span>
                <span className="text-[10px] text-slate-400">Derived from top language</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ELEMENTS.map((el) => (
                  <button
                    key={el.key}
                    onClick={() => onForceElement(el.key)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-200 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>{el.icon}</span>
                    <span className="truncate">{el.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 text-rose-200 rounded-xl font-bold transition-all text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Real GitHub Activity</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
