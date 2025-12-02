/**
 * TextInput Field Page
 *
 * Documents the LuminoTextInput component with live demos.
 * Uses Form Builder pattern with LuminoLiveDemo component.
 */

import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

// =============================================================================
// BASIC TEXT INPUT FORM
// =============================================================================

class BasicTextInputForm extends Form<{ name: string; email: string; description: string }> {
  constructor() { super("basic-text-input-form"); }
  configure() {
    this.addSection("Basic Text Inputs")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Name")
          .placeholder("Enter your name")
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("you@example.com")
        .endField()
      .endRow()
      .addRow()
        .addField("description")
          .component(LuminoTextInput)
          .label("Description")
          .placeholder("Optional description")
                  .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class BasicTextInputForm extends Form<{ name: string; email: string; description: string }> {
  constructor() { super("basic-text-input-form"); }

  configure() {
    this.addSection("Basic Text Inputs")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Name")
          .placeholder("Enter your name")
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("you@example.com")
        .endField()
      .endRow()
      .addRow()
        .addField("description")
          .component(LuminoTextInput)
          .label("Description")
          .placeholder("Optional description")
                  .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STATES FORM
// =============================================================================

class StatesForm extends Form<{ normal: string; disabled: string; readOnly: string; error: string; required: string }> {
  constructor() { super("states-form"); }
  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("normal")
          .component(LuminoTextInput)
          .label("Normal")
          .placeholder("Editable text")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoTextInput)
          .label("Disabled")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoTextInput)
          .label("Read Only")
          .readOnly(true)
        .endField()
      .endRow()
      .addRow()
        .addField("error")
          .component(LuminoTextInput)
          .label("With Error")
          .rules(Validators.required({ message: "This field is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("required")
          .component(LuminoTextInput)
          .label("Required Field")
          .placeholder("Required")
          .rules(Validators.required({ message: "This field is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class StatesForm extends Form<{ normal: string; disabled: string; readOnly: string; error: string; required: string }> {
  constructor() { super("states-form"); }

  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("normal")
          .component(LuminoTextInput)
          .label("Normal")
          .placeholder("Editable text")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoTextInput)
          .label("Disabled")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoTextInput)
          .label("Read Only")
          .readOnly(true)
        .endField()
      .endRow()
      .addRow()
        .addField("error")
          .component(LuminoTextInput)
          .label("With Error")
          .rules(Validators.required({ message: "This field is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("required")
          .component(LuminoTextInput)
          .label("Required Field")
          .placeholder("Required")
          .rules(Validators.required({ message: "This field is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION FORM
// =============================================================================

class ValidationForm extends Form<{ username: string; email: string; password: string }> {
  constructor() { super("validation-form"); }
  configure() {
    this.addSection("Validation Examples")
      .addRow()
        .addField("username")
          .component(LuminoTextInput)
          .label("Username")
          .placeholder("3-20 characters")
          .rules(
            Validators.required({ message: "Username is required" }),
            Validators.minLength(3, "Minimum 3 characters"),
            Validators.maxLength(20, "Maximum 20 characters")
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
            Validators.email("Invalid email format")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password")
          .placeholder("Minimum 8 characters")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Password is required" }),
            Validators.minLength(8, "Minimum 8 characters")
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class ValidationForm extends Form<{ username: string; email: string; password: string }> {
  constructor() { super("validation-form"); }

  configure() {
    this.addSection("Validation Examples")
      .addRow()
        .addField("username")
          .component(LuminoTextInput)
          .label("Username")
          .placeholder("3-20 characters")
          .rules(
            Validators.required({ message: "Username is required" }),
            Validators.minLength(3, "Minimum 3 characters"),
            Validators.maxLength(20, "Maximum 20 characters")
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
            Validators.email("Invalid email format")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password")
          .placeholder("Minimum 8 characters")
          .props({ type: "password" })
          .rules(
            Validators.required({ message: "Password is required" }),
            Validators.minLength(8, "Minimum 8 characters")
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CUSTOM PROPS FORM
// =============================================================================

class CustomPropsForm extends Form<{ prefix: string; suffix: string; password: string; maxChars: string }> {
  constructor() { super("custom-props-form"); }
  configure() {
    this.addSection("Custom Properties")
      .addRow()
        .addField("prefix")
          .component(LuminoTextInput)
          .label("With Prefix")
          .placeholder("0.00")
          .props({ prefix: "$" })
        .endField()
      .endRow()
      .addRow()
        .addField("suffix")
          .component(LuminoTextInput)
          .label("With Suffix")
          .placeholder("Amount")
          .props({ suffix: ".00" })
        .endField()
      .endRow()
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password Type")
          .placeholder("Enter password")
          .props({ type: "password" })
        .endField()
      .endRow()
      .addRow()
        .addField("maxChars")
          .component(LuminoTextInput)
          .label("Max Length (50)")
                    .props({ maxLength: 50 })
        .endField()
      .endRow()
    .endSection();
  }
}

const propsCode = `import { Form } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class CustomPropsForm extends Form<{ prefix: string; suffix: string; password: string; maxChars: string }> {
  constructor() { super("custom-props-form"); }

  configure() {
    this.addSection("Custom Properties")
      .addRow()
        .addField("prefix")
          .component(LuminoTextInput)
          .label("With Prefix")
          .placeholder("0.00")
          .props({ prefix: "$" })
        .endField()
      .endRow()
      .addRow()
        .addField("suffix")
          .component(LuminoTextInput)
          .label("With Suffix")
          .placeholder("Amount")
          .props({ suffix: ".00" })
        .endField()
      .endRow()
      .addRow()
        .addField("password")
          .component(LuminoTextInput)
          .label("Password Type")
          .placeholder("Enter password")
          .props({ type: "password" })
        .endField()
      .endRow()
      .addRow()
        .addField("maxChars")
          .component(LuminoTextInput)
          .label("Max Length (50)")
                    .props({ maxLength: 50 })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function TextInputPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">TextInput</h1>
      <p className="docs-page-subtitle">
        A single-line text input field for entering string values.
        Supports validation, prefixes/suffixes, and various input types.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <p>Simple text inputs with labels and placeholders:</p>
        <LuminoLiveDemo
          title="Basic Text Inputs"
          description="Standard text input fields"
          form={new BasicTextInputForm()}
          code={basicCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Field States</h2>
        <p>TextInput supports various states for different use cases:</p>
        <LuminoLiveDemo
          title="Input States"
          description="Disabled, read-only, error, and required states"
          form={new StatesForm()}
          code={statesCode}
          initialValues={{ disabled: "Cannot edit", readOnly: "Read only value" }}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Validation</h2>
        <p>Apply validation logic to show error messages:</p>
        <LuminoLiveDemo
          title="Input Validation"
          description="Various validation rules"
          form={new ValidationForm()}
          code={validationCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Custom Props</h2>
        <p>Customize appearance with prefixes, suffixes, and input types:</p>
        <LuminoLiveDemo
          title="Custom Properties"
          description="Prefix, suffix, password type, and max length"
          form={new CustomPropsForm()}
          code={propsCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Props</h2>
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
              <td>string</td>
              <td>""</td>
              <td>Current input value</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: string) =&gt; void</td>
              <td>-</td>
              <td>Called when value changes</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td>string</td>
              <td>-</td>
              <td>Field label</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td>string</td>
              <td>-</td>
              <td>Placeholder text</td>
            </tr>
            <tr>
              <td><code>helperText</code></td>
              <td>string</td>
              <td>-</td>
              <td>Help text below input</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td>string</td>
              <td>-</td>
              <td>Error message</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable input</td>
            </tr>
            <tr>
              <td><code>readOnly</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Read-only mode</td>
            </tr>
            <tr>
              <td><code>required</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Show required indicator</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td>string</td>
              <td>"text"</td>
              <td>Input type (text, password, email, etc.)</td>
            </tr>
            <tr>
              <td><code>prefix</code></td>
              <td>string</td>
              <td>-</td>
              <td>Prefix text/icon</td>
            </tr>
            <tr>
              <td><code>suffix</code></td>
              <td>string</td>
              <td>-</td>
              <td>Suffix text/icon</td>
            </tr>
            <tr>
              <td><code>maxLength</code></td>
              <td>number</td>
              <td>-</td>
              <td>Maximum characters</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Form Builder Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.component(LuminoTextInput)</code></td>
              <td>Set the text input component</td>
            </tr>
            <tr>
              <td><code>.label(string)</code></td>
              <td>Set field label</td>
            </tr>
            <tr>
              <td><code>.placeholder(string)</code></td>
              <td>Set placeholder text</td>
            </tr>
            <tr>
              <td><code>.rules(...validators)</code></td>
              <td>Add validation rules</td>
            </tr>
            <tr>
              <td><code>.disable(boolean | function)</code></td>
              <td>Disable the field</td>
            </tr>
            <tr>
              <td><code>.readOnly(boolean | function)</code></td>
              <td>Make field read-only</td>
            </tr>
            <tr>
              <td><code>.props(&#123; type, prefix, suffix, maxLength &#125;)</code></td>
              <td>Pass additional props</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Always provide labels</strong> - Labels improve accessibility
            and user experience
          </li>
          <li>
            <strong>Use placeholder wisely</strong> - Don't use placeholder as the
            only label; it disappears when typing
          </li>
          <li>
            <strong>Add helper text</strong> - Explain formatting expectations
            (e.g., "Enter in MM/DD/YYYY format")
          </li>
          <li>
            <strong>Use appropriate type</strong> - Use type="email" for emails,
            type="password" for passwords
          </li>
          <li>
            <strong>Set maxLength</strong> - Prevent excessive input when there
            are backend limits
          </li>
          <li>
            <strong>Use Validators</strong> - Use built-in validators like
            Validators.required(), Validators.email(), Validators.minLength()
          </li>
        </ul>
      </div>
    </div>
  );
}
