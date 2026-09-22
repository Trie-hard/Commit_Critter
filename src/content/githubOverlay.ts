/// <reference types="chrome" />
import './overlay.css';

/**
 * GitHub Content Script Companion Widget for Commit Critter
 * Injects a delightful floating mini-companion in the bottom-right of github.com
 */

interface WidgetStats {
  level: number;
  stage: string;
  element: string;
  mood: string;
  energy: number;
  happiness: number;
  title: string;
  streakDays?: number;
}

function initGitHubOverlay() {
  if (document.getElementById('commit-critter-github-widget')) return;

  const container = document.createElement('div');
  container.id = 'commit-critter-github-widget';
  document.body.appendChild(container);

  let isPopoverOpen = false;
  let currentStats: WidgetStats = {
    level: 1,
    stage: 'HATCHLING',
    element: 'VOLT',
    mood: 'HAPPY',
    energy: 85,
    happiness: 90,
    title: 'Code Hatchling',
    streakDays: 6,
  };

  function getCritterEmoji(stage: string, element: string): string {
    if (stage === 'EGG') return '🥚';
    if (stage === 'MYTHIC') return '👑';
    if (element === 'FLORA') return '🌱';
    if (element === 'VOLT') return '⚡';
    if (element === 'FERRO') return '🦀';
    if (element === 'TIDAL') return '🌊';
    if (element === 'PRISM') return '💎';
    return '🐾';
  }

  function renderWidget() {
    const emoji = getCritterEmoji(currentStats.stage, currentStats.element);
    
    container.innerHTML = `
      <div class="critter-widget-container">
        ${
          isPopoverOpen
            ? `
          <div class="critter-widget-popover">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">${emoji}</span>
                <div>
                  <div style="font-weight: 700; font-size: 13px; color: #17191c;">Commit Critter</div>
                  <div style="font-size: 11px; color: #777b86;">Lv.${currentStats.level} · ${currentStats.stage}</div>
                </div>
              </div>
              <button id="critter-widget-close" style="border: none; background: none; cursor: pointer; color: #979799; font-size: 16px; padding: 2px 6px;">✕</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 11px; color: #17191c;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #777b86;">Energy</span>
                <span style="font-weight: 600;">${currentStats.energy}%</span>
              </div>
              <div style="width: 100%; height: 4px; background: #f2f2f3; border-radius: 99px; overflow: hidden;">
                <div style="width: ${currentStats.energy}%; height: 100%; background: #17191c; border-radius: 99px;"></div>
              </div>

              <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                <span style="color: #777b86;">Happiness</span>
                <span style="font-weight: 600;">${currentStats.happiness}%</span>
              </div>
              <div style="width: 100%; height: 4px; background: #f2f2f3; border-radius: 99px; overflow: hidden;">
                <div style="width: ${currentStats.happiness}%; height: 100%; background: #25723e; border-radius: 99px;"></div>
              </div>
            </div>

            <div style="display: flex; gap: 6px; margin-top: 4px;">
              <button id="critter-pet-btn" style="flex: 1; padding: 6px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); background: #fbe1d1; color: #5d2a1a; font-weight: 600; font-size: 11px; cursor: pointer;">
                Pet 💖
              </button>
              <button id="critter-feed-btn" style="flex: 1; padding: 6px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); background: #f2f2f3; color: #17191c; font-weight: 600; font-size: 11px; cursor: pointer;">
                Feed 🍪
              </button>
            </div>
          </div>
        `
            : ''
        }

        <div id="critter-avatar-toggle" class="critter-widget-avatar-btn" title="Commit Critter — Lv.${currentStats.level}">
          <span style="font-size: 26px;">${emoji}</span>
          <span class="critter-widget-badge">Lv.${currentStats.level}</span>
        </div>
      </div>
    `;

    // Attach listeners
    const toggleBtn = document.getElementById('critter-avatar-toggle');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        isPopoverOpen = !isPopoverOpen;
        renderWidget();
      };
    }

    const closeBtn = document.getElementById('critter-widget-close');
    if (closeBtn) {
      closeBtn.onclick = () => {
        isPopoverOpen = false;
        renderWidget();
      };
    }

    const petBtn = document.getElementById('critter-pet-btn');
    if (petBtn) {
      petBtn.onclick = (e) => {
        spawnReaction('💖', e.clientX, e.clientY);
        currentStats.happiness = Math.min(100, currentStats.happiness + 5);
        chrome.storage.local.set({ commit_critter_stats: currentStats });
        renderWidget();
      };
    }

    const feedBtn = document.getElementById('critter-feed-btn');
    if (feedBtn) {
      feedBtn.onclick = (e) => {
        spawnReaction('🍪', e.clientX, e.clientY);
        currentStats.energy = Math.min(100, currentStats.energy + 5);
        chrome.storage.local.set({ commit_critter_stats: currentStats });
        renderWidget();
      };
    }
  }

  function spawnReaction(symbol: string, x: number, y: number) {
    const el = document.createElement('div');
    el.className = 'critter-floating-heart';
    el.textContent = symbol;
    el.style.left = `${x - 12}px`;
    el.style.top = `${y - 20}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  // Initial load from storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['commit_critter_stats'], (res) => {
      if (res && res.commit_critter_stats && typeof res.commit_critter_stats === 'object') {
        const stored = res.commit_critter_stats as Partial<WidgetStats>;
        currentStats = { ...currentStats, ...stored };
        renderWidget();
      }
    });

    // Sync live changes
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.commit_critter_stats) {
        const updated = changes.commit_critter_stats.newValue;
        if (updated && typeof updated === 'object') {
          currentStats = { ...currentStats, ...(updated as Partial<WidgetStats>) };
          renderWidget();
        }
      }
    });
  }

  renderWidget();
}

// Automatically mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGitHubOverlay);
} else {
  initGitHubOverlay();
}
