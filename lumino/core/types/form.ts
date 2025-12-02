/**
 * Lumino Framework - Form Types
 *
 * Types for Form class and FormBuilder.
 */

import type { CSSProperties, ReactNode } from "react";
import type { ComponentType } from "./base";
import type { ValidationRule, ValidationErrors } from "./validation";
import type { FormContext } from "./context";
import type { BuiltAction } from "./action";
import type { BuiltApi } from "./api";
import type { ApiRef } from "../registry/ApiRegistry";

// =============================================================================
// STYLING TYPES
// =============================================================================

/**
 * Inline style type - static or dynamic based on form context
 */
export type FormStyle = CSSProperties | ((ctx: FormContext) => CSSProperties);

/**
 * CSS class type - static or dynamic based on form context
 */
export type FormCssClass = string | ((ctx: FormContext) => string);

// =============================================================================
// FIELD CONFIGURATION
// =============================================================================

export type PropsFunction<T = any> = (ctx: FormContext) => T;

// =============================================================================
// VISIBILITY TYPES
// =============================================================================

/**
 * Visibility type determines how hiding affects data and validation.
 *
 * - "conditional": Field hidden based on form data condition
 *   - Data: CLEARED when hidden
 *   - Validation: SKIPPED when hidden
 *   - Use for: "Other reason" field, conditional fields
 *
 * - "access": Field hidden due to permissions/role
 *   - Data: PRESERVED when hidden
 *   - Validation: PERFORMED (server validates anyway)
 *   - Use for: Salary field hidden from non-HR users
 */
export type VisibilityType = "conditional" | "access";

/**
 * Visibility condition - can be boolean or function
 */
export type VisibilityCondition = boolean | ((ctx: FormContext) => boolean);

/**
 * Options for conditional hide behavior
 */
export interface ConditionalHideOptions {
  /**
   * Reset field to initial value when shown again.
   * Useful when you want fresh data on show.
   * @default false
   */
  resetOnShow?: boolean;
}

/**
 * Visibility configuration for a field/row/section
 */
export interface VisibilityConfig {
  /**
   * Conditional visibility - hide based on form data.
   * When hidden: data CLEARED, validation SKIPPED.
   */
  hide?: VisibilityCondition;
  /**
   * Conditional visibility (inverse) - show based on form data.
   * When hidden: data CLEARED, validation SKIPPED.
   */
  visible?: VisibilityCondition;
  /**
   * Access-based visibility - hide based on permissions.
   * When hidden: data PRESERVED, validation PERFORMED.
   */
  hideByAccess?: VisibilityCondition;
  /**
   * Access-based visibility (inverse) - show based on permissions.
   * When hidden: data PRESERVED, validation PERFORMED.
   */
  visibleByAccess?: VisibilityCondition;
  /**
   * Options for conditional hide behavior
   */
  conditionalOptions?: ConditionalHideOptions;
}

/**
 * Configuration for field dependencies.
 * When a dependency field changes, triggers the configured actions.
 *
 * @example
 * ```typescript
 * // Simple: clear state when country changes
 * .dependsOn("country", { clear: true })
 *
 * // With API reload
 * .dependsOn("country", {
 *   clear: true,
 *   reloadApi: "StatesApi.getByCountry",
 *   reloadParams: (ctx) => ({ path: { countryId: ctx.getValue("country") } })
 * })
 *
 * // Multiple dependencies
 * .dependsOn(["country", "region"], { clear: true })
 *
 * // Custom handler
 * .dependsOn("employeeType", {
 *   handler: (value, ctx) => {
 *     if (value === "contractor") {
 *       ctx.setValue("benefits", null);
 *       ctx.hideField("benefits");
 *     }
 *   }
 * })
 * ```
 */
export interface DependsOnConfig {
  /**
   * Clear this field's value when dependency changes.
   * @default false
   */
  clear?: boolean;

  /**
   * Reset this field to initial value when dependency changes.
   * @default false
   */
  reset?: boolean;

  /**
   * API to call when dependency changes (e.g., "StatesApi.getByCountry").
   * The result will be used to populate field options.
   */
  reloadApi?: string;

  /**
   * Parameters for the reload API call.
   * Can be static object or function that receives context.
   */
  reloadParams?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);

  /**
   * Custom handler called when dependency changes.
   * @param dependencyValue - The new value of the dependency field
   * @param ctx - Form context
   */
  handler?: (dependencyValue: any, ctx: FormContext) => void | Promise<void>;

  /**
   * Debounce delay in milliseconds before triggering actions.
   * Useful for text fields to avoid excessive API calls.
   * @default 0 (no debounce)
   */
  debounceMs?: number;

  /**
   * Only trigger if dependency value is truthy.
   * @default false
   */
  onlyIfTruthy?: boolean;
}

export interface FieldConfig {
  name: string;
  /** Component to render. If lookup is configured, this defaults to LookupField */
  component?: ComponentType;
  label?: string;
  placeholder?: string;
  rules: ValidationRule[];
  props: Record<string, any> | PropsFunction;
  /**
   * Visibility configuration for this field.
   * Supports both conditional and access-based visibility.
   */
  visibility?: VisibilityConfig;
  /**
   * Condition to disable field.
   * - When `true`: field is greyed out, can't interact
   * - Validation IS still performed
   */
  disable: boolean | ((ctx: FormContext) => boolean);
  /**
   * Condition to make field read-only.
   * - When `true`: can see value, can't edit
   * - Validation IS still performed
   */
  readOnly: boolean | ((ctx: FormContext) => boolean);
  /**
   * Field type - use "hidden" for hidden inputs.
   * - "hidden": renders as <input type="hidden">, validation IS performed
   * - Use for: entityId, version, createdAt, tracking fields
   */
  type?: "hidden" | string;
  colSpan?: number;
  groupId?: string;
  /**
   * Lookup configuration - if set, field becomes a lookup field.
   * No need to specify component - it will auto-use the UI adapter's LookupField.
   */
  lookup?: LookupFieldConfig;
  /**
   * Field dependencies - triggers actions when dependent fields change.
   * Map of dependency field name(s) to configuration.
   */
  dependsOn?: Map<string | string[], DependsOnConfig>;
  /** Margin around this field */
  margin?: SpacingConfig;
  /** Padding inside this field wrapper */
  padding?: SpacingConfig;
  /** CSS class for this field (static or dynamic based on form context) */
  cssClass?: FormCssClass;
  /** Inline styles for this field (static or dynamic based on form context) */
  style?: FormStyle;
  /** Custom wrapper component for this field */
  wrapper?: ComponentType;
  /**
   * Display-only mode - shows value as text instead of input component.
   * Used for table/list views where data is shown but not edited inline.
   */
  display?: boolean;
}

// =============================================================================
// LOOKUP FIELD CONFIGURATION
// =============================================================================

/**
 * Configuration for lookup fields with search dialogs.
 *
 * THIS IS UI-INDEPENDENT - pure configuration/data that describes behavior.
 * The actual UI rendering (dialog, table, inputs) is handled by the UI adapter.
 *
 * Same config works with MUI, Ant Design, Salt, or any UI library.
 *
 * @example
 * ```typescript
 * // Same configuration works with any UI library
 * .field("customer")
 *   .lookup({
 *     api: "CustomersApi.search",
 *     dialogTitle: "Search Customers",
 *     displayField: "name",
 *     valueField: "id",
 *     searchFields: ["name", "email", "phone"],
 *     columns: [
 *       { field: "name", header: "Name" },
 *       { field: "email", header: "Email" },
 *     ],
 *     // Bind selected values back to form
 *     onSelect: (selected, ctx) => {
 *       ctx.setValue("customerId", selected.id);
 *       ctx.setValue("customerName", selected.name);
 *       ctx.setValue("customerEmail", selected.email);
 *     }
 *   })
 *   .add()
 *
 * // UI Adapter handles the rendering:
 * // - MUI: Dialog + DataGrid + TextField
 * // - Ant: Modal + Table + Input
 * // - Salt: Dialog + DataGrid + Input
 * ```
 */
export interface LookupFieldConfig<TEntity = any, TValue = any> {
  /** API to call for search/list. Can be:
   * - ApiRef: Type-safe reference via api() helper (recommended)
   * - String: API method reference (e.g., "CustomersApi.search")
   * - Function: Async function that returns options array
   * - Object: LookupApi instance with list() method
   * - BuiltApi: A built API endpoint (e.g., countriesApi.list)
   */
  api: ApiRef<TEntity[]> | string | (() => Promise<TEntity[]>) | { list: () => Promise<TEntity[]> } | BuiltApi<TEntity[], any>;
  /** Dialog title */
  dialogTitle?: string;
  /** Label transformer - extracts the display text for options.
   * REQUIRED: Defines what text is shown in the dropdown.
   * @example
   * // Simple field
   * labelHandler: (entity) => entity.name
   * // Combine multiple fields
   * labelHandler: (user) => `${user.firstName} ${user.lastName}`
   * // With additional info
   * labelHandler: (product) => `${product.name} (${product.sku})`
   */
  labelHandler: (entity: TEntity) => string;
  /** Value transformer - extracts the value to store in the form.
   * REQUIRED: Defines what gets stored when user selects an option.
   * @example
   * // Store just the ID
   * valueHandler: (entity) => entity.id
   * // Store entire object
   * valueHandler: (entity) => entity
   * // Store custom object
   * valueHandler: (entity) => ({ id: entity.id, name: entity.name })
   */
  valueHandler: (entity: TEntity) => TValue;
  /** Fields to include in search query */
  searchFields?: string[];
  /** Columns to show in search results table */
  columns?: LookupColumn[];
  /** Additional filters to apply to search */
  filters?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  /** Called when user selects an item - use to bind multiple values */
  onSelect?: (selected: TEntity, ctx: FormContext) => void;
  /** Called when lookup is cleared */
  onClear?: (ctx: FormContext) => void;
  /** Minimum characters before triggering search (default: 1) */
  minSearchLength?: number;
  /** Debounce delay for search in ms (default: 300) */
  debounceMs?: number;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Custom search function (overrides api) */
  customSearch?: (query: string, ctx: FormContext) => Promise<TEntity[]>;
  /** Initial data to show before search (e.g., recent selections) */
  initialData?: TEntity[] | ((ctx: FormContext) => Promise<TEntity[]>);
  /** Empty state message */
  emptyMessage?: string;
  /** Pagination settings */
  pagination?: {
    enabled: boolean;
    pageSize?: number;
  };
}

export interface LookupColumn {
  /** Field name from the entity */
  field: string;
  /** Column header text (can be i18n key) */
  header: string;
  /** Column width (number for pixels, string for CSS value) */
  width?: number | string;
  /** Custom render function - returns display value */
  render?: (value: any, row: any) => any;
  /** Make column sortable */
  sortable?: boolean;
}

// =============================================================================
// ROW CONFIGURATION
// =============================================================================

/**
 * Spacing configuration for margin/padding
 */
export interface SpacingConfig {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

/**
 * Configuration for standalone components in a row (buttons, custom elements).
 * Unlike fields, components don't bind to form data - they render UI with callbacks.
 *
 * @example
 * ```typescript
 * // Add a button that triggers an action
 * this.addRow()
 *   .addComponent(Button)
 *     .props({ variant: "secondary" })
 *     .children("+ Add Address")
 *     .onClick((ctx) => ctx.list("addresses").add(new Address()))
 *     .endComponent()
 *   .endRow();
 *
 * // Add a button that renders in a named slot
 * this.addRow()
 *   .addComponent(Button)
 *     .children("+ Add Address")
 *     .target("addresses-section")  // Renders in the "addresses-section" slot
 *     .onClick((ctx) => ctx.list("addresses").add(new Address()))
 *     .endComponent()
 *   .endRow();
 * ```
 */
export interface RowComponentConfig {
  /** The component to render (Button, custom component, etc.) */
  component: ComponentType;
  /** Props to pass to the component */
  props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  /** Children/content for the component (e.g., button label) */
  children?: React.ReactNode | string;
  /** Click handler - receives form context */
  onClick?: (ctx: FormContext) => void | Promise<void>;
  /** Column span in the row layout */
  colSpan?: number;
  /** Visibility configuration */
  visibility?: VisibilityConfig;
  /** Additional CSS class (static or dynamic based on form context) */
  cssClass?: FormCssClass;
  /** Inline styles (static or dynamic based on form context) */
  style?: FormStyle;
  /**
   * Target slot where this component should be rendered.
   * If specified, the component is rendered in the named slot instead of inline.
   * Define slots using .slot("name") on sections, lists, or the form header.
   *
   * @example
   * // Define component to render in "addresses-header" slot
   * .addComponent(Button)
   *   .target("addresses-header")
   *   .children("+ Add")
   *   .onClick((ctx) => ctx.list("addresses").add(new Address()))
   *
   * // Define slot in list config
   * this.addList("addresses")
   *   .slot("addresses-header")  // Named slot in list header
   */
  target?: string;
}

export interface RowConfig {
  /** Fields in this row */
  fields: FieldConfig[];
  /** Standalone components in this row (buttons, custom elements) */
  components?: RowComponentConfig[];
  /**
   * Column layout - array of spans that sum to 12 (or columns value).
   * Each number specifies the span for the corresponding field/component.
   * @example [6, 6] - two equal columns
   * @example [4, 4, 4] - three equal columns
   * @example [8, 4] - one larger, one smaller
   * If not specified, items are distributed equally.
   */
  layout?: number[];
  /** Total grid columns (default: 12) */
  columns?: number;
  /** Gap between columns in pixels */
  gap?: number;
  /**
   * Visibility configuration for this row.
   * Supports both conditional and access-based visibility.
   */
  visibility?: VisibilityConfig;
  /** Margin around this row */
  margin?: SpacingConfig;
  /** Padding inside this row */
  padding?: SpacingConfig;
  /** Additional CSS class for this row (static or dynamic based on form context) */
  cssClass?: FormCssClass;
  /** Inline styles for this row (static or dynamic based on form context) */
  style?: FormStyle;
  /** Custom wrapper component for this row */
  wrapper?: ComponentType;
  /**
   * Marks this row as an "each" row - it gets repeated for each item in a list.
   * Used when Component.each() is called to define list item rendering.
   * @internal
   */
  isEachRow?: boolean;
  /**
   * The field name to iterate over for this each row.
   * If undefined, iterates over the current list context.
   * Used with each("fieldName") for nested arrays.
   * @internal
   */
  eachFieldName?: string;
}

// =============================================================================
// SECTION CONFIGURATION
// =============================================================================

export interface SectionConfig {
  /** Optional unique ID for this section (used for targeting lists) */
  id?: string;
  /** Section title */
  title: string;
  /** Rows in this section */
  rows: RowConfig[];
  /** Is section collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  collapsed?: boolean;
  /**
   * Visibility configuration for this section.
   * Supports both conditional and access-based visibility.
   */
  visibility?: VisibilityConfig;
  /** Gap between rows in pixels */
  gap?: number;
  /** Margin around this section */
  margin?: SpacingConfig;
  /** Padding inside this section */
  padding?: SpacingConfig;
  /** Additional CSS class for this section (static or dynamic based on form context) */
  cssClass?: FormCssClass;
  /** Inline styles for this section (static or dynamic based on form context) */
  style?: FormStyle;
  /**
   * Custom wrapper component for the section.
   * Wraps the entire section content (including title).
   * Use for custom panels, cards, or container styling.
   */
  wrapper?: ComponentType;
  /**
   * Action names to display in the section header.
   * These actions are defined on the form via addAction().
   * Buttons will be rendered in the section header area.
   */
  actions?: string[];
  /**
   * Standalone components to display in the section header (right side).
   * Use for buttons, icons, or custom elements next to the section title.
   * @deprecated Use headerRow for more layout control
   */
  headerComponents?: RowComponentConfig[];
  /**
   * Header row configuration - allows full row/column layout in section header.
   * The title becomes one column, and you can add more columns with components.
   * Use layout[] to control column widths.
   */
  headerRow?: RowConfig;
}

// =============================================================================
// FORM TABS CONFIGURATION
// =============================================================================

/**
 * Configuration for a single tab within a form
 */
export interface FormTabConfig {
  /** Tab ID */
  id: string;
  /** Tab label */
  label: string | ((ctx: FormContext) => string);
  /** Tab icon */
  icon?: ReactNode | string;
  /** Sections within this tab */
  sections: SectionConfig[];
  /** Form class reference (if using a separate form for this tab) */
  formClass?: new (...args: any[]) => any;
  /** Is tab disabled */
  disabled?: boolean | ((ctx: FormContext) => boolean);
  /** Badge content */
  badge?: string | number | ((ctx: FormContext) => string | number | undefined);
  /** Visibility condition */
  visibility?: VisibilityConfig;
}

/**
 * Configuration for tabs container within a form
 */
export interface FormTabsConfig {
  /** Tabs container ID */
  id: string;
  /** Tab configurations */
  tabs: FormTabConfig[];
  /** Tab position */
  position?: "top" | "bottom" | "left" | "right";
  /** Initial active tab */
  initialTab?: string | number;
  /** CSS class (static or dynamic based on form context) */
  cssClass?: FormCssClass;
  /** Inline styles (static or dynamic based on form context) */
  style?: FormStyle;
  /** Visibility */
  visibility?: VisibilityConfig;
}

// =============================================================================
// FORM CONFIGURATION
// =============================================================================

/**
 * Element type for tracking rendering order.
 * Used to render sections, lists, objects, and tabs in the order they were defined.
 */
export type FormElementType = "section" | "list" | "object" | "tabs";

/**
 * Element order entry - identifies an element by type and key.
 */
export interface FormElementOrder {
  type: FormElementType;
  key: string | number; // section index or list/object/tabs name
}

export interface FormConfig<TEntity = any> {
  id: string;
  sections: SectionConfig[];
  actions: Record<string, BuiltAction<TEntity>>;
  readOnly: boolean | ((ctx: FormContext) => boolean);
  /** Nested object configurations */
  objects?: Record<string, BuiltObjectConfig>;
  /** List/array configurations */
  lists?: Record<string, BuiltListConfig>;
  /** Tabs configurations */
  tabs?: FormTabsConfig[];
  /**
   * Order in which elements should be rendered.
   * Elements are rendered in this order to preserve definition order.
   */
  elementOrder?: FormElementOrder[];
  /**
   * Components that target named slots.
   * Keyed by slot name, value is array of components to render in that slot.
   * Used with .target("slot-name") on components.
   */
  targetedComponents?: Record<string, RowComponentConfig[]>;
}

// =============================================================================
// FORM LIFECYCLE
// =============================================================================

export interface FormLifecycle<TEntity = any> {
  onInit?(ctx: FormContext): void | Promise<void>;
  onLoad?(ctx: FormContext): void;
  onFieldChange?(field: string, value: any, ctx: FormContext): void;
  onBeforeSubmit?(action: string, ctx: FormContext): boolean | Promise<boolean>;
  onAfterSubmit?(action: string, response: any, ctx: FormContext): void;
  onValidationError?(errors: ValidationErrors, ctx: FormContext): void;
  onBeforeReset?(ctx: FormContext): boolean;
  onAfterReset?(ctx: FormContext): void;
}

// =============================================================================
// FORM STATE
// =============================================================================

export interface FormState {
  values: Record<string, any>;
  initialValues: Record<string, any>;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  dirty: boolean;
  submitting: boolean;
  readOnly: boolean;
  fieldVisibility: Record<string, boolean>;
  fieldDisabled: Record<string, boolean>;
  groupVisibility: Record<string, boolean>;
}

// =============================================================================
// FIELD BUILDER TYPES
// =============================================================================

export interface FieldBuilder<TParent> {
  component(comp: ComponentType): FieldBuilder<TParent>;
  label(label: string): FieldBuilder<TParent>;
  placeholder(placeholder: string): FieldBuilder<TParent>;
  rules(...rules: ValidationRule[]): FieldBuilder<TParent>;
  props(props: Record<string, any> | PropsFunction): FieldBuilder<TParent>;
  /**
   * Conditional hide - hide field based on form data/condition.
   * - NOT rendered in DOM
   * - Data is CLEARED when hidden
   * - Validation is SKIPPED
   * @example .hideByCondition((ctx) => ctx.getValue("type") !== "other")
   */
  hideByCondition(condition: VisibilityCondition, options?: ConditionalHideOptions): FieldBuilder<TParent>;
  /**
   * Conditional show - show field based on form data/condition.
   * Inverse of hideByCondition(). When hidden:
   * - Data is CLEARED
   * - Validation is SKIPPED
   * @example .visibleByCondition((ctx) => ctx.getValue("type") === "other")
   */
  visibleByCondition(condition: VisibilityCondition, options?: ConditionalHideOptions): FieldBuilder<TParent>;
  /**
   * Access-based hide - hide field based on permissions/role.
   * - NOT rendered in DOM
   * - Data is PRESERVED (not cleared)
   * - Validation IS PERFORMED
   * @example .hideByAccess((ctx) => !ctx.user.hasPermission("view_salary"))
   */
  hideByAccess(condition: VisibilityCondition): FieldBuilder<TParent>;
  /**
   * Access-based show - show field based on permissions/role.
   * Inverse of hideByAccess(). When hidden:
   * - Data is PRESERVED
   * - Validation IS PERFORMED
   * @example .visibleByAccess((ctx) => ctx.user.hasPermission("view_salary"))
   */
  visibleByAccess(condition: VisibilityCondition): FieldBuilder<TParent>;
  /**
   * Condition to disable field.
   * When true, field is greyed out but validation IS performed.
   * @example .disable((ctx) => ctx.mode === "view")
   */
  disable(condition: VisibilityCondition): FieldBuilder<TParent>;
  /**
   * Condition to make field read-only.
   * When true, can see value but can't edit. Validation IS performed.
   * @example .readOnly((ctx) => !ctx.user.hasPermission("edit_notes"))
   */
  readOnly(condition: VisibilityCondition): FieldBuilder<TParent>;
  /**
   * Set field type - use "hidden" for hidden inputs.
   * Hidden inputs ARE in DOM and validation IS performed.
   * @example .type("hidden") // for entityId, version, tracking fields
   */
  type(fieldType: "hidden" | string): FieldBuilder<TParent>;
  colSpan(span: number): FieldBuilder<TParent>;
  group(groupId: string): FieldBuilder<TParent>;
  /** Configure lookup/search dialog for this field */
  lookup(config: LookupFieldConfig): FieldBuilder<TParent>;
  /**
   * Define field dependency - triggers actions when dependent field(s) change.
   * @example
   * ```typescript
   * // Clear state when country changes
   * .dependsOn("country", { clear: true })
   *
   * // Reload states from API when country changes
   * .dependsOn("country", {
   *   clear: true,
   *   reloadApi: "StatesApi.getByCountry",
   *   reloadParams: (ctx) => ({ path: { countryId: ctx.getValue("country") } })
   * })
   *
   * // Multiple dependencies
   * .dependsOn(["country", "region"], { clear: true })
   * ```
   */
  dependsOn(fields: string | string[], config: DependsOnConfig): FieldBuilder<TParent>;
  /** Margin around this field */
  margin(spacing: SpacingConfig): FieldBuilder<TParent>;
  /** Padding inside this field wrapper */
  padding(spacing: SpacingConfig): FieldBuilder<TParent>;
  /** Additional CSS class for this field (static or dynamic based on form context) */
  css(className: FormCssClass): FieldBuilder<TParent>;
  /** Inline styles for this field (static or dynamic based on form context) */
  style(styles: FormStyle): FieldBuilder<TParent>;
  /** Wrap field with a custom container component */
  wrapper(component: ComponentType): FieldBuilder<TParent>;
  end(): TParent;
}

// =============================================================================
// ROW BUILDER TYPES
// =============================================================================

export interface RowBuilder<TParent> {
  addField(name: string): FieldBuilder<RowBuilder<TParent>>;
  /**
   * Set column layout for this row.
   * @param spans Array of column spans that should sum to 12.
   * @example .layout([6, 6]) - two equal columns
   * @example .layout([4, 4, 4]) - three equal columns
   * @example .layout([8, 4]) - one larger, one smaller
   */
  layout(spans: number[]): RowBuilder<TParent>;
  /** Total grid columns (default: 12) */
  columns(count: number): RowBuilder<TParent>;
  /** Gap between columns in this row (pixels) */
  gap(gap: number): RowBuilder<TParent>;
  /**
   * Conditional hide - hide row based on form data/condition.
   * When hidden: field data CLEARED, validation SKIPPED.
   * @example .hideByCondition((ctx) => ctx.getValue("showAdvanced") === false)
   */
  hideByCondition(condition: VisibilityCondition): RowBuilder<TParent>;
  /**
   * Conditional show - show row based on form data/condition.
   * When hidden: field data CLEARED, validation SKIPPED.
   * @example .visibleByCondition((ctx) => ctx.getValue("showAdvanced") === true)
   */
  visibleByCondition(condition: VisibilityCondition): RowBuilder<TParent>;
  /**
   * Access-based hide - hide row based on permissions/role.
   * When hidden: field data PRESERVED, validation PERFORMED.
   * @example .hideByAccess((ctx) => !ctx.user.hasRole("admin"))
   */
  hideByAccess(condition: VisibilityCondition): RowBuilder<TParent>;
  /**
   * Access-based show - show row based on permissions/role.
   * When hidden: field data PRESERVED, validation PERFORMED.
   * @example .visibleByAccess((ctx) => ctx.user.hasRole("admin"))
   */
  visibleByAccess(condition: VisibilityCondition): RowBuilder<TParent>;
  /**
   * Margin around this row.
   * @example .margin({ bottom: 32 }) - extra space after this row
   */
  margin(spacing: SpacingConfig): RowBuilder<TParent>;
  /**
   * Padding inside this row.
   * @example .padding({ left: 16, right: 16 })
   */
  padding(spacing: SpacingConfig): RowBuilder<TParent>;
  /** Additional CSS class for this row (static or dynamic based on form context) */
  css(className: FormCssClass): RowBuilder<TParent>;
  /** Inline styles for this row (static or dynamic based on form context) */
  style(styles: FormStyle): RowBuilder<TParent>;
  /** Wrap row with a custom container component */
  wrapper(component: ComponentType): RowBuilder<TParent>;
  end(): TParent;
}

// =============================================================================
// SECTION BUILDER TYPES
// =============================================================================

export interface SectionBuilder<TParent> {
  addRow(): RowBuilder<SectionBuilder<TParent>>;
  collapsible(collapsible?: boolean): SectionBuilder<TParent>;
  collapsed(collapsed?: boolean): SectionBuilder<TParent>;
  /**
   * Conditional hide - hide section based on form data/condition.
   * When hidden: field data CLEARED, validation SKIPPED.
   * @example .hideByCondition((ctx) => ctx.getValue("employeeType") === "contractor")
   */
  hideByCondition(condition: VisibilityCondition): SectionBuilder<TParent>;
  /**
   * Conditional show - show section based on form data/condition.
   * When hidden: field data CLEARED, validation SKIPPED.
   * @example .visibleByCondition((ctx) => ctx.getValue("employeeType") === "fulltime")
   */
  visibleByCondition(condition: VisibilityCondition): SectionBuilder<TParent>;
  /**
   * Access-based hide - hide section based on permissions/role.
   * When hidden: field data PRESERVED, validation PERFORMED.
   * @example .hideByAccess((ctx) => !ctx.user.hasPermission("view_compensation"))
   */
  hideByAccess(condition: VisibilityCondition): SectionBuilder<TParent>;
  /**
   * Access-based show - show section based on permissions/role.
   * When hidden: field data PRESERVED, validation PERFORMED.
   * @example .visibleByAccess((ctx) => ctx.user.hasPermission("view_compensation"))
   */
  visibleByAccess(condition: VisibilityCondition): SectionBuilder<TParent>;
  /** Gap between rows in this section (pixels) */
  gap(gap: number): SectionBuilder<TParent>;
  /**
   * Margin around this section.
   * @example .margin({ bottom: 24 })
   */
  margin(spacing: SpacingConfig): SectionBuilder<TParent>;
  /**
   * Padding inside this section.
   * @example .padding({ top: 16, bottom: 16 })
   */
  padding(spacing: SpacingConfig): SectionBuilder<TParent>;
  /** Additional CSS class for this section (static or dynamic based on form context) */
  css(className: FormCssClass): SectionBuilder<TParent>;
  /** Inline styles for this section (static or dynamic based on form context) */
  style(styles: FormStyle): SectionBuilder<TParent>;
  /**
   * Wrap section with a custom container component.
   * Use for custom panels, cards, or container styling.
   * @example .wrapper(MyPanel) - wraps section content in MyPanel
   */
  wrapper(component: ComponentType): SectionBuilder<TParent>;
  end(): TParent;
}

// =============================================================================
// FORM BUILDER TYPES
// =============================================================================

export interface FormBuilderInterface {
  addSection(title: string): SectionBuilder<FormBuilderInterface>;
  addRow(): RowBuilder<FormBuilderInterface>;
  build(): FormConfig;
}

// =============================================================================
// DYNAMIC FORM STRUCTURES - property(), object(), list()
// =============================================================================

/**
 * Display mode component for lists.
 * The actual component comes from the UI adapter.
 */
export type ListDisplayComponent = ComponentType;

/**
 * Position for action buttons
 */
export type ActionPosition =
  | "top"
  | "bottom"
  | "row"
  | "tabBar"
  | "inline"
  | { custom: ComponentType };

/**
 * Configuration for list actions (add, remove, etc.)
 * By default, NO action buttons are rendered. Actions are opt-in.
 */
export interface ListActionConfig {
  /** Add new item action */
  add?: {
    /** Button label */
    label?: string;
    /** Position of add button */
    position?: ActionPosition;
    /** Icon component (optional) */
    icon?: ComponentType;
    /** Condition to show/enable the add button */
    enabled?: boolean | ((ctx: FormContext) => boolean);
  };
  /** Remove item action */
  remove?: {
    /** Button/icon label */
    label?: string;
    /** Position of remove button (usually "row" for per-item) */
    position?: ActionPosition;
    /** Icon component (optional) */
    icon?: ComponentType;
    /** Show confirmation before removing */
    confirm?: boolean | string;
    /** Condition to show/enable the remove button */
    enabled?: boolean | ((ctx: FormContext, index: number) => boolean);
  };
  /** Close tab action (for Tabs display) */
  close?: {
    /** Show confirmation before closing */
    confirm?: boolean | string;
    /** Condition to show/enable the close button */
    enabled?: boolean | ((ctx: FormContext, index: number) => boolean);
  };
  /** Reorder actions (drag-drop or move buttons) */
  reorder?: {
    /** Enable drag and drop */
    dragDrop?: boolean;
    /** Show move up/down buttons */
    moveButtons?: boolean;
    /** Condition to enable reordering */
    enabled?: boolean | ((ctx: FormContext) => boolean);
  };
}

/**
 * Default values for new list items.
 * Can be a static object or a function that generates defaults.
 */
export type ListDefaults<T = Record<string, any>> =
  | Partial<T>
  | ((ctx: FormContext, index: number) => Partial<T>);

/**
 * Configuration for addList() - arrays of items
 *
 * @example
 * ```typescript
 * this.addList("items", {
 *   min: 1,
 *   max: 50,
 *   as: Rows,  // or Tabs, Table, Cards
 *   defaults: { qty: 1, price: 0 },
 *   actions: {
 *     add: { label: "+ Add Item", position: "bottom" },
 *     remove: { position: "row", confirm: true },
 *   },
 * })
 * ```
 */
/**
 * Props passed to custom display components
 */
export interface ListDisplayProps<T = any> {
  /** The list items */
  items: T[];
  /** Form context for operations */
  ctx: FormContext;
  /** Field name of the list */
  fieldName: string;
  /** Configuration options passed via displayProps */
  options?: Record<string, any>;
}

export interface ListConfig<T = Record<string, any>> {
  /** Minimum number of items required */
  min?: number;
  /** Maximum number of items allowed */
  max?: number;
  /**
   * Display component for the list.
   * Can be a built-in mode (Rows, Tabs, Table, Cards) or a custom component.
   *
   * Custom components receive ListDisplayProps<T> with items, ctx, and fieldName.
   *
   * @example
   * ```typescript
   * // Built-in display mode
   * .list("addresses").as(Rows).end()
   *
   * // Custom display component
   * .list("experiences").as(ExperienceTable).end()
   * ```
   */
  as?: ListDisplayComponent;
  /**
   * Props to pass to the display component.
   * Can be static object or function that receives context.
   * Works with both built-in and custom display components.
   */
  displayProps?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  /** Default values when adding new items */
  defaults?: ListDefaults<T>;
  /** Action buttons configuration (add, remove, reorder) - opt-in */
  actions?: ListActionConfig;
  /** For Tabs display: function to generate tab label from item */
  tabLabel?: string | ((item: T, index: number, ctx: FormContext) => string);
  /** For Table display: column configurations */
  tableColumns?: TableColumnConfig[];
  /** Validation rules for the entire list (e.g., min items) */
  rules?: ValidationRule[];
  /** Visibility configuration */
  visibility?: VisibilityConfig;
  /** CSS class for the list container (static or dynamic based on form context) */
  cssClass?: FormCssClass;
  /** Inline styles for the list container (static or dynamic based on form context) */
  style?: FormStyle;
  /** Custom wrapper component */
  wrapper?: ComponentType;
}

/**
 * Table column configuration for Table display mode
 */
export interface TableColumnConfig {
  /** Field name */
  field: string;
  /** Column header */
  header: string;
  /** Column width */
  width?: number | string;
  /** Custom render function */
  render?: (value: any, item: any, index: number) => any;
  /** Sortable column */
  sortable?: boolean;
  /** Editable inline */
  editable?: boolean;
}

/**
 * Configuration for addObject() - nested objects
 *
 * @example
 * ```typescript
 * this.addObject("customer")
 *   .addRow()
 *     .addField("name").label("Name").endField()
 *     .addField("email").label("Email").endField()
 *   .endRow();
 * // Value: { customer: { name: "...", email: "..." } }
 * ```
 */
export interface ObjectConfig {
  /** Visibility configuration */
  visibility?: VisibilityConfig;
  /** CSS class for the object container (static or dynamic based on form context) */
  cssClass?: FormCssClass;
  /** Inline styles for the object container (static or dynamic based on form context) */
  style?: FormStyle;
  /** Custom wrapper component */
  wrapper?: ComponentType;
  /** Collapsible section for the object */
  collapsible?: boolean;
  /** Initial collapsed state */
  collapsed?: boolean;
  /** Title for the object section */
  title?: string;
}

/**
 * Built list configuration (after builder is complete)
 */
export interface BuiltListConfig<T = Record<string, any>> extends ListConfig<T> {
  /** Unique identifier for this list */
  id: string;
  /** Field definitions for each item (used for inline field definitions) */
  rows: RowConfig[];
  /**
   * Form class to use for each list item.
   * When specified, renders each item using this Form class instead of inline rows.
   * The form class should define fields matching the list item type T.
   *
   * @example
   * ```typescript
   * this.addList<Address>("addresses")
   *   .as(Tabs)
   *   .itemForm(AddressForm)  // Use AddressForm for each tab
   *   .end();
   * ```
   */
  itemFormClass?: new (...args: any[]) => any;
  /**
   * React component to render each list item.
   * Simpler alternative to itemFormClass - just pass a component.
   *
   * @example
   * ```typescript
   * this.addList<Address>("addresses")
   *   .as(Tabs)
   *   .component(AddressFields)  // React component for each tab
   *   .end();
   * ```
   */
  itemComponent?: import("./base").ComponentType;
  /**
   * Entity class to use when creating new items via canAdd().
   * When specified, new items are created using: new entityClass()
   *
   * @example
   * ```typescript
   * this.addList<Address>("addresses")
   *   .as(Tabs)
   *   .canAdd(Address)  // new Address() provides defaults
   *   .end();
   * ```
   */
  entityClass?: new () => T;
  /**
   * Form class to use in dialog for add/edit operations.
   * When specified, clicking add/edit will open a dialog with this form.
   * The display component (Table, custom) shows the list, dialog handles editing.
   *
   * @example
   * ```typescript
   * this.addList<Experience>("experiences")
   *   .as(ExperienceTable)  // Custom table display
   *   .editForm(ExperienceDialogForm)  // Form shown in dialog
   *   .canAdd(Experience)
   *   .end();
   * ```
   */
  editFormClass?: new (...args: any[]) => any;
  /**
   * Named slot for this list's header area.
   * Components with matching target() will be rendered here.
   *
   * @example
   * ```typescript
   * // Define slot in list
   * this.addList<Address>("addresses")
   *   .slot("addresses-header")  // Define header slot
   *   .as(Tabs)
   *   .end();
   *
   * // Target the slot from anywhere in the form
   * this.addRow()
   *   .addComponent(Button)
   *     .target("addresses-header")  // Render in addresses header
   *     .children("+ Add Address")
   *     .onClick((ctx) => ctx.list("addresses").add(new Address()))
   *   .endRow();
   * ```
   */
  slot?: string;
  /**
   * Target section to render this list in.
   * When specified, the list renders inside/after the section with this title.
   *
   * @example
   * ```typescript
   * // Section defines a render target
   * this.addSection("Addresses")
   *   .addComponent(Button).children("+ Add").onClick(...).endComponent()
   *   .endSection();
   *
   * // List targets that section
   * this.addList<Address>("addresses")
   *   .target("Addresses")  // Renders after/in the "Addresses" section
   *   .as(Tabs)
   *   .end();
   * ```
   */
  target?: string;
  /**
   * Container configurations from Component.container() API.
   * When present, the list renders using ContainerRenderer instead of rows.
   *
   * @example
   * ```typescript
   * class ExperienceTable extends Component<Experience> {
   *   configure() {
   *     this.container(LumTable)
   *       .add(LumTHead)...
   *       .add(LumTBody).each().add(LumTR)...
   *     .end();
   *   }
   * }
   *
   * this.addList<Experience>("experiences")
   *   .include(ExperienceTable)  // Uses container() API
   *   .end();
   * ```
   */
  containers?: ContainerNodeConfig[];
}

/**
 * Built object configuration (after builder is complete)
 */
export interface BuiltObjectConfig extends ObjectConfig {
  /** Unique identifier for this object */
  id: string;
  /** Field definitions for the object */
  rows: RowConfig[];
}

// =============================================================================
// PROPERTY/OBJECT/LIST BUILDER TYPES
// =============================================================================

/**
 * Builder for property() - single field values
 * Same as FieldBuilder but accessed via property()
 */
export interface PropertyBuilder<TParent> extends FieldBuilder<TParent> {
  // Inherits all FieldBuilder methods
}

/**
 * Builder for object() - nested objects
 */
export interface ObjectBuilder<TParent> {
  /** Add a row of fields to this object */
  row(): RowBuilder<ObjectBuilder<TParent>>;
  /** Add a nested property */
  property(name: string): PropertyBuilder<ObjectBuilder<TParent>>;
  /** Add a nested object */
  object(name: string, config?: ObjectConfig): ObjectBuilder<ObjectBuilder<TParent>>;
  /** Add a nested list */
  list<T = Record<string, any>>(name: string, config?: ListConfig<T>): ListBuilder<ObjectBuilder<TParent>, T>;
  /** Make this object collapsible */
  collapsible(collapsible?: boolean): ObjectBuilder<TParent>;
  /** Set initial collapsed state */
  collapsed(collapsed?: boolean): ObjectBuilder<TParent>;
  /** Set title for the object section */
  title(title: string): ObjectBuilder<TParent>;
  /** Visibility configuration */
  hideByCondition(condition: VisibilityCondition): ObjectBuilder<TParent>;
  visibleByCondition(condition: VisibilityCondition): ObjectBuilder<TParent>;
  hideByAccess(condition: VisibilityCondition): ObjectBuilder<TParent>;
  visibleByAccess(condition: VisibilityCondition): ObjectBuilder<TParent>;
  /** CSS class (static or dynamic based on form context) */
  css(className: FormCssClass): ObjectBuilder<TParent>;
  /** Inline styles (static or dynamic based on form context) */
  style(styles: FormStyle): ObjectBuilder<TParent>;
  /** Custom wrapper */
  wrapper(component: ComponentType): ObjectBuilder<TParent>;
  /** End building and return to parent */
  end(): TParent;
}

/**
 * Builder for list() - arrays of items
 */
export interface ListBuilder<TParent, T = Record<string, any>> {
  /** Add a row of fields for each list item */
  row(): RowBuilder<ListBuilder<TParent, T>>;
  /** Add a property to each list item */
  property(name: string): PropertyBuilder<ListBuilder<TParent, T>>;
  /** Add a nested object to each list item */
  object(name: string, config?: ObjectConfig): ObjectBuilder<ListBuilder<TParent, T>>;
  /** Add a nested list to each list item */
  list<U = Record<string, any>>(name: string, config?: ListConfig<U>): ListBuilder<ListBuilder<TParent, T>, U>;
  /** Set minimum items required */
  min(count: number): ListBuilder<TParent, T>;
  /** Set maximum items allowed */
  max(count: number): ListBuilder<TParent, T>;
  /**
   * Set the display component for the list.
   * Can be a built-in mode (Rows, Tabs, Table, Cards) or a custom component.
   *
   * Custom components receive ListDisplayProps<T> with items, ctx, and fieldName.
   *
   * @example
   * ```typescript
   * // Built-in display mode
   * .list("addresses").as(Rows).end()
   *
   * // Custom display component - receives { items, ctx, fieldName, options }
   * .list("experiences")
   *   .as(ExperienceTable)
   *   .displayProps({ onRowClick: (item, i) => ctx.open(EditDialog, { data: item }) })
   *   .end()
   * ```
   */
  as(component: ListDisplayComponent): ListBuilder<TParent, T>;
  /**
   * Set props to pass to the display component.
   * Can be static object or function that receives context.
   * Available in the component via props.options.
   */
  displayProps(props: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): ListBuilder<TParent, T>;
  /** Set default values for new items */
  defaults(values: ListDefaults<T>): ListBuilder<TParent, T>;
  /** Configure actions (add, remove, reorder) */
  actions(config: ListActionConfig): ListBuilder<TParent, T>;
  /** Set tab label generator (for Tabs display) */
  tabLabel(labelFn: string | ((item: T, index: number, ctx: FormContext) => string)): ListBuilder<TParent, T>;
  /** Set table columns (for Table display) */
  tableColumns(columns: TableColumnConfig[]): ListBuilder<TParent, T>;
  /** Add validation rules for the entire list */
  rules(...rules: ValidationRule[]): ListBuilder<TParent, T>;
  /** Visibility configuration */
  hideByCondition(condition: VisibilityCondition): ListBuilder<TParent, T>;
  visibleByCondition(condition: VisibilityCondition): ListBuilder<TParent, T>;
  hideByAccess(condition: VisibilityCondition): ListBuilder<TParent, T>;
  visibleByAccess(condition: VisibilityCondition): ListBuilder<TParent, T>;
  /** CSS class (static or dynamic based on form context) */
  css(className: FormCssClass): ListBuilder<TParent, T>;
  /** Inline styles (static or dynamic based on form context) */
  style(styles: FormStyle): ListBuilder<TParent, T>;
  /** Custom wrapper */
  wrapper(component: ComponentType): ListBuilder<TParent, T>;
  /** End building and return to parent */
  end(): TParent;
}

// =============================================================================
// CONTAINER CONFIGURATION TYPES
// =============================================================================

/**
 * Configuration for a container node in the container tree.
 * Used by the container() builder API for custom layouts.
 */
export interface ContainerNodeConfig {
  /** The component type (e.g., LumTable, LumTR, LumTD) */
  component: ComponentType;
  /** Props to pass to the component */
  props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  /** Child nodes (nested containers or elements) */
  children?: ContainerNodeConfig[];
  /** Static text content */
  text?: string;
  /** Field binding (for data cells) */
  field?: {
    name: string;
    display?: boolean;
    component?: ComponentType;
    label?: string;
    rules?: ValidationRule[];
    props?: Record<string, any>;
  };
  /** Marks this node as an each() block for iteration */
  isEach?: boolean;
  /** Field name to iterate over (for nested arrays) */
  eachFieldName?: string;
  /** CSS class (static or dynamic based on form context) */
  cssClass?: FormCssClass;
  /** Inline styles (static or dynamic based on form context) */
  style?: FormStyle;
  /** Visibility configuration */
  visibility?: VisibilityConfig;
  /** Click handler */
  onClick?: (ctx: FormContext) => void | Promise<void>;
}

/**
 * Built configuration for a container structure.
 * Output of Component.container().build()
 */
export interface ContainerConfig {
  /** Root container node */
  root: ContainerNodeConfig;
}
