/**
 * Lumino Framework - Table Base Class
 *
 * Abstract base class for defining data tables with fluent builder pattern.
 * UI-independent - renderers are handled by UI adapters.
 *
 * Can be used:
 * - Standalone data tables
 * - Inside forms (for related data display)
 * - With pagination, sorting, filtering
 * - With row selection and actions
 */

import type { ComponentType, ReactNode } from "react";
import type { FormContext } from "../types/context";
import type { VisibilityCondition } from "../types/form";

// =============================================================================
// TABLE CONFIG TYPES
// =============================================================================

/**
 * Configuration for a table column
 */
export interface ColumnConfig<T = any> {
  /** Column key (field name) */
  key: string;
  /** Column header */
  header: string | ((ctx: FormContext) => string);
  /** Column width */
  width?: number | string;
  /** Min width */
  minWidth?: number;
  /** Max width */
  maxWidth?: number;
  /** Is sortable */
  sortable?: boolean;
  /** Is filterable */
  filterable?: boolean;
  /** Filter type */
  filterType?: "text" | "select" | "date" | "number" | "boolean";
  /** Filter options (for select) */
  filterOptions?: { label: string; value: any }[];
  /** Custom render */
  render?: (value: any, row: T, index: number, ctx: FormContext) => ReactNode;
  /** Custom cell component */
  component?: ComponentType<{ value: any; row: T; index: number; ctx: FormContext }>;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Is resizable */
  resizable?: boolean;
  /** Is hidden by default */
  hidden?: boolean;
  /** Can be hidden by user */
  hideable?: boolean;
  /** Is pinned */
  pinned?: "left" | "right";
  /** CSS class for column */
  cssClass?: string;
  /** Visibility condition */
  visibility?: {
    hide?: VisibilityCondition;
    visible?: VisibilityCondition;
  };
}

/**
 * Configuration for row actions
 */
export interface RowActionConfig<T = any> {
  /** Action ID */
  id: string;
  /** Action label */
  label: string | ((row: T, ctx: FormContext) => string);
  /** Action icon */
  icon?: ReactNode | string;
  /** Click handler */
  onClick: (row: T, index: number, ctx: FormContext) => void;
  /** Is disabled */
  disabled?: boolean | ((row: T, ctx: FormContext) => boolean);
  /** Is hidden */
  hidden?: boolean | ((row: T, ctx: FormContext) => boolean);
  /** Variant */
  variant?: "default" | "danger";
  /** Show in dropdown (for overflow) */
  overflow?: boolean;
}

/**
 * Configuration for bulk actions
 */
export interface BulkActionConfig<T = any> {
  /** Action ID */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: ReactNode | string;
  /** Click handler - receives selected rows */
  onClick: (selectedRows: T[], ctx: FormContext) => void;
  /** Is disabled */
  disabled?: boolean | ((selectedRows: T[], ctx: FormContext) => boolean);
  /** Variant */
  variant?: "default" | "primary" | "danger";
  /** Confirm before action */
  confirm?: boolean | string;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Enable pagination */
  enabled: boolean;
  /** Page size */
  pageSize?: number;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Server-side pagination */
  serverSide?: boolean;
  /** Total count (for server-side) */
  totalCount?: number | ((ctx: FormContext) => number);
}

/**
 * Built table configuration
 */
export interface TableConfig<T = any> {
  /** Table ID */
  id: string;
  /** Column configurations */
  columns: ColumnConfig<T>[];
  /** Data source - array or function */
  data?: T[] | ((ctx: FormContext) => T[] | Promise<T[]>);
  /** Row key function */
  rowKey?: string | ((row: T, index: number) => string | number);
  /** Row actions */
  rowActions?: RowActionConfig<T>[];
  /** Bulk actions (for selection) */
  bulkActions?: BulkActionConfig<T>[];
  /** Enable row selection */
  selectable?: boolean;
  /** Selection mode */
  selectionMode?: "single" | "multiple";
  /** Row click handler */
  onRowClick?: (row: T, index: number, ctx: FormContext) => void;
  /** Row double click handler */
  onRowDoubleClick?: (row: T, index: number, ctx: FormContext) => void;
  /** Enable sorting */
  sortable?: boolean;
  /** Default sort */
  defaultSort?: { column: string; direction: "asc" | "desc" };
  /** Enable filtering */
  filterable?: boolean;
  /** Enable global search */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Pagination config */
  pagination?: PaginationConfig;
  /** Empty state content */
  emptyContent?: ReactNode | ((ctx: FormContext) => ReactNode);
  /** Loading state */
  loading?: boolean | ((ctx: FormContext) => boolean);
  /** Enable column reordering */
  columnReorderable?: boolean;
  /** Enable row reordering (drag & drop) */
  rowReorderable?: boolean;
  /** Row reorder handler */
  onRowReorder?: (fromIndex: number, toIndex: number, ctx: FormContext) => void;
  /** Striped rows */
  striped?: boolean;
  /** Bordered */
  bordered?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** CSS class */
  cssClass?: string;
  /** Table height (for virtual scrolling) */
  height?: number | string;
  /** Enable virtual scrolling */
  virtualScroll?: boolean;
  /** Visibility */
  visibility?: {
    hide?: VisibilityCondition;
    visible?: VisibilityCondition;
  };
}

// =============================================================================
// COLUMN BUILDER IMPLEMENTATION
// =============================================================================

class ColumnBuilderImpl<TParent, T = any> {
  private _config: ColumnConfig<T>;
  private _parent: TParent;

  constructor(key: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      key,
      header: key, // Default header to key
    };
  }

  header(header: string | ((ctx: FormContext) => string)): this {
    this._config.header = header;
    return this;
  }

  width(width: number | string): this {
    this._config.width = width;
    return this;
  }

  minWidth(width: number): this {
    this._config.minWidth = width;
    return this;
  }

  maxWidth(width: number): this {
    this._config.maxWidth = width;
    return this;
  }

  sortable(sortable: boolean = true): this {
    this._config.sortable = sortable;
    return this;
  }

  filterable(type: "text" | "select" | "date" | "number" | "boolean" = "text"): this {
    this._config.filterable = true;
    this._config.filterType = type;
    return this;
  }

  filterOptions(options: { label: string; value: any }[]): this {
    this._config.filterOptions = options;
    return this;
  }

  render(renderFn: (value: any, row: T, index: number, ctx: FormContext) => ReactNode): this {
    this._config.render = renderFn;
    return this;
  }

  component(comp: ComponentType<{ value: any; row: T; index: number; ctx: FormContext }>): this {
    this._config.component = comp;
    return this;
  }

  align(alignment: "left" | "center" | "right"): this {
    this._config.align = alignment;
    return this;
  }

  resizable(resizable: boolean = true): this {
    this._config.resizable = resizable;
    return this;
  }

  hidden(hidden: boolean = true): this {
    this._config.hidden = hidden;
    return this;
  }

  hideable(hideable: boolean = true): this {
    this._config.hideable = hideable;
    return this;
  }

  pinned(side: "left" | "right"): this {
    this._config.pinned = side;
    return this;
  }

  css(className: string): this {
    this._config.cssClass = className;
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

  _getConfig(): ColumnConfig<T> {
    return this._config;
  }
}

// =============================================================================
// ROW ACTION BUILDER IMPLEMENTATION
// =============================================================================

class RowActionBuilderImpl<TParent, T = any> {
  private _config: RowActionConfig<T>;
  private _parent: TParent;

  constructor(id: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      id,
      label: id,
      onClick: () => {},
    };
  }

  label(label: string | ((row: T, ctx: FormContext) => string)): this {
    this._config.label = label;
    return this;
  }

  icon(icon: ReactNode | string): this {
    this._config.icon = icon;
    return this;
  }

  onClick(handler: (row: T, index: number, ctx: FormContext) => void): this {
    this._config.onClick = handler;
    return this;
  }

  disabled(condition: boolean | ((row: T, ctx: FormContext) => boolean)): this {
    this._config.disabled = condition;
    return this;
  }

  hidden(condition: boolean | ((row: T, ctx: FormContext) => boolean)): this {
    this._config.hidden = condition;
    return this;
  }

  variant(variant: "default" | "danger"): this {
    this._config.variant = variant;
    return this;
  }

  overflow(overflow: boolean = true): this {
    this._config.overflow = overflow;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  _getConfig(): RowActionConfig<T> {
    return this._config;
  }
}

// =============================================================================
// BULK ACTION BUILDER IMPLEMENTATION
// =============================================================================

class BulkActionBuilderImpl<TParent, T = any> {
  private _config: BulkActionConfig<T>;
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

  onClick(handler: (selectedRows: T[], ctx: FormContext) => void): this {
    this._config.onClick = handler;
    return this;
  }

  disabled(condition: boolean | ((selectedRows: T[], ctx: FormContext) => boolean)): this {
    this._config.disabled = condition;
    return this;
  }

  variant(variant: "default" | "primary" | "danger"): this {
    this._config.variant = variant;
    return this;
  }

  confirm(message: boolean | string = true): this {
    this._config.confirm = message;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  _getConfig(): BulkActionConfig<T> {
    return this._config;
  }
}

// =============================================================================
// TABLE BASE CLASS
// =============================================================================

/**
 * Abstract base class for defining data tables.
 *
 * @example
 * ```typescript
 * // Basic table with sorting and pagination
 * class UsersTable extends Table<User> {
 *   configure() {
 *     this.column("name")
 *       .header("Name")
 *       .sortable()
 *       .width(200)
 *       .end();
 *
 *     this.column("email")
 *       .header("Email")
 *       .sortable()
 *       .end();
 *
 *     this.column("role")
 *       .header("Role")
 *       .filterable("select")
 *       .filterOptions([
 *         { label: "Admin", value: "admin" },
 *         { label: "User", value: "user" },
 *       ])
 *       .end();
 *
 *     this.column("createdAt")
 *       .header("Created")
 *       .render((value) => formatDate(value))
 *       .sortable()
 *       .end();
 *
 *     // Row actions
 *     this.rowAction("edit")
 *       .label("Edit")
 *       .icon("edit")
 *       .onClick((row, idx, ctx) => ctx.navigate(`/users/${row.id}`))
 *       .end();
 *
 *     this.rowAction("delete")
 *       .label("Delete")
 *       .icon("delete")
 *       .variant("danger")
 *       .onClick((row, idx, ctx) => this.deleteUser(row, ctx))
 *       .end();
 *
 *     // Bulk actions
 *     this.bulkAction("delete", "Delete Selected")
 *       .variant("danger")
 *       .confirm("Are you sure you want to delete the selected users?")
 *       .onClick((rows, ctx) => this.deleteUsers(rows, ctx))
 *       .end();
 *
 *     // Settings
 *     this.selectable("multiple")
 *       .searchable()
 *       .pagination({ pageSize: 20, pageSizeOptions: [10, 20, 50] })
 *       .striped();
 *   }
 *
 *   async deleteUser(row: User, ctx: FormContext) {
 *     await ctx.api.users.delete(row.id);
 *     ctx.notify("User deleted", "success");
 *   }
 * }
 *
 * // Server-side table
 * class OrdersTable extends Table<Order> {
 *   configure() {
 *     this.data(async (ctx) => {
 *       const { page, pageSize, sort, filters } = ctx.getTableState();
 *       return await ctx.api.orders.list({ page, pageSize, sort, filters });
 *     });
 *
 *     this.pagination({
 *       pageSize: 25,
 *       serverSide: true,
 *       totalCount: ctx => ctx.getValue("totalOrders"),
 *     });
 *
 *     // columns...
 *   }
 * }
 * ```
 */
export abstract class Table<T = any> {
  protected readonly _id: string;
  protected _columns: ColumnBuilderImpl<Table<T>, T>[] = [];
  protected _rowActions: RowActionBuilderImpl<Table<T>, T>[] = [];
  protected _bulkActions: BulkActionBuilderImpl<Table<T>, T>[] = [];
  protected _data?: T[] | ((ctx: FormContext) => T[] | Promise<T[]>);
  protected _rowKey?: string | ((row: T, index: number) => string | number);
  protected _selectable?: boolean;
  protected _selectionMode?: "single" | "multiple";
  protected _sortable: boolean = false;
  protected _defaultSort?: { column: string; direction: "asc" | "desc" };
  protected _filterable: boolean = false;
  protected _searchable: boolean = false;
  protected _searchPlaceholder?: string;
  protected _pagination?: PaginationConfig;
  protected _emptyContent?: ReactNode | ((ctx: FormContext) => ReactNode);
  protected _loading?: boolean | ((ctx: FormContext) => boolean);
  protected _columnReorderable: boolean = false;
  protected _rowReorderable: boolean = false;
  protected _striped: boolean = false;
  protected _bordered: boolean = false;
  protected _compact: boolean = false;
  protected _cssClass?: string;
  protected _height?: number | string;
  protected _virtualScroll: boolean = false;
  protected _visibility?: {
    hide?: VisibilityCondition;
    visible?: VisibilityCondition;
  };

  constructor(id: string) {
    this._id = id;
    this.configure();
  }

  /**
   * Abstract method to configure the table.
   * Override this method to define columns and settings.
   */
  abstract configure(): void;

  // ===========================================================================
  // BUILDER METHODS
  // ===========================================================================

  /**
   * Add a column
   */
  protected column(key: string): ColumnBuilderImpl<Table<T>, T> {
    const columnBuilder = new ColumnBuilderImpl<Table<T>, T>(key, this);
    this._columns.push(columnBuilder);
    return columnBuilder;
  }

  /**
   * Add a row action
   */
  protected rowAction(id: string): RowActionBuilderImpl<Table<T>, T> {
    const actionBuilder = new RowActionBuilderImpl<Table<T>, T>(id, this);
    this._rowActions.push(actionBuilder);
    return actionBuilder;
  }

  /**
   * Add a bulk action
   */
  protected bulkAction(id: string, label: string): BulkActionBuilderImpl<Table<T>, T> {
    const actionBuilder = new BulkActionBuilderImpl<Table<T>, T>(id, label, this);
    this._bulkActions.push(actionBuilder);
    return actionBuilder;
  }

  /**
   * Set data source
   */
  protected data(data: T[] | ((ctx: FormContext) => T[] | Promise<T[]>)): this {
    this._data = data;
    return this;
  }

  /**
   * Set row key
   */
  protected rowKey(key: string | ((row: T, index: number) => string | number)): this {
    this._rowKey = key;
    return this;
  }

  /**
   * Enable selection
   */
  protected selectable(mode: "single" | "multiple" = "multiple"): this {
    this._selectable = true;
    this._selectionMode = mode;
    return this;
  }

  /**
   * Enable sorting
   */
  protected sortable(defaultSort?: { column: string; direction: "asc" | "desc" }): this {
    this._sortable = true;
    if (defaultSort) {
      this._defaultSort = defaultSort;
    }
    return this;
  }

  /**
   * Enable filtering
   */
  protected filterable(): this {
    this._filterable = true;
    return this;
  }

  /**
   * Enable global search
   */
  protected searchable(placeholder?: string): this {
    this._searchable = true;
    if (placeholder) {
      this._searchPlaceholder = placeholder;
    }
    return this;
  }

  /**
   * Configure pagination
   */
  protected pagination(config: Omit<PaginationConfig, "enabled"> | boolean): this {
    if (typeof config === "boolean") {
      this._pagination = { enabled: config };
    } else {
      this._pagination = { enabled: true, ...config };
    }
    return this;
  }

  /**
   * Set empty state content
   */
  protected emptyContent(content: ReactNode | ((ctx: FormContext) => ReactNode)): this {
    this._emptyContent = content;
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
   * Enable column reordering
   */
  protected columnReorderable(reorderable: boolean = true): this {
    this._columnReorderable = reorderable;
    return this;
  }

  /**
   * Enable row reordering
   */
  protected rowReorderable(reorderable: boolean = true): this {
    this._rowReorderable = reorderable;
    return this;
  }

  /**
   * Enable striped rows
   */
  protected striped(striped: boolean = true): this {
    this._striped = striped;
    return this;
  }

  /**
   * Enable bordered style
   */
  protected bordered(bordered: boolean = true): this {
    this._bordered = bordered;
    return this;
  }

  /**
   * Enable compact mode
   */
  protected compact(compact: boolean = true): this {
    this._compact = compact;
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
   * Set table height (enables scroll)
   */
  protected height(height: number | string): this {
    this._height = height;
    return this;
  }

  /**
   * Enable virtual scrolling
   */
  protected virtualScroll(enabled: boolean = true): this {
    this._virtualScroll = enabled;
    return this;
  }

  /**
   * Hide by condition
   */
  protected hideByCondition(condition: VisibilityCondition): this {
    if (!this._visibility) {
      this._visibility = {};
    }
    this._visibility.hide = condition;
    return this;
  }

  /**
   * Show by condition
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
   * Called when row is clicked
   */
  onRowClick?(row: T, index: number, ctx: FormContext): void;

  /**
   * Called when row is double clicked
   */
  onRowDoubleClick?(row: T, index: number, ctx: FormContext): void;

  /**
   * Called when rows are reordered
   */
  onRowReorder?(fromIndex: number, toIndex: number, ctx: FormContext): void;

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  /**
   * Get table ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get column config by key
   */
  getColumn(key: string): ColumnConfig<T> | undefined {
    return this._columns.find((c) => c._getConfig().key === key)?._getConfig();
  }

  /**
   * Get all column keys
   */
  getColumnKeys(): string[] {
    return this._columns.map((c) => c._getConfig().key);
  }

  /**
   * Build the table configuration
   */
  build(): TableConfig<T> {
    return {
      id: this._id,
      columns: this._columns.map((c) => c._getConfig()),
      data: this._data,
      rowKey: this._rowKey,
      rowActions: this._rowActions.length > 0 ? this._rowActions.map((a) => a._getConfig()) : undefined,
      bulkActions: this._bulkActions.length > 0 ? this._bulkActions.map((a) => a._getConfig()) : undefined,
      selectable: this._selectable,
      selectionMode: this._selectionMode,
      onRowClick: this.onRowClick?.bind(this),
      onRowDoubleClick: this.onRowDoubleClick?.bind(this),
      sortable: this._sortable,
      defaultSort: this._defaultSort,
      filterable: this._filterable,
      searchable: this._searchable,
      searchPlaceholder: this._searchPlaceholder,
      pagination: this._pagination,
      emptyContent: this._emptyContent,
      loading: this._loading,
      columnReorderable: this._columnReorderable,
      rowReorderable: this._rowReorderable,
      onRowReorder: this.onRowReorder?.bind(this),
      striped: this._striped,
      bordered: this._bordered,
      compact: this._compact,
      cssClass: this._cssClass,
      height: this._height,
      virtualScroll: this._virtualScroll,
      visibility: this._visibility,
    };
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create table configuration inline without extending Table class.
 *
 * @example
 * ```typescript
 * const usersTable = createTable<User>("users", (t) => {
 *   t.column("name").header("Name").sortable().end();
 *   t.column("email").header("Email").end();
 *   t.selectable().pagination({ pageSize: 10 });
 * });
 * ```
 */
export function createTable<T = any>(
  id: string,
  configure: (table: TableConfigBuilder<T>) => void
): TableConfig<T> {
  const builder = new TableConfigBuilder<T>(id);
  configure(builder);
  return builder.build();
}

/**
 * Builder for inline table creation
 */
class TableConfigBuilder<T = any> {
  private _id: string;
  private _columns: ColumnBuilderImpl<TableConfigBuilder<T>, T>[] = [];
  private _rowActions: RowActionBuilderImpl<TableConfigBuilder<T>, T>[] = [];
  private _bulkActions: BulkActionBuilderImpl<TableConfigBuilder<T>, T>[] = [];
  private _data?: T[] | ((ctx: FormContext) => T[] | Promise<T[]>);
  private _rowKey?: string | ((row: T, index: number) => string | number);
  private _selectable?: boolean;
  private _selectionMode?: "single" | "multiple";
  private _sortable: boolean = false;
  private _defaultSort?: { column: string; direction: "asc" | "desc" };
  private _filterable: boolean = false;
  private _searchable: boolean = false;
  private _searchPlaceholder?: string;
  private _pagination?: PaginationConfig;
  private _emptyContent?: ReactNode | ((ctx: FormContext) => ReactNode);
  private _loading?: boolean | ((ctx: FormContext) => boolean);
  private _striped: boolean = false;
  private _bordered: boolean = false;
  private _compact: boolean = false;
  private _cssClass?: string;
  private _height?: number | string;
  private _virtualScroll: boolean = false;

  constructor(id: string) {
    this._id = id;
  }

  column(key: string): ColumnBuilderImpl<TableConfigBuilder<T>, T> {
    const columnBuilder = new ColumnBuilderImpl<TableConfigBuilder<T>, T>(key, this);
    this._columns.push(columnBuilder);
    return columnBuilder;
  }

  rowAction(id: string): RowActionBuilderImpl<TableConfigBuilder<T>, T> {
    const actionBuilder = new RowActionBuilderImpl<TableConfigBuilder<T>, T>(id, this);
    this._rowActions.push(actionBuilder);
    return actionBuilder;
  }

  bulkAction(id: string, label: string): BulkActionBuilderImpl<TableConfigBuilder<T>, T> {
    const actionBuilder = new BulkActionBuilderImpl<TableConfigBuilder<T>, T>(id, label, this);
    this._bulkActions.push(actionBuilder);
    return actionBuilder;
  }

  data(data: T[] | ((ctx: FormContext) => T[] | Promise<T[]>)): this {
    this._data = data;
    return this;
  }

  rowKey(key: string | ((row: T, index: number) => string | number)): this {
    this._rowKey = key;
    return this;
  }

  selectable(mode: "single" | "multiple" = "multiple"): this {
    this._selectable = true;
    this._selectionMode = mode;
    return this;
  }

  sortable(defaultSort?: { column: string; direction: "asc" | "desc" }): this {
    this._sortable = true;
    if (defaultSort) {
      this._defaultSort = defaultSort;
    }
    return this;
  }

  filterable(): this {
    this._filterable = true;
    return this;
  }

  searchable(placeholder?: string): this {
    this._searchable = true;
    if (placeholder) {
      this._searchPlaceholder = placeholder;
    }
    return this;
  }

  pagination(config: Omit<PaginationConfig, "enabled"> | boolean): this {
    if (typeof config === "boolean") {
      this._pagination = { enabled: config };
    } else {
      this._pagination = { enabled: true, ...config };
    }
    return this;
  }

  emptyContent(content: ReactNode | ((ctx: FormContext) => ReactNode)): this {
    this._emptyContent = content;
    return this;
  }

  loading(loading: boolean | ((ctx: FormContext) => boolean)): this {
    this._loading = loading;
    return this;
  }

  striped(striped: boolean = true): this {
    this._striped = striped;
    return this;
  }

  bordered(bordered: boolean = true): this {
    this._bordered = bordered;
    return this;
  }

  compact(compact: boolean = true): this {
    this._compact = compact;
    return this;
  }

  css(className: string): this {
    this._cssClass = className;
    return this;
  }

  height(height: number | string): this {
    this._height = height;
    return this;
  }

  virtualScroll(enabled: boolean = true): this {
    this._virtualScroll = enabled;
    return this;
  }

  build(): TableConfig<T> {
    return {
      id: this._id,
      columns: this._columns.map((c) => c._getConfig()),
      data: this._data,
      rowKey: this._rowKey,
      rowActions: this._rowActions.length > 0 ? this._rowActions.map((a) => a._getConfig()) : undefined,
      bulkActions: this._bulkActions.length > 0 ? this._bulkActions.map((a) => a._getConfig()) : undefined,
      selectable: this._selectable,
      selectionMode: this._selectionMode,
      sortable: this._sortable,
      defaultSort: this._defaultSort,
      filterable: this._filterable,
      searchable: this._searchable,
      searchPlaceholder: this._searchPlaceholder,
      pagination: this._pagination,
      emptyContent: this._emptyContent,
      loading: this._loading,
      striped: this._striped,
      bordered: this._bordered,
      compact: this._compact,
      cssClass: this._cssClass,
      height: this._height,
      virtualScroll: this._virtualScroll,
    };
  }
}
