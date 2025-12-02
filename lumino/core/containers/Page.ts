/**
 * Lumino Framework - Dashboard/WidgetPage Base Class
 *
 * Abstract base class for defining widget-based pages (dashboards) with fluent builder pattern.
 * UI-independent - renderers are handled by UI adapters.
 *
 * Use this for dashboard-style pages that contain multiple widgets.
 * For form-based pages with routing, use the Page class from core/page instead.
 *
 * WidgetPage can contain:
 * - Forms
 * - Tables
 * - Tabs
 * - Custom widgets
 * - Nested layouts
 */

import type { ComponentType, ReactNode } from "react";
import type { FormContext } from "../types/context";
import type { VisibilityCondition } from "../types/form";
import type { BreadcrumbItem, PageLayoutConfig } from "../types/ui";

// =============================================================================
// PAGE WIDGET TYPES
// =============================================================================

/**
 * Configuration for a widget on the page
 */
export interface PageWidgetConfig {
  /** Widget ID */
  id: string;
  /** Widget title */
  title?: string | ((ctx: FormContext) => string);
  /** Widget type */
  type?: "form" | "table" | "tabs" | "dialog" | "chart" | "custom";
  /** Form class reference */
  form?: any;
  /** Table class reference */
  table?: any;
  /** Tabs class reference */
  tabs?: any;
  /** Custom component */
  component?: ComponentType<any>;
  /** Props for form/table/component */
  props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  /** Custom render function */
  render?: (ctx: FormContext) => ReactNode;
  /** Grid placement */
  grid?: {
    column?: number | string;
    row?: number | string;
    columnSpan?: number;
    rowSpan?: number;
  };
  /** Order in layout */
  order?: number;
  /** Visibility condition */
  visibility?: {
    hide?: VisibilityCondition;
    visible?: VisibilityCondition;
  };
  /** Loading state */
  loading?: boolean | ((ctx: FormContext) => boolean);
  /** Refresh interval (ms) for auto-refresh */
  refreshInterval?: number;
  /** CSS class */
  cssClass?: string;
  /** Collapsible */
  collapsible?: boolean;
  /** Initially collapsed */
  collapsed?: boolean;
}

/**
 * Page action configuration
 */
export interface PageActionConfig {
  /** Action ID */
  id: string;
  /** Action label */
  label: string | ((ctx: FormContext) => string);
  /** Action icon */
  icon?: ReactNode | string;
  /** Click handler */
  onClick: (ctx: FormContext) => void;
  /** Variant */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** Is disabled */
  disabled?: boolean | ((ctx: FormContext) => boolean);
  /** Is loading */
  loading?: boolean | ((ctx: FormContext) => boolean);
  /** Position */
  position?: "left" | "right";
}

/**
 * Built widget page configuration
 */
export interface WidgetPageConfig {
  /** Page ID */
  id: string;
  /** Page title */
  title?: string | ((ctx: FormContext) => string);
  /** Page subtitle */
  subtitle?: string | ((ctx: FormContext) => string);
  /** Page layout */
  layout?: PageLayoutConfig;
  /** Widgets on the page */
  widgets: PageWidgetConfig[];
  /** Header actions */
  headerActions?: PageActionConfig[];
  /** Breadcrumbs */
  breadcrumbs?: BreadcrumbItem[] | ((ctx: FormContext) => BreadcrumbItem[]);
  /** Loading state */
  loading?: boolean | ((ctx: FormContext) => boolean);
  /** Error content */
  error?: ReactNode | ((ctx: FormContext) => ReactNode);
  /** CSS class */
  cssClass?: string;
  /** On init handler */
  onInit?: (ctx: FormContext) => void | Promise<void>;
  /** On destroy handler */
  onDestroy?: (ctx: FormContext) => void;
}

// =============================================================================
// WIDGET BUILDER IMPLEMENTATION
// =============================================================================

class WidgetBuilderImpl<TParent> {
  private _config: PageWidgetConfig;
  private _parent: TParent;

  constructor(id: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      id,
    };
  }

  title(title: string | ((ctx: FormContext) => string)): this {
    this._config.title = title;
    return this;
  }

  form(formClass: any, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.type = "form";
    this._config.form = formClass;
    if (props) {
      this._config.props = props;
    }
    return this;
  }

  table(tableClass: any, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.type = "table";
    this._config.table = tableClass;
    if (props) {
      this._config.props = props;
    }
    return this;
  }

  tabs(tabsClass: any, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.type = "tabs";
    this._config.tabs = tabsClass;
    if (props) {
      this._config.props = props;
    }
    return this;
  }

  component(comp: ComponentType<any>, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.type = "custom";
    this._config.component = comp;
    if (props) {
      this._config.props = props;
    }
    return this;
  }

  render(renderFn: (ctx: FormContext) => ReactNode): this {
    this._config.render = renderFn;
    return this;
  }

  grid(config: {
    column?: number | string;
    row?: number | string;
    columnSpan?: number;
    rowSpan?: number;
  }): this {
    this._config.grid = config;
    return this;
  }

  span(columns: number, rows?: number): this {
    this._config.grid = {
      ...this._config.grid,
      columnSpan: columns,
      rowSpan: rows,
    };
    return this;
  }

  order(order: number): this {
    this._config.order = order;
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

  loading(loading: boolean | ((ctx: FormContext) => boolean)): this {
    this._config.loading = loading;
    return this;
  }

  refreshInterval(ms: number): this {
    this._config.refreshInterval = ms;
    return this;
  }

  css(className: string): this {
    this._config.cssClass = className;
    return this;
  }

  collapsible(collapsed: boolean = false): this {
    this._config.collapsible = true;
    this._config.collapsed = collapsed;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  _getConfig(): PageWidgetConfig {
    return this._config;
  }
}

// =============================================================================
// ACTION BUILDER IMPLEMENTATION
// =============================================================================

class PageActionBuilderImpl<TParent> {
  private _config: PageActionConfig;
  private _parent: TParent;

  constructor(id: string, label: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      id,
      label,
      onClick: () => {},
    };
  }

  icon(icon: ReactNode | string): this {
    this._config.icon = icon;
    return this;
  }

  onClick(handler: (ctx: FormContext) => void): this {
    this._config.onClick = handler;
    return this;
  }

  variant(variant: "primary" | "secondary" | "danger" | "ghost"): this {
    this._config.variant = variant;
    return this;
  }

  disabled(condition: boolean | ((ctx: FormContext) => boolean)): this {
    this._config.disabled = condition;
    return this;
  }

  loading(condition: boolean | ((ctx: FormContext) => boolean)): this {
    this._config.loading = condition;
    return this;
  }

  position(pos: "left" | "right"): this {
    this._config.position = pos;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  _getConfig(): PageActionConfig {
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
 * // Dashboard page with multiple widgets
 * class DashboardPage extends WidgetPage {
 *   configure() {
 *     this.title("Dashboard")
 *       .subtitle("Overview of your account")
 *       .layout({ type: "grid", columns: 2, gap: 16 });
 *
 *     // Breadcrumbs
 *     this.breadcrumbs([
 *       { label: "Home", href: "/" },
 *       { label: "Dashboard" },
 *     ]);
 *
 *     // Header actions
 *     this.headerAction("refresh", "Refresh")
 *       .icon("refresh")
 *       .onClick((ctx) => ctx.refresh())
 *       .end();
 *
 *     this.headerAction("export", "Export")
 *       .icon("download")
 *       .variant("secondary")
 *       .onClick((ctx) => this.export(ctx))
 *       .end();
 *
 *     // Widgets
 *     this.widget("stats")
 *       .title("Quick Stats")
 *       .component(StatsCard)
 *       .span(2) // Full width
 *       .end();
 *
 *     this.widget("recent-orders")
 *       .title("Recent Orders")
 *       .table(RecentOrdersTable)
 *       .end();
 *
 *     this.widget("sales-chart")
 *       .title("Sales Chart")
 *       .component(SalesChart)
 *       .refreshInterval(60000) // Refresh every minute
 *       .end();
 *
 *     this.widget("quick-actions")
 *       .title("Quick Actions")
 *       .form(QuickActionsForm)
 *       .collapsible()
 *       .end();
 *   }
 *
 *   async onInit(ctx: FormContext) {
 *     await ctx.api.dashboard.load();
 *   }
 * }
 *
 * // Detail page with form
 * class UserDetailPage extends WidgetPage {
 *   configure() {
 *     this.title((ctx) => `User: ${ctx.getValue("name")}`)
 *       .layout({ type: "stack", direction: "column", gap: 24 });
 *
 *     this.breadcrumbs((ctx) => [
 *       { label: "Users", href: "/users" },
 *       { label: ctx.getValue("name") },
 *     ]);
 *
 *     this.headerAction("save", "Save")
 *       .variant("primary")
 *       .onClick((ctx) => ctx.submitForm("save"))
 *       .end();
 *
 *     this.headerAction("delete", "Delete")
 *       .variant("danger")
 *       .onClick((ctx) => this.confirmDelete(ctx))
 *       .end();
 *
 *     this.widget("user-form")
 *       .form(UserForm)
 *       .end();
 *
 *     this.widget("user-activity")
 *       .title("Activity Log")
 *       .table(UserActivityTable)
 *       .collapsible(true) // Start collapsed
 *       .end();
 *   }
 * }
 *
 * // Split layout page
 * class MasterDetailPage extends WidgetPage {
 *   configure() {
 *     this.title("Inventory")
 *       .layout({ type: "split", splitRatio: [30, 70] });
 *
 *     this.widget("item-list")
 *       .table(ItemListTable)
 *       .end();
 *
 *     this.widget("item-detail")
 *       .form(ItemDetailForm)
 *       .visibleByCondition((ctx) => ctx.getValue("selectedItem"))
 *       .end();
 *   }
 * }
 * ```
 */
export abstract class WidgetPage {
  protected readonly _id: string;
  protected _title?: string | ((ctx: FormContext) => string);
  protected _subtitle?: string | ((ctx: FormContext) => string);
  protected _layout?: PageLayoutConfig;
  protected _widgets: WidgetBuilderImpl<WidgetPage>[] = [];
  protected _headerActions: PageActionBuilderImpl<WidgetPage>[] = [];
  protected _breadcrumbs?: BreadcrumbItem[] | ((ctx: FormContext) => BreadcrumbItem[]);
  protected _loading?: boolean | ((ctx: FormContext) => boolean);
  protected _error?: ReactNode | ((ctx: FormContext) => ReactNode);
  protected _cssClass?: string;

  constructor(id: string) {
    this._id = id;
    this.configure();
  }

  /**
   * Abstract method to configure the page.
   * Override this method to define page content.
   */
  abstract configure(): void;

  // ===========================================================================
  // BUILDER METHODS
  // ===========================================================================

  /**
   * Set page title
   */
  protected title(title: string | ((ctx: FormContext) => string)): this {
    this._title = title;
    return this;
  }

  /**
   * Set page subtitle
   */
  protected subtitle(subtitle: string | ((ctx: FormContext) => string)): this {
    this._subtitle = subtitle;
    return this;
  }

  /**
   * Set page layout
   */
  protected layout(config: PageLayoutConfig): this {
    this._layout = config;
    return this;
  }

  /**
   * Add a widget to the page
   */
  protected widget(id: string): WidgetBuilderImpl<WidgetPage> {
    const widgetBuilder = new WidgetBuilderImpl<WidgetPage>(id, this);
    this._widgets.push(widgetBuilder);
    return widgetBuilder;
  }

  /**
   * Add a header action
   */
  protected headerAction(id: string, label: string): PageActionBuilderImpl<WidgetPage> {
    const actionBuilder = new PageActionBuilderImpl<WidgetPage>(id, label, this);
    this._headerActions.push(actionBuilder);
    return actionBuilder;
  }

  /**
   * Set breadcrumbs
   */
  protected breadcrumbs(items: BreadcrumbItem[] | ((ctx: FormContext) => BreadcrumbItem[])): this {
    this._breadcrumbs = items;
    return this;
  }

  /**
   * Set loading state
   */
  protected loading(loading: boolean | ((ctx: FormContext) => boolean)): this {
    this._loading = loading;
    return this;
  }

  /**
   * Set error content
   */
  protected error(content: ReactNode | ((ctx: FormContext) => ReactNode)): this {
    this._error = content;
    return this;
  }

  /**
   * Set CSS class
   */
  protected css(className: string): this {
    this._cssClass = className;
    return this;
  }

  // ===========================================================================
  // LIFECYCLE HOOKS (Override in subclass)
  // ===========================================================================

  /**
   * Called when page is initialized
   */
  onInit?(ctx: FormContext): void | Promise<void>;

  /**
   * Called when page is destroyed/unmounted
   */
  onDestroy?(ctx: FormContext): void;

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  /**
   * Get page ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get widget config by ID
   */
  getWidget(widgetId: string): PageWidgetConfig | undefined {
    return this._widgets.find((w) => w._getConfig().id === widgetId)?._getConfig();
  }

  /**
   * Get all widget IDs
   */
  getWidgetIds(): string[] {
    return this._widgets.map((w) => w._getConfig().id);
  }

  /**
   * Build the page configuration
   */
  build(): WidgetPageConfig {
    return {
      id: this._id,
      title: this._title,
      subtitle: this._subtitle,
      layout: this._layout,
      widgets: this._widgets.map((w) => w._getConfig()),
      headerActions: this._headerActions.length > 0 ? this._headerActions.map((a) => a._getConfig()) : undefined,
      breadcrumbs: this._breadcrumbs,
      loading: this._loading,
      error: this._error,
      cssClass: this._cssClass,
      onInit: this.onInit?.bind(this),
      onDestroy: this.onDestroy?.bind(this),
    };
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create widget page configuration inline without extending WidgetPage class.
 *
 * @example
 * ```typescript
 * const dashboardPage = createWidgetPage("dashboard", (p) => {
 *   p.title("Dashboard")
 *     .layout({ type: "grid", columns: 2 });
 *
 *   p.widget("stats").component(StatsCard).span(2).end();
 *   p.widget("chart").component(SalesChart).end();
 * });
 * ```
 */
export function createWidgetPage(
  id: string,
  configure: (page: WidgetPageConfigBuilder) => void
): WidgetPageConfig {
  const builder = new WidgetPageConfigBuilder(id);
  configure(builder);
  return builder.build();
}

/**
 * Builder for inline widget page creation
 */
class WidgetPageConfigBuilder {
  private _id: string;
  private _title?: string | ((ctx: FormContext) => string);
  private _subtitle?: string | ((ctx: FormContext) => string);
  private _layout?: PageLayoutConfig;
  private _widgets: WidgetBuilderImpl<WidgetPageConfigBuilder>[] = [];
  private _headerActions: PageActionBuilderImpl<WidgetPageConfigBuilder>[] = [];
  private _breadcrumbs?: BreadcrumbItem[] | ((ctx: FormContext) => BreadcrumbItem[]);
  private _loading?: boolean | ((ctx: FormContext) => boolean);
  private _error?: ReactNode | ((ctx: FormContext) => ReactNode);
  private _cssClass?: string;

  constructor(id: string) {
    this._id = id;
  }

  title(title: string | ((ctx: FormContext) => string)): this {
    this._title = title;
    return this;
  }

  subtitle(subtitle: string | ((ctx: FormContext) => string)): this {
    this._subtitle = subtitle;
    return this;
  }

  layout(config: PageLayoutConfig): this {
    this._layout = config;
    return this;
  }

  widget(id: string): WidgetBuilderImpl<WidgetPageConfigBuilder> {
    const widgetBuilder = new WidgetBuilderImpl<WidgetPageConfigBuilder>(id, this);
    this._widgets.push(widgetBuilder);
    return widgetBuilder;
  }

  headerAction(id: string, label: string): PageActionBuilderImpl<WidgetPageConfigBuilder> {
    const actionBuilder = new PageActionBuilderImpl<WidgetPageConfigBuilder>(id, label, this);
    this._headerActions.push(actionBuilder);
    return actionBuilder;
  }

  breadcrumbs(items: BreadcrumbItem[] | ((ctx: FormContext) => BreadcrumbItem[])): this {
    this._breadcrumbs = items;
    return this;
  }

  loading(loading: boolean | ((ctx: FormContext) => boolean)): this {
    this._loading = loading;
    return this;
  }

  error(content: ReactNode | ((ctx: FormContext) => ReactNode)): this {
    this._error = content;
    return this;
  }

  css(className: string): this {
    this._cssClass = className;
    return this;
  }

  build(): WidgetPageConfig {
    return {
      id: this._id,
      title: this._title,
      subtitle: this._subtitle,
      layout: this._layout,
      widgets: this._widgets.map((w) => w._getConfig()),
      headerActions: this._headerActions.length > 0 ? this._headerActions.map((a) => a._getConfig()) : undefined,
      breadcrumbs: this._breadcrumbs,
      loading: this._loading,
      error: this._error,
      cssClass: this._cssClass,
    };
  }
}
