/**
 * Lumino Framework - UI-Agnostic Action Components
 *
 * These components wrap the adapter's action implementations.
 * Use these in form/page configurations for buttons and other actions.
 *
 * @example
 * ```typescript
 * import { Button } from "lumino/react/components";
 *
 * // In form configuration:
 * .addRow()
 *   .addComponent(Button)
 *     .children("+ Add Address")
 *     .onClick((ctx) => ctx.list("addresses").add(new Address()))
 *   .endComponent()
 * ```
 */

import React from "react";
import { Lumino } from "../../core/Lumino";
import type { ButtonProps, IconButtonProps } from "../../core/types/ui";

// =============================================================================
// HELPER: Get action adapter from Lumino
// =============================================================================

function getActionAdapter() {
  try {
    const adapter = Lumino.ui.get();
    return adapter?.actions;
  } catch {
    return null;
  }
}

// =============================================================================
// BUTTON
// =============================================================================

/**
 * Button component - uses the registered adapter's Button.
 */
export function LuminoButton(props: ButtonProps): React.ReactNode {
  const actions = getActionAdapter();
  const Component = actions?.Button;
  if (!Component) {
    // Fallback to basic button
    return (
      <button
        type={props.type || "button"}
        onClick={props.onClick}
        disabled={props.disabled}
        className={props.className}
        style={props.style}
      >
        {props.children}
      </button>
    );
  }
  return <Component {...props} />;
}

// =============================================================================
// ICON BUTTON
// =============================================================================

/**
 * IconButton component - uses the registered adapter's IconButton.
 */
export function LuminoIconButton(props: IconButtonProps): React.ReactNode {
  const actions = getActionAdapter();
  const Component = actions?.IconButton;
  if (!Component) {
    // Fallback to basic button
    return (
      <button
        type="button"
        onClick={props.onClick}
        disabled={props.disabled}
        aria-label={props.ariaLabel}
        className={props.className}
        style={props.style}
        title={props.tooltip}
      >
        {props.icon}
      </button>
    );
  }
  return <Component {...props} />;
}
