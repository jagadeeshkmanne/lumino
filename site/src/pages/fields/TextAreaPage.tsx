/**
 * TextArea Field Page
 *
 * Documents the LuminoTextArea component with live demos using Form Builder pattern.
 * Uses LuminoLiveDemo component for interactive demos.
 */

import React from "react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTextArea, LuminoTextInput } from "lumino/react";

// =============================================================================
// BASIC TEXTAREA FORM
// =============================================================================

class BasicTextAreaForm extends Form<{ description: string; notes: string }> {
  constructor() { super("basic-textarea-form"); }
  configure() {
    this.addSection("Basic Text Areas")
      .addRow()
        .addField("description")
          .component(LuminoTextArea)
          .label("Description")
          .placeholder("Enter a description...")
        .endField()
      .endRow()
      .addRow()
        .addField("notes")
          .component(LuminoTextArea)
          .label("Notes")
          .placeholder("Additional notes...")
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoTextArea } from "lumino/react";

class BasicTextAreaForm extends Form<{ description: string; notes: string }> {
  constructor() { super("basic-textarea-form"); }

  configure() {
    this.addSection("Basic Text Areas")
      .addRow()
        .addField("description")
          .component(LuminoTextArea)
          .label("Description")
          .placeholder("Enter a description...")
        .endField()
      .endRow()
      .addRow()
        .addField("notes")
          .component(LuminoTextArea)
          .label("Notes")
          .placeholder("Additional notes...")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// ROWS (HEIGHT) FORM
// =============================================================================

class RowsForm extends Form<{ shortText: string; mediumText: string; longText: string }> {
  constructor() { super("rows-form"); }
  configure() {
    this.addSection("Different Row Heights")
      .addRow()
        .addField("shortText")
          .component(LuminoTextArea)
          .label("2 Rows (compact)")
          .placeholder("Short text...")
          .props({ rows: 2 })
        .endField()
      .endRow()
      .addRow()
        .addField("mediumText")
          .component(LuminoTextArea)
          .label("4 Rows (default)")
          .placeholder("Medium length text...")
          .props({ rows: 4 })
        .endField()
      .endRow()
      .addRow()
        .addField("longText")
          .component(LuminoTextArea)
          .label("8 Rows (large)")
          .placeholder("Long form content like blog posts, articles, etc...")
          .props({ rows: 8 })
        .endField()
      .endRow()
    .endSection();
  }
}

const rowsCode = `import { Form } from "lumino/core";
import { LuminoTextArea } from "lumino/react";

class RowsForm extends Form<{ shortText: string; mediumText: string; longText: string }> {
  constructor() { super("rows-form"); }

  configure() {
    this.addSection("Different Row Heights")
      .addRow()
        .addField("shortText")
          .component(LuminoTextArea)
          .label("2 Rows (compact)")
          .placeholder("Short text...")
          .props({ rows: 2 })
        .endField()
      .endRow()
      .addRow()
        .addField("mediumText")
          .component(LuminoTextArea)
          .label("4 Rows (default)")
          .placeholder("Medium length text...")
          .props({ rows: 4 })
        .endField()
      .endRow()
      .addRow()
        .addField("longText")
          .component(LuminoTextArea)
          .label("8 Rows (large)")
          .placeholder("Long form content...")
          .props({ rows: 8 })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MAX LENGTH FORM
// =============================================================================

class MaxLengthForm extends Form<{ bio: string; tweet: string }> {
  constructor() { super("maxlength-form"); }
  configure() {
    this.addSection("Character Limits")
      .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Bio (max 200)")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3, maxLength: 200 })
          .rules(Validators.maxLength(200, "Maximum 200 characters"))
        .endField()
      .endRow()
      .addRow()
        .addField("tweet")
          .component(LuminoTextArea)
          .label("Tweet (max 280)")
          .placeholder("What's happening?")
          .props({ rows: 2, maxLength: 280 })
          .rules(Validators.maxLength(280, "Maximum 280 characters"))
        .endField()
      .endRow()
    .endSection();
  }
}

const maxLengthCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextArea } from "lumino/react";

class MaxLengthForm extends Form<{ bio: string; tweet: string }> {
  constructor() { super("maxlength-form"); }

  configure() {
    this.addSection("Character Limits")
      .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Bio (max 200)")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3, maxLength: 200 })
          .rules(Validators.maxLength(200, "Maximum 200 characters"))
        .endField()
      .endRow()
      .addRow()
        .addField("tweet")
          .component(LuminoTextArea)
          .label("Tweet (max 280)")
          .placeholder("What's happening?")
          .props({ rows: 2, maxLength: 280 })
          .rules(Validators.maxLength(280, "Maximum 280 characters"))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DISABLED AND READ-ONLY FORM
// =============================================================================

class StatesForm extends Form<{ disabled: string; readOnly: string }> {
  constructor() { super("states-form"); }
  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("disabled")
          .component(LuminoTextArea)
          .label("Disabled Field")
          .props({ rows: 2 })
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoTextArea)
          .label("Read-Only Field")
          .props({ rows: 2 })
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form } from "lumino/core";
import { LuminoTextArea } from "lumino/react";

class StatesForm extends Form<{ disabled: string; readOnly: string }> {
  constructor() { super("states-form"); }

  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("disabled")
          .component(LuminoTextArea)
          .label("Disabled Field")
          .props({ rows: 2 })
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoTextArea)
          .label("Read-Only Field")
          .props({ rows: 2 })
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION FORM
// =============================================================================

class ValidationForm extends Form<{ required: string; minLength: string }> {
  constructor() { super("validation-form"); }
  configure() {
    this.addSection("Validation")
      .addRow()
        .addField("required")
          .component(LuminoTextArea)
          .label("Required Field")
          .placeholder("This field is required")
          .props({ rows: 3 })
          .rules(Validators.required({ message: "This field is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("minLength")
          .component(LuminoTextArea)
          .label("Min 20 Characters")
          .placeholder("Enter at least 20 characters...")
          .props({ rows: 3 })
          .rules(
            Validators.required({ message: "This field is required" }),
            Validators.minLength(20, "Minimum 20 characters required")
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextArea } from "lumino/react";

class ValidationForm extends Form<{ required: string; minLength: string }> {
  constructor() { super("validation-form"); }

  configure() {
    this.addSection("Validation")
      .addRow()
        .addField("required")
          .component(LuminoTextArea)
          .label("Required Field")
          .placeholder("This field is required")
          .props({ rows: 3 })
          .rules(Validators.required({ message: "This field is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("minLength")
          .component(LuminoTextArea)
          .label("Min 20 Characters")
          .placeholder("Enter at least 20 characters...")
          .props({ rows: 3 })
          .rules(
            Validators.required({ message: "This field is required" }),
            Validators.minLength(20, "Minimum 20 characters required")
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// FEEDBACK FORM EXAMPLE
// =============================================================================

class FeedbackForm extends Form<{ name: string; feedback: string }> {
  constructor() { super("feedback-form"); }
  configure() {
    this.addSection("Feedback Form")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Your Name")
          .placeholder("Enter your name...")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("feedback")
          .component(LuminoTextArea)
          .label("Feedback")
          .placeholder("Tell us what you think...")
          .props({ rows: 5, maxLength: 500 })
                    .rules(
            Validators.required({ message: "Feedback is required" }),
            Validators.minLength(10, "Please provide at least 10 characters")
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const feedbackFormCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoTextArea } from "lumino/react";

class FeedbackForm extends Form<{ name: string; feedback: string }> {
  constructor() { super("feedback-form"); }

  configure() {
    this.addSection("Feedback Form")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Your Name")
          .placeholder("Enter your name...")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("feedback")
          .component(LuminoTextArea)
          .label("Feedback")
          .placeholder("Tell us what you think...")
          .props({ rows: 5, maxLength: 500 })
                    .rules(
            Validators.required({ message: "Feedback is required" }),
            Validators.minLength(10, "Please provide at least 10 characters")
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MULTI-FIELD LAYOUT FORM
// =============================================================================

class MultiFieldForm extends Form<{ address: string; city: string; notes: string }> {
  constructor() { super("multi-field-form"); }
  configure() {
    this.addSection("Contact Information")
      .addRow()
        .addField("address")
          .component(LuminoTextArea)
          .label("Street Address")
          .placeholder("Enter street address...")
          .props({ rows: 2 })
        .endField()
      .endRow()
      .addRow()
        .addField("city")
          .component(LuminoTextInput)
          .label("City")
          .placeholder("City")
        .endField()
        .addField("notes")
          .component(LuminoTextArea)
          .label("Delivery Notes")
          .placeholder("Any special instructions...")
          .props({ rows: 2 })
        .endField()
        .layout([1, 2])
      .endRow()
    .endSection();
  }
}

const multiFieldCode = `import { Form } from "lumino/core";
import { LuminoTextInput, LuminoTextArea } from "lumino/react";

class MultiFieldForm extends Form<{ address: string; city: string; notes: string }> {
  constructor() { super("multi-field-form"); }

  configure() {
    this.addSection("Contact Information")
      .addRow()
        .addField("address")
          .component(LuminoTextArea)
          .label("Street Address")
          .placeholder("Enter street address...")
          .props({ rows: 2 })
        .endField()
      .endRow()
      .addRow()
        .addField("city")
          .component(LuminoTextInput)
          .label("City")
          .placeholder("City")
        .endField()
        .addField("notes")
          .component(LuminoTextArea)
          .label("Delivery Notes")
          .placeholder("Any special instructions...")
          .props({ rows: 2 })
        .endField()
        .layout([1, 2])  // City takes 1/3, notes takes 2/3
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function TextAreaPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">TextArea</h1>
      <p className="docs-page-subtitle">
        A multi-line text input field for longer content like descriptions,
        comments, and notes.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import { LuminoTextArea } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic TextArea</h2>
        <p>Simple multi-line text inputs with controlled value:</p>
        <LuminoLiveDemo
          title="Basic"
          description="Standard textarea"
          form={new BasicTextAreaForm()}
          code={basicCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Rows (Height)</h2>
        <p>Control the visible height with the rows prop:</p>
        <LuminoLiveDemo
          title="Rows"
          description="Different row heights"
          form={new RowsForm()}
          code={rowsCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Max Length</h2>
        <p>Limit the number of characters with character counter:</p>
        <LuminoLiveDemo
          title="Max Length"
          description="Character limit with counter"
          form={new MaxLengthForm()}
          code={maxLengthCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Disabled and Read-Only</h2>
        <p>Non-interactive textarea states:</p>
        <LuminoLiveDemo
          title="Disabled/ReadOnly"
          description="Non-interactive states"
          form={new StatesForm()}
          code={statesCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Validation</h2>
        <p>Display validation errors with Validators:</p>
        <LuminoLiveDemo
          title="Validation"
          description="Textarea with validation"
          form={new ValidationForm()}
          code={validationCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Feedback Form Example</h2>
        <p>A complete feedback form combining text input and textarea:</p>
        <LuminoLiveDemo
          title="Feedback Form"
          description="Complete form example"
          form={new FeedbackForm()}
          code={feedbackFormCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Multi-Field Layout</h2>
        <p>TextArea combined with other fields in custom layouts:</p>
        <LuminoLiveDemo
          title="Multi-Field"
          description="Combined field layout"
          form={new MultiFieldForm()}
          code={multiFieldCode}
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
              <td>Current value (controlled)</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: string) =&gt; void</td>
              <td>-</td>
              <td>Called when value changes</td>
            </tr>
            <tr>
              <td><code>rows</code></td>
              <td>number</td>
              <td>3</td>
              <td>Number of visible text lines</td>
            </tr>
            <tr>
              <td><code>maxLength</code></td>
              <td>number</td>
              <td>-</td>
              <td>Maximum character limit</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td>string</td>
              <td>-</td>
              <td>Placeholder text</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable the textarea</td>
            </tr>
            <tr>
              <td><code>readOnly</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Make textarea read-only</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td>string</td>
              <td>-</td>
              <td>Error message to display</td>
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
              <td><code>.component(LuminoTextArea)</code></td>
              <td>Set the textarea component</td>
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
              <td><code>.props(&#123; rows, maxLength &#125;)</code></td>
              <td>Pass textarea-specific props</td>
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
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Set appropriate rows</strong> - Use 2-3 rows for short content,
            5-8+ for longer content like blog posts
          </li>
          <li>
            <strong>Add maxLength when needed</strong> - Prevent excessive input
            and show character counter
          </li>
          <li>
            <strong>Use placeholder wisely</strong> - Provide helpful hints
            about expected content format
          </li>
          <li>
            <strong>Handle empty values</strong> - Empty textarea returns empty
            string, validate appropriately
          </li>
          <li>
            <strong>Consider mobile users</strong> - Ensure textarea is large
            enough for touch input
          </li>
          <li>
            <strong>Use Validators</strong> - Combine with minLength/maxLength
            validators for comprehensive validation
          </li>
        </ul>
      </div>
    </div>
  );
}
