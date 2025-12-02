/**
 * Lumino Framework - Salt Column Adapter
 *
 * Uses createLuminoComponent to adapt Salt's FlexItem.
 */

import { FlexItem } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoColumn - Salt FlexItem with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - span → grow
 *
 * Note: When used inside LuminoRow, the span is handled by the Row's layout prop.
 * This component is for standalone column usage.
 */
export const LuminoColumn = createLuminoComponent(FlexItem, {
  props: {
    span: "grow",
  },
  defaults: {
    basis: 0,
  },
  // Exclude Lumino-specific props that shouldn't be passed to FlexItem
  exclude: ["columnIndex", "totalColumns"],
  render: (transformedProps, _FlexItem, originalProps) => {
    const {
      children,
      span = 1,
      className,
      style,
      "data-testid": testId,
    } = originalProps as any;

    // Remove columnIndex and totalColumns from transformedProps to avoid React warning
    const { columnIndex, totalColumns, ...flexItemProps } = transformedProps as any;

    return (
      <FlexItem
        {...flexItemProps}
        grow={span}
        basis={0}
        className={luminoClass("layout", "column", className)}
        style={{ minWidth: 0, ...style }}
        data-testid={testId}
      >
        {children}
      </FlexItem>
    );
  },
});
