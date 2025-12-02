/**
 * Lumino Framework - Default Layout Adapter
 *
 * A plain CSS Grid based layout adapter that works without any UI library.
 * Use as a starting point or for simple applications.
 */

import React from "react";
import type {
  UIAdapter,
  LayoutAdapter,
  RowLayoutProps,
  ColumnLayoutProps,
  SectionLayoutProps,
  FormLayoutProps,
  FieldWrapperProps,
} from "../../core/types/ui";
import { lumCss } from "../../core/types/ui";

// =============================================================================
// DEFAULT LAYOUT COMPONENTS
// =============================================================================

/**
 * Default Row component using CSS Grid
 */
function DefaultRow({
  children,
  layout,
  gap = 16,
  columns = 12,
  className,
  rowIndex = 0,
}: RowLayoutProps) {
  // If layout is provided, create explicit grid template
  // Otherwise, use auto-fill
  const gridTemplateColumns = layout
    ? layout.map((span) => `${(span / columns) * 100}%`).join(" ")
    : `repeat(${columns}, 1fr)`;

  return (
    <div
      className={`${lumCss.row(rowIndex)} ${className || ""}`.trim()}
      style={{
        display: "grid",
        gridTemplateColumns,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Default Column component
 */
function DefaultColumn({
  children,
  span,
  totalColumns = 12,
  className,
  columnIndex = 0,
}: ColumnLayoutProps) {
  return (
    <div
      className={`${lumCss.column(columnIndex)} ${className || ""}`.trim()}
      style={{
        gridColumn: `span ${span}`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Default Section component
 */
function DefaultSection({
  children,
  title,
  collapsible,
  collapsed,
  onToggle,
  rowGap = 16,
  className,
}: SectionLayoutProps) {
  const sectionClass = title ? lumCss.section(title) : "lum-section";

  return (
    <fieldset
      className={`${sectionClass} ${className || ""}`.trim()}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      {title && (
        <legend
          onClick={collapsible ? onToggle : undefined}
          style={{
            cursor: collapsible ? "pointer" : "default",
            padding: "0 8px",
            fontSize: "14px",
            fontWeight: 500,
            userSelect: collapsible ? "none" : "auto",
          }}
        >
          {title}
          {collapsible && (
            <span style={{ marginLeft: "8px" }}>
              {collapsed ? "▶" : "▼"}
            </span>
          )}
        </legend>
      )}
      {!collapsed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${rowGap}px`,
          }}
        >
          {children}
        </div>
      )}
    </fieldset>
  );
}

/**
 * Default Form component
 */
function DefaultForm({
  children,
  formId,
  onSubmit,
  className,
}: FormLayoutProps) {
  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className={`${lumCss.form(formId)} ${className || ""}`.trim()}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {children}
    </form>
  );
}

/**
 * Default Field Wrapper component
 */
function DefaultFieldWrapper({
  children,
  name,
  label,
  error,
  required,
  helpText,
  className,
}: FieldWrapperProps) {
  const fieldClass = lumCss.field(name);
  const errorClass = error ? lumCss.fieldError : "";
  const requiredClass = required ? lumCss.fieldRequired : "";

  return (
    <div className={`${fieldClass} ${errorClass} ${requiredClass} ${className || ""}`.trim()}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {label}
          {required && <span style={{ color: "#f44336", marginLeft: "4px" }}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <span
          style={{
            display: "block",
            marginTop: "4px",
            fontSize: "12px",
            color: "#f44336",
          }}
        >
          {error}
        </span>
      )}
      {helpText && !error && (
        <span
          style={{
            display: "block",
            marginTop: "4px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          {helpText}
        </span>
      )}
    </div>
  );
}

// =============================================================================
// DEFAULT LAYOUT ADAPTER
// =============================================================================

/**
 * Default layout adapter using CSS Grid.
 * Works without any UI library dependencies.
 */
export const defaultLayoutAdapter: LayoutAdapter = {
  Row: DefaultRow,
  Column: DefaultColumn,
  Section: DefaultSection,
  Form: DefaultForm,
  FieldWrapper: DefaultFieldWrapper,
};

// =============================================================================
// DEFAULT UI ADAPTER
// =============================================================================

/**
 * Default UI adapter with CSS Grid layout.
 * Use as a starting point for custom UI implementations.
 *
 * @example
 * ```typescript
 * import { Lumino } from "@lumino/core";
 * import { defaultAdapter } from "@lumino/react";
 *
 * // Use default adapter
 * Lumino.ui(defaultAdapter);
 *
 * // Or extend it
 * Lumino.ui({
 *   ...defaultAdapter,
 *   components: {
 *     TextField: { component: MyTextField },
 *   },
 * });
 * ```
 */
export const defaultAdapter: UIAdapter = {
  name: "default",
  layout: defaultLayoutAdapter,
  components: {},
  resolveComponent: (componentType) => {
    // Default adapter just returns the component as-is
    // Real adapters would map component names to actual components
    return componentType;
  },
  normalizeOnChange: (componentType, onChange) => {
    // Default: try to extract value from event if it looks like one
    return (eventOrValue: any) => {
      if (eventOrValue?.target !== undefined) {
        // Looks like an event
        const target = eventOrValue.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        onChange(value);
      } else {
        // Direct value
        onChange(eventOrValue);
      }
    };
  },
};

// =============================================================================
// HELPER: CREATE CUSTOM ADAPTER
// =============================================================================

/**
 * Create a custom UI adapter by extending the default.
 *
 * @example
 * ```typescript
 * const myAdapter = createAdapter({
 *   name: "my-ui",
 *   layout: {
 *     Row: MyRow, // Override just Row
 *     // Others inherit from default
 *   },
 *   components: {
 *     TextField: { component: MyTextField },
 *   },
 * });
 * ```
 */
export function createAdapter(config: Partial<UIAdapter> & { name: string }): UIAdapter {
  return {
    ...defaultAdapter,
    ...config,
    layout: {
      ...defaultLayoutAdapter,
      ...config.layout,
    },
    components: {
      ...defaultAdapter.components,
      ...config.components,
    },
  };
}
