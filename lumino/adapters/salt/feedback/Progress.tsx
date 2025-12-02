/**
 * Lumino Framework - Salt Progress Adapter
 *
 * Uses createLuminoComponent to map Lumino ProgressProps to Salt LinearProgress/CircularProgress.
 * Note: Salt has LinearProgress and CircularProgress as separate components.
 */

import React from "react";
import { LinearProgress, CircularProgress } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { ProgressProps } from "../../../core/types/ui";

/**
 * LuminoLinearProgress - Salt LinearProgress with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value
 * - bufferValue → bufferValue
 * - hideTrack → hideTrack
 *
 * @example
 * ```tsx
 * <LuminoLinearProgress value={50} />
 * ```
 */
export const LuminoLinearProgress = createLuminoComponent(LinearProgress, {
  props: {
    value: { to: "value" },
    bufferValue: { to: "bufferValue" },
    hideTrack: { to: "hideTrack" },
    className: {
      to: "className",
      transform: (className) => luminoClass("feedback", "progress-linear", className),
    },
  },
  exclude: ["showLabel", "variant", "size", "color"],
});

/**
 * LuminoCircularProgress - Salt CircularProgress with Lumino interface
 *
 * @example
 * ```tsx
 * <LuminoCircularProgress value={75} />
 * ```
 */
export const LuminoCircularProgress = createLuminoComponent(CircularProgress, {
  props: {
    value: { to: "value" },
    className: {
      to: "className",
      transform: (className) => luminoClass("feedback", "progress-circular", className),
    },
  },
  exclude: ["showLabel", "variant", "size", "color", "bufferValue", "hideTrack"],
});

/**
 * LuminoProgress - Generic progress that selects linear or circular based on variant
 *
 * @example
 * ```tsx
 * <LuminoProgress value={50} variant="circular" />
 * ```
 */
export const LuminoProgress: React.FC<ProgressProps> = ({
  variant = "linear",
  value,
  bufferValue,
  hideTrack,
  className,
  style,
}) => {
  if (variant === "circular") {
    return (
      <LuminoCircularProgress
        value={value}
        className={className}
        style={style}
      />
    );
  }

  return (
    <LuminoLinearProgress
      value={value}
      bufferValue={bufferValue}
      hideTrack={hideTrack}
      className={className}
      style={style}
    />
  );
};

// Legacy aliases for backward compatibility
export { LuminoLinearProgress as SaltLinearProgress };
export { LuminoCircularProgress as SaltCircularProgress };
export { LuminoProgress as SaltProgress };
