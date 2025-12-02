/**
 * Lumino Framework - Form Base Class
 *
 * Abstract base class for defining forms with fluent builder pattern.
 * UI-independent - renderers are handled by UI adapters.
 */

import type { ComponentType } from "../types/base";
import type { ValidationRule, ValidationErrors } from "../types/validation";
import type { FormContext } from "../types/context";
import type { BuiltAction } from "../types/action";
import type {
  FieldConfig,
  RowConfig,
  RowComponentConfig,
  SectionConfig,
  FormConfig,
  FormLifecycle,
  FormState,
  PropsFunction,
  LookupFieldConfig,
  DependsOnConfig,
  VisibilityCondition,
  ConditionalHideOptions,
  VisibilityConfig,
  ListConfig,
  ObjectConfig,
  BuiltListConfig,
  BuiltObjectConfig,
  ListActionConfig,
  ListDefaults,
  TableColumnConfig,
  ListDisplayComponent,
  FormTabsConfig,
  FormTabConfig,
  ContainerNodeConfig,
  FormStyle,
  FormCssClass,
} from "../types/form";
import { eventEmitter } from "../events/EventEmitter";

// =============================================================================
// REUSABLE SECTION BASE CLASS
// =============================================================================

/**
 * Base class for creating reusable form sections.
 * Extend this class to create sections that can be used across multiple forms.
 *
 * @example
 * ```typescript
 * // Define a reusable address section
 * class AddressSection extends FormSection {
 *   configure() {
 *     this.addRow()
 *       .addField("street")
 *         .component(SaltTextInput)
 *         .label("Street")
 *         .rules(Validators.required())
 *         .end()
 *       .end();
 *
 *     this.addRow()
 *       .addField("city")
 *         .component(SaltTextInput)
 *         .label("City")
 *         .end()
 *       .addField("state")
 *         .component(SaltTextInput)
 *         .label("State")
 *         .end()
 *       .addField("zipCode")
 *         .component(SaltTextInput)
 *         .label("Zip Code")
 *         .end()
 *       .layout([1, 1, 1])
 *       .end();
 *   }
 * }
 *
 * // Use in forms with different prefixes:
 * class UserForm extends Form<User> {
 *   configure() {
 *     // Permanent address - fields become: permanentAddress.street, permanentAddress.city, etc.
 *     this.include(AddressSection, "permanentAddress", "Permanent Address");
 *
 *     // Current address - fields become: currentAddress.street, currentAddress.city, etc.
 *     this.include(AddressSection, "currentAddress", "Current Address");
 *   }
 * }
 * ```
 */
export abstract class FormSection {
  protected _rows: RowBuilderImpl<FormSection>[] = [];
  protected _title: string = "";
  protected _collapsible: boolean = false;
  protected _collapsed: boolean = false;

  constructor() {
    this.configure();
  }

  /**
   * Override this method to define the section fields
   */
  abstract configure(): void;

  /**
   * Add a row to the section
   */
  protected addRow(): RowBuilderImpl<FormSection> {
    const rowBuilder = new RowBuilderImpl<FormSection>(this);
    this._rows.push(rowBuilder);
    return rowBuilder;
  }

  /**
   * Set section title (can be overridden when using the section)
   */
  protected title(title: string): this {
    this._title = title;
    return this;
  }

  /**
   * Make section collapsible
   */
  protected collapsible(collapsible: boolean = true): this {
    this._collapsible = collapsible;
    return this;
  }

  /**
   * Start section collapsed
   */
  protected collapsed(collapsed: boolean = true): this {
    this._collapsed = collapsed;
    return this;
  }

  /**
   * Get the built rows with an optional field name prefix
   * @internal
   */
  _getRows(prefix?: string): RowConfig[] {
    return this._rows.map((rb) => {
      const config = rb._getConfig();
      if (prefix) {
        // Prefix all field names
        config.fields = config.fields.map((field) => ({
          ...field,
          name: `${prefix}.${field.name}`,
        }));
      }
      return config;
    });
  }

  /**
   * Get section config
   * @internal
   */
  _getConfig(prefix?: string, titleOverride?: string): SectionConfig {
    return {
      title: titleOverride || this._title,
      rows: this._getRows(prefix),
      collapsible: this._collapsible,
      collapsed: this._collapsed,
    };
  }
}

// =============================================================================
// REUSABLE FIELD GROUP BASE CLASS
// =============================================================================

/**
 * Base class for creating reusable field groups.
 * Similar to FormSection but designed for a single row or inline usage.
 *
 * @example
 * ```typescript
 * // Define a reusable name field group
 * class NameFieldGroup extends FieldGroup {
 *   configure() {
 *     this.field("firstName")
 *       .component(SaltTextInput)
 *       .label("First Name")
 *       .rules(Validators.required())
 *       .end();
 *
 *     this.field("lastName")
 *       .component(SaltTextInput)
 *       .label("Last Name")
 *       .rules(Validators.required())
 *       .end();
 *   }
 * }
 *
 * // Use in forms:
 * class EmployeeForm extends Form<Employee> {
 *   configure() {
 *     this.addSection("Employee Info")
 *       .addRow()
 *         // Use the field group with prefix
 *         .useFieldGroup(NameFieldGroup, "employee")  // employee.firstName, employee.lastName
 *         .layout([1, 1])
 *         .end()
 *       .addRow()
 *         .useFieldGroup(NameFieldGroup, "manager")   // manager.firstName, manager.lastName
 *         .layout([1, 1])
 *         .end()
 *       .end();
 *   }
 * }
 * ```
 */
export abstract class FieldGroup {
  protected _fields: FieldConfig[] = [];

  constructor() {
    this.configure();
  }

  /**
   * Override this method to define the fields
   */
  abstract configure(): void;

  /**
   * Add a field to the group
   */
  protected field(name: string): FieldGroupFieldBuilder {
    const builder = new FieldGroupFieldBuilder(name, this);
    return builder;
  }

  /**
   * @internal - Called by FieldGroupFieldBuilder
   */
  _addField(config: FieldConfig): void {
    this._fields.push(config);
  }

  /**
   * Get fields with optional prefix
   * @internal
   */
  _getFields(prefix?: string): FieldConfig[] {
    if (!prefix) {
      return this._fields;
    }
    return this._fields.map((field) => ({
      ...field,
      name: `${prefix}.${field.name}`,
    }));
  }
}

// =============================================================================
// COMPONENT BASE CLASS
// =============================================================================

/**
 * Base class for creating reusable field definitions.
 * Components are simpler than Forms - they only define fields without actions or lifecycle hooks.
 *
 * Use Component when you need:
 * - Reusable field definitions that can be included in lists via include()
 * - Simple field groups without form actions
 * - Building blocks for complex forms
 *
 * Use Form when you need:
 * - Actions (save, cancel, etc.)
 * - Lifecycle hooks (onInit, onFieldChange, etc.)
 * - A standalone form with its own ID
 *
 * @example
 * ```typescript
 * // Define a reusable address component
 * class AddressFields extends Component<Address> {
 *   configure() {
 *     this.addRow()
 *       .addField("type").component(Select).label("Address Type").endField()
 *     .endRow();
 *     this.addRow()
 *       .addField("street").component(TextInput).label("Street Address").endField()
 *     .endRow();
 *     this.addRow()
 *       .addField("city").component(TextInput).label("City").endField()
 *       .addField("state").component(TextInput).label("State").endField()
 *       .layout([1, 1])
 *     .endRow();
 *   }
 * }
 *
 * // Use in a form with addList().include()
 * class EmployeeForm extends Form<Employee> {
 *   configure() {
 *     this.addList<Address>("addresses")
 *       .as(Tabs)
 *       .include(AddressFields)  // Include component fields for each item
 *       .end();
 *   }
 * }
 * ```
 */
/**
 * State configuration for stateful components
 */
export interface ComponentStateConfig<TState = any> {
  /** Initial state values */
  initialState: TState;
  /** Effects to run (similar to useEffect) */
  effects?: Array<{
    /** Effect function - receives state and setState */
    effect: (state: TState, setState: (update: Partial<TState>) => void) => void | (() => void);
    /** Dependencies - effect runs when these state keys change */
    deps?: (keyof TState)[];
  }>;
}

export abstract class Component<TEntity = any, TProps = Record<string, any>, TState = Record<string, any>> {
  protected _rows: RowConfig[] = [];
  protected _containers: ContainerNodeConfig[] = [];
  protected props?: TProps;
  protected _stateConfig?: ComponentStateConfig<TState>;
  protected _renderFn?: (state: TState, setState: (update: Partial<TState>) => void, props: TProps) => void;

  constructor(props?: TProps) {
    this.props = props;
    // Call configure() synchronously so build() can access the rows immediately
    this.configure();
  }

  /**
   * Override this method to define the component fields
   */
  abstract configure(): void;

  /**
   * Add a row to the component
   */
  protected addRow(): ComponentRowBuilder {
    const rowBuilder = new ComponentRowBuilder(this);
    return rowBuilder;
  }

  /**
   * Define how each item in a list should be rendered.
   * Use this when the component is used as a list display (e.g., table rows).
   * The rows defined inside each() will be repeated for each item in the list.
   *
   * @param fieldName - Optional field name to iterate over (for nested arrays).
   *                    If not provided, iterates over the current list context.
   *
   * @example
   * // Iterate over current list (when used with addList().include())
   * this.each()
   *   .addRow()
   *     .addField("name").display().endField()
   *   .endRow()
   * .endEach();
   *
   * @example
   * // Iterate over a nested array field
   * this.each("experiences")
   *   .addRow()
   *     .addField("company").display().endField()
   *   .endRow()
   * .endEach();
   */
  protected each(fieldName?: string): ComponentEachBuilder<TEntity> {
    return new ComponentEachBuilder(this, fieldName);
  }

  /**
   * Create a custom container structure with Lumino abstract components.
   * At render time, abstract components are resolved to adapter-specific implementations.
   *
   * Use this for maximum flexibility in defining custom templates that are
   * UI library independent.
   *
   * @param ContainerComponent - A Lumino abstract container (e.g., LumTable, LumCard)
   *
   * @example
   * ```typescript
   * import { LumTable, LumTHead, LumTBody, LumTR, LumTH, LumTD } from "lumino/react";
   *
   * class ExperienceTable extends Component<Experience> {
   *   configure() {
   *     this.container(LumTable)
   *       .add(LumTHead)
   *         .add(LumTR)
   *           .add(LumTH).text("Company").end()
   *           .add(LumTH).text("Title").end()
   *         .end()
   *       .end()
   *       .add(LumTBody)
   *         .each()
   *           .add(LumTR)
   *             .add(LumTD).field("company").display().end()
   *             .add(LumTD).field("title").display().end()
   *           .end()
   *         .endEach()
   *       .end()
   *     .end();
   *   }
   * }
   * ```
   */
  protected container(ContainerComponent: ComponentType): ContainerBuilder<TEntity> {
    return new ContainerBuilder(this, ContainerComponent);
  }

  /**
   * @internal - Called by ComponentRowBuilder
   */
  _addRow(config: RowConfig): void {
    this._rows.push(config);
  }

  /**
   * Get all rows
   * @internal
   */
  _getRows(): RowConfig[] {
    return this._rows;
  }

  /**
   * Define initial state for this component.
   * Stateful components will be rendered with React hooks to manage state.
   *
   * @param initialState - The initial state values
   * @returns this for chaining
   *
   * @example
   * ```typescript
   * class CodeViewer extends Component<unknown, CodeViewerProps, CodeViewerState> {
   *   configure() {
   *     this.state({ activeTab: 0, isExpanded: false });
   *
   *     this.render((state, setState, props) => {
   *       // Define dynamic UI based on state
   *     });
   *   }
   * }
   * ```
   */
  protected state(initialState: TState): this {
    if (!this._stateConfig) {
      this._stateConfig = { initialState };
    } else {
      this._stateConfig.initialState = initialState;
    }
    return this;
  }

  /**
   * Add an effect that runs when state changes.
   * Similar to React's useEffect, but declaratively defined.
   *
   * @param effectFn - Function to run when dependencies change. Can return a cleanup function.
   * @param deps - State keys to watch. If empty/undefined, runs on every state change.
   * @returns this for chaining
   *
   * @example
   * ```typescript
   * this.state({ count: 0, data: null })
   *   .effect((state, setState) => {
   *     // Runs when count changes
   *     console.log('Count changed:', state.count);
   *   }, ['count'])
   *   .effect((state) => {
   *     // Cleanup effect
   *     const timer = setInterval(() => {}, 1000);
   *     return () => clearInterval(timer);
   *   }, []);
   * ```
   */
  protected effect(
    effectFn: (state: TState, setState: (update: Partial<TState>) => void) => void | (() => void),
    deps?: (keyof TState)[]
  ): this {
    if (!this._stateConfig) {
      this._stateConfig = { initialState: {} as TState };
    }
    if (!this._stateConfig.effects) {
      this._stateConfig.effects = [];
    }
    this._stateConfig.effects.push({ effect: effectFn, deps });
    return this;
  }

  /**
   * Define how to render the component based on state.
   * The render function receives current state, setState function, and props.
   * Inside render, use addRow(), addComponent(), etc. to build the UI dynamically.
   *
   * @param renderFn - Function that builds the component UI based on state
   *
   * @example
   * ```typescript
   * this.state({ activeTab: 0, isExpanded: false })
   *   .render((state, setState, props) => {
   *     this.addRow()
   *       .addComponent(LuminoButton)
   *         .children(state.isExpanded ? 'Hide' : 'Show')
   *         .onClick(() => setState({ isExpanded: !state.isExpanded }))
   *       .endComponent()
   *     .endRow();
   *
   *     if (state.isExpanded) {
   *       // Conditionally render content
   *     }
   *   });
   * ```
   */
  protected render(
    renderFn: (state: TState, setState: (update: Partial<TState>) => void, props: TProps) => void
  ): void {
    this._renderFn = renderFn;
  }

  /**
   * Build the component configuration
   */
  build(): {
    rows: RowConfig[];
    containers?: ContainerNodeConfig[];
    stateConfig?: ComponentStateConfig<TState>;
    renderFn?: (state: TState, setState: (update: Partial<TState>) => void, props: TProps) => void;
    isStateful: boolean;
  } {
    return {
      rows: this._rows,
      containers: this._containers.length > 0 ? this._containers : undefined,
      stateConfig: this._stateConfig,
      renderFn: this._renderFn,
      isStateful: !!this._stateConfig,
    };
  }

  /**
   * @internal - Called by ContainerBuilder
   */
  _addContainer(config: ContainerNodeConfig): void {
    this._containers.push(config);
  }

  /**
   * @internal - Clear rows (used when re-rendering stateful components)
   */
  _clearRows(): void {
    this._rows = [];
  }

  /**
   * @internal - Clear containers (used when re-rendering stateful components)
   */
  _clearContainers(): void {
    this._containers = [];
  }
}

// =============================================================================
// CONTAINER BUILDER CLASSES
// =============================================================================

/**
 * Builder for creating custom container structures with Lumino abstract components.
 * Provides a fluent API for building nested container hierarchies.
 *
 * @example
 * ```typescript
 * this.container(LumTable)
 *   .add(LumTHead)
 *     .add(LumTR)
 *       .add(LumTH).text("Name").end()
 *       .add(LumTH).text("Email").end()
 *     .end()
 *   .end()
 *   .add(LumTBody)
 *     .each()
 *       .add(LumTR)
 *         .add(LumTD).field("name").display().end()
 *         .add(LumTD).field("email").display().end()
 *       .end()
 *     .endEach()
 *   .end()
 * .end();
 * ```
 */
class ContainerBuilder<TEntity = any> {
  private _parent: Component<TEntity, any, any>;
  private _config: ContainerNodeConfig;

  constructor(parent: Component<TEntity, any, any>, component: ComponentType) {
    this._parent = parent;
    this._config = {
      component,
      children: [],
    };
  }

  /**
   * Add a child container/element
   */
  add(component: ComponentType): ContainerChildBuilder<TEntity, ContainerBuilder<TEntity>> {
    return new ContainerChildBuilder(this, component);
  }

  /**
   * Set props for the container
   */
  props(props: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.props = props;
    return this;
  }

  /**
   * Set CSS class (static or dynamic based on form context)
   */
  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  /**
   * Set inline styles (static or dynamic based on form context)
   */
  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  /**
   * Start an each() block for iterating over list items.
   * All children added after each() will be repeated for each item.
   */
  each(fieldName?: string): ContainerEachBuilder<TEntity, ContainerBuilder<TEntity>> {
    return new ContainerEachBuilder(this, fieldName);
  }

  /**
   * @internal - Add child config
   */
  _addChild(child: ContainerNodeConfig): void {
    this._config.children!.push(child);
  }

  /**
   * End container building and return to parent Component
   */
  end(): Component<TEntity> {
    this._parent._addContainer(this._config);
    return this._parent;
  }

  /**
   * @internal - Get the config (for nested builders)
   */
  _getConfig(): ContainerNodeConfig {
    return this._config;
  }
}

/**
 * Builder for child elements within a container.
 * Supports nesting, text content, field binding, and more.
 */
class ContainerChildBuilder<TEntity = any, TParent = any> {
  private _parent: TParent;
  private _config: ContainerNodeConfig;
  private _fieldConfig?: ContainerNodeConfig['field'];

  constructor(parent: TParent, component: ComponentType) {
    this._parent = parent;
    this._config = {
      component,
      children: [],
    };
  }

  /**
   * Add a nested child container/element
   */
  add(component: ComponentType): ContainerChildBuilder<TEntity, ContainerChildBuilder<TEntity, TParent>> {
    return new ContainerChildBuilder(this, component);
  }

  /**
   * Set static text content
   */
  text(content: string): this {
    this._config.text = content;
    return this;
  }

  /**
   * Bind to a field (for data cells)
   */
  field(name: string): this {
    this._fieldConfig = { name };
    return this;
  }

  /**
   * Mark field as display-only (read-only value display)
   */
  display(isDisplay: boolean = true): this {
    if (!this._fieldConfig) {
      throw new Error("field() must be called before display()");
    }
    this._fieldConfig.display = isDisplay;
    return this;
  }

  /**
   * Set component for field rendering
   */
  fieldComponent(component: ComponentType): this {
    if (!this._fieldConfig) {
      throw new Error("field() must be called before fieldComponent()");
    }
    this._fieldConfig.component = component;
    return this;
  }

  /**
   * Set label for field
   */
  label(label: string): this {
    if (!this._fieldConfig) {
      throw new Error("field() must be called before label()");
    }
    this._fieldConfig.label = label;
    return this;
  }

  /**
   * Add validation rules for field
   */
  rules(...rules: ValidationRule[]): this {
    if (!this._fieldConfig) {
      throw new Error("field() must be called before rules()");
    }
    this._fieldConfig.rules = rules;
    return this;
  }

  /**
   * Set props for the element
   */
  props(props: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.props = props;
    return this;
  }

  /**
   * Set props for the field component
   */
  fieldProps(props: Record<string, any>): this {
    if (!this._fieldConfig) {
      throw new Error("field() must be called before fieldProps()");
    }
    this._fieldConfig.props = props;
    return this;
  }

  /**
   * Set CSS class (static or dynamic based on form context)
   */
  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  /**
   * Set inline styles (static or dynamic based on form context)
   */
  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  /**
   * Set click handler
   */
  onClick(handler: (ctx: FormContext) => void | Promise<void>): this {
    this._config.onClick = handler;
    return this;
  }

  /**
   * Hide based on condition
   */
  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  /**
   * Show based on condition
   */
  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  /**
   * Start an each() block for iterating
   */
  each(fieldName?: string): ContainerEachBuilder<TEntity, ContainerChildBuilder<TEntity, TParent>> {
    return new ContainerEachBuilder(this, fieldName);
  }

  /**
   * @internal - Add child config
   */
  _addChild(child: ContainerNodeConfig): void {
    this._config.children!.push(child);
  }

  /**
   * End this child and return to parent
   */
  end(): TParent {
    // Apply field config if set
    if (this._fieldConfig) {
      this._config.field = this._fieldConfig;
    }
    // Add this config to parent
    (this._parent as any)._addChild(this._config);
    return this._parent;
  }

  /**
   * @internal - Get the config
   */
  _getConfig(): ContainerNodeConfig {
    if (this._fieldConfig) {
      this._config.field = this._fieldConfig;
    }
    return this._config;
  }
}

/**
 * Builder for each() blocks within containers.
 * Content defined here is repeated for each item in the list.
 */
class ContainerEachBuilder<TEntity = any, TParent = any> {
  private _parent: TParent;
  private _children: ContainerNodeConfig[] = [];
  private _fieldName?: string;

  constructor(parent: TParent, fieldName?: string) {
    this._parent = parent;
    this._fieldName = fieldName;
  }

  /**
   * Add a child element to be repeated for each item
   */
  add(component: ComponentType): ContainerChildBuilder<TEntity, ContainerEachBuilder<TEntity, TParent>> {
    return new ContainerChildBuilder(this, component);
  }

  /**
   * @internal - Add child config
   */
  _addChild(child: ContainerNodeConfig): void {
    this._children.push(child);
  }

  /**
   * End the each block and return to parent
   */
  endEach(): TParent {
    // Create a wrapper node marked as each
    const eachNode: ContainerNodeConfig = {
      component: null as any, // Virtual node - no actual component
      isEach: true,
      eachFieldName: this._fieldName,
      children: this._children,
    };
    (this._parent as any)._addChild(eachNode);
    return this._parent;
  }
}

/**
 * Builder for defining how each item in a list should be rendered.
 * Used with Component.each() for table/list displays.
 * @internal
 */
class ComponentEachBuilder<TEntity = any> {
  private _parent: Component<TEntity, any, any>;
  private _rows: RowConfig[] = [];
  private _fieldName?: string;

  constructor(parent: Component<TEntity, any, any>, fieldName?: string) {
    this._parent = parent;
    this._fieldName = fieldName;
  }

  /**
   * Add a row for each item
   */
  addRow(): ComponentEachRowBuilder<TEntity> {
    return new ComponentEachRowBuilder(this);
  }

  /**
   * @internal - Called by ComponentEachRowBuilder
   */
  _addRow(config: RowConfig): void {
    this._rows.push(config);
  }

  /**
   * End the each() block and return to parent
   */
  endEach(): Component<TEntity> {
    // Mark these rows as "each" rows - they get repeated for each item
    for (const row of this._rows) {
      row.isEachRow = true;
      row.eachFieldName = this._fieldName; // Store which field to iterate over
      this._parent._addRow(row);
    }
    return this._parent;
  }
}

/**
 * Row builder for ComponentEachBuilder
 * @internal
 */
class ComponentEachRowBuilder<TEntity = any> {
  private _config: RowConfig;
  private _parent: ComponentEachBuilder<TEntity>;
  private _fieldBuilders: EachFieldBuilder<TEntity>[] = [];
  private _componentBuilders: EachComponentBuilder<TEntity>[] = [];

  constructor(parent: ComponentEachBuilder<TEntity>) {
    this._parent = parent;
    this._config = {
      fields: [],
      columns: 12,
    };
  }

  addField(name: string): EachFieldBuilder<TEntity> {
    const fieldBuilder = new EachFieldBuilder<TEntity>(name, this);
    this._fieldBuilders.push(fieldBuilder);
    return fieldBuilder;
  }

  addComponent(component: ComponentType): EachComponentBuilder<TEntity> {
    const compBuilder = new EachComponentBuilder<TEntity>(component, this);
    this._componentBuilders.push(compBuilder);
    return compBuilder;
  }

  layout(layout: number[]): this {
    this._config.layout = layout;
    return this;
  }

  columns(columns: number): this {
    this._config.columns = columns;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  endRow(): ComponentEachBuilder<TEntity> {
    // Collect field configs
    this._config.fields = this._fieldBuilders.map((fb) => fb._getConfig());
    // Collect component configs
    this._config.components = this._componentBuilders.map((cb) => cb._getConfig());
    this._parent._addRow(this._config);
    return this._parent;
  }
}

/**
 * Field builder for ComponentEachRowBuilder (each() context)
 * @internal
 */
class EachFieldBuilder<TEntity = any> {
  private _config: FieldConfig;
  private _parent: ComponentEachRowBuilder<TEntity>;

  constructor(name: string, parent: ComponentEachRowBuilder<TEntity>) {
    this._parent = parent;
    this._config = {
      name,
      component: null as any,
      label: "",
      placeholder: "",
      rules: [],
      props: {},
      disable: false,
      readOnly: false,
    };
  }

  component(comp: ComponentType): this {
    this._config.component = comp;
    return this;
  }

  label(label: string): this {
    this._config.label = label;
    return this;
  }

  placeholder(placeholder: string): this {
    this._config.placeholder = placeholder;
    return this;
  }

  rules(...rules: ValidationRule[]): this {
    this._config.rules.push(...rules);
    return this;
  }

  required(message?: string): this {
    this._config.rules.push({
      type: "required",
      message: message || "This field is required",
      validate: (value: any) => {
        // Check for empty values: null, undefined, empty string, empty array
        if (value === null || value === undefined) return false;
        if (typeof value === "string") return value.trim() !== "";
        if (Array.isArray(value)) return value.length > 0;
        return true;
      },
    });
    return this;
  }

  props(props: Record<string, any> | PropsFunction): this {
    this._config.props = props;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  disable(condition: VisibilityCondition): this {
    this._config.disable = condition;
    return this;
  }

  readOnly(condition: VisibilityCondition): this {
    this._config.readOnly = condition;
    return this;
  }

  /**
   * Mark field as display-only (shows value without input component).
   * Used for table/list views where data is shown but not edited inline.
   */
  display(isDisplay: boolean = true): this {
    this._config.display = isDisplay;
    return this;
  }

  colSpan(span: number): this {
    this._config.colSpan = span;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  end(): ComponentEachRowBuilder<TEntity> {
    return this._parent;
  }

  endField(): ComponentEachRowBuilder<TEntity> {
    return this._parent;
  }

  _getConfig(): FieldConfig {
    return this._config;
  }
}

/**
 * Component builder for ComponentEachRowBuilder (each() context)
 * @internal
 */
class EachComponentBuilder<TEntity = any> {
  private _config: RowComponentConfig;
  private _parent: ComponentEachRowBuilder<TEntity>;

  constructor(component: ComponentType, parent: ComponentEachRowBuilder<TEntity>) {
    this._parent = parent;
    this._config = {
      component,
    };
  }

  props(props: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.props = props;
    return this;
  }

  children(children: React.ReactNode | string): this {
    this._config.children = children;
    return this;
  }

  onClick(handler: (ctx: FormContext) => void | Promise<void>): this {
    this._config.onClick = handler;
    return this;
  }

  colSpan(span: number): this {
    this._config.colSpan = span;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  end(): ComponentEachRowBuilder<TEntity> {
    return this._parent;
  }

  endComponent(): ComponentEachRowBuilder<TEntity> {
    return this._parent;
  }

  _getConfig(): RowComponentConfig {
    return this._config;
  }
}

/**
 * Row builder for Component
 * @internal
 */
class ComponentRowBuilder {
  private _config: RowConfig;
  private _parent: Component<any, any, any>;
  private _fieldBuilders: ComponentFieldBuilder[] = [];
  private _componentBuilders: ComponentComponentBuilder[] = [];

  constructor(parent: Component<any, any, any>) {
    this._parent = parent;
    this._config = {
      fields: [],
      columns: 12,
      gap: 16,
    };
  }

  addField(name: string): ComponentFieldBuilder {
    const fieldBuilder = new ComponentFieldBuilder(name, this);
    this._fieldBuilders.push(fieldBuilder);
    return fieldBuilder;
  }

  /**
   * Add a standalone component (e.g., Button) to this row
   */
  addComponent(component: ComponentType): ComponentComponentBuilder {
    const componentBuilder = new ComponentComponentBuilder(component, this);
    this._componentBuilders.push(componentBuilder);
    return componentBuilder;
  }

  layout(spans: number[]): this {
    this._config.layout = spans;
    return this;
  }

  columns(count: number): this {
    this._config.columns = count;
    return this;
  }

  gap(gap: number): this {
    this._config.gap = gap;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  wrapper(component: ComponentType): this {
    this._config.wrapper = component;
    return this;
  }

  end(): Component<any> {
    this._config.fields = this._fieldBuilders.map((fb) => fb._getConfig());
    this._config.components = this._componentBuilders.map((cb) => cb._getConfig());
    this._parent._addRow(this._config);
    return this._parent;
  }

  endRow(): Component<any> {
    return this.end();
  }
}

/**
 * Component builder for Component rows
 * @internal
 */
class ComponentComponentBuilder {
  private _config: RowComponentConfig;
  private _parent: ComponentRowBuilder;

  constructor(component: ComponentType, parent: ComponentRowBuilder) {
    this._parent = parent;
    this._config = {
      component,
    };
  }

  /**
   * Set props to pass to the component
   */
  props(props: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.props = props;
    return this;
  }

  /**
   * Set children/content for the component (e.g., button label)
   */
  children(children: React.ReactNode | string): this {
    this._config.children = children;
    return this;
  }

  /**
   * Set click handler - receives form context
   */
  onClick(handler: (ctx: FormContext) => void | Promise<void>): this {
    this._config.onClick = handler;
    return this;
  }

  /**
   * Set column span in the row layout
   */
  colSpan(span: number): this {
    this._config.colSpan = span;
    return this;
  }

  /**
   * Conditional hide - hide component based on form data/condition
   */
  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  /**
   * Conditional show - show component based on form data/condition
   */
  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  /**
   * Set additional CSS class (static or dynamic based on form context)
   */
  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  /**
   * Set inline styles (static or dynamic based on form context)
   */
  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  /**
   * End component builder and return to row
   */
  end(): ComponentRowBuilder {
    return this._parent;
  }

  /**
   * Alias for end()
   */
  endComponent(): ComponentRowBuilder {
    return this._parent;
  }

  _getConfig(): RowComponentConfig {
    return this._config;
  }
}

/**
 * Field builder for Component
 * @internal
 */
class ComponentFieldBuilder {
  private _config: FieldConfig;
  private _parent: ComponentRowBuilder;

  constructor(name: string, parent: ComponentRowBuilder) {
    this._parent = parent;
    this._config = {
      name,
      component: null as any,
      label: "",
      placeholder: "",
      rules: [],
      props: {},
      disable: false,
      readOnly: false,
    };
  }

  component(comp: ComponentType): this {
    this._config.component = comp;
    return this;
  }

  label(label: string): this {
    this._config.label = label;
    return this;
  }

  placeholder(placeholder: string): this {
    this._config.placeholder = placeholder;
    return this;
  }

  rules(...rules: ValidationRule[]): this {
    this._config.rules.push(...rules);
    return this;
  }

  /**
   * Mark field as required (adds required validation rule)
   */
  required(message?: string): this {
    this._config.rules.push({
      type: "required",
      message: message || "This field is required",
      validate: (value: any) => {
        // Check for empty values: null, undefined, empty string, empty array
        if (value === null || value === undefined) return false;
        if (typeof value === "string") return value.trim() !== "";
        if (Array.isArray(value)) return value.length > 0;
        return true;
      },
    });
    return this;
  }

  props(props: Record<string, any> | PropsFunction): this {
    this._config.props = props;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  disable(condition: VisibilityCondition): this {
    this._config.disable = condition;
    return this;
  }

  readOnly(condition: VisibilityCondition): this {
    this._config.readOnly = condition;
    return this;
  }

  /**
   * Mark field as display-only (shows value without input component).
   * Used for table/list views where data is shown but not edited inline.
   */
  display(isDisplay: boolean = true): this {
    this._config.display = isDisplay;
    return this;
  }

  colSpan(span: number): this {
    this._config.colSpan = span;
    return this;
  }

  lookup(config: LookupFieldConfig): this {
    this._config.lookup = config;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  wrapper(component: ComponentType): this {
    this._config.wrapper = component;
    return this;
  }

  end(): ComponentRowBuilder {
    return this._parent;
  }

  endField(): ComponentRowBuilder {
    return this._parent;
  }

  _getConfig(): FieldConfig {
    return this._config;
  }
}

/**
 * Field builder for FieldGroup
 * @internal
 */
class FieldGroupFieldBuilder {
  private _config: FieldConfig;
  private _parent: FieldGroup;

  constructor(name: string, parent: FieldGroup) {
    this._parent = parent;
    this._config = {
      name,
      component: null as any,
      label: "",
      placeholder: "",
      rules: [],
      props: {},
      disable: false,
      readOnly: false,
    };
  }

  component(comp: ComponentType): this {
    this._config.component = comp;
    return this;
  }

  label(label: string): this {
    this._config.label = label;
    return this;
  }

  placeholder(placeholder: string): this {
    this._config.placeholder = placeholder;
    return this;
  }

  rules(...rules: ValidationRule[]): this {
    this._config.rules.push(...rules);
    return this;
  }

  props(props: Record<string, any> | PropsFunction): this {
    this._config.props = props;
    return this;
  }

  lookup(config: LookupFieldConfig): this {
    this._config.lookup = config;
    return this;
  }

  disable(condition: VisibilityCondition): this {
    this._config.disable = condition;
    return this;
  }

  readOnly(condition: VisibilityCondition): this {
    this._config.readOnly = condition;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  end(): FieldGroup {
    this._parent._addField(this._config);
    return this._parent;
  }
}

// =============================================================================
// FIELD BUILDER IMPLEMENTATION
// =============================================================================

class FieldBuilderImpl<TParent> {
  private _config: FieldConfig;
  private _parent: TParent;

  constructor(name: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      name,
      component: null as any,
      label: "",
      placeholder: "",
      rules: [],
      props: {},
      disable: false,
      readOnly: false,
    };
  }

  component(comp: ComponentType): this {
    this._config.component = comp;
    return this;
  }

  label(label: string): this {
    this._config.label = label;
    return this;
  }

  placeholder(placeholder: string): this {
    this._config.placeholder = placeholder;
    return this;
  }

  rules(...rules: ValidationRule[]): this {
    this._config.rules.push(...rules);
    return this;
  }

  props(props: Record<string, any> | PropsFunction): this {
    this._config.props = props;
    return this;
  }

  /**
   * Conditional hide - hide field based on form data/condition.
   * - NOT rendered in DOM
   * - Data is CLEARED when hidden
   * - Validation is SKIPPED
   */
  hideByCondition(condition: VisibilityCondition, options?: ConditionalHideOptions): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    if (options) {
      this._config.visibility.conditionalOptions = options;
    }
    return this;
  }

  /**
   * Conditional show - show field based on form data/condition.
   * - Data is CLEARED when hidden
   * - Validation is SKIPPED when hidden
   */
  visibleByCondition(condition: VisibilityCondition, options?: ConditionalHideOptions): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    if (options) {
      this._config.visibility.conditionalOptions = options;
    }
    return this;
  }

  /**
   * Access-based hide - hide field based on permissions/role.
   * - Data is PRESERVED (not cleared)
   * - Validation IS PERFORMED
   */
  hideByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hideByAccess = condition;
    return this;
  }

  /**
   * Access-based show - show field based on permissions/role.
   * - Data is PRESERVED
   * - Validation IS PERFORMED
   */
  visibleByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visibleByAccess = condition;
    return this;
  }

  /**
   * Condition to disable field.
   * When true, field is greyed out but validation IS performed.
   */
  disable(condition: VisibilityCondition): this {
    this._config.disable = condition;
    return this;
  }

  readOnly(condition: VisibilityCondition): this {
    this._config.readOnly = condition;
    return this;
  }

  /**
   * Set field type - use "hidden" for hidden inputs.
   * Hidden inputs ARE in DOM and validation IS performed.
   */
  type(fieldType: "hidden" | string): this {
    this._config.type = fieldType;
    return this;
  }

  colSpan(span: number): this {
    this._config.colSpan = span;
    return this;
  }

  group(groupId: string): this {
    this._config.groupId = groupId;
    return this;
  }

  lookup(config: LookupFieldConfig): this {
    this._config.lookup = config;
    return this;
  }

  dependsOn(fields: string | string[], config: DependsOnConfig): this {
    if (!this._config.dependsOn) {
      this._config.dependsOn = new Map();
    }
    // Normalize to array key for consistent lookup
    const key = Array.isArray(fields) ? fields : [fields];
    this._config.dependsOn.set(key.join(","), config);
    return this;
  }

  margin(spacing: { top?: number; right?: number; bottom?: number; left?: number }): this {
    this._config.margin = spacing;
    return this;
  }

  padding(spacing: { top?: number; right?: number; bottom?: number; left?: number }): this {
    this._config.padding = spacing;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  wrapper(component: ComponentType): this {
    this._config.wrapper = component;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  /**
   * Explicit end method for field - returns to parent row.
   * Alias for end() with more descriptive name.
   */
  endField(): TParent {
    return this._parent;
  }

  _getConfig(): FieldConfig {
    return this._config;
  }
}

// =============================================================================
// ROW BUILDER IMPLEMENTATION
// =============================================================================

class RowBuilderImpl<TParent> {
  private _config: RowConfig;
  private _parent: TParent;
  private _fieldBuilders: FieldBuilderImpl<RowBuilderImpl<TParent>>[] = [];
  private _componentBuilders: RowComponentBuilderImpl<RowBuilderImpl<TParent>>[] = [];

  constructor(parent: TParent) {
    this._parent = parent;
    this._config = {
      fields: [],
      columns: 12,
      gap: 2,  // Salt uses multiplier, so 2 = 16px (2 * 8px base)
    };
  }

  addField(name: string): FieldBuilderImpl<RowBuilderImpl<TParent>> {
    const fieldBuilder = new FieldBuilderImpl<RowBuilderImpl<TParent>>(name, this);
    this._fieldBuilders.push(fieldBuilder);
    return fieldBuilder;
  }

  /**
   * Add a standalone component to the row (button, custom element, etc.).
   * Unlike fields, components don't bind to form data - they render UI with callbacks.
   *
   * @example
   * ```typescript
   * this.addRow()
   *   .addComponent(Button)
   *     .props({ variant: "secondary" })
   *     .children("+ Add Address")
   *     .onClick((ctx) => ctx.list("addresses").add(new Address()))
   *     .endComponent()
   *   .endRow();
   * ```
   */
  addComponent(component: ComponentType): RowComponentBuilderImpl<RowBuilderImpl<TParent>> {
    const componentBuilder = new RowComponentBuilderImpl<RowBuilderImpl<TParent>>(component, this);
    this._componentBuilders.push(componentBuilder);
    return componentBuilder;
  }

  layout(spans: number[]): this {
    this._config.layout = spans;
    return this;
  }

  columns(count: number): this {
    this._config.columns = count;
    return this;
  }

  gap(gap: number): this {
    this._config.gap = gap;
    return this;
  }

  /**
   * Conditional hide - hide row based on form data/condition.
   * When hidden: field data CLEARED, validation SKIPPED.
   */
  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  /**
   * Conditional show - show row based on form data/condition.
   * When hidden: field data CLEARED, validation SKIPPED.
   */
  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  /**
   * Access-based hide - hide row based on permissions/role.
   * When hidden: field data PRESERVED, validation PERFORMED.
   */
  hideByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hideByAccess = condition;
    return this;
  }

  /**
   * Access-based show - show row based on permissions/role.
   * When hidden: field data PRESERVED, validation PERFORMED.
   */
  visibleByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visibleByAccess = condition;
    return this;
  }

  margin(spacing: { top?: number; right?: number; bottom?: number; left?: number }): this {
    this._config.margin = spacing;
    return this;
  }

  padding(spacing: { top?: number; right?: number; bottom?: number; left?: number }): this {
    this._config.padding = spacing;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  wrapper(component: ComponentType): this {
    this._config.wrapper = component;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  /**
   * Explicit end method for row - returns to parent section.
   * Alias for end() with more descriptive name.
   */
  endRow(): TParent {
    return this._parent;
  }

  _getConfig(): RowConfig {
    this._config.fields = this._fieldBuilders.map((fb) => fb._getConfig());
    if (this._componentBuilders.length > 0) {
      this._config.components = this._componentBuilders.map((cb) => cb._getConfig());
    }
    return this._config;
  }
}

// =============================================================================
// ROW COMPONENT BUILDER IMPLEMENTATION
// =============================================================================

/**
 * Builder for standalone components in a row (buttons, custom elements).
 * @internal
 */
class RowComponentBuilderImpl<TParent> {
  private _config: RowComponentConfig;
  private _parent: TParent;

  constructor(component: ComponentType, parent: TParent) {
    this._parent = parent;
    this._config = {
      component,
    };
  }

  /**
   * Set props to pass to the component
   */
  props(props: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.props = props;
    return this;
  }

  /**
   * Set children/content for the component (e.g., button label)
   */
  children(children: React.ReactNode | string): this {
    this._config.children = children;
    return this;
  }

  /**
   * Set click handler - receives form context
   */
  onClick(handler: (ctx: FormContext) => void | Promise<void>): this {
    this._config.onClick = handler;
    return this;
  }

  /**
   * Set column span in the row layout
   */
  colSpan(span: number): this {
    this._config.colSpan = span;
    return this;
  }

  /**
   * Conditional hide - hide component based on form data/condition
   */
  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  /**
   * Conditional show - show component based on form data/condition
   */
  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  /**
   * Set additional CSS class (static or dynamic based on form context)
   */
  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  /**
   * Set inline styles (static or dynamic based on form context)
   */
  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  /**
   * End component builder and return to row
   */
  end(): TParent {
    return this._parent;
  }

  /**
   * Alias for end()
   */
  endComponent(): TParent {
    return this._parent;
  }

  _getConfig(): RowComponentConfig {
    return this._config;
  }
}

// =============================================================================
// SECTION BUILDER IMPLEMENTATION
// =============================================================================

class SectionBuilderImpl<TParent> {
  private _config: SectionConfig;
  private _parent: TParent;
  private _rowBuilders: RowBuilderImpl<SectionBuilderImpl<TParent>>[] = [];
  private _headerComponentBuilders: RowComponentBuilderImpl<SectionBuilderImpl<TParent>>[] = [];
  private _headerRowBuilder: RowBuilderImpl<SectionBuilderImpl<TParent>> | null = null;

  constructor(title: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      title,
      rows: [],
      collapsible: false,
      collapsed: false,
    };
  }

  addRow(): RowBuilderImpl<SectionBuilderImpl<TParent>> {
    const rowBuilder = new RowBuilderImpl<SectionBuilderImpl<TParent>>(this);
    this._rowBuilders.push(rowBuilder);
    return rowBuilder;
  }

  /**
   * Configure the section header row with full layout control.
   * The title is automatically the first column. Add components for additional columns.
   * Use layout() to control column widths.
   *
   * @example
   * ```typescript
   * this.addSection("Addresses")
   *   .headerRow()
   *     .addComponent(Button).children("+ Add").onClick(...).endComponent()
   *     .addComponent(Button).children("Import").onClick(...).endComponent()
   *     .layout([8, 2, 2])  // Title takes 8, buttons take 2 each
   *     .endRow()
   *   .endSection();
   * ```
   */
  headerRow(): RowBuilderImpl<SectionBuilderImpl<TParent>> {
    if (!this._headerRowBuilder) {
      this._headerRowBuilder = new RowBuilderImpl<SectionBuilderImpl<TParent>>(this);
    }
    return this._headerRowBuilder;
  }

  /**
   * Add a component to the section header (right side of title).
   * Use for buttons, icons, or custom elements next to the section title.
   * For more layout control, use headerRow() instead.
   *
   * @example
   * ```typescript
   * this.addSection("Addresses")
   *   .addComponent(Button)
   *     .children("+ Add Address")
   *     .onClick((ctx) => ctx.list("addresses").add(new Address()))
   *     .endComponent()
   *   .endSection();
   * ```
   */
  addComponent(component: ComponentType): RowComponentBuilderImpl<SectionBuilderImpl<TParent>> {
    const componentBuilder = new RowComponentBuilderImpl<SectionBuilderImpl<TParent>>(component, this);
    this._headerComponentBuilders.push(componentBuilder);
    return componentBuilder;
  }

  collapsible(collapsible: boolean = true): this {
    this._config.collapsible = collapsible;
    return this;
  }

  collapsed(collapsed: boolean = true): this {
    this._config.collapsed = collapsed;
    return this;
  }

  /**
   * Conditional hide - hide section based on form data/condition.
   * When hidden: field data CLEARED, validation SKIPPED.
   */
  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  /**
   * Conditional show - show section based on form data/condition.
   * When hidden: field data CLEARED, validation SKIPPED.
   */
  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  /**
   * Access-based hide - hide section based on permissions/role.
   * When hidden: field data PRESERVED, validation PERFORMED.
   */
  hideByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hideByAccess = condition;
    return this;
  }

  /**
   * Access-based show - show section based on permissions/role.
   * When hidden: field data PRESERVED, validation PERFORMED.
   */
  visibleByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visibleByAccess = condition;
    return this;
  }

  gap(gap: number): this {
    this._config.gap = gap;
    return this;
  }

  margin(spacing: { top?: number; right?: number; bottom?: number; left?: number }): this {
    this._config.margin = spacing;
    return this;
  }

  padding(spacing: { top?: number; right?: number; bottom?: number; left?: number }): this {
    this._config.padding = spacing;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  wrapper(component: ComponentType): this {
    this._config.wrapper = component;
    return this;
  }

  /**
   * Add an action button to the section header.
   * The action must be defined on the form via addAction().
   *
   * @example
   * ```typescript
   * this.addSection("Addresses")
   *   .action("addAddress")  // Button appears in section header
   *   .endSection();
   *
   * this.addAction("addAddress", new Action<Employee>()
   *   .label("+ Add Address")
   *   .handler((ctx) => ctx.list("addresses").add(new Address()))
   *   .build()
   * );
   * ```
   */
  action(actionName: string): this {
    if (!this._config.actions) {
      this._config.actions = [];
    }
    this._config.actions.push(actionName);
    return this;
  }

  /**
   * Set a unique ID for this section.
   * Used for targeting lists to render after this section.
   *
   * @example
   * ```typescript
   * this.addSection("Addresses")
   *   .id("addresses-section")
   *   .addComponent(Button).children("+ Add").onClick(...).endComponent()
   *   .endSection();
   *
   * this.addList<Address>("addresses")
   *   .target("addresses-section")  // Renders after the section with this ID
   *   .as(Tabs)
   *   .end();
   * ```
   */
  id(sectionId: string): this {
    this._config.id = sectionId;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  /**
   * Explicit end method for section - returns to parent form.
   * Alias for end() with more descriptive name.
   */
  endSection(): TParent {
    return this._parent;
  }

  _getConfig(): SectionConfig {
    this._config.rows = this._rowBuilders.map((rb) => rb._getConfig());
    // Collect header components (simple approach)
    if (this._headerComponentBuilders.length > 0) {
      this._config.headerComponents = this._headerComponentBuilders.map((cb) => cb._getConfig());
    }
    // Collect header row (advanced layout approach)
    if (this._headerRowBuilder) {
      this._config.headerRow = this._headerRowBuilder._getConfig();
    }
    return this._config;
  }
}

// =============================================================================
// FORM TAB BUILDER IMPLEMENTATION
// =============================================================================

class FormTabBuilderImpl<TParent> {
  private _config: FormTabConfig;
  private _parent: TParent;
  private _sectionBuilders: SectionBuilderImpl<FormTabBuilderImpl<TParent>>[] = [];
  private _formClass: (new (...args: any[]) => Form<any>) | null = null;

  constructor(id: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      id,
      label: id,
      sections: [],
    };
  }

  label(label: string | ((ctx: FormContext) => string)): this {
    this._config.label = label;
    return this;
  }

  icon(icon: any): this {
    this._config.icon = icon;
    return this;
  }

  /**
   * Use a separate Form class for this tab's content.
   * This allows defining tab content as a reusable Form.
   *
   * @example
   * ```typescript
   * class AddressForm extends Form<Address> {
   *   configure() {
   *     this.addSection("")
   *       .addRow()
   *         .addField("street").label("Street").endField()
   *       .endRow()
   *     .endSection();
   *   }
   * }
   *
   * // In parent form:
   * this.addTabs("info")
   *   .tab("address")
   *     .label("Address")
   *     .form(AddressForm)  // Use AddressForm for this tab
   *   .endTab()
   * ```
   */
  form(formClass: new (...args: any[]) => Form<any>): this {
    this._formClass = formClass;
    return this;
  }

  addSection(title: string): SectionBuilderImpl<FormTabBuilderImpl<TParent>> {
    const sectionBuilder = new SectionBuilderImpl<FormTabBuilderImpl<TParent>>(title, this);
    this._sectionBuilders.push(sectionBuilder);
    return sectionBuilder;
  }

  disabled(condition: boolean | ((ctx: FormContext) => boolean)): this {
    this._config.disabled = condition;
    return this;
  }

  badge(content: string | number | ((ctx: FormContext) => string | number | undefined)): this {
    this._config.badge = content;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  endTab(): TParent {
    return this._parent;
  }

  _getConfig(): FormTabConfig {
    // If a form class is specified, get sections from that form
    if (this._formClass) {
      const formInstance = new this._formClass();
      const formConfig = formInstance.build();
      this._config.sections = formConfig.sections;
      this._config.formClass = this._formClass;
    } else {
      this._config.sections = this._sectionBuilders.map((sb) => sb._getConfig());
    }
    return this._config;
  }
}

// =============================================================================
// FORM TABS BUILDER IMPLEMENTATION
// =============================================================================

class FormTabsBuilderImpl<TParent> {
  private _config: FormTabsConfig;
  private _parent: TParent;
  private _tabBuilders: FormTabBuilderImpl<FormTabsBuilderImpl<TParent>>[] = [];

  constructor(id: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      id,
      tabs: [],
      position: "top",
    };
  }

  tab(id: string): FormTabBuilderImpl<FormTabsBuilderImpl<TParent>> {
    const tabBuilder = new FormTabBuilderImpl<FormTabsBuilderImpl<TParent>>(id, this);
    this._tabBuilders.push(tabBuilder);
    return tabBuilder;
  }

  position(pos: "top" | "bottom" | "left" | "right"): this {
    this._config.position = pos;
    return this;
  }

  initialTab(tabId: string | number): this {
    this._config.initialTab = tabId;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  endTabs(): TParent {
    return this._parent;
  }

  _getConfig(): FormTabsConfig {
    this._config.tabs = this._tabBuilders.map((tb) => tb._getConfig());
    return this._config;
  }
}

// =============================================================================
// OBJECT BUILDER IMPLEMENTATION
// =============================================================================

class ObjectBuilderImpl<TParent> {
  private _config: BuiltObjectConfig;
  private _parent: TParent;
  private _rowBuilders: RowBuilderImpl<ObjectBuilderImpl<TParent>>[] = [];
  private _nestedObjects: Map<string, ObjectBuilderImpl<ObjectBuilderImpl<TParent>>> = new Map();
  private _nestedLists: Map<string, ListBuilderImpl<ObjectBuilderImpl<TParent>, any>> = new Map();
  private _basePath: string;

  constructor(name: string, parent: TParent, basePath: string = "", config?: ObjectConfig) {
    this._parent = parent;
    this._basePath = basePath ? `${basePath}.${name}` : name;
    this._config = {
      id: name,
      rows: [],
      ...config,
    };
  }

  addRow(): RowBuilderImpl<ObjectBuilderImpl<TParent>> {
    const rowBuilder = new RowBuilderImpl<ObjectBuilderImpl<TParent>>(this);
    this._rowBuilders.push(rowBuilder);
    return rowBuilder;
  }

  addObject(name: string, config?: ObjectConfig): ObjectBuilderImpl<ObjectBuilderImpl<TParent>> {
    const objectBuilder = new ObjectBuilderImpl<ObjectBuilderImpl<TParent>>(
      name,
      this,
      this._basePath,
      config
    );
    this._nestedObjects.set(name, objectBuilder);
    return objectBuilder;
  }

  addList<T = Record<string, any>>(name: string, config?: ListConfig<T>): ListBuilderImpl<ObjectBuilderImpl<TParent>, T> {
    const listBuilder = new ListBuilderImpl<ObjectBuilderImpl<TParent>, T>(
      name,
      this,
      this._basePath,
      config
    );
    this._nestedLists.set(name, listBuilder);
    return listBuilder;
  }

  collapsible(collapsible: boolean = true): this {
    this._config.collapsible = collapsible;
    return this;
  }

  collapsed(collapsed: boolean = true): this {
    this._config.collapsed = collapsed;
    return this;
  }

  title(title: string): this {
    this._config.title = title;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  hideByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hideByAccess = condition;
    return this;
  }

  visibleByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visibleByAccess = condition;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  wrapper(component: ComponentType): this {
    this._config.wrapper = component;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  _getConfig(): BuiltObjectConfig {
    this._config.rows = this._rowBuilders.map((rb) => rb._getConfig());
    return this._config;
  }

  _getNestedObjects(): Map<string, ObjectBuilderImpl<ObjectBuilderImpl<TParent>>> {
    return this._nestedObjects;
  }

  _getNestedLists(): Map<string, ListBuilderImpl<ObjectBuilderImpl<TParent>, any>> {
    return this._nestedLists;
  }

  _getBasePath(): string {
    return this._basePath;
  }
}

// =============================================================================
// LIST BUILDER IMPLEMENTATION
// =============================================================================

class ListBuilderImpl<TParent, T = Record<string, any>> {
  private _config: BuiltListConfig<T>;
  private _parent: TParent;
  private _rowBuilders: RowBuilderImpl<ListBuilderImpl<TParent, T>>[] = [];
  private _includedRows: RowConfig[] = [];  // Rows included directly (not via builder)
  private _includedContainers: ContainerNodeConfig[] = [];  // Containers from Component.container()
  private _nestedObjects: Map<string, ObjectBuilderImpl<ListBuilderImpl<TParent, T>>> = new Map();
  private _nestedLists: Map<string, ListBuilderImpl<ListBuilderImpl<TParent, T>, any>> = new Map();
  private _basePath: string;
  /** Auto-assigned target from the last section (can be overridden by explicit target()) */
  private _autoTarget: string | undefined;
  /** Whether target() was explicitly called (overrides auto-target) */
  private _explicitTarget: boolean = false;

  constructor(name: string, parent: TParent, basePath: string = "", config?: ListConfig<T>) {
    this._parent = parent;
    this._basePath = basePath ? `${basePath}.${name}` : name;
    this._config = {
      id: name,
      rows: [],
      ...config,
    };
  }

  addRow(): RowBuilderImpl<ListBuilderImpl<TParent, T>> {
    const rowBuilder = new RowBuilderImpl<ListBuilderImpl<TParent, T>>(this);
    this._rowBuilders.push(rowBuilder);
    return rowBuilder;
  }

  addObject(name: string, config?: ObjectConfig): ObjectBuilderImpl<ListBuilderImpl<TParent, T>> {
    const objectBuilder = new ObjectBuilderImpl<ListBuilderImpl<TParent, T>>(
      name,
      this,
      "", // List items don't need basePath prefix for their fields
      config
    );
    this._nestedObjects.set(name, objectBuilder);
    return objectBuilder;
  }

  addList<U = Record<string, any>>(name: string, config?: ListConfig<U>): ListBuilderImpl<ListBuilderImpl<TParent, T>, U> {
    const listBuilder = new ListBuilderImpl<ListBuilderImpl<TParent, T>, U>(
      name,
      this,
      "", // Nested lists don't need basePath prefix
      config
    );
    this._nestedLists.set(name, listBuilder);
    return listBuilder;
  }

  min(count: number): this {
    this._config.min = count;
    return this;
  }

  max(count: number): this {
    this._config.max = count;
    return this;
  }

  as(component: ListDisplayComponent): this {
    this._config.as = component;
    return this;
  }

  /**
   * Set props to pass to the display component.
   * Can be static object or function that receives context.
   * Available in the component via props.options.
   */
  displayProps(props: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.displayProps = props;
    return this;
  }

  defaults(values: ListDefaults<T>): this {
    this._config.defaults = values;
    return this;
  }

  tabLabel(labelFn: string | ((item: T, index: number, ctx: FormContext) => string)): this {
    this._config.tabLabel = labelFn;
    return this;
  }

  tableColumns(columns: TableColumnConfig[]): this {
    this._config.tableColumns = columns;
    return this;
  }

  /**
   * Use a separate Form class for each list item.
   * When displaying as Tabs, each tab will render this form.
   *
   * @example
   * ```typescript
   * this.addList<Address>("addresses")
   *   .as(Tabs)
   *   .itemForm(AddressForm)  // Each tab renders AddressForm
   *   .tabLabel((addr) => addr.type)
   *   .end();
   * ```
   */
  itemForm(formClass: new (...args: any[]) => Form<T>): this {
    this._config.itemFormClass = formClass;
    return this;
  }

  /**
   * Use a React component to render each list item.
   * Simpler alternative to itemForm - just pass a component.
   *
   * @example
   * ```typescript
   * this.addList<Address>("addresses")
   *   .as(Tabs)
   *   .component(AddressFields)  // React component for each tab
   *   .tabLabel((addr) => addr.type)
   *   .end();
   * ```
   */
  component(itemComponent: ComponentType): this {
    this._config.itemComponent = itemComponent;
    return this;
  }

  /**
   * Use a Form class in a dialog for add/edit operations.
   * When specified, add/edit actions open a dialog with this form.
   * The display component (Table, custom) shows the list, dialog handles editing.
   *
   * @example
   * ```typescript
   * this.addList<Experience>("experiences")
   *   .as(ExperienceTable)  // Custom table display
   *   .editForm(ExperienceDialogForm)  // Form shown in dialog
   *   .entity(Experience)  // Entity class for defaults
   *   .end();
   * ```
   */
  editForm(formClass: new (...args: any[]) => Form<T>): this {
    this._config.editFormClass = formClass;
    return this;
  }

  /**
   * Set the entity class used for creating new items.
   * When adding a new item, `new entityClass()` provides defaults.
   *
   * @example
   * ```typescript
   * this.addList<Experience>("experiences")
   *   .as(ExperienceTable)
   *   .entity(Experience)  // new Experience() provides defaults
   *   .end();
   * ```
   */
  entity(entityClass: new () => T): this {
    this._config.entityClass = entityClass;
    return this;
  }

  rules(...rules: ValidationRule[]): this {
    if (!this._config.rules) {
      this._config.rules = [];
    }
    this._config.rules.push(...rules);
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visible = condition;
    return this;
  }

  hideByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.hideByAccess = condition;
    return this;
  }

  visibleByAccess(condition: VisibilityCondition): this {
    if (!this._config.visibility) {
      this._config.visibility = {};
    }
    this._config.visibility.visibleByAccess = condition;
    return this;
  }

  css(className: FormCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: FormStyle): this {
    this._config.style = styles;
    return this;
  }

  wrapper(component: ComponentType): this {
    this._config.wrapper = component;
    return this;
  }

  /**
   * Specify which section/element this list should render after.
   * By default, lists auto-target to the last section defined before them.
   * Use this method to explicitly override the auto-target.
   *
   * @param targetId - The id or title of the section to render after
   *
   * @example
   * ```typescript
   * // Auto-targeting (default behavior):
   * this.addSection("Addresses")
   *   .addComponent(Button).children("+ Add").onClick(...).endComponent()
   *   .endSection();
   * this.addList<Address>("addresses")  // Auto-targets "Addresses" section
   *   .as(Tabs)
   *   .end();
   *
   * // Explicit targeting with section id:
   * this.addSection("Addresses")
   *   .id("addr-section")
   *   .endSection();
   * this.addList<Address>("addresses")
   *   .target("addr-section")  // Explicitly target by id
   *   .as(Tabs)
   *   .end();
   * ```
   */
  target(targetId: string): this {
    this._config.target = targetId;
    this._explicitTarget = true;
    return this;
  }

  /**
   * @internal - Set auto-target from Form.addList()
   * This is the default target when no explicit .target() is called.
   */
  _setAutoTarget(targetId: string): void {
    this._autoTarget = targetId;
  }

  /**
   * Include fields from a Component or Form class for each list item.
   *
   * @example
   * ```typescript
   * // Define address fields using Component (simpler, recommended)
   * class AddressFields extends Component<Address> {
   *   configure() {
   *     this.addRow().addField("street")...
   *   }
   * }
   *
   * // Or using Form (if you need actions/lifecycle)
   * class AddressFields extends Form<Address> {
   *   configure() {
   *     this.addRow().addField("street")...
   *   }
   * }
   *
   * // Include in list
   * this.addList<Address>("addresses")
   *   .as(Tabs)
   *   .include(AddressFields)
   *   .end();
   * ```
   */
  include(FieldsClass: new (...args: any[]) => Component<T> | Form<T>): this {
    // Create instance to get its configuration
    const instance = new FieldsClass();
    const config = instance.build();

    // Check if it's a Component (has rows directly) or Form (has sections)
    if ('rows' in config && Array.isArray(config.rows)) {
      // It's a Component - store rows directly (not via builder to preserve fields)
      for (const row of config.rows) {
        this._includedRows.push(row);
      }
      // Also capture containers from Component.container() API
      if ('containers' in config && Array.isArray(config.containers)) {
        for (const container of config.containers) {
          this._includedContainers.push(container);
        }
      }
    } else if ('sections' in config) {
      // It's a Form - copy rows from sections
      const formConfig = config as FormConfig<T>;
      if (formConfig.sections) {
        for (const section of formConfig.sections) {
          if (section.rows) {
            for (const row of section.rows) {
              this._includedRows.push(row);
            }
          }
        }
      }
    }

    return this;
  }

  end(): TParent {
    return this._parent;
  }

  _getConfig(): BuiltListConfig<T> {
    // Combine rows from builders (for addRow()) and included rows (for include())
    const builderRows = this._rowBuilders.map((rb) => rb._getConfig());
    this._config.rows = [...builderRows, ...this._includedRows];

    // Include containers from Component.container() API
    if (this._includedContainers.length > 0) {
      this._config.containers = this._includedContainers;
    }

    // Apply auto-target if no explicit target was set
    if (!this._explicitTarget && this._autoTarget && !this._config.target) {
      this._config.target = this._autoTarget;
    }

    return this._config;
  }

  _getNestedObjects(): Map<string, ObjectBuilderImpl<ListBuilderImpl<TParent, T>>> {
    return this._nestedObjects;
  }

  _getNestedLists(): Map<string, ListBuilderImpl<ListBuilderImpl<TParent, T>, any>> {
    return this._nestedLists;
  }

  _getBasePath(): string {
    return this._basePath;
  }
}

// =============================================================================
// FORM BASE CLASS
// =============================================================================

/**
 * Abstract base class for defining forms.
 *
 * @example
 * ```typescript
 * class EmployeeForm extends Form<Employee> {
 *   constructor() {
 *     super("employeeForm");
 *   }
 *
 *   configure() {
 *     this.addSection("Personal Info")
 *         .addRow()
 *           .addField("firstName")
 *             .component(TextField)
 *             .label("First Name")
 *             .rules(Validators.required())
 *             .end()
 *           .addField("lastName")
 *             .component(TextField)
 *             .label("Last Name")
 *             .rules(Validators.required())
 *             .end()
 *           .end()
 *         .end();
 *
 *     this.addAction("save", new Action<Employee>()
 *         .api((ctx) => ctx.mode === "new"
 *             ? ctx.api.EmployeesApi.create
 *             : ctx.api.EmployeesApi.update)
 *         .afterExecute((response, ctx) => {
 *           ctx.notify("Saved!", "success");
 *           ctx.navigate("/employees");
 *         })
 *         .build());
 *
 *     this.addAction("cancel", new Action<Employee>()
 *         .skipValidation()
 *         .handler((ctx) => ctx.navigate("/employees"))
 *         .build());
 *   }
 *
 *   onFieldChange(field: string, value: any, ctx: FormContext) {
 *     if (field === "country") {
 *       // Clear state when country changes
 *       ctx.setValue("state", "");
 *     }
 *   }
 * }
 * ```
 */
export abstract class Form<TEntity = any> implements FormLifecycle<TEntity> {
  protected readonly _id: string;
  protected _sections: SectionBuilderImpl<Form<TEntity>>[] = [];
  protected _actions: Map<string, BuiltAction<TEntity>> = new Map();
  protected _directRows: RowBuilderImpl<Form<TEntity>>[] = [];
  protected _readOnly: boolean | ((ctx: FormContext) => boolean) = false;
  protected _defaultValues: Partial<TEntity> = {};
  protected _fieldRulesMap: Map<string, ValidationRule[]> = new Map();
  protected _objects: Map<string, ObjectBuilderImpl<Form<TEntity>>> = new Map();
  protected _lists: Map<string, ListBuilderImpl<Form<TEntity>, any>> = new Map();
  protected _tabs: FormTabsBuilderImpl<Form<TEntity>>[] = [];
  /** Tracks the order in which elements (sections, lists, objects, tabs) were added */
  protected _elementOrder: Array<{ type: "section" | "list" | "object" | "tabs"; key: string | number }> = [];
  /** Reference to the most recently added section builder for auto-targeting lists */
  protected _lastSectionBuilder: SectionBuilderImpl<Form<TEntity>> | undefined;

  constructor(id: string) {
    this._id = id;
    this.configure();
    this._extractFieldRules();
  }

  /**
   * Abstract method to configure the form.
   * Override this method to define sections, fields, and actions.
   */
  abstract configure(): void;

  // =============================================================================
  // BUILDER METHODS
  // =============================================================================

  /**
   * Add a new section to the form
   */
  protected addSection(title: string): SectionBuilderImpl<Form<TEntity>> {
    const sectionBuilder = new SectionBuilderImpl<Form<TEntity>>(title, this);
    const sectionIndex = this._sections.length;
    this._sections.push(sectionBuilder);
    this._elementOrder.push({ type: "section", key: sectionIndex });
    // Track for auto-targeting lists
    this._lastSectionBuilder = sectionBuilder;
    return sectionBuilder;
  }

  /**
   * Add a row directly to the form (no section)
   */
  protected addRow(): RowBuilderImpl<Form<TEntity>> {
    const rowBuilder = new RowBuilderImpl<Form<TEntity>>(this);
    this._directRows.push(rowBuilder);
    return rowBuilder;
  }

  /**
   * Add an action to the form
   */
  protected addAction(name: string, action: BuiltAction<TEntity>): this {
    this._actions.set(name, action);
    return this;
  }

  /**
   * Set form to read-only mode
   */
  protected setReadOnly(condition: boolean | ((ctx: FormContext) => boolean)): this {
    this._readOnly = condition;
    return this;
  }

  /**
   * Set default values for the form
   */
  protected setDefaultValues(values: Partial<TEntity>): this {
    this._defaultValues = values;
    return this;
  }

  /**
   * Include a reusable FormSection in this form.
   * Field names will be prefixed with the provided prefix.
   *
   * @param SectionClass - The FormSection class to include
   * @param prefix - Prefix for field names (e.g., "permanentAddress" -> "permanentAddress.street")
   * @param title - Optional title override for the section
   *
   * @example
   * ```typescript
   * // Define reusable section
   * class AddressSection extends FormSection {
   *   configure() {
   *     this.addRow()
   *       .addField("street").component(Input).label("Street").end()
   *       .addField("city").component(Input).label("City").end()
   *       .layout([2, 1])
   *       .end();
   *   }
   * }
   *
   * // Use in form - include the same section with different prefixes
   * class UserForm extends Form<User> {
   *   configure() {
   *     this.include(AddressSection, "homeAddress", "Home Address");
   *     this.include(AddressSection, "workAddress", "Work Address");
   *   }
   * }
   * // Creates fields: homeAddress.street, homeAddress.city, workAddress.street, workAddress.city
   * ```
   */
  protected include(
    SectionClass: new () => FormSection,
    prefix: string,
    title?: string
  ): this {
    const section = new SectionClass();
    const config = section._getConfig(prefix, title);

    // Create a section builder with the config from the reusable section
    const sectionBuilder = new SectionBuilderImpl<Form<TEntity>>(config.title, this);

    // Copy the rows from the reusable section config
    // We need to access internal state to copy the row configurations
    (sectionBuilder as any)._config = config;

    this._sections.push(sectionBuilder);
    return this;
  }

  // =============================================================================
  // STRUCTURED DATA API: addObject(), addList()
  // =============================================================================

  /**
   * Add a nested object to the form.
   * Object fields are accessed as "objectName.fieldName".
   *
   * @example
   * ```typescript
   * this.addObject("customer")
   *   .title("Customer Info")
   *   .addRow()
   *     .addField("name").label("Name").endField()
   *     .addField("email").label("Email").endField()
   *   .endRow();
   * // Value: { customer: { name: "...", email: "..." } }
   * ```
   */
  protected addObject(name: string, config?: ObjectConfig): ObjectBuilderImpl<Form<TEntity>> {
    const objectBuilder = new ObjectBuilderImpl<Form<TEntity>>(name, this, "", config);
    this._objects.set(name, objectBuilder);
    this._elementOrder.push({ type: "object", key: name });
    return objectBuilder;
  }

  /**
   * Add a list (array) of items to the form.
   * Supports dynamic add/remove operations at runtime via ctx.list().
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
   *   .addRow()
   *     .addField("product").label("Product").endField()
   *     .addField("qty").label("Qty").endField()
   *     .addField("price").label("Price").endField()
   *   .endRow();
   * // Value: { items: [{ product, qty, price }, ...] }
   *
   * // Runtime operations:
   * // ctx.list("items").add({ product: "Widget", qty: 1 });
   * // ctx.list("items").addFirst({ product: "First" });
   * // ctx.list("items").remove(0);
   * ```
   */
  protected addList<T = Record<string, any>>(name: string, config?: ListConfig<T>): ListBuilderImpl<Form<TEntity>, T> {
    const listBuilder = new ListBuilderImpl<Form<TEntity>, T>(name, this, "", config);
    this._lists.set(name, listBuilder);
    this._elementOrder.push({ type: "list", key: name });

    // Auto-target to the last section (if any) unless explicitly overridden by .target()
    if (this._lastSectionBuilder) {
      const sectionConfig = this._lastSectionBuilder._getConfig();
      // Use section id if available, otherwise use title
      const autoTarget = sectionConfig.id || sectionConfig.title;
      listBuilder._setAutoTarget(autoTarget);
    }

    return listBuilder;
  }

  /**
   * Add a tabs container to the form.
   * Each tab can contain its own sections with fields.
   *
   * @example
   * ```typescript
   * this.addTabs("employee-info")
   *   .position("top")
   *   .tab("personal")
   *     .label("Personal Info")
   *     .addSection("Details")
   *       .addRow()
   *         .addField("firstName").label("First Name").endField()
   *         .addField("lastName").label("Last Name").endField()
   *       .endRow()
   *     .endSection()
   *   .endTab()
   *   .tab("address")
   *     .label("Address")
   *     .addSection("Home Address")
   *       .addRow()
   *         .addField("street").label("Street").endField()
   *       .endRow()
   *     .endSection()
   *   .endTab()
   * .endTabs();
   * ```
   */
  protected addTabs(id: string): FormTabsBuilderImpl<Form<TEntity>> {
    const tabsBuilder = new FormTabsBuilderImpl<Form<TEntity>>(id, this);
    this._tabs.push(tabsBuilder);
    this._elementOrder.push({ type: "tabs", key: id });
    return tabsBuilder;
  }

  // =============================================================================
  // LIFECYCLE HOOKS (Override in subclass)
  // =============================================================================

  /**
   * Called when form is initialized
   */
  onInit?(ctx: FormContext): void | Promise<void>;

  /**
   * Called when form data is loaded
   */
  onLoad?(ctx: FormContext): void;

  /**
   * Called when any field value changes
   */
  onFieldChange?(field: string, value: any, ctx: FormContext): void;

  /**
   * Called before form submission
   * Return false to prevent submission
   */
  onBeforeSubmit?(action: string, ctx: FormContext): boolean | Promise<boolean>;

  /**
   * Called after successful form submission
   */
  onAfterSubmit?(action: string, response: any, ctx: FormContext): void;

  /**
   * Called when validation errors occur
   */
  onValidationError?(errors: ValidationErrors, ctx: FormContext): void;

  /**
   * Called before form reset
   * Return false to prevent reset
   */
  onBeforeReset?(ctx: FormContext): boolean;

  /**
   * Called after form reset
   */
  onAfterReset?(ctx: FormContext): void;

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  /**
   * Get the form ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get the action by name
   */
  getAction(name: string): BuiltAction<TEntity> | undefined {
    return this._actions.get(name);
  }

  /**
   * Check if action exists
   */
  hasAction(name: string): boolean {
    return this._actions.has(name);
  }

  /**
   * Get all action names
   */
  getActionNames(): string[] {
    return Array.from(this._actions.keys());
  }

  /**
   * Get validation rules for a field
   */
  getFieldRules(fieldName: string): ValidationRule[] {
    return this._fieldRulesMap.get(fieldName) || [];
  }

  /**
   * Get all field rules
   */
  getAllFieldRules(): Map<string, ValidationRule[]> {
    return this._fieldRulesMap;
  }

  /**
   * Get default values
   */
  getDefaultValues(): Partial<TEntity> {
    return this._defaultValues;
  }

  /**
   * Get list configuration by name
   */
  getListConfig<T = Record<string, any>>(name: string): BuiltListConfig<T> | undefined {
    const listBuilder = this._lists.get(name);
    return listBuilder?._getConfig() as BuiltListConfig<T> | undefined;
  }

  /**
   * Get object configuration by name
   */
  getObjectConfig(name: string): BuiltObjectConfig | undefined {
    const objectBuilder = this._objects.get(name);
    return objectBuilder?._getConfig();
  }

  /**
   * Get all list names
   */
  getListNames(): string[] {
    return Array.from(this._lists.keys());
  }

  /**
   * Get all object names
   */
  getObjectNames(): string[] {
    return Array.from(this._objects.keys());
  }

  /**
   * Build the form configuration
   */
  build(): FormConfig<TEntity> {
    const sections: SectionConfig[] = this._sections.map((sb) => sb._getConfig());

    // Handle direct rows (no section) - create a default section
    if (this._directRows.length > 0) {
      const directRows = this._directRows.map((rb) => rb._getConfig());
      sections.unshift({
        title: "",
        rows: directRows,
      });
    }

    // Build objects
    const objects: Record<string, BuiltObjectConfig> = {};
    for (const [name, builder] of this._objects) {
      objects[name] = builder._getConfig();
    }

    // Build lists
    const lists: Record<string, BuiltListConfig> = {};
    for (const [name, builder] of this._lists) {
      lists[name] = builder._getConfig();
    }

    // Build tabs
    const tabs: FormTabsConfig[] = this._tabs.map((tb) => tb._getConfig());

    return {
      id: this._id,
      sections,
      actions: Object.fromEntries(this._actions),
      readOnly: this._readOnly,
      objects: Object.keys(objects).length > 0 ? objects : undefined,
      lists: Object.keys(lists).length > 0 ? lists : undefined,
      tabs: tabs.length > 0 ? tabs : undefined,
      // elementOrder disabled for now - will implement target-based rendering instead
      // elementOrder: this._elementOrder.length > 0 ? this._elementOrder : undefined,
    };
  }

  // =============================================================================
  // INTERNAL METHODS
  // =============================================================================

  /**
   * Extract field rules from config for validation runner
   */
  private _extractFieldRules(): void {
    const config = this.build();

    for (const section of config.sections) {
      for (const row of section.rows) {
        for (const field of row.fields) {
          if (field.rules && field.rules.length > 0) {
            this._fieldRulesMap.set(field.name, field.rules);
          }
        }
      }
    }
  }

  // =============================================================================
  // EVENT EMISSION HELPERS
  // =============================================================================

  /**
   * Emit form init event
   */
  protected emitInit(): void {
    eventEmitter.emit("form:init", { formId: this._id });
  }

  /**
   * Emit form load event
   */
  protected emitLoad(values: Record<string, any>): void {
    eventEmitter.emit("form:load", { formId: this._id, values });
  }

  /**
   * Emit field change event
   */
  protected emitChange(field: string, value: any, previousValue: any): void {
    eventEmitter.emit("form:change", {
      formId: this._id,
      field,
      value,
      previousValue,
    });
  }

  /**
   * Emit form submit event
   */
  protected emitSubmit(action: string, values: Record<string, any>): void {
    eventEmitter.emit("form:submit", { formId: this._id, action, values });
  }

  /**
   * Emit form validation event
   */
  protected emitValidate(valid: boolean, errors: ValidationErrors): void {
    eventEmitter.emit("form:validate", { formId: this._id, valid, errors });
  }

  /**
   * Emit form reset event
   */
  protected emitReset(): void {
    eventEmitter.emit("form:reset", { formId: this._id });
  }
}

// =============================================================================
// FORM STATE FACTORY
// =============================================================================

/**
 * Create initial form state
 */
export function createFormState(initialValues: Record<string, any> = {}): FormState {
  return {
    values: { ...initialValues },
    initialValues: { ...initialValues },
    errors: {},
    touched: {},
    dirty: false,
    submitting: false,
    readOnly: false,
    fieldVisibility: {},
    fieldDisabled: {},
    groupVisibility: {},
  };
}

// =============================================================================
// FORM UTILITIES
// =============================================================================

/**
 * Check if form values have changed from initial values
 */
export function isFormDirty(
  currentValues: Record<string, any>,
  initialValues: Record<string, any>
): boolean {
  const currentKeys = Object.keys(currentValues);
  const initialKeys = Object.keys(initialValues);

  if (currentKeys.length !== initialKeys.length) {
    return true;
  }

  for (const key of currentKeys) {
    if (currentValues[key] !== initialValues[key]) {
      return true;
    }
  }

  return false;
}

/**
 * Get changed fields between current and initial values
 */
export function getChangedFields(
  currentValues: Record<string, any>,
  initialValues: Record<string, any>
): string[] {
  const changedFields: string[] = [];

  for (const key of Object.keys(currentValues)) {
    if (currentValues[key] !== initialValues[key]) {
      changedFields.push(key);
    }
  }

  return changedFields;
}

/**
 * Reset form values to initial values
 */
export function resetFormValues(
  currentValues: Record<string, any>,
  initialValues: Record<string, any>
): Record<string, any> {
  return { ...initialValues };
}
