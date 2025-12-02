/**
 * Lumino Framework - Salt Checkbox Adapter
 *
 * Uses createLuminoComponent to adapt Salt's Checkbox.
 */

import { Checkbox } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";

/**
 * LuminoCheckbox - Salt Checkbox with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value (boolean) → checked
 * - error (boolean) → validationStatus
 *
 * Lumino Events → Salt Events:
 * - onChange(boolean) ← onChange(event)
 * - onBlur() ← onBlur(event)
 * - onFocus() ← onFocus(event)
 *
 * Native Props Passthrough:
 * All unmapped props are passed directly to Salt's Checkbox.
 * You can use any Salt Checkbox prop like:
 * - label, indeterminate, inputProps, name, disabled, readOnly, etc.
 *
 * @example
 * ```tsx
 * <LuminoCheckbox
 *   value={isChecked}           // Lumino prop → mapped to "checked"
 *   error={hasError}            // Lumino prop → mapped to "validationStatus"
 *   onChange={(val) => ...}     // Lumino event → extracts boolean from event
 *   label="Accept terms"        // Salt native prop → passed through
 *   indeterminate={false}       // Salt native prop → passed through
 * />
 * ```
 */
export const LuminoCheckbox = createLuminoComponent(Checkbox, {
  props: {
    // Lumino "value" → Salt "checked" (default to false to avoid uncontrolled warning)
    value: {
      to: "checked",
      transform: (value) => value ?? false,
    },
    // Lumino "error" → Salt "validationStatus"
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
  },
  events: {
    // Lumino onChange(boolean) ← Salt onChange(event)
    onChange: {
      to: "onChange",
      extract: (event) => event.target.checked,
    },
    // Lumino onBlur() ← Salt onBlur(event)
    onBlur: {
      to: "onBlur",
      extract: () => undefined,
    },
    // Lumino onFocus() ← Salt onFocus(event)
    onFocus: {
      to: "onFocus",
      extract: () => undefined,
    },
  },
});
