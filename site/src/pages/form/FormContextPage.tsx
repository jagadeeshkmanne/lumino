/**
 * Form Context Page - Accessing form state in callbacks
 */

import { CodeBlock } from "../../components/CodeBlock";

const contextInterfaceCode = `interface FormContext<T> {
  // Entity & Data
  entity: T | null;                     // Current entity instance
  mode: "new" | "edit" | "view";        // Current form mode

  // Value Access
  getValue<K extends keyof T>(field: K): T[K];
  setValue<K extends keyof T>(field: K, value: T[K]): void;
  getFormData(): Partial<T>;            // All current form values

  // Validation
  validate(): Promise<boolean>;          // Trigger validation
  getErrors(): Record<string, string[]>; // Get all field errors
  getFieldError(field: keyof T): string | null;
  clearErrors(): void;

  // Form State
  isDirty: boolean;                      // Has form been modified
  isSubmitting: boolean;                 // Is form being submitted
  isValid: boolean;                      // Are all validations passing

  // Notifications
  notify?(message: string, type?: "success" | "error" | "warning" | "info"): void;

  // Navigation
  navigate?(path: string): void;
  setMode?(mode: string): void;

  // List Operations (when in list context)
  list?(name: string): ListOperations;
  removeCurrentItem?(): void;
  updateCurrentItem?(data: any): void;

  // Dialog Operations
  open?(dialog: typeof Dialog, options?: DialogOptions): void;
  close?(): void;
}`;

const getValueCode = `// Get a single field value
const firstName = ctx.getValue("firstName");
const email = ctx.getValue("email");

// Use in conditional logic
this.addField("salary")
  .component(LuminoNumberInput)
  .label("Salary")
  .hideByCondition((ctx) => !ctx.getValue("isActive"))
.endField();`;

const setValueCode = `// Set a single field value
ctx.setValue("status", "approved");
ctx.setValue("approvedAt", new Date().toISOString());

// Use in onClick handler
this.addComponent(LuminoButton)
  .children("Clear Form")
  .onClick((ctx) => {
    ctx.setValue("firstName", "");
    ctx.setValue("lastName", "");
    ctx.setValue("email", "");
  })
.endComponent();`;

const getFormDataCode = `// Get all form values as an object
const data = ctx.getFormData();
// { firstName: "John", lastName: "Doe", email: "john@example.com", ... }

// Use for form submission
this.addComponent(LuminoButton)
  .children("Submit")
  .onClick(async (ctx) => {
    const data = ctx.getFormData();
    await api.saveEmployee(data);
    ctx.notify?.("Employee saved!", "success");
  })
.endComponent();`;

const validationCode = `// Trigger validation programmatically
this.addComponent(LuminoButton)
  .children("Save")
  .onClick(async (ctx) => {
    const isValid = await ctx.validate?.();

    if (isValid) {
      await saveData(ctx.getFormData());
      ctx.notify?.("Saved successfully!", "success");
    } else {
      ctx.notify?.("Please fix validation errors.", "error");
    }
  })
.endComponent();

// Check specific field errors
const emailError = ctx.getFieldError("email");
if (emailError) {
  console.log("Email error:", emailError);
}

// Get all errors
const allErrors = ctx.getErrors();
// { email: ["Invalid email format"], phone: ["Required"] }`;

const modeCode = `// Check current mode
const isViewMode = ctx.mode === "view";
const isEditMode = ctx.mode === "edit";
const isNewMode = ctx.mode === "new";

// Use in conditional visibility
this.addField("id")
  .component(LuminoTextInput)
  .label("ID")
  .hideByCondition((ctx) => ctx.mode === "new") // Hide in new mode
.endField();

// Dynamic label based on mode
this.addComponent(LuminoButton)
  .children((ctx) => ctx.mode === "new" ? "Create" : "Update")
  .onClick((ctx) => { /* ... */ })
.endComponent();

// Change mode programmatically
ctx.setMode?.("view");`;

const listOperationsCode = `// Add item to a list
ctx.list("addresses").add({
  type: "home",
  street: "",
  city: "",
});

// Remove item at index
ctx.list("addresses").remove(0);

// Update item at index
ctx.list("addresses").update(0, {
  ...existingAddress,
  city: "New City",
});

// Get all items
const addresses = ctx.list("addresses").getItems();

// In list context (inside a list item)
ctx.removeCurrentItem?.();      // Remove this item
ctx.updateCurrentItem?.(data);  // Update this item`;

const dialogCode = `// Open a dialog
ctx.open(ExperienceDialog, {
  data: new Experience(),
  mode: "add",
  onSave: (data) => {
    ctx.list("experiences").add(data);
    ctx.notify?.("Experience added", "success");
  },
  onCancel: () => {
    // Optional cancel handler
  },
});

// Close current dialog (from inside dialog)
ctx.close?.();`;

const navigationCode = `// Navigate to a different route
ctx.navigate?.("/employees");
ctx.navigate?.("/employees/123");

// Use after save
this.addComponent(LuminoButton)
  .children("Save & Close")
  .onClick(async (ctx) => {
    await saveData(ctx.getFormData());
    ctx.notify?.("Saved!", "success");
    ctx.navigate?.("/employees");
  })
.endComponent();`;

const notifyCode = `// Show notifications
ctx.notify?.("Operation successful!", "success");
ctx.notify?.("Something went wrong.", "error");
ctx.notify?.("Please review the form.", "warning");
ctx.notify?.("FYI: Changes auto-saved.", "info");

// In practice
this.addComponent(LuminoButton)
  .children("Delete")
  .onClick((ctx) => {
    if (confirm("Are you sure?")) {
      ctx.list("items").remove(currentIndex);
      ctx.notify?.("Item deleted.", "success");
    }
  })
.endComponent();`;

const contextInCallbacksCode = `// Available in many builder methods:

// Field visibility
.hideByCondition((ctx) => ctx.getValue("hideField"))

// Dynamic props
.props((ctx) => ({
  disabled: ctx.mode === "view",
  options: ctx.getValue("type") === "premium" ? premiumOptions : basicOptions,
}))

// Dynamic label
.label((ctx) => ctx.mode === "edit" ? "Update Email" : "Email")

// onClick handlers
.onClick(async (ctx) => {
  const isValid = await ctx.validate?.();
  // ...
})

// Lifecycle hooks
this.onLoad((ctx) => {
  // Called when form mounts
});

this.onChange((ctx, field, value) => {
  // Called when any field changes
});`;

export function FormContextPage() {
  return (
    <>
      <h1 className="docs-page-title">FormContext</h1>
      <p className="docs-page-subtitle">
        The context object provides access to form state, values, and operations.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>FormContext&lt;T&gt;</code> is passed to most callbacks in the form builder.
          It provides everything you need to read and modify form state, trigger validation,
          show notifications, and navigate.
        </p>
        <CodeBlock code={contextInterfaceCode} language="typescript" />
      </div>

      {/* Where Context is Available */}
      <div className="docs-section">
        <h2 className="docs-section-title">Where Context is Available</h2>
        <p>
          The context object is available in many places throughout the form builder:
        </p>
        <CodeBlock code={contextInCallbacksCode} language="typescript" />
      </div>

      {/* getValue */}
      <div className="docs-section">
        <h2 className="docs-section-title">getValue()</h2>
        <p>
          Read the current value of any field:
        </p>
        <CodeBlock code={getValueCode} language="typescript" />
      </div>

      {/* setValue */}
      <div className="docs-section">
        <h2 className="docs-section-title">setValue()</h2>
        <p>
          Update the value of any field programmatically:
        </p>
        <CodeBlock code={setValueCode} language="typescript" />
      </div>

      {/* getFormData */}
      <div className="docs-section">
        <h2 className="docs-section-title">getFormData()</h2>
        <p>
          Get all current form values as a single object:
        </p>
        <CodeBlock code={getFormDataCode} language="typescript" />
      </div>

      {/* Validation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Validation Methods</h2>
        <p>
          Trigger validation and inspect errors:
        </p>
        <CodeBlock code={validationCode} language="typescript" />
      </div>

      {/* Mode */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Mode</h2>
        <p>
          Check and change the current form mode (new/edit/view):
        </p>
        <CodeBlock code={modeCode} language="typescript" />
      </div>

      {/* List Operations */}
      <div className="docs-section">
        <h2 className="docs-section-title">List Operations</h2>
        <p>
          Manage array fields (like addresses or line items):
        </p>
        <CodeBlock code={listOperationsCode} language="typescript" />
      </div>

      {/* Dialogs */}
      <div className="docs-section">
        <h2 className="docs-section-title">Dialog Operations</h2>
        <p>
          Open and close modal dialogs:
        </p>
        <CodeBlock code={dialogCode} language="typescript" />
      </div>

      {/* Navigation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigation</h2>
        <p>
          Navigate to different routes:
        </p>
        <CodeBlock code={navigationCode} language="typescript" />
      </div>

      {/* Notifications */}
      <div className="docs-section">
        <h2 className="docs-section-title">Notifications</h2>
        <p>
          Show toast/snackbar messages to users:
        </p>
        <CodeBlock code={notifyCode} language="typescript" />
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>FormRenderer</strong> - Rendering forms in React</li>
          <li><strong>Lifecycle Hooks</strong> - onLoad, onSubmit, onChange</li>
          <li><strong>Validation</strong> - Adding validation rules</li>
        </ul>
      </div>
    </>
  );
}
