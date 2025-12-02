/**
 * Lumino Framework - Salt Spinner Adapter
 *
 * Uses createLuminoComponent to map Lumino SpinnerProps to Salt Spinner.
 */

import React from "react";
import { Spinner } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { SpinnerProps } from "../../../core/types/ui";

/**
 * LuminoSpinner - Salt Spinner with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - size → size (maps to Salt size)
 * - label → aria-label
 *
 * @example
 * ```tsx
 * <LuminoSpinner size="large" label="Loading data..." />
 * ```
 */
export const LuminoSpinner = createLuminoComponent(Spinner, {
  props: {
    className: {
      to: "className",
      transform: (className) => luminoClass("feedback", "spinner", className),
    },
    size: {
      to: "size",
      transform: (size) => {
        // Map Lumino sizes to Salt sizes
        switch (size) {
          case "small": return "small";
          case "medium": return "medium";
          case "large": return "large";
          default: return "medium";
        }
      },
    },
    label: {
      to: "aria-label",
    },
  },
  exclude: ["role", "disableAnnounce"],
});

// Legacy alias for backward compatibility
export { LuminoSpinner as SaltSpinner };
