/**
 * Lumino Framework - Stateful Component Renderer
 *
 * Renders stateful Lumino Components using React hooks for state management.
 * Allows Components to use declarative state() and render() methods.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef, useContext, createContext } from "react";
import type { Component } from "../../core/form/Form";
import type { PageContext } from "../../core/types/context";
import { PageRowRenderer } from "./PageRenderer";
import type { PageRowConfig } from "../../core/types/page";

// Context for passing PageContext to nested components
const PageContextContext = createContext<PageContext | null>(null);

export const PageContextProvider = PageContextContext.Provider;
export const usePageContext = () => useContext(PageContextContext);

export interface StatefulComponentRendererProps<TProps = any, TState = any> {
  /** The Lumino Component class */
  ComponentClass: new (props?: TProps) => Component<any, TProps, TState>;
  /** Props to pass to the component */
  props?: TProps;
  /** Page context for rendering */
  context: PageContext;
}

/**
 * Renders a stateful Lumino Component.
 *
 * This renderer handles:
 * - Initial state from component's state() call
 * - Re-rendering when setState is called
 * - Effects defined via component's effect() calls
 *
 * @example
 * ```tsx
 * <StatefulComponentRenderer
 *   ComponentClass={LuminoCodeViewer}
 *   props={{ files: [...], title: "Source" }}
 *   context={pageContext}
 * />
 * ```
 */
export function StatefulComponentRenderer<TProps = any, TState = any>({
  ComponentClass,
  props,
  context,
}: StatefulComponentRendererProps<TProps, TState>) {
  // Create a stable reference to the component instance
  const componentRef = useRef<Component<any, TProps, TState> | null>(null);

  // Initialize component and get initial state config
  const initialConfig = useMemo(() => {
    const instance = new ComponentClass(props);
    componentRef.current = instance;
    return instance.build();
  }, [ComponentClass]); // Only re-create on class change, not props

  // Get initial state from component's state config
  const initialState = initialConfig.stateConfig?.initialState || ({} as TState);

  // React state management
  const [state, setStateInternal] = useState<TState>(initialState);

  // Track previous state for effect dependency comparison
  const prevStateRef = useRef<TState>(initialState);

  // Stable setState function that merges partial updates
  const setState = useCallback((update: Partial<TState>) => {
    setStateInternal((prevState) => ({
      ...prevState,
      ...update,
    }));
  }, []);

  // Re-render the component with current state
  const renderedConfig = useMemo(() => {
    const instance = componentRef.current;
    if (!instance) return initialConfig;

    // If component has a render function, call it to rebuild rows
    const renderFn = initialConfig.renderFn;
    if (renderFn) {
      // Clear previous rows/containers before re-rendering
      (instance as any)._clearRows?.();
      (instance as any)._clearContainers?.();

      // Call render function with current state
      renderFn(state, setState, props as TProps);

      // Return rebuilt configuration
      const config = instance.build();
      console.log('[StatefulComponentRenderer] Built config:', {
        rowCount: config.rows.length,
        rows: config.rows.map((r, i) => ({
          index: i,
          hasStyle: !!r.style,
          style: r.style,
          componentCount: (r.components?.length || 0) + (r.fields?.length || 0)
        }))
      });
      return config;
    }

    // Non-stateful rendering - just return initial config
    return initialConfig;
  }, [state, props, setState, initialConfig]);

  // Handle effects
  useEffect(() => {
    const effects = initialConfig.stateConfig?.effects;
    if (!effects || effects.length === 0) return;

    const cleanupFns: Array<(() => void) | undefined> = [];

    for (const effectConfig of effects) {
      const { effect, deps } = effectConfig;

      // Determine if this effect should run
      let shouldRun = false;

      if (!deps || deps.length === 0) {
        // No deps = run on every state change
        shouldRun = true;
      } else {
        // Check if any dependency changed
        for (const dep of deps) {
          if (prevStateRef.current[dep] !== state[dep]) {
            shouldRun = true;
            break;
          }
        }
      }

      if (shouldRun) {
        const cleanup = effect(state, setState);
        if (typeof cleanup === "function") {
          cleanupFns.push(cleanup);
        }
      }
    }

    // Update previous state ref
    prevStateRef.current = state;

    // Return combined cleanup function
    return () => {
      for (const cleanup of cleanupFns) {
        cleanup?.();
      }
    };
  }, [state, setState, initialConfig.stateConfig?.effects]);

  // Convert component rows to page rows for rendering
  const pageRows: PageRowConfig[] = useMemo(() => {
    const result = renderedConfig.rows.map((row) => {
      const components: any[] = [];

      // Convert fields to components
      for (const field of row.fields || []) {
        const fieldAny = field as any;
        components.push({
          component: field.component,
          props: field.props,
          children: fieldAny.children,
          onClick: fieldAny.onClick,
          visible: fieldAny.visible,
          margin: fieldAny.margin,
          padding: fieldAny.padding,
          cssClass: field.cssClass,
          style: field.style,
          wrapper: fieldAny.wrapper,
          colSpan: field.colSpan,
        });
      }

      // Add explicit components
      for (const comp of row.components || []) {
        const compAny = comp as any;
        components.push({
          component: comp.component,
          props: comp.props as any,
          children: comp.children,
          onClick: comp.onClick,
          visible: compAny.visible,
          margin: compAny.margin,
          padding: compAny.padding,
          cssClass: comp.cssClass,
          style: comp.style,
          wrapper: compAny.wrapper,
          colSpan: comp.colSpan,
        });
      }

      const rowAny = row as any;
      return {
        components,
        columns: row.columns,
        gap: row.gap,
        layout: row.layout,
        style: row.style,
        visible: rowAny.visible,
        cssClass: row.cssClass,
      } as PageRowConfig;
    });
    console.log('[StatefulComponentRenderer] Converted pageRows:', result.map((r, i) => ({
      index: i,
      hasStyle: !!r.style,
      style: r.style,
      componentCount: r.components.length
    })));
    return result;
  }, [renderedConfig.rows]);

  // Render all rows
  return (
    <>
      {pageRows.map((row, index) => (
        <PageRowRenderer key={index} row={row} context={context} />
      ))}
    </>
  );
}

/**
 * Creates a React component wrapper for a Lumino Component class.
 * This allows using stateful Lumino Components with Page.addComponent().
 *
 * @param ComponentClass - The Lumino Component class
 * @returns A React component that renders the Lumino Component with state management
 *
 * @example
 * ```typescript
 * // In your component file:
 * import { createLuminoComponent } from "lumino/react";
 *
 * class MyCodeViewer extends Component<unknown, CodeViewerProps, CodeViewerState> {
 *   configure() {
 *     this.state({ activeTab: 0 });
 *     this.render((state, setState, props) => {
 *       // Build UI based on state
 *     });
 *   }
 * }
 *
 * export const LuminoCodeViewer = createLuminoComponent(MyCodeViewer);
 *
 * // In your Page:
 * this.addComponent(LuminoCodeViewer)
 *   .props({ files: [...] })
 * .end();
 * ```
 */
export function createLuminoComponent<TProps = any, TState = any>(
  ComponentClass: new (props?: TProps) => Component<any, TProps, TState>
): React.FC<TProps> {
  const WrappedComponent: React.FC<TProps> = (props: TProps) => {
    // Try to get context from PageContextContext
    const pageContext = usePageContext();

    // Create a default context if none provided
    const context = (pageContext || {
      mode: "view",
      entity: {} as any,
      originalEntity: {} as any,
      routeParams: {},
      queryParams: {},
    }) as PageContext;

    return (
      <StatefulComponentRenderer
        ComponentClass={ComponentClass}
        props={props}
        context={context}
      />
    );
  };

  // Set display name for debugging
  WrappedComponent.displayName = `Lumino(${ComponentClass.name || "Component"})`;

  return WrappedComponent;
}

export default StatefulComponentRenderer;
