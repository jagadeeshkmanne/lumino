/**
 * Advanced Validation Page
 *
 * Documents cross-field validation, conditional validation, async validation,
 * and validation modes (blur/change/submit) with live interactive demos.
 */

import { Form, Validators } from "lumino/core";
import type { FormContext } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoCheckbox,
  LuminoButton,
  LuminoStackLayout,
  LuminoText,
} from "lumino/react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { CodeBlock } from "../../components/CodeBlock";

// =============================================================================
// CROSS-FIELD VALIDATION DEMOS
// =============================================================================

// Demo 1: Password Confirmation (cross-field)
class PasswordConfirmForm extends Form<{ password: string; confirmPassword: string }> {
  constructor() { super("password-confirm-form"); }
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
            Validators.minLength(8, "At least 8 characters")
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
            Validators.required({ message: "Please confirm password" }),
            Validators.custom({
              validate: (value, ctx) => {
                const password = ctx.getValue("password");
                return value === password;
              },
              message: "Passwords do not match"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const passwordConfirmCode = `class PasswordConfirmForm extends Form<{ password: string; confirmPassword: string }> {
  configure() {
    this.addSection("Password Confirmation")
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Password is required" }),
            Validators.minLength(8, "At least 8 characters")
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
            // Cross-field validation: compare with password field
            Validators.custom({
              validate: (value, ctx) => {
                const password = ctx.getValue("password");
                return value === password;
              },
              message: "Passwords do not match"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// Demo 2: Date Range (cross-field)
class DateRangeForm extends Form<{ startDate: string; endDate: string }> {
  constructor() { super("date-range-form"); }
  configure() {
    this.addSection("Date Range")
      .addRow()
        .addField("startDate")
          .component(LuminoTextInput)
          .label("Start Date")
          .props({ type: "date" })
          .rules(Validators.required({ message: "Start date required" }))
        .endField()
        .addField("endDate")
          .component(LuminoTextInput)
          .label("End Date")
          .props({ type: "date" })
          .rules(
            Validators.required({ message: "End date required" }),
            Validators.custom({
              validate: (value, ctx) => {
                const startDate = ctx.getValue("startDate");
                if (!startDate || !value) return true;
                return new Date(value) >= new Date(startDate as string);
              },
              message: "End date must be after start date"
            })
          )
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const dateRangeCode = `class DateRangeForm extends Form<{ startDate: string; endDate: string }> {
  configure() {
    this.addSection("Date Range")
      .addRow()
        .addField("startDate")
          .component(LuminoTextInput)
          .label("Start Date")
          .props({ type: "date" })
          .rules(Validators.required({ message: "Start date required" }))
        .endField()
        .addField("endDate")
          .component(LuminoTextInput)
          .label("End Date")
          .props({ type: "date" })
          .rules(
            Validators.required({ message: "End date required" }),
            // Cross-field: compare with startDate
            Validators.custom({
              validate: (value, ctx) => {
                const startDate = ctx.getValue("startDate");
                if (!startDate || !value) return true;
                return new Date(value) >= new Date(startDate);
              },
              message: "End date must be after start date"
            })
          )
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// Demo 3: Min/Max Validation (cross-field)
class PriceRangeForm extends Form<{ minPrice: number; maxPrice: number }> {
  constructor() { super("price-range-form"); }
  configure() {
    this.addSection("Price Range")
      .addRow()
        .addField("minPrice")
          .component(LuminoNumberInput)
          .label("Minimum Price")
          .placeholder("0")
          .rules(
            Validators.required({ message: "Min price required" }),
            Validators.min(0, "Must be 0 or greater")
          )
        .endField()
        .addField("maxPrice")
          .component(LuminoNumberInput)
          .label("Maximum Price")
          .placeholder("1000")
          .rules(
            Validators.required({ message: "Max price required" }),
            Validators.custom({
              validate: (value, ctx) => {
                const minPrice = ctx.getValue("minPrice");
                if (minPrice === undefined || value === undefined) return true;
                return Number(value) >= Number(minPrice);
              },
              message: "Max must be greater than or equal to min"
            })
          )
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const priceRangeCode = `class PriceRangeForm extends Form<{ minPrice: number; maxPrice: number }> {
  configure() {
    this.addSection("Price Range")
      .addRow()
        .addField("minPrice")
          .component(LuminoNumberInput)
          .label("Minimum Price")
          .rules(
            Validators.required({ message: "Min price required" }),
            Validators.min(0, "Must be 0 or greater")
          )
        .endField()
        .addField("maxPrice")
          .component(LuminoNumberInput)
          .label("Maximum Price")
          .rules(
            Validators.required({ message: "Max price required" }),
            // Cross-field: max must be >= min
            Validators.custom({
              validate: (value, ctx) => {
                const minPrice = ctx.getValue("minPrice");
                if (minPrice === undefined || value === undefined) return true;
                return Number(value) >= Number(minPrice);
              },
              message: "Max must be greater than or equal to min"
            })
          )
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CONDITIONAL VALIDATION DEMOS
// =============================================================================

// Demo 4: Conditional Required (based on checkbox)
class ShippingForm extends Form<{ sameAsShipping: boolean; billingAddress: string }> {
  constructor() { super("shipping-form"); }
  configure() {
    this.addSection("Billing Address")
      .addRow()
        .addField("sameAsShipping")
          .component(LuminoCheckbox)
          .label("Billing address same as shipping")
        .endField()
      .endRow()
      .addRow()
        .addField("billingAddress")
          .component(LuminoTextInput)
          .label("Billing Address")
          .placeholder("Enter billing address")
          .visibleByCondition((ctx) => !ctx.getValue("sameAsShipping"))
          .rules(
            Validators.custom({
              validate: (value, ctx) => {
                const sameAsShipping = ctx.getValue("sameAsShipping");
                if (sameAsShipping) return true; // Not required if same as shipping
                return !!value && value.length > 0;
              },
              message: "Billing address is required"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const shippingCode = `class ShippingForm extends Form<{ sameAsShipping: boolean; billingAddress: string }> {
  configure() {
    this.addSection("Billing Address")
      .addRow()
        .addField("sameAsShipping")
          .component(LuminoCheckbox)
          .label("Billing address same as shipping")
        .endField()
      .endRow()
      .addRow()
        .addField("billingAddress")
          .component(LuminoTextInput)
          .label("Billing Address")
          // Hide when sameAsShipping is checked
          .visibleByCondition((ctx) => !ctx.getValue("sameAsShipping"))
          // Conditional: only required if NOT same as shipping
          .rules(
            Validators.custom({
              validate: (value, ctx) => {
                const sameAsShipping = ctx.getValue("sameAsShipping");
                if (sameAsShipping) return true;
                return !!value && value.length > 0;
              },
              message: "Billing address is required"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// Demo 5: Conditional Validation Based on Select
class EmploymentForm extends Form<{ employmentType: string; companyName: string; selfEmploymentDetails: string }> {
  constructor() { super("employment-form"); }
  configure() {
    this.addSection("Employment Details")
      .addRow()
        .addField("employmentType")
          .component(LuminoSelect)
          .label("Employment Type")
          .props({
            options: [
              { value: "employed", label: "Employed" },
              { value: "self-employed", label: "Self-Employed" },
              { value: "unemployed", label: "Unemployed" },
              { value: "student", label: "Student" },
            ]
          })
          .rules(Validators.required({ message: "Please select employment type" }))
        .endField()
      .endRow()
      .addRow()
        .addField("companyName")
          .component(LuminoTextInput)
          .label("Company Name")
          .placeholder("Enter company name")
          .visibleByCondition((ctx) => ctx.getValue("employmentType") === "employed")
          .rules(
            Validators.custom({
              validate: (value, ctx) => {
                if (ctx.getValue("employmentType") !== "employed") return true;
                return !!value && value.length > 0;
              },
              message: "Company name is required for employed"
            })
          )
        .endField()
      .endRow()
      .addRow()
        .addField("selfEmploymentDetails")
          .component(LuminoTextInput)
          .label("Business Description")
          .placeholder("Describe your business")
          .visibleByCondition((ctx) => ctx.getValue("employmentType") === "self-employed")
          .rules(
            Validators.custom({
              validate: (value, ctx) => {
                if (ctx.getValue("employmentType") !== "self-employed") return true;
                return !!value && value.length >= 10;
              },
              message: "Business description required (min 10 chars)"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const employmentCode = `class EmploymentForm extends Form<{ employmentType: string; companyName: string; selfEmploymentDetails: string }> {
  configure() {
    this.addSection("Employment Details")
      .addRow()
        .addField("employmentType")
          .component(LuminoSelect)
          .label("Employment Type")
          .props({
            options: [
              { value: "employed", label: "Employed" },
              { value: "self-employed", label: "Self-Employed" },
              { value: "unemployed", label: "Unemployed" },
              { value: "student", label: "Student" },
            ]
          })
          .rules(Validators.required())
        .endField()
      .endRow()
      .addRow()
        .addField("companyName")
          .component(LuminoTextInput)
          .label("Company Name")
          // Only visible when employed
          .visibleByCondition((ctx) => ctx.getValue("employmentType") === "employed")
          // Conditional validation
          .rules(
            Validators.custom({
              validate: (value, ctx) => {
                if (ctx.getValue("employmentType") !== "employed") return true;
                return !!value && value.length > 0;
              },
              message: "Company name is required for employed"
            })
          )
        .endField()
      .endRow()
      .addRow()
        .addField("selfEmploymentDetails")
          .component(LuminoTextInput)
          .label("Business Description")
          // Only visible when self-employed
          .visibleByCondition((ctx) => ctx.getValue("employmentType") === "self-employed")
          // Different conditional validation
          .rules(
            Validators.custom({
              validate: (value, ctx) => {
                if (ctx.getValue("employmentType") !== "self-employed") return true;
                return !!value && value.length >= 10;
              },
              message: "Business description required (min 10 chars)"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// ASYNC VALIDATION DEMOS
// =============================================================================

// Demo 6: Async Username Check
class UsernameForm extends Form<{ username: string; email: string }> {
  constructor() { super("username-form"); }
  configure() {
    this.addSection("User Registration")
      .addRow()
        .addField("username")
          .component(LuminoTextInput)
          .label("Username")
          .placeholder("Enter username")
          .rules(
            Validators.required({ message: "Username is required" }),
            Validators.minLength(3, "At least 3 characters"),
            Validators.pattern(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscore only"),
            // Async validation - simulated API check
            Validators.custom({
              validate: async (value) => {
                if (!value || value.length < 3) return true;
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 500));
                // Simulate: "admin" and "test" are taken
                const takenUsernames = ["admin", "test", "user", "root"];
                return !takenUsernames.includes(value.toLowerCase());
              },
              message: "Username is already taken"
            })
          )
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("you@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email"),
            // Async: check if email exists
            Validators.custom({
              validate: async (value) => {
                if (!value) return true;
                await new Promise(resolve => setTimeout(resolve, 300));
                // Simulate: these emails are taken
                const takenEmails = ["admin@example.com", "test@example.com"];
                return !takenEmails.includes(value.toLowerCase());
              },
              message: "Email is already registered"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const usernameCode = `class UsernameForm extends Form<{ username: string; email: string }> {
  configure() {
    this.addSection("User Registration")
      .addRow()
        .addField("username")
          .component(LuminoTextInput)
          .label("Username")
          .rules(
            Validators.required({ message: "Username is required" }),
            Validators.minLength(3, "At least 3 characters"),
            Validators.pattern(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscore only"),
            // Async validation with API call
            Validators.custom({
              validate: async (value) => {
                if (!value || value.length < 3) return true;

                // Call API to check availability
                const response = await fetch(\`/api/check-username?u=\${value}\`);
                const data = await response.json();
                return data.available;
              },
              message: "Username is already taken"
            })
          )
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email"),
            // Async: check if email exists
            Validators.custom({
              validate: async (value) => {
                if (!value) return true;
                const response = await fetch(\`/api/check-email?e=\${value}\`);
                const data = await response.json();
                return !data.exists;
              },
              message: "Email is already registered"
            })
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION MODES DEMO
// =============================================================================

// Demo 7: Validation Modes - shows different behaviors
class ValidationModesForm extends Form<{ blurField: string; changeField: string; submitField: string }> {
  constructor() { super("validation-modes-form"); }
  configure() {
    this.addSection("Validation Modes")
      .addRow()
        .addField("blurField")
          .component(LuminoTextInput)
          .label("Validates on Blur (default)")
          .placeholder("Type and click outside")
          .rules(
            Validators.required({ message: "This field is required" }),
            Validators.minLength(5, "At least 5 characters")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("changeField")
          .component(LuminoTextInput)
          .label("Validates on Change")
          .placeholder("Validates as you type")
          .rules(
            Validators.required({ message: "This field is required" }),
            Validators.minLength(5, "At least 5 characters")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("submitField")
          .component(LuminoTextInput)
          .label("Validates on Submit Only")
          .placeholder("No validation until submit")
          .rules(
            Validators.required({ message: "This field is required" }),
            Validators.minLength(5, "At least 5 characters")
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const validationModesCode = `// Validation modes are set on the FormRenderer, not on individual fields

// Option 1: Validate on blur (default)
<FormRenderer
  form={form}
  validateOnBlur={true}   // Default: true
  validateOnChange={false} // Default: false
/>

// Option 2: Validate on change (as user types)
<FormRenderer
  form={form}
  validateOnBlur={false}
  validateOnChange={true}  // Validates immediately on input
/>

// Option 3: Validate on submit only
<FormRenderer
  form={form}
  validateOnBlur={false}   // Disable blur validation
  validateOnChange={false} // Disable change validation
/>
// Validation runs automatically when form.submit() is called

// Option 4: Both blur and change
<FormRenderer
  form={form}
  validateOnBlur={true}
  validateOnChange={true}
/>`;

// =============================================================================
// ACTION-BASED VALIDATION (skipOn / validateOn)
// =============================================================================

const actionBasedCode = `// Skip validation for specific actions
.rules(
  Validators.required({
    message: "Required for final submit",
    skipOn: ["draft", "autosave"]  // Don't validate for these actions
  })
)

// Only validate for specific actions
.rules(
  Validators.custom({
    validate: async (value) => await checkAvailability(value),
    message: "Already taken",
    validateOn: ["submit", "publish"]  // Only check on these actions
  })
)

// Usage with form submit
const handleSave = () => {
  form.submit("draft");    // Skips required validation
};

const handlePublish = () => {
  form.submit("publish");  // Runs all validations
};`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function FormAdvancedValidationPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Advanced Validation</h1>
      <p className="docs-page-subtitle">
        Cross-field validation, conditional validation, async validation, and
        validation modes for complex form requirements.
      </p>

      {/* Quick Reference */}
      <div className="docs-section">
        <h2>Quick Reference</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Use Case</th>
              <th>Key Concept</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cross-Field</td>
              <td>Password confirmation, date ranges, min/max</td>
              <td><code>ctx.getValue("otherField")</code></td>
            </tr>
            <tr>
              <td>Conditional</td>
              <td>Required based on checkbox/select</td>
              <td>Check condition in <code>validate</code> function</td>
            </tr>
            <tr>
              <td>Async</td>
              <td>Username availability, email uniqueness</td>
              <td><code>async (value) =&gt; await api.check()</code></td>
            </tr>
            <tr>
              <td>Validation Modes</td>
              <td>UX control: blur vs change vs submit</td>
              <td><code>validateOnBlur</code>, <code>validateOnChange</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cross-Field Validation */}
      <div className="docs-section">
        <h2>Cross-Field Validation</h2>
        <p>
          Compare values across multiple fields using <code>ctx.getValue("fieldName")</code>
          in custom validators.
        </p>

        <h3>Password Confirmation</h3>
        <LuminoLiveDemo
          title="Password Match"
          description="Confirm password must match the password field"
          form={new PasswordConfirmForm()}
          code={passwordConfirmCode}
          defaultView="split"
        />

        <h3>Date Range</h3>
        <LuminoLiveDemo
          title="Date Range Validation"
          description="End date must be on or after start date"
          form={new DateRangeForm()}
          code={dateRangeCode}
          defaultView="split"
        />

        <h3>Min/Max Price Range</h3>
        <LuminoLiveDemo
          title="Price Range"
          description="Maximum must be greater than or equal to minimum"
          form={new PriceRangeForm()}
          code={priceRangeCode}
          defaultView="split"
        />
      </div>

      {/* Conditional Validation */}
      <div className="docs-section">
        <h2>Conditional Validation</h2>
        <p>
          Validate fields only when certain conditions are met. Combine with
          <code>.visibleByCondition()</code> to show/hide fields dynamically.
        </p>

        <h3>Checkbox Toggle</h3>
        <LuminoLiveDemo
          title="Conditional Required"
          description="Billing address only required if not same as shipping"
          form={new ShippingForm()}
          code={shippingCode}
          defaultView="split"
        />

        <h3>Select-Based Conditional</h3>
        <LuminoLiveDemo
          title="Employment Type"
          description="Different fields required based on employment type"
          form={new EmploymentForm()}
          code={employmentCode}
          defaultView="split"
        />
      </div>

      {/* Async Validation */}
      <div className="docs-section">
        <h2>Async Validation</h2>
        <p>
          Validate against server data using async validators. Perfect for
          checking username/email availability, validating codes, etc.
        </p>

        <div className="docs-note">
          <strong>Demo Note:</strong> This demo simulates API calls. Try "admin", "test",
          "user", or "root" for taken usernames. Try "admin@example.com" for taken email.
        </div>

        <LuminoLiveDemo
          title="Async Username/Email Check"
          description="Server-side validation for username and email availability"
          form={new UsernameForm()}
          code={usernameCode}
          defaultView="split"
        />
      </div>

      {/* Validation Modes */}
      <div className="docs-section">
        <h2>Validation Modes</h2>
        <p>
          Control when validation runs using <code>validateOnBlur</code> and
          <code>validateOnChange</code> props on FormRenderer.
        </p>

        <table className="docs-table">
          <thead>
            <tr>
              <th>Mode</th>
              <th>Props</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Blur (default)</strong></td>
              <td><code>validateOnBlur={true}</code></td>
              <td>Validates when user leaves the field</td>
            </tr>
            <tr>
              <td><strong>Change</strong></td>
              <td><code>validateOnChange={true}</code></td>
              <td>Validates on every keystroke (real-time)</td>
            </tr>
            <tr>
              <td><strong>Submit only</strong></td>
              <td><code>validateOnBlur={false}</code></td>
              <td>Only validates on form submission</td>
            </tr>
            <tr>
              <td><strong>Both</strong></td>
              <td><code>validateOnBlur={true} validateOnChange={true}</code></td>
              <td>Validates on blur AND change</td>
            </tr>
          </tbody>
        </table>

        <CodeBlock code={validationModesCode} language="tsx" />
      </div>

      {/* Action-Based Validation */}
      <div className="docs-section">
        <h2>Action-Based Validation</h2>
        <p>
          Skip or run validators based on the submit action (e.g., "draft" vs "publish").
          Use <code>skipOn</code> to skip validation for certain actions, or
          <code>validateOn</code> to only run validation for specific actions.
        </p>

        <CodeBlock code={actionBasedCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Handle empty values</strong> - Return <code>true</code> for empty
            values in cross-field validators; let <code>required</code> handle that
          </li>
          <li>
            <strong>Debounce async validations</strong> - Use the built-in debouncing
            in Lumino's validation runner for expensive API calls
          </li>
          <li>
            <strong>Combine with visibility</strong> - Use <code>.visibleByCondition()</code>
            with conditional validation to hide irrelevant fields
          </li>
          <li>
            <strong>Clear error messages</strong> - Tell users exactly what's wrong
            and how to fix it
          </li>
          <li>
            <strong>Use blur mode for most forms</strong> - Better UX than validating
            on every keystroke
          </li>
          <li>
            <strong>Use change mode for critical fields</strong> - Passwords, usernames
            where real-time feedback helps
          </li>
        </ul>
      </div>

      {/* API Reference */}
      <div className="docs-section">
        <h2>API Reference</h2>

        <h3>Validators.custom()</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>validate</code></td>
              <td>(value, ctx) =&gt; boolean | Promise&lt;boolean&gt;</td>
              <td>Validation function, return true if valid</td>
            </tr>
            <tr>
              <td><code>message</code></td>
              <td>string</td>
              <td>Error message when validation fails</td>
            </tr>
            <tr>
              <td><code>skipOn</code></td>
              <td>string[]</td>
              <td>Skip this validator for these actions</td>
            </tr>
            <tr>
              <td><code>validateOn</code></td>
              <td>string[]</td>
              <td>Only run for these actions</td>
            </tr>
          </tbody>
        </table>

        <h3>FormRenderer Props</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>validateOnBlur</code></td>
              <td>boolean</td>
              <td>true</td>
              <td>Validate when field loses focus</td>
            </tr>
            <tr>
              <td><code>validateOnChange</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Validate on every input change</td>
            </tr>
          </tbody>
        </table>

        <h3>FormContext Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>ctx.getValue(fieldName)</code></td>
              <td>Get value of another field (for cross-field validation)</td>
            </tr>
            <tr>
              <td><code>ctx.getValues()</code></td>
              <td>Get all form values</td>
            </tr>
            <tr>
              <td><code>ctx.isFieldHidden(fieldName)</code></td>
              <td>Check if a field is currently hidden</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
