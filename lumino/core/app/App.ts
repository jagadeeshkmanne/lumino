/**
 * Lumino Framework - App Base Class
 *
 * Abstract base class for defining application configuration.
 * Uses fluent builder pattern like Page, Form, and AppLayout classes.
 *
 * @example
 * ```typescript
 * // DemoApp.ts
 * class DemoApp extends App {
 *   configure() {
 *     // Base URL for APIs
 *     this.baseUrl("http://localhost:3001")
 *         .environment("development");
 *
 *     // Layout
 *     this.layout(DemoLayout);
 *
 *     // Register pages
 *     this.pages(
 *       BasicFormPage,
 *       ValidationDemoPage,
 *       ApiDemoPage
 *     );
 *
 *     // Register APIs
 *     this.apis(
 *       CountriesApi,
 *       RolesApi
 *     );
 *
 *     // UI Adapter
 *     this.adapter(saltAdapter);
 *
 *     // i18n
 *     this.translations("en", {
 *       "form.required": "This field is required",
 *       "form.save": "Save",
 *     });
 *
 *     // Feature flags
 *     this.feature("darkMode", true);
 *   }
 * }
 *
 * // main.tsx
 * const app = new DemoApp();
 * ```
 */

import type { Environment } from "../types/base";
import { Lumino } from "../Lumino";
import type { UIAdapter } from "../types/ui";
import { RouteRegistry } from "../registry/RouteRegistry";
import { PageRegistry } from "../page/Page";
import { lumino as createLuminoApp, type LuminoApp } from "./LuminoApp";

// =============================================================================
// ROUTE TYPES
// =============================================================================

/**
 * Route configuration for centralized routing
 */
export interface RouteConfig {
  /** URL path (e.g., "/users/:id") */
  path: string;
  /** Page class to render */
  page: new () => any;
  /** Optional layout class for this route (overrides default app layout) */
  layout?: new (id: string) => any;
  /** Optional route guards */
  guards?: Array<() => boolean | Promise<boolean>>;
  /** Optional metadata */
  meta?: Record<string, any>;
}

// =============================================================================
// APP BASE CLASS
// =============================================================================

/**
 * Singleton app instance
 */
let _appInstance: App | null = null;

/**
 * Abstract base class for defining Lumino applications.
 * Extend this class and implement `configure()` to define your app.
 */
export abstract class App {
  protected _baseUrl: string = "";
  protected _environment: Environment = "development";
  protected _defaultLocale: string = "en";
  protected _defaultTheme: string = "light";
  protected _layoutClass: (new (id: string) => any) | null = null;
  protected _layoutInstance: any | null = null;
  protected _routes: RouteConfig[] = [];
  protected _pageClasses: Array<new () => any> = [];
  protected _apiClasses: Array<new () => any> = [];
  protected _mapperClasses: Array<new () => any> = [];
  protected _features: Record<string, boolean> = {};
  protected _translations: Record<string, Record<string, string>> = {};
  protected _adapter: UIAdapter | null = null;
  protected _initialized: boolean = false;
  protected _luminoApp: LuminoApp | null = null;

  constructor() {
    // Set singleton
    if (_appInstance) {
      console.warn("App instance already exists. Only one app instance should be created.");
    }
    _appInstance = this;

    // Call configure
    this.configure();

    // Create LuminoApp instance immediately (needed for LuminoProvider)
    this._createLuminoApp();

    // Initialize components synchronously to ensure routes are available
    // before React renders (fixes timing issue with LuminoRouter)
    this._initializeComponents();
  }

  /**
   * Create the LuminoApp instance synchronously
   * This is needed so getLuminoApp() works immediately for LuminoProvider
   */
  private _createLuminoApp(): void {
    this._luminoApp = createLuminoApp({
      baseUrl: this._baseUrl,
      environment: this._environment,
      defaultLocale: this._defaultLocale,
      defaultTheme: this._defaultTheme,
    });

    // Set UI adapter
    if (this._adapter) {
      Lumino.ui(this._adapter);
    }
  }

  /**
   * Override this method to configure the application
   */
  abstract configure(): void;

  // =============================================================================
  // BUILDER METHODS
  // =============================================================================

  /**
   * Set API base URL
   */
  protected baseUrl(url: string): this {
    this._baseUrl = url;
    return this;
  }

  /**
   * Set environment
   */
  protected environment(env: Environment): this {
    this._environment = env;
    return this;
  }

  /**
   * Set default locale
   */
  protected locale(locale: string): this {
    this._defaultLocale = locale;
    return this;
  }

  /**
   * Set default theme
   */
  protected theme(theme: string): this {
    this._defaultTheme = theme;
    return this;
  }

  /**
   * Set app layout class
   */
  protected useLayout(layoutClass: new (id: string) => any): this {
    this._layoutClass = layoutClass;
    return this;
  }

  /**
   * Register page classes (without routes - use routes() for routing)
   * @deprecated Use routes() instead for better route visibility
   */
  protected pages(...pageClasses: Array<new () => any>): this {
    this._pageClasses.push(...pageClasses);
    return this;
  }

  /**
   * Define application routes - centralized routing configuration
   * Accepts either an array or individual route configs
   *
   * @example
   * ```typescript
   * // Individual routes
   * this.routes(
   *   { path: "/", page: HomePage },
   *   { path: "/users", page: UserListPage },
   * );
   *
   * // Or pass an array
   * this.routes(luminoRoutes);
   * ```
   */
  protected routes(routeConfigsOrFirst: RouteConfig[] | RouteConfig, ...rest: RouteConfig[]): this {
    if (Array.isArray(routeConfigsOrFirst)) {
      this._routes.push(...routeConfigsOrFirst);
    } else {
      this._routes.push(routeConfigsOrFirst, ...rest);
    }
    return this;
  }

  /**
   * Register API classes
   * Accepts either an array or individual API classes
   */
  protected apis(apiClassesOrFirst: Array<new () => any> | (new () => any), ...rest: Array<new () => any>): this {
    if (Array.isArray(apiClassesOrFirst)) {
      this._apiClasses.push(...apiClassesOrFirst);
    } else {
      this._apiClasses.push(apiClassesOrFirst, ...rest);
    }
    return this;
  }

  /**
   * Register mapper classes
   */
  protected mappers(...mapperClasses: Array<new () => any>): this {
    this._mapperClasses.push(...mapperClasses);
    return this;
  }

  /**
   * Set a feature flag
   */
  protected feature(name: string, enabled: boolean): this {
    this._features[name] = enabled;
    return this;
  }

  /**
   * Add translations for a locale
   */
  protected translations(locale: string, translations: Record<string, string>): this {
    if (!this._translations[locale]) {
      this._translations[locale] = {};
    }
    Object.assign(this._translations[locale], translations);
    return this;
  }

  /**
   * Set UI adapter
   */
  protected adapter(adapter: UIAdapter): this {
    this._adapter = adapter;
    return this;
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  /**
   * Initialize components (pages, APIs, mappers) - called after configure()
   * This is deferred via queueMicrotask to allow for import ordering
   */
  private _initializeComponents(): void {
    // Instantiate layout
    if (this._layoutClass) {
      this._layoutInstance = new this._layoutClass("app-layout");
    }

    // Instantiate APIs (triggers auto-registration)
    this._apiClasses.forEach((ApiClass) => {
      new ApiClass();
    });

    // Register routes and instantiate pages
    if (this._routes.length > 0) {
      // Using centralized routes() - preferred approach
      this._routes.forEach((routeConfig) => {
        // Instantiate the page
        const pageInstance = new routeConfig.page();
        const pageId = pageInstance.id || (pageInstance as any)._id;

        // Register the page instance directly to PageRegistry
        // This ensures the page is available immediately without waiting for queueMicrotask
        PageRegistry.registerInstance(pageId, pageInstance);

        // Register route to RouteRegistry
        // Layout priority: route-level > app-level default
        RouteRegistry.register(routeConfig.path, {
          path: routeConfig.path,
          pageId,
          layout: routeConfig.layout || this._layoutClass || undefined,
          guards: routeConfig.guards,
          meta: routeConfig.meta,
        });
      });
    } else {
      // Fallback: Instantiate Pages using pages() method (deprecated)
      this._pageClasses.forEach((PageClass) => {
        const pageInstance = new PageClass();
        const pageId = pageInstance.id || (pageInstance as any)._id;
        PageRegistry.registerInstance(pageId, pageInstance);
      });
    }

    // Instantiate Mappers (triggers auto-registration)
    this._mapperClasses.forEach((MapperClass) => {
      new MapperClass();
    });

    this._initialized = true;
  }

  // =============================================================================
  // PUBLIC GETTERS
  // =============================================================================

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this._baseUrl;
  }

  /**
   * Get environment
   */
  getEnvironment(): Environment {
    return this._environment;
  }

  /**
   * Get layout instance
   */
  getLayout(): any | null {
    return this._layoutInstance;
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(name: string): boolean {
    return this._features[name] || false;
  }

  /**
   * Get translations for a locale
   */
  getTranslations(locale: string): Record<string, string> {
    return this._translations[locale] || {};
  }

  /**
   * Get all registered routes (for debugging/inspection)
   */
  getRoutes(): RouteConfig[] {
    return [...this._routes];
  }

  /**
   * Check if app is initialized
   */
  get initialized(): boolean {
    return this._initialized;
  }

  /**
   * Get layout (alias for LuminoRouter compatibility)
   */
  get layout(): any | null {
    return this._layoutInstance;
  }

  /**
   * Get config (for LuminoProvider compatibility)
   */
  get config(): any {
    return {
      baseUrl: this._baseUrl,
      environment: this._environment,
      defaultLocale: this._defaultLocale,
      defaultTheme: this._defaultTheme,
      features: this._features,
    };
  }

  /**
   * Get the internal LuminoApp instance for use with LuminoProvider.
   * This allows the OOP App class to work seamlessly with React context.
   *
   * The LuminoApp is created synchronously in the constructor, so this
   * is always available immediately after creating the App instance.
   */
  getLuminoApp(): LuminoApp {
    // This should never be null since we create it in the constructor
    return this._luminoApp!;
  }

  /**
   * Wait for the app to be fully initialized (all components instantiated).
   * Useful when you need to ensure pages, APIs, etc. are ready.
   */
  async waitForInit(): Promise<this> {
    if (this._initialized) {
      return this;
    }
    // Wait for the microtask to complete
    await new Promise<void>((resolve) => {
      const checkInit = () => {
        if (this._initialized) {
          resolve();
        } else {
          queueMicrotask(checkInit);
        }
      };
      queueMicrotask(checkInit);
    });
    return this;
  }
}

// =============================================================================
// SINGLETON ACCESS
// =============================================================================

/**
 * Get the app instance
 */
export function getAppInstance(): App {
  if (!_appInstance) {
    throw new Error("App instance not created. Create an App subclass first.");
  }
  return _appInstance;
}

/**
 * Clear app instance (for testing)
 */
export function clearAppInstance(): void {
  _appInstance = null;
}
