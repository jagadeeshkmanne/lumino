/**
 * Lumino Framework - Adapter Component Factory
 *
 * Creates components that resolve from the current adapter at render time.
 * This allows switching adapters without changing imports.
 */

import React, { forwardRef, type ComponentType, type ForwardRefExoticComponent, type RefAttributes } from "react";
import { Lumino } from "../Lumino";

/**
 * Creates a component that resolves from the current adapter at render time.
 *
 * @param name - The component name registered in the adapter's customComponents
 * @returns A React component that delegates to the adapter's implementation
 *
 * @example
 * ```tsx
 * export const LuminoBadge = createComponent<BadgeProps>("LuminoBadge");
 * <LuminoBadge value={5}>...</LuminoBadge>
 * ```
 */
export function createComponent<P extends object>(
  name: string
): ForwardRefExoticComponent<P & RefAttributes<any>> {
  const Component = forwardRef<any, P>((props, ref) => {
    const ResolvedComponent = Lumino.ui.resolve(name);

    if (!ResolvedComponent) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[Lumino] Component "${name}" not found in adapter. ` +
          `Make sure to register it with extendAdapter().`
        );
      }
      return null;
    }

    return React.createElement(ResolvedComponent, { ...props, ref });
  });

  Component.displayName = name;
  return Component as ForwardRefExoticComponent<P & RefAttributes<any>>;
}

/**
 * Creates multiple adapter-aware components from a mapping object.
 *
 * @param mapping - Object mapping Lumino names to actual components (for type inference)
 * @returns Object with adapter-aware components
 *
 * @example
 * ```tsx
 * import { Badge, Banner, Spinner } from "@salt-ds/core";
 *
 * const components = createComponents({
 *   LuminoBadge: Badge,
 *   LuminoAlert: Banner,
 *   LuminoSpinner: Spinner,
 * });
 *
 * export const { LuminoBadge, LuminoAlert, LuminoSpinner } = components;
 * ```
 */
export function createComponents<T extends Record<string, ComponentType<any>>>(
  mapping: T
): { [K in keyof T]: ForwardRefExoticComponent<React.ComponentProps<T[K]> & RefAttributes<any>> } {
  const components = {} as { [K in keyof T]: ForwardRefExoticComponent<React.ComponentProps<T[K]> & RefAttributes<any>> };

  for (const name of Object.keys(mapping) as (keyof T)[]) {
    components[name] = createComponent<React.ComponentProps<T[typeof name]>>(name as string);
  }

  return components;
}

export default createComponent;
