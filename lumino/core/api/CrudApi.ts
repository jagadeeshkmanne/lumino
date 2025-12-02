/**
 * Lumino Framework - CrudApi
 *
 * Auto-generates CRUD operations similar to Spring Boot JpaRepository.
 * Define once, get list, get, create, update, patch, delete, search.
 */

import type { CacheConfig, PaginationConfig } from "../types/base";
import type { BuiltApi, BuiltMapper } from "../types/api";
import { Api, ApiGroup } from "./Api";
import { ApiRegistry } from "../registry/ApiRegistry";

// =============================================================================
// CRUD API BUILDER
// =============================================================================

/**
 * CrudApi automatically generates standard CRUD operations.
 * Registration happens automatically after constructor completes.
 *
 * @example
 * ```typescript
 * class UsersApi extends CrudApi<User, number> {
 *   constructor() {
 *     super();
 *     this.entity(User)
 *         .baseUrl("/api/users")
 *         .mapper(UserMapper)
 *         .pagination()
 *           .type("offset")
 *           .defaultLimit(20)
 *           .end();
 *   }
 *   // Registration happens automatically
 *
 *   // Additional custom APIs
 *   checkEmail = new Api<boolean>()
 *     .id("users.checkEmail")
 *     .url("/api/users/check-email")
 *     .method("POST")
 *     .build();
 * }
 * ```
 */
export abstract class CrudApi<TEntity, TId = number> extends ApiGroup {
  protected _baseUrl: string = "";
  protected _mapper: BuiltMapper<any, TEntity> | null = null;
  protected _paginationConfig: PaginationConfig | null = null;
  protected _cacheConfig: CacheConfig | null = null;
  protected _entityName: string = "";

  // Auto-generated APIs
  public list!: BuiltApi<TEntity[]>;
  public get!: BuiltApi<TEntity>;
  public create!: BuiltApi<TEntity, Partial<TEntity>>;
  public update!: BuiltApi<TEntity, Partial<TEntity>>;
  public patch!: BuiltApi<TEntity, Partial<TEntity>>;
  public delete!: BuiltApi<void>;
  public search!: BuiltApi<TEntity[]>;

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
    if (name && name !== "CrudApi") {
      ApiRegistry.register(name, this);
    }
  }

  /**
   * Set entity type (for naming)
   */
  entity(entityClass: new () => TEntity): this {
    this._entityName = entityClass.name.toLowerCase();
    return this;
  }

  /**
   * Set base URL for all CRUD operations
   */
  baseUrl(url: string): this {
    this._baseUrl = url;
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
   * Configure pagination
   */
  pagination(): CrudPaginationBuilder<this> {
    return new CrudPaginationBuilder(this, (config) => {
      this._paginationConfig = config;
      this._generateApis();
    });
  }

  /**
   * Configure cache
   */
  cache(): CrudCacheBuilder<this> {
    return new CrudCacheBuilder(this, (config) => {
      this._cacheConfig = config;
      this._generateApis();
    });
  }

  /**
   * Generate all CRUD APIs
   */
  private _generateApis(): void {
    if (!this._baseUrl) return;

    const baseName = this._entityName || "entity";

    // List API - GET /baseUrl
    this.list = new Api<TEntity[]>()
      .id(`${baseName}.list`)
      .url(this._baseUrl)
      .method("GET")
      .build();
    if (this._mapper) {
      this.list.config.mapper = this._mapper;
    }
    if (this._paginationConfig) {
      this.list.config.pagination = this._paginationConfig;
    }

    // Get API - GET /baseUrl/:id
    this.get = new Api<TEntity>()
      .id(`${baseName}.get`)
      .url(`${this._baseUrl}/:id`)
      .method("GET")
      .build();
    if (this._mapper) {
      this.get.config.mapper = this._mapper;
    }

    // Create API - POST /baseUrl
    this.create = new Api<TEntity, Partial<TEntity>>()
      .id(`${baseName}.create`)
      .url(this._baseUrl)
      .method("POST")
      .build();
    if (this._mapper) {
      this.create.config.mapper = this._mapper;
    }

    // Update API - PUT /baseUrl/:id
    this.update = new Api<TEntity, Partial<TEntity>>()
      .id(`${baseName}.update`)
      .url(`${this._baseUrl}/:id`)
      .method("PUT")
      .build();
    if (this._mapper) {
      this.update.config.mapper = this._mapper;
    }

    // Patch API - PATCH /baseUrl/:id
    this.patch = new Api<TEntity, Partial<TEntity>>()
      .id(`${baseName}.patch`)
      .url(`${this._baseUrl}/:id`)
      .method("PATCH")
      .build();
    if (this._mapper) {
      this.patch.config.mapper = this._mapper;
    }

    // Delete API - DELETE /baseUrl/:id
    this.delete = new Api<void>()
      .id(`${baseName}.delete`)
      .url(`${this._baseUrl}/:id`)
      .method("DELETE")
      .build();

    // Search API - GET /baseUrl/search or POST with criteria
    this.search = new Api<TEntity[]>()
      .id(`${baseName}.search`)
      .url(`${this._baseUrl}`)
      .method("GET")
      .build();
    if (this._mapper) {
      this.search.config.mapper = this._mapper;
    }
    if (this._paginationConfig) {
      this.search.config.pagination = this._paginationConfig;
    }
  }
}

// =============================================================================
// CRUD PAGINATION BUILDER
// =============================================================================

class CrudPaginationBuilder<TParent> {
  private _config: PaginationConfig = {
    type: "offset",
    defaultLimit: 20,
    maxLimit: 100,
  };
  private _parent: TParent;
  private _onComplete: (config: PaginationConfig) => void;

  constructor(parent: TParent, onComplete: (config: PaginationConfig) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  type(type: "offset" | "cursor"): this {
    this._config.type = type;
    return this;
  }

  defaultLimit(limit: number): this {
    this._config.defaultLimit = limit;
    return this;
  }

  maxLimit(limit: number): this {
    this._config.maxLimit = limit;
    return this;
  }

  end(): TParent {
    this._onComplete(this._config);
    return this._parent;
  }
}

// =============================================================================
// CRUD CACHE BUILDER
// =============================================================================

class CrudCacheBuilder<TParent> {
  private _config: CacheConfig = {
    enabled: true,
    storage: "memory",
    duration: 60000,
    keyPrefix: "lumino_crud_",
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
