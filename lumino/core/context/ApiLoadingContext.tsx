/**
 * Lumino Framework - API Loading Context
 *
 * Tracks multiple concurrent API calls and provides loading state.
 * Supports excluding specific calls from global loading (e.g., autocomplete).
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from "react";
import type { ApiLoadingState, ApiLoadingContextValue, ApiCallOptions } from "../types/ui";

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: ApiLoadingState = {
  activeCallIds: [],
  activeCount: 0,
  globalLoadingCount: 0,
  isGlobalLoading: false,
  calls: new Map(),
};

// =============================================================================
// ACTIONS
// =============================================================================

type ApiLoadingAction =
  | { type: "START_CALL"; id: string; options?: ApiCallOptions }
  | { type: "END_CALL"; id: string }
  | { type: "RESET" };

// =============================================================================
// REDUCER
// =============================================================================

function apiLoadingReducer(state: ApiLoadingState, action: ApiLoadingAction): ApiLoadingState {
  switch (action.type) {
    case "START_CALL": {
      const { id, options } = action;
      const excludeFromLoading = options?.excludeFromLoading ?? false;

      // Create new calls Map with the new call
      const newCalls = new Map(state.calls);
      newCalls.set(id, {
        id,
        startTime: new Date(),
        message: options?.loadingMessage,
        excludeFromLoading,
      });

      const newActiveCallIds = [...state.activeCallIds, id];
      const newGlobalLoadingCount = excludeFromLoading
        ? state.globalLoadingCount
        : state.globalLoadingCount + 1;

      return {
        activeCallIds: newActiveCallIds,
        activeCount: newActiveCallIds.length,
        globalLoadingCount: newGlobalLoadingCount,
        isGlobalLoading: newGlobalLoadingCount > 0,
        calls: newCalls,
      };
    }

    case "END_CALL": {
      const { id } = action;
      const call = state.calls.get(id);

      if (!call) {
        return state;
      }

      // Remove from calls Map
      const newCalls = new Map(state.calls);
      newCalls.delete(id);

      const newActiveCallIds = state.activeCallIds.filter((callId) => callId !== id);
      const newGlobalLoadingCount = call.excludeFromLoading
        ? state.globalLoadingCount
        : Math.max(0, state.globalLoadingCount - 1);

      return {
        activeCallIds: newActiveCallIds,
        activeCount: newActiveCallIds.length,
        globalLoadingCount: newGlobalLoadingCount,
        isGlobalLoading: newGlobalLoadingCount > 0,
        calls: newCalls,
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

const ApiLoadingContext = createContext<ApiLoadingContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface ApiLoadingProviderProps {
  children: ReactNode;
}

/**
 * ApiLoadingProvider - Provides API loading state to the app
 *
 * @example
 * ```tsx
 * <ApiLoadingProvider>
 *   <App />
 * </ApiLoadingProvider>
 * ```
 */
export const ApiLoadingProvider: React.FC<ApiLoadingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(apiLoadingReducer, initialState);

  const startCall = useCallback((id: string, options?: ApiCallOptions) => {
    dispatch({ type: "START_CALL", id, options });
  }, []);

  const endCall = useCallback((id: string) => {
    dispatch({ type: "END_CALL", id });
  }, []);

  const isCallLoading = useCallback((id: string) => {
    return state.calls.has(id);
  }, [state.calls]);

  const isGlobalLoading = useCallback(() => {
    return state.isGlobalLoading;
  }, [state.isGlobalLoading]);

  const getCallMessage = useCallback((id: string) => {
    return state.calls.get(id)?.message;
  }, [state.calls]);

  const value = useMemo<ApiLoadingContextValue>(
    () => ({
      state,
      startCall,
      endCall,
      isCallLoading,
      isGlobalLoading,
      getCallMessage,
    }),
    [state, startCall, endCall, isCallLoading, isGlobalLoading, getCallMessage]
  );

  return (
    <ApiLoadingContext.Provider value={value}>
      {children}
    </ApiLoadingContext.Provider>
  );
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access API loading context
 */
export function useApiLoading(): ApiLoadingContextValue {
  const context = useContext(ApiLoadingContext);
  if (!context) {
    throw new Error("useApiLoading must be used within an ApiLoadingProvider");
  }
  return context;
}

/**
 * Hook to check if global loading should be shown
 */
export function useIsGlobalLoading(): boolean {
  const { state } = useApiLoading();
  return state.isGlobalLoading;
}

/**
 * Hook to track a specific API call
 *
 * @example
 * ```tsx
 * const { isLoading, execute } = useTrackedApiCall("fetchUsers");
 *
 * const handleFetch = async () => {
 *   await execute(async () => {
 *     const users = await api.getUsers();
 *     setUsers(users);
 *   });
 * };
 * ```
 */
export function useTrackedApiCall(callId: string, options?: ApiCallOptions) {
  const { startCall, endCall, isCallLoading, getCallMessage } = useApiLoading();

  const execute = useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
      startCall(callId, options);
      try {
        return await asyncFn();
      } finally {
        endCall(callId);
      }
    },
    [callId, options, startCall, endCall]
  );

  return {
    isLoading: isCallLoading(callId),
    message: getCallMessage(callId),
    execute,
  };
}

/**
 * Helper function to wrap API calls with loading tracking
 *
 * @example
 * ```tsx
 * const { startCall, endCall } = useApiLoading();
 *
 * const fetchData = async () => {
 *   const result = await trackApiCall(
 *     "fetchUsers",
 *     () => api.getUsers(),
 *     startCall,
 *     endCall
 *   );
 * };
 * ```
 */
export async function trackApiCall<T>(
  id: string,
  asyncFn: () => Promise<T>,
  startCall: (id: string, options?: ApiCallOptions) => void,
  endCall: (id: string) => void,
  options?: ApiCallOptions
): Promise<T> {
  startCall(id, options);
  try {
    return await asyncFn();
  } finally {
    endCall(id);
  }
}

/**
 * Higher-order function to create a tracked API function
 *
 * @example
 * ```tsx
 * const trackedFetchUsers = createTrackedApiCall(
 *   "fetchUsers",
 *   api.getUsers,
 *   { excludeFromLoading: false }
 * );
 *
 * // Later in component
 * const users = await trackedFetchUsers();
 * ```
 */
export function createTrackedApiCall<TArgs extends any[], TResult>(
  id: string,
  asyncFn: (...args: TArgs) => Promise<TResult>,
  defaultOptions?: ApiCallOptions
) {
  return (
    startCall: (id: string, options?: ApiCallOptions) => void,
    endCall: (id: string) => void,
    options?: ApiCallOptions
  ) => async (...args: TArgs): Promise<TResult> => {
    const mergedOptions = { ...defaultOptions, ...options };
    startCall(id, mergedOptions);
    try {
      return await asyncFn(...args);
    } finally {
      endCall(id);
    }
  };
}
