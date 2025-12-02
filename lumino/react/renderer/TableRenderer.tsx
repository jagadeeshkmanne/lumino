/**
 * Lumino Framework - Table Renderer
 *
 * Renders standalone Table container configurations.
 * UI-library independent - uses UI adapter for actual rendering.
 */

import React, { useState, useMemo, useCallback, ReactNode, useEffect } from "react";
import type { TableConfig, ColumnConfig, RowActionConfig, BulkActionConfig } from "../../core/containers/Table";
import type { FormContext } from "../../core/types/context";
import { Lumino } from "../../core/Lumino";
import { evaluateVisibility } from "../../core/utils/visibility";
import { resolveComponent } from "./FormRenderer";

// =============================================================================
// TABLE STATE
// =============================================================================

export interface TableState {
  /** Current page (0-indexed) */
  page: number;
  /** Page size */
  pageSize: number;
  /** Sort column */
  sortColumn?: string;
  /** Sort direction */
  sortDirection?: "asc" | "desc";
  /** Active filters */
  filters: Record<string, any>;
  /** Search query */
  searchQuery: string;
  /** Selected row indices */
  selectedRows: number[];
}

// =============================================================================
// TABLE RENDERER PROPS
// =============================================================================

export interface TableRendererProps<T = any> {
  /** Table configuration (from Table.build() or createTable()) */
  config: TableConfig<T>;
  /** Form context */
  context: FormContext;
  /** Data (overrides config.data) */
  data?: T[];
  /** Loading state (overrides config.loading) */
  loading?: boolean;
  /** Total count for server-side pagination */
  totalCount?: number;
  /** Called when table state changes (for server-side operations) */
  onStateChange?: (state: TableState) => void;
  /** Custom class name */
  className?: string;
  /** Custom empty content */
  emptyContent?: ReactNode;
  /** Custom row render */
  renderRow?: (row: T, index: number) => ReactNode;
}

// =============================================================================
// DEFAULT TABLE COMPONENT (fallback)
// =============================================================================

interface DefaultTableProps<T> {
  columns: Array<{
    key: string;
    header: string;
    width?: number | string;
    align?: "left" | "center" | "right";
    sortable?: boolean;
    render?: (value: any, row: T, index: number) => ReactNode;
  }>;
  data: T[];
  loading?: boolean;
  emptyContent?: ReactNode;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  selectable?: boolean;
  selectedRows?: number[];
  onSelectionChange?: (indices: number[]) => void;
  onRowClick?: (row: T, index: number) => void;
  rowActions?: Array<{
    id: string;
    label: string;
    onClick: (row: T, index: number) => void;
    disabled?: boolean | ((row: T) => boolean);
    variant?: "default" | "danger";
  }>;
  className?: string;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

function DefaultTable<T>({
  columns,
  data,
  loading,
  emptyContent,
  sortColumn,
  sortDirection,
  onSort,
  selectable,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  rowActions,
  className,
  striped,
  bordered,
  compact,
}: DefaultTableProps<T>) {
  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: compact ? 13 : 14,
  };

  const headerCellStyle: React.CSSProperties = {
    padding: compact ? "8px 12px" : "12px 16px",
    textAlign: "left",
    borderBottom: "2px solid #e0e0e0",
    fontWeight: 600,
    backgroundColor: "#fafafa",
  };

  const cellStyle = (index: number): React.CSSProperties => ({
    padding: compact ? "8px 12px" : "12px 16px",
    borderBottom: bordered ? "1px solid #e0e0e0" : "none",
    backgroundColor: striped && index % 2 === 1 ? "#fafafa" : "white",
  });

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data.map((_, i) => i));
    }
  };

  const handleSelectRow = (index: number) => {
    if (selectedRows.includes(index)) {
      onSelectionChange?.(selectedRows.filter((i) => i !== index));
    } else {
      onSelectionChange?.([...selectedRows, index]);
    }
  };

  if (loading) {
    return (
      <div className={`lum-table lum-table--loading ${className || ""}`} style={{ padding: 40, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`lum-table lum-table--empty ${className || ""}`} style={{ padding: 40, textAlign: "center" }}>
        {emptyContent || "No data available"}
      </div>
    );
  }

  return (
    <div className={`lum-table ${className || ""}`} style={{ overflow: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {selectable && (
              <th style={{ ...headerCellStyle, width: 40 }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...headerCellStyle,
                  width: col.width,
                  textAlign: col.align || "left",
                  cursor: col.sortable ? "pointer" : "default",
                }}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                {col.header}
                {col.sortable && sortColumn === col.key && (
                  <span style={{ marginLeft: 4 }}>{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
            ))}
            {rowActions && rowActions.length > 0 && (
              <th style={{ ...headerCellStyle, width: 100 }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row, index)}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
            >
              {selectable && (
                <td style={cellStyle(index)}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleSelectRow(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              )}
              {columns.map((col) => {
                const value = (row as any)[col.key];
                return (
                  <td key={col.key} style={{ ...cellStyle(index), textAlign: col.align || "left" }}>
                    {col.render ? col.render(value, row, index) : value}
                  </td>
                );
              })}
              {rowActions && rowActions.length > 0 && (
                <td style={cellStyle(index)}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {rowActions.map((action) => {
                      const isDisabled =
                        typeof action.disabled === "function"
                          ? action.disabled(row)
                          : action.disabled;
                      return (
                        <button
                          key={action.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row, index);
                          }}
                          disabled={isDisabled}
                          style={{
                            padding: "4px 8px",
                            fontSize: 12,
                            border: "1px solid",
                            borderRadius: 4,
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            opacity: isDisabled ? 0.5 : 1,
                            backgroundColor: action.variant === "danger" ? "#fff5f5" : "white",
                            borderColor: action.variant === "danger" ? "#d32f2f" : "#ccc",
                            color: action.variant === "danger" ? "#d32f2f" : "#333",
                          }}
                        >
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// DEFAULT PAGINATION COMPONENT
// =============================================================================

interface DefaultPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function DefaultPagination({
  page,
  pageSize,
  totalCount,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
}: DefaultPaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalCount);

  return (
    <div
      className="lum-table__pagination"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ padding: "4px 8px" }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div>
        {startItem}-{endItem} of {totalCount}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange(0)}
          style={{ padding: "4px 8px" }}
        >
          {"<<"}
        </button>
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          style={{ padding: "4px 8px" }}
        >
          {"<"}
        </button>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          style={{ padding: "4px 8px" }}
        >
          {">"}
        </button>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
          style={{ padding: "4px 8px" }}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// TABLE RENDERER COMPONENT
// =============================================================================

/**
 * Renders a standalone Table container.
 *
 * @example
 * ```typescript
 * // With Table class
 * const usersTable = new UsersTable("users");
 *
 * <TableRenderer
 *   config={usersTable.build()}
 *   context={formContext}
 *   data={users}
 * />
 *
 * // With createTable
 * const table = createTable<User>("users", (t) => {
 *   t.column("name").header("Name").sortable().end();
 *   t.column("email").header("Email").end();
 *   t.selectable().pagination({ pageSize: 20 });
 * });
 *
 * <TableRenderer config={table} context={context} data={users} />
 * ```
 */
export function TableRenderer<T = any>({
  config,
  context,
  data: propData,
  loading: propLoading,
  totalCount: propTotalCount,
  onStateChange,
  className,
  emptyContent,
  renderRow,
}: TableRendererProps<T>) {
  // Table state
  const [tableState, setTableState] = useState<TableState>({
    page: 0,
    pageSize: config.pagination?.pageSize || 10,
    sortColumn: config.defaultSort?.column,
    sortDirection: config.defaultSort?.direction,
    filters: {},
    searchQuery: "",
    selectedRows: [],
  });

  // Internal data state for async loading
  const [internalData, setInternalData] = useState<T[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);

  // Resolve data source
  useEffect(() => {
    const loadData = async () => {
      if (propData !== undefined) {
        return; // Using prop data
      }

      if (typeof config.data === "function") {
        setInternalLoading(true);
        try {
          const result = await config.data(context);
          setInternalData(result);
        } catch (error) {
          console.error("Table data load error:", error);
          setInternalData([]);
        }
        setInternalLoading(false);
      } else if (Array.isArray(config.data)) {
        setInternalData(config.data);
      }
    };

    loadData();
  }, [config.data, context, propData]);

  // Determine actual data and loading state
  const data = propData ?? internalData;
  const loading =
    propLoading ??
    internalLoading ??
    (typeof config.loading === "function" ? config.loading(context) : config.loading);

  // Check container visibility
  const containerVisible = useMemo(() => {
    if (!config.visibility) return true;
    return evaluateVisibility(config.visibility, context).isVisible;
  }, [config.visibility, context]);

  if (!containerVisible) {
    return null;
  }

  // Notify state changes
  useEffect(() => {
    onStateChange?.(tableState);
  }, [tableState, onStateChange]);

  // Process columns - resolve dynamic values
  const processedColumns = useMemo(() => {
    return config.columns
      .filter((col) => {
        if (col.hidden) return false;
        if (col.visibility) {
          return evaluateVisibility(col.visibility, context).isVisible;
        }
        return true;
      })
      .map((col) => ({
        key: col.key,
        header: typeof col.header === "function" ? col.header(context) : col.header,
        width: col.width,
        align: col.align,
        sortable: col.sortable,
        render: col.render
          ? (value: any, row: T, index: number) => col.render!(value, row, index, context)
          : col.component
          ? (value: any, row: T, index: number) => {
              const Component = resolveComponent(col.component!);
              if (Component) {
                return <Component value={value} row={row} index={index} ctx={context} />;
              }
              return value;
            }
          : undefined,
      }));
  }, [config.columns, context]);

  // Process row actions
  const processedRowActions = useMemo(() => {
    if (!config.rowActions) return undefined;

    return config.rowActions
      .filter((action) => {
        if (typeof action.hidden === "function") {
          return !action.hidden({} as T, context); // Check with empty row for general visibility
        }
        return !action.hidden;
      })
      .map((action) => ({
        id: action.id,
        label: typeof action.label === "function" ? action.label({} as T, context) : action.label,
        onClick: (row: T, index: number) => action.onClick(row, index, context),
        disabled: action.disabled
          ? typeof action.disabled === "function"
            ? (row: T) => (action.disabled as (row: T, ctx: FormContext) => boolean)(row, context)
            : action.disabled
          : false,
        variant: action.variant,
      }));
  }, [config.rowActions, context]);

  // Sorting
  const handleSort = useCallback(
    (column: string) => {
      setTableState((prev) => ({
        ...prev,
        sortColumn: column,
        sortDirection:
          prev.sortColumn === column && prev.sortDirection === "asc" ? "desc" : "asc",
      }));
    },
    []
  );

  // Selection
  const handleSelectionChange = useCallback((indices: number[]) => {
    setTableState((prev) => ({ ...prev, selectedRows: indices }));
  }, []);

  // Row click
  const handleRowClick = useCallback(
    (row: T, index: number) => {
      config.onRowClick?.(row, index, context);
    },
    [config, context]
  );

  // Pagination
  const handlePageChange = useCallback((page: number) => {
    setTableState((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setTableState((prev) => ({ ...prev, pageSize, page: 0 }));
  }, []);

  // Apply client-side sorting
  const sortedData = useMemo(() => {
    if (!tableState.sortColumn || config.pagination?.serverSide) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = (a as any)[tableState.sortColumn!];
      const bVal = (b as any)[tableState.sortColumn!];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return tableState.sortDirection === "desc" ? -comparison : comparison;
    });
  }, [data, tableState.sortColumn, tableState.sortDirection, config.pagination?.serverSide]);

  // Apply client-side pagination
  const paginatedData = useMemo(() => {
    if (!config.pagination?.enabled || config.pagination?.serverSide) {
      return sortedData;
    }

    const start = tableState.page * tableState.pageSize;
    return sortedData.slice(start, start + tableState.pageSize);
  }, [sortedData, tableState.page, tableState.pageSize, config.pagination]);

  // Total count for pagination
  const totalCount = useMemo(() => {
    if (propTotalCount !== undefined) return propTotalCount;
    if (typeof config.pagination?.totalCount === "function") {
      return config.pagination.totalCount(context);
    }
    if (typeof config.pagination?.totalCount === "number") {
      return config.pagination.totalCount;
    }
    return data.length;
  }, [propTotalCount, config.pagination?.totalCount, context, data.length]);

  // Get table component from adapter
  const adapter = Lumino.ui.get();
  const TableComponent = adapter?.lists?.Table || DefaultTable;
  const PaginationComponent = adapter?.navigation?.Pagination || DefaultPagination;

  // Resolve empty content
  const resolvedEmptyContent = useMemo(() => {
    if (emptyContent) return emptyContent;
    if (typeof config.emptyContent === "function") {
      return config.emptyContent(context);
    }
    return config.emptyContent;
  }, [emptyContent, config.emptyContent, context]);

  return (
    <div className={`lum-table-container ${config.cssClass || ""} ${className || ""}`.trim()}>
      {/* Search bar */}
      {config.searchable && (
        <div className="lum-table__search" style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder={config.searchPlaceholder || "Search..."}
            value={tableState.searchQuery}
            onChange={(e) => setTableState((prev) => ({ ...prev, searchQuery: e.target.value, page: 0 }))}
            style={{ padding: "8px 12px", width: "100%", maxWidth: 300 }}
          />
        </div>
      )}

      {/* Bulk actions */}
      {config.bulkActions && tableState.selectedRows.length > 0 && (
        <div className="lum-table__bulk-actions" style={{ marginBottom: 16, display: "flex", gap: 8 }}>
          <span>{tableState.selectedRows.length} selected</span>
          {config.bulkActions.map((action) => {
            const selectedItems = tableState.selectedRows.map((i) => data[i]);
            const disabled =
              typeof action.disabled === "function"
                ? action.disabled(selectedItems, context)
                : action.disabled;

            return (
              <button
                key={action.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (action.confirm) {
                    const msg = typeof action.confirm === "string" ? action.confirm : "Are you sure?";
                    if (window.confirm(msg)) {
                      action.onClick(selectedItems, context);
                    }
                  } else {
                    action.onClick(selectedItems, context);
                  }
                }}
                style={{
                  padding: "6px 12px",
                  backgroundColor: action.variant === "danger" ? "#d32f2f" : action.variant === "primary" ? "#1976d2" : "white",
                  color: action.variant === "danger" || action.variant === "primary" ? "white" : "#333",
                  border: "1px solid",
                  borderColor: action.variant === "danger" ? "#d32f2f" : action.variant === "primary" ? "#1976d2" : "#ccc",
                  borderRadius: 4,
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Table */}
      <TableComponent
        columns={processedColumns}
        data={paginatedData}
        loading={loading}
        emptyContent={resolvedEmptyContent}
        sortColumn={tableState.sortColumn}
        sortDirection={tableState.sortDirection}
        onSort={config.sortable ? handleSort : undefined}
        selectable={config.selectable}
        selectedRows={tableState.selectedRows}
        onSelectionChange={config.selectable ? handleSelectionChange : undefined}
        onRowClick={config.onRowClick ? handleRowClick : undefined}
        rowActions={processedRowActions}
        striped={config.striped}
        bordered={config.bordered}
        compact={config.compact}
      />

      {/* Pagination */}
      {config.pagination?.enabled && (
        <PaginationComponent
          page={tableState.page}
          pageSize={tableState.pageSize}
          totalCount={totalCount}
          pageSizeOptions={config.pagination.pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}

// =============================================================================
// TABLE HOOK
// =============================================================================

export interface UseTableReturn<T> {
  /** Current table state */
  state: TableState;
  /** Update table state */
  setState: React.Dispatch<React.SetStateAction<TableState>>;
  /** Selected items */
  selectedItems: T[];
  /** Clear selection */
  clearSelection: () => void;
  /** Select all */
  selectAll: (data: T[]) => void;
}

/**
 * Hook for managing table state externally.
 *
 * @example
 * ```typescript
 * const table = useTable<User>();
 *
 * <TableRenderer
 *   config={usersTable}
 *   context={context}
 *   data={users}
 *   onStateChange={(state) => table.setState(state)}
 * />
 * ```
 */
export function useTable<T>(initialState?: Partial<TableState>): UseTableReturn<T> {
  const [state, setState] = useState<TableState>({
    page: 0,
    pageSize: 10,
    filters: {},
    searchQuery: "",
    selectedRows: [],
    ...initialState,
  });

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedRows: [] }));
  }, []);

  const selectAll = useCallback((data: T[]) => {
    setState((prev) => ({ ...prev, selectedRows: data.map((_, i) => i) }));
  }, []);

  return {
    state,
    setState,
    selectedItems: [], // Would need data passed to resolve
    clearSelection,
    selectAll,
  };
}

// =============================================================================
// EXPORTS (types only - functions are already exported inline)
// =============================================================================

export type { TableState };
