/**
 * MultiSelect Field Page
 *
 * Documents the LuminoMultiSelect component with live demos using Form Builder pattern.
 * Uses LuminoLiveDemo component for interactive demos.
 */

import React from "react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

// =============================================================================
// SHARED OPTIONS
// =============================================================================

const skillOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

const frameworkOptions = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "nextjs", label: "Next.js" },
];

const languageOptions = ["English", "Spanish", "French", "German", "Chinese", "Japanese"];

const colorOptions = ["Red", "Green", "Blue", "Yellow", "Purple", "Orange"];

const sizeOptions = ["Small", "Medium", "Large", "XL", "XXL"];

// =============================================================================
// BASIC MULTISELECT FORM
// =============================================================================

class BasicMultiSelectForm extends Form<{ skills: string[] }> {
  constructor() { super("basic-multiselect-form"); }
  configure() {
    this.addSection("Basic Multi-Select")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Programming Skills")
          .placeholder("Select skills...")
          .props({ options: skillOptions })
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

const skillOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
];

class BasicMultiSelectForm extends Form<{ skills: string[] }> {
  constructor() { super("basic-multiselect-form"); }

  configure() {
    this.addSection("Basic Multi-Select")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Programming Skills")
          .placeholder("Select skills...")
          .props({ options: skillOptions })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STRING OPTIONS FORM
// =============================================================================

class StringOptionsForm extends Form<{ languages: string[]; colors: string[] }> {
  constructor() { super("string-options-form"); }
  configure() {
    this.addSection("String Options")
      .addRow()
        .addField("languages")
          .component(LuminoMultiSelect)
          .label("Languages Spoken")
          .placeholder("Select languages...")
          .props({ options: languageOptions })
        .endField()
      .endRow()
      .addRow()
        .addField("colors")
          .component(LuminoMultiSelect)
          .label("Favorite Colors")
          .placeholder("Select colors...")
          .props({ options: colorOptions })
        .endField()
      .endRow()
    .endSection();
  }
}

const stringOptionsCode = `import { Form } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

// Simple string arrays work as options
const languageOptions = ["English", "Spanish", "French", "German", "Chinese", "Japanese"];
const colorOptions = ["Red", "Green", "Blue", "Yellow", "Purple", "Orange"];

class StringOptionsForm extends Form<{ languages: string[]; colors: string[] }> {
  constructor() { super("string-options-form"); }

  configure() {
    this.addSection("String Options")
      .addRow()
        .addField("languages")
          .component(LuminoMultiSelect)
          .label("Languages Spoken")
          .placeholder("Select languages...")
          .props({ options: languageOptions })
        .endField()
      .endRow()
      .addRow()
        .addField("colors")
          .component(LuminoMultiSelect)
          .label("Favorite Colors")
          .placeholder("Select colors...")
          .props({ options: colorOptions })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DISABLED AND READ-ONLY FORM
// =============================================================================

class StatesForm extends Form<{ disabled: string[]; readOnly: string[] }> {
  constructor() { super("states-form"); }
  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("disabled")
          .component(LuminoMultiSelect)
          .label("Disabled Multi-Select")
          .props({ options: frameworkOptions })
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoMultiSelect)
          .label("Read-Only Multi-Select")
          .props({ options: frameworkOptions })
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

class StatesForm extends Form<{ disabled: string[]; readOnly: string[] }> {
  constructor() { super("states-form"); }

  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("disabled")
          .component(LuminoMultiSelect)
          .label("Disabled Multi-Select")
          .props({ options: frameworkOptions })
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoMultiSelect)
          .label("Read-Only Multi-Select")
          .props({ options: frameworkOptions })
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION FORM
// =============================================================================

class ValidationForm extends Form<{ skills: string[]; frameworks: string[] }> {
  constructor() { super("validation-form"); }
  configure() {
    this.addSection("Validation")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Required Skills")
          .placeholder("Select at least one skill...")
          .props({ options: skillOptions })
          .rules(Validators.required({ message: "Please select at least one skill" }))
        .endField()
      .endRow()
      .addRow()
        .addField("frameworks")
          .component(LuminoMultiSelect)
          .label("Required Frameworks")
          .placeholder("Select frameworks...")
          .props({ options: frameworkOptions })
          .rules(Validators.required({ message: "Please select at least one framework" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

class ValidationForm extends Form<{ skills: string[]; frameworks: string[] }> {
  constructor() { super("validation-form"); }

  configure() {
    this.addSection("Validation")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Required Skills")
          .placeholder("Select at least one skill...")
          .props({ options: skillOptions })
          .rules(Validators.required({ message: "Please select at least one skill" }))
        .endField()
      .endRow()
      .addRow()
        .addField("frameworks")
          .component(LuminoMultiSelect)
          .label("Required Frameworks")
          .placeholder("Select frameworks...")
          .props({ options: frameworkOptions })
          .rules(Validators.required({ message: "Please select at least one framework" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// OBJECT OPTIONS WITH CONFIG FORM
// =============================================================================

const userOptions = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  { id: 4, name: "Alice Brown", email: "alice@example.com" },
];

class ObjectOptionsForm extends Form<{ teamMembers: number[] }> {
  constructor() { super("object-options-form"); }
  configure() {
    this.addSection("Object Options")
      .addRow()
        .addField("teamMembers")
          .component(LuminoMultiSelect)
          .label("Team Members")
          .placeholder("Select team members...")
          .props({
            options: userOptions,
            optionConfig: {
              valueProperty: "id",
              displayProperty: "name",
            },
          })
                  .endField()
      .endRow()
    .endSection();
  }
}

const objectOptionsCode = `import { Form } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

const userOptions = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  { id: 4, name: "Alice Brown", email: "alice@example.com" },
];

class ObjectOptionsForm extends Form<{ teamMembers: number[] }> {
  constructor() { super("object-options-form"); }

  configure() {
    this.addSection("Object Options")
      .addRow()
        .addField("teamMembers")
          .component(LuminoMultiSelect)
          .label("Team Members")
          .placeholder("Select team members...")
          .props({
            options: userOptions,
            optionConfig: {
              valueProperty: "id",       // Use 'id' as the value
              displayProperty: "name",   // Use 'name' as the display text
            },
          })
                  .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// JOB APPLICATION FORM EXAMPLE
// =============================================================================

class JobApplicationForm extends Form<{ skills: string[]; frameworks: string[]; sizes: string[] }> {
  constructor() { super("job-application-form"); }
  configure() {
    this.addSection("Developer Profile")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Programming Languages")
          .placeholder("Select your languages...")
          .props({ options: skillOptions })
          .rules(Validators.required({ message: "Select at least one language" }))
        .endField()
      .endRow()
      .addRow()
        .addField("frameworks")
          .component(LuminoMultiSelect)
          .label("Frameworks & Libraries")
          .placeholder("Select frameworks you know...")
          .props({ options: frameworkOptions })
          .rules(Validators.required({ message: "Select at least one framework" }))
        .endField()
      .endRow()
    .endSection()
    .addSection("Preferences")
      .addRow()
        .addField("sizes")
          .component(LuminoMultiSelect)
          .label("T-Shirt Sizes (for swag)")
          .placeholder("Select sizes...")
          .props({ options: sizeOptions })
                  .endField()
      .endRow()
    .endSection();
  }
}

const jobApplicationCode = `import { Form, Validators } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

class JobApplicationForm extends Form<{ skills: string[]; frameworks: string[]; sizes: string[] }> {
  constructor() { super("job-application-form"); }

  configure() {
    this.addSection("Developer Profile")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Programming Languages")
          .placeholder("Select your languages...")
          .props({ options: skillOptions })
          .rules(Validators.required({ message: "Select at least one language" }))
        .endField()
      .endRow()
      .addRow()
        .addField("frameworks")
          .component(LuminoMultiSelect)
          .label("Frameworks & Libraries")
          .placeholder("Select frameworks you know...")
          .props({ options: frameworkOptions })
          .rules(Validators.required({ message: "Select at least one framework" }))
        .endField()
      .endRow()
    .endSection()
    .addSection("Preferences")
      .addRow()
        .addField("sizes")
          .component(LuminoMultiSelect)
          .label("T-Shirt Sizes (for swag)")
          .placeholder("Select sizes...")
          .props({ options: sizeOptions })
                  .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MULTI-FIELD LAYOUT FORM
// =============================================================================

class MultiFieldForm extends Form<{ skills: string[]; languages: string[] }> {
  constructor() { super("multi-field-form"); }
  configure() {
    this.addSection("Profile")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Technical Skills")
          .placeholder("Select skills...")
          .props({ options: skillOptions })
        .endField()
        .addField("languages")
          .component(LuminoMultiSelect)
          .label("Languages")
          .placeholder("Select languages...")
          .props({ options: languageOptions })
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const multiFieldCode = `import { Form } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

class MultiFieldForm extends Form<{ skills: string[]; languages: string[] }> {
  constructor() { super("multi-field-form"); }

  configure() {
    this.addSection("Profile")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Technical Skills")
          .placeholder("Select skills...")
          .props({ options: skillOptions })
        .endField()
        .addField("languages")
          .component(LuminoMultiSelect)
          .label("Languages")
          .placeholder("Select languages...")
          .props({ options: languageOptions })
        .endField()
        .layout([1, 1])  // Equal width columns
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function MultiSelectPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">MultiSelect</h1>
      <p className="docs-page-subtitle">
        A multi-select dropdown component for selecting multiple values from a list.
        Displays selected values as chips and supports searching.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <p>Select multiple values with object options containing value and label:</p>
        <LuminoLiveDemo
          title="Basic Multi-Select"
          description="Select multiple items from a dropdown"
          form={new BasicMultiSelectForm()}
          code={basicCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>String Options</h2>
        <p>Pass simple string arrays as options:</p>
        <LuminoLiveDemo
          title="String Options"
          description="Using string array for options"
          form={new StringOptionsForm()}
          code={stringOptionsCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Disabled and Read-Only</h2>
        <p>Control field interactivity:</p>
        <LuminoLiveDemo
          title="Disabled/ReadOnly"
          description="Non-interactive field states"
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
          description="Multi-select with validation"
          form={new ValidationForm()}
          code={validationCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Object Options with optionConfig</h2>
        <p>Use optionConfig to map object properties to value and label:</p>
        <LuminoLiveDemo
          title="Object Options"
          description="Configure value and display properties"
          form={new ObjectOptionsForm()}
          code={objectOptionsCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Job Application Example</h2>
        <p>Real-world example of a skills form with validation:</p>
        <LuminoLiveDemo
          title="Job Application"
          description="Multiple sections with multi-selects"
          form={new JobApplicationForm()}
          code={jobApplicationCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Multi-Field Layout</h2>
        <p>Multiple multi-selects in a single row:</p>
        <LuminoLiveDemo
          title="Multi-Field"
          description="Multi-selects side by side"
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
              <td>T[]</td>
              <td>[]</td>
              <td>Array of selected values</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(values: T[]) =&gt; void</td>
              <td>-</td>
              <td>Called when selection changes</td>
            </tr>
            <tr>
              <td><code>options</code></td>
              <td>SelectOption[] | string[]</td>
              <td>[]</td>
              <td>Available options</td>
            </tr>
            <tr>
              <td><code>optionConfig</code></td>
              <td>OptionConfig</td>
              <td>-</td>
              <td>Config for object options</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td>string</td>
              <td>"Select..."</td>
              <td>Placeholder text</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable selection</td>
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
              <td><code>.component(LuminoMultiSelect)</code></td>
              <td>Set the multi-select component</td>
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
              <td><code>.props(&#123; options, optionConfig &#125;)</code></td>
              <td>Pass options and configuration</td>
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
        <h2>Option Config</h2>
        <pre className="docs-code">{`// For custom object arrays, specify which properties to use
optionConfig: {
  valueProperty: "id",      // Property to use as the value
  displayProperty: "name",  // Property to display to users
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use optionConfig for objects</strong> - Define valueProperty
            and displayProperty when options are custom objects
          </li>
          <li>
            <strong>Validate selection count</strong> - Use Validators.required
            to ensure at least one selection
          </li>
          <li>
            <strong>Enable search for long lists</strong> - Make it easy to find
            options when you have many choices
          </li>
          <li>
            <strong>Provide clear placeholders</strong> - Help users understand what
            they should select
          </li>
          <li>
            <strong>Group related selections</strong> - Use multiple sections for
            different categories of multi-selects
          </li>
        </ul>
      </div>
    </div>
  );
}
