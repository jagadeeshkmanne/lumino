/**
 * Lumino Framework - Salt DatePicker Adapter
 *
 * Uses createLuminoComponent with proper event mapping.
 * Note: Salt DS has DatePicker in @salt-ds/lab, but we use Input type="date" for simplicity.
 */

import { Input } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * Format date to YYYY-MM-DD for input
 */
function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

/**
 * LuminoDatePicker - Salt Input (type=date) with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value (formatted as YYYY-MM-DD)
 * - minDate → inputProps.min
 * - maxDate → inputProps.max
 * - error → validationStatus
 *
 * Lumino Events → Salt Events:
 * - onChange(string | null) ← onChange(event) - extracts value
 * - onBlur() ← onBlur(event)
 * - onFocus() ← onFocus(event)
 *
 * @example
 * ```tsx
 * <LuminoDatePicker
 *   value="2024-01-15"
 *   onChange={setDate}
 *   minDate="2024-01-01"
 *   maxDate="2024-12-31"
 * />
 * ```
 */
export const LuminoDatePicker = createLuminoComponent(Input, {
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    value: {
      to: "value",
      transform: (value) => formatDate(value),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "date-picker", className),
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
  exclude: ["minDate", "maxDate", "name"],
  // Custom render only needed for inputProps (type, min, max, name)
  render: (transformedProps, _Input, originalProps) => {
    const { name, minDate, maxDate } = originalProps as any;

    return (
      <Input
        {...transformedProps}
        inputProps={{
          name,
          type: "date",
          min: minDate ? formatDate(minDate) : undefined,
          max: maxDate ? formatDate(maxDate) : undefined,
        }}
      />
    );
  },
});
