/**
 * Autocomplete Field Page
 *
 * Documents the LuminoAutocomplete component with live demos.
 * Uses Form Builder pattern for interactive demos.
 */

import React from "react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { LiveDemo } from "../../components/LiveDemo";
import {
  LuminoAutocomplete,
  LuminoStackLayout,
  LuminoText,
} from "lumino/react";
import { Form, Validators } from "lumino/core";

// =============================================================================
// FORM CLASSES - Form Builder Pattern
// =============================================================================

class BasicAutocompleteForm extends Form<{ country: string | null }> {
  constructor() {
    super("basic-autocomplete-form");
  }

  configure() {
    this.addSection("Country Selection")
      .addRow()
        .addField("country")
          .component(LuminoAutocomplete)
          .label("Select Country")
          .props({
            options: [
              { value: "us", label: "United States" },
              { value: "uk", label: "United Kingdom" },
              { value: "ca", label: "Canada" },
              { value: "au", label: "Australia" },
              { value: "de", label: "Germany" },
              { value: "fr", label: "France" },
              { value: "jp", label: "Japan" },
              { value: "br", label: "Brazil" },
            ],
            placeholder: "Search countries...",
          })
        .endField()
      .endRow()
    .endSection();
  }
}

class StringOptionsForm extends Form<{ language: string | null }> {
  constructor() {
    super("string-options-form");
  }

  configure() {
    this.addSection("Language Selection")
      .addRow()
        .addField("language")
          .component(LuminoAutocomplete)
          .label("Programming Language")
          .props({
            options: ["JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "Ruby"],
            placeholder: "Type to search languages...",
          })
        .endField()
      .endRow()
    .endSection();
  }
}

class ObjectOptionsForm extends Form<{ userId: number | null }> {
  constructor() {
    super("object-options-form");
  }

  configure() {
    const users = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com" },
      { id: 4, name: "Alice Brown", email: "alice@example.com" },
    ];

    this.addSection("User Selection")
      .addRow()
        .addField("userId")
          .component(LuminoAutocomplete)
          .label("Select User")
          .props({
            options: users,
            optionConfig: {
              valueProperty: "id",
              displayProperty: "name",
            },
            placeholder: "Search users by name...",
          })
        .endField()
      .endRow()
    .endSection();
  }
}

class RequiredAutocompleteForm extends Form<{ country: string | null }> {
  constructor() {
    super("required-autocomplete-form");
  }

  configure() {
    this.addSection("Required Selection")
      .addRow()
        .addField("country")
          .component(LuminoAutocomplete)
          .label("Country (Required)")
          .props({
            options: [
              { value: "US", label: "United States" },
              { value: "CA", label: "Canada" },
              { value: "MX", label: "Mexico" },
              { value: "UK", label: "United Kingdom" },
              { value: "DE", label: "Germany" },
              { value: "FR", label: "France" },
            ],
            placeholder: "Search for a country...",
          })
          .rules(Validators.required({ message: "Please select a country" }))
        .endField()
      .endRow()
    .endSection();
  }
}

class PlaceholderForm extends Form<{ fruit: string | null; color: string | null }> {
  constructor() {
    super("placeholder-form");
  }

  configure() {
    this.addSection("Multiple Autocompletes")
      .addRow()
        .addField("fruit")
          .component(LuminoAutocomplete)
          .label("Favorite Fruit")
          .props({
            options: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
            placeholder: "Search fruits...",
          })
        .endField()
      .endRow()
      .addRow()
        .addField("color")
          .component(LuminoAutocomplete)
          .label("Favorite Color")
          .props({
            options: ["Red", "Green", "Blue", "Yellow", "Purple"],
            placeholder: "Type a color name...",
          })
        .endField()
      .endRow()
    .endSection();
  }
}

// Create form instances
const basicAutocompleteForm = new BasicAutocompleteForm();
const stringOptionsForm = new StringOptionsForm();
const objectOptionsForm = new ObjectOptionsForm();
const requiredAutocompleteForm = new RequiredAutocompleteForm();
const placeholderForm = new PlaceholderForm();

// =============================================================================
// STATIC DEMO COMPONENTS - For disabled/readonly demos
// =============================================================================

function DisabledReadOnlyDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoText>Disabled:</LuminoText>
      <LuminoAutocomplete
        value="react"
        onChange={() => {}}
        options={[
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
          { value: "angular", label: "Angular" },
        ]}
        disabled
      />
      <LuminoText>Read Only:</LuminoText>
      <LuminoAutocomplete
        value="python"
        onChange={() => {}}
        options={["Python", "JavaScript", "Java"]}
        readOnly
      />
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCode = `import { Form, LuminoAutocomplete } from "lumino";

class CountryForm extends Form<{ country: string | null }> {
  configure() {
    this.addSection("Country Selection")
      .addRow()
        .addField("country")
          .component(LuminoAutocomplete)
          .label("Select Country")
          .props({
            options: [
              { value: "us", label: "United States" },
              { value: "uk", label: "United Kingdom" },
              { value: "ca", label: "Canada" },
              // ...more options
            ],
            placeholder: "Search countries...",
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

const stringOptionsCode = `import { Form, LuminoAutocomplete } from "lumino";

class LanguageForm extends Form<{ language: string | null }> {
  configure() {
    this.addSection("Language Selection")
      .addRow()
        .addField("language")
          .component(LuminoAutocomplete)
          .label("Programming Language")
          .props({
            // Simple string array for options
            options: ["JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "Ruby"],
            placeholder: "Type to search languages...",
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

const disabledReadOnlyCode = `import { LuminoAutocomplete, LuminoStackLayout, LuminoText } from "lumino/react";

function DisabledReadOnlyDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoText>Disabled:</LuminoText>
      <LuminoAutocomplete
        value="react"
        onChange={() => {}}
        options={[
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
          { value: "angular", label: "Angular" },
        ]}
        disabled
      />
      <LuminoText>Read Only:</LuminoText>
      <LuminoAutocomplete
        value="python"
        onChange={() => {}}
        options={["Python", "JavaScript", "Java"]}
        readOnly
      />
    </LuminoStackLayout>
  );
}`;

const objectOptionsCode = `import { Form, LuminoAutocomplete } from "lumino";

class UserForm extends Form<{ userId: number | null }> {
  configure() {
    const users = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    ];

    this.addSection("User Selection")
      .addRow()
        .addField("userId")
          .component(LuminoAutocomplete)
          .label("Select User")
          .props({
            options: users,
            optionConfig: {
              valueProperty: "id",       // Use "id" as value
              displayProperty: "name",   // Display "name" in dropdown
            },
            placeholder: "Search users by name...",
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

const requiredCode = `import { Form, Validators } from "lumino/core";
import { LuminoAutocomplete } from "lumino/react";

class CountryForm extends Form<{ country: string | null }> {
  configure() {
    this.addSection("Required Selection")
      .addRow()
        .addField("country")
          .component(LuminoAutocomplete)
          .label("Country (Required)")
          .props({
            options: [
              { value: "US", label: "United States" },
              { value: "CA", label: "Canada" },
              { value: "UK", label: "United Kingdom" },
            ],
            placeholder: "Search for a country...",
          })
          .rules(Validators.required({ message: "Please select a country" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

const placeholderCode = `import { Form, LuminoAutocomplete } from "lumino";

class PreferencesForm extends Form<{ fruit: string | null; color: string | null }> {
  configure() {
    this.addSection("Preferences")
      .addRow()
        .addField("fruit")
          .component(LuminoAutocomplete)
          .label("Favorite Fruit")
          .props({
            options: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
            placeholder: "Search fruits...",
          })
        .endField()
      .endRow()
      .addRow()
        .addField("color")
          .component(LuminoAutocomplete)
          .label("Favorite Color")
          .props({
            options: ["Red", "Green", "Blue", "Yellow", "Purple"],
            placeholder: "Type a color name...",
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function AutocompletePage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Autocomplete</h1>
      <p className="docs-page-subtitle">
        A searchable single-select component with type-to-filter functionality.
        Perfect for selecting from large lists with real-time filtering.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoAutocomplete } from "lumino/react";
import { Form } from "lumino/core";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Select a value with type-to-filter using object options:
        </p>
        <LuminoLiveDemo
          title="Basic Autocomplete"
          description="Search and select from dropdown options"
          code={basicCode}
          form={basicAutocompleteForm}
          initialValues={{ country: null }}
        />
      </div>

      <div className="docs-section">
        <h2>String Options</h2>
        <p>
          Pass simple string arrays as options:
        </p>
        <LuminoLiveDemo
          title="String Options"
          description="Using string array for options"
          code={stringOptionsCode}
          form={stringOptionsForm}
          initialValues={{ language: null }}
        />
      </div>

      <div className="docs-section">
        <h2>Disabled &amp; Read Only</h2>
        <p>
          Control field interactivity with <code>disabled</code> and <code>readOnly</code> props:
        </p>
        <LiveDemo
          title="Disabled and Read Only States"
          description="Non-interactive field states"
          code={disabledReadOnlyCode}
        >
          <DisabledReadOnlyDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Validation with Required</h2>
        <p>
          Use the <code>.rules(Validators.required())</code> validator for mandatory fields:
        </p>
        <LuminoLiveDemo
          title="Required Validation"
          description="Display error when no selection is made"
          code={requiredCode}
          form={requiredAutocompleteForm}
          initialValues={{ country: null }}
        />
      </div>

      <div className="docs-section">
        <h2>Object Options with optionConfig</h2>
        <p>
          Use <code>optionConfig</code> to map object properties to value and label:
        </p>
        <LuminoLiveDemo
          title="Object Options"
          description="Configure value and display properties for objects"
          code={objectOptionsCode}
          form={objectOptionsForm}
          initialValues={{ userId: null }}
        />
      </div>

      <div className="docs-section">
        <h2>Custom Placeholder</h2>
        <p>
          Set placeholder text with the <code>placeholder</code> prop:
        </p>
        <LuminoLiveDemo
          title="Placeholder Text"
          description="Custom placeholder for empty selections"
          code={placeholderCode}
          form={placeholderForm}
          initialValues={{ fruit: null, color: null }}
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
              <td>T | null</td>
              <td>null</td>
              <td>Selected value</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: T | null) =&gt; void</td>
              <td>-</td>
              <td>Called when selection changes</td>
            </tr>
            <tr>
              <td><code>options</code></td>
              <td>SelectOption[] | string[]</td>
              <td>[]</td>
              <td>Available options (filtered on input)</td>
            </tr>
            <tr>
              <td><code>optionConfig</code></td>
              <td>OptionConfig</td>
              <td>-</td>
              <td>Config for object options (valueProperty, displayProperty)</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td>string</td>
              <td>"Search..."</td>
              <td>Placeholder text</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable field</td>
            </tr>
            <tr>
              <td><code>readOnly</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Read-only mode</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td>string</td>
              <td>-</td>
              <td>Error message</td>
            </tr>
            <tr>
              <td><code>renderOption</code></td>
              <td>(option) =&gt; ReactNode</td>
              <td>-</td>
              <td>Custom option renderer</td>
            </tr>
            <tr>
              <td><code>className</code></td>
              <td>string</td>
              <td>-</td>
              <td>Additional CSS class</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use for large option lists</strong> - Autocomplete shines
            when you have many options that benefit from filtering
          </li>
          <li>
            <strong>Provide clear placeholder</strong> - Guide users on what
            they are searching for
          </li>
          <li>
            <strong>Use optionConfig for objects</strong> - Define valueProperty
            and displayProperty for clean data handling
          </li>
          <li>
            <strong>Custom rendering for rich data</strong> - Show additional
            context like images, descriptions, or metadata
          </li>
          <li>
            <strong>Show helpful empty states</strong> - Display "No results found"
            when filter returns nothing
          </li>
        </ul>
      </div>
    </div>
  );
}
