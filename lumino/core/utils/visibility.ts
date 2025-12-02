/**
 * Lumino Framework - Visibility Utilities
 *
 * Helper functions for evaluating visibility conditions.
 */

import type { FormContext } from "../types/context";
import type { VisibilityConfig, VisibilityCondition, VisibilityType } from "../types/form";

// =============================================================================
// VISIBILITY EVALUATION
// =============================================================================

/**
 * Result of evaluating visibility
 */
export interface VisibilityResult {
  /** Whether the element should be rendered */
  isVisible: boolean;
  /** The type of visibility that caused hiding (if hidden) */
  hiddenBy?: VisibilityType;
  /** Whether data should be cleared when hidden */
  shouldClearData: boolean;
  /** Whether validation should be skipped when hidden */
  shouldSkipValidation: boolean;
}

/**
 * Evaluate a visibility condition
 */
function evaluateCondition(
  condition: VisibilityCondition | undefined,
  ctx: FormContext
): boolean {
  if (condition === undefined) {
    return false; // No condition = not triggered
  }
  if (typeof condition === "boolean") {
    return condition;
  }
  return condition(ctx);
}

/**
 * Evaluate complete visibility configuration.
 *
 * Priority order:
 * 1. hide/visible (conditional) - checked first
 * 2. hideByAccess/visibleByAccess (access-based) - checked second
 *
 * If multiple conditions are set, they are combined:
 * - hide + hideByAccess: hidden if either is true
 * - visible + visibleByAccess: must be visible by both to show
 */
export function evaluateVisibility(
  config: VisibilityConfig | undefined,
  ctx: FormContext
): VisibilityResult {
  // Default: visible, no special behavior
  if (!config) {
    return {
      isVisible: true,
      shouldClearData: false,
      shouldSkipValidation: false,
    };
  }

  const {
    hide,
    visible,
    hideByAccess,
    visibleByAccess,
  } = config;

  // Evaluate conditional visibility (hide/visible)
  let isConditionallyHidden = false;
  if (hide !== undefined) {
    isConditionallyHidden = evaluateCondition(hide, ctx);
  } else if (visible !== undefined) {
    isConditionallyHidden = !evaluateCondition(visible, ctx);
  }

  // Evaluate access-based visibility (hideByAccess/visibleByAccess)
  let isAccessHidden = false;
  if (hideByAccess !== undefined) {
    isAccessHidden = evaluateCondition(hideByAccess, ctx);
  } else if (visibleByAccess !== undefined) {
    isAccessHidden = !evaluateCondition(visibleByAccess, ctx);
  }

  // Determine final visibility
  const isVisible = !isConditionallyHidden && !isAccessHidden;

  // Determine behavior based on what caused hiding
  if (isConditionallyHidden) {
    return {
      isVisible: false,
      hiddenBy: "conditional",
      shouldClearData: true,
      shouldSkipValidation: true,
    };
  }

  if (isAccessHidden) {
    return {
      isVisible: false,
      hiddenBy: "access",
      shouldClearData: false,
      shouldSkipValidation: false, // Access-hidden fields still validate
    };
  }

  return {
    isVisible: true,
    shouldClearData: false,
    shouldSkipValidation: false,
  };
}

/**
 * Check if a field should be visible (simple check)
 */
export function isFieldVisible(
  config: VisibilityConfig | undefined,
  ctx: FormContext
): boolean {
  return evaluateVisibility(config, ctx).isVisible;
}

/**
 * Check if validation should be skipped for a field
 */
export function shouldSkipValidation(
  config: VisibilityConfig | undefined,
  ctx: FormContext
): boolean {
  const result = evaluateVisibility(config, ctx);
  return !result.isVisible && result.shouldSkipValidation;
}

/**
 * Check if data should be cleared when field becomes hidden
 */
export function shouldClearData(
  config: VisibilityConfig | undefined,
  ctx: FormContext
): boolean {
  const result = evaluateVisibility(config, ctx);
  return !result.isVisible && result.shouldClearData;
}

/**
 * Get all field names that should have their data cleared
 * based on current visibility state.
 */
export function getFieldsToClear(
  fieldConfigs: Map<string, { visibility?: VisibilityConfig }>,
  ctx: FormContext,
  previousVisibility: Map<string, boolean>
): string[] {
  const fieldsToClear: string[] = [];

  for (const [fieldName, config] of fieldConfigs) {
    const wasVisible = previousVisibility.get(fieldName) ?? true;
    const result = evaluateVisibility(config.visibility, ctx);

    // Field just became hidden and should clear data
    if (wasVisible && !result.isVisible && result.shouldClearData) {
      fieldsToClear.push(fieldName);
    }
  }

  return fieldsToClear;
}

/**
 * Get fields that should have validation skipped
 */
export function getFieldsToSkipValidation(
  fieldConfigs: Map<string, { visibility?: VisibilityConfig }>,
  ctx: FormContext
): Set<string> {
  const skipFields = new Set<string>();

  for (const [fieldName, config] of fieldConfigs) {
    if (shouldSkipValidation(config.visibility, ctx)) {
      skipFields.add(fieldName);
    }
  }

  return skipFields;
}
