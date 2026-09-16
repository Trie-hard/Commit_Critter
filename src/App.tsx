import React, { useState } from 'react';
import { fetchGitHubUserData } from './services/githubService';
import { useCritterEngine } from './hooks/useCritterEngine';
import { TamagotchiShell } from './components/TamagotchiShell';
import { StatsDashboard } from './components/StatsDashboard';
import { SandboxControls } from './components/SandboxControls';
import { PassportGenerator } from './components/PassportGenerator';
import { AchievementsModal } from './components/AchievementsModal';
import { QuickProfiles } from './components/QuickProfiles';
import { StarField } from './components/StarField';
import { CommitTicker } from './components/CommitTicker';
import { ElementReactiveGlow } from './components/ElementReactiveGlow';
import { soundFx } from './services/audioEngine';
import { ShellTheme, GitHubActivityData } from './types/critter';
import {
  Volume2, VolumeX, Trophy, Share2,
  Search, Loader2, Github, Award, AlertCircle,
} from 'lucide-react';

export const App: React.FC = () => {
  const [usernameInput, setUsernameInput]   = useState('Trie-hard');
  const [isLoading, setIsLoading]           = useState(false);
  const [errorMsg, setErrorMsg]             = useState<string | null>(null);
  const [isMuted, setIsMuted]               = useState(() => soundFx.getMuted());
  const [shellTheme, setShellTheme]         = useState<ShellTheme>('CYBER');
  const [showPassport, setShowPassport]     = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const [activeProfile, setActiveProfile] = useState<GitHubActivityData>(() => ({
    username: 'Trie-hard',
    name: 'Trie Hard',
    avatarUrl: 'https://avatars.githubusercontent.com/u/148780287?v=4',
    bio: 'Building awesome hackathon projects! 🐾',
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
      { id: 'th1', repo: 'Trie-hard/Commit_Critter', message: 'feat: cosmic glass specimen case UI redesign', date: 'Just now' },
      { id: 'th2', repo: 'Trie-hard/Commit_Critter', message: 'feat: ECG vital oscilloscopes & heatmap', date: '1h ago' },
      { id: 'th3', repo: 'Trie-hard/Commit_Critter', message: 'feat: element-reactive ambient glow engine', date: '2h ago' },
      { id: 'th4', repo: 'Trie-hard/Commit_Critter', message: 'feat: star field & orbital arc decorations', date: '4h ago' },
      { id: 'th5', repo: 'Trie-hard/Commit_Critter', message: 'Initial commit: welcome to Commit Critter!', date: 'Yesterday' },
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
      const msg = err instanceof Error ? err.message : 'Could not fetch GitHub data.';
      setErrorMsg(msg);
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

  const toggleSound = () => setIsMuted(soundFx.toggleMute());

  return (
    <div className="relative min-h-[100dvh] bg-cosmic-void text-slate-100 flex flex-col overflow-x-hidden">

      {/* ── Layer 0: Cosmic atmosphere ── */}
      <StarField />
      <ElementReactiveGlow element={stats.element} />

      {/* ── Layer 1: Content ── */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">

        {/* ═══════════════════════════════════════════
            NAVBAR
        ═══════════════════════════════════════════ */}
        <header className="sticky top-0 z-40 border-b border-white/[0.06]"
          style={{ background: 'rgba(3,4,10,0.75)', backdropFilter: 'blur(24px)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-8 h-8">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #00f0ff22, #a855f722)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 0 16px rgba(0,240,255,0.2)',
                  }}
                >
                  🐾
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[11px] text-white tracking-wide">
                    COMMIT CRITTER
                  </span>
                  <span
                    className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
                    style={{
                      background: 'rgba(236,72,153,0.1)',
                      border: '1px solid rgba(236,72,153,0.25)',
                      color: '#f9a8d4',
                    }}
                  >
                    <Award className="w-2.5 h-2.5" />
                    FirstCommit 2026
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  The virtual pet that thrives on your commits
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { soundFx.playClick(); setShowAchievements(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition-all glass-panel hover:bg-white/[0.08] text-amber-300"
                title="Badges"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Badges</span>
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.3)' }}
                >
                  {achievements.filter((a) => a.unlocked).length}
                </span>
              </button>

              <button
                onClick={() => { soundFx.playClick(); setShowPassport(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition-all text-white hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #0891b2, #6366f1)',
                  boxShadow: '0 4px 16px rgba(6,182,212,0.25)',
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Passport</span>
              </button>

              <button
                onClick={toggleSound}
                className="glass-panel p-2 rounded-xl transition-all hover:bg-white/[0.08]"
                style={{ color: isMuted ? '#475569' : '#22d3ee' }}
                title={isMuted ? 'Unmute' : 'Mute 8-bit audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <a
                href="https://github.com/Trie-hard/Commit_Critter"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel p-2 rounded-xl text-slate-300 hover:text-white transition-all hover:bg-white/[0.08]"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════
            COMMIT TICKER TAPE
        ═══════════════════════════════════════════ */}
        <CommitTicker commits={githubData.recentCommits} element={stats.element} />

        {/* ═══════════════════════════════════════════
            HERO SEARCH BAR
        ═══════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-8">
          <div
            className="glass-panel-bright rounded-3xl p-5 flex flex-col gap-4"
          >
            {/* Headline */}
            <div className="text-center">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                Enter a GitHub username to
                <span className="text-gradient-cyan"> hatch your critter</span>
              </h1>
              <p className="text-sm text-slate-400 font-mono mt-1">
                Your commit history becomes your pet's biology — energy, evolution & element.
              </p>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto w-full">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. torvalds, gaearon, Trie-hard..."
                  className="w-full rounded-2xl pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all"
                  style={{
                    background: 'rgba(7,11,22,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(0,240,255,0.4)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-2xl font-mono font-bold text-sm text-white flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #0e7490, #4f46e5)',
                  boxShadow: '0 4px 20px rgba(14,116,144,0.35)',
                }}
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Summoning...</>
                  : 'Hatch Critter 🚀'
                }
              </button>
            </form>

            {/* Quick profile shortcuts */}
            <QuickProfiles
              currentUsername={githubData.username}
              onSelectProfile={handleSelectQuickProfile}
            />

            {/* Error */}
            {errorMsg && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl text-sm font-mono text-red-300"
                style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            MAIN CONTENT — Swiss asymmetric split grid
        ═══════════════════════════════════════════ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 mb-48 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

            {/* Left: Specimen Case — pinned on desktop */}
            <div className="lg:sticky lg:top-20 flex flex-col items-center">
              <TamagotchiShell
                stats={stats}
                theme={shellTheme}
                onPet={pet}
                onFeed={feedCommit}
                onCheer={() => { soundFx.playLevelUp(); pet(); }}
                onSelectTheme={(t) => { soundFx.playClick(); setShellTheme(t); }}
              />
            </div>

            {/* Right: Stats panel — scrollable */}
            <div className="flex justify-start">
              <StatsDashboard stats={stats} githubData={githubData} />
            </div>
          </div>
        </main>

        {/* Footer watermark */}
        <footer className="relative z-10 text-center py-4 text-[10px] font-mono text-slate-600 border-t border-white/[0.04]">
          Built with React, Web Audio API & HTML5 Canvas ·{' '}
          <a
            href="https://github.com/Trie-hard/Commit_Critter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            Trie-hard/Commit_Critter
          </a>
          {' '}· FirstCommit Hackathon 2026
        </footer>
      </div>

      {/* ── Sandbox Controls ── */}
      <SandboxControls
        overrides={overrides}
        onSimulatePush={simulatePush}
        onSimulateDaysIdle={simulateDaysIdle}
        onForceStage={forceStage}
        onForceElement={forceElement}
        onReset={resetSandbox}
      />

      {/* ── Modals ── */}
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
