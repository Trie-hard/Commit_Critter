import React, { useState } from 'react';
import { CritterStats, GitHubActivityData } from '../types/critter';
import { requestNotificationPermission, sendCritterNotification } from '../services/notificationService';
import { soundFx } from '../services/audioEngine';
import { 
  Zap, 
  Smile, 
  Flame, 
  GitCommit, 
  Code2, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Moon, 
  Swords,
  Calendar,
  Bell,
  BellRing
} from 'lucide-react';

interface StatsDashboardProps {
  stats: CritterStats;
  githubData: GitHubActivityData;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, githubData }) => {
  const expPercent = Math.min(100, Math.round((stats.exp / stats.maxExp) * 100));
  const [notifsEnabled, setNotifsEnabled] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  const handleToggleNotifications = async () => {
    soundFx.playClick();
    const granted = await requestNotificationPermission();
    setNotifsEnabled(granted);
    if (granted) {
      soundFx.playChirp();
      sendCritterNotification(
        '🐾 Commit Critter Alert Active!',
        `Your ${stats.stage} will notify you if you forget to commit for 3 days!`
      );
    }
  };

  // Generate 16 weeks of contribution squares (16 cols x 7 rows = 112 days)
  const heatmapSquares = Array.from({ length: 112 }).map((_, i) => {
    const daysFromEnd = 111 - i;
    const isStreakDay = daysFromEnd < githubData.streakDays;
    const hasRecentCommit = daysFromEnd < Math.min(githubData.totalRecentCommits, 25) && (i % 2 === 0 || isStreakDay);
    
    let levelClass = 'bg-slate-800/80';
    if (isStreakDay) {
      levelClass = 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]';
    } else if (hasRecentCommit) {
      levelClass = i % 3 === 0 ? 'bg-emerald-600' : 'bg-emerald-700/80';
    }
    return { id: i, levelClass, daysFromEnd };
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      
      {/* 1. Vitality Meters (Energy, Happiness, Hunger, EXP) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-pixel text-xs text-cyan-400 uppercase tracking-wider">
              {stats.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{stats.personalityQuirk}</p>
          </div>
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full text-xs font-mono font-bold">
            Level {stats.level}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Energy Bar */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Zap className="w-3.5 h-3.5" /> Energy
              </span>
              <span className="text-slate-300 font-bold">{stats.energy}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
                style={{ width: `${stats.energy}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {stats.energy > 60 ? 'Active & buzzing!' : 'Tired — push fresh code!'}
            </p>
          </div>

          {/* Happiness Bar */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
              <span className="flex items-center gap-1.5 text-pink-400 font-semibold">
                <Smile className="w-3.5 h-3.5" /> Happiness
              </span>
              <span className="text-slate-300 font-bold">{stats.happiness}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500 rounded-full"
                style={{ width: `${stats.happiness}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {stats.happiness > 60 ? 'Loved & content' : 'Needs attention or commits'}
            </p>
          </div>

        </div>

        {/* Level Progression EXP Bar */}
        <div className="mt-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Evolution Progress
            </span>
            <span className="text-slate-300 font-bold">
              {stats.exp} / {stats.maxExp} EXP ({expPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${expPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>Stage: {stats.stage}</span>
            <span>Element: {stats.element}</span>
          </div>
        </div>

      </div>

      {/* 2. GitHub Activity & Streak Overview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-pixel text-xs text-slate-300 uppercase tracking-wider">
            GitHub Habit Metrics
          </h3>
          <div className="flex items-center gap-3">
            {/* Notification Alert Toggle */}
            <button
              onClick={handleToggleNotifications}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                notifsEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
              title="Toggle Browser Pet Misses You Notifications"
            >
              {notifsEnabled ? <BellRing className="w-3 h-3 text-emerald-400 animate-bounce" /> : <Bell className="w-3 h-3" />}
              <span>{notifsEnabled ? 'Alerts On' : 'Enable Alerts'}</span>
            </button>

            <a
              href={`https://github.com/${githubData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 lowercase font-mono"
            >
              @{githubData.username} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <div className="text-lg font-bold font-mono text-white">{githubData.streakDays}d</div>
            <div className="text-[10px] text-slate-400 uppercase font-pixel">Streak</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <GitCommit className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-bold font-mono text-white">{githubData.totalRecentCommits}</div>
            <div className="text-[10px] text-slate-400 uppercase font-pixel">Commits</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <Code2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-sm font-bold font-mono text-white truncate">{githubData.primaryLanguage}</div>
            <div className="text-[10px] text-slate-400 uppercase font-pixel">Main Lang</div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-xs font-bold font-mono text-white mt-1">
              {githubData.isNightOwl ? 'Night Owl' : 'Day Hacker'}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-pixel">Rhythm</div>
          </div>

        </div>

        {/* Mini Contribution Heatmap */}
        <div className="mb-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-semibold mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contribution Heatmap (16 Weeks)</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-bold">
              {githubData.streakDays} Day Active Streak
            </span>
          </div>
          
          <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto py-1">
            {heatmapSquares.map((sq) => (
              <div
                key={sq.id}
                className={`w-2.5 h-2.5 rounded-sm transition-all hover:scale-125 ${sq.levelClass}`}
                title={sq.daysFromEnd < githubData.streakDays ? `Active streak day!` : undefined}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-800" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            </div>
            <span>More Activity</span>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="mb-6">
          <div className="text-xs font-mono text-slate-300 font-semibold mb-2 flex items-center justify-between">
            <span>Elemental Language DNA</span>
            <span className="text-[11px] text-slate-400">{githubData.primaryLanguage} Dominant</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            {githubData.languages.map((lang) => (
              <div
                key={lang.name}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                title={`${lang.name}: ${lang.percentage}%`}
                className="h-full transition-all"
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2.5">
            {githubData.languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                <span>{lang.name}</span>
                <span className="text-slate-400">({lang.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges / Traits */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {githubData.isNightOwl && (
            <span className="px-2.5 py-1 rounded-full bg-purple-900/30 border border-purple-500/40 text-purple-300 text-[11px] font-mono flex items-center gap-1">
              <Moon className="w-3 h-3" /> Midnight Committer
            </span>
          )}
          {githubData.isWeekendWarrior && (
            <span className="px-2.5 py-1 rounded-full bg-red-900/30 border border-red-500/40 text-red-300 text-[11px] font-mono flex items-center gap-1">
              <Swords className="w-3 h-3" /> Weekend Warrior
            </span>
          )}
          {githubData.streakDays >= 7 && (
            <span className="px-2.5 py-1 rounded-full bg-amber-900/30 border border-amber-500/40 text-amber-300 text-[11px] font-mono flex items-center gap-1">
              <Flame className="w-3 h-3" /> 7+ Day Streak Club
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono">
            {githubData.publicRepos} Public Repos
          </span>
        </div>

      </div>

      {/* 3. Recent Commit Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <h3 className="font-pixel text-xs text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-cyan-400" />
          <span>Recent Activity Feed</span>
        </h3>
        
        <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
          {githubData.recentCommits.map((c) => (
            <div 
              key={c.id} 
              className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs font-mono hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="text-cyan-300 font-bold truncate">{c.repo}</span>
                <span className="text-slate-300 truncate">{c.message}</span>
              </div>
              <span className="text-[10px] text-slate-400 whitespace-nowrap pt-0.5">{c.date}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
