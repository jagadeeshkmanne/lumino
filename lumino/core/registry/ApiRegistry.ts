/**
 * Lumino Framework - API Registry
 *
 * Central registry for all API definitions.
 * Supports auto-registration when APIs are instantiated.
 */

import type { BuiltApi } from "../types/api";
import type { ApiGroup } from "../api/Api";

// =============================================================================
// GLOBAL SINGLETON REGISTRY
// =============================================================================

/**
 * Global API registry instance.
 * APIs auto-register here when instantiated.
 */
class GlobalApiRegistry {
  private _groups: Map<string, ApiGroup> = new Map();
  private _apis: Map<string, BuiltApi<any, any>> = new Map();

  /**
   * Register an API group (called automatically by base classes)
   */
  register(name: string, apiGroup: ApiGroup): void {
    this._groups.set(name, apiGroup);

    // Register individual APIs with fully qualified names
    const apis = apiGroup.getApis();
    Object.entries(apis).forEach(([apiName, api]) => {
      const fullName = `${name}.${apiName}`;
      this._apis.set(fullName, api);
      if (api.config?.id) {
        this._apis.set(api.config.id, api);
      }
    });
  }

  /**
   * Get API by group and name
   */
  get(groupName: string, apiName: string): BuiltApi<any, any> | undefined {
    return this._apis.get(`${groupName}.${apiName}`);
  }

  /**
   * Get API by ID
   */
  getById(id: string): BuiltApi<any, any> | undefined {
    return this._apis.get(id);
  }

  /**
   * Get API group by name
   */
  getGroup(groupName: string): ApiGroup | undefined {
    return this._groups.get(groupName);
  }

  /**
   * Get all API groups as object for context
   */
  getAll(): Record<string, Record<string, BuiltApi<any, any>>> {
    const result: Record<string, Record<string, BuiltApi<any, any>>> = {};
    this._groups.forEach((group, groupName) => {
      result[groupName] = group.getApis();
    });
    return result;
  }

  /**
   * Check if API group exists
   */
  hasGroup(groupName: string): boolean {
    return this._groups.has(groupName);
  }

  /**
   * Get all registered group names
   */
  getGroupNames(): string[] {
    return Array.from(this._groups.keys());
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this._groups.clear();
    this._apis.clear();
  }
}

/**
 * Global API registry - APIs auto-register here
 */
export const ApiRegistry = new GlobalApiRegistry();

// =============================================================================
// TYPE-SAFE API REFERENCE
// =============================================================================

/**
 * API Reference - a lazy reference to a registered API.
 * Resolves at runtime from the ApiRegistry.
 *
 * This provides type safety while avoiding direct imports.
 */
export interface ApiRef<T = any> {
  /** The group.api string reference */
  readonly ref: string;
  /** Marker to identify this as an ApiRef */
  readonly __apiRef: true;
  /** Phantom type for the return value */
  readonly __type?: T;
}

/**
 * Create a type-safe API reference.
 * Use this in lookup configs for better IDE support without importing APIs.
 *
 * The API must be registered via app.apis() for this to work at runtime.
 *
 * @example
 * // In your form config - no API import needed!
 * .lookup({
 *   api: api('CountriesApi.list'),
 *   labelField: 'label',
 * })
 *
 * // With type annotation for better type safety
 * .lookup({
 *   api: api<Country[]>('CountriesApi.list'),
 *   labelField: 'label',
 *   valueHandler: (country) => country.code,  // country is typed as Country
 * })
 */
export function api<T = any>(ref: string): ApiRef<T> {
  return {
    ref,
    __apiRef: true,
  } as ApiRef<T>;
}

/**
 * Check if a value is an ApiRef
 */
export function isApiRef(value: any): value is ApiRef {
  return value && typeof value === 'object' && value.__apiRef === true;
}
