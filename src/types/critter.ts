export type CritterStage = 'EGG' | 'HATCHLING' | 'JUVENILE' | 'ADULT' | 'MYTHIC';

export type CritterElement = 'FLORA' | 'VOLT' | 'FERRO' | 'TIDAL' | 'PRISM' | 'VOID';

export type CritterMood = 
  | 'IDLE' 
  | 'HAPPY' 
  | 'HYPED' 
  | 'DROOPY' 
  | 'SLEEPING' 
  | 'HUNGRY' 
  | 'FEASTING' 
  | 'EVOLVING';

export type ShellTheme = 'GAMEBOY' | 'CYBER' | 'SAKURA' | 'ATOMIC_PURPLE';

export interface CommitItem {
  id: string;
  repo: string;
  message: string;
  date: string;
  sha?: string;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

export interface GitHubActivityData {
  username: string;
  avatarUrl: string;
  name: string;
  bio?: string;
  publicRepos: number;
  totalRecentCommits: number;
  streakDays: number;
  lastCommitDate: string | null;
  primaryLanguage: string;
  languages: LanguageStat[];
  recentCommits: CommitItem[];
  isNightOwl: boolean;
  isWeekendWarrior: boolean;
  firstCommitDate?: string;
  isRateLimited?: boolean;
}

export interface CritterStats {
  energy: number;      // 0 - 100 (Recency of push)
  happiness: number;   // 0 - 100 (Streak consistency)
  hunger: number;      // 0 - 100 (0 = full, 100 = starving)
  level: number;       // Calculated from total commits
  exp: number;         // Current EXP towards next evolution
  maxExp: number;
  stage: CritterStage;
  element: CritterElement;
  mood: CritterMood;
  name: string;
  title: string;
  personalityQuirk: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SandboxOverrides {
  simulatedCommits: number;
  simulatedDaysIdle: number;
  forcedStage?: CritterStage;
  forcedElement?: CritterElement;
  forcedMood?: CritterMood;
  active: boolean;
}
