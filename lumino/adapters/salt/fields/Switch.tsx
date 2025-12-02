/**
 * Lumino Framework - Salt Switch Adapter
 *
 * Uses createLuminoComponent to adapt Salt's Switch.
 */

import { Switch } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";

/**
 * LuminoSwitch - Salt Switch with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value (boolean) → checked
 *
 * Lumino Events → Salt Events:
 * - onChange(boolean) ← onChange(event)
 * - onBlur() ← onBlur(event)
 * - onFocus() ← onFocus(event)
 */
export const LuminoSwitch = createLuminoComponent(Switch, {
  props: {
    // Lumino "value" → Salt "checked" (default to false to avoid uncontrolled warning)
    value: {
      to: "checked",
      transform: (value) => value ?? false,
    },
  },
  events: {
    // Lumino onChange(boolean) ← Salt onChange(event)
    onChange: {
      to: "onChange",
      extract: (event: React.ChangeEvent<HTMLInputElement>) => event.target.checked,
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
