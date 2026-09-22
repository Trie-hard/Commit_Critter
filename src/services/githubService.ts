import { GitHubActivityData, CommitItem, LanguageStat } from '../types/critter';
import { storageGet, storageSet } from './storageService';

// Standard programming language brand colors
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  Ruby: '#701516',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Solidity: '#AA6746',
  Unknown: '#888888',
};

// Curated profiles for instant 1-click hackathon judging & offline demos
export const CURATED_PROFILES: Record<string, GitHubActivityData> = {
  torvalds: {
    username: 'torvalds',
    name: 'Linus Torvalds',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    bio: 'Creator of Linux and Git',
    publicRepos: 7,
    totalRecentCommits: 84,
    streakDays: 14,
    lastCommitDate: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    primaryLanguage: 'C',
    languages: [
      { name: 'C', percentage: 72, color: '#555555' },
      { name: 'Shell', percentage: 18, color: '#89e051' },
      { name: 'Makefile', percentage: 10, color: '#427819' },
    ],
    recentCommits: [
      { id: 'c1', repo: 'torvalds/linux', message: 'Merge branch "perf/core" into next', date: '3 hours ago' },
      { id: 'c2', repo: 'torvalds/linux', message: 'x86/cpu: Fix microcode loading race condition', date: '7 hours ago' },
      { id: 'c3', repo: 'torvalds/linux', message: 'Linux 6.14-rc1 tag release', date: 'Yesterday' },
      { id: 'c4', repo: 'torvalds/pesconvert', message: 'Clean up parser warnings', date: '2 days ago' },
    ],
    isNightOwl: false,
    isWeekendWarrior: true,
  },
  gaearon: {
    username: 'gaearon',
    name: 'Dan Abramov',
    avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4',
    bio: 'Co-author of Redux and Create React App',
    publicRepos: 260,
    totalRecentCommits: 48,
    streakDays: 9,
    lastCommitDate: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    primaryLanguage: 'JavaScript',
    languages: [
      { name: 'JavaScript', percentage: 55, color: '#f7df1e' },
      { name: 'TypeScript', percentage: 35, color: '#3178c6' },
      { name: 'CSS', percentage: 10, color: '#563d7c' },
    ],
    recentCommits: [
      { id: 'c1', repo: 'overreacted.io', message: 'Add interactive diagram for React Server Components', date: '8 hours ago' },
      { id: 'c2', repo: 'facebook/react', message: 'Fix reconciliation loop on hydration suspense boundary', date: '1 day ago' },
      { id: 'c3', repo: 'gaearon/my-reads', message: 'Update bookshelf rating', date: '2 days ago' },
    ],
    isNightOwl: true,
    isWeekendWarrior: false,
  },
  sindresorhus: {
    username: 'sindresorhus',
    name: 'Sindre Sorhus',
    avatarUrl: 'https://avatars.githubusercontent.com/u/170270?v=4',
    bio: 'Full-time open-sourcerer. Creator of 1000+ npm packages.',
    publicRepos: 1100,
    totalRecentCommits: 142,
    streakDays: 28,
    lastCommitDate: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 minutes ago
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', percentage: 65, color: '#3178c6' },
      { name: 'JavaScript', percentage: 25, color: '#f7df1e' },
      { name: 'Swift', percentage: 10, color: '#F05138' },
    ],
    recentCommits: [
      { id: 'c1', repo: 'sindresorhus/ky', message: 'v1.7.5: Bump dependencies & optimize payload size', date: '35 mins ago' },
      { id: 'c2', repo: 'sindresorhus/got', message: 'Fix timeout retry exponential backoff calculation', date: '3 hours ago' },
      { id: 'c3', repo: 'sindresorhus/execa', message: 'Add cross-spawn async error handling', date: 'Yesterday' },
    ],
    isNightOwl: true,
    isWeekendWarrior: true,
  },
  firstcommit: {
    username: 'firstcommit-dev',
    name: 'First Commit Hero',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Proud hackathon beginner! Building my very first project 🚀',
    publicRepos: 2,
    totalRecentCommits: 12,
    streakDays: 3,
    lastCommitDate: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    primaryLanguage: 'Python',
    languages: [
      { name: 'Python', percentage: 70, color: '#3572A5' },
      { name: 'HTML', percentage: 20, color: '#e34c26' },
      { name: 'CSS', percentage: 10, color: '#563d7c' },
    ],
    recentCommits: [
      { id: 'c1', repo: 'firstcommit-dev/my-first-repo', message: 'feat: add virtual pet heartbeat loop', date: '1 hour ago' },
      { id: 'c2', repo: 'firstcommit-dev/my-first-repo', message: 'fix: button alignment in tamagotchi casing', date: '4 hours ago' },
      { id: 'c3', repo: 'firstcommit-dev/my-first-repo', message: 'Initial commit: hello world!', date: '2 days ago' },
    ],
    isNightOwl: false,
    isWeekendWarrior: true,
  }
};

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function fetchGitHubUserData(username: string): Promise<GitHubActivityData> {
  const cleanUsername = username.trim().toLowerCase();

  // If match in curated profiles and user selected it directly
  if (CURATED_PROFILES[cleanUsername]) {
    return CURATED_PROFILES[cleanUsername];
  }

  // Check local/extension storage cache to respect GitHub API rate limits
  const cacheKey = `critter_gh_${cleanUsername}`;
  const cached = await storageGet<{ timestamp: number; data: GitHubActivityData } | null>(cacheKey, null);
  if (cached && typeof cached === 'object' && cached.timestamp && cached.data) {
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      await storageSet('commit_critter_active_username', cleanUsername);
      await storageSet('commit_critter_latest_data', cached.data);
      return cached.data;
    }
  }

  try {
    // 1. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
    if (userRes.status === 404) {
      throw new Error(`GitHub user "${username}" was not found.`);
    }

    if (userRes.status === 403) {
      // Rate limited
      console.warn('GitHub API rate limit encountered. Falling back to cached or simulated data.');
      return createFallbackProfile(username, true);
    }

    const userData = await userRes.json();

    // 2. Fetch User Events (for commits & push history)
    const eventsRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/events/public?per_page=60`);
    const events = eventsRes.ok ? await eventsRes.json() : [];

    // 3. Fetch User Repos (for language analysis)
    const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=pushed&per_page=30`);
    const repos = reposRes.ok ? await reposRes.json() : [];

    // Process push events & commits
    const pushEvents = Array.isArray(events) ? events.filter((e: { type: string }) => e.type === 'PushEvent') : [];
    
    let totalCommits = 0;
    const recentCommits: CommitItem[] = [];
    let lastCommitDate: string | null = null;
    let lateNightCommits = 0;
    let weekendCommits = 0;

    const commitDates: Set<string> = new Set();

    pushEvents.forEach((event: {
      id: string;
      repo?: { name: string };
      created_at: string;
      payload?: { commits?: Array<{ sha?: string; message: string }> };
    }) => {
      const createdAt = new Date(event.created_at);
      const dateStr = createdAt.toISOString().split('T')[0];
      commitDates.add(dateStr);

      if (!lastCommitDate || createdAt > new Date(lastCommitDate)) {
        lastCommitDate = event.created_at;
      }

      const hour = createdAt.getHours();
      if (hour >= 23 || hour <= 5) {
        lateNightCommits++;
      }

      const day = createdAt.getDay();
      if (day === 0 || day === 6) {
        weekendCommits++;
      }

      const eventCommits = event.payload?.commits || [];
      totalCommits += eventCommits.length > 0 ? eventCommits.length : 1;

      eventCommits.slice(0, 3).forEach((c, idx) => {
        if (recentCommits.length < 15) {
          recentCommits.push({
            id: `${event.id}_${idx}`,
            repo: event.repo?.name || 'unknown/repo',
            message: c.message.split('\n')[0].slice(0, 75),
            date: formatRelativeTime(createdAt),
            sha: c.sha?.slice(0, 7),
          });
        }
      });
    });

    // Calculate streak from distinct active days
    const streakDays = calculateStreak(commitDates);

    // Language statistics
    const languageCounts: Record<string, number> = {};
    if (Array.isArray(repos)) {
      repos.forEach((repo: { language?: string; fork?: boolean }) => {
        if (repo.language && !repo.fork) {
          languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        }
      });
    }

    const totalLangRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;
    const sortedLanguages: LanguageStat[] = Object.entries(languageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalLangRepos) * 100),
        color: LANGUAGE_COLORS[name] || '#6366f1',
      }));

    const primaryLanguage = sortedLanguages[0]?.name || 'JavaScript';

    const processedData: GitHubActivityData = {
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || undefined,
      publicRepos: userData.public_repos || 0,
      totalRecentCommits: Math.max(totalCommits, recentCommits.length, 1),
      streakDays: Math.max(streakDays, 1),
      lastCommitDate: lastCommitDate || userData.updated_at,
      primaryLanguage,
      languages: sortedLanguages.length > 0 ? sortedLanguages : [
        { name: primaryLanguage, percentage: 100, color: LANGUAGE_COLORS[primaryLanguage] || '#f7df1e' }
      ],
      recentCommits: recentCommits.length > 0 ? recentCommits : [
        { id: 'def1', repo: `${userData.login}/repo`, message: 'chore: project updates and code improvements', date: 'Recently' }
      ],
      isNightOwl: lateNightCommits > 2,
      isWeekendWarrior: weekendCommits > 3,
    };

    // Save to storage cache
    await storageSet(cacheKey, { timestamp: Date.now(), data: processedData });
    await storageSet('commit_critter_active_username', cleanUsername);
    await storageSet('commit_critter_latest_data', processedData);

    return processedData;
  } catch (err: unknown) {
    console.warn('API error fetching user, falling back to simulated profile:', err);
    return createFallbackProfile(username, false);
  }
}

export async function getActiveUsername(): Promise<string> {
  return await storageGet<string>('commit_critter_active_username', 'Trie-hard');
}

export async function getLatestUserData(): Promise<GitHubActivityData | null> {
  return await storageGet<GitHubActivityData | null>('commit_critter_latest_data', null);
}

function calculateStreak(dates: Set<string>): number {
  if (dates.size === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (dates.has(dateStr)) {
      streak++;
    } else if (i > 1) {
      // Break streak only after checking yesterday
      break;
    }
  }
  return Math.max(streak, 1);
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${Math.max(diffMins, 1)}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

function createFallbackProfile(username: string, isRateLimited: boolean): GitHubActivityData {
  return {
    username,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    bio: 'Passionate developer crafting digital creatures!',
    publicRepos: 14,
    totalRecentCommits: 29,
    streakDays: 5,
    lastCommitDate: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    primaryLanguage: 'TypeScript',
    languages: [
      { name: 'TypeScript', percentage: 60, color: '#3178c6' },
      { name: 'JavaScript', percentage: 25, color: '#f7df1e' },
      { name: 'Python', percentage: 15, color: '#3572A5' },
    ],
    recentCommits: [
      { id: 'fb1', repo: `${username}/app`, message: 'feat: add animated Tamagotchi mood loop', date: '4h ago' },
      { id: 'fb2', repo: `${username}/app`, message: 'fix: optimize canvas export resolution for Twitter', date: 'Yesterday' },
      { id: 'fb3', repo: `${username}/app`, message: 'Initial commit: Welcome to Commit Critter!', date: '3d ago' },
    ],
    isNightOwl: true,
    isWeekendWarrior: false,
    isRateLimited,
  };
}
