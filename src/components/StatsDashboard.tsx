import React, { useState } from 'react';
import { CritterStats, GitHubActivityData } from '../types/critter';
import { requestNotificationPermission, sendCritterNotification } from '../services/notificationService';
import { soundFx } from '../services/audioEngine';
import {
  Flame, GitCommit, Code2, Clock,
  ExternalLink, Moon, Swords, Bell, BellRing, Calendar,
} from 'lucide-react';

interface StatsDashboardProps {
  stats: CritterStats;
  githubData: GitHubActivityData;
}

// Simple labelled stat bar
const StatBar: React.FC<{
  label: string;
  value: number;
  subtext: string;
  color: string;
}> = ({ label, value, subtext, color }) => (
  <div>
    <div className="flex items-baseline justify-between mb-2">
      <span className="text-sm font-display font-semibold text-ink-100">{label}</span>
      <span className="text-xs font-mono text-ink-400">{value}%</span>
    </div>
    <div className="stat-bar-track mb-1.5">
      <div className="stat-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
    <p className="text-xs text-ink-400">{subtext}</p>
  </div>
);

// Contribution heatmap cell
const HeatCell: React.FC<{ level: 0 | 1 | 2 | 3 }> = ({ level }) => {
  const bg = ['#2d271f', '#234d30', '#2d7a44', '#3dab5a'][level];
  return (
    <div
      className="rounded-sm"
      style={{ width: '10px', height: '10px', background: bg }}
    />
  );
};

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, githubData }) => {
  const [notifsEnabled, setNotifsEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window
      && Notification.permission === 'granted'
  );

  const handleToggleNotifications = async () => {
    soundFx.playClick();
    const granted = await requestNotificationPermission();
    setNotifsEnabled(granted);
    if (granted) {
      soundFx.playChirp();
      sendCritterNotification(
        '🐾 Commit Critter is watching',
        `Your ${stats.stage.toLowerCase()} will let you know if you go dark for 3 days.`
      );
    }
  };

  // Build 16w × 7d heatmap
  const heatCells: Array<0 | 1 | 2 | 3> = Array.from({ length: 112 }, (_, i) => {
    const daysFromEnd = 111 - i;
    if (daysFromEnd < githubData.streakDays) return 3;
    if (daysFromEnd < Math.min(githubData.totalRecentCommits * 1.5, 55) && i % 3 !== 0) return 2;
    if (i % 7 === 0 || i % 11 === 0) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg animate-slide-up">

      {/* ── Identity card ── */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          <img
            src={githubData.avatarUrl}
            alt={githubData.username}
            className="w-14 h-14 rounded-2xl object-cover border border-ink-600 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://api.dicebear.com/7.x/bottts/svg?seed=${githubData.username}`;
            }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-ink-50 truncate">
              {githubData.name || githubData.username}
            </h2>
            <p className="text-xs text-ink-400 font-mono mt-0.5 truncate">
              @{githubData.username}
            </p>
            <p className="text-sm text-ink-300 mt-1">{stats.personalityQuirk}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-display font-bold text-ink-50">Lv.{stats.level}</div>
            <div className="text-xs text-ink-400 font-mono">{stats.stage}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-700">
          <a
            href={`https://github.com/${githubData.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-ink-400 hover:text-ember-DEFAULT transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View on GitHub
          </a>
          <button
            onClick={handleToggleNotifications}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-display font-medium border transition-all ${
              notifsEnabled
                ? 'bg-sage-dim border-sage-muted text-sage-light'
                : 'bg-ink-800 border-ink-600 text-ink-300 hover:text-ink-100'
            }`}
          >
            {notifsEnabled
              ? <BellRing className="w-3 h-3" />
              : <Bell className="w-3 h-3" />
            }
            {notifsEnabled ? 'Alerts on' : 'Get alerts'}
          </button>
        </div>
      </div>

      {/* ── Vitals ── */}
      <div className="card p-5 flex flex-col gap-5">
        <h3 className="font-display font-semibold text-sm text-ink-200 uppercase tracking-wide">
          Vital Signs
        </h3>
        <StatBar
          label="⚡ Energy"
          value={stats.energy}
          subtext={stats.energy > 60
            ? 'Recently active — your critter is bouncing off the walls.'
            : 'Getting sluggish — push something to charge it back up.'}
          color="#e8733a"
        />
        <StatBar
          label="🌿 Happiness"
          value={stats.happiness}
          subtext={stats.happiness > 60
            ? `${githubData.streakDays}-day streak — it's in a great mood.`
            : 'Streak fading. A fresh commit would really cheer it up.'}
          color="#5a9e72"
        />
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Flame,     label: 'Streak',    value: `${githubData.streakDays}d`, color: '#e8733a' },
          { icon: GitCommit, label: 'Commits',   value: `${githubData.totalRecentCommits}`,  color: '#5a9e72' },
          { icon: Code2,     label: 'Main lang', value: githubData.primaryLanguage,          color: '#4a90b8' },
          { icon: Clock,     label: 'Style',     value: githubData.isNightOwl ? 'Night owl' : 'Early bird', color: '#8b7cf6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-3.5 flex flex-col gap-1.5">
            <Icon className="w-4 h-4" style={{ color }} />
            <div className="font-display font-bold text-ink-50 text-base leading-tight">{value}</div>
            <div className="text-[11px] text-ink-400 font-mono">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Language DNA ── */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-sm text-ink-200 uppercase tracking-wide mb-3">
          Language DNA
        </h3>
        <div className="h-2 w-full rounded-full overflow-hidden flex">
          {githubData.languages.map((lang) => (
            <div
              key={lang.name}
              style={{ width: `${lang.percentage}%`, background: lang.color }}
              title={`${lang.name} ${lang.percentage}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {githubData.languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5 text-xs font-mono text-ink-300">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: lang.color }} />
              {lang.name}
              <span className="text-ink-500">({lang.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Heatmap ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-sm text-ink-200 uppercase tracking-wide flex items-center gap-2">
            <Calendar className="w-4 h-4 text-ink-400" />
            Last 16 Weeks
          </h3>
          <span className="text-xs font-mono text-sage-DEFAULT font-semibold">
            {githubData.streakDays}d streak
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 10px)',
            gridAutoFlow: 'column',
            gap: '3px',
            overflowX: 'auto',
          }}
        >
          {heatCells.map((level, i) => (
            <HeatCell key={i} level={level} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2.5 text-[10px] font-mono text-ink-500">
          <span>Less</span>
          {['#2d271f', '#234d30', '#2d7a44', '#3dab5a'].map((bg, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: bg }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* ── Trait badges ── */}
      <div className="flex flex-wrap gap-2">
        {githubData.isNightOwl && (
          <span className="card flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-ink-200">
            <Moon className="w-3 h-3 text-violet-400" /> Midnight coder
          </span>
        )}
        {githubData.isWeekendWarrior && (
          <span className="card flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-ink-200">
            <Swords className="w-3 h-3 text-ember-DEFAULT" /> Weekend warrior
          </span>
        )}
        {githubData.streakDays >= 7 && (
          <span className="card flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-ink-200">
            <Flame className="w-3 h-3 text-ember-DEFAULT" /> 7-day streak
          </span>
        )}
        {githubData.isRateLimited && (
          <span className="card px-3 py-1.5 text-xs font-mono text-ink-500">
            Cached data (rate limited)
          </span>
        )}
      </div>

      {/* ── Activity log ── */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-sm text-ink-200 uppercase tracking-wide flex items-center gap-2 mb-3">
          <GitCommit className="w-4 h-4 text-ink-400" />
          Recent activity
        </h3>
        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
          {githubData.recentCommits.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl bg-ink-900 border border-ink-700 hover:border-ink-500 transition-colors group text-xs font-mono"
            >
              <div className="overflow-hidden">
                <div className="text-ember-DEFAULT font-semibold truncate group-hover:text-ember-light transition-colors">
                  {c.repo}
                </div>
                <div className="text-ink-300 truncate mt-0.5">{c.message}</div>
              </div>
              <span className="text-ink-500 shrink-0 pt-0.5 text-[10px]">{c.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
