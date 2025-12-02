/**
 * Lumino Framework - Salt Row Adapter
 *
 * Uses createLuminoStructure with Container + Item pattern.
 */

import { FlexLayout, FlexItem } from "@salt-ds/core";
import { createLuminoStructure } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoRow - Salt FlexLayout (row) with Lumino interface
 *
 * Uses createLuminoStructure with:
 * - Container: FlexLayout (direction="row")
 * - Item: FlexItem (with grow based on layout array)
 *
 * Lumino Props:
 * - gap → FlexLayout gap
 * - layout → Array of flex grow values [1, 2, 1] means 1:2:1 ratio
 *
 * @example
 * ```tsx
 * <LuminoRow gap={2} layout={[1, 2, 1]}>
 *   <Field1 />
 *   <Field2 />  {/* This gets 2x the space *\/}
 *   <Field3 />
 * </LuminoRow>
 * ```
 */
export const LuminoRow = createLuminoStructure({
  Container: FlexLayout,
  Item: FlexItem,
  containerProps: ({ gap = 2, className, style, "data-testid": testId }) => ({
    direction: "row" as const,
    gap,
    className: luminoClass("layout", "row", className),
    style: { width: "100%", ...style },
    "data-testid": testId,
  }),
  itemProps: (_child, index, { layout }) => ({
    grow: layout?.[index] ?? 1,
    basis: 0,
    style: { minWidth: 0 },
  }),
  displayName: "LuminoRow",
});
