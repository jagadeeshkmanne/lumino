/**
 * Lumino Framework - Salt Select Adapter
 *
 * Uses createLuminoComponent with custom render for valueToString support.
 * Salt's Dropdown needs valueToString to display labels instead of raw values.
 */

import { Dropdown, Option } from "@salt-ds/core";
import { createLuminoComponent, type NormalizedOption } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * Normalize options helper (inline to avoid circular imports)
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
 * LuminoSelect - Salt Dropdown with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - value → selected (wrapped in array)
 * - options + optionConfig → Option children (auto-generated)
 * - error → validationStatus
 *
 * Lumino Events → Salt Events:
 * - onChange(value) ← onSelectionChange(event, selected[])
 *
 * Key feature: valueToString is auto-generated to display labels instead of values!
 *
 * @example
 * ```tsx
 * <LuminoSelect
 *   value="us"
 *   onChange={setValue}
 *   options={[
 *     { value: "us", label: "United States" },
 *     { value: "uk", label: "United Kingdom" },
 *   ]}
 * />
 * // Displays "United States" not "us"
 * ```
 */
export const LuminoSelect = createLuminoComponent(Dropdown, {
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "select", className),
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
    style: { width: "100%" },
  },
  exclude: ["options", "optionConfig", "renderOption", "returnFullObject", "onChange", "value"],
  render: (transformedProps, _Dropdown, originalProps) => {
    const { options = [], optionConfig, renderOption, returnFullObject, value, onChange } = originalProps as any;

    // Normalize options
    const normalizedOptions = normalizeOptions(options, optionConfig);

    // Create valueToString function to display label instead of value
    const valueToString = (val: any) => {
      const opt = normalizedOptions.find((o) => String(o.value) === String(val));
      return opt?.label ?? String(val ?? "");
    };

    // Handle selection change
    const handleSelectionChange = (_event: any, selected: any[]) => {
      if (!onChange) return;
      const selectedValue = selected?.[0];
      if (returnFullObject) {
        const selectedOpt = normalizedOptions.find((o) => String(o.value) === String(selectedValue));
        onChange(selectedOpt?.data);
      } else {
        onChange(selectedValue);
      }
    };

    return (
      <Dropdown
        {...transformedProps}
        selected={value != null ? [value] : []}
        onSelectionChange={handleSelectionChange}
        valueToString={valueToString}
      >
        {normalizedOptions.map((opt) => (
          <Option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
            {renderOption ? renderOption(opt) : opt.label}
          </Option>
        ))}
      </Dropdown>
    );
  },
});
