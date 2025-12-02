/**
 * Lumino Framework - Salt Layout Adapter
 *
 * Maps Lumino layout interfaces to Salt DS components.
 * All components use "Lumino" prefix for consistency.
 */

import type { LayoutAdapter } from "../../../core/types/ui";

// Import individual layout components
import { LuminoRow } from "./Row";
import { LuminoColumn } from "./Column";
import { LuminoSection } from "./Section";
import { LuminoForm } from "./Form";
import { LuminoFieldWrapper } from "./FieldWrapper";
import { LuminoErrorMessage } from "./ErrorMessage";

/**
 * Salt Layout Adapter
 */
export const saltLayoutAdapter: LayoutAdapter = {
  Row: LuminoRow as any,
  Column: LuminoColumn as any,
  Section: LuminoSection as any,
  Form: LuminoForm as any,
  FieldWrapper: LuminoFieldWrapper as any,
  ErrorMessage: LuminoErrorMessage as any,
};

// Re-export individual components
export { LuminoRow } from "./Row";
export { LuminoColumn } from "./Column";
export { LuminoSection } from "./Section";
export { LuminoForm } from "./Form";
export { LuminoFieldWrapper } from "./FieldWrapper";
export { LuminoErrorMessage } from "./ErrorMessage";

// Legacy aliases for backward compatibility
export { LuminoRow as SaltRow } from "./Row";
export { LuminoColumn as SaltColumn } from "./Column";
export { LuminoSection as SaltSection } from "./Section";
export { LuminoForm as SaltForm } from "./Form";
export { LuminoFieldWrapper as SaltFieldWrapper } from "./FieldWrapper";
export { LuminoErrorMessage as SaltErrorMessage } from "./ErrorMessage";

// App Layout Renderer
export { AppLayoutRenderer, type AppLayoutRendererProps, LuminoNavRenderer, LuminoNavRenderer as SaltNavRenderer } from "./AppLayoutRenderer";
