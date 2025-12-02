/**
 * NumberInput Field Page
 *
 * Documents the LuminoNumberInput component with live demos using Form Builder pattern.
 * Uses LuminoLiveDemo component for interactive demos.
 */

import React from "react";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

// =============================================================================
// BASIC NUMBER INPUT FORM
// =============================================================================

class BasicNumberForm extends Form<{ quantity: number; price: number }> {
  constructor() { super("basic-number-form"); }
  configure() {
    this.addSection("Basic Number Inputs")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .placeholder("Enter quantity")
        .endField()
      .endRow()
      .addRow()
        .addField("price")
          .component(LuminoNumberInput)
          .label("Price")
          .placeholder("Enter price")
        .endField()
      .endRow()
    .endSection();
  }
}

const basicCode = `import { Form } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class BasicNumberForm extends Form<{ quantity: number; price: number }> {
  constructor() { super("basic-number-form"); }

  configure() {
    this.addSection("Basic Number Inputs")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .placeholder("Enter quantity")
        .endField()
      .endRow()
      .addRow()
        .addField("price")
          .component(LuminoNumberInput)
          .label("Price")
          .placeholder("Enter price")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MIN/MAX CONSTRAINTS FORM
// =============================================================================

class MinMaxForm extends Form<{ percentage: number; rating: number; temperature: number }> {
  constructor() { super("minmax-form"); }
  configure() {
    this.addSection("Min/Max Constraints")
      .addRow()
        .addField("percentage")
          .component(LuminoNumberInput)
          .label("Percentage (0-100)")
          .placeholder("0-100")
          .props({ min: 0, max: 100 })
          .rules(
            Validators.min(0, "Minimum is 0"),
            Validators.max(100, "Maximum is 100")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("rating")
          .component(LuminoNumberInput)
          .label("Rating (1-5)")
          .placeholder("1-5")
          .props({ min: 1, max: 5 })
          .rules(
            Validators.min(1, "Minimum is 1"),
            Validators.max(5, "Maximum is 5")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("temperature")
          .component(LuminoNumberInput)
          .label("Temperature (-40 to 50)")
          .placeholder("-40 to 50")
          .props({ min: -40, max: 50 })
        .endField()
      .endRow()
    .endSection();
  }
}

const minMaxCode = `import { Form, Validators } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class MinMaxForm extends Form<{ percentage: number; rating: number; temperature: number }> {
  constructor() { super("minmax-form"); }

  configure() {
    this.addSection("Min/Max Constraints")
      .addRow()
        .addField("percentage")
          .component(LuminoNumberInput)
          .label("Percentage (0-100)")
          .placeholder("0-100")
          .props({ min: 0, max: 100 })
          .rules(
            Validators.min(0, "Minimum is 0"),
            Validators.max(100, "Maximum is 100")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("rating")
          .component(LuminoNumberInput)
          .label("Rating (1-5)")
          .placeholder("1-5")
          .props({ min: 1, max: 5 })
          .rules(
            Validators.min(1, "Minimum is 1"),
            Validators.max(5, "Maximum is 5")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("temperature")
          .component(LuminoNumberInput)
          .label("Temperature (-40 to 50)")
          .placeholder("-40 to 50")
          .props({ min: -40, max: 50 })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STEP INCREMENT FORM
// =============================================================================

class StepForm extends Form<{ integer: number; decimal: number; tens: number }> {
  constructor() { super("step-form"); }
  configure() {
    this.addSection("Step Increments")
      .addRow()
        .addField("integer")
          .component(LuminoNumberInput)
          .label("Integer (step: 1)")
          .props({ step: 1 })
        .endField()
      .endRow()
      .addRow()
        .addField("decimal")
          .component(LuminoNumberInput)
          .label("Decimal (step: 0.1)")
          .props({ step: 0.1 })
        .endField()
      .endRow()
      .addRow()
        .addField("tens")
          .component(LuminoNumberInput)
          .label("By Tens (step: 10)")
          .props({ step: 10 })
        .endField()
      .endRow()
    .endSection();
  }
}

const stepCode = `import { Form } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class StepForm extends Form<{ integer: number; decimal: number; tens: number }> {
  constructor() { super("step-form"); }

  configure() {
    this.addSection("Step Increments")
      .addRow()
        .addField("integer")
          .component(LuminoNumberInput)
          .label("Integer (step: 1)")
          .props({ step: 1 })
        .endField()
      .endRow()
      .addRow()
        .addField("decimal")
          .component(LuminoNumberInput)
          .label("Decimal (step: 0.1)")
          .props({ step: 0.1 })
        .endField()
      .endRow()
      .addRow()
        .addField("tens")
          .component(LuminoNumberInput)
          .label("By Tens (step: 10)")
          .props({ step: 10 })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DISABLED AND READ-ONLY FORM
// =============================================================================

class StatesForm extends Form<{ disabled: number; readOnly: number }> {
  constructor() { super("states-form"); }
  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("disabled")
          .component(LuminoNumberInput)
          .label("Disabled Field")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoNumberInput)
          .label("Read-Only Field")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}

const statesCode = `import { Form } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class StatesForm extends Form<{ disabled: number; readOnly: number }> {
  constructor() { super("states-form"); }

  configure() {
    this.addSection("Field States")
      .addRow()
        .addField("disabled")
          .component(LuminoNumberInput)
          .label("Disabled Field")
          .disable(true)
        .endField()
      .endRow()
      .addRow()
        .addField("readOnly")
          .component(LuminoNumberInput)
          .label("Read-Only Field")
          .readOnly(true)
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// VALIDATION FORM
// =============================================================================

class ValidationForm extends Form<{ required: number; rangeValue: number }> {
  constructor() { super("validation-form"); }
  configure() {
    this.addSection("Validation")
      .addRow()
        .addField("required")
          .component(LuminoNumberInput)
          .label("Required Field")
          .placeholder("This field is required")
          .rules(Validators.required({ message: "Value is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("rangeValue")
          .component(LuminoNumberInput)
          .label("Range (0-1000)")
          .placeholder("Enter 0-1000")
          .props({ min: 0, max: 1000 })
          .rules(
            Validators.required({ message: "Value is required" }),
            Validators.min(0, "Value must be positive"),
            Validators.max(1000, "Value must be 1000 or less")
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const validationCode = `import { Form, Validators } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class ValidationForm extends Form<{ required: number; rangeValue: number }> {
  constructor() { super("validation-form"); }

  configure() {
    this.addSection("Validation")
      .addRow()
        .addField("required")
          .component(LuminoNumberInput)
          .label("Required Field")
          .placeholder("This field is required")
          .rules(Validators.required({ message: "Value is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("rangeValue")
          .component(LuminoNumberInput)
          .label("Range (0-1000)")
          .placeholder("Enter 0-1000")
          .props({ min: 0, max: 1000 })
          .rules(
            Validators.required({ message: "Value is required" }),
            Validators.min(0, "Value must be positive"),
            Validators.max(1000, "Value must be 1000 or less")
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// ORDER FORM EXAMPLE
// =============================================================================

class OrderForm extends Form<{ quantity: number; pricePerItem: number; discount: number }> {
  constructor() { super("order-form"); }
  configure() {
    this.addSection("Order Details")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .props({ min: 1, step: 1 })
          .rules(Validators.required({ message: "Quantity is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("pricePerItem")
          .component(LuminoNumberInput)
          .label("Price per Item ($)")
          .props({ min: 0, step: 0.01 })
          .rules(Validators.required({ message: "Price is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("discount")
          .component(LuminoNumberInput)
          .label("Discount (%)")
          .props({ min: 0, max: 100, step: 5 })
                  .endField()
      .endRow()
    .endSection();
  }
}

const orderFormCode = `import { Form, Validators } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class OrderForm extends Form<{ quantity: number; pricePerItem: number; discount: number }> {
  constructor() { super("order-form"); }

  configure() {
    this.addSection("Order Details")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .props({ min: 1, step: 1 })
          .rules(Validators.required({ message: "Quantity is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("pricePerItem")
          .component(LuminoNumberInput)
          .label("Price per Item ($)")
          .props({ min: 0, step: 0.01 })
          .rules(Validators.required({ message: "Price is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("discount")
          .component(LuminoNumberInput)
          .label("Discount (%)")
          .props({ min: 0, max: 100, step: 5 })
                  .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MULTI-FIELD LAYOUT FORM
// =============================================================================

class MultiFieldForm extends Form<{ width: number; height: number; depth: number }> {
  constructor() { super("multi-field-form"); }
  configure() {
    this.addSection("Dimensions")
      .addRow()
        .addField("width")
          .component(LuminoNumberInput)
          .label("Width (cm)")
          .placeholder("Width")
          .props({ min: 0, step: 0.1 })
        .endField()
        .addField("height")
          .component(LuminoNumberInput)
          .label("Height (cm)")
          .placeholder("Height")
          .props({ min: 0, step: 0.1 })
        .endField()
        .addField("depth")
          .component(LuminoNumberInput)
          .label("Depth (cm)")
          .placeholder("Depth")
          .props({ min: 0, step: 0.1 })
        .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}

const multiFieldCode = `import { Form } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class MultiFieldForm extends Form<{ width: number; height: number; depth: number }> {
  constructor() { super("multi-field-form"); }

  configure() {
    this.addSection("Dimensions")
      .addRow()
        .addField("width")
          .component(LuminoNumberInput)
          .label("Width (cm)")
          .placeholder("Width")
          .props({ min: 0, step: 0.1 })
        .endField()
        .addField("height")
          .component(LuminoNumberInput)
          .label("Height (cm)")
          .placeholder("Height")
          .props({ min: 0, step: 0.1 })
        .endField()
        .addField("depth")
          .component(LuminoNumberInput)
          .label("Depth (cm)")
          .placeholder("Depth")
          .props({ min: 0, step: 0.1 })
        .endField()
        .layout([1, 1, 1])  // Equal width columns
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function NumberInputPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">NumberInput</h1>
      <p className="docs-page-subtitle">
        A numeric input field with support for min/max constraints, step increments,
        and validation.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic NumberInput</h2>
        <p>Simple number inputs with controlled value:</p>
        <LuminoLiveDemo
          title="Basic"
          description="Standard number input"
          form={new BasicNumberForm()}
          code={basicCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Min/Max Constraints</h2>
        <p>Limit input values within a range using props and validators:</p>
        <LuminoLiveDemo
          title="Min/Max"
          description="Constrain values to a range"
          form={new MinMaxForm()}
          code={minMaxCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Step Increment</h2>
        <p>Control the increment/decrement step size:</p>
        <LuminoLiveDemo
          title="Step"
          description="Different step sizes"
          form={new StepForm()}
          code={stepCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Disabled and Read-Only</h2>
        <p>Non-interactive number inputs:</p>
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
          description="Number input with validation"
          form={new ValidationForm()}
          code={validationCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Order Form Example</h2>
        <p>A complete order form with number inputs:</p>
        <LuminoLiveDemo
          title="Order Form"
          description="Practical order form example"
          form={new OrderForm()}
          code={orderFormCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Multi-Field Layout</h2>
        <p>Multiple number fields in a single row:</p>
        <LuminoLiveDemo
          title="Multi-Field"
          description="Fields in a row with equal widths"
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
              <td>number | null</td>
              <td>-</td>
              <td>Current value (controlled)</td>
            </tr>
            <tr>
              <td><code>onChange</code></td>
              <td>(value: number | null) =&gt; void</td>
              <td>-</td>
              <td>Called when value changes</td>
            </tr>
            <tr>
              <td><code>min</code></td>
              <td>number</td>
              <td>-</td>
              <td>Minimum allowed value</td>
            </tr>
            <tr>
              <td><code>max</code></td>
              <td>number</td>
              <td>-</td>
              <td>Maximum allowed value</td>
            </tr>
            <tr>
              <td><code>step</code></td>
              <td>number</td>
              <td>1</td>
              <td>Increment/decrement step</td>
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
              <td>Disable the input</td>
            </tr>
            <tr>
              <td><code>readOnly</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Make input read-only</td>
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
              <td><code>.component(LuminoNumberInput)</code></td>
              <td>Set the number input component</td>
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
              <td><code>.props(&#123; min, max, step &#125;)</code></td>
              <td>Pass number-specific props</td>
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
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Set appropriate min/max</strong> - Prevent invalid values
            at the UI level before validation
          </li>
          <li>
            <strong>Match step to use case</strong> - Use step: 0.01 for currency,
            step: 1 for integers
          </li>
          <li>
            <strong>Handle null values</strong> - Empty input returns null, not 0
          </li>
          <li>
            <strong>Validate on server too</strong> - Don't rely only on min/max
            props for security
          </li>
          <li>
            <strong>Provide context</strong> - Use labels or placeholders to indicate
            expected value range
          </li>
          <li>
            <strong>Use Validators</strong> - Combine props (min/max) with Validators
            for comprehensive validation
          </li>
        </ul>
      </div>
    </div>
  );
}
