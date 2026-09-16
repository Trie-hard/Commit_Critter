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
      <div className="pointer-events-auto bg-white/95 border border-black/[0.1] rounded-[28px] shadow-artifact backdrop-blur-md transition-all overflow-hidden">
        
        {/* Header Bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-6 py-3.5 cursor-pointer hover:bg-mist-gray/50 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-mist-gray text-ink-black flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="font-sans font-semibold text-xs text-ink-black uppercase tracking-wider">
                Judge Sandbox & Time Machine
              </span>
              <p className="text-[11px] text-slate-gray font-normal">
                Simulate commits, streaks & instant evolutions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {overrides.active && (
              <span className="px-3 py-0.5 rounded-full bg-[#fbe1d1] text-[#5d2a1a] text-[11px] font-medium border border-[#5d2a1a]/15">
                Overrides Active
              </span>
            )}
            <button className="text-slate-gray hover:text-ink-black p-1">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Controls Panel */}
        {isOpen && (
          <div className="p-6 border-t border-black/[0.06] flex flex-col gap-4 font-sans text-xs">
            
            {/* 1. Push Commits & Idle Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Simulate Git Commits */}
              <div className="bg-mist-gray/70 p-3.5 rounded-2xl border border-black/[0.04]">
                <div className="flex items-center gap-1.5 text-ink-black font-medium mb-2">
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Simulate Git Push:</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSimulatePush(1)}
                    className="flex-1 py-1.5 bg-white hover:bg-black/5 border border-black/[0.08] text-ink-black rounded-xl font-medium transition-all shadow-xs"
                  >
                    +1 Commit
                  </button>
                  <button
                    onClick={() => onSimulatePush(5)}
                    className="flex-1 py-1.5 bg-white hover:bg-black/5 border border-black/[0.08] text-ink-black rounded-xl font-medium transition-all shadow-xs"
                  >
                    +5 Commits
                  </button>
                  <button
                    onClick={() => onSimulatePush(20)}
                    className="flex-1 py-1.5 bg-ink-black hover:opacity-90 text-white rounded-xl font-medium transition-all shadow-xs"
                  >
                    +20 (Level Up)
                  </button>
                </div>
              </div>

              {/* Simulate Days Idle */}
              <div className="bg-mist-gray/70 p-3.5 rounded-2xl border border-black/[0.04]">
                <div className="flex items-center gap-1.5 text-ink-black font-medium mb-2">
                  <FastForward className="w-3.5 h-3.5 text-amber-700" />
                  <span>Simulate Days of Inactivity:</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSimulateDaysIdle(1)}
                    className="flex-1 py-1.5 bg-white hover:bg-black/5 border border-black/[0.08] text-ink-black rounded-xl font-medium transition-all shadow-xs"
                  >
                    +1 Day
                  </button>
                  <button
                    onClick={() => onSimulateDaysIdle(3)}
                    className="flex-1 py-1.5 bg-white hover:bg-black/5 border border-black/[0.08] text-ink-black rounded-xl font-medium transition-all shadow-xs"
                  >
                    +3 Days (Droopy)
                  </button>
                  <button
                    onClick={() => onSimulateDaysIdle(7)}
                    className="flex-1 py-1.5 bg-[#fee2e2] hover:bg-[#fecaca] border border-[#ef4444]/30 text-[#991b1b] rounded-xl font-medium transition-all shadow-xs"
                  >
                    +7 Days (Sleeping)
                  </button>
                </div>
              </div>

            </div>

            {/* 2. Force Stage Evolution */}
            <div className="bg-mist-gray/70 p-3.5 rounded-2xl border border-black/[0.04]">
              <div className="flex items-center gap-1.5 text-ink-black font-medium mb-2">
                <Layers className="w-3.5 h-3.5 text-slate-gray" />
                <span>Instant Evolution Jump:</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {STAGES.map((stg) => (
                  <button
                    key={stg}
                    onClick={() => onForceStage(stg)}
                    className={`py-1.5 rounded-xl border font-medium text-[11px] transition-all ${
                      overrides.forcedStage === stg
                        ? 'bg-ink-black text-white border-ink-black shadow-xs'
                        : 'bg-white text-slate-gray hover:text-ink-black border-black/[0.08]'
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Force Elemental Affinity */}
            <div className="bg-mist-gray/70 p-3.5 rounded-2xl border border-black/[0.04]">
              <div className="flex items-center gap-1.5 text-ink-black font-medium mb-2">
                <Palette className="w-3.5 h-3.5 text-slate-gray" />
                <span>Force Elemental Affinity:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ELEMENTS.map((el) => (
                  <button
                    key={el.key}
                    onClick={() => onForceElement(el.key)}
                    className={`py-1.5 px-2.5 rounded-xl border text-left flex items-center gap-1.5 transition-all text-[11px] ${
                      overrides.forcedElement === el.key
                        ? 'bg-ink-black text-white border-ink-black shadow-xs'
                        : 'bg-white text-slate-gray hover:text-ink-black border-black/[0.08]'
                    }`}
                  >
                    <span>{el.icon}</span>
                    <span className="truncate">{el.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {overrides.active && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={onReset}
                  className="pill-button-ghost text-xs py-1.5 px-4 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Sandbox to Live GitHub Data</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
