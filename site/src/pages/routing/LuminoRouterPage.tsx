/**
 * LuminoRouter Page - Documentation for the LuminoRouter component
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicUsageCode = `import { LuminoProvider } from "lumino/react";
import { LuminoRouter } from "lumino/react";
import { app } from "./app";

function App() {
  return (
    <LuminoProvider config={config}>
      <LuminoRouter />
    </LuminoProvider>
  );
}`;

const customNotFoundCode = `import { LuminoRouter } from "lumino/react";

function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "48px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}

function App() {
  return (
    <LuminoRouter notFound={<NotFoundPage />} />
  );
}`;

const basePathCode = `// If your app is hosted at example.com/app/
<LuminoRouter basePath="/app" />

// Now routes work relative to /app:
// /app/employees -> matches route "/employees"
// /app/settings -> matches route "/settings"`;

const routeChangeCallbackCode = `import { LuminoRouter, RouteMatch } from "lumino/react";

function App() {
  const handleRouteChange = (match: RouteMatch | null) => {
    if (match) {
      console.log("Navigated to:", match.path);
      console.log("Page ID:", match.pageId);
      console.log("Params:", match.params);
      console.log("Query:", match.query);

      // Track analytics
      analytics.track("page_view", {
        path: match.path,
        pageId: match.pageId,
      });
    }
  };

  return (
    <LuminoRouter onRouteChange={handleRouteChange} />
  );
}`;

const advancedCustomChildrenCode = `// Advanced: Custom routing logic with manual page rendering
import { LuminoRouter, useRouter } from "lumino/react";
import { PageRenderer } from "lumino/react";
import { PageRegistry } from "lumino/core";

function CustomRouterContent() {
  const { match } = useRouter();

  if (!match) {
    return <div>404</div>;
  }

  const page = PageRegistry.get(match.pageId);

  return (
    <div className="custom-layout">
      <header>Custom Header</header>
      <PageRenderer page={page} />
      <footer>Custom Footer</footer>
    </div>
  );
}

function App() {
  return (
    <LuminoRouter>
      <CustomRouterContent />
    </LuminoRouter>
  );
}`;

const registerRoutesCode = `import { app } from "./app";

// Register routes in app setup (before rendering)
app.registerRoute("/", "homePage");
app.registerRoute("/employees", "employeeListPage");
app.registerRoute("/employees/:id", "employeeDetailPage");
app.registerRoute("/settings", "settingsPage");

// With route guards
app.registerRoute("/admin", "adminPage", {
  guards: [() => checkAdminAuth()],
  meta: { guardRedirect: "/login" }
});

// With custom layout
import { AdminLayout } from "./layouts/AdminLayout";

app.registerRoute("/admin", "adminPage", {
  layout: AdminLayout
});`;

const routeMatchTypeCode = `interface RouteMatch {
  path: string;                    // The matched route pattern (e.g., "/employees/:id")
  pageId: string;                  // The registered page ID
  params: Record<string, string>;  // URL parameters (e.g., { id: "123" })
  query: Record<string, string>;   // Query string params (e.g., { search: "john" })
}`;

const layoutSystemCode = `import { FlexibleLayout } from "lumino/core";
import { app } from "./app";

// Define a custom layout for admin routes
class AdminLayout extends FlexibleLayout {
  configure() {
    this.header()
      .title("Admin Dashboard")
      .actions([
        { label: "Logout", action: () => logout() }
      ])
      .endHeader();

    this.sidebar()
      .items([
        { label: "Users", path: "/admin/users" },
        { label: "Settings", path: "/admin/settings" }
      ])
      .endSidebar();
  }
}

// Register route with custom layout
app.registerRoute("/admin", "adminPage", {
  layout: AdminLayout
});

// The router will automatically use AdminLayout for /admin route`;

const eventEmitterCode = `import { eventEmitter } from "lumino/core";

// Listen to navigation events
eventEmitter.on("navigation:start", ({ from, to }) => {
  console.log(\`Navigating from \${from} to \${to}\`);
});

eventEmitter.on("navigation:end", ({ from, to }) => {
  console.log(\`Navigation complete: \${to}\`);
});

eventEmitter.on("navigation:blocked", ({ from, to, reason }) => {
  console.warn(\`Navigation blocked: \${reason}\`);
  // Show toast notification
  toast.error("Access denied");
});`;

const initializationCode = `// LuminoRouter waits for app initialization before rendering
// This ensures all routes, pages, and layouts are registered
//
// Initialization happens via microtasks:
queueMicrotask(() => {
  queueMicrotask(() => {
    // Router is now initialized and ready to render
  });
});

// You don't need to worry about this - it happens automatically
// Just register routes before rendering your app`;

export function LuminoRouterPage() {
  return (
    <>
      <h1 className="docs-page-title">LuminoRouter</h1>
      <p className="docs-page-subtitle">
        The root routing component that automatically renders pages based on URL.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>LuminoRouter</code> component is the core of Lumino's routing system. It automatically
          matches the current URL to registered routes and renders the corresponding page with its layout.
          No configuration is needed - just wrap your app and register routes.
        </p>
      </div>

      {/* Props API */}
      <div className="docs-section">
        <h2 className="docs-section-title">Props API</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>basePath</code></td>
              <td><code>string</code></td>
              <td><code>""</code></td>
              <td>Base path for all routes (useful if app is not at domain root)</td>
            </tr>
            <tr>
              <td><code>notFound</code></td>
              <td><code>ReactNode</code></td>
              <td>Default 404</td>
              <td>Custom component to show when no route matches</td>
            </tr>
            <tr>
              <td><code>onRouteChange</code></td>
              <td><code>(match: RouteMatch | null) =&gt; void</code></td>
              <td>-</td>
              <td>Callback fired when route changes (useful for analytics)</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactNode</code></td>
              <td>-</td>
              <td>Custom children (advanced - overrides automatic page rendering)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <p>
          The simplest setup - just wrap your app with LuminoRouter:
        </p>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Route Registration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Route Registration</h2>
        <p>
          Routes are registered in your app setup using <code>app.registerRoute()</code>:
        </p>
        <CodeBlock code={registerRoutesCode} language="typescript" />
      </div>

      {/* Custom 404 Page */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom 404 Page</h2>
        <p>
          Provide a custom component for unmatched routes:
        </p>
        <CodeBlock code={customNotFoundCode} language="typescript" />
      </div>

      {/* Base Path */}
      <div className="docs-section">
        <h2 className="docs-section-title">Base Path</h2>
        <p>
          If your app is hosted at a subdirectory (not domain root), use <code>basePath</code>:
        </p>
        <CodeBlock code={basePathCode} language="typescript" />
      </div>

      {/* Route Change Callback */}
      <div className="docs-section">
        <h2 className="docs-section-title">Route Change Callback</h2>
        <p>
          Track route changes for analytics, logging, or side effects:
        </p>
        <CodeBlock code={routeChangeCallbackCode} language="typescript" />
      </div>

      {/* RouteMatch Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">RouteMatch Type</h2>
        <p>
          The <code>RouteMatch</code> interface contains information about the matched route:
        </p>
        <CodeBlock code={routeMatchTypeCode} language="typescript" />
      </div>

      {/* Layout System */}
      <div className="docs-section">
        <h2 className="docs-section-title">Layout System</h2>
        <p>
          LuminoRouter supports flexible layouts at multiple levels:
        </p>
        <CodeBlock code={layoutSystemCode} language="typescript" />
        <p>
          Layout priority order:
        </p>
        <ol>
          <li><strong>Dynamic layout</strong> - Set at runtime via <code>setLayout()</code></li>
          <li><strong>Route-level layout</strong> - Configured in route options</li>
          <li><strong>Page-level layout</strong> - Deprecated, kept for backwards compatibility</li>
          <li><strong>App default layout</strong> - Set in app configuration</li>
        </ol>
      </div>

      {/* Route Guards */}
      <div className="docs-section">
        <h2 className="docs-section-title">Route Guards</h2>
        <p>
          Routes can have guards for authentication and authorization:
        </p>
        <ul>
          <li>Guards are async functions that return <code>boolean</code></li>
          <li>If a guard returns <code>false</code>, navigation is blocked</li>
          <li>Configure redirect path in route <code>meta.guardRedirect</code></li>
          <li>Guards run in order - all must pass for route to render</li>
        </ul>
        <p>
          See the <strong>Route Guards</strong> page for detailed examples.
        </p>
      </div>

      {/* Navigation Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigation Events</h2>
        <p>
          LuminoRouter emits events during navigation lifecycle:
        </p>
        <CodeBlock code={eventEmitterCode} language="typescript" />
      </div>

      {/* Advanced: Custom Children */}
      <div className="docs-section">
        <h2 className="docs-section-title">Advanced: Custom Children</h2>
        <p>
          For complete control over rendering, provide custom children:
        </p>
        <CodeBlock code={advancedCustomChildrenCode} language="typescript" />
        <p>
          <strong>Warning:</strong> This overrides automatic page rendering. Only use if you need
          custom routing logic that can't be achieved with layouts and guards.
        </p>
      </div>

      {/* Initialization */}
      <div className="docs-section">
        <h2 className="docs-section-title">Initialization</h2>
        <p>
          LuminoRouter waits for the app to initialize before rendering. This ensures all routes,
          pages, and layouts are registered:
        </p>
        <CodeBlock code={initializationCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Register routes early</strong> - Before rendering your app component</li>
          <li><strong>Use route guards</strong> - Protect routes at registration time, not in pages</li>
          <li><strong>Provide custom 404</strong> - Better UX than default error message</li>
          <li><strong>Track route changes</strong> - Use <code>onRouteChange</code> for analytics</li>
          <li><strong>Avoid custom children</strong> - Use layouts and guards for customization</li>
          <li><strong>Use basePath correctly</strong> - Only needed if app is not at domain root</li>
        </ul>
      </div>

      {/* Common Patterns */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Patterns</h2>
        <h3>Multiple Layouts</h3>
        <pre className="docs-code">
{`// Public routes with minimal layout
app.registerRoute("/", "homePage", { layout: PublicLayout });
app.registerRoute("/about", "aboutPage", { layout: PublicLayout });

// Admin routes with dashboard layout
app.registerRoute("/admin", "adminPage", { layout: AdminLayout });
app.registerRoute("/admin/users", "usersPage", { layout: AdminLayout });

// Auth routes with no layout
app.registerRoute("/login", "loginPage");  // No layout
app.registerRoute("/signup", "signupPage");`}
        </pre>

        <h3>Protected Routes</h3>
        <pre className="docs-code">
{`// All admin routes require authentication
const requireAuth = () => authService.isAuthenticated();
const requireAdmin = () => authService.hasRole("admin");

app.registerRoute("/admin", "adminPage", {
  guards: [requireAuth, requireAdmin],
  meta: { guardRedirect: "/login" }
});`}
        </pre>

        <h3>Analytics Tracking</h3>
        <pre className="docs-code">
{`function App() {
  const handleRouteChange = (match: RouteMatch | null) => {
    if (match) {
      // Track page view in analytics
      analytics.page(match.path, {
        pageId: match.pageId,
        params: match.params,
      });

      // Update document title
      document.title = \`\${match.pageId} | My App\`;
    }
  };

  return <LuminoRouter onRouteChange={handleRouteChange} />;
}`}
        </pre>
      </div>

      {/* Related */}
      <div className="docs-section">
        <h2 className="docs-section-title">Related</h2>
        <ul>
          <li><strong>Link and Navigate</strong> - Navigation components</li>
          <li><strong>Router Hooks</strong> - useRouter, useParams, useQuery</li>
          <li><strong>Route Guards</strong> - Authentication and authorization</li>
          <li><strong>Routing Overview</strong> - Introduction to Lumino routing</li>
        </ul>
      </div>
    </>
  );
}
