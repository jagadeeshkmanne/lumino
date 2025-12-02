/**
 * Lumino Framework - useLumino Hook
 *
 * Main hook for accessing Lumino framework features.
 * Provides a clean API for common operations.
 */

import { useCallback, useMemo } from "react";
import { useAppContext, useApp, useLuminoContext } from "../context/LuminoProvider";
import { useLoading, useLocale, useTheme, useUser } from "./useStore";
import { eventEmitter, eventBus } from "../../core/events/EventEmitter";
import { stateManager } from "../../core/state/StateManager";
import type { NotifyType } from "../../core/types/base";
import type { EventCallback, AllEvents } from "../../core/events/EventEmitter";

// =============================================================================
// TYPES
// =============================================================================

export interface UseLuminoReturn {
  // App
  app: ReturnType<typeof useApp>;
  initialized: boolean;

  // Context
  context: ReturnType<typeof useAppContext>;

  // Loading
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;

  // Locale
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, any>) => string;

  // Theme
  theme: string;
  setTheme: (theme: string) => void;

  // User
  user: any | null;
  isAuthenticated: boolean;

  // Navigation
  navigate: (path: string) => void;
  redirect: (path: string) => void;
  back: () => void;
  getCurrentRoute: () => string;

  // Notifications
  notify: (message: string, type?: NotifyType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;

  // Dialogs
  confirm: (message: string) => Promise<boolean>;
  alert: (message: string) => Promise<void>;

  // Events
  on: <K extends keyof AllEvents>(event: K, callback: EventCallback<AllEvents[K]>) => () => void;
  off: <K extends keyof AllEvents>(event: K, callback?: EventCallback<AllEvents[K]>) => void;
  emit: <K extends keyof AllEvents>(event: K, payload: AllEvents[K]) => void;
  eventBus: typeof eventBus;

  // Storage
  storage: {
    local: {
      get: <T>(key: string) => T | null;
      set: (key: string, value: any) => void;
      remove: (key: string) => void;
    };
    session: {
      get: <T>(key: string) => T | null;
      set: (key: string, value: any) => void;
      remove: (key: string) => void;
    };
  };

  // Config
  config: {
    get: <T>(key: string) => T;
    baseUrl: string;
    environment: string;
    isFeatureEnabled: (feature: string) => boolean;
  };

  // Meta
  getMeta: <T>(key: string) => T | undefined;
  setMeta: (key: string, value: any) => void;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Main hook for accessing Lumino framework
 *
 * @example
 * ```typescript
 * const {
 *   // Loading
 *   loading,
 *   showLoader,
 *   hideLoader,
 *
 *   // Navigation
 *   navigate,
 *   back,
 *
 *   // Notifications
 *   notify,
 *   success,
 *   error,
 *
 *   // Locale
 *   locale,
 *   setLocale,
 *   t,
 *
 *   // Theme
 *   theme,
 *   setTheme,
 *
 *   // User
 *   user,
 *   isAuthenticated,
 *
 *   // Events
 *   on,
 *   emit,
 *
 *   // Storage
 *   storage,
 *
 *   // Config
 *   config,
 * } = useLumino();
 *
 * // Show success notification
 * success("User saved!");
 *
 * // Navigate
 * navigate("/users");
 *
 * // Change locale
 * setLocale("es");
 *
 * // Listen to events
 * useEffect(() => {
 *   return on("form:submit", ({ formId, action }) => {
 *     console.log(`Form ${formId} submitted action ${action}`);
 *   });
 * }, [on]);
 *
 * // Emit custom event
 * emit("user:selected", { userId: 123 });
 * ```
 */
export function useLumino(): UseLuminoReturn {
  const app = useApp();
  const context = useAppContext();
  const { initialized } = useLuminoContext();

  const loading = useLoading();
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const [user] = useUser();

  // Notifications
  const notify = useCallback(
    (message: string, type: NotifyType = "info") => {
      context.notify(message, type);
    },
    [context]
  );

  const success = useCallback(
    (message: string) => {
      context.notify(message, "success");
    },
    [context]
  );

  const error = useCallback(
    (message: string) => {
      context.notify(message, "error");
    },
    [context]
  );

  const warning = useCallback(
    (message: string) => {
      context.notify(message, "warning");
    },
    [context]
  );

  const info = useCallback(
    (message: string) => {
      context.notify(message, "info");
    },
    [context]
  );

  // Events
  const on = useCallback(
    <K extends keyof AllEvents>(event: K, callback: EventCallback<AllEvents[K]>) => {
      return eventEmitter.on(event, callback);
    },
    []
  );

  const off = useCallback(
    <K extends keyof AllEvents>(event: K, callback?: EventCallback<AllEvents[K]>) => {
      eventEmitter.off(event, callback);
    },
    []
  );

  const emit = useCallback(
    <K extends keyof AllEvents>(event: K, payload: AllEvents[K]) => {
      eventEmitter.emit(event, payload);
    },
    []
  );

  // Config
  const config = useMemo(
    () => ({
      get: <T,>(key: string): T => context.config.get<T>(key),
      baseUrl: context.config.baseUrl,
      environment: context.config.environment,
      isFeatureEnabled: (feature: string) => context.config.features.isEnabled(feature),
    }),
    [context.config]
  );

  // Storage
  const storage = useMemo(
    () => ({
      local: {
        get: <T,>(key: string): T | null => context.storage.local.get<T>(key),
        set: (key: string, value: any) => context.storage.local.set(key, value),
        remove: (key: string) => context.storage.local.remove(key),
      },
      session: {
        get: <T,>(key: string): T | null => context.storage.session.get<T>(key),
        set: (key: string, value: any) => context.storage.session.set(key, value),
        remove: (key: string) => context.storage.session.remove(key),
      },
    }),
    [context.storage]
  );

  // Meta
  const getMeta = useCallback(
    <T,>(key: string): T | undefined => {
      return stateManager.getMeta<T>(key);
    },
    []
  );

  const setMeta = useCallback((key: string, value: any) => {
    stateManager.setMeta(key, value);
  }, []);

  return {
    // App
    app,
    initialized,

    // Context
    context,

    // Loading
    loading,
    showLoader: context.showLoader,
    hideLoader: context.hideLoader,

    // Locale
    locale,
    setLocale,
    t: context.i18n.t,

    // Theme
    theme,
    setTheme,

    // User
    user,
    isAuthenticated: context.isAuthenticated(),

    // Navigation
    navigate: context.navigate,
    redirect: context.redirect,
    back: context.back,
    getCurrentRoute: context.getCurrentRoute,

    // Notifications
    notify,
    success,
    error,
    warning,
    info,

    // Dialogs
    confirm: context.confirm,
    alert: context.alert,

    // Events
    on,
    off,
    emit,
    eventBus,

    // Storage
    storage,

    // Config
    config,

    // Meta
    getMeta,
    setMeta,
  };
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Hook for navigation
 */
export function useNavigation() {
  const context = useAppContext();

  return {
    navigate: context.navigate,
    redirect: context.redirect,
    back: context.back,
    getCurrentRoute: context.getCurrentRoute,
    routeParams: context.routeParams,
    queryParams: context.queryParams,
  };
}

/**
 * Hook for notifications
 */
export function useNotify() {
  const context = useAppContext();

  return {
    notify: context.notify,
    success: (message: string) => context.notify(message, "success"),
    error: (message: string) => context.notify(message, "error"),
    warning: (message: string) => context.notify(message, "warning"),
    info: (message: string) => context.notify(message, "info"),
  };
}

/**
 * Hook for i18n
 */
export function useI18n() {
  const context = useAppContext();
  const [locale, setLocale] = useLocale();

  return {
    t: context.i18n.t,
    locale,
    setLocale,
  };
}

/**
 * Hook for events
 */
export function useEvents() {
  const on = useCallback(
    <K extends keyof AllEvents>(event: K, callback: EventCallback<AllEvents[K]>) => {
      return eventEmitter.on(event, callback);
    },
    []
  );

  const once = useCallback(
    <K extends keyof AllEvents>(event: K, callback: EventCallback<AllEvents[K]>) => {
      return eventEmitter.once(event, callback);
    },
    []
  );

  const off = useCallback(
    <K extends keyof AllEvents>(event: K, callback?: EventCallback<AllEvents[K]>) => {
      eventEmitter.off(event, callback);
    },
    []
  );

  const emit = useCallback(
    <K extends keyof AllEvents>(event: K, payload: AllEvents[K]) => {
      eventEmitter.emit(event, payload);
    },
    []
  );

  return {
    on,
    once,
    off,
    emit,
    eventBus,
  };
}
