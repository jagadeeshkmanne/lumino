/**
 * Lumino Framework - Salt TextInput Adapter
 *
 * Uses createLuminoComponent with proper event mapping.
 * Note: Salt Input requires native input attributes via inputProps.
 */

import React from "react";
import { Input } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoTextInput - Salt Input with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value
 * - error → validationStatus
 *
 * Lumino Events → Salt Events:
 * - onChange(string) ← onChange(event) - extracts value
 * - onBlur() ← onBlur(event)
 * - onFocus() ← onFocus(event)
 * - onKeyDown(key) ← onKeyDown(event)
 * - onEnter() ← onKeyDown(event) when Enter
 *
 * @example
 * ```tsx
 * <LuminoTextInput
 *   value={text}
 *   onChange={setText}
 *   onEnter={handleSubmit}
 * />
 * ```
 */
export const LuminoTextInput = createLuminoComponent(Input, {
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    value: {
      to: "value",
      transform: (value) => value ?? "",
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "text-input", className),
    },
  },
  exclude: ["name", "type", "autoFocus", "tabIndex", "ariaLabel", "onKeyDown", "onEnter"],
  events: {
    onChange: {
      to: "onChange",
      extract: (event) => event.target.value,
    },
    onBlur: { to: "onBlur", extract: () => undefined },
    onFocus: { to: "onFocus", extract: () => undefined },
  },
  // Custom render needed for inputProps (Salt-specific) and onKeyDown/onEnter handling
  render: (transformedProps, _Input, originalProps) => {
    const {
      name,
      type = "text",
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
          type,
          autoFocus,
          tabIndex,
          "aria-label": ariaLabel,
          onKeyDown: handleKeyDown,
        }}
      />
    );
  },
});
