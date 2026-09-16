import React, { useState } from 'react';
import { fetchGitHubUserData } from './services/githubService';
import { useCritterEngine } from './hooks/useCritterEngine';
import { TamagotchiShell } from './components/TamagotchiShell';
import { StatsDashboard } from './components/StatsDashboard';
import { SandboxControls } from './components/SandboxControls';
import { PassportGenerator } from './components/PassportGenerator';
import { AchievementsModal } from './components/AchievementsModal';
import { QuickProfiles } from './components/QuickProfiles';
import { soundFx } from './services/audioEngine';
import { ShellTheme, GitHubActivityData } from './types/critter';
import {
  Volume2, VolumeX, Trophy, Share2,
  Search, Loader2, Github, AlertCircle,
} from 'lucide-react';

export const App: React.FC = () => {
  const [usernameInput, setUsernameInput]     = useState('Trie-hard');
  const [isLoading, setIsLoading]             = useState(false);
  const [errorMsg, setErrorMsg]               = useState<string | null>(null);
  const [isMuted, setIsMuted]                 = useState(() => soundFx.getMuted());
  const [shellTheme, setShellTheme]           = useState<ShellTheme>('CYBER');
  const [showPassport, setShowPassport]       = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const [activeProfile, setActiveProfile] = useState<GitHubActivityData>(() => ({
    username: 'Trie-hard',
    name: 'Trie Hard',
    avatarUrl: 'https://avatars.githubusercontent.com/u/148780287?v=4',
    bio: 'Building awesome hackathon projects!',
    publicRepos: 12,
    totalRecentCommits: 32,
    streakDays: 6,
    lastCommitDate: new Date().toISOString(),
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', percentage: 65, color: '#3178c6' },
      { name: 'JavaScript', percentage: 25, color: '#f7df1e' },
      { name: 'Python',     percentage: 10, color: '#3572A5' },
    ],
    recentCommits: [
      { id: 'th1', repo: 'Trie-hard/Commit_Critter', message: 'feat: warm indie redesign — no more neon robots', date: 'Just now' },
      { id: 'th2', repo: 'Trie-hard/Commit_Critter', message: 'feat: ECG vitals & element-reactive ambient glow', date: '2h ago' },
      { id: 'th3', repo: 'Trie-hard/Commit_Critter', message: 'feat: glass specimen case + orbital arcs', date: '4h ago' },
      { id: 'th4', repo: 'Trie-hard/Commit_Critter', message: 'feat: procedural 8-bit audio engine', date: 'Yesterday' },
      { id: 'th5', repo: 'Trie-hard/Commit_Critter', message: 'Initial commit: welcome to Commit Critter!', date: '2d ago' },
    ],
    isNightOwl: true,
    isWeekendWarrior: true,
  }));

  const {
    githubData, stats, overrides, achievements,
    pet, feedCommit, simulatePush, simulateDaysIdle,
    forceStage, forceElement, resetSandbox, updateUserData,
  } = useCritterEngine(activeProfile);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    soundFx.playClick();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchGitHubUserData(usernameInput.trim());
      setActiveProfile(data);
      updateUserData(data);
      soundFx.playChirp();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not fetch GitHub data.');
      soundFx.playError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickProfile = (data: GitHubActivityData) => {
    setUsernameInput(data.username);
    setActiveProfile(data);
    updateUserData(data);
    setErrorMsg(null);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-[100dvh] bg-ink-950 text-ink-100 flex flex-col">

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <header className="sticky top-0 z-40 bg-ink-950/90 backdrop-blur-md border-b border-ink-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <span className="text-xl">🐾</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-ink-50 tracking-tight">
                  Commit Critter
                </span>
                <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-md bg-ember-dim border border-ember-muted text-ember-light">
                  FirstCommit 2026
                </span>
              </div>
              <p className="text-[11px] text-ink-400 font-mono hidden sm:block">
                the virtual pet that lives off your GitHub commits
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { soundFx.playClick(); setShowAchievements(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-semibold bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-ink-500 text-ink-200 hover:text-ink-50 transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Badges</span>
              {unlockedCount > 0 && (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unlockedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { soundFx.playClick(); setShowPassport(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-semibold bg-ember-DEFAULT text-white hover:bg-ember-light transition-all"
              style={{ boxShadow: '0 2px 8px rgba(232,115,58,0.3)' }}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Card</span>
            </button>

            <button
              onClick={() => setIsMuted(soundFx.toggleMute())}
              className="p-2 rounded-xl bg-ink-800 hover:bg-ink-700 border border-ink-600 text-ink-300 hover:text-ink-100 transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <a
              href="https://github.com/Trie-hard/Commit_Critter"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-ink-800 hover:bg-ink-700 border border-ink-600 text-ink-300 hover:text-ink-100 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* ══════════════════ HERO / SEARCH ══════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full mt-8 animate-slide-up">
        <div className="card p-6">
          <div className="mb-5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-50 leading-snug">
              Enter your GitHub username.
              <br />
              <span className="text-ember-DEFAULT">Your critter awaits.</span>
            </h1>
            <p className="text-sm text-ink-300 mt-2 max-w-md">
              Your commit history becomes your pet's diet — the more you push,
              the stronger it grows. Neglect it and it sulks. No pressure.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. torvalds, gaearon, your-username..."
                className="w-full bg-ink-900 border border-ink-600 focus:border-ember-DEFAULT focus:ring-1 focus:ring-ember-DEFAULT rounded-2xl pl-10 pr-4 py-2.5 text-sm font-mono text-ink-50 placeholder-ink-400 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-ember-DEFAULT hover:bg-ember-light text-white font-display font-semibold text-sm transition-all disabled:opacity-50"
              style={{ boxShadow: '0 2px 12px rgba(232,115,58,0.25)' }}
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Fetching...</>
                : 'Hatch my critter'}
            </button>
          </form>

          <div className="mt-4">
            <QuickProfiles
              currentUsername={githubData.username}
              onSelectProfile={handleSelectQuickProfile}
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-sm font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════ COMMIT TICKER ══════════════════ */}
      {githubData.recentCommits.length > 0 && (
        <div className="mt-6 border-y border-ink-700 overflow-hidden relative" style={{ height: '34px' }}>
          <div
            className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #0a0806, transparent)' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #0a0806, transparent)' }}
          />
          <div className="ticker-track h-full flex items-center">
            {[...githubData.recentCommits, ...githubData.recentCommits].map((c, i) => (
              <div
                key={`${c.id}-${i}`}
                className="flex items-center gap-3 px-6 shrink-0 whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ember-DEFAULT opacity-70 shrink-0" />
                <span className="text-[11px] font-mono text-ink-400">
                  <span className="text-ink-300">{c.repo.split('/')[1]}</span>
                  {' — '}
                  {c.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 mb-44 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">

          {/* Left: Device — sticky on desktop */}
          <div className="lg:sticky lg:top-20 flex flex-col items-center gap-4">
            <TamagotchiShell
              stats={stats}
              theme={shellTheme}
              onPet={pet}
              onFeed={feedCommit}
              onCheer={() => { soundFx.playLevelUp(); pet(); }}
              onSelectTheme={(t) => { soundFx.playClick(); setShellTheme(t); }}
            />
          </div>

          {/* Right: Stats */}
          <div>
            <StatsDashboard stats={stats} githubData={githubData} />
          </div>
        </div>
      </main>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t border-ink-800 py-4 text-center text-[11px] font-mono text-ink-500">
        Built with React · Canvas API · Web Audio API &nbsp;·&nbsp;
        <a
          href="https://github.com/Trie-hard/Commit_Critter"
          className="hover:text-ink-300 transition-colors"
          target="_blank" rel="noopener noreferrer"
        >
          Trie-hard/Commit_Critter
        </a>
      </footer>

      {/* ══════════════════ OVERLAYS ══════════════════ */}
      <SandboxControls
        overrides={overrides}
        onSimulatePush={simulatePush}
        onSimulateDaysIdle={simulateDaysIdle}
        onForceStage={forceStage}
        onForceElement={forceElement}
        onReset={resetSandbox}
      />
      {showPassport && (
        <PassportGenerator stats={stats} githubData={githubData} onClose={() => setShowPassport(false)} />
      )}
      {showAchievements && (
        <AchievementsModal achievements={achievements} onClose={() => setShowAchievements(false)} />
      )}
    </div>
  );
};

export default App;
