/**
 * Fields Overview Page
 *
 * Overview of all Lumino field components.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function FieldsOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Field Components Overview</h1>
      <p className="docs-page-subtitle">
        Lumino provides a comprehensive set of field components for building forms.
        All fields work seamlessly with the Form Builder's fluent API.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        All field components follow consistent patterns for props and behavior.
      </div>

      <div className="docs-section">
        <h2>Available Field Components</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Description</th>
              <th>Value Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>LuminoTextInput</code></td>
              <td>Single-line text input</td>
              <td>string</td>
            </tr>
            <tr>
              <td><code>LuminoNumberInput</code></td>
              <td>Numeric input with optional formatting</td>
              <td>number</td>
            </tr>
            <tr>
              <td><code>LuminoTextArea</code></td>
              <td>Multi-line text input</td>
              <td>string</td>
            </tr>
            <tr>
              <td><code>LuminoSelect</code></td>
              <td>Single-select dropdown</td>
              <td>string | number</td>
            </tr>
            <tr>
              <td><code>LuminoMultiSelect</code></td>
              <td>Multi-select dropdown</td>
              <td>string[] | number[]</td>
            </tr>
            <tr>
              <td><code>LuminoAutocomplete</code></td>
              <td>Searchable dropdown with async options</td>
              <td>any</td>
            </tr>
            <tr>
              <td><code>LuminoCheckbox</code></td>
              <td>Boolean checkbox</td>
              <td>boolean</td>
            </tr>
            <tr>
              <td><code>LuminoCheckboxGroup</code></td>
              <td>Multiple checkboxes for array selection</td>
              <td>string[]</td>
            </tr>
            <tr>
              <td><code>LuminoSwitch</code></td>
              <td>Toggle switch for boolean values</td>
              <td>boolean</td>
            </tr>
            <tr>
              <td><code>LuminoRadioGroup</code></td>
              <td>Radio button group for single selection</td>
              <td>string | number</td>
            </tr>
            <tr>
              <td><code>LuminoDatePicker</code></td>
              <td>Date selection with calendar</td>
              <td>Date | string</td>
            </tr>
            <tr>
              <td><code>LuminoTimePicker</code></td>
              <td>Time selection</td>
              <td>string</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Common Props</h2>
        <p>
          All field components share these common props:
        </p>
        <pre className="docs-code">{`interface CommonFieldProps {
  // Value binding
  value: any;
  onChange: (value: any) => void;

  // Labels & descriptions
  label?: string;
  placeholder?: string;
  helperText?: string;

  // State
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  // Styling
  className?: string;
  style?: CSSProperties;

  // Form integration
  fieldName?: string;
  formContext?: FormContext;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Using Fields in Forms</h2>
        <p>
          Fields are used with the Form Builder's <code>.component()</code> method:
        </p>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoSelect,
  LuminoDatePicker,
} from "lumino/react";

class MyForm extends Form<MyEntity> {
  configure() {
    this.addSection("Details")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Full Name")
          .placeholder("Enter your name")
          .rules(Validators.required())
          .endField()
        .addField("type")
          .component(LuminoSelect)
          .label("Type")
          .props({
            options: [
              { value: "a", label: "Option A" },
              { value: "b", label: "Option B" },
            ]
          })
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Using Fields Standalone</h2>
        <p>
          Fields can also be used directly without the Form Builder:
        </p>
        <pre className="docs-code">{`import { LuminoTextInput, LuminoSelect } from "lumino/react";
import { useState } from "react";

function MyComponent() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  return (
    <div>
      <LuminoTextInput
        label="Name"
        value={name}
        onChange={setName}
        placeholder="Enter name"
      />
      <LuminoSelect
        label="Type"
        value={type}
        onChange={setType}
        options={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Field States</h2>
        <p>
          All fields support these visual states:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>State</th>
              <th>Prop</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Normal</td>
              <td>-</td>
              <td>Default interactive state</td>
            </tr>
            <tr>
              <td>Error</td>
              <td><code>error="message"</code></td>
              <td>Shows validation error</td>
            </tr>
            <tr>
              <td>Disabled</td>
              <td><code>disabled={true}</code></td>
              <td>Non-interactive, grayed out</td>
            </tr>
            <tr>
              <td>Read-only</td>
              <td><code>readOnly={true}</code></td>
              <td>Value visible but not editable</td>
            </tr>
            <tr>
              <td>Required</td>
              <td><code>required={true}</code></td>
              <td>Shows required indicator</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Extending Fields</h2>
        <p>
          You can create custom field components that integrate with Lumino:
        </p>
        <pre className="docs-code">{`import { FieldProps } from "lumino/react";

// Custom field component
function CustomRatingField({
  value,
  onChange,
  label,
  error,
  disabled,
  ...props
}: FieldProps) {
  return (
    <div className="custom-rating-field">
      {label && <label>{label}</label>}
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={disabled}
            onClick={() => onChange(star)}
            className={value >= star ? "filled" : "empty"}
          >
            ★
          </button>
        ))}
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Use in form
.addField("rating")
  .component(CustomRatingField)
  .label("Rating")
  .rules(Validators.required())
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <ul className="docs-list">
          <li>All fields include proper ARIA attributes</li>
          <li>Labels are associated with inputs via htmlFor</li>
          <li>Error states are announced to screen readers</li>
          <li>Keyboard navigation is fully supported</li>
          <li>Focus indicators are visible</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <p>
          Explore individual field components:
        </p>
        <ul className="docs-list">
          <li><strong>TextInput</strong> - Text input with validation</li>
          <li><strong>NumberInput</strong> - Numeric input with formatting</li>
          <li><strong>Select</strong> - Dropdown selection</li>
          <li><strong>DatePicker</strong> - Date selection</li>
          <li><strong>Lookup Fields</strong> - API-driven selection</li>
          <li><strong>Custom Fields</strong> - Build your own</li>
        </ul>
      </div>
    </div>
  );
}
