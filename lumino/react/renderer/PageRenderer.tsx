/**
 * Lumino Framework - Page Renderer
 *
 * Renders a Page configuration using registered UI components.
 * UI-library independent - uses component registry for actual rendering.
 *
 * Uses Lumino.ui() adapter for layout components.
 * Falls back to HTML defaults if no adapter is set.
 */

import React, { useMemo, ReactNode } from "react";
import type { Page } from "../../core/page/Page";
import type { PageContext } from "../../core/types/context";
import type { ComponentConfig, PageRowConfig, PageConfig } from "../../core/types/page";
import type { SpacingConfig, FormConfig } from "../../core/types/form";
import type { TabsConfig } from "../../core/containers/Tabs";
import type { Form } from "../../core/form/Form";
import { usePage, UsePageReturn } from "../hooks/usePage";
import { useNavigationGuard } from "../hooks/usePage";
import { useRouter } from "../router/LuminoRouter";
import { FormRenderer } from "./FormRenderer";
import { resolveComponent } from "./FormRenderer";
import { TabsRenderer } from "./TabsRenderer";
import { Lumino } from "../../core/Lumino";

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  error?: any;
  pageId?: string;
}

export interface PageRowLayoutProps {
  children: ReactNode;
  columns?: number;
  gap?: number;
  layout?: number[];
  className?: string;
  rowIndex?: number;
}

// Custom layout overrides
let customPageLayout: React.ComponentType<PageLayoutProps> | null = null;
let customPageRowLayout: React.ComponentType<PageRowLayoutProps> | null = null;

/**
 * Default HTML-based layout components (no UI library dependency)
 */
const DefaultPageLayout = ({ children, className, loading, error, pageId }: PageLayoutProps) => (
  <div className={`lum-page ${pageId ? `lum-page--${pageId}` : ""} ${className || ""}`.trim()}>
    {loading && <div className="lum-page__loading">Loading...</div>}
    {error && <div className="lum-page__error">Error: {error.message || String(error)}</div>}
    {!loading && !error && (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {children}
      </div>
    )}
  </div>
);

const DefaultRowLayout = ({ children, columns = 12, gap = 16 }: PageRowLayoutProps) => (
  <div
    className="lum-row"
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: `${gap}px`,
    }}
  >
    {children}
  </div>
);

const DefaultColumnLayout = ({ children, span, className }: { children: React.ReactNode; span: number; className?: string }) => (
  <div className={className} style={{ gridColumn: `span ${span}` }}>
    {children}
  </div>
);

/**
 * Get layout components from Lumino.ui() adapter or HTML defaults
 */
function getPageLayoutComponents() {
  const adapter = Lumino.ui.get();
  const layout = adapter?.layout;

  // Page layout - use custom override, adapter, or default
  const PageLayout = customPageLayout || DefaultPageLayout;

  // Row layout - use custom override, adapter, or default
  const PageRowLayout = customPageRowLayout || layout?.Row || DefaultRowLayout;

  // Column - use adapter or default
  const Column = layout?.Column || DefaultColumnLayout;

  return { PageLayout, PageRowLayout, Column };
}

/**
 * Set custom page layout component
 */
export function setPageLayout(component: React.ComponentType<PageLayoutProps>): void {
  customPageLayout = component;
}

/**
 * Set custom page row layout component
 */
export function setPageRowLayout(component: React.ComponentType<PageRowLayoutProps>): void {
  customPageRowLayout = component;
}

/**
 * Helper to build style from SpacingConfig
 */
function buildSpacingStyle(
  margin?: SpacingConfig,
  padding?: SpacingConfig
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

// =============================================================================
// COMPONENT RENDERER
// =============================================================================

export interface ComponentRendererProps {
  config: ComponentConfig;
  context: PageContext;
  /** Column span (from row layout) */
  span?: number;
  /** Component index in row */
  componentIndex?: number;
}

/**
 * Renders a single component
 */
export function ComponentRenderer({ config, context, span, componentIndex = 0 }: ComponentRendererProps) {
  const { component, props: componentProps, children, onClick, visible, margin, padding, cssClass, style, wrapper, colSpan } = config;
  const { Column } = getPageLayoutComponents();

  // Check visibility
  const isVisible = useMemo(() => {
    if (typeof visible === "function") {
      return visible(context);
    }
    return visible !== false;
  }, [visible, context]);

  if (!isVisible) {
    return null;
  }

  // Resolve component
  const Component = resolveComponent(component);
  if (!Component) {
    console.warn("No component found");
    return null;
  }

  // Compute props
  const computedProps = useMemo(() => {
    const baseProps = typeof componentProps === "function" ? componentProps(context) : (componentProps || {});

    // Add onClick handler if defined
    if (onClick) {
      baseProps.onClick = () => onClick(context);
    }

    return baseProps;
  }, [componentProps, onClick, context]);

  // Build spacing style
  const spacingStyle = buildSpacingStyle(margin, padding);

  // Merge with inline style if provided
  const inlineStyle = typeof style === "function" ? style(context) : style;
  const mergedStyle = { ...spacingStyle, ...inlineStyle };
  const hasSpacing = Object.keys(mergedStyle).length > 0;

  // Compute children - evaluate function children with context
  const computedChildren = useMemo(() => {
    if (typeof children === "function") {
      return children(context);
    }
    return children;
  }, [children, context]);

  // Render the component with children if provided
  let content = computedChildren ? <Component {...computedProps}>{computedChildren}</Component> : <Component {...computedProps} />;

  // Wrap with custom wrapper if provided
  if (wrapper) {
    const WrapperComponent = resolveComponent(wrapper);
    if (WrapperComponent) {
      content = <WrapperComponent>{content}</WrapperComponent>;
    }
  }

  // Determine column span: explicit colSpan > layout span > default
  const effectiveSpan = colSpan || span;

  // CSS class
  const componentClass = `lum-component lum-component--${componentIndex}${cssClass ? ` ${cssClass}` : ""}`;

  // Wrap in Column if adapter provides one and we have a span
  if (Column && effectiveSpan) {
    const columnContent = hasSpacing ? (
      <div style={mergedStyle}>{content}</div>
    ) : content;

    return (
      <Column
        span={effectiveSpan}
        columnIndex={componentIndex}
        className={componentClass}
      >
        {columnContent}
      </Column>
    );
  }

  // Fallback: inline style for grid column
  const gridStyle: React.CSSProperties = {
    gridColumn: effectiveSpan ? `span ${effectiveSpan}` : undefined,
    ...mergedStyle,
  };

  return (
    <div className={componentClass} style={gridStyle}>
      {content}
    </div>
  );
}

// =============================================================================
// PAGE ROW RENDERER
// =============================================================================

export interface PageRowRendererProps {
  row: PageRowConfig;
  context: PageContext;
}

/**
 * Renders a row of components
 */
export function PageRowRenderer({ row, context }: PageRowRendererProps) {
  const { components, columns, gap, layout, style, visible, cssClass } = row;
  const { PageRowLayout } = getPageLayoutComponents();

  // Check visibility
  const isVisible = useMemo(() => {
    if (typeof visible === "function") {
      return visible(context);
    }
    return visible !== false;
  }, [visible, context]);

  if (!isVisible) {
    return null;
  }

  // Compute row style
  const rowStyle = typeof style === "function" ? style(context) : style;

  // Compute CSS class
  const rowCssClass = typeof cssClass === "function" ? cssClass(context) : cssClass;
  const baseClassName = "lum-row";

  // If row has flex display style, render components directly without grid
  // This allows proper flex alignment (justify-content, align-items, etc.)
  const isFlexLayout = rowStyle?.display === "flex" || rowStyle?.display === "inline-flex";

  if (isFlexLayout) {
    const flexClassName = `${baseClassName} lum-row--flex${rowCssClass ? ` ${rowCssClass}` : ""}`;
    return (
      <div style={rowStyle} className={flexClassName}>
        {components.map((comp, index) => {
          // For flex layout, render components without grid column wrappers
          const Component = resolveComponent(comp.component);
          if (!Component) return null;

          // Compute props
          const baseProps = typeof comp.props === "function" ? comp.props(context) : (comp.props || {});
          if (comp.onClick) {
            baseProps.onClick = () => comp.onClick!(context);
          }

          // Build spacing style
          const spacingStyle = buildSpacingStyle(comp.margin, comp.padding);
          const inlineStyle = typeof comp.style === "function" ? comp.style(context) : comp.style;
          const mergedStyle = { ...spacingStyle, ...inlineStyle };

          // Check visibility
          const compVisible = typeof comp.visible === "function" ? comp.visible(context) : comp.visible !== false;
          if (!compVisible) return null;

          let content = comp.children ? (
            <Component {...baseProps}>{comp.children}</Component>
          ) : (
            <Component {...baseProps} />
          );

          // Wrap with custom wrapper if provided
          if (comp.wrapper) {
            const WrapperComponent = resolveComponent(comp.wrapper);
            if (WrapperComponent) {
              content = <WrapperComponent>{content}</WrapperComponent>;
            }
          }

          // Apply component-level styles if any
          if (Object.keys(mergedStyle).length > 0) {
            return (
              <div key={index} style={mergedStyle} className={`lum-component lum-component--${index}${comp.cssClass ? ` ${comp.cssClass}` : ""}`}>
                {content}
              </div>
            );
          }

          return (
            <React.Fragment key={index}>
              {content}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // Default: use grid layout
  return (
    <div style={rowStyle}>
      <PageRowLayout columns={columns} gap={gap} layout={layout}>
        {components.map((comp, index) => {
          // Get span from layout array if provided
          const span = layout && layout[index] !== undefined ? layout[index] : undefined;
          return (
            <ComponentRenderer
              key={index}
              config={comp}
              context={context}
              span={span}
              componentIndex={index}
            />
          );
        })}
      </PageRowLayout>
    </div>
  );
}

// =============================================================================
// PAGE CONTENT RENDERER
// =============================================================================

export interface PageContentRendererProps {
  pageConfig: PageConfig;
  pageState: UsePageReturn<any>;
  context: PageContext;
  /** The actual Page instance (needed for form access) */
  page: Page<any>;
  renderForm?: (form: Form<any>, pageState: UsePageReturn<any>) => ReactNode;
}

/**
 * Renders page content (components, rows, forms)
 */
export function PageContentRenderer({
  pageConfig,
  pageState,
  context,
  page,
  renderForm,
}: PageContentRendererProps) {
  return (
    <>
      {pageConfig.components.map((item, index) => {
        // Tabs config
        if ("type" in item && item.type === "tabs" && "config" in item) {
          const tabsConfig = (item as unknown as { type: "tabs"; config: TabsConfig }).config;
          return (
            <TabsRenderer
              key={tabsConfig.id}
              config={tabsConfig}
              context={context as any}
            />
          );
        }

        // Form config
        if ("id" in item && "sections" in item) {
          const formConfig = item as FormConfig;
          // Get form instance from page
          const formInstance = page.getForm(formConfig.id);

          if (formInstance && renderForm) {
            return (
              <React.Fragment key={formConfig.id}>
                {renderForm(formInstance, pageState)}
              </React.Fragment>
            );
          }

          // Default form rendering with FormRenderer
          // Only render form when entity is available to avoid uncontrolled->controlled warnings
          if (formInstance && pageState.entity) {
            return (
              <FormRenderer
                key={formConfig.id}
                form={formInstance}
                initialValues={pageState.entity}
                mode={pageState.mode}
                readOnly={typeof formConfig.readOnly === "function" ? formConfig.readOnly(context as any) : formConfig.readOnly}
              />
            );
          }

          return null;
        }

        // Page row config
        if ("components" in item) {
          return (
            <PageRowRenderer key={index} row={item as PageRowConfig} context={context} />
          );
        }

        // Single component config
        return (
          <ComponentRenderer
            key={index}
            config={item as ComponentConfig & { visible?: boolean | ((ctx: PageContext) => boolean) }}
            context={context}
          />
        );
      })}
    </>
  );
}

// =============================================================================
// PAGE RENDERER
// =============================================================================

export interface PageRendererProps<TEntity = any> {
  /** Page instance */
  page: Page<TEntity>;
  /** Show navigation guard for dirty forms */
  guardNavigation?: boolean;
  /** Navigation guard message */
  guardMessage?: string;
  /** Custom class name */
  className?: string;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Custom error component */
  errorComponent?: (error: any) => ReactNode;
  /** Render prop for custom layout */
  children?: (page: UsePageReturn<TEntity>) => ReactNode;
  /** Custom form renderer */
  renderForm?: (form: Form<any>, pageState: UsePageReturn<TEntity>) => ReactNode;
}

/**
 * Page Renderer Component
 *
 * Route params and query params are automatically extracted from the router context.
 * Mode is automatically determined by the Page's mode() function.
 *
 * @example
 * ```typescript
 * // Basic usage - params come from router automatically
 * <PageRenderer page={employeeFormPage} />
 *
 * // With navigation guard
 * <PageRenderer
 *   page={employeeFormPage}
 *   guardNavigation
 *   guardMessage="You have unsaved changes. Leave anyway?"
 * />
 *
 * // With custom layout
 * <PageRenderer page={employeeFormPage}>
 *   {(pageState) => (
 *     <div className="custom-layout">
 *       <h1>{pageState.mode === "new" ? "New Employee" : "Edit Employee"}</h1>
 *       <PageContentRenderer ... />
 *     </div>
 *   )}
 * </PageRenderer>
 *
 * // With custom form rendering
 * <PageRenderer
 *   page={employeeFormPage}
 *   renderForm={(form, pageState) => (
 *     <FormRenderer
 *       form={form}
 *       renderActions={(formState) => (
 *         <ButtonGroup>
 *           <Button onClick={() => formState.executeAction("save")}>Save</Button>
 *           <Button onClick={() => formState.executeAction("cancel")}>Cancel</Button>
 *         </ButtonGroup>
 *       )}
 *     />
 *   )}
 * />
 * ```
 */
export function PageRenderer<TEntity = any>({
  page,
  guardNavigation = false,
  guardMessage = "You have unsaved changes. Leave anyway?",
  className,
  loadingComponent,
  errorComponent,
  children,
  renderForm,
}: PageRendererProps<TEntity>) {
  // Get layout components
  const { PageLayout } = getPageLayoutComponents();

  // Get route params from router context (auto-injected)
  let routeParams: Record<string, string> = {};
  let queryParams: Record<string, string> = {};

  try {
    const router = useRouter();
    routeParams = router.params;
    queryParams = router.query;
  } catch {
    // Router not available, use empty params
  }

  // Use page hook
  const pageState = usePage<TEntity>(page, {
    routeParams,
    queryParams,
  });

  // Navigation guard
  useNavigationGuard({
    isDirty: pageState.isDirty,
    message: guardMessage,
  });

  // Custom render
  if (children) {
    return (
      <PageLayout className={className} loading={pageState.loading} error={pageState.error}>
        {children(pageState)}
      </PageLayout>
    );
  }

  // Loading state
  if (pageState.loading) {
    return (
      <PageLayout className={className} loading>
        {loadingComponent || <div>Loading...</div>}
      </PageLayout>
    );
  }

  // Error state
  if (pageState.error) {
    return (
      <PageLayout className={className} error={pageState.error}>
        {errorComponent ? (
          errorComponent(pageState.error)
        ) : (
          <div>Error: {pageState.error.message || String(pageState.error)}</div>
        )}
      </PageLayout>
    );
  }

  // Default render
  return (
    <PageLayout className={className}>
      <PageContentRenderer
        pageConfig={pageState.pageConfig}
        pageState={pageState}
        context={pageState.pageContext}
        page={page}
        renderForm={renderForm}
      />
    </PageLayout>
  );
}

// =============================================================================
// PAGE BY ID RENDERER
// =============================================================================

export interface PageByIdRendererProps {
  /** Page ID */
  pageId: string;
  /** Fallback if page not found */
  notFound?: ReactNode;
}

/**
 * Render a page by ID from the registry.
 * Route params are automatically extracted from router context.
 */
export function PageByIdRenderer({
  pageId,
  notFound,
}: PageByIdRendererProps) {
  const { PageRegistry } = require("../../core/page/Page");
  const page = PageRegistry.get(pageId);

  if (!page) {
    return <>{notFound || <div>Page "{pageId}" not found</div>}</>;
  }

  return <PageRenderer page={page} />;
}

// Components are already exported inline with export function
