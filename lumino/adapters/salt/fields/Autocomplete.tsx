/**
 * Lumino Framework - Salt Autocomplete Adapter
 *
 * Uses createLuminoComponent with custom render for valueToString support.
 */

import { useState, useMemo, useEffect, type ChangeEvent } from "react";
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
 * Inner component that uses hooks for state management
 */
function AutocompleteInner({
  options = [],
  optionConfig,
  renderOption,
  returnFullObject,
  value,
  onChange,
  ...restProps
}: any) {
  const normalizedOptions = useMemo(
    () => normalizeOptions(options, optionConfig),
    [options, optionConfig]
  );

  // Get label for a value
  const getLabelForValue = (val: any): string => {
    if (val == null) return "";
    const opt = normalizedOptions.find((o) => String(o.value) === String(val));
    return opt?.label ?? "";
  };

  // Track input text for filtering - initialize from selected value's label
  const [inputValue, setInputValue] = useState(() => getLabelForValue(value));
  const [showAll, setShowAll] = useState(false);

  // Update input value when external value changes (e.g., form loads data)
  useEffect(() => {
    const label = getLabelForValue(value);
    setInputValue(label);
  }, [value, normalizedOptions]);

  // Filter options based on input text
  const filteredOptions = useMemo(() => {
    if (showAll || !inputValue) return normalizedOptions;
    const search = inputValue.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(search)
    );
  }, [normalizedOptions, inputValue, showAll]);

  // Handle input text changes (typing to filter) - uses onChange with ChangeEvent
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setShowAll(false);
  };

  // Handle selection changes
  const handleSelectionChange = (_event: any, selected: any[]) => {
    const selectedValue = selected?.[0];

    // Update input to show selected label
    if (selectedValue != null) {
      const label = getLabelForValue(selectedValue);
      setInputValue(label);
    } else {
      setInputValue("");
    }

    // Call onChange with value or full object
    if (onChange) {
      if (returnFullObject) {
        const selectedOpt = normalizedOptions.find((o) => String(o.value) === String(selectedValue));
        onChange(selectedOpt?.data ?? null);
      } else {
        onChange(selectedValue ?? null);
      }
    }
  };

  // Handle open change - show all options when manually opened
  const handleOpenChange = (_newOpen: boolean, reason: string) => {
    if (reason === "manual") {
      setShowAll(true);
    }
  };

  return (
    <ComboBox
      {...restProps}
      value={inputValue}
      onChange={handleInputChange}
      onSelectionChange={handleSelectionChange}
      onOpenChange={handleOpenChange}
    >
      {filteredOptions.map((opt) => (
        <Option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
          {renderOption ? renderOption(opt) : opt.label}
        </Option>
      ))}
    </ComboBox>
  );
}

/**
 * LuminoAutocomplete - Salt ComboBox with Lumino interface
 *
 * Key feature: valueToString is auto-generated to display labels instead of values!
 *
 * @example
 * ```tsx
 * <LuminoAutocomplete
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
export const LuminoAutocomplete = createLuminoComponent(ComboBox, {
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "autocomplete", className),
    },
    placeholder: {
      to: "placeholder",
      transform: (p) => p || "Search...",
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
  render: (transformedProps, _ComboBox, originalProps) => {
    const { options, optionConfig, renderOption, returnFullObject, value, onChange } = originalProps as any;

    return (
      <AutocompleteInner
        {...transformedProps}
        options={options}
        optionConfig={optionConfig}
        renderOption={renderOption}
        returnFullObject={returnFullObject}
        value={value}
        onChange={onChange}
      />
    );
  },
});
