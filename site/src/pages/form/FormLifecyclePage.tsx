/**
 * Form Lifecycle Page - Lifecycle hooks and events
 */

import { CodeBlock } from "../../components/CodeBlock";

const lifecycleOverviewCode = `class MyForm extends Form<MyEntity> {
  configure() {
    // Define form structure
    this.addSection("Details")
      // ... fields
    .endSection();

    // Lifecycle hooks
    this.onLoad(this.handleLoad);
    this.onSubmit(this.handleSubmit);
    this.onValidate(this.handleValidate);
    this.onChange(this.handleChange);
  }

  private handleLoad = async (ctx: FormContext<MyEntity>) => {
    // Called when form mounts
  };

  private handleSubmit = async (ctx: FormContext<MyEntity>) => {
    // Called on form submission
  };

  private handleValidate = async (ctx: FormContext<MyEntity>): Promise<boolean> => {
    // Custom validation logic
    return true;
  };

  private handleChange = (ctx: FormContext<MyEntity>, field: string, value: any) => {
    // Called when any field changes
  };
}`;

const onLoadCode = `// onLoad - Called when the form component mounts
this.onLoad(async (ctx) => {
  // Fetch initial data
  const data = await api.getData();
  ctx.setEntity(data);

  // Set default values
  ctx.setValue("createdAt", new Date().toISOString());
  ctx.setValue("status", "draft");

  // Load lookup data
  const departments = await api.getDepartments();
  // Store in form state or context
});

// Multiple onLoad handlers (called in order)
this.onLoad((ctx) => {
  console.log("First onLoad");
});

this.onLoad((ctx) => {
  console.log("Second onLoad");
});`;

const onSubmitCode = `// onSubmit - Called when form is submitted
this.onSubmit(async (ctx) => {
  // Get all form values
  const data = ctx.getFormData();

  try {
    // Save to API
    const result = await api.saveEntity(data);

    // Show success notification
    ctx.notify?.("Saved successfully!", "success");

    // Navigate after save
    ctx.navigate?.(\`/entities/\${result.id}\`);

  } catch (error) {
    // Handle error
    ctx.notify?.("Failed to save. Please try again.", "error");
    throw error; // Re-throw to prevent form from clearing
  }
});

// Submission with confirmation
this.onSubmit(async (ctx) => {
  const confirmed = window.confirm("Are you sure you want to submit?");
  if (!confirmed) {
    return; // Don't proceed
  }

  await api.submit(ctx.getFormData());
  ctx.notify?.("Submitted!", "success");
});`;

const onValidateCode = `// onValidate - Custom validation after field validators
this.onValidate(async (ctx): Promise<boolean> => {
  // Cross-field validation
  const startDate = ctx.getValue("startDate");
  const endDate = ctx.getValue("endDate");

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    ctx.notify?.("End date must be after start date", "error");
    return false;
  }

  // Async validation (e.g., check uniqueness)
  const email = ctx.getValue("email");
  const isUnique = await api.checkEmailUnique(email);
  if (!isUnique) {
    ctx.notify?.("This email is already registered", "error");
    return false;
  }

  // All validations passed
  return true;
});

// Multiple validators (all must pass)
this.onValidate((ctx) => {
  // Business rule 1
  return ctx.getValue("amount") > 0;
});

this.onValidate((ctx) => {
  // Business rule 2
  return ctx.getValue("quantity") <= ctx.getValue("maxQuantity");
});`;

const onChangeCode = `// onChange - Called when any field value changes
this.onChange((ctx, field, value) => {
  console.log(\`Field \${field} changed to:\`, value);

  // Dependent field updates
  if (field === "country") {
    // Clear state when country changes
    ctx.setValue("state", "");

    // Load states for new country
    loadStatesForCountry(value);
  }

  // Computed values
  if (field === "quantity" || field === "unitPrice") {
    const qty = ctx.getValue("quantity") || 0;
    const price = ctx.getValue("unitPrice") || 0;
    ctx.setValue("total", qty * price);
  }

  // Track dirty state
  markFormDirty();
});

// Field-specific change handling
this.onChange((ctx, field, value) => {
  switch (field) {
    case "email":
      // Validate email format immediately
      if (!isValidEmail(value)) {
        ctx.setFieldError?.("email", "Invalid email format");
      }
      break;

    case "phone":
      // Format phone number
      ctx.setValue("phone", formatPhoneNumber(value));
      break;
  }
});`;

const lifecycleOrderCode = `// Lifecycle execution order:
//
// 1. Form constructor
// 2. configure() called
// 3. Component mounts
// 4. onLoad handlers (in order of registration)
// 5. User interacts...
//    - onChange handlers on each field change
// 6. User submits...
//    - Field validators run
//    - onValidate handlers run
//    - If all pass, onSubmit handlers run`;

const asyncLifecycleCode = `// All lifecycle hooks support async/await
this.onLoad(async (ctx) => {
  // Show loading state
  ctx.setLoading?.(true);

  try {
    // Parallel data fetching
    const [entity, departments, statuses] = await Promise.all([
      api.getEntity(ctx.routeParams.id),
      api.getDepartments(),
      api.getStatuses(),
    ]);

    ctx.setEntity(entity);
    // Store lookup data...

  } finally {
    ctx.setLoading?.(false);
  }
});

// Error handling
this.onSubmit(async (ctx) => {
  try {
    await api.save(ctx.getFormData());
    ctx.notify?.("Saved!", "success");
  } catch (error) {
    if (error.status === 409) {
      ctx.notify?.("Record was modified. Please refresh.", "warning");
    } else {
      ctx.notify?.("Save failed. Please try again.", "error");
    }
    throw error;
  }
});`;

const conditionalLifecycleCode = `// Conditional execution based on mode
this.onLoad((ctx) => {
  if (ctx.mode === "new") {
    // Set defaults for new records
    ctx.setValue("status", "draft");
    ctx.setValue("createdBy", currentUser.id);
  }

  if (ctx.mode === "edit") {
    // Load existing data
    const data = await api.getById(ctx.routeParams.id);
    ctx.setEntity(data);
  }

  if (ctx.mode === "view") {
    // Nothing special, just display
  }
});

// Different submit behavior by mode
this.onSubmit(async (ctx) => {
  const data = ctx.getFormData();

  if (ctx.mode === "new") {
    await api.create(data);
    ctx.notify?.("Created!", "success");
  } else {
    await api.update(data.id, data);
    ctx.notify?.("Updated!", "success");
  }
});`;

const formEventsCode = `// Form events (if using EventEmitter pattern)
class MyForm extends Form<MyEntity> {
  configure() {
    // ... form definition

    // Subscribe to events
    this.on("beforeSubmit", (data) => {
      console.log("About to submit:", data);
    });

    this.on("afterSubmit", (result) => {
      console.log("Submit complete:", result);
    });

    this.on("error", (error) => {
      console.error("Form error:", error);
    });

    this.on("fieldChange", ({ field, value, previousValue }) => {
      console.log(\`\${field}: \${previousValue} -> \${value}\`);
    });
  }
}

// External event subscription
const form = new MyForm();
form.on("submit", (data) => analytics.track("form_submitted", data));`;

export function FormLifecyclePage() {
  return (
    <>
      <h1 className="docs-page-title">Lifecycle Hooks</h1>
      <p className="docs-page-subtitle">
        Handle form events throughout the form lifecycle.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Lumino forms provide lifecycle hooks for handling events at different stages
          of the form's life: loading, changing, validating, and submitting.
        </p>
        <CodeBlock code={lifecycleOverviewCode} language="typescript" />
      </div>

      {/* Lifecycle Order */}
      <div className="docs-section">
        <h2 className="docs-section-title">Execution Order</h2>
        <CodeBlock code={lifecycleOrderCode} language="typescript" />
      </div>

      {/* onLoad */}
      <div className="docs-section">
        <h2 className="docs-section-title">onLoad</h2>
        <p>
          Called when the form component mounts. Use for initial data fetching,
          default values, and setup:
        </p>
        <CodeBlock code={onLoadCode} language="typescript" />
      </div>

      {/* onChange */}
      <div className="docs-section">
        <h2 className="docs-section-title">onChange</h2>
        <p>
          Called whenever any field value changes. Use for dependent field updates,
          computed values, and tracking:
        </p>
        <CodeBlock code={onChangeCode} language="typescript" />
      </div>

      {/* onValidate */}
      <div className="docs-section">
        <h2 className="docs-section-title">onValidate</h2>
        <p>
          Custom validation that runs after field validators. Use for cross-field
          validation and async checks:
        </p>
        <CodeBlock code={onValidateCode} language="typescript" />
      </div>

      {/* onSubmit */}
      <div className="docs-section">
        <h2 className="docs-section-title">onSubmit</h2>
        <p>
          Called when the form is submitted (after validation passes). Use for
          saving data and navigation:
        </p>
        <CodeBlock code={onSubmitCode} language="typescript" />
      </div>

      {/* Async Lifecycle */}
      <div className="docs-section">
        <h2 className="docs-section-title">Async Lifecycle Hooks</h2>
        <p>
          All lifecycle hooks support async/await for data fetching and API calls:
        </p>
        <CodeBlock code={asyncLifecycleCode} language="typescript" />
      </div>

      {/* Conditional Lifecycle */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Behavior</h2>
        <p>
          Execute different logic based on form mode or other conditions:
        </p>
        <CodeBlock code={conditionalLifecycleCode} language="typescript" />
      </div>

      {/* Form Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Events</h2>
        <p>
          Subscribe to form events for external integrations:
        </p>
        <CodeBlock code={formEventsCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>Keep onLoad fast</strong> - Show loading states for long operations
          </li>
          <li>
            <strong>Handle errors in onSubmit</strong> - Always wrap in try/catch and
            show user-friendly messages
          </li>
          <li>
            <strong>Use onChange sparingly</strong> - Avoid expensive operations on
            every keystroke
          </li>
          <li>
            <strong>Return boolean from onValidate</strong> - Return <code>true</code> to
            pass, <code>false</code> to fail validation
          </li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>FormContext</strong> - The context object in callbacks</li>
          <li><strong>Validation</strong> - Built-in and custom validators</li>
          <li><strong>Page Builder</strong> - Building full pages with lifecycle</li>
        </ul>
      </div>
    </>
  );
}
