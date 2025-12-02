/**
 * Lumino Framework - Validation Types
 *
 * Types for validators and validation rules.
 */

import type { FormContext } from "./context";

// =============================================================================
// VALIDATION RULE TYPES
// =============================================================================

export type ValidateFn = (value: any, ctx: FormContext) => boolean | Promise<boolean>;

export interface ValidationRule {
  readonly type: string;
  readonly validate: ValidateFn;
  readonly message: string;
  readonly skipOn?: string[];
  readonly validateOn?: string[];
}

// =============================================================================
// VALIDATION CONFIG TYPES
// =============================================================================

export interface ValidationConfig {
  message?: string;
  skipOn?: string[];
  validateOn?: string[];
}

export interface CustomValidationConfig {
  validate: ValidateFn;
  message?: string;
  skipOn?: string[];
  validateOn?: string[];
}

// =============================================================================
// VALIDATION RESULT TYPES
// =============================================================================

export interface ValidationError {
  field: string;
  rule: string;
  message: string;
}

export type ValidationErrors = Record<string, string[]>;

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrors;
}

// =============================================================================
// FIELD VALIDATION STATE
// =============================================================================

export interface FieldValidationState {
  isValid: boolean;
  isValidating: boolean;
  errors: string[];
  touched: boolean;
  dirty: boolean;
}

// =============================================================================
// VALIDATOR BUILDER TYPES
// =============================================================================

export interface ValidatorBuilder {
  message(msg: string): ValidatorBuilder;
  skipOn(actions: string[]): ValidatorBuilder;
  validateOn(actions: string[]): ValidatorBuilder;
  build(): ValidationRule;
}
