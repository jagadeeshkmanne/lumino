/**
 * Lumino Framework - Salt Tooltip Adapter
 *
 * Uses createLuminoComponent to map Lumino TooltipProps to Salt Tooltip.
 */

import React from "react";
import { Tooltip } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { TooltipProps } from "../../../core/types/ui";

/**
 * LuminoTooltip - Salt Tooltip with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - content → content
 * - children → children (trigger element)
 * - placement → placement
 * - disabled → disabled
 * - open → open
 * - onOpenChange → onOpenChange
 * - enterDelay → enterDelay
 * - leaveDelay → leaveDelay
 *
 * @example
 * ```tsx
 * <LuminoTooltip content="Click to submit" placement="top">
 *   <button>Submit</button>
 * </LuminoTooltip>
 * ```
 */
export const LuminoTooltip = createLuminoComponent(Tooltip, {
  props: {
    content: { to: "content" },
    placement: { to: "placement" },
    disabled: { to: "disabled" },
    open: { to: "open" },
    enterDelay: { to: "enterDelay" },
    leaveDelay: { to: "leaveDelay" },
    className: {
      to: "className",
      transform: (className) => luminoClass("feedback", "tooltip", className),
    },
  },
  events: {
    onOpenChange: {
      to: "onOpenChange",
      extract: (open: boolean) => open,
    },
  },
});

// Legacy alias for backward compatibility
export { LuminoTooltip as SaltTooltip };
