/**
 * Lumino Framework - Salt Accordion Adapter
 *
 * Uses createLuminoComponent to map Lumino AccordionProps to Salt Accordion.
 */

import React from "react";
import { Accordion, AccordionPanel, AccordionHeader } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { AccordionProps } from "../../../core/types/ui";

/**
 * LuminoAccordion - Salt Accordion with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - items → AccordionPanel components
 * - expandedKeys → expandedSectionIds (controlled) or defaultExpandedSectionIds
 * - multiple → Not directly supported by Salt; uses value array
 *
 * @example
 * ```tsx
 * <LuminoAccordion
 *   items={[
 *     { key: "section1", header: "Section 1", content: <div>Content 1</div> },
 *     { key: "section2", header: "Section 2", content: <div>Content 2</div> },
 *   ]}
 *   defaultExpandedKeys={["section1"]}
 * />
 * ```
 */
export const LuminoAccordion = createLuminoComponent(Accordion, {
  props: {
    expandedKeys: { to: "expandedSectionIds" },
    defaultExpandedKeys: { to: "defaultExpandedSectionIds" },
    className: {
      to: "className",
      transform: (className) => luminoClass("navigation", "accordion", className),
    },
  },
  exclude: ["items", "multiple", "onExpandedChange"],
  render: (transformedProps, _Accordion, originalProps) => {
    const { items } = originalProps as AccordionProps;

    return (
      <Accordion {...transformedProps}>
        {items.map((item) => (
          <AccordionPanel key={item.key}>
            <AccordionHeader>{item.header}</AccordionHeader>
            {item.content}
          </AccordionPanel>
        ))}
      </Accordion>
    );
  },
});

// Legacy alias for backward compatibility
export { LuminoAccordion as SaltAccordion };
