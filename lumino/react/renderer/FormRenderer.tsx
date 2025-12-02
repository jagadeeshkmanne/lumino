/**
 * Lumino Framework - Form Renderer
 *
 * Renders a Form configuration using registered UI components.
 * UI-library independent - uses component registry for actual rendering.
 *
 * Uses Lumino.ui() adapter for layout components.
 * Falls back to default CSS Grid layout if no adapter is set.
 */

import React, { useMemo, useCallback, ReactNode, useState, useEffect } from "react";
import type { Form } from "../../core/form/Form";
import type { FormContext } from "../../core/types/context";
import type {
  FieldConfig,
  RowConfig,
  SectionConfig,
  FormConfig,
  BuiltListConfig,
  BuiltObjectConfig,
  FormTabsConfig,
  FormTabConfig,
} from "../../core/types/form";
import { useForm, UseFormReturn } from "../hooks/useForm";
import { getApp } from "../../core/app/LuminoApp";
import { Lumino } from "../../core/Lumino";
import { lumCss } from "../../core/types/ui";
import { evaluateVisibility } from "../../core/utils/visibility";
import { ApiRegistry, isApiRef } from "../../core/registry/ApiRegistry";
import { useDialog, DialogRenderer } from "./DialogRenderer";
import { createDialog } from "../../core/containers/Dialog";
import { ListContainerRenderer } from "./ContainerRenderer";
import { saltContainerComponents } from "../../adapters/salt/components";

// =============================================================================
// COMPONENT REGISTRY
// =============================================================================

export type ComponentResolver = (componentType: any) => React.ComponentType<any> | null;

/**
 * Get resolved component using app.resolveComponent()
 */
export function resolveComponent(componentType: any): React.ComponentType<any> | null {
  try {
    const app = getApp();
    return app.resolveComponent(componentType);
  } catch {
    // App not initialized, return component as-is
    return componentType;
  }
}

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

export interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export interface RowLayoutProps extends LayoutProps {
  layout?: number[];
  columns?: number;
  gap?: number;
  rowIndex?: number;
}

export interface SectionLayoutProps extends LayoutProps {
  title: string | React.ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  rowGap?: number;
}

export interface FormLayoutProps extends LayoutProps {
  formId?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

// =============================================================================
// DEFAULT HTML LAYOUT COMPONENTS (no UI library dependency)
// =============================================================================

const DefaultFormLayout = ({ children, formId, onSubmit, className }: FormLayoutProps) => (
  <form
    id={formId}
    className={`lum-form ${formId ? `lum-form--${formId}` : ""} ${className || ""}`.trim()}
    onSubmit={onSubmit}
  >
    {children}
  </form>
);

const DefaultSectionLayout = ({ children, title, collapsible, collapsed, onToggle, className }: SectionLayoutProps) => (
  <div className={`lum-section ${className || ""}`.trim()}>
    <div
      className="lum-section__header"
      onClick={collapsible ? onToggle : undefined}
      style={{ cursor: collapsible ? "pointer" : "default" }}
    >
      <h3 className="lum-section__title">{title}</h3>
      {collapsible && <span className="lum-section__toggle">{collapsed ? "▶" : "▼"}</span>}
    </div>
    {!collapsed && <div className="lum-section__content">{children}</div>}
  </div>
);

const DefaultRowLayout = ({ children, columns = 12, gap = 16, className }: RowLayoutProps) => (
  <div
    className={`lum-row ${className || ""}`.trim()}
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: `${gap}px`,
    }}
  >
    {children}
  </div>
);

const DefaultColumnLayout = ({ children, span, className }: { children: ReactNode; span: number; className?: string }) => (
  <div className={className} style={{ gridColumn: `span ${span}` }}>
    {children}
  </div>
);

const DefaultFieldWrapper = ({ children, label, error, required, className }: { children: ReactNode; label?: string; error?: string; required?: boolean; className?: string }) => (
  <div className={`lum-field-wrapper ${error ? "lum-field-wrapper--error" : ""} ${className || ""}`.trim()}>
    {label && (
      <label className="lum-field-wrapper__label">
        {label}
        {required && <span className="lum-field-wrapper__required">*</span>}
      </label>
    )}
    {children}
    {error && <span className="lum-field-wrapper__error">{error}</span>}
  </div>
);

const DefaultErrorMessage = ({ errors, className }: { errors: string[]; className?: string }) => {
  if (!errors || errors.length === 0) return null;
  return (
    <div className={`${lumCss.fieldError} ${className || ""}`.trim()} style={{ marginTop: 8 }}>
      {errors.map((error, idx) => (
        <span key={idx} style={{ display: 'block' }}>{error}</span>
      ))}
    </div>
  );
};

/**
 * Get layout components from Lumino.ui() adapter or HTML defaults
 */
function getLayoutComponents() {
  const adapter = Lumino.ui.get();
  const layout = adapter?.layout;

  return {
    Form: layout?.Form || DefaultFormLayout,
    Section: layout?.Section || DefaultSectionLayout,
    Row: layout?.Row || DefaultRowLayout,
    Column: layout?.Column || DefaultColumnLayout,
    FieldWrapper: layout?.FieldWrapper || DefaultFieldWrapper,
    ErrorMessage: layout?.ErrorMessage || DefaultErrorMessage,
  };
}

/**
 * Resolve dynamic CSS class - handles both static string and function
 */
function resolveCssClass(
  cssClass: string | ((ctx: FormContext) => string) | undefined,
  context: FormContext
): string {
  if (!cssClass) return "";
  return typeof cssClass === "function" ? cssClass(context) : cssClass;
}

/**
 * Resolve dynamic style - handles both static object and function
 */
function resolveStyle(
  style: React.CSSProperties | ((ctx: FormContext) => React.CSSProperties) | undefined,
  context: FormContext
): React.CSSProperties {
  if (!style) return {};
  return typeof style === "function" ? style(context) : style;
}

// =============================================================================
// FIELD RENDERER
// =============================================================================

export interface FieldRendererProps {
  field: FieldConfig;
  form: UseFormReturn<any>;
  context: FormContext;
  /** Column span (from row layout) */
  span?: number;
  /** Field index in row */
  fieldIndex?: number;
}

/**
 * Renders a single field
 */
export function FieldRenderer({ field, form, context, span, fieldIndex = 0 }: FieldRendererProps) {
  const { name, component, label, placeholder, props: fieldProps, colSpan, groupId, margin, padding, cssClass, wrapper, lookup, display } = field;
  const layouts = getLayoutComponents();

  // Get value early for display-only fields
  const value = form.getValue(name);

  // Handle display-only fields (no input component, just show value)
  if (display) {
    const effectiveSpan = colSpan || span;
    const displayValue = value !== undefined && value !== null && value !== '' ? String(value) : '—';

    const displayCssClass = resolveCssClass(cssClass, context);
    const displayStyle = resolveStyle(field.style, context);
    const displayContent = (
      <div className={`lum-field-display ${displayCssClass}`} style={displayStyle}>
        {label && <div className="lum-field-display__label" style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{label}</div>}
        <div className="lum-field-display__value" style={{ fontSize: 14 }}>{displayValue}</div>
      </div>
    );

    // Wrap in Column if adapter provides one and we have a span
    if (layouts.Column && effectiveSpan) {
      return (
        <layouts.Column span={effectiveSpan}>
          {displayContent}
        </layouts.Column>
      );
    }

    return displayContent;
  }

  // State for lookup options
  const [lookupOptions, setLookupOptions] = useState<any[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Helper to build full URL with base URL
  const buildFullUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Get base URL from context.config (ConfigContext has baseUrl)
    const baseUrl = context.config?.baseUrl || '';
    return `${baseUrl.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Fetch lookup options
  useEffect(() => {
    if (lookup && lookup.api) {
      const fetchOptions = async () => {
        setLookupLoading(true);
        try {
          // The api can be:
          // 1. A function that returns a promise of options
          // 2. A BuiltApi (has config property) - need to fetch directly
          // 3. An object with a list() method (LookupApi instance)
          // 4. A string reference to an API (e.g., "CountriesApi.list")
          let options: any[] = [];
          let api = lookup.api;

          // Handle ApiRef (type-safe reference) or string-based API reference
          if (isApiRef(api)) {
            // ApiRef - use the ref string to resolve
            const [groupName, apiName] = api.ref.split('.');
            if (groupName && apiName) {
              const resolvedApi = ApiRegistry.get(groupName, apiName);
              if (resolvedApi) {
                api = resolvedApi;
              } else {
                console.warn(`API "${api.ref}" not found in registry. Make sure it's registered via app.apis()`);
              }
            }
          } else if (typeof api === 'string') {
            // String-based API reference (e.g., "CountriesApi.list")
            const [groupName, apiName] = api.split('.');
            if (groupName && apiName) {
              const resolvedApi = ApiRegistry.get(groupName, apiName);
              if (resolvedApi) {
                api = resolvedApi;
              } else {
                console.warn(`API "${api}" not found in registry. Make sure it's registered via app.apis()`);
              }
            }
          }

          if (typeof api === 'function') {
            options = await api();
          } else if (typeof api === 'object' && api !== null) {
            // Check if it's a BuiltApi (has config property) - need to execute it
            if ('config' in api && (api as any).config) {
              // It's a BuiltApi - fetch directly using the URL from config
              const builtApi = api as any;
              if (builtApi.config && builtApi.config.url) {
                const fullUrl = buildFullUrl(builtApi.config.url);
                const response = await fetch(fullUrl);
                options = await response.json();
              }
            } else if (typeof (api as any).list === 'function') {
              // LookupApi instance with list method - but list is also a BuiltApi
              const listApi = (api as any).list;
              if (listApi && listApi.config && listApi.config.url) {
                const fullUrl = buildFullUrl(listApi.config.url);
                const response = await fetch(fullUrl);
                options = await response.json();
              }
            }
          }

          // Transform options using labelHandler and valueHandler
          const transformedOptions = options.map((opt: any) => {
            // Both handlers are required - explicit and flexible
            const label = lookup.labelHandler ? lookup.labelHandler(opt) : String(opt);
            const value = lookup.valueHandler ? lookup.valueHandler(opt) : opt;
            return {
              value,
              label,
              data: opt,
            };
          });

          setLookupOptions(transformedOptions);
        } catch (error) {
          console.error(`Failed to fetch lookup options for field "${name}":`, error);
        } finally {
          setLookupLoading(false);
        }
      };
      fetchOptions();
    }
  }, [lookup, name, context]);

  // Check visibility using new visibility config
  const visibilityResult = useMemo(() => {
    return evaluateVisibility(field.visibility, context);
  }, [field.visibility, context]);

  // Check if field's group/section is visible
  const sectionVisible = groupId ? !form.isSectionHidden(groupId) : true;

  // Check disabled - must be called before early return to maintain hook order
  const disabled = useMemo(() => {
    if (form.readOnly) return true;
    if (typeof field.disable === "function") {
      return field.disable(context);
    }
    return field.disable === true || form.isFieldDisabled(name);
  }, [field.disable, context, form, name]);

  // Check read-only - must be called before early return to maintain hook order
  const readOnly = useMemo(() => {
    if (typeof field.readOnly === "function") {
      return field.readOnly(context);
    }
    return field.readOnly === true || form.readOnly;
  }, [field.readOnly, context, form]);

  // Compute props - must be called before early return to maintain hook order
  const computedProps = useMemo(() => {
    if (typeof fieldProps === "function") {
      return fieldProps(context);
    }
    return fieldProps || {};
  }, [fieldProps, context]);

  // Get normalized onChange handler - must be called before early return to maintain hook order
  const handleChange = useCallback(
    (eventOrValue: any) => {
      // Use adapter's normalizer if available
      const normalizedHandler = Lumino.ui.normalizeOnChange(component, (val: any) => {
        form.setValue(name, val);
      });
      normalizedHandler(eventOrValue);
    },
    [form, name, component]
  );

  const handleBlur = useCallback(() => {
    form.touchField(name);
  }, [form, name]);

  // Early return for hidden fields - AFTER all hooks are called
  if (!visibilityResult.isVisible || !sectionVisible) {
    return null;
  }

  // Resolve component
  const Component = resolveComponent(component);
  if (!Component) {
    console.warn(`No component found for field "${name}"`);
    return null;
  }

  // Field error (value already retrieved above for display check)
  const error = form.getFieldError(name);
  const errors = form.getFieldErrors(name);

  // Determine column span: explicit colSpan > layout span > default
  const effectiveSpan = colSpan || span;

  // Merge options: lookup options take precedence over props options
  const finalOptions = lookupOptions.length > 0 ? lookupOptions : computedProps.options;

  // Common props for the component
  const commonProps = {
    name,
    label,
    placeholder,
    value,
    error,
    errors,
    disabled,
    readOnly,
    onChange: handleChange,
    onBlur: handleBlur,
    ...computedProps,
    // Override options with lookup options if available
    ...(finalOptions && { options: finalOptions }),
    // Add loading state for lookup
    ...(lookupLoading && { loading: true }),
  };

  // CSS class for the field (resolve dynamic cssClass)
  const fieldClass = lumCss.field(name);
  const errorClass = error ? ` ${lumCss.fieldError}` : "";
  const disabledClass = disabled ? ` ${lumCss.fieldDisabled}` : "";
  const resolvedCssClass = resolveCssClass(cssClass, context);
  const customClass = resolvedCssClass ? ` ${resolvedCssClass}` : "";
  const fullClassName = `${fieldClass}${errorClass}${disabledClass}${customClass}`;

  // Resolve dynamic inline style
  const resolvedStyle = resolveStyle(field.style, context);

  // Build spacing style (merge with dynamic inline style)
  const spacingStyle = { ...buildSpacingStyle(margin, padding), ...resolvedStyle };
  const hasSpacing = Object.keys(spacingStyle).length > 0;

  // Render the component
  let content = <Component {...commonProps} />;

  // Check if component renders its own inline label (single Checkbox, Switch only)
  // These components should not be wrapped with FieldWrapper's label
  // But CheckboxGroup, RadioGroup, etc. SHOULD have the FieldWrapper label
  const componentName = (component as any)?.displayName || component?.name || '';

  // Components that render their own inline label (single selection only)
  // We need to check if the component name matches single Checkbox/Switch
  // and explicitly exclude group components
  const isSingleCheckbox = componentName.includes('Checkbox') && !componentName.includes('Group');
  const isSingleSwitch = componentName.includes('Switch') && !componentName.includes('Group');
  const isGroupComponent = componentName.includes('Group') || componentName.includes('Radio');

  // Skip FieldWrapper label only for single checkbox/switch, NOT for groups
  const hasInlineLabel = (isSingleCheckbox || isSingleSwitch) && !isGroupComponent;

  // Wrap with FieldWrapper if available (provides label, error, helpText)
  // For inline-label components (Checkbox, Switch), only show error/helpText, not the label
  if (layouts.FieldWrapper) {
    const helpText = field.helpText || (typeof computedProps.helpText === 'string' ? computedProps.helpText : undefined);
    const isRequired = field.rules?.some((r: any) => r.type === 'required' || r.required);

    content = (
      <layouts.FieldWrapper
        name={name}
        label={hasInlineLabel ? undefined : label}
        error={error}
        required={isRequired}
        helpText={helpText}
      >
        {content}
      </layouts.FieldWrapper>
    );
  }

  // Wrap with custom wrapper if provided
  if (wrapper) {
    const WrapperComponent = resolveComponent(wrapper);
    if (WrapperComponent) {
      content = <WrapperComponent>{content}</WrapperComponent>;
    }
  }

  // Wrap in Column if adapter provides one and we have a span
  if (layouts.Column && effectiveSpan) {
    const columnContent = hasSpacing ? (
      <div style={spacingStyle}>{content}</div>
    ) : content;

    return (
      <layouts.Column
        span={effectiveSpan}
        columnIndex={fieldIndex}
        className={fullClassName}
      >
        {columnContent}
      </layouts.Column>
    );
  }

  // Legacy: inline style for grid column
  const gridStyle: React.CSSProperties = {
    gridColumn: effectiveSpan ? `span ${effectiveSpan}` : undefined,
    ...spacingStyle,
  };

  return (
    <div className={fullClassName} style={gridStyle}>
      {content}
    </div>
  );
}

// =============================================================================
// ROW RENDERER
// =============================================================================

export interface RowRendererProps {
  row: RowConfig;
  form: UseFormReturn<any>;
  context: FormContext;
  /** Row index for styling */
  rowIndex?: number;
}

/**
 * Helper to build style from SpacingConfig
 */
function buildSpacingStyle(
  margin?: { top?: number; right?: number; bottom?: number; left?: number },
  padding?: { top?: number; right?: number; bottom?: number; left?: number }
): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (margin) {
    if (margin.top) style.marginTop = `${margin.top}px`;
    if (margin.right) style.marginRight = `${margin.right}px`;
    if (margin.bottom) style.marginBottom = `${margin.bottom}px`;
    if (margin.left) style.marginLeft = `${margin.left}px`;
  }
  if (padding) {
    if (padding.top) style.paddingTop = `${padding.top}px`;
    if (padding.right) style.paddingRight = `${padding.right}px`;
    if (padding.bottom) style.paddingBottom = `${padding.bottom}px`;
    if (padding.left) style.paddingLeft = `${padding.left}px`;
  }
  return style;
}

/**
 * Renders a row of fields
 */
export function RowRenderer({ row, form, context, rowIndex = 0 }: RowRendererProps) {
  const { fields, components, layout, columns = 12, gap, margin, padding, cssClass, wrapper } = row;
  const layouts = getLayoutComponents();
  const RowComponent = layouts.Row;

  // Check visibility using new visibility config
  const visibilityResult = useMemo(() => {
    return evaluateVisibility(row.visibility, context);
  }, [row.visibility, context]);

  if (!visibilityResult.isVisible) {
    return null;
  }

  // Total items = fields + components
  const totalItems = fields.length + (components?.length || 0);

  // Calculate spans for each item if no layout provided
  const effectiveLayout = useMemo(() => {
    if (layout && layout.length > 0) {
      return layout;
    }
    // Auto-distribute equally among all items
    if (totalItems === 0) return [];
    const spanPerItem = Math.floor(columns / totalItems);
    return Array(totalItems).fill(spanPerItem);
  }, [layout, totalItems, columns]);

  // Resolve dynamic CSS class and style for row
  const resolvedRowCssClass = resolveCssClass(cssClass, context);
  const resolvedRowStyle = resolveStyle(row.style, context);

  // Build spacing style (merge with dynamic inline style)
  const spacingStyle = { ...buildSpacingStyle(margin, padding), ...resolvedRowStyle };
  const hasSpacing = Object.keys(spacingStyle).length > 0;

  // Render a standalone component
  const renderComponent = (comp: any, index: number) => {
    const ComponentToRender = comp.component;
    if (!ComponentToRender) return null;

    // Check component visibility
    const compVisibility = evaluateVisibility(comp.visibility, context);
    if (!compVisibility.isVisible) return null;

    // Resolve props (static or function)
    const resolvedProps = typeof comp.props === "function"
      ? comp.props(context)
      : comp.props || {};

    // Handle onClick - wrap to pass context
    const handleClick = comp.onClick
      ? () => comp.onClick(context)
      : undefined;

    // Resolve dynamic CSS class and style for component
    const compCssClass = resolveCssClass(comp.cssClass, context);
    const compStyle = resolveStyle(comp.style, context);

    return (
      <div key={`comp-${index}`} className={compCssClass} style={compStyle}>
        <ComponentToRender {...resolvedProps} onClick={handleClick}>
          {comp.children}
        </ComponentToRender>
      </div>
    );
  };

  const rowContent = (
    <RowComponent
      layout={effectiveLayout}
      columns={columns}
      gap={gap}
      rowIndex={rowIndex}
      className={resolvedRowCssClass}
      style={hasSpacing ? spacingStyle : undefined}
    >
      {/* Render fields */}
      {fields.map((field, index) => (
        <FieldRenderer
          key={field.name}
          field={field}
          form={form}
          context={context}
          span={effectiveLayout[index]}
          fieldIndex={index}
        />
      ))}
      {/* Render standalone components */}
      {components?.map((comp, index) => renderComponent(comp, index))}
    </RowComponent>
  );

  // Wrap with custom wrapper if provided
  let content = rowContent;
  if (wrapper) {
    const WrapperComponent = resolveComponent(wrapper);
    if (WrapperComponent) {
      content = <WrapperComponent>{rowContent}</WrapperComponent>;
    }
  }

  // Apply spacing if needed
  if (hasSpacing) {
    return <div style={spacingStyle}>{content}</div>;
  }

  return content;
}

// =============================================================================
// SECTION RENDERER
// =============================================================================

export interface SectionRendererProps {
  section: SectionConfig;
  form: UseFormReturn<any>;
  context: FormContext;
}

/**
 * Renders a form section
 */
export function SectionRenderer({ section, form, context }: SectionRendererProps) {
  const { title, rows, collapsible, collapsed: initialCollapsed, gap, margin, padding, cssClass, wrapper, headerComponents, headerRow } = section;
  const [collapsed, setCollapsed] = React.useState(initialCollapsed || false);
  const layouts = getLayoutComponents();
  const SectionComponent = layouts.Section;
  const RowComponent = layouts.Row;

  // Check visibility using new visibility config
  const visibilityResult = useMemo(() => {
    return evaluateVisibility(section.visibility, context);
  }, [section.visibility, context]);

  // useCallback must be called before early return to maintain hook order
  const handleToggle = useCallback(() => {
    if (collapsible) {
      setCollapsed((prev) => !prev);
    }
  }, [collapsible]);

  // Early return for hidden sections - AFTER all hooks are called
  if (!visibilityResult.isVisible) {
    return null;
  }

  // Resolve dynamic CSS class and style for section
  const resolvedSectionCssClass = resolveCssClass(cssClass, context);
  const resolvedSectionStyle = resolveStyle(section.style, context);

  // Build spacing style (merge with dynamic inline style)
  const spacingStyle = { ...buildSpacingStyle(margin, padding), ...resolvedSectionStyle };
  const hasSpacing = Object.keys(spacingStyle).length > 0;

  // Render a single header component
  const renderHeaderComponent = (comp: any, index: number) => {
    const ComponentToRender = comp.component;
    if (!ComponentToRender) return null;

    // Check component visibility
    const compVisibility = evaluateVisibility(comp.visibility, context);
    if (!compVisibility.isVisible) return null;

    // Resolve props (static or function)
    const resolvedProps = typeof comp.props === "function"
      ? comp.props(context)
      : comp.props || {};

    // Handle onClick - wrap to pass context
    const handleClick = comp.onClick
      ? () => comp.onClick(context)
      : undefined;

    return (
      <ComponentToRender key={`header-comp-${index}`} {...resolvedProps} onClick={handleClick}>
        {comp.children}
      </ComponentToRender>
    );
  };

  // Determine header content based on configuration
  let headerContent: string | React.ReactNode = title;

  // Priority 1: headerRow with full layout control
  if (headerRow && headerRow.components && headerRow.components.length > 0) {
    const layout = headerRow.layout || [];
    const totalComponents = headerRow.components.length + 1; // +1 for title
    const columns = headerRow.columns || 12;

    // If no layout specified, distribute equally
    const effectiveLayout = layout.length > 0
      ? layout
      : Array(totalComponents).fill(Math.floor(columns / totalComponents));

    headerContent = (
      <RowComponent
        layout={effectiveLayout}
        columns={columns}
        gap={headerRow.gap}
        rowIndex={0}
        className={headerRow.cssClass}
        style={{ alignItems: "center" }}
      >
        {/* Title as first column */}
        <span>{title}</span>
        {/* Components as additional columns */}
        {headerRow.components.map((comp, index) => (
          <div key={`header-col-${index}`} style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {renderHeaderComponent(comp, index)}
          </div>
        ))}
      </RowComponent>
    );
  }
  // Priority 2: Simple headerComponents (right side of title)
  else if (headerComponents && headerComponents.length > 0) {
    headerContent = (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <span>{title}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {headerComponents.map((comp, index) => renderHeaderComponent(comp, index))}
        </div>
      </div>
    );
  }

  const sectionContent = (
    <SectionComponent
      title={headerContent}
      collapsible={collapsible}
      collapsed={collapsed}
      onToggle={handleToggle}
      rowGap={gap}
      className={resolvedSectionCssClass}
      style={hasSpacing ? spacingStyle : undefined}
    >
      {rows.map((row, index) => (
        <RowRenderer key={index} row={row} form={form} context={context} rowIndex={index} />
      ))}
    </SectionComponent>
  );

  // Wrap with custom wrapper if provided
  let content = sectionContent;
  if (wrapper) {
    const WrapperComponent = resolveComponent(wrapper);
    if (WrapperComponent) {
      content = <WrapperComponent>{sectionContent}</WrapperComponent>;
    }
  }

  // Apply spacing if needed
  if (hasSpacing) {
    return <div style={spacingStyle}>{content}</div>;
  }

  return content;
}

// =============================================================================
// OBJECT RENDERER
// =============================================================================

export interface ObjectRendererProps {
  /** Object configuration */
  config: BuiltObjectConfig;
  /** Parent path (for nested objects) */
  parentPath?: string;
  /** Form state */
  form: UseFormReturn<any>;
  /** Form context */
  context: FormContext;
}

/**
 * Renders a nested object structure
 */
export function ObjectRenderer({ config, parentPath = "", form, context }: ObjectRendererProps) {
  const { id, rows, title, collapsible, collapsed: initialCollapsed, visibility, cssClass, wrapper } = config;
  const [collapsed, setCollapsed] = useState(initialCollapsed || false);
  const layouts = getLayoutComponents();
  const SectionComponent = layouts.Section;

  // Check visibility
  const visibilityResult = useMemo(() => {
    return evaluateVisibility(visibility, context);
  }, [visibility, context]);

  if (!visibilityResult.isVisible) {
    return null;
  }

  const objectPath = parentPath ? `${parentPath}.${id}` : id;

  const handleToggle = useCallback(() => {
    if (collapsible) {
      setCollapsed((prev) => !prev);
    }
  }, [collapsible]);

  // Create a scoped context for this object
  const scopedForm = useMemo(() => {
    return {
      ...form,
      getValue: (name: string) => form.getValue(`${objectPath}.${name}`),
      setValue: (name: string, value: any) => form.setValue(`${objectPath}.${name}`, value),
      getFieldError: (name: string) => form.getFieldError(`${objectPath}.${name}`),
      getFieldErrors: (name: string) => form.getFieldErrors(`${objectPath}.${name}`),
      touchField: (name: string) => form.touchField(`${objectPath}.${name}`),
    };
  }, [form, objectPath]);

  const objectContent = (
    <SectionComponent
      title={title || id}
      collapsible={collapsible}
      collapsed={collapsed}
      onToggle={handleToggle}
      className={`${lumCss.object(id)}${cssClass ? ` ${cssClass}` : ""}`}
    >
      {rows.map((row, index) => (
        <RowRenderer
          key={index}
          row={row}
          form={scopedForm}
          context={context}
          rowIndex={index}
        />
      ))}
    </SectionComponent>
  );

  // Wrap with custom wrapper if provided
  if (wrapper) {
    const WrapperComponent = resolveComponent(wrapper);
    if (WrapperComponent) {
      return <WrapperComponent>{objectContent}</WrapperComponent>;
    }
  }

  return objectContent;
}

// =============================================================================
// LIST EDIT DIALOG HOOK
// Shared hook for dialog-based add/edit in lists
// =============================================================================

interface UseListEditDialogOptions {
  id: string;
  items: any[];
  listOps: {
    add: (item: any) => number;
    remove: (index: number) => void;
    set: (index: number, item: any) => void;
  };
  editFormClass: new (...args: any[]) => any;
  entityClass?: new () => any;
  context: FormContext;
}

function useListEditDialog({
  id,
  items,
  listOps,
  editFormClass,
  entityClass,
  context,
}: UseListEditDialogOptions) {
  const dialog = useDialog();
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const formDataRef = React.useRef<any>(entityClass ? new entityClass() : {});

  // Open dialog for adding new item
  const openAdd = React.useCallback(() => {
    setEditIndex(null);
    formDataRef.current = entityClass ? new entityClass() : {};
    dialog.open();
  }, [dialog, entityClass]);

  // Open dialog for editing existing item
  const openEdit = React.useCallback((index: number) => {
    setEditIndex(index);
    formDataRef.current = { ...items[index] };
    dialog.open();
  }, [dialog, items]);

  // Handle form value changes from dialog
  const handleFormChange = React.useCallback((values: Record<string, any>) => {
    formDataRef.current = values;
  }, []);

  // Handle save
  const handleSave = React.useCallback(() => {
    if (editIndex !== null) {
      listOps.set(editIndex, formDataRef.current);
    } else {
      listOps.add(formDataRef.current);
    }
    return true; // Close dialog
  }, [editIndex, listOps]);

  // Create dialog config dynamically
  const dialogConfig = React.useMemo(() => createDialog(`${id}-edit-dialog`, (d) => {
    d.title(editIndex !== null ? "Edit" : "Add")
      .size("medium")
      .form(editFormClass, {
        initialValues: formDataRef.current,
        onChange: handleFormChange,
      });

    d.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    d.action("save", "Save")
      .variant("primary")
      .onClick(handleSave)
      .end();
  }), [id, editIndex, editFormClass, handleFormChange, handleSave]);

  // Dialog element to render
  const DialogElement = (
    <DialogRenderer
      config={dialogConfig}
      context={context}
      {...dialog.dialogProps}
    />
  );

  return {
    openAdd,
    openEdit,
    DialogElement,
  };
}


// =============================================================================
// LIST RENDERER
// =============================================================================

export interface ListRendererProps {
  /** List configuration */
  config: BuiltListConfig;
  /** Parent path (for nested lists) */
  parentPath?: string;
  /** Form state */
  form: UseFormReturn<any>;
  /** Form context */
  context: FormContext;
}

/**
 * Renders a list/array of items
 * Supports different display modes: Rows, Tabs, Table, Cards
 */
export function ListRenderer({ config, parentPath = "", form, context }: ListRendererProps) {
  const {
    id,
    rows,
    min,
    max,
    as: DisplayComponent,
    displayProps: displayPropsConfig,
    defaults,
    actions,
    tabLabel,
    tableColumns,
    visibility,
    cssClass,
    wrapper,
    entityClass,
  } = config;

  // Resolve displayProps - can be static object or function
  const displayProps = useMemo(() => {
    if (typeof displayPropsConfig === "function") {
      return displayPropsConfig(context);
    }
    return displayPropsConfig || {};
  }, [displayPropsConfig, context]);

  const listPath = parentPath ? `${parentPath}.${id}` : id;
  const items: any[] = form.getValue(listPath) || [];

  const [activeTab, setActiveTabState] = useState(0);
  const layouts = getLayoutComponents();

  // Track previous items length to detect additions
  const prevItemsLengthRef = React.useRef(items.length);

  // Clamp activeTab to valid range when items change
  const effectiveActiveTab = Math.min(activeTab, Math.max(0, items.length - 1));

  // Use a ref to track current active tab for stable callbacks
  // This ref is updated IMMEDIATELY when setActiveTab is called (not just on render)
  const activeTabRef = React.useRef(effectiveActiveTab);

  // Wrapper that updates ref immediately before state
  const setActiveTab = useCallback((index: number) => {
    activeTabRef.current = index;
    setActiveTabState(index);
  }, []);

  // Auto-switch to new tab when items are added
  React.useEffect(() => {
    if (items.length > prevItemsLengthRef.current) {
      // New item(s) added - switch to the last (newly added) tab
      setActiveTab(items.length - 1);
    }
    prevItemsLengthRef.current = items.length;
  }, [items.length, setActiveTab]);

  // Check visibility
  const visibilityResult = useMemo(() => {
    return evaluateVisibility(visibility, context);
  }, [visibility, context]);

  // Get list operations from context (not a hook, but needed by hooks below)
  const listOps = context.list(listPath);

  // All hooks must be called before early return to maintain hook order
  // Determine if actions should be shown
  const canAdd = useMemo(() => {
    if (!actions?.add) return false;
    if (max && items.length >= max) return false;
    if (typeof actions.add.enabled === "function") {
      return actions.add.enabled(context);
    }
    return actions.add.enabled !== false;
  }, [actions?.add, max, items.length, context]);

  const canRemove = useCallback(
    (index: number) => {
      if (!actions?.remove) return false;
      if (min && items.length <= min) return false;
      if (typeof actions.remove.enabled === "function") {
        return actions.remove.enabled(context, index);
      }
      return actions.remove.enabled !== false;
    },
    [actions?.remove, min, items.length, context]
  );

  // Handle add item
  const handleAdd = useCallback(() => {
    // Priority: entityClass > defaults function > defaults object > empty object
    let defaultValue: any;
    if (entityClass) {
      defaultValue = new entityClass();
    } else if (typeof defaults === "function") {
      defaultValue = defaults(context, items.length);
    } else {
      defaultValue = defaults || {};
    }
    listOps.add(defaultValue);
    // Note: useEffect above auto-switches to newly added tab when items.length changes
  }, [listOps, entityClass, defaults, context, items.length]);

  // Handle remove item
  const handleRemove = useCallback(
    (index: number) => {
      if (actions?.remove?.confirm) {
        const message =
          typeof actions.remove.confirm === "string"
            ? actions.remove.confirm
            : "Are you sure you want to remove this item?";
        if (window.confirm(message)) {
          listOps.remove(index);
          if (activeTab >= items.length - 1 && activeTab > 0) {
            setActiveTab(activeTab - 1);
          }
        }
      } else {
        listOps.remove(index);
        if (activeTab >= items.length - 1 && activeTab > 0) {
          setActiveTab(activeTab - 1);
        }
      }
    },
    [listOps, actions?.remove, activeTab, items.length]
  );

  // Handle reorder
  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      listOps.move(fromIndex, toIndex);
      if (activeTab === fromIndex) {
        setActiveTab(toIndex);
      }
    },
    [listOps, activeTab]
  );

  // Create scoped form for each item
  // Note: We include form.values in dependencies to ensure the scoped form
  // is recreated when form values change (needed for tabs mode especially)
  const getScopedForm = useCallback(
    (index: number) => {
      const itemPath = `${listPath}[${index}]`;
      return {
        ...form,
        getValue: (name: string) => form.getValue(`${itemPath}.${name}`),
        setValue: (name: string, value: any) => form.setValue(`${itemPath}.${name}`, value),
        getFieldError: (name: string) => form.getFieldError(`${itemPath}.${name}`),
        getFieldErrors: (name: string) => form.getFieldErrors(`${itemPath}.${name}`),
        touchField: (name: string) => form.touchField(`${itemPath}.${name}`),
      };
    },
    [form, listPath, form.values]
  );

  // Create scoped context for each item (includes list item properties)
  // For tabs mode, removeCurrentItem uses activeTabRef to get the current active tab
  // This ensures the correct tab is removed even if React hasn't re-rendered yet
  const getScopedContext = useCallback(
    (index: number) => {
      return {
        ...context,
        listFieldName: listPath,
        listItemIndex: index,
        // Get just this item's data (used by Edit button to pass to dialog)
        getFormData: () => items[index],
        // Use activeTabRef.current to always get the current active tab
        // This handles the case where user clicks a different tab but the render hasn't completed
        removeCurrentItem: () => {
          listOps.remove(activeTabRef.current);
        },
        // Update this specific item's data
        updateCurrentItem: (data: any) => {
          listOps.set(index, data);
        },
      };
    },
    [context, listPath, listOps, items]
  );

  // Generate tab label
  const getTabLabel = useCallback(
    (item: any, index: number) => {
      if (typeof tabLabel === "function") {
        return tabLabel(item, index, context);
      }
      if (typeof tabLabel === "string") {
        return item[tabLabel] || `Item ${index + 1}`;
      }
      return `Item ${index + 1}`;
    },
    [tabLabel, context]
  );

  // ==========================================================================
  // DIALOG-BASED EDITING (when editFormClass is configured)
  // ==========================================================================
  // This hook is called unconditionally (React rules), but only used when editFormClass exists
  const editFormClass = config.editFormClass;
  const dialogHook = useListEditDialog({
    id,
    items,
    listOps,
    editFormClass: editFormClass || class {},  // Dummy class if not configured
    entityClass,
    context,
  });

  // Dialog-aware handlers - use dialog callbacks when editFormClass is configured
  const handleAddWithDialog = useCallback(() => {
    if (editFormClass) {
      dialogHook.openAdd();
    } else {
      handleAdd();
    }
  }, [editFormClass, dialogHook, handleAdd]);

  const handleEditWithDialog = useCallback((index: number) => {
    if (editFormClass) {
      dialogHook.openEdit(index);
    }
    // If no editFormClass, there's no edit action (inline editing via tabs/rows)
  }, [editFormClass, dialogHook]);

  // Add button component - uses dialog-aware handler when editFormClass is configured
  const AddButton = useMemo(() => {
    if (!canAdd) return null;
    const addConfig = actions?.add;
    const position = addConfig?.position || "bottom";

    // Use dialog handler for add when editFormClass is configured
    const addHandler = editFormClass ? handleAddWithDialog : handleAdd;

    const button = (
      <button
        type="button"
        onClick={addHandler}
        className={lumCss.listAddButton}
      >
        {addConfig?.label || "+ Add"}
      </button>
    );

    if (position === "top" || position === "tabBar") {
      return { top: button, bottom: null };
    }
    return { top: null, bottom: button };
  }, [canAdd, actions?.add, handleAdd, handleAddWithDialog, editFormClass]);

  // Check if rows use the each() pattern (isEachRow flag)
  const hasEachRows = useMemo(() => {
    return rows.some((row) => row.isEachRow);
  }, [rows]);

  // Get eachRows (rows that should be repeated for each item)
  const eachRows = useMemo(() => {
    return rows.filter((row) => row.isEachRow);
  }, [rows]);

  // Helper to render each() row content for a single item
  const renderEachRowContent = useCallback((index: number) => {
    if (!hasEachRows || eachRows.length === 0) return null;

    return eachRows.map((row, rowIndex) => (
      <RowRenderer
        key={rowIndex}
        row={row}
        form={getScopedForm(index)}
        context={getScopedContext(index)}
        rowIndex={rowIndex}
      />
    ));
  }, [hasEachRows, eachRows, getScopedForm, getScopedContext]);

  // Render based on display mode
  const listContent = useMemo(() => {
    // ===========================================
    // CONTAINER API: Render containers from include()
    // When containers are defined via Component.container() API
    // ===========================================
    if (config.containers && config.containers.length > 0) {
      return (
        <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
          {AddButton?.top}
          {items.length === 0 ? (
            <p style={{ color: "#666", margin: 0 }}>No items yet. Click the button above to add one.</p>
          ) : (
            <ListContainerRenderer
              containers={config.containers}
              context={context}
              items={items}
              listFieldName={listPath}
              adapterComponents={saltContainerComponents}
            />
          )}
          {AddButton?.bottom}
        </div>
      );
    }

    // Get display mode name
    const componentName = DisplayComponent
      ? ((DisplayComponent as any)?.displayName || DisplayComponent.name)
      : null;

    // ===========================================
    // TABLE DISPLAY MODE: .as(Table) with each()
    // ===========================================
    if ((componentName === "Table" || componentName === "LuminoTable") && hasEachRows && eachRows.length > 0) {
      const adapter = Lumino.ui.get();
      const firstRow = eachRows[0];
      const displayFields = firstRow.fields.filter((f: any) => f.display);
      const componentFields = firstRow.components || [];
      const SaltTableComponents = adapter?.lists?.TableComponents;

      if (SaltTableComponents) {
        const { Table, THead, TBody, TR, TH, TD } = SaltTableComponents;

        return (
          <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
            {AddButton?.top}
            {items.length === 0 ? (
              <div style={{ padding: 16, color: '#666' }}>No items yet</div>
            ) : (
              <Table className="lum-list-table">
                <THead>
                  <TR>
                    {displayFields.map((field: any) => (
                      <TH key={field.name}>{field.label || field.name}</TH>
                    ))}
                    {componentFields.length > 0 && (
                      <TH style={{ textAlign: 'right' }}>Actions</TH>
                    )}
                  </TR>
                </THead>
                <TBody>
                  {items.map((item, index) => (
                    <TR key={index}>
                      {displayFields.map((field: any) => {
                        const value = item[field.name];
                        const displayValue = value !== undefined && value !== null && value !== '' ? String(value) : '—';
                        return <TD key={field.name}>{displayValue}</TD>;
                      })}
                      {componentFields.length > 0 && (
                        <TD style={{ textAlign: 'right' }}>
                          {componentFields.map((comp: any, compIndex: number) => {
                            const ComponentToRender = comp.component;
                            if (!ComponentToRender) return null;
                            const resolvedProps = typeof comp.props === "function"
                              ? comp.props(getScopedContext(index))
                              : comp.props || {};
                            const handleClick = comp.onClick
                              ? () => comp.onClick!(getScopedContext(index))
                              : undefined;
                            return (
                              <span key={compIndex} style={{ marginLeft: compIndex > 0 ? 8 : 0 }}>
                                <ComponentToRender {...resolvedProps} onClick={handleClick}>
                                  {comp.children}
                                </ComponentToRender>
                              </span>
                            );
                          })}
                        </TD>
                      )}
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
            {AddButton?.bottom}
          </div>
        );
      }

      // Fallback HTML table
      return (
        <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
          {AddButton?.top}
          {items.length === 0 ? (
            <div style={{ padding: 16, color: '#666' }}>No items yet</div>
          ) : (
            <table className="lum-list-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {displayFields.map((field: any) => (
                    <th key={field.name} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #e0e0e0', fontWeight: 600 }}>
                      {field.label || field.name}
                    </th>
                  ))}
                  {componentFields.length > 0 && (
                    <th style={{ textAlign: 'right', padding: '8px 12px', borderBottom: '2px solid #e0e0e0' }}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    {displayFields.map((field: any) => {
                      const value = item[field.name];
                      const displayValue = value !== undefined && value !== null && value !== '' ? String(value) : '—';
                      return <td key={field.name} style={{ padding: '8px 12px' }}>{displayValue}</td>;
                    })}
                    {componentFields.length > 0 && (
                      <td style={{ textAlign: 'right', padding: '8px 12px' }}>
                        {componentFields.map((comp: any, compIndex: number) => {
                          const ComponentToRender = comp.component;
                          if (!ComponentToRender) return null;
                          const resolvedProps = typeof comp.props === "function"
                            ? comp.props(getScopedContext(index))
                            : comp.props || {};
                          const handleClick = comp.onClick
                            ? () => comp.onClick!(getScopedContext(index))
                            : undefined;
                          return (
                            <span key={compIndex} style={{ marginLeft: compIndex > 0 ? 8 : 0 }}>
                              <ComponentToRender {...resolvedProps} onClick={handleClick}>
                                {comp.children}
                              </ComponentToRender>
                            </span>
                          );
                        })}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {AddButton?.bottom}
        </div>
      );
    }

    // ===========================================
    // CARDS DISPLAY MODE: .as(Cards) with each()
    // ===========================================
    if ((componentName === "Cards" || componentName === "LuminoCards") && hasEachRows) {
      return (
        <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
          {AddButton?.top}
          {items.length === 0 ? (
            <div style={{ padding: 16, color: '#666' }}>No items yet</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {items.map((item, index) => (
                <div key={index} className="lum-list-card" style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16 }}>
                  {renderEachRowContent(index)}
                </div>
              ))}
            </div>
          )}
          {AddButton?.bottom}
        </div>
      );
    }

    // ===========================================
    // ROWS DISPLAY MODE: .as(Rows) or default with each()
    // ===========================================
    if ((componentName === "Rows" || componentName === "LuminoRows" || !DisplayComponent) && hasEachRows) {
      return (
        <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
          {AddButton?.top}
          {items.length === 0 ? (
            <div style={{ padding: 16, color: '#666' }}>No items yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((item, index) => (
                <div key={index} className={lumCss.listItem(index)} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 16 }}>
                  {renderEachRowContent(index)}
                </div>
              ))}
            </div>
          )}
          {AddButton?.bottom}
        </div>
      );
    }

    // Default: Rows (list of row groups)
    if (!DisplayComponent) {
      return (
        <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
          {AddButton?.top}
          {items.map((item, index) => (
            <div key={index} className={lumCss.listItem(index)}>
              <div className={lumCss.listItemContent}>
                {rows.map((row, rowIndex) => (
                  <RowRenderer
                    key={rowIndex}
                    row={row}
                    form={getScopedForm(index)}
                    context={getScopedContext(index)}
                    rowIndex={rowIndex}
                  />
                ))}
              </div>
              {canRemove(index) && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className={lumCss.listRemoveButton}
                >
                  {actions?.remove?.label || "×"}
                </button>
              )}
            </div>
          ))}
          {AddButton?.bottom}
        </div>
      );
    }

    // Use custom display component from adapter
    const adapter = Lumino.ui.get();
    const listAdapter = adapter?.lists;

    if (listAdapter) {
      // Check display mode name
      const componentName = (DisplayComponent as any)?.displayName || DisplayComponent.name;

      if (componentName === "Tabs" || componentName === "ListTabs" || componentName === "LuminoTabs") {
        // Tabs display mode
        const TabsComponent = listAdapter.Tabs;
        if (TabsComponent) {
          const tabChildren = items.length > 0 ? (
            <div className={lumCss.listItemContent} style={{ display: "flex", flexDirection: "column", gap: "var(--salt-spacing-200, 16px)", paddingTop: "var(--salt-spacing-200, 16px)" }}>
              {rows.map((row, rowIndex) => (
                <RowRenderer
                  key={rowIndex}
                  row={row}
                  form={getScopedForm(effectiveActiveTab)}
                  context={getScopedContext(effectiveActiveTab)}
                  rowIndex={rowIndex}
                />
              ))}
            </div>
          ) : null;

          return (
            <TabsComponent
              items={items}
              activeIndex={effectiveActiveTab}
              onTabChange={setActiveTab}
              getLabel={getTabLabel}
              addButton={canAdd ? AddButton?.top : undefined}
              onAdd={canAdd ? handleAdd : undefined}
              onClose={actions?.close ? handleRemove : undefined}
              className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}
            >
              {tabChildren}
            </TabsComponent>
          );
        }
      }

      if (componentName === "Table" || componentName === "ListTable" || componentName === "LuminoTable") {
        // Table display mode
        const TableComponent = listAdapter.Table;

        if (TableComponent && tableColumns) {
          // Build row actions based on configuration
          const rowActions: Array<{
            label: string;
            onClick: (index: number) => void;
            enabled?: (index: number) => boolean;
          }> = [];

          // Add Edit action when editFormClass is configured
          if (editFormClass) {
            rowActions.push({
              label: "Edit",
              onClick: handleEditWithDialog,
            });
          }

          // Add Remove action when configured
          if (actions?.remove) {
            rowActions.push({
              label: actions.remove.label || "Remove",
              onClick: handleRemove,
              enabled: canRemove,
            });
          }

          return (
            <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
              {AddButton?.top}
              <TableComponent
                data={items}
                columns={tableColumns}
                onRowClick={editFormClass ? handleEditWithDialog : (index: number) => setActiveTab(index)}
                rowActions={rowActions.length > 0 ? rowActions : undefined}
              />
              {AddButton?.bottom}
            </div>
          );
        }
      }

      if (componentName === "Cards" || componentName === "ListCards" || componentName === "LuminoCards") {
        // Cards display mode
        const CardsComponent = listAdapter.Cards;
        if (CardsComponent) {
          return (
            <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
              {AddButton?.top}
              <CardsComponent
                items={items}
                renderCard={(item: any, index: number) => (
                  <div className={lumCss.listItemContent}>
                    {rows.map((row, rowIndex) => (
                      <RowRenderer
                        key={rowIndex}
                        row={row}
                        form={getScopedForm(index)}
                        context={getScopedContext(index)}
                        rowIndex={rowIndex}
                      />
                    ))}
                    {canRemove(index) && (
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className={lumCss.listRemoveButton}
                      >
                        {actions?.remove?.label || "×"}
                      </button>
                    )}
                  </div>
                )}
              />
              {AddButton?.bottom}
            </div>
          );
        }
      }

      // Custom display component - not a built-in mode
      // Pass items, context, listOps, callbacks, and displayProps
      if (!["Tabs", "ListTabs", "LuminoTabs", "Table", "ListTable", "LuminoTable", "Cards", "ListCards", "LuminoCards", "Rows", "LuminoRows"].includes(componentName)) {
        const CustomComponent = DisplayComponent;

        // Use dialog-aware handlers when editFormClass is configured
        return (
          <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
            <CustomComponent
              // Standard props for custom display components
              items={items}
              ctx={context}
              fieldName={listPath}
              options={displayProps}
              // Additional props for compatibility/convenience
              context={context}
              listOps={listOps}
              onAdd={canAdd ? (editFormClass ? handleAddWithDialog : handleAdd) : undefined}
              onEdit={editFormClass ? handleEditWithDialog : undefined}
              onRemove={handleRemove}
              canRemove={canRemove}
              renderItem={editFormClass ? undefined : (index: number) => (
                <div className={lumCss.listItemContent}>
                  {rows.map((row, rowIndex) => (
                    <RowRenderer
                      key={rowIndex}
                      row={row}
                      form={getScopedForm(index)}
                      context={getScopedContext(index)}
                      rowIndex={rowIndex}
                    />
                  ))}
                </div>
              )}
              className={cssClass}
              // Spread any additional displayProps
              {...displayProps}
            />
          </div>
        );
      }
    }

    // Fallback: render as rows if custom component not found
    return (
      <div className={`${lumCss.list(id)}${cssClass ? ` ${cssClass}` : ""}`}>
        {AddButton?.top}
        {items.map((item, index) => (
          <div key={index} className={lumCss.listItem(index)}>
            <div className={lumCss.listItemContent}>
              {rows.map((row, rowIndex) => (
                <RowRenderer
                  key={rowIndex}
                  row={row}
                  form={getScopedForm(index)}
                  context={getScopedContext(index)}
                  rowIndex={rowIndex}
                />
              ))}
            </div>
            {canRemove(index) && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className={lumCss.listRemoveButton}
              >
                {actions?.remove?.label || "×"}
              </button>
            )}
          </div>
        ))}
        {AddButton?.bottom}
      </div>
    );
  }, [
    DisplayComponent,
    items,
    rows,
    getScopedForm,
    getScopedContext,
    context,
    canRemove,
    handleRemove,
    actions,
    AddButton,
    activeTab,
    effectiveActiveTab,
    getTabLabel,
    canAdd,
    handleAdd,
    handleAddWithDialog,
    handleEditWithDialog,
    editFormClass,
    id,
    cssClass,
    tableColumns,
    config.containers, // Container API rendering
    listPath,
    form.values, // Ensure re-render when form values change
  ]);

  // Early return for hidden lists - AFTER all hooks are called
  if (!visibilityResult.isVisible) {
    return null;
  }

  // Get list-level validation errors (e.g., min/max item count)
  // Use form.errors directly so React can track the dependency for re-renders
  const listErrors = form.errors[listPath] || [];

  // Get ErrorMessage component from layout adapter
  const { ErrorMessage } = getLayoutComponents();

  // Error message component for list-level validation using adapter
  const ListErrorMessage = listErrors.length > 0 ? (
    <ErrorMessage errors={listErrors} />
  ) : null;

  // Render the list content with optional dialog
  const renderContent = () => {
    // Wrap with custom wrapper if provided
    if (wrapper) {
      const WrapperComponent = resolveComponent(wrapper);
      if (WrapperComponent) {
        return (
          <>
            <WrapperComponent>{listContent}</WrapperComponent>
            {ListErrorMessage}
          </>
        );
      }
    }
    return (
      <>
        {listContent}
        {ListErrorMessage}
      </>
    );
  };

  // When editFormClass is configured, include the dialog element
  if (editFormClass) {
    return (
      <>
        {renderContent()}
        {dialogHook.DialogElement}
      </>
    );
  }

  return renderContent();
}

// =============================================================================
// FORM TABS RENDERER
// =============================================================================

export interface FormTabsRendererProps {
  /** Tabs configuration */
  config: FormTabsConfig;
  /** Form state */
  form: UseFormReturn<any>;
  /** Form context */
  context: FormContext;
}

/**
 * Renders form tabs (static tabs with sections)
 */
export function FormTabsRenderer({ config, form, context }: FormTabsRendererProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Check visibility
  const visibilityResult = useMemo(() => {
    return evaluateVisibility(config.visibility, context);
  }, [config.visibility, context]);

  if (!visibilityResult.isVisible) {
    return null;
  }

  // Filter visible tabs
  const visibleTabs = useMemo(() => {
    return config.tabs.filter((tab) => {
      if (!tab.visibility) return true;
      return evaluateVisibility(tab.visibility, context).isVisible;
    });
  }, [config.tabs, context]);

  // Get current tab config
  const currentTab = visibleTabs[activeTab] || visibleTabs[0];

  // Tab header styles
  const tabListStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: config.position === "left" || config.position === "right" ? "column" : "row",
    borderBottom: config.position === "top" ? "1px solid #e0e0e0" : undefined,
    borderTop: config.position === "bottom" ? "1px solid #e0e0e0" : undefined,
    borderRight: config.position === "left" ? "1px solid #e0e0e0" : undefined,
    borderLeft: config.position === "right" ? "1px solid #e0e0e0" : undefined,
  };

  const tabStyle = (isActive: boolean, disabled: boolean): React.CSSProperties => ({
    padding: "8px 16px",
    border: "none",
    background: isActive ? "#f5f5f5" : "transparent",
    borderBottom: config.position === "top" && isActive ? "2px solid #1976d2" : "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontWeight: isActive ? 600 : 400,
  });

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: config.position === "left" || config.position === "right" ? "row" : "column",
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: "16px 0",
  };

  // Get tab label
  const getTabLabel = (tab: FormTabConfig): string => {
    if (typeof tab.label === "function") {
      return tab.label(context);
    }
    return tab.label;
  };

  // Check if tab is disabled
  const isTabDisabled = (tab: FormTabConfig): boolean => {
    if (typeof tab.disabled === "function") {
      return tab.disabled(context);
    }
    return tab.disabled || false;
  };

  // Get tab badge
  const getTabBadge = (tab: FormTabConfig): string | number | undefined => {
    if (typeof tab.badge === "function") {
      return tab.badge(context);
    }
    return tab.badge;
  };

  return (
    <div className={`lum-form-tabs ${config.cssClass || ""}`} style={containerStyle}>
      <div className="lum-form-tabs__list" style={tabListStyle} role="tablist">
        {visibleTabs.map((tab, index) => {
          const badge = getTabBadge(tab);
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={index === activeTab}
              disabled={isTabDisabled(tab)}
              onClick={() => !isTabDisabled(tab) && setActiveTab(index)}
              style={tabStyle(index === activeTab, isTabDisabled(tab))}
              className={`lum-form-tabs__tab ${index === activeTab ? "lum-form-tabs__tab--active" : ""}`}
            >
              {tab.icon && <span className="lum-form-tabs__icon">{tab.icon}</span>}
              {getTabLabel(tab)}
              {badge !== undefined && (
                <span className="lum-form-tabs__badge" style={{ marginLeft: 8 }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="lum-form-tabs__content" style={contentStyle} role="tabpanel">
        {currentTab && currentTab.sections.map((section, index) => (
          <SectionRenderer
            key={section.title || index}
            section={section}
            form={form}
            context={context}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// FORM RENDERER
// =============================================================================

export interface FormRendererProps<TEntity = any> {
  /** Form instance */
  form: Form<TEntity>;
  /** Initial values */
  initialValues?: Partial<TEntity>;
  /** Current mode */
  mode?: string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Validate on change */
  validateOnChange?: boolean;
  /** Validate on blur */
  validateOnBlur?: boolean;
  /** Called when form state changes */
  onChange?: (values: Record<string, any>) => void;
  /** Called before action execution */
  onBeforeAction?: (actionName: string) => boolean;
  /** Called after action execution */
  onAfterAction?: (actionName: string, success: boolean) => void;
  /** Custom class name */
  className?: string;
  /** Render prop for custom layout */
  children?: (form: UseFormReturn<TEntity>) => ReactNode;
  /** Render actions */
  renderActions?: (form: UseFormReturn<TEntity>) => ReactNode;
}

/**
 * Form Renderer Component
 *
 * @example
 * ```typescript
 * // Basic usage
 * <FormRenderer form={employeeForm} mode="edit" />
 *
 * // With custom actions
 * <FormRenderer
 *   form={employeeForm}
 *   mode="edit"
 *   renderActions={(formState) => (
 *     <>
 *       <Button onClick={() => formState.executeAction("save")}>Save</Button>
 *       <Button onClick={() => formState.executeAction("cancel")}>Cancel</Button>
 *     </>
 *   )}
 * />
 *
 * // With custom layout
 * <FormRenderer form={employeeForm}>
 *   {(formState) => (
 *     <div className="custom-layout">
 *       <FieldRenderer field={formState.formConfig.sections[0].rows[0].fields[0]} ... />
 *     </div>
 *   )}
 * </FormRenderer>
 * ```
 */
export function FormRenderer<TEntity = any>({
  form,
  initialValues,
  mode = "default",
  readOnly = false,
  validateOnChange = false,
  validateOnBlur = true,
  onChange,
  onBeforeAction,
  onAfterAction,
  className,
  children,
  renderActions,
}: FormRendererProps<TEntity>) {
  const layouts = getLayoutComponents();
  const FormComponent = layouts.Form;

  // Use form hook
  const formState = useForm<TEntity>(form, {
    initialValues,
    mode,
    readOnly,
    validateOnChange,
    validateOnBlur,
  });

  // Watch for value changes
  React.useEffect(() => {
    if (onChange) {
      onChange(formState.values);
    }
  }, [formState.values, onChange]);

  // Wrap action execution
  const wrappedExecuteAction = useCallback(
    async (actionName: string) => {
      if (onBeforeAction && !onBeforeAction(actionName)) {
        return;
      }

      try {
        await formState.executeAction(actionName);
        if (onAfterAction) {
          onAfterAction(actionName, true);
        }
      } catch (error) {
        if (onAfterAction) {
          onAfterAction(actionName, false);
        }
      }
    },
    [formState, onBeforeAction, onAfterAction]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Default to "submit" action if exists
      if (formState.hasAction("submit")) {
        wrappedExecuteAction("submit");
      } else if (formState.hasAction("save")) {
        wrappedExecuteAction("save");
      }
    },
    [formState, wrappedExecuteAction]
  );

  // Get form config
  const { formConfig, formContext } = formState;
  const formId = formConfig.id;

  // Custom render
  if (children) {
    return (
      <FormComponent formId={formId} onSubmit={handleSubmit} className={className}>
        {children(formState)}
        {renderActions && renderActions(formState)}
      </FormComponent>
    );
  }

  // Render elements in definition order if elementOrder is provided
  const renderElements = () => {
    // If elementOrder is provided, use it for ordering
    if (formConfig.elementOrder && formConfig.elementOrder.length > 0) {
      return formConfig.elementOrder.map((element, orderIndex) => {
        switch (element.type) {
          case "section": {
            const sectionIndex = element.key as number;
            const section = formConfig.sections[sectionIndex];
            if (!section) return null;
            return (
              <SectionRenderer
                key={`section-${sectionIndex}`}
                section={section}
                form={formState}
                context={formContext}
              />
            );
          }
          case "list": {
            const listKey = element.key as string;
            const listConfig = formConfig.lists?.[listKey];
            if (!listConfig) return null;
            return (
              <ListRenderer
                key={`list-${listKey}`}
                config={listConfig}
                form={formState}
                context={formContext}
              />
            );
          }
          case "object": {
            const objectKey = element.key as string;
            const objectConfig = formConfig.objects?.[objectKey];
            if (!objectConfig) return null;
            return (
              <ObjectRenderer
                key={`object-${objectKey}`}
                config={objectConfig}
                form={formState}
                context={formContext}
              />
            );
          }
          case "tabs": {
            const tabsId = element.key as string;
            const tabsConfig = formConfig.tabs?.find(t => t.id === tabsId);
            if (!tabsConfig) return null;
            return (
              <FormTabsRenderer
                key={`tabs-${tabsId}`}
                config={tabsConfig}
                form={formState}
                context={formContext}
              />
            );
          }
          default:
            return null;
        }
      });
    }

    // Get lists that target a specific section (by id or title)
    const getListsForSection = (section: SectionConfig) => {
      if (!formConfig.lists) return [];
      return Object.entries(formConfig.lists)
        .filter(([_, listConfig]) => {
          if (!listConfig.target) return false;
          // Match by section id (preferred) or section title (fallback)
          return listConfig.target === section.id || listConfig.target === section.title;
        })
        .map(([key, listConfig]) => (
          <ListRenderer
            key={key}
            config={listConfig}
            form={formState}
            context={formContext}
          />
        ));
    };

    // Get lists that don't target any section
    const getOrphanLists = () => {
      if (!formConfig.lists) return [];
      return Object.entries(formConfig.lists)
        .filter(([_, listConfig]) => !listConfig.target)
        .map(([key, listConfig]) => (
          <ListRenderer
            key={key}
            config={listConfig}
            form={formState}
            context={formContext}
          />
        ));
    };

    // Fallback: render sections with their targeted lists
    return (
      <>
        {/* Render sections with their targeted lists */}
        {formConfig.sections.map((section, index) => (
          <React.Fragment key={section.id || section.title || index}>
            <SectionRenderer
              section={section}
              form={formState}
              context={formContext}
            />
            {/* Render lists that target this section (by id or title) */}
            {getListsForSection(section)}
          </React.Fragment>
        ))}

        {/* Render nested objects */}
        {formConfig.objects &&
          Object.entries(formConfig.objects).map(([key, objectConfig]) => (
            <ObjectRenderer
              key={key}
              config={objectConfig}
              form={formState}
              context={formContext}
            />
          ))}

        {/* Render lists that don't target any section */}
        {getOrphanLists()}

        {/* Render tabs */}
        {formConfig.tabs &&
          formConfig.tabs.map((tabsConfig) => (
            <FormTabsRenderer
              key={tabsConfig.id}
              config={tabsConfig}
              form={formState}
              context={formContext}
            />
          ))}
      </>
    );
  };

  // Default render
  return (
    <FormComponent formId={formId} onSubmit={handleSubmit} className={className}>
      {renderElements()}
      {renderActions && renderActions(formState)}
    </FormComponent>
  );
}

// =============================================================================
// EXPORTS (types only - functions are already exported inline)
// =============================================================================

export type { ObjectRendererProps, ListRendererProps };
