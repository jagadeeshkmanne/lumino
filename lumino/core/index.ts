/**
 * Lumino Framework - Core Module Exports
 *
 * Main entry point for the Lumino framework.
 */

// Types
export * from "./types";

// Validation
export {
  Validators,
  shouldRunRule,
  runValidation,
  ValidationRunner,
  validationRunner,
  validateForAction,
  validateSync,
} from "./validation";

// API
export { Api, ApiGroup } from "./api/Api";
export { CrudApi } from "./api/CrudApi";
export { LookupApi } from "./api/LookupApi";
export { Mapper } from "./api/Mapper";
export { Criteria, Sort, Pageable } from "./api/Criteria";
export { ApiExecutor, buildUrl, createRequestConfig, executeHttpRequest } from "./api/ApiExecutor";
export { CacheManager, cacheManager } from "./api/CacheManager";

// Action
export { Action } from "./action/Action";

// Registry
export { ApiRegistry, api, isApiRef } from "./registry/ApiRegistry";
export type { ApiRef } from "./registry/ApiRegistry";
export { MapperRegistry } from "./registry/MapperRegistry";
export { RouteRegistry } from "./registry/RouteRegistry";

// Context
export {
  UserContextImpl,
  createAnonymousUserContext,
  ANONYMOUS_USER,
  AppContextImpl,
  PageContextImpl,
  FormContextImpl,
  ActionContextImpl,
  createActionContext,
} from "./context";

// Events
export {
  EventEmitter,
  EventBus,
  eventEmitter,
  eventBus,
} from "./events";

export type {
  EventCallback,
  EventUnsubscribe,
  EventSubscription,
  FormEvents,
  PageEvents,
  NavigationEvents,
  ApiEvents,
  AuthEvents,
  AppEvents,
  UIEvents,
  BuiltInEvents,
  CustomEvents,
  AllEvents,
} from "./events";

// Form
export {
  Form,
  Component,
  createFormState,
  isFormDirty,
  getChangedFields,
  resetFormValues,
} from "./form";

// Page
export { Page, createPageState, PageRegistry } from "./page";

// Containers (standalone UI containers)
export {
  Tabs,
  createTabs,
  Dialog,
  createDialog,
  createConfirmDialog,
  Table,
  createTable,
  WidgetPage,
  createWidgetPage,
} from "./containers";

export type {
  TabConfig,
  TabsConfig,
  DialogConfig,
  DialogActionConfig,
  TableConfig,
  ColumnConfig,
  RowActionConfig,
  BulkActionConfig,
  PaginationConfig,
  WidgetPageConfig,
  PageWidgetConfig,
  PageActionConfig,
} from "./containers";

// State
export {
  Store,
  EntityStore,
  CollectionStore,
  StateManager,
  stateManager,
} from "./state";

export type {
  StateSubscriber,
  StateSelector,
  StateUnsubscribe,
  EntityState,
  LoadingState,
  CacheEntry,
  AppState,
} from "./state";

// App
export {
  LuminoApp,
  lumino,
  createApp, // deprecated, use lumino()
  getApp,
  clearApp,
  App, // OOP style app configuration
  getAppInstance,
  clearAppInstance,
  AppLayout,
  registerLayout,
  getLayout,
  clearLayout,
  // FlexibleLayout (new grid-based layout)
  FlexibleLayout,
  registerFlexibleLayout,
  getFlexibleLayout,
  clearFlexibleLayout,
} from "./app";

export type {
  LuminoConfig,
  LuminoPlugin,
  UserProvider,
  I18nProvider,
  StorageProvider,
  ComponentResolver,
  NavItem,
  HeaderConfig,
  SidebarConfig,
  FooterConfig,
  AppLayoutConfig,
  // FlexibleLayout types
  FlexibleLayoutContext,
  FlexibleLayoutConfig,
  FlexibleLayoutStateSubscriber,
  LayoutRow,
  LayoutColumn,
  LayoutAreaItem,
  LayoutNavItem,
  LayoutGrid,
} from "./app";

// Lumino namespace (UI adapter configuration)
export { Lumino, extendAdapter } from "./Lumino";

// Component factory (for creating adapter-aware components)
export { createComponent, createComponents } from "./components";

// Visibility utilities
export {
  evaluateVisibility,
  isFieldVisible,
  shouldSkipValidation,
  shouldClearData,
  getFieldsToClear,
  getFieldsToSkipValidation,
} from "./utils/visibility";

export type { VisibilityResult } from "./utils/visibility";
