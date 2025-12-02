/**
 * Lumino Framework - Salt Design System Adapter
 *
 * Implements Lumino's adapter interfaces using @salt-ds/core components.
 *
 * ## Structure
 *
 * ```
 * lumino/adapters/salt/
 * ├── index.ts           - Main adapter export
 * ├── layout/            - Row, Column, Section, Form
 * ├── fields/            - TextInput, Select, Checkbox, etc.
 * └── components/        - Dialog, Card, Panel, Tabs
 * ```
 *
 * ## Usage
 *
 * ```tsx
 * import { Lumino } from "lumino";
 * import { saltAdapter } from "lumino/adapters/salt";
 *
 * // Register Salt as the UI adapter
 * Lumino.ui(saltAdapter);
 *
 * // Or use individual components directly
 * import { SaltTextInput, SaltSelect, SaltDialog } from "lumino/adapters/salt";
 * ```
 *
 * ## Architecture
 *
 * Each component:
 * 1. Accepts Lumino's standardized props (TextInputProps, DialogProps, etc.)
 * 2. Handles normalization internally (e.g., onChange(event) → onChange(value))
 * 3. Renders the corresponding Salt DS component
 */

import type { IUIAdapter } from "../../core/adapters";
import { Lumino } from "../../core/Lumino";

// Import individual adapters
import { saltLayoutAdapter, AppLayoutRenderer, SaltNavRenderer } from "./layout";
import { saltFieldAdapter, saltExtendedFieldComponents } from "./fields";
import { saltContainerAdapter } from "./components";
import { saltListAdapter } from "./lists";
import { saltActionAdapter } from "./actions";
import { saltFeedbackAdapter, saltFeedbackComponents } from "./feedback";
import { saltNavigationComponents } from "./navigation";
import { saltErrorPagesAdapter } from "./errors";
import { saltLoadingAdapter } from "./loading";

/**
 * Salt Design System UI Adapter
 *
 * Implements IUIAdapter interface for Salt DS.
 */
export const saltAdapter: IUIAdapter = {
  name: "salt",
  layout: saltLayoutAdapter,
  containers: saltContainerAdapter,
  fields: saltFieldAdapter,
  lists: saltListAdapter,
  actions: saltActionAdapter,
  feedback: saltFeedbackAdapter,

  // App layout renderer
  AppLayoutRenderer,

  // Nav renderer for FlexibleLayout
  NavRenderer: SaltNavRenderer,

  // Resolve string component types to actual components
  resolveComponent: (componentType) => {
    if (typeof componentType === "string") {
      // Check field adapter
      const field = (saltFieldAdapter as any)[componentType];
      if (field) return field;
      // Check extended fields (Slider, FileDropZone)
      const extendedField = (saltExtendedFieldComponents as any)[componentType];
      if (extendedField) return extendedField;
      // Check feedback components (Badge, Avatar, Spinner, etc.)
      const feedback = (saltFeedbackComponents as any)[componentType];
      if (feedback) return feedback;
      // Check navigation components (Menu, Pagination, etc.)
      const navigation = (saltNavigationComponents as any)[componentType];
      if (navigation) return navigation;
    }
    return componentType;
  },
};

// Re-export adapters
export { saltLayoutAdapter } from "./layout";
export { saltFieldAdapter } from "./fields";
export { saltContainerAdapter } from "./components";
export { saltListAdapter } from "./lists";
export { saltActionAdapter } from "./actions";

// Re-export individual components for direct use
export * from "./layout";
export * from "./fields";
export * from "./components";
export * from "./lists";
export * from "./actions";
export * from "./feedback";
export * from "./navigation";
export * from "./errors";
export * from "./loading";

// Re-export adapters
export { saltErrorPagesAdapter } from "./errors";
export { saltLoadingAdapter } from "./loading";

// Re-export interfaces for type checking
export type {
  IUIAdapter,
  IFieldAdapter,
  ILayoutAdapter,
  IContainerAdapter,
  IActionAdapter,
  IListAdapter,
} from "../../core/adapters";

// =============================================================================
// REGISTER AS DEFAULT ADAPTER
// =============================================================================

/**
 * Register Salt as the default adapter.
 * This is called automatically when this module is imported.
 * If user doesn't explicitly call Lumino.ui(someAdapter), Salt will be used.
 */
Lumino.ui.setDefault(() => saltAdapter as any);
