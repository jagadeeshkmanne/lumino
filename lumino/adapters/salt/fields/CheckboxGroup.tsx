/**
 * Lumino Framework - Salt CheckboxGroup Adapter
 *
 * Uses createLuminoComponent with children config.
 * No manual normalizeOptions needed - handled automatically!
 */

import { CheckboxGroup, Checkbox } from "@salt-ds/core";
import { createLuminoComponent, type NormalizedOption } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoCheckboxGroup - Salt CheckboxGroup with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value (string[]) → checkedValues
 * - options + optionConfig → Checkbox children (auto-generated)
 * - error → validationStatus
 *
 * Lumino Events → Salt Events:
 * - onChange(string[]) ← onChange(event) - computes updated array
 *
 * Supports (all handled by children config):
 * - optionConfig: { valueProperty, displayProperty, disabledProperty }
 * - renderOption: Custom option label rendering
 *
 * @example
 * ```tsx
 * <LuminoCheckboxGroup
 *   value={['a', 'b']}
 *   onChange={(values) => setSelected(values)}
 *   options={[
 *     { value: 'a', label: 'Option A' },
 *     { value: 'b', label: 'Option B' },
 *     'c',  // Simple string option
 *   ]}
 * />
 * ```
 */
export const LuminoCheckboxGroup = createLuminoComponent(CheckboxGroup, {
  props: {
    // Default to empty array to avoid uncontrolled warning
    value: {
      to: "checkedValues",
      transform: (value) => value ?? [],
    },
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "checkbox-group", className),
    },
  },
  children: {
    from: "options",
    Component: Checkbox,
    valueProp: "value",
    onChangeTo: "onChange",
    // CheckboxGroup onChange needs to compute updated array
    onChangeExtract: (event, _normalizedOptions, currentValue = []) => {
      const checkboxValue = event.target.value;
      const isChecked = event.target.checked;
      return isChecked
        ? [...currentValue, checkboxValue]
        : currentValue.filter((v: string) => v !== checkboxValue);
    },
    // Checkbox uses label prop, not children
    getProps: (opt: NormalizedOption) => ({
      value: String(opt.value),
      label: opt.label,
      disabled: opt.disabled,
    }),
    getContent: () => null,
  },
});
