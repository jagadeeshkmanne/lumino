/**
 * Lumino Framework - Salt Card Adapter
 *
 * Uses createLuminoComponent with custom render for card structure.
 */

import React from "react";
import type { ReactNode } from "react";
import { Card, FlexLayout, Text } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoCard - Salt Card with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - clickable → hoverable
 *
 * Custom render needed for header/image/actions layout
 */
export const LuminoCard = createLuminoComponent(Card, {
  props: {
    clickable: "hoverable",
  },
  exclude: ["title", "image", "actions"],
  render: (transformedProps, _Card, originalProps) => {
    const {
      children,
      title,
      image,
      actions,
      clickable,
      onClick,
      className,
      style,
      "data-testid": testId,
    } = originalProps as any;

    return (
      <Card
        {...transformedProps}
        className={luminoClass("container", "card", className)}
        style={{ cursor: clickable || onClick ? "pointer" : undefined, ...style }}
        data-testid={testId}
        onClick={onClick}
      >
        {image && (
          <img src={image} alt="" style={{ width: "100%", height: "auto" }} />
        )}
        {(title || actions) && (
          <FlexLayout direction="row" align="center" gap={1}>
            {title && <Text styleAs="h4">{title}</Text>}
            {actions && (
              <div style={{ marginLeft: "auto" }} onClick={(e) => e.stopPropagation()}>
                {actions}
              </div>
            )}
          </FlexLayout>
        )}
        {children}
      </Card>
    );
  },
});

// =============================================================================
// CARD SUB-COMPONENTS (for container() API)
// =============================================================================

interface CardSubComponentProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * LuminoCardHeader - Card header using createLuminoComponent
 */
export const LuminoCardHeader = createLuminoComponent(
  ({ children, className, style }: CardSubComponentProps) => (
    <div className={luminoClass("container", "card-header", className)} style={style}>
      <FlexLayout direction="row" align="center" gap={1}>
        {children}
      </FlexLayout>
    </div>
  )
);

/**
 * LuminoCardContent - Card content/body using createLuminoComponent
 */
export const LuminoCardContent = createLuminoComponent(
  ({ children, className, style }: CardSubComponentProps) => (
    <div className={luminoClass("container", "card-content", className)} style={style}>
      {children}
    </div>
  )
);

/**
 * LuminoCardFooter - Card footer using createLuminoComponent
 */
export const LuminoCardFooter = createLuminoComponent(
  ({ children, className, style }: CardSubComponentProps) => (
    <div className={luminoClass("container", "card-footer", className)} style={style}>
      <FlexLayout direction="row" align="center" gap={1} justify="end">
        {children}
      </FlexLayout>
    </div>
  )
);
