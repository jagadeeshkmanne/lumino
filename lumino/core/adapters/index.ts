/**
 * Lumino Framework - Adapter System
 *
 * This module provides:
 * 1. Universal component adapter (createLuminoComponent)
 * 2. Adapter interfaces (IFieldAdapter, IUIAdapter, etc.)
 * 3. Prop/component type definitions
 *
 * ## Architecture
 *
 * ```
 * createLuminoComponent(Component, { props, events, render })
 *    ↓
 * LuminoInput, LuminoCheckbox, LuminoSelect, etc.
 *    ↓
 * Salt/MUI/Ant Design components
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { createLuminoComponent } from "lumino/core/adapters";
 * import { Input } from "@salt-ds/core";
 *
 * const LuminoInput = createLuminoComponent(Input, {
 *   props: {
 *     error: { to: "validationStatus", transform: (e) => e ? "error" : undefined },
 *   },
 *   events: {
 *     onChange: { to: "onChange", extract: (e) => e.target.value },
 *   },
 * });
 * ```
 */

import type { ComponentType, ReactNode } from "react";

// =============================================================================
// RE-EXPORT PROP INTERFACES FROM CORE TYPES
// =============================================================================

// Field Props
export type {
  TextInputProps,
  NumberInputProps,
  TextAreaProps,
  CheckboxProps,
  CheckboxGroupProps,
  SwitchProps,
  RadioGroupProps,
  SelectProps,
  MultiSelectProps,
  AutocompleteProps,
  DatePickerProps,
  TimePickerProps,
} from "../types/ui";

// Layout Props
export type {
  RowLayoutProps,
  ColumnLayoutProps,
  SectionLayoutProps,
  FormLayoutProps,
  FieldWrapperProps,
  GridProps,
  ErrorMessageProps,
} from "../types/ui";

// Container Props
export type {
  DialogProps,
  PanelProps,
  CardProps,
  TabsProps,
  TabPanelProps,
} from "../types/ui";

// Action Props
export type {
  ButtonProps,
  IconButtonProps,
  ToolbarProps,
  ButtonGroupProps,
} from "../types/ui";

// =============================================================================
// FIELD ADAPTER INTERFACE
// =============================================================================

/**
 * Interface for field component implementations.
 */
export interface IFieldAdapter {
  TextInput?: ComponentType<import("../types/ui").TextInputProps>;
  NumberInput?: ComponentType<import("../types/ui").NumberInputProps>;
  TextArea?: ComponentType<import("../types/ui").TextAreaProps>;
  Checkbox?: ComponentType<import("../types/ui").CheckboxProps>;
  CheckboxGroup?: ComponentType<import("../types/ui").CheckboxGroupProps>;
  Switch?: ComponentType<import("../types/ui").SwitchProps>;
  RadioGroup?: ComponentType<import("../types/ui").RadioGroupProps>;
  Select?: ComponentType<import("../types/ui").SelectProps>;
  MultiSelect?: ComponentType<import("../types/ui").MultiSelectProps>;
  Autocomplete?: ComponentType<import("../types/ui").AutocompleteProps>;
  DatePicker?: ComponentType<import("../types/ui").DatePickerProps>;
  TimePicker?: ComponentType<import("../types/ui").TimePickerProps>;
}

// =============================================================================
// LAYOUT ADAPTER INTERFACE
// =============================================================================

export interface ILayoutAdapter {
  Row?: ComponentType<import("../types/ui").RowLayoutProps>;
  Column?: ComponentType<import("../types/ui").ColumnLayoutProps>;
  Section?: ComponentType<import("../types/ui").SectionLayoutProps>;
  Form?: ComponentType<import("../types/ui").FormLayoutProps>;
  FieldWrapper?: ComponentType<import("../types/ui").FieldWrapperProps>;
  Grid?: ComponentType<import("../types/ui").GridProps>;
  ErrorMessage?: ComponentType<import("../types/ui").ErrorMessageProps>;
}

// =============================================================================
// CONTAINER ADAPTER INTERFACE
// =============================================================================

export interface IContainerAdapter {
  Dialog?: ComponentType<import("../types/ui").DialogProps>;
  Panel?: ComponentType<import("../types/ui").PanelProps>;
  Card?: ComponentType<import("../types/ui").CardProps>;
  Tabs?: ComponentType<import("../types/ui").TabsProps>;
  TabPanel?: ComponentType<import("../types/ui").TabPanelProps>;
}

// =============================================================================
// ACTION ADAPTER INTERFACE
// =============================================================================

export interface IActionAdapter {
  Button?: ComponentType<import("../types/ui").ButtonProps>;
  IconButton?: ComponentType<import("../types/ui").IconButtonProps>;
  Toolbar?: ComponentType<import("../types/ui").ToolbarProps>;
  ButtonGroup?: ComponentType<import("../types/ui").ButtonGroupProps>;
}

// =============================================================================
// LIST ADAPTER INTERFACE
// =============================================================================

export interface ListTabsProps {
  items: any[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  getLabel?: (item: any, index: number) => string;
  addButton?: React.ReactNode;
  onAdd?: () => void;
  onClose?: (index: number) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface ListTableProps {
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    width?: number | string;
    render?: (value: any, item: any, index: number) => React.ReactNode;
  }>;
  onRowClick?: (index: number) => void;
  rowActions?: Array<{
    label: string;
    onClick: (index: number) => void;
    enabled?: (index: number) => boolean;
  }>;
}

export interface ListCardsProps {
  items: any[];
  renderCard: (item: any, index: number) => React.ReactNode;
  className?: string;
}

export interface IListAdapter {
  Tabs?: ComponentType<ListTabsProps>;
  Table?: ComponentType<ListTableProps>;
  Cards?: ComponentType<ListCardsProps>;
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
// COMPLETE UI ADAPTER INTERFACE
// =============================================================================

export interface AppLayoutRendererProps {
  layout: any;
  children: ReactNode;
  currentRoute: string;
}

// =============================================================================
// FEEDBACK ADAPTER INTERFACE
// =============================================================================

export interface IFeedbackAdapter {
  Alert?: ComponentType<import("../types/ui").AlertProps>;
  Badge?: ComponentType<import("../types/ui").BadgeProps>;
  Avatar?: ComponentType<import("../types/ui").AvatarProps>;
  Toast?: ComponentType<import("../types/ui").ToastProps>;
  Spinner?: ComponentType<import("../types/ui").SpinnerProps>;
  Progress?: ComponentType<import("../types/ui").ProgressProps>;
  Tooltip?: ComponentType<import("../types/ui").TooltipProps>;
  Banner?: ComponentType<import("../types/ui").BannerProps>;
}

// =============================================================================
// COMPLETE UI ADAPTER INTERFACE
// =============================================================================

export interface IUIAdapter {
  name: string;
  fields?: IFieldAdapter;
  layout?: ILayoutAdapter;
  containers?: IContainerAdapter;
  actions?: IActionAdapter;
  lists?: IListAdapter;
  feedback?: IFeedbackAdapter;
  AppLayoutRenderer?: ComponentType<AppLayoutRendererProps>;
  NavRenderer?: ComponentType<{
    items: any[];
    currentRoute: string;
    navigate?: (path: string) => void;
    orientation?: "horizontal" | "vertical";
    className?: string;
  }>;
  resolveComponent?: (componentType: string | ComponentType) => ComponentType;
}

// =============================================================================
// EXTEND ADAPTER UTILITY
// =============================================================================

export { extendAdapter } from "../types/ui";

// =============================================================================
// UNIVERSAL LUMINO COMPONENT SYSTEM
// =============================================================================

export {
  createLuminoComponent,
  createLuminoComponents,
  createLuminoStructure,
  createLuminoLayout, // Backwards compatibility alias
} from "./LuminoComponent";

export type {
  LuminoComponentProps,
  ComponentMapping,
  ChildrenMapping,
  NormalizedOption,
  LuminoStructuralProps,
  StructuralMapping,
  LuminoLayoutProps, // Backwards compatibility alias
  LayoutMapping, // Backwards compatibility alias
} from "./LuminoComponent";

// =============================================================================
// NORMALIZATION HELPERS
// =============================================================================

/**
 * Helper to normalize onChange from event to value.
 */
export function normalizeOnChange<T>(
  onChange: (value: T) => void,
  getValue: (event: any) => T = (e) => e.target.value
) {
  return (event: any) => {
    const value = getValue(event);
    onChange(value);
  };
}

/**
 * Helper to normalize checkbox onChange (event → boolean).
 */
export function normalizeCheckboxChange(onChange: (value: boolean) => void) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };
}

/**
 * Helper to normalize number input onChange (event → number | null).
 */
export function normalizeNumberChange(onChange: (value: number | null) => void) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    onChange(val === "" ? null : parseFloat(val));
  };
}

/**
 * Helper to normalize select onChange (various patterns → value).
 */
export function normalizeSelectChange<T>(
  onChange: (value: T) => void,
  pattern: "salt" | "mui" | "ant" | "value" = "value"
) {
  return (...args: any[]) => {
    let value: T;

    switch (pattern) {
      case "salt":
        // onSelectionChange(event, selected[])
        const selected = args[1];
        value = selected?.[0] ?? null;
        break;
      case "mui":
        // onChange(event)
        value = args[0]?.target?.value;
        break;
      case "ant":
        // onChange(value)
        value = args[0];
        break;
      default:
        value = args[0];
    }

    onChange(value);
  };
}

/**
 * Convert error to validation status.
 */
export function toValidationStatus(
  error: boolean | string | undefined,
  framework: "salt" | "mui" | "ant" = "salt"
): any {
  switch (framework) {
    case "salt":
      return error ? "error" : undefined;
    case "mui":
      return !!error;
    case "ant":
      return error ? "error" : undefined;
    default:
      return error;
  }
}
