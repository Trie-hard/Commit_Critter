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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-white border border-black/[0.08] rounded-[28px] p-6 max-w-lg w-full shadow-modal flex flex-col gap-4 relative animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fbe1d1] text-[#5d2a1a] flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-ink-black">
                Achievements & Badges
              </h2>
              <p className="text-xs text-slate-gray mt-0.5">
                Unlocked {unlockedCount} of {achievements.length} milestones
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-black/[0.08] flex items-center justify-center text-slate-gray hover:text-ink-black hover:bg-mist-gray transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Badges */}
        <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                ach.unlocked
                  ? 'bg-white border-black/[0.08] text-ink-black shadow-xs'
                  : 'bg-mist-gray/60 border-transparent text-slate-gray opacity-60'
              }`}
            >
              <div className="text-2xl p-2 bg-mist-gray rounded-xl shrink-0">
                {ach.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ink-black">{ach.title}</span>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-gray" />
                  )}
                </div>
                <p className="text-xs text-slate-gray mt-0.5">{ach.description}</p>
                {ach.unlocked && ach.unlockedAt && (
                  <span className="text-[10px] font-mono text-amber-700 mt-1 block">
                    Unlocked on {ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-black/[0.06] pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="pill-button-primary text-xs py-2 px-6"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
