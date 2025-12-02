/**
 * Form Field Dependencies Documentation
 *
 * Documents how fields can depend on other fields with mini demos.
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
// DEMO DATA
// =============================================================================

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
];

const statesByCountry: Record<string, Array<{ value: string; label: string }>> = {
  us: [
    { value: "ny", label: "New York" },
    { value: "ca", label: "California" },
    { value: "tx", label: "Texas" },
  ],
  ca: [
    { value: "on", label: "Ontario" },
    { value: "bc", label: "British Columbia" },
    { value: "qc", label: "Quebec" },
  ],
  uk: [
    { value: "eng", label: "England" },
    { value: "sct", label: "Scotland" },
    { value: "wls", label: "Wales" },
  ],
};

const employmentTypes = [
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" },
  { value: "contractor", label: "Contractor" },
];

// =============================================================================
// DEMO ENTITIES
// =============================================================================

class LocationEntity {
  country = "";
  state = "";
  city = "";
}

class EmploymentEntity {
  employmentType = "";
  salary: number | null = null;
  hourlyRate: number | null = null;
  contractEndDate = "";
}

class CalculatedEntity {
  quantity: number = 1;
  unitPrice: number = 10;
  discount: number = 0;
  total: number = 10;
}

// =============================================================================
// DEMO 1: Basic Dependency - Clear on Change
// =============================================================================

class BasicDependencyForm extends Form<LocationEntity> {
  constructor() {
    super("basic-dependency");
  }

  configure() {
    this.addSection("Cascading Selection")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select country")
          .props({ options: countries })
          .endField()
        .addField("state")
          .component(LuminoSelect)
          .label("State/Province")
          .placeholder("Select country first")
          .props((ctx) => {
            const country = ctx.getValue("country");
            return {
              options: country ? statesByCountry[country] || [] : [],
              disabled: !country,
            };
          })
          .dependsOn("country", { clear: true })
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const basicDependencyCode = `class BasicDependencyForm extends Form<LocationEntity> {
  configure() {
    this.addSection("Cascading Selection")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .props({ options: countries })
          .endField()
        .addField("state")
          .component(LuminoSelect)
          .label("State/Province")
          // Dynamic props based on selected country
          .props((ctx) => {
            const country = ctx.getValue("country");
            return {
              options: country ? statesByCountry[country] : [],
              disabled: !country,
            };
          })
          // Clear state when country changes
          .dependsOn("country", { clear: true })
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 2: Custom Handler Dependency
// =============================================================================

class CustomHandlerForm extends Form<EmploymentEntity> {
  constructor() {
    super("custom-handler");
  }

  configure() {
    this.addSection("Employment Type Affects Fields")
      .addRow()
        .addField("employmentType")
          .component(LuminoSelect)
          .label("Employment Type")
          .placeholder("Select type")
          .props({ options: employmentTypes })
          .endField()
      .endRow()
      .addRow()
        .addField("salary")
          .component(LuminoNumberInput)
          .label("Annual Salary")
          .placeholder("Enter salary")
          .props({ prefix: "$" })
          .hideByCondition((ctx) => ctx.getValue("employmentType") !== "fulltime")
          .dependsOn("employmentType", {
            handler: (type, ctx) => {
              if (type !== "fulltime") {
                ctx.setValue("salary", null);
              }
            }
          })
          .endField()
        .addField("hourlyRate")
          .component(LuminoNumberInput)
          .label("Hourly Rate")
          .placeholder("Enter rate")
          .props({ prefix: "$" })
          .hideByCondition((ctx) => {
            const type = ctx.getValue("employmentType");
            return type !== "parttime" && type !== "contractor";
          })
          .dependsOn("employmentType", {
            handler: (type, ctx) => {
              if (type === "fulltime") {
                ctx.setValue("hourlyRate", null);
              }
            }
          })
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("contractEndDate")
          .component(LuminoTextInput)
          .label("Contract End Date")
          .placeholder("YYYY-MM-DD")
          .hideByCondition((ctx) => ctx.getValue("employmentType") !== "contractor")
          .dependsOn("employmentType", {
            handler: (type, ctx) => {
              if (type !== "contractor") {
                ctx.setValue("contractEndDate", "");
              }
            }
          })
          .endField()
      .endRow()
    .endSection();
  }
}

const customHandlerCode = `class CustomHandlerForm extends Form<EmploymentEntity> {
  configure() {
    this.addSection("Employment Type Affects Fields")
      .addRow()
        .addField("employmentType")
          .component(LuminoSelect)
          .label("Employment Type")
          .props({ options: employmentTypes })
          .endField()
      .endRow()
      .addRow()
        .addField("salary")
          .component(LuminoNumberInput)
          .label("Annual Salary")
          // Only show for full-time
          .hideByCondition((ctx) =>
            ctx.getValue("employmentType") !== "fulltime"
          )
          // Custom handler when employment type changes
          .dependsOn("employmentType", {
            handler: (type, ctx) => {
              if (type !== "fulltime") {
                ctx.setValue("salary", null);
              }
            }
          })
          .endField()
        .addField("hourlyRate")
          .component(LuminoNumberInput)
          .label("Hourly Rate")
          // Show for part-time and contractor
          .hideByCondition((ctx) => {
            const type = ctx.getValue("employmentType");
            return type !== "parttime" && type !== "contractor";
          })
          .dependsOn("employmentType", {
            handler: (type, ctx) => {
              if (type === "fulltime") {
                ctx.setValue("hourlyRate", null);
              }
            }
          })
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 3: Multiple Dependencies
// =============================================================================

class MultipleDepsEntity {
  country = "";
  state = "";
  city = "";
}

class MultipleDependenciesForm extends Form<MultipleDepsEntity> {
  constructor() {
    super("multiple-deps");
  }

  configure() {
    this.addSection("Multiple Dependencies")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select country")
          .props({ options: countries })
          .endField()
        .addField("state")
          .component(LuminoSelect)
          .label("State")
          .placeholder("Select state")
          .props((ctx) => {
            const country = ctx.getValue("country");
            return {
              options: country ? statesByCountry[country] || [] : [],
              disabled: !country,
            };
          })
          .dependsOn("country", { clear: true })
          .endField()
        .addField("city")
          .component(LuminoTextInput)
          .label("City")
          .placeholder("Enter city")
          .disable((ctx) => !ctx.getValue("country") || !ctx.getValue("state"))
          .dependsOn(["country", "state"], {
            clear: true,
            handler: (_, ctx) => {
              const country = ctx.getValue("country");
              const state = ctx.getValue("state");
              if (!country || !state) {
                ctx.setValue("city", "");
              }
            }
          })
          .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}

const multipleDependenciesCode = `class MultipleDependenciesForm extends Form<Entity> {
  configure() {
    this.addSection("Multiple Dependencies")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Country")
          .props({ options: countries })
          .endField()
        .addField("state")
          .component(LuminoSelect)
          .label("State")
          .props((ctx) => ({
            options: statesByCountry[ctx.getValue("country")] || [],
            disabled: !ctx.getValue("country"),
          }))
          .dependsOn("country", { clear: true })
          .endField()
        .addField("city")
          .component(LuminoTextInput)
          .label("City")
          .disable((ctx) =>
            !ctx.getValue("country") || !ctx.getValue("state")
          )
          // Depends on BOTH country and state
          .dependsOn(["country", "state"], {
            clear: true,
            handler: (_, ctx) => {
              if (!ctx.getValue("country") || !ctx.getValue("state")) {
                ctx.setValue("city", "");
              }
            }
          })
          .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 4: Computed Values via Dependencies
// =============================================================================

class ComputedValuesForm extends Form<CalculatedEntity> {
  constructor() {
    super("computed-values");
  }

  configure() {
    this.addSection("Calculated Total")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .props({ min: 1, max: 100 })
          .endField()
        .addField("unitPrice")
          .component(LuminoNumberInput)
          .label("Unit Price")
          .props({ min: 0, prefix: "$" })
          .endField()
        .addField("discount")
          .component(LuminoNumberInput)
          .label("Discount (%)")
          .props({ min: 0, max: 100, suffix: "%" })
          .endField()
        .layout([1, 1, 1])
      .endRow()
      .addRow()
        .addField("total")
          .component(LuminoNumberInput)
          .label("Total")
          .props({ prefix: "$", readOnly: true })
          .readOnly(() => true)
          .dependsOn(["quantity", "unitPrice", "discount"], {
            handler: (_, ctx) => {
              const qty = ctx.getValue("quantity") || 0;
              const price = ctx.getValue("unitPrice") || 0;
              const discount = ctx.getValue("discount") || 0;
              const subtotal = qty * price;
              const total = subtotal - (subtotal * discount / 100);
              ctx.setValue("total", Math.round(total * 100) / 100);
            }
          })
          .endField()
      .endRow()
    .endSection();
  }
}

const computedValuesCode = `class ComputedValuesForm extends Form<CalculatedEntity> {
  configure() {
    this.addSection("Calculated Total")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .props({ min: 1, max: 100 })
          .endField()
        .addField("unitPrice")
          .component(LuminoNumberInput)
          .label("Unit Price")
          .props({ min: 0, prefix: "$" })
          .endField()
        .addField("discount")
          .component(LuminoNumberInput)
          .label("Discount (%)")
          .props({ min: 0, max: 100, suffix: "%" })
          .endField()
        .layout([1, 1, 1])
      .endRow()
      .addRow()
        .addField("total")
          .component(LuminoNumberInput)
          .label("Total")
          .readOnly(() => true)
          // Computed from multiple fields
          .dependsOn(["quantity", "unitPrice", "discount"], {
            handler: (_, ctx) => {
              const qty = ctx.getValue("quantity") || 0;
              const price = ctx.getValue("unitPrice") || 0;
              const discount = ctx.getValue("discount") || 0;
              const subtotal = qty * price;
              const total = subtotal - (subtotal * discount / 100);
              ctx.setValue("total", Math.round(total * 100) / 100);
            }
          })
          .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function FormDependenciesPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Field Dependencies</h1>
      <p className="docs-page-subtitle">
        Learn how to create relationships between form fields where one field's
        value affects another field's options, visibility, or value.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        Field dependencies are a powerful feature for creating dynamic, reactive forms.
      </div>

      <div className="docs-section">
        <h2>Dependency Configuration Options</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>clear</code></td>
              <td>boolean</td>
              <td>Clear field value when dependency changes</td>
            </tr>
            <tr>
              <td><code>reset</code></td>
              <td>boolean</td>
              <td>Reset to initial value when dependency changes</td>
            </tr>
            <tr>
              <td><code>handler</code></td>
              <td>function</td>
              <td>Custom handler: <code>(value, ctx) =&gt; void</code></td>
            </tr>
            <tr>
              <td><code>reloadApi</code></td>
              <td>string</td>
              <td>API endpoint to call for new options</td>
            </tr>
            <tr>
              <td><code>reloadParams</code></td>
              <td>object | function</td>
              <td>Parameters for the API call</td>
            </tr>
            <tr>
              <td><code>debounceMs</code></td>
              <td>number</td>
              <td>Debounce delay for handler/API calls</td>
            </tr>
            <tr>
              <td><code>onlyIfTruthy</code></td>
              <td>boolean</td>
              <td>Only trigger if dependency value is truthy</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>1. Basic Dependency - Cascading Selection</h2>
        <p>
          The most common use case: when a parent field changes, clear the child
          field and update its options. Try selecting a country to see states update.
        </p>
        <LiveDemo
          title="Cascading Dropdowns"
          description="State clears and options change when country changes"
          code={basicDependencyCode}
          FormClass={BasicDependencyForm}
          EntityClass={LocationEntity}
        />
      </div>

      <div className="docs-section">
        <h2>2. Custom Handler</h2>
        <p>
          Use a custom handler for complex logic when a dependency changes.
          This example shows/hides fields and clears values based on employment type.
        </p>
        <LiveDemo
          title="Custom Dependency Handler"
          description="Different fields appear based on employment type"
          code={customHandlerCode}
          FormClass={CustomHandlerForm}
          EntityClass={EmploymentEntity}
        />
      </div>

      <div className="docs-section">
        <h2>3. Multiple Dependencies</h2>
        <p>
          A field can depend on multiple other fields. Pass an array of field names
          to <code>.dependsOn()</code>. The handler fires when any dependency changes.
        </p>
        <LiveDemo
          title="Multiple Dependencies"
          description="City depends on both country and state"
          code={multipleDependenciesCode}
          FormClass={MultipleDependenciesForm}
          EntityClass={MultipleDepsEntity}
        />
      </div>

      <div className="docs-section">
        <h2>4. Computed Values</h2>
        <p>
          Dependencies can be used to compute values. The total field is automatically
          calculated whenever quantity, price, or discount changes.
        </p>
        <LiveDemo
          title="Computed Values"
          description="Total is automatically calculated"
          code={computedValuesCode}
          FormClass={ComputedValuesForm}
          EntityClass={CalculatedEntity}
        />
      </div>

      <div className="docs-section">
        <h2>API-Based Dependencies</h2>
        <pre className="docs-code">{`// When country changes, fetch states from API
.addField("state")
  .component(LuminoSelect)
  .label("State")
  .dependsOn("country", {
    clear: true,
    reloadApi: "LocationsApi.getStates",
    reloadParams: (ctx) => ({
      countryId: ctx.getValue("country")
    })
  })
  .endField()

// With debounce for search-as-you-type
.addField("suggestions")
  .component(LuminoAutocomplete)
  .label("Search")
  .dependsOn("searchQuery", {
    debounceMs: 300,           // Wait 300ms before calling
    onlyIfTruthy: true,        // Only if searchQuery has value
    reloadApi: "SearchApi.find",
    reloadParams: (ctx) => ({
      query: ctx.getValue("searchQuery")
    })
  })
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use <code>clear: true</code></strong> for cascading selections
            to ensure stale values are removed
          </li>
          <li>
            <strong>Combine with <code>hideByCondition</code></strong> to hide
            fields that don't apply in certain scenarios
          </li>
          <li>
            <strong>Use <code>debounceMs</code></strong> when dependencies trigger
            API calls to avoid excessive requests
          </li>
          <li>
            <strong>Use <code>onlyIfTruthy</code></strong> to prevent API calls
            when the dependency value is empty
          </li>
          <li>
            <strong>Keep handlers simple</strong> - complex logic should be in
            lifecycle hooks or separate functions
          </li>
        </ul>
      </div>
    </div>
  );
}
