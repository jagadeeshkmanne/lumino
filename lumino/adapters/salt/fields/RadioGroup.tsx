/**
 * Lumino Framework - Salt RadioGroup Adapter
 *
 * Uses createLuminoComponent with children config.
 * No manual normalizeOptions needed - handled automatically!
 */

import { RadioButtonGroup, RadioButton } from "@salt-ds/core";
import { createLuminoComponent, type NormalizedOption } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoRadioGroup - Salt RadioButtonGroup with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → value (as string)
 * - options + optionConfig → RadioButton children (auto-generated)
 * - error → validationStatus
 *
 * Lumino Events → Salt Events:
 * - onChange(value) ← onChange(event) - extracts selected value
 *
 * Supports (all handled by children config):
 * - optionConfig: { valueProperty, displayProperty, disabledProperty }
 * - renderOption: Custom option label rendering
 * - returnFullObject: Return entire object instead of just value
 *
 * @example
 * ```tsx
 * // Simple options
 * <LuminoRadioGroup
 *   value="a"
 *   onChange={setValue}
 *   options={['a', 'b', 'c']}
 * />
 *
 * // Object options with optionConfig
 * <LuminoRadioGroup
 *   value={selectedId}
 *   onChange={setSelectedId}
 *   options={paymentMethods}
 *   optionConfig={{
 *     valueProperty: 'id',
 *     displayProperty: 'name',
 *   }}
 * />
 * ```
 */
export const LuminoRadioGroup = createLuminoComponent(RadioButtonGroup, {
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "radio-group", className),
    },
    // RadioButtonGroup uses string value (default to "" to avoid uncontrolled warning)
    value: {
      to: "value",
      transform: (v) => (v != null ? String(v) : ""),
    },
  },
  children: {
    from: "options",
    Component: RadioButton,
    valueProp: "value",
    onChangeTo: "onChange",
    // RadioButton onChange gives event, extract value
    onChangeExtract: (event) => event.target.value,
    // RadioButton uses label prop, not children
    getProps: (opt: NormalizedOption) => ({
      value: String(opt.value),
      label: opt.label,
      disabled: opt.disabled,
    }),
    // No children content - RadioButton uses label prop
    getContent: () => null,
  },
});
