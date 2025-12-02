/**
 * Routing Overview Page - Introduction to Lumino Routing
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicSetupCode = `import { LuminoRouter } from "lumino/react";
import { app } from "./app";

// 1. Register routes in your app setup
app.registerRoute("/", "homePage");
app.registerRoute("/employees", "employeeListPage");
app.registerRoute("/employees/:id", "employeeDetailPage");
app.registerRoute("/settings", "settingsPage");

// 2. Use LuminoRouter in your App component
function App() {
  return (
    <LuminoProvider config={config}>
      <LuminoRouter />
    </LuminoProvider>
  );
}`;

const routeParamsCode = `// Route with parameters
app.registerRoute("/employees/:id", "employeeDetailPage");

// Route with optional parameters
app.registerRoute("/employees/:id?", "employeeFormPage");

// Multiple parameters
app.registerRoute("/departments/:deptId/employees/:empId", "employeeDetailPage");

// Query string support (automatic)
// /employees?search=john&status=active`;

const navigationCode = `import { Link, Navigate, useRouter } from "lumino/react";

// Link component for declarative navigation
<Link to="/employees">View Employees</Link>

// Navigate component for imperative redirects
if (shouldRedirect) {
  return <Navigate to="/home" />;
}

// useRouter hook for programmatic navigation
const { navigate } = useRouter();
navigate("/employees");`;

const guardExampleCode = `import { RouteGuard } from "lumino/react";

// Protect routes with guards
<RouteGuard
  canActivate={() => isAuthenticated}
  redirectTo="/login"
>
  <AdminDashboard />
</RouteGuard>

// Or configure guards at the route level
app.registerRoute("/admin", "adminPage", {
  guards: [() => checkAuth()],
  meta: { guardRedirect: "/login" }
});`;

const hooksCode = `import { useRouter, useParams, useQuery } from "lumino/react";

function EmployeeDetail() {
  const { navigate, back } = useRouter();
  const { id } = useParams();  // { id: "123" }
  const { search, filter } = useQuery();  // { search: "john", filter: "active" }

  return (
    <div>
      <h1>Employee {id}</h1>
      <button onClick={() => back()}>Go Back</button>
      <button onClick={() => navigate("/employees")}>All Employees</button>
    </div>
  );
}`;

const architectureCode = `// Lumino Routing Architecture
//
// LuminoRouter (root component)
//   ├── Route Matching (path patterns with params)
//   ├── Route Guards (authentication/authorization)
//   ├── Page Registry (registered pages)
//   ├── Layout System (app layouts per route)
//   └── Navigation (Link, Navigate, useRouter)
//
// Routes are registered in app configuration:
// app.registerRoute(path, pageId, options)
//
// LuminoRouter automatically renders the matched page`;

export function RoutingOverviewPage() {
  return (
    <>
      <h1 className="docs-page-title">Routing</h1>
      <p className="docs-page-subtitle">
        Client-side routing for Lumino applications with automatic page rendering.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">What is Lumino Routing?</h2>
        <p>
          Lumino's routing system provides a lightweight, zero-config router that automatically
          renders registered pages based on the current URL. It's designed to work seamlessly
          with Lumino's page system and can be integrated with React Router if needed.
        </p>
        <p>
          The router supports dynamic route parameters, query strings, route guards for
          authentication, and flexible layouts per route. It uses the browser's History API
          for client-side navigation without full page reloads.
        </p>
      </div>

      {/* Key Features */}
      <div className="docs-section">
        <h2 className="docs-section-title">Key Features</h2>
        <ul>
          <li><strong>Zero configuration</strong> - Just wrap your app with LuminoRouter</li>
          <li><strong>Automatic page rendering</strong> - Routes map directly to registered pages</li>
          <li><strong>Route parameters</strong> - Support for dynamic segments and optional params</li>
          <li><strong>Query strings</strong> - Automatic parsing of URL query parameters</li>
          <li><strong>Route guards</strong> - Authentication and authorization at route level</li>
          <li><strong>Flexible layouts</strong> - Different layouts per route or page</li>
          <li><strong>TypeScript support</strong> - Full type safety for routes and params</li>
          <li><strong>Browser history</strong> - Uses pushState/popState for SPA navigation</li>
        </ul>
      </div>

      {/* Quick Start */}
      <div className="docs-section">
        <h2 className="docs-section-title">Quick Start</h2>
        <p>
          Setting up routing requires two simple steps: register your routes and use the LuminoRouter component.
        </p>
        <CodeBlock code={basicSetupCode} language="typescript" />
        <p>
          That's it! The router will automatically match the current URL to registered routes
          and render the corresponding page.
        </p>
      </div>

      {/* Route Patterns */}
      <div className="docs-section">
        <h2 className="docs-section-title">Route Patterns</h2>
        <p>
          Routes support dynamic parameters using the <code>:paramName</code> syntax:
        </p>
        <CodeBlock code={routeParamsCode} language="typescript" />
        <ul>
          <li><strong>Static routes</strong> - Exact path matches like <code>/about</code></li>
          <li><strong>Dynamic parameters</strong> - <code>:id</code> matches any segment</li>
          <li><strong>Optional parameters</strong> - <code>:id?</code> makes the segment optional</li>
          <li><strong>Query strings</strong> - Automatically parsed from the URL</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigation</h2>
        <p>
          Lumino provides multiple ways to navigate between routes:
        </p>
        <CodeBlock code={navigationCode} language="typescript" />
      </div>

      {/* Route Guards */}
      <div className="docs-section">
        <h2 className="docs-section-title">Route Guards</h2>
        <p>
          Protect routes with authentication and authorization checks:
        </p>
        <CodeBlock code={guardExampleCode} language="typescript" />
      </div>

      {/* Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Router Hooks</h2>
        <p>
          Access routing context and parameters from within your components:
        </p>
        <CodeBlock code={hooksCode} language="typescript" />
      </div>

      {/* Architecture */}
      <div className="docs-section">
        <h2 className="docs-section-title">Architecture</h2>
        <p>
          Understanding how Lumino routing works under the hood:
        </p>
        <CodeBlock code={architectureCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Centralize route registration</strong> - Keep all routes in one place (app setup)</li>
          <li><strong>Use route guards</strong> - Protect sensitive routes at the route level</li>
          <li><strong>Leverage layouts</strong> - Define different layouts for different sections</li>
          <li><strong>Type-safe params</strong> - Create types for route params in TypeScript</li>
          <li><strong>Descriptive routes</strong> - Use clear, hierarchical URL patterns</li>
          <li><strong>Handle 404s</strong> - Provide a custom notFound component</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>LuminoRouter</strong> - Deep dive into the router component and its props</li>
          <li><strong>Link and Navigate</strong> - Navigation components for declarative routing</li>
          <li><strong>Router Hooks</strong> - useRouter, useParams, and useQuery hooks</li>
          <li><strong>Route Guards</strong> - Authentication and authorization patterns</li>
        </ul>
      </div>
    </>
  );
}
