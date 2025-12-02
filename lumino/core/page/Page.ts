/**
 * Lumino Framework - Page Base Class
 *
 * Abstract base class for defining pages with fluent builder pattern.
 * UI-independent - renderers are handled by UI adapters.
 */

import type { ReactNode } from "react";
import type { ComponentType, ComponentProps } from "../types/base";
import type { PageContext } from "../types/context";
import type {
  ComponentConfig,
  PageRowConfig,
  PageConfig,
  PageLifecycle,
  PageState,
  ModeFunction,
  OnModeHandler,
  OnModeHandlers,
  PageStyle,
  PageCssClass,
} from "../types/page";
import type { SpacingConfig, RowConfig } from "../types/form";
import { type Form, Component } from "../form/Form";
import type { Tabs, TabsConfig } from "../containers/Tabs";
import { eventEmitter } from "../events/EventEmitter";
import { RouteRegistry } from "../registry/RouteRegistry";

// =============================================================================
// COMPONENT BUILDER IMPLEMENTATION
// =============================================================================

class ComponentBuilderImpl<TParent> {
  private _config: ComponentConfig;
  private _parent: TParent;

  constructor(component: ComponentType, parent: TParent) {
    this._parent = parent;
    this._config = {
      component,
      props: {},
    };
  }

  props(props: ComponentProps | ((ctx: PageContext) => ComponentProps)): this {
    this._config.props = props;
    return this;
  }

  /**
   * Set children/content for the component (e.g., button label)
   * Can be static or dynamic (function that receives page context)
   */
  children(children: ReactNode | string | ((ctx: PageContext) => ReactNode)): this {
    this._config.children = children;
    return this;
  }

  /**
   * Set click handler - receives page context
   */
  onClick(handler: (ctx: PageContext) => void | Promise<void>): this {
    this._config.onClick = handler;
    return this;
  }

  visible(condition: boolean | ((ctx: PageContext) => boolean)): this {
    this._config.visible = condition;
    return this;
  }

  margin(spacing: SpacingConfig): this {
    this._config.margin = spacing;
    return this;
  }

  padding(spacing: SpacingConfig): this {
    this._config.padding = spacing;
    return this;
  }

  css(className: PageCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: PageStyle): this {
    this._config.style = styles;
    return this;
  }

  wrapper(component: ComponentType): this {
    this._config.wrapper = component;
    return this;
  }

  colSpan(span: number): this {
    this._config.colSpan = span;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  _getConfig(): ComponentConfig {
    return this._config;
  }
}

// =============================================================================
// PAGE ROW BUILDER IMPLEMENTATION
// =============================================================================

class PageRowBuilderImpl<TParent> {
  private _config: PageRowConfig;
  private _parent: TParent;
  private _componentBuilders: ComponentBuilderImpl<PageRowBuilderImpl<TParent>>[] = [];

  constructor(parent: TParent) {
    this._parent = parent;
    this._config = {
      components: [],
      columns: 12,
      gap: 16,
    };
  }

  addComponent(component: ComponentType): ComponentBuilderImpl<PageRowBuilderImpl<TParent>> {
    const componentBuilder = new ComponentBuilderImpl<PageRowBuilderImpl<TParent>>(component, this);
    this._componentBuilders.push(componentBuilder);
    return componentBuilder;
  }

  columns(count: number): this {
    this._config.columns = count;
    return this;
  }

  gap(gap: number): this {
    this._config.gap = gap;
    return this;
  }

  layout(spans: number[]): this {
    this._config.layout = spans;
    return this;
  }

  visible(condition: boolean | ((ctx: PageContext) => boolean)): this {
    this._config.visible = condition;
    return this;
  }

  margin(spacing: SpacingConfig): this {
    this._config.margin = spacing;
    return this;
  }

  padding(spacing: SpacingConfig): this {
    this._config.padding = spacing;
    return this;
  }

  css(className: PageCssClass): this {
    this._config.cssClass = className;
    return this;
  }

  style(styles: PageStyle): this {
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

  _getConfig(): PageRowConfig {
    this._config.components = this._componentBuilders.map((cb) => cb._getConfig());
    return this._config;
  }
}

// =============================================================================
// PAGE BASE CLASS
// =============================================================================

/**
 * Abstract base class for defining pages.
 *
 * @example
 * ```typescript
 * class EmployeeFormPage extends Page<Employee> {
 *   private employeeForm = new EmployeeForm();
 *
 *   constructor() {
 *     super("employeeFormPage");
 *   }
 *
 *   configure() {
 *     // Route and mode - fully chainable
 *     this.route("/employees/:id")
 *         .mode((ctx) => ctx.routeParams.id ? "edit" : "new");
 *
 *     // Mode handlers
 *     this.onMode("new", async (ctx) => {
 *       ctx.setEntity({});
 *     });
 *
 *     this.onMode("edit", async (ctx) => {
 *       const employee = await ctx.call(ctx.api.EmployeesApi.get, {
 *         path: { id: ctx.routeParams.id }
 *       });
 *       ctx.setEntity(employee);
 *     });
 *
 *     // Components
 *     this.addComponent(PageHeader)
 *         .props((ctx) => ({
 *           title: ctx.mode === "new" ? "New Employee" : "Edit Employee"
 *         }))
 *         .end();
 *
 *     this.addForm(this.employeeForm);
 *   }
 *   // Registration happens automatically after configure()
 * }
 * ```
 */
export abstract class Page<TEntity = any> implements PageLifecycle {
  protected readonly _id: string;
  protected _route: string = "";
  protected _modeFn: ModeFunction | null = null;
  protected _onModeHandlers: OnModeHandlers = {};
  protected _components: Array<ComponentConfig | PageRowConfig | { type: "form"; form: Form<any> } | { type: "tabs"; tabs: Tabs; config: TabsConfig }> = [];
  protected _forms: Map<string, Form<any>> = new Map();
  protected _tabs: Map<string, Tabs> = new Map();
  protected _meta: Record<string, any> = {};
  protected _layoutOverride: (new (id: string) => any) | null = null;

  constructor(id: string) {
    this._id = id;
    // Use queueMicrotask for configure() to allow subclass field initializers to complete
    // This is necessary because class field initializers run AFTER super() but BEFORE
    // the rest of the subclass constructor in JavaScript
    queueMicrotask(() => {
      this.configure();
      this._register();
    });
  }

  /**
   * Internal registration - called automatically after constructor
   */
  private _register(): void {
    // Register page
    PageRegistry.register(this._id, this.constructor as new () => Page<any>);

    // Auto-register route if defined
    if (this._route) {
      RouteRegistry.register(this._route, { path: this._route, pageId: this._id });
    }
  }

  /**
   * Abstract method to configure the page.
   * Override this method to define mode, components, and forms.
   */
  abstract configure(): void;

  // =============================================================================
  // BUILDER METHODS
  // =============================================================================

  /**
   * Set the page route
   */
  protected route(path: string): this {
    this._route = path;
    return this;
  }

  /**
   * Override the app layout for this page.
   * Useful for pages that need a different layout (e.g., admin pages, login page).
   *
   * @example
   * ```typescript
   * class AdminPage extends Page {
   *   configure() {
   *     this.route("/admin")
   *         .layout(AdminLayout);  // Use AdminLayout instead of default
   *   }
   * }
   * ```
   */
  protected layout(layoutClass: new (id: string) => any): this {
    this._layoutOverride = layoutClass;
    return this;
  }

  /**
   * Define how to determine the page mode
   */
  protected mode(modeFn: ModeFunction): this {
    this._modeFn = modeFn;
    return this;
  }

  /**
   * Register a handler for a specific mode
   */
  protected onMode(modeName: string, handler: OnModeHandler): this {
    this._onModeHandlers[modeName] = handler;
    return this;
  }

  /**
   * Add a component to the page
   */
  protected addComponent(component: ComponentType): ComponentBuilderImpl<Page<TEntity>> {
    const componentBuilder = new ComponentBuilderImpl<Page<TEntity>>(component, this);
    // Store reference to add config on end()
    const originalEnd = componentBuilder.end.bind(componentBuilder);
    componentBuilder.end = () => {
      this._components.push(componentBuilder._getConfig());
      return originalEnd();
    };
    return componentBuilder;
  }

  /**
   * Add a row of components to the page
   */
  protected addRow(): PageRowBuilderImpl<Page<TEntity>> {
    const rowBuilder = new PageRowBuilderImpl<Page<TEntity>>(this);
    // Store reference to add config on end()
    const originalEnd = rowBuilder.end.bind(rowBuilder);
    rowBuilder.end = () => {
      this._components.push(rowBuilder._getConfig());
      return originalEnd();
    };
    return rowBuilder;
  }

  /**
   * Add a form to the page
   */
  protected addForm(form: Form<any>): this {
    if (!form) {
      console.warn("addForm called with undefined form. Skipping.");
      return this;
    }
    this._forms.set(form.id, form);
    this._components.push({ type: "form", form });
    return this;
  }

  /**
   * Add a tabs container to the page
   */
  protected addTabs(tabs: Tabs): this {
    if (!tabs) {
      console.warn("addTabs called with undefined tabs. Skipping.");
      return this;
    }
    this._tabs.set(tabs.id, tabs);
    this._components.push({ type: "tabs", tabs, config: tabs.build() });
    return this;
  }

  /**
   * Include a Lumino Component into the page.
   * Components are instantiated with props and their rows are added to the page.
   *
   * @example
   * ```typescript
   * class MyPage extends Page<Employee> {
   *   configure() {
   *     // Include a ModeButtons component with props
   *     this.include(ModeButtons, { basePath: "/form-builder" });
   *
   *     // Include multiple components
   *     this.include(PageHeader, { title: "Employee Form" });
   *     this.include(ActionBar, { actions: ["save", "cancel"] });
   *   }
   * }
   * ```
   */
  protected include<TProps>(
    ComponentClass: new (props?: TProps) => Component<any, TProps>,
    props?: TProps
  ): this {
    const component = new ComponentClass(props);
    const built = component.build();

    // Add all rows from the component
    for (const row of built.rows) {
      this._components.push({ type: "row", ...this._convertRowToPageRow(row) });
    }

    return this;
  }

  /**
   * Convert a Component RowConfig to PageRowConfig format
   * @internal
   */
  private _convertRowToPageRow(row: RowConfig): PageRowConfig {
    // Combine fields and components into PageRowConfig components
    const components: ComponentConfig[] = [];

    // Convert fields (if any)
    for (const field of row.fields || []) {
      components.push({
        component: field.component,
        props: field.props,
        children: field.children,
        onClick: field.onClick as any, // FormContext vs PageContext
        visible: field.visibility?.condition as any,
        style: field.style as any,
        cssClass: field.cssClass as any,
      });
    }

    // Convert standalone components (if any)
    for (const comp of row.components || []) {
      components.push({
        component: comp.component,
        props: comp.props as any,
        children: comp.children,
        onClick: comp.onClick as any,
        visible: comp.visibility?.condition as any,
        style: comp.style as any,
        cssClass: comp.cssClass as any,
      });
    }

    return {
      components,
      columns: row.columns,
      gap: row.gap,
      layout: row.layout,
      style: row.style as any,
      visible: row.visibility?.condition as any,
      cssClass: row.cssClass as any,
    };
  }

  /**
   * Set page metadata
   */
  protected setMeta(key: string, value: any): this {
    this._meta[key] = value;
    return this;
  }

  // =============================================================================
  // LIFECYCLE HOOKS (Override in subclass)
  // =============================================================================

  /**
   * Called when page is initialized (before mode is determined)
   */
  onInit?(ctx: PageContext): void | Promise<void>;

  /**
   * Called after mode handler completes
   */
  onLoad?(ctx: PageContext): void;

  /**
   * Called before leaving the page
   * Return false to prevent navigation
   */
  onBeforeLeave?(ctx: PageContext): boolean | Promise<boolean>;

  /**
   * Called when page is destroyed/unmounted
   */
  onDestroy?(ctx: PageContext): void;

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  /**
   * Get the page ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get the route for this page
   */
  getRoute(): string {
    return this._route;
  }

  /**
   * Get the layout override for this page (if any)
   */
  getLayoutOverride(): (new (id: string) => any) | null {
    return this._layoutOverride;
  }

  /**
   * Determine the mode from context
   */
  determineMode(ctx: PageContext): string {
    if (this._modeFn) {
      return this._modeFn(ctx);
    }
    return "default";
  }

  /**
   * Get the mode handler
   */
  getModeHandler(modeName: string): OnModeHandler | undefined {
    return this._onModeHandlers[modeName];
  }

  /**
   * Get all mode handler names
   */
  getModeNames(): string[] {
    return Object.keys(this._onModeHandlers);
  }

  /**
   * Get a form by ID
   */
  getForm(formId: string): Form<any> | undefined {
    return this._forms.get(formId);
  }

  /**
   * Get all forms
   */
  getForms(): Map<string, Form<any>> {
    return this._forms;
  }

  /**
   * Get a tabs container by ID
   */
  getTabs(tabsId: string): Tabs | undefined {
    return this._tabs.get(tabsId);
  }

  /**
   * Get all tabs containers
   */
  getAllTabs(): Map<string, Tabs> {
    return this._tabs;
  }

  /**
   * Get page metadata
   */
  getMeta<T>(key: string): T | undefined {
    return this._meta[key];
  }

  /**
   * Build the page configuration
   */
  build(): PageConfig {
    const components: Array<ComponentConfig | PageRowConfig | any> = this._components.map((comp) => {
      if ("type" in comp && comp.type === "form") {
        return comp.form.build();
      }
      if ("type" in comp && comp.type === "tabs") {
        return { type: "tabs", config: comp.config };
      }
      return comp;
    });

    return {
      id: this._id,
      route: this._route,
      components,
    };
  }

  // =============================================================================
  // EVENT EMISSION HELPERS
  // =============================================================================

  /**
   * Emit page init event
   */
  protected emitInit(mode: string): void {
    eventEmitter.emit("page:init", { pageId: this._id, mode });
  }

  /**
   * Emit page load event
   */
  protected emitLoad(mode: string): void {
    eventEmitter.emit("page:load", { pageId: this._id, mode });
  }

  /**
   * Emit mode change event
   */
  protected emitModeChange(previousMode: string, mode: string): void {
    eventEmitter.emit("page:modeChange", {
      pageId: this._id,
      previousMode,
      mode,
    });
  }

  /**
   * Emit before leave event
   */
  protected emitBeforeLeave(targetPath: string): void {
    eventEmitter.emit("page:beforeLeave", { pageId: this._id, targetPath });
  }

  /**
   * Emit page destroy event
   */
  protected emitDestroy(): void {
    eventEmitter.emit("page:destroy", { pageId: this._id });
  }
}

// =============================================================================
// PAGE STATE FACTORY
// =============================================================================

/**
 * Create initial page state
 */
export function createPageState(mode: string = "default"): PageState {
  return {
    mode,
    entity: null,
    loading: false,
    error: null,
    meta: {},
  };
}

// =============================================================================
// PAGE REGISTRY
// =============================================================================

/**
 * Page Registry for managing page instances
 */
export class PageRegistry {
  private static _pages: Map<string, new () => Page<any>> = new Map();
  private static _instances: Map<string, Page<any>> = new Map();

  /**
   * Register a page class
   */
  static register(pageId: string, pageClass: new () => Page<any>): void {
    this._pages.set(pageId, pageClass);
  }

  /**
   * Get or create a page instance
   */
  static get<T extends Page<any>>(pageId: string): T | undefined {
    // Check for cached instance
    let instance = this._instances.get(pageId) as T;
    if (instance) {
      return instance;
    }

    // Create new instance
    const PageClass = this._pages.get(pageId);
    if (PageClass) {
      instance = new PageClass() as T;
      this._instances.set(pageId, instance);
      return instance;
    }

    return undefined;
  }

  /**
   * Check if a page is registered
   */
  static has(pageId: string): boolean {
    return this._pages.has(pageId);
  }

  /**
   * Get all registered page IDs
   */
  static getPageIds(): string[] {
    return Array.from(this._pages.keys());
  }

  /**
   * Clear all registrations and instances
   */
  static clear(): void {
    this._pages.clear();
    this._instances.clear();
  }

  /**
   * Clear cached instances (keeps registrations)
   */
  static clearInstances(): void {
    this._instances.clear();
  }

  /**
   * Register a page instance directly
   * Used by App.routes() to register already-instantiated pages
   */
  static registerInstance(pageId: string, instance: Page<any>): void {
    this._instances.set(pageId, instance);
    // Also register the class
    this._pages.set(pageId, instance.constructor as new () => Page<any>);
  }
}
