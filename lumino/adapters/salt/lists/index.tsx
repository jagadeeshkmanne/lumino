/**
 * Lumino Framework - Salt List Display Adapter
 *
 * Uses createLuminoComponent for list components.
 * All components use "Lumino" prefix for consistency.
 */

import React from "react";
import { Tabs, TabPanel, Table, THead, TBody, TR, TH, TD } from "@salt-ds/lab";
import { createLuminoComponent } from "../../../core/adapters";
import type { IListAdapter, ListTabsProps, ListTableProps, ListCardsProps } from "../../../core/adapters";
import { luminoClass } from "../utils";

// Placeholder components for typing
const ListTabsPlaceholder: React.FC<any> = () => null;
const ListTablePlaceholder: React.FC<any> = () => null;
const ListCardsPlaceholder: React.FC<any> = () => null;

/**
 * LuminoListTabs - List rendered as tabs
 *
 * Custom render needed for dynamic tab generation from items array
 */
export const LuminoListTabs = createLuminoComponent(ListTabsPlaceholder, {
  render: (_transformedProps, _Component, originalProps) => {
    const {
      items,
      activeIndex,
      onTabChange,
      getLabel,
      addButton,
      onAdd,
      onClose,
      className,
      children,
    } = originalProps as ListTabsProps;

    if (!items || items.length === 0) {
      return (
        <div className={luminoClass("list", "tabs-empty", className)}>
          <p style={{ color: "#666", margin: 0 }}>No items yet. Click the button above to add one.</p>
        </div>
      );
    }

    const tabItems = items.map((item, index) => ({
      key: `tab-${index}`,
      label: getLabel ? getLabel(item, index) : `Item ${index + 1}`,
    }));

    return (
      <Tabs
        activeTabIndex={activeIndex}
        onActiveChange={onTabChange}
        enableAddTab={!!onAdd}
        onAddTab={onAdd}
        onCloseTab={onClose}
        className={luminoClass("list", "tabs", className)}
        style={{ "--saltTabPanel-padding": "var(--salt-spacing-100, 8px)" } as React.CSSProperties}
      >
        {tabItems.map((tab) => (
          <TabPanel
            key={tab.key}
            label={tab.label}
            enableClose={!!onClose}
          >
            {children}
          </TabPanel>
        ))}
      </Tabs>
    );
  },
});

/**
 * LuminoListTable - List rendered as table
 *
 * Custom render needed for column/row mapping
 */
export const LuminoListTable = createLuminoComponent(ListTablePlaceholder, {
  render: (_transformedProps, _Component, originalProps) => {
    const {
      data,
      columns,
      onRowClick,
      rowActions,
      className,
    } = originalProps as ListTableProps;

    if (!data || data.length === 0) {
      return (
        <div className={luminoClass("list", "table-empty", className)}>
          <p style={{ color: "#666", margin: 0 }}>No items yet. Click the button above to add one.</p>
        </div>
      );
    }

    return (
      <Table className={luminoClass("list", "table")}>
        <THead>
          <TR>
            {columns.map((col) => (
              <TH key={col.key} style={{ width: col.width }}>
                {col.label}
              </TH>
            ))}
            {rowActions && rowActions.length > 0 && (
              <TH style={{ textAlign: "right" }}>Actions</TH>
            )}
          </TR>
        </THead>
        <TBody>
          {data.map((item, index) => (
            <TR
              key={index}
              onClick={() => onRowClick?.(index)}
              style={{ cursor: onRowClick ? "pointer" : undefined }}
            >
              {columns.map((col) => (
                <TD key={col.key}>
                  {col.render ? col.render(item[col.key], item, index) : item[col.key]}
                </TD>
              ))}
              {rowActions && rowActions.length > 0 && (
                <TD style={{ textAlign: "right" }}>
                  {rowActions.map((action, actionIndex) => {
                    const isEnabled = action.enabled ? action.enabled(index) : true;
                    return (
                      <button
                        key={actionIndex}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(index);
                        }}
                        disabled={!isEnabled}
                        style={{
                          marginLeft: 8,
                          padding: "4px 8px",
                          cursor: isEnabled ? "pointer" : "not-allowed",
                          opacity: isEnabled ? 1 : 0.5,
                        }}
                      >
                        {action.label}
                      </button>
                    );
                  })}
                </TD>
              )}
            </TR>
          ))}
        </TBody>
      </Table>
    );
  },
});

/**
 * LuminoListCards - List rendered as card grid
 *
 * Custom render needed for card layout
 */
export const LuminoListCards = createLuminoComponent(ListCardsPlaceholder, {
  render: (_transformedProps, _Component, originalProps) => {
    const { items, renderCard, className } = originalProps as ListCardsProps;

    if (!items || items.length === 0) {
      return (
        <div className={luminoClass("list", "cards-empty", className)}>
          <p style={{ color: "#666", margin: 0 }}>No items yet. Click the button above to add one.</p>
        </div>
      );
    }

    return (
      <div
        className={luminoClass("list", "cards")}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item, index) => (
          <div key={index} className={luminoClass("list", "card-item")}>
            {renderCard(item, index)}
          </div>
        ))}
      </div>
    );
  },
});

/**
 * Table Components - Direct exports from Salt
 */
export const LuminoTableComponents = {
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
};

/**
 * Salt List Display Adapter
 */
export const saltListAdapter: IListAdapter = {
  Tabs: LuminoListTabs as any,
  Table: LuminoListTable as any,
  Cards: LuminoListCards as any,
  TableComponents: LuminoTableComponents,
};

// Legacy aliases for backward compatibility
export { LuminoListTabs as SaltListTabs };
export { LuminoListTable as SaltListTable };
export { LuminoListCards as SaltListCards };
export { LuminoTableComponents as SaltTableComponents };
