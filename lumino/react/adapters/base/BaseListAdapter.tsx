/**
 * Lumino Framework - Base List Adapter
 *
 * Abstract base implementations for list display components.
 * UI-specific adapters extend these with their own styling.
 */

import React, { ReactNode } from "react";
import type {
  ListAdapter,
  ListRowsProps,
  ListTableProps,
  ListCardsProps,
} from "../../../core/types/ui";
import { lumCss } from "../../../core/types/ui";

// =============================================================================
// STYLE PROVIDERS - Override in specific adapters
// =============================================================================

/**
 * Style provider interface for list components.
 * Adapters implement this to provide their own styles.
 */
export interface ListStyleProvider {
  // Rows styles
  getRowsContainerStyle(props: ListRowsProps): React.CSSProperties;
  getRowsItemStyle(props: ListRowsProps, index: number): React.CSSProperties;
  getRowsRemoveButtonStyle(props: ListRowsProps): React.CSSProperties;
  getRowsAddButtonStyle(props: ListRowsProps): React.CSSProperties;
  getRowsEmptyStyle(props: ListRowsProps): React.CSSProperties;
  getRowsReorderHandleStyle(props: ListRowsProps): React.CSSProperties;

  // Table styles
  getTableContainerStyle(props: ListTableProps): React.CSSProperties;
  getTableStyle(props: ListTableProps): React.CSSProperties;
  getTableHeaderStyle(props: ListTableProps): React.CSSProperties;
  getTableHeaderCellStyle(props: ListTableProps, columnKey: string, sortable?: boolean): React.CSSProperties;
  getTableRowStyle(props: ListTableProps, index: number, isSelected: boolean): React.CSSProperties;
  getTableCellStyle(props: ListTableProps): React.CSSProperties;
  getTableEmptyStyle(props: ListTableProps): React.CSSProperties;

  // Cards styles
  getCardsGridStyle(props: ListCardsProps): React.CSSProperties;
  getCardsItemStyle(props: ListCardsProps, index: number): React.CSSProperties;
  getCardsAddButtonStyle(props: ListCardsProps): React.CSSProperties;
  getCardsEmptyStyle(props: ListCardsProps): React.CSSProperties;
}

// =============================================================================
// DEFAULT STYLE PROVIDER
// =============================================================================

/**
 * Default style provider with basic CSS styles.
 * Override specific methods in UI-specific adapters.
 */
export const defaultListStyles: ListStyleProvider = {
  // Rows styles
  getRowsContainerStyle: ({ gap = 8 }) => ({
    display: "flex",
    flexDirection: "column",
    gap: typeof gap === "number" ? `${gap}px` : gap,
  }),

  getRowsItemStyle: () => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #e0e0e0",
    backgroundColor: "white",
  }),

  getRowsRemoveButtonStyle: () => ({
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "4px 8px",
    color: "#d32f2f",
    fontSize: "16px",
    flexShrink: 0,
  }),

  getRowsAddButtonStyle: ({ addButton }) => ({
    padding: "8px 16px",
    border: "1px dashed #1976d2",
    borderRadius: "4px",
    background: "transparent",
    color: "#1976d2",
    cursor: addButton?.disabled ? "not-allowed" : "pointer",
    opacity: addButton?.disabled ? 0.5 : 1,
    width: "100%",
    marginTop: "8px",
  }),

  getRowsEmptyStyle: () => ({
    padding: "24px",
    textAlign: "center",
    color: "#666",
  }),

  getRowsReorderHandleStyle: () => ({
    cursor: "grab",
    padding: "0 4px",
    color: "#999",
  }),

  // Table styles
  getTableContainerStyle: () => ({
    overflowX: "auto",
  }),

  getTableStyle: () => ({
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
  }),

  getTableHeaderStyle: () => ({}),

  getTableHeaderCellStyle: (props, columnKey, sortable) => ({
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #e0e0e0",
    color: "#666",
    cursor: sortable ? "pointer" : "default",
  }),

  getTableRowStyle: (props, index, isSelected) => ({
    cursor: props.onRowClick ? "pointer" : "default",
    backgroundColor: isSelected ? "#e3f2fd" : undefined,
  }),

  getTableCellStyle: () => ({
    padding: "12px 16px",
    borderBottom: "1px solid #e0e0e0",
  }),

  getTableEmptyStyle: () => ({
    textAlign: "center",
    padding: "48px",
    color: "#666",
  }),

  // Cards styles
  getCardsGridStyle: ({ columns = 3, gap = 16 }) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: typeof gap === "number" ? `${gap}px` : gap,
  }),

  getCardsItemStyle: () => ({}),

  getCardsAddButtonStyle: ({ addButton }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
    border: "2px dashed #1976d2",
    borderRadius: "8px",
    color: "#1976d2",
    cursor: addButton?.disabled ? "not-allowed" : "pointer",
    opacity: addButton?.disabled ? 0.5 : 1,
    backgroundColor: "transparent",
    fontSize: "16px",
  }),

  getCardsEmptyStyle: () => ({
    textAlign: "center",
    padding: "48px",
    color: "#666",
  }),
};

// =============================================================================
// BASE LIST ROWS COMPONENT
// =============================================================================

export interface BaseListRowsProps extends ListRowsProps {
  styles?: ListStyleProvider;
  /** Custom remove icon */
  removeIcon?: ReactNode;
  /** Custom reorder handle */
  reorderHandle?: ReactNode;
}

/**
 * Base ListRows component - vertical list of items.
 * Handles list logic, delegates styling to provider.
 */
export function BaseListRows({
  items,
  renderItem,
  emptyContent,
  addButton,
  onRemove,
  reorderable,
  gap = 8,
  className,
  styles = defaultListStyles,
  removeIcon = "×",
  reorderHandle = "⋮⋮",
}: BaseListRowsProps) {
  const props: ListRowsProps = { items, renderItem, emptyContent, addButton, onRemove, reorderable, gap, className };

  const containerStyle = styles.getRowsContainerStyle(props);
  const addButtonStyle = styles.getRowsAddButtonStyle(props);
  const emptyStyle = styles.getRowsEmptyStyle(props);
  const reorderHandleStyle = styles.getRowsReorderHandleStyle(props);

  if (items.length === 0 && emptyContent) {
    return (
      <div className={`lum-list-rows ${className || ""}`.trim()}>
        <div style={emptyStyle}>{emptyContent}</div>
        {addButton && addButton.position === "bottom" && (
          <button
            onClick={addButton.onClick}
            disabled={addButton.disabled}
            style={addButtonStyle}
            className="lum-list__add-btn"
          >
            {addButton.label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`lum-list-rows ${className || ""}`.trim()}>
      {addButton && addButton.position === "top" && (
        <button
          onClick={addButton.onClick}
          disabled={addButton.disabled}
          style={{ ...addButtonStyle, marginTop: 0, marginBottom: "8px" }}
          className="lum-list__add-btn"
        >
          {addButton.label}
        </button>
      )}
      <div style={containerStyle}>
        {items.map((item, index) => {
          const itemStyle = styles.getRowsItemStyle(props, index);
          const removeButtonStyle = styles.getRowsRemoveButtonStyle(props);

          return (
            <div key={index} className={lumCss.listItem(index)} style={itemStyle}>
              {reorderable && (
                <span style={reorderHandleStyle}>{reorderHandle}</span>
              )}
              <div className={lumCss.listItemContent} style={{ flex: 1 }}>
                {renderItem(item, index)}
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  style={removeButtonStyle}
                  className={lumCss.listRemoveButton}
                  aria-label="Remove item"
                >
                  {removeIcon}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {addButton && addButton.position === "bottom" && (
        <button
          onClick={addButton.onClick}
          disabled={addButton.disabled}
          style={addButtonStyle}
          className="lum-list__add-btn"
        >
          {addButton.label}
        </button>
      )}
    </div>
  );
}

// =============================================================================
// BASE LIST TABLE COMPONENT
// =============================================================================

export interface BaseListTableProps extends ListTableProps {
  styles?: ListStyleProvider;
  /** Custom sort indicator */
  sortIndicator?: (direction: "asc" | "desc") => ReactNode;
}

/**
 * Base ListTable component - tabular data display.
 * Handles table logic, delegates styling to provider.
 */
export function BaseListTable({
  items,
  columns,
  emptyContent,
  rowKey,
  onRowClick,
  selectedIndices,
  onSelectionChange,
  actionsColumn,
  sortable,
  sort,
  onSortChange,
  className,
  styles = defaultListStyles,
  sortIndicator = (direction) => direction === "asc" ? "↑" : "↓",
}: BaseListTableProps) {
  const props: ListTableProps = {
    items, columns, emptyContent, rowKey, onRowClick, selectedIndices, onSelectionChange,
    actionsColumn, sortable, sort, onSortChange, className,
  };

  const containerStyle = styles.getTableContainerStyle(props);
  const tableStyle = styles.getTableStyle(props);
  const emptyStyle = styles.getTableEmptyStyle(props);
  const cellStyle = styles.getTableCellStyle(props);

  const handleSort = (columnKey: string) => {
    if (!sortable || !onSortChange) return;
    const newDirection = sort?.column === columnKey && sort.direction === "asc" ? "desc" : "asc";
    onSortChange(columnKey, newDirection);
  };

  const handleRowSelect = (index: number) => {
    if (!onSelectionChange) return;
    const currentSelected = selectedIndices || [];
    if (currentSelected.includes(index)) {
      onSelectionChange(currentSelected.filter((i) => i !== index));
    } else {
      onSelectionChange([...currentSelected, index]);
    }
  };

  if (items.length === 0 && emptyContent) {
    return (
      <div className={`lum-list-table ${className || ""}`.trim()} style={emptyStyle}>
        {emptyContent}
      </div>
    );
  }

  return (
    <div className={`lum-list-table ${className || ""}`.trim()} style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {onSelectionChange && (
              <th style={{ ...styles.getTableHeaderCellStyle(props, "__select__", false), width: 48 }}>
                <input
                  type="checkbox"
                  checked={selectedIndices?.length === items.length}
                  onChange={() => {
                    if (selectedIndices?.length === items.length) {
                      onSelectionChange([]);
                    } else {
                      onSelectionChange(items.map((_, i) => i));
                    }
                  }}
                />
              </th>
            )}
            {columns.map((col) => {
              const headerCellStyle = styles.getTableHeaderCellStyle(props, col.key, sortable && col.sortable !== false);
              return (
                <th
                  key={col.key}
                  style={{ ...headerCellStyle, width: col.width, textAlign: col.align || "left" }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  {col.header}
                  {sort?.column === col.key && (
                    <span style={{ marginLeft: "4px" }}>{sortIndicator(sort.direction)}</span>
                  )}
                </th>
              );
            })}
            {actionsColumn && (
              <th style={{ ...styles.getTableHeaderCellStyle(props, "__actions__", false), width: actionsColumn.width || 100 }}>
                {actionsColumn.header || "Actions"}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const key = rowKey ? rowKey(item, index) : index;
            const isSelected = selectedIndices?.includes(index) ?? false;
            const rowStyle = styles.getTableRowStyle(props, index, isSelected);

            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(item, index)}
                style={rowStyle}
              >
                {onSelectionChange && (
                  <td style={cellStyle}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelect(index);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} style={{ ...cellStyle, textAlign: col.align || "left" }}>
                    {col.render ? col.render(item[col.key], item, index) : item[col.key]}
                  </td>
                ))}
                {actionsColumn && (
                  <td style={cellStyle} onClick={(e) => e.stopPropagation()}>
                    {actionsColumn.render(item, index)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// BASE LIST CARDS COMPONENT
// =============================================================================

export interface BaseListCardsProps extends ListCardsProps {
  styles?: ListStyleProvider;
}

/**
 * Base ListCards component - grid of cards.
 * Handles grid logic, delegates styling to provider.
 */
export function BaseListCards({
  items,
  renderCard,
  emptyContent,
  columns = 3,
  gap = 16,
  addButton,
  className,
  styles = defaultListStyles,
}: BaseListCardsProps) {
  const props: ListCardsProps = { items, renderCard, emptyContent, columns, gap, addButton, className };

  const gridStyle = styles.getCardsGridStyle(props);
  const addButtonStyle = styles.getCardsAddButtonStyle(props);
  const emptyStyle = styles.getCardsEmptyStyle(props);

  if (items.length === 0 && emptyContent && !addButton) {
    return (
      <div className={`lum-list-cards ${className || ""}`.trim()} style={emptyStyle}>
        {emptyContent}
      </div>
    );
  }

  return (
    <div className={`lum-list-cards ${className || ""}`.trim()} style={gridStyle}>
      {items.map((item, index) => {
        const itemStyle = styles.getCardsItemStyle(props, index);
        return (
          <div key={index} className={lumCss.listItem(index)} style={itemStyle}>
            {renderCard(item, index)}
          </div>
        );
      })}
      {addButton && (
        <button
          onClick={addButton.onClick}
          disabled={addButton.disabled}
          style={addButtonStyle}
          className="lum-list__add-btn"
        >
          + {addButton.label}
        </button>
      )}
    </div>
  );
}

// =============================================================================
// CREATE LIST ADAPTER HELPER
// =============================================================================

/**
 * Create a list adapter with custom styles.
 * Provides base components with injected style provider.
 */
export function createListAdapter(styles: Partial<ListStyleProvider> = {}): ListAdapter {
  const mergedStyles: ListStyleProvider = { ...defaultListStyles, ...styles };

  return {
    Rows: (props) => <BaseListRows {...props} styles={mergedStyles} />,
    Table: (props) => <BaseListTable {...props} styles={mergedStyles} />,
    Cards: (props) => <BaseListCards {...props} styles={mergedStyles} />,
  };
}

