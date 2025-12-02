/**
 * Button Page
 *
 * Documents the LuminoButton component and Form Actions using Lumino patterns.
 * Buttons in Lumino are used either as Form actions (via Action class) or
 * directly as Lumino components.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import {
  LuminoButton,
  LuminoStackLayout,
  LuminoFlowLayout,
  LuminoText,
  LuminoTextInput,
  FormRenderer,
} from "lumino/react";
import { Form, Action, Validators, Component } from "lumino/core";

// =============================================================================
// FORM CLASSES WITH ACTIONS
// =============================================================================

/**
 * Form demonstrating save and cancel actions
 */
class SaveCancelForm extends Form<{ name: string }> {
  constructor() {
    super("save-cancel-form");
  }

  configure() {
    this.addSection("User Info")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Name")
          .placeholder("Enter your name")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
    .endSection();

    // Save action - validates and submits
    this.addAction("save", new Action<{ name: string }>()
      .label("Save")
      .afterExecute((response, ctx) => {
        ctx.notify("Saved successfully!", "success");
      })
      .build());

    // Cancel action - skips validation
    this.addAction("cancel", new Action<{ name: string }>()
      .label("Cancel")
      .skipValidation()
      .handler((ctx) => {
        ctx.notify("Cancelled", "info");
      })
      .build());
  }
}

/**
 * Form with async save action (shows loading state)
 */
class AsyncActionForm extends Form<{ email: string }> {
  constructor() {
    super("async-action-form");
  }

  configure() {
    this.addSection("Subscription")
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("Enter your email")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email({ message: "Invalid email format" })
          )
        .endField()
      .endRow()
    .endSection();

    // Async action with loading state
    this.addAction("subscribe", new Action<{ email: string }>()
      .label("Subscribe")
      .handler(async (ctx) => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 2000));
        ctx.notify("Subscribed successfully!", "success");
      })
      .build());
  }
}

/**
 * Form demonstrating multiple action variants
 */
class MultiActionForm extends Form<{ task: string }> {
  constructor() {
    super("multi-action-form");
  }

  configure() {
    this.addSection("Task")
      .addRow()
        .addField("task")
          .component(LuminoTextInput)
          .label("Task Name")
          .placeholder("Enter task name")
        .endField()
      .endRow()
    .endSection();

    // Primary action
    this.addAction("save", new Action<{ task: string }>()
      .label("Save")
      .handler((ctx) => {
        ctx.notify("Task saved!", "success");
      })
      .build());

    // Secondary action
    this.addAction("saveDraft", new Action<{ task: string }>()
      .label("Save as Draft")
      .skipValidation()
      .handler((ctx) => {
        ctx.notify("Saved as draft", "info");
      })
      .build());

    // Tertiary action
    this.addAction("discard", new Action<{ task: string }>()
      .label("Discard")
      .skipValidation()
      .handler((ctx) => {
        ctx.notify("Discarded", "warning");
      })
      .build());
  }
}

// =============================================================================
// COMPONENT CLASS FOR STANDALONE BUTTONS
// =============================================================================

/**
 * Component demonstrating button variants
 */
class ButtonVariantsComponent extends Component {
  configure() {
    // Components can render custom content
  }
}

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

const saveCancelForm = new SaveCancelForm();
const asyncActionForm = new AsyncActionForm();
const multiActionForm = new MultiActionForm();

function FormActionsDemo() {
  return (
    <LuminoLiveDemo
      form={saveCancelForm}
      code={formActionsCode}
    />
  );
}

function AsyncActionsDemo() {
  return (
    <LuminoLiveDemo
      form={asyncActionForm}
      code={asyncActionsCode}
    />
  );
}

function MultiActionsDemo() {
  return (
    <LuminoLiveDemo
      form={multiActionForm}
      code={multiActionsCode}
    />
  );
}

// Standalone button demos (for component documentation)
function ButtonVariantsDemo() {
  return (
    <LuminoFlowLayout gap={2}>
      <LuminoButton variant="primary">Primary</LuminoButton>
      <LuminoButton variant="secondary">Secondary</LuminoButton>
      <LuminoButton variant="cta">CTA</LuminoButton>
    </LuminoFlowLayout>
  );
}

function DisabledButtonDemo() {
  return (
    <LuminoFlowLayout gap={2}>
      <LuminoButton variant="primary" disabled>
        Disabled Primary
      </LuminoButton>
      <LuminoButton variant="secondary" disabled>
        Disabled Secondary
      </LuminoButton>
    </LuminoFlowLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const formActionsCode = `import { Form, Action, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class SaveCancelForm extends Form<{ name: string }> {
  constructor() {
    super("save-cancel-form");
  }

  configure() {
    this.addSection("User Info")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Name")
          .placeholder("Enter your name")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
    .endSection();

    // Save action - validates and submits
    this.addAction("save", new Action<{ name: string }>()
      .label("Save")
      .afterExecute((response, ctx) => {
        ctx.notify("Saved successfully!", "success");
      })
      .build());

    // Cancel action - skips validation
    this.addAction("cancel", new Action<{ name: string }>()
      .label("Cancel")
      .skipValidation()
      .handler((ctx) => {
        ctx.notify("Cancelled", "info");
      })
      .build());
  }
}`;

const asyncActionsCode = `import { Form, Action, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class AsyncActionForm extends Form<{ email: string }> {
  constructor() {
    super("async-action-form");
  }

  configure() {
    this.addSection("Subscription")
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("Enter your email")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email({ message: "Invalid email format" })
          )
        .endField()
      .endRow()
    .endSection();

    // Async action - loading state is automatic
    this.addAction("subscribe", new Action<{ email: string }>()
      .label("Subscribe")
      .handler(async (ctx) => {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 2000));
        ctx.notify("Subscribed successfully!", "success");
      })
      .build());
  }
}`;

const multiActionsCode = `import { Form, Action } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class MultiActionForm extends Form<{ task: string }> {
  constructor() {
    super("multi-action-form");
  }

  configure() {
    this.addSection("Task")
      .addRow()
        .addField("task")
          .component(LuminoTextInput)
          .label("Task Name")
          .placeholder("Enter task name")
        .endField()
      .endRow()
    .endSection();

    // Primary action
    this.addAction("save", new Action<{ task: string }>()
      .label("Save")
      .handler((ctx) => ctx.notify("Task saved!", "success"))
      .build());

    // Secondary action
    this.addAction("saveDraft", new Action<{ task: string }>()
      .label("Save as Draft")
      .skipValidation()
      .handler((ctx) => ctx.notify("Saved as draft", "info"))
      .build());

    // Tertiary action
    this.addAction("discard", new Action<{ task: string }>()
      .label("Discard")
      .skipValidation()
      .handler((ctx) => ctx.notify("Discarded", "warning"))
      .build());
  }
}`;

const variantsCode = `import { LuminoButton, LuminoFlowLayout } from "lumino/react";

// Standalone buttons (outside of forms)
<LuminoFlowLayout gap={2}>
  <LuminoButton variant="primary">Primary</LuminoButton>
  <LuminoButton variant="secondary">Secondary</LuminoButton>
  <LuminoButton variant="cta">CTA</LuminoButton>
</LuminoFlowLayout>`;

const disabledCode = `import { LuminoButton, LuminoFlowLayout } from "lumino/react";

<LuminoFlowLayout gap={2}>
  <LuminoButton variant="primary" disabled>
    Disabled Primary
  </LuminoButton>
  <LuminoButton variant="secondary" disabled>
    Disabled Secondary
  </LuminoButton>
</LuminoFlowLayout>`;

const actionBuilderCode = `import { Action } from "lumino/core";

// Action with API call
new Action<UserEntity>()
  .label("Save")
  .api((ctx) => ctx.mode === "new"
      ? ctx.api.UsersApi.create
      : ctx.api.UsersApi.update)
  .params((ctx) => ctx.mode === "edit"
      ? { path: { id: ctx.routeParams.id } }
      : {})
  .afterExecute((response, ctx) => {
    ctx.notify("Saved!", "success");
    ctx.navigate("/users");
  })
  .onError((error, ctx) => {
    ctx.notify(error.message, "error");
  })
  .build()

// Cancel action (no API)
new Action<UserEntity>()
  .label("Cancel")
  .skipValidation()
  .handler((ctx) => ctx.navigate("/users"))
  .build()`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function ButtonPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Button</h1>
      <p className="docs-page-subtitle">
        Buttons in Lumino are used primarily as Form actions (via the Action class) or
        as standalone Lumino components. Actions provide automatic validation,
        loading states, and API integration.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`// For Form actions
import { Form, Action } from "lumino/core";

// For standalone buttons
import { LuminoButton } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Form Actions (Recommended)</h2>
        <p>
          Define actions on Forms using the <code>addAction()</code> method with the Action builder.
          This provides automatic validation, loading states, and form context.
        </p>
        <LiveDemo
          title="Save & Cancel Actions"
          description="Form with save and cancel buttons"
          code={formActionsCode}
        >
          <FormActionsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Async Actions with Loading</h2>
        <p>
          Actions with async handlers automatically show loading state during execution:
        </p>
        <LiveDemo
          title="Async Action"
          description="Click subscribe to see loading state"
          code={asyncActionsCode}
        >
          <AsyncActionsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Multiple Actions</h2>
        <p>
          Forms can have multiple actions with different behaviors:
        </p>
        <LiveDemo
          title="Multi Actions"
          description="Save, Save Draft, and Discard actions"
          code={multiActionsCode}
        >
          <MultiActionsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Standalone Buttons</h2>
        <p>
          For buttons outside of forms, use LuminoButton directly:
        </p>
        <LiveDemo
          title="Button Variants"
          description="Primary, Secondary, and CTA buttons"
          code={variantsCode}
        >
          <ButtonVariantsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Disabled State</h2>
        <LiveDemo
          title="Disabled Buttons"
          description="Buttons that cannot be clicked"
          code={disabledCode}
        >
          <DisabledButtonDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Action Builder API</h2>
        <p>
          The Action class provides a fluent builder for defining form actions:
        </p>
        <pre className="docs-code">{actionBuilderCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Action Builder Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.label(text)</code></td>
              <td>Set button label</td>
            </tr>
            <tr>
              <td><code>.api(fn)</code></td>
              <td>Set API to execute (dynamic based on context)</td>
            </tr>
            <tr>
              <td><code>.params(fn)</code></td>
              <td>Set API parameters (path, query, headers)</td>
            </tr>
            <tr>
              <td><code>.body(fn)</code></td>
              <td>Override request body (default: form data)</td>
            </tr>
            <tr>
              <td><code>.skipValidation()</code></td>
              <td>Skip form validation for this action</td>
            </tr>
            <tr>
              <td><code>.beforeExecute(fn)</code></td>
              <td>Run before API execution</td>
            </tr>
            <tr>
              <td><code>.afterExecute(fn)</code></td>
              <td>Run after successful API execution</td>
            </tr>
            <tr>
              <td><code>.onError(fn)</code></td>
              <td>Handle API errors</td>
            </tr>
            <tr>
              <td><code>.handler(fn)</code></td>
              <td>Custom handler (no API)</td>
            </tr>
            <tr>
              <td><code>.build()</code></td>
              <td>Build the action configuration</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>LuminoButton Props</h2>
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
              <td><code>variant</code></td>
              <td>"primary" | "secondary" | "cta"</td>
              <td>"primary"</td>
              <td>Visual style variant</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable the button</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td>"button" | "submit" | "reset"</td>
              <td>"button"</td>
              <td>HTML button type</td>
            </tr>
            <tr>
              <td><code>onClick</code></td>
              <td>(event) =&gt; void</td>
              <td>-</td>
              <td>Click handler</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>-</td>
              <td>Button content</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use Form Actions</strong> - Prefer addAction() in Forms for automatic validation and context
          </li>
          <li>
            <strong>Use skipValidation()</strong> - For cancel, reset, or draft actions
          </li>
          <li>
            <strong>Async handlers = auto loading</strong> - Async handlers automatically show loading state
          </li>
          <li>
            <strong>Use descriptive labels</strong> - "Save Changes" is better than "Submit"
          </li>
          <li>
            <strong>One primary per area</strong> - Don't have multiple primary buttons competing for attention
          </li>
        </ul>
      </div>
    </div>
  );
}
