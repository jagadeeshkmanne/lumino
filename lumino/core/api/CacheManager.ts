/**
 * Lumino Framework - Cache Manager
 *
 * Handles caching of API responses with support for:
 * - Memory cache
 * - LocalStorage
 * - SessionStorage
 */

import type { CacheConfig, CacheStorage } from "../types/base";

// =============================================================================
// CACHE ENTRY
// =============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  duration: number;
}

// =============================================================================
// CACHE MANAGER
// =============================================================================

/**
 * Cache Manager for API responses.
 *
 * Supports multiple storage backends:
 * - memory: In-memory Map (default, cleared on page refresh)
 * - localStorage: Persistent across sessions
 * - sessionStorage: Cleared when browser tab closes
 */
export class CacheManager {
  private _memoryCache: Map<string, CacheEntry<any>> = new Map();
  private _defaultKeyPrefix: string = "lumino_cache_";

  // ===========================================================================
  // PUBLIC METHODS
  // ===========================================================================

  /**
   * Get cached data
   */
  get<T>(key: string, config: CacheConfig): T | null {
    if (!config.enabled) return null;

    const fullKey = this._getFullKey(key, config);
    const entry = this._getEntry<T>(fullKey, config.storage);

    if (!entry) return null;

    // Check if cache is expired
    if (this._isExpired(entry)) {
      this.remove(key, config);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached data
   */
  set<T>(key: string, data: T, config: CacheConfig): void {
    if (!config.enabled) return;

    const fullKey = this._getFullKey(key, config);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      duration: config.duration,
    };

    this._setEntry(fullKey, entry, config.storage);
  }

  /**
   * Remove cached data
   */
  remove(key: string, config: CacheConfig): void {
    const fullKey = this._getFullKey(key, config);
    this._removeEntry(fullKey, config.storage);
  }

  /**
   * Check if cache entry exists and is valid
   */
  has(key: string, config: CacheConfig): boolean {
    return this.get(key, config) !== null;
  }

  /**
   * Clear all cache for a specific storage type
   */
  clear(storage: CacheStorage = "memory"): void {
    switch (storage) {
      case "memory":
        this._memoryCache.clear();
        break;
      case "localStorage":
        this._clearWebStorage(localStorage);
        break;
      case "sessionStorage":
        this._clearWebStorage(sessionStorage);
        break;
    }
  }

  /**
   * Clear all cache across all storage types
   */
  clearAll(): void {
    this.clear("memory");
    this.clear("localStorage");
    this.clear("sessionStorage");
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memory: number;
    localStorage: number;
    sessionStorage: number;
  } {
    return {
      memory: this._memoryCache.size,
      localStorage: this._countWebStorageEntries(localStorage),
      sessionStorage: this._countWebStorageEntries(sessionStorage),
    };
  }

  // ===========================================================================
  // PRIVATE METHODS
  // ===========================================================================

  private _getFullKey(key: string, config: CacheConfig): string {
    const prefix = config.keyPrefix || this._defaultKeyPrefix;
    return `${prefix}${key}`;
  }

  private _getEntry<T>(key: string, storage: CacheStorage): CacheEntry<T> | null {
    switch (storage) {
      case "memory":
        return this._memoryCache.get(key) || null;

      case "localStorage":
      case "sessionStorage":
        return this._getFromWebStorage<T>(key, storage);

      default:
        return null;
    }
  }

  private _setEntry<T>(
    key: string,
    entry: CacheEntry<T>,
    storage: CacheStorage
  ): void {
    switch (storage) {
      case "memory":
        this._memoryCache.set(key, entry);
        break;

      case "localStorage":
        this._setToWebStorage(key, entry, localStorage);
        break;

      case "sessionStorage":
        this._setToWebStorage(key, entry, sessionStorage);
        break;
    }
  }

  private _removeEntry(key: string, storage: CacheStorage): void {
    switch (storage) {
      case "memory":
        this._memoryCache.delete(key);
        break;

      case "localStorage":
        localStorage.removeItem(key);
        break;

      case "sessionStorage":
        sessionStorage.removeItem(key);
        break;
    }
  }

  private _getFromWebStorage<T>(
    key: string,
    storage: "localStorage" | "sessionStorage"
  ): CacheEntry<T> | null {
    try {
      const webStorage = storage === "localStorage" ? localStorage : sessionStorage;
      const item = webStorage.getItem(key);

      if (!item) return null;

      return JSON.parse(item) as CacheEntry<T>;
    } catch {
      return null;
    }
  }

  private _setToWebStorage<T>(
    key: string,
    entry: CacheEntry<T>,
    webStorage: Storage
  ): void {
    try {
      webStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      // Storage might be full or disabled
      console.warn("Lumino: Failed to save to web storage", error);
    }
  }

  private _clearWebStorage(webStorage: Storage): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < webStorage.length; i++) {
      const key = webStorage.key(i);
      if (key && key.startsWith(this._defaultKeyPrefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => webStorage.removeItem(key));
  }

  private _countWebStorageEntries(webStorage: Storage): number {
    let count = 0;
    for (let i = 0; i < webStorage.length; i++) {
      const key = webStorage.key(i);
      if (key && key.startsWith(this._defaultKeyPrefix)) {
        count++;
      }
    }
    return count;
  }

  private _isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.duration;
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Default cache manager instance
 */
export const cacheManager = new CacheManager();
