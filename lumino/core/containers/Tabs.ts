/**
 * Lumino Framework - Tabs Base Class
 *
 * Abstract base class for defining tabbed containers with fluent builder pattern.
 * UI-independent - renderers are handled by UI adapters.
 *
 * Can be used:
 * - Standalone in pages
 * - Inside forms
 * - Embedded in other containers
 * - Dynamic or static configuration
 */

import type { ComponentType, ReactNode } from "react";
import type { FormContext } from "../types/context";
import type { VisibilityCondition } from "../types/form";

// =============================================================================
// TAB CONFIG TYPES
// =============================================================================

/**
 * Configuration for a single tab
 */
export interface TabConfig {
  /** Tab ID/key */
  id: string;
  /** Tab label */
  label: string | ((ctx: FormContext) => string);
  /** Tab icon */
  icon?: ReactNode | string;
  /** Form class to render in this tab */
  form?: any; // Form class reference
  /** Custom component to render */
  component?: ComponentType<any>;
  /** Props for form/component */
  props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  /** Is tab disabled */
  disabled?: boolean | ((ctx: FormContext) => boolean);
  /** Is tab closable */
  closable?: boolean;
  /** Badge content */
  badge?: string | number | ((ctx: FormContext) => string | number | undefined);
  /** Visibility condition */
  visibility?: {
    hide?: VisibilityCondition;
    visible?: VisibilityCondition;
  };
  /** Custom render function (alternative to form/component) */
  render?: (ctx: FormContext) => ReactNode;
}

/**
 * Built tabs configuration
 */
export interface TabsConfig {
  /** Tabs ID */
  id: string;
  /** Tab configurations */
  tabs: TabConfig[];
  /** Initial active tab */
  initialTab?: string | number;
  /** Tab position */
  position?: "top" | "bottom" | "left" | "right";
  /** Allow adding new tabs */
  addable?: boolean;
  /** Add handler */
  onAdd?: (ctx: FormContext) => void;
  /** Add label */
  addLabel?: string;
  /** Tab close handler */
  onClose?: (tabId: string, ctx: FormContext) => void;
  /** Tab change handler */
  onChange?: (tabId: string, ctx: FormContext) => void;
  /** CSS class */
  cssClass?: string;
  /** Visibility */
  visibility?: {
    hide?: VisibilityCondition;
    visible?: VisibilityCondition;
  };
}

// =============================================================================
// TAB BUILDER IMPLEMENTATION
// =============================================================================

class TabBuilderImpl<TParent> {
  private _config: TabConfig;
  private _parent: TParent;

  constructor(id: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      id,
      label: id, // Default label to id
    };
  }

  label(label: string | ((ctx: FormContext) => string)): this {
    this._config.label = label;
    return this;
  }

  icon(icon: ReactNode | string): this {
    this._config.icon = icon;
    return this;
  }

  form(formClass: any, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._config.form = formClass;
    if (props) {
      this._config.props = props;
    }
    return this;
  }

  component(comp: ComponentType<any>, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
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

  disabled(condition: boolean | ((ctx: FormContext) => boolean)): this {
    this._config.disabled = condition;
    return this;
  }

  closable(closable: boolean = true): this {
    this._config.closable = closable;
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

  _getConfig(): TabConfig {
    return this._config;
  }
}

// =============================================================================
// TABS BASE CLASS
// =============================================================================

/**
 * Abstract base class for defining tabbed containers.
 *
 * @example
 * ```typescript
 * // Standalone tabs with different forms per tab
 * class SettingsTabs extends Tabs {
 *   configure() {
 *     this.tab("general")
 *       .label("General")
 *       .icon("settings")
 *       .form(GeneralSettingsForm)
 *       .end();
 *
 *     this.tab("security")
 *       .label("Security")
 *       .icon("shield")
 *       .form(SecuritySettingsForm)
 *       .end();
 *
 *     this.tab("notifications")
 *       .label("Notifications")
 *       .icon("bell")
 *       .form(NotificationSettingsForm)
 *       .badge(ctx => ctx.getValue("unreadCount"))
 *       .end();
 *   }
 * }
 *
 * // Dynamic tabs based on data
 * class DocumentTabs extends Tabs {
 *   configure() {
 *     this.position("left")
 *       .addable(true)
 *       .addLabel("+ New Document");
 *
 *     // Tabs can be added programmatically at runtime
 *   }
 *
 *   onAdd(ctx: FormContext) {
 *     const newDoc = { id: Date.now(), title: "Untitled" };
 *     ctx.setValue("documents", [...ctx.getValue("documents"), newDoc]);
 *   }
 * }
 * ```
 */
export abstract class Tabs {
  protected readonly _id: string;
  protected _tabs: TabBuilderImpl<Tabs>[] = [];
  protected _position: "top" | "bottom" | "left" | "right" = "top";
  protected _initialTab?: string | number;
  protected _addable: boolean = false;
  protected _addLabel?: string;
  protected _cssClass?: string;
  protected _visibility?: {
    hide?: VisibilityCondition;
    visible?: VisibilityCondition;
  };

  constructor(id: string) {
    this._id = id;
    this.configure();
  }

  /**
   * Abstract method to configure the tabs.
   * Override this method to define tabs.
   */
  abstract configure(): void;

  // ===========================================================================
  // BUILDER METHODS
  // ===========================================================================

  /**
   * Add a new tab
   */
  protected tab(id: string): TabBuilderImpl<Tabs> {
    const tabBuilder = new TabBuilderImpl<Tabs>(id, this);
    this._tabs.push(tabBuilder);
    return tabBuilder;
  }

  /**
   * Set tabs position
   */
  protected position(pos: "top" | "bottom" | "left" | "right"): this {
    this._position = pos;
    return this;
  }

  /**
   * Set initial active tab
   */
  protected initialTab(tabId: string | number): this {
    this._initialTab = tabId;
    return this;
  }

  /**
   * Enable adding new tabs
   */
  protected addable(addable: boolean = true): this {
    this._addable = addable;
    return this;
  }

  /**
   * Set add button label
   */
  protected addLabel(label: string): this {
    this._addLabel = label;
    return this;
  }

  /**
   * Set CSS class
   */
  protected css(className: string): this {
    this._cssClass = className;
    return this;
  }

  /**
   * Hide tabs container based on condition
   */
  protected hideByCondition(condition: VisibilityCondition): this {
    if (!this._visibility) {
      this._visibility = {};
    }
    this._visibility.hide = condition;
    return this;
  }

  /**
   * Show tabs container based on condition
   */
  protected visibleByCondition(condition: VisibilityCondition): this {
    if (!this._visibility) {
      this._visibility = {};
    }
    this._visibility.visible = condition;
    return this;
  }

  // ===========================================================================
  // LIFECYCLE HOOKS (Override in subclass)
  // ===========================================================================

  /**
   * Called when tab is added (if addable)
   */
  onAdd?(ctx: FormContext): void;

  /**
   * Called when tab is closed
   */
  onClose?(tabId: string, ctx: FormContext): void;

  /**
   * Called when active tab changes
   */
  onChange?(tabId: string, ctx: FormContext): void;

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  /**
   * Get tabs ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get tab config by ID
   */
  getTab(tabId: string): TabConfig | undefined {
    return this._tabs.find((t) => t._getConfig().id === tabId)?._getConfig();
  }

  /**
   * Get all tab IDs
   */
  getTabIds(): string[] {
    return this._tabs.map((t) => t._getConfig().id);
  }

  /**
   * Build the tabs configuration
   */
  build(): TabsConfig {
    return {
      id: this._id,
      tabs: this._tabs.map((t) => t._getConfig()),
      position: this._position,
      initialTab: this._initialTab,
      addable: this._addable,
      addLabel: this._addLabel,
      onAdd: this.onAdd?.bind(this),
      onClose: this.onClose?.bind(this),
      onChange: this.onChange?.bind(this),
      cssClass: this._cssClass,
      visibility: this._visibility,
    };
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create tabs configuration inline without extending Tabs class.
 *
 * @example
 * ```typescript
 * const myTabs = createTabs("settings", (t) => {
 *   t.tab("general").label("General").form(GeneralForm).end();
 *   t.tab("advanced").label("Advanced").form(AdvancedForm).end();
 * });
 * ```
 */
export function createTabs(
  id: string,
  configure: (tabs: TabsConfigBuilder) => void
): TabsConfig {
  const builder = new TabsConfigBuilder(id);
  configure(builder);
  return builder.build();
}

/**
 * Builder for inline tabs creation
 */
class TabsConfigBuilder {
  private _id: string;
  private _tabs: TabBuilderImpl<TabsConfigBuilder>[] = [];
  private _position: "top" | "bottom" | "left" | "right" = "top";
  private _initialTab?: string | number;
  private _addable: boolean = false;
  private _addLabel?: string;
  private _cssClass?: string;
  private _visibility?: {
    hide?: VisibilityCondition;
    visible?: VisibilityCondition;
  };

  constructor(id: string) {
    this._id = id;
  }

  tab(id: string): TabBuilderImpl<TabsConfigBuilder> {
    const tabBuilder = new TabBuilderImpl<TabsConfigBuilder>(id, this);
    this._tabs.push(tabBuilder);
    return tabBuilder;
  }

  position(pos: "top" | "bottom" | "left" | "right"): this {
    this._position = pos;
    return this;
  }

  initialTab(tabId: string | number): this {
    this._initialTab = tabId;
    return this;
  }

  addable(addable: boolean = true): this {
    this._addable = addable;
    return this;
  }

  addLabel(label: string): this {
    this._addLabel = label;
    return this;
  }

  css(className: string): this {
    this._cssClass = className;
    return this;
  }

  hideByCondition(condition: VisibilityCondition): this {
    if (!this._visibility) {
      this._visibility = {};
    }
    this._visibility.hide = condition;
    return this;
  }

  visibleByCondition(condition: VisibilityCondition): this {
    if (!this._visibility) {
      this._visibility = {};
    }
    this._visibility.visible = condition;
    return this;
  }

  build(): TabsConfig {
    return {
      id: this._id,
      tabs: this._tabs.map((t) => t._getConfig()),
      position: this._position,
      initialTab: this._initialTab,
      addable: this._addable,
      addLabel: this._addLabel,
      cssClass: this._cssClass,
      visibility: this._visibility,
    };
  }
}
