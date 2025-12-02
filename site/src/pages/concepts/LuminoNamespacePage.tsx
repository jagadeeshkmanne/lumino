/**
 * Lumino Namespace Documentation Page
 *
 * Documents the lumino() function and namespace pattern.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function LuminoNamespacePage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Lumino Namespace</h1>
      <p className="docs-page-subtitle">
        The <code>lumino()</code> function is the main entry point for configuring
        and building Lumino applications. It provides a fluent API for application setup.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        The lumino() function is the foundation of every Lumino application.
      </div>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>lumino()</code> function creates a Lumino application builder
          that allows you to configure every aspect of your application:
        </p>
        <pre className="docs-code">{`import { lumino } from "lumino/core";

// Create and configure your application
const app = lumino()
  .name("My Application")
  .version("1.0.0")
  .baseUrl("https://api.example.com")
  .theme("light")
  .locale("en")
  .build();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Configuration</h2>
        <p>
          The builder provides methods for setting basic application properties:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.name()</code></td>
              <td>string</td>
              <td>Sets the application name</td>
            </tr>
            <tr>
              <td><code>.version()</code></td>
              <td>string</td>
              <td>Sets the application version</td>
            </tr>
            <tr>
              <td><code>.baseUrl()</code></td>
              <td>string</td>
              <td>Sets the base URL for API calls</td>
            </tr>
            <tr>
              <td><code>.theme()</code></td>
              <td>"light" | "dark"</td>
              <td>Sets the default theme</td>
            </tr>
            <tr>
              <td><code>.locale()</code></td>
              <td>string</td>
              <td>Sets the default locale (e.g., "en", "es")</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Complete Example</h2>
        <pre className="docs-code">{`import { lumino } from "lumino/core";
import { LuminoProvider } from "lumino/react";
import { SaltUIAdapter } from "lumino/salt";

// 1. Create the application
const app = lumino()
  // Basic info
  .name("Enterprise CRM")
  .version("2.0.0")

  // API configuration
  .baseUrl("https://api.mycrm.com/v1")
  .authTokenKey("crm_auth_token")

  // UI preferences
  .theme("light")
  .locale("en")

  // UI adapter for components
  .uiAdapter(SaltUIAdapter)

  // Register APIs
  .registerApi(CustomersApi)
  .registerApi(OrdersApi)
  .registerApi(ProductsApi)

  // Register pages
  .registerPage("/customers", CustomerListPage)
  .registerPage("/customers/:id", CustomerDetailPage)
  .registerPage("/orders", OrderListPage)

  // Build the app
  .build();

// 2. Use in your React app
function Root() {
  return (
    <LuminoProvider app={app}>
      <App />
    </LuminoProvider>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>API Registration</h2>
        <p>
          Register API classes that will be available throughout your application:
        </p>
        <pre className="docs-code">{`import { Api, CrudApi } from "lumino/core";

// Define an API class
class CustomersApi extends CrudApi<Customer> {
  constructor() {
    super("/customers");
  }
}

// Register it with the app
const app = lumino()
  .registerApi(CustomersApi)
  .registerApi(OrdersApi)
  .registerApi(ProductsApi)
  .build();

// Use it in components
function CustomerPage() {
  const { appContext } = useLumino();

  const loadCustomers = async () => {
    const customers = await appContext.call(CustomersApi, "list");
    return customers;
  };
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Registration</h2>
        <p>
          Register pages with their routes:
        </p>
        <pre className="docs-code">{`import { Page } from "lumino/core";

// Define page classes
class DashboardPage extends Page {
  configure() {
    this.title("Dashboard")
      .icon("dashboard")
      .addSection("metrics")
        .addComponent(MetricsWidget)
      .endSection();
  }
}

// Register pages
const app = lumino()
  .registerPage("/", DashboardPage)
  .registerPage("/customers", CustomerListPage)
  .registerPage("/customers/:id", CustomerDetailPage)
  .registerPage("/orders", OrderListPage)
  .registerPage("/settings", SettingsPage)
  .build();`}</pre>
      </div>

      <div className="docs-section">
        <h2>UI Adapter Configuration</h2>
        <p>
          Set the UI adapter that provides component implementations:
        </p>
        <pre className="docs-code">{`import { SaltUIAdapter } from "lumino/salt";
import { MaterialUIAdapter } from "lumino/material";
import { CustomUIAdapter } from "./adapters/CustomUIAdapter";

// Use Salt Design System
const app = lumino()
  .uiAdapter(SaltUIAdapter)
  .build();

// Or use Material UI
const app = lumino()
  .uiAdapter(MaterialUIAdapter)
  .build();

// Or use a custom adapter
const app = lumino()
  .uiAdapter(CustomUIAdapter)
  .build();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Authentication Configuration</h2>
        <p>
          Configure authentication settings:
        </p>
        <pre className="docs-code">{`const app = lumino()
  // Token storage key
  .authTokenKey("my_app_token")

  // Authentication handlers
  .onLogin(async (credentials) => {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const { token, user } = await response.json();
    return { token, user };
  })
  .onLogout(async () => {
    await fetch("/api/logout", { method: "POST" });
  })
  .onTokenRefresh(async (currentToken) => {
    const response = await fetch("/api/refresh", {
      headers: { Authorization: \`Bearer \${currentToken}\` },
    });
    return response.json();
  })

  .build();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Error Handling</h2>
        <p>
          Configure global error handling:
        </p>
        <pre className="docs-code">{`const app = lumino()
  .onError((error, context) => {
    console.error("Application error:", error);

    // Log to monitoring service
    Sentry.captureException(error, {
      extra: context,
    });

    // Show user-friendly message
    context.notify("An error occurred. Please try again.", "error");
  })
  .onApiError((error, request) => {
    if (error.status === 401) {
      context.redirect("/login");
    } else if (error.status === 403) {
      context.notify("You don't have permission to do that.", "warning");
    }
  })
  .build();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Internationalization (i18n)</h2>
        <p>
          Configure internationalization:
        </p>
        <pre className="docs-code">{`const app = lumino()
  .locale("en")
  .supportedLocales(["en", "es", "fr", "de", "ja"])
  .translations({
    en: {
      greeting: "Hello",
      save: "Save",
      cancel: "Cancel",
    },
    es: {
      greeting: "Hola",
      save: "Guardar",
      cancel: "Cancelar",
    },
  })
  .dateFormat("MM/DD/YYYY")
  .numberFormat({
    decimal: ".",
    thousands: ",",
    currency: "USD",
  })
  .build();

// Use in components
function MyComponent() {
  const { appContext } = useLumino();
  const t = appContext.i18n.t;

  return (
    <div>
      <h1>{t("greeting")}</h1>
      <button>{t("save")}</button>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Storage Configuration</h2>
        <p>
          Configure storage adapters:
        </p>
        <pre className="docs-code">{`const app = lumino()
  .storage({
    // Use custom storage implementation
    local: {
      get: (key) => localStorage.getItem(key),
      set: (key, value) => localStorage.setItem(key, value),
      remove: (key) => localStorage.removeItem(key),
    },
    session: {
      get: (key) => sessionStorage.getItem(key),
      set: (key, value) => sessionStorage.setItem(key, value),
      remove: (key) => sessionStorage.removeItem(key),
    },
  })
  .build();

// Use in components
function Settings() {
  const { appContext } = useLumino();

  // Store user preferences
  appContext.storage.local.set("theme", "dark");
  const theme = appContext.storage.local.get("theme");
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Builder Methods Reference</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.name()</code></td>
              <td>Set application name</td>
            </tr>
            <tr>
              <td><code>.version()</code></td>
              <td>Set application version</td>
            </tr>
            <tr>
              <td><code>.baseUrl()</code></td>
              <td>Set API base URL</td>
            </tr>
            <tr>
              <td><code>.theme()</code></td>
              <td>Set default theme</td>
            </tr>
            <tr>
              <td><code>.locale()</code></td>
              <td>Set default locale</td>
            </tr>
            <tr>
              <td><code>.uiAdapter()</code></td>
              <td>Set UI component adapter</td>
            </tr>
            <tr>
              <td><code>.registerApi()</code></td>
              <td>Register an API class</td>
            </tr>
            <tr>
              <td><code>.registerPage()</code></td>
              <td>Register a page with route</td>
            </tr>
            <tr>
              <td><code>.authTokenKey()</code></td>
              <td>Set auth token storage key</td>
            </tr>
            <tr>
              <td><code>.onLogin()</code></td>
              <td>Set login handler</td>
            </tr>
            <tr>
              <td><code>.onLogout()</code></td>
              <td>Set logout handler</td>
            </tr>
            <tr>
              <td><code>.onError()</code></td>
              <td>Set global error handler</td>
            </tr>
            <tr>
              <td><code>.translations()</code></td>
              <td>Set translation strings</td>
            </tr>
            <tr>
              <td><code>.storage()</code></td>
              <td>Configure storage adapters</td>
            </tr>
            <tr>
              <td><code>.build()</code></td>
              <td>Build the LuminoApp instance</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Single App Instance</strong> - Create one lumino() app instance
            and reuse it throughout your application
          </li>
          <li>
            <strong>Environment Variables</strong> - Use environment variables for
            baseUrl and other environment-specific config
          </li>
          <li>
            <strong>Register All APIs</strong> - Register all API classes at startup
            so they're available everywhere
          </li>
          <li>
            <strong>Type Safety</strong> - Use TypeScript generics for full type
            safety in API calls and page configurations
          </li>
        </ul>
      </div>
    </div>
  );
}
