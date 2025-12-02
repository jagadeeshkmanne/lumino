/**
 * Lumino Framework - Base Layout Adapter
 *
 * Abstract base implementations for layout components.
 * UI-specific adapters extend these with their own styling.
 */

import React, { ReactNode } from "react";
import type {
  LayoutAdapter,
  RowLayoutProps,
  ColumnLayoutProps,
  SectionLayoutProps,
  FormLayoutProps,
  FieldWrapperProps,
} from "../../../core/types/ui";
import { lumCss } from "../../../core/types/ui";

// =============================================================================
// STYLE PROVIDERS - Override in specific adapters
// =============================================================================

/**
 * Style provider interface for layout components.
 * Adapters implement this to provide their own styles.
 */
export interface LayoutStyleProvider {
  /** Get row container styles */
  getRowStyle(props: RowLayoutProps): React.CSSProperties;
  /** Get column item styles */
  getColumnStyle(props: ColumnLayoutProps): React.CSSProperties;
  /** Get section container styles */
  getSectionStyle(props: SectionLayoutProps): React.CSSProperties;
  /** Get section header styles */
  getSectionHeaderStyle(props: SectionLayoutProps): React.CSSProperties;
  /** Get section content styles */
  getSectionContentStyle(props: SectionLayoutProps): React.CSSProperties;
  /** Get form styles */
  getFormStyle(props: FormLayoutProps): React.CSSProperties;
  /** Get field wrapper styles */
  getFieldWrapperStyle(props: FieldWrapperProps): React.CSSProperties;
  /** Get field label styles */
  getFieldLabelStyle(props: FieldWrapperProps): React.CSSProperties;
  /** Get field error styles */
  getFieldErrorStyle(props: FieldWrapperProps): React.CSSProperties;
  /** Get field help text styles */
  getFieldHelpStyle(props: FieldWrapperProps): React.CSSProperties;
}

// =============================================================================
// DEFAULT STYLE PROVIDER
// =============================================================================

/**
 * Default style provider with basic CSS styles.
 * Override specific methods in UI-specific adapters.
 */
export const defaultLayoutStyles: LayoutStyleProvider = {
  getRowStyle: ({ gap = 16 }) => ({
    display: "flex",
    flexDirection: "row",
    gap: typeof gap === "number" ? `${gap}px` : gap,
  }),

  getColumnStyle: ({ span }) => ({
    flexGrow: span,
    flexBasis: 0,
    minWidth: 0,
  }),

  getSectionStyle: () => ({
    marginBottom: "24px",
  }),

  getSectionHeaderStyle: ({ collapsible }) => ({
    cursor: collapsible ? "pointer" : "default",
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e0e0e0",
    userSelect: collapsible ? "none" : "auto",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),

  getSectionContentStyle: ({ rowGap = 16 }) => ({
    display: "flex",
    flexDirection: "column",
    gap: typeof rowGap === "number" ? `${rowGap}px` : rowGap,
  }),

  getFormStyle: () => ({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }),

  getFieldWrapperStyle: () => ({}),

  getFieldLabelStyle: ({ required }) => ({
    display: "block",
    marginBottom: "4px",
    fontSize: "14px",
    fontWeight: 500,
  }),

  getFieldErrorStyle: () => ({
    display: "block",
    marginTop: "4px",
    fontSize: "12px",
    color: "#d32f2f",
  }),

  getFieldHelpStyle: () => ({
    display: "block",
    marginTop: "4px",
    fontSize: "12px",
    color: "#666",
  }),
};

// =============================================================================
// BASE ROW COMPONENT
// =============================================================================

export interface BaseRowProps extends RowLayoutProps {
  styles?: LayoutStyleProvider;
}

/**
 * Base Row component - distributes children in a flex row.
 * Handles layout logic, delegates styling to provider.
 */
export function BaseRow({
  children,
  layout,
  gap = 16,
  columns = 12,
  className,
  rowIndex = 0,
  styles = defaultLayoutStyles,
}: BaseRowProps) {
  const rowStyle = styles.getRowStyle({ children, layout, gap, columns, className, rowIndex });

  return (
    <div
      className={`${lumCss.row(rowIndex)} ${className || ""}`.trim()}
      style={rowStyle}
    >
      {React.Children.map(children, (child, index) => {
        const span = layout?.[index] ?? 1;
        const columnStyle = styles.getColumnStyle({
          children: child,
          span,
          totalColumns: columns,
          columnIndex: index,
        });
        return (
          <div style={columnStyle}>
            {child}
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// BASE COLUMN COMPONENT
// =============================================================================

export interface BaseColumnProps extends ColumnLayoutProps {
  styles?: LayoutStyleProvider;
}

/**
 * Base Column component - sized container within a row.
 */
export function BaseColumn({
  children,
  span,
  totalColumns = 12,
  className,
  columnIndex = 0,
  styles = defaultLayoutStyles,
}: BaseColumnProps) {
  const columnStyle = styles.getColumnStyle({ children, span, totalColumns, className, columnIndex });

  return (
    <div
      className={`${lumCss.column(columnIndex)} ${className || ""}`.trim()}
      style={columnStyle}
    >
      {children}
    </div>
  );
}

// =============================================================================
// BASE SECTION COMPONENT
// =============================================================================

export interface BaseSectionProps extends SectionLayoutProps {
  styles?: LayoutStyleProvider;
  /** Custom collapse icon */
  collapseIcon?: (collapsed: boolean) => ReactNode;
}

/**
 * Base Section component - collapsible container with title.
 * Handles collapse logic, delegates styling to provider.
 */
export function BaseSection({
  children,
  title,
  id,
  collapsible,
  collapsed,
  onToggle,
  rowGap = 16,
  headerActions,
  className,
  styles = defaultLayoutStyles,
  collapseIcon = (collapsed) => collapsed ? "▶" : "▼",
}: BaseSectionProps) {
  const sectionClass = title ? lumCss.section(title) : "lum-section";
  const sectionStyle = styles.getSectionStyle({ children, title, id, collapsible, collapsed, onToggle, rowGap, headerActions, className });
  const headerStyle = styles.getSectionHeaderStyle({ children, title, id, collapsible, collapsed, onToggle, rowGap, headerActions, className });
  const contentStyle = styles.getSectionContentStyle({ children, title, id, collapsible, collapsed, onToggle, rowGap, headerActions, className });

  return (
    <div
      className={`${sectionClass} ${className || ""}`.trim()}
      style={sectionStyle}
    >
      {title && (
        <div
          onClick={collapsible ? onToggle : undefined}
          style={headerStyle}
        >
          {collapsible && (
            <span style={{ transition: "transform 0.2s" }}>
              {collapseIcon(!!collapsed)}
            </span>
          )}
          <span>{title}</span>
          {headerActions && (
            <div style={{ marginLeft: "auto" }} onClick={(e) => e.stopPropagation()}>
              {headerActions}
            </div>
          )}
        </div>
      )}
      {!collapsed && (
        <div style={contentStyle}>
          {children}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// BASE FORM COMPONENT
// =============================================================================

export interface BaseFormProps extends FormLayoutProps {
  styles?: LayoutStyleProvider;
}

/**
 * Base Form component - form element with layout.
 */
export function BaseForm({
  children,
  formId,
  onSubmit,
  className,
  styles = defaultLayoutStyles,
}: BaseFormProps) {
  const formStyle = styles.getFormStyle({ children, formId, onSubmit, className });

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className={`${lumCss.form(formId)} ${className || ""}`.trim()}
      style={formStyle}
    >
      {children}
    </form>
  );
}

// =============================================================================
// BASE FIELD WRAPPER COMPONENT
// =============================================================================

export interface BaseFieldWrapperProps extends FieldWrapperProps {
  styles?: LayoutStyleProvider;
  /** Custom required indicator */
  requiredIndicator?: ReactNode;
}

/**
 * Base Field Wrapper component - wraps field with label, error, help.
 * Handles accessibility, delegates styling to provider.
 */
export function BaseFieldWrapper({
  children,
  name,
  label,
  error,
  required,
  helpText,
  labelPosition = "top",
  className,
  styles = defaultLayoutStyles,
  requiredIndicator = <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>,
}: BaseFieldWrapperProps) {
  const fieldClass = lumCss.field(name);
  const errorClass = error ? lumCss.fieldError : "";
  const requiredClass = required ? lumCss.fieldRequired : "";

  const wrapperStyle = styles.getFieldWrapperStyle({ children, name, label, error, required, helpText, labelPosition, className });
  const labelStyle = styles.getFieldLabelStyle({ children, name, label, error, required, helpText, labelPosition, className });
  const errorStyle = styles.getFieldErrorStyle({ children, name, label, error, required, helpText, labelPosition, className });
  const helpStyle = styles.getFieldHelpStyle({ children, name, label, error, required, helpText, labelPosition, className });

  return (
    <div
      className={`${fieldClass} ${errorClass} ${requiredClass} ${className || ""}`.trim()}
      style={wrapperStyle}
      data-validation-status={error ? "error" : undefined}
    >
      {label && (
        <label htmlFor={name} style={labelStyle}>
          {label}
          {required && requiredIndicator}
        </label>
      )}
      {children}
      {error && <span style={errorStyle}>{error}</span>}
      {helpText && !error && <span style={helpStyle}>{helpText}</span>}
    </div>
  );
}

// =============================================================================
// CREATE LAYOUT ADAPTER HELPER
// =============================================================================

/**
 * Create a layout adapter with custom styles.
 * Provides base components with injected style provider.
 */
export function createLayoutAdapter(styles: Partial<LayoutStyleProvider> = {}): LayoutAdapter {
  const mergedStyles: LayoutStyleProvider = { ...defaultLayoutStyles, ...styles };

  return {
    Row: (props) => <BaseRow {...props} styles={mergedStyles} />,
    Column: (props) => <BaseColumn {...props} styles={mergedStyles} />,
    Section: (props) => <BaseSection {...props} styles={mergedStyles} />,
    Form: (props) => <BaseForm {...props} styles={mergedStyles} />,
    FieldWrapper: (props) => <BaseFieldWrapper {...props} styles={mergedStyles} />,
  };
}

