/**
 * CustomField Page
 *
 * Documents how to create and use custom field components in Lumino.
 * Uses Form Builder pattern with LuminoLiveDemo component.
 */

import React from "react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoNumberInput, LuminoTextArea } from "lumino/react";

// =============================================================================
// BASIC CUSTOM FIELD FORM (Using standard fields as demo)
// =============================================================================

class BasicCustomFieldForm extends Form<{ username: string; bio: string }> {
  constructor() { super("basic-custom-form"); }
  configure() {
    this.addSection("Custom Field Demo")
      .addRow()
        .addField("username")
          .component(LuminoTextInput)
          .label("Username")
          .placeholder("Enter username...")
          .rules(
            Validators.required({ message: "Username is required" }),
            Validators.minLength(3, "Minimum 3 characters")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Biography")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3 })
          .rules(Validators.maxLength(200, "Maximum 200 characters"))
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCustomFieldCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoTextArea } from "lumino/react";

class BasicCustomFieldForm extends Form<{ username: string; bio: string }> {
  constructor() { super("basic-custom-form"); }

  configure() {
    this.addSection("Custom Field Demo")
      .addRow()
        .addField("username")
          .component(LuminoTextInput)
          .label("Username")
          .placeholder("Enter username...")
          .rules(
            Validators.required({ message: "Username is required" }),
            Validators.minLength(3, "Minimum 3 characters")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Biography")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3 })
          .rules(Validators.maxLength(200, "Maximum 200 characters"))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// FIELD WITH CUSTOM PROPS
// =============================================================================

class CustomPropsForm extends Form<{ amount: number; notes: string }> {
  constructor() { super("custom-props-form"); }
  configure() {
    this.addSection("Custom Props Example")
      .addRow()
        .addField("amount")
          .component(LuminoNumberInput)
          .label("Price ($)")
          .placeholder("0.00")
          .props({
            min: 0,
            max: 10000,
            step: 0.01,
          })
          .rules(
            Validators.required({ message: "Amount is required" }),
            Validators.min(0.01, "Minimum $0.01")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("notes")
          .component(LuminoTextArea)
          .label("Additional Notes")
          .placeholder("Enter any additional notes...")
          .props({
            rows: 4,
            maxLength: 500,
          })
        .endField()
      .endRow()
    .endSection();
  }
}

const customPropsCode = `import { Form, Validators } from "lumino/core";
import { LuminoNumberInput, LuminoTextArea } from "lumino/react";

class CustomPropsForm extends Form<{ amount: number; notes: string }> {
  constructor() { super("custom-props-form"); }

  configure() {
    this.addSection("Custom Props Example")
      .addRow()
        .addField("amount")
          .component(LuminoNumberInput)
          .label("Price ($)")
          .placeholder("0.00")
          .props({
            min: 0,
            max: 10000,
            step: 0.01,
          })
          .rules(
            Validators.required({ message: "Amount is required" }),
            Validators.min(0.01, "Minimum $0.01")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("notes")
          .component(LuminoTextArea)
          .label("Additional Notes")
          .placeholder("Enter any additional notes...")
          .props({
            rows: 4,
            maxLength: 500,
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MULTI-FIELD LAYOUT
// =============================================================================

class MultiFieldLayoutForm extends Form<{ firstName: string; lastName: string; age: number; email: string }> {
  constructor() { super("multi-field-form"); }
  configure() {
    this.addSection("User Profile")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("John")
          .rules(Validators.required({ message: "First name is required" }))
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Doe")
          .rules(Validators.required({ message: "Last name is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email Address")
          .placeholder("john.doe@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Invalid email format")
          )
        .endField()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          .placeholder("25")
          .props({ min: 18, max: 120 })
          .rules(
            Validators.required({ message: "Age is required" }),
            Validators.min(18, "Must be 18 or older")
          )
        .endField()
        .layout([2, 1])
      .endRow()
    .endSection();
  }
}

const multiFieldCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoNumberInput } from "lumino/react";

class MultiFieldLayoutForm extends Form<{ firstName: string; lastName: string; age: number; email: string }> {
  constructor() { super("multi-field-form"); }

  configure() {
    this.addSection("User Profile")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("John")
          .rules(Validators.required({ message: "First name is required" }))
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Doe")
          .rules(Validators.required({ message: "Last name is required" }))
        .endField()
        .layout([1, 1])  // Equal width columns
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email Address")
          .placeholder("john.doe@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Invalid email format")
          )
        .endField()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          .placeholder("25")
          .props({ min: 18, max: 120 })
          .rules(
            Validators.required({ message: "Age is required" }),
            Validators.min(18, "Must be 18 or older")
          )
        .endField()
        .layout([2, 1])  // Email takes 2/3, age takes 1/3
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CODE EXAMPLES (Non-form)
// =============================================================================

const propsInterfaceCode = `// Required props interface for custom field components
interface CustomFieldProps<TValue> {
  // Required by Lumino
  value: TValue;                         // Current value
  onChange: (value: TValue) => void;     // Change handler

  // Optional standard props
  label?: string;                        // Field label
  placeholder?: string;                  // Placeholder text
  disabled?: boolean;                    // Disabled state
  readOnly?: boolean;                    // Read-only state
  error?: string;                        // Error message
  required?: boolean;                    // Required indicator
  helperText?: string;                   // Help text

  // Your custom props
  customProp?: any;
}`;

const createCustomFieldCode = `// Creating a custom Rating field component
interface RatingFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  max?: number;
  disabled?: boolean;
  error?: string;
}

function RatingField({ value, onChange, label, max = 5, disabled, error }: RatingFieldProps) {
  return (
    <div className="rating-field">
      {label && <label>{label}</label>}
      <div className="stars">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className={star <= value ? "filled" : "empty"}
          >
            ★
          </button>
        ))}
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Using it in a Form
class FeedbackForm extends Form<{ rating: number }> {
  configure() {
    this.addSection("Feedback")
      .addRow()
        .addField("rating")
          .component(RatingField)    // Your custom component
          .label("Rate your experience")
          .props({ max: 5 })         // Custom props
          .rules(Validators.required({ message: "Please select a rating" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

const wrapThirdPartyCode = `// Wrapping a third-party date picker
import DatePicker from "react-datepicker";

interface LuminoDatePickerProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

function LuminoCustomDatePicker({
  value,
  onChange,
  label,
  placeholder,
  disabled,
  error,
  minDate,
  maxDate,
}: LuminoDatePickerProps) {
  return (
    <div className="lumino-datepicker">
      {label && <label>{label}</label>}
      <DatePicker
        selected={value}
        onChange={onChange}
        placeholderText={placeholder}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        className={error ? "has-error" : ""}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

// Usage in Form
class BookingForm extends Form<{ startDate: Date; endDate: Date }> {
  configure() {
    this.addSection("Booking Dates")
      .addRow()
        .addField("startDate")
          .component(LuminoCustomDatePicker)
          .label("Check-in Date")
          .props({ minDate: new Date() })
        .endField()
        .addField("endDate")
          .component(LuminoCustomDatePicker)
          .label("Check-out Date")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function CustomFieldPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Custom Fields</h1>
      <p className="docs-page-subtitle">
        Create custom field components for specialized input needs.
        Lumino supports any React component that follows the standard field interface.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoNumberInput, LuminoTextArea } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Form with Fields</h2>
        <p>Using the Form Builder pattern with standard fields:</p>
        <LuminoLiveDemo
          title="Basic Form"
          description="Standard field components in Form Builder"
          form={new BasicCustomFieldForm()}
          code={basicCustomFieldCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Fields with Custom Props</h2>
        <p>Pass custom props to configure field behavior:</p>
        <LuminoLiveDemo
          title="Custom Props"
          description="Fields with additional configuration"
          form={new CustomPropsForm()}
          code={customPropsCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Multi-Field Layout</h2>
        <p>Multiple fields in a row with custom layout:</p>
        <LuminoLiveDemo
          title="Multi-Field Layout"
          description="Multiple fields with layout configuration"
          form={new MultiFieldLayoutForm()}
          code={multiFieldCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Required Props Interface</h2>
        <p>
          Custom field components must accept these props:
        </p>
        <pre className="docs-code">{propsInterfaceCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Creating Custom Fields</h2>
        <p>
          Create your own field components by implementing the required props interface:
        </p>
        <pre className="docs-code">{createCustomFieldCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Wrapping Third-Party Components</h2>
        <p>
          Wrap any React component to make it Lumino-compatible:
        </p>
        <pre className="docs-code">{wrapThirdPartyCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Configuration Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.component(CustomComponent)</code></td>
              <td>Set your custom component</td>
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
              <td><code>.props(&#123; customProp: value &#125;)</code></td>
              <td>Pass custom props to your component</td>
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
              <td><code>.layout([...weights])</code></td>
              <td>Set column widths in a row</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Follow the interface</strong> - Always accept value and onChange props
          </li>
          <li>
            <strong>Handle all states</strong> - Support disabled, readOnly,
            and error states
          </li>
          <li>
            <strong>Use controlled components</strong> - Always use the value
            prop, never internal state for the main value
          </li>
          <li>
            <strong>Call onChange correctly</strong> - Pass the new value
            directly, not an event
          </li>
          <li>
            <strong>Add TypeScript types</strong> - Define clear prop interfaces
            for type safety
          </li>
          <li>
            <strong>Style consistently</strong> - Match your UI library's design
            system
          </li>
          <li>
            <strong>Make it reusable</strong> - Design components for multiple
            use cases
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Common Custom Field Ideas</h2>
        <ul className="docs-list">
          <li><strong>Color Picker</strong> - Visual color selection</li>
          <li><strong>Rating</strong> - Star or numeric ratings</li>
          <li><strong>Tags Input</strong> - Add/remove tags</li>
          <li><strong>Rich Text Editor</strong> - Formatted text input</li>
          <li><strong>Code Editor</strong> - Syntax-highlighted code</li>
          <li><strong>Image Upload</strong> - Upload with preview</li>
          <li><strong>Signature Pad</strong> - Draw signatures</li>
          <li><strong>Markdown Editor</strong> - Markdown with preview</li>
          <li><strong>Date Range Picker</strong> - Select start and end dates</li>
          <li><strong>Location Picker</strong> - Map-based location selection</li>
        </ul>
      </div>
    </div>
  );
}
