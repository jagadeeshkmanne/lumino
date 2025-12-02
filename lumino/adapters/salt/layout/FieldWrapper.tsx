/**
 * Lumino Framework - Salt FieldWrapper Adapter
 *
 * Uses createLuminoComponent to adapt Salt's FormField.
 */

import { FormField, FormFieldLabel, FormFieldHelperText } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoFieldWrapper - Salt FormField with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - error → validationStatus
 * - required → necessity
 *
 * Custom render needed for FormFieldLabel and FormFieldHelperText structure
 */
export const LuminoFieldWrapper = createLuminoComponent(FormField, {
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => (error ? "error" : undefined),
    },
    required: {
      to: "necessity",
      transform: (required) => (required ? "asterisk" : undefined),
    },
  },
  exclude: ["label", "helpText"],
  render: (transformedProps, _FormField, originalProps) => {
    const {
      children,
      label,
      error,
      helpText,
      className,
      style,
      "data-testid": testId,
    } = originalProps as any;

    return (
      <FormField
        {...transformedProps}
        className={luminoClass("layout", "field-wrapper", className)}
        style={style}
        data-testid={testId}
      >
        {label && <FormFieldLabel>{label}</FormFieldLabel>}
        {children}
        {(error || helpText) && (
          <FormFieldHelperText>{typeof error === "string" ? error : helpText}</FormFieldHelperText>
        )}
      </FormField>
    );
  },
});
