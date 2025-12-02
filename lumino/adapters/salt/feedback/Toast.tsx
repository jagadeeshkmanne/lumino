/**
 * Lumino Framework - Salt Toast Adapter
 *
 * Uses createLuminoComponent to map Lumino ToastProps to Salt Toast.
 */

import React from "react";
import { Toast, ToastContent } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { ToastProps } from "../../../core/types/ui";

/**
 * LuminoToast - Salt Toast with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - type → status (info, success, warning, error)
 * - title → ToastContent title via children
 * - message → ToastContent children
 *
 * Note: Salt Toast requires being rendered within a ToastGroup for
 * proper positioning and animation. Use the toast manager for
 * imperative toast creation. onClose is handled by the container.
 *
 * @example
 * ```tsx
 * <LuminoToast
 *   type="success"
 *   title="Saved"
 *   message="Your changes have been saved."
 * />
 * ```
 */
export const LuminoToast = createLuminoComponent(Toast, {
  props: {
    type: {
      to: "status",
      transform: (type) => type || "info",
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("feedback", "toast", className),
    },
  },
  exclude: ["title", "message", "duration", "action", "onClose"],
  render: (transformedProps, _Toast, originalProps) => {
    const { title, message } = originalProps as ToastProps;

    return (
      <Toast {...transformedProps}>
        <ToastContent>
          {title && <strong>{title}</strong>}
          {title && message && <br />}
          {message}
        </ToastContent>
      </Toast>
    );
  },
});

// Legacy alias for backward compatibility
export { LuminoToast as SaltToast };
