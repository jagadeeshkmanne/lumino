/**
 * Lumino Framework - Base Container Adapter
 *
 * Abstract base implementations for container components.
 * UI-specific adapters extend these with their own styling.
 */

import React, { ReactNode, useEffect } from "react";
import type {
  ContainerAdapter,
  TabsProps,
  TabPanelProps,
  DialogProps,
  PanelProps,
  CardProps,
} from "../../../core/types/ui";

// =============================================================================
// STYLE PROVIDERS - Override in specific adapters
// =============================================================================

/**
 * Style provider interface for container components.
 * Adapters implement this to provide their own styles.
 */
export interface ContainerStyleProvider {
  // Tabs styles
  getTabsContainerStyle(props: TabsProps): React.CSSProperties;
  getTabListStyle(props: TabsProps): React.CSSProperties;
  getTabStyle(props: TabsProps, index: number, isActive: boolean): React.CSSProperties;
  getTabContentStyle(props: TabsProps): React.CSSProperties;
  getTabAddButtonStyle(props: TabsProps): React.CSSProperties;

  // Dialog styles
  getDialogBackdropStyle(props: DialogProps): React.CSSProperties;
  getDialogStyle(props: DialogProps): React.CSSProperties;
  getDialogHeaderStyle(props: DialogProps): React.CSSProperties;
  getDialogContentStyle(props: DialogProps): React.CSSProperties;
  getDialogFooterStyle(props: DialogProps): React.CSSProperties;
  getDialogCloseButtonStyle(props: DialogProps): React.CSSProperties;

  // Panel styles
  getPanelStyle(props: PanelProps): React.CSSProperties;
  getPanelHeaderStyle(props: PanelProps): React.CSSProperties;
  getPanelContentStyle(props: PanelProps): React.CSSProperties;
  getPanelFooterStyle(props: PanelProps): React.CSSProperties;

  // Card styles
  getCardStyle(props: CardProps): React.CSSProperties;
  getCardImageStyle(props: CardProps): React.CSSProperties;
  getCardContentStyle(props: CardProps): React.CSSProperties;
  getCardActionsStyle(props: CardProps): React.CSSProperties;
}

// =============================================================================
// DEFAULT STYLE PROVIDER
// =============================================================================

/**
 * Default style provider with basic CSS styles.
 * Override specific methods in UI-specific adapters.
 */
export const defaultContainerStyles: ContainerStyleProvider = {
  // Tabs styles
  getTabsContainerStyle: ({ position = "top" }) => {
    const isVertical = position === "left" || position === "right";
    return {
      display: "flex",
      flexDirection: isVertical
        ? position === "right" ? "row-reverse" : "row"
        : position === "bottom" ? "column-reverse" : "column",
    };
  },

  getTabListStyle: ({ position = "top" }) => {
    const isVertical = position === "left" || position === "right";
    return {
      display: "flex",
      flexDirection: isVertical ? "column" : "row",
      gap: "4px",
      borderBottom: !isVertical && position === "top" ? "1px solid #e0e0e0" : undefined,
      borderTop: !isVertical && position === "bottom" ? "1px solid #e0e0e0" : undefined,
      borderRight: position === "left" ? "1px solid #e0e0e0" : undefined,
      borderLeft: position === "right" ? "1px solid #e0e0e0" : undefined,
      padding: "4px",
    };
  },

  getTabStyle: (props, index, isActive) => ({
    padding: "8px 16px",
    border: "none",
    background: isActive ? "#f5f5f5" : "transparent",
    borderRadius: "4px",
    cursor: props.items[index]?.disabled ? "not-allowed" : "pointer",
    opacity: props.items[index]?.disabled ? 0.5 : 1,
    fontWeight: isActive ? 600 : 400,
    color: isActive ? "#1976d2" : "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
  }),

  getTabContentStyle: () => ({
    flex: 1,
    padding: "16px",
  }),

  getTabAddButtonStyle: () => ({
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#1976d2",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),

  // Dialog styles
  getDialogBackdropStyle: () => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  }),

  getDialogStyle: ({ size = "medium" }) => {
    const sizeMap: Record<string, React.CSSProperties> = {
      small: { maxWidth: 400 },
      medium: { maxWidth: 600 },
      large: { maxWidth: 900 },
      fullscreen: { width: "100vw", height: "100vh", maxWidth: "100vw", margin: 0, borderRadius: 0 },
    };
    return {
      backgroundColor: "white",
      borderRadius: 8,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      width: "100%",
      maxHeight: size === "fullscreen" ? "100vh" : "90vh",
      display: "flex",
      flexDirection: "column",
      ...sizeMap[size],
    };
  },

  getDialogHeaderStyle: () => ({
    padding: "16px 24px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  }),

  getDialogContentStyle: () => ({
    padding: "24px",
    flex: 1,
    overflow: "auto",
  }),

  getDialogFooterStyle: () => ({
    padding: "16px 24px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  }),

  getDialogCloseButtonStyle: () => ({
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 20,
    padding: 4,
    color: "#666",
  }),

  // Panel styles
  getPanelStyle: ({ variant = "outlined" }) => {
    const variantStyles: Record<string, React.CSSProperties> = {
      outlined: { border: "1px solid #e0e0e0" },
      elevated: { boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" },
      flat: {},
    };
    return {
      backgroundColor: "white",
      borderRadius: 8,
      overflow: "hidden",
      ...variantStyles[variant],
    };
  },

  getPanelHeaderStyle: ({ collapsible, collapsed }) => ({
    padding: "16px",
    borderBottom: collapsed ? "none" : "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: collapsible ? "pointer" : "default",
  }),

  getPanelContentStyle: ({ collapsed }) => ({
    padding: collapsed ? 0 : "16px",
    display: collapsed ? "none" : "block",
  }),

  getPanelFooterStyle: ({ collapsed }) => ({
    padding: "16px",
    borderTop: "1px solid #e0e0e0",
    display: collapsed ? "none" : "block",
  }),

  // Card styles
  getCardStyle: ({ clickable }) => ({
    backgroundColor: "white",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    overflow: "hidden",
    cursor: clickable ? "pointer" : "default",
    transition: clickable ? "box-shadow 0.2s, transform 0.2s" : undefined,
  }),

  getCardImageStyle: () => ({
    width: "100%",
    height: 160,
    objectFit: "cover",
  }),

  getCardContentStyle: () => ({
    padding: "16px",
  }),

  getCardActionsStyle: () => ({
    padding: "8px 16px",
    borderTop: "1px solid #e0e0e0",
  }),
};

// =============================================================================
// BASE TABS COMPONENT
// =============================================================================

export interface BaseTabsProps extends TabsProps {
  styles?: ContainerStyleProvider;
  /** Custom close icon */
  closeIcon?: ReactNode;
}

/**
 * Base Tabs component - tabbed interface.
 * Handles tab logic, delegates styling to provider.
 */
export function BaseTabs({
  items,
  activeIndex,
  onChange,
  position = "top",
  addable,
  onAdd,
  addLabel = "Add",
  closable,
  onClose,
  className,
  children,
  styles = defaultContainerStyles,
  closeIcon = "×",
}: BaseTabsProps) {
  const containerStyle = styles.getTabsContainerStyle({
    items, activeIndex, onChange, position, addable, onAdd, addLabel, closable, onClose, className, children,
  });
  const tabListStyle = styles.getTabListStyle({
    items, activeIndex, onChange, position, addable, onAdd, addLabel, closable, onClose, className, children,
  });
  const contentStyle = styles.getTabContentStyle({
    items, activeIndex, onChange, position, addable, onAdd, addLabel, closable, onClose, className, children,
  });
  const addButtonStyle = styles.getTabAddButtonStyle({
    items, activeIndex, onChange, position, addable, onAdd, addLabel, closable, onClose, className, children,
  });

  return (
    <div className={`lum-tabs ${className || ""}`.trim()} style={containerStyle}>
      <div className="lum-tabs__list" style={tabListStyle} role="tablist">
        {items.map((item, index) => {
          const tabStyle = styles.getTabStyle(
            { items, activeIndex, onChange, position, addable, onAdd, addLabel, closable, onClose, className, children },
            index,
            index === activeIndex
          );
          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={index === activeIndex}
              disabled={item.disabled}
              onClick={() => !item.disabled && onChange(index)}
              style={tabStyle}
              className={`lum-tabs__tab ${index === activeIndex ? "lum-tabs__tab--active" : ""}`.trim()}
            >
              {item.icon}
              {item.label}
              {(closable || item.closable) && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose?.(index);
                  }}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                >
                  {closeIcon}
                </span>
              )}
            </button>
          );
        })}
        {addable && (
          <button onClick={onAdd} style={addButtonStyle} className="lum-tabs__add-btn">
            + {addLabel}
          </button>
        )}
      </div>
      <div className="lum-tabs__content" style={contentStyle} role="tabpanel">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// BASE TAB PANEL COMPONENT
// =============================================================================

export interface BaseTabPanelProps extends TabPanelProps {
  styles?: ContainerStyleProvider;
}

/**
 * Base TabPanel component - single tab content container.
 */
export function BaseTabPanel({
  index,
  activeIndex,
  children,
  className,
}: BaseTabPanelProps) {
  if (index !== activeIndex) return null;
  return (
    <div className={`lum-tab-panel ${className || ""}`.trim()} role="tabpanel">
      {children}
    </div>
  );
}

// =============================================================================
// BASE DIALOG COMPONENT
// =============================================================================

export interface BaseDialogProps extends DialogProps {
  styles?: ContainerStyleProvider;
  /** Subtitle below title */
  subtitle?: ReactNode;
  /** Action buttons for footer */
  actions?: ReactNode;
}

/**
 * Base Dialog component - modal dialog.
 * Handles escape key, backdrop click, delegates styling to provider.
 */
export function BaseDialog({
  open,
  onClose,
  title,
  subtitle,
  size = "medium",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer,
  actions,
  className,
  children,
  styles = defaultContainerStyles,
}: BaseDialogProps) {
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const props: DialogProps = {
    open, onClose, title, size, showCloseButton, closeOnBackdrop, closeOnEscape, footer, className, children,
  };

  const backdropStyle = styles.getDialogBackdropStyle(props);
  const dialogStyle = styles.getDialogStyle(props);
  const headerStyle = styles.getDialogHeaderStyle(props);
  const contentStyle = styles.getDialogContentStyle(props);
  const footerStyle = styles.getDialogFooterStyle(props);
  const closeButtonStyle = styles.getDialogCloseButtonStyle(props);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`lum-dialog-backdrop ${className || ""}`.trim()}
      style={backdropStyle}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="lum-dialog" style={dialogStyle}>
        {(title || showCloseButton) && (
          <div className="lum-dialog__header" style={headerStyle}>
            <div>
              {title && (
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h2>
              )}
              {subtitle && (
                <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                style={closeButtonStyle}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="lum-dialog__content" style={contentStyle}>
          {children}
        </div>
        {(footer || actions) && (
          <div className="lum-dialog__footer" style={footerStyle}>
            {footer || actions}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// BASE PANEL COMPONENT
// =============================================================================

export interface BasePanelProps extends PanelProps {
  styles?: ContainerStyleProvider;
  /** Custom collapse icon */
  collapseIcon?: (collapsed: boolean) => ReactNode;
}

/**
 * Base Panel component - collapsible content panel.
 * Handles collapse logic, delegates styling to provider.
 */
export function BasePanel({
  title,
  subtitle,
  collapsible,
  collapsed,
  onToggle,
  headerActions,
  footer,
  variant = "outlined",
  className,
  children,
  styles = defaultContainerStyles,
  collapseIcon = (collapsed) => (
    <span style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>
      ▼
    </span>
  ),
}: BasePanelProps) {
  const props: PanelProps = {
    title, subtitle, collapsible, collapsed, onToggle, headerActions, footer, variant, className, children,
  };

  const panelStyle = styles.getPanelStyle(props);
  const headerStyle = styles.getPanelHeaderStyle(props);
  const contentStyle = styles.getPanelContentStyle(props);
  const footerStyle = styles.getPanelFooterStyle(props);

  return (
    <div className={`lum-panel lum-panel--${variant} ${className || ""}`.trim()} style={panelStyle}>
      {(title || headerActions) && (
        <div
          className="lum-panel__header"
          style={headerStyle}
          onClick={collapsible ? onToggle : undefined}
        >
          <div>
            {title && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {collapsible && collapseIcon(!!collapsed)}
                <span style={{ fontWeight: 600 }}>{title}</span>
              </div>
            )}
            {subtitle && !collapsed && (
              <div style={{ marginTop: "4px", fontSize: 14, color: "#666" }}>
                {subtitle}
              </div>
            )}
          </div>
          {headerActions && <div onClick={(e) => e.stopPropagation()}>{headerActions}</div>}
        </div>
      )}
      <div className="lum-panel__content" style={contentStyle}>
        {children}
      </div>
      {footer && (
        <div className="lum-panel__footer" style={footerStyle}>
          {footer}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// BASE CARD COMPONENT
// =============================================================================

export interface BaseCardProps extends CardProps {
  styles?: ContainerStyleProvider;
}

/**
 * Base Card component - content card.
 * Handles click logic, delegates styling to provider.
 */
export function BaseCard({
  title,
  image,
  actions,
  clickable,
  onClick,
  className,
  children,
  styles = defaultContainerStyles,
}: BaseCardProps) {
  const props: CardProps = { title, image, actions, clickable, onClick, className, children };

  const cardStyle = styles.getCardStyle(props);
  const imageStyle = styles.getCardImageStyle(props);
  const contentStyle = styles.getCardContentStyle(props);
  const actionsStyle = styles.getCardActionsStyle(props);

  return (
    <div
      className={`lum-card ${clickable ? "lum-card--clickable" : ""} ${className || ""}`.trim()}
      style={cardStyle}
      onClick={clickable ? onClick : undefined}
    >
      {image && (
        <img
          src={image}
          alt=""
          style={imageStyle}
          className="lum-card__image"
        />
      )}
      <div className="lum-card__content" style={contentStyle}>
        {title && (
          <div className="lum-card__title" style={{ fontWeight: 600, marginBottom: "8px" }}>
            {title}
          </div>
        )}
        {children}
      </div>
      {actions && (
        <div className="lum-card__actions" style={actionsStyle}>
          {actions}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// CREATE CONTAINER ADAPTER HELPER
// =============================================================================

/**
 * Create a container adapter with custom styles.
 * Provides base components with injected style provider.
 */
export function createContainerAdapter(styles: Partial<ContainerStyleProvider> = {}): ContainerAdapter {
  const mergedStyles: ContainerStyleProvider = { ...defaultContainerStyles, ...styles };

  return {
    Tabs: (props) => <BaseTabs {...props} styles={mergedStyles} />,
    TabPanel: (props) => <BaseTabPanel {...props} styles={mergedStyles} />,
    Dialog: (props) => <BaseDialog {...props} styles={mergedStyles} />,
    Panel: (props) => <BasePanel {...props} styles={mergedStyles} />,
    Card: (props) => <BaseCard {...props} styles={mergedStyles} />,
  };
}

