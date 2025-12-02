/**
 * Lumino Framework - Router
 *
 * Lightweight router for Lumino pages.
 * Can be used standalone or integrated with React Router.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { RouteRegistry } from "../../core/registry/RouteRegistry";
import { PageRegistry } from "../../core/page/Page";
import { eventEmitter } from "../../core/events/EventEmitter";
import { getApp } from "../../core/app/LuminoApp";
import { getAppInstance } from "../../core/app/App";
import type { Page } from "../../core/page/Page";
import type { AppLayout } from "../../core/app/AppLayout";
import { FlexibleLayout } from "../../core/app/FlexibleLayout";
import { Lumino } from "../../core/Lumino";
import { PageRenderer } from "../renderer/PageRenderer";
import { FlexibleLayoutRenderer } from "../renderer/FlexibleLayoutRenderer";

// =============================================================================
// TYPES
// =============================================================================

export interface RouteMatch {
  path: string;
  pageId: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

export interface RouterContextValue {
  currentRoute: string;
  match: RouteMatch | null;
  params: Record<string, string>;
  query: Record<string, string>;
  navigate: (path: string) => void;
  redirect: (path: string) => void;
  back: () => void;
  /** Set a dynamic layout override for the current page */
  setLayout: (layoutClass: (new (id: string) => any) | null) => void;
  /** Get the current dynamic layout override */
  getLayout: () => (new (id: string) => any) | null;
}

/**
 * Layout component props - receives page content and router info
 */
export interface LayoutProps {
  /** The current page content to render */
  children: ReactNode;
  /** Current route match */
  match: RouteMatch | null;
  /** Current route path */
  currentRoute: string;
}

/**
 * Layout component type
 */
export type LayoutComponent = React.ComponentType<LayoutProps>;

export interface LuminoRouterProps {
  /** Base path for all routes */
  basePath?: string;
  /**
   * Component to show when no route matches
   */
  notFound?: ReactNode;
  /**
   * Callback when route changes
   */
  onRouteChange?: (route: RouteMatch | null) => void;
  /**
   * Custom children (advanced - overrides automatic page rendering)
   */
  children?: ReactNode;
}

// =============================================================================
// ROUTE MATCHING
// =============================================================================

/**
 * Parse path pattern to regex and extract param names
 */
function parsePathPattern(pattern: string): {
  regex: RegExp;
  paramNames: string[];
} {
  const paramNames: string[] = [];
  let regexStr = "^";

  const segments = pattern.split("/").filter(Boolean);

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    if (segment.startsWith(":")) {
      // Parameter segment
      const isOptional = segment.endsWith("?");
      const paramName = isOptional ? segment.slice(1, -1) : segment.slice(1);
      paramNames.push(paramName);

      if (isOptional) {
        // For optional params, make the slash and the capture group optional together
        regexStr += "(?:/([^/]+))?";
      } else {
        regexStr += "/([^/]+)";
      }
    } else {
      // Static segment
      regexStr += "/" + segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }

  // Handle trailing slash
  regexStr += "/?$";

  return {
    regex: new RegExp(regexStr),
    paramNames,
  };
}

/**
 * Match a path against registered routes
 */
function matchRoute(
  path: string,
  basePath: string = ""
): RouteMatch | null {
  // Remove base path
  let normalizedPath = path;
  if (basePath && path.startsWith(basePath)) {
    normalizedPath = path.slice(basePath.length) || "/";
  }

  // Parse query string
  const [pathname, queryString] = normalizedPath.split("?");
  const query: Record<string, string> = {};

  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      query[key] = value;
    });
  }

  // Find matching route
  const routes = RouteRegistry.getAll();

  for (const route of routes) {
    const { regex, paramNames } = parsePathPattern(route.path);
    const match = pathname.match(regex);

    if (match) {
      const params: Record<string, string> = {};
      paramNames.forEach((name, index) => {
        const value = match[index + 1];
        if (value !== undefined) {
          params[name] = value;
        }
      });

      return {
        path: route.path,
        pageId: route.pageId,
        params,
        query,
      };
    }
  }

  return null;
}

// =============================================================================
// CONTEXT
// =============================================================================

const RouterContext = createContext<RouterContextValue | null>(null);

/**
 * Hook for accessing router context
 */
export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a LuminoRouter");
  }
  return context;
}

/**
 * Hook for route params
 */
export function useParams(): Record<string, string> {
  const { params } = useRouter();
  return params;
}

/**
 * Hook for query params
 */
export function useQuery(): Record<string, string> {
  const { query } = useRouter();
  return query;
}

// =============================================================================
// ROUTER COMPONENT
// =============================================================================

/**
 * Lumino Router Component
 *
 * Automatically renders registered pages based on the current URL.
 * No configuration needed - just wrap your app!
 *
 * @example
 * ```typescript
 * // 1. Register routes (in app setup)
 * app.registerRoute("/", "homePage");
 * app.registerRoute("/employees", "employeeListPage");
 * app.registerRoute("/employees/:id?", "employeeFormPage");
 *
 * // 2. Use router (in App.tsx) - that's it!
 * <LuminoProvider config={config}>
 *   <LuminoRouter />
 * </LuminoProvider>
 *
 * // With custom 404 page
 * <LuminoRouter notFound={<NotFoundPage />} />
 * ```
 */
export function LuminoRouter({
  basePath = "",
  notFound,
  onRouteChange,
  children,
}: LuminoRouterProps) {
  const [currentRoute, setCurrentRoute] = useState(() => window.location.pathname);
  const [initialized, setInitialized] = useState(false);

  // Guard state: null = checking, true = passed, false = blocked
  const [guardStatus, setGuardStatus] = useState<boolean | null>(null);
  const [guardRedirectTo, setGuardRedirectTo] = useState<string | null>(null);

  // Wait for app to be fully initialized (routes, layout, etc.)
  useEffect(() => {
    // Use multiple microtask cycles to ensure all deferred initializations complete
    // Page, AppLayout, and Form all use queueMicrotask for their configure() calls
    const waitForInit = () => {
      queueMicrotask(() => {
        queueMicrotask(() => {
          setInitialized(true);
        });
      });
    };
    waitForInit();
  }, []);

  // Get layout from app configuration (supports both LuminoApp and App)
  const appLayout = useMemo(() => {
    if (!initialized) return null;
    // Try new OOP App first
    try {
      const app = getAppInstance();
      return app.getLayout();
    } catch {
      // Fall back to LuminoApp
      try {
        const app = getApp();
        return app.layout;
      } catch {
        return null;
      }
    }
  }, [initialized]);

  // Compute initial match synchronously to avoid flash of wrong mode on refresh
  const [match, setMatch] = useState<RouteMatch | null>(() => {
    // Try to match immediately - routes may already be registered
    try {
      return matchRoute(window.location.pathname + window.location.search, basePath);
    } catch {
      return null;
    }
  });

  // Dynamic layout override (can be set at runtime by pages)
  const [dynamicLayoutClass, setDynamicLayoutClass] = useState<(new (id: string) => any) | null>(null);

  // Clear dynamic layout when route changes
  useEffect(() => {
    setDynamicLayoutClass(null);
  }, [currentRoute]);

  // Compute effective match - either from state or synchronously
  const effectiveMatch = useMemo(() => {
    if (initialized) {
      // When initialized, always compute fresh match to ensure correctness
      return matchRoute(window.location.pathname + window.location.search, basePath);
    }
    return match;
  }, [initialized, match, currentRoute, basePath]);

  // Update match state when initialized or route changes (for consistency)
  useEffect(() => {
    if (initialized) {
      const newMatch = matchRoute(window.location.pathname + window.location.search, basePath);
      setMatch(newMatch);
    }
  }, [initialized, currentRoute, basePath]);

  // Route-level guards - check guards when route changes
  useEffect(() => {
    if (!initialized || !effectiveMatch) {
      setGuardStatus(true); // No guards for 404
      setGuardRedirectTo(null);
      return;
    }

    const routeConfig = RouteRegistry.getByPath(effectiveMatch.path);
    const guards = routeConfig?.guards;

    if (!guards || guards.length === 0) {
      setGuardStatus(true); // No guards configured
      setGuardRedirectTo(null);
      return;
    }

    // Reset guard status while checking
    setGuardStatus(null);

    const checkGuards = async () => {
      for (const guard of guards) {
        try {
          const result = await guard();
          if (!result) {
            // Guard failed - check for redirect in route meta
            const redirectPath = routeConfig?.meta?.guardRedirect || routeConfig?.meta?.redirectTo;

            eventEmitter.emit("navigation:blocked", {
              from: window.location.pathname,
              to: redirectPath,
              reason: "Route guard denied access",
            });

            setGuardStatus(false);
            setGuardRedirectTo(redirectPath || null);
            return;
          }
        } catch (error) {
          console.error("Route guard error:", error);
          setGuardStatus(false);
          return;
        }
      }
      // All guards passed
      setGuardStatus(true);
      setGuardRedirectTo(null);
    };

    checkGuards();
  }, [initialized, effectiveMatch, currentRoute]);

  // Handle guard redirect
  useEffect(() => {
    if (guardStatus === false && guardRedirectTo) {
      // Redirect after guard failure (use replace to avoid back-button loops)
      const fullPath = basePath + guardRedirectTo;
      window.history.replaceState({}, "", fullPath);
      setCurrentRoute(fullPath);
      const newMatch = matchRoute(fullPath, basePath);
      setMatch(newMatch);
      // Reset guard state for new route
      setGuardStatus(null);
      setGuardRedirectTo(null);
    }
  }, [guardStatus, guardRedirectTo, basePath]);

  // Navigate to a new route
  const navigate = useCallback(
    (path: string) => {
      const fullPath = basePath + path;
      const from = window.location.pathname;

      eventEmitter.emit("navigation:start", { from, to: fullPath });

      window.history.pushState({}, "", fullPath);
      setCurrentRoute(fullPath);

      const newMatch = matchRoute(fullPath, basePath);
      setMatch(newMatch);

      eventEmitter.emit("navigation:end", { from, to: fullPath });

      if (onRouteChange) {
        onRouteChange(newMatch);
      }
    },
    [basePath, onRouteChange]
  );

  // Redirect (replace history)
  const redirect = useCallback(
    (path: string) => {
      const fullPath = basePath + path;
      const from = window.location.pathname;

      eventEmitter.emit("navigation:start", { from, to: fullPath });

      window.history.replaceState({}, "", fullPath);
      setCurrentRoute(fullPath);

      const newMatch = matchRoute(fullPath, basePath);
      setMatch(newMatch);

      eventEmitter.emit("navigation:end", { from, to: fullPath });

      if (onRouteChange) {
        onRouteChange(newMatch);
      }
    },
    [basePath, onRouteChange]
  );

  // Go back
  const back = useCallback(() => {
    window.history.back();
  }, []);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname + window.location.search;
      setCurrentRoute(path);

      const newMatch = matchRoute(path, basePath);
      setMatch(newMatch);

      if (onRouteChange) {
        onRouteChange(newMatch);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [basePath, onRouteChange]);

  // Context value - use effectiveMatch for correct params on refresh
  const contextValue = useMemo<RouterContextValue>(
    () => ({
      currentRoute,
      match: effectiveMatch,
      params: effectiveMatch?.params || {},
      query: effectiveMatch?.query || {},
      navigate,
      redirect,
      back,
      setLayout: setDynamicLayoutClass,
      getLayout: () => dynamicLayoutClass,
    }),
    [currentRoute, effectiveMatch, navigate, redirect, back, dynamicLayoutClass]
  );

  // Get AppLayoutRenderer from adapter or use default
  const LayoutRenderer = useMemo(() => {
    const adapter = Lumino.ui.get();
    if (adapter?.AppLayoutRenderer) {
      return adapter.AppLayoutRenderer;
    }
    // Default HTML-based layout renderer (minimal, no UI library dependency)
    return ({ children, layout, currentRoute }: { children: ReactNode; layout: AppLayout; currentRoute: string }) => {
      const config = layout.getConfig();
      return (
        <div className="lum-app-layout" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {config.header && (
            <header className="lum-app-header" style={{ padding: "16px", borderBottom: "1px solid #ccc" }}>
              <h1>{config.header.title}</h1>
            </header>
          )}
          <div style={{ display: "flex", flex: 1 }}>
            {config.sidebar && (
              <nav className="lum-app-sidebar" style={{ width: "240px", padding: "16px", borderRight: "1px solid #ccc" }}>
                {config.sidebar.items?.map((item, i) => (
                  <div key={i} style={{ padding: "8px 0" }}>
                    <a href={item.path} style={{ color: currentRoute === item.path ? "#0066cc" : "inherit" }}>
                      {item.label}
                    </a>
                  </div>
                ))}
              </nav>
            )}
            <main className="lum-app-main" style={{ flex: 1, padding: "16px" }}>
              {children}
            </main>
          </div>
          {config.footer && (
            <footer className="lum-app-footer" style={{ padding: "16px", borderTop: "1px solid #ccc", textAlign: "center" }}>
              {config.footer.text}
            </footer>
          )}
        </div>
      );
    };
  }, []);

  // Get layout for the current route
  // Priority: dynamic layout > route-level layout > page-level override > app default layout
  const getLayoutForRoute = useCallback((routeMatch: RouteMatch | null, page?: Page<any> | null) => {
    // 0. Check for dynamic layout override (set at runtime via setLayout)
    if (dynamicLayoutClass) {
      return new dynamicLayoutClass(`dynamic-layout`);
    }

    if (!routeMatch) {
      // For 404, use app default layout
      return appLayout;
    }

    // Get route config from registry
    const routeConfig = RouteRegistry.getByPath(routeMatch.path);

    // 1. Check route-level layout (configured in routes)
    if (routeConfig?.layout) {
      return new routeConfig.layout(`route-${routeMatch.path.replace(/\//g, '-')}-layout`);
    }

    // 2. Check page-level layout override (deprecated, kept for backwards compatibility)
    if (page?.getLayoutOverride?.()) {
      const layoutClass = page.getLayoutOverride();
      return new layoutClass(`${page.id}-layout`);
    }

    // 3. Fall back to app default layout
    return appLayout;
  }, [appLayout, dynamicLayoutClass]);

  // Helper to render content with layout (supports both AppLayout and FlexibleLayout)
  const renderWithLayout = useCallback((layoutInstance: any, pageContent: ReactNode) => {
    // Check if it's a FlexibleLayout
    if (layoutInstance instanceof FlexibleLayout) {
      return (
        <FlexibleLayoutRenderer
          layout={layoutInstance}
          currentRoute={currentRoute}
          params={match?.params || {}}
          query={match?.query || {}}
          navigate={navigate}
        >
          {pageContent}
        </FlexibleLayoutRenderer>
      );
    }
    // Legacy AppLayout
    return (
      <LayoutRenderer layout={layoutInstance} currentRoute={currentRoute}>
        {pageContent}
      </LayoutRenderer>
    );
  }, [currentRoute, match, navigate, LayoutRenderer]);

  // Render page content with layout
  const content = useMemo(() => {
    // Wait for initialization before rendering - this ensures routes are registered
    if (!initialized) {
      return null; // Return nothing while initializing (fast, typically <1ms)
    }

    // If custom children provided, use them (advanced usage)
    if (children) {
      return children;
    }

    // No match - show 404
    if (!effectiveMatch) {
      const notFoundContent = notFound || <div>Page not found</div>;
      const layout = getLayoutForRoute(null);
      // Still wrap 404 in layout if available
      if (layout) {
        return renderWithLayout(layout, notFoundContent);
      }
      return notFoundContent;
    }

    // Check route-level guards
    if (guardStatus === null) {
      // Guards are still being checked - show nothing or loading
      return null;
    }

    if (guardStatus === false) {
      // Guards failed - show access denied or redirect handled elsewhere
      const routeConfig = RouteRegistry.getByPath(effectiveMatch.path);
      const redirectPath = routeConfig?.meta?.guardRedirect || routeConfig?.meta?.redirectTo;

      // If redirect path configured in route meta, show access denied
      // The actual redirect should be handled by the guard function itself
      const accessDeniedContent = <div>Access denied</div>;
      const layout = getLayoutForRoute(effectiveMatch);
      if (layout) {
        return renderWithLayout(layout, accessDeniedContent);
      }
      return accessDeniedContent;
    }

    // Get the matched page
    const page = PageRegistry.get(effectiveMatch.pageId);

    if (!page) {
      const errorContent = notFound || <div>Page "{effectiveMatch.pageId}" not found</div>;
      const layout = getLayoutForRoute(effectiveMatch);
      if (layout) {
        return renderWithLayout(layout, errorContent);
      }
      return errorContent;
    }

    // Render the page
    const pageContent = <PageRenderer page={page} />;

    // Get the effective layout for this route
    const effectiveLayout = getLayoutForRoute(effectiveMatch, page);

    // Wrap in layout if available
    if (effectiveLayout) {
      return renderWithLayout(effectiveLayout, pageContent);
    }

    return pageContent;
  }, [initialized, effectiveMatch, guardStatus, children, notFound, renderWithLayout, getLayoutForRoute]);

  return (
    <RouterContext.Provider value={contextValue}>
      {content}
    </RouterContext.Provider>
  );
}

// =============================================================================
// LINK COMPONENT
// =============================================================================

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  children: ReactNode;
}

/**
 * Link component for navigation
 */
export function Link({ to, replace = false, children, onClick, ...props }: LinkProps) {
  const { navigate, redirect } = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (onClick) {
        onClick(e);
      }

      if (replace) {
        redirect(to);
      } else {
        navigate(to);
      }
    },
    [to, replace, navigate, redirect, onClick]
  );

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

// =============================================================================
// ROUTE GUARD
// =============================================================================

export interface RouteGuardProps {
  canActivate: () => boolean | Promise<boolean>;
  fallback?: ReactNode;
  redirectTo?: string;
  children: ReactNode;
}

/**
 * Route guard component for protecting routes
 *
 * @example
 * ```typescript
 * <RouteGuard
 *   canActivate={() => isAuthenticated}
 *   redirectTo="/login"
 * >
 *   <ProtectedPage />
 * </RouteGuard>
 * ```
 */
export function RouteGuard({
  canActivate,
  fallback,
  redirectTo,
  children,
}: RouteGuardProps) {
  const { redirect } = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const result = await canActivate();
      setAllowed(result);

      if (!result && redirectTo) {
        eventEmitter.emit("navigation:blocked", {
          from: window.location.pathname,
          to: redirectTo,
          reason: "Access denied",
        });
        redirect(redirectTo);
      }
    };

    checkAccess();
  }, [canActivate, redirectTo, redirect]);

  if (allowed === null) {
    return fallback || null;
  }

  if (!allowed) {
    return fallback || null;
  }

  return <>{children}</>;
}

// =============================================================================
// NAVIGATE COMPONENT
// =============================================================================

export interface NavigateProps {
  to: string;
  replace?: boolean;
}

/**
 * Programmatic navigation component
 *
 * @example
 * ```typescript
 * if (shouldRedirect) {
 *   return <Navigate to="/home" />;
 * }
 * ```
 */
export function Navigate({ to, replace = false }: NavigateProps) {
  const { navigate, redirect } = useRouter();

  useEffect(() => {
    if (replace) {
      redirect(to);
    } else {
      navigate(to);
    }
  }, [to, replace, navigate, redirect]);

  return null;
}
