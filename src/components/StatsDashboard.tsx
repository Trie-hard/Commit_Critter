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

// ECG path builder — generates a realistic-looking oscilloscope waveform SVG path
function buildEcgPath(value: number, width = 280, height = 44): string {
  const mid = height / 2;
  const amplitude = (value / 100) * (height / 2 - 4);
  // Baseline flat → spike up → spike down → flat with trailing ripples
  const pts: [number, number][] = [
    [0, mid],
    [width * 0.12, mid],
    [width * 0.22, mid],
    [width * 0.28, mid - amplitude * 0.3],
    [width * 0.33, mid + amplitude * 0.5],
    [width * 0.38, mid - amplitude],
    [width * 0.44, mid + amplitude * 0.25],
    [width * 0.50, mid - amplitude * 0.12],
    [width * 0.56, mid],
    [width * 0.64, mid - amplitude * 0.06],
    [width * 0.72, mid + amplitude * 0.04],
    [width * 0.80, mid],
    [width, mid],
  ];
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

// Mini hexagonal tile stat widget
const StatHex: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}> = ({ icon, label, value, accent }) => (
  <div
    className="glass-panel rounded-2xl p-3 flex flex-col items-center gap-1 text-center hover:scale-105 transition-transform duration-200 cursor-default"
    style={{ minWidth: '72px' }}
  >
    <div style={{ color: accent }}>{icon}</div>
    <div className="text-base font-mono font-bold text-white leading-none">{value}</div>
    <div className="font-pixel text-[8px] text-slate-400 uppercase">{label}</div>
  </div>
);

// ECG Vital bar component
const EcgVital: React.FC<{
  label: string;
  value: number;
  subtext: string;
  strokeColor: string;
  bgGlow: string;
}> = ({ label, value, subtext, strokeColor, bgGlow }) => {
  const path = buildEcgPath(value);

  return (
    <div className="glass-panel rounded-2xl p-4 relative overflow-hidden">
      {/* Glow behind the graph */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: bgGlow }}
      />

      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-mono font-semibold" style={{ color: strokeColor }}>
          {label}
        </span>
        <span className="font-pixel text-[10px] text-white/80">{value}%</span>
      </div>

      {/* ECG Graph */}
      <svg
        width="100%" height="44" viewBox="0 0 280 44"
        preserveAspectRatio="none"
        className="block"
      >
        {/* Background grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0" y1={44 * f} x2="280" y2={44 * f}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}
        {/* Trailing fill area */}
        <path
          d={`${path} L 280 44 L 0 44 Z`}
          fill={`url(#ecgFill-${label})`}
          opacity="0.15"
        />
        <defs>
          <linearGradient id={`ecgFill-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* ECG line with animation */}
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-line"
          style={{ strokeDasharray: 600, animationDuration: `${2.4 + (100 - value) * 0.01}s` }}
        />
        {/* Blinking cursor dot at the right edge */}
        <circle cx="280" cy="22" r="3" fill={strokeColor} opacity="0.85">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </svg>

      <p className="text-[10px] text-slate-400 font-mono mt-1.5">{subtext}</p>
    </div>
  );
};

// LED heatmap cell
const HeatCell: React.FC<{ active: boolean; streak: boolean }> = ({ active, streak }) => (
  <div
    className="rounded-sm transition-all"
    style={{
      width: '10px', height: '10px',
      background: streak
        ? '#22c55e'
        : active
        ? '#16a34a'
        : 'rgba(255,255,255,0.05)',
      boxShadow: streak ? '0 0 5px rgba(34,197,94,0.6)' : undefined,
    }}
    title={streak ? 'Active streak day' : active ? 'Activity' : 'No activity'}
  />
);

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, githubData }) => {
  const [notifsEnabled, setNotifsEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  const handleToggleNotifications = async () => {
    soundFx.playClick();
    const granted = await requestNotificationPermission();
    setNotifsEnabled(granted);
    if (granted) {
      soundFx.playChirp();
      sendCritterNotification(
        '🐾 Commit Critter alerts active!',
        `Your ${stats.stage} critter will ping you if you stop committing for 3 days.`
      );
    }
  };

  // Build 16 weeks × 7 days heatmap (112 cells)
  const heatCells = Array.from({ length: 112 }, (_, i) => {
    const daysFromEnd = 111 - i;
    const isStreak = daysFromEnd < githubData.streakDays;
    const isActive = !isStreak && daysFromEnd < Math.min(githubData.totalRecentCommits * 2, 60) && (i % 3 !== 0);
    return { id: i, isStreak, isActive };
  });

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg animate-fade-up">

      {/* ── Pet Identity Card ── */}
      <div className="glass-panel-bright rounded-3xl p-5 riveted">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-pixel text-[9px] text-slate-400 uppercase tracking-wider mb-1">
              Registered Critter
            </p>
            <h2 className="font-display text-xl font-bold text-white leading-tight">
              {githubData.name || githubData.username}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{stats.personalityQuirk}</p>
          </div>

          {/* Avatar + level pill */}
          <div className="relative shrink-0">
            <img
              src={githubData.avatarUrl}
              alt={githubData.username}
              className="w-14 h-14 rounded-2xl object-cover"
              style={{ border: '2px solid rgba(255,255,255,0.1)' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${githubData.username}`;
              }}
            />
            <span
              className="absolute -bottom-1.5 -right-1.5 font-pixel text-[8px] px-1.5 py-0.5 rounded-lg text-white"
              style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              LVL {stats.level}
            </span>
          </div>
        </div>

        {/* GitHub link + notification toggle */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
          <a
            href={`https://github.com/${githubData.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3 h-3 text-cyan-400" />
            @{githubData.username}
          </a>
          <button
            onClick={handleToggleNotifications}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
              notifsEnabled
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            {notifsEnabled
              ? <BellRing className="w-3 h-3 animate-bounce" />
              : <Bell className="w-3 h-3" />
            }
            {notifsEnabled ? 'Alerts On' : 'Enable Alerts'}
          </button>
        </div>
      </div>

      {/* ── ECG Vitals ── */}
      <div className="grid grid-cols-1 gap-4">
        <EcgVital
          label="⚡ Energy"
          value={stats.energy}
          subtext={stats.energy > 60 ? 'Active & buzzing — recent commits detected' : 'Signal weak — push fresh code to restore power'}
          strokeColor="#eab308"
          bgGlow="linear-gradient(135deg, rgba(234,179,8,0.3), transparent)"
        />
        <EcgVital
          label="🖤 Happiness"
          value={stats.happiness}
          subtext={stats.happiness > 60 ? 'Content and purring — streak is strong' : 'Needs attention or a fresh commit snack'}
          strokeColor="#ec4899"
          bgGlow="linear-gradient(135deg, rgba(236,72,153,0.3), transparent)"
        />
      </div>

      {/* ── Stat Hex Tiles ── */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-1">
        <StatHex icon={<Flame className="w-5 h-5" />}     label="Streak"   value={`${githubData.streakDays}d`}  accent="#f97316" />
        <StatHex icon={<GitCommit className="w-5 h-5" />}  label="Commits"  value={`${githubData.totalRecentCommits}`} accent="#22c55e" />
        <StatHex icon={<Code2 className="w-5 h-5" />}      label="Top Lang" value={githubData.primaryLanguage.slice(0, 4)} accent="#38bdf8" />
        <StatHex icon={<Clock className="w-5 h-5" />}      label="Rhythm"   value={githubData.isNightOwl ? 'Nite' : 'Day'} accent="#a78bfa" />
      </div>

      {/* ── Language DNA Bar ── */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-pixel text-[9px] text-slate-300 uppercase tracking-wider">
            Elemental DNA
          </p>
          <span className="text-[11px] font-mono text-slate-400">{githubData.primaryLanguage} dominant</span>
        </div>
        {/* Stacked bar */}
        <div className="h-2 w-full rounded-full overflow-hidden flex gap-px mb-3">
          {githubData.languages.map((lang) => (
            <div
              key={lang.name}
              style={{ width: `${lang.percentage}%`, background: lang.color }}
              title={`${lang.name} ${lang.percentage}%`}
              className="h-full transition-all"
            />
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {githubData.languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: lang.color }} />
              {lang.name}
              <span className="text-slate-500">({lang.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contribution Heatmap ── */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <p className="font-pixel text-[9px] text-slate-300 uppercase tracking-wider">
              Contribution Map
            </p>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 font-semibold">
            {githubData.streakDays}d streak
          </span>
        </div>
        <div
          className="grid gap-1 overflow-x-auto"
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 10px)',
            gridAutoFlow: 'column',
            width: 'max-content',
          }}
        >
          {heatCells.map((c) => (
            <HeatCell key={c.id} active={c.isActive} streak={c.isStreak} />
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2.5">
          <span>Less</span>
          <div className="flex gap-1">
            {['rgba(255,255,255,0.05)', '#14532d', '#16a34a', '#22c55e'].map((bg, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: bg }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* ── Trait Badges ── */}
      <div className="flex flex-wrap gap-2">
        {githubData.isNightOwl && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-[11px] font-mono text-violet-300">
            <Moon className="w-3 h-3" /> Midnight Coder
          </span>
        )}
        {githubData.isWeekendWarrior && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-[11px] font-mono text-red-300">
            <Swords className="w-3 h-3" /> Weekend Warrior
          </span>
        )}
        {githubData.streakDays >= 7 && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-[11px] font-mono text-amber-300">
            <Flame className="w-3 h-3" /> 7+ Day Streak
          </span>
        )}
        {githubData.isRateLimited && (
          <span className="px-3 py-1 rounded-full glass-panel text-[11px] font-mono text-slate-400">
            Cached data (API limit)
          </span>
        )}
      </div>

      {/* ── Recent Commits Log ── */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
          <p className="font-pixel text-[9px] text-slate-300 uppercase tracking-wider">
            Activity Log
          </p>
        </div>
        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
          {githubData.recentCommits.map((c) => (
            <div
              key={c.id}
              className="glass-panel rounded-xl px-3 py-2.5 flex items-start justify-between gap-3 text-xs font-mono hover:border-white/[0.1] transition-colors group"
            >
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="text-cyan-300 font-semibold truncate group-hover:text-cyan-200 transition-colors">
                  {c.repo}
                </span>
                <span className="text-slate-300 truncate">{c.message}</span>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 pt-0.5">{c.date}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
