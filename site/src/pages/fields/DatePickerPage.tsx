/**
 * DatePicker Field Page
 *
 * Documents the LuminoDatePicker component with live demos.
 * Uses Form Builder pattern with LuminoLiveDemo component.
 */

import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoDatePicker } from "lumino/react";

// =============================================================================
// BASIC DATE PICKER FORM
// =============================================================================

class BasicDatePickerForm extends Form<{ date: string | null }> {
  constructor() { super("basic-datepicker-form"); }
  configure() {
    this.addSection("Basic Date Picker")
      .addRow()
        .addField("date")
          .component(LuminoDatePicker)
          .label("Select Date")
          .placeholder("Select a date")
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoDatePicker } from "lumino/react";

class BasicDatePickerForm extends Form<{ date: string | null }> {
  constructor() { super("basic-datepicker-form"); }

  configure() {
    this.addSection("Basic Date Picker")
      .addRow()
        .addField("date")
          .component(LuminoDatePicker)
          .label("Select Date")
          .placeholder("Select a date")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DATE CONSTRAINTS FORM
// =============================================================================

class DateConstraintsForm extends Form<{ birthDate: string | null; futureDate: string | null }> {
  constructor() { super("date-constraints-form"); }
  configure() {
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    this.addSection("Date Constraints")
      .addRow()
        .addField("birthDate")
          .component(LuminoDatePicker)
          .label("Birth Date")
          .placeholder("Select birth date")
          .props({ maxDate: today })
        .endField()
      .endRow()
      .addRow()
        .addField("futureDate")
          .component(LuminoDatePicker)
          .label("Future Date (next 30 days)")
          .placeholder("Select date")
          .props({ minDate: today, maxDate: nextMonth })
        .endField()
      .endRow()
    .endSection();
  }
}

const constraintsCode = `import { Form } from "lumino/core";
import { LuminoDatePicker } from "lumino/react";

class DateConstraintsForm extends Form<{ birthDate: string | null; futureDate: string | null }> {
  constructor() { super("date-constraints-form"); }

  configure() {
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    this.addSection("Date Constraints")
      .addRow()
        .addField("birthDate")
          .component(LuminoDatePicker)
          .label("Birth Date")
          .placeholder("Select birth date")
          .props({ maxDate: today })
        .endField()
      .endRow()
      .addRow()
        .addField("futureDate")
          .component(LuminoDatePicker)
          .label("Future Date (next 30 days)")
          .placeholder("Select date")
          .props({ minDate: today, maxDate: nextMonth })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STATES FORM
// =============================================================================

class StatesDatePickerForm extends Form<{ normal: string | null; disabled: string | null; readOnly: string | null }> {
  constructor() { super("states-datepicker-form"); }
  configure() {
    this.addSection("Date Picker States")
      .addRow()
        .addField("normal")
          .component(LuminoDatePicker)
          .label("Normal")
          .placeholder("Editable date")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoDatePicker)
          .label("Disabled")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoDatePicker)
          .label("Read Only")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form } from "lumino/core";
import { LuminoDatePicker } from "lumino/react";

class StatesDatePickerForm extends Form<{ normal: string | null; disabled: string | null; readOnly: string | null }> {
  constructor() { super("states-datepicker-form"); }

  configure() {
    this.addSection("Date Picker States")
      .addRow()
        .addField("normal")
          .component(LuminoDatePicker)
          .label("Normal")
          .placeholder("Editable date")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoDatePicker)
          .label("Disabled")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoDatePicker)
          .label("Read Only")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION FORM
// =============================================================================

class ValidationDatePickerForm extends Form<{ requiredDate: string | null }> {
  constructor() { super("validation-datepicker-form"); }
  configure() {
    this.addSection("Required Date")
      .addRow()
        .addField("requiredDate")
          .component(LuminoDatePicker)
          .label("Required Date")
          .placeholder("Select a date")
          .rules(Validators.required({ message: "Date is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoDatePicker } from "lumino/react";

class ValidationDatePickerForm extends Form<{ requiredDate: string | null }> {
  constructor() { super("validation-datepicker-form"); }

  configure() {
    this.addSection("Required Date")
      .addRow()
        .addField("requiredDate")
          .component(LuminoDatePicker)
          .label("Required Date")
          .placeholder("Select a date")
          .rules(Validators.required({ message: "Date is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DATE RANGE FORM
// =============================================================================

class DateRangeForm extends Form<{ startDate: string | null; endDate: string | null }> {
  constructor() { super("date-range-form"); }
  configure() {
    const today = new Date().toISOString().split("T")[0];

    this.addSection("Date Range Selection")
      .addRow()
        .addField("startDate")
          .component(LuminoDatePicker)
          .label("Start Date")
          .placeholder("Select start date")
          .props({ minDate: today })
        .endField()
        .addField("endDate")
          .component(LuminoDatePicker)
          .label("End Date")
          .placeholder("Select end date")
          .props({ minDate: today })
        .endField()
      .endRow()
    .endSection();
  }
}

const rangeCode = `import { Form } from "lumino/core";
import { LuminoDatePicker } from "lumino/react";

class DateRangeForm extends Form<{ startDate: string | null; endDate: string | null }> {
  constructor() { super("date-range-form"); }

  configure() {
    const today = new Date().toISOString().split("T")[0];

    this.addSection("Date Range Selection")
      .addRow()
        .addField("startDate")
          .component(LuminoDatePicker)
          .label("Start Date")
          .placeholder("Select start date")
          .props({ minDate: today })
        .endField()
        .addField("endDate")
          .component(LuminoDatePicker)
          .label("End Date")
          .placeholder("Select end date")
          .props({ minDate: today })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function DatePickerPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">DatePicker</h1>
      <p className="docs-page-subtitle">
        A date selection component with native calendar support,
        validation, and range restrictions.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoDatePicker } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <p>Simple date picker with calendar popup:</p>
        <LuminoLiveDemo
          title="Basic Date Picker"
          description="Select a date from calendar"
          code={basicCode}
          form={BasicDatePickerForm}
          initialValues={{ date: null }}
        />
      </div>

      <div className="docs-section">
        <h2>Min/Max Date</h2>
        <p>Restrict selectable dates with minDate and maxDate:</p>
        <LuminoLiveDemo
          title="Date Constraints"
          description="Limit selectable date range"
          code={constraintsCode}
          form={DateConstraintsForm}
          initialValues={{ birthDate: null, futureDate: null }}
        />
      </div>

      <div className="docs-section">
        <h2>Disabled &amp; Read Only</h2>
        <p>Control field interactivity with disabled and readOnly:</p>
        <LuminoLiveDemo
          title="States"
          description="Non-interactive date fields"
          code={statesCode}
          form={StatesDatePickerForm}
          initialValues={{ normal: null, disabled: "2024-06-15", readOnly: "2024-12-25" }}
        />
      </div>

      <div className="docs-section">
        <h2>Validation</h2>
        <p>Show validation errors with required dates:</p>
        <LuminoLiveDemo
          title="Required Date"
          description="Display error when no date selected"
          code={validationCode}
          form={ValidationDatePickerForm}
          initialValues={{ requiredDate: null }}
        />
      </div>

      <div className="docs-section">
        <h2>Date Range Selection</h2>
        <p>Create dependent date fields for range selection:</p>
        <LuminoLiveDemo
          title="Date Range"
          description="Start and end date selection"
          code={rangeCode}
          form={DateRangeForm}
          initialValues={{ startDate: null, endDate: null }}
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
              <td>string | null</td>
              <td>null</td>
              <td>Selected date (YYYY-MM-DD format)</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: string | null) =&gt; void</td>
              <td>-</td>
              <td>Called when date changes</td>
            </tr>
            <tr>
              <td><code>minDate</code></td>
              <td>string | Date</td>
              <td>-</td>
              <td>Minimum selectable date</td>
            </tr>
            <tr>
              <td><code>maxDate</code></td>
              <td>string | Date</td>
              <td>-</td>
              <td>Maximum selectable date</td>
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
              <td>Disable the field</td>
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
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Set reasonable defaults</strong> - Pre-fill with today's
            date when appropriate
          </li>
          <li>
            <strong>Use minDate/maxDate</strong> - Prevent invalid date selections
          </li>
          <li>
            <strong>Validate ranges</strong> - Ensure end date is after start date
          </li>
          <li>
            <strong>Provide clear placeholders</strong> - Help users understand
            what date is expected
          </li>
          <li>
            <strong>Handle date formats</strong> - Use YYYY-MM-DD format for
            consistency
          </li>
        </ul>
      </div>
    </div>
  );
}
