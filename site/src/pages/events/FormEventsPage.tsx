/**
 * Form Events Documentation
 */

import React from "react";

export function FormEventsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Form Events</h1>
      <p className="docs-page-subtitle">
        Events emitted during form lifecycle, field changes, validation, and submission.
      </p>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          Form events are emitted automatically by Lumino during various form operations.
          You can subscribe to these events to implement custom behavior, logging,
          analytics, or cross-form communication.
        </p>
        <pre className="docs-code">{`import { eventEmitter, eventBus } from "lumino/core";

// Method 1: Direct event subscription
eventEmitter.on("form:submit", (payload) => {
  console.log("Form submitted:", payload);
});

// Method 2: Using EventBus (recommended)
eventBus.form.onSubmit((payload) => {
  console.log("Form submitted:", payload);
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Form Lifecycle Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>form:init</code></td>
              <td><code>{"{ formId: string }"}</code></td>
              <td>Form instance is created</td>
            </tr>
            <tr>
              <td><code>form:load</code></td>
              <td><code>{"{ formId: string; values: Record<string, any> }"}</code></td>
              <td>Form values are loaded (initial or from API)</td>
            </tr>
            <tr>
              <td><code>form:ready</code></td>
              <td><code>{"{ formId: string; values: Record<string, any> }"}</code></td>
              <td>Form is fully initialized and ready for interaction</td>
            </tr>
            <tr>
              <td><code>form:reset</code></td>
              <td><code>{"{ formId: string }"}</code></td>
              <td>Form is reset to initial values</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Form Lifecycle Tracking</h3>
        <pre className="docs-code">{`// Track form initialization
eventBus.form.onInit((payload) => {
  console.log(\`Form initialized: \${payload.formId}\`);
});

// Track when form data is loaded
eventBus.form.onLoad((payload) => {
  console.log(\`Form loaded with values:\`, payload.values);
});

// Track when form is ready for user interaction
eventBus.form.onReady((payload) => {
  console.log(\`Form ready: \${payload.formId}\`);
  analytics.track("form_ready", { formId: payload.formId });
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Field Change Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>form:change</code></td>
              <td><code>{"{ formId: string; field: string; value: any; previousValue: any }"}</code></td>
              <td>Any field value changes</td>
            </tr>
            <tr>
              <td><code>form:dirty</code></td>
              <td><code>{"{ formId: string; dirty: boolean }"}</code></td>
              <td>Form dirty state changes</td>
            </tr>
            <tr>
              <td><code>form:field:focus</code></td>
              <td><code>{"{ formId: string; field: string }"}</code></td>
              <td>Field gains focus</td>
            </tr>
            <tr>
              <td><code>form:field:blur</code></td>
              <td><code>{"{ formId: string; field: string }"}</code></td>
              <td>Field loses focus</td>
            </tr>
            <tr>
              <td><code>form:field:error</code></td>
              <td><code>{"{ formId: string; field: string; errors: string[] }"}</code></td>
              <td>Field validation errors change</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Field Change Handling</h3>
        <pre className="docs-code">{`// Track all field changes
eventBus.form.onChange((payload) => {
  console.log(\`Field \${payload.field} changed:\`, {
    old: payload.previousValue,
    new: payload.value
  });

  // Autosave on change
  if (payload.formId === "draft-form") {
    autosave(payload.formId, payload.field, payload.value);
  }
});

// Warn user about unsaved changes
eventBus.form.onDirty((payload) => {
  if (payload.dirty) {
    window.onbeforeunload = () => "You have unsaved changes!";
  } else {
    window.onbeforeunload = null;
  }
});

// Track field interactions
eventBus.form.onChange((payload) => {
  analytics.track("field_changed", {
    formId: payload.formId,
    field: payload.field
  });
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Validation Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>form:validate</code></td>
              <td><code>{"{ formId: string; valid: boolean; errors: Record<string, string[]> }"}</code></td>
              <td>Form validation runs (manual or on submit)</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Validation Tracking</h3>
        <pre className="docs-code">{`// Track validation results
eventBus.form.onValidate((payload) => {
  if (!payload.valid) {
    console.log("Validation errors:", payload.errors);

    // Show summary of errors
    const errorCount = Object.keys(payload.errors).length;
    toast.error(\`Please fix \${errorCount} validation error(s)\`);
  }
});

// Send validation metrics
eventBus.form.onValidate((payload) => {
  analytics.track("form_validated", {
    formId: payload.formId,
    valid: payload.valid,
    errorCount: Object.keys(payload.errors).length
  });
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Submission Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>form:submit</code></td>
              <td><code>{"{ formId: string; action: string; values: Record<string, any> }"}</code></td>
              <td>Form submission starts (after validation passes)</td>
            </tr>
            <tr>
              <td><code>form:submit:success</code></td>
              <td><code>{"{ formId: string; action: string; response: any }"}</code></td>
              <td>Form submission succeeds</td>
            </tr>
            <tr>
              <td><code>form:submit:error</code></td>
              <td><code>{"{ formId: string; action: string; error: any }"}</code></td>
              <td>Form submission fails</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Submission Handling</h3>
        <pre className="docs-code">{`// Track submission start
eventBus.form.onSubmit((payload) => {
  console.log(\`Submitting \${payload.action}:\`, payload.values);

  // Show loading indicator
  eventBus.ui.emitLoaderShow();
});

// Handle success
eventBus.form.onSubmitSuccess((payload) => {
  console.log("Submission successful:", payload.response);

  // Hide loader
  eventBus.ui.emitLoaderHide();

  // Show success message
  eventBus.ui.emitNotify({
    message: "Saved successfully!",
    type: "success"
  });

  // Track analytics
  analytics.track("form_submitted", {
    formId: payload.formId,
    action: payload.action
  });
});

// Handle errors
eventBus.form.onSubmitError((payload) => {
  console.error("Submission failed:", payload.error);

  // Hide loader
  eventBus.ui.emitLoaderHide();

  // Show error message
  eventBus.ui.emitNotify({
    message: "Failed to save. Please try again.",
    type: "error"
  });

  // Track error
  analytics.track("form_error", {
    formId: payload.formId,
    action: payload.action,
    error: payload.error.message
  });
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>

        <h3>1. Auto-Save on Change</h3>
        <pre className="docs-code">{`import { debounce } from "lodash";

const saveForm = debounce(async (formId: string, values: any) => {
  await api.post(\`/forms/\${formId}/autosave\`, values);
  console.log("Auto-saved");
}, 2000);

eventBus.form.onChange((payload) => {
  if (payload.formId === "draft-form") {
    // Get all form values and save
    saveForm(payload.formId, getAllFormValues(payload.formId));
  }
});`}</pre>

        <h3>2. Cross-Form Communication</h3>
        <pre className="docs-code">{`// When customer form is submitted, refresh order form dropdown
eventBus.form.onSubmitSuccess((payload) => {
  if (payload.formId === "customer-form") {
    // Reload customer options in order form
    eventBus.form.emitLoad({
      formId: "order-form",
      values: {}
    });
  }
});`}</pre>

        <h3>3. Conditional Validation</h3>
        <pre className="docs-code">{`// Show validation summary only on certain forms
eventBus.form.onValidate((payload) => {
  if (payload.formId === "complex-form" && !payload.valid) {
    showValidationSummaryDialog(payload.errors);
  }
});`}</pre>

        <h3>4. Field-Level Analytics</h3>
        <pre className="docs-code">{`const fieldInteractions = new Map<string, number>();

eventBus.form.onChange((payload) => {
  const key = \`\${payload.formId}.\${payload.field}\`;
  const count = (fieldInteractions.get(key) || 0) + 1;
  fieldInteractions.set(key, count);

  // Track if user changed field more than 3 times (struggling?)
  if (count === 3) {
    analytics.track("field_struggle", {
      formId: payload.formId,
      field: payload.field
    });
  }
});`}</pre>

        <h3>5. Unsaved Changes Warning</h3>
        <pre className="docs-code">{`let hasUnsavedChanges = false;

eventBus.form.onDirty((payload) => {
  hasUnsavedChanges = payload.dirty;
});

// Warn before navigation
eventBus.navigation.onStart((payload) => {
  if (hasUnsavedChanges) {
    const confirmed = confirm("You have unsaved changes. Continue?");
    if (!confirmed) {
      eventBus.navigation.emitBlocked({
        from: payload.from,
        to: payload.to,
        reason: "unsaved_changes"
      });
    }
  }
});

// Clear flag after successful save
eventBus.form.onSubmitSuccess(() => {
  hasUnsavedChanges = false;
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Use EventBus for cleaner code</strong> - <code>eventBus.form.onSubmit()</code> is more readable</li>
          <li><strong>Debounce expensive operations</strong> - Don't make API calls on every keystroke</li>
          <li><strong>Check formId</strong> - Filter events to only handle specific forms</li>
          <li><strong>Cleanup subscriptions</strong> - Always unsubscribe in React cleanup</li>
          <li><strong>Track errors</strong> - Log validation and submission errors for debugging</li>
          <li><strong>Avoid circular events</strong> - Don't emit form:change inside a form:change handler</li>
          <li><strong>Use priorities</strong> - Set higher priorities for logging and critical operations</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>React Hook Integration</h2>
        <pre className="docs-code">{`import { useEffect } from "react";
import { eventBus } from "lumino/core";

function MyComponent() {
  useEffect(() => {
    // Subscribe to form events
    const unsubscribe1 = eventBus.form.onSubmit((payload) => {
      console.log("Form submitted:", payload);
    });

    const unsubscribe2 = eventBus.form.onSubmitSuccess((payload) => {
      showSuccessToast();
    });

    // Cleanup on unmount
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return <div>My Component</div>;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>TypeScript Type Definitions</h2>
        <pre className="docs-code">{`export interface FormEvents {
  "form:init": { formId: string };
  "form:load": { formId: string; values: Record<string, any> };
  "form:ready": { formId: string; values: Record<string, any> };
  "form:change": {
    formId: string;
    field: string;
    value: any;
    previousValue: any
  };
  "form:submit": {
    formId: string;
    action: string;
    values: Record<string, any>
  };
  "form:submit:success": {
    formId: string;
    action: string;
    response: any
  };
  "form:submit:error": {
    formId: string;
    action: string;
    error: any
  };
  "form:validate": {
    formId: string;
    valid: boolean;
    errors: Record<string, string[]>
  };
  "form:reset": { formId: string };
  "form:dirty": { formId: string; dirty: boolean };
  "form:field:focus": { formId: string; field: string };
  "form:field:blur": { formId: string; field: string };
  "form:field:error": {
    formId: string;
    field: string;
    errors: string[]
  };
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li><strong>Page Events</strong> - Learn about page lifecycle events</li>
          <li><strong>API Events</strong> - Learn about API request events</li>
          <li><strong>Custom Events</strong> - Create your own domain-specific events</li>
          <li><strong>EventEmitter</strong> - Deep dive into the EventEmitter class</li>
        </ul>
      </div>
    </div>
  );
}
