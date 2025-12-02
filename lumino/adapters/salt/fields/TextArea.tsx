/**
 * Lumino Framework - Salt TextArea Adapter
 *
 * Uses createLuminoComponent with Salt's MultilineInput component.
 */

import React from "react";
import { MultilineInput } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoTextArea - Salt MultilineInput with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value
 * - error → validationStatus
 * - readOnly → readOnly
 *
 * Lumino Events → Salt Events:
 * - onChange(string) ← onChange(event)
 * - onBlur() ← onBlur(event)
 * - onFocus() ← onFocus(event)
 * - onKeyDown(key) ← onKeyDown(event)
 * - onEnter() ← onKeyDown(Enter without Shift)
 */
export const LuminoTextArea = createLuminoComponent(MultilineInput, {
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
      transform: (className) => luminoClass("field", "text-area", className),
    },
  },
  exclude: ["name", "autoFocus", "tabIndex", "ariaLabel", "onKeyDown", "onEnter"],
  events: {
    onChange: {
      to: "onChange",
      extract: (event) => event.target.value,
    },
    onBlur: { to: "onBlur", extract: () => undefined },
    onFocus: { to: "onFocus", extract: () => undefined },
  },
  // Custom render needed for textAreaProps (Salt-specific) and onKeyDown/onEnter handling
  render: (transformedProps, _MultilineInput, originalProps) => {
    const {
      name,
      autoFocus,
      tabIndex,
      onKeyDown,
      onEnter,
      "aria-label": ariaLabel,
    } = originalProps as any;

    // Handle keydown with Enter key support (without Shift for submit)
    const handleKeyDown = onKeyDown || onEnter
      ? (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          onKeyDown?.(event.key);
          if (event.key === "Enter" && !event.shiftKey) {
            onEnter?.();
          }
        }
      : undefined;

    return (
      <MultilineInput
        {...transformedProps}
        textAreaProps={{
          name,
          autoFocus,
          tabIndex,
          "aria-label": ariaLabel,
          onKeyDown: handleKeyDown,
        }}
      />
    );
  },
});
