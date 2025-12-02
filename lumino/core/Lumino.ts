/**
 * Lumino Framework - Global Namespace
 *
 * Central entry point for framework configuration.
 * Use Lumino.ui() to configure the UI adapter for your application.
 *
 * Default adapter is Salt. If no adapter is configured, Salt will be used.
 */

import type { ComponentType } from "react";
import type { UIAdapter, LayoutAdapter, ComponentEntry } from "./types/ui";

// =============================================================================
// UI ADAPTER REGISTRY
// =============================================================================

/** Default adapter loader - lazy loaded to avoid circular dependencies */
let defaultAdapterLoader: (() => UIAdapter) | null = null;

/** Currently active UI adapter */
let currentAdapter: UIAdapter | null = null;

/** Named adapter registry */
const adapterRegistry: Map<string, UIAdapter> = new Map();

/** Custom component overrides */
const componentOverrides: Map<string, ComponentEntry> = new Map();

/** Custom layout overrides */
let layoutOverrides: Partial<LayoutAdapter> = {};

// =============================================================================
// LUMINO NAMESPACE
// =============================================================================

/**
 * Set or get the active UI adapter.
 *
 * @example
 * ```typescript
 * import { Lumino } from "@lumino/core";
 * import { muiAdapter } from "@lumino/mui";
 *
 * // Set adapter by instance
 * Lumino.ui(muiAdapter);
 *
 * // Or by registered name
 * Lumino.ui.register("mui", muiAdapter);
 * Lumino.ui("mui");
 *
 * // Extend with custom components
 * Lumino.ui.extend({
 *   Row: MyCustomRow,
 *   Section: MyCustomSection,
 * });
 *
 * // Add a custom component
 * Lumino.ui.component("RichEditor", MyRichEditor);
 *
 * // Get current adapter
 * const adapter = Lumino.ui.get();
 * ```
 */
function setOrGetUI(adapterOrName?: UIAdapter | string): UIAdapter | undefined {
  if (adapterOrName === undefined) {
    return currentAdapter ?? undefined;
  }

  if (typeof adapterOrName === "string") {
    const adapter = adapterRegistry.get(adapterOrName);
    if (!adapter) {
      throw new Error(`UI adapter "${adapterOrName}" not registered. Use Lumino.ui.register() first.`);
    }
    currentAdapter = adapter;
  } else {
    currentAdapter = adapterOrName;
    // Auto-register by name if provided
    if (adapterOrName.name) {
      adapterRegistry.set(adapterOrName.name, adapterOrName);
    }
  }

  return currentAdapter;
}

/**
 * Register a named UI adapter.
 */
function registerAdapter(name: string, adapter: UIAdapter): void {
  adapterRegistry.set(name, adapter);
}

/**
 * Extend the current adapter's layout components.
 * Use to customize Row, Column, Section, Form, or FieldWrapper.
 */
function extendLayout(components: Partial<LayoutAdapter>): void {
  layoutOverrides = { ...layoutOverrides, ...components };
}

/**
 * Set the default adapter loader.
 * Called by the Salt adapter to register itself as the default.
 */
function setDefaultAdapter(loader: () => UIAdapter): void {
  defaultAdapterLoader = loader;
}

/**
 * Get the current UI adapter with overrides applied.
 * If no adapter is set, uses the default (Salt) adapter.
 */
function getAdapter(): UIAdapter | null {
  // If no adapter configured, try to load default
  if (!currentAdapter && defaultAdapterLoader) {
    currentAdapter = defaultAdapterLoader();
  }

  if (!currentAdapter) return null;

  // Apply layout overrides (only if adapter has layout or there are overrides)
  const hasLayoutOverrides = Object.keys(layoutOverrides).length > 0;
  const layout = currentAdapter.layout || hasLayoutOverrides
    ? { ...currentAdapter.layout, ...layoutOverrides }
    : undefined;

  // Merge component overrides
  const components = {
    ...currentAdapter.components,
    ...Object.fromEntries(componentOverrides),
  };

  return {
    ...currentAdapter,
    layout,
    components,
  };
}

/**
 * Add or override a component.
 */
function addComponent(name: string, component: ComponentType<any>, options?: Omit<ComponentEntry, "component">): void {
  componentOverrides.set(name, {
    component,
    ...options,
  });
}

/**
 * Resolve a component type to an actual component.
 * Uses the current adapter's resolver and component registry.
 *
 * Resolution order:
 * 1. Global component overrides (Lumino.ui.component())
 * 2. Adapter's customComponents (extendAdapter())
 * 3. Adapter's resolveComponent function
 * 4. Adapter's components registry
 * 5. Return as-is (direct component)
 */
function resolveComponent(componentType: any): ComponentType<any> | null {
  const adapter = getAdapter();
  if (!adapter) return componentType;

  // 1. Check global component overrides first
  if (typeof componentType === "string" && componentOverrides.has(componentType)) {
    return componentOverrides.get(componentType)!.component;
  }

  // 2. Check adapter's customComponents (from extendAdapter)
  if (typeof componentType === "string" && adapter.customComponents?.[componentType]) {
    return adapter.customComponents[componentType];
  }

  // 3. Use adapter's resolver
  if (adapter.resolveComponent) {
    return adapter.resolveComponent(componentType);
  }

  // 4. Check adapter's component registry
  if (typeof componentType === "string" && adapter.components?.[componentType]) {
    return adapter.components[componentType].component;
  }

  // 5. Return as-is (direct component import)
  return componentType;
}

/**
 * Get normalized onChange handler for a component.
 */
function normalizeOnChange(componentType: any, onChange: (value: any) => void): (...args: any[]) => void {
  const adapter = getAdapter();
  if (!adapter) return onChange;

  // Check component overrides
  if (typeof componentType === "string" && componentOverrides.has(componentType)) {
    const entry = componentOverrides.get(componentType)!;
    if (entry.normalizeOnChange) {
      return entry.normalizeOnChange(onChange);
    }
  }

  // Use adapter's normalizer
  if (adapter.normalizeOnChange) {
    return adapter.normalizeOnChange(componentType, onChange);
  }

  // Check adapter's component registry
  if (typeof componentType === "string" && adapter.components?.[componentType]?.normalizeOnChange) {
    return adapter.components[componentType].normalizeOnChange!(onChange);
  }

  return onChange;
}

/**
 * Check if a UI adapter is configured.
 */
function hasAdapter(): boolean {
  return currentAdapter !== null;
}

/**
 * Clear the current adapter (useful for testing).
 */
function clearAdapter(): void {
  currentAdapter = null;
  componentOverrides.clear();
  layoutOverrides = {};
}

// =============================================================================
// LUMINO OBJECT
// =============================================================================

/**
 * Lumino framework namespace.
 *
 * @example
 * ```typescript
 * // Configure UI adapter
 * Lumino.ui(muiAdapter);
 *
 * // Extend with custom layout
 * Lumino.ui.extend({
 *   Section: MyCustomSection,
 * });
 *
 * // Add custom component
 * Lumino.ui.component("RichEditor", MyRichEditor);
 * ```
 */
export const Lumino = {
  /**
   * UI adapter configuration.
   * Call with adapter to set, call without args to get.
   */
  ui: Object.assign(setOrGetUI, {
    /** Register a named adapter */
    register: registerAdapter,
    /** Extend layout components */
    extend: extendLayout,
    /** Get the effective adapter with overrides */
    get: getAdapter,
    /** Add or override a component */
    component: addComponent,
    /** Resolve component type to actual component */
    resolve: resolveComponent,
    /** Normalize onChange handler */
    normalizeOnChange,
    /** Check if adapter is configured */
    hasAdapter,
    /** Clear adapter (for testing) */
    clear: clearAdapter,
    /** Set default adapter loader (internal use) */
    setDefault: setDefaultAdapter,
  }),
};

// =============================================================================
// EXPORTS
// =============================================================================

export type { UIAdapter, LayoutAdapter, ComponentEntry } from "./types/ui";
export { extendAdapter } from "./types/ui";
