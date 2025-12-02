/**
 * useNavigation Hook Page - Routing and navigation
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicUsageCode = `import { useNavigation } from "lumino/react";

function MyComponent() {
  const { navigate, back, redirect, getCurrentRoute } = useNavigation();

  const handleViewUser = (userId: number) => {
    navigate(\`/users/\${userId}\`);
  };

  const handleBack = () => {
    back();
  };

  return (
    <div>
      <button onClick={() => handleViewUser(123)}>View User</button>
      <button onClick={handleBack}>Go Back</button>
    </div>
  );
}`;

const navigateCode = `const { navigate } = useNavigation();

// Navigate to a route
navigate("/users");
navigate("/users/123");
navigate("/users/123/edit");

// With query parameters (implementation-dependent)
navigate("/users?page=2&sort=name");

// Navigate preserves history
// User can press back button to return`;

const redirectCode = `const { redirect } = useNavigation();

// Redirect (replaces current history entry)
redirect("/login");

// Use for:
// - Authentication redirects
// - After form submission
// - Page not found scenarios

// User cannot go back to previous page`;

const backCode = `const { back } = useNavigation();

// Go back in history
const handleCancel = () => {
  back();
};

// Equivalent to browser back button`;

const getCurrentRouteCode = `const { getCurrentRoute } = useNavigation();

// Get current route path
const currentRoute = getCurrentRoute();
console.log(currentRoute); // "/users/123/edit"

// Use for:
// - Conditional rendering
// - Active link highlighting
// - Analytics`;

const routeParamsCode = `const { routeParams } = useNavigation();

// Access route parameters
const userId = routeParams.id;
const section = routeParams.section;

// Example route: /users/:id/:section
// Current URL: /users/123/profile
// routeParams = { id: "123", section: "profile" }`;

const queryParamsCode = `const { queryParams } = useNavigation();

// Access query parameters
const page = queryParams.page;
const sort = queryParams.sort;
const filter = queryParams.filter;

// Example URL: /users?page=2&sort=name&filter=active
// queryParams = { page: "2", sort: "name", filter: "active" }`;

const fullReturnCode = `const navigation = useNavigation();

// All available properties
const {
  navigate,         // Navigate to route
  redirect,         // Redirect (replace history)
  back,            // Go back
  getCurrentRoute, // Get current route path
  routeParams,     // Route parameters
  queryParams      // Query parameters
} = navigation;`;

const formIntegrationCode = `import { useNavigation } from "lumino/react";
import { useForm } from "lumino/react";

function EmployeeForm() {
  const { navigate } = useNavigation();
  const form = useForm(new EmployeeForm());

  const handleSave = async () => {
    if (await form.validate()) {
      const employee = await saveEmployee(form.values);
      navigate(\`/employees/\${employee.id}\`);
    }
  };

  const handleCancel = () => {
    if (form.dirty) {
      confirm("Discard changes?").then(confirmed => {
        if (confirmed) navigate("/employees");
      });
    } else {
      navigate("/employees");
    }
  };

  return (
    <div>
      <FormRenderer form={form} />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}`;

const conditionalNavigationCode = `const { navigate, routeParams } = useNavigation();

const handleNext = () => {
  const { step } = routeParams;

  switch(step) {
    case "personal":
      navigate("/onboarding/address");
      break;
    case "address":
      navigate("/onboarding/employment");
      break;
    case "employment":
      navigate("/onboarding/complete");
      break;
  }
};`;

const navigationGuardCode = `import { useNavigation } from "lumino/react";
import { useEffect } from "react";

function EmployeeForm() {
  const { navigate } = useNavigation();
  const form = useForm(new EmployeeForm());

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.dirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes";
        return "You have unsaved changes";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.dirty]);

  return <FormRenderer form={form} />;
}`;

const activeLinksCode = `import { useNavigation } from "lumino/react";

function Navigation() {
  const { getCurrentRoute } = useNavigation();
  const currentRoute = getCurrentRoute();

  const isActive = (path: string) => currentRoute === path;

  return (
    <nav>
      <a
        href="/dashboard"
        className={isActive("/dashboard") ? "active" : ""}
      >
        Dashboard
      </a>
      <a
        href="/users"
        className={isActive("/users") ? "active" : ""}
      >
        Users
      </a>
    </nav>
  );
}`;

const breadcrumbsCode = `import { useNavigation } from "lumino/react";

function Breadcrumbs() {
  const { getCurrentRoute, navigate } = useNavigation();
  const currentRoute = getCurrentRoute();

  // Parse route into breadcrumb segments
  const segments = currentRoute.split("/").filter(Boolean);

  return (
    <div className="breadcrumbs">
      <span onClick={() => navigate("/")}>Home</span>
      {segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        return (
          <span key={path} onClick={() => navigate(path)}>
            / {segment}
          </span>
        );
      })}
    </div>
  );
}`;

const tabsNavigationCode = `import { useNavigation } from "lumino/react";

function UserTabs({ userId }: { userId: number }) {
  const { navigate, routeParams } = useNavigation();
  const currentTab = routeParams.tab || "profile";

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "orders", label: "Orders" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={currentTab === tab.id ? "active" : ""}
          onClick={() => navigate(\`/users/\${userId}/\${tab.id}\`)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}`;

export function UseNavigationPage() {
  return (
    <>
      <h1 className="docs-page-title">useNavigation</h1>
      <p className="docs-page-subtitle">
        Programmatic navigation and route access.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>useNavigation()</code> provides programmatic navigation methods
          and access to route parameters. It's a convenience hook that wraps
          the navigation features from <code>useLumino()</code>.
        </p>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* navigate */}
      <div className="docs-section">
        <h2 className="docs-section-title">navigate()</h2>
        <p>
          Navigate to a route (preserves history):
        </p>
        <CodeBlock code={navigateCode} language="typescript" />
      </div>

      {/* redirect */}
      <div className="docs-section">
        <h2 className="docs-section-title">redirect()</h2>
        <p>
          Redirect to a route (replaces history):
        </p>
        <CodeBlock code={redirectCode} language="typescript" />
      </div>

      {/* back */}
      <div className="docs-section">
        <h2 className="docs-section-title">back()</h2>
        <CodeBlock code={backCode} language="typescript" />
      </div>

      {/* getCurrentRoute */}
      <div className="docs-section">
        <h2 className="docs-section-title">getCurrentRoute()</h2>
        <CodeBlock code={getCurrentRouteCode} language="typescript" />
      </div>

      {/* Route Params */}
      <div className="docs-section">
        <h2 className="docs-section-title">Route Parameters</h2>
        <CodeBlock code={routeParamsCode} language="typescript" />
      </div>

      {/* Query Params */}
      <div className="docs-section">
        <h2 className="docs-section-title">Query Parameters</h2>
        <CodeBlock code={queryParamsCode} language="typescript" />
      </div>

      {/* Return Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">Return Type</h2>
        <CodeBlock code={fullReturnCode} language="typescript" />
      </div>

      {/* Form Integration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Integration</h2>
        <p>
          Common pattern: navigate after form save, confirm before cancel:
        </p>
        <CodeBlock code={formIntegrationCode} language="typescript" />
      </div>

      {/* Conditional Navigation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Navigation</h2>
        <p>
          Navigate based on application state:
        </p>
        <CodeBlock code={conditionalNavigationCode} language="typescript" />
      </div>

      {/* Navigation Guard */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigation Guard</h2>
        <p>
          Warn users before leaving with unsaved changes:
        </p>
        <CodeBlock code={navigationGuardCode} language="typescript" />
        <p>
          <strong>Note:</strong> Use <code>useNavigationGuard()</code> from usePage
          for a more complete solution.
        </p>
      </div>

      {/* Active Links */}
      <div className="docs-section">
        <h2 className="docs-section-title">Active Link Highlighting</h2>
        <CodeBlock code={activeLinksCode} language="typescript" />
      </div>

      {/* Breadcrumbs */}
      <div className="docs-section">
        <h2 className="docs-section-title">Breadcrumbs</h2>
        <CodeBlock code={breadcrumbsCode} language="typescript" />
      </div>

      {/* Tabs Navigation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Tab Navigation</h2>
        <CodeBlock code={tabsNavigationCode} language="typescript" />
      </div>

      {/* Use Cases */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Use Cases</h2>
        <ul>
          <li><strong>Post-form navigation</strong> - Navigate after save/cancel</li>
          <li><strong>Breadcrumbs</strong> - Build navigation breadcrumbs</li>
          <li><strong>Active links</strong> - Highlight current page in navigation</li>
          <li><strong>Tabs</strong> - Navigate between tab views</li>
          <li><strong>Wizards</strong> - Multi-step form navigation</li>
          <li><strong>Conditional redirects</strong> - Auth guards, permissions</li>
          <li><strong>Deep linking</strong> - Access route/query params</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use navigate for normal flow</strong> - Preserves back button</li>
          <li><strong>Use redirect for auth</strong> - Prevents going back to protected page</li>
          <li><strong>Confirm dirty forms</strong> - Warn before navigation with unsaved changes</li>
          <li><strong>Use absolute paths</strong> - More predictable than relative paths</li>
          <li><strong>Type route params</strong> - Parse strings to numbers when needed</li>
          <li><strong>Handle missing params</strong> - Check for undefined route params</li>
        </ul>
      </div>

      {/* vs useLumino */}
      <div className="docs-section">
        <h2 className="docs-section-title">useNavigation vs useLumino</h2>
        <p>
          <code>useNavigation()</code> is a convenience hook that provides only
          navigation features. <code>useLumino()</code> provides navigation plus
          all other framework features (notifications, locale, theme, etc.).
        </p>
        <p>
          Use <code>useNavigation()</code> when you only need navigation to keep
          your component focused and avoid unnecessary dependencies.
        </p>
      </div>
    </>
  );
}
