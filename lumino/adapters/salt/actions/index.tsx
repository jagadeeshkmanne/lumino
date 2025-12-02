/**
 * Lumino Framework - Salt Action Adapter
 *
 * Uses createLuminoComponent for action components.
 * All components use "Lumino" prefix for consistency.
 */

import { Button as SaltButton } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import type { IActionAdapter } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoButton - Salt Button with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - variant → variant (mapped: primary→cta, secondary→primary, tertiary→secondary)
 *
 * Custom render needed for variant mapping
 */
export const LuminoButton = createLuminoComponent(SaltButton, {
  exclude: ["variant"],
  render: (transformedProps, _Button, originalProps) => {
    const {
      children,
      onClick,
      disabled,
      variant = "primary",
      type = "button",
      className,
      style,
    } = originalProps as any;

    // Map Lumino variant to Salt variant
    const saltVariant = variant === "primary" ? "cta" : variant === "secondary" ? "primary" : "secondary";

    return (
      <SaltButton
        {...transformedProps}
        type={type}
        onClick={onClick}
        disabled={disabled}
        variant={saltVariant}
        className={luminoClass("button", variant, className)}
        style={style}
      >
        {children}
      </SaltButton>
    );
  },
});

/**
 * LuminoIconButton - Salt Button (icon-only) with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - variant → variant (mapped)
 * - ariaLabel → aria-label
 * - tooltip → title
 *
 * Custom render needed for icon-button structure
 */
export const LuminoIconButton = createLuminoComponent(SaltButton, {
  exclude: ["variant", "ariaLabel", "tooltip", "icon"],
  render: (transformedProps, _Button, originalProps) => {
    const {
      icon,
      onClick,
      disabled,
      ariaLabel,
      tooltip,
      variant = "default",
      className,
      style,
    } = originalProps as any;

    // Map Lumino variant to Salt variant
    const saltVariant = variant === "primary" ? "cta" : "primary";

    return (
      <SaltButton
        {...transformedProps}
        type="button"
        onClick={onClick}
        disabled={disabled}
        variant={saltVariant}
        aria-label={ariaLabel}
        title={tooltip}
        className={luminoClass("icon-button", variant, className)}
        style={style}
      >
        {icon}
      </SaltButton>
    );
  },
});

/**
 * Salt Action Adapter
 */
export const saltActionAdapter: IActionAdapter = {
  Button: LuminoButton as any,
  IconButton: LuminoIconButton as any,
};

// Legacy aliases for backward compatibility
export { LuminoButton as SaltActionButton };
export { LuminoIconButton as SaltActionIconButton };
