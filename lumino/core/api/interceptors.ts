/**
 * Lumino Framework - Common API Interceptors
 *
 * Pre-built interceptors for common use cases.
 */

import type { RequestConfig, Response, ErrorResponse } from "../types/base";
import type { AppContext } from "../types/context";
import type { Interceptor } from "./ApiExecutor";

// =============================================================================
// AUTH INTERCEPTOR
// =============================================================================

/**
 * Creates an auth interceptor that adds Authorization header.
 * @example
 * ```typescript
 * executor.addInterceptor(createAuthInterceptor());
 * ```
 */
export function createAuthInterceptor(options?: {
  /** Custom header name (default: "Authorization") */
  headerName?: string;
  /** Token prefix (default: "Bearer") */
  tokenPrefix?: string;
  /** Custom token getter (default: ctx.getAuthToken()) */
  getToken?: (ctx: AppContext) => string | null;
}): Interceptor {
  const headerName = options?.headerName ?? "Authorization";
  const tokenPrefix = options?.tokenPrefix ?? "Bearer";
  const getToken = options?.getToken ?? ((ctx) => ctx.getAuthToken());

  return {
    name: "auth",
    priority: 10, // Run early
    request: (config, ctx) => {
      const token = getToken(ctx);
      if (token) {
        config.headers[headerName] = tokenPrefix ? `${tokenPrefix} ${token}` : token;
      }
      return config;
    },
  };
}

// =============================================================================
// LOGGING INTERCEPTOR
// =============================================================================

/**
 * Creates a logging interceptor for debugging API calls.
 * @example
 * ```typescript
 * executor.addInterceptor(createLoggingInterceptor({ logBody: true }));
 * ```
 */
export function createLoggingInterceptor(options?: {
  /** Log request body (default: false for security) */
  logBody?: boolean;
  /** Log response data (default: false) */
  logResponse?: boolean;
  /** Custom logger (default: console) */
  logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
  };
}): Interceptor {
  const logBody = options?.logBody ?? false;
  const logResponse = options?.logResponse ?? false;
  const logger = options?.logger ?? console;

  return {
    name: "logging",
    priority: 1, // Run first
    request: (config, ctx) => {
      const logData: any = {
        method: config.method,
        url: config.url,
        headers: config.headers,
      };
      if (logBody && config.body) {
        logData.body = config.body;
      }
      logger.log("[API Request]", logData);
      return config;
    },
    response: (response, ctx) => {
      const logData: any = {
        status: response.status,
        statusText: response.statusText,
      };
      if (logResponse) {
        logData.data = response.data;
      }
      logger.log("[API Response]", logData);
      return response.data;
    },
    error: (error, ctx) => {
      logger.error("[API Error]", {
        status: error.status,
        message: error.message,
        data: error.data,
      });
      return undefined; // Don't handle, just log
    },
  };
}

// =============================================================================
// RETRY INTERCEPTOR
// =============================================================================

/**
 * Creates a retry interceptor for transient failures.
 * NOTE: This only handles error interception. Actual retry logic
 * would need to be implemented at a higher level with the request config.
 * @example
 * ```typescript
 * executor.addInterceptor(createRetryInterceptor({ maxRetries: 3 }));
 * ```
 */
export function createRetryInterceptor(options?: {
  /** Max retry attempts (default: 3) */
  maxRetries?: number;
  /** Status codes to retry on (default: [408, 429, 500, 502, 503, 504]) */
  retryStatuses?: number[];
  /** Delay between retries in ms (default: 1000) */
  retryDelay?: number;
}): Interceptor {
  const maxRetries = options?.maxRetries ?? 3;
  const retryStatuses = options?.retryStatuses ?? [408, 429, 500, 502, 503, 504];
  const retryDelay = options?.retryDelay ?? 1000;

  // Track retry counts per request (would need request ID in real impl)
  const retryCounts = new Map<string, number>();

  return {
    name: "retry",
    priority: 200, // Run after other error handlers
    error: async (error, ctx) => {
      if (retryStatuses.includes(error.status)) {
        // In a real implementation, we'd need access to the original request
        // to retry it. For now, just log the retry intention.
        console.warn(`[Retry] Would retry request (status: ${error.status})`);
      }
      return undefined; // Don't handle, let it propagate
    },
  };
}

// =============================================================================
// ERROR TRANSFORM INTERCEPTOR
// =============================================================================

/**
 * Creates an interceptor that transforms error responses.
 * @example
 * ```typescript
 * executor.addInterceptor(createErrorTransformInterceptor({
 *   transform: (error) => ({
 *     ...error,
 *     message: i18n.t(`errors.${error.status}`) || error.message
 *   })
 * }));
 * ```
 */
export function createErrorTransformInterceptor(options: {
  transform: (error: ErrorResponse, ctx: AppContext) => ErrorResponse;
}): Interceptor {
  return {
    name: "errorTransform",
    priority: 50,
    error: (error, ctx) => {
      const transformed = options.transform(error, ctx);
      throw transformed; // Re-throw transformed error
    },
  };
}

// =============================================================================
// UNAUTHORIZED REDIRECT INTERCEPTOR
// =============================================================================

/**
 * Creates an interceptor that redirects on 401/403 errors.
 * @example
 * ```typescript
 * executor.addInterceptor(createUnauthorizedInterceptor({
 *   loginPath: "/login",
 *   forbiddenPath: "/forbidden"
 * }));
 * ```
 */
export function createUnauthorizedInterceptor(options?: {
  /** Path to redirect on 401 (default: "/login") */
  loginPath?: string;
  /** Path to redirect on 403 (default: "/forbidden") */
  forbiddenPath?: string;
  /** Custom handler for 401 */
  onUnauthorized?: (error: ErrorResponse, ctx: AppContext) => void;
  /** Custom handler for 403 */
  onForbidden?: (error: ErrorResponse, ctx: AppContext) => void;
}): Interceptor {
  const loginPath = options?.loginPath ?? "/login";
  const forbiddenPath = options?.forbiddenPath ?? "/forbidden";

  return {
    name: "unauthorized",
    priority: 100,
    error: (error, ctx) => {
      if (error.status === 401) {
        if (options?.onUnauthorized) {
          options.onUnauthorized(error, ctx);
        } else {
          ctx.navigate(loginPath);
        }
      } else if (error.status === 403) {
        if (options?.onForbidden) {
          options.onForbidden(error, ctx);
        } else {
          ctx.navigate(forbiddenPath);
        }
      }
      return undefined; // Let error propagate
    },
  };
}

// =============================================================================
// TENANT INTERCEPTOR
// =============================================================================

/**
 * Creates an interceptor that adds tenant header for multi-tenant apps.
 * @example
 * ```typescript
 * executor.addInterceptor(createTenantInterceptor({
 *   getTenantId: (ctx) => ctx.user.get("tenantId")
 * }));
 * ```
 */
export function createTenantInterceptor(options: {
  /** Function to get tenant ID */
  getTenantId: (ctx: AppContext) => string | null;
  /** Header name (default: "X-Tenant-ID") */
  headerName?: string;
}): Interceptor {
  const headerName = options.headerName ?? "X-Tenant-ID";

  return {
    name: "tenant",
    priority: 15, // After auth
    request: (config, ctx) => {
      const tenantId = options.getTenantId(ctx);
      if (tenantId) {
        config.headers[headerName] = tenantId;
      }
      return config;
    },
  };
}

// =============================================================================
// CORRELATION ID INTERCEPTOR
// =============================================================================

/**
 * Creates an interceptor that adds correlation ID for request tracing.
 * @example
 * ```typescript
 * executor.addInterceptor(createCorrelationInterceptor());
 * ```
 */
export function createCorrelationInterceptor(options?: {
  /** Header name (default: "X-Correlation-ID") */
  headerName?: string;
  /** Custom ID generator (default: crypto.randomUUID) */
  generateId?: () => string;
}): Interceptor {
  const headerName = options?.headerName ?? "X-Correlation-ID";
  const generateId = options?.generateId ?? (() => crypto.randomUUID());

  return {
    name: "correlation",
    priority: 5, // Run very early
    request: (config, ctx) => {
      config.headers[headerName] = generateId();
      return config;
    },
  };
}
