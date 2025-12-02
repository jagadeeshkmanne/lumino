/**
 * TimePicker Field Page
 *
 * Documents the LuminoTimePicker component with live demos.
 * Uses Form Builder pattern with LuminoLiveDemo component.
 */

import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTimePicker } from "lumino/react";

// =============================================================================
// BASIC TIME PICKER FORM
// =============================================================================

class BasicTimePickerForm extends Form<{ time: string | null }> {
  constructor() { super("basic-timepicker-form"); }
  configure() {
    this.addSection("Basic Time Picker")
      .addRow()
        .addField("time")
          .component(LuminoTimePicker)
          .label("Select Time")
          .placeholder("Select a time")
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoTimePicker } from "lumino/react";

class BasicTimePickerForm extends Form<{ time: string | null }> {
  constructor() { super("basic-timepicker-form"); }

  configure() {
    this.addSection("Basic Time Picker")
      .addRow()
        .addField("time")
          .component(LuminoTimePicker)
          .label("Select Time")
          .placeholder("Select a time")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PREFILLED TIME FORM
// =============================================================================

class PrefilledTimeForm extends Form<{ meetingTime: string | null }> {
  constructor() { super("prefilled-time-form"); }
  configure() {
    this.addSection("Prefilled Time")
      .addRow()
        .addField("meetingTime")
          .component(LuminoTimePicker)
          .label("Meeting Time")
        .endField()
      .endRow()
    .endSection();
  }
}

const prefilledCode = `import { Form } from "lumino/core";
import { LuminoTimePicker } from "lumino/react";

class PrefilledTimeForm extends Form<{ meetingTime: string | null }> {
  constructor() { super("prefilled-time-form"); }

  configure() {
    this.addSection("Prefilled Time")
      .addRow()
        .addField("meetingTime")
          .component(LuminoTimePicker)
          .label("Meeting Time")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STATES FORM
// =============================================================================

class StatesTimePickerForm extends Form<{ normal: string | null; disabled: string | null; readOnly: string | null }> {
  constructor() { super("states-timepicker-form"); }
  configure() {
    this.addSection("Time Picker States")
      .addRow()
        .addField("normal")
          .component(LuminoTimePicker)
          .label("Normal")
          .placeholder("Editable time")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoTimePicker)
          .label("Disabled")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoTimePicker)
          .label("Read Only")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form } from "lumino/core";
import { LuminoTimePicker } from "lumino/react";

class StatesTimePickerForm extends Form<{ normal: string | null; disabled: string | null; readOnly: string | null }> {
  constructor() { super("states-timepicker-form"); }

  configure() {
    this.addSection("Time Picker States")
      .addRow()
        .addField("normal")
          .component(LuminoTimePicker)
          .label("Normal")
          .placeholder("Editable time")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoTimePicker)
          .label("Disabled")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoTimePicker)
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

class ValidationTimePickerForm extends Form<{ requiredTime: string | null }> {
  constructor() { super("validation-timepicker-form"); }
  configure() {
    this.addSection("Required Time")
      .addRow()
        .addField("requiredTime")
          .component(LuminoTimePicker)
          .label("Required Time")
          .placeholder("Select a time")
          .rules(Validators.required({ message: "Time is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoTimePicker } from "lumino/react";

class ValidationTimePickerForm extends Form<{ requiredTime: string | null }> {
  constructor() { super("validation-timepicker-form"); }

  configure() {
    this.addSection("Required Time")
      .addRow()
        .addField("requiredTime")
          .component(LuminoTimePicker)
          .label("Required Time")
          .placeholder("Select a time")
          .rules(Validators.required({ message: "Time is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// TIME RANGE FORM
// =============================================================================

class TimeRangeForm extends Form<{ startTime: string | null; endTime: string | null }> {
  constructor() { super("time-range-form"); }
  configure() {
    this.addSection("Time Range Selection")
      .addRow()
        .addField("startTime")
          .component(LuminoTimePicker)
          .label("Start Time")
          .placeholder("Start")
        .endField()
        .addField("endTime")
          .component(LuminoTimePicker)
          .label("End Time")
          .placeholder("End")
        .endField()
      .endRow()
    .endSection();
  }
}

const rangeCode = `import { Form } from "lumino/core";
import { LuminoTimePicker } from "lumino/react";

class TimeRangeForm extends Form<{ startTime: string | null; endTime: string | null }> {
  constructor() { super("time-range-form"); }

  configure() {
    this.addSection("Time Range Selection")
      .addRow()
        .addField("startTime")
          .component(LuminoTimePicker)
          .label("Start Time")
          .placeholder("Start")
        .endField()
        .addField("endTime")
          .component(LuminoTimePicker)
          .label("End Time")
          .placeholder("End")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function TimePickerPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">TimePicker</h1>
      <p className="docs-page-subtitle">
        A time selection component for picking hours and minutes.
        Uses 24-hour format (HH:MM).
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoTimePicker } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <p>Simple time picker for selecting hours and minutes:</p>
        <LuminoLiveDemo
          title="Basic Time Picker"
          description="Select a time from dropdown"
          code={basicCode}
          form={BasicTimePickerForm}
          initialValues={{ time: null }}
        />
      </div>

      <div className="docs-section">
        <h2>Pre-filled Value</h2>
        <p>Initialize with a default time value:</p>
        <LuminoLiveDemo
          title="Pre-filled Time"
          description="Time picker with initial value"
          code={prefilledCode}
          form={PrefilledTimeForm}
          initialValues={{ meetingTime: "14:30" }}
        />
      </div>

      <div className="docs-section">
        <h2>Disabled &amp; Read Only</h2>
        <p>Control field interactivity with disabled and readOnly:</p>
        <LuminoLiveDemo
          title="States"
          description="Non-interactive time fields"
          code={statesCode}
          form={StatesTimePickerForm}
          initialValues={{ normal: null, disabled: "09:00", readOnly: "17:00" }}
        />
      </div>

      <div className="docs-section">
        <h2>Validation</h2>
        <p>Show validation errors with required times:</p>
        <LuminoLiveDemo
          title="Required Time"
          description="Display error when no time selected"
          code={validationCode}
          form={ValidationTimePickerForm}
          initialValues={{ requiredTime: null }}
        />
      </div>

      <div className="docs-section">
        <h2>Time Range Selection</h2>
        <p>Create start and end time fields:</p>
        <LuminoLiveDemo
          title="Time Range"
          description="Start and end time selection"
          code={rangeCode}
          form={TimeRangeForm}
          initialValues={{ startTime: null, endTime: null }}
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
              <td>Time value in HH:MM format</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: string | null) =&gt; void</td>
              <td>-</td>
              <td>Called when time changes</td>
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
              <td>Disable time picker</td>
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
            <strong>Use 24-hour format</strong> - Values are in HH:MM format
            (e.g., "14:30" for 2:30 PM)
          </li>
          <li>
            <strong>Validate time ranges</strong> - Ensure end times are after
            start times
          </li>
          <li>
            <strong>Set default times</strong> - Pre-fill common times like
            business hours
          </li>
          <li>
            <strong>Provide placeholders</strong> - Help users understand what
            time is expected
          </li>
          <li>
            <strong>Combine with DatePicker</strong> - For date-time selection,
            use both components together
          </li>
        </ul>
      </div>
    </div>
  );
}
