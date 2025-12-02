/**
 * Lumino Framework - Universal Component Adapter
 *
 * A single, consistent pattern to adapt ANY React component from ANY UI library.
 *
 * ## The 6 Configuration Options
 *
 * ```typescript
 * createLuminoComponent(LibraryComponent, {
 *   props: { ... },     // 1. Map Lumino props → Library props
 *   events: { ... },    // 2. Map Lumino callbacks → Library callbacks (extract clean values)
 *   defaults: { ... },  // 3. Default props to always pass
 *   exclude: [...],     // 4. Props to NOT pass through
 *   children: { ... },  // 5. Auto-generate children from options (Select, RadioGroup, etc.)
 *   render: () => ...,  // 6. Custom render (full control when needed)
 * })
 * ```
 *
 * ## When to use each option:
 *
 * - **Simple components** (Checkbox, Switch): Just `props` + `events`
 * - **Option-based components** (Select, RadioGroup): Use `children` config
 * - **Complex layouts**: Use `render` for full control
 *
 * ## Examples
 *
 * ```typescript
 * // Display component - no mapping needed
 * LuminoBadge: Badge
 *
 * // Input - map onChange event
 * LuminoInput: createLuminoComponent(Input, {
 *   props: {
 *     error: { to: "validationStatus", transform: (e) => e ? "error" : undefined },
 *   },
 *   events: {
 *     onChange: { to: "onChange", extract: (e) => e.target.value },
 *   },
 * })
 *
 * // Select - use children config (works with ANY UI library!)
 * LuminoSelect: createLuminoComponent(Dropdown, {
 *   props: {
 *     error: { to: "validationStatus", transform: (e) => e ? "error" : undefined },
 *   },
 *   children: {
 *     from: "options",
 *     Component: Option,
 *     getProps: (opt) => ({ value: opt.value, disabled: opt.disabled }),
 *   },
 * })
 *
 * // MUI Select - same pattern, different components
 * LuminoSelect: createLuminoComponent(MuiSelect, {
 *   children: { from: "options", Component: MenuItem },
 * })
 *
 * // Complex layout - use render for full control
 * LuminoGroupedSelect: createLuminoComponent(Select, {
 *   render: (props, Select, originalProps, { normalizedOptions }) => (
 *     <Select {...props}>
 *       {groupBy(normalizedOptions, 'group').map(group => (
 *         <OptionGroup label={group.key}>
 *           {group.items.map(opt => <Option {...opt} />)}
 *         </OptionGroup>
 *       ))}
 *     </Select>
 *   ),
 * })
 * ```
 */

import React, { ComponentType, forwardRef, ReactNode } from "react";

// =============================================================================
// LUMINO STANDARD PROPS - The universal interface for all components
// =============================================================================

/**
 * Standard props for ALL Lumino components.
 *
 * This is the contract between your app and Lumino.
 * All callbacks receive CLEAN VALUES, not raw DOM events.
 */
export interface LuminoComponentProps<TValue = any, TData = any> {
  // ===========================================================================
  // DATA BINDING
  // ===========================================================================

  /** Primary value (inputs, selects) */
  value?: TValue;
  /** Default value (uncontrolled) */
  defaultValue?: TValue;
  /** Checked state (checkbox, switch) */
  checked?: boolean;
  /** Selected item(s) */
  selected?: TValue;
  /** Data source (table, grid, list) */
  data?: TData[];
  /** Options (dropdown, select, combobox) */
  options?: TData[];

  // ===========================================================================
  // DISPLAY
  // ===========================================================================

  children?: ReactNode;
  label?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  helperText?: string;
  icon?: ReactNode;

  // ===========================================================================
  // STATE
  // ===========================================================================

  error?: boolean | string;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  required?: boolean;
  open?: boolean;
  expanded?: boolean;
  visible?: boolean;
  active?: boolean;
  status?: "success" | "warning" | "error" | "info";

  // ===========================================================================
  // CALLBACKS - All receive CLEAN VALUES
  // ===========================================================================

  // Value Change
  onChange?: (value: TValue) => void;
  onValueChange?: (value: TValue) => void;
  onCheckedChange?: (checked: boolean) => void;

  // Selection
  onSelect?: (value: TValue, item?: TData) => void;
  onSelectionChange?: (selected: TValue[]) => void;
  onRowSelected?: (rowIndices: number[]) => void;
  onActiveChange?: (index: number) => void;

  // Open/Close/Toggle
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  onToggle?: (isExpanded: boolean) => void;
  onExpandedChange?: (expanded: boolean) => void;

  // Focus
  onFocus?: () => void;
  onBlur?: () => void;

  // Click
  onClick?: () => void;
  onPress?: () => void;

  // Input/Keyboard
  onSearch?: (query: string) => void;
  onInput?: (value: string) => void;
  onKeyDown?: (key: string) => void;
  onEnter?: () => void;
  onEscape?: () => void;

  // Form
  onSubmit?: (value: TValue) => void;
  onCancel?: () => void;
  onConfirm?: (value?: TValue) => void;
  onClear?: () => void;
  onReset?: () => void;

  // Tabs
  onAddTab?: () => void;
  onCloseTab?: (index: number) => void;

  // Grid/Table
  onSort?: (columnId: string, order: "asc" | "desc" | "none") => void;
  onCellClick?: (rowIndex: number, columnId: string) => void;
  onRowClick?: (rowIndex: number) => void;
  onColumnResize?: (columnId: string, width: number) => void;

  // Date/Time
  onDateChange?: (date: Date | null) => void;
  onTimeChange?: (time: string | null) => void;

  // Error
  onError?: (error: Error | string) => void;

  // ===========================================================================
  // HTML/REACT STANDARD
  // ===========================================================================

  className?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  tabIndex?: number;
  autoFocus?: boolean;
  "data-testid"?: string;
  "aria-label"?: string;
}

// =============================================================================
// COMPONENT MAPPING - The configuration object
// =============================================================================

/**
 * Normalized option shape used internally.
 */
export interface NormalizedOption<T = any> {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
  data: T;
}

/**
 * Configuration for auto-generating children from options.
 * Works with ANY UI library's select/radio/checkbox components.
 *
 * @example
 * ```typescript
 * // Salt DS
 * children: { from: "options", Component: Option }
 *
 * // MUI
 * children: { from: "options", Component: MenuItem }
 *
 * // Ant Design
 * children: { from: "options", Component: Select.Option }
 *
 * // Custom value prop name (React Aria uses "key")
 * children: { from: "options", Component: Item, valueProp: "key" }
 * ```
 */
export interface ChildrenMapping {
  /**
   * Source prop containing options (usually "options")
   */
  from: string;

  /**
   * The child component to render (Option, MenuItem, RadioButton, etc.)
   */
  Component: ComponentType<any>;

  /**
   * Prop name for the option value. Default: "value"
   * Some libraries use different names (e.g., React Aria uses "key")
   */
  valueProp?: string;

  /**
   * Additional props to pass to each child.
   * Receives the normalized option.
   */
  getProps?: (opt: NormalizedOption) => Record<string, any>;

  /**
   * Custom content renderer. If not provided, uses renderOption or opt.label.
   */
  getContent?: (opt: NormalizedOption, renderOption?: (opt: NormalizedOption) => ReactNode) => ReactNode;

  /**
   * Transform value before passing to container (e.g., wrap in array for multi-select)
   */
  valueTransform?: (value: any) => any;

  /**
   * Container prop name for the value. Default: same as Lumino "value"
   */
  valueTo?: string;

  /**
   * Event name for selection change. Default: "onChange"
   */
  onChangeTo?: string;

  /**
   * Extract value from the library's onChange event
   */
  onChangeExtract?: (...args: any[]) => any;
}

/**
 * Configuration for mapping Lumino props/events to library props/events.
 *
 * @example
 * ```typescript
 * // Simple component
 * {
 *   props: { value: "checked" },
 *   events: { onChange: { to: "onChange", extract: (e) => e.target.checked } },
 * }
 *
 * // Option-based component (Select, RadioGroup)
 * {
 *   props: { error: { to: "validationStatus", transform: e => e ? "error" : undefined } },
 *   children: { from: "options", Component: Option },
 * }
 * ```
 */
export interface ComponentMapping<TProps = any> {
  /**
   * Map Lumino props to library props.
   *
   * - `string`: Simple rename (e.g., `value: "checked"`)
   * - `{ to, transform }`: Rename with transformation
   */
  props?: Record<
    string,
    | string
    | {
        to: string;
        transform?: (value: any, allProps?: any) => any;
      }
  >;

  /**
   * Map Lumino callbacks to library callbacks.
   *
   * - `to`: The library's callback name
   * - `extract`: Function to extract clean value from library's callback args
   */
  events?: Record<
    string,
    {
      to: string;
      extract?: (...args: any[]) => any;
    }
  >;

  /**
   * Props to exclude from passing to the library component.
   */
  exclude?: string[];

  /**
   * Default props to always pass to the library component.
   */
  defaults?: Record<string, any>;

  /**
   * Auto-generate children from options.
   * Use for Select, RadioGroup, CheckboxGroup, Autocomplete, etc.
   *
   * This handles:
   * - normalizeOptions with optionConfig
   * - renderOption for custom rendering
   * - returnFullObject for returning full object vs value
   * - onChange value extraction
   */
  children?: ChildrenMapping;

  /**
   * Custom render function for complex components.
   *
   * Use when you need full control over rendering.
   * Receives normalizedOptions when `children.from` is specified.
   */
  render?: (
    transformedProps: TProps,
    NativeComponent: ComponentType<TProps>,
    originalProps: LuminoComponentProps,
    helpers?: { normalizedOptions?: NormalizedOption[] }
  ) => React.ReactElement;
}

// =============================================================================
// MAIN API
// =============================================================================

/**
 * Create a Lumino-compatible component from ANY React component.
 *
 * This is the ONLY function you need to adapt components.
 * Same pattern for every component type, every library.
 *
 * @param NativeComponent - Your UI library component
 * @param mapping - How to map Lumino interface to library interface
 *
 * @example Display (no mapping)
 * ```typescript
 * const LuminoBadge = createLuminoComponent(Badge);
 * ```
 *
 * @example Input (event mapping)
 * ```typescript
 * const LuminoInput = createLuminoComponent(Input, {
 *   props: {
 *     error: { to: "validationStatus", transform: (e) => e ? "error" : undefined },
 *   },
 *   events: {
 *     onChange: { to: "onChange", extract: (e) => e.target.value },
 *     onBlur: { to: "onBlur", extract: () => undefined },
 *   },
 * });
 * ```
 *
 * @example Checkbox (prop + event mapping)
 * ```typescript
 * const LuminoCheckbox = createLuminoComponent(Checkbox, {
 *   props: {
 *     value: "checked",
 *   },
 *   events: {
 *     onChange: { to: "onChange", extract: (e) => e.target.checked },
 *   },
 * });
 * ```
 *
 * @example ComboBox (with custom render)
 * ```typescript
 * const LuminoComboBox = createLuminoComponent(ComboBox, {
 *   props: {
 *     value: "selected",
 *   },
 *   events: {
 *     onChange: { to: "onSelectionChange", extract: (e, sel) => sel[0] },
 *     onOpenChange: { to: "onOpenChange", extract: (open) => open },
 *   },
 *   render: (props, ComboBox, originalProps) => (
 *     <ComboBox {...props}>
 *       {originalProps.options?.map(opt => (
 *         <Option key={opt.value} value={opt.value}>{opt.label}</Option>
 *       ))}
 *     </ComboBox>
 *   ),
 * });
 * ```
 *
 * @example Table/Grid (complex events)
 * ```typescript
 * const LuminoTable = createLuminoComponent(Table, {
 *   props: {
 *     data: "dataSource",
 *   },
 *   events: {
 *     onRowClick: { to: "onRow", extract: (record, index) => index },
 *     onSort: { to: "onChange", extract: (pagination, filters, sorter) => ({
 *       columnId: sorter.field,
 *       order: sorter.order,
 *     })},
 *   },
 *   render: (props, Table, originalProps) => (
 *     <Table {...props}>
 *       {originalProps.columns?.map(col => (
 *         <Table.Column key={col.key} {...col} />
 *       ))}
 *     </Table>
 *   ),
 * });
 * ```
 */
// =============================================================================
// NORMALIZE OPTIONS HELPER (inline to avoid circular imports)
// =============================================================================

function normalizeOptionsInternal<T>(
  options: T[],
  config?: { valueProperty?: string | ((item: T) => any); displayProperty?: string | ((item: T) => string); disabledProperty?: string; groupProperty?: string }
): NormalizedOption<T>[] {
  return options.map((opt) => {
    // Already normalized
    if (typeof opt === "object" && opt !== null && "value" in opt && "label" in opt) {
      return { ...(opt as any), data: (opt as any).data ?? opt } as NormalizedOption<T>;
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
// MAIN FACTORY
// =============================================================================

export function createLuminoComponent<TProps extends Record<string, any>>(
  NativeComponent: ComponentType<TProps>,
  mapping: ComponentMapping<TProps> = {}
): ComponentType<LuminoComponentProps & Omit<TProps, keyof LuminoComponentProps>> {
  const LuminoComponent = forwardRef<any, LuminoComponentProps & TProps>(
    (props, ref) => {
      const {
        props: propMappings = {},
        events: eventMappings = {},
        exclude = [],
        defaults = {},
        children: childrenConfig,
        render,
      } = mapping;

      // Build list of props to auto-exclude when using children config
      const autoExclude = childrenConfig
        ? [childrenConfig.from, "optionConfig", "renderOption", "returnFullObject", "onChange"]
        : [];

      const transformedProps: Record<string, any> = { ...defaults };

      // Normalize options if children config is present
      let normalizedOptions: NormalizedOption[] | undefined;
      if (childrenConfig) {
        const rawOptions = (props as any)[childrenConfig.from] || [];
        const optionConfig = (props as any).optionConfig;
        normalizedOptions = normalizeOptionsInternal(rawOptions, optionConfig);
      }

      // Process each prop
      for (const [key, value] of Object.entries(props)) {
        if (value === undefined) continue;
        if (exclude.includes(key)) continue;
        if (autoExclude.includes(key)) continue;

        // Check if this is an event mapping
        const eventMapping = eventMappings[key];
        if (eventMapping && typeof value === "function") {
          const handler = value as (...args: any[]) => void;
          transformedProps[eventMapping.to] = (...args: any[]) => {
            const extracted = eventMapping.extract
              ? eventMapping.extract(...args)
              : args[0];
            handler(extracted);
          };
          continue;
        }

        // Check if this is a prop mapping
        const propMapping = propMappings[key];
        if (propMapping) {
          if (typeof propMapping === "string") {
            transformedProps[propMapping] = value;
          } else {
            const transformed = propMapping.transform
              ? propMapping.transform(value, props)
              : value;
            transformedProps[propMapping.to] = transformed;
          }
          continue;
        }

        // Pass through unchanged
        transformedProps[key] = value;
      }

      // Add ref
      transformedProps.ref = ref;

      // Handle children config (auto-generate children from options)
      if (childrenConfig && normalizedOptions) {
        const {
          Component: OptionComponent,
          valueProp = "value",
          getProps,
          getContent,
          valueTransform,
          valueTo,
          onChangeTo = "onChange",
          onChangeExtract,
        } = childrenConfig;

        const { value, onChange, renderOption, returnFullObject } = props as any;

        // Transform value if needed (e.g., wrap in array for Salt Dropdown)
        if (valueTo || valueTransform) {
          const transformedValue = valueTransform ? valueTransform(value) : value;
          transformedProps[valueTo || "value"] = transformedValue;
        } else if (value !== undefined) {
          transformedProps.value = value;
        }

        // Handle onChange - extract value and support returnFullObject
        if (onChange) {
          transformedProps[onChangeTo] = (...args: any[]) => {
            let selectedValue: any;

            if (onChangeExtract) {
              // Pass normalizedOptions and current value for multi-select scenarios
              selectedValue = onChangeExtract(...args, normalizedOptions, value);
            } else {
              // Default: assume first arg is event or value
              selectedValue = args[0];
            }

            if (returnFullObject && normalizedOptions) {
              const selectedOpt = normalizedOptions.find(
                (opt) => String(opt.value) === String(selectedValue)
              );
              onChange(selectedOpt?.data);
            } else {
              onChange(selectedValue);
            }
          };
        }

        // Generate children
        const generatedChildren = normalizedOptions.map((opt) => {
          const childProps: Record<string, any> = {
            key: String(opt.value),
            [valueProp]: opt.value,
            disabled: opt.disabled,
          };

          // Add custom props
          if (getProps) {
            Object.assign(childProps, getProps(opt));
          }

          // Determine content
          const content = getContent
            ? getContent(opt, renderOption)
            : renderOption
              ? renderOption(opt)
              : opt.label;

          return React.createElement(OptionComponent, childProps, content);
        });

        // If custom render provided, pass normalizedOptions as helper
        if (render) {
          return render(transformedProps as TProps, NativeComponent, props, { normalizedOptions });
        }

        // Default render with generated children
        return React.createElement(NativeComponent, transformedProps as TProps, generatedChildren);
      }

      // Custom render (no children config)
      if (render) {
        return render(transformedProps as TProps, NativeComponent, props, { normalizedOptions });
      }

      return React.createElement(NativeComponent, transformedProps as TProps);
    }
  );

  LuminoComponent.displayName = `Lumino(${
    (NativeComponent as any).displayName ||
    (NativeComponent as any).name ||
    "Component"
  })`;

  return LuminoComponent as any;
}

/**
 * Create multiple Lumino components at once.
 *
 * @example
 * ```typescript
 * const components = createLuminoComponents({
 *   LuminoInput: [Input, { events: { onChange: { to: "onChange", extract: e => e.target.value } } }],
 *   LuminoCheckbox: [Checkbox, { props: { value: "checked" } }],
 *   LuminoBadge: [Badge],  // No mapping needed
 * });
 * ```
 */
export function createLuminoComponents<
  T extends Record<string, [ComponentType<any>, ComponentMapping?]>
>(components: T): { [K in keyof T]: ComponentType<any> } {
  const result = {} as { [K in keyof T]: ComponentType<any> };

  for (const [name, [Component, mapping]] of Object.entries(components)) {
    (result as any)[name] = createLuminoComponent(Component, mapping || {});
  }

  return result;
}

// =============================================================================
// STRUCTURAL COMPONENT FACTORY
// =============================================================================

/**
 * Lumino standard structural props - The universal interface for structural components.
 */
export interface LuminoStructuralProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
}

// Backwards compatibility alias
export type LuminoLayoutProps = LuminoStructuralProps;

/**
 * Configuration for structural components.
 * Used for Row, Column, Tabs, Dialog, Card, Panel, Table, etc.
 *
 * Structural components differ from field components:
 * - They compose/wrap children in specific ways
 * - They may have Container + Item patterns (Row/Column, Tabs/TabPanel)
 * - Each UI library has different component composition
 */
export interface StructuralMapping<TContainerProps = any, TItemProps = any> {
  /**
   * The main container component from the UI library.
   * Examples: FlexLayout (Salt), Grid (MUI), Row (Ant)
   */
  Container: ComponentType<TContainerProps>;

  /**
   * Optional item/wrapper component for each child.
   * Examples: FlexItem (Salt), Grid item (MUI), Col (Ant)
   * If not provided, children are rendered directly.
   */
  Item?: ComponentType<TItemProps>;

  /**
   * Map Lumino layout props to container props.
   * Receives all original props, returns props for Container.
   */
  containerProps: (props: LuminoLayoutProps & Record<string, any>) => TContainerProps;

  /**
   * Map each child to item wrapper props.
   * Only used when Item is provided.
   *
   * @param child - The child element
   * @param index - Child index
   * @param props - All original props (for accessing layout array, etc.)
   */
  itemProps?: (child: ReactNode, index: number, props: Record<string, any>) => TItemProps;

  /**
   * For components with panels/tabs pattern (Tabs, Accordion).
   * Maps an items array to panel components.
   */
  panels?: {
    /** The panel component (TabPanel, AccordionPanel, etc.) */
    Panel: ComponentType<any>;
    /** Map each item to panel props */
    getPanelProps: (item: any, index: number, props: Record<string, any>) => Record<string, any>;
    /** Optional: how to get panel content (default: children[index]) */
    getContent?: (item: any, index: number, children: ReactNode[], props: Record<string, any>) => ReactNode;
  };

  /**
   * For components with header/content/footer structure (Dialog, Card, Panel).
   * Defines how to compose the internal structure.
   */
  structure?: {
    /** Header component */
    Header?: ComponentType<any>;
    /** Content/body wrapper component */
    Content?: ComponentType<any>;
    /** Footer component */
    Footer?: ComponentType<any>;
    /** Actions container component */
    Actions?: ComponentType<any>;
    /** Map props to header props */
    getHeaderProps?: (props: Record<string, any>) => Record<string, any> | null;
    /** Map props to content props */
    getContentProps?: (props: Record<string, any>) => Record<string, any>;
    /** Map props to footer props */
    getFooterProps?: (props: Record<string, any>) => Record<string, any> | null;
  };

  /**
   * Custom render for complex layouts that don't fit the patterns above.
   * Use as escape hatch when Container+Item or panels don't work.
   */
  render?: (props: LuminoLayoutProps & Record<string, any>) => React.ReactElement;

  /**
   * Display name for debugging.
   */
  displayName?: string;
}

// Backwards compatibility alias
export type LayoutMapping<TContainerProps = any, TItemProps = any> = StructuralMapping<TContainerProps, TItemProps>;

/**
 * Create a Lumino-compatible structural component.
 *
 * Use this for Row, Column, Tabs, Dialog, Card, Panel, Table, etc.
 * These components compose children in specific ways that vary by UI library.
 *
 * @example Row (Container + Item pattern)
 * ```typescript
 * // Salt DS
 * const LuminoRow = createLuminoLayout({
 *   Container: FlexLayout,
 *   Item: FlexItem,
 *   containerProps: ({ gap, className }) => ({
 *     direction: "row",
 *     gap: gap ?? 2,
 *     className,
 *   }),
 *   itemProps: (child, index, { layout }) => ({
 *     grow: layout?.[index] ?? 1,
 *     basis: 0,
 *   }),
 * });
 *
 * // MUI - same Lumino interface, different library
 * const LuminoRow = createLuminoLayout({
 *   Container: Grid,
 *   Item: Grid,
 *   containerProps: ({ gap }) => ({ container: true, spacing: gap ?? 2 }),
 *   itemProps: (child, index, { layout }) => ({ item: true, xs: layout?.[index] ?? true }),
 * });
 * ```
 *
 * @example Tabs (panels pattern)
 * ```typescript
 * const LuminoTabs = createLuminoLayout({
 *   Container: Tabs,
 *   containerProps: ({ activeIndex, onChange }) => ({
 *     activeTabIndex: activeIndex,
 *     onActiveChange: onChange,
 *   }),
 *   panels: {
 *     Panel: TabPanel,
 *     getPanelProps: (item) => ({ key: item.key, label: item.label }),
 *   },
 * });
 * ```
 *
 * @example Dialog (structure pattern)
 * ```typescript
 * const LuminoDialog = createLuminoLayout({
 *   Container: Dialog,
 *   containerProps: ({ open, onClose }) => ({
 *     open,
 *     onOpenChange: (isOpen) => !isOpen && onClose?.(),
 *   }),
 *   structure: {
 *     Header: DialogHeader,
 *     Content: DialogContent,
 *     Footer: DialogActions,
 *     getHeaderProps: ({ title }) => title ? { header: title } : null,
 *     getFooterProps: ({ footer }) => footer ? { children: footer } : null,
 *   },
 * });
 * ```
 */
export function createLuminoStructure(
  mapping: StructuralMapping
): ComponentType<LuminoStructuralProps & Record<string, any>> {
  const {
    Container,
    Item,
    containerProps,
    itemProps,
    panels,
    structure,
    render: customRender,
    displayName,
  } = mapping;

  const LuminoLayout = forwardRef<any, LuminoLayoutProps & Record<string, any>>(
    (props, ref) => {
      const { children } = props;

      // Custom render - full control
      if (customRender) {
        return customRender(props);
      }

      // Get container props
      const cProps: any = { ...containerProps(props), ref };

      // Panels pattern (Tabs, Accordion)
      if (panels) {
        const { Panel, getPanelProps, getContent } = panels;
        const items = (props as any).items || [];
        const childArray = React.Children.toArray(children);

        return React.createElement(
          Container as any,
          cProps,
          items.map((item: any, index: number) => {
            const panelProps = getPanelProps(item, index, props);
            const content = getContent
              ? getContent(item, index, childArray, props)
              : childArray[index] || null;
            return React.createElement(Panel as any, panelProps, content);
          })
        );
      }

      // Structure pattern (Dialog, Card, Panel)
      if (structure) {
        const { Header, Content, Footer, getHeaderProps, getContentProps, getFooterProps } = structure;
        const structureChildren: ReactNode[] = [];

        // Header
        if (Header && getHeaderProps) {
          const headerProps = getHeaderProps(props);
          if (headerProps) {
            structureChildren.push(React.createElement(Header as any, { key: "header", ...headerProps }));
          }
        }

        // Content
        if (Content) {
          const contentProps = getContentProps ? getContentProps(props) : {};
          structureChildren.push(React.createElement(Content as any, { key: "content", ...contentProps }, children));
        } else {
          structureChildren.push(children);
        }

        // Footer/Actions
        if (Footer && getFooterProps) {
          const footerProps = getFooterProps(props);
          if (footerProps) {
            structureChildren.push(React.createElement(Footer as any, { key: "footer", ...footerProps }));
          }
        }

        return React.createElement(Container as any, cProps, structureChildren);
      }

      // Container + Item pattern (Row/Column, Grid)
      if (Item && itemProps) {
        const childArray = React.Children.toArray(children);
        return React.createElement(
          Container as any,
          cProps,
          childArray.map((child, index) => {
            const iProps = itemProps(child, index, props);
            return React.createElement(Item as any, { key: index, ...iProps }, child);
          })
        );
      }

      // Simple container - just wrap children
      return React.createElement(Container as any, cProps, children);
    }
  );

  LuminoLayout.displayName = displayName || `LuminoStructure(${
    (Container as any).displayName || (Container as any).name || "Component"
  })`;

  return LuminoLayout as any;
}

// Backwards compatibility alias
export const createLuminoLayout = createLuminoStructure;
