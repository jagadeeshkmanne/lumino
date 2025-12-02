/**
 * Lumino Framework - LookupApi
 *
 * Specialized API for cached reference/lookup data.
 * Automatically caches data with configurable storage.
 */

import type { CacheConfig } from "../types/base";
import type { BuiltApi, BuiltMapper } from "../types/api";
import { Api, ApiGroup } from "./Api";
import { ApiRegistry } from "../registry/ApiRegistry";

// =============================================================================
// LOOKUP API BUILDER
// =============================================================================

/**
 * LookupApi for cached reference data like countries, departments, statuses.
 * Registration happens automatically after constructor completes.
 *
 * @example
 * ```typescript
 * class CountriesApi extends LookupApi<Country> {
 *   constructor() {
 *     super();
 *     this.baseUrl("/api/lookups/countries")
 *         .cache()
 *           .storage("localStorage")
 *           .duration(86400000)  // 24 hours
 *           .end();
 *   }
 *   // Registration happens automatically
 * }
 * ```
 */
export abstract class LookupApi<TEntity> extends ApiGroup {
  protected _baseUrl: string = "";
  protected _mapper: BuiltMapper<any, TEntity> | null = null;
  protected _cacheConfig: CacheConfig = {
    enabled: true,
    storage: "memory",
    duration: 3600000, // 1 hour default
    keyPrefix: "lumino_lookup_",
  };
  protected _entityName: string = "";

  // Auto-generated APIs
  public list!: BuiltApi<TEntity[]>;
  public get!: BuiltApi<TEntity>;

  constructor() {
    super();
    // Defer registration to allow subclass constructor to complete
    queueMicrotask(() => this._register());
  }

  /**
   * Internal registration - called automatically after constructor
   */
  private _register(): void {
    const name = this.constructor.name;
    if (name && name !== "LookupApi") {
      ApiRegistry.register(name, this);
    }
  }

  /**
   * Set base URL for lookup API
   */
  baseUrl(url: string): this {
    this._baseUrl = url;
    this._entityName = this._extractEntityName(url);
    this._generateApis();
    return this;
  }

  /**
   * Set mapper for DTO/Entity transformation
   */
  mapper(mapper: BuiltMapper<any, TEntity>): this {
    this._mapper = mapper;
    this._generateApis();
    return this;
  }

  /**
   * Configure cache
   */
  cache(): LookupCacheBuilder<this> {
    return new LookupCacheBuilder(this, (config) => {
      this._cacheConfig = config;
      this._generateApis();
    });
  }

  /**
   * Extract entity name from URL for API naming
   */
  private _extractEntityName(url: string): string {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || "lookup";
  }

  /**
   * Generate lookup APIs
   */
  private _generateApis(): void {
    if (!this._baseUrl) return;

    // List API - GET /baseUrl (cached)
    this.list = new Api<TEntity[]>()
      .id(`lookup.${this._entityName}.list`)
      .url(this._baseUrl)
      .method("GET")
      .build();

    this.list.config.cache = this._cacheConfig;
    if (this._mapper) {
      this.list.config.mapper = this._mapper;
    }

    // Get by ID API - GET /baseUrl/:id (cached)
    this.get = new Api<TEntity>()
      .id(`lookup.${this._entityName}.get`)
      .url(`${this._baseUrl}/:id`)
      .method("GET")
      .build();

    this.get.config.cache = this._cacheConfig;
    if (this._mapper) {
      this.get.config.mapper = this._mapper;
    }
  }
}

// =============================================================================
// LOOKUP CACHE BUILDER
// =============================================================================

class LookupCacheBuilder<TParent> {
  private _config: CacheConfig = {
    enabled: true,
    storage: "memory",
    duration: 3600000,
    keyPrefix: "lumino_lookup_",
  };
  private _parent: TParent;
  private _onComplete: (config: CacheConfig) => void;

  constructor(parent: TParent, onComplete: (config: CacheConfig) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  storage(storage: "memory" | "localStorage" | "sessionStorage"): this {
    this._config.storage = storage;
    return this;
  }

  duration(ms: number): this {
    this._config.duration = ms;
    return this;
  }

  keyPrefix(prefix: string): this {
    this._config.keyPrefix = prefix;
    return this;
  }

  end(): TParent {
    this._onComplete(this._config);
    return this._parent;
  }
}
