/**
 * Lumino Framework - Base Adapters
 *
 * Abstract base implementations for UI components.
 * UI-specific adapters (Salt, MUI, etc.) extend these with their own styling.
 *
 * Pattern:
 * 1. Each base adapter defines a StyleProvider interface for customization
 * 2. Base components handle logic and delegate styling to the provider
 * 3. createXxxAdapter() helpers create adapters with custom styles
 *
 * @example
 * ```typescript
 * import { createLayoutAdapter, LayoutStyleProvider } from "@lumino/react/adapters/base";
 *
 * // Create custom styles
 * const myStyles: Partial<LayoutStyleProvider> = {
 *   getRowStyle: () => ({
 *     display: "flex",
 *     gap: "20px",
 *   }),
 * };
 *
 * // Create adapter with custom styles
 * const myLayoutAdapter = createLayoutAdapter(myStyles);
 * ```
 */

// Layout adapter
export {
  BaseRow,
  BaseColumn,
  BaseSection,
  BaseForm,
  BaseFieldWrapper,
  defaultLayoutStyles,
  createLayoutAdapter,
} from "./BaseLayoutAdapter";
export type { LayoutStyleProvider, BaseRowProps, BaseColumnProps, BaseSectionProps, BaseFormProps, BaseFieldWrapperProps } from "./BaseLayoutAdapter";

// Container adapter
export {
  BaseTabs,
  BaseTabPanel,
  BaseDialog,
  BasePanel,
  BaseCard,
  defaultContainerStyles,
  createContainerAdapter,
} from "./BaseContainerAdapter";
export type { ContainerStyleProvider, BaseTabsProps, BaseTabPanelProps, BaseDialogProps, BasePanelProps, BaseCardProps } from "./BaseContainerAdapter";

// List adapter
export {
  BaseListRows,
  BaseListTable,
  BaseListCards,
  defaultListStyles,
  createListAdapter,
} from "./BaseListAdapter";
export type { ListStyleProvider, BaseListRowsProps, BaseListTableProps, BaseListCardsProps } from "./BaseListAdapter";

// Action adapter
export {
  BaseButton,
  BaseIconButton,
  BaseToolbar,
  BaseButtonGroup,
  defaultActionStyles,
  createActionAdapter,
} from "./BaseActionAdapter";
export type { ActionStyleProvider, BaseButtonProps, BaseIconButtonProps, BaseToolbarProps, BaseButtonGroupProps } from "./BaseActionAdapter";

// Field adapters are now in core/adapters (hooks-based approach)
// See lumino/core/adapters/hooks/ for shared field logic
// See lumino/adapters/salt/fields/ for Salt implementation
