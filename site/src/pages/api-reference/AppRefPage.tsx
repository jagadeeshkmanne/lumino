/**
 * LuminoApp / App API Reference
 */

import { CodeBlock } from "../../components/CodeBlock";

const signatureCode = `class LuminoApp {
  constructor(config: LuminoConfig);

  // Configuration
  readonly config: LuminoConfig;
  readonly baseUrl: string;
  readonly environment: Environment;
  readonly initialized: boolean;
  readonly layout: AppLayout | null;

  // Providers
  setUserProvider(provider: UserProvider): this;
  setI18nProvider(provider: I18nProvider): this;
  setStorageProvider(provider: StorageProvider): this;
  readonly i18n: I18nProvider;
  readonly storage: StorageProvider;

  // Feature Flags
  isFeatureEnabled(feature: string): boolean;
  setFeature(feature: string, enabled: boolean): this;

  // Component Resolver
  componentResolver(resolver: ComponentResolver): this;
  resolveComponent(componentType: any): any;

  // Registration
  registerMapper<T>(MapperClass: new () => T): this;
  registerMappers(...MapperClasses: Array<new () => any>): this;
  scanMappers(module: Record<string, any>): this;
  registerPage(pageId: string, PageClass: new () => Page<any>): this;
  scanPages(module: Record<string, any>): this;
  scan(module: Record<string, any>): this;
  registerRoute(path: string, pageId: string): this;
  routes(routeMap: Record<string, string>): this;

  // Plugins
  use(plugin: LuminoPlugin): this;

  // Events
  readonly events: EventEmitter;
  readonly eventBus: EventBus;

  // State
  readonly state: StateManager;

  // Lifecycle
  init(): Promise<void>;
  reset(): void;

  // Context Providers
  getConfigContext(): ConfigContext;
  getI18nContext(): I18nContext;
  getStorageContext(): StorageContext;
}

// Factory function
function lumino(config: LuminoConfig): LuminoApp;
function getApp(): LuminoApp;
function clearApp(): void;`;

const configTypeCode = `interface LuminoConfig {
  // Required
  baseUrl: string;

  // Optional
  environment?: Environment;
  defaultLocale?: string;
  defaultTheme?: string;
  authTokenKey?: string;
  features?: Record<string, boolean>;

  // API Configuration
  api?: {
    timeout?: number;
    retries?: number;
    headers?: Record<string, string>;
  };

  // Storage Configuration
  storage?: {
    prefix?: string;
  };

  // i18n Configuration
  i18n?: {
    translations?: Record<string, Record<string, string>>;
    fallbackLocale?: string;
  };

  // Module Configuration
  apis?: Array<new () => any>;
  pages?: Array<new () => any>;
  mappers?: Array<new () => any>;
  routes?: Record<string, new () => any>;
  plugins?: LuminoPlugin[];
  layout?: new (id: string) => any;
}`;

const basicUsageCode = `import { lumino } from "lumino/core";
import { UsersApi, OrdersApi } from "./apis";
import { EmployeePage, OrderPage } from "./pages";
import { UserMapper, OrderMapper } from "./mappers";
import { DemoLayout } from "./layouts";

// Create app with Angular/React style configuration
const app = lumino({
  baseUrl: "/api",
  environment: "development",
  defaultLocale: "en",
  defaultTheme: "light",

  // Register APIs
  apis: [UsersApi, OrdersApi],

  // Register Pages
  pages: [EmployeePage, OrderPage],

  // Register Mappers
  mappers: [UserMapper, OrderMapper],

  // Register Routes
  routes: {
    "/": "home",
    "/employees": "employeeList",
    "/employees/:id": "employeeForm",
    "/orders": "orderList",
  },

  // App Layout
  layout: DemoLayout,

  // Feature Flags
  features: {
    darkMode: true,
    newDashboard: false,
  },
});

// Initialize
await app.init();`;

const featureFlagsCode = `// Check feature flags
if (app.isFeatureEnabled("darkMode")) {
  console.log("Dark mode is enabled");
}

// Toggle features dynamically
app.setFeature("newDashboard", true);

// Use in components
if (ctx.config.features.isEnabled("newDashboard")) {
  // Render new dashboard
}`;

const i18nCode = `const app = lumino({
  baseUrl: "/api",
  defaultLocale: "en",
  i18n: {
    translations: {
      en: {
        "greeting": "Hello, {name}!",
        "save": "Save",
        "cancel": "Cancel",
      },
      es: {
        "greeting": "Hola, {name}!",
        "save": "Guardar",
        "cancel": "Cancelar",
      },
    },
    fallbackLocale: "en",
  },
});

// Use translations
console.log(app.i18n.t("greeting", { name: "John" })); // "Hello, John!"

// Change locale
app.i18n.setLocale("es");
console.log(app.i18n.t("save")); // "Guardar"`;

const storageCode = `// Local storage
app.storage.local.set("theme", "dark");
const theme = app.storage.local.get<string>("theme");

// Session storage
app.storage.session.set("activeTab", 0);
const activeTab = app.storage.session.get<number>("activeTab");

// Clear storage
app.storage.local.remove("theme");
app.storage.local.clear(); // Clear all with prefix`;

const routesCode = `// Method 1: Register routes in config
const app = lumino({
  baseUrl: "/api",
  routes: {
    "/": HomePage,
    "/employees": EmployeeListPage,
    "/employees/:id": EmployeeFormPage,
  },
});

// Method 2: Register routes programmatically
app.routes({
  "/orders": "orderList",
  "/orders/:id": "orderForm",
});

// Method 3: Individual route
app.registerRoute("/settings", "settings");`;

const scanningCode = `// Scan and register all Pages from a module
import * as Pages from "./pages";
app.scanPages(Pages);

// Scan and register all Mappers from a module
import * as Mappers from "./mappers";
app.scanMappers(Mappers);

// Scan everything
import * as Domain from "./domain";
app.scan(Domain);`;

const pluginsCode = `// Define a plugin
const myPlugin: LuminoPlugin = {
  name: "my-plugin",
  async install(app: LuminoApp) {
    // Register custom APIs
    // Add interceptors
    // Configure app
  },
};

// Use plugin in config
const app = lumino({
  baseUrl: "/api",
  plugins: [myPlugin],
});

// Or add later
app.use(myPlugin);`;

const userProviderCode = `// Custom user provider
const userProvider: UserProvider = {
  async getCurrentUser() {
    const response = await fetch("/api/auth/me");
    return response.json();
  },
  isAuthenticated() {
    return !!localStorage.getItem("auth_token");
  },
  getToken() {
    return localStorage.getItem("auth_token");
  },
};

app.setUserProvider(userProvider);

// After init, user is loaded automatically
await app.init();`;

const eventsCode = `// Subscribe to events
app.events.on("app:init", () => {
  console.log("App initializing");
});

app.events.on("app:ready", () => {
  console.log("App ready");
});

app.events.on("app:locale:change", ({ locale }) => {
  console.log("Locale changed to:", locale);
});

// Use event bus for custom events
app.eventBus.emit("custom:event", { data: "value" });
app.eventBus.on("custom:event", (data) => {
  console.log("Custom event:", data);
});`;

const stateCode = `// Access state manager
app.state.setLocale("en");
app.state.setTheme("dark");
app.state.setUser(userInfo);

// Subscribe to state changes
app.state.subscribe("locale", (newLocale) => {
  console.log("Locale changed:", newLocale);
});

// Get current state
const currentLocale = app.state.getLocale();
const currentTheme = app.state.getTheme();
const currentUser = app.state.getUser();`;

const layoutCode = `// Define app layout
class DemoLayout extends AppLayout {
  configure() {
    // Configure header
    this.header()
      .title("My App")
      .logo("/logo.png")
    .end();

    // Configure sidebar
    this.sidebar()
      .addItem("/", "Home", "home-icon")
      .addItem("/employees", "Employees", "people-icon")
      .addItem("/orders", "Orders", "cart-icon")
    .end();

    // Configure footer
    this.footer()
      .copyright("© 2025 My Company")
    .end();
  }
}

// Use in app config
const app = lumino({
  baseUrl: "/api",
  layout: DemoLayout,
});

// Access layout
const layout = app.layout;`;

const contextCode = `// Get context objects
const configContext = app.getConfigContext();
console.log(configContext.baseUrl);
console.log(configContext.environment);
console.log(configContext.features.isEnabled("darkMode"));

const i18nContext = app.getI18nContext();
console.log(i18nContext.t("greeting"));
console.log(i18nContext.locale);

const storageContext = app.getStorageContext();
storageContext.local.set("key", "value");`;

export function AppRefPage() {
  return (
    <>
      <h1 className="docs-page-title">LuminoApp Reference</h1>
      <p className="docs-page-subtitle">
        Main application class for Lumino framework configuration and initialization.
      </p>

      {/* Signature */}
      <div className="docs-section">
        <h2 className="docs-section-title">Type Signature</h2>
        <CodeBlock code={signatureCode} language="typescript" />
      </div>

      {/* Config Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">LuminoConfig Type</h2>
        <CodeBlock code={configTypeCode} language="typescript" />
      </div>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>LuminoApp</code> class is the central configuration point for your Lumino
          application. It handles app-level concerns like API registration, routing, i18n, storage,
          feature flags, and lifecycle management.
        </p>
        <p>
          <strong>Key Features:</strong>
        </p>
        <ul>
          <li>Angular/React-style module configuration</li>
          <li>Auto-registration of APIs, Pages, and Mappers</li>
          <li>Built-in i18n and storage providers</li>
          <li>Feature flag system</li>
          <li>Plugin architecture</li>
          <li>Event system for app-wide events</li>
          <li>State management</li>
          <li>Layout configuration</li>
        </ul>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Configuration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Configuration</h2>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Feature Flags
        </h3>
        <CodeBlock code={featureFlagsCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Internationalization (i18n)
        </h3>
        <CodeBlock code={i18nCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Storage
        </h3>
        <CodeBlock code={storageCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Layout
        </h3>
        <CodeBlock code={layoutCode} language="typescript" />
      </div>

      {/* Registration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Registration</h2>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Routes
        </h3>
        <CodeBlock code={routesCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Module Scanning
        </h3>
        <CodeBlock code={scanningCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Plugins
        </h3>
        <CodeBlock code={pluginsCode} language="typescript" />
      </div>

      {/* Providers */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Providers</h2>
        <CodeBlock code={userProviderCode} language="typescript" />
      </div>

      {/* Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">Events</h2>
        <CodeBlock code={eventsCode} language="typescript" />
      </div>

      {/* State Management */}
      <div className="docs-section">
        <h2 className="docs-section-title">State Management</h2>
        <CodeBlock code={stateCode} language="typescript" />
      </div>

      {/* Context Objects */}
      <div className="docs-section">
        <h2 className="docs-section-title">Context Objects</h2>
        <CodeBlock code={contextCode} language="typescript" />
      </div>

      {/* Properties */}
      <div className="docs-section">
        <h2 className="docs-section-title">Properties</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>config</code></td>
              <td><code>LuminoConfig</code></td>
              <td>App configuration object</td>
            </tr>
            <tr>
              <td><code>baseUrl</code></td>
              <td><code>string</code></td>
              <td>API base URL</td>
            </tr>
            <tr>
              <td><code>environment</code></td>
              <td><code>Environment</code></td>
              <td>Current environment (development, staging, production)</td>
            </tr>
            <tr>
              <td><code>initialized</code></td>
              <td><code>boolean</code></td>
              <td>Whether app has been initialized</td>
            </tr>
            <tr>
              <td><code>layout</code></td>
              <td><code>AppLayout | null</code></td>
              <td>App layout instance</td>
            </tr>
            <tr>
              <td><code>i18n</code></td>
              <td><code>I18nProvider</code></td>
              <td>Internationalization provider</td>
            </tr>
            <tr>
              <td><code>storage</code></td>
              <td><code>StorageProvider</code></td>
              <td>Storage provider (local/session)</td>
            </tr>
            <tr>
              <td><code>events</code></td>
              <td><code>EventEmitter</code></td>
              <td>Event emitter for custom events</td>
            </tr>
            <tr>
              <td><code>eventBus</code></td>
              <td><code>EventBus</code></td>
              <td>Event bus for app-wide events</td>
            </tr>
            <tr>
              <td><code>state</code></td>
              <td><code>StateManager</code></td>
              <td>Global state manager</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>init()</code></td>
              <td>Initialize the application (async)</td>
            </tr>
            <tr>
              <td><code>reset()</code></td>
              <td>Reset the application state</td>
            </tr>
            <tr>
              <td><code>isFeatureEnabled(feature)</code></td>
              <td>Check if a feature flag is enabled</td>
            </tr>
            <tr>
              <td><code>setFeature(feature, enabled)</code></td>
              <td>Enable/disable a feature flag</td>
            </tr>
            <tr>
              <td><code>registerRoute(path, pageId)</code></td>
              <td>Register a single route</td>
            </tr>
            <tr>
              <td><code>routes(routeMap)</code></td>
              <td>Register multiple routes at once</td>
            </tr>
            <tr>
              <td><code>use(plugin)</code></td>
              <td>Install a plugin</td>
            </tr>
            <tr>
              <td><code>scanPages(module)</code></td>
              <td>Auto-register all Pages from a module</td>
            </tr>
            <tr>
              <td><code>scanMappers(module)</code></td>
              <td>Auto-register all Mappers from a module</td>
            </tr>
            <tr>
              <td><code>scan(module)</code></td>
              <td>Scan and register everything from a module</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>Use module configuration</strong> - Register APIs, Pages, and Mappers in config
          </li>
          <li>
            <strong>Initialize once</strong> - Call <code>app.init()</code> once at app startup
          </li>
          <li>
            <strong>Use feature flags</strong> - Control features dynamically with flags
          </li>
          <li>
            <strong>Leverage plugins</strong> - Encapsulate reusable functionality in plugins
          </li>
          <li>
            <strong>Configure layout</strong> - Use AppLayout for consistent navigation
          </li>
          <li>
            <strong>Use scanning</strong> - Scan modules to auto-register classes
          </li>
        </ul>
      </div>
    </>
  );
}
