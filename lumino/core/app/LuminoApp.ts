/**
 * Lumino Framework - LuminoApp Core
 *
 * Main application configuration and initialization.
 * UI-independent - provides app-level configuration and registration.
 */

import type { Environment } from "../types/base";
import type { UserContext, I18nContext, ConfigContext, StorageContext } from "../types/context";
import { eventEmitter, EventBus, eventBus } from "../events/EventEmitter";
import { stateManager, StateManager } from "../state/StateManager";
import { ApiRegistry } from "../registry/ApiRegistry";
import { MapperRegistry } from "../registry/MapperRegistry";
import { RouteRegistry } from "../registry/RouteRegistry";
import { PageRegistry } from "../page/Page";
import type { Page } from "../page/Page";
import type { Mapper } from "../api/Mapper";

// =============================================================================
// LUMINO APP CONFIG TYPES
// =============================================================================

export interface LuminoConfig {
  /** API base URL (required) */
  baseUrl: string;
  /** Environment (optional, defaults to "development") */
  environment?: Environment;
  /** Default locale (optional, defaults to "en") */
  defaultLocale?: string;
  /** Default theme (optional, defaults to "light") */
  defaultTheme?: string;
  /** Auth token storage key (optional) */
  authTokenKey?: string;
  /** Feature flags (optional) */
  features?: Record<string, boolean>;
  /** API configuration (optional) */
  api?: {
    timeout?: number;
    retries?: number;
    headers?: Record<string, string>;
  };
  /** Storage configuration (optional) */
  storage?: {
    prefix?: string;
  };
  /** i18n configuration (optional) */
  i18n?: {
    translations?: Record<string, Record<string, string>>;
    fallbackLocale?: string;
  };

  // ==========================================================================
  // MODULE CONFIGURATION (Angular/React style)
  // ==========================================================================

  /**
   * API classes to register (CrudApi, LookupApi, ApiGroup)
   * @example
   * ```typescript
   * lumino({
   *   baseUrl: "/api",
   *   apis: [UsersApi, OrdersApi, CountriesApi]
   * })
   * ```
   */
  apis?: Array<new () => any>;

  /**
   * Page classes to register
   * @example
   * ```typescript
   * lumino({
   *   baseUrl: "/api",
   *   pages: [EmployeeFormPage, EmployeeListPage, OrderPage]
   * })
   * ```
   */
  pages?: Array<new () => any>;

  /**
   * Mapper classes to register
   * @example
   * ```typescript
   * lumino({
   *   baseUrl: "/api",
   *   mappers: [UserMapper, OrderMapper]
   * })
   * ```
   */
  mappers?: Array<new () => any>;

  /**
   * Additional route definitions (pages define their own routes via this.route())
   * Use this for aliases or overrides
   * @example
   * ```typescript
   * lumino({
   *   baseUrl: "/api",
   *   pages: [HomePage, EmployeeListPage, EmployeeFormPage],
   *   routes: {
   *     "/": HomePage,  // alias
   *     "/staff": EmployeeListPage,  // alternative route
   *   }
   * })
   * ```
   */
  routes?: Record<string, new () => any>;

  /**
   * Plugins to install
   */
  plugins?: LuminoPlugin[];

  /**
   * App layout class for header, sidebar, footer
   * @example
   * ```typescript
   * class DemoLayout extends AppLayout {
   *   configure() {
   *     this.header().title("My App").end();
   *     this.sidebar()
   *       .addItem("/", "Home")
   *       .addItem("/forms", "Forms")
   *       .end();
   *   }
   * }
   *
   * lumino({
   *   baseUrl: "/api",
   *   layout: DemoLayout,
   * })
   * ```
   */
  layout?: new (id: string) => any;
}

/** Component resolver function type */
export type ComponentResolver = (componentType: any) => React.ComponentType<any> | null;

export interface UserProvider {
  getCurrentUser(): Promise<any>;
  isAuthenticated(): boolean;
  getToken(): string | null;
}

export interface I18nProvider {
  t(key: string, params?: Record<string, any>): string;
  getLocale(): string;
  setLocale(locale: string): void;
  addTranslations(locale: string, translations: Record<string, string>): void;
}

export interface StorageProvider {
  local: {
    get<T>(key: string): T | null;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
  };
  session: {
    get<T>(key: string): T | null;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
  };
}

// =============================================================================
// DEFAULT PROVIDERS
// =============================================================================

/**
 * Default I18n Provider (simple implementation)
 */
class DefaultI18nProvider implements I18nProvider {
  private _locale: string;
  private _translations: Record<string, Record<string, string>> = {};
  private _fallbackLocale: string;

  constructor(defaultLocale: string = "en", fallbackLocale: string = "en") {
    this._locale = defaultLocale;
    this._fallbackLocale = fallbackLocale;
  }

  t(key: string, params?: Record<string, any>): string {
    let translation =
      this._translations[this._locale]?.[key] ||
      this._translations[this._fallbackLocale]?.[key] ||
      key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }

    return translation;
  }

  getLocale(): string {
    return this._locale;
  }

  setLocale(locale: string): void {
    const prevLocale = this._locale;
    this._locale = locale;
    stateManager.setLocale(locale);
    eventEmitter.emit("app:locale:change", {
      locale,
      previousLocale: prevLocale,
    });
  }

  addTranslations(locale: string, translations: Record<string, string>): void {
    if (!this._translations[locale]) {
      this._translations[locale] = {};
    }
    Object.assign(this._translations[locale], translations);
  }
}

/**
 * Default Storage Provider (uses localStorage/sessionStorage)
 */
class DefaultStorageProvider implements StorageProvider {
  private _prefix: string;

  constructor(prefix: string = "lumino_") {
    this._prefix = prefix;
  }

  private _getKey(key: string): string {
    return `${this._prefix}${key}`;
  }

  local = {
    get: <T>(key: string): T | null => {
      try {
        const value = localStorage.getItem(this._getKey(key));
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
    set: (key: string, value: any): void => {
      try {
        localStorage.setItem(this._getKey(key), JSON.stringify(value));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    remove: (key: string): void => {
      localStorage.removeItem(this._getKey(key));
    },
    clear: (): void => {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this._prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    },
  };

  session = {
    get: <T>(key: string): T | null => {
      try {
        const value = sessionStorage.getItem(this._getKey(key));
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
    set: (key: string, value: any): void => {
      try {
        sessionStorage.setItem(this._getKey(key), JSON.stringify(value));
      } catch (error) {
        console.error("Error saving to sessionStorage:", error);
      }
    },
    remove: (key: string): void => {
      sessionStorage.removeItem(this._getKey(key));
    },
    clear: (): void => {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(this._prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    },
  };
}

// =============================================================================
// LUMINO APP CLASS
// =============================================================================

/**
 * Main Lumino Application class.
 *
 * @example
 * ```typescript
 * // Angular/React style - all configuration in one place
 * const app = lumino({
 *   baseUrl: "/api",
 *   environment: "development",
 *
 *   // Register APIs
 *   apis: [
 *     UsersApi,
 *     OrdersApi,
 *     CountriesApi,
 *   ],
 *
 *   // Register Pages
 *   pages: [
 *     EmployeeFormPage,
 *     EmployeeListPage,
 *     OrderPage,
 *   ],
 *
 *   // Register Mappers
 *   mappers: [
 *     UserMapper,
 *     OrderMapper,
 *   ],
 *
 *   // Define Routes
 *   routes: {
 *     "/": "home",
 *     "/employees": "employeeList",
 *     "/employees/:id?": "employeeForm",
 *     "/orders": "orderList",
 *   },
 *
 *   // Feature flags
 *   features: {
 *     darkMode: true,
 *     newDashboard: false,
 *   },
 * });
 *
 * // Use in React
 * <LuminoProvider app={app}>
 *   <App />
 * </LuminoProvider>
 * ```
 */
export class LuminoApp {
  private _config: LuminoConfig;
  private _initialized: boolean = false;
  private _userProvider: UserProvider | null = null;
  private _i18nProvider: I18nProvider;
  private _storageProvider: StorageProvider;
  private _features: Record<string, boolean> = {};
  private _plugins: LuminoPlugin[] = [];
  private _componentResolver: ComponentResolver = (type) => type;
  private _layout: any | null = null;

  constructor(config: LuminoConfig) {
    this._config = {
      environment: "development",
      defaultLocale: "en",
      defaultTheme: "light",
      authTokenKey: "auth_token",
      features: {},
      api: {
        timeout: 30000,
        retries: 0,
        headers: {},
      },
      storage: {
        prefix: "lumino_",
      },
      i18n: {
        fallbackLocale: "en",
        translations: {},
      },
      ...config,
    };

    this._features = this._config.features || {};
    this._i18nProvider = new DefaultI18nProvider(
      this._config.defaultLocale,
      this._config.i18n?.fallbackLocale
    );
    this._storageProvider = new DefaultStorageProvider(this._config.storage?.prefix);

    // Add initial translations
    if (this._config.i18n?.translations) {
      Object.entries(this._config.i18n.translations).forEach(([locale, translations]) => {
        this._i18nProvider.addTranslations(locale, translations);
      });
    }

    // Set initial state
    stateManager.setLocale(this._config.defaultLocale!);
    stateManager.setTheme(this._config.defaultTheme!);

    // Process module configuration (Angular/React style)
    this._processModuleConfig();
  }

  /**
   * Process module configuration from config object
   */
  private _processModuleConfig(): void {
    // Register APIs
    if (this._config.apis) {
      this._config.apis.forEach((ApiClass) => {
        // Instantiate to trigger auto-registration
        new ApiClass();
      });
    }

    // Register Pages
    if (this._config.pages) {
      this._config.pages.forEach((PageClass) => {
        // Instantiate to trigger auto-registration
        new PageClass();
      });
    }

    // Register Mappers (instantiation triggers auto-registration via queueMicrotask)
    if (this._config.mappers) {
      this._config.mappers.forEach((MapperClass) => {
        new MapperClass();
      });
    }

    // Register Routes (class reference -> page ID)
    if (this._config.routes) {
      Object.entries(this._config.routes).forEach(([path, PageClass]) => {
        // Instantiate to get page ID (also triggers auto-registration if not already)
        const page = new PageClass();
        RouteRegistry.register(path, { path, pageId: page.id });
      });
    }

    // Add Plugins
    if (this._config.plugins) {
      this._config.plugins.forEach((plugin) => {
        this._plugins.push(plugin);
      });
    }

    // Instantiate Layout
    if (this._config.layout) {
      this._layout = new this._config.layout("app-layout");
    }
  }

  /**
   * Get app layout instance
   */
  get layout(): any | null {
    return this._layout;
  }

  // =============================================================================
  // CONFIGURATION
  // =============================================================================

  /**
   * Get app configuration
   */
  get config(): LuminoConfig {
    return this._config;
  }

  /**
   * Get base URL
   */
  get baseUrl(): string {
    return this._config.baseUrl;
  }

  /**
   * Get environment
   */
  get environment(): Environment {
    return this._config.environment;
  }

  /**
   * Check if app is initialized
   */
  get initialized(): boolean {
    return this._initialized;
  }

  // =============================================================================
  // PROVIDERS
  // =============================================================================

  /**
   * Set custom user provider
   */
  setUserProvider(provider: UserProvider): this {
    this._userProvider = provider;
    return this;
  }

  /**
   * Set custom i18n provider
   */
  setI18nProvider(provider: I18nProvider): this {
    this._i18nProvider = provider;
    return this;
  }

  /**
   * Set custom storage provider
   */
  setStorageProvider(provider: StorageProvider): this {
    this._storageProvider = provider;
    return this;
  }

  /**
   * Get i18n provider
   */
  get i18n(): I18nProvider {
    return this._i18nProvider;
  }

  /**
   * Get storage provider
   */
  get storage(): StorageProvider {
    return this._storageProvider;
  }

  // =============================================================================
  // FEATURE FLAGS
  // =============================================================================

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: string): boolean {
    return this._features[feature] || false;
  }

  /**
   * Enable/disable feature
   */
  setFeature(feature: string, enabled: boolean): this {
    this._features[feature] = enabled;
    eventEmitter.emit("app:config:change", { key: `feature.${feature}`, value: enabled });
    return this;
  }

  // =============================================================================
  // COMPONENT RESOLVER
  // =============================================================================

  /**
   * Set component resolver for mapping abstract components to UI library components
   *
   * @example
   * ```typescript
   * app.componentResolver((type) => ({
   *   TextField: MuiTextField,
   *   Select: MuiSelect,
   *   Button: MuiButton,
   * }[type.name] || type));
   * ```
   */
  componentResolver(resolver: ComponentResolver): this {
    this._componentResolver = resolver;
    return this;
  }

  /**
   * Resolve a component using the registered resolver
   */
  resolveComponent(componentType: any): any {
    return this._componentResolver(componentType) || componentType;
  }

  // =============================================================================
  // REGISTRATION
  // =============================================================================
  //
  // NOTE: APIs, Pages, and Mappers now AUTO-REGISTER when instantiated!
  //
  // Just import your classes and they'll be registered:
  //   import "./apis/UsersApi";     // Auto-registered!
  //   import "./pages/EmployeePage"; // Auto-registered with route!
  //
  // =============================================================================

  /**
   * Register a mapper class
   */
  registerMapper<T extends Mapper<any, any>>(MapperClass: new () => T): this {
    const mapper = new MapperClass();
    MapperRegistry.register((MapperClass as any).name || mapper.constructor.name, mapper);
    return this;
  }

  /**
   * Register multiple mapper classes
   */
  registerMappers(...MapperClasses: Array<new () => any>): this {
    MapperClasses.forEach((MapperClass) => this.registerMapper(MapperClass));
    return this;
  }

  /**
   * Auto-register all Mappers from a module/namespace
   *
   * @example
   * ```typescript
   * import * as Mappers from "./mappers";
   * lumino({ baseUrl: "/api" }).scanMappers(Mappers);
   * ```
   */
  scanMappers(module: Record<string, any>): this {
    Object.values(module).forEach((item) => {
      if (typeof item === "function" && item.prototype) {
        const instance = Object.create(item.prototype);
        if ("_fieldMappings" in instance || item.name?.endsWith("Mapper")) {
          try {
            this.registerMapper(item as new () => any);
          } catch {
            // Not a valid Mapper class, skip
          }
        }
      }
    });
    return this;
  }

  /**
   * Register a page class
   */
  registerPage(pageId: string, PageClass: new () => Page<any>): this {
    PageRegistry.register(pageId, PageClass);
    return this;
  }

  /**
   * Auto-register all Pages from a module/namespace
   * Uses the class name (without "Page" suffix) as the pageId
   *
   * @example
   * ```typescript
   * // pages/index.ts
   * export class EmployeeFormPage extends Page<Employee> { ... }
   * export class EmployeeListPage extends Page<Employee> { ... }
   *
   * // app setup - auto-registers as "employeeForm" and "employeeList"
   * import * as Pages from "./pages";
   * lumino({ baseUrl: "/api" }).scanPages(Pages);
   * ```
   */
  scanPages(module: Record<string, any>): this {
    Object.values(module).forEach((item) => {
      if (typeof item === "function" && item.prototype) {
        const instance = Object.create(item.prototype);
        if ("_components" in instance || item.name?.endsWith("Page")) {
          try {
            // Convert "EmployeeFormPage" to "employeeForm"
            const pageId = item.name
              .replace(/Page$/, "")
              .replace(/^./, (c: string) => c.toLowerCase());
            this.registerPage(pageId, item as new () => Page<any>);
          } catch {
            // Not a valid Page class, skip
          }
        }
      }
    });
    return this;
  }

  /**
   * Scan and register everything from a module (Mappers, Pages)
   * Note: APIs auto-register when instantiated, so they don't need scanning.
   *
   * @example
   * ```typescript
   * import * as Domain from "./domain";  // Contains Mappers, Pages
   * lumino({ baseUrl: "/api" }).scan(Domain);
   * ```
   */
  scan(module: Record<string, any>): this {
    this.scanMappers(module);
    this.scanPages(module);
    return this;
  }

  /**
   * Register a route
   */
  registerRoute(path: string, pageId: string): this {
    RouteRegistry.register(path, { path, pageId });
    return this;
  }

  /**
   * Register multiple routes at once
   *
   * @example
   * ```typescript
   * app.routes({
   *   "/": "home",
   *   "/employees": "employeeList",
   *   "/employees/:id?": "employeeForm",
   *   "/orders": "orderList",
   * });
   * ```
   */
  routes(routeMap: Record<string, string>): this {
    Object.entries(routeMap).forEach(([path, pageId]) => {
      this.registerRoute(path, pageId);
    });
    return this;
  }

  // =============================================================================
  // PLUGINS
  // =============================================================================

  /**
   * Use a plugin
   */
  use(plugin: LuminoPlugin): this {
    this._plugins.push(plugin);
    if (this._initialized) {
      plugin.install(this);
    }
    return this;
  }

  // =============================================================================
  // EVENTS
  // =============================================================================

  /**
   * Get event emitter for custom events
   */
  get events() {
    return eventEmitter;
  }

  /**
   * Get event bus
   */
  get eventBus(): EventBus {
    return eventBus;
  }

  // =============================================================================
  // STATE
  // =============================================================================

  /**
   * Get state manager
   */
  get state(): StateManager {
    return stateManager;
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  /**
   * Initialize the application
   */
  async init(): Promise<void> {
    if (this._initialized) {
      console.warn("LuminoApp is already initialized");
      return;
    }

    try {
      eventEmitter.emit("app:init", {});

      // Install plugins
      for (const plugin of this._plugins) {
        await plugin.install(this);
      }

      // Load user if provider is set
      if (this._userProvider) {
        try {
          const user = await this._userProvider.getCurrentUser();
          stateManager.setUser(user);
        } catch (error) {
          console.error("Failed to load user:", error);
        }
      }

      this._initialized = true;
      eventEmitter.emit("app:ready", {});
    } catch (error) {
      eventEmitter.emit("app:error", { error });
      throw error;
    }
  }

  /**
   * Reset the application state
   */
  reset(): void {
    stateManager.reset();
    ApiRegistry.clear();
    MapperRegistry.clear();
    RouteRegistry.clear();
    PageRegistry.clear();
    eventEmitter.clear();
    this._initialized = false;
  }

  // =============================================================================
  // CONFIG CONTEXT
  // =============================================================================

  /**
   * Get config context
   */
  getConfigContext(): ConfigContext {
    return {
      get: <T>(key: string): T => {
        const keys = key.split(".");
        let value: any = this._config;
        for (const k of keys) {
          value = value?.[k];
        }
        return value as T;
      },
      baseUrl: this._config.baseUrl,
      environment: this._config.environment,
      features: {
        isEnabled: (feature: string) => this.isFeatureEnabled(feature),
      },
    };
  }

  /**
   * Get i18n context
   */
  getI18nContext(): I18nContext {
    return {
      t: (key: string, params?: Record<string, any>) => this._i18nProvider.t(key, params),
      locale: this._i18nProvider.getLocale(),
      setLocale: (locale: string) => this._i18nProvider.setLocale(locale),
    };
  }

  /**
   * Get storage context
   */
  getStorageContext(): StorageContext {
    return {
      local: this._storageProvider.local,
      session: this._storageProvider.session,
    };
  }
}

// =============================================================================
// PLUGIN INTERFACE
// =============================================================================

/**
 * Plugin interface for extending LuminoApp
 */
export interface LuminoPlugin {
  name: string;
  install(app: LuminoApp): void | Promise<void>;
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let _appInstance: LuminoApp | null = null;

/**
 * Create or get the app instance
 */
export function lumino(config: LuminoConfig): LuminoApp {
  if (_appInstance) {
    console.warn("App instance already exists. Use getApp() to get the existing instance.");
    return _appInstance;
  }
  _appInstance = new LuminoApp(config);
  return _appInstance;
}

/** @deprecated Use lumino() instead */
export const createApp = lumino;

/**
 * Get the app instance
 */
export function getApp(): LuminoApp {
  if (!_appInstance) {
    throw new Error("App instance not created. Call createApp() first.");
  }
  return _appInstance;
}

/**
 * Clear the app instance (for testing)
 */
export function clearApp(): void {
  if (_appInstance) {
    _appInstance.reset();
    _appInstance = null;
  }
}
