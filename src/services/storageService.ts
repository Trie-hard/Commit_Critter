/**
 * Unified storage adapter for Commit Critter.
 * Supports Chrome Extension (chrome.storage.local) and Web (localStorage) transparently.
 */

export const isExtensionEnvironment = (): boolean => {
  return (
    typeof chrome !== 'undefined' &&
    Boolean(chrome.storage) &&
    Boolean(chrome.storage.local)
  );
};

export async function storageGet<T>(key: string, defaultValue: T): Promise<T> {
  if (isExtensionEnvironment()) {
    try {
      const result = await chrome.storage.local.get(key);
      if (result && result[key] !== undefined) {
        return result[key] as T;
      }
      return defaultValue;
    } catch (e) {
      console.warn(`[storageService] chrome.storage.local.get failed for key "${key}", falling back to localStorage`, e);
    }
  }

  // Web / fallback mode
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      return JSON.parse(raw) as T;
    }
  } catch (e) {
    console.warn(`[storageService] localStorage.getItem failed for key "${key}"`, e);
  }

  return defaultValue;
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  if (isExtensionEnvironment()) {
    try {
      await chrome.storage.local.set({ [key]: value });
      return;
    } catch (e) {
      console.warn(`[storageService] chrome.storage.local.set failed for key "${key}", falling back to localStorage`, e);
    }
  }

  // Web / fallback mode
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[storageService] localStorage.setItem failed for key "${key}"`, e);
  }
}

export async function storageRemove(key: string): Promise<void> {
  if (isExtensionEnvironment()) {
    try {
      await chrome.storage.local.remove(key);
      return;
    } catch (e) {
      console.warn(`[storageService] chrome.storage.local.remove failed for key "${key}"`, e);
    }
  }

  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`[storageService] localStorage.removeItem failed for key "${key}"`, e);
  }
}
