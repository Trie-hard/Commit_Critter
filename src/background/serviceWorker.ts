/// <reference types="chrome" />

/**
 * Background Service Worker for Commit Critter (Manifest V3)
 * Handles background polling, inactivity alarms, notifications, and badge updates.
 */

const ALARM_NAME = 'check_github_activity';
const CHECK_INTERVAL_MINUTES = 60;

interface StoredCritterStats {
  level?: number;
  stage?: string;
  element?: string;
  mood?: string;
  energy?: number;
  happiness?: number;
}

// On installation or browser launch
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[Commit Critter] Background service worker registered.');

  // Configure periodic alarm
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: CHECK_INTERVAL_MINUTES,
  });

  // Enable side panel behavior if supported
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {
      // Ignore in browsers that don't support sidePanel
    });
  }

  // Initial badge setup
  await updateBadgeFromStorage();
});

// Periodic alarm handler
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log('[Commit Critter] Alarm fired: checking GitHub activity...');
    await checkActivityAndNotify();
  }
});

// Listen for storage changes from popup/content script to keep badge in sync
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.commit_critter_stats) {
    const stats = changes.commit_critter_stats.newValue as StoredCritterStats | undefined;
    if (stats && typeof stats.level === 'number') {
      chrome.action.setBadgeText({ text: `Lv.${stats.level}` });
      const color = stats.mood === 'DROOPY' || stats.mood === 'HUNGRY' ? '#b45309' : '#25723e';
      chrome.action.setBadgeBackgroundColor({ color });
    }
  }
});

async function updateBadgeFromStorage() {
  try {
    const result = await chrome.storage.local.get(['commit_critter_stats', 'commit_critter_active_username']);
    const stats = result.commit_critter_stats as StoredCritterStats | undefined;
    if (stats && typeof stats.level === 'number') {
      chrome.action.setBadgeText({ text: `Lv.${stats.level}` });
      const color = stats.mood === 'DROOPY' || stats.mood === 'HUNGRY' ? '#b45309' : '#25723e';
      chrome.action.setBadgeBackgroundColor({ color });
    } else {
      chrome.action.setBadgeText({ text: '🐾' });
      chrome.action.setBadgeBackgroundColor({ color: '#17191c' });
    }
  } catch (e) {
    console.warn('[Commit Critter] Failed to update badge:', e);
  }
}

async function checkActivityAndNotify() {
  try {
    const result = await chrome.storage.local.get(['commit_critter_active_username', 'commit_critter_stats']);
    const rawUsername = result.commit_critter_active_username;
    if (!rawUsername || typeof rawUsername !== 'string') return;
    const username: string = rawUsername;

    // Fetch user public events to check recency of commits
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=10`);
    if (!res.ok) return;

    const events = await res.json();
    if (!Array.isArray(events)) return;

    const pushEvents = events.filter((e: { type: string }) => e.type === 'PushEvent');
    if (pushEvents.length === 0) return;

    const latestPush = pushEvents[0];
    const latestDate = new Date(latestPush.created_at).getTime();
    const daysSincePush = Math.floor((Date.now() - latestDate) / (1000 * 60 * 60 * 24));

    if (daysSincePush >= 3) {
      // Inactive for 3+ days: notify user
      chrome.notifications.create('critter_idle_warning', {
        type: 'basic',
        iconUrl: 'icons/icon-128.png',
        title: '🐾 Commit Critter is getting droopy!',
        message: `It has been ${daysSincePush} days since your last commit. Push code today to keep your streak alive!`,
        priority: 1,
      });

      chrome.action.setBadgeText({ text: '😴' });
      chrome.action.setBadgeBackgroundColor({ color: '#777b86' });
    } else {
      // Pet is happy and well-fed
      const stats = result.commit_critter_stats as StoredCritterStats | undefined;
      chrome.action.setBadgeText({ text: `Lv.${stats?.level ?? '1'}` });
      chrome.action.setBadgeBackgroundColor({ color: '#25723e' });
    }
  } catch (e) {
    console.warn('[Commit Critter] checkActivityAndNotify error:', e);
  }
}
