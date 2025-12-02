/**
 * Lumino Framework - App Context Implementation
 *
 * Base context available throughout the application.
 */

import type {
  AppContext,
  UserContext,
  ConfigContext,
  I18nContext,
  StorageContext,
  Modal,
  RouteParams,
  QueryParams,
  NotifyType,
  ErrorResponse,
  CallOptions,
} from "../types";
import type { BuiltApi } from "../types/api";
import { UserContextImpl, createAnonymousUserContext } from "./UserContext";
import { ApiExecutor } from "../api/ApiExecutor";
import { ApiRegistry } from "../registry/ApiRegistry";
import { RouteRegistry } from "../registry/RouteRegistry";

// =============================================================================
// CONFIG CONTEXT IMPLEMENTATION
// =============================================================================

class ConfigContextImpl implements ConfigContext {
  private _config: Record<string, any>;
  private _baseUrl: string;
  private _environment: "development" | "staging" | "production";
  private _features: Set<string>;

  constructor(config: Record<string, any> = {}) {
    this._config = config;
    this._baseUrl = config.baseUrl || "";
    this._environment = config.environment || "development";
    this._features = new Set(config.features || []);
  }

  get<T>(key: string): T {
    return this._config[key] as T;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  get environment(): "development" | "staging" | "production" {
    return this._environment;
  }

  get features(): { isEnabled(feature: string): boolean } {
    return {
      isEnabled: (feature: string) => this._features.has(feature),
    };
  }
}

// =============================================================================
// I18N CONTEXT IMPLEMENTATION
// =============================================================================

class I18nContextImpl implements I18nContext {
  private _locale: string;
  private _translations: Record<string, Record<string, string>>;

  constructor(locale: string = "en", translations: Record<string, Record<string, string>> = {}) {
    this._locale = locale;
    this._translations = translations;
  }

  t(key: string, params?: Record<string, any>): string {
    const localeTranslations = this._translations[this._locale] || {};
    let text = localeTranslations[key] || key;

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(value));
      });
    }

    return text;
  }

  get locale(): string {
    return this._locale;
  }

  setLocale(locale: string): void {
    this._locale = locale;
  }

  addTranslations(locale: string, translations: Record<string, string>): void {
    this._translations[locale] = {
      ...this._translations[locale],
      ...translations,
    };
  }
}

// =============================================================================
// STORAGE CONTEXT IMPLEMENTATION
// =============================================================================

class StorageContextImpl implements StorageContext {
  private _prefix: string;

  constructor(prefix: string = "lumino_") {
    this._prefix = prefix;
  }

  get local() {
    return this._createStorageWrapper(localStorage);
  }

  get session() {
    return this._createStorageWrapper(sessionStorage);
  }

  private _createStorageWrapper(storage: Storage) {
    const prefix = this._prefix;

    return {
      get<T>(key: string): T | null {
        try {
          const item = storage.getItem(prefix + key);
          return item ? JSON.parse(item) : null;
        } catch {
          return null;
        }
      },

      set(key: string, value: any): void {
        try {
          storage.setItem(prefix + key, JSON.stringify(value));
        } catch (error) {
          console.warn("Lumino: Failed to save to storage", error);
        }
      },

      remove(key: string): void {
        storage.removeItem(prefix + key);
      },

      clear(): void {
        const keysToRemove: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => storage.removeItem(k));
      },
    };
  }
}

// =============================================================================
// APP CONTEXT IMPLEMENTATION
// =============================================================================

/**
 * App Context provides access to all application-level services.
 */
export class AppContextImpl implements AppContext {
  protected _userContext: UserContextImpl;
  protected _configContext: ConfigContextImpl;
  protected _i18nContext: I18nContextImpl;
  protected _storageContext: StorageContextImpl;
  protected _apiExecutor: ApiExecutor;
  protected _apiRegistry: ApiRegistry;
  protected _routeRegistry: RouteRegistry;
  protected _routeParams: RouteParams = {};
  protected _queryParams: QueryParams = {};
  protected _meta: Record<string, any> = {};
  protected _authToken: string | null = null;

  // Loading state tracking
  protected _loadingApis: Set<string> = new Set();
  protected _apiData: Map<string, any> = new Map();
  protected _apiErrors: Map<string, ErrorResponse> = new Map();

  // UI handlers (set by framework)
  protected _onNavigate: ((path: string, replace?: boolean) => void) | null = null;
  protected _onNotify: ((message: string, type: NotifyType) => void) | null = null;
  protected _onShowLoader: (() => void) | null = null;
  protected _onHideLoader: (() => void) | null = null;
  protected _onConfirm: ((message: string) => Promise<boolean>) | null = null;
  protected _onAlert: ((message: string) => Promise<void>) | null = null;
  protected _onOpenModal: ((modal: Modal) => Promise<any>) | null = null;
  protected _onCloseModal: (() => void) | null = null;

  constructor(options: {
    apiExecutor: ApiExecutor;
    apiRegistry: ApiRegistry;
    routeRegistry: RouteRegistry;
    config?: Record<string, any>;
    translations?: Record<string, Record<string, string>>;
    locale?: string;
  }) {
    this._userContext = createAnonymousUserContext();
    this._configContext = new ConfigContextImpl(options.config);
    this._i18nContext = new I18nContextImpl(options.locale, options.translations);
    this._storageContext = new StorageContextImpl();
    this._apiExecutor = options.apiExecutor;
    this._apiRegistry = options.apiRegistry;
    this._routeRegistry = options.routeRegistry;
  }

  // ===========================================================================
  // USER & AUTH
  // ===========================================================================

  get user(): UserContext {
    return this._userContext;
  }

  isAuthenticated(): boolean {
    return !!this._authToken && !!this._userContext.id;
  }

  getAuthToken(): string | null {
    return this._authToken;
  }

  setAuthToken(token: string | null): void {
    this._authToken = token;
  }

  setUser(user: any): void {
    this._userContext.update(user);
  }

  // ===========================================================================
  // API
  // ===========================================================================

  get api(): Record<string, Record<string, BuiltApi<any, any>>> {
    return this._apiRegistry.getAll();
  }

  async call<T>(api: BuiltApi<T, any>, options: CallOptions = {}): Promise<T> {
    const apiId = api.config.id;

    try {
      this._loadingApis.add(apiId);
      this._apiErrors.delete(apiId);

      const result = await this._apiExecutor.execute(api, options, this);

      this._apiData.set(apiId, result);
      return result;
    } catch (error) {
      this._apiErrors.set(apiId, error as ErrorResponse);
      throw error;
    } finally {
      this._loadingApis.delete(apiId);
    }
  }

  getData<T>(api: BuiltApi<T, any>): T | null {
    return this._apiData.get(api.config.id) ?? null;
  }

  isLoading(api: BuiltApi<any, any>): boolean {
    return this._loadingApis.has(api.config.id);
  }

  getError(api: BuiltApi<any, any>): ErrorResponse | null {
    return this._apiErrors.get(api.config.id) ?? null;
  }

  clearCache(api?: BuiltApi<any, any>): void {
    this._apiExecutor.clearCache(api);
    if (api) {
      this._apiData.delete(api.config.id);
    } else {
      this._apiData.clear();
    }
  }

  // ===========================================================================
  // NAVIGATION & ROUTING
  // ===========================================================================

  get routeParams(): RouteParams {
    return { ...this._routeParams };
  }

  get queryParams(): QueryParams {
    return { ...this._queryParams };
  }

  setRouteParams(params: RouteParams): void {
    this._routeParams = { ...params };
  }

  setQueryParams(params: QueryParams): void {
    this._queryParams = { ...params };
  }

  navigate(path: string): void {
    if (this._onNavigate) {
      this._onNavigate(path, false);
    }
  }

  navigateTo(route: string, pathParams?: Record<string, string>, queryParams?: Record<string, string>): void {
    const path = this._routeRegistry.buildUrl(route, pathParams, queryParams);
    this.navigate(path);
  }

  redirect(path: string): void {
    if (this._onNavigate) {
      this._onNavigate(path, true);
    }
  }

  redirectTo(route: string, pathParams?: Record<string, string>, queryParams?: Record<string, string>): void {
    const path = this._routeRegistry.buildUrl(route, pathParams, queryParams);
    this.redirect(path);
  }

  back(): void {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }

  getCurrentRoute(): string {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "";
  }

  // ===========================================================================
  // UI STATE
  // ===========================================================================

  showLoader(): void {
    if (this._onShowLoader) {
      this._onShowLoader();
    }
  }

  hideLoader(): void {
    if (this._onHideLoader) {
      this._onHideLoader();
    }
  }

  notify(message: string, type: NotifyType = "info"): void {
    if (this._onNotify) {
      this._onNotify(message, type);
    }
  }

  async confirm(message: string): Promise<boolean> {
    if (this._onConfirm) {
      return this._onConfirm(message);
    }
    // Fallback to browser confirm
    return Promise.resolve(window.confirm(message));
  }

  async alert(message: string): Promise<void> {
    if (this._onAlert) {
      return this._onAlert(message);
    }
    // Fallback to browser alert
    window.alert(message);
    return Promise.resolve();
  }

  openModal<TResult>(modal: Modal): Promise<TResult> {
    if (this._onOpenModal) {
      return this._onOpenModal(modal);
    }
    return Promise.reject(new Error("Modal handler not configured"));
  }

  closeModal(): void {
    if (this._onCloseModal) {
      this._onCloseModal();
    }
  }

  // ===========================================================================
  // CONFIG & ENVIRONMENT
  // ===========================================================================

  get config(): ConfigContext {
    return this._configContext;
  }

  // ===========================================================================
  // LOCALIZATION
  // ===========================================================================

  get i18n(): I18nContext {
    return this._i18nContext;
  }

  // ===========================================================================
  // STORAGE
  // ===========================================================================

  get storage(): StorageContext {
    return this._storageContext;
  }

  // ===========================================================================
  // META
  // ===========================================================================

  setMeta(key: string, value: any): void {
    this._meta[key] = value;
  }

  getMeta<T>(key: string): T {
    return this._meta[key] as T;
  }

  // ===========================================================================
  // INTERNAL SETTERS (called by framework)
  // ===========================================================================

  _setNavigateHandler(handler: (path: string, replace?: boolean) => void): void {
    this._onNavigate = handler;
  }

  _setNotifyHandler(handler: (message: string, type: NotifyType) => void): void {
    this._onNotify = handler;
  }

  _setLoaderHandlers(show: () => void, hide: () => void): void {
    this._onShowLoader = show;
    this._onHideLoader = hide;
  }

  _setConfirmHandler(handler: (message: string) => Promise<boolean>): void {
    this._onConfirm = handler;
  }

  _setAlertHandler(handler: (message: string) => Promise<void>): void {
    this._onAlert = handler;
  }

  _setModalHandlers(open: (modal: Modal) => Promise<any>, close: () => void): void {
    this._onOpenModal = open;
    this._onCloseModal = close;
  }
}
