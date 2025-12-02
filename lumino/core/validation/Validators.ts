/**
 * Lumino Framework - Validators
 *
 * Static factory class for creating validation rules.
 * Provides built-in validators and custom validation support.
 */

import type {
  ValidationRule,
  ValidationConfig,
  CustomValidationConfig,
  ValidateFn,
} from "../types";

// =============================================================================
// DEFAULT MESSAGES
// =============================================================================

const DEFAULT_MESSAGES = {
  required: "This field is required",
  email: "Please enter a valid email address",
  pattern: "Please enter a valid value",
  minLength: "Must be at least {min} characters",
  maxLength: "Must be at most {max} characters",
  min: "Must be at least {min}",
  max: "Must be at most {max}",
  url: "Please enter a valid URL",
  numeric: "Please enter a valid number",
  integer: "Please enter a whole number",
  alphanumeric: "Please enter only letters and numbers",
  date: "Please enter a valid date",
  phone: "Please enter a valid phone number",
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a validation rule with common properties
 */
function createRule(
  type: string,
  validate: ValidateFn,
  message: string,
  config?: ValidationConfig
): ValidationRule {
  // Validate that skipOn and validateOn are not both provided
  if (config?.skipOn && config?.validateOn) {
    throw new Error(
      `Validator "${type}": Cannot use both "skipOn" and "validateOn" together. Use one or the other.`
    );
  }

  return {
    type,
    validate,
    message: config?.message ?? message,
    skipOn: config?.skipOn,
    validateOn: config?.validateOn,
  };
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Format message with parameters
 */
function formatMessage(message: string, params: Record<string, any>): string {
  return message.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}

// =============================================================================
// VALIDATORS CLASS
// =============================================================================

export class Validators {
  /**
   * Required field validator
   *
   * @example
   * Validators.required()
   * Validators.required({ message: "Name is required" })
   * Validators.required({ skipOn: ["draft"] })
   */
  static required(): ValidationRule;
  static required(config: ValidationConfig): ValidationRule;
  static required(config?: ValidationConfig): ValidationRule {
    return createRule(
      "required",
      (value) => !isEmpty(value),
      DEFAULT_MESSAGES.required,
      config
    );
  }

  /**
   * Email format validator
   *
   * @example
   * Validators.email()
   * Validators.email("Invalid email format")
   * Validators.email({ message: "Invalid email", skipOn: ["draft"] })
   */
  static email(): ValidationRule;
  static email(message: string): ValidationRule;
  static email(config: ValidationConfig): ValidationRule;
  static email(arg?: string | ValidationConfig): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return createRule(
      "email",
      (value) => isEmpty(value) || emailRegex.test(String(value)),
      DEFAULT_MESSAGES.email,
      config
    );
  }

  /**
   * Pattern/Regex validator
   *
   * @example
   * Validators.pattern(/^\d{10}$/)
   * Validators.pattern(/^\d{10}$/, "Must be 10 digits")
   * Validators.pattern(/^\d{10}$/, { message: "Invalid", skipOn: ["draft"] })
   */
  static pattern(regex: RegExp): ValidationRule;
  static pattern(regex: RegExp, message: string): ValidationRule;
  static pattern(regex: RegExp, config: ValidationConfig): ValidationRule;
  static pattern(
    regex: RegExp,
    arg?: string | ValidationConfig
  ): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;

    return createRule(
      "pattern",
      (value) => isEmpty(value) || regex.test(String(value)),
      DEFAULT_MESSAGES.pattern,
      config
    );
  }

  /**
   * Minimum length validator
   *
   * @example
   * Validators.minLength(3)
   * Validators.minLength(3, "Too short")
   * Validators.minLength(3, { message: "Min 3 chars", skipOn: ["draft"] })
   */
  static minLength(length: number): ValidationRule;
  static minLength(length: number, message: string): ValidationRule;
  static minLength(length: number, config: ValidationConfig): ValidationRule;
  static minLength(
    length: number,
    arg?: string | ValidationConfig
  ): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;

    return createRule(
      "minLength",
      (value) => {
        if (isEmpty(value)) return true;
        const len =
          typeof value === "string" ? value.length : String(value).length;
        return len >= length;
      },
      formatMessage(config?.message ?? DEFAULT_MESSAGES.minLength, {
        min: length,
      }),
      config
    );
  }

  /**
   * Maximum length validator
   *
   * @example
   * Validators.maxLength(100)
   * Validators.maxLength(100, "Too long")
   * Validators.maxLength(100, { message: "Max 100 chars", skipOn: ["draft"] })
   */
  static maxLength(length: number): ValidationRule;
  static maxLength(length: number, message: string): ValidationRule;
  static maxLength(length: number, config: ValidationConfig): ValidationRule;
  static maxLength(
    length: number,
    arg?: string | ValidationConfig
  ): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;

    return createRule(
      "maxLength",
      (value) => {
        if (isEmpty(value)) return true;
        const len =
          typeof value === "string" ? value.length : String(value).length;
        return len <= length;
      },
      formatMessage(config?.message ?? DEFAULT_MESSAGES.maxLength, {
        max: length,
      }),
      config
    );
  }

  /**
   * Minimum value validator (for numbers)
   *
   * @example
   * Validators.min(0)
   * Validators.min(0, "Must be positive")
   * Validators.min(18, { message: "Must be 18+", validateOn: ["submit"] })
   */
  static min(value: number): ValidationRule;
  static min(value: number, message: string): ValidationRule;
  static min(value: number, config: ValidationConfig): ValidationRule;
  static min(minValue: number, arg?: string | ValidationConfig): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;

    return createRule(
      "min",
      (value) => {
        if (isEmpty(value)) return true;
        const num = Number(value);
        return !isNaN(num) && num >= minValue;
      },
      formatMessage(config?.message ?? DEFAULT_MESSAGES.min, { min: minValue }),
      config
    );
  }

  /**
   * Maximum value validator (for numbers)
   *
   * @example
   * Validators.max(100)
   * Validators.max(100, "Too high")
   * Validators.max(65, { message: "Max age 65", validateOn: ["submit"] })
   */
  static max(value: number): ValidationRule;
  static max(value: number, message: string): ValidationRule;
  static max(value: number, config: ValidationConfig): ValidationRule;
  static max(maxValue: number, arg?: string | ValidationConfig): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;

    return createRule(
      "max",
      (value) => {
        if (isEmpty(value)) return true;
        const num = Number(value);
        return !isNaN(num) && num <= maxValue;
      },
      formatMessage(config?.message ?? DEFAULT_MESSAGES.max, { max: maxValue }),
      config
    );
  }

  /**
   * URL format validator
   *
   * @example
   * Validators.url()
   * Validators.url("Invalid URL")
   * Validators.url({ message: "Enter valid URL", skipOn: ["draft"] })
   */
  static url(): ValidationRule;
  static url(message: string): ValidationRule;
  static url(config: ValidationConfig): ValidationRule;
  static url(arg?: string | ValidationConfig): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

    return createRule(
      "url",
      (value) => isEmpty(value) || urlRegex.test(String(value)),
      DEFAULT_MESSAGES.url,
      config
    );
  }

  /**
   * Numeric validator
   *
   * @example
   * Validators.numeric()
   * Validators.numeric("Must be a number")
   */
  static numeric(): ValidationRule;
  static numeric(message: string): ValidationRule;
  static numeric(config: ValidationConfig): ValidationRule;
  static numeric(arg?: string | ValidationConfig): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;

    return createRule(
      "numeric",
      (value) => isEmpty(value) || !isNaN(Number(value)),
      DEFAULT_MESSAGES.numeric,
      config
    );
  }

  /**
   * Integer validator
   *
   * @example
   * Validators.integer()
   * Validators.integer("Must be a whole number")
   */
  static integer(): ValidationRule;
  static integer(message: string): ValidationRule;
  static integer(config: ValidationConfig): ValidationRule;
  static integer(arg?: string | ValidationConfig): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;

    return createRule(
      "integer",
      (value) => {
        if (isEmpty(value)) return true;
        const num = Number(value);
        return !isNaN(num) && Number.isInteger(num);
      },
      DEFAULT_MESSAGES.integer,
      config
    );
  }

  /**
   * Alphanumeric validator
   *
   * @example
   * Validators.alphanumeric()
   * Validators.alphanumeric("Letters and numbers only")
   */
  static alphanumeric(): ValidationRule;
  static alphanumeric(message: string): ValidationRule;
  static alphanumeric(config: ValidationConfig): ValidationRule;
  static alphanumeric(arg?: string | ValidationConfig): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    return createRule(
      "alphanumeric",
      (value) => isEmpty(value) || alphanumericRegex.test(String(value)),
      DEFAULT_MESSAGES.alphanumeric,
      config
    );
  }

  /**
   * Phone number validator
   *
   * @example
   * Validators.phone()
   * Validators.phone("Invalid phone number")
   */
  static phone(): ValidationRule;
  static phone(message: string): ValidationRule;
  static phone(config: ValidationConfig): ValidationRule;
  static phone(arg?: string | ValidationConfig): ValidationRule {
    const config = typeof arg === "string" ? { message: arg } : arg;
    // Basic phone regex - allows various formats
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    return createRule(
      "phone",
      (value) => isEmpty(value) || phoneRegex.test(String(value)),
      DEFAULT_MESSAGES.phone,
      config
    );
  }

  /**
   * Custom validator
   *
   * Supports sync and async validation functions.
   * Has access to full FormContext for cross-field validation.
   *
   * @example
   * // Simple custom validation
   * Validators.custom({
   *   validate: (value) => value !== "blocked",
   *   message: "This value is not allowed"
   * })
   *
   * // Cross-field validation
   * Validators.custom({
   *   validate: (value, ctx) => value !== ctx.getValue("otherField"),
   *   message: "Values must be different"
   * })
   *
   * // Async validation
   * Validators.custom({
   *   validate: async (value, ctx) => {
   *     const exists = await ctx.call(ctx.api.UsersApi.checkEmail, { body: { email: value } });
   *     return !exists;
   *   },
   *   message: "Email already exists",
   *   skipOn: ["draft"]
   * })
   *
   * // Role-based validation
   * Validators.custom({
   *   validate: (value, ctx) => {
   *     if (ctx.user.hasRole("admin")) {
   *       return value.length > 10;
   *     }
   *     return true;
   *   },
   *   message: "Admin requires longer value"
   * })
   */
  static custom(config: CustomValidationConfig): ValidationRule {
    if (!config.validate) {
      throw new Error("Validators.custom: validate function is required");
    }

    if (config.skipOn && config.validateOn) {
      throw new Error(
        'Validators.custom: Cannot use both "skipOn" and "validateOn" together. Use one or the other.'
      );
    }

    return {
      type: "custom",
      validate: config.validate,
      message: config.message ?? "Validation failed",
      skipOn: config.skipOn,
      validateOn: config.validateOn,
    };
  }
}

// =============================================================================
// VALIDATION RUNNER
// =============================================================================

/**
 * Check if a rule should run for the given action
 */
export function shouldRunRule(rule: ValidationRule, action: string): boolean {
  // If validateOn is specified, only run if action matches
  if (rule.validateOn && rule.validateOn.length > 0) {
    return rule.validateOn.includes(action);
  }

  // If skipOn is specified, skip if action matches
  if (rule.skipOn && rule.skipOn.length > 0) {
    return !rule.skipOn.includes(action);
  }

  // No restrictions, always run
  return true;
}

/**
 * Run all validation rules for a value
 */
export async function runValidation(
  rules: ValidationRule[],
  value: any,
  ctx: any,
  action: string
): Promise<string[]> {
  const errors: string[] = [];

  for (const rule of rules) {
    // Check if rule should run for this action
    if (!shouldRunRule(rule, action)) {
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
