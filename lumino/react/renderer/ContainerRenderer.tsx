/**
 * Lumino Framework - Container Renderer
 *
 * Renders container trees defined via Component.container() API.
 * Resolves Lumino abstract components (LumTable, LumTD, etc.) to adapter-specific implementations.
 *
 * @example
 * ```typescript
 * // In Component
 * this.container(LumTable)
 *   .add(LumTHead)
 *     .add(LumTR)
 *       .add(LumTH).text("Name").end()
 *     .end()
 *   .end()
 *   .add(LumTBody)
 *     .each()
 *       .add(LumTR)
 *         .add(LumTD).field("name").display().end()
 *       .end()
 *     .endEach()
 *   .end()
 * .end();
 * ```
 */

import React, { createElement } from "react";
import type { ContainerNodeConfig } from "../../core/types/form";
import type { FormContext } from "../../core/types/context";
import { isLuminoContainer, getLuminoComponentName } from "../components/Containers";
import { resolveComponent } from "./FormRenderer";

// =============================================================================
// CONTAINER COMPONENT MAPPING
// =============================================================================

/**
 * Maps Lumino abstract container names to HTML elements (fallback).
 * Adapters can override these with their own implementations.
 */
const DEFAULT_CONTAINER_MAPPING: Record<string, string> = {
  // Table components
  Table: "table",
  THead: "thead",
  TBody: "tbody",
  TFoot: "tfoot",
  TR: "tr",
  TH: "th",
  TD: "td",
  // Card components (use divs as fallback)
  Card: "div",
  CardHeader: "div",
  CardBody: "div",
  CardFooter: "div",
  // Layout components
  Grid: "div",
  Stack: "div",
  Flex: "div",
  Box: "div",
  // List components
  List: "ul",
  ListItem: "li",
  // Accordion (use divs as fallback)
  Accordion: "div",
  AccordionItem: "div",
  AccordionHeader: "div",
  AccordionPanel: "div",
};

/**
 * Get adapter-provided container components.
 * Falls back to HTML elements if adapter doesn't provide them.
 */
function getContainerComponent(
  componentName: string,
  adapterComponents?: Record<string, React.ComponentType<any>>
): React.ComponentType<any> | string {
  // Check adapter first
  if (adapterComponents && adapterComponents[componentName]) {
    return adapterComponents[componentName];
  }
  // Fall back to HTML element
  return DEFAULT_CONTAINER_MAPPING[componentName] || "div";
}

// =============================================================================
// CONTAINER RENDERER
// =============================================================================

export interface ContainerRendererProps {
  /** Container configuration from Component.container().build() */
  config: ContainerNodeConfig;
  /** Form context */
  context: FormContext;
  /** List of items for each() iteration */
  items?: any[];
  /** Current item (when rendering inside each()) */
  currentItem?: any;
  /** Current item index */
  currentIndex?: number;
  /** Adapter container components */
  adapterComponents?: Record<string, React.ComponentType<any>>;
  /** Base field path for nested fields */
  fieldPath?: string;
}

/**
 * Renders a container tree node and its children.
 */
export function ContainerRenderer({
  config,
  context,
  items,
  currentItem,
  currentIndex,
  adapterComponents,
  fieldPath = "",
}: ContainerRendererProps): React.ReactElement | null {
  // Resolve the component
  const ComponentToRender = resolveContainerComponent(config.component, adapterComponents);

  // Resolve props
  const resolvedProps = resolveProps(config.props, context);

  // Add CSS class if specified
  if (config.cssClass) {
    resolvedProps.className = resolvedProps.className
      ? `${resolvedProps.className} ${config.cssClass}`
      : config.cssClass;
  }

  // Add click handler if specified
  if (config.onClick) {
    resolvedProps.onClick = () => config.onClick!(context);
  }

  // Check visibility
  if (config.visibility) {
    const isHidden = evaluateVisibility(config.visibility, context);
    if (isHidden) return null;
  }

  // Render children
  const children = renderChildren(
    config,
    context,
    items,
    currentItem,
    currentIndex,
    adapterComponents,
    fieldPath
  );

  return createElement(ComponentToRender, resolvedProps, children);
}

/**
 * Resolve a Lumino abstract component to its actual implementation.
 */
function resolveContainerComponent(
  component: React.ComponentType<any>,
  adapterComponents?: Record<string, React.ComponentType<any>>
): React.ComponentType<any> | string {
  // Check if it's a Lumino abstract container
  if (isLuminoContainer(component)) {
    const componentName = getLuminoComponentName(component);
    if (componentName) {
      return getContainerComponent(componentName, adapterComponents);
    }
  }

  // It's a direct component (user provided their own)
  return component;
}

/**
 * Resolve props - handles both static and dynamic props.
 */
function resolveProps(
  props: Record<string, any> | ((ctx: FormContext) => Record<string, any>) | undefined,
  context: FormContext
): Record<string, any> {
  if (!props) return {};
  if (typeof props === "function") {
    return props(context);
  }
  return { ...props };
}

/**
 * Evaluate visibility configuration.
 */
function evaluateVisibility(
  visibility: ContainerNodeConfig["visibility"],
  context: FormContext
): boolean {
  if (!visibility) return false;

  // Check hide condition
  if (visibility.hide !== undefined) {
    const shouldHide = typeof visibility.hide === "function"
      ? visibility.hide(context)
      : visibility.hide;
    if (shouldHide) return true;
  }

  // Check visible condition
  if (visibility.visible !== undefined) {
    const shouldShow = typeof visibility.visible === "function"
      ? visibility.visible(context)
      : visibility.visible;
    if (!shouldShow) return true;
  }

  return false;
}

/**
 * Render children of a container node.
 */
function renderChildren(
  config: ContainerNodeConfig,
  context: FormContext,
  items: any[] | undefined,
  currentItem: any,
  currentIndex: number | undefined,
  adapterComponents: Record<string, React.ComponentType<any>> | undefined,
  fieldPath: string
): React.ReactNode {
  // If node has text content, return it
  if (config.text !== undefined) {
    return config.text;
  }

  // If node has a field binding, render the field
  if (config.field) {
    return renderField(config.field, context, currentItem, currentIndex, fieldPath);
  }

  // If no children, return null
  if (!config.children || config.children.length === 0) {
    return null;
  }

  // Process children
  const renderedChildren: React.ReactNode[] = [];

  for (let i = 0; i < config.children.length; i++) {
    const child = config.children[i];

    // Handle each() blocks
    if (child.isEach) {
      // Determine items to iterate over
      let iterItems: any[];
      if (child.eachFieldName) {
        // Iterate over a nested field
        const data = currentItem || context.getFormData?.() || {};
        iterItems = getNestedValue(data, child.eachFieldName) || [];
      } else {
        // Use provided items array
        iterItems = items || [];
      }

      // Render each item
      iterItems.forEach((item, idx) => {
        // Store reference to parent's getFormData before overriding
        const parentGetFormData = context.getFormData;

        // Create a scoped context for this item
        // This ensures getFormData() returns the current item's data
        const scopedContext: FormContext = {
          ...context,
          listItemIndex: idx,
          // Override getFormData to return current item
          getFormData: () => item,
          // Add getParentFormData to access the parent form's full data
          // Useful when dialog needs to access data from the main form
          getParentFormData: parentGetFormData,
          // Override getValue to get from current item
          getValue: <T,>(field: string): T => {
            return getNestedValue(item, field) as T;
          },
          // Add updateCurrentItem to update this specific item
          updateCurrentItem: (data: any) => {
            const listFieldName = child.eachFieldName || context.listFieldName;
            if (listFieldName && context.list) {
              context.list(listFieldName).set(idx, data);
            }
          },
          // Add removeCurrentItem to remove this specific item
          removeCurrentItem: () => {
            const listFieldName = child.eachFieldName || context.listFieldName;
            if (listFieldName && context.list) {
              context.list(listFieldName).remove(idx);
            }
          },
        };

        // Render the each block's children for this item
        if (child.children) {
          child.children.forEach((eachChild, childIdx) => {
            const itemFieldPath = child.eachFieldName
              ? `${fieldPath}${fieldPath ? "." : ""}${child.eachFieldName}[${idx}]`
              : `${fieldPath}[${idx}]`;

            renderedChildren.push(
              <ContainerRenderer
                key={`each-${idx}-${childIdx}`}
                config={eachChild}
                context={scopedContext}
                items={iterItems}
                currentItem={item}
                currentIndex={idx}
                adapterComponents={adapterComponents}
                fieldPath={itemFieldPath}
              />
            );
          });
        }
      });
    } else {
      // Regular child
      renderedChildren.push(
        <ContainerRenderer
          key={`child-${i}`}
          config={child}
          context={context}
          items={items}
          currentItem={currentItem}
          currentIndex={currentIndex}
          adapterComponents={adapterComponents}
          fieldPath={fieldPath}
        />
      );
    }
  }

  return renderedChildren.length > 0 ? renderedChildren : null;
}

/**
 * Render a field binding within a container.
 */
function renderField(
  field: NonNullable<ContainerNodeConfig["field"]>,
  context: FormContext,
  currentItem: any,
  _currentIndex: number | undefined,
  fieldPath: string
): React.ReactNode {
  // Get the field value
  const data = currentItem || context.getFormData?.() || {};
  const value = getNestedValue(data, field.name);

  // If display mode, just show the value
  if (field.display) {
    // Format the value for display
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }

  // If a component is specified, render it as an editable field
  if (field.component) {
    const fullFieldPath = fieldPath
      ? `${fieldPath}.${field.name}`
      : field.name;

    // Resolve the component
    const FieldComponent = resolveComponent(field.component);
    if (!FieldComponent) {
      return String(value ?? "");
    }

    // Get value and onChange from context
    const fieldValue = context.getValue?.(fullFieldPath) ?? value;
    const onChange = (newValue: any) => context.setValue?.(fullFieldPath, newValue);

    return createElement(FieldComponent, {
      value: fieldValue,
      onChange,
      label: field.label,
      ...field.props,
    });
  }

  // Default: display the value
  return String(value ?? "");
}

/**
 * Get a nested value from an object using dot notation.
 */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;

  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }

  return current;
}

// =============================================================================
// LIST CONTAINER RENDERER (for use with addList().include())
// =============================================================================

export interface ListContainerRendererProps {
  /** Container configurations from Component.build().containers */
  containers: ContainerNodeConfig[];
  /** Form context */
  context: FormContext;
  /** List items to render */
  items: any[];
  /** Field name for the list */
  listFieldName: string;
  /** Adapter container components */
  adapterComponents?: Record<string, React.ComponentType<any>>;
}

/**
 * Renders containers for a list, handling the each() iteration.
 */
export function ListContainerRenderer({
  containers,
  context,
  items,
  listFieldName,
  adapterComponents,
}: ListContainerRendererProps): React.ReactElement {
  return (
    <>
      {containers.map((container, idx) => (
        <ContainerRenderer
          key={`container-${idx}`}
          config={container}
          context={context}
          items={items}
          adapterComponents={adapterComponents}
          fieldPath={listFieldName}
        />
      ))}
    </>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export { getContainerComponent, resolveContainerComponent };
