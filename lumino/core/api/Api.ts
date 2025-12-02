/**
 * Lumino Framework - Api Builder
 *
 * Fluent builder for defining individual API endpoints.
 */

import type {
  HttpMethod,
  CacheConfig,
  PaginationConfig,
  RequestConfig,
  Response,
} from "../types/base";
import type {
  ApiConfig,
  BuiltApi,
  BuiltMapper,
  HeadersBuilder,
  CacheBuilder,
  PaginationBuilder,
} from "../types/api";
import type { AppContext } from "../types/context";

// =============================================================================
// HEADERS BUILDER IMPLEMENTATION
// =============================================================================

class HeadersBuilderImpl<TParent> implements HeadersBuilder<TParent> {
  private _headers: Record<string, string> = {};
  private _parent: TParent;

  constructor(parent: TParent, initial?: Record<string, string>) {
    this._parent = parent;
    if (initial) {
      this._headers = { ...initial };
    }
  }

  set(key: string, value: string): HeadersBuilder<TParent> {
    this._headers[key] = value;
    return this;
  }

  remove(key: string): HeadersBuilder<TParent> {
    delete this._headers[key];
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  getHeaders(): Record<string, string> {
    return { ...this._headers };
  }
}

// =============================================================================
// CACHE BUILDER IMPLEMENTATION
// =============================================================================

class CacheBuilderImpl<TParent> implements CacheBuilder<TParent> {
  private _config: CacheConfig = {
    enabled: true,
    storage: "memory",
    duration: 60000, // 1 minute default
    keyPrefix: "lumino_cache_",
  };
  private _parent: TParent;

  constructor(parent: TParent) {
    this._parent = parent;
  }

  storage(storage: "memory" | "localStorage" | "sessionStorage"): CacheBuilder<TParent> {
    this._config.storage = storage;
    return this;
  }

  duration(ms: number): CacheBuilder<TParent> {
    this._config.duration = ms;
    return this;
  }

  keyPrefix(prefix: string): CacheBuilder<TParent> {
    this._config.keyPrefix = prefix;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  getConfig(): CacheConfig {
    return { ...this._config };
  }
}

// =============================================================================
// PAGINATION BUILDER IMPLEMENTATION
// =============================================================================

class PaginationBuilderImpl<TParent> implements PaginationBuilder<TParent> {
  private _config: PaginationConfig = {
    type: "offset",
    defaultLimit: 20,
    maxLimit: 100,
  };
  private _parent: TParent;

  constructor(parent: TParent) {
    this._parent = parent;
  }

  type(type: "offset" | "cursor"): PaginationBuilder<TParent> {
    this._config.type = type;
    return this;
  }

  defaultLimit(limit: number): PaginationBuilder<TParent> {
    this._config.defaultLimit = limit;
    return this;
  }

  maxLimit(limit: number): PaginationBuilder<TParent> {
    this._config.maxLimit = limit;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  getConfig(): PaginationConfig {
    return { ...this._config };
  }
}

// =============================================================================
// API BUILDER
// =============================================================================

/**
 * Fluent builder for creating API endpoint definitions.
 *
 * @example
 * ```typescript
 * class GetUserApi extends Api<User> {
 *   constructor() {
 *     super();
 *     this.id("users.get")
 *         .url("/api/users/:id")
 *         .method("GET")
 *         .mapper(UserMapper)
 *         .timeout(30000);
 *   }
 * }
 * ```
 */
export class Api<TResponse = any, TBody = void> {
  protected _config: ApiConfig = {
    id: "",
    url: "",
    method: "GET",
    headers: {},
    timeout: 30000,
    cache: null,
    pagination: null,
    mapper: null,
    beforeRequest: null,
    afterResponse: null,
  };

  private _headersBuilder: HeadersBuilderImpl<Api<TResponse, TBody>> | null = null;
  private _cacheBuilder: CacheBuilderImpl<Api<TResponse, TBody>> | null = null;
  private _paginationBuilder: PaginationBuilderImpl<Api<TResponse, TBody>> | null = null;

  constructor() {}

  /**
   * Set unique identifier for the API
   */
  id(id: string): this {
    this._config.id = id;
    return this;
  }

  /**
   * Set URL endpoint (supports :param placeholders)
   */
  url(url: string): this {
    this._config.url = url;
    return this;
  }

  /**
   * Set HTTP method
   */
  method(method: HttpMethod): this {
    this._config.method = method;
    return this;
  }

  /**
   * Set mapper for DTO/Entity transformation
   */
  mapper(mapper: BuiltMapper<any, any>): this {
    this._config.mapper = mapper;
    return this;
  }

  /**
   * Set request timeout in milliseconds
   */
  timeout(ms: number): this {
    this._config.timeout = ms;
    return this;
  }

  /**
   * Start headers configuration builder
   */
  headers(): HeadersBuilder<this> {
    this._headersBuilder = new HeadersBuilderImpl(this, this._config.headers);
    return this._headersBuilder as unknown as HeadersBuilder<this>;
  }

  /**
   * Start cache configuration builder
   */
  cache(): CacheBuilder<this> {
    this._cacheBuilder = new CacheBuilderImpl(this);
    return this._cacheBuilder as unknown as CacheBuilder<this>;
  }

  /**
   * Start pagination configuration builder
   */
  pagination(): PaginationBuilder<this> {
    this._paginationBuilder = new PaginationBuilderImpl(this);
    return this._paginationBuilder as unknown as PaginationBuilder<this>;
  }

  /**
   * Set request interceptor
   */
  beforeRequest(
    fn: (config: RequestConfig, ctx: AppContext) => RequestConfig
  ): this {
    this._config.beforeRequest = fn;
    return this;
  }

  /**
   * Set response interceptor
   */
  afterResponse(fn: (response: Response, ctx: AppContext) => any): this {
    this._config.afterResponse = fn;
    return this;
  }

  /**
   * Build the API configuration
   */
  build(): BuiltApi<TResponse, TBody> {
    // Apply builder configurations
    if (this._headersBuilder) {
      this._config.headers = this._headersBuilder.getHeaders();
    }
    if (this._cacheBuilder) {
      this._config.cache = this._cacheBuilder.getConfig();
    }
    if (this._paginationBuilder) {
      this._config.pagination = this._paginationBuilder.getConfig();
    }

    // Validate
    if (!this._config.id) {
      throw new Error("Api: id is required");
    }
    if (!this._config.url) {
      throw new Error(`Api "${this._config.id}": url is required`);
    }

    return {
      config: { ...this._config },
    } as BuiltApi<TResponse, TBody>;
  }

  /**
   * Get the built API (alias for constructor usage pattern)
   */
  protected getBuiltApi(): BuiltApi<TResponse, TBody> {
    return this.build();
  }
}

// =============================================================================
// API GROUP BASE CLASS
// =============================================================================

/**
 * Base class for grouping related APIs together.
 *
 * @example
 * ```typescript
 * class UsersApi extends ApiGroup {
 *   list = new ListUsersApi().build();
 *   get = new GetUserApi().build();
 *   create = new CreateUserApi().build();
 * }
 * ```
 */
export abstract class ApiGroup {
  /**
   * Get all APIs in this group
   */
  getApis(): Record<string, BuiltApi<any, any>> {
    const apis: Record<string, BuiltApi<any, any>> = {};

    for (const key of Object.keys(this)) {
      const value = (this as any)[key];
      if (value && typeof value === "object" && "config" in value) {
        apis[key] = value;
      }
    }

    return apis;
  }

  /**
   * Get API by name
   */
  getApi(name: string): BuiltApi<any, any> | undefined {
    return (this as any)[name];
  }
}
