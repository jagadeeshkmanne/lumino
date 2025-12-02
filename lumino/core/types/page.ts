/**
 * Lumino Framework - Page Types
 *
 * Types for Page class and PageBuilder.
 */

import type { CSSProperties, ReactNode } from "react";
import type { ComponentType, ComponentProps } from "./base";
import type { PageContext } from "./context";
import type { FormConfig, SpacingConfig } from "./form";

// =============================================================================
// STYLING TYPES
// =============================================================================

/**
 * Inline style type - static or dynamic based on page context
 */
export type PageStyle = CSSProperties | ((ctx: PageContext) => CSSProperties);

/**
 * CSS class type - static or dynamic based on page context
 */
export type PageCssClass = string | ((ctx: PageContext) => string);

// =============================================================================
// PAGE MODE
// =============================================================================

export type ModeFunction = (ctx: PageContext) => string;
export type OnModeHandler = (ctx: PageContext) => void | Promise<void>;
export type OnModeHandlers = Record<string, OnModeHandler>;

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

export interface ComponentConfig {
  component: ComponentType;
  props: ComponentProps | ((ctx: PageContext) => ComponentProps);
  /** Children/content for the component (e.g., button label) - can be static or dynamic based on page context */
  children?: ReactNode | string | ((ctx: PageContext) => ReactNode);
  /** Click handler - receives page context */
  onClick?: (ctx: PageContext) => void | Promise<void>;
  /** Visibility condition */
  visible?: boolean | ((ctx: PageContext) => boolean);
  /** Margin around this component */
  margin?: SpacingConfig;
  /** Padding inside this component wrapper */
  padding?: SpacingConfig;
  /** Additional CSS class for this component (static or dynamic based on page context) */
  cssClass?: PageCssClass;
  /** Inline styles for this component (static or dynamic based on page context) */
  style?: PageStyle;
  /** Custom wrapper component */
  wrapper?: ComponentType;
  /** Column span when in a row */
  colSpan?: number;
}

// =============================================================================
// PAGE ROW CONFIGURATION
// =============================================================================

export interface PageRowConfig {
  components: ComponentConfig[];
  /** Total grid columns (default: 12) */
  columns?: number;
  /** Gap between columns in pixels */
  gap?: number;
  /** Column layout - array of spans that sum to columns */
  layout?: number[];
  /** Visibility condition */
  visible?: boolean | ((ctx: PageContext) => boolean);
  /** Margin around this row */
  margin?: SpacingConfig;
  /** Padding inside this row */
  padding?: SpacingConfig;
  /** Additional CSS class for this row (static or dynamic based on page context) */
  cssClass?: PageCssClass;
  /** Inline styles for this row (static or dynamic based on page context) */
  style?: PageStyle;
  /** Custom wrapper component for this row */
  wrapper?: ComponentType;
}

// =============================================================================
// PAGE CONFIGURATION
// =============================================================================

export interface PageConfig {
  id: string;
  route: string;
  components: Array<ComponentConfig | PageRowConfig | FormConfig>;
}

// =============================================================================
// PAGE LIFECYCLE
// =============================================================================

export interface PageLifecycle {
  onInit?(ctx: PageContext): void | Promise<void>;
  onLoad?(ctx: PageContext): void;
  onBeforeLeave?(ctx: PageContext): boolean | Promise<boolean>;
  onDestroy?(ctx: PageContext): void;
}

// =============================================================================
// PAGE STATE
// =============================================================================

export interface PageState {
  mode: string;
  entity: any;
  loading: boolean;
  error: any;
  meta: Record<string, any>;
}

// =============================================================================
// COMPONENT BUILDER TYPES
// =============================================================================

export interface ComponentBuilder<TParent> {
  props(props: ComponentProps | ((ctx: PageContext) => ComponentProps)): ComponentBuilder<TParent>;
  /** Set children/content for the component (e.g., button label) */
  children(children: ReactNode | string): ComponentBuilder<TParent>;
  /** Set click handler - receives page context */
  onClick(handler: (ctx: PageContext) => void | Promise<void>): ComponentBuilder<TParent>;
  visible(condition: boolean | ((ctx: PageContext) => boolean)): ComponentBuilder<TParent>;
  /** Margin around this component */
  margin(spacing: SpacingConfig): ComponentBuilder<TParent>;
  /** Padding inside this component wrapper */
  padding(spacing: SpacingConfig): ComponentBuilder<TParent>;
  /** Additional CSS class for this component (static or dynamic based on page context) */
  css(className: PageCssClass): ComponentBuilder<TParent>;
  /** Inline styles for this component (static or dynamic based on page context) */
  style(styles: PageStyle): ComponentBuilder<TParent>;
  /** Wrap component with a custom container */
  wrapper(component: ComponentType): ComponentBuilder<TParent>;
  /** Column span when in a row */
  colSpan(span: number): ComponentBuilder<TParent>;
  end(): TParent;
}

// =============================================================================
// PAGE ROW BUILDER TYPES
// =============================================================================

export interface PageRowBuilder<TParent> {
  addComponent(component: ComponentType): ComponentBuilder<PageRowBuilder<TParent>>;
  /** Total grid columns (default: 12) */
  columns(count: number): PageRowBuilder<TParent>;
  /** Gap between columns in pixels */
  gap(gap: number): PageRowBuilder<TParent>;
  /**
   * Set column layout for this row.
   * @param spans Array of column spans that should sum to columns (default 12).
   * @example .layout([6, 6]) - two equal columns
   * @example .layout([4, 4, 4]) - three equal columns
   * @example .layout([8, 4]) - one larger, one smaller
   */
  layout(spans: number[]): PageRowBuilder<TParent>;
  /** Visibility condition */
  visible(condition: boolean | ((ctx: PageContext) => boolean)): PageRowBuilder<TParent>;
  /** Margin around this row */
  margin(spacing: SpacingConfig): PageRowBuilder<TParent>;
  /** Padding inside this row */
  padding(spacing: SpacingConfig): PageRowBuilder<TParent>;
  /** Additional CSS class for this row (static or dynamic based on page context) */
  css(className: PageCssClass): PageRowBuilder<TParent>;
  /** Inline styles for this row (static or dynamic based on page context) */
  style(styles: PageStyle): PageRowBuilder<TParent>;
  /** Wrap row with a custom container component */
  wrapper(component: ComponentType): PageRowBuilder<TParent>;
  end(): TParent;
}

// =============================================================================
// PAGE BUILDER TYPES
// =============================================================================

export interface PageBuilderInterface {
  addComponent(component: ComponentType): ComponentBuilder<PageBuilderInterface>;
  addRow(): PageRowBuilder<PageBuilderInterface>;
  addForm(form: any): PageBuilderInterface;  // Form class instance
  build(): PageConfig;
}

// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

export interface RouteConfig {
  path: string;
  pageId: string;
  exact?: boolean;
}
