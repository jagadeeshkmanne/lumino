/**
 * CheckboxGroup Field Page
 *
 * Documents the LuminoCheckboxGroup component with live demos.
 * Uses Form Builder pattern for interactive demos.
 */

import React from "react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { LiveDemo } from "../../components/LiveDemo";
import {
  LuminoCheckboxGroup,
  LuminoStackLayout,
  LuminoText,
} from "lumino/react";
import { Form, Validators } from "lumino/core";

// =============================================================================
// FORM CLASSES - Form Builder Pattern
// =============================================================================

class BasicCheckboxGroupForm extends Form<{ interests: string[]; notifications: string[] }> {
  constructor() {
    super("basic-checkbox-group-form");
  }

  configure() {
    this.addSection("Interests & Notifications")
      .addRow()
        .addField("interests")
          .component(LuminoCheckboxGroup)
          .label("Interests")
          .props({
            options: [
              { value: "sports", label: "Sports" },
              { value: "music", label: "Music" },
              { value: "reading", label: "Reading" },
              { value: "travel", label: "Travel" },
            ],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("notifications")
          .component(LuminoCheckboxGroup)
          .label("Notifications")
          .props({
            options: ["Updates", "Newsletter", "Promotions"],
          })
        .endField()
      .endRow()
    .endSection();
  }
}

class ObjectOptionsForm extends Form<{ features: string[]; roles: string[] }> {
  constructor() {
    super("object-options-checkbox-form");
  }

  configure() {
    const features = [
      { id: "analytics", name: "Analytics Dashboard" },
      { id: "collaboration", name: "Team Collaboration" },
      { id: "export", name: "Export Reports" },
      { id: "api", name: "API Access" },
    ];

    const roles = [
      { code: "viewer", title: "Viewer" },
      { code: "editor", title: "Editor" },
      { code: "admin", title: "Administrator" },
      { code: "owner", title: "Owner" },
    ];

    this.addSection("Feature Selection")
      .addRow()
        .addField("features")
          .component(LuminoCheckboxGroup)
          .label("Features")
          .props({
            options: features,
            optionConfig: {
              valueProperty: "id",
              displayProperty: "name",
            },
          })
        .endField()
      .endRow()
      .addRow()
        .addField("roles")
          .component(LuminoCheckboxGroup)
          .label("Roles")
          .props({
            options: roles,
            optionConfig: {
              valueProperty: "code",
              displayProperty: "title",
            },
          })
        .endField()
      .endRow()
    .endSection();
  }
}

class RequiredCheckboxGroupForm extends Form<{ terms: string[] }> {
  constructor() {
    super("required-checkbox-group-form");
  }

  configure() {
    this.addSection("Agreement")
      .addRow()
        .addField("terms")
          .component(LuminoCheckboxGroup)
          .label("Accept Terms")
          .props({
            options: ["Option 1", "Option 2", "Option 3"],
          })
          .rules(Validators.required({ message: "Please select at least one option" }))
        .endField()
      .endRow()
    .endSection();
  }
}

class SettingsForm extends Form<{ emailSettings: string[]; privacySettings: string[] }> {
  constructor() {
    super("settings-checkbox-form");
  }

  configure() {
    this.addSection("Email Preferences")
      .addRow()
        .addField("emailSettings")
          .component(LuminoCheckboxGroup)
          .label("Email Preferences")
          .props({
            options: [
              { value: "updates", label: "Product Updates" },
              { value: "newsletter", label: "Weekly Newsletter" },
              { value: "promotions", label: "Special Promotions" },
              { value: "security", label: "Security Alerts" },
            ],
          })
        .endField()
      .endRow()
    .endSection();

    this.addSection("Privacy Settings")
      .addRow()
        .addField("privacySettings")
          .component(LuminoCheckboxGroup)
          .label("Privacy Settings")
          .props({
            options: [
              { value: "profile", label: "Show my profile publicly" },
              { value: "activity", label: "Show my activity" },
              { value: "search", label: "Allow search engines to index" },
            ],
          })
        .endField()
      .endRow()
    .endSection();
  }
}

// Create form instances
const basicCheckboxGroupForm = new BasicCheckboxGroupForm();
const objectOptionsForm = new ObjectOptionsForm();
const requiredCheckboxGroupForm = new RequiredCheckboxGroupForm();
const settingsForm = new SettingsForm();

// =============================================================================
// STATIC DEMO COMPONENTS - For disabled/readonly demos
// =============================================================================

function DisabledCheckboxGroupDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoStackLayout gap={1}>
        <LuminoText>Disabled Group (all options disabled):</LuminoText>
        <LuminoCheckboxGroup
          value={["a"]}
          onChange={() => {}}
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C" },
          ]}
          disabled
        />
      </LuminoStackLayout>
      <LuminoStackLayout gap={1}>
        <LuminoText>Individual Option Disabled:</LuminoText>
        <LuminoCheckboxGroup
          value={["option2"]}
          onChange={() => {}}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3 (disabled)", disabled: true },
          ]}
        />
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}

function ReadOnlyCheckboxGroupDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Selected values are locked (read-only):</LuminoText>
      <LuminoCheckboxGroup
        value={["read", "write"]}
        onChange={() => {}}
        options={[
          { value: "read", label: "Read" },
          { value: "write", label: "Write" },
          { value: "admin", label: "Admin" },
        ]}
        readOnly
      />
      <LuminoText variant="secondary">
        Read-only displays the current selections but cannot be changed.
      </LuminoText>
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCode = `import { Form, LuminoCheckboxGroup } from "lumino";

class InterestsForm extends Form<{ interests: string[]; notifications: string[] }> {
  configure() {
    this.addSection("Interests & Notifications")
      .addRow()
        .addField("interests")
          .component(LuminoCheckboxGroup)
          .label("Interests")
          .props({
            options: [
              { value: "sports", label: "Sports" },
              { value: "music", label: "Music" },
              { value: "reading", label: "Reading" },
              { value: "travel", label: "Travel" },
            ],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("notifications")
          .component(LuminoCheckboxGroup)
          .label("Notifications")
          .props({
            // Simple string array
            options: ["Updates", "Newsletter", "Promotions"],
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

const disabledCode = `import { LuminoCheckboxGroup, LuminoStackLayout, LuminoText } from "lumino/react";

function DisabledCheckboxGroupDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoStackLayout gap={1}>
        <LuminoText>Disabled Group (all options disabled):</LuminoText>
        <LuminoCheckboxGroup
          value={["a"]}
          onChange={() => {}}
          options={[
            { value: "a", label: "Option A" },
            { value: "b", label: "Option B" },
            { value: "c", label: "Option C" },
          ]}
          disabled
        />
      </LuminoStackLayout>
      <LuminoStackLayout gap={1}>
        <LuminoText>Individual Option Disabled:</LuminoText>
        <LuminoCheckboxGroup
          value={["option2"]}
          onChange={() => {}}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3 (disabled)", disabled: true },
          ]}
        />
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}`;

const readOnlyCode = `import { LuminoCheckboxGroup, LuminoStackLayout, LuminoText } from "lumino/react";

function ReadOnlyCheckboxGroupDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Selected values are locked (read-only):</LuminoText>
      <LuminoCheckboxGroup
        value={["read", "write"]}
        onChange={() => {}}
        options={[
          { value: "read", label: "Read" },
          { value: "write", label: "Write" },
          { value: "admin", label: "Admin" },
        ]}
        readOnly
      />
      <LuminoText variant="secondary">
        Read-only displays the current selections but cannot be changed.
      </LuminoText>
    </LuminoStackLayout>
  );
}`;

const requiredCode = `import { Form, LuminoCheckboxGroup } from "lumino";

class AgreementForm extends Form<{ terms: string[] }> {
  configure() {
    this.addSection("Agreement")
      .addRow()
        .addField("terms")
          .component(LuminoCheckboxGroup)
          .label("Accept Terms")
          .props({
            options: ["Option 1", "Option 2", "Option 3"],
          })
          .rules(Validators.required({ message: "Please select at least one option" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

const objectOptionsCode = `import { Form, LuminoCheckboxGroup } from "lumino";

class FeatureForm extends Form<{ features: string[]; roles: string[] }> {
  configure() {
    const features = [
      { id: "analytics", name: "Analytics Dashboard" },
      { id: "collaboration", name: "Team Collaboration" },
      { id: "export", name: "Export Reports" },
      { id: "api", name: "API Access" },
    ];

    const roles = [
      { code: "viewer", title: "Viewer" },
      { code: "editor", title: "Editor" },
      { code: "admin", title: "Administrator" },
      { code: "owner", title: "Owner" },
    ];

    this.addSection("Feature Selection")
      .addRow()
        .addField("features")
          .component(LuminoCheckboxGroup)
          .label("Features")
          .props({
            options: features,
            optionConfig: {
              valueProperty: "id",
              displayProperty: "name",
            },
          })
        .endField()
      .endRow()
      .addRow()
        .addField("roles")
          .component(LuminoCheckboxGroup)
          .label("Roles")
          .props({
            options: roles,
            optionConfig: {
              valueProperty: "code",
              displayProperty: "title",
            },
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

const settingsCode = `import { Form, LuminoCheckboxGroup } from "lumino";

class SettingsForm extends Form<{ emailSettings: string[]; privacySettings: string[] }> {
  configure() {
    this.addSection("Email Preferences")
      .addRow()
        .addField("emailSettings")
          .component(LuminoCheckboxGroup)
          .label("Email Preferences")
          .props({
            options: [
              { value: "updates", label: "Product Updates" },
              { value: "newsletter", label: "Weekly Newsletter" },
              { value: "promotions", label: "Special Promotions" },
              { value: "security", label: "Security Alerts" },
            ],
          })
        .endField()
      .endRow()
    .endSection();

    this.addSection("Privacy Settings")
      .addRow()
        .addField("privacySettings")
          .component(LuminoCheckboxGroup)
          .label("Privacy Settings")
          .props({
            options: [
              { value: "profile", label: "Show my profile publicly" },
              { value: "activity", label: "Show my activity" },
              { value: "search", label: "Allow search engines to index" },
            ],
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function CheckboxGroupPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">CheckboxGroup</h1>
      <p className="docs-page-subtitle">
        A group of checkboxes for selecting multiple values from a list.
        Each option can be toggled independently.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoCheckboxGroup } from "lumino/react";
import { Form } from "lumino/core";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic CheckboxGroup</h2>
        <p>Simple checkbox groups with string and object options:</p>
        <LuminoLiveDemo
          title="Basic"
          description="Standard checkbox group selection"
          code={basicCode}
          form={basicCheckboxGroupForm}
          initialValues={{ interests: [], notifications: ["Updates"] }}
        />
      </div>

      <div className="docs-section">
        <h2>Disabled CheckboxGroup</h2>
        <p>Disable the entire group or individual options:</p>
        <LiveDemo
          title="Disabled"
          description="Non-interactive checkbox groups"
          code={disabledCode}
        >
          <DisabledCheckboxGroupDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Read-Only CheckboxGroup</h2>
        <p>Display selections without allowing changes:</p>
        <LiveDemo
          title="Read Only"
          description="View-only checkbox group"
          code={readOnlyCode}
        >
          <ReadOnlyCheckboxGroupDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Validation with Required</h2>
        <p>Use the <code>.rules(Validators.required())</code> validator for mandatory selections:</p>
        <LuminoLiveDemo
          title="Required"
          description="Checkbox group with error message"
          code={requiredCode}
          form={requiredCheckboxGroupForm}
          initialValues={{ terms: [] }}
        />
      </div>

      <div className="docs-section">
        <h2>Object Options with optionConfig</h2>
        <p>Use complex objects as options with custom value/display properties:</p>
        <LuminoLiveDemo
          title="Object Options"
          description="Configure valueProperty and displayProperty"
          code={objectOptionsCode}
          form={objectOptionsForm}
          initialValues={{ features: [], roles: [] }}
        />
      </div>

      <div className="docs-section">
        <h2>Settings Example</h2>
        <p>A realistic settings panel with multiple checkbox groups:</p>
        <LuminoLiveDemo
          title="Settings"
          description="Complete settings panel example"
          code={settingsCode}
          form={settingsForm}
          initialValues={{ emailSettings: ["updates", "security"], privacySettings: ["profile"] }}
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
              <td>string[]</td>
              <td>[]</td>
              <td>Array of selected values</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(values: string[]) =&gt; void</td>
              <td>-</td>
              <td>Called when selection changes</td>
            </tr>
            <tr>
              <td><code>options</code></td>
              <td>string[] | SelectOption[]</td>
              <td>[]</td>
              <td>Available options to choose from</td>
            </tr>
            <tr>
              <td><code>optionConfig</code></td>
              <td>OptionConfig</td>
              <td>-</td>
              <td>Config for object options</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable all checkboxes</td>
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
              <td>Error message to display</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Option Types</h2>
        <pre className="docs-code">{`// Simple string options
options={["Option A", "Option B", "Option C"]}

// Object options with value/label
options={[
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C", disabled: true },
]}

// Custom object options with optionConfig
options={features}
optionConfig={{
  valueProperty: "id",
  displayProperty: "name",
  disabledProperty: "inactive",
}}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use for related options</strong> - Group related choices
            that users might select multiple of
          </li>
          <li>
            <strong>Provide clear labels</strong> - Each checkbox should have
            a descriptive, unambiguous label
          </li>
          <li>
            <strong>Set sensible defaults</strong> - Pre-check commonly selected
            options when appropriate
          </li>
          <li>
            <strong>Limit the number of options</strong> - For many options (7+),
            consider using MultiSelect instead
          </li>
          <li>
            <strong>Use horizontal for few options</strong> - Horizontal layout
            works well for 2-5 short options
          </li>
          <li>
            <strong>Use vertical for many options</strong> - Vertical layout
            is easier to scan for longer lists
          </li>
          <li>
            <strong>Validate when needed</strong> - Show clear error messages
            when minimum/maximum selections are required
          </li>
        </ul>
      </div>
    </div>
  );
}
