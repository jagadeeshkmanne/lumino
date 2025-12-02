/**
 * Form Sections Page - Visual grouping with headers
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoSelect,
  LuminoCheckbox,
  LuminoTextArea,
} from "lumino/react";

// =============================================================================
// FORM WITH MULTIPLE SECTIONS
// =============================================================================

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  department: string;
  bio: string;
  receiveUpdates: boolean;
}

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

class ProfileForm extends Form<ProfileData> {
  constructor() {
    super("profile-form");
  }

  configure() {
    // Section 1: Personal Information
    this.addSection("Personal Information")
      .collapsible(true)
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
          .placeholder("your@email.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Invalid email format")
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

    // Section 2: Work Information
    this.addSection("Work Information")
      .collapsible(true)
            .addRow()
        .addField("company")
          .component(LuminoTextInput)
          .label("Company")
          .placeholder("Company name")
        .endField()
        .addField("title")
          .component(LuminoTextInput)
          .label("Job Title")
          .placeholder("Your role")
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .placeholder("Select department")
          .props({ options: departments })
        .endField()
      .endRow()
    .endSection();

    // Section 3: Additional Info (starts collapsed)
    this.addSection("Additional Information")
      .collapsible(true)
            .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Bio")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3 })
        .endField()
      .endRow()
      .addRow()
        .addField("receiveUpdates")
          .component(LuminoCheckbox)
          .label("Receive email updates")
        .endField()
      .endRow()
    .endSection();
  }
}

const sectionsCode = `import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoSelect,
  LuminoCheckbox,
  LuminoTextArea,
} from "lumino/react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  department: string;
  bio: string;
  receiveUpdates: boolean;
}

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

class ProfileForm extends Form<ProfileData> {
  constructor() {
    super("profile-form");
  }

  configure() {
    // Section 1: Personal Information
    this.addSection("Personal Information")
      .collapsible(true)
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
          .placeholder("your@email.com")
          .rules(
            Validators.required(),
            Validators.email("Invalid email")
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

    // Section 2: Work Information
    this.addSection("Work Information")
      .collapsible(true)
            .addRow()
        .addField("company")
          .component(LuminoTextInput)
          .label("Company")
          .placeholder("Company name")
        .endField()
        .addField("title")
          .component(LuminoTextInput)
          .label("Job Title")
          .placeholder("Your role")
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .placeholder("Select department")
          .props({ options: departments })
        .endField()
      .endRow()
    .endSection();

    // Section 3: Additional Info (starts collapsed)
    this.addSection("Additional Information")
      .collapsible(true)
            .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Bio")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3 })
        .endField()
      .endRow()
      .addRow()
        .addField("receiveUpdates")
          .component(LuminoCheckbox)
          .label("Receive email updates")
        .endField()
      .endRow()
    .endSection();
  }
}`;

const sectionApiCode = `// SectionBuilder API
addSection(title: string): SectionBuilder<T>

// SectionBuilder methods
.collapsible(value: boolean)      // Allow collapse/expand
.defaultCollapsed(value: boolean) // Start collapsed
.hideByCondition(fn)              // Conditional visibility
.css(className: string)           // Custom CSS class
.style(styles: CSSProperties)     // Inline styles

// Add content
.addRow(): RowBuilder<T>
.addComponent(Component): ComponentBuilder

// Return to form
.endSection(): FormBuilder<T>`;

const basicSectionCode = `// Basic section with title
this.addSection("Contact Information")
  .addRow()
    .addField("name")
      .component(LuminoTextInput)
      .label("Name")
    .endField()
  .endRow()
.endSection();`;

const collapsibleSectionCode = `// Collapsible section (starts expanded)
this.addSection("Personal Details")
  .collapsible(true)
    .addRow()
    // ... fields
  .endRow()
.endSection();

// Collapsible section (starts collapsed)
this.addSection("Advanced Options")
  .collapsible(true)
    .addRow()
    // ... fields
  .endRow()
.endSection();`;

const conditionalSectionCode = `// Show section only when condition is met
this.addSection("Shipping Address")
  .hideByCondition((ctx) => ctx.getValue("sameAsBilling"))
  .addRow()
    .addField("shippingStreet")
      .component(LuminoTextInput)
      .label("Street")
    .endField()
  .endRow()
.endSection();`;

const styledSectionCode = `// Custom styling
this.addSection("Highlighted Section")
  .css("highlighted-section")
  .style({
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "8px",
  })
  .addRow()
    // ... fields
  .endRow()
.endSection();`;

export function FormSectionsPage() {
  const form = new ProfileForm();

  return (
    <>
      <h1 className="docs-page-title">Form Sections</h1>
      <p className="docs-page-subtitle">
        Sections provide visual grouping with headers and optional collapse functionality.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Sections are the primary way to organize fields into logical groups. Each section
          has a title header and can optionally be collapsible. Use sections to:
        </p>
        <ul>
          <li>Group related fields together (Personal Info, Address, Payment, etc.)</li>
          <li>Create collapsible regions to reduce visual complexity</li>
          <li>Apply conditional visibility to entire groups of fields</li>
          <li>Add custom styling to specific form areas</li>
        </ul>
      </div>

      {/* API Reference */}
      <div className="docs-section">
        <h2 className="docs-section-title">API Reference</h2>
        <CodeBlock code={sectionApiCode} language="typescript" />
      </div>

      {/* Live Demo */}
      <div className="docs-section">
        <h2 className="docs-section-title">Live Example</h2>
        <p>
          This form demonstrates multiple sections with different configurations.
          The "Additional Information" section starts collapsed - click to expand it.
        </p>
        <LuminoLiveDemo
          title="Profile Form"
          description="Multiple sections with collapsible behavior"
          form={form}
          code={sectionsCode}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            company: "",
            title: "",
            department: "",
            bio: "",
            receiveUpdates: false,
          }}
          defaultView="split"
        />
      </div>

      {/* Basic Section */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Section</h2>
        <p>
          The simplest section just has a title and contains rows with fields:
        </p>
        <CodeBlock code={basicSectionCode} language="typescript" />
      </div>

      {/* Collapsible Sections */}
      <div className="docs-section">
        <h2 className="docs-section-title">Collapsible Sections</h2>
        <p>
          Make sections collapsible with <code>.collapsible(true)</code>. Control the
          initial state with <code>.defaultCollapsed()</code>:
        </p>
        <CodeBlock code={collapsibleSectionCode} language="typescript" />
        <p>
          Collapsible sections render with a toggle icon in the header. Users can
          click to expand/collapse the content.
        </p>
      </div>

      {/* Conditional Sections */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Visibility</h2>
        <p>
          Hide entire sections based on form state using <code>.hideByCondition()</code>:
        </p>
        <CodeBlock code={conditionalSectionCode} language="typescript" />
        <p>
          The function receives the <code>FormContext</code> and returns <code>true</code> to
          hide the section.
        </p>
      </div>

      {/* Styled Sections */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Styling</h2>
        <p>
          Apply custom CSS classes and inline styles to sections:
        </p>
        <CodeBlock code={styledSectionCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>Logical grouping</strong> - Group fields that are conceptually related
            (e.g., "Billing Address" and "Shipping Address" as separate sections)
          </li>
          <li>
            <strong>Progressive disclosure</strong> - Use collapsed sections for advanced
            or optional fields to reduce initial complexity
          </li>
          <li>
            <strong>Clear titles</strong> - Use descriptive section titles that tell users
            what information is expected
          </li>
          <li>
            <strong>Consistent structure</strong> - Keep similar forms using similar
            section structures for user familiarity
          </li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>Rows</strong> - Learn about horizontal layouts within sections</li>
          <li><strong>Fields</strong> - Individual field configuration</li>
          <li><strong>Validation</strong> - Adding validation rules to fields</li>
        </ul>
      </div>
    </>
  );
}
