/**
 * Lumino Framework - Salt MultiSelect Adapter
 *
 * Uses createLuminoComponent with custom render for valueToString support.
 * Salt's ComboBox needs valueToString to display labels instead of raw values.
 */

import { ComboBox, Option } from "@salt-ds/core";
import { createLuminoComponent, type NormalizedOption } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * Normalize options helper
 */
function normalizeOptions<T>(
  options: T[],
  config?: { valueProperty?: string | ((item: T) => any); displayProperty?: string | ((item: T) => string) }
): NormalizedOption<T>[] {
  return options.map((opt) => {
    if (typeof opt === "object" && opt !== null && "value" in opt && "label" in opt) {
      return { ...(opt as any), data: (opt as any).data ?? opt } as NormalizedOption<T>;
    }
    if (typeof opt !== "object" || opt === null) {
      return { value: opt, label: String(opt), data: opt };
    }
    const obj = opt as T;
    const getValue = config?.valueProperty;
    const getDisplay = config?.displayProperty;
    const value = typeof getValue === "function" ? getValue(obj) : getValue ? (obj as any)[getValue] : obj;
    const label = typeof getDisplay === "function" ? getDisplay(obj) : getDisplay ? String((obj as any)[getDisplay]) : JSON.stringify(obj);
    return { value, label, data: obj };
  });
}

/**
 * LuminoMultiSelect - Salt ComboBox (multiselect) with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → selected (array)
 * - options + optionConfig → Option children (auto-generated)
 * - error → validationStatus
 *
 * Key feature: valueToString is auto-generated to display labels instead of values!
 *
 * @example
 * ```tsx
 * <LuminoMultiSelect
 *   value={['react', 'vue']}
 *   onChange={setValues}
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *   ]}
 * />
 * // Displays "React, Vue" not "react, vue"
 * ```
 */
export const LuminoMultiSelect = createLuminoComponent(ComboBox, {
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "multi-select", className),
    },
    placeholder: {
      to: "placeholder",
      transform: (p) => p || "Select...",
    },
  },
  events: {
    onBlur: { to: "onBlur", extract: () => undefined },
    onFocus: { to: "onFocus", extract: () => undefined },
  },
  defaults: {
    multiselect: true,
    truncate: true,
    style: { width: "100%" },
  },
  exclude: ["options", "optionConfig", "renderOption", "returnFullObject", "onChange", "value"],
  render: (transformedProps, _ComboBox, originalProps) => {
    const { options = [], optionConfig, renderOption, value, onChange } = originalProps as any;

    // Normalize options
    const normalizedOptions = normalizeOptions(options, optionConfig);

    // Create valueToString function to display label instead of value
    const valueToString = (val: any) => {
      const opt = normalizedOptions.find((o) => String(o.value) === String(val));
      return opt?.label ?? String(val ?? "");
    };

    // Handle selection change
    const handleSelectionChange = (_event: any, selected: any[]) => {
      onChange?.(selected || []);
    };

    return (
      <ComboBox
        {...transformedProps}
        multiselect
        selected={value || []}
        onSelectionChange={handleSelectionChange}
        valueToString={valueToString}
      >
        {normalizedOptions.map((opt) => (
          <Option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
            {renderOption ? renderOption(opt) : opt.label}
          </Option>
        ))}
      </ComboBox>
    );
  },
});
