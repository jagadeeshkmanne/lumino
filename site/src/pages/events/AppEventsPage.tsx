/**
 * App Events Documentation
 */

import React from "react";

export function AppEventsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">App Events</h1>
      <p className="docs-page-subtitle">
        Application-level events for initialization, configuration, errors, and locale changes.
      </p>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          App events are emitted during application lifecycle and configuration changes.
          These global events help you track application state, handle errors centrally,
          and respond to configuration or locale changes.
        </p>
        <pre className="docs-code">{`import { eventEmitter, eventBus } from "lumino/core";

// Method 1: Direct event subscription
eventEmitter.on("app:ready", () => {
  console.log("Application is ready!");
});

// Method 2: Using EventBus (recommended)
eventBus.app.onReady(() => {
  console.log("Application is ready!");
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>App Lifecycle Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>app:init</code></td>
              <td><code>{"{}"}</code></td>
              <td>Application initialization starts</td>
            </tr>
            <tr>
              <td><code>app:ready</code></td>
              <td><code>{"{}"}</code></td>
              <td>Application is fully initialized and ready</td>
            </tr>
            <tr>
              <td><code>app:error</code></td>
              <td><code>{"{ error: any }"}</code></td>
              <td>Application-level error occurs</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Lifecycle Tracking</h3>
        <pre className="docs-code">{`// Track app initialization
eventBus.app.onInit(() => {
  console.log("Application initializing...");

  // Show splash screen
  showSplashScreen();

  // Initialize services
  initializeServices();
});

// Track when app is ready
eventBus.app.onReady(() => {
  console.log("Application ready!");

  // Hide splash screen
  hideSplashScreen();

  // Track analytics
  analytics.track("app_ready", {
    timestamp: new Date().toISOString()
  });

  // Initialize features that depend on app being ready
  initializeFeatures();
});

// Handle app-level errors
eventBus.app.onError((payload) => {
  console.error("Application error:", payload.error);

  // Log to error tracking service
  errorTracker.captureException(payload.error);

  // Show error boundary UI
  showErrorBoundary(payload.error);
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Configuration Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>app:config:change</code></td>
              <td><code>{"{ key: string; value: any }"}</code></td>
              <td>Application configuration value changes</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Configuration Handling</h3>
        <pre className="docs-code">{`// Track configuration changes
eventBus.app.onConfigChange((payload) => {
  console.log(\`Config changed: \${payload.key} = \${payload.value}\`);

  // Handle specific config changes
  if (payload.key === "theme") {
    applyTheme(payload.value);
  } else if (payload.key === "timezone") {
    updateTimezone(payload.value);
  } else if (payload.key === "debug") {
    setDebugMode(payload.value);
  }
});

// Persist config changes
eventBus.app.onConfigChange((payload) => {
  localStorage.setItem(\`config:\${payload.key}\`, JSON.stringify(payload.value));
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Locale Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>app:locale:change</code></td>
              <td><code>{"{ locale: string; previousLocale: string }"}</code></td>
              <td>Application locale/language changes</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Locale Change Handling</h3>
        <pre className="docs-code">{`// Handle locale changes
eventBus.app.onLocaleChange((payload) => {
  console.log(\`Locale changed from \${payload.previousLocale} to \${payload.locale}\`);

  // Load translations for new locale
  loadTranslations(payload.locale);

  // Update date/number formats
  updateFormats(payload.locale);

  // Reload current page with new locale
  reloadCurrentPage();

  // Track analytics
  analytics.track("locale_changed", {
    from: payload.previousLocale,
    to: payload.locale
  });
});

// Persist locale preference
eventBus.app.onLocaleChange((payload) => {
  localStorage.setItem("locale", payload.locale);
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>

        <h3>1. Application Startup Sequence</h3>
        <pre className="docs-code">{`// Coordinate startup tasks
eventBus.app.onInit(() => {
  console.log("1. App Init - Loading configuration");
  loadConfiguration();
});

eventBus.app.onReady(() => {
  console.log("2. App Ready - Initializing features");

  // Initialize in sequence
  initAuthentication()
    .then(() => initUserPreferences())
    .then(() => initAnalytics())
    .then(() => initFeatureFlags())
    .then(() => {
      console.log("All features initialized");
    });
});`}</pre>

        <h3>2. Global Error Handling</h3>
        <pre className="docs-code">{`// Centralized error handling
eventBus.app.onError((payload) => {
  // Log to console
  console.error("App Error:", payload.error);

  // Send to error tracking service
  errorTracker.captureException(payload.error, {
    tags: {
      source: "app_event"
    }
  });

  // Show user-friendly error message
  if (payload.error.name === "NetworkError") {
    eventBus.ui.emitNotify({
      message: "Network connection lost. Please check your internet.",
      type: "error"
    });
  } else {
    eventBus.ui.emitNotify({
      message: "Something went wrong. Please try again.",
      type: "error"
    });
  }

  // Track error metrics
  analytics.track("app_error", {
    errorName: payload.error.name,
    errorMessage: payload.error.message
  });
});`}</pre>

        <h3>3. Feature Flags Management</h3>
        <pre className="docs-code">{`// Update features when config changes
const activeFeatures = new Set<string>();

eventBus.app.onConfigChange((payload) => {
  if (payload.key.startsWith("feature:")) {
    const featureName = payload.key.replace("feature:", "");

    if (payload.value === true) {
      activeFeatures.add(featureName);
      console.log(\`Feature enabled: \${featureName}\`);
      enableFeature(featureName);
    } else {
      activeFeatures.delete(featureName);
      console.log(\`Feature disabled: \${featureName}\`);
      disableFeature(featureName);
    }
  }
});

function isFeatureEnabled(name: string): boolean {
  return activeFeatures.has(name);
}`}</pre>

        <h3>4. Theme Management</h3>
        <pre className="docs-code">{`// Handle theme changes
eventBus.app.onConfigChange((payload) => {
  if (payload.key === "theme") {
    const theme = payload.value; // "light", "dark", "auto"

    // Apply theme to DOM
    document.documentElement.setAttribute("data-theme", theme);

    // Update CSS variables
    if (theme === "dark") {
      applyDarkTheme();
    } else if (theme === "light") {
      applyLightTheme();
    } else {
      applyAutoTheme();
    }

    // Persist preference
    localStorage.setItem("theme", theme);
  }
});`}</pre>

        <h3>5. Debug Mode Toggle</h3>
        <pre className="docs-code">{`// Enable/disable debug features
eventBus.app.onConfigChange((payload) => {
  if (payload.key === "debug") {
    if (payload.value === true) {
      // Enable debug features
      console.log("Debug mode enabled");
      enableDebugPanel();
      enableVerboseLogging();

      // Log all events
      eventEmitter.onAny(({ event, payload }) => {
        console.log(\`[EVENT] \${event}\`, payload);
      });
    } else {
      console.log("Debug mode disabled");
      disableDebugPanel();
      disableVerboseLogging();
    }
  }
});`}</pre>

        <h3>6. Multi-Locale Support</h3>
        <pre className="docs-code">{`// Handle locale switching with translations
const translations = new Map<string, any>();

eventBus.app.onLocaleChange(async (payload) => {
  console.log(\`Switching locale to \${payload.locale}\`);

  // Show loading indicator
  eventBus.ui.emitLoaderShow();

  try {
    // Load translation file
    const response = await fetch(\`/i18n/\${payload.locale}.json\`);
    const data = await response.json();
    translations.set(payload.locale, data);

    // Update i18n library
    i18n.changeLanguage(payload.locale);

    // Update moment/date-fns locale
    moment.locale(payload.locale);

    // Update number formats
    updateNumberFormat(payload.locale);

    // Hide loading indicator
    eventBus.ui.emitLoaderHide();

    // Show success message
    eventBus.ui.emitNotify({
      message: "Language changed successfully",
      type: "success"
    });
  } catch (error) {
    console.error("Failed to load translations:", error);
    eventBus.ui.emitLoaderHide();
    eventBus.ui.emitNotify({
      message: "Failed to change language. Please try again.",
      type: "error"
    });
  }
});`}</pre>

        <h3>7. Performance Monitoring</h3>
        <pre className="docs-code">{`// Track app startup time
let startTime: number;

eventBus.app.onInit(() => {
  startTime = performance.now();
});

eventBus.app.onReady(() => {
  const duration = performance.now() - startTime;
  console.log(\`App startup time: \${duration.toFixed(2)}ms\`);

  // Track in analytics
  analytics.track("app_startup", {
    duration: duration,
    timestamp: new Date().toISOString()
  });

  // Alert if startup is slow
  if (duration > 3000) {
    console.warn("Slow app startup detected");
    monitoringService.alert({
      type: "slow_startup",
      duration: duration
    });
  }
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Auth Events</h2>
        <p>
          While not strictly "app" events, auth events are closely related and affect the entire application:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>auth:login</code></td>
              <td><code>{"{ userId: string | number }"}</code></td>
              <td>User logs in successfully</td>
            </tr>
            <tr>
              <td><code>auth:logout</code></td>
              <td><code>{"{}"}</code></td>
              <td>User logs out</td>
            </tr>
            <tr>
              <td><code>auth:token:refresh</code></td>
              <td><code>{"{}"}</code></td>
              <td>Auth token is refreshed</td>
            </tr>
            <tr>
              <td><code>auth:token:expired</code></td>
              <td><code>{"{}"}</code></td>
              <td>Auth token expires</td>
            </tr>
            <tr>
              <td><code>auth:unauthorized</code></td>
              <td><code>{"{ path: string }"}</code></td>
              <td>User attempts unauthorized access</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Auth Event Handling</h3>
        <pre className="docs-code">{`// Handle login
eventBus.auth.onLogin((payload) => {
  console.log(\`User logged in: \${payload.userId}\`);

  // Initialize user-specific features
  initUserFeatures(payload.userId);

  // Load user preferences
  loadUserPreferences(payload.userId);

  // Track analytics
  analytics.identify(payload.userId);
});

// Handle logout
eventBus.auth.onLogout(() => {
  console.log("User logged out");

  // Clear user data
  clearUserData();

  // Redirect to login
  window.location.href = "/login";
});

// Handle token expiration
eventBus.auth.onTokenExpired(() => {
  console.log("Token expired");

  // Show re-login dialog
  showReLoginDialog();
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Use EventBus for cleaner code</strong> - <code>eventBus.app.onReady()</code> is more readable</li>
          <li><strong>Handle errors gracefully</strong> - Always subscribe to <code>app:error</code></li>
          <li><strong>Track startup performance</strong> - Monitor time between init and ready</li>
          <li><strong>Coordinate startup tasks</strong> - Use app events to sequence initialization</li>
          <li><strong>Persist config changes</strong> - Save user preferences to localStorage</li>
          <li><strong>Reload on locale change</strong> - Ensure all UI reflects new language</li>
          <li><strong>Test error scenarios</strong> - Verify error handling works as expected</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>React Hook Integration</h2>
        <pre className="docs-code">{`import { useEffect } from "react";
import { eventBus } from "lumino/core";

function AppMonitor() {
  useEffect(() => {
    const unsubscribe1 = eventBus.app.onReady(() => {
      console.log("App is ready");
    });

    const unsubscribe2 = eventBus.app.onError((payload) => {
      console.error("App error:", payload.error);
    });

    const unsubscribe3 = eventBus.app.onConfigChange((payload) => {
      console.log("Config changed:", payload);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    };
  }, []);

  return null;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>TypeScript Type Definitions</h2>
        <pre className="docs-code">{`export interface AppEvents {
  "app:init": {};
  "app:ready": {};
  "app:error": { error: any };
  "app:config:change": { key: string; value: any };
  "app:locale:change": { locale: string; previousLocale: string };
}

export interface AuthEvents {
  "auth:login": { userId: string | number };
  "auth:logout": {};
  "auth:token:refresh": {};
  "auth:token:expired": {};
  "auth:unauthorized": { path: string };
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li><strong>Custom Events</strong> - Create your own domain-specific events</li>
          <li><strong>Form Events</strong> - Learn about form lifecycle events</li>
          <li><strong>API Events</strong> - Learn about API request events</li>
          <li><strong>EventEmitter</strong> - Deep dive into the EventEmitter class</li>
        </ul>
      </div>
    </div>
  );
}
