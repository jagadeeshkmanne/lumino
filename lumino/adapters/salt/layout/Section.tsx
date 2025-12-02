/**
 * Lumino Framework - Salt Section Adapter
 *
 * Uses createLuminoComponent with custom render for collapsible section.
 */

import React, { useState } from "react";
import { StackLayout, FlexLayout } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

// Placeholder component for typing
const SectionPlaceholder: React.FC<any> = () => null;

/**
 * LuminoSection - Collapsible section with Salt styling
 *
 * Lumino Props → Salt Props:
 * - rowGap → gap (for StackLayout)
 *
 * Lumino Events → Salt Events:
 * - onToggle() ← onClick (on header)
 *
 * Custom render needed for collapsible header and content structure
 */
export const LuminoSection = createLuminoComponent(SectionPlaceholder, {
  render: (_transformedProps, _Component, originalProps) => {
    const {
      children,
      title,
      collapsible,
      collapsed: controlledCollapsed,
      onToggle,
      rowGap = 2,
      headerActions,
      className,
      style,
      "data-testid": testId,
    } = originalProps as any;

    // Support both controlled and uncontrolled collapse
    // Note: Using useState inside render requires the component to be stable
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const collapsed = controlledCollapsed ?? internalCollapsed;

    const handleToggle = () => {
      if (onToggle) {
        onToggle();
      } else {
        setInternalCollapsed(!internalCollapsed);
      }
    };

    return (
      <div
        className={luminoClass("layout", "section", className)}
        style={{ marginBottom: "var(--salt-spacing-50, 4px)", ...style }}
        data-testid={testId}
      >
        {title && (
          <FlexLayout
            direction="row"
            align="center"
            gap={2}
            onClick={collapsible ? handleToggle : undefined}
            style={{
              cursor: collapsible ? "pointer" : "default",
              fontSize: "var(--salt-text-fontSize-lg, 16px)",
              fontWeight: "var(--salt-text-fontWeight-strong, 600)",
              marginBottom: "var(--salt-spacing-100, 8px)",
              paddingBottom: "var(--salt-spacing-50, 4px)",
              borderBottom: "1px solid var(--salt-separable-primary-borderColor, #e0e0e0)",
              userSelect: collapsible ? "none" : "auto",
            }}
          >
            {collapsible && (
              <span style={{ transition: "transform 0.2s" }}>
                {collapsed ? "▶" : "▼"}
              </span>
            )}
            {typeof title === "string" ? (
              <span style={{ flex: 1 }}>{title}</span>
            ) : (
              <div style={{ flex: 1 }}>{title}</div>
            )}
            {headerActions && (
              <div
                style={{ marginLeft: "auto" }}
                onClick={(e) => e.stopPropagation()}
              >
                {headerActions}
              </div>
            )}
          </FlexLayout>
        )}
        {!collapsed && (
          <StackLayout gap={rowGap}>
            {children}
          </StackLayout>
        )}
      </div>
    );
  },
});
