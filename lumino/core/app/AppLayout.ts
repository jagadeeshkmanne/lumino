/**
 * Lumino Framework - AppLayout
 *
 * Defines the application shell with header, sidebar, main content, and footer.
 * Uses fluent builder pattern like Page and Form classes.
 *
 * @example
 * ```typescript
 * class DemoAppLayout extends AppLayout {
 *   configure() {
 *     this.header()
 *       .title("Lumino Demo")
 *       .addComponent(NotificationBell)
 *         .props({ count: 3 })
 *         .end()
 *       .addComponent(UserMenu)
 *         .end()
 *       .end();
 *
 *     this.sidebar()
 *       .width(260)
 *       .addItem("/", "Home", { icon: "home" })
 *       .addItem("/forms", "Forms", { icon: "document" })
 *       .addItem("/api", "API Demo", { icon: "api" })
 *       .end();
 *
 *     this.footer()
 *       .text("Built with Lumino")
 *       .end();
 *
 *     // Global event handlers
 *     this.onEvent("notification:new", (data) => {
 *       this.updateState("notificationCount", (count) => count + 1);
 *     });
 *   }
 * }
 * ```
 */

import type { ComponentType, ComponentProps } from "../types/base";
import { eventEmitter } from "../events/EventEmitter";
import type { EventCallback } from "../events/EventEmitter";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Layout context passed to components and props functions
 */
export interface LayoutContext {
  /** Current route path */
  currentRoute: string;
  /** Layout state (for dynamic updates) */
  state: Record<string, any>;
  /** Update layout state */
  setState: (key: string, value: any) => void;
}

/**
 * Component configuration for layout sections
 */
export interface LayoutComponentConfig {
  component: ComponentType;
  props?: ComponentProps | ((ctx: LayoutContext) => ComponentProps);
  visible?: boolean | ((ctx: LayoutContext) => boolean);
  /** Flex grow factor */
  flex?: number;
  /** Margin */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  /** CSS class */
  cssClass?: string;
}

/**
 * Row configuration for flexible layout within header/sidebar/footer
 */
export interface LayoutRowConfig {
  components: LayoutComponentConfig[];
  /** Gap between components */
  gap?: number;
  /** Alignment: start, center, end, space-between */
  justify?: "start" | "center" | "end" | "space-between" | "space-around";
  /** Vertical alignment */
  align?: "start" | "center" | "end" | "stretch";
  /** CSS class */
  cssClass?: string;
}

export interface NavItem {
  path: string;
  label: string;
  icon?: string;
  children?: NavItem[];
  badge?: string | number | ((ctx: LayoutContext) => string | number | undefined);
  disabled?: boolean;
  visible?: boolean | ((ctx: LayoutContext) => boolean);
}

export interface HeaderConfig {
  title?: string;
  subtitle?: string;
  logo?: string;
  showTitle?: boolean;
  /** Components on the left side of header (after logo/title) */
  leftComponents?: LayoutComponentConfig[];
  /** Components on the right side of header */
  rightComponents?: LayoutComponentConfig[];
  /** Height in pixels */
  height?: number;
  /** CSS class */
  cssClass?: string;
}

export interface SidebarConfig {
  width?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  items: NavItem[];
  /** Components at the top of sidebar (above navigation) */
  topComponents?: LayoutComponentConfig[];
  /** Components at the bottom of sidebar (below navigation) */
  bottomComponents?: LayoutComponentConfig[];
  /** CSS class */
  cssClass?: string;
}

export interface FooterConfig {
  text?: string;
  showVersion?: boolean;
  links?: Array<{ label: string; href: string }>;
  /** Components on the left side of footer */
  leftComponents?: LayoutComponentConfig[];
  /** Components on the right side of footer */
  rightComponents?: LayoutComponentConfig[];
  /** Height in pixels */
  height?: number;
  /** CSS class */
  cssClass?: string;
}

export interface AppLayoutConfig {
  id: string;
  header?: HeaderConfig;
  sidebar?: SidebarConfig;
  footer?: FooterConfig;
}

// =============================================================================
// LAYOUT COMPONENT BUILDER
// =============================================================================

/**
 * Builder for components within layout sections
 */
class LayoutComponentBuilder<TParent> {
  private _config: LayoutComponentConfig;
  private _parent: TParent;
  private _onComplete: (config: LayoutComponentConfig) => void;

  constructor(
    component: ComponentType,
    parent: TParent,
    onComplete: (config: LayoutComponentConfig) => void
  ) {
    this._parent = parent;
    this._onComplete = onComplete;
    this._config = { component };
  }

  props(props: ComponentProps | ((ctx: LayoutContext) => ComponentProps)): this {
    this._config.props = props;
    return this;
  }

  visible(condition: boolean | ((ctx: LayoutContext) => boolean)): this {
    this._config.visible = condition;
    return this;
  }

  end(): TParent {
    this._onComplete(this._config);
    return this._parent;
  }
}

// =============================================================================
// HEADER BUILDER
// =============================================================================

class HeaderBuilder<TParent> {
  private _config: HeaderConfig = { showTitle: true, leftComponents: [], rightComponents: [] };
  private _parent: TParent;
  private _onComplete: (config: HeaderConfig) => void;

  constructor(parent: TParent, onComplete: (config: HeaderConfig) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  title(title: string): this {
    this._config.title = title;
    return this;
  }

  subtitle(subtitle: string): this {
    this._config.subtitle = subtitle;
    return this;
  }

  logo(logoUrl: string): this {
    this._config.logo = logoUrl;
    return this;
  }

  hideTitle(): this {
    this._config.showTitle = false;
    return this;
  }

  height(height: number): this {
    this._config.height = height;
    return this;
  }

  css(className: string): this {
    this._config.cssClass = className;
    return this;
  }

  /**
   * Add a component to the left side of header (after logo/title)
   */
  addLeftComponent(component: ComponentType): LayoutComponentBuilder<HeaderBuilder<TParent>> {
    return new LayoutComponentBuilder(component, this, (config) => {
      if (!this._config.leftComponents) {
        this._config.leftComponents = [];
      }
      this._config.leftComponents.push(config);
    });
  }

  /**
   * Add a component to the right side of header
   */
  addRightComponent(component: ComponentType): LayoutComponentBuilder<HeaderBuilder<TParent>> {
    return new LayoutComponentBuilder(component, this, (config) => {
      if (!this._config.rightComponents) {
        this._config.rightComponents = [];
      }
      this._config.rightComponents.push(config);
    });
  }

  /**
   * Shorthand for addRightComponent (most common use case)
   */
  addComponent(component: ComponentType): LayoutComponentBuilder<HeaderBuilder<TParent>> {
    return this.addRightComponent(component);
  }

  end(): TParent {
    this._onComplete(this._config);
    return this._parent;
  }
}

// =============================================================================
// SIDEBAR BUILDER
// =============================================================================

class SidebarBuilder<TParent> {
  private _config: SidebarConfig = {
    width: 260,
    collapsible: false,
    defaultCollapsed: false,
    items: [],
    topComponents: [],
    bottomComponents: [],
  };
  private _parent: TParent;
  private _onComplete: (config: SidebarConfig) => void;

  constructor(parent: TParent, onComplete: (config: SidebarConfig) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  width(width: number): this {
    this._config.width = width;
    return this;
  }

  collapsible(defaultCollapsed: boolean = false): this {
    this._config.collapsible = true;
    this._config.defaultCollapsed = defaultCollapsed;
    return this;
  }

  css(className: string): this {
    this._config.cssClass = className;
    return this;
  }

  addItem(path: string, label: string, options?: Partial<Omit<NavItem, "path" | "label">>): this {
    this._config.items.push({
      path,
      label,
      ...options,
    });
    return this;
  }

  addGroup(label: string, children: NavItem[]): this {
    this._config.items.push({
      path: "",
      label,
      children,
    });
    return this;
  }

  addDivider(): this {
    this._config.items.push({
      path: "",
      label: "---divider---",
      disabled: true,
    });
    return this;
  }

  /**
   * Add a component to the top of sidebar (above navigation)
   */
  addTopComponent(component: ComponentType): LayoutComponentBuilder<SidebarBuilder<TParent>> {
    return new LayoutComponentBuilder(component, this, (config) => {
      if (!this._config.topComponents) {
        this._config.topComponents = [];
      }
      this._config.topComponents.push(config);
    });
  }

  /**
   * Add a component to the bottom of sidebar (below navigation)
   */
  addBottomComponent(component: ComponentType): LayoutComponentBuilder<SidebarBuilder<TParent>> {
    return new LayoutComponentBuilder(component, this, (config) => {
      if (!this._config.bottomComponents) {
        this._config.bottomComponents = [];
      }
      this._config.bottomComponents.push(config);
    });
  }

  end(): TParent {
    this._onComplete(this._config);
    return this._parent;
  }
}

// =============================================================================
// FOOTER BUILDER
// =============================================================================

class FooterBuilder<TParent> {
  private _config: FooterConfig = { leftComponents: [], rightComponents: [] };
  private _parent: TParent;
  private _onComplete: (config: FooterConfig) => void;

  constructor(parent: TParent, onComplete: (config: FooterConfig) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  text(text: string): this {
    this._config.text = text;
    return this;
  }

  showVersion(): this {
    this._config.showVersion = true;
    return this;
  }

  height(height: number): this {
    this._config.height = height;
    return this;
  }

  css(className: string): this {
    this._config.cssClass = className;
    return this;
  }

  addLink(label: string, href: string): this {
    if (!this._config.links) {
      this._config.links = [];
    }
    this._config.links.push({ label, href });
    return this;
  }

  /**
   * Add a component to the left side of footer
   */
  addLeftComponent(component: ComponentType): LayoutComponentBuilder<FooterBuilder<TParent>> {
    return new LayoutComponentBuilder(component, this, (config) => {
      if (!this._config.leftComponents) {
        this._config.leftComponents = [];
      }
      this._config.leftComponents.push(config);
    });
  }

  /**
   * Add a component to the right side of footer
   */
  addRightComponent(component: ComponentType): LayoutComponentBuilder<FooterBuilder<TParent>> {
    return new LayoutComponentBuilder(component, this, (config) => {
      if (!this._config.rightComponents) {
        this._config.rightComponents = [];
      }
      this._config.rightComponents.push(config);
    });
  }

  /**
   * Shorthand for addRightComponent
   */
  addComponent(component: ComponentType): LayoutComponentBuilder<FooterBuilder<TParent>> {
    return this.addRightComponent(component);
  }

  end(): TParent {
    this._onComplete(this._config);
    return this._parent;
  }
}

// =============================================================================
// APP LAYOUT BASE CLASS
// =============================================================================

/**
 * State subscriber function type
 */
export type LayoutStateSubscriber = (state: Record<string, any>) => void;

/**
 * Abstract base class for defining application layouts.
 *
 * Extend this class and implement `configure()` to define your app shell.
 * Similar to Page and Form - uses builder pattern with component support and events.
 *
 * @example
 * ```typescript
 * class MyAppLayout extends AppLayout {
 *   configure() {
 *     // Initialize state
 *     this.initState({
 *       notificationCount: 0,
 *       user: null,
 *     });
 *
 *     this.header()
 *       .title("My App")
 *       .addComponent(NotificationBell)
 *         .props((ctx) => ({ count: ctx.state.notificationCount }))
 *         .end()
 *       .addComponent(UserMenu)
 *         .props((ctx) => ({ user: ctx.state.user }))
 *         .end()
 *       .end();
 *
 *     this.sidebar()
 *       .width(240)
 *       .addItem("/", "Dashboard")
 *       .addItem("/users", "Users")
 *       .addItem("/settings", "Settings")
 *       .end();
 *
 *     this.footer()
 *       .text("© 2024 My Company")
 *       .end();
 *
 *     // Global event handlers
 *     this.onEvent("notification:new", () => {
 *       this.updateState("notificationCount", (count) => count + 1);
 *     });
 *
 *     this.onEvent("auth:login", (data) => {
 *       this.setState("user", data.user);
 *     });
 *   }
 * }
 * ```
 */
export abstract class AppLayout {
  protected _id: string;
  protected _headerConfig?: HeaderConfig;
  protected _sidebarConfig?: SidebarConfig;
  protected _footerConfig?: FooterConfig;
  protected _state: Record<string, any> = {};
  protected _eventUnsubscribers: Array<() => void> = [];
  protected _stateSubscribers: Set<LayoutStateSubscriber> = new Set();

  constructor(id: string) {
    this._id = id;
    // Call configure after construction (defer to allow subclass to initialize)
    queueMicrotask(() => this.configure());
  }

  /**
   * Override this method to configure the app layout
   */
  abstract configure(): void;

  /**
   * Get layout ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get the complete layout configuration
   */
  getConfig(): AppLayoutConfig {
    return {
      id: this._id,
      header: this._headerConfig,
      sidebar: this._sidebarConfig,
      footer: this._footerConfig,
    };
  }

  // =============================================================================
  // BUILDER METHODS
  // =============================================================================

  /**
   * Configure header section
   */
  protected header(): HeaderBuilder<this> {
    return new HeaderBuilder(this, (config) => {
      this._headerConfig = config;
    });
  }

  /**
   * Configure sidebar navigation
   */
  protected sidebar(): SidebarBuilder<this> {
    return new SidebarBuilder(this, (config) => {
      this._sidebarConfig = config;
    });
  }

  /**
   * Configure footer section
   */
  protected footer(): FooterBuilder<this> {
    return new FooterBuilder(this, (config) => {
      this._footerConfig = config;
    });
  }

  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================

  /**
   * Initialize layout state
   */
  protected initState(initialState: Record<string, any>): this {
    this._state = { ...initialState };
    return this;
  }

  /**
   * Set a state value
   */
  setState(key: string, value: any): void {
    this._state[key] = value;
    this._notifyStateChange();
  }

  /**
   * Update a state value using a function
   */
  updateState<T>(key: string, updater: (current: T) => T): void {
    this._state[key] = updater(this._state[key]);
    this._notifyStateChange();
  }

  /**
   * Get current state
   */
  getState(): Record<string, any> {
    return { ...this._state };
  }

  /**
   * Subscribe to state changes
   */
  subscribeToState(subscriber: LayoutStateSubscriber): () => void {
    this._stateSubscribers.add(subscriber);
    return () => {
      this._stateSubscribers.delete(subscriber);
    };
  }

  /**
   * Notify all subscribers of state change
   */
  private _notifyStateChange(): void {
    const state = this.getState();
    this._stateSubscribers.forEach((subscriber) => subscriber(state));
  }

  // =============================================================================
  // EVENT HANDLING
  // =============================================================================

  /**
   * Subscribe to global events
   */
  protected onEvent(eventName: string, handler: EventCallback): this {
    const unsubscribe = eventEmitter.on(eventName, handler);
    this._eventUnsubscribers.push(unsubscribe);
    return this;
  }

  /**
   * Emit an event
   */
  emit(eventName: string, data?: any): void {
    eventEmitter.emit(eventName, data);
  }

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  /**
   * Called when layout is mounted
   */
  onMount?(): void;

  /**
   * Called when layout is unmounted
   */
  onUnmount?(): void;

  /**
   * Clean up event subscriptions
   */
  destroy(): void {
    this._eventUnsubscribers.forEach((unsub) => unsub());
    this._eventUnsubscribers = [];
    this._stateSubscribers.clear();
    this.onUnmount?.();
  }
}

// =============================================================================
// REGISTRY
// =============================================================================

let _layoutInstance: AppLayout | null = null;

/**
 * Register app layout
 */
export function registerLayout(layout: AppLayout): void {
  _layoutInstance = layout;
}

/**
 * Get registered layout
 */
export function getLayout(): AppLayout | null {
  return _layoutInstance;
}

/**
 * Clear layout (for testing)
 */
export function clearLayout(): void {
  _layoutInstance = null;
}
