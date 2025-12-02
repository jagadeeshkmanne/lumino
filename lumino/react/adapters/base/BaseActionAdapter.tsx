/**
 * Lumino Framework - Base Action Adapter
 *
 * Abstract base implementations for action components.
 * UI-specific adapters extend these with their own styling.
 */

import React, { ReactNode } from "react";
import type {
  ActionAdapter,
  ButtonProps,
  IconButtonProps,
  ToolbarProps,
  ButtonGroupProps,
} from "../../../core/types/ui";

// =============================================================================
// STYLE PROVIDERS - Override in specific adapters
// =============================================================================

/**
 * Style provider interface for action components.
 * Adapters implement this to provide their own styles.
 */
export interface ActionStyleProvider {
  // Button styles
  getButtonStyle(props: ButtonProps): React.CSSProperties;
  getButtonSpinnerStyle(props: ButtonProps): React.CSSProperties;

  // IconButton styles
  getIconButtonStyle(props: IconButtonProps): React.CSSProperties;

  // Toolbar styles
  getToolbarStyle(props: ToolbarProps): React.CSSProperties;

  // ButtonGroup styles
  getButtonGroupStyle(props: ButtonGroupProps): React.CSSProperties;
}

// =============================================================================
// DEFAULT STYLE PROVIDER
// =============================================================================

/**
 * Default style provider with basic CSS styles.
 * Override specific methods in UI-specific adapters.
 */
export const defaultActionStyles: ActionStyleProvider = {
  getButtonStyle: ({ variant = "secondary", size = "medium", disabled, loading, fullWidth }) => {
    const sizeStyles: Record<string, React.CSSProperties> = {
      small: { padding: "4px 12px", fontSize: "12px" },
      medium: { padding: "8px 16px", fontSize: "14px" },
      large: { padding: "12px 24px", fontSize: "16px" },
    };

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
      link: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        color: "#1976d2",
        textDecoration: "underline",
      },
    };

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      borderRadius: "4px",
      border: "1px solid",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      opacity: disabled || loading ? 0.6 : 1,
      fontWeight: 500,
      width: fullWidth ? "100%" : undefined,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  },

  getButtonSpinnerStyle: () => ({
    display: "inline-block",
    animation: "spin 1s linear infinite",
  }),

  getIconButtonStyle: ({ variant = "default", size = "medium", disabled }) => {
    const sizeStyles: Record<string, React.CSSProperties> = {
      small: { width: 28, height: 28, fontSize: 14 },
      medium: { width: 36, height: 36, fontSize: 18 },
      large: { width: 44, height: 44, fontSize: 22 },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: "transparent",
        color: "#333",
      },
      primary: {
        backgroundColor: "#1976d2",
        color: "white",
      },
      danger: {
        backgroundColor: "transparent",
        color: "#d32f2f",
      },
      ghost: {
        backgroundColor: "transparent",
        color: "#666",
      },
    };

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      borderRadius: "4px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  },

  getToolbarStyle: ({ align = "left", gap = 8 }) => {
    const alignStyles: Record<string, React.CSSProperties> = {
      left: { justifyContent: "flex-start" },
      center: { justifyContent: "center" },
      right: { justifyContent: "flex-end" },
      "space-between": { justifyContent: "space-between" },
    };

    return {
      display: "flex",
      alignItems: "center",
      gap: typeof gap === "number" ? `${gap}px` : gap,
      ...alignStyles[align],
    };
  },

  getButtonGroupStyle: ({ orientation = "horizontal", gap = 0 }) => ({
    display: "inline-flex",
    flexDirection: orientation === "vertical" ? "column" : "row",
    gap: typeof gap === "number" ? `${gap}px` : gap,
  }),
};

// =============================================================================
// BASE BUTTON COMPONENT
// =============================================================================

export interface BaseButtonProps extends ButtonProps {
  styles?: ActionStyleProvider;
  /** Custom loading spinner */
  loadingSpinner?: ReactNode;
}

/**
 * Base Button component - clickable action trigger.
 * Handles button logic, delegates styling to provider.
 */
export function BaseButton({
  children,
  onClick,
  type = "button",
  variant = "secondary",
  size = "medium",
  disabled,
  loading,
  icon,
  iconPosition = "left",
  fullWidth,
  className,
  styles = defaultActionStyles,
  loadingSpinner = "⟳",
}: BaseButtonProps) {
  const props: ButtonProps = {
    children, onClick, type, variant, size, disabled, loading, icon, iconPosition, fullWidth, className,
  };

  const buttonStyle = styles.getButtonStyle(props);
  const spinnerStyle = styles.getButtonSpinnerStyle(props);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={buttonStyle}
      className={`lum-btn lum-btn--${variant} lum-btn--${size} ${className || ""}`.trim()}
    >
      {loading && <span className="lum-btn__spinner" style={spinnerStyle}>{loadingSpinner}</span>}
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}

// =============================================================================
// BASE ICON BUTTON COMPONENT
// =============================================================================

export interface BaseIconButtonProps extends IconButtonProps {
  styles?: ActionStyleProvider;
}

/**
 * Base IconButton component - icon-only button.
 * Handles button logic, delegates styling to provider.
 */
export function BaseIconButton({
  icon,
  onClick,
  ariaLabel,
  size = "medium",
  disabled,
  tooltip,
  variant = "default",
  className,
  styles = defaultActionStyles,
}: BaseIconButtonProps) {
  const props: IconButtonProps = { icon, onClick, ariaLabel, size, disabled, tooltip, variant, className };

  const buttonStyle = styles.getIconButtonStyle(props);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      aria-label={ariaLabel}
      title={tooltip}
      className={`lum-icon-btn ${className || ""}`.trim()}
    >
      {icon}
    </button>
  );
}

// =============================================================================
// BASE TOOLBAR COMPONENT
// =============================================================================

export interface BaseToolbarProps extends ToolbarProps {
  styles?: ActionStyleProvider;
}

/**
 * Base Toolbar component - horizontal action container.
 * Handles layout logic, delegates styling to provider.
 */
export function BaseToolbar({
  align = "left",
  gap = 8,
  className,
  children,
  styles = defaultActionStyles,
}: BaseToolbarProps) {
  const props: ToolbarProps = { align, gap, className, children };

  const toolbarStyle = styles.getToolbarStyle(props);

  return (
    <div className={`lum-toolbar ${className || ""}`.trim()} style={toolbarStyle}>
      {children}
    </div>
  );
}

// =============================================================================
// BASE BUTTON GROUP COMPONENT
// =============================================================================

export interface BaseButtonGroupProps extends ButtonGroupProps {
  styles?: ActionStyleProvider;
}

/**
 * Base ButtonGroup component - grouped buttons.
 * Handles layout logic, delegates styling to provider.
 */
export function BaseButtonGroup({
  orientation = "horizontal",
  gap = 0,
  className,
  children,
  styles = defaultActionStyles,
}: BaseButtonGroupProps) {
  const props: ButtonGroupProps = { orientation, gap, className, children };

  const groupStyle = styles.getButtonGroupStyle(props);

  return (
    <div className={`lum-btn-group ${className || ""}`.trim()} style={groupStyle} role="group">
      {children}
    </div>
  );
}

// =============================================================================
// CREATE ACTION ADAPTER HELPER
// =============================================================================

/**
 * Create an action adapter with custom styles.
 * Provides base components with injected style provider.
 */
export function createActionAdapter(styles: Partial<ActionStyleProvider> = {}): ActionAdapter {
  const mergedStyles: ActionStyleProvider = { ...defaultActionStyles, ...styles };

  return {
    Button: (props) => <BaseButton {...props} styles={mergedStyles} />,
    IconButton: (props) => <BaseIconButton {...props} styles={mergedStyles} />,
    Toolbar: (props) => <BaseToolbar {...props} styles={mergedStyles} />,
    ButtonGroup: (props) => <BaseButtonGroup {...props} styles={mergedStyles} />,
  };
}

