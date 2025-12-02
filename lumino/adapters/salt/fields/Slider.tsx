/**
 * Lumino Framework - Salt Slider Adapter
 *
 * Uses createLuminoComponent to map Lumino SliderProps to Salt Slider.
 * The adapter pattern ensures we can swap to MUI/Ant/other frameworks.
 */

import React from "react";
import { Slider } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { SliderProps } from "../../../core/types/ui";

/**
 * LuminoSlider - Salt Slider with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value
 * - min → min
 * - max → max
 * - step → step
 * - disabled → disabled
 * - showTooltip → showTooltip
 * - minLabel → minLabel
 * - maxLabel → maxLabel
 * - marks → marks
 * - format → format
 * - decimalPlaces → decimalPlaces
 * - restrictToMarks → restrictToMarks
 * - showTicks → showTicks
 *
 * Lumino Events → Salt Events:
 * - onChange(number) ← onChange(event, value)
 * - onChangeEnd(number) ← onChangeEnd(event, value)
 *
 * @example
 * ```tsx
 * <LuminoSlider
 *   name="rating"
 *   value={rating}
 *   onChange={setRating}
 *   min={0}
 *   max={10}
 *   step={1}
 * />
 * ```
 */
export const LuminoSlider = createLuminoComponent(Slider, {
  props: {
    value: {
      to: "value",
      transform: (value) => value ?? 0,
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "slider", className),
    },
    // These pass through directly (same names)
    min: { to: "min" },
    max: { to: "max" },
    step: { to: "step" },
    disabled: { to: "disabled" },
    showTooltip: { to: "showTooltip" },
    minLabel: { to: "minLabel" },
    maxLabel: { to: "maxLabel" },
    marks: { to: "marks" },
    format: { to: "format" },
    decimalPlaces: { to: "decimalPlaces" },
    restrictToMarks: { to: "restrictToMarks" },
    showTicks: { to: "showTicks" },
  },
  // Exclude Lumino-specific props that don't map to Salt
  exclude: ["name", "error", "showLabels", "onBlur", "onFocus", "placeholder", "readOnly"],
  events: {
    onChange: {
      to: "onChange",
      // Salt's onChange signature: (event: Event, value: number) => void
      extract: (_event: Event, value: number) => value,
    },
    onChangeEnd: {
      to: "onChangeEnd",
      // Salt's onChangeEnd signature: (event: Event, value: number) => void
      extract: (_event: Event, value: number) => value,
    },
  },
});

// Legacy alias for backward compatibility
export { LuminoSlider as SaltSlider };
