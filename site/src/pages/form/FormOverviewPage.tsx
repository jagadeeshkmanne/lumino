/**
 * Form Overview Page - Introduction to Lumino Form Builder
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

// =============================================================================
// SIMPLE FORM EXAMPLE
// =============================================================================

interface ContactData {
  name: string;
  email: string;
  phone: string;
}

class ContactForm extends Form<ContactData> {
  constructor() {
    super("contact-form");
  }

  configure() {
    this.addSection("Contact Information")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Full Name")
          .placeholder("Enter your name")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("your@email.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
        .endField()
        .addField("phone")
          .component(LuminoTextInput)
          .label("Phone")
          .placeholder("(123) 456-7890")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const simpleFormCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

interface ContactData {
  name: string;
  email: string;
  phone: string;
}

class ContactForm extends Form<ContactData> {
  constructor() {
    super("contact-form");
  }

  configure() {
    this.addSection("Contact Information")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Full Name")
          .placeholder("Enter your name")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("your@email.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
        .endField()
        .addField("phone")
          .component(LuminoTextInput)
          .label("Phone")
          .placeholder("(123) 456-7890")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

const architectureCode = `// Form Builder Architecture
//
// Form
//   └── Sections (visual grouping with headers)
//         └── Rows (horizontal layout)
//               └── Fields (individual input components)
//                     └── Component (LuminoTextInput, etc.)
//                     └── Validators (rules for validation)
//                     └── Config (label, placeholder, etc.)`;

const fluentApiCode = `// Fluent API Pattern - chainable methods
form.addSection("Personal Info")
  .addRow()
    .addField("firstName")
      .component(LuminoTextInput)
      .label("First Name")
      .placeholder("Enter first name")
      .rules(Validators.required())
    .endField()
    .addField("lastName")
      .component(LuminoTextInput)
      .label("Last Name")
      .rules(Validators.required())
    .endField()
    .layout([1, 1])  // Two equal columns
  .endRow()
.endSection();`;

const entityBindingCode = `// Entity Class - defines form data shape
class Employee {
  firstName = "";
  lastName = "";
  email = "";
  department = "";
  age: number | null = null;
}

// Form binds to entity via generic type
class EmployeeForm extends Form<Employee> {
  configure() {
    // Fields automatically bind to entity properties
    this.addRow()
      .addField("firstName")  // Binds to employee.firstName
        .component(LuminoTextInput)
        .label("First Name")
      .endField()
    .endRow();
  }
}

// Usage
const employee = new Employee();
<FormRenderer form={form} entity={employee} />`;

export function FormOverviewPage() {
  const form = new ContactForm();

  return (
    <>
      <h1 className="docs-page-title">Form Builder</h1>
      <p className="docs-page-subtitle">
        Build type-safe, declarative forms with Lumino's fluent API.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">What is the Form Builder?</h2>
        <p>
          The Form Builder is Lumino's core feature for creating data entry forms.
          It provides a <strong>fluent, chainable API</strong> that lets you define
          forms declaratively in TypeScript with full type safety.
        </p>
        <p>
          Forms are built using a hierarchical structure: <strong>Sections</strong> contain
          <strong> Rows</strong>, and Rows contain <strong>Fields</strong>. Each field is bound
          to a property on your entity class and can have validation rules, conditional visibility,
          and custom rendering.
        </p>
      </div>

      {/* Key Features */}
      <div className="docs-section">
        <h2 className="docs-section-title">Key Features</h2>
        <ul>
          <li><strong>Type-safe</strong> - Full TypeScript support with inferred field types from your entity</li>
          <li><strong>Fluent API</strong> - Chainable builder pattern for clean, readable form definitions</li>
          <li><strong>UI-agnostic</strong> - Works with any component library via adapters (Salt, MUI, etc.)</li>
          <li><strong>Validation</strong> - Built-in validators + custom validation with async support</li>
          <li><strong>Dynamic forms</strong> - Conditional visibility, field dependencies, computed values</li>
          <li><strong>Layouts</strong> - Flexible grid system with sections, rows, and column layouts</li>
          <li><strong>Lists</strong> - Support for array fields with tabs, tables, or custom renderers</li>
        </ul>
      </div>

      {/* Live Demo */}
      <div className="docs-section">
        <h2 className="docs-section-title">Quick Example</h2>
        <p>
          Here's a simple contact form showing the basic Form Builder pattern:
        </p>
        <LuminoLiveDemo
          title="Contact Form"
          description="Basic form with sections, rows, and validation"
          form={form}
          code={simpleFormCode}
          defaultView="split"
        />
      </div>

      {/* Architecture */}
      <div className="docs-section">
        <h2 className="docs-section-title">Architecture</h2>
        <p>
          Forms follow a hierarchical structure that maps to visual layout:
        </p>
        <CodeBlock code={architectureCode} language="typescript" />
        <ul>
          <li><strong>Form</strong> - The root container that holds all form elements</li>
          <li><strong>Sections</strong> - Visual groupings with optional headers (collapsible)</li>
          <li><strong>Rows</strong> - Horizontal containers that hold fields side by side</li>
          <li><strong>Fields</strong> - Individual input components bound to entity properties</li>
        </ul>
      </div>

      {/* Fluent API */}
      <div className="docs-section">
        <h2 className="docs-section-title">Fluent API Pattern</h2>
        <p>
          The Form Builder uses a fluent (chainable) API pattern. Each method returns
          the builder, allowing you to chain calls together:
        </p>
        <CodeBlock code={fluentApiCode} language="typescript" />
        <p>
          Note the <code>.endField()</code>, <code>.endRow()</code>, and <code>.endSection()</code> calls -
          these return you to the parent builder level, allowing you to continue building.
        </p>
      </div>

      {/* Entity Binding */}
      <div className="docs-section">
        <h2 className="docs-section-title">Entity Binding</h2>
        <p>
          Forms are bound to entity classes via TypeScript generics. The field names
          you use in <code>.addField()</code> are type-checked against your entity:
        </p>
        <CodeBlock code={entityBindingCode} language="typescript" />
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>Form Class</strong> - Deep dive into the Form class and its methods</li>
          <li><strong>Entity Binding</strong> - How forms bind to your data models</li>
          <li><strong>Sections</strong> - Grouping fields with headers and collapse</li>
          <li><strong>Rows</strong> - Horizontal layouts and column configuration</li>
          <li><strong>Validation</strong> - Built-in validators and custom rules</li>
          <li><strong>FormContext</strong> - Accessing form state and methods in callbacks</li>
        </ul>
      </div>
    </>
  );
}
