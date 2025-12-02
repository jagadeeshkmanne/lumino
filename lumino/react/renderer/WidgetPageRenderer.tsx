/**
 * Lumino Framework - WidgetPage Renderer
 *
 * Renders standalone WidgetPage (dashboard) container configurations.
 * UI-library independent - uses UI adapter for actual rendering.
 */

import React, { useMemo, useCallback, ReactNode, useEffect, useState } from "react";
import type { WidgetPageConfig, PageWidgetConfig, PageActionConfig } from "../../core/containers/Page";
import type { BreadcrumbItem, PageLayoutConfig } from "../../core/types/ui";
import type { FormContext } from "../../core/types/context";
import { Lumino } from "../../core/Lumino";
import { evaluateVisibility } from "../../core/utils/visibility";
import { FormRenderer, resolveComponent } from "./FormRenderer";
import { TabsRenderer } from "./TabsRenderer";
import { TableRenderer } from "./TableRenderer";

// =============================================================================
// WIDGET PAGE RENDERER PROPS
// =============================================================================

export interface WidgetPageRendererProps {
  /** WidgetPage configuration (from WidgetPage.build() or createWidgetPage()) */
  config: WidgetPageConfig;
  /** Form context */
  context: FormContext;
  /** Loading state (overrides config) */
  loading?: boolean;
  /** Error state */
  error?: ReactNode;
  /** Custom class name */
  className?: string;
  /** Custom widget render */
  renderWidget?: (widget: PageWidgetConfig, context: FormContext) => ReactNode;
}

// =============================================================================
// DEFAULT LAYOUT COMPONENTS (fallbacks)
// =============================================================================

interface DefaultPageLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: ReactNode;
  className?: string;
  children: ReactNode;
}

function DefaultPageLayout({
  title,
  subtitle,
  breadcrumbs,
  headerActions,
  className,
  children,
}: DefaultPageLayoutProps) {
  return (
    <div className={`lum-widget-page ${className || ""}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="lum-widget-page__breadcrumbs" style={{ marginBottom: 16 }}>
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 && <span style={{ margin: "0 8px" }}>/</span>}
              {crumb.href ? (
                <a href={crumb.href} style={{ color: "#1976d2", textDecoration: "none" }}>
                  {crumb.label}
                </a>
              ) : (
                <span style={{ color: "#666" }}>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Header */}
      {(title || headerActions) && (
        <div
          className="lum-widget-page__header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            {title && <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>{title}</h1>}
            {subtitle && <p style={{ margin: "8px 0 0", color: "#666" }}>{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="lum-widget-page__actions" style={{ display: "flex", gap: 8 }}>
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="lum-widget-page__content">{children}</div>
    </div>
  );
}

interface DefaultGridLayoutProps {
  columns?: number;
  gap?: number;
  children: ReactNode;
}

function DefaultGridLayout({ columns = 2, gap = 16, children }: DefaultGridLayoutProps) {
  return (
    <div
      className="lum-widget-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

interface DefaultWidgetWrapperProps {
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  loading?: boolean;
  className?: string;
  columnSpan?: number;
  rowSpan?: number;
  children: ReactNode;
}

function DefaultWidgetWrapper({
  title,
  collapsible,
  collapsed,
  onToggle,
  loading,
  className,
  columnSpan,
  rowSpan,
  children,
}: DefaultWidgetWrapperProps) {
  const style: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    overflow: "hidden",
    gridColumn: columnSpan ? `span ${columnSpan}` : undefined,
    gridRow: rowSpan ? `span ${rowSpan}` : undefined,
  };

  return (
    <div className={`lum-widget ${className || ""}`} style={style}>
      {title && (
        <div
          className="lum-widget__header"
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fafafa",
          }}
          onClick={collapsible ? onToggle : undefined}
        >
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{title}</h3>
          {collapsible && (
            <button
              type="button"
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              {collapsed ? "▶" : "▼"}
            </button>
          )}
        </div>
      )}
      {!collapsed && (
        <div className="lum-widget__content" style={{ padding: 16, position: "relative" }}>
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Loading...
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// WIDGET RENDERER
// =============================================================================

interface WidgetRendererProps {
  widget: PageWidgetConfig;
  context: FormContext;
  renderWidget?: (widget: PageWidgetConfig, context: FormContext) => ReactNode;
}

function WidgetRenderer({ widget, context, renderWidget }: WidgetRendererProps) {
  const [collapsed, setCollapsed] = useState(widget.collapsed || false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check visibility
  const visible = useMemo(() => {
    if (!widget.visibility) return true;
    return evaluateVisibility(widget.visibility, context).isVisible;
  }, [widget.visibility, context]);

  if (!visible) {
    return null;
  }

  // Auto-refresh
  useEffect(() => {
    if (!widget.refreshInterval) return;

    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, widget.refreshInterval);

    return () => clearInterval(interval);
  }, [widget.refreshInterval]);

  // Resolve title
  const title = useMemo(() => {
    if (typeof widget.title === "function") {
      return widget.title(context);
    }
    return widget.title;
  }, [widget.title, context]);

  // Resolve loading
  const loading = useMemo(() => {
    if (typeof widget.loading === "function") {
      return widget.loading(context);
    }
    return widget.loading;
  }, [widget.loading, context]);

  // Resolve props
  const props = useMemo(() => {
    if (typeof widget.props === "function") {
      return widget.props(context);
    }
    return widget.props || {};
  }, [widget.props, context]);

  // Custom render
  if (renderWidget) {
    const customContent = renderWidget(widget, context);
    if (customContent !== undefined) {
      return (
        <DefaultWidgetWrapper
          title={title}
          collapsible={widget.collapsible}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          loading={loading}
          className={widget.cssClass}
          columnSpan={widget.grid?.columnSpan}
          rowSpan={widget.grid?.rowSpan}
        >
          {customContent}
        </DefaultWidgetWrapper>
      );
    }
  }

  // Widget render function
  if (widget.render) {
    return (
      <DefaultWidgetWrapper
        title={title}
        collapsible={widget.collapsible}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        loading={loading}
        className={widget.cssClass}
        columnSpan={widget.grid?.columnSpan}
        rowSpan={widget.grid?.rowSpan}
      >
        {widget.render(context)}
      </DefaultWidgetWrapper>
    );
  }

  // Form widget
  if (widget.form) {
    const FormClass = widget.form;
    const formInstance = new FormClass(widget.id);
    return (
      <DefaultWidgetWrapper
        title={title}
        collapsible={widget.collapsible}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        loading={loading}
        className={widget.cssClass}
        columnSpan={widget.grid?.columnSpan}
        rowSpan={widget.grid?.rowSpan}
      >
        <FormRenderer key={refreshKey} form={formInstance} {...props} />
      </DefaultWidgetWrapper>
    );
  }

  // Table widget
  if (widget.table) {
    const TableClass = widget.table;
    const tableInstance = new TableClass(widget.id);
    return (
      <DefaultWidgetWrapper
        title={title}
        collapsible={widget.collapsible}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        loading={loading}
        className={widget.cssClass}
        columnSpan={widget.grid?.columnSpan}
        rowSpan={widget.grid?.rowSpan}
      >
        <TableRenderer key={refreshKey} config={tableInstance.build()} context={context} {...props} />
      </DefaultWidgetWrapper>
    );
  }

  // Tabs widget
  if (widget.tabs) {
    const TabsClass = widget.tabs;
    const tabsInstance = new TabsClass(widget.id);
    return (
      <DefaultWidgetWrapper
        title={title}
        collapsible={widget.collapsible}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        loading={loading}
        className={widget.cssClass}
        columnSpan={widget.grid?.columnSpan}
        rowSpan={widget.grid?.rowSpan}
      >
        <TabsRenderer key={refreshKey} config={tabsInstance.build()} context={context} {...props} />
      </DefaultWidgetWrapper>
    );
  }

  // Custom component
  if (widget.component) {
    const Component = resolveComponent(widget.component);
    if (Component) {
      return (
        <DefaultWidgetWrapper
          title={title}
          collapsible={widget.collapsible}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          loading={loading}
          className={widget.cssClass}
          columnSpan={widget.grid?.columnSpan}
          rowSpan={widget.grid?.rowSpan}
        >
          <Component key={refreshKey} {...props} context={context} />
        </DefaultWidgetWrapper>
      );
    }
  }

  // Empty widget
  return (
    <DefaultWidgetWrapper
      title={title}
      collapsible={widget.collapsible}
      collapsed={collapsed}
      onToggle={() => setCollapsed((c) => !c)}
      className={widget.cssClass}
      columnSpan={widget.grid?.columnSpan}
      rowSpan={widget.grid?.rowSpan}
    >
      <div style={{ color: "#999", textAlign: "center", padding: 24 }}>
        Widget "{widget.id}" has no content
      </div>
    </DefaultWidgetWrapper>
  );
}

// =============================================================================
// WIDGET PAGE RENDERER COMPONENT
// =============================================================================

/**
 * Renders a standalone WidgetPage (dashboard) container.
 *
 * @example
 * ```typescript
 * // With WidgetPage class
 * const dashboard = new DashboardPage("dashboard");
 *
 * <WidgetPageRenderer
 *   config={dashboard.build()}
 *   context={formContext}
 * />
 *
 * // With createWidgetPage
 * const page = createWidgetPage("dashboard", (p) => {
 *   p.title("Dashboard")
 *     .layout({ type: "grid", columns: 2 });
 *
 *   p.widget("stats").component(StatsCard).span(2).end();
 *   p.widget("orders").table(RecentOrdersTable).end();
 * });
 *
 * <WidgetPageRenderer config={page} context={context} />
 * ```
 */
export function WidgetPageRenderer({
  config,
  context,
  loading: propLoading,
  error: propError,
  className,
  renderWidget,
}: WidgetPageRendererProps) {
  const [initialized, setInitialized] = useState(false);

  // Call onInit
  useEffect(() => {
    const init = async () => {
      if (config.onInit) {
        await config.onInit(context);
      }
      setInitialized(true);
    };
    init();

    return () => {
      config.onDestroy?.(context);
    };
  }, [config, context]);

  // Resolve title and subtitle
  const title = useMemo(() => {
    if (typeof config.title === "function") {
      return config.title(context);
    }
    return config.title;
  }, [config.title, context]);

  const subtitle = useMemo(() => {
    if (typeof config.subtitle === "function") {
      return config.subtitle(context);
    }
    return config.subtitle;
  }, [config.subtitle, context]);

  // Resolve loading
  const loading = useMemo(() => {
    if (propLoading !== undefined) return propLoading;
    if (typeof config.loading === "function") {
      return config.loading(context);
    }
    return config.loading || !initialized;
  }, [propLoading, config.loading, context, initialized]);

  // Resolve breadcrumbs
  const breadcrumbs = useMemo(() => {
    if (typeof config.breadcrumbs === "function") {
      return config.breadcrumbs(context);
    }
    return config.breadcrumbs;
  }, [config.breadcrumbs, context]);

  // Resolve error
  const error = useMemo(() => {
    if (propError !== undefined) return propError;
    if (typeof config.error === "function") {
      return config.error(context);
    }
    return config.error;
  }, [propError, config.error, context]);

  // Render header actions
  const renderHeaderActions = useCallback(() => {
    if (!config.headerActions || config.headerActions.length === 0) return null;

    return (
      <>
        {config.headerActions.map((action) => {
          const label =
            typeof action.label === "function" ? action.label(context) : action.label;
          const disabled =
            typeof action.disabled === "function"
              ? action.disabled(context)
              : action.disabled;
          const actionLoading =
            typeof action.loading === "function"
              ? action.loading(context)
              : action.loading;

          const variantStyles: Record<string, React.CSSProperties> = {
            primary: {
              backgroundColor: "#1976d2",
              borderColor: "#1976d2",
              color: "white",
            },
            secondary: {
              backgroundColor: "white",
              borderColor: "#ccc",
              color: "#333",
            },
            danger: {
              backgroundColor: "#d32f2f",
              borderColor: "#d32f2f",
              color: "white",
            },
            ghost: {
              backgroundColor: "transparent",
              borderColor: "transparent",
              color: "#1976d2",
            },
          };

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => action.onClick(context)}
              disabled={disabled || actionLoading}
              style={{
                padding: "8px 16px",
                border: "1px solid",
                borderRadius: 4,
                cursor: disabled || actionLoading ? "not-allowed" : "pointer",
                opacity: disabled || actionLoading ? 0.6 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                ...variantStyles[action.variant || "secondary"],
              }}
            >
              {actionLoading && "..."}
              {action.icon}
              {label}
            </button>
          );
        })}
      </>
    );
  }, [config.headerActions, context]);

  // Sort widgets by order
  const sortedWidgets = useMemo(() => {
    return [...config.widgets].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [config.widgets]);

  // Determine layout
  const layoutConfig = config.layout || { type: "grid", columns: 1 };

  // Loading state
  if (loading) {
    return (
      <DefaultPageLayout
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        headerActions={renderHeaderActions()}
        className={`${config.cssClass || ""} ${className || ""} lum-widget-page--loading`.trim()}
      >
        <div style={{ textAlign: "center", padding: 48 }}>Loading...</div>
      </DefaultPageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DefaultPageLayout
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        headerActions={renderHeaderActions()}
        className={`${config.cssClass || ""} ${className || ""} lum-widget-page--error`.trim()}
      >
        <div style={{ textAlign: "center", padding: 48, color: "#d32f2f" }}>
          {error}
        </div>
      </DefaultPageLayout>
    );
  }

  // Get page adapter components
  const adapter = Lumino.ui.get();
  const PageLayout = adapter?.page?.PageLayout || DefaultPageLayout;
  const GridLayout = adapter?.layout?.Grid || DefaultGridLayout;

  // Render content based on layout type
  const renderContent = () => {
    if (layoutConfig.type === "grid") {
      return (
        <GridLayout columns={layoutConfig.columns || 2} gap={layoutConfig.gap || 16}>
          {sortedWidgets.map((widget) => (
            <WidgetRenderer
              key={widget.id}
              widget={widget}
              context={context}
              renderWidget={renderWidget}
            />
          ))}
        </GridLayout>
      );
    }

    if (layoutConfig.type === "stack") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: layoutConfig.direction || "column",
            gap: layoutConfig.gap || 16,
          }}
        >
          {sortedWidgets.map((widget) => (
            <WidgetRenderer
              key={widget.id}
              widget={widget}
              context={context}
              renderWidget={renderWidget}
            />
          ))}
        </div>
      );
    }

    if (layoutConfig.type === "split") {
      const [leftRatio = 50, rightRatio = 50] = layoutConfig.splitRatio || [50, 50];
      const [leftWidget, rightWidget] = sortedWidgets;

      return (
        <div style={{ display: "flex", gap: layoutConfig.gap || 16 }}>
          <div style={{ flex: leftRatio }}>
            {leftWidget && (
              <WidgetRenderer
                widget={leftWidget}
                context={context}
                renderWidget={renderWidget}
              />
            )}
          </div>
          <div style={{ flex: rightRatio }}>
            {rightWidget && (
              <WidgetRenderer
                widget={rightWidget}
                context={context}
                renderWidget={renderWidget}
              />
            )}
          </div>
        </div>
      );
    }

    // Default: just render widgets
    return (
      <>
        {sortedWidgets.map((widget) => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            context={context}
            renderWidget={renderWidget}
          />
        ))}
      </>
    );
  };

  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      headerActions={renderHeaderActions()}
      className={`${config.cssClass || ""} ${className || ""}`.trim() || undefined}
    >
      {renderContent()}
    </PageLayout>
  );
}

// Component is already exported inline with export function
