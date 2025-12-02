/**
 * Link and Navigate Page - Navigation components documentation
 */

import { CodeBlock } from "../../components/CodeBlock";

const linkBasicCode = `import { Link } from "lumino/react";

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/employees">Employees</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}`;

const linkWithParamsCode = `import { Link } from "lumino/react";

function EmployeeList({ employees }) {
  return (
    <ul>
      {employees.map(emp => (
        <li key={emp.id}>
          <Link to={\`/employees/\${emp.id}\`}>
            {emp.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}`;

const linkWithQueryCode = `import { Link } from "lumino/react";

function Filters() {
  return (
    <div>
      <Link to="/employees?status=active">Active Employees</Link>
      <Link to="/employees?status=inactive">Inactive Employees</Link>
      <Link to="/employees?department=IT&status=active">
        Active IT Employees
      </Link>
    </div>
  );
}`;

const linkReplaceCode = `import { Link } from "lumino/react";

function LoginSuccess() {
  return (
    <div>
      <h1>Login Successful!</h1>
      {/* Replace prevents going back to login page */}
      <Link to="/dashboard" replace>
        Go to Dashboard
      </Link>
    </div>
  );
}`;

const linkWithClassNameCode = `import { Link } from "lumino/react";

function Navigation() {
  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  return (
    <nav>
      <Link
        to="/"
        className={isActive("/") ? "nav-link active" : "nav-link"}
      >
        Home
      </Link>
      <Link
        to="/employees"
        className={isActive("/employees") ? "nav-link active" : "nav-link"}
      >
        Employees
      </Link>
    </nav>
  );
}`;

const linkOnClickCode = `import { Link } from "lumino/react";

function Navigation() {
  const handleClick = (e: React.MouseEvent) => {
    console.log("Navigating to employees");
    // Custom logic before navigation
    analytics.track("navigation", { to: "/employees" });
  };

  return (
    <Link to="/employees" onClick={handleClick}>
      Employees
    </Link>
  );
}`;

const navigateBasicCode = `import { Navigate } from "lumino/react";

function ProtectedPage() {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div>Protected Content</div>;
}`;

const navigateReplaceCode = `import { Navigate } from "lumino/react";

function DeprecatedPage() {
  // Replace prevents going back to this deprecated page
  return <Navigate to="/new-page" replace />;
}`;

const navigateConditionalCode = `import { Navigate } from "lumino/react";

function FormSuccess({ submitted }) {
  if (!submitted) {
    // Redirect to form if not submitted
    return <Navigate to="/form" />;
  }

  return (
    <div>
      <h1>Thank you!</h1>
      <p>Your form has been submitted.</p>
    </div>
  );
}`;

const programmaticNavigationCode = `import { useRouter } from "lumino/react";

function EmployeeForm() {
  const { navigate, redirect, back } = useRouter();

  const handleSubmit = async (data) => {
    await saveEmployee(data);
    // Navigate to employee list after save
    navigate("/employees");
  };

  const handleCancel = () => {
    // Go back to previous page
    back();
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
    // Replace current page (can't go back to deleted employee)
    redirect("/employees");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Save</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
      <button type="button" onClick={() => handleDelete(employee.id)}>
        Delete
      </button>
    </form>
  );
}`;

const linkPropsCode = `interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;          // Target path
  replace?: boolean;   // Use replace instead of push (default: false)
  children: ReactNode; // Link content
  // Plus all standard <a> props: className, style, onClick, etc.
}`;

const navigatePropsCode = `interface NavigateProps {
  to: string;        // Target path
  replace?: boolean; // Use replace instead of push (default: false)
}`;

const navigationComparisonCode = `// Link - Declarative navigation (user clicks)
<Link to="/employees">View Employees</Link>

// Navigate - Imperative navigation (automatic redirect)
if (!authenticated) {
  return <Navigate to="/login" />;
}

// useRouter - Programmatic navigation (in event handlers)
const { navigate } = useRouter();
const handleClick = () => navigate("/employees");`;

const spaNavigationCode = `import { Link } from "lumino/react";

// ✅ Good - Client-side navigation (SPA)
<Link to="/employees">Employees</Link>

// ❌ Bad - Full page reload
<a href="/employees">Employees</a>

// When to use regular <a> tags:
// - External links: <a href="https://example.com">External</a>
// - Downloads: <a href="/file.pdf" download>Download</a>
// - Same-page anchors: <a href="#section">Jump to Section</a>`;

const accessibilityCode = `import { Link } from "lumino/react";

function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <Link to="/" aria-label="Home page">
        Home
      </Link>
      <Link
        to="/employees"
        aria-label="View all employees"
        aria-current={location.pathname === "/employees" ? "page" : undefined}
      >
        Employees
      </Link>
    </nav>
  );
}`;

const externalLinkCode = `import { Link } from "lumino/react";

function Footer() {
  return (
    <footer>
      {/* Internal navigation - use Link */}
      <Link to="/about">About Us</Link>
      <Link to="/privacy">Privacy Policy</Link>

      {/* External links - use regular <a> */}
      <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer">
        Twitter
      </a>
      <a href="https://github.com/example" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </footer>
  );
}`;

export function LinkNavigatePage() {
  return (
    <>
      <h1 className="docs-page-title">Link and Navigate</h1>
      <p className="docs-page-subtitle">
        Navigation components for declarative routing in Lumino applications.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Lumino provides two navigation components: <code>Link</code> for user-initiated navigation
          (like clicking a menu item) and <code>Navigate</code> for automatic redirects (like
          unauthorized access). Both use the browser's History API for client-side navigation
          without full page reloads.
        </p>
      </div>

      {/* Link Component */}
      <div className="docs-section">
        <h2 className="docs-section-title">Link Component</h2>
        <p>
          The <code>Link</code> component renders an anchor tag that navigates using client-side
          routing when clicked.
        </p>

        <h3>Props API</h3>
        <CodeBlock code={linkPropsCode} language="typescript" />

        <h3>Basic Usage</h3>
        <CodeBlock code={linkBasicCode} language="typescript" />

        <h3>With Route Parameters</h3>
        <CodeBlock code={linkWithParamsCode} language="typescript" />

        <h3>With Query Strings</h3>
        <CodeBlock code={linkWithQueryCode} language="typescript" />

        <h3>Replace Navigation</h3>
        <p>
          Use <code>replace</code> to replace the current history entry instead of adding a new one:
        </p>
        <CodeBlock code={linkReplaceCode} language="typescript" />

        <h3>Styling and Classes</h3>
        <p>
          Link accepts all standard anchor props including <code>className</code> and <code>style</code>:
        </p>
        <CodeBlock code={linkWithClassNameCode} language="typescript" />

        <h3>Custom Click Handlers</h3>
        <CodeBlock code={linkOnClickCode} language="typescript" />
      </div>

      {/* Navigate Component */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigate Component</h2>
        <p>
          The <code>Navigate</code> component performs automatic navigation when rendered.
          It's useful for redirects based on conditions.
        </p>

        <h3>Props API</h3>
        <CodeBlock code={navigatePropsCode} language="typescript" />

        <h3>Basic Usage</h3>
        <CodeBlock code={navigateBasicCode} language="typescript" />

        <h3>Replace Navigation</h3>
        <CodeBlock code={navigateReplaceCode} language="typescript" />

        <h3>Conditional Redirects</h3>
        <CodeBlock code={navigateConditionalCode} language="typescript" />
      </div>

      {/* Programmatic Navigation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Programmatic Navigation</h2>
        <p>
          For navigation triggered by events (not user clicks), use the <code>useRouter</code> hook:
        </p>
        <CodeBlock code={programmaticNavigationCode} language="typescript" />
      </div>

      {/* Navigation Methods Comparison */}
      <div className="docs-section">
        <h2 className="docs-section-title">When to Use Each</h2>
        <CodeBlock code={navigationComparisonCode} language="typescript" />
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Use Case</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Link</code></td>
              <td>User clicks to navigate</td>
              <td>Menu items, buttons, text links</td>
            </tr>
            <tr>
              <td><code>Navigate</code></td>
              <td>Automatic redirect</td>
              <td>Auth checks, deprecated pages</td>
            </tr>
            <tr>
              <td><code>useRouter</code></td>
              <td>Programmatic navigation</td>
              <td>After form submit, async operations</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SPA Navigation */}
      <div className="docs-section">
        <h2 className="docs-section-title">SPA Navigation vs Full Page Load</h2>
        <p>
          Use <code>Link</code> for client-side navigation (SPA) and regular <code>&lt;a&gt;</code> tags
          for external links or downloads:
        </p>
        <CodeBlock code={spaNavigationCode} language="typescript" />
      </div>

      {/* External Links */}
      <div className="docs-section">
        <h2 className="docs-section-title">External Links</h2>
        <p>
          For external URLs, use regular anchor tags (not Link):
        </p>
        <CodeBlock code={externalLinkCode} language="typescript" />
      </div>

      {/* Accessibility */}
      <div className="docs-section">
        <h2 className="docs-section-title">Accessibility</h2>
        <p>
          Link renders a semantic <code>&lt;a&gt;</code> tag and supports all ARIA attributes:
        </p>
        <CodeBlock code={accessibilityCode} language="typescript" />
        <ul>
          <li>Use <code>aria-label</code> for screen reader friendly link text</li>
          <li>Use <code>aria-current="page"</code> to indicate current page</li>
          <li>Link supports keyboard navigation automatically</li>
          <li>Link works with screen readers out of the box</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use Link for SPA navigation</strong> - Never use <code>&lt;a&gt;</code> for internal routes</li>
          <li><strong>Use replace for redirects</strong> - Prevents unwanted back button behavior</li>
          <li><strong>Provide aria-labels</strong> - Make links accessible to screen readers</li>
          <li><strong>Style active links</strong> - Show users where they are in the app</li>
          <li><strong>Use Navigate sparingly</strong> - Prefer Link for user-initiated navigation</li>
          <li><strong>External links need target="_blank"</strong> - And rel="noopener noreferrer"</li>
          <li><strong>Avoid onClick navigation</strong> - Use Link when possible, useRouter for events</li>
        </ul>
      </div>

      {/* Common Patterns */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Patterns</h2>

        <h3>Active Link Styling</h3>
        <pre className="docs-code">
{`import { Link } from "lumino/react";
import { useRouter } from "lumino/react";

function NavLink({ to, children }) {
  const { currentRoute } = useRouter();
  const isActive = currentRoute === to;

  return (
    <Link
      to={to}
      className={isActive ? "nav-link active" : "nav-link"}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}`}
        </pre>

        <h3>Breadcrumb Navigation</h3>
        <pre className="docs-code">
{`import { Link } from "lumino/react";

function Breadcrumbs({ path }) {
  const segments = path.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {segments.map((segment, i) => {
          const to = "/" + segments.slice(0, i + 1).join("/");
          return (
            <li key={to}>
              <Link to={to}>{segment}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}`}
        </pre>

        <h3>Protected Route Redirect</h3>
        <pre className="docs-code">
{`import { Navigate } from "lumino/react";

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    // Redirect to login, preserving intended destination
    const returnTo = encodeURIComponent(window.location.pathname);
    return <Navigate to={\`/login?returnTo=\${returnTo}\`} replace />;
  }

  return children;
}`}
        </pre>
      </div>

      {/* Related */}
      <div className="docs-section">
        <h2 className="docs-section-title">Related</h2>
        <ul>
          <li><strong>Router Hooks</strong> - useRouter for programmatic navigation</li>
          <li><strong>LuminoRouter</strong> - The router component</li>
          <li><strong>Route Guards</strong> - Protecting routes with authentication</li>
        </ul>
      </div>
    </>
  );
}
