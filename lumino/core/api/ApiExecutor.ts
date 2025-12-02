/**
 * Lumino Framework - API Executor
 *
 * Handles HTTP request execution with support for:
 * - URL parameter replacement
 * - Request/Response interceptors
 * - Timeout handling
 * - Mapper transformation
 */

import type {
  RequestConfig,
  Response,
  ErrorResponse,
  CallOptions,
} from "../types/base";
import type { BuiltApi } from "../types/api";
import type { AppContext } from "../types/context";
import { CacheManager } from "./CacheManager";

// =============================================================================
// INTERCEPTOR TYPES
// =============================================================================

export type RequestInterceptor = (config: RequestConfig, ctx: AppContext) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: Response, ctx: AppContext) => any | Promise<any>;
export type ErrorInterceptor = (error: ErrorResponse, ctx: AppContext) => any | Promise<any>;

export interface Interceptor {
  name?: string;
  /** Priority for ordering (lower runs first). Default: 100 */
  priority?: number;
  request?: RequestInterceptor;
  response?: ResponseInterceptor;
  error?: ErrorInterceptor;
}

// =============================================================================
// URL BUILDER
// =============================================================================

/**
 * Build full URL with path parameters replaced
 */
export function buildUrl(
  baseUrl: string,
  url: string,
  pathParams?: Record<string, any>,
  queryParams?: Record<string, any>
): string {
  let fullUrl = url;

  // Replace path parameters (e.g., :id, :userId)
  if (pathParams) {
    Object.keys(pathParams).forEach((key) => {
      const placeholder = `:${key}`;
      const optionalPlaceholder = `:${key}?`;
      if (fullUrl.includes(optionalPlaceholder)) {
        fullUrl = fullUrl.replace(optionalPlaceholder, encodeURIComponent(pathParams[key]));
      } else if (fullUrl.includes(placeholder)) {
        fullUrl = fullUrl.replace(placeholder, encodeURIComponent(pathParams[key]));
      }
    });
  }

  // Remove any remaining optional params
  fullUrl = fullUrl.replace(/\/:[^/]+\?/g, "");

  // Prepend base URL if url is relative
  if (!fullUrl.startsWith("http")) {
    fullUrl = `${baseUrl.replace(/\/$/, "")}/${fullUrl.replace(/^\//, "")}`;
  }

  // Add query parameters
  if (queryParams && Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    if (queryString) {
      fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
    }
  }

  return fullUrl;
}

// =============================================================================
// REQUEST CONFIG BUILDER
// =============================================================================

/**
 * Create request configuration from API definition and options
 */
export function createRequestConfig(
  api: BuiltApi<any, any>,
  baseUrl: string,
  defaultHeaders: Record<string, string>,
  defaultTimeout: number,
  options: CallOptions
): RequestConfig {
  const config = api.config;

  // Build URL with path and query params
  const url = buildUrl(baseUrl, config.url, options.path, options.query);

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...config.headers,
    ...options.headers,
  };

  return {
    url,
    method: config.method,
    headers,
    params: options.query || {},
    body: options.body,
    timeout: config.timeout || defaultTimeout,
  };
}

// =============================================================================
// HTTP EXECUTOR
// =============================================================================

/**
 * Execute HTTP request using fetch
 */
export async function executeHttpRequest(config: RequestConfig): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    const fetchOptions: RequestInit = {
      method: config.method,
      headers: config.headers,
      signal: controller.signal,
    };

    // Add body for non-GET requests
    if (config.body !== undefined && config.method !== "GET") {
      if (config.body instanceof FormData) {
        fetchOptions.body = config.body;
        // Remove Content-Type for FormData (browser sets it with boundary)
        delete (fetchOptions.headers as Record<string, string>)["Content-Type"];
      } else {
        fetchOptions.body = JSON.stringify(config.body);
      }
    }

    const response = await fetch(config.url, fetchOptions);

    clearTimeout(timeoutId);

    // Parse response headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Parse response body
    let data: any;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else if (contentType?.includes("text/")) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    // Handle error responses
    if (!response.ok) {
      const error: ErrorResponse = {
        status: response.status,
        statusText: response.statusText,
        message: data?.message || response.statusText,
        errors: data?.errors,
        data,
      };
      throw error;
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers,
      data,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle abort (timeout)
    if (error.name === "AbortError") {
      throw {
        status: 408,
        statusText: "Request Timeout",
        message: `Request timed out after ${config.timeout}ms`,
        data: null,
      } as ErrorResponse;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw {
        status: 0,
        statusText: "Network Error",
        message: "Network error. Please check your connection.",
        data: null,
      } as ErrorResponse;
    }

    // Re-throw ErrorResponse
    if (error.status !== undefined) {
      throw error;
    }

    // Unknown error
    throw {
      status: 500,
      statusText: "Internal Error",
      message: error.message || "An unexpected error occurred",
      data: null,
    } as ErrorResponse;
  }
}

// =============================================================================
// API EXECUTOR CLASS
// =============================================================================

/**
 * API Executor handles all API calls with caching, mapping, and interceptors.
 */
export class ApiExecutor {
  private _baseUrl: string = "";
  private _defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  private _defaultTimeout: number = 30000;
  private _cacheManager: CacheManager;
  private _interceptors: Interceptor[] = [];
  /** @deprecated Use addInterceptor instead */
  private _beforeRequest: ((config: RequestConfig, ctx: AppContext) => RequestConfig) | null = null;
  /** @deprecated Use addInterceptor instead */
  private _afterResponse: ((response: Response, ctx: AppContext) => any) | null = null;

  constructor(config?: {
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
    defaultTimeout?: number;
  }) {
    this._cacheManager = new CacheManager();

    if (config?.baseUrl) this._baseUrl = config.baseUrl;
    if (config?.defaultHeaders) {
      this._defaultHeaders = { ...this._defaultHeaders, ...config.defaultHeaders };
    }
    if (config?.defaultTimeout) this._defaultTimeout = config.defaultTimeout;
  }

  // ===========================================================================
  // CONFIGURATION METHODS
  // ===========================================================================

  setBaseUrl(url: string): this {
    this._baseUrl = url;
    return this;
  }

  getBaseUrl(): string {
    return this._baseUrl;
  }

  setDefaultHeaders(headers: Record<string, string>): this {
    this._defaultHeaders = { ...this._defaultHeaders, ...headers };
    return this;
  }

  addDefaultHeader(key: string, value: string): this {
    this._defaultHeaders[key] = value;
    return this;
  }

  removeDefaultHeader(key: string): this {
    delete this._defaultHeaders[key];
    return this;
  }

  getDefaultHeaders(): Record<string, string> {
    return { ...this._defaultHeaders };
  }

  setDefaultTimeout(timeout: number): this {
    this._defaultTimeout = timeout;
    return this;
  }

  getDefaultTimeout(): number {
    return this._defaultTimeout;
  }

  setBeforeRequest(fn: (config: RequestConfig, ctx: AppContext) => RequestConfig): this {
    this._beforeRequest = fn;
    return this;
  }

  setAfterResponse(fn: (response: Response, ctx: AppContext) => any): this {
    this._afterResponse = fn;
    return this;
  }

  getCacheManager(): CacheManager {
    return this._cacheManager;
  }

  // ===========================================================================
  // INTERCEPTOR METHODS
  // ===========================================================================

  /**
   * Add an interceptor to the chain.
   * Interceptors run in priority order (lower priority runs first).
   * @example
   * ```typescript
   * executor.addInterceptor({
   *   name: "auth",
   *   priority: 10,
   *   request: (config, ctx) => {
   *     config.headers["Authorization"] = `Bearer ${ctx.getAuthToken()}`;
   *     return config;
   *   }
   * });
   * ```
   */
  addInterceptor(interceptor: Interceptor): this {
    this._interceptors.push({
      priority: 100, // default priority
      ...interceptor,
    });
    // Sort by priority (lower first)
    this._interceptors.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
    return this;
  }

  /**
   * Remove an interceptor by name
   */
  removeInterceptor(name: string): this {
    this._interceptors = this._interceptors.filter((i) => i.name !== name);
    return this;
  }

  /**
   * Get all registered interceptors
   */
  getInterceptors(): Interceptor[] {
    return [...this._interceptors];
  }

  /**
   * Clear all interceptors
   */
  clearInterceptors(): this {
    this._interceptors = [];
    return this;
  }

  // ===========================================================================
  // EXECUTION METHODS
  // ===========================================================================

  /**
   * Execute API call
   */
  async execute<T>(
    api: BuiltApi<T, any>,
    options: CallOptions,
    ctx: AppContext
  ): Promise<T> {
    const config = api.config;

    // Check cache first (for GET requests)
    if (config.method === "GET" && config.cache && !options.skipCache) {
      const cacheKey = this._buildCacheKey(api, options);
      const cached = this._cacheManager.get<T>(cacheKey, config.cache);
      if (cached !== null) {
        return cached;
      }
    }

    // Create request config
    let requestConfig = createRequestConfig(
      api,
      this._baseUrl,
      this._defaultHeaders,
      this._defaultTimeout,
      options
    );

    // Apply mapper to request body (toEntity)
    if (
      config.mapper &&
      requestConfig.body &&
      ["POST", "PUT", "PATCH"].includes(requestConfig.method)
    ) {
      requestConfig.body = Array.isArray(requestConfig.body)
        ? config.mapper.toEntityList(requestConfig.body)
        : config.mapper.toEntity(requestConfig.body);
    }

    // Run request interceptor chain (sorted by priority)
    for (const interceptor of this._interceptors) {
      if (interceptor.request) {
        requestConfig = await interceptor.request(requestConfig, ctx);
      }
    }

    // Apply legacy global beforeRequest (deprecated)
    if (this._beforeRequest) {
      requestConfig = this._beforeRequest(requestConfig, ctx);
    }

    // Apply API-level beforeRequest interceptor
    if (config.beforeRequest) {
      requestConfig = config.beforeRequest(requestConfig, ctx);
    }

    try {
      // Execute request
      const response = await executeHttpRequest(requestConfig);

      // Apply API-level afterResponse interceptor
      let data = response.data;
      if (config.afterResponse) {
        data = config.afterResponse(response, ctx);
      }

      // Apply legacy global afterResponse (deprecated)
      if (this._afterResponse) {
        data = this._afterResponse({ ...response, data }, ctx);
      }

      // Run response interceptor chain (sorted by priority)
      for (const interceptor of this._interceptors) {
        if (interceptor.response) {
          data = await interceptor.response({ ...response, data }, ctx);
        }
      }

      // Apply mapper to response (toDTO)
      if (config.mapper) {
        data = Array.isArray(data)
          ? config.mapper.toDTOList(data)
          : config.mapper.toDTO(data);
      }

      // Cache response (for GET requests)
      if (config.method === "GET" && config.cache && !options.skipCache) {
        const cacheKey = this._buildCacheKey(api, options);
        this._cacheManager.set(cacheKey, data, config.cache);
      }

      return data as T;
    } catch (error) {
      // Run error interceptor chain
      let handledError = error as ErrorResponse;
      for (const interceptor of this._interceptors) {
        if (interceptor.error) {
          const result = await interceptor.error(handledError, ctx);
          // If interceptor returns a value (not undefined), use it as the result
          if (result !== undefined) {
            return result as T;
          }
        }
      }
      // Re-throw if no interceptor handled the error
      throw handledError;
    }
  }

  /**
   * Build cache key for API + options
   */
  private _buildCacheKey(api: BuiltApi<any, any>, options: CallOptions): string {
    const parts = [api.config.id];

    if (options.path) {
      parts.push(JSON.stringify(options.path));
    }
    if (options.query) {
      parts.push(JSON.stringify(options.query));
    }

    return parts.join(":");
  }

  /**
   * Clear cache for specific API or all
   */
  clearCache(api?: BuiltApi<any, any>): void {
    if (api && api.config.cache) {
      this._cacheManager.clear(api.config.cache.storage);
    } else {
      this._cacheManager.clearAll();
    }
  }
}
