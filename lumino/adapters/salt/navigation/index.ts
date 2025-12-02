/**
 * Lumino Framework - Salt Navigation Adapter
 *
 * Maps Lumino navigation interfaces to Salt DS components.
 * Includes Menu, Pagination, Stepper, and Accordion.
 */

import type { ComponentType } from "react";

// Import individual components
import { LuminoMenu } from "./Menu";
import { LuminoPagination } from "./Pagination";
import { LuminoStepper } from "./Stepper";
import { LuminoAccordion } from "./Accordion";

/**
 * All navigation components for direct use
 */
export const saltNavigationComponents: Record<string, ComponentType<any>> = {
  Menu: LuminoMenu,
  Pagination: LuminoPagination,
  Stepper: LuminoStepper,
  Accordion: LuminoAccordion,
};

// Re-export individual components
export { LuminoMenu } from "./Menu";
export { LuminoPagination } from "./Pagination";
export { LuminoStepper } from "./Stepper";
export { LuminoAccordion } from "./Accordion";

// Legacy aliases for backward compatibility
export { LuminoMenu as SaltMenu } from "./Menu";
export { LuminoPagination as SaltPagination } from "./Pagination";
export { LuminoStepper as SaltStepper } from "./Stepper";
export { LuminoAccordion as SaltAccordion } from "./Accordion";
