/**
 * Lumino Framework - Salt ErrorMessage Adapter
 *
 * Displays validation errors using Salt's FormFieldHelperText with error styling.
 * Used for list validation errors and other standalone error displays.
 */

import React from "react";
import { FormFieldHelperText, StatusIndicator } from "@salt-ds/core";
import { luminoClass } from "../utils";
import type { ErrorMessageProps } from "../../../core/types/ui";

/**
 * LuminoErrorMessage - Salt FormFieldHelperText with error styling for validation messages
 *
 * Uses FormFieldHelperText with error status indicator to display error messages
 * in Salt's standard error style without extra FormField padding.
 */
export const LuminoErrorMessage: React.FC<ErrorMessageProps> = ({
  errors,
  className,
  style,
}) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div
      className={luminoClass("layout", "error-message", className)}
      style={{ marginTop: 4, ...style }}
    >
      {errors.map((error, idx) => (
        <FormFieldHelperText key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <StatusIndicator status="error" />
          {error}
        </FormFieldHelperText>
      ))}
    </div>
  );
};
