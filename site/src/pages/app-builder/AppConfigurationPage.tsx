/**
 * App Configuration Page
 *
 * Documents App class configuration options.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function AppConfigurationPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">App Configuration</h1>
      <p className="docs-page-subtitle">
        Configure your Lumino application with metadata, settings, and
        initialization options.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>App Metadata</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Application title (shown in browser tab)
    this.setTitle("My Application");

    // Description (for SEO)
    this.setDescription("A powerful web application");

    // Favicon
    this.setFavicon("/favicon.ico");

    // App version
    this.setVersion("1.0.0");

    // Base URL for routing
    this.setBasePath("/app");
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Environment Configuration</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Access environment variables
    const apiUrl = this.env.API_URL;
    const isDev = this.env.NODE_ENV === "development";

    // Configure based on environment
    this.configureApi({
      baseUrl: apiUrl,
      debug: isDev,
    });

    // Development-only features
    if (isDev) {
      this.enableDevTools();
      this.enableHotReload();
    }
  }
}

// Environment variables (from .env)
// VITE_API_URL=https://api.example.com
// VITE_APP_TITLE=My App`}</pre>
      </div>

      <div className="docs-section">
        <h2>Feature Flags</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Define feature flags
    this.configureFeatures({
      newDashboard: true,
      darkMode: true,
      betaFeatures: this.env.ENABLE_BETA === "true",
      analytics: this.env.NODE_ENV === "production",
    });

    // Use feature flags
    if (this.feature("newDashboard")) {
      this.addPage("/", NewDashboardPage);
    } else {
      this.addPage("/", LegacyDashboardPage);
    }

    // Conditional sidebar items
    this.addSidebar()
      .addLink("Dashboard", "/", "home")
      .addLinkIf(this.feature("betaFeatures"), "Beta", "/beta", "flask")
      .endSidebar();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Localization</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Configure i18n
    this.configureI18n({
      defaultLocale: "en",
      supportedLocales: ["en", "es", "fr", "de"],

      // Load translations
      loadTranslations: async (locale) => {
        const translations = await import(\`./locales/\${locale}.json\`);
        return translations.default;
      },

      // Detect user locale
      detectLocale: () => {
        return navigator.language.split("-")[0];
      },
    });
  }
}

// Use translations in pages
class MyPage extends Page {
  configure() {
    this.setTitle(this.t("page.title"));

    this.addTextField("name")
      .label(this.t("form.name.label"))
      .placeholder(this.t("form.name.placeholder"))
      .endField();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Error Handling</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Configure error handling
    this.configureErrorHandling({
      // Custom error page
      errorPage: ErrorPage,

      // 404 page
      notFoundPage: NotFoundPage,

      // Global error handler
      onError: (error, errorInfo) => {
        // Log to error service
        errorService.log(error, errorInfo);

        // Show toast notification
        this.toast.error("An error occurred");
      },

      // Show error boundary for component errors
      showErrorBoundary: true,

      // Show stack trace in development
      showStackTrace: this.env.NODE_ENV === "development",
    });
  }

  // Override for custom error handling
  onError(error: Error) {
    if (error.name === "NetworkError") {
      this.toast.error("Network connection lost");
    } else if (error.name === "AuthError") {
      this.navigate("/login");
    } else {
      // Default handling
      super.onError(error);
    }
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Analytics</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Configure analytics
    this.configureAnalytics({
      // Provider
      provider: "google",  // or "mixpanel", "amplitude", "custom"
      trackingId: this.env.GA_TRACKING_ID,

      // Auto-track page views
      trackPageViews: true,

      // Auto-track clicks
      trackClicks: true,

      // Custom events
      events: {
        signup: { category: "User", action: "Signup" },
        purchase: { category: "Commerce", action: "Purchase" },
      },

      // User identification
      identifyUser: (user) => ({
        userId: user.id,
        traits: {
          email: user.email,
          plan: user.plan,
        },
      }),
    });

    // Track events
    this.analytics.track("signup", { method: "email" });
    this.analytics.track("purchase", { amount: 99.99 });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Performance</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Configure performance optimizations
    this.configurePerformance({
      // Lazy load pages
      lazyLoadPages: true,

      // Preload linked pages
      preloadLinks: true,

      // Cache API responses
      cacheApi: true,
      cacheDuration: 5 * 60 * 1000,  // 5 minutes

      // Enable service worker
      serviceWorker: true,

      // Performance monitoring
      monitoring: {
        enabled: true,
        sampleRate: 0.1,  // 10% of users
        onMetric: (metric) => {
          // Report to analytics
          this.analytics.track("performance", metric);
        },
      },
    });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Security</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Configure security
    this.configureSecurity({
      // Content Security Policy
      csp: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "https://cdn.example.com"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
      },

      // CSRF protection
      csrf: {
        enabled: true,
        tokenHeader: "X-CSRF-Token",
      },

      // XSS protection
      sanitizeInput: true,

      // Rate limiting
      rateLimit: {
        enabled: true,
        maxRequests: 100,
        windowMs: 60 * 1000,  // 1 minute
      },
    });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Plugins</h2>
        <pre className="docs-code">{`import { analyticsPlugin, i18nPlugin, authPlugin } from "lumino/plugins";

class MyApp extends App {
  configure() {
    // Register plugins
    this.use(analyticsPlugin({
      provider: "google",
      trackingId: "GA-XXXXX",
    }));

    this.use(i18nPlugin({
      defaultLocale: "en",
    }));

    this.use(authPlugin({
      provider: "oauth",
    }));

    // Custom plugin
    this.use({
      name: "myPlugin",
      install: (app) => {
        // Add methods to app
        app.myFeature = () => {
          // ...
        };
      },
    });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Lifecycle Hooks</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Register lifecycle hooks
    this.on("beforeMount", () => {
      console.log("App is about to mount");
    });

    this.on("mounted", () => {
      console.log("App has mounted");
    });

    this.on("beforeUnmount", () => {
      console.log("App is about to unmount");
    });

    this.on("routeChange", (from, to) => {
      console.log(\`Route changed from \${from} to \${to}\`);
    });

    this.on("stateChange", (state) => {
      console.log("Global state changed", state);
    });

    this.on("error", (error) => {
      console.error("Error occurred", error);
    });
  }

  // Or use lifecycle methods
  async onBeforeMount() {
    await this.loadInitialData();
  }

  async onMount() {
    this.startBackgroundTasks();
  }

  async onBeforeUnmount() {
    this.cleanup();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Configuration Options Summary</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>setTitle()</code></td>
              <td>Set application title</td>
            </tr>
            <tr>
              <td><code>setLayout()</code></td>
              <td>Set layout pattern</td>
            </tr>
            <tr>
              <td><code>configureAuth()</code></td>
              <td>Configure authentication</td>
            </tr>
            <tr>
              <td><code>configureApi()</code></td>
              <td>Configure API client</td>
            </tr>
            <tr>
              <td><code>configureTheme()</code></td>
              <td>Configure theme and styles</td>
            </tr>
            <tr>
              <td><code>configureState()</code></td>
              <td>Configure global state</td>
            </tr>
            <tr>
              <td><code>configureI18n()</code></td>
              <td>Configure localization</td>
            </tr>
            <tr>
              <td><code>configureAnalytics()</code></td>
              <td>Configure analytics</td>
            </tr>
            <tr>
              <td><code>configureErrorHandling()</code></td>
              <td>Configure error handling</td>
            </tr>
            <tr>
              <td><code>use()</code></td>
              <td>Register plugins</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Configure early</strong> - Set up all configuration in
            configure() before mounting
          </li>
          <li>
            <strong>Use environment variables</strong> - Never hardcode
            sensitive values
          </li>
          <li>
            <strong>Handle errors gracefully</strong> - Always implement error
            handling
          </li>
          <li>
            <strong>Lazy load where possible</strong> - Improve initial load
            time
          </li>
          <li>
            <strong>Test configuration</strong> - Verify settings in different
            environments
          </li>
        </ul>
      </div>
    </div>
  );
}
