/**
 * Lumino Framework - Renderer Exports
 *
 * Main components for rendering Lumino pages and forms.
 * Developers typically only need PageByIdRenderer with LuminoRouter.
 */

// =============================================================================
// PRIMARY EXPORTS (Developer-facing)
// =============================================================================

export {
  // Main page renderer - use with LuminoRouter
  PageByIdRenderer,
  // Page layout customization
  setPageLayout,
  setPageRowLayout,
} from "./PageRenderer";

// =============================================================================
// ADVANCED EXPORTS (For custom rendering scenarios)
// =============================================================================

// Form Renderer (used internally, or for standalone forms)
export {
  FormRenderer,
  FieldRenderer,
  RowRenderer,
  SectionRenderer,
  ObjectRenderer,
  ListRenderer,
  FormTabsRenderer,
  resolveComponent,
} from "./FormRenderer";

// Page Renderer (used internally)
export {
  PageRenderer,
  ComponentRenderer,
  PageRowRenderer,
  PageContentRenderer,
} from "./PageRenderer";

// Container Renderers (for standalone containers)
export { TabsRenderer } from "./TabsRenderer";
export { DialogRenderer, useDialog } from "./DialogRenderer";
export { TableRenderer, useTable } from "./TableRenderer";
export { WidgetPageRenderer } from "./WidgetPageRenderer";

// Stateful Component Renderer (for rendering Lumino Components with state)
export {
  StatefulComponentRenderer,
  createLuminoComponent,
  PageContextProvider,
  usePageContext,
} from "./StatefulComponentRenderer";

// App Layout Renderer (re-exported from Salt adapter for backwards compatibility)
// Note: This is Salt-specific. For other UI libraries, import from the appropriate adapter.
export { AppLayoutRenderer } from "../../adapters/salt/layout";

// =============================================================================
// TYPES
// =============================================================================

export type {
  ComponentResolver,
  LayoutProps,
  RowLayoutProps,
  SectionLayoutProps,
  FormLayoutProps,
  FieldRendererProps,
  RowRendererProps,
  SectionRendererProps,
  ObjectRendererProps,
  ListRendererProps,
  FormRendererProps,
  FormTabsRendererProps,
} from "./FormRenderer";

export type {
  PageLayoutProps,
  PageRowLayoutProps,
  ComponentRendererProps,
  PageRowRendererProps,
  PageContentRendererProps,
  PageRendererProps,
  PageByIdRendererProps,
} from "./PageRenderer";

export type { TabsRendererProps } from "./TabsRenderer";
export type { DialogRendererProps, UseDialogReturn } from "./DialogRenderer";
export type { TableRendererProps, TableState, UseTableReturn } from "./TableRenderer";
export type { WidgetPageRendererProps } from "./WidgetPageRenderer";
export type { StatefulComponentRendererProps } from "./StatefulComponentRenderer";
export type { AppLayoutRendererProps } from "../../adapters/salt/layout";
