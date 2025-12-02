/**
 * Lumino Framework - Container Exports
 *
 * Export all standalone container base classes.
 * These can be used anywhere - inside forms, outside forms, in pages, etc.
 */

// Tabs - for tabbed interfaces
export {
  Tabs,
  createTabs,
  type TabConfig,
  type TabsConfig,
} from "./Tabs";

// Dialog - for modal dialogs
export {
  Dialog,
  createDialog,
  createConfirmDialog,
  type DialogConfig,
  type DialogActionConfig,
} from "./Dialog";

// Table - for data tables
export {
  Table,
  createTable,
  type TableConfig,
  type ColumnConfig,
  type RowActionConfig,
  type BulkActionConfig,
  type PaginationConfig,
} from "./Table";

// WidgetPage - for widget-based pages (dashboards)
export {
  WidgetPage,
  createWidgetPage,
  type WidgetPageConfig,
  type PageWidgetConfig,
  type PageActionConfig,
} from "./Page";
