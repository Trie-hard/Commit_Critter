import React, { useState, useEffect } from 'react';
import { fetchGitHubUserData } from './services/githubService';
import { useCritterEngine } from './hooks/useCritterEngine';
import { TamagotchiShell } from './components/TamagotchiShell';
import { StatsDashboard } from './components/StatsDashboard';
import { SandboxControls } from './components/SandboxControls';
import { PassportGenerator } from './components/PassportGenerator';
import { AchievementsModal } from './components/AchievementsModal';
import { QuickProfiles } from './components/QuickProfiles';
import { soundFx } from './services/audioEngine';
import { storageGet } from './services/storageService';
import { ShellTheme, GitHubActivityData } from './types/critter';
import {
  Volume2, VolumeX, Trophy, Share2,
  Search, Loader2, Github, AlertCircle, ArrowRight, Maximize2
} from 'lucide-react';

export const App: React.FC = () => {
  const [usernameInput, setUsernameInput]         = useState('Trie-hard');
  const [isLoading, setIsLoading]                 = useState(false);
  const [errorMsg, setErrorMsg]                   = useState<string | null>(null);
  const [isMuted, setIsMuted]                     = useState(() => soundFx.getMuted());
  const [shellTheme, setShellTheme]               = useState<ShellTheme>('CYBER');
  const [showPassport, setShowPassport]           = useState(false);
  const [showAchievements, setShowAchievements]   = useState(false);

  const [activeProfile, setActiveProfile] = useState<GitHubActivityData>(() => ({
    username: 'Trie-hard',
    name: 'Trie Hard',
    avatarUrl: 'https://avatars.githubusercontent.com/u/148780287?v=4',
    bio: 'Building delightful software for humans & critters alike.',
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
      { id: 'th1', repo: 'Trie-hard/Commit_Critter', message: 'feat: editorial light design inspired by Steep & Refero', date: 'Just now' },
      { id: 'th2', repo: 'Trie-hard/Commit_Critter', message: 'design: serif headlines on warm paper, peach accent card', date: '1h ago' },
      { id: 'th3', repo: 'Trie-hard/Commit_Critter', message: 'feat: tactile designer shell and vital signs ledger', date: '3h ago' },
      { id: 'th4', repo: 'Trie-hard/Commit_Critter', message: 'feat: procedural web audio synthesizer engine', date: 'Yesterday' },
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
      setErrorMsg(err instanceof Error ? err.message : 'Could not fetch GitHub profile.');
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

  // Restore saved data on load
  useEffect(() => {
    storageGet<GitHubActivityData | null>('commit_critter_latest_data', null).then((saved) => {
      if (saved && saved.username) {
        setActiveProfile(saved);
        setUsernameInput(saved.username);
        updateUserData(saved);
      }
    });
  }, []);

  const isPopupMode =
    typeof window !== 'undefined' &&
    (window.location.pathname.includes('popup.html') ||
      window.location.search.includes('mode=popup') ||
      (window.innerWidth <= 420 && window.innerHeight <= 650));

  const openFullDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime?.getURL) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    } else {
      window.open('index.html', '_blank');
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Dedicated Compact Popup UI for Extension Toolbar
  if (isPopupMode) {
    return (
      <div className="w-full min-h-[560px] bg-white text-ink-black flex flex-col p-4 font-sans selection:bg-peach selection:text-sienna">
        {/* Compact Popup Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <div>
              <div className="font-serif text-base font-normal text-ink-black leading-none">
                Commit Critter
              </div>
              <div className="text-[11px] text-slate-gray font-mono mt-1">
                @{githubData.username} · Lv.{stats.level}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundFx.playClick();
                setShowAchievements(true);
              }}
              className="p-1.5 rounded-full border border-black/[0.08] hover:bg-mist-gray text-slate-gray hover:text-ink-black transition-all"
              title="Achievements"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
            </button>
            <button
              onClick={() => setIsMuted(soundFx.toggleMute())}
              className="p-1.5 rounded-full border border-black/[0.08] hover:bg-mist-gray text-slate-gray hover:text-ink-black transition-all"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={openFullDashboard}
              className="p-1.5 rounded-full border border-black/[0.08] hover:bg-mist-gray text-slate-gray hover:text-ink-black transition-all"
              title="Open Full Editorial Dashboard"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tactile Device Shell */}
        <div className="flex-1 flex flex-col items-center justify-center py-1">
          <TamagotchiShell
            stats={stats}
            theme={shellTheme}
            onPet={pet}
            onFeed={feedCommit}
            onCheer={() => {
              soundFx.playLevelUp();
              pet();
            }}
            onSelectTheme={(t) => {
              soundFx.playClick();
              setShellTheme(t);
            }}
          />
        </div>

        {/* Quick Footer Action to Open Dashboard */}
        <div className="pt-2 border-t border-black/[0.06] mt-2 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-gray text-[11px]">
            {githubData.streakDays}d streak · {githubData.totalRecentCommits} commits
          </span>
          <button
            onClick={openFullDashboard}
            className="text-link-arrow text-[12px] font-medium"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3 h-3 inline" />
          </button>
        </div>

        {/* Modals */}
        {showAchievements && (
          <AchievementsModal
            achievements={achievements}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafb] text-[#17191c] flex flex-col font-sans selection:bg-[#fbe1d1] selection:text-[#5d2a1a]">

      {/* ══════════════════════════════════════════════
          TOP NAVIGATION (Steep Style: Quiet, borderless)
      ══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/[0.05]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo & Category Tag */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐾</span>
            <div className="flex items-baseline gap-2.5">
              <span className="font-serif text-lg font-normal text-ink-black tracking-tight">
                Commit Critter
              </span>
              <span className="text-[12px] font-sans text-slate-gray font-normal hidden sm:inline">
                / FirstCommit 2026
              </span>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-2.5">
            {/* Badges trigger */}
            <button
              onClick={() => { soundFx.playClick(); setShowAchievements(true); }}
              className="pill-button-ghost text-[13px]"
              title="View unlocked badges"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Badges</span>
              {unlockedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-mist-gray text-[11px] font-mono font-semibold flex items-center justify-center">
                  {unlockedCount}
                </span>
              )}
            </button>

            {/* Passport Card trigger */}
            <button
              onClick={() => { soundFx.playClick(); setShowPassport(true); }}
              className="pill-button-primary text-[13px]"
              title="Export editorial passport card"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Passport Card</span>
            </button>

            {/* Audio Synth toggle */}
            <button
              onClick={() => setIsMuted(soundFx.toggleMute())}
              className="w-9 h-9 rounded-full border border-black/[0.1] bg-white hover:bg-mist-gray flex items-center justify-center text-slate-gray hover:text-ink-black transition-all"
              title={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* GitHub link */}
            <a
              href="https://github.com/Trie-hard/Commit_Critter"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-black/[0.1] bg-white hover:bg-mist-gray flex items-center justify-center text-slate-gray hover:text-ink-black transition-all"
              title="View source on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════════════
          HERO SECTION (Editorial Magazine Collage)
      ══════════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-6 pt-12 pb-8 w-full">
        <div className="max-w-3xl">

          {/* Editorial Display Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-ink-black tracking-tight leading-[1.18]">
            Your commits, <br className="hidden sm:inline" />
            <em className="font-serif italic font-normal text-ink-black">brought to life.</em>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-base sm:text-lg text-slate-gray mt-4 max-w-2xl leading-relaxed">
            Commit Critter turns your GitHub contributions into a living, responsive companion.
            Daily pushes feed its energy, maintain your streak, and trigger elemental evolutions.
          </p>

          {/* AI Composer-Style Input (Steep Specification) */}
          <div className="mt-8">
            <form onSubmit={handleSearch} className="relative max-w-xl">
              <div className="card-artifact p-2 pl-4 flex items-center gap-3 bg-white border border-black/[0.1] focus-within:border-ink-black transition-all">
                <Search className="w-4 h-4 text-slate-gray shrink-0" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter a GitHub username (e.g. Trie-hard, torvalds)..."
                  className="w-full bg-transparent outline-none text-sm text-ink-black placeholder:text-smoke-gray font-sans"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="pill-button-primary shrink-0 text-[13px] py-2 px-5 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <span>Hatch Critter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Profiles Pills */}
            <QuickProfiles
              currentUsername={githubData.username}
              onSelectProfile={handleSelectQuickProfile}
            />

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 mt-4 p-3 rounded-2xl bg-[#fee2e2] text-[#991b1b] text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          QUIET COMMIT TICKER RIBBON
      ══════════════════════════════════════════════ */}
      {githubData.recentCommits.length > 0 && (
        <div className="border-y border-black/[0.05] bg-white overflow-hidden relative h-9 my-4">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="ticker-track h-full flex items-center">
            {[...githubData.recentCommits, ...githubData.recentCommits].map((c, i) => (
              <div
                key={`${c.id}-${i}`}
                className="flex items-center gap-2 px-6 shrink-0 whitespace-nowrap text-xs font-sans text-slate-gray"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ink-black/40" />
                <span className="font-mono text-ink-black font-medium">{c.repo.split('/')[1] || c.repo}</span>
                <span className="text-black/30">·</span>
                <span className="text-slate-gray truncate max-w-sm">{c.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          MAIN 2-COLUMN ARTIFACT COLLAGE
      ══════════════════════════════════════════════ */}
      <main className="max-w-[1200px] mx-auto px-6 py-6 mb-36 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 items-start">

          {/* Left Column: Handheld Device Shell */}
          <div className="lg:sticky lg:top-24 flex flex-col items-center">
            <TamagotchiShell
              stats={stats}
              theme={shellTheme}
              onPet={pet}
              onFeed={feedCommit}
              onCheer={() => {
                soundFx.playLevelUp();
                pet();
              }}
              onSelectTheme={(t) => {
                soundFx.playClick();
                setShellTheme(t);
              }}
            />
          </div>

          {/* Right Column: Floating Data Artifacts */}
          <div className="flex justify-center lg:justify-start">
            <StatsDashboard stats={stats} githubData={githubData} />
          </div>

        </div>
      </main>

      {/* ══════════════════════════════════════════════
          EDITORIAL FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="border-t border-black/[0.06] bg-white py-8 px-6 text-center text-xs font-sans text-slate-gray mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-ink-black font-medium">
            <span>🐾 Commit Critter</span>
            <span className="text-slate-gray font-normal">· FirstCommit Hackathon 2026</span>
          </div>
          <div className="flex items-center gap-6 text-slate-gray">
            <a
              href="https://github.com/Trie-hard/Commit_Critter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink-black transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="https://styles.refero.design/style/75fdb89f-ca64-41b3-af36-7a78bd09448e"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink-black transition-colors"
            >
              Steep Design Reference
            </a>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════
          JUDGE SANDBOX CONTROLS
      ══════════════════════════════════════════════ */}
      <SandboxControls
        overrides={overrides}
        onSimulatePush={simulatePush}
        onSimulateDaysIdle={simulateDaysIdle}
        onForceStage={forceStage}
        onForceElement={forceElement}
        onReset={resetSandbox}
      />

      {/* ══════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════ */}
      {showPassport && (
        <PassportGenerator
          stats={stats}
          githubData={githubData}
          onClose={() => setShowPassport(false)}
        />
      )}

      {showAchievements && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

    </div>
  );
};

export default App;
