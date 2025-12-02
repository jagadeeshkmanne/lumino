/**
 * Lumino Framework - Salt Tabs Adapter
 *
 * Uses createLuminoComponent with custom render for TabPanel children.
 * Supports both container adapter interface (tabs, activeTab) and
 * standard interface (items, activeIndex).
 */

import React from "react";
import { Tabs, TabPanel } from "@salt-ds/lab";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoTabs - Salt Tabs with Lumino interface
 *
 * Supports two interfaces:
 *
 * 1. Container Adapter interface (from TabsRenderer):
 *    - tabs: Array<{ id, label, disabled?, icon?, badge?, closable? }>
 *    - activeTab: string (tab id)
 *    - onTabChange: (tabId: string) => void
 *
 * 2. Standard interface:
 *    - items: Array<{ key, label, disabled?, closable? }>
 *    - activeIndex: number
 *    - onChange: (index: number) => void
 *
 * @example
 * ```tsx
 * // Standard interface
 * <LuminoTabs
 *   activeIndex={activeIndex}
 *   onChange={setActiveIndex}
 *   items={[
 *     { key: "home", label: "Home" },
 *     { key: "settings", label: "Settings", closable: true },
 *   ]}
 * >
 *   <HomeContent />
 *   <SettingsContent />
 * </LuminoTabs>
 *
 * // Container adapter interface (used by TabsRenderer)
 * <LuminoTabs
 *   tabs={[{ id: "home", label: "Home" }]}
 *   activeTab="home"
 *   onTabChange={(id) => setActiveTabId(id)}
 * >
 *   <HomeContent />
 * </LuminoTabs>
 * ```
 */
export const LuminoTabs = createLuminoComponent(Tabs, {
  props: {
    activeIndex: "activeTabIndex",
    addable: "enableAddTab",
  },
  events: {
    onChange: {
      to: "onActiveChange",
      extract: (index: number) => index,
    },
    onAdd: {
      to: "onAddTab",
      extract: () => undefined,
    },
    onClose: {
      to: "onCloseTab",
      extract: (index: number) => index,
    },
  },
  exclude: ["items", "tabs", "closable", "activeTab", "onTabChange"],
  render: (transformedProps, _Tabs, originalProps) => {
    const {
      children,
      items,
      tabs, // Container adapter uses 'tabs' instead of 'items'
      activeTab, // Container adapter uses 'activeTab' (string id) instead of 'activeIndex'
      onTabChange, // Container adapter uses 'onTabChange' instead of 'onChange'
      closable,
      className,
      style,
      "data-testid": testId,
    } = originalProps as any;

    // Normalize: support both 'items' and 'tabs' prop names
    const tabItems = items || tabs || [];

    // Convert children to array for mapping to tab panels
    const childArray = React.Children.toArray(children);

    // Calculate activeTabIndex from activeTab (string id) if provided
    let activeTabIndex = transformedProps.activeTabIndex;
    if (activeTab !== undefined && tabItems.length > 0) {
      const index = tabItems.findIndex((item: any) =>
        (item.id || item.key) === activeTab
      );
      if (index !== -1) {
        activeTabIndex = index;
      }
    }

    // Create wrapped onActiveChange that handles both interfaces
    const handleActiveChange = (newIndex: number) => {
      // Call standard onChange if provided
      if (transformedProps.onActiveChange) {
        transformedProps.onActiveChange(newIndex);
      }
      // Call onTabChange with tab id if using container adapter interface
      if (onTabChange && tabItems[newIndex]) {
        const tabId = tabItems[newIndex].id || tabItems[newIndex].key;
        onTabChange(tabId);
      }
    };

    // Guard against empty tabs
    if (!tabItems || tabItems.length === 0) {
      return (
        <div className={luminoClass("container", "tabs", className)} style={style}>
          {children}
        </div>
      );
    }

    return (
      <Tabs
        {...transformedProps}
        activeTabIndex={activeTabIndex}
        onActiveChange={handleActiveChange}
        className={luminoClass("container", "tabs", className)}
        style={style}
        data-testid={testId}
      >
        {tabItems.map((item: any, index: number) => {
          // Support both 'key' and 'id' for tab identifier
          const tabId = item.id || item.key || String(index);
          return (
            <TabPanel
              key={tabId}
              id={tabId}
              label={typeof item.label === "string" ? item.label : String(item.label || "")}
              disabled={item.disabled}
              enableClose={closable || item.closable}
              style={{ paddingTop: 20 }}
            >
              {childArray[index] || null}
            </TabPanel>
          );
        })}
      </Tabs>
    );
  },
});

/**
 * LuminoTabPanel - Content panel for a tab
 *
 * Use this for explicit control over tab content visibility.
 * Only renders children when index matches activeIndex.
 */
export const LuminoTabPanel = createLuminoComponent(
  ({ children, index, activeIndex, className, style }: any) => {
    if (index !== activeIndex) return null;
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
);
