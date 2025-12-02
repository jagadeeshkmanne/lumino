/**
 * Lumino Framework - Salt Typography Adapter
 *
 * Maps Lumino typography interfaces to Salt DS components.
 */

import React from "react";
import { H1, H2, H3, H4, Text, Label } from "@salt-ds/core";
import type { PropsWithChildren, HTMLAttributes, FC } from "react";

// =============================================================================
// HEADING COMPONENTS
// =============================================================================

export interface LuminoHeadingProps extends PropsWithChildren<HTMLAttributes<HTMLHeadingElement>> {
  styleAs?: "h1" | "h2" | "h3" | "h4";
}

export const LuminoH1: FC<LuminoHeadingProps> = ({ children, styleAs, ...props }) => {
  // Filter out incompatible props
  const { color, ...rest } = props as any;
  return <H1 styleAs={styleAs} {...rest}>{children}</H1>;
};

export const LuminoH2: FC<LuminoHeadingProps> = ({ children, styleAs, ...props }) => {
  const { color, ...rest } = props as any;
  return <H2 styleAs={styleAs} {...rest}>{children}</H2>;
};

export const LuminoH3: FC<LuminoHeadingProps> = ({ children, styleAs, ...props }) => {
  const { color, ...rest } = props as any;
  return <H3 styleAs={styleAs} {...rest}>{children}</H3>;
};

export const LuminoH4: FC<LuminoHeadingProps> = ({ children, styleAs, ...props }) => {
  const { color, ...rest } = props as any;
  return <H4 styleAs={styleAs} {...rest}>{children}</H4>;
};

// =============================================================================
// TEXT COMPONENTS
// =============================================================================

type SaltTextColor = "primary" | "secondary" | "inherit" | "error" | "warning" | "success" | "info";

export interface LuminoTextProps extends PropsWithChildren<HTMLAttributes<HTMLSpanElement>> {
  color?: SaltTextColor | "accent";
  /** Alias for color - for convenience */
  variant?: SaltTextColor | "accent";
  styleAs?: "h1" | "h2" | "h3" | "h4" | "label" | "notation" | "action";
  disabled?: boolean;
  maxRows?: number;
}

export const LuminoText: FC<LuminoTextProps> = ({ children, color, variant, styleAs, disabled, maxRows, ...props }) => {
  // Support both color and variant props (variant is alias for color)
  const colorValue = color ?? variant;
  // Map "accent" to "info" for Salt compatibility
  const saltColor: SaltTextColor | undefined = colorValue === "accent" ? "info" : colorValue;
  return <Text color={saltColor} styleAs={styleAs} disabled={disabled} maxRows={maxRows} {...props}>{children}</Text>;
};

export interface LuminoLabelProps extends PropsWithChildren<HTMLAttributes<HTMLLabelElement>> {
  disabled?: boolean;
}

export const LuminoLabel: FC<LuminoLabelProps> = ({ children, disabled, ...props }) => {
  const { color, ...rest } = props as any;
  return <Label disabled={disabled} {...rest}>{children}</Label>;
};
