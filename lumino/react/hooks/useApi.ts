/**
 * Lumino Framework - useApi Hook
 *
 * React hook for making API calls with automatic loading/error state management.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { BuiltApi } from "../../core/types/api";
import type { CallOptions, ErrorResponse } from "../../core/types/base";
import { useAppContext } from "../context/LuminoProvider";
import { eventEmitter } from "../../core/events/EventEmitter";

// =============================================================================
// TYPES
// =============================================================================

export interface UseApiOptions<TResponse = any> {
  /** Execute immediately on mount */
  immediate?: boolean;
  /** Initial data */
  initialData?: TResponse;
  /** Called on success */
  onSuccess?: (data: TResponse) => void;
  /** Called on error */
  onError?: (error: ErrorResponse) => void;
  /** Show global loader */
  showLoader?: boolean;
  /** Refetch interval in ms */
  refetchInterval?: number;
  /** Skip cache */
  skipCache?: boolean;
}

export interface UseApiReturn<TResponse = any, TBody = any> {
  /** Response data */
  data: TResponse | null;
  /** Loading state */
  loading: boolean;
  /** Error response */
  error: ErrorResponse | null;
  /** Execute the API call */
  execute: (options?: CallOptions) => Promise<TResponse | null>;
  /** Reset state */
  reset: () => void;
  /** Refetch with last options */
  refetch: () => Promise<TResponse | null>;
  /** Check if has been called */
  called: boolean;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for making API calls
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { data, loading, execute } = useApi(UsersApi.list);
 *
 * // With immediate execution
 * const { data, loading } = useApi(UsersApi.list, { immediate: true });
 *
 * // With options
 * const { execute } = useApi(UsersApi.get);
 * await execute({ path: { id: 123 } });
 *
 * // With callbacks
 * const { execute } = useApi(UsersApi.create, {
 *   onSuccess: (user) => navigate(`/users/${user.id}`),
 *   onError: (error) => notify(error.message, "error"),
 * });
 * ```
 */
export function useApi<TResponse = any, TBody = any>(
  api: BuiltApi<TResponse, TBody>,
  options: UseApiOptions<TResponse> = {}
): UseApiReturn<TResponse, TBody> {
  const appContext = useAppContext();

  const {
    immediate = false,
    initialData = null,
    onSuccess,
    onError,
    showLoader = false,
    refetchInterval,
    skipCache = false,
  } = options;

  // State
  const [data, setData] = useState<TResponse | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [called, setCalled] = useState(false);

  // Refs
  const lastOptionsRef = useRef<CallOptions | undefined>();
  const mountedRef = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Execute API call
  const execute = useCallback(
    async (callOptions?: CallOptions): Promise<TResponse | null> => {
      lastOptionsRef.current = callOptions;
      setCalled(true);
      setLoading(true);
      setError(null);

      if (showLoader) {
        appContext.showLoader();
      }

      try {
        const response = await appContext.call<TResponse>(api, {
          ...callOptions,
          skipCache,
        });

        if (mountedRef.current) {
          setData(response);
          setLoading(false);

          if (onSuccess) {
            onSuccess(response);
          }
        }

        return response;
      } catch (err) {
        const errorResponse = err as ErrorResponse;

        if (mountedRef.current) {
          setError(errorResponse);
          setLoading(false);

          if (onError) {
            onError(errorResponse);
          }
        }

        return null;
      } finally {
        if (showLoader) {
          appContext.hideLoader();
        }
      }
    },
    [api, appContext, showLoader, skipCache, onSuccess, onError]
  );

  // Refetch with last options
  const refetch = useCallback(async (): Promise<TResponse | null> => {
    return execute(lastOptionsRef.current);
  }, [execute]);

  // Reset state
  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setCalled(false);
    lastOptionsRef.current = undefined;
  }, [initialData]);

  // Immediate execution
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        refetch();
      }, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, refetch]);

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    refetch,
    called,
  };
}

// =============================================================================
// LAZY API HOOK
// =============================================================================

/**
 * Lazy API hook - only executes when called
 */
export function useLazyApi<TResponse = any, TBody = any>(
  api: BuiltApi<TResponse, TBody>,
  options: Omit<UseApiOptions<TResponse>, "immediate"> = {}
): UseApiReturn<TResponse, TBody> {
  return useApi(api, { ...options, immediate: false });
}

// =============================================================================
// MUTATION HOOK
// =============================================================================

export interface UseMutationOptions<TResponse = any, TVariables = any> {
  onSuccess?: (data: TResponse, variables: TVariables) => void;
  onError?: (error: ErrorResponse, variables: TVariables) => void;
  onSettled?: (data: TResponse | null, error: ErrorResponse | null, variables: TVariables) => void;
  showLoader?: boolean;
}

export interface UseMutationReturn<TResponse = any, TVariables = any> {
  data: TResponse | null;
  loading: boolean;
  error: ErrorResponse | null;
  mutate: (variables: TVariables, callOptions?: CallOptions) => Promise<TResponse | null>;
  reset: () => void;
}

/**
 * Hook for mutations (create, update, delete)
 *
 * @example
 * ```typescript
 * const { mutate, loading } = useMutation<User, CreateUserInput>(UsersApi.create, {
 *   onSuccess: (user) => navigate(`/users/${user.id}`),
 * });
 *
 * await mutate({ name: "John", email: "john@example.com" });
 * ```
 */
export function useMutation<TResponse = any, TVariables = any>(
  api: BuiltApi<TResponse, TVariables>,
  options: UseMutationOptions<TResponse, TVariables> = {}
): UseMutationReturn<TResponse, TVariables> {
  const appContext = useAppContext();

  const { onSuccess, onError, onSettled, showLoader = true } = options;

  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const mountedRef = useRef(true);

  const mutate = useCallback(
    async (variables: TVariables, callOptions?: CallOptions): Promise<TResponse | null> => {
      setLoading(true);
      setError(null);

      if (showLoader) {
        appContext.showLoader();
      }

      try {
        const response = await appContext.call<TResponse>(api, {
          ...callOptions,
          body: variables,
        });

        if (mountedRef.current) {
          setData(response);
          setLoading(false);

          if (onSuccess) {
            onSuccess(response, variables);
          }

          if (onSettled) {
            onSettled(response, null, variables);
          }
        }

        return response;
      } catch (err) {
        const errorResponse = err as ErrorResponse;

        if (mountedRef.current) {
          setError(errorResponse);
          setLoading(false);

          if (onError) {
            onError(errorResponse, variables);
          }

          if (onSettled) {
            onSettled(null, errorResponse, variables);
          }
        }

        return null;
      } finally {
        if (showLoader) {
          appContext.hideLoader();
        }
      }
    },
    [api, appContext, showLoader, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

// =============================================================================
// QUERIES HOOK (Multiple APIs)
// =============================================================================

export interface UseQueriesResult<T extends readonly any[]> {
  data: { [K in keyof T]: T[K] | null };
  loading: boolean;
  errors: (ErrorResponse | null)[];
  refetchAll: () => Promise<void>;
}

/**
 * Hook for executing multiple API calls in parallel
 *
 * @example
 * ```typescript
 * const { data, loading } = useQueries([
 *   { api: UsersApi.get, options: { path: { id: 1 } } },
 *   { api: OrdersApi.list },
 * ]);
 *
 * const [user, orders] = data;
 * ```
 */
export function useQueries<T extends readonly BuiltApi<any, any>[]>(
  queries: { api: T[number]; options?: CallOptions }[]
): UseQueriesResult<{ [K in keyof T]: ReturnType<T[K]["config"]["responseType"]> }> {
  const appContext = useAppContext();

  const [data, setData] = useState<any[]>(queries.map(() => null));
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<(ErrorResponse | null)[]>(queries.map(() => null));

  const executeAll = useCallback(async () => {
    setLoading(true);

    const results = await Promise.allSettled(
      queries.map(({ api, options }) => appContext.call(api, options))
    );

    const newData: any[] = [];
    const newErrors: (ErrorResponse | null)[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        newData.push(result.value);
        newErrors.push(null);
      } else {
        newData.push(null);
        newErrors.push(result.reason as ErrorResponse);
      }
    });

    setData(newData);
    setErrors(newErrors);
    setLoading(false);
  }, [queries, appContext]);

  useEffect(() => {
    executeAll();
  }, []);

  return {
    data: data as any,
    loading,
    errors,
    refetchAll: executeAll,
  };
}
