import React, { useState } from 'react';
import { CritterStats, GitHubActivityData } from '../types/critter';
import { requestNotificationPermission, sendCritterNotification } from '../services/notificationService';
import { soundFx } from '../services/audioEngine';
import {
  Flame, GitCommit, Code2, Clock,
  Bell, BellRing, Calendar,
  ArrowUpRight, Sparkles
} from 'lucide-react';

interface StatsDashboardProps {
  stats: CritterStats;
  githubData: GitHubActivityData;
}

// Minimal Stat Tile
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}> = ({ icon, label, value, sub }) => (
  <div className="card-artifact p-4 flex flex-col justify-between">
    <div className="flex items-center justify-between text-slate-gray mb-2">
      <span className="text-[12px] font-sans font-medium uppercase tracking-wider">{label}</span>
      <span className="text-ink-black/70">{icon}</span>
    </div>
    <div>
      <div className="font-sans font-semibold text-2xl text-ink-black tracking-tight">{value}</div>
      <p className="text-[12px] text-slate-gray mt-0.5">{sub}</p>
    </div>
  </div>
);

// Contribution Heatmap Cell
const HeatCell: React.FC<{ level: 0 | 1 | 2 | 3 }> = ({ level }) => {
  const bgColors = [
    '#e9e9ec', // level 0 (empty)
    '#b4ddbe', // level 1 (low)
    '#58ad72', // level 2 (medium)
    '#25723e', // level 3 (high streak)
  ];
  return (
    <div
      className="rounded-[3px] transition-transform hover:scale-125 cursor-default"
      style={{
        width: '10px',
        height: '10px',
        backgroundColor: bgColors[level],
      }}
    />
  );
};

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
        '🐾 Commit Critter alerts active',
        `Your ${stats.stage.toLowerCase()} critter will ping you if code pushes pause for 3 days.`
      );
    }
  };

  // Generate 16 weeks (112 days) grid
  const heatCells: Array<0 | 1 | 2 | 3> = Array.from({ length: 112 }, (_, i) => {
    const daysFromEnd = 111 - i;
    if (daysFromEnd < githubData.streakDays) return 3;
    if (daysFromEnd < Math.min(githubData.totalRecentCommits * 1.5, 60) && i % 3 !== 0) return 2;
    if (i % 5 === 0 || i % 7 === 0) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl animate-fade-in">

      {/* ── 1. Floating User & Pet Header Artifact ── */}
      <div className="card-artifact p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={githubData.avatarUrl}
              alt={githubData.username}
              className="w-14 h-14 rounded-2xl object-cover border border-black/[0.06] shadow-xs shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${githubData.username}`;
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-normal text-ink-black">
                  {githubData.name || githubData.username}
                </h2>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-mist-gray text-slate-gray font-medium">
                  @{githubData.username}
                </span>
              </div>
              <p className="text-[13px] text-slate-gray mt-0.5">
                Level {stats.level} {stats.stage.toLowerCase()} · {githubData.publicRepos} public repositories
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mist-gray text-ink-black text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {stats.element}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/[0.06]">
          <a
            href={`https://github.com/${githubData.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link-arrow text-[13px] text-slate-gray hover:text-ink-black"
          >
            <span>Inspect GitHub profile</span>
            <ArrowUpRight className="w-3.5 h-3.5 inline" />
          </a>

          <button
            onClick={handleToggleNotifications}
            className={`px-3 py-1.5 rounded-full text-[12px] font-sans font-medium transition-all inline-flex items-center gap-1.5 ${
              notifsEnabled
                ? 'bg-[#e7f5ea] text-[#1b6630] border border-[#1b6630]/20'
                : 'bg-mist-gray text-slate-gray hover:text-ink-black hover:bg-[#e8e8ea]'
            }`}
          >
            {notifsEnabled ? (
              <>
                <BellRing className="w-3.5 h-3.5" />
                <span>Alerts active</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>Enable notifications</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 2. Signature Blush Peach Editorial Card ── */}
      {/* (Steep Specification: Background #fbe1d1, text & stroke #5d2a1a, 24px radius, used for editorial emphasis) */}
      <div className="card-peach p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#5d2a1a]/70 font-semibold">
            Critter Dispatch · Notes from the field
          </span>
          <span className="text-[11px] font-mono text-[#5d2a1a]/70">
            {stats.mood.toLowerCase()} state
          </span>
        </div>

        <blockquote className="font-serif italic text-xl text-[#5d2a1a] leading-relaxed my-2">
          "{stats.personalityQuirk}"
        </blockquote>

        <div className="flex items-center justify-between text-[12px] font-sans text-[#5d2a1a]/80 mt-4 pt-3 border-t border-[#5d2a1a]/15">
          <span>Dietary affinity: {githubData.primaryLanguage} syntax</span>
          <span>Stage: {stats.stage}</span>
        </div>
      </div>

      {/* ── 3. Vital Signs (Energy & Happiness) ── */}
      <div className="card-artifact p-6">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-gray mb-4">
          Vitality Metrics
        </h3>

        <div className="flex flex-col gap-4">
          {/* Energy */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5 text-[13px]">
              <span className="font-medium text-ink-black flex items-center gap-1.5">
                <span>⚡ Energy</span>
                <span className="text-slate-gray font-normal text-xs">
                  (based on push recency)
                </span>
              </span>
              <span className="font-mono font-medium text-ink-black">{stats.energy}%</span>
            </div>
            <div className="stat-bar-track-light">
              <div
                className="stat-bar-fill-light bg-ink-black"
                style={{ width: `${stats.energy}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-gray mt-1">
              {stats.energy > 60
                ? 'High frequency signals — recent commit activity keeps your pet lively.'
                : 'Energy running low — commit and push new code to recharge.'}
            </p>
          </div>

          {/* Happiness */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5 text-[13px]">
              <span className="font-medium text-ink-black flex items-center gap-1.5">
                <span>💚 Happiness</span>
                <span className="text-slate-gray font-normal text-xs">
                  (based on commit streak)
                </span>
              </span>
              <span className="font-mono font-medium text-ink-black">{stats.happiness}%</span>
            </div>
            <div className="stat-bar-track-light">
              <div
                className="stat-bar-fill-light bg-[#25723e]"
                style={{ width: `${stats.happiness}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-gray mt-1">
              {stats.happiness > 60
                ? `Steady habit: maintaining a ${githubData.streakDays}-day streak.`
                : 'Streak disrupted: push a commit today to boost pet morale.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. Key Metrics Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Flame className="w-4 h-4 text-amber-600" />}
          label="Active Streak"
          value={`${githubData.streakDays} days`}
          sub={githubData.streakDays > 0 ? 'Consecutive daily commits' : 'Start your streak today'}
        />
        <StatCard
          icon={<GitCommit className="w-4 h-4 text-emerald-700" />}
          label="Recent Commits"
          value={`${githubData.totalRecentCommits}`}
          sub="Indexed in current cycle"
        />
        <StatCard
          icon={<Code2 className="w-4 h-4 text-sky-700" />}
          label="Primary Language"
          value={githubData.primaryLanguage}
          sub="Determines elemental type"
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-purple-700" />}
          label="Coding Rhythm"
          value={githubData.isNightOwl ? 'Night Owl' : 'Daytime'}
          sub={githubData.isNightOwl ? 'Peak hours after 9 PM' : 'Standard daylight coding'}
        />
      </div>

      {/* ── 5. Language DNA Analysis ── */}
      <div className="card-artifact p-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-gray">
            Language Composition
          </h3>
          <span className="text-xs text-slate-gray font-mono">
            {githubData.primaryLanguage} dominant
          </span>
        </div>

        {/* Stacked bar */}
        <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5 bg-mist-gray p-0.5 mb-3">
          {githubData.languages.map((lang) => (
            <div
              key={lang.name}
              style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
              className="h-full rounded-full"
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {githubData.languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5 text-xs font-sans text-ink-black">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span className="font-medium">{lang.name}</span>
              <span className="text-slate-gray font-mono text-[11px]">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Contribution Grid (16-Week Heatmap) ── */}
      <div className="card-artifact p-6">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-gray flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            16-Week Activity Map
          </h3>
          <span className="text-xs font-mono font-medium text-ink-black">
            {githubData.totalRecentCommits} logged commits
          </span>
        </div>

        <div
          className="overflow-x-auto pb-1"
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, 10px)',
            gridAutoFlow: 'column',
            gap: '3px',
            width: 'max-content',
          }}
        >
          {heatCells.map((level, i) => (
            <HeatCell key={i} level={level} />
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-gray mt-3 pt-2 border-t border-black/[0.04]">
          <span>Less active</span>
          <div className="flex items-center gap-1">
            {['#e9e9ec', '#b4ddbe', '#58ad72', '#25723e'].map((bg, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: bg }} />
            ))}
          </div>
          <span>More active</span>
        </div>
      </div>

      {/* ── 7. Recent Commits Log (Ledger Style) ── */}
      <div className="card-artifact p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-gray flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5" />
            Recent Activity Log
          </h3>
          <span className="text-xs text-slate-gray">Latest changes</span>
        </div>

        <div className="flex flex-col divide-y divide-black/[0.05]">
          {githubData.recentCommits.map((c) => (
            <div key={c.id} className="py-2.5 flex items-start justify-between gap-4 text-xs font-sans group">
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[11px] text-slate-gray font-medium truncate">
                  {c.repo}
                </div>
                <div className="text-ink-black font-normal truncate mt-0.5 group-hover:text-black">
                  {c.message}
                </div>
              </div>
              <span className="text-[11px] text-slate-gray font-mono shrink-0 pt-0.5">
                {c.date}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
