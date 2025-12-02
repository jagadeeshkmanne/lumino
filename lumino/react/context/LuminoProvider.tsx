/**
 * Lumino Framework - React Provider
 *
 * Main React context provider for Lumino framework.
 * Provides access to app context, state, and events throughout the app.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type {
  AppContext,
  PageContext,
  FormContext,
  UserContext,
  ConfigContext,
  I18nContext,
  StorageContext,
} from "../../core/types/context";
import type { NotifyType, CallOptions, RouteParams, QueryParams } from "../../core/types/base";
import type { BuiltApi } from "../../core/types/api";
import type { LuminoApp, LuminoConfig } from "../../core/app/LuminoApp";
import { createApp, getApp } from "../../core/app/LuminoApp";
import { stateManager } from "../../core/state/StateManager";
import { eventEmitter, eventBus } from "../../core/events/EventEmitter";
import { ApiRegistry } from "../../core/registry/ApiRegistry";
import { cacheManager } from "../../core/api/CacheManager";
import { executeHttpRequest, createRequestConfig } from "../../core/api/ApiExecutor";

// =============================================================================
// CONTEXT TYPES
// =============================================================================

export interface LuminoContextValue {
  app: LuminoApp;
  appContext: AppContext;
  loading: boolean;
  locale: string;
  theme: string;
  user: any | null;
  initialized: boolean;
}

export interface NavigationAdapter {
  navigate(path: string): void;
  redirect(path: string): void;
  back(): void;
  getCurrentRoute(): string;
  getRouteParams(): RouteParams;
  getQueryParams(): QueryParams;
}

export interface UIAdapter {
  showLoader(): void;
  hideLoader(): void;
  notify(message: string, type?: NotifyType): void;
  confirm(message: string): Promise<boolean>;
  alert(message: string): Promise<void>;
  openModal<TResult>(modal: any): Promise<TResult>;
  closeModal(): void;
}

export interface LuminoProviderProps {
  /** The Lumino app instance (from createApp) */
  app: LuminoApp;
  children: ReactNode;
  /** Custom navigation adapter (optional - uses built-in by default) */
  navigationAdapter?: NavigationAdapter;
  /** Custom UI adapter (optional - uses built-in by default) */
  uiAdapter?: UIAdapter;
}

// =============================================================================
// USER CONTEXT HELPER
// =============================================================================

/**
 * Creates a UserContext with helper methods from a plain user object
 */
function createUserContext(userData: any): UserContext | null {
  if (!userData) return null;

  const roles = userData.roles || [];
  const permissions = userData.permissions || [];

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    roles,
    permissions,

    hasRole(role: string): boolean {
      return roles.includes(role);
    },
    hasPermission(permission: string): boolean {
      return permissions.includes(permission);
    },
    hasAnyRole(...checkRoles: string[]): boolean {
      return checkRoles.some((role) => roles.includes(role));
    },
    hasAllRoles(...checkRoles: string[]): boolean {
      return checkRoles.every((role) => roles.includes(role));
    },
    hasAnyPermission(...checkPermissions: string[]): boolean {
      return checkPermissions.some((perm) => permissions.includes(perm));
    },
    hasAllPermissions(...checkPermissions: string[]): boolean {
      return checkPermissions.every((perm) => permissions.includes(perm));
    },
    get<T>(key: string): T {
      return userData[key] as T;
    },
  };
}

// =============================================================================
// DEFAULT ADAPTERS
// =============================================================================

const defaultNavigationAdapter: NavigationAdapter = {
  navigate: (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  },
  redirect: (path: string) => {
    window.location.href = path;
  },
  back: () => {
    window.history.back();
  },
  getCurrentRoute: () => {
    return window.location.pathname;
  },
  getRouteParams: () => {
    return {};
  },
  getQueryParams: () => {
    const params: QueryParams = {};
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },
};

const defaultUIAdapter: UIAdapter = {
  showLoader: () => {
    eventEmitter.emit("ui:loader:show", {});
  },
  hideLoader: () => {
    eventEmitter.emit("ui:loader:hide", {});
  },
  notify: (message: string, type: NotifyType = "info") => {
    eventEmitter.emit("ui:notify", { message, type });
    console.log(`[${type.toUpperCase()}] ${message}`);
  },
  confirm: async (message: string): Promise<boolean> => {
    return window.confirm(message);
  },
  alert: async (message: string): Promise<void> => {
    window.alert(message);
  },
  openModal: async <TResult,>(_modal: any): Promise<TResult> => {
    throw new Error("Modal not implemented. Provide a custom uiAdapter.");
  },
  closeModal: () => {
    // Default implementation
  },
};

// =============================================================================
// CONTEXT
// =============================================================================

const LuminoContext = createContext<LuminoContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export function LuminoProvider({
  app,
  children,
  navigationAdapter = defaultNavigationAdapter,
  uiAdapter = defaultUIAdapter,
}: LuminoProviderProps) {
  const [initialized, setInitialized] = useState(app.initialized);
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState(app.config.defaultLocale || "en");
  const [theme, setTheme] = useState(app.config.defaultTheme || "light");
  const [user, setUser] = useState<any | null>(null);

  // Create app context
  const appContext = useMemo<AppContext>(() => {
    return {
      // User & Auth
      user: createUserContext(stateManager.getUser()) as UserContext,
      setUser: (newUser: UserContext | null) => {
        // Wrap with helper methods if needed
        const userContext = createUserContext(newUser);
        stateManager.setUser(userContext);
      },
      isAuthenticated: () => !!stateManager.getUser(),
      getAuthToken: () => {
        return app.storage.local.get<string>(app.config.authTokenKey || "auth_token");
      },

      // API
      api: ApiRegistry.getAll(),
      call: async <T,>(api: BuiltApi<T, any>, options?: CallOptions): Promise<T> => {
        const apiConfig = api.config;
        const requestConfig = createRequestConfig(apiConfig, app.baseUrl, options);

        // Check cache
        if (apiConfig.cache?.enabled && apiConfig.method === "GET") {
          const cacheKey = `${requestConfig.url}`;
          const cached = cacheManager.get<T>(cacheKey);
          if (cached) {
            eventEmitter.emit("api:cache:hit", { apiId: apiConfig.id || "", key: cacheKey });
            return cached;
          }
          eventEmitter.emit("api:cache:miss", { apiId: apiConfig.id || "", key: cacheKey });
        }

        const startTime = Date.now();
        eventEmitter.emit("api:request:start", {
          apiId: apiConfig.id || "",
          url: requestConfig.url,
          method: requestConfig.method,
        });

        try {
          const response = await executeHttpRequest<T>(requestConfig);
          const duration = Date.now() - startTime;

          eventEmitter.emit("api:request:success", {
            apiId: apiConfig.id || "",
            url: requestConfig.url,
            response: response.data,
            duration,
          });

          // Cache response
          if (apiConfig.cache?.enabled && apiConfig.method === "GET") {
            cacheManager.set(`${requestConfig.url}`, response.data, apiConfig.cache.duration);
          }

          return response.data;
        } catch (error) {
          const duration = Date.now() - startTime;
          eventEmitter.emit("api:request:error", {
            apiId: apiConfig.id || "",
            url: requestConfig.url,
            error,
            duration,
          });
          throw error;
        }
      },
      getData: <T,>(_api: BuiltApi<T, any>): T | null => {
        // Implementation depends on caching strategy
        return null;
      },
      isLoading: (_api: BuiltApi<any, any>): boolean => {
        return false;
      },
      getError: (_api: BuiltApi<any, any>) => {
        return null;
      },
      clearCache: (api?: BuiltApi<any, any>) => {
        if (api) {
          cacheManager.clear();
        } else {
          cacheManager.clear();
        }
      },

      // Navigation
      routeParams: navigationAdapter.getRouteParams(),
      queryParams: navigationAdapter.getQueryParams(),
      navigate: navigationAdapter.navigate,
      redirect: navigationAdapter.redirect,
      back: navigationAdapter.back,
      getCurrentRoute: navigationAdapter.getCurrentRoute,

      // UI State
      showLoader: () => {
        stateManager.setGlobalLoading(true);
        uiAdapter.showLoader();
      },
      hideLoader: () => {
        stateManager.setGlobalLoading(false);
        uiAdapter.hideLoader();
      },
      notify: uiAdapter.notify,
      confirm: uiAdapter.confirm,
      alert: uiAdapter.alert,
      openModal: uiAdapter.openModal,
      closeModal: uiAdapter.closeModal,

      // Config
      config: app.getConfigContext(),

      // I18n
      i18n: app.getI18nContext(),

      // Storage
      storage: app.getStorageContext(),

      // Meta
      setMeta: (key: string, value: any) => stateManager.setMeta(key, value),
      getMeta: <T,>(key: string): T => stateManager.getMeta<T>(key) as T,
    };
  }, [app, navigationAdapter, uiAdapter, user]);

  // Initialize app if not already initialized
  useEffect(() => {
    if (!app.initialized) {
      app.init()
        .then(() => setInitialized(true))
        .catch((error) => console.error("Failed to initialize Lumino app:", error));
    }
  }, [app]);

  // Subscribe to state changes
  useEffect(() => {
    const unsubLoading = stateManager.onLoadingChange((loadingState) => {
      setLoading(loadingState.global);
    });

    const unsubState = stateManager.subscribe((state) => {
      setLocale(state.locale);
      setTheme(state.theme);
      setUser(state.user);
    });

    return () => {
      unsubLoading();
      unsubState();
    };
  }, []);

  const contextValue: LuminoContextValue = {
    app,
    appContext,
    loading,
    locale,
    theme,
    user,
    initialized,
  };

  return (
    <LuminoContext.Provider value={contextValue}>
      {children}
    </LuminoContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Get Lumino context
 */
export function useLuminoContext(): LuminoContextValue {
  const context = useContext(LuminoContext);
  if (!context) {
    throw new Error("useLuminoContext must be used within a LuminoProvider");
  }
  return context;
}

/**
 * Get app instance
 */
export function useApp(): LuminoApp {
  const { app } = useLuminoContext();
  return app;
}

/**
 * Get app context
 */
export function useAppContext(): AppContext {
  const { appContext } = useLuminoContext();
  return appContext;
}
