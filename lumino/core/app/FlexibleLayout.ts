/**
 * Lumino Framework - Flexible Layout System
 *
 * A fully customizable grid/container-based layout system that allows developers
 * to build any layout structure using rows, columns, and areas.
 *
 * Key Features:
 * - Grid-based layout with rows and columns
 * - `.content()` marks where route page content renders
 * - Event subscriptions for notifications, route changes, form events
 * - Flexible component placement anywhere in the layout
 *
 * @example
 * ```typescript
 * class DemoLayout extends FlexibleLayout {
 *   configure() {
 *     // Build any layout structure
 *     this.grid()
 *       // Header row
 *       .row()
 *         .height(56)
 *         .css("app-header")
 *         .column().width(200).add(Logo).end()
 *         .column().flex(1).add(MainNav).end()
 *         .column().width(200).add(UserMenu).end()
 *       .endRow()
 *       // Main content row
 *       .row()
 *         .flex(1)
 *         .column().width(260).add(SidebarNav).end()
 *         .column().flex(1).content().end()  // Page renders here
 *       .endRow()
 *       // Footer row
 *       .row()
 *         .height(48)
 *         .css("app-footer")
 *         .column().flex(1).add(FooterContent).end()
 *       .endRow()
 *     .endGrid();
 *
 *     // Event subscriptions
 *     this.onNotify((message, type) => {
 *       // Handle notifications
 *     });
 *
 *     this.onRouteChange((from, to) => {
 *       // Handle route changes
 *     });
 *   }
 * }
 * ```
 */

import type { CSSProperties } from "react";
import type { ComponentType, ComponentProps } from "../types/base";
import { eventEmitter } from "../events/EventEmitter";
import type { EventCallback } from "../events/EventEmitter";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Inline style type - static or dynamic based on context
 */
export type LayoutStyle<TContext> = CSSProperties | ((ctx: TContext) => CSSProperties);

/**
 * CSS class type - static or dynamic based on context
 */
export type LayoutCssClass<TContext> = string | ((ctx: TContext) => string);

/**
 * Layout context passed to components and props functions
 */
export interface FlexibleLayoutContext {
  /** Current route path */
  currentRoute: string;
  /** Route params */
  params: Record<string, string>;
  /** Query params */
  query: Record<string, string>;
  /** Layout state (for dynamic updates) */
  state: Record<string, any>;
  /** Update layout state */
  setState: (key: string, value: any) => void;
}

/**
 * Component configuration within layout areas
 */
export interface LayoutAreaComponent {
  type: "component";
  component: ComponentType;
  props?: ComponentProps | ((ctx: FlexibleLayoutContext) => ComponentProps);
  visible?: boolean | ((ctx: FlexibleLayoutContext) => boolean);
  /** CSS class (static or dynamic based on context) */
  cssClass?: LayoutCssClass<FlexibleLayoutContext>;
  /** Inline styles (static or dynamic based on context) */
  style?: LayoutStyle<FlexibleLayoutContext>;
}

/**
 * Text content within layout areas
 */
export interface LayoutAreaText {
  type: "text";
  text: string | ((ctx: FlexibleLayoutContext) => string);
  /** CSS class (static or dynamic based on context) */
  cssClass?: LayoutCssClass<FlexibleLayoutContext>;
  /** Inline styles (static or dynamic based on context) */
  style?: LayoutStyle<FlexibleLayoutContext>;
}

/**
 * Navigation items configuration
 */
export interface LayoutNavItem {
  path: string;
  label: string;
  icon?: string;
  children?: LayoutNavItem[];
  badge?: string | number | ((ctx: FlexibleLayoutContext) => string | number | undefined);
  disabled?: boolean;
  visible?: boolean | ((ctx: FlexibleLayoutContext) => boolean);
}

/**
 * Navigation area configuration
 */
export interface LayoutAreaNav {
  type: "nav";
  items: LayoutNavItem[];
  orientation?: "horizontal" | "vertical";
  /** CSS class (static or dynamic based on context) */
  cssClass?: LayoutCssClass<FlexibleLayoutContext>;
  /** Inline styles (static or dynamic based on context) */
  style?: LayoutStyle<FlexibleLayoutContext>;
}

/**
 * Content placeholder (where route pages render)
 */
export interface LayoutAreaContent {
  type: "content";
  /** CSS class (static or dynamic based on context) */
  cssClass?: LayoutCssClass<FlexibleLayoutContext>;
  /** Inline styles (static or dynamic based on context) */
  style?: LayoutStyle<FlexibleLayoutContext>;
}

/**
 * Slot for custom content injection
 */
export interface LayoutAreaSlot {
  type: "slot";
  name: string;
  /** CSS class (static or dynamic based on context) */
  cssClass?: LayoutCssClass<FlexibleLayoutContext>;
  /** Inline styles (static or dynamic based on context) */
  style?: LayoutStyle<FlexibleLayoutContext>;
}

/**
 * Union type for all area content types
 */
export type LayoutAreaItem =
  | LayoutAreaComponent
  | LayoutAreaText
  | LayoutAreaNav
  | LayoutAreaContent
  | LayoutAreaSlot;

/**
 * Column configuration within a row
 */
export interface LayoutColumn {
  /** Fixed width in pixels */
  width?: number;
  /** Flex grow factor */
  flex?: number;
  /** Min width */
  minWidth?: number;
  /** Max width */
  maxWidth?: number;
  /** Items in this column */
  items: LayoutAreaItem[];
  /** CSS class (static or dynamic based on context) */
  cssClass?: LayoutCssClass<FlexibleLayoutContext>;
  /** Inline styles (static or dynamic based on context) */
  style?: LayoutStyle<FlexibleLayoutContext>;
  /** Alignment within column */
  align?: "start" | "center" | "end" | "stretch";
  /** Justify content */
  justify?: "start" | "center" | "end" | "space-between" | "space-around";
  /** Gap between items */
  gap?: number;
  /** Padding */
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  /** Background color/style */
  background?: string;
  /** Visibility */
  visible?: boolean | ((ctx: FlexibleLayoutContext) => boolean);
}

/**
 * Row configuration within the grid
 */
export interface LayoutRow {
  /** Fixed height in pixels */
  height?: number;
  /** Flex grow factor */
  flex?: number;
  /** Min height */
  minHeight?: number;
  /** Max height */
  maxHeight?: number;
  /** Columns in this row */
  columns: LayoutColumn[];
  /** CSS class (static or dynamic based on context) */
  cssClass?: LayoutCssClass<FlexibleLayoutContext>;
  /** Inline styles (static or dynamic based on context) */
  style?: LayoutStyle<FlexibleLayoutContext>;
  /** Gap between columns */
  gap?: number;
  /** Padding */
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  /** Background color/style */
  background?: string;
  /** Visibility */
  visible?: boolean | ((ctx: FlexibleLayoutContext) => boolean);
}

/**
 * Complete grid layout configuration
 */
export interface LayoutGrid {
  /** Rows in the grid */
  rows: LayoutRow[];
  /** Gap between rows */
  gap?: number;
  /** CSS class for the grid container (static or dynamic based on context) */
  cssClass?: LayoutCssClass<FlexibleLayoutContext>;
  /** Inline styles (static or dynamic based on context) */
  style?: LayoutStyle<FlexibleLayoutContext>;
}

/**
 * Complete flexible layout configuration
 */
export interface FlexibleLayoutConfig {
  id: string;
  grid: LayoutGrid;
  /** Whether layout has a content area */
  hasContent: boolean;
}

// =============================================================================
// COLUMN BUILDER
// =============================================================================

class ColumnBuilder<TParent> {
  private _config: LayoutColumn = { items: [] };
  private _parent: TParent;
  private _onComplete: (config: LayoutColumn) => void;

  constructor(parent: TParent, onComplete: (config: LayoutColumn) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  /** Set fixed width in pixels */
  width(width: number): this {
    this._config.width = width;
    return this;
  }

  /** Set flex grow factor */
  flex(factor: number): this {
    this._config.flex = factor;
    return this;
  }

  /** Set min width */
  minWidth(width: number): this {
    this._config.minWidth = width;
    return this;
  }

  /** Set max width */
  maxWidth(width: number): this {
    this._config.maxWidth = width;
    return this;
  }

  /** Set CSS class (static or dynamic based on context) */
  css(className: LayoutCssClass<FlexibleLayoutContext>): this {
    this._config.cssClass = className;
    return this;
  }

  /** Set inline styles (static or dynamic based on context) */
  style(styles: LayoutStyle<FlexibleLayoutContext>): this {
    this._config.style = styles;
    return this;
  }

  /** Set alignment */
  align(alignment: "start" | "center" | "end" | "stretch"): this {
    this._config.align = alignment;
    return this;
  }

  /** Set justify content */
  justify(justify: "start" | "center" | "end" | "space-between" | "space-around"): this {
    this._config.justify = justify;
    return this;
  }

  /** Set gap between items */
  gap(gap: number): this {
    this._config.gap = gap;
    return this;
  }

  /** Set padding */
  padding(padding: number | { top?: number; right?: number; bottom?: number; left?: number }): this {
    this._config.padding = padding;
    return this;
  }

  /** Set background */
  background(bg: string): this {
    this._config.background = bg;
    return this;
  }

  /** Set visibility */
  visible(condition: boolean | ((ctx: FlexibleLayoutContext) => boolean)): this {
    this._config.visible = condition;
    return this;
  }

  /** Add a component to this column */
  add(component: ComponentType): ComponentInColumnBuilder<ColumnBuilder<TParent>> {
    return new ComponentInColumnBuilder(component, this, (item) => {
      this._config.items.push(item);
    });
  }

  /** Add text content to this column */
  text(content: string | ((ctx: FlexibleLayoutContext) => string), cssClass?: string): this {
    this._config.items.push({
      type: "text",
      text: content,
      cssClass,
    });
    return this;
  }

  /** Add navigation to this column */
  nav(): NavBuilder<ColumnBuilder<TParent>> {
    return new NavBuilder(this, (item) => {
      this._config.items.push(item);
    });
  }

  /** Mark this column as the content area (where page renders) */
  content(cssClass?: string): this {
    this._config.items.push({
      type: "content",
      cssClass,
    });
    return this;
  }

  /** Add a named slot for custom content injection */
  slot(name: string, cssClass?: string): this {
    this._config.items.push({
      type: "slot",
      name,
      cssClass,
    });
    return this;
  }

  /** End column definition and return to row */
  end(): TParent {
    this._onComplete(this._config);
    return this._parent;
  }
}

// =============================================================================
// COMPONENT IN COLUMN BUILDER
// =============================================================================

class ComponentInColumnBuilder<TParent> {
  private _item: LayoutAreaComponent;
  private _parent: TParent;
  private _onComplete: (item: LayoutAreaItem) => void;

  constructor(
    component: ComponentType,
    parent: TParent,
    onComplete: (item: LayoutAreaItem) => void
  ) {
    this._parent = parent;
    this._onComplete = onComplete;
    this._item = { type: "component", component };
  }

  /** Set component props */
  props(props: ComponentProps | ((ctx: FlexibleLayoutContext) => ComponentProps)): this {
    this._item.props = props;
    return this;
  }

  /** Set visibility condition */
  visible(condition: boolean | ((ctx: FlexibleLayoutContext) => boolean)): this {
    this._item.visible = condition;
    return this;
  }

  /** Set CSS class (static or dynamic based on context) */
  css(className: LayoutCssClass<FlexibleLayoutContext>): this {
    this._item.cssClass = className;
    return this;
  }

  /** Set inline styles (static or dynamic based on context) */
  style(styles: LayoutStyle<FlexibleLayoutContext>): this {
    this._item.style = styles;
    return this;
  }

  /** End component definition and return to column */
  end(): TParent {
    this._onComplete(this._item);
    return this._parent;
  }
}

// =============================================================================
// NAV BUILDER
// =============================================================================

class NavBuilder<TParent> {
  private _item: LayoutAreaNav = { type: "nav", items: [] };
  private _parent: TParent;
  private _onComplete: (item: LayoutAreaItem) => void;

  constructor(parent: TParent, onComplete: (item: LayoutAreaItem) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  /** Set navigation orientation */
  orientation(orient: "horizontal" | "vertical"): this {
    this._item.orientation = orient;
    return this;
  }

  /** Set CSS class (static or dynamic based on context) */
  css(className: LayoutCssClass<FlexibleLayoutContext>): this {
    this._item.cssClass = className;
    return this;
  }

  /** Set inline styles (static or dynamic based on context) */
  style(styles: LayoutStyle<FlexibleLayoutContext>): this {
    this._item.style = styles;
    return this;
  }

  /** Add a navigation item */
  addItem(path: string, label: string, options?: Partial<Omit<LayoutNavItem, "path" | "label">>): this {
    this._item.items.push({ path, label, ...options });
    return this;
  }

  /** Add a navigation group with children */
  addGroup(label: string, children: LayoutNavItem[]): this {
    this._item.items.push({ path: "", label, children });
    return this;
  }

  /** Add a divider */
  addDivider(): this {
    this._item.items.push({ path: "", label: "---divider---", disabled: true });
    return this;
  }

  /** End navigation definition and return to column */
  end(): TParent {
    this._onComplete(this._item);
    return this._parent;
  }
}

// =============================================================================
// ROW BUILDER
// =============================================================================

class RowBuilder<TParent> {
  private _config: LayoutRow = { columns: [] };
  private _parent: TParent;
  private _onComplete: (config: LayoutRow) => void;

  constructor(parent: TParent, onComplete: (config: LayoutRow) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  /** Set fixed height in pixels */
  height(height: number): this {
    this._config.height = height;
    return this;
  }

  /** Set flex grow factor */
  flex(factor: number): this {
    this._config.flex = factor;
    return this;
  }

  /** Set min height */
  minHeight(height: number): this {
    this._config.minHeight = height;
    return this;
  }

  /** Set max height */
  maxHeight(height: number): this {
    this._config.maxHeight = height;
    return this;
  }

  /** Set CSS class (static or dynamic based on context) */
  css(className: LayoutCssClass<FlexibleLayoutContext>): this {
    this._config.cssClass = className;
    return this;
  }

  /** Set inline styles (static or dynamic based on context) */
  style(styles: LayoutStyle<FlexibleLayoutContext>): this {
    this._config.style = styles;
    return this;
  }

  /** Set gap between columns */
  gap(gap: number): this {
    this._config.gap = gap;
    return this;
  }

  /** Set padding */
  padding(padding: number | { top?: number; right?: number; bottom?: number; left?: number }): this {
    this._config.padding = padding;
    return this;
  }

  /** Set background */
  background(bg: string): this {
    this._config.background = bg;
    return this;
  }

  /** Set visibility */
  visible(condition: boolean | ((ctx: FlexibleLayoutContext) => boolean)): this {
    this._config.visible = condition;
    return this;
  }

  /** Add a column to this row */
  column(): ColumnBuilder<RowBuilder<TParent>> {
    return new ColumnBuilder(this, (col) => {
      this._config.columns.push(col);
    });
  }

  /** End row definition and return to grid */
  endRow(): TParent {
    this._onComplete(this._config);
    return this._parent;
  }
}

// =============================================================================
// GRID BUILDER
// =============================================================================

class GridBuilder<TParent> {
  private _config: LayoutGrid = { rows: [] };
  private _parent: TParent;
  private _onComplete: (config: LayoutGrid, hasContent: boolean) => void;
  private _hasContent: boolean = false;

  constructor(parent: TParent, onComplete: (config: LayoutGrid, hasContent: boolean) => void) {
    this._parent = parent;
    this._onComplete = onComplete;
  }

  /** Set gap between rows */
  gap(gap: number): this {
    this._config.gap = gap;
    return this;
  }

  /** Set CSS class for the grid container (static or dynamic based on context) */
  css(className: LayoutCssClass<FlexibleLayoutContext>): this {
    this._config.cssClass = className;
    return this;
  }

  /** Set inline styles for the grid container (static or dynamic based on context) */
  style(styles: LayoutStyle<FlexibleLayoutContext>): this {
    this._config.style = styles;
    return this;
  }

  /** Add a row to the grid */
  row(): RowBuilder<GridBuilder<TParent>> {
    return new RowBuilder(this, (row) => {
      // Check if this row contains content area
      for (const col of row.columns) {
        for (const item of col.items) {
          if (item.type === "content") {
            this._hasContent = true;
          }
        }
      }
      this._config.rows.push(row);
    });
  }

  /** End grid definition */
  endGrid(): TParent {
    this._onComplete(this._config, this._hasContent);
    return this._parent;
  }
}

// =============================================================================
// FLEXIBLE LAYOUT BASE CLASS
// =============================================================================

/**
 * State subscriber function type
 */
export type FlexibleLayoutStateSubscriber = (state: Record<string, any>) => void;

/**
 * Abstract base class for flexible layouts.
 *
 * Use the grid builder to create any layout structure.
 * The `.content()` method marks where route pages render.
 */
export abstract class FlexibleLayout {
  protected _id: string;
  protected _gridConfig: LayoutGrid = { rows: [] };
  protected _hasContent: boolean = false;
  protected _state: Record<string, any> = {};
  protected _eventUnsubscribers: Array<() => void> = [];
  protected _stateSubscribers: Set<FlexibleLayoutStateSubscriber> = new Set();
  protected _slotContent: Map<string, React.ReactNode> = new Map();

  constructor(id: string) {
    this._id = id;
    // Call configure synchronously to ensure grid config is available immediately
    // This is necessary because FlexibleLayoutRenderer reads config.grid.rows on first render
    this.configure();
  }

  /**
   * Override this method to configure the layout
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
  getConfig(): FlexibleLayoutConfig {
    return {
      id: this._id,
      grid: this._gridConfig,
      hasContent: this._hasContent,
    };
  }

  /**
   * Check if layout has a content area
   */
  hasContentArea(): boolean {
    return this._hasContent;
  }

  // =============================================================================
  // BUILDER METHODS
  // =============================================================================

  /**
   * Start building the grid layout
   */
  protected grid(): GridBuilder<this> {
    return new GridBuilder(this, (config, hasContent) => {
      this._gridConfig = config;
      this._hasContent = hasContent;
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
  subscribeToState(subscriber: FlexibleLayoutStateSubscriber): () => void {
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
   * Subscribe to any event
   */
  protected onEvent(eventName: string, handler: EventCallback): this {
    const unsubscribe = eventEmitter.on(eventName, handler);
    this._eventUnsubscribers.push(unsubscribe);
    return this;
  }

  /**
   * Subscribe to notification events
   */
  protected onNotify(handler: (message: string, type: "success" | "error" | "warning" | "info", data?: any) => void): this {
    return this.onEvent("ui:notify", ({ message, type, ...data }) => {
      handler(message, type, data);
    });
  }

  /**
   * Subscribe to route change events
   */
  protected onRouteChange(handler: (from: string, to: string) => void): this {
    return this.onEvent("navigation:end", ({ from, to }) => {
      handler(from, to);
    });
  }

  /**
   * Subscribe to route start events (before navigation completes)
   */
  protected onRouteStart(handler: (from: string, to: string) => void): this {
    return this.onEvent("navigation:start", ({ from, to }) => {
      handler(from, to);
    });
  }

  /**
   * Subscribe to form submit events
   */
  protected onFormSubmit(handler: (formId: string, data: any) => void): this {
    return this.onEvent("form:submit", ({ formId, data }) => {
      handler(formId, data);
    });
  }

  /**
   * Subscribe to form validation error events
   */
  protected onFormError(handler: (formId: string, errors: any) => void): this {
    return this.onEvent("form:error", ({ formId, errors }) => {
      handler(formId, errors);
    });
  }

  /**
   * Subscribe to API error events
   */
  protected onApiError(handler: (url: string, error: any) => void): this {
    return this.onEvent("api:error", ({ url, error }) => {
      handler(url, error);
    });
  }

  /**
   * Subscribe to auth events
   */
  protected onAuth(event: "login" | "logout" | "session-expired", handler: (data?: any) => void): this {
    return this.onEvent(`auth:${event}`, handler);
  }

  /**
   * Subscribe to app lifecycle events
   */
  protected onApp(event: "ready" | "error" | "loading", handler: (data?: any) => void): this {
    return this.onEvent(`app:${event}`, handler);
  }

  /**
   * Emit an event
   */
  emit(eventName: string, data?: any): void {
    eventEmitter.emit(eventName, data);
  }

  /**
   * Show a notification (convenience method)
   */
  notify(message: string, type: "success" | "error" | "warning" | "info" = "info"): void {
    this.emit("ui:notify", { message, type });
  }

  // =============================================================================
  // SLOT CONTENT
  // =============================================================================

  /**
   * Set content for a named slot
   */
  setSlotContent(slotName: string, content: React.ReactNode): void {
    this._slotContent.set(slotName, content);
    this._notifyStateChange();
  }

  /**
   * Get content for a named slot
   */
  getSlotContent(slotName: string): React.ReactNode | undefined {
    return this._slotContent.get(slotName);
  }

  /**
   * Clear slot content
   */
  clearSlotContent(slotName: string): void {
    this._slotContent.delete(slotName);
    this._notifyStateChange();
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
    this._slotContent.clear();
    this.onUnmount?.();
  }
}

// =============================================================================
// REGISTRY
// =============================================================================

let _flexibleLayoutInstance: FlexibleLayout | null = null;

/**
 * Register flexible layout
 */
export function registerFlexibleLayout(layout: FlexibleLayout): void {
  _flexibleLayoutInstance = layout;
}

/**
 * Get registered flexible layout
 */
export function getFlexibleLayout(): FlexibleLayout | null {
  return _flexibleLayoutInstance;
}

/**
 * Clear flexible layout (for testing)
 */
export function clearFlexibleLayout(): void {
  _flexibleLayoutInstance = null;
}
