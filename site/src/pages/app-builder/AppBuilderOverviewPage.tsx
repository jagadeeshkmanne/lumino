/**
 * App Builder Overview Page
 *
 * Overview of the App Builder pattern in Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function AppBuilderOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">App Builder</h1>
      <p className="docs-page-subtitle">
        Build complete applications using Lumino's declarative App Builder
        pattern with automatic routing, layout, and state management.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>What is App Builder?</h2>
        <p>
          App Builder is Lumino's high-level abstraction for creating complete
          web applications. It provides a declarative, fluent API for
          configuring:
        </p>
        <ul className="docs-list">
          <li>Application layout (navbar, sidebar, content areas)</li>
          <li>Routing and navigation</li>
          <li>Authentication and authorization</li>
          <li>Global state management</li>
          <li>Theme and styling configuration</li>
          <li>API integration</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Quick Start</h2>
        <pre className="docs-code">{`import { App } from "lumino";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { SettingsPage } from "./pages/SettingsPage";

class MyApp extends App {
  configure() {
    // App metadata
    this.setTitle("My Application");
    this.setDescription("A sample Lumino application");

    // Configure layout
    this.setLayout("app-shell");

    // Add navbar
    this.addNavbar()
      .brand()
        .logo("/logo.svg")
        .title("My App")
        .endBrand()
      .addUserMenu()
      .endNavbar();

    // Add sidebar navigation
    this.addSidebar()
      .addLink("Dashboard", "/", "home")
      .addLink("Users", "/users", "users")
      .addLink("Settings", "/settings", "settings")
      .endSidebar();

    // Register pages
    this.addPage("/", DashboardPage);
    this.addPage("/users", UsersPage);
    this.addPage("/settings", SettingsPage);
  }
}

// Mount the app
new MyApp().mount("#root");`}</pre>
      </div>

      <div className="docs-section">
        <h2>App Class Structure</h2>
        <pre className="docs-code">{`class MyApp extends App {
  // Required: Configure the application
  configure() {
    // Setup layout, routes, etc.
  }

  // Optional: Called before app mounts
  async onBeforeMount() {
    // Load initial data, check auth, etc.
  }

  // Optional: Called after app mounts
  async onMount() {
    // Start background tasks, analytics, etc.
  }

  // Optional: Called before app unmounts
  async onBeforeUnmount() {
    // Cleanup, save state, etc.
  }

  // Optional: Global error handler
  onError(error: Error) {
    // Handle uncaught errors
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Layout Patterns</h2>
        <pre className="docs-code">{`// App Shell - sidebar + header + content
this.setLayout("app-shell");

// Dashboard - collapsible sidebar + minimal header
this.setLayout("dashboard");

// Full Width - header + content (no sidebar)
this.setLayout("full-width");

// Centered - centered content (auth pages)
this.setLayout("centered");

// Custom layout
this.setLayout("custom", {
  render: (children) => (
    <CustomLayout>{children}</CustomLayout>
  ),
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Adding Pages</h2>
        <pre className="docs-code">{`// Basic page
this.addPage("/dashboard", DashboardPage);

// Page with route parameters
this.addPage("/users/:id", UserDetailPage);

// Page with query parameters
this.addPage("/search", SearchPage);

// Nested routes
this.addPage("/settings", SettingsPage, {
  children: [
    { path: "profile", page: ProfileSettingsPage },
    { path: "security", page: SecuritySettingsPage },
    { path: "notifications", page: NotificationSettingsPage },
  ],
});

// Protected page (requires auth)
this.addPage("/admin", AdminPage, {
  auth: true,
  roles: ["admin"],
});

// Page with custom layout
this.addPage("/login", LoginPage, {
  layout: "centered",
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Navigation Configuration</h2>
        <pre className="docs-code">{`// Navbar configuration
this.addNavbar()
  .position("fixed")  // or "sticky", "static"
  .variant("default")  // or "transparent", "colored"
  .brand()
    .logo("/logo.svg")
    .title("App Name")
    .onClick(() => this.navigate("/"))
    .endBrand()
  .addLinks()
    .addLink("Home", "/")
    .addLink("Features", "/features")
    .addDropdown("Products", [
      { label: "Product A", href: "/products/a" },
      { label: "Product B", href: "/products/b" },
    ])
    .endLinks()
  .addActions()
    .addSearch()
    .addNotifications()
    .addUserMenu()
    .endActions()
  .endNavbar();

// Sidebar configuration
this.addSidebar()
  .collapsible()
  .defaultCollapsed(false)
  .addSection("Main")
    .addLink("Dashboard", "/", "home")
    .addLink("Analytics", "/analytics", "chart")
    .endSection()
  .addSection("Management")
    .addLink("Users", "/users", "users")
    .addLink("Teams", "/teams", "users-group")
    .endSection()
  .addSection("Settings")
    .addLink("Settings", "/settings", "settings")
    .addLink("Help", "/help", "help-circle")
    .endSection()
  .endSidebar();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Authentication</h2>
        <pre className="docs-code">{`// Configure authentication
this.configureAuth({
  // Login page
  loginPage: "/login",

  // After login redirect
  defaultRedirect: "/dashboard",

  // Auth provider
  provider: {
    login: async (credentials) => {
      const response = await api.login(credentials);
      return response.user;
    },
    logout: async () => {
      await api.logout();
    },
    getCurrentUser: async () => {
      return api.getCurrentUser();
    },
  },

  // Token storage
  storage: "localStorage",  // or "sessionStorage", "cookie"

  // Token refresh
  refreshToken: async (token) => {
    return api.refreshToken(token);
  },
});

// Access auth in pages
class DashboardPage extends Page {
  configure() {
    const user = this.auth.user;
    const isAdmin = this.auth.hasRole("admin");

    // ...
  }

  async logout() {
    await this.auth.logout();
    this.navigate("/login");
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Theme Configuration</h2>
        <pre className="docs-code">{`// Configure theme
this.configureTheme({
  // Color scheme
  colorScheme: "light",  // or "dark", "system"

  // Brand colors
  colors: {
    primary: "#3B82F6",
    secondary: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },

  // Typography
  fonts: {
    body: "Inter, system-ui, sans-serif",
    heading: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
  },

  // Border radius
  radius: "md",  // "none", "sm", "md", "lg", "full"

  // Custom CSS variables
  variables: {
    "--sidebar-width": "280px",
    "--header-height": "64px",
  },
});

// Toggle theme
this.toggleTheme();  // Light <-> Dark
this.setTheme("dark");`}</pre>
      </div>

      <div className="docs-section">
        <h2>API Configuration</h2>
        <pre className="docs-code">{`// Configure API client
this.configureApi({
  baseUrl: "https://api.example.com",

  // Default headers
  headers: {
    "Content-Type": "application/json",
  },

  // Auth token injection
  getAuthHeader: () => ({
    Authorization: \`Bearer \${this.auth.token}\`,
  }),

  // Request interceptor
  onRequest: (config) => {
    // Modify request config
    return config;
  },

  // Response interceptor
  onResponse: (response) => {
    // Transform response
    return response.data;
  },

  // Error handler
  onError: (error) => {
    if (error.status === 401) {
      this.auth.logout();
      this.navigate("/login");
    }
  },
});

// Use API in pages
class UsersPage extends Page {
  async onMount() {
    const users = await this.api.get("/users");
    this.setState({ users });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Global State</h2>
        <pre className="docs-code">{`// Define global state
this.configureState({
  // Initial state
  user: null,
  preferences: {
    theme: "light",
    language: "en",
  },
  notifications: [],
});

// Access state in pages
class SettingsPage extends Page {
  configure() {
    const preferences = this.globalState.preferences;

    this.addSelect("language")
      .label("Language")
      .options([
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
      ])
      .value(preferences.language)
      .onChange((value) => {
        this.setGlobalState({
          preferences: { ...preferences, language: value },
        });
      })
      .endField();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Complete Example</h2>
        <pre className="docs-code">{`import { App } from "lumino";
import { DashboardPage, UsersPage, SettingsPage, LoginPage } from "./pages";

class MyApplication extends App {
  configure() {
    // Basic setup
    this.setTitle("My SaaS App");
    this.setLayout("dashboard");

    // Theme
    this.configureTheme({
      colorScheme: "system",
      colors: { primary: "#6366F1" },
    });

    // Auth
    this.configureAuth({
      loginPage: "/login",
      provider: myAuthProvider,
    });

    // API
    this.configureApi({
      baseUrl: process.env.API_URL,
    });

    // Navbar
    this.addNavbar()
      .brand()
        .logo("/logo.svg")
        .title("My App")
        .endBrand()
      .addActions()
        .addThemeToggle()
        .addNotifications()
        .addUserMenu()
        .endActions()
      .endNavbar();

    // Sidebar
    this.addSidebar()
      .collapsible()
      .addLink("Dashboard", "/", "home")
      .addLink("Users", "/users", "users")
      .addDivider()
      .addLink("Settings", "/settings", "settings")
      .endSidebar();

    // Pages
    this.addPage("/login", LoginPage, { layout: "centered" });
    this.addPage("/", DashboardPage, { auth: true });
    this.addPage("/users", UsersPage, { auth: true });
    this.addPage("/settings", SettingsPage, { auth: true });
  }

  async onBeforeMount() {
    // Check if user is already logged in
    await this.auth.checkSession();
  }
}

// Start the app
new MyApplication().mount("#root");`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Single App class</strong> - One App class per application
          </li>
          <li>
            <strong>Modular pages</strong> - Keep page logic in separate Page
            classes
          </li>
          <li>
            <strong>Configure early</strong> - Set up auth, API, theme in
            configure()
          </li>
          <li>
            <strong>Use layouts</strong> - Choose appropriate layout for your
            app type
          </li>
          <li>
            <strong>Handle errors</strong> - Implement onError for global error
            handling
          </li>
          <li>
            <strong>Lazy load</strong> - Use dynamic imports for large pages
          </li>
        </ul>
      </div>
    </div>
  );
}
