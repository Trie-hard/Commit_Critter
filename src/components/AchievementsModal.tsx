import React from 'react';
import { Achievement } from '../types/critter';
import { Trophy, X, CheckCircle2, Lock } from 'lucide-react';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClose,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 font-mono">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-pixel text-xs text-white uppercase">Achievements & Badges</h2>
              <p className="text-[11px] text-slate-400">
                Unlocked {unlockedCount} of {achievements.length} badges
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Badges */}
        <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                ach.unlocked
                  ? 'bg-slate-950/80 border-amber-500/40 text-slate-100 shadow-md'
                  : 'bg-slate-950/30 border-slate-800/60 text-slate-400 opacity-60'
              }`}
            >
              <div className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">
                {ach.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{ach.title}</span>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                {ach.unlocked && ach.unlockedAt && (
                  <span className="text-[9px] text-amber-400/80 mt-1 block">
                    Unlocked on {ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
