/**
 * Lumino Framework - UI Adapter Types
 *
 * Types for UI-library independent adapters.
 * Allows switching between MUI, Ant Design, Salt, or custom UI libraries.
 *
 * UI adapters provide:
 * - Layout: Grid, Row, Column, Section
 * - Containers: Tabs, Dialog, Panel, Card
 * - Lists: Rows, Table, Cards display modes
 * - Actions: Buttons, IconButtons, Toolbar
 * - Feedback: Alerts, Toasts, Confirmations
 */

import type { ComponentType, ReactNode } from "react";
import type { FormContext } from "./context";

// =============================================================================
// COMMON PROPS
// =============================================================================

/**
 * Base props shared by all UI components
 */
export interface BaseUIProps {
  /** CSS class name */
  className?: string;
  /** Inline styles (use sparingly) */
  style?: Record<string, any>;
  /** Test ID for testing */
  testId?: string;
}

// =============================================================================
// LAYOUT ADAPTER TYPES
// =============================================================================

/**
 * Props for Grid container component
 */
export interface GridProps extends BaseUIProps {
  /** Number of columns (default: 12) */
  columns?: number;
  /** Gap between items */
  gap?: number | string;
  /** Row gap */
  rowGap?: number | string;
  /** Column gap */
  columnGap?: number | string;
  /** Children */
  children: ReactNode;
}

/**
 * Props for Row layout component
 */
export interface RowLayoutProps extends BaseUIProps {
  /** Column spans for each child [6, 6] means two equal columns */
  layout?: number[];
  /** Gap between columns in pixels */
  gap?: number;
  /** Total grid columns (default: 12) */
  columns?: number;
  /** Row index for styling */
  rowIndex?: number;
  /** Children */
  children: ReactNode;
}

/**
 * Props for Column/Cell layout component
 */
export interface ColumnLayoutProps extends BaseUIProps {
  /** Column span (1-12) */
  span: number;
  /** Total grid columns (default: 12) */
  totalColumns?: number;
  /** Column index for styling */
  columnIndex?: number;
  /** Children */
  children: ReactNode;
}

/**
 * Props for Section layout component
 */
export interface SectionLayoutProps extends BaseUIProps {
  /** Section title */
  title: string;
  /** Section ID */
  id?: string;
  /** Is section collapsible */
  collapsible?: boolean;
  /** Is section collapsed */
  collapsed?: boolean;
  /** Toggle handler */
  onToggle?: () => void;
  /** Gap between rows in pixels */
  rowGap?: number;
  /** Header actions (buttons) */
  headerActions?: ReactNode;
  /** Children */
  children: ReactNode;
}

/**
 * Props for Form layout component
 */
export interface FormLayoutProps extends BaseUIProps {
  /** Form ID */
  formId: string;
  /** Submit handler */
  onSubmit?: (e: React.FormEvent) => void;
  /** Form context for advanced usage */
  ctx?: FormContext;
  /** Children */
  children: ReactNode;
}

/**
 * Props for Field wrapper component
 */
export interface FieldWrapperProps extends BaseUIProps {
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Is field required */
  required?: boolean;
  /** Help text */
  helpText?: string;
  /** Label position */
  labelPosition?: "top" | "left" | "right" | "inline";
  /** Children */
  children: ReactNode;
}

/**
 * Props for ErrorMessage component - displays validation errors with framework styling
 */
export interface ErrorMessageProps extends BaseUIProps {
  /** Error messages to display */
  errors: string[];
}

// =============================================================================
// CONTAINER COMPONENTS
// =============================================================================

/**
 * Props for Tabs component
 */
export interface TabsProps extends BaseUIProps {
  /** Active tab index */
  activeIndex: number;
  /** Tab change handler */
  onChange: (index: number) => void;
  /** Tab items */
  items: TabItem[];
  /** Tabs position */
  position?: "top" | "bottom" | "left" | "right";
  /** Show close button on tabs */
  closable?: boolean;
  /** Close handler */
  onClose?: (index: number) => void;
  /** Show add button */
  addable?: boolean;
  /** Add handler */
  onAdd?: () => void;
  /** Add button label */
  addLabel?: string;
  /** Children (tab panels) */
  children: ReactNode;
}

/**
 * Tab item configuration
 */
export interface TabItem {
  /** Tab key/id */
  key: string | number;
  /** Tab label */
  label: ReactNode;
  /** Tab icon */
  icon?: ReactNode;
  /** Is tab disabled */
  disabled?: boolean;
  /** Is tab closable (overrides parent) */
  closable?: boolean;
}

/**
 * Props for Tab Panel component
 */
export interface TabPanelProps extends BaseUIProps {
  /** Panel index */
  index: number;
  /** Active index */
  activeIndex: number;
  /** Children */
  children: ReactNode;
}

/**
 * Props for Dialog/Modal component
 */
export interface DialogProps extends BaseUIProps {
  /** Is dialog open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Dialog title */
  title?: ReactNode;
  /** Dialog size */
  size?: "small" | "medium" | "large" | "fullscreen";
  /** Show close button */
  showCloseButton?: boolean;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Footer content (buttons) */
  footer?: ReactNode;
  /** Children */
  children: ReactNode;
}

/**
 * Props for Panel/Card component
 */
export interface PanelProps extends BaseUIProps {
  /** Panel title */
  title?: ReactNode;
  /** Panel subtitle */
  subtitle?: ReactNode;
  /** Is collapsible */
  collapsible?: boolean;
  /** Is collapsed */
  collapsed?: boolean;
  /** Toggle handler */
  onToggle?: () => void;
  /** Header actions */
  headerActions?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Elevation/shadow level */
  elevation?: number;
  /** Border style */
  variant?: "outlined" | "elevated" | "flat";
  /** Children */
  children: ReactNode;
}

/**
 * Props for Card component (simpler than Panel)
 */
export interface CardProps extends BaseUIProps {
  /** Card title */
  title?: ReactNode;
  /** Card image */
  image?: string;
  /** Card actions */
  actions?: ReactNode;
  /** Is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Children */
  children: ReactNode;
}

// =============================================================================
// LIST DISPLAY COMPONENTS
// =============================================================================

/**
 * Props for list display container (Rows mode)
 */
export interface ListRowsProps extends BaseUIProps {
  /** List items */
  items: any[];
  /** Render function for each item */
  renderItem: (item: any, index: number) => ReactNode;
  /** Empty state content */
  emptyContent?: ReactNode;
  /** Add button config */
  addButton?: {
    label: string;
    position: "top" | "bottom";
    onClick: () => void;
    disabled?: boolean;
  };
  /** Remove handler (called with index) */
  onRemove?: (index: number) => void;
  /** Can reorder */
  reorderable?: boolean;
  /** Reorder handler */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /** Gap between rows */
  gap?: number | string;
}

/**
 * Props for list display as table
 */
export interface ListTableProps extends BaseUIProps {
  /** Table data */
  items: any[];
  /** Column definitions */
  columns: TableColumn[];
  /** Empty state content */
  emptyContent?: ReactNode;
  /** Row key function */
  rowKey?: (item: any, index: number) => string | number;
  /** Row click handler */
  onRowClick?: (item: any, index: number) => void;
  /** Selected row indices */
  selectedIndices?: number[];
  /** Selection change handler */
  onSelectionChange?: (indices: number[]) => void;
  /** Actions column config */
  actionsColumn?: {
    header?: string;
    width?: number | string;
    render: (item: any, index: number) => ReactNode;
  };
  /** Sortable columns */
  sortable?: boolean;
  /** Current sort */
  sort?: { column: string; direction: "asc" | "desc" };
  /** Sort change handler */
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
}

/**
 * Table column definition
 */
export interface TableColumn {
  /** Column key (field name) */
  key: string;
  /** Column header */
  header: ReactNode;
  /** Column width */
  width?: number | string;
  /** Is sortable */
  sortable?: boolean;
  /** Custom render */
  render?: (value: any, item: any, index: number) => ReactNode;
  /** Text alignment */
  align?: "left" | "center" | "right";
}

/**
 * Props for list display as cards
 */
export interface ListCardsProps extends BaseUIProps {
  /** Card items */
  items: any[];
  /** Render function for each card */
  renderCard: (item: any, index: number) => ReactNode;
  /** Empty state content */
  emptyContent?: ReactNode;
  /** Cards per row */
  columns?: number;
  /** Gap between cards */
  gap?: number | string;
  /** Add button config */
  addButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

// =============================================================================
// ACTION COMPONENTS
// =============================================================================

/**
 * Props for Button component
 */
export interface ButtonProps extends BaseUIProps {
  /** Button label */
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Button type */
  type?: "button" | "submit" | "reset";
  /** Button variant */
  variant?: "primary" | "secondary" | "danger" | "ghost" | "link";
  /** Button size */
  size?: "small" | "medium" | "large";
  /** Is disabled */
  disabled?: boolean;
  /** Is loading */
  loading?: boolean;
  /** Icon (before label) */
  icon?: ReactNode;
  /** Icon position */
  iconPosition?: "left" | "right";
  /** Full width */
  fullWidth?: boolean;
}

/**
 * Props for IconButton component
 */
export interface IconButtonProps extends BaseUIProps {
  /** Icon */
  icon: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Aria label (required for accessibility) */
  ariaLabel: string;
  /** Button size */
  size?: "small" | "medium" | "large";
  /** Is disabled */
  disabled?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Button variant */
  variant?: "default" | "primary" | "danger" | "ghost";
}

/**
 * Props for Toolbar component
 */
export interface ToolbarProps extends BaseUIProps {
  /** Toolbar alignment */
  align?: "left" | "center" | "right" | "space-between";
  /** Gap between items */
  gap?: number | string;
  /** Children (buttons, etc.) */
  children: ReactNode;
}

/**
 * Props for ButtonGroup component
 */
export interface ButtonGroupProps extends BaseUIProps {
  /** Children (buttons) */
  children: ReactNode;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Gap between buttons */
  gap?: number | string;
}

// =============================================================================
// FEEDBACK COMPONENTS
// =============================================================================

/**
 * Props for Alert component
 */
export interface AlertProps extends BaseUIProps {
  /** Alert type/severity */
  type: "info" | "success" | "warning" | "error";
  /** Alert title */
  title?: ReactNode;
  /** Alert message */
  children: ReactNode;
  /** Is closable */
  closable?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Action button */
  action?: ReactNode;
}

/**
 * Props for Badge component
 */
export interface BadgeProps extends BaseUIProps {
  /** Badge content (number, text, or empty for dot) */
  value?: number | string;
  /** Badge variant */
  variant?: "default" | "dot" | "numeric";
  /** Badge color/status */
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  /** Maximum number to show (shows "99+" if exceeded) */
  max?: number;
  /** Show zero value */
  showZero?: boolean;
  /** Invisible badge (useful for accessibility) */
  invisible?: boolean;
  /** Badge position relative to children */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Children to wrap with badge */
  children?: ReactNode;
}

/**
 * Props for Toast/Notification component
 */
export interface ToastProps extends BaseUIProps {
  /** Toast type */
  type: "info" | "success" | "warning" | "error";
  /** Toast title */
  title?: ReactNode;
  /** Toast message */
  message: ReactNode;
  /** Duration in ms (0 = persistent) */
  duration?: number;
  /** Close handler */
  onClose?: () => void;
  /** Action button */
  action?: ReactNode;
}

/**
 * Toast manager interface
 */
export interface ToastManager {
  /** Show info toast */
  info(message: ReactNode, options?: Partial<ToastProps>): void;
  /** Show success toast */
  success(message: ReactNode, options?: Partial<ToastProps>): void;
  /** Show warning toast */
  warning(message: ReactNode, options?: Partial<ToastProps>): void;
  /** Show error toast */
  error(message: ReactNode, options?: Partial<ToastProps>): void;
  /** Close all toasts */
  closeAll(): void;
}

/**
 * Props for Confirm dialog
 */
export interface ConfirmProps {
  /** Dialog title */
  title?: ReactNode;
  /** Confirm message */
  message: ReactNode;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirm button variant */
  confirmVariant?: "primary" | "danger";
  /** On confirm */
  onConfirm: () => void;
  /** On cancel */
  onCancel: () => void;
}

/**
 * Confirm manager interface
 */
export interface ConfirmManager {
  /** Show confirm dialog */
  show(props: ConfirmProps): void;
  /** Show danger confirm (red button) */
  danger(props: Omit<ConfirmProps, "confirmVariant">): void;
}

// =============================================================================
// LOADING/PROGRESS COMPONENTS
// =============================================================================

/**
 * Props for Spinner/Loading component
 */
export interface SpinnerProps extends BaseUIProps {
  /** Spinner size */
  size?: "small" | "medium" | "large";
  /** Loading text */
  label?: string;
}

/**
 * Props for Progress bar
 */
export interface ProgressProps extends BaseUIProps {
  /** Progress value (0-100) */
  value: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Progress variant */
  variant?: "determinate" | "indeterminate";
  /** Progress color */
  color?: "primary" | "success" | "warning" | "error";
}

// =============================================================================
// LAYOUT ADAPTER INTERFACE
// =============================================================================

/**
 * Layout adapter for UI-library specific grid/layout components.
 * Implement this to use Lumino with different UI libraries.
 *
 * @example
 * ```typescript
 * // Salt Layout Adapter
 * const saltLayoutAdapter: LayoutAdapter = {
 *   Grid: ({ children, columns, gap }) => <FlexLayout gap={gap}>{children}</FlexLayout>,
 *   Row: ({ children, gap }) => <FlexLayout direction="row" gap={gap}>{children}</FlexLayout>,
 *   Column: ({ children, span }) => <FlexItem grow={span}>{children}</FlexItem>,
 *   Section: ({ children, title }) => <Panel><H3>{title}</H3>{children}</Panel>,
 *   Form: ({ children, onSubmit }) => <form onSubmit={onSubmit}>{children}</form>,
 *   FieldWrapper: ({ children, label, error }) => (
 *     <FormField label={label} validationStatus={error ? "error" : undefined}>{children}</FormField>
 *   ),
 * };
 * ```
 */
export interface LayoutAdapter {
  /** Grid container component */
  Grid?: ComponentType<GridProps>;
  /** Row component - wraps columns */
  Row: ComponentType<RowLayoutProps>;
  /** Column component - wraps field */
  Column: ComponentType<ColumnLayoutProps>;
  /** Section component - wraps rows */
  Section: ComponentType<SectionLayoutProps>;
  /** Form component - wraps sections */
  Form: ComponentType<FormLayoutProps>;
  /** Field wrapper - optional, wraps individual fields */
  FieldWrapper?: ComponentType<FieldWrapperProps>;
  /** Error message component - displays validation errors with framework styling */
  ErrorMessage?: ComponentType<ErrorMessageProps>;
}

// =============================================================================
// CONTAINER ADAPTER INTERFACE
// =============================================================================

/**
 * Container adapter for Tabs, Dialogs, Panels, etc.
 */
export interface ContainerAdapter {
  /** Tabs container */
  Tabs: ComponentType<TabsProps>;
  /** Tab panel */
  TabPanel: ComponentType<TabPanelProps>;
  /** Dialog/Modal */
  Dialog: ComponentType<DialogProps>;
  /** Panel/Card with header */
  Panel: ComponentType<PanelProps>;
  /** Simple card */
  Card?: ComponentType<CardProps>;
}

// =============================================================================
// LIST ADAPTER INTERFACE
// =============================================================================

/**
 * List display adapter for dynamic arrays.
 */
export interface ListAdapter {
  /** Rows display mode */
  Rows: ComponentType<ListRowsProps>;
  /** Table display mode */
  Table: ComponentType<ListTableProps>;
  /** Cards display mode */
  Cards?: ComponentType<ListCardsProps>;
  /** Tabs display mode (uses ContainerAdapter.Tabs internally) */
  Tabs?: ComponentType<TabsProps>;
  /**
   * Raw table components for each() pattern rendering.
   * Provides direct access to Table, THead, TBody, TR, TH, TD components.
   */
  TableComponents?: {
    Table: ComponentType<any>;
    THead: ComponentType<any>;
    TBody: ComponentType<any>;
    TR: ComponentType<any>;
    TH: ComponentType<any>;
    TD: ComponentType<any>;
  };
}

// =============================================================================
// ACTION ADAPTER INTERFACE
// =============================================================================

/**
 * Action adapter for buttons, toolbars, etc.
 */
export interface ActionAdapter {
  /** Button component */
  Button: ComponentType<ButtonProps>;
  /** Icon button component */
  IconButton?: ComponentType<IconButtonProps>;
  /** Toolbar component */
  Toolbar?: ComponentType<ToolbarProps>;
  /** Button group component */
  ButtonGroup?: ComponentType<ButtonGroupProps>;
}

// =============================================================================
// INPUT ADAPTER INTERFACE
// =============================================================================

/**
 * Generic option type for select/autocomplete components.
 * Lumino uses this internally - adapters transform to UI-specific format.
 */
export interface SelectOption<T = any> {
  /** The value stored when selected */
  value: any;
  /** The label displayed to user */
  label: string;
  /** Original data object (if options are objects) */
  data?: T;
  /** Is option disabled */
  disabled?: boolean;
  /** Group this option belongs to */
  group?: string;
}

/**
 * Configuration for how to extract value/label from option objects.
 * Used when options are objects rather than primitives.
 */
export interface OptionConfig<T = any> {
  /** Property name or function to get the value */
  valueProperty?: keyof T | ((option: T) => any);
  /** Property name or function to get the display label */
  displayProperty?: keyof T | ((option: T) => string);
  /** Property name for disabled state */
  disabledProperty?: keyof T;
  /** Property name for grouping */
  groupProperty?: keyof T;
}

/**
 * Base props for all input components.
 * Lumino normalizes all UI library inputs to this interface.
 *
 * ## Event Standardization
 *
 * Lumino uses VALUE-BASED callbacks, not event-based:
 * - `onChange(value)` - receives the new value directly
 * - `onBlur()` / `onFocus()` - no arguments needed
 *
 * UI adapters transform their native events to this format.
 * For example, Salt's `onSelectionChange(event, selected)` becomes `onChange(selected)`.
 *
 * ## Pass-through Props
 *
 * Use `componentProps` to pass UI-library specific props directly to the
 * underlying component. This allows access to framework-specific features
 * while maintaining the abstraction layer.
 *
 * @example
 * ```tsx
 * // Pass Salt-specific props
 * <TextInput
 *   name="email"
 *   value={email}
 *   onChange={setEmail}
 *   componentProps={{
 *     variant: "secondary",
 *     bordered: true,
 *     startAdornment: <Icon name="email" />
 *   }}
 * />
 * ```
 */
export interface BaseInputProps<TValue = any> extends BaseUIProps {
  /** Field name (used for form binding) */
  name: string;
  /** Current value */
  value: TValue;

  // ===========================================================================
  // VALUE EVENTS
  // ===========================================================================

  /** Change handler - receives the NEW VALUE directly (not event) */
  onChange: (value: TValue) => void;

  // ===========================================================================
  // FOCUS EVENTS
  // ===========================================================================

  /** Blur handler - called when field loses focus */
  onBlur?: () => void;
  /** Focus handler - called when field gains focus */
  onFocus?: () => void;

  // ===========================================================================
  // KEYBOARD EVENTS
  // ===========================================================================

  /** Key down handler */
  onKeyDown?: (event: React.KeyboardEvent) => void;
  /** Key up handler */
  onKeyUp?: (event: React.KeyboardEvent) => void;
  /** Enter key pressed (convenience handler) */
  onEnter?: () => void;

  // ===========================================================================
  // DISPLAY PROPS
  // ===========================================================================

  /** Placeholder text */
  placeholder?: string;
  /** Is disabled */
  disabled?: boolean;
  /** Is read-only */
  readOnly?: boolean;
  /** Has error (for styling) */
  error?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Aria label for accessibility */
  ariaLabel?: string;

  // ===========================================================================
  // PASS-THROUGH PROPS & EVENTS
  // ===========================================================================

  /**
   * UI-library specific props passed directly to the underlying component.
   * Use this to access framework-specific features not covered by Lumino's
   * normalized props.
   *
   * @example Salt-specific props
   * ```tsx
   * componentProps={{ variant: "secondary", bordered: true }}
   * ```
   *
   * @example MUI-specific props
   * ```tsx
   * componentProps={{ size: "small", color: "primary" }}
   * ```
   */
  componentProps?: Record<string, any>;

  /**
   * UI-library specific event handlers passed directly to the underlying component.
   * Use this to access framework-specific events not covered by Lumino's
   * normalized events.
   *
   * These are merged with (but don't override) Lumino's normalized events.
   * For example, if you provide `onSelectionChange` for Salt, it will be called
   * IN ADDITION TO Lumino's `onChange`.
   *
   * @example Salt-specific events
   * ```tsx
   * componentEvents={{
   *   onSelectionChange: (event, selected) => console.log('Salt selection:', selected),
   *   onOpenChange: (open) => console.log('Dropdown open:', open),
   * }}
   * ```
   *
   * @example MUI-specific events
   * ```tsx
   * componentEvents={{
   *   onHighlightChange: (event, option, reason) => console.log('Highlight:', option),
   *   onInputChange: (event, value, reason) => console.log('Input:', value, reason),
   * }}
   * ```
   */
  componentEvents?: Record<string, (...args: any[]) => void>;

  /**
   * Ref forwarded to the underlying input element.
   */
  inputRef?: React.Ref<any>;
}

/**
 * Common callback signature patterns across UI frameworks.
 * Use these types when implementing adapters.
 */
export type EventCallback<T = any> = (...args: any[]) => T;

/**
 * Selection callback - normalized across frameworks.
 * Lumino uses: (value) => void
 * Salt uses: (event, selected) => void
 * MUI uses: (event, value, reason) => void
 */
export type SelectionCallback<T = any> = (value: T) => void;

/**
 * Input change callback - normalized across frameworks.
 * Lumino uses: (value) => void
 * Salt uses: (event) => void (from event.target.value)
 * MUI uses: (event, value, reason) => void
 */
export type InputChangeCallback = (value: string) => void;

/**
 * Open/Close state callback - normalized across frameworks.
 * Lumino uses: onOpen(), onClose()
 * Salt uses: onOpenChange(open)
 * MUI uses: onOpen(event), onClose(event, reason)
 */
export type OpenStateCallback = () => void;

// =============================================================================
// EVENT MAPPING CONFIGURATION
// =============================================================================

/**
 * Declarative event mapping configuration.
 * Maps Lumino's standardized events to UI-framework specific events.
 *
 * @example Salt event mapping
 * ```typescript
 * const saltEventMapping: EventMapping = {
 *   // onChange(value) -> onSelectionChange(event, selected)
 *   onChange: {
 *     targetEvent: "onSelectionChange",
 *     extractValue: (event, selected) => selected?.value ?? selected,
 *   },
 *   // onOpen() + onClose() -> onOpenChange(open)
 *   onOpen: {
 *     targetEvent: "onOpenChange",
 *     condition: (open) => open === true,
 *   },
 *   onClose: {
 *     targetEvent: "onOpenChange",
 *     condition: (open) => open === false,
 *   },
 * };
 * ```
 */
export interface EventMapping {
  [luminoEvent: string]: EventMappingConfig;
}

/**
 * Configuration for mapping a single Lumino event to a framework event.
 */
export interface EventMappingConfig {
  /**
   * The framework-specific event name to map to.
   * e.g., "onSelectionChange" for Salt, "onChange" for MUI
   */
  targetEvent: string;

  /**
   * Extract the value from the framework's event arguments.
   * Lumino always uses value-based callbacks, so this function
   * extracts the value from framework-specific event signatures.
   *
   * @example Salt onSelectionChange(event, selected) -> selected.value
   * ```typescript
   * extractValue: (event, selected) => selected?.value ?? selected
   * ```
   *
   * @example MUI onChange(event, value, reason) -> value
   * ```typescript
   * extractValue: (event, value, reason) => value
   * ```
   *
   * @example Salt onChange(event) -> event.target.value
   * ```typescript
   * extractValue: (event) => event.target.value
   * ```
   */
  extractValue?: (...args: any[]) => any;

  /**
   * Condition to check before triggering this event.
   * Used when multiple Lumino events map to the same framework event.
   *
   * @example Salt onOpenChange(open) -> onOpen when open=true
   * ```typescript
   * condition: (open) => open === true
   * ```
   */
  condition?: (...args: any[]) => boolean;

  /**
   * Additional Lumino events to call when this framework event fires.
   * Maps framework event to multiple Lumino callbacks.
   *
   * @example onSelectionChange -> [onChange, onSelect]
   * ```typescript
   * alsoCall: ["onSelect"]
   * ```
   */
  alsoCall?: string[];
}

/**
 * Declarative prop mapping configuration.
 * Maps Lumino's standardized props to UI-framework specific props.
 *
 * @example Salt prop mapping
 * ```typescript
 * const saltPropMapping: PropMapping = {
 *   value: { targetProp: "selected" },
 *   options: { targetProp: "source" },
 *   error: {
 *     targetProp: "validationStatus",
 *     transform: (error) => error ? "error" : undefined,
 *   },
 * };
 * ```
 */
export interface PropMapping {
  [luminoProp: string]: PropMappingConfig;
}

/**
 * Configuration for mapping a single Lumino prop to a framework prop.
 */
export interface PropMappingConfig {
  /**
   * The framework-specific prop name.
   * e.g., "selected" for Salt Dropdown, "checked" for Checkbox
   */
  targetProp: string;

  /**
   * Transform the value before passing to the framework component.
   *
   * @example error -> validationStatus
   * ```typescript
   * transform: (error) => error ? "error" : undefined
   * ```
   */
  transform?: (value: any, allProps?: any) => any;

  /**
   * If true, the original Lumino prop is also passed through.
   * By default, the original prop is removed when mapped.
   */
  keepOriginal?: boolean;
}

/**
 * Complete adapter mapping configuration.
 * Defines how to transform Lumino props/events to framework-specific ones.
 */
export interface AdapterMappingConfig {
  /** Event mappings for this component type */
  events?: EventMapping;
  /** Prop mappings for this component type */
  props?: PropMapping;
  /** Pass-through props that don't need transformation */
  passthrough?: string[];
  /** Props to exclude from the output */
  exclude?: string[];
}

/**
 * Full adapter configuration for a UI framework.
 */
export interface FrameworkAdapterConfig {
  /** Framework name (e.g., "salt", "mui", "antd") */
  name: string;

  /** Mappings per component type */
  mappings: {
    TextInput?: AdapterMappingConfig;
    NumberInput?: AdapterMappingConfig;
    TextArea?: AdapterMappingConfig;
    Checkbox?: AdapterMappingConfig;
    CheckboxGroup?: AdapterMappingConfig;
    Switch?: AdapterMappingConfig;
    RadioGroup?: AdapterMappingConfig;
    Select?: AdapterMappingConfig;
    MultiSelect?: AdapterMappingConfig;
    Autocomplete?: AdapterMappingConfig;
    DatePicker?: AdapterMappingConfig;
    TimePicker?: AdapterMappingConfig;
    [componentType: string]: AdapterMappingConfig | undefined;
  };
}

/**
 * Example Salt DS adapter configuration (declarative approach)
 *
 * @example
 * ```typescript
 * const saltAdapterConfig: FrameworkAdapterConfig = {
 *   name: "salt",
 *   mappings: {
 *     Select: {
 *       props: {
 *         value: { targetProp: "selected" },
 *         options: { targetProp: "source" },
 *         error: { targetProp: "validationStatus", transform: (e) => e ? "error" : undefined },
 *       },
 *       events: {
 *         onChange: {
 *           targetEvent: "onSelectionChange",
 *           extractValue: (event, selected) => selected?.value ?? selected,
 *           alsoCall: ["onSelect"],
 *         },
 *         onOpen: { targetEvent: "onOpenChange", condition: (open) => open === true },
 *         onClose: { targetEvent: "onOpenChange", condition: (open) => open === false },
 *       },
 *     },
 *     TextInput: {
 *       props: {
 *         error: { targetProp: "validationStatus", transform: (e) => e ? "error" : undefined },
 *       },
 *       events: {
 *         onChange: {
 *           targetEvent: "onChange",
 *           extractValue: (event) => event.target.value,
 *         },
 *       },
 *     },
 *     Checkbox: {
 *       props: {
 *         value: { targetProp: "checked" },
 *         error: { targetProp: "validationStatus", transform: (e) => e ? "error" : undefined },
 *       },
 *       events: {
 *         onChange: {
 *           targetEvent: "onChange",
 *           extractValue: (event) => event.target.checked,
 *         },
 *       },
 *     },
 *   },
 * };
 * ```
 */
export type SaltAdapterConfigExample = FrameworkAdapterConfig;

/**
 * Apply prop mapping configuration to transform Lumino props to framework props.
 *
 * @example
 * ```typescript
 * const frameworkProps = applyPropMapping(luminoProps, saltConfig.mappings.Select);
 * // { selected: value, source: options, validationStatus: "error", ... }
 * ```
 */
export function applyPropMapping(
  luminoProps: Record<string, any>,
  config: AdapterMappingConfig
): Record<string, any> {
  const result: Record<string, any> = {};
  const { props: propMapping = {}, exclude = [], passthrough = [] } = config;

  // Get all keys that have mappings
  const mappedKeys = new Set(Object.keys(propMapping));

  for (const [key, value] of Object.entries(luminoProps)) {
    // Skip excluded props
    if (exclude.includes(key)) continue;

    // Skip event handlers (they're handled separately)
    if (key.startsWith("on") && typeof value === "function") continue;

    // Skip internal props
    if (key === "componentProps" || key === "componentEvents") continue;

    // Check if this prop has a mapping
    if (mappedKeys.has(key)) {
      const mapping = propMapping[key];
      const transformedValue = mapping.transform ? mapping.transform(value, luminoProps) : value;
      result[mapping.targetProp] = transformedValue;

      // Optionally keep original
      if (mapping.keepOriginal) {
        result[key] = value;
      }
    } else {
      // Pass through unmapped props
      result[key] = value;
    }
  }

  // Merge componentProps (pass-through props from user)
  if (luminoProps.componentProps) {
    Object.assign(result, luminoProps.componentProps);
  }

  return result;
}

/**
 * Apply event mapping configuration to create framework event handlers.
 *
 * @example
 * ```typescript
 * const frameworkEvents = applyEventMapping(luminoProps, saltConfig.mappings.Select);
 * // { onSelectionChange: (e, sel) => { onChange(sel); onSelect(sel); }, ... }
 * ```
 */
export function applyEventMapping(
  luminoProps: Record<string, any>,
  config: AdapterMappingConfig
): Record<string, (...args: any[]) => void> {
  const result: Record<string, (...args: any[]) => void> = {};
  const { events: eventMapping = {} } = config;

  // Group events by target event (for combining onOpen/onClose -> onOpenChange)
  const targetEventHandlers: Record<string, Array<{
    luminoEvent: string;
    config: EventMappingConfig;
  }>> = {};

  for (const [luminoEvent, mapping] of Object.entries(eventMapping)) {
    if (!targetEventHandlers[mapping.targetEvent]) {
      targetEventHandlers[mapping.targetEvent] = [];
    }
    targetEventHandlers[mapping.targetEvent].push({ luminoEvent, config: mapping });
  }

  // Create combined handlers for each target event
  for (const [targetEvent, handlers] of Object.entries(targetEventHandlers)) {
    result[targetEvent] = (...args: any[]) => {
      for (const { luminoEvent, config: mapping } of handlers) {
        // Check condition if specified
        if (mapping.condition && !mapping.condition(...args)) {
          continue;
        }

        // Extract value from framework args
        const value = mapping.extractValue ? mapping.extractValue(...args) : args[0];

        // Call the main Lumino event
        const handler = luminoProps[luminoEvent];
        if (typeof handler === "function") {
          handler(value);
        }

        // Call additional events
        if (mapping.alsoCall) {
          for (const additionalEvent of mapping.alsoCall) {
            const additionalHandler = luminoProps[additionalEvent];
            if (typeof additionalHandler === "function") {
              additionalHandler(value);
            }
          }
        }
      }

      // Call pass-through componentEvents
      const componentEvents = luminoProps.componentEvents;
      if (componentEvents && typeof componentEvents[targetEvent] === "function") {
        componentEvents[targetEvent](...args);
      }
    };
  }

  return result;
}

/**
 * Create a complete set of framework props from Lumino props using mapping config.
 *
 * @example
 * ```typescript
 * const saltProps = createFrameworkProps(luminoProps, saltConfig.mappings.Select);
 * // Returns both transformed props and event handlers ready for the Salt component
 * ```
 */
export function createFrameworkProps(
  luminoProps: Record<string, any>,
  config: AdapterMappingConfig
): Record<string, any> {
  const props = applyPropMapping(luminoProps, config);
  const events = applyEventMapping(luminoProps, config);
  return { ...props, ...events };
}

/**
 * Props for text input component.
 */
export interface TextInputProps extends BaseInputProps<string> {
  /** Input type */
  type?: "text" | "email" | "password" | "tel" | "url";
  /** Max length */
  maxLength?: number;
  /** Min length */
  minLength?: number;
  /** Pattern for validation */
  pattern?: string;
}

/**
 * Props for number input component.
 */
export interface NumberInputProps extends BaseInputProps<number | null> {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Number of decimal places */
  precision?: number;
  /** Show increment/decrement buttons */
  showButtons?: boolean;
}

/**
 * Props for textarea component.
 */
export interface TextAreaProps extends BaseInputProps<string> {
  /** Number of rows */
  rows?: number;
  /** Max length */
  maxLength?: number;
  /** Auto resize */
  autoResize?: boolean;
}

/**
 * Props for checkbox component.
 */
export interface CheckboxProps extends BaseInputProps<boolean> {
  /** Checkbox label (inline) */
  label?: string;
  /** Indeterminate state */
  indeterminate?: boolean;
}

/**
 * Props for switch/toggle component.
 */
export interface SwitchProps extends BaseInputProps<boolean> {
  /** Switch label (inline) */
  label?: string;
}

/**
 * Props for radio group component.
 */
export interface RadioGroupProps<T = any> extends BaseInputProps<T> {
  /** Available options */
  options: SelectOption<T>[] | T[];
  /** Option configuration (when options are objects) */
  optionConfig?: OptionConfig<T>;
  /** Layout direction */
  direction?: "horizontal" | "vertical";
}

/**
 * Props for checkbox group component.
 * Allows multiple checkbox selections from a list of options.
 *
 * ## Events
 * - `onChange(values)` - called when selection changes (array of values)
 * - `onCheck(option)` - called when an option is checked
 * - `onUncheck(option)` - called when an option is unchecked
 */
export interface CheckboxGroupProps<T = any> extends BaseInputProps<T[]> {
  /** Available options */
  options: SelectOption<T>[] | T[];
  /** Option configuration (when options are objects) */
  optionConfig?: OptionConfig<T>;
  /** Layout direction */
  direction?: "horizontal" | "vertical";
  /** Return full objects instead of just values */
  returnFullObject?: boolean;
  /** Maximum selections allowed (undefined = unlimited) */
  maxSelections?: number;
  /** Minimum selections required */
  minSelections?: number;

  // ===========================================================================
  // SELECTION EVENTS
  // ===========================================================================

  /** Called when an option is checked */
  onCheck?: (option: SelectOption<T>) => void;
  /** Called when an option is unchecked */
  onUncheck?: (option: SelectOption<T>) => void;
}

/**
 * Props for select/dropdown component.
 *
 * ## Value Handling
 * - If `returnFullObject` is false (default): onChange receives just the value
 * - If `returnFullObject` is true: onChange receives the full option object
 *
 * ## Events
 * - `onChange(value)` - called when selection changes
 * - `onSelect(option)` - called when an option is selected (full option)
 * - `onClear()` - called when selection is cleared
 * - `onOpen()` / `onClose()` - called when dropdown opens/closes
 */
export interface SelectProps<T = any> extends BaseInputProps<T> {
  /** Available options */
  options: SelectOption<T>[] | T[];
  /** Option configuration (when options are objects) */
  optionConfig?: OptionConfig<T>;
  /** Allow clearing selection */
  clearable?: boolean;
  /** Enable search/filter */
  searchable?: boolean;
  /** Return full object instead of just value */
  returnFullObject?: boolean;
  /** Custom render for option */
  renderOption?: (option: SelectOption<T>) => ReactNode;
  /** Custom render for selected value */
  renderValue?: (option: SelectOption<T>) => ReactNode;
  /** Loading state (for async options) */
  loading?: boolean;
  /** Empty message when no options */
  emptyMessage?: string;

  // ===========================================================================
  // SELECTION EVENTS
  // ===========================================================================

  /** Called when an option is selected (receives full option object) */
  onSelect?: (option: SelectOption<T>) => void;
  /** Called when selection is cleared */
  onClear?: () => void;
  /** Called when dropdown opens */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;
}

/**
 * Props for multi-select component.
 *
 * ## Events
 * - `onChange(values)` - called when selection changes (array of values)
 * - `onSelect(option)` - called when an option is added
 * - `onDeselect(option)` - called when an option is removed
 * - `onClear()` - called when all selections are cleared
 */
export interface MultiSelectProps<T = any> extends BaseInputProps<T[]> {
  /** Available options */
  options: SelectOption<T>[] | T[];
  /** Option configuration (when options are objects) */
  optionConfig?: OptionConfig<T>;
  /** Allow clearing all selections */
  clearable?: boolean;
  /** Enable search/filter */
  searchable?: boolean;
  /** Return full objects instead of just values */
  returnFullObject?: boolean;
  /** Maximum selections allowed */
  maxSelections?: number;
  /** Render as chips/tags */
  showChips?: boolean;
  /** Loading state */
  loading?: boolean;

  // ===========================================================================
  // SELECTION EVENTS
  // ===========================================================================

  /** Called when an option is added to selection */
  onSelect?: (option: SelectOption<T>) => void;
  /** Called when an option is removed from selection */
  onDeselect?: (option: SelectOption<T>) => void;
  /** Called when all selections are cleared */
  onClear?: () => void;
  /** Called when dropdown opens */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;
}

/**
 * Props for autocomplete/combobox component.
 * Supports both static options and async search.
 *
 * ## Events
 * - `onChange(value)` - called when a value is selected
 * - `onInputChange(inputValue)` - called when the text input changes
 * - `onSearch(query)` - async search function (returns Promise<T[]>)
 * - `onSelect(option)` - called when an option is selected
 * - `onClear()` - called when input is cleared
 */
export interface AutocompleteProps<T = any> extends BaseInputProps<T> {
  /** Static options (mutually exclusive with onSearch) */
  options?: SelectOption<T>[] | T[];
  /** Option configuration */
  optionConfig?: OptionConfig<T>;
  /** Async search function */
  onSearch?: (query: string) => Promise<T[]>;
  /** Debounce delay for search (ms) */
  debounceMs?: number;
  /** Minimum characters before search */
  minSearchLength?: number;
  /** Allow free text (not just from options) */
  freeSolo?: boolean;
  /** Return full object instead of just value */
  returnFullObject?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Custom render for option */
  renderOption?: (option: SelectOption<T>) => ReactNode;
  /** Empty message */
  emptyMessage?: string;
  /** No results message */
  noResultsMessage?: string;

  // ===========================================================================
  // INPUT EVENTS
  // ===========================================================================

  /** Called when text input changes (separate from selection) */
  onInputChange?: (inputValue: string) => void;
  /** Called when an option is selected */
  onSelect?: (option: SelectOption<T>) => void;
  /** Called when input is cleared */
  onClear?: () => void;
  /** Called when dropdown opens */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;
}

/**
 * Props for date picker component.
 */
export interface DatePickerProps extends BaseInputProps<Date | string | null> {
  /** Date format for display */
  format?: string;
  /** Minimum date */
  minDate?: Date;
  /** Maximum date */
  maxDate?: Date;
  /** Disable specific dates */
  disabledDates?: Date[] | ((date: Date) => boolean);
  /** Show today button */
  showToday?: boolean;
  /** Return Date object vs string */
  returnType?: "date" | "string";
}

/**
 * Props for date range picker component.
 */
export interface DateRangePickerProps extends BaseInputProps<{ start: Date | null; end: Date | null }> {
  /** Date format */
  format?: string;
  /** Min date */
  minDate?: Date;
  /** Max date */
  maxDate?: Date;
}

/**
 * Props for time picker component.
 */
export interface TimePickerProps extends BaseInputProps<string | null> {
  /** Time format (12h or 24h) */
  format?: "12h" | "24h";
  /** Minute step */
  minuteStep?: number;
  /** Show seconds */
  showSeconds?: boolean;
}

/**
 * Props for slider component.
 */
export interface SliderProps extends BaseInputProps<number> {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Number of decimal places */
  decimalPlaces?: number;
  /** Show tooltip on drag */
  showTooltip?: boolean;
  /** Show min/max labels */
  showLabels?: boolean;
  /** Min label text */
  minLabel?: string;
  /** Max label text */
  maxLabel?: string;
  /** Marks to display on track */
  marks?: { value: number; label: string }[];
  /** Restrict values to marks only */
  restrictToMarks?: boolean;
  /** Show ticks above marks */
  showTicks?: boolean;
  /** Format function for value display */
  format?: (value: number) => string | number;
  /** Called when slider stops being dragged */
  onChangeEnd?: (value: number) => void;
}

/**
 * Props for file drop zone component.
 */
export interface FileDropZoneProps extends BaseUIProps {
  /** Field name */
  name: string;
  /** Accept file types (e.g., "image/*", ".pdf") */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Allow multiple files */
  multiple?: boolean;
  /** Is disabled */
  disabled?: boolean;
  /** Has error */
  error?: boolean;
  /** Custom content to display */
  children?: ReactNode;
  /** Called when files are dropped */
  onDrop?: (files: File[]) => void;
  /** Called when drop is rejected (invalid files) */
  onDropRejected?: (files: File[], reason: string) => void;
}

/**
 * Props for badge component.
 */
export interface BadgeProps extends BaseUIProps {
  /** Badge content (number, text, or empty for dot) */
  value?: number | string;
  /** Badge variant */
  variant?: "default" | "dot" | "numeric";
  /** Badge color/status */
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  /** Maximum number to show (shows "99+" if exceeded) */
  max?: number;
  /** Show zero value */
  showZero?: boolean;
  /** Invisible badge (useful for accessibility) */
  invisible?: boolean;
  /** Badge position relative to children */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Children to wrap with badge */
  children?: ReactNode;
}

/**
 * Props for avatar component.
 */
export interface AvatarProps extends BaseUIProps {
  /** Avatar name (used for initials) */
  name?: string;
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Avatar size */
  size?: "small" | "medium" | "large" | number;
  /** Fallback initials (if no name/src) */
  fallback?: string;
  /** Avatar variant */
  variant?: "circular" | "rounded" | "square";
}

/**
 * Props for spinner/loading component.
 */
export interface SpinnerProps extends BaseUIProps {
  /** Spinner size */
  size?: "small" | "medium" | "large";
  /** Loading text */
  label?: string;
  /** Accessible announcement role */
  role?: "status" | "alert";
  /** Disable announcement */
  disableAnnounce?: boolean;
}

/**
 * Props for progress component.
 */
export interface ProgressProps extends BaseUIProps {
  /** Progress value (0-100) */
  value?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Progress variant */
  variant?: "linear" | "circular";
  /** Size */
  size?: "small" | "medium" | "large";
  /** Progress color */
  color?: "primary" | "success" | "warning" | "error";
  /** Buffer value (for buffering progress) */
  bufferValue?: number;
  /** Hide track */
  hideTrack?: boolean;
}

/**
 * Props for tooltip component.
 */
export interface TooltipProps extends BaseUIProps {
  /** Tooltip content */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  /** Placement */
  placement?: "top" | "bottom" | "left" | "right";
  /** Delay before showing (ms) */
  enterDelay?: number;
  /** Delay before hiding (ms) */
  leaveDelay?: number;
  /** Whether tooltip is disabled */
  disabled?: boolean;
  /** Whether tooltip is open (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Props for accordion component.
 */
export interface AccordionProps extends BaseUIProps {
  /** Accordion items */
  items: AccordionItem[];
  /** Allow multiple panels open */
  multiple?: boolean;
  /** Controlled expanded keys */
  expandedKeys?: string[];
  /** Default expanded keys */
  defaultExpandedKeys?: string[];
  /** Callback when expansion changes */
  onExpandedChange?: (expandedKeys: string[]) => void;
}

/**
 * Accordion item configuration.
 */
export interface AccordionItem {
  /** Unique key */
  key: string;
  /** Header content */
  header: ReactNode;
  /** Panel content */
  content: ReactNode;
  /** Is disabled */
  disabled?: boolean;
}

/**
 * Props for menu component.
 */
export interface MenuProps extends BaseUIProps {
  /** Menu items */
  items: MenuItem[];
  /** Trigger element */
  trigger: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Placement */
  placement?: "top" | "bottom" | "left" | "right";
}

/**
 * Menu item configuration.
 */
export interface MenuItem {
  /** Unique key */
  key: string;
  /** Item label */
  label: ReactNode;
  /** Item icon */
  icon?: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Is disabled */
  disabled?: boolean;
  /** Is divider */
  divider?: boolean;
  /** Sub-menu items */
  children?: MenuItem[];
}

/**
 * Props for pagination component.
 */
export interface PaginationProps extends BaseUIProps {
  /** Total number of items */
  total: number;
  /** Items per page */
  pageSize?: number;
  /** Current page (1-indexed) */
  currentPage?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Show page size selector */
  showSizeChanger?: boolean;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Show compact version */
  compact?: boolean;
}

/**
 * Props for stepper component.
 */
export interface StepperProps extends BaseUIProps {
  /** Steps configuration */
  steps: StepItem[];
  /** Current active step (0-indexed) */
  activeStep?: number;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
}

/**
 * Step item configuration.
 */
export interface StepItem {
  /** Step label */
  label: ReactNode;
  /** Step description */
  description?: ReactNode;
  /** Step icon */
  icon?: ReactNode;
  /** Step status */
  status?: "waiting" | "current" | "completed" | "error";
  /** Is step disabled */
  disabled?: boolean;
}

/**
 * Props for banner/alert component.
 */
export interface BannerProps extends BaseUIProps {
  /** Banner status/type */
  status?: "info" | "success" | "warning" | "error";
  /** Banner content */
  children: ReactNode;
  /** Is closable */
  closable?: boolean;
  /** Close handler */
  onClose?: () => void;
}

/**
 * Input adapter for form field components.
 * Each UI library implements this to provide consistent form inputs.
 *
 * The adapter handles:
 * 1. Value normalization (object vs primitive)
 * 2. onChange callback normalization (event vs value)
 * 3. Option transformation (array of objects to UI-specific format)
 *
 * ## Event Normalization Reference
 *
 * | Lumino Event     | Salt DS              | MUI                      | Ant Design           |
 * |------------------|----------------------|--------------------------|----------------------|
 * | onChange(value)  | onSelectionChange    | onChange(e, value)       | onChange(value)      |
 * | onBlur()         | onBlur               | onBlur(e)                | onBlur()             |
 * | onFocus()        | onFocus              | onFocus(e)               | onFocus()            |
 * | onSelect(option) | -                    | -                        | onSelect(val, opt)   |
 * | onClear()        | -                    | -                        | onClear()            |
 * | onOpen()         | onOpenChange(true)   | onOpen(e)                | onDropdownVisible..  |
 * | onClose()        | onOpenChange(false)  | onClose(e, reason)       | onDropdownVisible..  |
 * | onInputChange()  | onChange(e)          | onInputChange(e,v,r)     | onSearch(value)      |
 *
 * ## Value Normalization Reference
 *
 * | Lumino           | Salt DS              | MUI                      | Ant Design           |
 * |------------------|----------------------|--------------------------|----------------------|
 * | value            | selected             | value                    | value                |
 * | options          | source               | options                  | options              |
 * | disabled         | disabled             | disabled                 | disabled             |
 * | error            | validationStatus     | error                    | status="error"       |
 *
 * @example
 * ```typescript
 * // Salt Input Adapter
 * const saltInputAdapter: InputAdapter = {
 *   TextInput: SaltInput,
 *   Select: SaltDropdown,
 *   Autocomplete: SaltComboBox,
 *   // Normalizers handle Salt's onSelectionChange -> Lumino's onChange
 *   normalizers: {
 *     Select: {
 *       toComponent: (props) => ({ ...props, onSelectionChange: props.onChange }),
 *       fromComponent: (value, selected) => selected,
 *     },
 *   },
 * };
 * ```
 */
export interface InputAdapter {
  // =========================================================================
  // TEXT INPUTS
  // =========================================================================

  /** Text input component */
  TextInput?: ComponentType<TextInputProps>;
  /** Number input component */
  NumberInput?: ComponentType<NumberInputProps>;
  /** Textarea component */
  TextArea?: ComponentType<TextAreaProps>;

  // =========================================================================
  // BOOLEAN INPUTS
  // =========================================================================

  /** Single checkbox component */
  Checkbox?: ComponentType<CheckboxProps>;
  /** Checkbox group component (multiple selections) */
  CheckboxGroup?: ComponentType<CheckboxGroupProps>;
  /** Switch/toggle component */
  Switch?: ComponentType<SwitchProps>;
  /** Radio group component (single selection) */
  RadioGroup?: ComponentType<RadioGroupProps>;

  // =========================================================================
  // SELECTION INPUTS
  // =========================================================================

  /** Select/dropdown component */
  Select?: ComponentType<SelectProps>;
  /** Multi-select component */
  MultiSelect?: ComponentType<MultiSelectProps>;
  /** Autocomplete/combobox component */
  Autocomplete?: ComponentType<AutocompleteProps>;

  // =========================================================================
  // DATE/TIME INPUTS
  // =========================================================================

  /** Date picker component */
  DatePicker?: ComponentType<DatePickerProps>;
  /** Date range picker component */
  DateRangePicker?: ComponentType<DateRangePickerProps>;
  /** Time picker component */
  TimePicker?: ComponentType<TimePickerProps>;

  // =========================================================================
  // NORMALIZERS
  // =========================================================================

  /**
   * Normalizers transform between Lumino's standard props and UI-specific props.
   * This is where the magic happens - each UI library has different patterns.
   */
  normalizers?: InputNormalizers;
}

/**
 * Normalizer functions for each input type.
 * Transforms Lumino props <-> UI library props.
 */
export interface InputNormalizers {
  [componentType: string]: InputNormalizer;
}

/**
 * Normalizer for a specific input component.
 * Handles bidirectional transformation between Lumino's standardized interface
 * and UI-library specific interfaces.
 */
export interface InputNormalizer<TLuminoProps = any, TComponentProps = any> {
  /**
   * Transform Lumino props to UI component props.
   * Called before rendering the component.
   *
   * @example
   * // Salt Dropdown uses onSelectionChange instead of onChange
   * toComponent: (props) => ({
   *   ...props,
   *   source: props.options, // Salt uses 'source' not 'options'
   *   onSelectionChange: (e, selected) => props.onChange(selected),
   * })
   */
  toComponent?: (luminoProps: TLuminoProps) => TComponentProps;

  /**
   * Transform options from Lumino format to UI component format.
   *
   * @example
   * // MUI Autocomplete needs getOptionLabel
   * transformOptions: (options, config) => ({
   *   options,
   *   getOptionLabel: (opt) => opt[config.displayProperty] || opt.label,
   *   isOptionEqualToValue: (opt, val) => opt[config.valueProperty] === val,
   * })
   */
  transformOptions?: <T>(
    options: SelectOption<T>[],
    config?: OptionConfig<T>
  ) => any;

  /**
   * Transform value from UI component format to Lumino format.
   * Called when component fires onChange.
   *
   * @example
   * // Ant Design with labelInValue returns { key, label }
   * fromValue: (antValue) => antValue.key
   */
  fromValue?: (componentValue: any, ...args: any[]) => any;

  /**
   * Normalize event handlers from Lumino format to UI component format.
   * Maps Lumino's standardized events to UI-library specific events.
   *
   * @example Salt event normalization
   * ```typescript
   * normalizeEvents: (luminoProps) => ({
   *   // Salt uses onSelectionChange(event, selected) instead of onChange(value)
   *   onSelectionChange: (event, selected) => {
   *     luminoProps.onChange(selected);
   *     luminoProps.onSelect?.(selected);
   *   },
   *   // Salt uses onOpenChange(open) instead of onOpen/onClose
   *   onOpenChange: (open) => {
   *     if (open) luminoProps.onOpen?.();
   *     else luminoProps.onClose?.();
   *   },
   * })
   * ```
   *
   * @example MUI event normalization
   * ```typescript
   * normalizeEvents: (luminoProps) => ({
   *   onChange: (event, value, reason) => {
   *     luminoProps.onChange(value);
   *     if (reason === 'selectOption') luminoProps.onSelect?.(value);
   *     if (reason === 'clear') luminoProps.onClear?.();
   *   },
   *   onOpen: (event) => luminoProps.onOpen?.(),
   *   onClose: (event, reason) => luminoProps.onClose?.(),
   * })
   * ```
   */
  normalizeEvents?: (luminoProps: TLuminoProps) => Record<string, (...args: any[]) => void>;

  /**
   * Merge componentEvents with normalized events.
   * By default, componentEvents are called AFTER normalized events.
   * Override this to customize merge behavior.
   */
  mergeEvents?: (
    normalizedEvents: Record<string, (...args: any[]) => void>,
    componentEvents?: Record<string, (...args: any[]) => void>
  ) => Record<string, (...args: any[]) => void>;
}

/**
 * Helper to create normalized options from raw data.
 * Used internally by adapters.
 */
export function normalizeOptions<T>(
  options: T[] | SelectOption<T>[],
  config?: OptionConfig<T>
): SelectOption<T>[] {
  return options.map((opt) => {
    // Already normalized
    if (typeof opt === "object" && opt !== null && "value" in opt && "label" in opt) {
      return opt as SelectOption<T>;
    }

    // Primitive value
    if (typeof opt !== "object" || opt === null) {
      return { value: opt, label: String(opt), data: opt };
    }

    // Object - extract using config
    const obj = opt as T;
    const getValue = config?.valueProperty;
    const getDisplay = config?.displayProperty;

    const value = typeof getValue === "function"
      ? getValue(obj)
      : getValue
        ? (obj as any)[getValue]
        : obj;

    const label = typeof getDisplay === "function"
      ? getDisplay(obj)
      : getDisplay
        ? String((obj as any)[getDisplay])
        : JSON.stringify(obj);

    return {
      value,
      label,
      data: obj,
      disabled: config?.disabledProperty ? (obj as any)[config.disabledProperty] : undefined,
      group: config?.groupProperty ? (obj as any)[config.groupProperty] : undefined,
    };
  });
}

// =============================================================================
// FEEDBACK ADAPTER INTERFACE
// =============================================================================

/**
 * Feedback adapter for alerts, toasts, confirmations.
 */
export interface FeedbackAdapter {
  /** Alert component */
  Alert: ComponentType<AlertProps>;
  /** Badge component */
  Badge?: ComponentType<BadgeProps>;
  /** Toast component */
  Toast?: ComponentType<ToastProps>;
  /** Toast manager */
  toastManager?: ToastManager;
  /** Confirm manager */
  confirmManager?: ConfirmManager;
  /** Spinner/loading */
  Spinner?: ComponentType<SpinnerProps>;
  /** Progress bar */
  Progress?: ComponentType<ProgressProps>;
  /** Skeleton placeholder */
  Skeleton?: ComponentType<SkeletonProps>;
}

// =============================================================================
// PAGE COMPOSITION - Embedding forms, widgets, views
// =============================================================================

/**
 * Widget/View reference for embedding in pages.
 * Allows composing dashboards with multiple forms, tables, charts, etc.
 *
 * @example
 * ```typescript
 * // Dashboard with multiple embedded views
 * class Dashboard extends Page {
 *   configure() {
 *     this.layout("grid", { columns: 2, gap: 16 })
 *       .add(widget("sales-chart", { type: "chart", data: ctx => ctx.api("getSales") }))
 *       .add(widget("recent-orders", { form: RecentOrdersForm, mode: "list" }))
 *       .add(widget("quick-stats", { component: StatsCard }))
 *       .add(widget("customer-form", { form: CustomerForm, entityId: ctx => ctx.params.id }));
 *   }
 * }
 * ```
 */
export interface WidgetConfig {
  /** Widget ID */
  id: string;
  /** Widget title */
  title?: string;
  /** Widget type */
  type?: "form" | "list" | "table" | "chart" | "custom";
  /** Form class to embed */
  form?: any; // Form class reference
  /** Custom component */
  component?: ComponentType<any>;
  /** Props for the widget */
  props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  /** Grid placement */
  grid?: {
    column?: number | string;
    row?: number | string;
    columnSpan?: number;
    rowSpan?: number;
  };
  /** Visibility condition */
  visible?: boolean | ((ctx: FormContext) => boolean);
  /** Refresh interval (ms) */
  refreshInterval?: number;
}

/**
 * Page layout configuration
 */
export interface PageLayoutConfig {
  /** Layout type */
  type: "grid" | "flex" | "stack" | "split";
  /** Number of columns (for grid) */
  columns?: number;
  /** Gap between items */
  gap?: number | string;
  /** Direction (for flex/stack) */
  direction?: "row" | "column";
  /** Split ratio (for split layout) */
  splitRatio?: number[];
}

/**
 * Props for Page component
 */
export interface PageProps extends BaseUIProps {
  /** Page title */
  title?: ReactNode;
  /** Page subtitle */
  subtitle?: ReactNode;
  /** Page layout */
  layout?: PageLayoutConfig;
  /** Header actions */
  headerActions?: ReactNode;
  /** Breadcrumbs */
  breadcrumbs?: BreadcrumbItem[];
  /** Is loading */
  loading?: boolean;
  /** Error state */
  error?: ReactNode;
  /** Children */
  children: ReactNode;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /** Label */
  label: ReactNode;
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Props for Widget container
 */
export interface WidgetContainerProps extends BaseUIProps {
  /** Widget config */
  config: WidgetConfig;
  /** Form context */
  ctx?: FormContext;
  /** Children (widget content) */
  children: ReactNode;
}

// =============================================================================
// PAGE ADAPTER INTERFACE
// =============================================================================

/**
 * Page adapter for page-level components.
 */
export interface PageAdapter {
  /** Page wrapper */
  Page: ComponentType<PageProps>;
  /** Widget container */
  Widget?: ComponentType<WidgetContainerProps>;
  /** Breadcrumbs */
  Breadcrumbs?: ComponentType<{ items: BreadcrumbItem[] }>;
}

// =============================================================================
// COMPONENT ADAPTER TYPES
// =============================================================================

/**
 * Standard props that Lumino passes to all form components.
 * Components should handle these props.
 */
export interface LuminoFieldProps<TValue = any> {
  /** Field name */
  name: string;
  /** Field label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Current value */
  value: TValue;
  /** Error message */
  error?: string;
  /** All error messages (if multiple) */
  errors?: string[];
  /** Is field disabled */
  disabled?: boolean;
  /** Is field read-only */
  readOnly?: boolean;
  /** Is field required */
  required?: boolean;
  /** Value change handler - called with new value directly */
  onChange: (value: TValue) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Focus handler */
  onFocus?: () => void;
}

/**
 * Component normalization callback.
 * Transforms library-specific callback signatures to Lumino format.
 *
 * @example
 * ```typescript
 * // MUI TextField uses event-based onChange
 * const normalizeTextField: NormalizeCallback = (originalOnChange) => {
 *   return (event) => originalOnChange(event.target.value);
 * };
 * ```
 */
export type NormalizeCallback<T = any> = (
  luminoOnChange: (value: T) => void
) => (...args: any[]) => void;

/**
 * Component entry in the adapter.
 */
export interface ComponentEntry {
  /** The actual component */
  component: ComponentType<any>;
  /** Optional callback normalizer */
  normalizeOnChange?: NormalizeCallback;
  /** Default props to apply */
  defaultProps?: Record<string, any>;
}

// =============================================================================
// UI ADAPTER INTERFACE
// =============================================================================

/**
 * Full UI adapter combining all component adapters.
 * Implement this to integrate Lumino with any UI library.
 *
 * @example
 * ```typescript
 * const saltAdapter: UIAdapter = {
 *   name: "salt",
 *   layout: saltLayoutAdapter,
 *   containers: saltContainerAdapter,
 *   lists: saltListAdapter,
 *   actions: saltActionAdapter,
 *   feedback: saltFeedbackAdapter,
 *   page: saltPageAdapter,
 *   components: {
 *     TextField: { component: Input, normalizeOnChange: (cb) => (e) => cb(e.target.value) },
 *     Select: { component: Dropdown },
 *     Checkbox: { component: Checkbox, normalizeOnChange: (cb) => (e) => cb(e.target.checked) },
 *   },
 * };
 * ```
 */
export interface UIAdapter {
  /** Adapter name for identification */
  name: string;

  // =========================================================================
  // LAYOUT ADAPTER (optional - HTML defaults used if not provided)
  // =========================================================================

  /** Layout components (Grid, Row, Column, Section, Form) */
  layout?: LayoutAdapter;

  // =========================================================================
  // OPTIONAL ADAPTERS (provide defaults if not specified)
  // =========================================================================

  /** Container components (Tabs, Dialog, Panel) */
  containers?: ContainerAdapter;
  /** List display components (Rows, Table, Cards) */
  lists?: ListAdapter;
  /** Action components (Button, Toolbar) */
  actions?: ActionAdapter;
  /** Feedback components (Alert, Toast, Confirm) */
  feedback?: FeedbackAdapter;
  /** Page components (Page, Widget, Breadcrumbs) */
  page?: PageAdapter;
  /** Icon components */
  icons?: IconAdapter;
  /** Navigation components (Link, NavMenu) */
  navigation?: NavigationAdapter;
  /** Form field components (TextInput, Select, Checkbox, etc.) */
  fields?: InputAdapter;

  // =========================================================================
  // FORM FIELD COMPONENTS
  // =========================================================================

  /** Component registry for form fields */
  components?: Record<string, ComponentEntry>;
  /** Resolve a component type to actual component */
  resolveComponent?: (componentType: any) => ComponentType<any> | null;
  /** Normalize onChange callback for a component */
  normalizeOnChange?: (componentType: any, onChange: (value: any) => void) => (...args: any[]) => void;

  // =========================================================================
  // CUSTOM COMPONENTS (User-extensible)
  // =========================================================================

  /**
   * Custom components registry.
   * Use extendAdapter() to add components here.
   *
   * @example
   * ```typescript
   * // Register custom components on the adapter
   * const mySaltAdapter = extendAdapter(saltAdapter, {
   *   LuminoAlert: SaltBanner,
   *   LuminoBadge: SaltBadge,
   * });
   *
   * // Later, switch to MUI
   * const myMuiAdapter = extendAdapter(muiAdapter, {
   *   LuminoAlert: MuiAlert,
   *   LuminoBadge: MuiBadge,
   * });
   *
   * // Your app code uses "LuminoAlert" - works with both adapters!
   * ```
   */
  customComponents?: Record<string, ComponentType<any>>;

  // =========================================================================
  // APP LAYOUT
  // =========================================================================

  /**
   * App layout renderer component.
   * Renders the full application shell (header, sidebar, footer, main content).
   */
  AppLayoutRenderer?: ComponentType<{
    layout: any;
    children: ReactNode;
    currentRoute: string;
  }>;
}

// =============================================================================
// ADAPTER EXTENSION HELPER
// =============================================================================

/**
 * Extend a UI adapter with custom components.
 *
 * This allows you to register adapter-specific component implementations
 * that switch automatically when you change adapters.
 *
 * @example
 * ```typescript
 * // Salt adapter with custom components
 * import { saltAdapter } from "lumino/adapters/salt";
 * import { Banner, Badge } from "@salt-ds/core";
 *
 * export const mySaltAdapter = extendAdapter(saltAdapter, {
 *   LuminoAlert: Banner,
 *   LuminoBadge: Badge,
 *   LuminoStatus: StatusIndicator,
 * });
 *
 * // MUI adapter with same component names
 * import { muiAdapter } from "lumino/adapters/mui";
 * import { Alert, Badge } from "@mui/material";
 *
 * export const myMuiAdapter = extendAdapter(muiAdapter, {
 *   LuminoAlert: Alert,
 *   LuminoBadge: Badge,
 *   LuminoStatus: Chip,
 * });
 *
 * // In your app - switch adapter, all components switch!
 * Lumino.ui(mySaltAdapter);  // Uses Salt components
 * // or
 * Lumino.ui(myMuiAdapter);   // Uses MUI components
 *
 * // In your pages - use the Lumino component names
 * const Alert = Lumino.ui.resolve("LuminoAlert");
 * <Alert>Hello</Alert>
 * ```
 *
 * @param adapter - The base adapter to extend
 * @param customComponents - Map of Lumino names to actual components
 * @returns Extended adapter with custom components
 */
/**
 * Base adapter shape that extendAdapter accepts.
 * This is more permissive than UIAdapter to allow both IUIAdapter and UIAdapter.
 */
export interface ExtendableAdapter {
  name: string;
  customComponents?: Record<string, ComponentType<any>>;
  [key: string]: any;
}

export function extendAdapter<T extends ExtendableAdapter, C extends Record<string, ComponentType<any>>>(
  adapter: T,
  customComponents: C
): T & { components: C } {
  const extended = {
    ...adapter,
    customComponents: {
      ...((adapter as any).customComponents || {}),
      ...customComponents,
    },
  } as T;

  // Also attach components directly for easy export
  return Object.assign(extended, { components: customComponents }) as T & { components: C };
}

// =============================================================================
// ICON ADAPTER INTERFACE
// =============================================================================

/**
 * Common icon names that adapters should provide.
 */
export type IconName =
  | "add"
  | "remove"
  | "delete"
  | "edit"
  | "save"
  | "cancel"
  | "close"
  | "check"
  | "chevronUp"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "menu"
  | "search"
  | "filter"
  | "sort"
  | "refresh"
  | "settings"
  | "info"
  | "warning"
  | "error"
  | "success"
  | "loading"
  | "user"
  | "logout"
  | "drag"
  | "copy"
  | "download"
  | "upload";

/**
 * Icon props
 */
export interface IconProps extends BaseUIProps {
  /** Icon name */
  name: IconName | string;
  /** Icon size */
  size?: "small" | "medium" | "large" | number;
  /** Icon color */
  color?: string;
}

/**
 * Icon adapter for providing icons.
 */
export interface IconAdapter {
  /** Icon component */
  Icon: ComponentType<IconProps>;
  /** Get icon by name (for programmatic usage) */
  getIcon?: (name: IconName | string) => ReactNode;
}

// =============================================================================
// NAVIGATION ADAPTER INTERFACE
// =============================================================================

/**
 * Props for Link component
 */
export interface LinkProps extends BaseUIProps {
  /** Link destination */
  href: string;
  /** Link target */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** Is external link */
  external?: boolean;
  /** Children */
  children: ReactNode;
  /** Click handler (overrides navigation) */
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Props for NavMenu component
 */
export interface NavMenuProps extends BaseUIProps {
  /** Menu items */
  items: NavMenuItem[];
  /** Current active path */
  activePath?: string;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Collapsed state (for sidebar) */
  collapsed?: boolean;
}

/**
 * Navigation menu item
 */
export interface NavMenuItem {
  /** Item key */
  key: string;
  /** Item label */
  label: ReactNode;
  /** Item icon */
  icon?: ReactNode;
  /** Link href */
  href?: string;
  /** Click handler */
  onClick?: () => void;
  /** Sub-items */
  children?: NavMenuItem[];
  /** Is disabled */
  disabled?: boolean;
  /** Is divider */
  divider?: boolean;
}

/**
 * Navigation adapter for routing and navigation components.
 */
export interface NavigationAdapter {
  /** Link component */
  Link: ComponentType<LinkProps>;
  /** NavMenu component */
  NavMenu?: ComponentType<NavMenuProps>;
  /** Navigate function */
  navigate?: (path: string, params?: Record<string, any>) => void;
  /** Get current path */
  getCurrentPath?: () => string;
}

// =============================================================================
// BUILT-IN COMPONENT TYPES
// =============================================================================

/**
 * Standard component types that UI adapters should provide.
 * These are suggestions - adapters can provide additional components.
 */
export type StandardComponentType =
  | "TextField"
  | "TextArea"
  | "Select"
  | "Checkbox"
  | "Radio"
  | "RadioGroup"
  | "Switch"
  | "DatePicker"
  | "TimePicker"
  | "DateTimePicker"
  | "NumberField"
  | "Slider"
  | "Autocomplete"
  | "FileUpload"
  | "RichText"
  | "LookupField";

// =============================================================================
// CSS CLASS UTILITIES
// =============================================================================

/**
 * CSS class names generated by Lumino.
 * Use these for styling forms without inline styles.
 */
export interface LuminoCssClasses {
  /** Form wrapper: lum-form--{formId} */
  form: (formId: string) => string;
  /** Section wrapper: lum-section--{title} */
  section: (title: string) => string;
  /** Row wrapper: lum-row--{index} */
  row: (index: number) => string;
  /** Column wrapper: lum-col--{index} */
  column: (index: number) => string;
  /** Field wrapper: lum-field--{name} */
  field: (name: string) => string;
  /** Field with error: lum-field--error */
  fieldError: string;
  /** Field disabled: lum-field--disabled */
  fieldDisabled: string;
  /** Field required: lum-field--required */
  fieldRequired: string;
  /** Object wrapper: lum-object--{id} */
  object: (id: string) => string;
  /** List wrapper: lum-list--{id} */
  list: (id: string) => string;
  /** List item wrapper: lum-list-item--{index} */
  listItem: (index: number) => string;
  /** List item content wrapper */
  listItemContent: string;
  /** List add button */
  listAddButton: string;
  /** List remove button */
  listRemoveButton: string;
}

/**
 * Generate CSS class names for Lumino elements.
 */
export const lumCss: LuminoCssClasses = {
  form: (formId) => `lum-form lum-form--${kebabCase(formId)}`,
  section: (title) => `lum-section lum-section--${kebabCase(title)}`,
  row: (index) => `lum-row lum-row--${index}`,
  column: (index) => `lum-col lum-col--${index}`,
  field: (name) => `lum-field lum-field--${kebabCase(name)}`,
  fieldError: "lum-field--error",
  fieldDisabled: "lum-field--disabled",
  fieldRequired: "lum-field--required",
  object: (id) => `lum-object lum-object--${kebabCase(id)}`,
  list: (id) => `lum-list lum-list--${kebabCase(id)}`,
  listItem: (index) => `lum-list-item lum-list-item--${index}`,
  listItemContent: "lum-list-item__content",
  listAddButton: "lum-list__add-btn",
  listRemoveButton: "lum-list-item__remove-btn",
};

/**
 * Convert string to kebab-case for CSS class names
 */
function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

// =============================================================================
// ERROR PAGE TYPES
// =============================================================================

/**
 * HTTP error status codes supported by the framework
 */
export type ErrorStatusCode = 400 | 401 | 403 | 404 | 405 | 408 | 429 | 500 | 502 | 503 | 504;

/**
 * Error page props for displaying error states
 */
export interface ErrorPageProps extends BaseUIProps {
  /** HTTP status code */
  statusCode: ErrorStatusCode;
  /** Error title (auto-generated if not provided) */
  title?: string;
  /** Error description/message */
  message?: string;
  /** Detailed error information (shown in dev mode) */
  details?: string;
  /** Stack trace (shown in dev mode) */
  stack?: string;
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Retry action handler */
  onRetry?: () => void;
  /** Whether to show home/back button */
  showHome?: boolean;
  /** Home/back action handler */
  onHome?: () => void;
  /** Custom action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Custom illustration/icon */
  illustration?: ReactNode;
  /** Children for custom content */
  children?: ReactNode;
}

/**
 * Default error messages for HTTP status codes
 */
export const DEFAULT_ERROR_MESSAGES: Record<ErrorStatusCode, { title: string; message: string }> = {
  400: { title: "Bad Request", message: "The request could not be understood by the server." },
  401: { title: "Unauthorized", message: "You need to sign in to access this page." },
  403: { title: "Forbidden", message: "You don't have permission to access this resource." },
  404: { title: "Page Not Found", message: "The page you're looking for doesn't exist or has been moved." },
  405: { title: "Method Not Allowed", message: "The request method is not supported for this resource." },
  408: { title: "Request Timeout", message: "The server timed out waiting for the request." },
  429: { title: "Too Many Requests", message: "You've made too many requests. Please try again later." },
  500: { title: "Internal Server Error", message: "Something went wrong on our end. Please try again later." },
  502: { title: "Bad Gateway", message: "The server received an invalid response from an upstream server." },
  503: { title: "Service Unavailable", message: "The server is currently unavailable. Please try again later." },
  504: { title: "Gateway Timeout", message: "The server didn't respond in time. Please try again later." },
};

// =============================================================================
// ERROR HANDLING TYPES
// =============================================================================

/**
 * Error display mode - how errors are shown to users
 */
export type ErrorDisplayMode = "toast" | "banner" | "page" | "inline" | "silent";

/**
 * Error severity levels
 */
export type ErrorSeverity = "info" | "warning" | "error" | "critical";

/**
 * Structured error object for framework error handling
 */
export interface LuminoError {
  /** Unique error code */
  code: string;
  /** HTTP status code if applicable */
  statusCode?: ErrorStatusCode;
  /** Error message */
  message: string;
  /** Detailed error information */
  details?: string;
  /** Stack trace */
  stack?: string;
  /** Error severity */
  severity: ErrorSeverity;
  /** Display mode for this error */
  displayMode?: ErrorDisplayMode;
  /** Original error object */
  originalError?: Error;
  /** Timestamp when error occurred */
  timestamp: Date;
  /** Request ID for tracking */
  requestId?: string;
  /** Additional metadata */
  meta?: Record<string, any>;
}

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  /** Default display mode for unhandled errors */
  defaultDisplayMode?: ErrorDisplayMode;
  /** Map status codes to display modes */
  statusCodeDisplayModes?: Partial<Record<ErrorStatusCode, ErrorDisplayMode>>;
  /** Custom error transformer */
  transformError?: (error: any) => LuminoError;
  /** Error logging callback */
  onError?: (error: LuminoError) => void;
  /** Whether to show stack traces in non-production */
  showStackInDev?: boolean;
  /** Toast configuration */
  toast?: {
    duration?: number;
    position?: "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  };
  /** Banner configuration */
  banner?: {
    dismissible?: boolean;
    position?: "top" | "bottom";
  };
}

/**
 * Error boundary props for catching React errors
 */
export interface ErrorBoundaryProps extends BaseUIProps {
  /** Fallback UI to render on error */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Error handler callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Reset keys - when these change, the boundary resets */
  resetKeys?: any[];
  /** Children to render */
  children: ReactNode;
}

// =============================================================================
// LOADING STATE TYPES
// =============================================================================

/**
 * Loading state types supported by the framework
 */
export type LoadingType =
  | "page"        // Full page loading (route transitions)
  | "component"   // Component-level loading
  | "inline"      // Inline loading (buttons, small areas)
  | "overlay"     // Overlay on existing content
  | "skeleton";   // Skeleton loading for content

/**
 * Loading state sizes
 */
export type LoadingSize = "small" | "medium" | "large";

/**
 * Page loader props - full page loading state
 */
export interface PageLoaderProps extends BaseUIProps {
  /** Loading message */
  message?: string;
  /** Show progress bar */
  showProgress?: boolean;
  /** Progress value (0-100) */
  progress?: number;
  /** Spinner size */
  size?: LoadingSize;
  /** Delay before showing loader (ms) */
  delay?: number;
  /** Minimum display time (ms) */
  minDisplayTime?: number;
}

/**
 * Component loader props - loading state for a component area
 */
export interface ComponentLoaderProps extends BaseUIProps {
  /** Whether loading is active */
  loading: boolean;
  /** Loading message */
  message?: string;
  /** Spinner size */
  size?: LoadingSize;
  /** Show as overlay on existing content */
  overlay?: boolean;
  /** Blur background content */
  blur?: boolean;
  /** Show skeleton instead of spinner */
  skeleton?: boolean;
  /** Skeleton height */
  skeletonHeight?: number | string;
  /** Skeleton lines count */
  skeletonLines?: number;
  /** Children to render when not loading */
  children: ReactNode;
}

/**
 * Inline loader props - small loading indicators
 */
export interface InlineLoaderProps extends BaseUIProps {
  /** Whether loading is active */
  loading: boolean;
  /** Spinner size */
  size?: LoadingSize;
  /** Loading text */
  text?: string;
  /** Show text on left or right */
  textPosition?: "left" | "right";
}

/**
 * Global loading overlay props
 */
export interface GlobalLoadingOverlayProps extends BaseUIProps {
  /** Whether overlay is visible */
  visible: boolean;
  /** Loading message */
  message?: string;
  /** Show progress */
  showProgress?: boolean;
  /** Progress value (0-100) */
  progress?: number;
  /** Background opacity (0-1) */
  opacity?: number;
  /** Z-index for overlay */
  zIndex?: number;
}

/**
 * Skeleton loader props for content placeholder
 */
export interface SkeletonProps extends BaseUIProps {
  /** Skeleton variant */
  variant?: "text" | "rectangular" | "circular" | "rounded";
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Animation type */
  animation?: "pulse" | "wave" | false;
  /** Number of lines for text variant */
  lines?: number;
}

// =============================================================================
// API LOADING TRACKING TYPES
// =============================================================================

/**
 * API call tracking options
 */
export interface ApiCallOptions {
  /** Unique identifier for this API call */
  id?: string;
  /** Whether to exclude from global loading (e.g., autocomplete) */
  excludeFromLoading?: boolean;
  /** Whether to show inline loader for this call */
  showInlineLoader?: boolean;
  /** Custom loading message */
  loadingMessage?: string;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Retry configuration */
  retry?: {
    count: number;
    delay?: number;
    backoff?: "linear" | "exponential";
  };
}

/**
 * API loading state for tracking multiple concurrent calls
 */
export interface ApiLoadingState {
  /** List of active API call IDs */
  activeCallIds: string[];
  /** Total number of active calls */
  activeCount: number;
  /** Number of calls included in global loading */
  globalLoadingCount: number;
  /** Whether global loading should be shown */
  isGlobalLoading: boolean;
  /** Individual call states */
  calls: Map<string, {
    id: string;
    startTime: Date;
    message?: string;
    excludeFromLoading: boolean;
  }>;
}

/**
 * API loading context value
 */
export interface ApiLoadingContextValue {
  /** Current loading state */
  state: ApiLoadingState;
  /** Register a new API call */
  startCall: (id: string, options?: ApiCallOptions) => void;
  /** Mark an API call as complete */
  endCall: (id: string) => void;
  /** Check if a specific call is loading */
  isCallLoading: (id: string) => boolean;
  /** Check if global loading should be shown */
  isGlobalLoading: () => boolean;
  /** Get loading message for a specific call */
  getCallMessage: (id: string) => string | undefined;
}

// =============================================================================
// ERROR PAGE ADAPTER INTERFACE
// =============================================================================

/**
 * Adapter interface for error pages
 */
export interface IErrorPagesAdapter {
  /** Generic error page component */
  ErrorPage?: ComponentType<ErrorPageProps>;
  /** 404 Not Found page */
  NotFoundPage?: ComponentType<Omit<ErrorPageProps, "statusCode">>;
  /** 401 Unauthorized page */
  UnauthorizedPage?: ComponentType<Omit<ErrorPageProps, "statusCode">>;
  /** 403 Forbidden page */
  ForbiddenPage?: ComponentType<Omit<ErrorPageProps, "statusCode">>;
  /** 500 Server Error page */
  ServerErrorPage?: ComponentType<Omit<ErrorPageProps, "statusCode">>;
  /** Error boundary component */
  ErrorBoundary?: ComponentType<ErrorBoundaryProps>;
}

/**
 * Adapter interface for loading components
 */
export interface ILoadingAdapter {
  /** Page loader component */
  PageLoader?: ComponentType<PageLoaderProps>;
  /** Component loader wrapper */
  ComponentLoader?: ComponentType<ComponentLoaderProps>;
  /** Inline loader component */
  InlineLoader?: ComponentType<InlineLoaderProps>;
  /** Global loading overlay */
  GlobalLoadingOverlay?: ComponentType<GlobalLoadingOverlayProps>;
  /** Skeleton component */
  Skeleton?: ComponentType<SkeletonProps>;
}
