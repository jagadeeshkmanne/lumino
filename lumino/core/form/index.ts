/**
 * Lumino Framework - Form Module Exports
 */

export {
  Form,
  FormSection,
  FieldGroup,
  Component,
  createFormState,
  isFormDirty,
  getChangedFields,
  resetFormValues,
} from "./Form";

export type { ComponentStateConfig } from "./Form";

export {
  DependencyManager,
  createDependencyManager,
} from "./DependencyManager";

export type { DependencyEntry, DependencyTriggerResult } from "./DependencyManager";
