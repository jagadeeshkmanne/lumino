/**
 * Form Field Configuration Documentation
 *
 * Documents all field configuration options with mini demos.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { Form, Validators } from "lumino/core";
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

class ConfigEntity {
  firstName = "";
  lastName = "";
  email = "";
  age: number | null = null;
  status = "";
  notes = "";
  salary: number | null = null;
  isActive = false;
}

// =============================================================================
// DEMO 1: Basic Field Configuration
// =============================================================================

class BasicFieldConfigForm extends Form<ConfigEntity> {
  constructor() {
    super("basic-field-config");
  }

  configure() {
    this.addSection("Basic Field Configuration")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter your first name")
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter your last name")
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const basicFieldConfigCode = `class BasicFieldConfigForm extends Form<Entity> {
  configure() {
    this.addSection("Basic Field Configuration")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)    // UI component
          .label("First Name")           // Field label
          .placeholder("Enter your first name")  // Placeholder text
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter your last name")
          .endField()
        .layout([1, 1])  // Equal columns
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 2: Props Configuration
// =============================================================================

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

class PropsConfigForm extends Form<ConfigEntity> {
  constructor() {
    super("props-config");
  }

  configure() {
    this.addSection("Props Configuration")
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .placeholder("Select status")
          .props({ options: statusOptions })
          .endField()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          .placeholder("Enter age")
          .props({ min: 18, max: 100, step: 1 })
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const propsConfigCode = `const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

class PropsConfigForm extends Form<Entity> {
  configure() {
    this.addSection("Props Configuration")
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .placeholder("Select status")
          // Pass props to the component
          .props({ options: statusOptions })
          .endField()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          // NumberInput specific props
          .props({ min: 18, max: 100, step: 1 })
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 3: Dynamic Props
// =============================================================================

const urgentPriorities = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
];

const normalPriorities = [
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

class DynamicPropsEntity {
  isUrgent = false;
  priority = "";
}

class DynamicPropsForm extends Form<DynamicPropsEntity> {
  constructor() {
    super("dynamic-props");
  }

  configure() {
    this.addSection("Dynamic Props (based on context)")
      .addRow()
        .addField("isUrgent")
          .component(LuminoCheckbox)
          .label("This is urgent")
          .endField()
      .endRow()
      .addRow()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority")
          .placeholder("Select priority")
          .props((ctx) => ({
            options: ctx.getValue("isUrgent") ? urgentPriorities : normalPriorities
          }))
          .endField()
      .endRow()
    .endSection();
  }
}

const dynamicPropsCode = `class DynamicPropsForm extends Form<Entity> {
  configure() {
    this.addSection("Dynamic Props")
      .addRow()
        .addField("isUrgent")
          .component(LuminoCheckbox)
          .label("This is urgent")
          .endField()
      .endRow()
      .addRow()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority")
          // Dynamic props based on form context
          .props((ctx) => ({
            options: ctx.getValue("isUrgent")
              ? urgentPriorities
              : normalPriorities
          }))
          .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 4: Field with Validation
// =============================================================================

class ValidationConfigForm extends Form<ConfigEntity> {
  constructor() {
    super("validation-config");
  }

  configure() {
    this.addSection("Field with Validation Rules")
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email Address")
          .placeholder("Enter email")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
          .endField()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          .placeholder("Enter age (18-65)")
          .rules(
            Validators.required({ message: "Age is required" }),
            Validators.min(18, "Must be at least 18"),
            Validators.max(65, "Must be 65 or under")
          )
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const validationConfigCode = `class ValidationConfigForm extends Form<Entity> {
  configure() {
    this.addSection("Field with Validation Rules")
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email Address")
          // Multiple validation rules
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
          .endField()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          .rules(
            Validators.required({ message: "Age is required" }),
            Validators.min(18, "Must be at least 18"),
            Validators.max(65, "Must be 65 or under")
          )
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 5: Disabled and ReadOnly Fields
// =============================================================================

class DisabledEntity {
  editableField = "You can edit this";
  disabledField = "This is disabled";
  readOnlyField = "This is read-only";
  conditionalField = "Based on checkbox";
  enableEditing = false;
}

class DisabledReadOnlyForm extends Form<DisabledEntity> {
  constructor() {
    super("disabled-readonly");
  }

  configure() {
    this.addSection("Disabled vs ReadOnly Fields")
      .addRow()
        .addField("enableEditing")
          .component(LuminoCheckbox)
          .label("Enable editing of conditional field")
          .endField()
      .endRow()
      .addRow()
        .addField("editableField")
          .component(LuminoTextInput)
          .label("Editable Field")
          .endField()
        .addField("disabledField")
          .component(LuminoTextInput)
          .label("Always Disabled")
          .disable(() => true)
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("readOnlyField")
          .component(LuminoTextInput)
          .label("Always Read-Only")
          .readOnly(() => true)
          .endField()
        .addField("conditionalField")
          .component(LuminoTextInput)
          .label("Conditionally Disabled")
          .disable((ctx) => !ctx.getValue("enableEditing"))
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const disabledReadOnlyCode = `class DisabledReadOnlyForm extends Form<Entity> {
  configure() {
    this.addSection("Disabled vs ReadOnly Fields")
      .addRow()
        .addField("enableEditing")
          .component(LuminoCheckbox)
          .label("Enable editing")
          .endField()
      .endRow()
      .addRow()
        .addField("disabledField")
          .component(LuminoTextInput)
          .label("Always Disabled")
          // Static disabled
          .disable(() => true)
          .endField()
        .addField("readOnlyField")
          .component(LuminoTextInput)
          .label("Always Read-Only")
          // Read-only shows value but can't edit
          .readOnly(() => true)
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("conditionalField")
          .component(LuminoTextInput)
          .label("Conditionally Disabled")
          // Dynamic based on another field
          .disable((ctx) => !ctx.getValue("enableEditing"))
          .endField()
      .endRow()
    .endSection();
  }
}

// Key Differences:
// - disable(): Field is greyed out, validation still runs
// - readOnly(): Field shows value as text, can't interact`;

// =============================================================================
// DEMO 6: Layout Configuration
// =============================================================================

class LayoutEntity {
  field1 = "";
  field2 = "";
  field3 = "";
  fullWidth = "";
}

class LayoutConfigForm extends Form<LayoutEntity> {
  constructor() {
    super("layout-config");
  }

  configure() {
    this.addSection("Layout Configuration")
      .addRow()
        .addField("field1")
          .component(LuminoTextInput)
          .label("1/4 Width")
          .placeholder("25%")
          .endField()
        .addField("field2")
          .component(LuminoTextInput)
          .label("1/2 Width")
          .placeholder("50%")
          .endField()
        .addField("field3")
          .component(LuminoTextInput)
          .label("1/4 Width")
          .placeholder("25%")
          .endField()
        .layout([1, 2, 1])
      .endRow()
      .addRow()
        .addField("fullWidth")
          .component(LuminoTextInput)
          .label("Full Width Field")
          .placeholder("This field spans the entire row")
          .endField()
      .endRow()
    .endSection();
  }
}

const layoutConfigCode = `class LayoutConfigForm extends Form<Entity> {
  configure() {
    this.addSection("Layout Configuration")
      .addRow()
        .addField("field1")
          .component(LuminoTextInput)
          .label("1/4 Width")
          .endField()
        .addField("field2")
          .component(LuminoTextInput)
          .label("1/2 Width")
          .endField()
        .addField("field3")
          .component(LuminoTextInput)
          .label("1/4 Width")
          .endField()
        // Layout ratios: field1=1, field2=2, field3=1
        // Total = 4, so 25%, 50%, 25%
        .layout([1, 2, 1])
      .endRow()
      .addRow()
        .addField("fullWidth")
          .component(LuminoTextInput)
          .label("Full Width")
          .endField()
        // Single field = full width by default
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function FormFieldConfigPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Field Configuration</h1>
      <p className="docs-page-subtitle">
        Complete reference for all field configuration options in Lumino Form Builder.
        Each configuration has a mini demo showing the feature in action.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        Each demo shows a specific configuration option with working examples.
      </div>

      <div className="docs-section">
        <h2>Configuration Methods Reference</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.component()</code></td>
              <td>Set the UI component to render</td>
              <td><code>.component(LuminoTextInput)</code></td>
            </tr>
            <tr>
              <td><code>.label()</code></td>
              <td>Set the field label</td>
              <td><code>.label("First Name")</code></td>
            </tr>
            <tr>
              <td><code>.placeholder()</code></td>
              <td>Set placeholder text</td>
              <td><code>.placeholder("Enter name")</code></td>
            </tr>
            <tr>
              <td><code>.props()</code></td>
              <td>Pass props to component (static or dynamic)</td>
              <td><code>.props({'{ options }'}) or .props((ctx) =&gt; ...)</code></td>
            </tr>
            <tr>
              <td><code>.rules()</code></td>
              <td>Add validation rules</td>
              <td><code>.rules(Validators.required())</code></td>
            </tr>
            <tr>
              <td><code>.disable()</code></td>
              <td>Disable field (greyed out, still validates)</td>
              <td><code>.disable((ctx) =&gt; ctx.mode === "view")</code></td>
            </tr>
            <tr>
              <td><code>.readOnly()</code></td>
              <td>Make field read-only (shows value, can't edit)</td>
              <td><code>.readOnly(() =&gt; true)</code></td>
            </tr>
            <tr>
              <td><code>.hideByCondition()</code></td>
              <td>Hide based on condition (clears data)</td>
              <td><code>.hideByCondition((ctx) =&gt; !ctx.getValue("show"))</code></td>
            </tr>
            <tr>
              <td><code>.visibleByAccess()</code></td>
              <td>Show based on permissions (preserves data)</td>
              <td><code>.visibleByAccess((ctx) =&gt; ctx.user?.hasRole("admin"))</code></td>
            </tr>
            <tr>
              <td><code>.dependsOn()</code></td>
              <td>Set field dependencies</td>
              <td><code>.dependsOn("country", {'{ clear: true }'})</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>1. Basic Field Configuration</h2>
        <p>
          Every field requires at minimum a <code>component</code> and typically a <code>label</code>.
          The <code>placeholder</code> provides hint text when the field is empty.
        </p>
        <LiveDemo
          title="Basic Configuration"
          description="component(), label(), and placeholder()"
          code={basicFieldConfigCode}
          FormClass={BasicFieldConfigForm}
          EntityClass={ConfigEntity}
        />
      </div>

      <div className="docs-section">
        <h2>2. Props Configuration</h2>
        <p>
          The <code>.props()</code> method passes properties to the underlying component.
          Different components accept different props (e.g., Select needs options, NumberInput accepts min/max).
        </p>
        <LiveDemo
          title="Static Props"
          description="Pass component-specific props"
          code={propsConfigCode}
          FormClass={PropsConfigForm}
          EntityClass={ConfigEntity}
        />
      </div>

      <div className="docs-section">
        <h2>3. Dynamic Props</h2>
        <p>
          Props can be a function that receives <code>FormContext</code>, allowing dynamic
          configuration based on other field values or form state.
        </p>
        <LiveDemo
          title="Dynamic Props"
          description="Props that change based on form context"
          code={dynamicPropsCode}
          FormClass={DynamicPropsForm}
          EntityClass={DynamicPropsEntity}
        />
      </div>

      <div className="docs-section">
        <h2>4. Validation Rules</h2>
        <p>
          The <code>.rules()</code> method accepts one or more validators from <code>Validators</code>.
          Multiple rules are applied in order.
        </p>
        <LiveDemo
          title="Validation Configuration"
          description="Multiple validation rules on a field"
          code={validationConfigCode}
          FormClass={ValidationConfigForm}
          EntityClass={ConfigEntity}
        />
      </div>

      <div className="docs-section">
        <h2>5. Disabled vs Read-Only</h2>
        <p>
          <strong>disable()</strong>: Field is greyed out but validation still runs.<br />
          <strong>readOnly()</strong>: Field shows value as text, user cannot interact.
        </p>
        <LiveDemo
          title="Disabled and ReadOnly"
          description="Different ways to prevent editing"
          code={disabledReadOnlyCode}
          FormClass={DisabledReadOnlyForm}
          EntityClass={DisabledEntity}
        />
      </div>

      <div className="docs-section">
        <h2>6. Layout Configuration</h2>
        <p>
          The <code>.layout()</code> method on rows defines column widths as ratios.
          For example, <code>[1, 2, 1]</code> creates 25%, 50%, 25% columns.
        </p>
        <LiveDemo
          title="Layout Ratios"
          description="Control field widths with layout()"
          code={layoutConfigCode}
          FormClass={LayoutConfigForm}
          EntityClass={LayoutEntity}
        />
      </div>

      <div className="docs-section">
        <h2>Complete Field Configuration Example</h2>
        <pre className="docs-code">{`class CompleteFieldExample extends Form<Entity> {
  configure() {
    this.addSection("Complete Example")
      .addRow()
        .addField("email")
          // Required: Component to render
          .component(LuminoTextInput)

          // Display options
          .label("Email Address")
          .placeholder("Enter your email")

          // Component props
          .props({ autoComplete: "email" })

          // Validation
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Invalid email format")
          )

          // State control
          .disable((ctx) => ctx.mode === "view")
          .readOnly((ctx) => !ctx.user?.hasPermission("edit_email"))

          // Visibility
          .hideByCondition((ctx) => ctx.getValue("usePhone"))
          .visibleByAccess((ctx) => ctx.user?.hasRole("user"))

          // Dependencies
          .dependsOn("domain", {
            handler: (domain, ctx) => {
              const email = ctx.getValue("email");
              if (email && !email.includes("@")) {
                ctx.setValue("email", email + "@" + domain);
              }
            }
          })

          // Always end with endField()
          .endField()
      .endRow()
    .endSection();
  }
}`}</pre>
      </div>
    </div>
  );
}
