/**
 * useLumino Hook Page - Main Lumino framework hook
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicUsageCode = `import { useLumino } from "lumino/react";

function MyComponent() {
  const lumino = useLumino();

  // Access framework features
  const { navigate, notify, loading, user, locale, theme } = lumino;

  return <div>Hello, {user?.name}!</div>;
}`;

const navigationCode = `const { navigate, redirect, back, getCurrentRoute } = useLumino();

// Navigate to a route
navigate("/users/123");

// Redirect (replaces history)
redirect("/login");

// Go back
back();

// Get current route
const currentRoute = getCurrentRoute(); // "/users/123"`;

const notificationsCode = `const { notify, success, error, warning, info } = useLumino();

// Generic notification
notify("Something happened", "info");

// Convenience methods
success("User created successfully!");
error("Failed to save user");
warning("Email already exists");
info("Loading data...");`;

const dialogsCode = `const { confirm, alert } = useLumino();

// Confirm dialog
const handleDelete = async () => {
  const confirmed = await confirm("Delete this user?");
  if (confirmed) {
    // Proceed with deletion
  }
};

// Alert dialog
const handleError = async () => {
  await alert("An error occurred!");
};`;

const loadingCode = `const { loading, showLoader, hideLoader } = useLumino();

// Global loading state
if (loading) {
  return <Spinner />;
}

// Manual control
const handleLongOperation = async () => {
  showLoader();
  try {
    await someAsyncOperation();
  } finally {
    hideLoader();
  }
};`;

const localeCode = `const { locale, setLocale, t } = useLumino();

// Get current locale
console.log(locale); // "en"

// Change locale
setLocale("fr");

// Translate
const greeting = t("common.greeting"); // "Hello"
const withParams = t("messages.welcome", { name: "John" }); // "Welcome, John!"`;

const themeCode = `const { theme, setTheme } = useLumino();

// Get current theme
console.log(theme); // "light"

// Change theme
setTheme("dark");

// Toggle theme
const toggleTheme = () => {
  setTheme(theme === "light" ? "dark" : "light");
};`;

const userCode = `const { user, isAuthenticated } = useLumino();

// Check authentication
if (!isAuthenticated) {
  return <LoginPage />;
}

// Access user data
console.log(user.name);
console.log(user.email);
console.log(user.roles);`;

const eventsCode = `const { on, off, emit, eventBus } = useLumino();
import { useEffect } from "react";

function Dashboard() {
  const lumino = useLumino();

  useEffect(() => {
    // Subscribe to events
    const unsubscribe = lumino.on("user:updated", (payload) => {
      console.log("User updated:", payload.user);
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [lumino.on]);

  const handleUpdate = () => {
    // Emit custom event
    lumino.emit("dashboard:refresh", { timestamp: Date.now() });
  };

  return <button onClick={handleUpdate}>Refresh</button>;
}`;

const storageCode = `const { storage } = useLumino();

// Local storage (persists)
storage.local.set("settings", { theme: "dark", locale: "en" });
const settings = storage.local.get<Settings>("settings");
storage.local.remove("settings");

// Session storage (tab-scoped)
storage.session.set("tempData", { id: 123 });
const tempData = storage.session.get<TempData>("tempData");
storage.session.remove("tempData");`;

const configCode = `const { config } = useLumino();

// Get config values
const apiUrl = config.baseUrl; // "https://api.example.com"
const env = config.environment; // "production"

// Get custom config
const maxUploadSize = config.get<number>("maxUploadSize");

// Check feature flags
if (config.isFeatureEnabled("darkMode")) {
  // Show dark mode toggle
}`;

const metaCode = `const { getMeta, setMeta } = useLumino();

// Set meta data (arbitrary app state)
setMeta("sidebarCollapsed", true);
setMeta("lastVisitedPage", "/dashboard");

// Get meta data
const collapsed = getMeta<boolean>("sidebarCollapsed");
const lastPage = getMeta<string>("lastVisitedPage");`;

const appContextCode = `const { app, context, initialized } = useLumino();

// Wait for initialization
if (!initialized) {
  return <Spinner />;
}

// Access app instance
console.log(app.config);
console.log(app.api);

// Access full context (advanced)
console.log(context.locale);
console.log(context.theme);`;

const fullExampleCode = `import { useLumino } from "lumino/react";
import { useEffect } from "react";

function UserDashboard() {
  const {
    // User & Auth
    user,
    isAuthenticated,

    // Navigation
    navigate,

    // Notifications
    success,
    error,

    // Loading
    loading,
    showLoader,
    hideLoader,

    // Locale
    t,
    locale,
    setLocale,

    // Events
    on,

    // Storage
    storage,
  } = useLumino();

  // Subscribe to events
  useEffect(() => {
    const unsubscribe = on("user:updated", ({ user }) => {
      success(\`Updated profile for \${user.name}\`);
    });
    return unsubscribe;
  }, [on, success]);

  // Load preferences from storage
  useEffect(() => {
    const prefs = storage.local.get<Preferences>("userPreferences");
    if (prefs?.locale && prefs.locale !== locale) {
      setLocale(prefs.locale);
    }
  }, [storage, locale, setLocale]);

  const handleLogout = async () => {
    showLoader();
    try {
      await logoutUser();
      storage.local.remove("userPreferences");
      navigate("/login");
      success(t("messages.loggedOut"));
    } catch (err) {
      error(t("errors.logoutFailed"));
    } finally {
      hideLoader();
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>{t("dashboard.welcome", { name: user.name })}</h1>
      <button onClick={handleLogout}>{t("actions.logout")}</button>
    </div>
  );
}`;

export function UseLuminoPage() {
  return (
    <>
      <h1 className="docs-page-title">useLumino</h1>
      <p className="docs-page-subtitle">
        Main hook providing access to all Lumino framework features.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>useLumino()</code> is the primary hook for accessing Lumino framework
          features. It provides a unified interface for navigation, notifications,
          loading states, locale, theme, user management, events, storage, and configuration.
        </p>
        <p>
          This is typically the only hook you need for most common operations. It returns
          an object with methods and state organized by feature area.
        </p>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Navigation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigation</h2>
        <p>
          Navigate between pages programmatically:
        </p>
        <CodeBlock code={navigationCode} language="typescript" />
      </div>

      {/* Notifications */}
      <div className="docs-section">
        <h2 className="docs-section-title">Notifications</h2>
        <p>
          Show toast notifications to users:
        </p>
        <CodeBlock code={notificationsCode} language="typescript" />
      </div>

      {/* Dialogs */}
      <div className="docs-section">
        <h2 className="docs-section-title">Dialogs</h2>
        <p>
          Show confirmation and alert dialogs:
        </p>
        <CodeBlock code={dialogsCode} language="typescript" />
      </div>

      {/* Loading States */}
      <div className="docs-section">
        <h2 className="docs-section-title">Loading States</h2>
        <p>
          Manage global loading state:
        </p>
        <CodeBlock code={loadingCode} language="typescript" />
      </div>

      {/* Locale & I18n */}
      <div className="docs-section">
        <h2 className="docs-section-title">Locale & Internationalization</h2>
        <p>
          Manage locale and translate strings:
        </p>
        <CodeBlock code={localeCode} language="typescript" />
      </div>

      {/* Theme */}
      <div className="docs-section">
        <h2 className="docs-section-title">Theme Management</h2>
        <p>
          Get and set the current theme:
        </p>
        <CodeBlock code={themeCode} language="typescript" />
      </div>

      {/* User & Auth */}
      <div className="docs-section">
        <h2 className="docs-section-title">User & Authentication</h2>
        <p>
          Access current user and authentication state:
        </p>
        <CodeBlock code={userCode} language="typescript" />
      </div>

      {/* Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">Event Bus</h2>
        <p>
          Subscribe to and emit events:
        </p>
        <CodeBlock code={eventsCode} language="typescript" />
      </div>

      {/* Storage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Browser Storage</h2>
        <p>
          Access localStorage and sessionStorage:
        </p>
        <CodeBlock code={storageCode} language="typescript" />
      </div>

      {/* Config */}
      <div className="docs-section">
        <h2 className="docs-section-title">Configuration</h2>
        <p>
          Access app configuration and feature flags:
        </p>
        <CodeBlock code={configCode} language="typescript" />
      </div>

      {/* Meta State */}
      <div className="docs-section">
        <h2 className="docs-section-title">Meta State</h2>
        <p>
          Store arbitrary application state:
        </p>
        <CodeBlock code={metaCode} language="typescript" />
      </div>

      {/* App Context */}
      <div className="docs-section">
        <h2 className="docs-section-title">App Context</h2>
        <p>
          Access app instance and context (advanced):
        </p>
        <CodeBlock code={appContextCode} language="typescript" />
      </div>

      {/* Return Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">Return Type</h2>
        <CodeBlock
          code={`interface UseLuminoReturn {
  // App
  app: App;
  initialized: boolean;
  context: AppContext;

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
  user: User | null;
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
  eventBus: EventBus;

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
}`}
          language="typescript"
        />
      </div>

      {/* Full Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <p>
          A comprehensive example using multiple features:
        </p>
        <CodeBlock code={fullExampleCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Destructure what you need</strong> - Only extract the features you use</li>
          <li><strong>Use convenience methods</strong> - Use success/error instead of notify</li>
          <li><strong>Clean up event subscriptions</strong> - Return unsubscribe from useEffect</li>
          <li><strong>Handle loading states</strong> - Always show loading indicators</li>
          <li><strong>Use type parameters</strong> - Type storage.get() calls for safety</li>
          <li><strong>Prefer specialized hooks</strong> - Use useNavigation() if only need navigation</li>
        </ul>
      </div>
    </>
  );
}
