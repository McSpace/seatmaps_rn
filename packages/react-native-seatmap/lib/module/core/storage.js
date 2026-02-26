"use strict";

/**
 * React Native storage service — drop-in replacement for web localStorage.
 *
 * Uses an in-memory cache for synchronous access (to keep the same API surface
 * as the web JetsLocalStorageService) and persists data asynchronously via
 * @react-native-async-storage/async-storage.
 *
 * Call `storage.init()` once at app startup to hydrate the in-memory cache
 * from disk before any token lookups occur.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
export const ERROR_SAVE_DATA_MESSAGE = 'Error saving data to storage. Message:';
export const ERROR_LOAD_DATA_MESSAGE = 'Error getting data from storage. Message:';
export class JetsStorageService {
  cache = new Map();

  /** Hydrate the in-memory cache from AsyncStorage. Call once at startup. */
  async init() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      const now = Date.now();
      for (const [key, raw] of items) {
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          if (parsed.expiry && parsed.expiry < now) {
            await AsyncStorage.removeItem(key);
            continue;
          }
          this.cache.set(key, parsed);
        } catch {
          // ignore malformed entries
        }
      }
    } catch (err) {
      console.warn('JetsStorageService.init error:', err);
    }
  }

  /** Synchronous read from in-memory cache. */
  getData(key) {
    try {
      const entry = this.cache.get(key);
      if (!entry) return null;
      if (entry.expiry && entry.expiry < Date.now()) {
        this.removeData(key);
        return null;
      }
      return entry.value;
    } catch (err) {
      console.warn(ERROR_LOAD_DATA_MESSAGE, err);
      return null;
    }
  }

  /** Synchronous write to in-memory cache + async persist. */
  setData(key, value, ttl) {
    try {
      const entry = {
        value
      };
      if (ttl) entry.expiry = Date.now() + ttl;
      this.cache.set(key, entry);
      AsyncStorage.setItem(key, JSON.stringify(entry)).catch(err => console.warn(ERROR_SAVE_DATA_MESSAGE, err));
      return true;
    } catch (err) {
      console.warn(ERROR_SAVE_DATA_MESSAGE, err);
      return false;
    }
  }
  removeData(key) {
    this.cache.delete(key);
    AsyncStorage.removeItem(key).catch(err => console.warn('JetsStorageService.removeData error:', err));
  }
}
//# sourceMappingURL=storage.js.map