/**
 * Lumino Framework - Salt Form Adapter
 *
 * Uses createLuminoComponent with custom render for form structure.
 */

import React from "react";
import { StackLayout } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

// Placeholder component for typing
const FormPlaceholder: React.FC<any> = () => null;

/**
 * LuminoForm - Form wrapper with Salt StackLayout
 *
 * Custom render needed for native form element with StackLayout children
 *
 * @example
 * ```tsx
 * <LuminoForm formId="user-profile" onSubmit={handleSubmit}>
 *   <Field name="email" />
 *   <Field name="password" />
 *   <Button type="submit">Submit</Button>
 * </LuminoForm>
 * ```
 */
export const LuminoForm = createLuminoComponent(FormPlaceholder, {
  render: (_transformedProps, _Component, originalProps) => {
    const {
      children,
      formId,
      onSubmit,
      className,
      style,
      "data-testid": testId,
    } = originalProps as any;

    return (
      <form
        id={formId}
        onSubmit={onSubmit}
        className={luminoClass("layout", "form", className)}
        style={style}
        data-testid={testId}
      >
        <StackLayout gap={2}>
          {children}
        </StackLayout>
      </form>
    );
  },
});
