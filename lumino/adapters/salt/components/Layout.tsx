/**
 * Lumino Framework - Salt Layout Adapter
 *
 * Maps Lumino layout interfaces to Salt DS components.
 */

import React from "react";
import { StackLayout, FlowLayout, Divider, GridLayout, GridItem, SplitLayout, BorderLayout, BorderItem } from "@salt-ds/core";
import type { PropsWithChildren, HTMLAttributes, FC } from "react";

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

export interface LuminoStackLayoutProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  gap?: number | 0 | 1 | 2 | 3;
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
}

export const LuminoStackLayout: FC<LuminoStackLayoutProps> = ({
  children,
  gap,
  direction,
  align,
  ...props
}) => {
  return (
    <StackLayout gap={gap} direction={direction} align={align} {...props}>
      {children}
    </StackLayout>
  );
};

export interface LuminoFlowLayoutProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  gap?: number | 0 | 1 | 2 | 3;
  justify?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
}

export const LuminoFlowLayout: FC<LuminoFlowLayoutProps> = ({
  children,
  gap,
  justify,
  ...props
}) => {
  return (
    <FlowLayout gap={gap} justify={justify} {...props}>
      {children}
    </FlowLayout>
  );
};

export interface LuminoDividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "primary" | "secondary" | "tertiary";
}

export const LuminoDivider: FC<LuminoDividerProps> = ({
  orientation,
  variant,
  ...props
}) => {
  return <Divider orientation={orientation} variant={variant} {...props} />;
};

// =============================================================================
// GRID LAYOUT COMPONENTS
// =============================================================================

export interface LuminoGridLayoutProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  columns?: number | string;
  rows?: number | string;
  gap?: number | string;
  columnGap?: number | string;
  rowGap?: number | string;
  margin?: number | string;
  padding?: number | string;
}

export const LuminoGridLayout: FC<LuminoGridLayoutProps> = ({
  children,
  columns,
  rows,
  gap,
  columnGap,
  rowGap,
  margin,
  padding,
  ...props
}) => {
  return (
    <GridLayout
      columns={columns}
      rows={rows}
      gap={gap}
      columnGap={columnGap}
      rowGap={rowGap}
      margin={margin}
      padding={padding}
      {...props}
    >
      {children}
    </GridLayout>
  );
};

export interface LuminoGridItemProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  colSpan?: number | "auto";
  rowSpan?: number | "auto";
  horizontalAlignment?: "start" | "end" | "center" | "stretch";
  verticalAlignment?: "start" | "end" | "center" | "stretch";
  margin?: number | string;
  padding?: number | string;
}

export const LuminoGridItem: FC<LuminoGridItemProps> = ({
  children,
  colSpan,
  rowSpan,
  horizontalAlignment,
  verticalAlignment,
  margin,
  padding,
  ...props
}) => {
  return (
    <GridItem
      colSpan={colSpan}
      rowSpan={rowSpan}
      horizontalAlignment={horizontalAlignment}
      verticalAlignment={verticalAlignment}
      margin={margin}
      padding={padding}
      {...props}
    >
      {children}
    </GridItem>
  );
};

// =============================================================================
// SPLIT LAYOUT COMPONENT
// =============================================================================

export interface LuminoSplitLayoutProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  gap?: number;
  direction?: "row" | "column";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  startItem?: React.ReactNode;
  endItem?: React.ReactNode;
}

export const LuminoSplitLayout: FC<LuminoSplitLayoutProps> = ({
  children,
  gap,
  direction,
  align,
  startItem,
  endItem,
  ...props
}) => {
  return (
    <SplitLayout
      gap={gap}
      direction={direction}
      align={align}
      startItem={startItem}
      endItem={endItem}
      {...props}
    >
      {children}
    </SplitLayout>
  );
};

// =============================================================================
// BORDER LAYOUT COMPONENT
// =============================================================================

export interface LuminoBorderLayoutProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  gap?: number;
  columnGap?: number;
  rowGap?: number;
}

export const LuminoBorderLayout: FC<LuminoBorderLayoutProps> = ({
  children,
  gap,
  columnGap,
  rowGap,
  ...props
}) => {
  return (
    <BorderLayout gap={gap} columnGap={columnGap} rowGap={rowGap} {...props}>
      {children}
    </BorderLayout>
  );
};

export interface LuminoBorderItemProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  position: "north" | "south" | "east" | "west" | "center";
}

export const LuminoBorderItem: FC<LuminoBorderItemProps> = ({
  children,
  position,
  ...props
}) => {
  return (
    <BorderItem position={position} {...props}>
      {children}
    </BorderItem>
  );
};
