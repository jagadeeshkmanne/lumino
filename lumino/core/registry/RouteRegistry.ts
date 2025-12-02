/**
 * Lumino Framework - Route Registry
 *
 * Central registry for routes and their associated pages.
 */

// =============================================================================
// ROUTE REGISTRY TYPES
// =============================================================================

export interface RegisteredRoute {
  path: string;
  pageId: string;
  /** Optional layout class for this route */
  layout?: new (id: string) => any;
  /** Optional route guards */
  guards?: Array<() => boolean | Promise<boolean>>;
  /** Optional metadata */
  meta?: Record<string, any>;
}

// =============================================================================
// ROUTE REGISTRY
// =============================================================================

/**
 * Static registry for managing routes and their page mappings.
 * Routes auto-register when pages are instantiated via LuminoApp config.
 *
 * @example
 * ```typescript
 * // In LuminoApp config
 * const app = new LuminoApp({
 *   pages: [EmployeeListPage, EmployeeFormPage],
 *   routes: {
 *     "/": DashboardPage,  // additional routes
 *   }
 * });
 *
 * // Access routes
 * const route = RouteRegistry.getByPath("/employees/:id");
 * const allRoutes = RouteRegistry.getAll();
 * ```
 */
export class RouteRegistry {
  private static _routes: Map<string, RegisteredRoute> = new Map();
  private static _pageToRoute: Map<string, string> = new Map();

  /**
   * Register a route with its page
   */
  static register(path: string, config: RegisteredRoute): void {
    this._routes.set(path, config);
    this._pageToRoute.set(config.pageId, path);
  }

  /**
   * Get route by path
   */
  static getByPath(path: string): RegisteredRoute | undefined {
    return this._routes.get(path);
  }

  /**
   * Get route by page ID
   */
  static getByPageId(pageId: string): RegisteredRoute | undefined {
    const path = this._pageToRoute.get(pageId);
    return path ? this._routes.get(path) : undefined;
  }

  /**
   * Get path for a page
   */
  static getPath(pageId: string): string | undefined {
    return this._pageToRoute.get(pageId);
  }

  /**
   * Check if route exists
   */
  static has(path: string): boolean {
    return this._routes.has(path);
  }

  /**
   * Get all routes
   */
  static getAll(): RegisteredRoute[] {
    return Array.from(this._routes.values());
  }

  /**
   * Build URL from route pattern
   *
   * @example
   * ```typescript
   * RouteRegistry.buildUrl("/employees/:id/details", { id: "123" });
   * // Returns: "/employees/123/details"
   *
   * RouteRegistry.buildUrl("/employees/:id/details", { id: "123" }, { tab: "profile" });
   * // Returns: "/employees/123/details?tab=profile"
   * ```
   */
  static buildUrl(
    path: string,
    params?: Record<string, string>,
    query?: Record<string, string>
  ): string {
    let url = path;

    // Replace path parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}?`, value);
        url = url.replace(`:${key}`, value);
      });
    }

    // Remove any remaining optional params
    url = url.replace(/\/:[^/]+\?/g, "");

    // Add query string
    if (query && Object.keys(query).length > 0) {
      const queryString = new URLSearchParams(query).toString();
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Clear all registrations
   */
  static clear(): void {
    this._routes.clear();
    this._pageToRoute.clear();
  }
}
