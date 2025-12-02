/**
 * Lumino Framework - Flexible Layout Renderer
 *
 * Renders FlexibleLayout configurations as React components.
 * Supports grid-based layouts with rows, columns, and various content types.
 */

import React, { useEffect, useState, useMemo, useCallback, ReactNode, createElement } from "react";
import type {
  FlexibleLayout,
  FlexibleLayoutConfig,
  FlexibleLayoutContext,
  LayoutRow,
  LayoutColumn,
  LayoutAreaItem,
  LayoutNavItem,
} from "../../core/app/FlexibleLayout";
import { Lumino } from "../../core/Lumino";

// =============================================================================
// TYPES
// =============================================================================

export interface FlexibleLayoutRendererProps {
  /** The flexible layout instance */
  layout: FlexibleLayout;
  /** Current route path */
  currentRoute: string;
  /** Route params */
  params?: Record<string, string>;
  /** Query params */
  query?: Record<string, string>;
  /** Page content to render in the content area */
  children: ReactNode;
  /** Navigate function */
  navigate?: (path: string) => void;
}

// =============================================================================
// HELPER: Build style object from config
// =============================================================================

function buildRowStyle(row: LayoutRow): React.CSSProperties {
  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
  };

  if (row.height !== undefined) {
    style.height = row.height;
    style.minHeight = row.height;
  }
  if (row.flex !== undefined) {
    style.flex = row.flex;
  }
  if (row.minHeight !== undefined && row.height === undefined) {
    style.minHeight = row.minHeight;
  }
  if (row.maxHeight !== undefined) {
    style.maxHeight = row.maxHeight;
  }
  if (row.gap !== undefined) {
    style.gap = row.gap;
  }
  if (row.background) {
    style.background = row.background;
  }
  if (row.padding !== undefined) {
    if (typeof row.padding === "number") {
      style.padding = row.padding;
    } else {
      style.paddingTop = row.padding.top;
      style.paddingRight = row.padding.right;
      style.paddingBottom = row.padding.bottom;
      style.paddingLeft = row.padding.left;
    }
  }

  return style;
}

/**
 * Resolve dynamic CSS class - handles both static string and function
 */
function resolveCssClass(
  cssClass: string | ((ctx: FlexibleLayoutContext) => string) | undefined,
  context: FlexibleLayoutContext
): string {
  if (!cssClass) return "";
  return typeof cssClass === "function" ? cssClass(context) : cssClass;
}

/**
 * Resolve dynamic style - handles both static object and function
 */
function resolveStyle(
  style: React.CSSProperties | ((ctx: FlexibleLayoutContext) => React.CSSProperties) | undefined,
  context: FlexibleLayoutContext
): React.CSSProperties {
  if (!style) return {};
  return typeof style === "function" ? style(context) : style;
}

function buildColumnStyle(column: LayoutColumn): React.CSSProperties {
  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  if (column.width !== undefined) {
    style.width = column.width;
    style.minWidth = column.width;
    style.flexShrink = 0;
  }
  if (column.flex !== undefined) {
    style.flex = column.flex;
  }
  if (column.minWidth !== undefined && column.width === undefined) {
    style.minWidth = column.minWidth;
  }
  if (column.maxWidth !== undefined) {
    style.maxWidth = column.maxWidth;
  }
  if (column.gap !== undefined) {
    style.gap = column.gap;
  }
  if (column.align) {
    style.alignItems = column.align === "start" ? "flex-start"
      : column.align === "end" ? "flex-end"
      : column.align;
  }
  if (column.justify) {
    style.justifyContent = column.justify === "start" ? "flex-start"
      : column.justify === "end" ? "flex-end"
      : column.justify;
  }
  if (column.background) {
    style.background = column.background;
  }
  if (column.padding !== undefined) {
    if (typeof column.padding === "number") {
      style.padding = column.padding;
    } else {
      style.paddingTop = column.padding.top;
      style.paddingRight = column.padding.right;
      style.paddingBottom = column.padding.bottom;
      style.paddingLeft = column.padding.left;
    }
  }

  return style;
}

// =============================================================================
// NAV ITEM RENDERER (Default HTML)
// =============================================================================

interface NavItemRendererProps {
  item: LayoutNavItem;
  currentRoute: string;
  navigate?: (path: string) => void;
  context: FlexibleLayoutContext;
  orientation?: "horizontal" | "vertical";
}

function DefaultNavItemRenderer({ item, currentRoute, navigate, context, orientation }: NavItemRendererProps) {
  // Check visibility
  if (item.visible !== undefined) {
    const isVisible = typeof item.visible === "function" ? item.visible(context) : item.visible;
    if (!isVisible) return null;
  }

  // Divider
  if (item.label === "---divider---") {
    return (
      <div
        className="lum-nav-divider"
        style={{
          height: orientation === "horizontal" ? "100%" : 1,
          width: orientation === "horizontal" ? 1 : "100%",
          background: "#ccc",
          margin: orientation === "horizontal" ? "0 8px" : "8px 0",
        }}
      />
    );
  }

  // Group with children
  if (item.children && item.children.length > 0) {
    return (
      <div className="lum-nav-group">
        <div className="lum-nav-group-label" style={{ fontWeight: "bold", padding: "8px 16px" }}>
          {item.label}
        </div>
        <div className="lum-nav-group-items">
          {item.children.map((child, i) => (
            <DefaultNavItemRenderer
              key={i}
              item={child}
              currentRoute={currentRoute}
              navigate={navigate}
              context={context}
              orientation={orientation}
            />
          ))}
        </div>
      </div>
    );
  }

  // Get badge value
  const badge = typeof item.badge === "function" ? item.badge(context) : item.badge;
  const isActive = currentRoute === item.path;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!item.disabled && item.path && navigate) {
      navigate(item.path);
    }
  };

  return (
    <a
      href={item.path || "#"}
      className={`lum-nav-item ${isActive ? "lum-nav-item--active" : ""} ${item.disabled ? "lum-nav-item--disabled" : ""}`}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        textDecoration: "none",
        color: isActive ? "#0066cc" : item.disabled ? "#999" : "inherit",
        cursor: item.disabled ? "not-allowed" : "pointer",
        background: isActive ? "rgba(0, 102, 204, 0.1)" : "transparent",
      }}
    >
      {item.icon && <span className={`lum-nav-icon icon-${item.icon}`}>{item.icon}</span>}
      <span className="lum-nav-label">{item.label}</span>
      {badge !== undefined && (
        <span
          className="lum-nav-badge"
          style={{
            background: "#e74c3c",
            color: "white",
            borderRadius: 10,
            padding: "2px 8px",
            fontSize: 12,
            marginLeft: "auto",
          }}
        >
          {badge}
        </span>
      )}
    </a>
  );
}

// =============================================================================
// AREA ITEM RENDERER
// =============================================================================

interface AreaItemRendererProps {
  item: LayoutAreaItem;
  context: FlexibleLayoutContext;
  navigate?: (path: string) => void;
  children?: ReactNode;
  layout: FlexibleLayout;
}

function AreaItemRenderer({ item, context, navigate, children, layout }: AreaItemRendererProps) {
  const adapter = Lumino.ui.get();

  // Resolve dynamic CSS class and style for all item types
  const cssClass = resolveCssClass(item.cssClass, context);
  const itemStyle = resolveStyle(item.style, context);

  switch (item.type) {
    case "content":
      return (
        <div
          className={`lum-layout-content ${cssClass}`}
          style={{ flex: 1, overflow: "auto", ...itemStyle }}
        >
          {children}
        </div>
      );

    case "text":
      const text = typeof item.text === "function" ? item.text(context) : item.text;
      return (
        <span className={`lum-layout-text ${cssClass}`} style={itemStyle}>
          {text}
        </span>
      );

    case "nav":
      // Check if adapter has a NavRenderer
      if (adapter?.NavRenderer) {
        return createElement(adapter.NavRenderer, {
          items: item.items,
          currentRoute: context.currentRoute,
          navigate,
          orientation: item.orientation || "vertical",
          className: cssClass,
          style: itemStyle,
        });
      }
      // Default nav renderer
      return (
        <nav
          className={`lum-layout-nav ${cssClass}`}
          style={{
            display: "flex",
            flexDirection: item.orientation === "horizontal" ? "row" : "column",
            ...itemStyle,
          }}
        >
          {item.items.map((navItem, i) => (
            <DefaultNavItemRenderer
              key={i}
              item={navItem}
              currentRoute={context.currentRoute}
              navigate={navigate}
              context={context}
              orientation={item.orientation}
            />
          ))}
        </nav>
      );

    case "component":
      // Check visibility
      if (item.visible !== undefined) {
        const isVisible = typeof item.visible === "function" ? item.visible(context) : item.visible;
        if (!isVisible) return null;
      }
      // Get props
      const props = typeof item.props === "function" ? item.props(context) : (item.props || {});
      // Render component
      if (adapter?.renderComponent) {
        return adapter.renderComponent(item.component, { ...props, className: cssClass, style: itemStyle });
      }
      // Default: try to render as React component
      const Component = item.component as React.ComponentType<any>;
      return <Component {...props} className={cssClass} style={itemStyle} />;

    case "slot":
      const slotContent = layout.getSlotContent(item.name);
      return (
        <div
          className={`lum-layout-slot lum-layout-slot--${item.name} ${cssClass}`}
          style={itemStyle}
        >
          {slotContent}
        </div>
      );

    default:
      return null;
  }
}

// =============================================================================
// COLUMN RENDERER
// =============================================================================

interface ColumnRendererProps {
  column: LayoutColumn;
  context: FlexibleLayoutContext;
  navigate?: (path: string) => void;
  children?: ReactNode;
  layout: FlexibleLayout;
}

function ColumnRenderer({ column, context, navigate, children, layout }: ColumnRendererProps) {
  // Check visibility
  if (column.visible !== undefined) {
    const isVisible = typeof column.visible === "function" ? column.visible(context) : column.visible;
    if (!isVisible) return null;
  }

  const baseStyle = buildColumnStyle(column);
  const dynamicStyle = resolveStyle(column.style, context);
  const cssClass = resolveCssClass(column.cssClass, context);
  const hasContent = column.items.some(item => item.type === "content");

  return (
    <div className={`lum-layout-column ${cssClass}`} style={{ ...baseStyle, ...dynamicStyle }}>
      {column.items.map((item, i) => (
        <AreaItemRenderer
          key={i}
          item={item}
          context={context}
          navigate={navigate}
          children={item.type === "content" ? children : undefined}
          layout={layout}
        />
      ))}
    </div>
  );
}

// =============================================================================
// ROW RENDERER
// =============================================================================

interface RowRendererProps {
  row: LayoutRow;
  context: FlexibleLayoutContext;
  navigate?: (path: string) => void;
  children?: ReactNode;
  layout: FlexibleLayout;
}

function RowRenderer({ row, context, navigate, children, layout }: RowRendererProps) {
  // Check visibility
  if (row.visible !== undefined) {
    const isVisible = typeof row.visible === "function" ? row.visible(context) : row.visible;
    if (!isVisible) return null;
  }

  const baseStyle = buildRowStyle(row);
  const dynamicStyle = resolveStyle(row.style, context);
  const cssClass = resolveCssClass(row.cssClass, context);

  return (
    <div className={`lum-layout-row ${cssClass}`} style={{ ...baseStyle, ...dynamicStyle }}>
      {row.columns.map((column, i) => (
        <ColumnRenderer
          key={i}
          column={column}
          context={context}
          navigate={navigate}
          children={children}
          layout={layout}
        />
      ))}
    </div>
  );
}

// =============================================================================
// FLEXIBLE LAYOUT RENDERER
// =============================================================================

export function FlexibleLayoutRenderer({
  layout,
  currentRoute,
  params = {},
  query = {},
  children,
  navigate,
}: FlexibleLayoutRendererProps) {
  const [state, setState] = useState(layout.getState());

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = layout.subscribeToState(setState);
    // Call onMount lifecycle
    layout.onMount?.();
    return () => {
      unsubscribe();
    };
  }, [layout]);

  // Build context
  const context = useMemo<FlexibleLayoutContext>(() => ({
    currentRoute,
    params,
    query,
    state,
    setState: (key, value) => layout.setState(key, value),
  }), [currentRoute, params, query, state, layout]);

  // Get config
  const config = layout.getConfig();

  // Resolve dynamic CSS class and style for grid
  const gridCssClass = resolveCssClass(config.grid.cssClass, context);
  const gridDynamicStyle = resolveStyle(config.grid.style, context);

  // Grid style
  const gridStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    gap: config.grid.gap,
    ...gridDynamicStyle,
  };

  return (
    <div className={`lum-flexible-layout ${gridCssClass}`} style={gridStyle}>
      {config.grid.rows.map((row, i) => (
        <RowRenderer
          key={i}
          row={row}
          context={context}
          navigate={navigate}
          children={children}
          layout={layout}
        />
      ))}
    </div>
  );
}
