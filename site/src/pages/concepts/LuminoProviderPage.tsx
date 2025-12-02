/**
 * LuminoProvider Documentation Page
 *
 * Documents how to set up and use LuminoProvider.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function LuminoProviderPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">LuminoProvider</h1>
      <p className="docs-page-subtitle">
        LuminoProvider is the root component that provides context, state management,
        and configuration to your entire Lumino application.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        LuminoProvider is required at the root of any Lumino application.
      </div>

      <div className="docs-section">
        <h2>Basic Setup</h2>
        <pre className="docs-code">{`import React from "react";
import ReactDOM from "react-dom/client";
import { createApp, LuminoProvider } from "lumino/react";
import { App } from "./App";

// 1. Create the app instance with configuration
const app = createApp({
  name: "My Application",
  version: "1.0.0",
  baseUrl: "https://api.example.com",
  defaultLocale: "en",
  defaultTheme: "light",
});

// 2. Wrap your app with LuminoProvider
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LuminoProvider app={app}>
      <App />
    </LuminoProvider>
  </React.StrictMode>
);`}</pre>
      </div>

      <div className="docs-section">
        <h2>App Configuration</h2>
        <p>The <code>createApp()</code> function accepts these configuration options:</p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>name</code></td>
              <td>string</td>
              <td>Application name</td>
            </tr>
            <tr>
              <td><code>version</code></td>
              <td>string</td>
              <td>Application version</td>
            </tr>
            <tr>
              <td><code>baseUrl</code></td>
              <td>string</td>
              <td>Base URL for API calls</td>
            </tr>
            <tr>
              <td><code>defaultLocale</code></td>
              <td>string</td>
              <td>Default language (e.g., "en", "es")</td>
            </tr>
            <tr>
              <td><code>defaultTheme</code></td>
              <td>string</td>
              <td>Default theme ("light" | "dark")</td>
            </tr>
            <tr>
              <td><code>authTokenKey</code></td>
              <td>string</td>
              <td>Storage key for auth token (default: "auth_token")</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Provider Props</h2>
        <pre className="docs-code">{`interface LuminoProviderProps {
  /** The Lumino app instance (from createApp) */
  app: LuminoApp;
  children: ReactNode;
  /** Custom navigation adapter (optional) */
  navigationAdapter?: NavigationAdapter;
  /** Custom UI adapter (optional) */
  uiAdapter?: UIAdapter;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>What LuminoProvider Provides</h2>

        <h3>1. AppContext</h3>
        <p>Access global application context in any component:</p>
        <pre className="docs-code">{`import { useLumino } from "lumino/react";

function MyComponent() {
  const { appContext } = useLumino();

  // User & Auth
  const user = appContext.user;
  const isAuth = appContext.isAuthenticated();

  // Navigation
  appContext.navigate("/dashboard");
  appContext.redirect("/login");
  appContext.back();

  // UI
  appContext.showLoader();
  appContext.hideLoader();
  appContext.notify("Success!", "success");
  const confirmed = await appContext.confirm("Are you sure?");

  // API
  const data = await appContext.call(MyApi);

  // Config
  const baseUrl = appContext.config.baseUrl;

  // I18n
  const text = appContext.i18n.t("greeting");

  // Storage
  appContext.storage.local.set("key", value);
  const value = appContext.storage.local.get("key");
}`}</pre>

        <h3>2. State Management</h3>
        <p>Global state is managed automatically:</p>
        <pre className="docs-code">{`// Access via useLumino hook
const { loading, locale, theme, user, initialized } = useLumino();

// Loading state
if (loading) return <Spinner />;

// Theme-aware rendering
<div className={\`app theme-\${theme}\`}>

// Locale-aware content
<FormattedDate locale={locale} value={date} />`}</pre>

        <h3>3. Event System</h3>
        <p>Subscribe to application events:</p>
        <pre className="docs-code">{`import { useEffect } from "react";
import { eventEmitter } from "lumino/core";

function MyComponent() {
  useEffect(() => {
    const unsubscribe = eventEmitter.on("form:submit:success", (data) => {
      console.log("Form submitted:", data);
    });

    return () => unsubscribe();
  }, []);
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom Navigation Adapter</h2>
        <p>Override default navigation behavior:</p>
        <pre className="docs-code">{`import { LuminoProvider, NavigationAdapter } from "lumino/react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const navigationAdapter: NavigationAdapter = {
    navigate: (path) => navigate(path),
    redirect: (path) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    getCurrentRoute: () => location.pathname,
    getRouteParams: () => params,
    getQueryParams: () => {
      const search = new URLSearchParams(location.search);
      return Object.fromEntries(search.entries());
    },
  };

  return (
    <LuminoProvider app={app} navigationAdapter={navigationAdapter}>
      {children}
    </LuminoProvider>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom UI Adapter</h2>
        <p>Override default UI behaviors:</p>
        <pre className="docs-code">{`import { LuminoProvider, UIAdapter } from "lumino/react";
import { toast } from "react-toastify";
import { openModal } from "./modals";

const uiAdapter: UIAdapter = {
  showLoader: () => {
    document.body.classList.add("loading");
  },
  hideLoader: () => {
    document.body.classList.remove("loading");
  },
  notify: (message, type = "info") => {
    toast[type](message);
  },
  confirm: async (message) => {
    return window.confirm(message);
  },
  alert: async (message) => {
    window.alert(message);
  },
  openModal: async (modal) => {
    return openModal(modal);
  },
  closeModal: () => {
    // Close current modal
  },
};

<LuminoProvider app={app} uiAdapter={uiAdapter}>
  {children}
</LuminoProvider>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Hooks Available</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Hook</th>
              <th>Returns</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>useLumino()</code></td>
              <td>LuminoContextValue</td>
              <td>Full Lumino context</td>
            </tr>
            <tr>
              <td><code>useApp()</code></td>
              <td>LuminoApp</td>
              <td>App instance</td>
            </tr>
            <tr>
              <td><code>useAppContext()</code></td>
              <td>AppContext</td>
              <td>Application context</td>
            </tr>
            <tr>
              <td><code>useRouter()</code></td>
              <td>RouterContext</td>
              <td>Navigation utilities</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Initialization</h2>
        <p>
          LuminoProvider automatically initializes the app on mount. You can check
          initialization status:
        </p>
        <pre className="docs-code">{`function App() {
  const { initialized, loading } = useLumino();

  if (!initialized) {
    return <SplashScreen />;
  }

  if (loading) {
    return <GlobalLoader />;
  }

  return <MainContent />;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Single Provider</strong> - Only use one LuminoProvider at
            the root of your app
          </li>
          <li>
            <strong>Create App Once</strong> - Call createApp() outside of
            components to avoid recreating on each render
          </li>
          <li>
            <strong>Custom Adapters</strong> - Use adapters to integrate with
            your existing navigation and UI libraries
          </li>
          <li>
            <strong>Check Initialization</strong> - Ensure the app is initialized
            before rendering protected content
          </li>
        </ul>
      </div>
    </div>
  );
}
