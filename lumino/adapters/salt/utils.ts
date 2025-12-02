/**
 * Lumino Framework - Salt Adapter Utilities
 */

/**
 * Combine Lumino CSS classes with user-provided className.
 * All Lumino components get a base "lumino-*" class for styling.
 */
export function cx(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Create a Lumino class name for a component type.
 * Pattern: "lumino-{category} lumino-{component}"
 *
 * @example
 * luminoClass("field", "text-input") // "lumino-field lumino-text-input"
 * luminoClass("container", "dialog") // "lumino-container lumino-dialog"
 */
export function luminoClass(
  category: "field" | "container" | "layout" | "list" | "button" | "icon-button" | string,
  component: string,
  className?: string
): string {
  return cx(`lumino-${category}`, `lumino-${component}`, className);
}
