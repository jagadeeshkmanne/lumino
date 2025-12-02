/**
 * Lumino Framework - Salt NumberInput Adapter
 *
 * Uses createLuminoComponent with proper event mapping.
 * Note: Salt Input requires native input attributes via inputProps.
 */

import React from "react";
import { Input } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoNumberInput - Salt Input (type=number) with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value (converted to string)
 * - error → validationStatus
 *
 * Lumino Events → Salt Events:
 * - onChange(number | null) ← onChange(event) - parses to number
 * - onBlur() ← onBlur(event)
 * - onFocus() ← onFocus(event)
 * - onKeyDown(key) ← onKeyDown(event)
 * - onEnter() ← onKeyDown(event) when Enter
 *
 * @example
 * ```tsx
 * <LuminoNumberInput
 *   value={count}
 *   onChange={setCount}
 *   min={0}
 *   max={100}
 *   step={1}
 * />
 * ```
 */
export const LuminoNumberInput = createLuminoComponent(Input, {
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    value: {
      to: "value",
      transform: (value) => (value != null ? String(value) : ""),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "number-input", className),
    },
  },
  exclude: ["name", "min", "max", "step", "autoFocus", "tabIndex", "ariaLabel", "onKeyDown", "onEnter"],
  events: {
    onChange: {
      to: "onChange",
      extract: (event) => (event.target.value === "" ? null : parseFloat(event.target.value)),
    },
    onBlur: { to: "onBlur", extract: () => undefined },
    onFocus: { to: "onFocus", extract: () => undefined },
  },
  // Custom render needed for inputProps (Salt-specific) and onKeyDown/onEnter handling
  render: (transformedProps, _Input, originalProps) => {
    const {
      name,
      min,
      max,
      step,
      autoFocus,
      tabIndex,
      onKeyDown,
      onEnter,
      "aria-label": ariaLabel,
    } = originalProps as any;

    // Handle keydown with Enter key support
    const handleKeyDown = onKeyDown || onEnter
      ? (event: React.KeyboardEvent<HTMLInputElement>) => {
          onKeyDown?.(event.key);
          if (event.key === "Enter") {
            onEnter?.();
          }
        }
      : undefined;

    return (
      <Input
        {...transformedProps}
        inputProps={{
          name,
          type: "number",
          min,
          max,
          step,
          autoFocus,
          tabIndex,
          "aria-label": ariaLabel,
          onKeyDown: handleKeyDown,
        }}
      />
    );
  },
});
