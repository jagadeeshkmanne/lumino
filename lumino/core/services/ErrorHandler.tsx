/**
 * Lumino Framework - Error Handler Service
 *
 * Central error handling service that:
 * - Transforms errors to LuminoError format
 * - Routes errors to appropriate display (toast, banner, page)
 * - Provides error context for components
 * - Integrates with notification system for toast/banner display
 */

import React, { createContext, useContext, useCallback, useState, useEffect, ReactNode } from "react";
import type {
  LuminoError,
  ErrorDisplayMode,
  ErrorHandlerConfig,
  ErrorStatusCode,
  ErrorSeverity,
} from "../types/ui";
import { DEFAULT_ERROR_MESSAGES } from "../types/ui";
import { NotificationManager } from "../context/NotificationContext";

// =============================================================================
// DEFAULT CONFIG
// =============================================================================

const defaultConfig: ErrorHandlerConfig = {
  defaultDisplayMode: "toast",
  statusCodeDisplayModes: {
    401: "page",
    403: "page",
    404: "page",
    500: "page",
    502: "page",
    503: "page",
  },
  showStackInDev: true,
  toast: {
    duration: 5000,
    position: "bottom-right",
  },
  banner: {
    dismissible: true,
    position: "top",
  },
};

// =============================================================================
// ERROR TRANSFORMATION
// =============================================================================

let errorCounter = 0;

/**
 * Generate unique error code
 */
function generateErrorCode(): string {
  errorCounter++;
  return `ERR_${Date.now()}_${errorCounter}`;
}

/**
 * Extract status code from error
 */
function extractStatusCode(error: any): ErrorStatusCode | undefined {
  if (typeof error?.status === "number") return error.status as ErrorStatusCode;
  if (typeof error?.statusCode === "number") return error.statusCode as ErrorStatusCode;
  if (typeof error?.response?.status === "number") return error.response.status as ErrorStatusCode;
  return undefined;
}

/**
 * Determine error severity from status code
 */
function getSeverityFromStatus(statusCode?: ErrorStatusCode): ErrorSeverity {
  if (!statusCode) return "error";
  if (statusCode >= 500) return "critical";
  if (statusCode >= 400) return "error";
  return "warning";
}

/**
 * Get display mode for error based on config
 */
function getDisplayMode(
  statusCode: ErrorStatusCode | undefined,
  config: ErrorHandlerConfig
): ErrorDisplayMode {
  if (statusCode && config.statusCodeDisplayModes?.[statusCode]) {
    return config.statusCodeDisplayModes[statusCode]!;
  }
  return config.defaultDisplayMode || "toast";
}

/**
 * Transform any error to LuminoError format
 */
export function transformError(error: any, config: ErrorHandlerConfig = defaultConfig): LuminoError {
  // Already a LuminoError
  if (error && typeof error === "object" && "code" in error && "severity" in error) {
    return error as LuminoError;
  }

  const statusCode = extractStatusCode(error);
  const defaultMessage = statusCode
    ? DEFAULT_ERROR_MESSAGES[statusCode]?.message
    : "An unexpected error occurred";

  let message = defaultMessage;
  let details: string | undefined;

  if (error instanceof Error) {
    message = error.message || defaultMessage;
    details = error.stack;
  } else if (typeof error === "string") {
    message = error;
  } else if (error?.message) {
    message = error.message;
    details = error.details || error.description;
  }

  return {
    code: generateErrorCode(),
    statusCode,
    message,
    details,
    stack: error instanceof Error ? error.stack : undefined,
    severity: getSeverityFromStatus(statusCode),
    displayMode: getDisplayMode(statusCode, config),
    originalError: error instanceof Error ? error : undefined,
    timestamp: new Date(),
    requestId: error?.requestId,
    meta: error?.meta,
  };
}

// =============================================================================
// ERROR HANDLER CONTEXT
// =============================================================================

interface ErrorHandlerContextValue {
  /** Current active errors */
  errors: LuminoError[];
  /** Most recent error */
  lastError: LuminoError | null;
  /** Error displayed as page (401, 403, 404, 500) */
  pageError: LuminoError | null;
  /** Handler configuration */
  config: ErrorHandlerConfig;

  /** Handle an error */
  handleError: (error: any) => LuminoError;
  /** Clear all errors */
  clearErrors: () => void;
  /** Clear specific error */
  clearError: (code: string) => void;
  /** Clear page error */
  clearPageError: () => void;
  /** Dismiss a toast/banner error */
  dismissError: (code: string) => void;
}

const ErrorHandlerContext = createContext<ErrorHandlerContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface ErrorHandlerProviderProps {
  children: ReactNode;
  config?: Partial<ErrorHandlerConfig>;
  /** Custom renderer for toast errors */
  toastRenderer?: (error: LuminoError, dismiss: () => void) => ReactNode;
  /** Custom renderer for banner errors */
  bannerRenderer?: (error: LuminoError, dismiss: () => void) => ReactNode;
}

/**
 * ErrorHandlerProvider - Provides error handling to the app
 *
 * @example
 * ```tsx
 * <ErrorHandlerProvider config={{ defaultDisplayMode: "toast" }}>
 *   <App />
 * </ErrorHandlerProvider>
 * ```
 */
export const ErrorHandlerProvider: React.FC<ErrorHandlerProviderProps> = ({
  children,
  config: userConfig,
  toastRenderer,
  bannerRenderer,
}) => {
  const [errors, setErrors] = useState<LuminoError[]>([]);
  const [pageError, setPageError] = useState<LuminoError | null>(null);

  const config = { ...defaultConfig, ...userConfig };

  const handleError = useCallback(
    (error: any): LuminoError => {
      // Transform to LuminoError
      const luminoError = config.transformError
        ? config.transformError(error)
        : transformError(error, config);

      // Call onError callback
      config.onError?.(luminoError);

      // Route based on display mode
      switch (luminoError.displayMode) {
        case "page":
          setPageError(luminoError);
          break;
        case "silent":
          // Just log, don't display
          console.error("[Lumino Error]", luminoError);
          break;
        case "toast":
          // Show error via NotificationManager
          NotificationManager.error({
            title: luminoError.statusCode ? `Error ${luminoError.statusCode}` : "Error",
            message: luminoError.message,
            duration: config.toast?.duration || 5000,
          });
          setErrors((prev) => [...prev, luminoError]);
          break;
        case "banner":
        case "inline":
        default:
          setErrors((prev) => [...prev, luminoError]);
          break;
      }

      return luminoError;
    },
    [config]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
    setPageError(null);
  }, []);

  const clearError = useCallback((code: string) => {
    setErrors((prev) => prev.filter((e) => e.code !== code));
  }, []);

  const clearPageError = useCallback(() => {
    setPageError(null);
  }, []);

  const dismissError = useCallback((code: string) => {
    clearError(code);
  }, [clearError]);

  const lastError = errors.length > 0 ? errors[errors.length - 1] : null;

  const value: ErrorHandlerContextValue = {
    errors,
    lastError,
    pageError,
    config,
    handleError,
    clearErrors,
    clearError,
    clearPageError,
    dismissError,
  };

  return (
    <ErrorHandlerContext.Provider value={value}>
      {children}
    </ErrorHandlerContext.Provider>
  );
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access error handler context
 */
export function useErrorHandler(): ErrorHandlerContextValue {
  const context = useContext(ErrorHandlerContext);
  if (!context) {
    throw new Error("useErrorHandler must be used within an ErrorHandlerProvider");
  }
  return context;
}

/**
 * Hook to handle errors in async operations
 *
 * @example
 * ```tsx
 * const { handleAsync } = useAsyncErrorHandler();
 *
 * const fetchData = async () => {
 *   await handleAsync(async () => {
 *     const data = await api.getData();
 *     setData(data);
 *   });
 * };
 * ```
 */
export function useAsyncErrorHandler() {
  const { handleError } = useErrorHandler();

  const handleAsync = useCallback(
    async <T,>(asyncFn: () => Promise<T>, options?: { silent?: boolean }): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        if (!options?.silent) {
          handleError(error);
        }
        return null;
      }
    },
    [handleError]
  );

  return { handleAsync };
}

/**
 * Hook to get page error state
 */
export function usePageError() {
  const { pageError, clearPageError } = useErrorHandler();
  return { pageError, clearPageError };
}

/**
 * Hook to get toast/banner errors
 */
export function useDisplayErrors() {
  const { errors, dismissError } = useErrorHandler();

  const toastErrors = errors.filter((e) => e.displayMode === "toast");
  const bannerErrors = errors.filter((e) => e.displayMode === "banner");
  const inlineErrors = errors.filter((e) => e.displayMode === "inline");

  return { toastErrors, bannerErrors, inlineErrors, dismissError };
}
