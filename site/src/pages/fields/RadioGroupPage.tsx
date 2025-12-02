/**
 * RadioGroup Field Page
 *
 * Documents the LuminoRadioGroup component with live demos.
 * Uses Form Builder pattern for interactive demos.
 */

import React from "react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { LiveDemo } from "../../components/LiveDemo";
import {
  LuminoRadioGroup,
  LuminoStackLayout,
  LuminoText,
} from "lumino/react";
import { Form, Validators } from "lumino/core";

// =============================================================================
// FORM CLASSES - Form Builder Pattern
// =============================================================================

class BasicRadioGroupForm extends Form<{ gender: string; experience: string }> {
  constructor() {
    super("basic-radio-group-form");
  }

  configure() {
    this.addSection("Basic Selection")
      .addRow()
        .addField("gender")
          .component(LuminoRadioGroup)
          .label("Gender")
          .props({
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("experience")
          .component(LuminoRadioGroup)
          .label("Experience")
          .props({
            options: ["Beginner", "Intermediate", "Advanced", "Expert"],
          })
        .endField()
      .endRow()
    .endSection();
  }
}

class ObjectOptionsForm extends Form<{ paymentMethod: string; shippingSpeed: string }> {
  constructor() {
    super("object-options-radio-form");
  }

  configure() {
    const paymentMethods = [
      { id: "card", name: "Credit Card", fee: 0 },
      { id: "paypal", name: "PayPal", fee: 2.9 },
      { id: "bank", name: "Bank Transfer", fee: 0 },
      { id: "crypto", name: "Cryptocurrency", fee: 1.5 },
    ];

    const shippingSpeeds = [
      { code: "standard", label: "Standard (5-7 days)", price: 5.99 },
      { code: "express", label: "Express (2-3 days)", price: 12.99 },
      { code: "overnight", label: "Overnight", price: 24.99 },
    ];

    this.addSection("Payment & Shipping")
      .addRow()
        .addField("paymentMethod")
          .component(LuminoRadioGroup)
          .label("Payment Method")
          .props({
            options: paymentMethods,
            optionConfig: {
              valueProperty: "id",
              displayProperty: "name",
            },
          })
        .endField()
      .endRow()
      .addRow()
        .addField("shippingSpeed")
          .component(LuminoRadioGroup)
          .label("Shipping Speed")
          .props({
            options: shippingSpeeds,
            optionConfig: {
              valueProperty: "code",
              displayProperty: "label",
            },
          })
        .endField()
      .endRow()
    .endSection();
  }
}

class RequiredRadioGroupForm extends Form<{ answer: string }> {
  constructor() {
    super("required-radio-group-form");
  }

  configure() {
    this.addSection("Required Selection")
      .addRow()
        .addField("answer")
          .component(LuminoRadioGroup)
          .label("Your Answer")
          .props({
            options: ["Yes", "No", "Maybe"],
          })
          .rules(Validators.required({ message: "Please select an option" }))
        .endField()
      .endRow()
    .endSection();
  }
}

class SurveyForm extends Form<{ satisfaction: string; recommend: string; experience: string }> {
  constructor() {
    super("survey-form");
  }

  configure() {
    this.addSection("Customer Survey")
      .addRow()
        .addField("satisfaction")
          .component(LuminoRadioGroup)
          .label("How satisfied are you with our service?")
          .props({
            options: [
              { value: "very-satisfied", label: "Very Satisfied" },
              { value: "satisfied", label: "Satisfied" },
              { value: "neutral", label: "Neutral" },
              { value: "dissatisfied", label: "Dissatisfied" },
              { value: "very-dissatisfied", label: "Very Dissatisfied" },
            ],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("recommend")
          .component(LuminoRadioGroup)
          .label("Would you recommend us to a friend?")
          .props({
            options: ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("experience")
          .component(LuminoRadioGroup)
          .label("Your overall experience")
          .props({
            options: [
              { value: "excellent", label: "Excellent" },
              { value: "good", label: "Good" },
              { value: "average", label: "Average" },
              { value: "poor", label: "Poor" },
            ],
          })
        .endField()
      .endRow()
    .endSection();
  }
}

// Create form instances
const basicRadioGroupForm = new BasicRadioGroupForm();
const objectOptionsForm = new ObjectOptionsForm();
const requiredRadioGroupForm = new RequiredRadioGroupForm();
const surveyForm = new SurveyForm();

// =============================================================================
// STATIC DEMO COMPONENTS - For disabled/readonly demos
// =============================================================================

function DisabledRadioGroupDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoStackLayout gap={1}>
        <LuminoText>Disabled Group (all options disabled):</LuminoText>
        <LuminoRadioGroup
          value="a"
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
        <LuminoRadioGroup
          value="option2"
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

function ReadOnlyRadioGroupDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Selected value is locked (read-only):</LuminoText>
      <LuminoRadioGroup
        value="medium"
        onChange={() => {}}
        options={[
          { value: "low", label: "Low Priority" },
          { value: "medium", label: "Medium Priority" },
          { value: "high", label: "High Priority" },
        ]}
        readOnly
      />
      <LuminoText variant="secondary">
        Read-only displays the current selection but cannot be changed.
      </LuminoText>
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCode = `import { Form, LuminoRadioGroup } from "lumino";

class ProfileForm extends Form<{ gender: string; experience: string }> {
  configure() {
    this.addSection("Basic Selection")
      .addRow()
        .addField("gender")
          .component(LuminoRadioGroup)
          .label("Gender")
          .props({
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("experience")
          .component(LuminoRadioGroup)
          .label("Experience")
          .props({
            // Simple string array
            options: ["Beginner", "Intermediate", "Advanced", "Expert"],
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

const disabledCode = `import { LuminoRadioGroup, LuminoStackLayout, LuminoText } from "lumino/react";

function DisabledRadioGroupDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoStackLayout gap={1}>
        <LuminoText>Disabled Group (all options disabled):</LuminoText>
        <LuminoRadioGroup
          value="a"
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
        <LuminoRadioGroup
          value="option2"
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

const readOnlyCode = `import { LuminoRadioGroup, LuminoStackLayout, LuminoText } from "lumino/react";

function ReadOnlyRadioGroupDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Selected value is locked (read-only):</LuminoText>
      <LuminoRadioGroup
        value="medium"
        onChange={() => {}}
        options={[
          { value: "low", label: "Low Priority" },
          { value: "medium", label: "Medium Priority" },
          { value: "high", label: "High Priority" },
        ]}
        readOnly
      />
      <LuminoText variant="secondary">
        Read-only displays the current selection but cannot be changed.
      </LuminoText>
    </LuminoStackLayout>
  );
}`;

const requiredCode = `import { Form, LuminoRadioGroup } from "lumino";

class QuestionForm extends Form<{ answer: string }> {
  configure() {
    this.addSection("Required Selection")
      .addRow()
        .addField("answer")
          .component(LuminoRadioGroup)
          .label("Your Answer")
          .props({
            options: ["Yes", "No", "Maybe"],
          })
          .rules(Validators.required({ message: "Please select an option" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

const objectOptionsCode = `import { Form, LuminoRadioGroup } from "lumino";

class CheckoutForm extends Form<{ paymentMethod: string; shippingSpeed: string }> {
  configure() {
    const paymentMethods = [
      { id: "card", name: "Credit Card", fee: 0 },
      { id: "paypal", name: "PayPal", fee: 2.9 },
      { id: "bank", name: "Bank Transfer", fee: 0 },
    ];

    const shippingSpeeds = [
      { code: "standard", label: "Standard (5-7 days)", price: 5.99 },
      { code: "express", label: "Express (2-3 days)", price: 12.99 },
      { code: "overnight", label: "Overnight", price: 24.99 },
    ];

    this.addSection("Payment & Shipping")
      .addRow()
        .addField("paymentMethod")
          .component(LuminoRadioGroup)
          .label("Payment Method")
          .props({
            options: paymentMethods,
            optionConfig: {
              valueProperty: "id",
              displayProperty: "name",
            },
          })
        .endField()
      .endRow()
      .addRow()
        .addField("shippingSpeed")
          .component(LuminoRadioGroup)
          .label("Shipping Speed")
          .props({
            options: shippingSpeeds,
            optionConfig: {
              valueProperty: "code",
              displayProperty: "label",
            },
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

const surveyCode = `import { Form, LuminoRadioGroup } from "lumino";

class SurveyForm extends Form<{ satisfaction: string; recommend: string; experience: string }> {
  configure() {
    this.addSection("Customer Survey")
      .addRow()
        .addField("satisfaction")
          .component(LuminoRadioGroup)
          .label("How satisfied are you with our service?")
          .props({
            options: [
              { value: "very-satisfied", label: "Very Satisfied" },
              { value: "satisfied", label: "Satisfied" },
              { value: "neutral", label: "Neutral" },
              { value: "dissatisfied", label: "Dissatisfied" },
              { value: "very-dissatisfied", label: "Very Dissatisfied" },
            ],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("recommend")
          .component(LuminoRadioGroup)
          .label("Would you recommend us?")
          .props({
            options: ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("experience")
          .component(LuminoRadioGroup)
          .label("Your overall experience")
          .props({
            options: [
              { value: "excellent", label: "Excellent" },
              { value: "good", label: "Good" },
              { value: "average", label: "Average" },
              { value: "poor", label: "Poor" },
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

export function RadioGroupPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">RadioGroup</h1>
      <p className="docs-page-subtitle">
        A group of radio buttons for selecting a single value from a list.
        Only one option can be selected at a time.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoRadioGroup } from "lumino/react";
import { Form } from "lumino/core";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic RadioGroup</h2>
        <p>Simple radio groups with string and object options:</p>
        <LuminoLiveDemo
          title="Basic"
          description="Standard radio group selection"
          code={basicCode}
          form={basicRadioGroupForm}
          initialValues={{ gender: "", experience: "" }}
        />
      </div>

      <div className="docs-section">
        <h2>Disabled RadioGroup</h2>
        <p>Disable the entire group or individual options:</p>
        <LiveDemo
          title="Disabled"
          description="Non-interactive radio groups"
          code={disabledCode}
        >
          <DisabledRadioGroupDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Read-Only RadioGroup</h2>
        <p>Display the selection without allowing changes:</p>
        <LiveDemo
          title="Read Only"
          description="View-only radio group"
          code={readOnlyCode}
        >
          <ReadOnlyRadioGroupDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Validation with Required</h2>
        <p>Use the <code>.rules(Validators.required())</code> validator for mandatory selections:</p>
        <LuminoLiveDemo
          title="Required"
          description="Radio group with error message"
          code={requiredCode}
          form={requiredRadioGroupForm}
          initialValues={{ answer: "" }}
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
          initialValues={{ paymentMethod: "", shippingSpeed: "" }}
        />
      </div>

      <div className="docs-section">
        <h2>Survey Example</h2>
        <p>A realistic survey form with multiple questions:</p>
        <LuminoLiveDemo
          title="Survey"
          description="Complete survey form example"
          code={surveyCode}
          form={surveyForm}
          initialValues={{ satisfaction: "", recommend: "", experience: "" }}
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
              <td>Currently selected value</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: T) =&gt; void</td>
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
              <td>Disable all radio buttons</td>
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
options={users}
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
            <strong>Use for mutually exclusive options</strong> - Radio groups
            are perfect when only one choice is allowed
          </li>
          <li>
            <strong>Provide clear labels</strong> - Each option should be
            clearly labeled and easy to understand
          </li>
          <li>
            <strong>Limit the number of options</strong> - For many options (7+),
            consider using a Select dropdown instead
          </li>
          <li>
            <strong>Consider default selection</strong> - Pre-select the most common
            or recommended option when appropriate
          </li>
          <li>
            <strong>Use horizontal for few options</strong> - Horizontal layout
            works well for 2-4 short options
          </li>
          <li>
            <strong>Use vertical for many options</strong> - Vertical layout
            is easier to scan for longer lists
          </li>
          <li>
            <strong>Always validate required fields</strong> - Show clear error
            messages when selection is required
          </li>
        </ul>
      </div>
    </div>
  );
}
