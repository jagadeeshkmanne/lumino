/**
 * Lumino Framework - List Display Mode Markers
 *
 * These are marker components used with addList().as() to specify
 * how the list should be rendered. They don't render anything themselves -
 * they're just used to identify the display mode.
 *
 * @example
 * ```typescript
 * // Display addresses as tabs
 * this.addList("addresses")
 *   .as(Tabs)
 *   .tabLabel((addr) => addr.type)
 *   // ...
 *
 * // Display items as rows (default)
 * this.addList("items")
 *   .as(Rows)
 *   // ...
 *
 * // Display items in a table
 * this.addList("items")
 *   .as(Table)
 *   .tableColumns([...])
 *   // ...
 *
 * // Display items as cards
 * this.addList("items")
 *   .as(Cards)
 *   // ...
 * ```
 */

/**
 * Tabs display mode - renders list items as tabs
 * Each item becomes a tab, with dynamic add/remove support
 */
export function LuminoTabs() {
  return null;
}
LuminoTabs.displayName = "LuminoTabs";

/**
 * Rows display mode - renders list items as stacked rows (default)
 */
export function LuminoRows() {
  return null;
}
LuminoRows.displayName = "LuminoRows";

/**
 * Table display mode - renders list items in a table
 * Requires tableColumns configuration
 */
export function LuminoTable() {
  return null;
}
LuminoTable.displayName = "LuminoTable";

/**
 * Cards display mode - renders list items as cards in a grid
 */
export function LuminoCards() {
  return null;
}
LuminoCards.displayName = "LuminoCards";
