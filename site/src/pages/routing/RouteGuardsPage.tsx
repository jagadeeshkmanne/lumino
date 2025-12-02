/**
 * Route Guards Page - Documentation for route protection and authentication
 */

import { CodeBlock } from "../../components/CodeBlock";

const routeGuardComponentCode = `import { RouteGuard } from "lumino/react";

function AdminDashboard() {
  const isAuthenticated = useAuth();

  return (
    <RouteGuard
      canActivate={() => isAuthenticated}
      redirectTo="/login"
    >
      <div>Admin Dashboard Content</div>
    </RouteGuard>
  );
}`;

const routeGuardAsyncCode = `import { RouteGuard } from "lumino/react";

function AdminDashboard() {
  const checkAdminAccess = async () => {
    const user = await getCurrentUser();
    return user?.role === "admin";
  };

  return (
    <RouteGuard
      canActivate={checkAdminAccess}
      redirectTo="/unauthorized"
      fallback={<div>Checking permissions...</div>}
    >
      <div>Admin Dashboard Content</div>
    </RouteGuard>
  );
}`;

const routeLevelGuardCode = `import { app } from "./app";

// Guard function
const requireAuth = async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return false;

  // Validate token
  const isValid = await validateToken(token);
  return isValid;
};

const requireAdmin = async () => {
  const user = await getCurrentUser();
  return user?.role === "admin";
};

// Register route with guards
app.registerRoute("/admin", "adminPage", {
  guards: [requireAuth, requireAdmin],
  meta: { guardRedirect: "/login" }
});

// Guards run in order - all must pass for route to render
// If any guard fails, redirects to guardRedirect path`;

const multipleGuardsCode = `import { app } from "./app";

// Define guard functions
const isAuthenticated = () => {
  return !!localStorage.getItem("auth_token");
};

const hasAdminRole = async () => {
  const user = await getCurrentUser();
  return user?.role === "admin";
};

const hasFeatureAccess = async () => {
  const features = await getUserFeatures();
  return features.includes("advanced_reporting");
};

// Apply multiple guards to route
app.registerRoute("/admin/reports", "reportsPage", {
  guards: [
    isAuthenticated,     // First check: logged in?
    hasAdminRole,        // Second check: admin role?
    hasFeatureAccess,    // Third check: has feature?
  ],
  meta: {
    guardRedirect: "/login",
    requiresAuth: true,
    requiredRole: "admin",
  }
});`;

const guardRedirectCode = `import { app } from "./app";

// Redirect to login for protected routes
app.registerRoute("/admin", "adminPage", {
  guards: [requireAuth],
  meta: { guardRedirect: "/login" }
});

// Redirect to unauthorized page for role checks
app.registerRoute("/admin/users", "usersPage", {
  guards: [requireAuth, requireAdmin],
  meta: { guardRedirect: "/unauthorized" }
});

// No redirect - just block access (shows "Access denied")
app.registerRoute("/beta", "betaPage", {
  guards: [hasBetaAccess]
  // No guardRedirect - shows default access denied message
});`;

const authPatternCode = `// authService.ts
class AuthService {
  isAuthenticated(): boolean {
    const token = localStorage.getItem("auth_token");
    return !!token && !this.isTokenExpired(token);
  }

  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.roles.includes(role) ?? false;
  }

  async hasPermission(permission: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.permissions.includes(permission) ?? false;
  }

  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  }

  private async getCurrentUser() {
    // Fetch user from API or decode token
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    const response = await fetch("/api/me", {
      headers: { Authorization: \`Bearer \${token}\` }
    });

    return response.json();
  }
}

export const authService = new AuthService();

// routes.ts
import { authService } from "./authService";

// Guard functions
const requireAuth = () => authService.isAuthenticated();
const requireAdmin = () => authService.hasRole("admin");
const requireEditor = () => authService.hasPermission("edit_content");

// Apply to routes
app.registerRoute("/admin", "adminPage", {
  guards: [requireAuth, requireAdmin],
  meta: { guardRedirect: "/login" }
});

app.registerRoute("/editor", "editorPage", {
  guards: [requireAuth, requireEditor],
  meta: { guardRedirect: "/login" }
});`;

const componentGuardPropsCode = `interface RouteGuardProps {
  canActivate: () => boolean | Promise<boolean>;  // Guard function
  fallback?: ReactNode;                           // Show while checking
  redirectTo?: string;                            // Redirect on failure
  children: ReactNode;                            // Protected content
}`;

const navigationEventsCode = `import { eventEmitter } from "lumino/core";

// Listen to guard events
eventEmitter.on("navigation:blocked", ({ from, to, reason }) => {
  console.warn("Access denied:", reason);
  console.log("Attempted:", from, "->", to);

  // Show notification
  toast.error("You don't have access to this page");

  // Track analytics
  analytics.track("access_denied", {
    from,
    to,
    reason,
  });
});

// Listen to navigation start/end
eventEmitter.on("navigation:start", ({ from, to }) => {
  console.log("Navigation starting:", from, "->", to);
  // Show loading indicator
});

eventEmitter.on("navigation:end", ({ from, to }) => {
  console.log("Navigation complete:", to);
  // Hide loading indicator
});`;

const conditionalGuardsCode = `import { app } from "./app";

// Feature flag guard
const isFeatureEnabled = (feature: string) => {
  return () => {
    const flags = getFeatureFlags();
    return flags[feature] === true;
  };
};

// Environment guard
const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

// Beta route - only in development or with beta flag
app.registerRoute("/beta/feature", "betaFeaturePage", {
  guards: [
    () => isDevelopment() || isFeatureEnabled("beta_features")()
  ],
  meta: { guardRedirect: "/" }
});`;

const roleBasedGuardCode = `// Define role hierarchy
enum Role {
  User = 0,
  Editor = 1,
  Admin = 2,
  SuperAdmin = 3,
}

// Role guard factory
const requireRole = (minimumRole: Role) => {
  return async () => {
    const user = await getCurrentUser();
    if (!user) return false;

    const userRole = Role[user.role as keyof typeof Role];
    return userRole >= minimumRole;
  };
};

// Apply role-based guards
app.registerRoute("/editor", "editorPage", {
  guards: [requireRole(Role.Editor)],
  meta: { guardRedirect: "/login" }
});

app.registerRoute("/admin", "adminPage", {
  guards: [requireRole(Role.Admin)],
  meta: { guardRedirect: "/unauthorized" }
});

app.registerRoute("/super-admin", "superAdminPage", {
  guards: [requireRole(Role.SuperAdmin)],
  meta: { guardRedirect: "/unauthorized" }
});`;

const preserveReturnUrlCode = `// Login redirect with return URL
const requireAuth = () => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Preserve intended destination
    const returnTo = encodeURIComponent(window.location.pathname);
    window.history.replaceState(
      {},
      "",
      \`/login?returnTo=\${returnTo}\`
    );
    return false;
  }

  return true;
};

// Login page - redirect after successful login
function LoginPage() {
  const { query, navigate } = useRouter();
  const returnTo = query.returnTo || "/";

  const handleLogin = async (credentials) => {
    await authService.login(credentials);
    navigate(decodeURIComponent(returnTo));
  };

  return <LoginForm onSubmit={handleLogin} />;
}`;

export function RouteGuardsPage() {
  return (
    <>
      <h1 className="docs-page-title">Route Guards</h1>
      <p className="docs-page-subtitle">
        Protect routes with authentication, authorization, and conditional access.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Route guards allow you to protect routes based on authentication, authorization, or
          custom conditions. Lumino provides two ways to implement guards:
        </p>
        <ul>
          <li><strong>Component-level guards</strong> - Using the <code>RouteGuard</code> component</li>
          <li><strong>Route-level guards</strong> - Configured during route registration</li>
        </ul>
        <p>
          Guards are async functions that return <code>boolean</code>. If a guard returns
          <code>false</code>, the route is blocked and the user is redirected (if configured).
        </p>
      </div>

      {/* RouteGuard Component */}
      <div className="docs-section">
        <h2 className="docs-section-title">RouteGuard Component</h2>
        <p>
          The <code>RouteGuard</code> component protects content at the component level.
        </p>

        <h3>Props API</h3>
        <CodeBlock code={componentGuardPropsCode} language="typescript" />

        <h3>Basic Usage</h3>
        <CodeBlock code={routeGuardComponentCode} language="typescript" />

        <h3>Async Guards with Fallback</h3>
        <p>
          Show a loading state while guard checks are running:
        </p>
        <CodeBlock code={routeGuardAsyncCode} language="typescript" />
      </div>

      {/* Route-Level Guards */}
      <div className="docs-section">
        <h2 className="docs-section-title">Route-Level Guards</h2>
        <p>
          Configure guards when registering routes - recommended for most use cases.
        </p>
        <CodeBlock code={routeLevelGuardCode} language="typescript" />
        <p>
          <strong>Benefits of route-level guards:</strong>
        </p>
        <ul>
          <li>Guards run before page component renders</li>
          <li>Centralized security configuration</li>
          <li>Easier to maintain and audit</li>
          <li>Guards can be reused across routes</li>
        </ul>
      </div>

      {/* Multiple Guards */}
      <div className="docs-section">
        <h2 className="docs-section-title">Multiple Guards</h2>
        <p>
          Routes can have multiple guards that run in sequence. All guards must pass:
        </p>
        <CodeBlock code={multipleGuardsCode} language="typescript" />
      </div>

      {/* Guard Redirects */}
      <div className="docs-section">
        <h2 className="docs-section-title">Guard Redirects</h2>
        <p>
          Configure where to redirect when a guard fails:
        </p>
        <CodeBlock code={guardRedirectCode} language="typescript" />
      </div>

      {/* Authentication Pattern */}
      <div className="docs-section">
        <h2 className="docs-section-title">Authentication Pattern</h2>
        <p>
          A complete example of authentication guards with role-based access:
        </p>
        <CodeBlock code={authPatternCode} language="typescript" />
      </div>

      {/* Role-Based Guards */}
      <div className="docs-section">
        <h2 className="docs-section-title">Role-Based Guards</h2>
        <p>
          Implement role hierarchies and minimum role requirements:
        </p>
        <CodeBlock code={roleBasedGuardCode} language="typescript" />
      </div>

      {/* Conditional Guards */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Guards</h2>
        <p>
          Guards based on feature flags, environment, or other conditions:
        </p>
        <CodeBlock code={conditionalGuardsCode} language="typescript" />
      </div>

      {/* Preserving Return URL */}
      <div className="docs-section">
        <h2 className="docs-section-title">Preserving Return URL</h2>
        <p>
          Redirect users back to their intended destination after login:
        </p>
        <CodeBlock code={preserveReturnUrlCode} language="typescript" />
      </div>

      {/* Navigation Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigation Events</h2>
        <p>
          Listen to navigation events to track guard failures and access attempts:
        </p>
        <CodeBlock code={navigationEventsCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use route-level guards</strong> - Prefer route registration over component guards</li>
          <li><strong>Keep guards simple</strong> - Guards should be fast and focused</li>
          <li><strong>Handle async errors</strong> - Catch and handle guard function errors</li>
          <li><strong>Reuse guard functions</strong> - Define guards once, use across routes</li>
          <li><strong>Provide redirectTo</strong> - Always specify where to redirect on failure</li>
          <li><strong>Show loading states</strong> - Use fallback for async guard checks</li>
          <li><strong>Log access attempts</strong> - Track denied access for security</li>
          <li><strong>Cache user info</strong> - Avoid fetching user on every guard check</li>
          <li><strong>Order guards logically</strong> - Check auth before roles, roles before permissions</li>
        </ul>
      </div>

      {/* Common Patterns */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Patterns</h2>

        <h3>Public vs Protected Routes</h3>
        <pre className="docs-code">
{`// Public routes - no guards
app.registerRoute("/", "homePage");
app.registerRoute("/about", "aboutPage");
app.registerRoute("/login", "loginPage");

// Protected routes - require authentication
const requireAuth = () => authService.isAuthenticated();

app.registerRoute("/dashboard", "dashboardPage", {
  guards: [requireAuth],
  meta: { guardRedirect: "/login" }
});

app.registerRoute("/profile", "profilePage", {
  guards: [requireAuth],
  meta: { guardRedirect: "/login" }
});`}
        </pre>

        <h3>Admin Section</h3>
        <pre className="docs-code">
{`// All admin routes require auth + admin role
const requireAuth = () => authService.isAuthenticated();
const requireAdmin = () => authService.hasRole("admin");

app.registerRoute("/admin", "adminDashboard", {
  guards: [requireAuth, requireAdmin],
  meta: { guardRedirect: "/login" }
});

app.registerRoute("/admin/users", "adminUsers", {
  guards: [requireAuth, requireAdmin],
  meta: { guardRedirect: "/login" }
});

app.registerRoute("/admin/settings", "adminSettings", {
  guards: [requireAuth, requireAdmin],
  meta: { guardRedirect: "/login" }
});`}
        </pre>

        <h3>Permission-Based Access</h3>
        <pre className="docs-code">
{`// Guard factory for permissions
const requirePermission = (permission: string) => {
  return async () => {
    const user = await getCurrentUser();
    return user?.permissions.includes(permission) ?? false;
  };
};

// Apply to routes
app.registerRoute("/editor", "editorPage", {
  guards: [
    requireAuth,
    requirePermission("content.edit")
  ],
  meta: { guardRedirect: "/login" }
});

app.registerRoute("/publish", "publishPage", {
  guards: [
    requireAuth,
    requirePermission("content.publish")
  ],
  meta: { guardRedirect: "/unauthorized" }
});`}
        </pre>

        <h3>Guest-Only Routes</h3>
        <pre className="docs-code">
{`// Redirect authenticated users away from login/signup
const guestOnly = () => {
  const isAuthenticated = authService.isAuthenticated();
  if (isAuthenticated) {
    // Redirect to dashboard if already logged in
    navigate("/dashboard");
    return false;
  }
  return true;
};

app.registerRoute("/login", "loginPage", {
  guards: [guestOnly],
  meta: { guardRedirect: "/dashboard" }
});

app.registerRoute("/signup", "signupPage", {
  guards: [guestOnly],
  meta: { guardRedirect: "/dashboard" }
});`}
        </pre>

        <h3>Time-Based Access</h3>
        <pre className="docs-code">
{`// Allow access only during business hours
const duringBusinessHours = () => {
  const hour = new Date().getHours();
  return hour >= 9 && hour < 17;
};

app.registerRoute("/admin/critical", "criticalOpsPage", {
  guards: [
    requireAuth,
    requireAdmin,
    duringBusinessHours
  ],
  meta: { guardRedirect: "/admin" }
});`}
        </pre>
      </div>

      {/* Security Considerations */}
      <div className="docs-section">
        <h2 className="docs-section-title">Security Considerations</h2>
        <ul>
          <li><strong>Client-side guards are not security</strong> - Always validate on the server</li>
          <li><strong>Guards prevent UI access only</strong> - APIs must have their own authorization</li>
          <li><strong>Don't trust localStorage</strong> - Tokens can be stolen, always validate</li>
          <li><strong>Use HTTPS</strong> - Protect tokens in transit</li>
          <li><strong>Implement token refresh</strong> - Don't rely on expired tokens</li>
          <li><strong>Log access attempts</strong> - Track suspicious activity</li>
          <li><strong>Rate limit guards</strong> - Prevent brute force attempts</li>
        </ul>
      </div>

      {/* Related */}
      <div className="docs-section">
        <h2 className="docs-section-title">Related</h2>
        <ul>
          <li><strong>LuminoRouter</strong> - Router configuration</li>
          <li><strong>Router Hooks</strong> - useRouter for navigation</li>
          <li><strong>Link and Navigate</strong> - Navigation components</li>
        </ul>
      </div>
    </>
  );
}
