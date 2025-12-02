/**
 * Lumino Framework - App Module Exports
 */

export {
  LuminoApp,
  lumino,
  createApp, // deprecated
  getApp,
  clearApp,
} from "./LuminoApp";

export type {
  LuminoConfig,
  LuminoPlugin,
  UserProvider,
  I18nProvider,
  StorageProvider,
  ComponentResolver,
} from "./LuminoApp";

// App (OOP style)
export { App, getAppInstance, clearAppInstance } from "./App";
export type { RouteConfig } from "./App";

// AppLayout (legacy)
export {
  AppLayout,
  registerLayout,
  getLayout,
  clearLayout,
} from "./AppLayout";

export type {
  LayoutContext,
  LayoutComponentConfig,
  LayoutStateSubscriber,
  NavItem,
  HeaderConfig,
  SidebarConfig,
  FooterConfig,
  AppLayoutConfig,
} from "./AppLayout";

// FlexibleLayout (new grid-based layout)
export {
  FlexibleLayout,
  registerFlexibleLayout,
  getFlexibleLayout,
  clearFlexibleLayout,
} from "./FlexibleLayout";

export type {
  FlexibleLayoutContext,
  FlexibleLayoutConfig,
  FlexibleLayoutStateSubscriber,
  LayoutRow,
  LayoutColumn,
  LayoutAreaItem,
  LayoutAreaComponent,
  LayoutAreaText,
  LayoutAreaNav,
  LayoutAreaContent,
  LayoutAreaSlot,
  LayoutNavItem,
  LayoutGrid,
} from "./FlexibleLayout";
