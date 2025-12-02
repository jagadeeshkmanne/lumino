/**
 * Lumino Framework - AppLayoutRenderer
 *
 * Renders AppLayout configuration using Salt Design System components.
 * Uses Salt NavigationItem, Button, FlexLayout, StackLayout for proper styling.
 */

import { type ReactNode, useMemo, useState } from "react";
import type { AppLayout, NavItem } from "../../../core/app/AppLayout";
import { useRouter } from "../../../react/router/LuminoRouter";
import {
  NavigationItem,
  StackLayout,
  FlexLayout,
  FlexItem,
  Button,
  Text,
  Divider,
} from "@salt-ds/core";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@salt-ds/icons";

// =============================================================================
// TYPES
// =============================================================================

export interface AppLayoutRendererProps {
  /** The AppLayout instance */
  layout: AppLayout;
  /** Page content to render in main area */
  children: ReactNode;
  /** Current route path for active nav highlighting */
  currentRoute: string;
}

// =============================================================================
// MAIN APP LAYOUT RENDERER
// =============================================================================

/**
 * Renders an AppLayout configuration using Salt Design System components.
 *
 * The layout structure is:
 * - Header with FlexLayout for title and actions
 * - Sidebar with NavigationItems for menu
 * - Main content area for page children
 * - Footer with text
 */
export function AppLayoutRenderer({
  layout,
  children,
  currentRoute,
}: AppLayoutRendererProps) {
  const router = useRouter();
  const config = useMemo(() => layout.getConfig(), [layout]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    config.sidebar?.defaultCollapsed || false
  );

  // Navigation handler
  const handleNavigate = (path: string) => {
    router.navigate(path);
  };

  // Find current page title from nav items
  const currentPageTitle = useMemo(() => {
    const findItem = (items: NavItem[]): string | undefined => {
      for (const item of items) {
        if (item.path === currentRoute) return item.label;
        if (item.path && item.path !== "/" && currentRoute.startsWith(item.path)) {
          return item.label;
        }
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return config.sidebar?.items ? findItem(config.sidebar.items) : undefined;
  }, [config.sidebar?.items, currentRoute]);

  // Render sidebar content
  const renderSidebar = () => {
    if (!config.sidebar) return null;

    const sidebarWidth = sidebarCollapsed ? 60 : config.sidebar.width || 260;

    return (
      <aside
        className="lum-app-sidebar"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          backgroundColor: "var(--salt-container-primary-background)",
          borderRight: "1px solid var(--salt-separable-primary-borderColor)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
      >
        {/* Navigation Items */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {!sidebarCollapsed && (
            <StackLayout gap={0}>
              {config.sidebar.items.map((item, index) => (
                <SaltNavItem
                  key={item.path || index}
                  item={item}
                  currentRoute={currentRoute}
                  onNavigate={handleNavigate}
                />
              ))}
            </StackLayout>
          )}
        </nav>

        {/* Collapse Toggle */}
        {config.sidebar.collapsible && (
          <div
            style={{
              borderTop: "1px solid var(--salt-separable-primary-borderColor)",
              padding: "8px",
            }}
          >
            <Button
              appearance="transparent"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ width: "100%" }}
            >
              {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </Button>
          </div>
        )}
      </aside>
    );
  };

  // Render header bar
  const renderHeader = () => {
    if (!config.header) return null;

    return (
      <header
        className="lum-app-header"
        style={{
          backgroundColor: "var(--salt-container-primary-background)",
          borderBottom: "1px solid var(--salt-separable-primary-borderColor)",
          height: config.header.height || 56,
        }}
      >
        <FlexLayout
          align="center"
          gap={3}
          style={{ height: "100%", padding: "0 24px" }}
        >
          {/* App Title/Logo */}
          <FlexItem>
            <FlexLayout align="baseline" gap={1}>
              <Text styleAs="h3" style={{ margin: 0, fontWeight: 600 }}>
                {config.header.title}
              </Text>
              {config.header.subtitle && (
                <Text
                  color="secondary"
                  styleAs="label"
                >
                  {config.header.subtitle}
                </Text>
              )}
            </FlexLayout>
          </FlexItem>

          {/* Spacer */}
          <FlexItem grow={1} />

          {/* Current page title (optional) */}
          {currentPageTitle && (
            <FlexItem>
              <Text color="secondary">{currentPageTitle}</Text>
            </FlexItem>
          )}
        </FlexLayout>
      </header>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!config.footer) return null;

    return (
      <footer
        className="lum-app-footer"
        style={{
          backgroundColor: "var(--salt-container-primary-background)",
          borderTop: "1px solid var(--salt-separable-primary-borderColor)",
          padding: "12px 24px",
        }}
      >
        <Text color="secondary" styleAs="label">
          {config.footer.text}
        </Text>
      </footer>
    );
  };

  return (
    <div
      className={`lum-app-layout lum-app-layout--${config.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header - full width at top */}
      {renderHeader()}

      {/* Body - sidebar + main content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        {renderSidebar()}

        {/* Main Area */}
        <div
          className="lum-app-main"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--salt-container-secondary-background)",
            overflow: "auto",
          }}
        >
          {/* Page Content */}
          <main className="lum-app-content" style={{ flex: 1, padding: 24 }}>
            {children}
          </main>

          {/* Footer */}
          {renderFooter()}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SALT NAV ITEM COMPONENT
// =============================================================================

interface SaltNavItemProps {
  item: NavItem;
  currentRoute: string;
  onNavigate: (path: string) => void;
  level?: number;
}

function SaltNavItem({ item, currentRoute, onNavigate, level = 0 }: SaltNavItemProps) {
  const [expanded, setExpanded] = useState(true);

  // Check if active
  const isActive = item.path === currentRoute ||
    (item.path !== "/" && item.path && currentRoute.startsWith(item.path)) || false;
  const hasChildren = item.children && item.children.length > 0;

  // Divider
  if (item.label === "---divider---") {
    return <Divider style={{ margin: "8px 16px" }} />;
  }

  // Group with children (expandable)
  if (hasChildren) {
    return (
      <div>
        <NavigationItem
          onClick={() => setExpanded(!expanded)}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <FlexLayout align="center" style={{ width: "100%" }}>
            <FlexItem grow={1}>
              <Text>{item.label}</Text>
            </FlexItem>
            {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </FlexLayout>
        </NavigationItem>
        {expanded && (
          <StackLayout gap={0}>
            {item.children!.map((child, index) => (
              <SaltNavItem
                key={child.path || index}
                item={child}
                currentRoute={currentRoute}
                onNavigate={onNavigate}
                level={level + 1}
              />
            ))}
          </StackLayout>
        )}
      </div>
    );
  }

  // Regular nav item
  return (
    <NavigationItem
      active={isActive}
      onClick={() => !item.disabled && item.path && onNavigate(item.path)}
      blurActive={item.disabled || undefined}
      style={{ paddingLeft: `${16 + level * 16}px` }}
    >
      <FlexLayout align="center" gap={2} style={{ width: "100%" }}>
        <FlexItem grow={1}>
          <Text>{item.label}</Text>
        </FlexItem>
        {item.badge && (
          <Text
            styleAs="label"
            style={{
              backgroundColor: "var(--salt-status-info-background)",
              color: "var(--salt-status-info-foreground)",
              padding: "2px 8px",
              borderRadius: "10px",
            }}
          >
            {typeof item.badge === 'function' ? String(item.badge) : item.badge}
          </Text>
        )}
      </FlexLayout>
    </NavigationItem>
  );
}

// =============================================================================
// NAV RENDERER FOR FLEXIBLE LAYOUT
// =============================================================================

interface NavRendererProps {
  items: NavItem[];
  currentRoute: string;
  navigate?: (path: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Salt DS Navigation Renderer for FlexibleLayout
 * Renders navigation items using Salt NavigationItem components
 */
export function LuminoNavRenderer({
  items,
  currentRoute,
  navigate,
  orientation = "vertical",
  className,
}: NavRendererProps) {
  const handleNavigate = (path: string) => {
    if (navigate) {
      navigate(path);
    }
  };

  const isHorizontal = orientation === "horizontal";

  return (
    <nav
      className={className}
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        gap: isHorizontal ? "8px" : "0",
        alignItems: isHorizontal ? "center" : "stretch",
      }}
    >
      {isHorizontal ? (
        // Horizontal navigation (header style)
        items.map((item, i) => {
          if (item.label === "---divider---") {
            return (
              <Divider
                key={i}
                orientation="vertical"
                style={{ height: "24px", margin: "0 8px" }}
              />
            );
          }
          const isActive =
            item.path === currentRoute ||
            (item.path !== "/" && item.path && currentRoute.startsWith(item.path)) ||
            false;
          return (
            <Button
              key={item.path || i}
              variant="secondary"
              appearance={isActive ? "solid" : "transparent"}
              onClick={() => !item.disabled && item.path && handleNavigate(item.path)}
              disabled={item.disabled}
            >
              {item.label}
            </Button>
          );
        })
      ) : (
        // Vertical navigation (sidebar style)
        <StackLayout gap={0}>
          {items.map((item, i) => (
            <SaltNavItem
              key={item.path || i}
              item={item}
              currentRoute={currentRoute}
              onNavigate={handleNavigate}
            />
          ))}
        </StackLayout>
      )}
    </nav>
  );
}

export default AppLayoutRenderer;
