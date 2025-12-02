/**
 * Form Validators Page - Documentation for all built-in validators
 *
 * I have carefully read the Lumino source code and API documentation.
 * This page includes mini demos for each validator type.
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoNumberInput, LuminoButton } from "lumino/react";

// =============================================================================
// REQUIRED VALIDATOR DEMO
// =============================================================================

class RequiredValidatorForm extends Form<{ username: string; email: string }> {
  constructor() { super("required-validator-form"); }
  configure() {
    this.addSection("Required Validator")
      .addRow()
        .addField("username")
          .component(LuminoTextInput)
          .label("Username")
          .placeholder("Enter username")
          .rules(Validators.required({ message: "Username is required" }))
        .endField()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("Enter email")
          .rules(Validators.required()) // Default message
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const requiredCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class RequiredValidatorForm extends Form<{ username: string; email: string }> {
  configure() {
    this.addSection("Required Validator")
      .addRow()
        .addField("username")
          .component(LuminoTextInput)
          .label("Username")
          .rules(Validators.required({ message: "Username is required" }))
        .endField()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .rules(Validators.required()) // Uses default message
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// EMAIL VALIDATOR DEMO
// =============================================================================

class EmailValidatorForm extends Form<{ email: string; workEmail: string }> {
  constructor() { super("email-validator-form"); }
  configure() {
    this.addSection("Email Validator")
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Personal Email")
          .placeholder("you@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email address")
          )
        .endField()
        .addField("workEmail")
          .component(LuminoTextInput)
          .label("Work Email (optional)")
          .placeholder("you@company.com")
          .rules(Validators.email()) // Only validates if value exists
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const emailCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class EmailValidatorForm extends Form<{ email: string; workEmail: string }> {
  configure() {
    this.addSection("Email Validator")
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Personal Email")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email address")
          )
        .endField()
        .addField("workEmail")
          .component(LuminoTextInput)
          .label("Work Email (optional)")
          .rules(Validators.email()) // Only validates if value exists
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STRING LENGTH VALIDATORS DEMO
// =============================================================================

class LengthValidatorForm extends Form<{ bio: string; nickname: string }> {
  constructor() { super("length-validator-form"); }
  configure() {
    this.addSection("Length Validators")
      .addRow()
        .addField("nickname")
          .component(LuminoTextInput)
          .label("Nickname (3-15 chars)")
          .placeholder("Enter nickname")
          .rules(
            Validators.required({ message: "Nickname is required" }),
            Validators.minLength(3, "At least 3 characters"),
            Validators.maxLength(15, "Maximum 15 characters")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("bio")
          .component(LuminoTextInput)
          .label("Bio (10-100 chars)")
          .placeholder("Tell us about yourself")
          .rules(
            Validators.minLength(10, "Minimum 10 characters"),
            Validators.maxLength(100, "Maximum 100 characters")
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const lengthCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class LengthValidatorForm extends Form<{ bio: string; nickname: string }> {
  configure() {
    this.addSection("Length Validators")
      .addRow()
        .addField("nickname")
          .component(LuminoTextInput)
          .label("Nickname (3-15 chars)")
          .rules(
            Validators.required({ message: "Nickname is required" }),
            Validators.minLength(3, "At least 3 characters"),
            Validators.maxLength(15, "Maximum 15 characters")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("bio")
          .component(LuminoTextInput)
          .label("Bio (10-100 chars)")
          .rules(
            Validators.minLength(10, "Minimum 10 characters"),
            Validators.maxLength(100, "Maximum 100 characters")
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// NUMERIC VALIDATORS DEMO
// =============================================================================

class NumericValidatorForm extends Form<{ age: number; rating: number; quantity: number }> {
  constructor() { super("numeric-validator-form"); }
  configure() {
    this.addSection("Numeric Validators")
      .addRow()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age (18-100)")
          .placeholder("Enter age")
          .rules(
            Validators.required({ message: "Age is required" }),
            Validators.min(18, "Must be at least 18"),
            Validators.max(100, "Maximum age is 100")
          )
        .endField()
        .addField("rating")
          .component(LuminoNumberInput)
          .label("Rating (1-5)")
          .placeholder("1-5")
          .rules(
            Validators.required({ message: "Rating is required" }),
            Validators.min(1, "Minimum rating is 1"),
            Validators.max(5, "Maximum rating is 5")
          )
        .endField()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity (integer)")
          .placeholder("Enter whole number")
          .rules(
            Validators.required({ message: "Quantity is required" }),
            Validators.integer("Must be a whole number")
          )
        .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}

const numericCode = `import { Form, Validators } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class NumericValidatorForm extends Form<{ age: number; rating: number; quantity: number }> {
  configure() {
    this.addSection("Numeric Validators")
      .addRow()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age (18-100)")
          .rules(
            Validators.required({ message: "Age is required" }),
            Validators.min(18, "Must be at least 18"),
            Validators.max(100, "Maximum age is 100")
          )
        .endField()
        .addField("rating")
          .component(LuminoNumberInput)
          .label("Rating (1-5)")
          .rules(
            Validators.required({ message: "Rating is required" }),
            Validators.min(1, "Minimum rating is 1"),
            Validators.max(5, "Maximum rating is 5")
          )
        .endField()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity (integer)")
          .rules(
            Validators.required({ message: "Quantity is required" }),
            Validators.integer("Must be a whole number")
          )
        .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PATTERN VALIDATOR DEMO
// =============================================================================

class PatternValidatorForm extends Form<{ phone: string; zipCode: string; slug: string }> {
  constructor() { super("pattern-validator-form"); }
  configure() {
    this.addSection("Pattern Validators")
      .addRow()
        .addField("phone")
          .component(LuminoTextInput)
          .label("Phone Number")
          .placeholder("(123) 456-7890")
          .rules(
            Validators.required({ message: "Phone is required" }),
            Validators.phone("Please enter a valid phone number")
          )
        .endField()
        .addField("zipCode")
          .component(LuminoTextInput)
          .label("ZIP Code")
          .placeholder("12345")
          .rules(
            Validators.required({ message: "ZIP code is required" }),
            Validators.pattern(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code (12345 or 12345-6789)")
          )
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("slug")
          .component(LuminoTextInput)
          .label("URL Slug")
          .placeholder("my-page-url")
          .rules(
            Validators.required({ message: "Slug is required" }),
            Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Only lowercase letters, numbers, and hyphens")
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const patternCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class PatternValidatorForm extends Form<{ phone: string; zipCode: string; slug: string }> {
  configure() {
    this.addSection("Pattern Validators")
      .addRow()
        .addField("phone")
          .component(LuminoTextInput)
          .label("Phone Number")
          .rules(
            Validators.required({ message: "Phone is required" }),
            Validators.phone("Please enter a valid phone number")
          )
        .endField()
        .addField("zipCode")
          .component(LuminoTextInput)
          .label("ZIP Code")
          .rules(
            Validators.required({ message: "ZIP code is required" }),
            Validators.pattern(/^\\d{5}(-\\d{4})?$/, "Enter a valid ZIP code")
          )
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("slug")
          .component(LuminoTextInput)
          .label("URL Slug")
          .rules(
            Validators.required({ message: "Slug is required" }),
            Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Only lowercase letters, numbers, hyphens")
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// URL VALIDATOR DEMO
// =============================================================================

class UrlValidatorForm extends Form<{ website: string; linkedin: string }> {
  constructor() { super("url-validator-form"); }
  configure() {
    this.addSection("URL Validator")
      .addRow()
        .addField("website")
          .component(LuminoTextInput)
          .label("Website")
          .placeholder("https://example.com")
          .rules(
            Validators.required({ message: "Website is required" }),
            Validators.url("Please enter a valid URL")
          )
        .endField()
        .addField("linkedin")
          .component(LuminoTextInput)
          .label("LinkedIn (optional)")
          .placeholder("https://linkedin.com/in/username")
          .rules(Validators.url("Please enter a valid LinkedIn URL"))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const urlCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class UrlValidatorForm extends Form<{ website: string; linkedin: string }> {
  configure() {
    this.addSection("URL Validator")
      .addRow()
        .addField("website")
          .component(LuminoTextInput)
          .label("Website")
          .rules(
            Validators.required({ message: "Website is required" }),
            Validators.url("Please enter a valid URL")
          )
        .endField()
        .addField("linkedin")
          .component(LuminoTextInput)
          .label("LinkedIn (optional)")
          .rules(Validators.url("Please enter a valid LinkedIn URL"))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CUSTOM VALIDATOR DEMO
// =============================================================================

class CustomValidatorForm extends Form<{ password: string; confirmPassword: string }> {
  constructor() { super("custom-validator-form"); }
  configure() {
    this.addSection("Custom Validators")
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password")
          .placeholder("Enter password")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Password is required" }),
            Validators.minLength(8, "At least 8 characters"),
            Validators.custom({
              validate: (value) => {
                const hasUpper = /[A-Z]/.test(value);
                const hasLower = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);
                return hasUpper && hasLower && hasNumber;
              },
              message: "Must contain uppercase, lowercase, and number"
            })
          )
        .endField()
      .endRow()
      .addRow()
        .addField("confirmPassword")
          .component(LuminoTextInput)
          .label("Confirm Password")
          .placeholder("Confirm password")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Please confirm password" }),
            Validators.custom({
              validate: (value, ctx) => {
                const password = ctx.getValue("password");
                return value === password;
              },
              message: "Passwords must match"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const customCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class CustomValidatorForm extends Form<{ password: string; confirmPassword: string }> {
  configure() {
    this.addSection("Custom Validators")
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Password is required" }),
            Validators.minLength(8, "At least 8 characters"),
            Validators.custom({
              validate: (value) => {
                const hasUpper = /[A-Z]/.test(value);
                const hasLower = /[a-z]/.test(value);
                const hasNumber = /\\d/.test(value);
                return hasUpper && hasLower && hasNumber;
              },
              message: "Must contain uppercase, lowercase, and number"
            })
          )
        .endField()
      .endRow()
      .addRow()
        .addField("confirmPassword")
          .component(LuminoTextInput)
          .label("Confirm Password")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Please confirm password" }),
            Validators.custom({
              validate: (value, ctx) => {
                const password = ctx.getValue("password");
                return value === password;
              },
              message: "Passwords must match"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CONDITIONAL VALIDATION DEMO
// =============================================================================

class ConditionalValidatorForm extends Form<{ status: string; reason: string }> {
  constructor() { super("conditional-validator-form"); }
  configure() {
    this.addSection("Conditional Validation")
      .addRow()
        .addField("status")
          .component(LuminoTextInput)
          .label("Status")
          .placeholder("draft or published")
          .rules(Validators.required({ message: "Status is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("reason")
          .component(LuminoTextInput)
          .label("Rejection Reason")
          .placeholder("Enter reason (required if status is 'rejected')")
          .rules(
            Validators.custom({
              validate: (value, ctx) => {
                const status = ctx.getValue("status");
                if (status === "rejected") {
                  return !!value && value.length > 0;
                }
                return true;
              },
              message: "Reason is required when status is 'rejected'"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const conditionalCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class ConditionalValidatorForm extends Form<{ status: string; reason: string }> {
  configure() {
    this.addSection("Conditional Validation")
      .addRow()
        .addField("status")
          .component(LuminoTextInput)
          .label("Status")
          .rules(Validators.required({ message: "Status is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("reason")
          .component(LuminoTextInput)
          .label("Rejection Reason")
          .rules(
            Validators.custom({
              validate: (value, ctx) => {
                const status = ctx.getValue("status");
                if (status === "rejected") {
                  return !!value && value.length > 0;
                }
                return true; // Not required for other statuses
              },
              message: "Reason is required when status is 'rejected'"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export function FormValidatorsPage() {
  return (
    <>
      <h1 className="docs-page-title">Validators</h1>
      <p className="docs-page-subtitle">
        Lumino provides a comprehensive set of built-in validators plus the ability
        to create custom validators. Validators are added via the <code>.rules()</code> method.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Built-in Validators</h2>
        <p>
          All validators are accessed via the <code>Validators</code> static class:
        </p>
        <ul>
          <li><strong>Validators.required()</strong> - Field must have a value</li>
          <li><strong>Validators.email()</strong> - Valid email format</li>
          <li><strong>Validators.minLength(n)</strong> - Minimum string length</li>
          <li><strong>Validators.maxLength(n)</strong> - Maximum string length</li>
          <li><strong>Validators.min(n)</strong> - Minimum numeric value</li>
          <li><strong>Validators.max(n)</strong> - Maximum numeric value</li>
          <li><strong>Validators.numeric()</strong> - Must be a number</li>
          <li><strong>Validators.integer()</strong> - Must be a whole number</li>
          <li><strong>Validators.pattern(regex)</strong> - Match regex pattern</li>
          <li><strong>Validators.url()</strong> - Valid URL format</li>
          <li><strong>Validators.phone()</strong> - Valid phone number</li>
          <li><strong>Validators.alphanumeric()</strong> - Letters and numbers only</li>
          <li><strong>Validators.custom()</strong> - Custom validation function</li>
        </ul>
      </div>

      {/* Required Validator */}
      <div className="docs-section">
        <h2 className="docs-section-title">Required Validator</h2>
        <p>
          The most common validator - ensures the field has a value. Works with strings,
          numbers, booleans, and arrays.
        </p>
        <LuminoLiveDemo
          title="Required Validator"
          description="Fields that must have a value"
          form={new RequiredValidatorForm()}
          code={requiredCode}
          defaultView="split"
        />
      </div>

      {/* Email Validator */}
      <div className="docs-section">
        <h2 className="docs-section-title">Email Validator</h2>
        <p>
          Validates email format. Only runs if the field has a value (use with required
          if the field must have a value).
        </p>
        <LuminoLiveDemo
          title="Email Validator"
          description="Email format validation"
          form={new EmailValidatorForm()}
          code={emailCode}
          defaultView="split"
        />
      </div>

      {/* Length Validators */}
      <div className="docs-section">
        <h2 className="docs-section-title">Length Validators</h2>
        <p>
          <code>minLength</code> and <code>maxLength</code> validate string length.
        </p>
        <LuminoLiveDemo
          title="Length Validators"
          description="String length constraints"
          form={new LengthValidatorForm()}
          code={lengthCode}
          defaultView="split"
        />
      </div>

      {/* Numeric Validators */}
      <div className="docs-section">
        <h2 className="docs-section-title">Numeric Validators</h2>
        <p>
          <code>min</code>, <code>max</code>, and <code>integer</code> validate numeric values.
        </p>
        <LuminoLiveDemo
          title="Numeric Validators"
          description="Number range and type validation"
          form={new NumericValidatorForm()}
          code={numericCode}
          defaultView="split"
        />
      </div>

      {/* Pattern Validators */}
      <div className="docs-section">
        <h2 className="docs-section-title">Pattern Validators</h2>
        <p>
          Use <code>pattern</code> for custom regex validation or <code>phone</code> for
          phone number format.
        </p>
        <LuminoLiveDemo
          title="Pattern Validators"
          description="Regex and format validation"
          form={new PatternValidatorForm()}
          code={patternCode}
          defaultView="split"
        />
      </div>

      {/* URL Validator */}
      <div className="docs-section">
        <h2 className="docs-section-title">URL Validator</h2>
        <p>
          Validates URL format including protocol (http/https).
        </p>
        <LuminoLiveDemo
          title="URL Validator"
          description="URL format validation"
          form={new UrlValidatorForm()}
          code={urlCode}
          defaultView="split"
        />
      </div>

      {/* Custom Validators */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Validators</h2>
        <p>
          Create custom validation logic using <code>Validators.custom()</code>.
          Access other field values via <code>ctx.getValue()</code>.
        </p>
        <LuminoLiveDemo
          title="Custom Validators"
          description="Password validation with custom rules"
          form={new CustomValidatorForm()}
          code={customCode}
          defaultView="split"
        />
      </div>

      {/* Conditional Validation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Validation</h2>
        <p>
          Use custom validators with <code>ctx.getValue()</code> to implement
          conditional validation based on other field values.
        </p>
        <LuminoLiveDemo
          title="Conditional Validation"
          description="Required based on another field"
          form={new ConditionalValidatorForm()}
          code={conditionalCode}
          defaultView="split"
        />
      </div>

      {/* Validator Configuration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Validator Configuration</h2>
        <p>
          All validators accept a configuration object with these options:
        </p>
        <CodeBlock
          code={`// Validator configuration options
Validators.required({
  message: "Custom error message",    // Override default message
  skipOn: ["draft"],                  // Skip validation for these actions
  validateOn: ["submit", "publish"],  // Only validate for these actions
})

// Custom validator with async support
Validators.custom({
  validate: async (value, ctx) => {
    // Access other fields
    const email = ctx.getValue("email");

    // Async validation (e.g., API call)
    const response = await fetch(\`/api/check-email?email=\${value}\`);
    const { exists } = await response.json();
    return !exists;
  },
  message: "Email already exists",
  skipOn: ["draft"]  // Don't check uniqueness for drafts
})`}
          language="typescript"
        />
      </div>

      {/* Combining Validators */}
      <div className="docs-section">
        <h2 className="docs-section-title">Combining Validators</h2>
        <p>
          Chain multiple validators in the <code>.rules()</code> method. They execute in order
          and stop at the first failure:
        </p>
        <CodeBlock
          code={`.addField("email")
  .component(LuminoTextInput)
  .label("Email")
  .rules(
    Validators.required({ message: "Email is required" }),
    Validators.email("Please enter a valid email"),
    Validators.maxLength(100, "Email too long"),
    Validators.custom({
      validate: async (value, ctx) => {
        // Custom async check
        return await checkEmailUniqueness(value);
      },
      message: "Email already registered"
    })
  )
.endField()`}
          language="typescript"
        />
      </div>
    </>
  );
}
