/**
 * Lumino Framework - Dependency Manager
 *
 * Handles field dependencies and cascading updates.
 * When a field changes, triggers dependent field actions like:
 * - Clearing values
 * - Resetting to initial values
 * - Reloading data from API
 * - Custom handlers
 */

import type { FormContext } from "../types/context";
import type { DependsOnConfig, FieldConfig } from "../types/form";

// =============================================================================
// TYPES
// =============================================================================

export interface DependencyEntry {
  /** The field that has the dependency */
  fieldName: string;
  /** Fields this field depends on */
  dependsOnFields: string[];
  /** Configuration for what to do when dependency changes */
  config: DependsOnConfig;
}

export interface DependencyTriggerResult {
  /** Field that was updated */
  fieldName: string;
  /** Whether the field value was cleared */
  cleared: boolean;
  /** Whether the field value was reset */
  reset: boolean;
  /** API that was called (if any) */
  apiCalled?: string;
  /** Result from API call (if any) */
  apiResult?: any;
  /** Error from API call (if any) */
  apiError?: any;
}

// =============================================================================
// DEPENDENCY MANAGER
// =============================================================================

/**
 * Manages field dependencies for a form.
 *
 * @example
 * ```typescript
 * const depManager = new DependencyManager();
 *
 * // Register dependencies from form config
 * depManager.registerFromConfig(formConfig);
 *
 * // When "country" field changes
 * const results = await depManager.triggerDependencies("country", newValue, ctx);
 * // This will clear/reset/reload all fields that depend on "country"
 * ```
 */
export class DependencyManager {
  /** Map of source field -> dependent fields */
  private _dependencies: Map<string, DependencyEntry[]> = new Map();
  /** Debounce timers for each field */
  private _debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  /** API caller function (injected by UI layer) */
  private _apiCaller?: (api: string, params: any, ctx: FormContext) => Promise<any>;

  /**
   * Set the API caller function.
   * This is called by the UI layer to handle reloadApi.
   */
  setApiCaller(caller: (api: string, params: any, ctx: FormContext) => Promise<any>): void {
    this._apiCaller = caller;
  }

  /**
   * Register a dependency manually
   */
  register(
    fieldName: string,
    dependsOnFields: string | string[],
    config: DependsOnConfig
  ): void {
    const fields = Array.isArray(dependsOnFields) ? dependsOnFields : [dependsOnFields];
    const entry: DependencyEntry = {
      fieldName,
      dependsOnFields: fields,
      config,
    };

    // Register under each source field
    for (const sourceField of fields) {
      if (!this._dependencies.has(sourceField)) {
        this._dependencies.set(sourceField, []);
      }
      this._dependencies.get(sourceField)!.push(entry);
    }
  }

  /**
   * Register dependencies from form field configs
   */
  registerFromConfig(fieldConfigs: FieldConfig[]): void {
    for (const field of fieldConfigs) {
      if (field.dependsOn) {
        for (const [keyStr, config] of field.dependsOn) {
          const dependsOnFields = keyStr.split(",");
          this.register(field.name, dependsOnFields, config);
        }
      }
    }
  }

  /**
   * Get all fields that depend on a given field
   */
  getDependents(sourceField: string): DependencyEntry[] {
    return this._dependencies.get(sourceField) || [];
  }

  /**
   * Check if a field has any dependents
   */
  hasDependents(sourceField: string): boolean {
    const deps = this._dependencies.get(sourceField);
    return deps !== undefined && deps.length > 0;
  }

  /**
   * Trigger all dependencies for a field that changed.
   * Returns results of all triggered actions.
   */
  async triggerDependencies(
    changedField: string,
    newValue: any,
    ctx: FormContext
  ): Promise<DependencyTriggerResult[]> {
    const dependents = this.getDependents(changedField);
    if (dependents.length === 0) {
      return [];
    }

    const results: DependencyTriggerResult[] = [];

    for (const dep of dependents) {
      // Check if all dependency fields have the same changed field
      // (for multi-field dependencies, we might need to wait for all)
      const result = await this._processDependency(dep, changedField, newValue, ctx);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Process a single dependency
   */
  private async _processDependency(
    dep: DependencyEntry,
    changedField: string,
    newValue: any,
    ctx: FormContext
  ): Promise<DependencyTriggerResult | null> {
    const { fieldName, config } = dep;

    // Check onlyIfTruthy
    if (config.onlyIfTruthy && !newValue) {
      return null;
    }

    // Handle debounce
    if (config.debounceMs && config.debounceMs > 0) {
      return new Promise((resolve) => {
        // Clear existing timer
        const existingTimer = this._debounceTimers.get(fieldName);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        // Set new timer
        const timer = setTimeout(async () => {
          this._debounceTimers.delete(fieldName);
          const result = await this._executeActions(dep, changedField, newValue, ctx);
          resolve(result);
        }, config.debounceMs);

        this._debounceTimers.set(fieldName, timer);
      });
    }

    return this._executeActions(dep, changedField, newValue, ctx);
  }

  /**
   * Execute dependency actions
   */
  private async _executeActions(
    dep: DependencyEntry,
    changedField: string,
    newValue: any,
    ctx: FormContext
  ): Promise<DependencyTriggerResult> {
    const { fieldName, config } = dep;
    const result: DependencyTriggerResult = {
      fieldName,
      cleared: false,
      reset: false,
    };

    // Clear field value
    if (config.clear) {
      ctx.setValue(fieldName, undefined);
      ctx.clearFieldError(fieldName);
      result.cleared = true;
    }

    // Reset field to initial value
    if (config.reset) {
      ctx.resetField(fieldName);
      result.reset = true;
    }

    // Call reload API
    if (config.reloadApi && this._apiCaller) {
      try {
        const params = typeof config.reloadParams === "function"
          ? config.reloadParams(ctx)
          : config.reloadParams || {};

        result.apiCalled = config.reloadApi;
        result.apiResult = await this._apiCaller(config.reloadApi, params, ctx);
      } catch (error) {
        result.apiError = error;
      }
    }

    // Custom handler
    if (config.handler) {
      await config.handler(newValue, ctx);
    }

    return result;
  }

  /**
   * Cancel any pending debounced triggers
   */
  cancelPending(fieldName?: string): void {
    if (fieldName) {
      const timer = this._debounceTimers.get(fieldName);
      if (timer) {
        clearTimeout(timer);
        this._debounceTimers.delete(fieldName);
      }
    } else {
      // Cancel all
      for (const timer of this._debounceTimers.values()) {
        clearTimeout(timer);
      }
      this._debounceTimers.clear();
    }
  }

  /**
   * Clear all registered dependencies
   */
  clear(): void {
    this._dependencies.clear();
    this.cancelPending();
  }

  /**
   * Get all registered dependencies for debugging
   */
  getAll(): Map<string, DependencyEntry[]> {
    return new Map(this._dependencies);
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Create a new DependencyManager instance.
 * Each form should have its own instance.
 */
export function createDependencyManager(): DependencyManager {
  return new DependencyManager();
}
