import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  GitHubActivityData, 
  CritterStats, 
  SandboxOverrides, 
  Achievement,
  CritterStage,
  CritterElement,
  CritterMood
} from '../types/critter';
import { calculateCritterStats } from '../services/statCalculator';
import { soundFx } from '../services/audioEngine';
import { storageGet, storageSet } from '../services/storageService';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_commit', title: 'First Commit!', description: 'Hatched your pet with your first repository commit', icon: '🌱', unlocked: false },
  { id: 'hatchling_stage', title: 'Life Finds a Way', description: 'Evolved past the egg stage into a lively hatchling', icon: '🐣', unlocked: false },
  { id: 'streak_master', title: 'Streak Alchemist', description: 'Maintained an active coding streak of 7+ days', icon: '🔥', unlocked: false },
  { id: 'polyglot', title: 'Code Polyglot', description: 'Coded across 3 or more distinct programming languages', icon: '🌐', unlocked: false },
  { id: 'night_owl', title: 'Midnight Hacker', description: 'Pushed code between 11:00 PM and 5:00 AM', icon: '🌙', unlocked: false },
  { id: 'mythic_evolution', title: 'Ascended Sovereign', description: 'Achieved 200+ commits to reach Mythic form', icon: '👑', unlocked: false },
  { id: 'snack_feeder', title: 'Good Caretaker', description: 'Fed your critter 5 delicious commit snacks', icon: '🍪', unlocked: false },
];

export function useCritterEngine(initialData: GitHubActivityData) {
  const [githubData, setGithubData] = useState<GitHubActivityData>(initialData);
  const [overrides, setOverrides] = useState<SandboxOverrides>({
    simulatedCommits: 0,
    simulatedDaysIdle: 0,
    active: false,
  });

  const [feedCount, setFeedCount] = useState<number>(0);
  const [temporaryMood, setTemporaryMood] = useState<CritterMood | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('commit_critter_achievements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Safe fallback
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Calculate live stats
  const calculatedStats = calculateCritterStats(githubData, overrides);
  const prevStageRef = useRef<CritterStage>(calculatedStats.stage);

  // Effective mood: temporary overrides (e.g. feasting or petting) take priority
  const effectiveStats: CritterStats = {
    ...calculatedStats,
    mood: temporaryMood || calculatedStats.mood,
  };

  // Load achievements from storage on mount
  useEffect(() => {
    storageGet<Achievement[]>('commit_critter_achievements', INITIAL_ACHIEVEMENTS).then((saved) => {
      if (Array.isArray(saved) && saved.length > 0) {
        setAchievements(saved);
      }
    });
  }, []);

  // Save current stats to storage for extension overlay and background worker
  useEffect(() => {
    storageSet('commit_critter_stats', effectiveStats);
  }, [effectiveStats]);

  // Evolution & Celebration watcher
  useEffect(() => {
    if (prevStageRef.current !== calculatedStats.stage) {
      // Stage progressed!
      soundFx.playLevelUp();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ff007f', '#ffe600', '#39ff14'],
      });
      prevStageRef.current = calculatedStats.stage;
    }
  }, [calculatedStats.stage]);

  // Achievement unlock checker
  useEffect(() => {
    setAchievements((prev) => {
      let updated = false;
      const next = prev.map((ach) => {
        if (ach.unlocked) return ach;
        let shouldUnlock = false;

        if (ach.id === 'first_commit' && (githubData.totalRecentCommits + overrides.simulatedCommits) >= 1) {
          shouldUnlock = true;
        } else if (ach.id === 'hatchling_stage' && calculatedStats.stage !== 'EGG') {
          shouldUnlock = true;
        } else if (ach.id === 'streak_master' && githubData.streakDays >= 7) {
          shouldUnlock = true;
        } else if (ach.id === 'polyglot' && githubData.languages.length >= 3) {
          shouldUnlock = true;
        } else if (ach.id === 'night_owl' && githubData.isNightOwl) {
          shouldUnlock = true;
        } else if (ach.id === 'mythic_evolution' && calculatedStats.stage === 'MYTHIC') {
          shouldUnlock = true;
        } else if (ach.id === 'snack_feeder' && feedCount >= 5) {
          shouldUnlock = true;
        }

        if (shouldUnlock) {
          updated = true;
          soundFx.playChirp();
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
        }
        return ach;
      });

      if (updated) {
        storageSet('commit_critter_achievements', next);
      }
      return updated ? next : prev;
    });
  }, [githubData, overrides, calculatedStats.stage, feedCount]);

  // 1. Interactive Pet Action
  const pet = useCallback(() => {
    soundFx.playPurr();
    setTemporaryMood('HAPPY');
    setTimeout(() => {
      setTemporaryMood(null);
    }, 2500);
  }, []);

  // 2. Interactive Feed Action
  const feedCommit = useCallback(() => {
    soundFx.playCrunch();
    setFeedCount((c) => c + 1);
    setTemporaryMood('FEASTING');

    // Feasting gives a micro commit boost
    setOverrides((prev) => ({
      ...prev,
      active: true,
      simulatedCommits: prev.simulatedCommits + 1,
      simulatedDaysIdle: Math.max(0, prev.simulatedDaysIdle - 1),
    }));

    setTimeout(() => {
      setTemporaryMood(null);
    }, 2000);
  }, []);

  // 3. Time Machine: Simulate Push Commits
  const simulatePush = useCallback((count: number) => {
    soundFx.playChirp();
    setOverrides((prev) => ({
      ...prev,
      active: true,
      simulatedCommits: prev.simulatedCommits + count,
      simulatedDaysIdle: 0, // Fresh push resets idle timer!
    }));
  }, []);

  // 4. Time Machine: Advance Days Idle
  const simulateDaysIdle = useCallback((days: number) => {
    soundFx.playClick();
    setOverrides((prev) => ({
      ...prev,
      active: true,
      simulatedDaysIdle: Math.max(0, prev.simulatedDaysIdle + days),
    }));
  }, []);

  // 5. Force Stage (for testing)
  const forceStage = useCallback((stage: CritterStage) => {
    soundFx.playLevelUp();
    setOverrides((prev) => ({
      ...prev,
      active: true,
      forcedStage: stage,
    }));
  }, []);

  // 6. Force Element (for testing)
  const forceElement = useCallback((element: CritterElement) => {
    soundFx.playChirp();
    setOverrides((prev) => ({
      ...prev,
      active: true,
      forcedElement: element,
    }));
  }, []);

  // 7. Reset Sandbox
  const resetSandbox = useCallback(() => {
    soundFx.playClick();
    setOverrides({
      simulatedCommits: 0,
      simulatedDaysIdle: 0,
      active: false,
    });
    setTemporaryMood(null);
  }, []);

  // Update root GitHub data
  const updateUserData = useCallback((newData: GitHubActivityData) => {
    setGithubData(newData);
    setOverrides({
      simulatedCommits: 0,
      simulatedDaysIdle: 0,
      active: false,
    });
  }, []);

  return {
    githubData,
    stats: effectiveStats,
    overrides,
    achievements,
    feedCount,
    pet,
    feedCommit,
    simulatePush,
    simulateDaysIdle,
    forceStage,
    forceElement,
    resetSandbox,
    updateUserData,
  };
}
