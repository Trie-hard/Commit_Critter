import { 
  GitHubActivityData, 
  CritterStats, 
  CritterStage, 
  CritterElement, 
  CritterMood,
  SandboxOverrides 
} from '../types/critter';

// Mapping languages to elemental families
const LANGUAGE_TO_ELEMENT: Record<string, CritterElement> = {
  Python: 'FLORA',
  Java: 'FLORA',
  Kotlin: 'FLORA',
  
  JavaScript: 'VOLT',
  TypeScript: 'VOLT',
  Vue: 'VOLT',
  
  Rust: 'FERRO',
  'C++': 'FERRO',
  C: 'FERRO',
  Solidity: 'FERRO',
  
  Go: 'TIDAL',
  Ruby: 'TIDAL',
  PHP: 'TIDAL',
  Shell: 'TIDAL',
  
  HTML: 'PRISM',
  CSS: 'PRISM',
  Swift: 'PRISM',
  Dart: 'PRISM',
};

// Evolution milestone brackets (total commit thresholds)
export const STAGE_THRESHOLDS = {
  EGG: 0,
  HATCHLING: 5,
  JUVENILE: 25,
  ADULT: 75,
  MYTHIC: 200,
};

export function calculateCritterStats(
  data: GitHubActivityData,
  overrides?: SandboxOverrides
): CritterStats {
  const isSandbox = overrides?.active;
  const effectiveCommits = (data.totalRecentCommits || 0) + (isSandbox ? (overrides?.simulatedCommits || 0) : 0);
  const effectiveIdleDays = isSandbox ? (overrides?.simulatedDaysIdle || 0) : getDaysSinceLastCommit(data.lastCommitDate);

  // 1. Calculate Evolution Stage
  let stage: CritterStage = 'EGG';
  let exp = effectiveCommits;
  let maxExp = STAGE_THRESHOLDS.HATCHLING;

  if (effectiveCommits >= STAGE_THRESHOLDS.MYTHIC) {
    stage = 'MYTHIC';
    exp = effectiveCommits;
    maxExp = STAGE_THRESHOLDS.MYTHIC * 2;
  } else if (effectiveCommits >= STAGE_THRESHOLDS.ADULT) {
    stage = 'ADULT';
    exp = effectiveCommits - STAGE_THRESHOLDS.ADULT;
    maxExp = STAGE_THRESHOLDS.MYTHIC - STAGE_THRESHOLDS.ADULT;
  } else if (effectiveCommits >= STAGE_THRESHOLDS.JUVENILE) {
    stage = 'JUVENILE';
    exp = effectiveCommits - STAGE_THRESHOLDS.JUVENILE;
    maxExp = STAGE_THRESHOLDS.ADULT - STAGE_THRESHOLDS.JUVENILE;
  } else if (effectiveCommits >= STAGE_THRESHOLDS.HATCHLING) {
    stage = 'HATCHLING';
    exp = effectiveCommits - STAGE_THRESHOLDS.HATCHLING;
    maxExp = STAGE_THRESHOLDS.JUVENILE - STAGE_THRESHOLDS.HATCHLING;
  } else {
    stage = 'EGG';
    exp = effectiveCommits;
    maxExp = STAGE_THRESHOLDS.HATCHLING;
  }

  // Allow sandbox force override
  if (isSandbox && overrides?.forcedStage) {
    stage = overrides.forcedStage;
  }

  // 2. Determine Elemental Affinity from Primary Language
  let element: CritterElement = LANGUAGE_TO_ELEMENT[data.primaryLanguage] || 'VOID';
  if (isSandbox && overrides?.forcedElement) {
    element = overrides.forcedElement;
  }

  // 3. Calculate Energy (0 - 100) based on recency
  // Max energy if committed in last 4 hours; decays by 15% per day of inactivity
  let energy = Math.max(10, Math.min(100, Math.round(100 - (effectiveIdleDays * 18))));
  if (effectiveIdleDays === 0) energy = 100;

  // 4. Calculate Happiness (0 - 100) based on streak
  const streakBonus = Math.min(50, data.streakDays * 7);
  let happiness = Math.max(15, Math.min(100, 45 + streakBonus - (effectiveIdleDays * 12)));

  // 5. Hunger (0 = full, 100 = starving)
  let hunger = Math.min(100, Math.max(5, Math.round(effectiveIdleDays * 22)));

  // 6. Derive Mood
  let mood: CritterMood = 'IDLE';
  if (isSandbox && overrides?.forcedMood) {
    mood = overrides.forcedMood;
  } else {
    if (stage === 'EGG') {
      mood = 'IDLE';
    } else if (effectiveIdleDays >= 4) {
      mood = 'SLEEPING';
    } else if (hunger >= 75) {
      mood = 'HUNGRY';
    } else if (energy <= 25) {
      mood = 'DROOPY';
    } else if (data.streakDays >= 7 || energy >= 90) {
      mood = 'HYPED';
    } else if (happiness >= 70) {
      mood = 'HAPPY';
    } else {
      mood = 'IDLE';
    }
  }

  // 7. Calculate Level
  const level = Math.max(1, Math.floor(effectiveCommits / 4) + 1);

  // 8. Generate Title & Quirk
  const titlesByStage: Record<CritterStage, string> = {
    EGG: 'Cosmic Git Seed',
    HATCHLING: `Sprouting ${element} Hatchling`,
    JUVENILE: `Vibrant ${element} Familiar`,
    ADULT: `Mighty ${element} Champion`,
    MYTHIC: `Ascended ${element} Sovereign`,
  };

  let personalityQuirk = 'Loves clean merge commits and tabs over spaces.';
  if (data.isNightOwl) {
    personalityQuirk = '🌙 Night Owl: Thrives after midnight and drinks espresso syntax!';
  } else if (data.isWeekendWarrior) {
    personalityQuirk = '⚔️ Weekend Warrior: Drops epic PRs on Saturday mornings.';
  } else if (data.streakDays >= 10) {
    personalityQuirk = '🔥 On Fire: Unstoppable streak machine, allergic to missed days!';
  }

  return {
    energy,
    happiness,
    hunger,
    level,
    exp,
    maxExp,
    stage,
    element,
    mood,
    name: `${data.username}'s Critter`,
    title: titlesByStage[stage],
    personalityQuirk,
  };
}

function getDaysSinceLastCommit(lastCommitDateStr: string | null): number {
  if (!lastCommitDateStr) return 2;
  const last = new Date(lastCommitDateStr).getTime();
  const now = Date.now();
  const diffDays = (now - last) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.floor(diffDays));
}
