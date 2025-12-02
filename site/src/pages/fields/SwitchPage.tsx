/**
 * Switch Field Page
 *
 * Documents the LuminoSwitch component with live demos.
 * Uses Form Builder pattern with LuminoLiveDemo component.
 */

import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoSwitch } from "lumino/react";

// =============================================================================
// BASIC SWITCH FORM
// =============================================================================

class BasicSwitchForm extends Form<{ notifications: boolean; darkMode: boolean; autoSave: boolean }> {
  constructor() { super("basic-switch-form"); }
  configure() {
    this.addSection("Basic Switches")
      .addRow()
        .addField("notifications")
          .component(LuminoSwitch)
          .label("Email Notifications")
        .endField()
      .endRow()
      .addRow()
        .addField("darkMode")
          .component(LuminoSwitch)
          .label("Dark Mode")
        .endField()
      .endRow()
      .addRow()
        .addField("autoSave")
          .component(LuminoSwitch)
          .label("Auto-Save")
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoSwitch } from "lumino/react";

class BasicSwitchForm extends Form<{ notifications: boolean; darkMode: boolean; autoSave: boolean }> {
  constructor() { super("basic-switch-form"); }

  configure() {
    this.addSection("Basic Switches")
      .addRow()
        .addField("notifications")
          .component(LuminoSwitch)
          .label("Email Notifications")
        .endField()
      .endRow()
      .addRow()
        .addField("darkMode")
          .component(LuminoSwitch)
          .label("Dark Mode")
        .endField()
      .endRow()
      .addRow()
        .addField("autoSave")
          .component(LuminoSwitch)
          .label("Auto-Save")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STATES FORM
// =============================================================================

class StatesSwitchForm extends Form<{ normal: boolean; disabled: boolean; readOnly: boolean }> {
  constructor() { super("states-switch-form"); }
  configure() {
    this.addSection("Switch States")
      .addRow()
        .addField("normal")
          .component(LuminoSwitch)
          .label("Normal switch")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoSwitch)
          .label("Disabled switch")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoSwitch)
          .label("Read-only switch")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form } from "lumino/core";
import { LuminoSwitch } from "lumino/react";

class StatesSwitchForm extends Form<{ normal: boolean; disabled: boolean; readOnly: boolean }> {
  constructor() { super("states-switch-form"); }

  configure() {
    this.addSection("Switch States")
      .addRow()
        .addField("normal")
          .component(LuminoSwitch)
          .label("Normal switch")
        .endField()
      .endRow()
      .addRow()
        .addField("disabled")
          .component(LuminoSwitch)
          .label("Disabled switch")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoSwitch)
          .label("Read-only switch")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION FORM
// =============================================================================

class ValidationSwitchForm extends Form<{ terms: boolean }> {
  constructor() { super("validation-switch-form"); }
  configure() {
    this.addSection("Required Switch")
      .addRow()
        .addField("terms")
          .component(LuminoSwitch)
          .label("Accept Terms")
          .rules(Validators.required({ message: "You must accept the terms to continue" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoSwitch } from "lumino/react";

class ValidationSwitchForm extends Form<{ terms: boolean }> {
  constructor() { super("validation-switch-form"); }

  configure() {
    this.addSection("Required Switch")
      .addRow()
        .addField("terms")
          .component(LuminoSwitch)
          .label("Accept Terms")
          .rules(Validators.required({ message: "You must accept the terms to continue" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// SETTINGS FORM
// =============================================================================

class SettingsForm extends Form<{
  pushNotifications: boolean;
  sounds: boolean;
  autoUpdate: boolean;
  crashReports: boolean
}> {
  constructor() { super("settings-form"); }
  configure() {
    this.addSection("Application Settings")
      .addRow()
        .addField("pushNotifications")
          .component(LuminoSwitch)
          .label("Push Notifications")
        .endField()
      .endRow()
      .addRow()
        .addField("sounds")
          .component(LuminoSwitch)
          .label("Sound Effects")
        .endField()
      .endRow()
      .addRow()
        .addField("autoUpdate")
          .component(LuminoSwitch)
          .label("Automatic Updates")
        .endField()
      .endRow()
      .addRow()
        .addField("crashReports")
          .component(LuminoSwitch)
          .label("Crash Reports")
        .endField()
      .endRow()
    .endSection();
  }
}

const settingsCode = `import { Form } from "lumino/core";
import { LuminoSwitch } from "lumino/react";

class SettingsForm extends Form<{
  pushNotifications: boolean;
  sounds: boolean;
  autoUpdate: boolean;
  crashReports: boolean
}> {
  constructor() { super("settings-form"); }

  configure() {
    this.addSection("Application Settings")
      .addRow()
        .addField("pushNotifications")
          .component(LuminoSwitch)
          .label("Push Notifications")
        .endField()
      .endRow()
      .addRow()
        .addField("sounds")
          .component(LuminoSwitch)
          .label("Sound Effects")
        .endField()
      .endRow()
      .addRow()
        .addField("autoUpdate")
          .component(LuminoSwitch)
          .label("Automatic Updates")
        .endField()
      .endRow()
      .addRow()
        .addField("crashReports")
          .component(LuminoSwitch)
          .label("Crash Reports")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function SwitchPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Switch</h1>
      <p className="docs-page-subtitle">
        A toggle switch component for boolean on/off states.
        Perfect for settings, preferences, and feature toggles.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoSwitch } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Switch</h2>
        <p>Simple toggle switches for on/off states:</p>
        <LuminoLiveDemo
          title="Basic"
          description="Standard toggle switches"
          code={basicCode}
          form={BasicSwitchForm}
          initialValues={{ notifications: true, darkMode: false, autoSave: true }}
        />
      </div>

      <div className="docs-section">
        <h2>Switch States</h2>
        <p>Different interactive states:</p>
        <LuminoLiveDemo
          title="States"
          description="Normal, disabled, and read-only"
          code={statesCode}
          form={StatesSwitchForm}
          initialValues={{ normal: false, disabled: true, readOnly: true }}
        />
      </div>

      <div className="docs-section">
        <h2>Validation</h2>
        <p>Required switch with validation:</p>
        <LuminoLiveDemo
          title="Required"
          description="Must be enabled to submit"
          code={validationCode}
          form={ValidationSwitchForm}
          initialValues={{ terms: false }}
        />
      </div>

      <div className="docs-section">
        <h2>Settings Example</h2>
        <p>A realistic settings panel example:</p>
        <LuminoLiveDemo
          title="Settings"
          description="Complete settings panel"
          code={settingsCode}
          form={SettingsForm}
          initialValues={{
            pushNotifications: true,
            sounds: false,
            autoUpdate: true,
            crashReports: true
          }}
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
              <td>boolean</td>
              <td>false</td>
              <td>Switch state (on/off)</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(checked: boolean) =&gt; void</td>
              <td>-</td>
              <td>Called when switch is toggled</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td>string</td>
              <td>-</td>
              <td>Switch label</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable switch</td>
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
              <td><code>required</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Required indicator</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use for immediate actions</strong> - Switches should take
            effect immediately without requiring a save button
          </li>
          <li>
            <strong>Provide clear labels</strong> - Label should clearly describe
            what the switch controls
          </li>
          <li>
            <strong>Use for settings</strong> - Perfect for preferences,
            notifications, and feature toggles
          </li>
          <li>
            <strong>Consider checkboxes for forms</strong> - For form submissions,
            checkboxes are often more appropriate
          </li>
        </ul>
      </div>
    </div>
  );
}
