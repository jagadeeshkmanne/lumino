/**
 * Lumino Framework - Salt Badge Adapter
 *
 * Uses createLuminoComponent to map Lumino BadgeProps to Salt Badge.
 */

import React from "react";
import { Badge } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { BadgeProps } from "../../../core/types/ui";

/**
 * LuminoBadge - Salt Badge with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value (as string)
 * - children → children
 *
 * @example
 * ```tsx
 * <LuminoBadge value={5}>
 *   <NotificationIcon />
 * </LuminoBadge>
 * ```
 */
export const LuminoBadge = createLuminoComponent(Badge, {
  props: {
    value: {
      to: "value",
      transform: (value) => (value !== undefined ? String(value) : undefined),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("feedback", "badge", className),
    },
  },
  // Exclude Lumino-specific props not supported by Salt Badge
  exclude: ["variant", "color", "max", "showZero", "invisible", "position"],
});

// Legacy alias for backward compatibility
export { LuminoBadge as SaltBadge };
