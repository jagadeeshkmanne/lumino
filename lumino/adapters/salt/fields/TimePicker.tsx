/**
 * Lumino Framework - Salt TimePicker Adapter
 *
 * Uses createLuminoComponent with proper event mapping.
 * Note: Salt DS doesn't have a dedicated TimePicker, uses Input with type="time".
 */

import { Input } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoTimePicker - Salt Input (type=time) with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value
 * - error → validationStatus
 *
 * Lumino Events → Salt Events:
 * - onChange(string | null) ← onChange(event) - extracts value
 * - onBlur() ← onBlur(event)
 * - onFocus() ← onFocus(event)
 *
 * @example
 * ```tsx
 * <LuminoTimePicker
 *   value="14:30"
 *   onChange={setTime}
 * />
 * ```
 */
export const LuminoTimePicker = createLuminoComponent(Input, {
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
      transform: (className) => luminoClass("field", "time-picker", className),
    },
  },
  events: {
    onChange: {
      to: "onChange",
      extract: (event) => event.target.value || null,
    },
    onBlur: { to: "onBlur", extract: () => undefined },
    onFocus: { to: "onFocus", extract: () => undefined },
  },
  exclude: ["name"],
  // Custom render only needed for inputProps (type, name)
  render: (transformedProps, _Input, originalProps) => {
    const { name } = originalProps as any;

    return (
      <Input
        {...transformedProps}
        inputProps={{
          name,
          type: "time",
        }}
      />
    );
  },
});
