/**
 * Checkbox Field Page
 *
 * Documents the LuminoCheckbox component with live demos.
 * Uses Form Builder pattern with LuminoLiveDemo component.
 */

import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoCheckbox, LuminoCheckboxGroup } from "lumino/react";

// =============================================================================
// BASIC CHECKBOX FORM
// =============================================================================

class BasicCheckboxForm extends Form<{ agreed: boolean; subscribed: boolean; remember: boolean }> {
  constructor() { super("basic-checkbox-form"); }
  configure() {
    this.addSection("Basic Checkboxes")
      .addRow()
        .addField("agreed")
          .component(LuminoCheckbox)
          .label("I agree to the Terms and Conditions")
        .endField()
      .endRow()
      .addRow()
        .addField("subscribed")
          .component(LuminoCheckbox)
          .label("Subscribe to newsletter")
        .endField()
      .endRow()
      .addRow()
        .addField("remember")
          .component(LuminoCheckbox)
          .label("Remember me")
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoCheckbox } from "lumino/react";

class BasicCheckboxForm extends Form<{ agreed: boolean; subscribed: boolean; remember: boolean }> {
  constructor() { super("basic-checkbox-form"); }

  configure() {
    this.addSection("Basic Checkboxes")
      .addRow()
        .addField("agreed")
          .component(LuminoCheckbox)
          .label("I agree to the Terms and Conditions")
        .endField()
      .endRow()
      .addRow()
        .addField("subscribed")
          .component(LuminoCheckbox)
          .label("Subscribe to newsletter")
        .endField()
      .endRow()
      .addRow()
        .addField("remember")
          .component(LuminoCheckbox)
          .label("Remember me")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STATES FORM
// =============================================================================

class StatesCheckboxForm extends Form<{ normal: boolean; disabled: boolean; readOnly: boolean }> {
  constructor() { super("states-checkbox-form"); }
  configure() {
    this.addSection("Checkbox States")
      .addRow()
        .addField("normal")
          .component(LuminoCheckbox)
          .label("Normal checkbox")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoCheckbox)
          .label("Disabled checkbox")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoCheckbox)
          .label("Read-only checkbox")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form } from "lumino/core";
import { LuminoCheckbox } from "lumino/react";

class StatesCheckboxForm extends Form<{ normal: boolean; disabled: boolean; readOnly: boolean }> {
  constructor() { super("states-checkbox-form"); }

  configure() {
    this.addSection("Checkbox States")
      .addRow()
        .addField("normal")
          .component(LuminoCheckbox)
          .label("Normal checkbox")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoCheckbox)
          .label("Disabled checkbox")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoCheckbox)
          .label("Read-only checkbox")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION FORM
// =============================================================================

class ValidationCheckboxForm extends Form<{ terms: boolean; privacy: boolean }> {
  constructor() { super("validation-checkbox-form"); }
  configure() {
    this.addSection("Required Checkboxes")
      .addRow()
        .addField("terms")
          .component(LuminoCheckbox)
          .label("I accept the Terms of Service")
          .rules(Validators.required({ message: "You must accept the terms to continue" }))
        .endField()
      .endRow()
      .addRow()
        .addField("privacy")
          .component(LuminoCheckbox)
          .label("I agree to the Privacy Policy")
          .rules(Validators.required({ message: "You must agree to the privacy policy" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoCheckbox } from "lumino/react";

class ValidationCheckboxForm extends Form<{ terms: boolean; privacy: boolean }> {
  constructor() { super("validation-checkbox-form"); }

  configure() {
    this.addSection("Required Checkboxes")
      .addRow()
        .addField("terms")
          .component(LuminoCheckbox)
          .label("I accept the Terms of Service")
          .rules(Validators.required({ message: "You must accept the terms to continue" }))
        .endField()
      .endRow()
      .addRow()
        .addField("privacy")
          .component(LuminoCheckbox)
          .label("I agree to the Privacy Policy")
          .rules(Validators.required({ message: "You must agree to the privacy policy" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CHECKBOX GROUP FORM
// =============================================================================

class CheckboxGroupForm extends Form<{ interests: string[] }> {
  constructor() { super("checkbox-group-form"); }
  configure() {
    this.addSection("Checkbox Group")
      .addRow()
        .addField("interests")
          .component(LuminoCheckboxGroup)
          .label("Select your interests")
          .props({
            options: [
              { value: "tech", label: "Technology" },
              { value: "sports", label: "Sports" },
              { value: "music", label: "Music" },
              { value: "travel", label: "Travel" },
              { value: "food", label: "Food & Cooking" },
            ]
          })
        .endField()
      .endRow()
    .endSection();
  }
}

const groupCode = `import { Form } from "lumino/core";
import { LuminoCheckboxGroup } from "lumino/react";

class CheckboxGroupForm extends Form<{ interests: string[] }> {
  constructor() { super("checkbox-group-form"); }

  configure() {
    this.addSection("Checkbox Group")
      .addRow()
        .addField("interests")
          .component(LuminoCheckboxGroup)
          .label("Select your interests")
          .props({
            options: [
              { value: "tech", label: "Technology" },
              { value: "sports", label: "Sports" },
              { value: "music", label: "Music" },
              { value: "travel", label: "Travel" },
              { value: "food", label: "Food & Cooking" },
            ]
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// HORIZONTAL CHECKBOX GROUP FORM
// =============================================================================

class HorizontalGroupForm extends Form<{ notifications: string[] }> {
  constructor() { super("horizontal-group-form"); }
  configure() {
    this.addSection("Notification Preferences")
      .addRow()
        .addField("notifications")
          .component(LuminoCheckboxGroup)
          .label("Notification channels")
          .props({
            options: [
              { value: "email", label: "Email" },
              { value: "sms", label: "SMS" },
              { value: "push", label: "Push" },
            ],
            layout: "horizontal"
          })
        .endField()
      .endRow()
    .endSection();
  }
}

const horizontalCode = `import { Form } from "lumino/core";
import { LuminoCheckboxGroup } from "lumino/react";

class HorizontalGroupForm extends Form<{ notifications: string[] }> {
  constructor() { super("horizontal-group-form"); }

  configure() {
    this.addSection("Notification Preferences")
      .addRow()
        .addField("notifications")
          .component(LuminoCheckboxGroup)
          .label("Notification channels")
          .props({
            options: [
              { value: "email", label: "Email" },
              { value: "sms", label: "SMS" },
              { value: "push", label: "Push" },
            ],
            layout: "horizontal"
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// REQUIRED GROUP FORM
// =============================================================================

class RequiredGroupForm extends Form<{ skills: string[] }> {
  constructor() { super("required-group-form"); }
  configure() {
    this.addSection("Skills Selection")
      .addRow()
        .addField("skills")
          .component(LuminoCheckboxGroup)
          .label("Select at least one skill")
          .props({
            options: [
              { value: "frontend", label: "Frontend" },
              { value: "backend", label: "Backend" },
              { value: "devops", label: "DevOps" },
              { value: "mobile", label: "Mobile" },
            ]
          })
          .rules(Validators.required({ message: "Please select at least one option" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const requiredGroupCode = `import { Form, Validators } from "lumino/core";
import { LuminoCheckboxGroup } from "lumino/react";

class RequiredGroupForm extends Form<{ skills: string[] }> {
  constructor() { super("required-group-form"); }

  configure() {
    this.addSection("Skills Selection")
      .addRow()
        .addField("skills")
          .component(LuminoCheckboxGroup)
          .label("Select at least one skill")
          .props({
            options: [
              { value: "frontend", label: "Frontend" },
              { value: "backend", label: "Backend" },
              { value: "devops", label: "DevOps" },
              { value: "mobile", label: "Mobile" },
            ]
          })
          .rules(Validators.required({ message: "Please select at least one option" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function CheckboxPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Checkbox</h1>
      <p className="docs-page-subtitle">
        Checkbox components for boolean and multi-select values.
        Includes single Checkbox and CheckboxGroup for arrays.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoCheckbox, LuminoCheckboxGroup } from "lumino/react";`}</pre>
      </div>

      {/* Single Checkbox Demos */}
      <div className="docs-section">
        <h2>Basic Checkbox</h2>
        <p>Single checkboxes for boolean values:</p>
        <LuminoLiveDemo
          title="Basic"
          description="Standard checkbox fields"
          code={basicCode}
          form={BasicCheckboxForm}
          initialValues={{ agreed: false, subscribed: true, remember: false }}
        />
      </div>

      <div className="docs-section">
        <h2>Checkbox States</h2>
        <p>Different interactive states:</p>
        <LuminoLiveDemo
          title="States"
          description="Normal, disabled, and read-only"
          code={statesCode}
          form={StatesCheckboxForm}
          initialValues={{ normal: false, disabled: true, readOnly: true }}
        />
      </div>

      <div className="docs-section">
        <h2>Validation</h2>
        <p>Required checkbox with validation:</p>
        <LuminoLiveDemo
          title="Required"
          description="Must be checked to submit"
          code={validationCode}
          form={ValidationCheckboxForm}
          initialValues={{ terms: false, privacy: false }}
        />
      </div>

      {/* CheckboxGroup Demos */}
      <div className="docs-section">
        <h2>Checkbox Group</h2>
        <p>Select multiple options from a list:</p>
        <LuminoLiveDemo
          title="Basic Group"
          description="Multiple selection"
          code={groupCode}
          form={CheckboxGroupForm}
          initialValues={{ interests: ["tech"] }}
        />
      </div>

      <div className="docs-section">
        <h2>Horizontal Layout</h2>
        <p>Display checkboxes in a row:</p>
        <LuminoLiveDemo
          title="Horizontal"
          description="Horizontal checkbox layout"
          code={horizontalCode}
          form={HorizontalGroupForm}
          initialValues={{ notifications: ["email"] }}
        />
      </div>

      <div className="docs-section">
        <h2>Required Group</h2>
        <p>Require at least one selection:</p>
        <LuminoLiveDemo
          title="Required Group"
          description="Validation on group"
          code={requiredGroupCode}
          form={RequiredGroupForm}
          initialValues={{ skills: [] }}
        />
      </div>

      {/* Props Tables */}
      <div className="docs-section">
        <h2>LuminoCheckbox Props</h2>
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
              <td><code>value</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Checked state</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: boolean) =&gt; void</td>
              <td>-</td>
              <td>Called when toggled</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td>string</td>
              <td>-</td>
              <td>Checkbox label</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable checkbox</td>
            </tr>
            <tr>
              <td><code>indeterminate</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Indeterminate state</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td>string</td>
              <td>-</td>
              <td>Error message</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Required indicator</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>LuminoCheckboxGroup Props</h2>
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
              <td><code>value</code></td>
              <td>string[]</td>
              <td>[]</td>
              <td>Selected values array</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: string[]) =&gt; void</td>
              <td>-</td>
              <td>Called when selection changes</td>
            </tr>
            <tr>
              <td><code>options</code></td>
              <td>Array&lt;Option&gt;</td>
              <td>[]</td>
              <td>Available options</td>
            </tr>
            <tr>
              <td><code>layout</code></td>
              <td>"vertical" | "horizontal"</td>
              <td>"vertical"</td>
              <td>Layout direction</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable all checkboxes</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Required indicator</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td>string</td>
              <td>-</td>
              <td>Error message</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use Checkbox for single boolean</strong> - Toggle switches
            are alternatives for on/off states
          </li>
          <li>
            <strong>Use CheckboxGroup for multi-select</strong> - When users
            can select multiple options
          </li>
          <li>
            <strong>Clear labels</strong> - Make each option's meaning clear
          </li>
          <li>
            <strong>Use indeterminate for "select all"</strong> - Shows partial
            selection state clearly
          </li>
          <li>
            <strong>Validate minimum selections</strong> - Use error prop
            if at least one must be selected
          </li>
        </ul>
      </div>
    </div>
  );
}
