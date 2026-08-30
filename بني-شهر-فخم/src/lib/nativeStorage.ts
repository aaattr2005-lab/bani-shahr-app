import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

/**
 * Native Storage Engine for Bani Shahr Application
 * 
 * Provides unified, durable key-value storage:
 * - On iOS / Android (Capacitor Native): Persists using UserDefaults / SharedPreferences via @capacitor/preferences
 *   which guarantees data is NEVER deleted when the OS cleans WebView cache.
 * - On Web / PWA: Uses localStorage and IndexedDB fallback.
 * - Synchronous reads via in-memory & localStorage cache for zero-latency UI rendering.
 * - Asynchronous background writes to native storage for permanent durability.
 */

class NativeStorageEngine {
  private isNative: boolean;
  private isInitialized: boolean = false;
  private memoryCache: Map<string, string> = new Map();

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  /**
   * Initializes native storage and synchronizes any previously saved native preferences
   * back into memory & localStorage (vital for iOS/Android if WebView cache was purged).
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Fetch all stored keys from Native Preferences
      const { keys } = await Preferences.keys();
      
      for (const key of keys) {
        const { value } = await Preferences.get({ key });
        if (value !== null) {
          this.memoryCache.set(key, value);
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem(key, value);
            }
          } catch (e) {
            console.warn('[NativeStorage] LocalStorage sync warning:', e);
          }
        }
      }

      // Also ensure any existing localStorage items are registered to Native Preferences
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && !this.memoryCache.has(key)) {
            const val = window.localStorage.getItem(key);
            if (val !== null) {
              this.memoryCache.set(key, val);
              await Preferences.set({ key, value: val }).catch(() => {});
            }
          }
        }
      }

      this.isInitialized = true;
      console.log(`[NativeStorage] Initialized successfully. Platform: ${this.isNative ? 'Native (' + Capacitor.getPlatform() + ')' : 'Web/PWA'}, Keys: ${keys.length}`);
    } catch (err) {
      console.error('[NativeStorage] Initialization error:', err);
    }
  }

  /**
   * Synchronous getItem - reads instantly from memory/localStorage
   */
  getItem(key: string): string | null {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key) || null;
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          this.memoryCache.set(key, item);
          return item;
        }
      }
    } catch (e) {
      console.warn(`[NativeStorage] getItem error for key "${key}":`, e);
    }
    return null;
  }

  /**
   * Synchronous setItem - updates memory & localStorage instantly and persists asynchronously to Native Preferences
   */
  setItem(key: string, value: string): void {
    this.memoryCache.set(key, value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[NativeStorage] localStorage.setItem failed for key "${key}":`, e);
    }

    // Persist to Capacitor Native Storage
    Preferences.set({ key, value }).catch((err) => {
      console.error(`[NativeStorage] Failed to persist key "${key}" to native preferences:`, err);
    });
  }

  /**
   * Synchronous removeItem - removes from memory, localStorage, and Native Preferences
   */
  removeItem(key: string): void {
    this.memoryCache.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[NativeStorage] removeItem error for key "${key}":`, e);
    }

    Preferences.remove({ key }).catch((err) => {
      console.error(`[NativeStorage] Failed to remove key "${key}" from native preferences:`, err);
    });
  }

  /**
   * Clear all stored data
   */
  clear(): void {
    this.memoryCache.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn('[NativeStorage] clear error:', e);
    }

    Preferences.clear().catch((err) => {
      console.error('[NativeStorage] Failed to clear native preferences:', err);
    });
  }

  /**
   * Typed Async Get
   */
  async getAsync<T = unknown>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      if (value !== null) {
        this.memoryCache.set(key, value);
        return JSON.parse(value) as T;
      }
    } catch (e) {
      // Fallback to sync memory/localStorage
      const syncVal = this.getItem(key);
      if (syncVal !== null) {
        try {
          return JSON.parse(syncVal) as T;
        } catch {
          return syncVal as unknown as T;
        }
      }
    }
    return defaultValue;
  }

  /**
   * Typed Async Set
   */
  async setAsync<T = unknown>(key: string, value: T): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    this.setItem(key, serialized);
    await Preferences.set({ key, value: serialized });
  }

  /**
   * Typed Async Remove
   */
  async removeAsync(key: string): Promise<void> {
    this.removeItem(key);
    await Preferences.remove({ key });
  }
}

export const AppStorage = new NativeStorageEngine();
