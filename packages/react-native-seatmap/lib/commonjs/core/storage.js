"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JetsStorageService = exports.ERROR_SAVE_DATA_MESSAGE = exports.ERROR_LOAD_DATA_MESSAGE = void 0;
var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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

const ERROR_SAVE_DATA_MESSAGE = exports.ERROR_SAVE_DATA_MESSAGE = 'Error saving data to storage. Message:';
const ERROR_LOAD_DATA_MESSAGE = exports.ERROR_LOAD_DATA_MESSAGE = 'Error getting data from storage. Message:';
class JetsStorageService {
  cache = new Map();

  /** Hydrate the in-memory cache from AsyncStorage. Call once at startup. */
  async init() {
    try {
      const keys = await _asyncStorage.default.getAllKeys();
      const items = await _asyncStorage.default.multiGet(keys);
      const now = Date.now();
      for (const [key, raw] of items) {
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          if (parsed.expiry && parsed.expiry < now) {
            await _asyncStorage.default.removeItem(key);
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
      _asyncStorage.default.setItem(key, JSON.stringify(entry)).catch(err => console.warn(ERROR_SAVE_DATA_MESSAGE, err));
      return true;
    } catch (err) {
      console.warn(ERROR_SAVE_DATA_MESSAGE, err);
      return false;
    }
  }
  removeData(key) {
    this.cache.delete(key);
    _asyncStorage.default.removeItem(key).catch(err => console.warn('JetsStorageService.removeData error:', err));
  }
}
exports.JetsStorageService = JetsStorageService;
//# sourceMappingURL=storage.js.map