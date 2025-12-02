/**
 * Lumino Framework - UI-Agnostic Field Components
 *
 * These components wrap the adapter's field implementations.
 * Use these in form/page configurations instead of Salt/MUI-specific imports.
 *
 * When you switch adapters (e.g., from Salt to MUI), these components
 * automatically use the new adapter's implementations.
 *
 * @example
 * ```typescript
 * import { TextInput, Select, Checkbox } from "lumino/react/components";
 *
 * // In form configuration:
 * .addField("email")
 *   .component(TextInput)  // Uses the registered adapter's TextInput
 *   .label("Email")
 * ```
 */

import React from "react";
import { Lumino } from "../../core/Lumino";
import type {
  TextInputProps,
  NumberInputProps,
  TextAreaProps,
  CheckboxProps,
  CheckboxGroupProps,
  SwitchProps,
  RadioGroupProps,
  SelectProps,
  MultiSelectProps,
  AutocompleteProps,
  DatePickerProps,
  TimePickerProps,
} from "../../core/types/ui";

// =============================================================================
// HELPER: Get field adapter from Lumino
// =============================================================================

function getFieldAdapter() {
  try {
    const adapter = Lumino.ui.get();
    return adapter?.fields;
  } catch {
    return null;
  }
}

// =============================================================================
// TEXT INPUT
// =============================================================================

/**
 * Text input component - uses the registered adapter's TextInput.
 */
export function LuminoTextInput(props: TextInputProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.TextInput;

  if (!Component) {
    // Fallback to basic HTML input
    return (
      <input
        type={props.type || "text"}
        name={props.name}
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        className={props.className}
      />
    );
  }

  return <Component {...props} />;
};

// =============================================================================
// NUMBER INPUT
// =============================================================================

/**
 * Number input component - uses the registered adapter's NumberInput.
 */
export function LuminoNumberInput(props: NumberInputProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.NumberInput;

  if (!Component) {
    return (
      <input
        type="number"
        name={props.name}
        value={props.value ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          props.onChange(val === "" ? null : parseFloat(val));
        }}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        min={props.min}
        max={props.max}
        step={props.step}
        className={props.className}
      />
    );
  }

  return <Component {...props} />;
};

// =============================================================================
// TEXT AREA
// =============================================================================

/**
 * Text area component - uses the registered adapter's TextArea.
 */
export function LuminoTextArea(props: TextAreaProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.TextArea;

  if (!Component) {
    return (
      <textarea
        name={props.name}
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        rows={props.rows}
        className={props.className}
      />
    );
  }

  return <Component {...props} />;
};

// =============================================================================
// CHECKBOX
// =============================================================================

/**
 * Checkbox component - uses the registered adapter's Checkbox.
 */
export function LuminoCheckbox(props: CheckboxProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.Checkbox;

  if (!Component) {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="checkbox"
          name={props.name}
          checked={props.value ?? false}
          onChange={(e) => props.onChange(e.target.checked)}
          onBlur={props.onBlur}
          disabled={props.disabled}
          className={props.className}
        />
        {props.label}
      </label>
    );
  }

  return <Component {...props} />;
};

// =============================================================================
// CHECKBOX GROUP
// =============================================================================

/**
 * Checkbox group component - uses the registered adapter's CheckboxGroup.
 */
export function LuminoCheckboxGroup(props: CheckboxGroupProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.CheckboxGroup;

  if (!Component) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {(props.options || []).map((opt: any) => {
          const value = typeof opt === "object" ? opt.value : opt;
          const label = typeof opt === "object" ? opt.label : String(opt);
          const checked = (props.value || []).includes(value);
          return (
            <label key={String(value)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const newValue = checked
                    ? (props.value || []).filter((v: any) => v !== value)
                    : [...(props.value || []), value];
                  props.onChange(newValue);
                }}
                disabled={props.disabled}
              />
              {label}
            </label>
          );
        })}
      </div>
    );
  }

  return <Component {...props} />;
};

// =============================================================================
// SWITCH
// =============================================================================

/**
 * Switch/toggle component - uses the registered adapter's Switch.
 */
export function LuminoSwitch(props: SwitchProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.Switch;

  if (!Component) {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="checkbox"
          name={props.name}
          checked={props.value ?? false}
          onChange={(e) => props.onChange(e.target.checked)}
          onBlur={props.onBlur}
          disabled={props.disabled}
          className={props.className}
        />
        {props.label}
      </label>
    );
  }

  return <Component {...props} />;
};

// =============================================================================
// RADIO GROUP
// =============================================================================

/**
 * Radio button group - uses the registered adapter's RadioGroup.
 */
export function LuminoRadioGroup(props: RadioGroupProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.RadioGroup;

  if (!Component) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {(props.options || []).map((opt: any) => {
          const value = typeof opt === "object" ? opt.value : opt;
          const label = typeof opt === "object" ? opt.label : String(opt);
          return (
            <label key={String(value)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="radio"
                name={props.name}
                value={String(value)}
                checked={props.value === value}
                onChange={() => props.onChange(value)}
                disabled={props.disabled}
              />
              {label}
            </label>
          );
        })}
      </div>
    );
  }

  return <Component {...props} />;
};

// =============================================================================
// SELECT (SINGLE)
// =============================================================================

/**
 * Single-select dropdown - uses the registered adapter's Select.
 */
export function LuminoSelect<T = any>(props: SelectProps<T>) {
  const fields = getFieldAdapter();
  const Component = fields?.Select;

  if (!Component) {
    // Normalize options
    const options = (props.options || []).map((opt: any) => {
      if (typeof opt === "object" && "value" in opt && "label" in opt) {
        return opt;
      }
      return { value: opt, label: String(opt) };
    });

    return (
      <select
        name={props.name}
        value={props.value ?? ""}
        onChange={(e) => {
          const opt = options.find((o: any) => String(o.value) === e.target.value);
          props.onChange(opt ? opt.value : e.target.value);
        }}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        disabled={props.disabled}
        className={props.className}
      >
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {options.map((opt: any) => (
          <option key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return <Component {...props} />;
}

// =============================================================================
// MULTI-SELECT
// =============================================================================

/**
 * Multi-select dropdown - uses the registered adapter's MultiSelect.
 */
export function LuminoMultiSelect<T = any>(props: MultiSelectProps<T>) {
  const fields = getFieldAdapter();
  const Component = fields?.MultiSelect;

  if (!Component) {
    // Fallback to checkbox group
    return <LuminoCheckboxGroup {...(props as any)} />;
  }

  return <Component {...props} />;
}

// =============================================================================
// AUTOCOMPLETE
// =============================================================================

/**
 * Autocomplete/combobox - uses the registered adapter's Autocomplete.
 */
export function LuminoAutocomplete<T = any>(props: AutocompleteProps<T>) {
  const fields = getFieldAdapter();
  const Component = fields?.Autocomplete;

  if (!Component) {
    // Fallback to text input
    return <LuminoTextInput {...(props as any)} />;
  }

  return <Component {...props} />;
}

// =============================================================================
// DATE PICKER
// =============================================================================

/**
 * Date picker - uses the registered adapter's DatePicker.
 */
export function LuminoDatePicker(props: DatePickerProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.DatePicker;

  if (!Component) {
    return (
      <input
        type="date"
        name={props.name}
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.target.value || null)}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        disabled={props.disabled}
        className={props.className}
      />
    );
  }

  return <Component {...props} />;
};

// =============================================================================
// TIME PICKER
// =============================================================================

/**
 * Time picker - uses the registered adapter's TimePicker.
 */
export function LuminoTimePicker(props: TimePickerProps): React.ReactNode {
  const fields = getFieldAdapter();
  const Component = fields?.TimePicker;

  if (!Component) {
    return (
      <input
        type="time"
        name={props.name}
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.target.value || null)}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        disabled={props.disabled}
        className={props.className}
      />
    );
  }

  return <Component {...props} />;
};
