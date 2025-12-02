/**
 * Lumino Framework - Salt Panel Adapter
 *
 * Uses createLuminoComponent with custom render for panel structure.
 * Uses Salt's Accordion for collapsible panels, Panel for simple containers.
 */

import {
  Panel,
  Accordion,
  AccordionHeader,
  AccordionPanel,
  StackLayout,
  Text,
} from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoPanel - Salt Panel/Accordion with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - collapsed → expanded (inverted for Accordion)
 * - variant → variant (mapped)
 *
 * Lumino Events → Salt Events:
 * - onToggle() ← onToggle(event)
 *
 * Custom render needed for:
 * - Conditional Accordion vs Panel rendering
 * - Header structure with title, subtitle, headerActions
 */
export const LuminoPanel = createLuminoComponent(Panel, {
  exclude: ["title", "subtitle", "collapsible", "collapsed", "onToggle", "headerActions", "footer", "variant"],
  render: (_transformedProps, _Panel, originalProps) => {
    const {
      children,
      title,
      subtitle,
      collapsible,
      collapsed,
      onToggle,
      headerActions,
      footer,
      variant,
      className,
      style,
      "data-testid": testId,
    } = originalProps as any;

    // Normalize onToggle: Lumino uses () => void
    const handleToggle = onToggle ? () => onToggle() : undefined;

    // Use Accordion for collapsible panels
    if (collapsible) {
      return (
        <Accordion
          value="panel"
          expanded={!collapsed}
          onToggle={handleToggle}
          className={luminoClass("container", "panel", className)}
          style={style}
          data-testid={testId}
        >
          <AccordionHeader>
            <StackLayout gap={0}>
              {title && <Text styleAs="h4">{title}</Text>}
              {subtitle && <Text styleAs="label" color="secondary">{subtitle}</Text>}
            </StackLayout>
          </AccordionHeader>
          <AccordionPanel>
            {children}
            {footer}
          </AccordionPanel>
        </Accordion>
      );
    }

    // Use Panel for non-collapsible
    // Map Lumino variant to Salt variant
    const saltVariant = variant === "outlined" ? "primary" :
                        variant === "elevated" ? "secondary" :
                        undefined;

    return (
      <Panel
        variant={saltVariant}
        className={luminoClass("container", "panel", className)}
        style={style}
        data-testid={testId}
      >
        {(title || headerActions) && (
          <StackLayout direction="row" align="center" style={{ marginBottom: "var(--salt-spacing-100)" }}>
            <StackLayout gap={0}>
              {title && <Text styleAs="h4">{title}</Text>}
              {subtitle && <Text styleAs="label" color="secondary">{subtitle}</Text>}
            </StackLayout>
            {headerActions && <div style={{ marginLeft: "auto" }}>{headerActions}</div>}
          </StackLayout>
        )}
        {children}
        {footer}
      </Panel>
    );
  },
});
