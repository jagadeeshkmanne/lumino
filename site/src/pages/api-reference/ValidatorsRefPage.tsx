/**
 * Validators API Reference
 */

import { CodeBlock } from "../../components/CodeBlock";

const overviewCode = `import { Validators } from "lumino/core";

// Use in field rules
.addField("email")
  .component(TextField)
  .label("Email")
  .rules(
    Validators.required(),
    Validators.email(),
    Validators.maxLength(100)
  )
.endField()`;

const requiredCode = `// Basic required
Validators.required()

// With custom message
Validators.required({ message: "Name is required" })

// Skip on draft
Validators.required({ skipOn: ["draft"] })

// Only validate on submit
Validators.required({ validateOn: ["submit"] })`;

const emailCode = `// Basic email validation
Validators.email()

// With custom message
Validators.email("Invalid email format")

// With config
Validators.email({ message: "Invalid email", skipOn: ["draft"] })`;

const patternCode = `// Phone number pattern
Validators.pattern(/^\\d{10}$/, "Must be 10 digits")

// Alphanumeric only
Validators.pattern(/^[a-zA-Z0-9]+$/, "Letters and numbers only")

// With config
Validators.pattern(/^\\d{3}-\\d{3}-\\d{4}$/, {
  message: "Format: XXX-XXX-XXXX",
  skipOn: ["draft"]
})`;

const lengthCode = `// Minimum length
Validators.minLength(3)
Validators.minLength(3, "Too short")
Validators.minLength(3, { message: "Min 3 chars", skipOn: ["draft"] })

// Maximum length
Validators.maxLength(100)
Validators.maxLength(100, "Too long")
Validators.maxLength(100, { message: "Max 100 chars" })`;

const numericCode = `// Minimum value
Validators.min(0)
Validators.min(0, "Must be positive")
Validators.min(18, { message: "Must be 18+", validateOn: ["submit"] })

// Maximum value
Validators.max(100)
Validators.max(100, "Too high")
Validators.max(65, { message: "Max age 65" })

// Numeric (any number)
Validators.numeric()
Validators.numeric("Must be a number")

// Integer only
Validators.integer()
Validators.integer("Must be a whole number")`;

const otherValidatorsCode = `// URL validation
Validators.url()
Validators.url("Invalid URL")

// Alphanumeric
Validators.alphanumeric()
Validators.alphanumeric("Letters and numbers only")

// Phone number
Validators.phone()
Validators.phone("Invalid phone number")`;

const customValidatorCode = `// Simple custom validation
Validators.custom({
  validate: (value) => value !== "blocked",
  message: "This value is not allowed"
})

// Cross-field validation
Validators.custom({
  validate: (value, ctx) => {
    const otherValue = ctx.getValue("otherField");
    return value !== otherValue;
  },
  message: "Values must be different"
})

// Async validation (e.g., check uniqueness)
Validators.custom({
  validate: async (value, ctx) => {
    const exists = await ctx.call(ctx.api.UsersApi.checkEmail, {
      body: { email: value }
    });
    return !exists;
  },
  message: "Email already exists",
  skipOn: ["draft"]
})

// Role-based validation
Validators.custom({
  validate: (value, ctx) => {
    if (ctx.user.hasRole("admin")) {
      return value.length > 10;
    }
    return true;
  },
  message: "Admin requires longer value"
})`;

const conditionalValidationCode = `// Skip validation on specific actions
.addField("notes")
  .component(TextField)
  .label("Notes")
  .rules(
    Validators.required({ skipOn: ["draft", "save_as_draft"] })
  )
.endField()

// Only validate on specific actions
.addField("approvalComments")
  .component(TextField)
  .label("Approval Comments")
  .rules(
    Validators.required({ validateOn: ["approve", "reject"] })
  )
.endField()`;

const complexExampleCode = `// Comprehensive validation example
.addField("password")
  .component(PasswordField)
  .label("Password")
  .rules(
    Validators.required(),
    Validators.minLength(8, "Password must be at least 8 characters"),
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/,
      "Must contain uppercase, lowercase, and number"
    ),
    Validators.custom({
      validate: (value, ctx) => {
        const confirmPassword = ctx.getValue("confirmPassword");
        return !confirmPassword || value === confirmPassword;
      },
      message: "Passwords must match"
    })
  )
.endField()

.addField("confirmPassword")
  .component(PasswordField)
  .label("Confirm Password")
  .rules(
    Validators.required(),
    Validators.custom({
      validate: (value, ctx) => value === ctx.getValue("password"),
      message: "Passwords must match"
    })
  )
.endField()`;

const validationConfigCode = `interface ValidationConfig {
  message?: string;
  skipOn?: string[];       // Skip validation on these actions
  validateOn?: string[];   // Only validate on these actions
}

interface CustomValidationConfig extends ValidationConfig {
  validate: ValidateFn;  // (value: any, ctx: FormContext) => boolean | Promise<boolean>
}`;

const ruleTypeCode = `interface ValidationRule {
  readonly type: string;
  readonly validate: ValidateFn;
  readonly message: string;
  readonly skipOn?: string[];
  readonly validateOn?: string[];
}

type ValidateFn = (value: any, ctx: FormContext) => boolean | Promise<boolean>;`;

export function ValidatorsRefPage() {
  return (
    <>
      <h1 className="docs-page-title">Validators Reference</h1>
      <p className="docs-page-subtitle">
        Static factory class for creating validation rules with sync/async support.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>Validators</code> class provides a collection of built-in validators for common
          use cases, plus a <code>custom()</code> method for creating your own validation logic.
        </p>
        <CodeBlock code={overviewCode} language="typescript" />
        <p>
          <strong>Key Features:</strong>
        </p>
        <ul>
          <li>Built-in validators for common cases (required, email, pattern, etc.)</li>
          <li>Custom validators with full access to form context</li>
          <li>Async validation support (e.g., checking uniqueness via API)</li>
          <li>Conditional validation (skipOn, validateOn)</li>
          <li>Cross-field validation</li>
          <li>Role/permission-based validation</li>
        </ul>
      </div>

      {/* Built-in Validators */}
      <div className="docs-section">
        <h2 className="docs-section-title">Built-in Validators</h2>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          required()
        </h3>
        <p>Validates that a field has a value (not null, undefined, or empty string).</p>
        <CodeBlock code={requiredCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          email()
        </h3>
        <p>Validates email format.</p>
        <CodeBlock code={emailCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          pattern(regex, message?)
        </h3>
        <p>Validates value against a regular expression.</p>
        <CodeBlock code={patternCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          minLength() / maxLength()
        </h3>
        <p>Validates string length.</p>
        <CodeBlock code={lengthCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          min() / max() / numeric() / integer()
        </h3>
        <p>Validates numeric values.</p>
        <CodeBlock code={numericCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Other Built-in Validators
        </h3>
        <CodeBlock code={otherValidatorsCode} language="typescript" />
      </div>

      {/* Custom Validators */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Validators</h2>
        <p>
          Use <code>Validators.custom()</code> to create custom validation logic with full access
          to the form context.
        </p>
        <CodeBlock code={customValidatorCode} language="typescript" />
      </div>

      {/* Conditional Validation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Validation</h2>
        <p>
          Control when validators run using <code>skipOn</code> or <code>validateOn</code>.
        </p>
        <CodeBlock code={conditionalValidationCode} language="typescript" />
      </div>

      {/* Complex Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complex Example</h2>
        <CodeBlock code={complexExampleCode} language="typescript" />
      </div>

      {/* All Validators */}
      <div className="docs-section">
        <h2 className="docs-section-title">All Validators</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Validator</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>required()</code></td>
              <td>Field must have a value</td>
              <td><code>Validators.required()</code></td>
            </tr>
            <tr>
              <td><code>email()</code></td>
              <td>Valid email format</td>
              <td><code>Validators.email()</code></td>
            </tr>
            <tr>
              <td><code>pattern(regex)</code></td>
              <td>Match regex pattern</td>
              <td><code>Validators.pattern(/^\d{'{10}'}$/)</code></td>
            </tr>
            <tr>
              <td><code>minLength(n)</code></td>
              <td>Minimum string length</td>
              <td><code>Validators.minLength(3)</code></td>
            </tr>
            <tr>
              <td><code>maxLength(n)</code></td>
              <td>Maximum string length</td>
              <td><code>Validators.maxLength(100)</code></td>
            </tr>
            <tr>
              <td><code>min(n)</code></td>
              <td>Minimum numeric value</td>
              <td><code>Validators.min(0)</code></td>
            </tr>
            <tr>
              <td><code>max(n)</code></td>
              <td>Maximum numeric value</td>
              <td><code>Validators.max(100)</code></td>
            </tr>
            <tr>
              <td><code>numeric()</code></td>
              <td>Must be a number</td>
              <td><code>Validators.numeric()</code></td>
            </tr>
            <tr>
              <td><code>integer()</code></td>
              <td>Must be a whole number</td>
              <td><code>Validators.integer()</code></td>
            </tr>
            <tr>
              <td><code>url()</code></td>
              <td>Valid URL format</td>
              <td><code>Validators.url()</code></td>
            </tr>
            <tr>
              <td><code>alphanumeric()</code></td>
              <td>Letters and numbers only</td>
              <td><code>Validators.alphanumeric()</code></td>
            </tr>
            <tr>
              <td><code>phone()</code></td>
              <td>Valid phone number</td>
              <td><code>Validators.phone()</code></td>
            </tr>
            <tr>
              <td><code>custom(config)</code></td>
              <td>Custom validation logic</td>
              <td><code>Validators.custom({'{'} validate: ... {'}'})</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Types</h2>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          ValidationConfig
        </h3>
        <CodeBlock code={validationConfigCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          ValidationRule
        </h3>
        <CodeBlock code={ruleTypeCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>Combine validators</strong> - Use multiple validators for comprehensive validation
          </li>
          <li>
            <strong>Custom messages</strong> - Provide clear, user-friendly error messages
          </li>
          <li>
            <strong>Use conditional validation</strong> - Skip validation on draft/save actions
          </li>
          <li>
            <strong>Async sparingly</strong> - Use async validation only when necessary (API calls)
          </li>
          <li>
            <strong>Cross-field validation</strong> - Use custom validators for dependent fields
          </li>
          <li>
            <strong>Role-based validation</strong> - Enforce different rules for different user roles
          </li>
          <li>
            <strong>Order matters</strong> - Place expensive validators (async) last
          </li>
        </ul>
      </div>

      {/* Common Patterns */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Patterns</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Implementation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Required email</td>
              <td><code>Validators.required(), Validators.email()</code></td>
            </tr>
            <tr>
              <td>Phone number</td>
              <td><code>Validators.pattern(/^\d{'{10}'}$/, "10 digits")</code></td>
            </tr>
            <tr>
              <td>Password strength</td>
              <td><code>Validators.minLength(8), Validators.pattern(...)</code></td>
            </tr>
            <tr>
              <td>Age range</td>
              <td><code>Validators.min(18), Validators.max(65)</code></td>
            </tr>
            <tr>
              <td>Username uniqueness</td>
              <td><code>Validators.custom({'{'} validate: async (v, ctx) =&gt; ... {'}'})</code></td>
            </tr>
            <tr>
              <td>Confirm field match</td>
              <td><code>Validators.custom({'{'} validate: (v, ctx) =&gt; v === ctx.getValue(...) {'}'})</code></td>
            </tr>
            <tr>
              <td>Conditional required</td>
              <td><code>Validators.required({'{'} skipOn: ["draft"] {'}'})</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
