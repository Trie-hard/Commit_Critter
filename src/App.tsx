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
  Volume2, 
  VolumeX, 
  Trophy, 
  Share2, 
  Search, 
  Loader2, 
  Github, 
  Award,
  AlertCircle
} from 'lucide-react';

export const App: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState<string>('Trie-hard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundFx.getMuted());
  const [shellTheme, setShellTheme] = useState<ShellTheme>('CYBER');
  const [showPassport, setShowPassport] = useState<boolean>(false);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);

  // Initialize engine with Trie-hard (or First Commit profile fallback)
  const [activeProfile, setActiveProfile] = useState<GitHubActivityData>(() => {
    return {
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
        { name: 'Python', percentage: 10, color: '#3572A5' },
      ],
      recentCommits: [
        { id: 'th1', repo: 'Trie-hard/Commit_Critter', message: 'feat: add Tamagotchi sound engine & dynamic SVG sprite', date: 'Just now' },
        { id: 'th2', repo: 'Trie-hard/Commit_Critter', message: 'feat: add time machine sandbox and stats dashboard', date: '1 hour ago' },
        { id: 'th3', repo: 'Trie-hard/Commit_Critter', message: 'Initial commit: welcome to Commit Critter!', date: 'Yesterday' },
      ],
      isNightOwl: true,
      isWeekendWarrior: true,
    };
  });

  const {
    githubData,
    stats,
    overrides,
    achievements,
    pet,
    feedCommit,
    simulatePush,
    simulateDaysIdle,
    forceStage,
    forceElement,
    resetSandbox,
    updateUserData,
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not fetch GitHub data.';
      setErrorMsg(msg);
      soundFx.playError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickProfile = (profileData: GitHubActivityData) => {
    setUsernameInput(profileData.username);
    setActiveProfile(profileData);
    updateUserData(profileData);
    setErrorMsg(null);
  };

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col pb-36">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo & Hackathon Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
                🐾
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs sm:text-sm text-white tracking-wide">
                  COMMIT CRITTER
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono font-bold">
                  <Award className="w-3 h-3" /> FirstCommit 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                The virtual pet that thrives on your GitHub commits
              </p>
            </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-2">
            
            {/* Achievements Modal Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowAchievements(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold transition-all hover:border-amber-500/40 text-amber-300"
              title="View Achievements"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Badges</span>
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-bold">
                {achievements.filter((a) => a.unlocked).length}
              </span>
            </button>

            {/* Passport Generator Trigger */}
            <button
              onClick={() => {
                soundFx.playClick();
                setShowPassport(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-mono font-bold shadow-md shadow-cyan-600/20 transition-all hover:scale-105"
              title="Export Shareable Card"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Passport Card</span>
            </button>

            {/* 8-bit Audio Synthesizer Mute Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                isMuted 
                  ? 'bg-slate-900 border-slate-800 text-slate-500' 
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
              }`}
              title={isMuted ? 'Sound Muted' : 'Sound Enabled (Procedural 8-bit Audio)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/Trie-hard/Commit_Critter"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-all"
              title="View Source on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-6 flex flex-col gap-6 w-full">
        
        {/* Search & Onboarding Section */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-lg backdrop-blur-sm flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter GitHub username (e.g. Trie-hard, torvalds)..."
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-mono font-bold text-xs rounded-2xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Summoning...</span>
                </>
              ) : (
                <span>Hatch / Load Critter 🚀</span>
              )}
            </button>
          </form>

          {/* Quick Select Buttons for Judges */}
          <QuickProfiles
            currentUsername={githubData.username}
            onSelectProfile={handleSelectQuickProfile}
          />

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </section>

        {/* Primary Interactive Split View */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center: Handheld Tamagotchi Shell (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
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

          {/* Right: Real-time Stats, Metrics & Activity (7 cols) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-start">
            <StatsDashboard
              stats={stats}
              githubData={githubData}
            />
          </div>

        </section>

      </main>

      {/* Floating Judge Sandbox Controls */}
      <SandboxControls
        overrides={overrides}
        onSimulatePush={simulatePush}
        onSimulateDaysIdle={simulateDaysIdle}
        onForceStage={forceStage}
        onForceElement={forceElement}
        onReset={resetSandbox}
      />

      {/* Modals */}
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
