/**
 * Lumino Framework - Validation Runner
 *
 * Orchestrates validation for forms, handling async validations
 * and action-based validation modes.
 *
 * Supports two visibility types:
 * - Conditional: Skip validation when field is hidden
 * - Access-based: Run validation even when field is hidden (data preserved)
 */

import type { ValidationRule, ValidationErrors, ValidationResult } from "../types";
import type { FormContext } from "../types/context";
import type { VisibilityConfig } from "../types/form";
import { shouldRunRule } from "./Validators";
import { evaluateVisibility } from "../utils/visibility";

// =============================================================================
// PATH UTILITIES - Handle nested paths like "addresses[0].street"
// =============================================================================

/**
 * Parse a path string into segments
 * "addresses[0].street" -> ["addresses", 0, "street"]
 */
function parseFieldPath(path: string): (string | number)[] {
  const segments: (string | number)[] = [];
  const regex = /([^.\[\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    if (match[1] !== undefined) {
      segments.push(match[1]);
    } else if (match[2] !== undefined) {
      segments.push(parseInt(match[2], 10));
    }
  }
  return segments;
}

/**
 * Get a nested value from an object using a path
 */
function getValueByPath(obj: any, path: string): any {
  // If path doesn't contain brackets or dots, use direct access
  if (!path.includes('[') && !path.includes('.')) {
    return obj[path];
  }

  const segments = parseFieldPath(path);
  let value = obj;
  for (const segment of segments) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = value[segment];
  }
  return value;
}

// =============================================================================
// VALIDATION RUNNER
// =============================================================================

/**
 * Validation Runner handles form-level validation orchestration.
 */
export class ValidationRunner {
  private _debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private _pendingValidations: Map<string, Promise<string[]>> = new Map();

  /**
   * Validate a single field
   */
  async validateField(
    field: string,
    value: any,
    rules: ValidationRule[],
    ctx: FormContext,
    actionName: string = "default"
  ): Promise<string[]> {
    const errors: string[] = [];

    for (const rule of rules) {
      // Check if rule should run for this action
      if (!shouldRunRule(rule, actionName)) {
        continue;
      }

      try {
        const result = await rule.validate(value, ctx);
        if (!result) {
          errors.push(rule.message);
        }
      } catch (error) {
        // If validation throws, treat as failed
        errors.push(rule.message);
      }
    }

    return errors;
  }

  /**
   * Validate all fields in a form
   * @param fieldVisibility - Optional map of field name to visibility config for proper skip logic
   */
  async validateForm(
    fieldRules: Map<string, ValidationRule[]>,
    values: Record<string, any>,
    ctx: FormContext,
    actionName: string = "default",
    fieldVisibility?: Map<string, VisibilityConfig>
  ): Promise<ValidationResult> {
    const errors: ValidationErrors = {};
    let valid = true;

    // Run all field validations in parallel
    const validationPromises: Array<{
      field: string;
      promise: Promise<string[]>;
    }> = [];

    for (const [field, rules] of fieldRules) {
      // Check visibility if provided
      if (fieldVisibility) {
        const visibilityConfig = fieldVisibility.get(field);
        const visResult = evaluateVisibility(visibilityConfig, ctx);

        // Skip validation only if:
        // 1. Field is not visible AND
        // 2. It's a conditional hide (not access-based)
        if (!visResult.isVisible && visResult.shouldSkipValidation) {
          continue;
        }
      } else {
        // Legacy fallback: use ctx.isFieldHidden
        if (ctx.isFieldHidden(field)) {
          continue;
        }
      }

      // Use getValueByPath to handle nested paths like "addresses[0].street"
      const value = getValueByPath(values, field);
      validationPromises.push({
        field,
        promise: this.validateField(field, value, rules, ctx, actionName),
      });
    }

    // Wait for all validations
    const results = await Promise.all(
      validationPromises.map(async ({ field, promise }) => ({
        field,
        errors: await promise,
      }))
    );

    // Collect errors
    for (const { field, errors: fieldErrors } of results) {
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        valid = false;
      }
    }

    return { valid, errors };
  }

  /**
   * Validate field with debounce (useful for async validations)
   */
  validateFieldDebounced(
    field: string,
    value: any,
    rules: ValidationRule[],
    ctx: FormContext,
    actionName: string = "default",
    debounceMs: number = 300,
    callback: (errors: string[]) => void
  ): void {
    // Clear existing timer
    const existingTimer = this._debounceTimers.get(field);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      this._debounceTimers.delete(field);

      const errors = await this.validateField(field, value, rules, ctx, actionName);
      callback(errors);
    }, debounceMs);

    this._debounceTimers.set(field, timer);
  }

  /**
   * Cancel pending debounced validation
   */
  cancelDebounced(field: string): void {
    const timer = this._debounceTimers.get(field);
    if (timer) {
      clearTimeout(timer);
      this._debounceTimers.delete(field);
    }
  }

  /**
   * Cancel all pending debounced validations
   */
  cancelAllDebounced(): void {
    for (const timer of this._debounceTimers.values()) {
      clearTimeout(timer);
    }
    this._debounceTimers.clear();
  }

  /**
   * Check if there are pending validations for a field
   */
  hasPendingValidation(field: string): boolean {
    return this._debounceTimers.has(field);
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Default validation runner instance
 */
export const validationRunner = new ValidationRunner();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Run validation for specific action
 */
export async function validateForAction(
  fieldRules: Map<string, ValidationRule[]>,
  values: Record<string, any>,
  ctx: FormContext,
  actionName: string
): Promise<ValidationResult> {
  return validationRunner.validateForm(fieldRules, values, ctx, actionName);
}

/**
 * Check if all rules pass for a value (sync only)
 */
export function validateSync(
  value: any,
  rules: ValidationRule[],
  ctx: FormContext,
  actionName: string = "default"
): string[] {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!shouldRunRule(rule, actionName)) {
      continue;
    }

    try {
      const result = rule.validate(value, ctx);
      // Only handle sync results
      if (typeof result === "boolean" && !result) {
        errors.push(rule.message);
      }
    } catch {
      errors.push(rule.message);
    }
  }

  return errors;
}
