/**
 * Lumino Framework - Tabs Renderer
 *
 * Renders standalone Tabs container configurations.
 * UI-library independent - uses UI adapter for actual rendering.
 */

import React, { useState, useMemo, useCallback, ReactNode } from "react";
import type { TabsConfig, TabConfig } from "../../core/containers/Tabs";
import type { FormContext } from "../../core/types/context";
import { Lumino } from "../../core/Lumino";
import { evaluateVisibility } from "../../core/utils/visibility";
import { FormRenderer, resolveComponent } from "./FormRenderer";

// =============================================================================
// TABS RENDERER PROPS
// =============================================================================

export interface TabsRendererProps {
  /** Tabs configuration (from Tabs.build() or createTabs()) */
  config: TabsConfig;
  /** Form context (for dynamic labels, visibility, etc.) */
  context: FormContext;
  /** Initial active tab (overrides config) */
  initialTab?: string | number;
  /** Controlled active tab */
  activeTab?: string | number;
  /** Called when active tab changes */
  onTabChange?: (tabId: string) => void;
  /** Custom class name */
  className?: string;
  /** Render prop for custom tab content */
  children?: (activeTabId: string, tabConfig: TabConfig) => ReactNode;
}

// =============================================================================
// DEFAULT TABS COMPONENT (fallback)
// =============================================================================

interface DefaultTabsProps {
  tabs: Array<{ id: string; label: string; disabled?: boolean; badge?: string | number }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  children: ReactNode;
}

function DefaultTabs({ tabs, activeTab, onTabChange, position = "top", className, children }: DefaultTabsProps) {
  const isVertical = position === "left" || position === "right";

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isVertical ? "row" : "column",
  };

  const tabListStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isVertical ? "column" : "row",
    borderBottom: !isVertical ? "1px solid #e0e0e0" : undefined,
    borderRight: position === "left" ? "1px solid #e0e0e0" : undefined,
    borderLeft: position === "right" ? "1px solid #e0e0e0" : undefined,
    order: position === "right" || position === "bottom" ? 1 : 0,
  };

  const tabStyle = (isActive: boolean, disabled: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    border: "none",
    background: isActive ? "#f5f5f5" : "transparent",
    borderBottom: !isVertical && isActive ? "2px solid #1976d2" : "none",
    borderLeft: position === "left" && isActive ? "2px solid #1976d2" : "none",
    borderRight: position === "right" && isActive ? "2px solid #1976d2" : "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontWeight: isActive ? 600 : 400,
  });

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: "16px",
  };

  return (
    <div className={`lum-tabs ${className || ""}`} style={containerStyle}>
      <div className="lum-tabs__list" style={tabListStyle} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTab}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            style={tabStyle(tab.id === activeTab, !!tab.disabled)}
            className={`lum-tabs__tab ${tab.id === activeTab ? "lum-tabs__tab--active" : ""}`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="lum-tabs__badge" style={{ marginLeft: 8 }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="lum-tabs__content" style={contentStyle} role="tabpanel">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// TABS RENDERER COMPONENT
// =============================================================================

/**
 * Renders a standalone Tabs container.
 *
 * @example
 * ```typescript
 * // With Tabs class
 * const settingsTabs = new SettingsTabs("settings");
 *
 * <TabsRenderer config={settingsTabs.build()} context={formContext} />
 *
 * // With createTabs
 * const tabs = createTabs("myTabs", (t) => {
 *   t.tab("general").label("General").form(GeneralForm).end();
 *   t.tab("advanced").label("Advanced").form(AdvancedForm).end();
 * });
 *
 * <TabsRenderer config={tabs} context={formContext} />
 * ```
 */
export function TabsRenderer({
  config,
  context,
  initialTab,
  activeTab: controlledActiveTab,
  onTabChange,
  className,
  children,
}: TabsRendererProps) {
  // Determine initial tab
  const defaultTab = useMemo(() => {
    if (initialTab !== undefined) {
      if (typeof initialTab === "number") {
        return config.tabs[initialTab]?.id || config.tabs[0]?.id || "";
      }
      return initialTab;
    }
    if (config.initialTab !== undefined) {
      if (typeof config.initialTab === "number") {
        return config.tabs[config.initialTab]?.id || config.tabs[0]?.id || "";
      }
      return config.initialTab;
    }
    return config.tabs[0]?.id || "";
  }, [config.tabs, config.initialTab, initialTab]);

  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab);

  // Use controlled or internal state
  const activeTabId = controlledActiveTab !== undefined
    ? (typeof controlledActiveTab === "number"
        ? config.tabs[controlledActiveTab]?.id || ""
        : controlledActiveTab)
    : internalActiveTab;

  // Handle tab change
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(tabId);
      }
      onTabChange?.(tabId);
      config.onChange?.(tabId, context);
    },
    [controlledActiveTab, onTabChange, config, context]
  );

  // Handle add tab
  const handleAddTab = useCallback(() => {
    config.onAdd?.(context);
  }, [config, context]);

  // Handle close tab
  const handleCloseTab = useCallback(
    (tabId: string) => {
      config.onClose?.(tabId, context);
    },
    [config, context]
  );

  // Check container visibility
  const containerVisible = useMemo(() => {
    if (!config.visibility) return true;
    return evaluateVisibility(config.visibility, context).isVisible;
  }, [config.visibility, context]);

  if (!containerVisible) {
    return null;
  }

  // Process tabs - resolve dynamic values
  const processedTabs = useMemo(() => {
    return config.tabs
      .filter((tab) => {
        if (!tab.visibility) return true;
        return evaluateVisibility(tab.visibility, context).isVisible;
      })
      .map((tab) => ({
        id: tab.id,
        label: typeof tab.label === "function" ? tab.label(context) : tab.label,
        icon: tab.icon,
        disabled: typeof tab.disabled === "function" ? tab.disabled(context) : tab.disabled,
        badge: typeof tab.badge === "function" ? tab.badge(context) : tab.badge,
        closable: tab.closable,
      }));
  }, [config.tabs, context]);

  // Get current tab config
  const currentTabConfig = useMemo(() => {
    return config.tabs.find((t) => t.id === activeTabId);
  }, [config.tabs, activeTabId]);

  // Render a single tab's content
  const renderSingleTabContent = useCallback((tabConfig: TabConfig) => {
    // Custom render via children prop
    if (children) {
      return children(tabConfig.id, tabConfig);
    }

    // Custom render function on tab
    if (tabConfig.render) {
      return tabConfig.render(context);
    }

    // Form class
    if (tabConfig.form) {
      const FormClass = tabConfig.form;
      const formInstance = new FormClass(tabConfig.id);
      const formProps =
        typeof tabConfig.props === "function"
          ? tabConfig.props(context)
          : tabConfig.props || {};

      return <FormRenderer form={formInstance} {...formProps} />;
    }

    // Custom component
    if (tabConfig.component) {
      const Component = resolveComponent(tabConfig.component);
      if (Component) {
        const componentProps =
          typeof tabConfig.props === "function"
            ? tabConfig.props(context)
            : tabConfig.props || {};
        return <Component {...componentProps} context={context} />;
      }
    }

    return null;
  }, [children, context]);

  // Render ALL tab contents (for adapters like Salt that expect all children)
  const renderAllTabContents = useMemo(() => {
    return config.tabs.map((tabConfig) => (
      <React.Fragment key={tabConfig.id}>
        {renderSingleTabContent(tabConfig)}
      </React.Fragment>
    ));
  }, [config.tabs, renderSingleTabContent]);

  // Get tabs component from adapter
  const adapter = Lumino.ui.get();
  const TabsComponent = adapter?.containers?.Tabs || DefaultTabs;

  return (
    <TabsComponent
      tabs={processedTabs}
      activeTab={activeTabId}
      onTabChange={handleTabChange}
      position={config.position}
      className={`${config.cssClass || ""} ${className || ""}`.trim() || undefined}
      addable={config.addable}
      onAdd={config.addable ? handleAddTab : undefined}
      addLabel={config.addLabel}
      onClose={handleCloseTab}
    >
      {renderAllTabContents}
    </TabsComponent>
  );
}

// Component is already exported inline with export function
