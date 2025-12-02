/**
 * Form Custom Validation Documentation
 *
 * Documents how to create custom validators and complex validation logic.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { Form, Validators } from "lumino/core";
import type { FormContext } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoCheckbox,
  FormRenderer,
} from "lumino/react";
import { LiveDemo } from "../../components/LiveDemo";

// =============================================================================
// DEMO ENTITIES
// =============================================================================

class PasswordEntity {
  password = "";
  confirmPassword = "";
}

class DateRangeEntity {
  startDate = "";
  endDate = "";
}

class AgeVerificationEntity {
  dateOfBirth = "";
  acceptTerms = false;
}

class UsernameEntity {
  username = "";
  email = "";
}

class CreditCardEntity {
  cardNumber = "";
  expiryMonth = "";
  expiryYear = "";
  cvv = "";
}

// =============================================================================
// CUSTOM VALIDATORS
// =============================================================================

// Validator that checks if value matches another field
const matchesField = (fieldName: string, message: string) => ({
  type: "custom" as const,
  message,
  validate: (value: any, ctx: FormContext) => {
    const otherValue = ctx.getValue(fieldName);
    return value === otherValue;
  },
});

// Validator that checks date is in the future
const futureDate = (message: string) => ({
  type: "custom" as const,
  message,
  validate: (value: string) => {
    if (!value) return true; // Let required handle empty
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  },
});

// Validator that checks date is in the past
const pastDate = (message: string) => ({
  type: "custom" as const,
  message,
  validate: (value: string) => {
    if (!value) return true;
    const date = new Date(value);
    const today = new Date();
    return date < today;
  },
});

// Validator that checks age is at least N years
const minimumAge = (years: number, message: string) => ({
  type: "custom" as const,
  message,
  validate: (value: string) => {
    if (!value) return true;
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= years;
    }
    return age >= years;
  },
});

// Luhn algorithm for credit card validation
const validCreditCard = (message: string) => ({
  type: "custom" as const,
  message,
  validate: (value: string) => {
    if (!value) return true;
    const digits = value.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  },
});

// =============================================================================
// DEMO 1: Password Confirmation
// =============================================================================

class PasswordMatchForm extends Form<PasswordEntity> {
  constructor() {
    super("password-match");
  }

  configure() {
    this.addSection("Password Confirmation")
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password")
          .placeholder("Enter password")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Password is required" }),
            Validators.minLength(8, "Password must be at least 8 characters"),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              "Must contain uppercase, lowercase, and number"
            )
          )
          .endField()
      .endRow()
      .addRow()
        .addField("confirmPassword")
          .component(LuminoTextInput)
          .label("Confirm Password")
          .placeholder("Re-enter password")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Please confirm your password" }),
            matchesField("password", "Passwords do not match")
          )
          .endField()
      .endRow()
    .endSection();
  }
}

const passwordMatchCode = `// Custom validator that compares to another field
const matchesField = (fieldName: string, message: string) => ({
  type: "custom",
  message,
  validate: (value: any, ctx: FormContext) => {
    const otherValue = ctx.getValue(fieldName);
    return value === otherValue;
  },
});

class PasswordMatchForm extends Form<PasswordEntity> {
  configure() {
    this.addSection("Password Confirmation")
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Password is required" }),
            Validators.minLength(8, "At least 8 characters"),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/,
              "Must contain uppercase, lowercase, and number"
            )
          )
          .endField()
      .endRow()
      .addRow()
        .addField("confirmPassword")
          .component(LuminoTextInput)
          .label("Confirm Password")
          .props({ type: "password" })
          .rules(
            Validators.required(),
            // Custom validator comparing to password field
            matchesField("password", "Passwords do not match")
          )
          .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 2: Date Range Validation
// =============================================================================

// Validator that checks end date is after start date
const afterDate = (startFieldName: string, message: string) => ({
  type: "custom" as const,
  message,
  validate: (value: string, ctx: FormContext) => {
    if (!value) return true;
    const startValue = ctx.getValue(startFieldName);
    if (!startValue) return true;

    const endDate = new Date(value);
    const startDate = new Date(startValue as string);
    return endDate >= startDate;
  },
});

class DateRangeForm extends Form<DateRangeEntity> {
  constructor() {
    super("date-range");
  }

  configure() {
    this.addSection("Date Range Validation")
      .addRow()
        .addField("startDate")
          .component(LuminoTextInput)
          .label("Start Date")
          .placeholder("YYYY-MM-DD")
          .props({ type: "date" })
          .rules(
            Validators.required({ message: "Start date is required" })
          )
          .endField()
        .addField("endDate")
          .component(LuminoTextInput)
          .label("End Date")
          .placeholder("YYYY-MM-DD")
          .props({ type: "date" })
          .rules(
            Validators.required({ message: "End date is required" }),
            afterDate("startDate", "End date must be after start date")
          )
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const dateRangeCode = `// Validator that compares dates
const afterDate = (startFieldName: string, message: string) => ({
  type: "custom",
  message,
  validate: (value: string, ctx: FormContext) => {
    if (!value) return true;  // Let required handle empty
    const startValue = ctx.getValue(startFieldName);
    if (!startValue) return true;

    const endDate = new Date(value);
    const startDate = new Date(startValue);
    return endDate >= startDate;
  },
});

class DateRangeForm extends Form<DateRangeEntity> {
  configure() {
    this.addSection("Date Range")
      .addRow()
        .addField("startDate")
          .component(LuminoTextInput)
          .label("Start Date")
          .props({ type: "date" })
          .rules(Validators.required())
          .endField()
        .addField("endDate")
          .component(LuminoTextInput)
          .label("End Date")
          .props({ type: "date" })
          .rules(
            Validators.required(),
            // Must be after start date
            afterDate("startDate", "End date must be after start date")
          )
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 3: Age Verification
// =============================================================================

class AgeVerificationForm extends Form<AgeVerificationEntity> {
  constructor() {
    super("age-verification");
  }

  configure() {
    this.addSection("Age Verification")
      .addRow()
        .addField("dateOfBirth")
          .component(LuminoTextInput)
          .label("Date of Birth")
          .placeholder("YYYY-MM-DD")
          .props({ type: "date" })
          .rules(
            Validators.required({ message: "Date of birth is required" }),
            pastDate("Date of birth must be in the past"),
            minimumAge(18, "You must be at least 18 years old")
          )
          .endField()
      .endRow()
      .addRow()
        .addField("acceptTerms")
          .component(LuminoCheckbox)
          .label("I confirm I am 18 years or older")
          .rules({
            type: "custom",
            message: "You must confirm your age",
            validate: (value: boolean) => value === true,
          })
          .endField()
      .endRow()
    .endSection();
  }
}

const ageVerificationCode = `// Past date validator
const pastDate = (message: string) => ({
  type: "custom",
  message,
  validate: (value: string) => {
    if (!value) return true;
    const date = new Date(value);
    return date < new Date();
  },
});

// Minimum age validator
const minimumAge = (years: number, message: string) => ({
  type: "custom",
  message,
  validate: (value: string) => {
    if (!value) return true;
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    // Adjust for month/day
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= years;
    }
    return age >= years;
  },
});

class AgeVerificationForm extends Form<AgeVerificationEntity> {
  configure() {
    this.addSection("Age Verification")
      .addRow()
        .addField("dateOfBirth")
          .component(LuminoTextInput)
          .label("Date of Birth")
          .props({ type: "date" })
          .rules(
            Validators.required(),
            pastDate("Must be in the past"),
            minimumAge(18, "Must be at least 18 years old")
          )
          .endField()
      .endRow()
      .addRow()
        .addField("acceptTerms")
          .component(LuminoCheckbox)
          .label("I confirm I am 18 years or older")
          // Inline custom validator
          .rules({
            type: "custom",
            message: "You must confirm your age",
            validate: (value) => value === true,
          })
          .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 4: Credit Card Validation
// =============================================================================

class CreditCardForm extends Form<CreditCardEntity> {
  constructor() {
    super("credit-card");
  }

  configure() {
    this.addSection("Credit Card Validation")
      .addRow()
        .addField("cardNumber")
          .component(LuminoTextInput)
          .label("Card Number")
          .placeholder("1234 5678 9012 3456")
          .rules(
            Validators.required({ message: "Card number is required" }),
            validCreditCard("Invalid credit card number")
          )
          .endField()
      .endRow()
      .addRow()
        .addField("expiryMonth")
          .component(LuminoSelect)
          .label("Expiry Month")
          .placeholder("MM")
          .props({
            options: Array.from({ length: 12 }, (_, i) => ({
              value: String(i + 1).padStart(2, "0"),
              label: String(i + 1).padStart(2, "0"),
            })),
          })
          .rules(Validators.required({ message: "Month required" }))
          .endField()
        .addField("expiryYear")
          .component(LuminoSelect)
          .label("Expiry Year")
          .placeholder("YYYY")
          .props({
            options: Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return { value: String(year), label: String(year) };
            }),
          })
          .rules(
            Validators.required({ message: "Year required" }),
            {
              type: "custom" as const,
              message: "Card has expired",
              validate: (value: string, ctx: FormContext) => {
                if (!value) return true;
                const month = ctx.getValue("expiryMonth");
                if (!month) return true;

                const now = new Date();
                const expiry = new Date(parseInt(value), parseInt(month as string) - 1);
                return expiry >= now;
              },
            }
          )
          .endField()
        .addField("cvv")
          .component(LuminoTextInput)
          .label("CVV")
          .placeholder("123")
          .props({ maxLength: 4 })
          .rules(
            Validators.required({ message: "CVV required" }),
            Validators.pattern(/^\d{3,4}$/, "Must be 3 or 4 digits")
          )
          .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}

const creditCardCode = `// Luhn algorithm validator
const validCreditCard = (message: string) => ({
  type: "custom",
  message,
  validate: (value: string) => {
    if (!value) return true;
    const digits = value.replace(/\\D/g, "");
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  },
});

class CreditCardForm extends Form<CreditCardEntity> {
  configure() {
    this.addSection("Credit Card")
      .addRow()
        .addField("cardNumber")
          .component(LuminoTextInput)
          .label("Card Number")
          .rules(
            Validators.required(),
            validCreditCard("Invalid credit card number")
          )
          .endField()
      .endRow()
      .addRow()
        .addField("expiryMonth")
          .component(LuminoSelect)
          .label("Month")
          .props({ options: months })
          .rules(Validators.required())
          .endField()
        .addField("expiryYear")
          .component(LuminoSelect)
          .label("Year")
          .props({ options: years })
          .rules(
            Validators.required(),
            // Cross-field validation for expiry
            {
              type: "custom",
              message: "Card has expired",
              validate: (value, ctx) => {
                const month = ctx.getValue("expiryMonth");
                if (!value || !month) return true;
                const expiry = new Date(parseInt(value), parseInt(month) - 1);
                return expiry >= new Date();
              },
            }
          )
          .endField()
        .addField("cvv")
          .component(LuminoTextInput)
          .label("CVV")
          .rules(
            Validators.required(),
            Validators.pattern(/^\\d{3,4}$/, "3 or 4 digits")
          )
          .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function FormCustomValidationPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Custom Validation</h1>
      <p className="docs-page-subtitle">
        Learn how to create custom validators for complex validation requirements
        that go beyond the built-in validators.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        Custom validators receive the field value and FormContext for cross-field validation.
      </div>

      <div className="docs-section">
        <h2>Custom Validator Structure</h2>
        <pre className="docs-code">{`// Custom validator interface
interface CustomValidator {
  type: "custom";
  message: string;  // Error message when validation fails
  validate: (value: any, ctx: FormContext) => boolean | Promise<boolean>;
}

// Basic custom validator
const myValidator = {
  type: "custom",
  message: "Invalid value",
  validate: (value) => {
    // Return true if valid, false if invalid
    return someValidationLogic(value);
  },
};

// Cross-field validator (uses context)
const crossFieldValidator = {
  type: "custom",
  message: "Fields must match",
  validate: (value, ctx) => {
    const otherValue = ctx.getValue("otherField");
    return value === otherValue;
  },
};

// Async validator
const asyncValidator = {
  type: "custom",
  message: "Username already taken",
  validate: async (value, ctx) => {
    const response = await checkUsername(value);
    return response.available;
  },
};`}</pre>
      </div>

      <div className="docs-section">
        <h2>1. Password Confirmation</h2>
        <p>
          A common use case: confirm password must match the original password.
          This uses a cross-field validator that compares two field values.
        </p>
        <LiveDemo
          title="Password Match"
          description="Confirm password must match password"
          code={passwordMatchCode}
          FormClass={PasswordMatchForm}
          EntityClass={PasswordEntity}
        />
      </div>

      <div className="docs-section">
        <h2>2. Date Range Validation</h2>
        <p>
          Ensure end date is after start date. The validator accesses both
          field values through the FormContext.
        </p>
        <LiveDemo
          title="Date Range"
          description="End date must be after start date"
          code={dateRangeCode}
          FormClass={DateRangeForm}
          EntityClass={DateRangeEntity}
        />
      </div>

      <div className="docs-section">
        <h2>3. Age Verification</h2>
        <p>
          Calculate age from date of birth and ensure minimum age requirement.
          Combines date validation with age calculation.
        </p>
        <LiveDemo
          title="Age Verification"
          description="Must be 18+ based on date of birth"
          code={ageVerificationCode}
          FormClass={AgeVerificationForm}
          EntityClass={AgeVerificationEntity}
        />
      </div>

      <div className="docs-section">
        <h2>4. Credit Card Validation</h2>
        <p>
          Complex validation including Luhn algorithm for card number and
          cross-field expiry date validation.
        </p>
        <LiveDemo
          title="Credit Card"
          description="Luhn algorithm and expiry validation"
          code={creditCardCode}
          FormClass={CreditCardForm}
          EntityClass={CreditCardEntity}
        />
      </div>

      <div className="docs-section">
        <h2>Async Validation</h2>
        <pre className="docs-code">{`// Example: Check username availability
const usernameAvailable = {
  type: "custom",
  message: "Username is already taken",
  validate: async (value: string, ctx: FormContext) => {
    if (!value || value.length < 3) return true;

    try {
      const response = await fetch(\`/api/check-username?u=\${value}\`);
      const data = await response.json();
      return data.available;
    } catch {
      // On error, allow the value (server will validate on submit)
      return true;
    }
  },
};

// Usage
.addField("username")
  .component(LuminoTextInput)
  .label("Username")
  .rules(
    Validators.required(),
    Validators.minLength(3),
    usernameAvailable  // Async validation
  )
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Reusable Validator Factory</h2>
        <pre className="docs-code">{`// Factory function for creating parameterized validators
function createValidator<T>(
  validateFn: (value: T, ctx: FormContext, ...args: any[]) => boolean,
  getMessage: (...args: any[]) => string
) {
  return (...args: any[]) => ({
    type: "custom" as const,
    message: getMessage(...args),
    validate: (value: T, ctx: FormContext) => validateFn(value, ctx, ...args),
  });
}

// Example: Range validator factory
const inRange = createValidator<number>(
  (value, ctx, min, max) => value >= min && value <= max,
  (min, max) => \`Value must be between \${min} and \${max}\`
);

// Usage
.rules(inRange(1, 100))  // Value must be between 1 and 100
.rules(inRange(0, 50))   // Value must be between 0 and 50`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Handle empty values</strong> - Return <code>true</code> for empty
            values and let <code>required</code> validator handle that case
          </li>
          <li>
            <strong>Keep validators pure</strong> - Don't modify values or state in
            validators, only return true/false
          </li>
          <li>
            <strong>Provide clear error messages</strong> - Tell users exactly what's
            wrong and how to fix it
          </li>
          <li>
            <strong>Use factory functions</strong> - Create reusable, parameterized
            validators for common patterns
          </li>
          <li>
            <strong>Handle async errors gracefully</strong> - Catch errors in async
            validators and decide whether to pass or fail
          </li>
          <li>
            <strong>Consider performance</strong> - Debounce expensive validators
            (like API calls) and use dependencies to control when they run
          </li>
        </ul>
      </div>
    </div>
  );
}
