/**
 * Select Field Page
 *
 * Documents the LuminoSelect component with live demos using Form Builder pattern.
 * Uses LuminoLiveDemo component for interactive demos.
 */

import React from "react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";

// =============================================================================
// SHARED OPTIONS
// =============================================================================

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const priorityOptions = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
  { value: "urgent", label: "Urgent" },
];

const vehicleOptions = [
  { value: "sedan", label: "Sedan", group: "Cars" },
  { value: "suv", label: "SUV", group: "Cars" },
  { value: "truck", label: "Truck", group: "Cars" },
  { value: "sport", label: "Sport Bike", group: "Motorcycles" },
  { value: "cruiser", label: "Cruiser", group: "Motorcycles" },
  { value: "ev", label: "Electric Vehicle", group: "Electric" },
  { value: "hybrid", label: "Hybrid", group: "Electric" },
];

// State options by country for cascading demo
const statesByCountry: Record<string, Array<{ value: string; label: string }>> = {
  us: [
    { value: "ca", label: "California" },
    { value: "ny", label: "New York" },
    { value: "tx", label: "Texas" },
    { value: "fl", label: "Florida" },
  ],
  uk: [
    { value: "eng", label: "England" },
    { value: "sco", label: "Scotland" },
    { value: "wal", label: "Wales" },
    { value: "ni", label: "Northern Ireland" },
  ],
  ca: [
    { value: "on", label: "Ontario" },
    { value: "qc", label: "Quebec" },
    { value: "bc", label: "British Columbia" },
    { value: "ab", label: "Alberta" },
  ],
  au: [
    { value: "nsw", label: "New South Wales" },
    { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" },
    { value: "wa", label: "Western Australia" },
  ],
  de: [
    { value: "by", label: "Bavaria" },
    { value: "be", label: "Berlin" },
    { value: "nw", label: "North Rhine-Westphalia" },
    { value: "he", label: "Hesse" },
  ],
  fr: [
    { value: "idf", label: "Île-de-France" },
    { value: "pac", label: "Provence-Alpes-Côte d'Azur" },
    { value: "ara", label: "Auvergne-Rhône-Alpes" },
    { value: "occ", label: "Occitanie" },
  ],
  jp: [
    { value: "tk", label: "Tokyo" },
    { value: "os", label: "Osaka" },
    { value: "kg", label: "Kanagawa" },
    { value: "ai", label: "Aichi" },
  ],
};

// =============================================================================
// BASIC SELECT FORM
// =============================================================================

class BasicSelectForm extends Form<{ country: string; status: string }> {
  constructor() { super("basic-select-form"); }
  configure() {
    this.addSection("Basic Select")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select a country")
          .props({ options: countryOptions })
        .endField()
      .endRow()
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .placeholder("Select status")
          .props({ options: statusOptions })
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoSelect } from "lumino/react";

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

class BasicSelectForm extends Form<{ country: string; status: string }> {
  constructor() { super("basic-select-form"); }

  configure() {
    this.addSection("Basic Select")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select a country")
          .props({ options: countryOptions })
        .endField()
      .endRow()
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .placeholder("Select status")
          .props({ options: statusOptions })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// SEARCHABLE SELECT FORM
// =============================================================================

class SearchableSelectForm extends Form<{ country: string }> {
  constructor() { super("searchable-select-form"); }
  configure() {
    this.addSection("Searchable Select")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country (Searchable)")
          .placeholder("Type to search...")
          .props({ options: countryOptions, searchable: true })
                  .endField()
      .endRow()
    .endSection();
  }
}

const searchableCode = `import { Form } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class SearchableSelectForm extends Form<{ country: string }> {
  constructor() { super("searchable-select-form"); }

  configure() {
    this.addSection("Searchable Select")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country (Searchable)")
          .placeholder("Type to search...")
          .props({ options: countryOptions, searchable: true })
                  .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CLEARABLE SELECT FORM
// =============================================================================

class ClearableSelectForm extends Form<{ priority: string }> {
  constructor() { super("clearable-select-form"); }
  configure() {
    this.addSection("Clearable Select")
      .addRow()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority (Clearable)")
          .placeholder("Select priority")
          .props({ options: priorityOptions, clearable: true })
                  .endField()
      .endRow()
    .endSection();
  }
}

const clearableCode = `import { Form } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class ClearableSelectForm extends Form<{ priority: string }> {
  constructor() { super("clearable-select-form"); }

  configure() {
    this.addSection("Clearable Select")
      .addRow()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority (Clearable)")
          .placeholder("Select priority")
          .props({ options: priorityOptions, clearable: true })
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
          .component(LuminoSelect)
          .label("Disabled Select")
          .props({ options: statusOptions })
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoSelect)
          .label("Read-Only Select")
          .props({ options: statusOptions })
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class StatesForm extends Form<{ disabled: string; readOnly: string }> {
  constructor() { super("states-form"); }

  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("disabled")
          .component(LuminoSelect)
          .label("Disabled Select")
          .props({ options: statusOptions })
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoSelect)
          .label("Read-Only Select")
          .props({ options: statusOptions })
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION FORM
// =============================================================================

class ValidationForm extends Form<{ country: string; status: string }> {
  constructor() { super("validation-form"); }
  configure() {
    this.addSection("Validation")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select a country")
          .props({ options: countryOptions })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .placeholder("Select status")
          .props({ options: statusOptions })
          .rules(Validators.required({ message: "Status is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class ValidationForm extends Form<{ country: string; status: string }> {
  constructor() { super("validation-form"); }

  configure() {
    this.addSection("Validation")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select a country")
          .props({ options: countryOptions })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .placeholder("Select status")
          .props({ options: statusOptions })
          .rules(Validators.required({ message: "Status is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// GROUPED OPTIONS FORM
// =============================================================================

class GroupedSelectForm extends Form<{ vehicle: string }> {
  constructor() { super("grouped-select-form"); }
  configure() {
    this.addSection("Grouped Options")
      .addRow()
        .addField("vehicle")
          .component(LuminoSelect)
          .label("Vehicle Type")
          .placeholder("Select a vehicle")
          .props({ options: vehicleOptions, groupBy: "group" })
                  .endField()
      .endRow()
    .endSection();
  }
}

const groupedCode = `import { Form } from "lumino/core";
import { LuminoSelect } from "lumino/react";

const vehicleOptions = [
  { value: "sedan", label: "Sedan", group: "Cars" },
  { value: "suv", label: "SUV", group: "Cars" },
  { value: "truck", label: "Truck", group: "Cars" },
  { value: "sport", label: "Sport Bike", group: "Motorcycles" },
  { value: "cruiser", label: "Cruiser", group: "Motorcycles" },
  { value: "ev", label: "Electric Vehicle", group: "Electric" },
  { value: "hybrid", label: "Hybrid", group: "Electric" },
];

class GroupedSelectForm extends Form<{ vehicle: string }> {
  constructor() { super("grouped-select-form"); }

  configure() {
    this.addSection("Grouped Options")
      .addRow()
        .addField("vehicle")
          .component(LuminoSelect)
          .label("Vehicle Type")
          .placeholder("Select a vehicle")
          .props({ options: vehicleOptions, groupBy: "group" })
                  .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CASCADING/DEPENDENT DROPDOWN FORM
// =============================================================================

class CascadingSelectForm extends Form<{ country: string; state: string }> {
  constructor() { super("cascading-select-form"); }
  configure() {
    this.addSection("Location")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select a country first")
          .props({ options: countryOptions, searchable: true })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("state")
          .component(LuminoSelect)
          .label("State/Region")
          .placeholder("Select a state")
          .props((data) => ({
            options: data.country ? statesByCountry[data.country] || [] : [],
            searchable: true,
          }))
          .disable((data) => !data.country)
          .rules(Validators.required({ message: "State is required" }))
                  .endField()
      .endRow()
    .endSection();
  }
}

const cascadingCode = `import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";

// State options by country
const statesByCountry = {
  us: [
    { value: "ca", label: "California" },
    { value: "ny", label: "New York" },
    { value: "tx", label: "Texas" },
    { value: "fl", label: "Florida" },
  ],
  uk: [
    { value: "eng", label: "England" },
    { value: "sco", label: "Scotland" },
    { value: "wal", label: "Wales" },
    { value: "ni", label: "Northern Ireland" },
  ],
  ca: [
    { value: "on", label: "Ontario" },
    { value: "qc", label: "Quebec" },
    { value: "bc", label: "British Columbia" },
    { value: "ab", label: "Alberta" },
  ],
  // ... more countries
};

class CascadingSelectForm extends Form<{ country: string; state: string }> {
  constructor() { super("cascading-select-form"); }

  configure() {
    this.addSection("Location")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select a country first")
          .props({ options: countryOptions, searchable: true })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("state")
          .component(LuminoSelect)
          .label("State/Region")
          .placeholder("Select a state")
          // Dynamic options based on selected country
          .props((data) => ({
            options: data.country ? statesByCountry[data.country] || [] : [],
            searchable: true,
          }))
          // Disable until country is selected
          .disable((data) => !data.country)
          .rules(Validators.required({ message: "State is required" }))
                  .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// COMBINED FEATURES FORM
// =============================================================================

class CombinedForm extends Form<{ country: string }> {
  constructor() { super("combined-form"); }
  configure() {
    this.addSection("Combined Features")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Search and select...")
          .props({
            options: countryOptions,
            searchable: true,
            clearable: true,
          })
          .rules(Validators.required({ message: "Country is required" }))
                  .endField()
      .endRow()
    .endSection();
  }
}

const combinedCode = `import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class CombinedForm extends Form<{ country: string }> {
  constructor() { super("combined-form"); }

  configure() {
    this.addSection("Combined Features")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Search and select...")
          .props({
            options: countryOptions,
            searchable: true,
            clearable: true,
          })
          .rules(Validators.required({ message: "Country is required" }))
                  .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MULTI-FIELD LAYOUT FORM
// =============================================================================

class MultiFieldForm extends Form<{ country: string; status: string; priority: string }> {
  constructor() { super("multi-field-form"); }
  configure() {
    this.addSection("Project Settings")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Region")
          .placeholder("Select region")
          .props({ options: countryOptions })
        .endField()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .placeholder("Select status")
          .props({ options: statusOptions })
        .endField()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority")
          .placeholder("Select priority")
          .props({ options: priorityOptions })
        .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}

const multiFieldCode = `import { Form } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class MultiFieldForm extends Form<{ country: string; status: string; priority: string }> {
  constructor() { super("multi-field-form"); }

  configure() {
    this.addSection("Project Settings")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Region")
          .placeholder("Select region")
          .props({ options: countryOptions })
        .endField()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .placeholder("Select status")
          .props({ options: statusOptions })
        .endField()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority")
          .placeholder("Select priority")
          .props({ options: priorityOptions })
        .endField()
        .layout([1, 1, 1])  // Equal width columns
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function SelectPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Select</h1>
      <p className="docs-page-subtitle">
        A dropdown field for single selection from a list of options.
        Supports searching, clearing, grouping, cascading, and various states.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <p>Simple select dropdowns with static options:</p>
        <LuminoLiveDemo
          title="Basic Select"
          description="Standard select fields with options"
          form={new BasicSelectForm()}
          code={basicCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Searchable Select</h2>
        <p>Enable search filtering for long option lists:</p>
        <LuminoLiveDemo
          title="Searchable"
          description="Type to filter options"
          form={new SearchableSelectForm()}
          code={searchableCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Clearable Select</h2>
        <p>Allow users to clear the selected value:</p>
        <LuminoLiveDemo
          title="Clearable"
          description="Clear button to reset selection"
          form={new ClearableSelectForm()}
          code={clearableCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Disabled and Read-Only</h2>
        <p>Non-interactive select states:</p>
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
          description="Select with validation"
          form={new ValidationForm()}
          code={validationCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Grouped Options</h2>
        <p>Organize options into logical groups:</p>
        <LuminoLiveDemo
          title="Grouped"
          description="Options organized by category"
          form={new GroupedSelectForm()}
          code={groupedCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Cascading/Dependent Dropdowns</h2>
        <p>
          Create dependent dropdowns where one field's options depend on another field's value.
          Select a country to see the available states/regions:
        </p>
        <LuminoLiveDemo
          title="Cascading Select"
          description="Country → State dependent dropdowns"
          form={new CascadingSelectForm()}
          code={cascadingCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Combined Features</h2>
        <p>Use multiple props together:</p>
        <LuminoLiveDemo
          title="Combined"
          description="Multiple features combined"
          form={new CombinedForm()}
          code={combinedCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Multi-Field Layout</h2>
        <p>Multiple select fields in a single row:</p>
        <LuminoLiveDemo
          title="Multi-Field"
          description="Selects in a row with equal widths"
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
              <td>string | number</td>
              <td>""</td>
              <td>Selected value</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value) =&gt; void</td>
              <td>-</td>
              <td>Called when selection changes</td>
            </tr>
            <tr>
              <td><code>options</code></td>
              <td>Array&lt;Option&gt;</td>
              <td>[]</td>
              <td>List of options</td>
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
              <td><code>searchable</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Enable search filtering</td>
            </tr>
            <tr>
              <td><code>clearable</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Allow clearing selection</td>
            </tr>
            <tr>
              <td><code>groupBy</code></td>
              <td>string</td>
              <td>-</td>
              <td>Property name to group options by</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable the select</td>
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
              <td><code>.component(LuminoSelect)</code></td>
              <td>Set the select component</td>
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
              <td><code>.props(object | function)</code></td>
              <td>Pass options and other props (can be dynamic)</td>
            </tr>
            <tr>
              <td><code>.rules(...validators)</code></td>
              <td>Add validation rules</td>
            </tr>
            <tr>
              <td><code>.disable(boolean | function)</code></td>
              <td>Disable the field (can be dynamic)</td>
            </tr>
            <tr>
              <td><code>.readOnly(boolean | function)</code></td>
              <td>Make field read-only</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Option Format</h2>
        <pre className="docs-code">{`interface Option {
  value: string | number;  // Unique value
  label: string;           // Display text
  group?: string;          // Optional group name (used with groupBy)
  disabled?: boolean;      // Disable this option
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Dynamic Props Pattern</h2>
        <p>Use a function for <code>.props()</code> or <code>.disable()</code> to create dynamic/cascading behavior:</p>
        <pre className="docs-code">{`// Dynamic options based on form data
.props((data) => ({
  options: data.country ? statesByCountry[data.country] : [],
  searchable: true,
}))

// Conditionally disable based on form data
.disable((data) => !data.country)`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Keep options concise</strong> - Use clear, short labels
          </li>
          <li>
            <strong>Order logically</strong> - Alphabetical, by frequency, or
            by importance
          </li>
          <li>
            <strong>Use grouping</strong> - For long lists, group related options
          </li>
          <li>
            <strong>Enable search</strong> - For lists with 10+ options
          </li>
          <li>
            <strong>Provide placeholder</strong> - Indicate what to select
          </li>
          <li>
            <strong>Use dynamic props</strong> - For cascading/dependent dropdowns
          </li>
        </ul>
      </div>
    </div>
  );
}
