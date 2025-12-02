/**
 * Lumino Framework - Base UI Adapters
 *
 * UI-library agnostic base adapters for rendering layout, containers, lists, and actions.
 * Field adapters use a hooks-based approach - see core/adapters/hooks/.
 *
 * ## Architecture
 *
 * The adapter pattern allows you to swap UI frameworks without changing app code:
 *
 * 1. **Base Adapters** - Provide logic and default styling (Layout, Container, List, Action)
 * 2. **UI Adapters** - Framework-specific implementations (e.g., lumino/adapters/salt)
 * 3. **Shared Hooks** - Common field logic in core/adapters/hooks/
 *
 * ## Usage Pattern
 *
 * ```typescript
 * // For UI-specific adapters (recommended)
 * import { saltAdapter } from "lumino/adapters/salt";
 * Lumino.ui(saltAdapter);
 *
 * // Salt is the default adapter - no configuration needed
 * // Just import and use field components
 * import { TextInput, Select } from "lumino/react";
 * ```
 *
 * ## Creating Custom Adapters
 *
 * ```typescript
 * import { createLayoutAdapter, LayoutStyleProvider } from "@lumino/react/adapters";
 *
 * const myStyles: Partial<LayoutStyleProvider> = {
 *   getRowStyle: () => ({ display: "flex", gap: "20px" }),
 * };
 *
 * const myLayoutAdapter = createLayoutAdapter(myStyles);
 * ```
 *
 * For field adapters, use the shared hooks from core/adapters/hooks/:
 * - useTextInput, useNumberInput, useSelect, useCheckbox
 */

// =============================================================================
// BASE ADAPTERS
// =============================================================================

export {
  // Layout
  BaseRow,
  BaseColumn,
  BaseSection,
  BaseForm,
  BaseFieldWrapper,
  defaultLayoutStyles,
  createLayoutAdapter,
  // Container
  BaseTabs,
  BaseTabPanel,
  BaseDialog,
  BasePanel,
  BaseCard,
  defaultContainerStyles,
  createContainerAdapter,
  // List
  BaseListRows,
  BaseListTable,
  BaseListCards,
  defaultListStyles,
  createListAdapter,
  // Action
  BaseButton,
  BaseIconButton,
  BaseToolbar,
  BaseButtonGroup,
  defaultActionStyles,
  createActionAdapter,
} from "./base";

export type {
  // Layout types
  LayoutStyleProvider,
  BaseRowProps,
  BaseColumnProps,
  BaseSectionProps,
  BaseFormProps,
  BaseFieldWrapperProps,
  // Container types
  ContainerStyleProvider,
  BaseTabsProps,
  BaseTabPanelProps,
  BaseDialogProps,
  BasePanelProps,
  BaseCardProps,
  // List types
  ListStyleProvider,
  BaseListRowsProps,
  BaseListTableProps,
  BaseListCardsProps,
  // Action types
  ActionStyleProvider,
  BaseButtonProps,
  BaseIconButtonProps,
  BaseToolbarProps,
  BaseButtonGroupProps,
} from "./base";

// =============================================================================
// DEFAULT ADAPTER (fallback)
// =============================================================================

export { defaultAdapter, defaultLayoutAdapter, createAdapter } from "./DefaultAdapter";
