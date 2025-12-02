/**
 * Quick Start Page
 *
 * A hands-on guide to building your first Lumino form.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoCheckbox,
  LuminoButton,
  FormRenderer,
} from "lumino/react";
import { LiveDemo } from "../components/LiveDemo";

// =============================================================================
// DEMO ENTITY
// =============================================================================

class Contact {
  firstName = "";
  lastName = "";
  email = "";
  phone = "";
  company = "";
  role = "";
  subscribeNewsletter = false;
}

// =============================================================================
// DEMO FORM
// =============================================================================

const roleOptions = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
  { value: "other", label: "Other" },
];

class ContactForm extends Form<Contact> {
  constructor() {
    super("contact-form");
  }

  configure() {
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter first name")
          .rules(Validators.required({ message: "First name is required" }))
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter last name")
          .rules(Validators.required({ message: "Last name is required" }))
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("you@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
          .endField()
        .addField("phone")
          .component(LuminoTextInput)
          .label("Phone")
          .placeholder("+1 (555) 123-4567")
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    this.addSection("Professional Information")
      .addRow()
        .addField("company")
          .component(LuminoTextInput)
          .label("Company")
          .placeholder("Your company name")
          .endField()
        .addField("role")
          .component(LuminoSelect)
          .label("Role")
          .placeholder("Select your role")
          .props({ options: roleOptions })
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("subscribeNewsletter")
          .component(LuminoCheckbox)
          .label("Subscribe to newsletter")
          .endField()
      .endRow()
    .endSection();

    this.addRow()
      .addComponent(LuminoButton)
        .children("Submit")
        .props({ variant: "primary" })
        .onClick(async (ctx) => {
          const isValid = await ctx.validate?.();
          if (isValid) {
            ctx.notify?.("Form submitted successfully!", "success");
          } else {
            ctx.notify?.("Please fix validation errors", "error");
          }
        })
      .endComponent()
    .endRow();
  }
}

const quickStartCode = `// 1. Define your entity
class Contact {
  firstName = "";
  lastName = "";
  email = "";
  phone = "";
  company = "";
  role = "";
  subscribeNewsletter = false;
}

// 2. Define options for select fields
const roleOptions = [
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "manager", label: "Manager" },
  { value: "other", label: "Other" },
];

// 3. Create your form class
class ContactForm extends Form<Contact> {
  constructor() {
    super("contact-form");
  }

  configure() {
    // Section 1: Personal Information
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter first name")
          .rules(Validators.required({ message: "First name is required" }))
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter last name")
          .rules(Validators.required({ message: "Last name is required" }))
          .endField()
        .layout([1, 1])  // Equal columns
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("you@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
          .endField()
        .addField("phone")
          .component(LuminoTextInput)
          .label("Phone")
          .placeholder("+1 (555) 123-4567")
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // Section 2: Professional Information
    this.addSection("Professional Information")
      .addRow()
        .addField("company")
          .component(LuminoTextInput)
          .label("Company")
          .endField()
        .addField("role")
          .component(LuminoSelect)
          .label("Role")
          .props({ options: roleOptions })
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("subscribeNewsletter")
          .component(LuminoCheckbox)
          .label("Subscribe to newsletter")
          .endField()
      .endRow()
    .endSection();

    // Submit button
    this.addRow()
      .addComponent(LuminoButton)
        .children("Submit")
        .props({ variant: "primary" })
        .onClick(async (ctx) => {
          const isValid = await ctx.validate?.();
          if (isValid) {
            ctx.notify?.("Form submitted!", "success");
          }
        })
      .endComponent()
    .endRow();
  }
}

// 4. Render the form
function MyPage() {
  const form = useMemo(() => new ContactForm(), []);
  const entity = useMemo(() => new Contact(), []);

  return (
    <FormRenderer
      form={form}
      entity={entity}
      mode="edit"
    />
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function QuickStartPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Quick Start</h1>
      <p className="docs-page-subtitle">
        Build your first Lumino form in 5 minutes. This guide walks you through
        creating a complete contact form with validation.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        Follow along to build a working form.
      </div>

      <div className="docs-section">
        <h2>What You'll Build</h2>
        <p>
          A contact form with:
        </p>
        <ul className="docs-list">
          <li>Text inputs for name, email, phone, and company</li>
          <li>Select dropdown for role</li>
          <li>Checkbox for newsletter subscription</li>
          <li>Validation with helpful error messages</li>
          <li>Submit button with form validation</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Step 1: Define Your Entity</h2>
        <p>
          Start by defining a TypeScript class that represents your form data:
        </p>
        <pre className="docs-code">{`class Contact {
  firstName = "";
  lastName = "";
  email = "";
  phone = "";
  company = "";
  role = "";
  subscribeNewsletter = false;
}`}</pre>
        <p>
          Each property becomes a bindable field in your form. Default values
          provide initial state.
        </p>
      </div>

      <div className="docs-section">
        <h2>Step 2: Create the Form Class</h2>
        <p>
          Extend the <code>Form</code> class and implement <code>configure()</code>:
        </p>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect, LuminoCheckbox } from "lumino/react";

class ContactForm extends Form<Contact> {
  constructor() {
    super("contact-form");  // Unique form ID
  }

  configure() {
    // Form configuration goes here
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 3: Add Sections and Fields</h2>
        <p>
          Use the fluent builder API to define your form structure:
        </p>
        <pre className="docs-code">{`configure() {
  this.addSection("Personal Information")
    .addRow()
      .addField("firstName")
        .component(LuminoTextInput)
        .label("First Name")
        .placeholder("Enter first name")
        .rules(Validators.required({ message: "First name is required" }))
        .endField()
      .addField("lastName")
        .component(LuminoTextInput)
        .label("Last Name")
        .rules(Validators.required({ message: "Last name is required" }))
        .endField()
      .layout([1, 1])  // Two equal columns
    .endRow()
  .endSection();
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 4: Add Validation</h2>
        <p>
          Use built-in validators or create custom ones:
        </p>
        <pre className="docs-code">{`.addField("email")
  .component(LuminoTextInput)
  .label("Email")
  .rules(
    Validators.required({ message: "Email is required" }),
    Validators.email("Please enter a valid email")
  )
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 5: Add Submit Button</h2>
        <p>
          Add a button that validates and submits the form:
        </p>
        <pre className="docs-code">{`this.addRow()
  .addComponent(LuminoButton)
    .children("Submit")
    .props({ variant: "primary" })
    .onClick(async (ctx) => {
      const isValid = await ctx.validate?.();
      if (isValid) {
        ctx.notify?.("Form submitted!", "success");
        // ctx.api.ContactsApi.create(ctx.getEntity());
      }
    })
  .endComponent()
.endRow();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 6: Render the Form</h2>
        <p>
          Use <code>FormRenderer</code> to render your form:
        </p>
        <pre className="docs-code">{`import { FormRenderer } from "lumino/react";

function ContactPage() {
  const form = useMemo(() => new ContactForm(), []);
  const entity = useMemo(() => new Contact(), []);

  return (
    <FormRenderer
      form={form}
      entity={entity}
      mode="edit"  // or "view" for read-only
    />
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Live Demo</h2>
        <p>
          Here's the complete working form. Try it out - fill in the fields and click Submit:
        </p>
        <LiveDemo
          title="Contact Form"
          description="Complete contact form with validation"
          code={quickStartCode}
          FormClass={ContactForm}
          EntityClass={Contact}
        />
      </div>

      <div className="docs-section">
        <h2>Key Concepts</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Concept</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Form&lt;T&gt;</code></td>
              <td>Base class for form definitions, generic over entity type</td>
            </tr>
            <tr>
              <td><code>configure()</code></td>
              <td>Method where you define form structure using the builder API</td>
            </tr>
            <tr>
              <td><code>addSection()</code></td>
              <td>Groups fields with an optional title</td>
            </tr>
            <tr>
              <td><code>addRow()</code></td>
              <td>Creates a horizontal row of fields</td>
            </tr>
            <tr>
              <td><code>addField()</code></td>
              <td>Adds a field bound to an entity property</td>
            </tr>
            <tr>
              <td><code>layout()</code></td>
              <td>Defines column proportions (e.g., [1, 1] for equal width)</td>
            </tr>
            <tr>
              <td><code>FormRenderer</code></td>
              <td>React component that renders a Form with an entity</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li>
            <strong>Field Types</strong> - Explore all available field components
          </li>
          <li>
            <strong>Validation</strong> - Learn about all built-in validators
          </li>
          <li>
            <strong>Lists</strong> - Add dynamic arrays of items
          </li>
          <li>
            <strong>Visibility</strong> - Show/hide fields conditionally
          </li>
          <li>
            <strong>Dependencies</strong> - Create field relationships
          </li>
        </ul>
      </div>
    </div>
  );
}
