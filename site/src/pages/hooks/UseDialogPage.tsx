/**
 * Dialog Hooks Page - Dialog and confirmation patterns
 */

import { CodeBlock } from "../../components/CodeBlock";

const confirmCode = `import { useLumino } from "lumino/react";

function UserList() {
  const { confirm, success, error } = useLumino();

  const handleDelete = async (userId: number) => {
    // Show confirmation dialog
    const confirmed = await confirm("Delete this user?");

    if (confirmed) {
      try {
        await deleteUser(userId);
        success("User deleted");
      } catch (err) {
        error("Failed to delete user");
      }
    }
  };

  return (
    <button onClick={() => handleDelete(123)}>
      Delete User
    </button>
  );
}`;

const alertCode = `import { useLumino } from "lumino/react";

function MyComponent() {
  const { alert } = useLumino();

  const handleError = async () => {
    await alert("An error occurred! Please try again.");
    // Dialog dismissed, continue...
  };

  const handleInfo = async () => {
    await alert("Your changes have been saved.");
    navigate("/dashboard");
  };

  return (
    <div>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}`;

const customMessageCode = `const { confirm } = useLumino();

// Simple message
await confirm("Are you sure?");

// Detailed message
await confirm(
  "This action cannot be undone. All data will be permanently deleted. Continue?"
);

// Multi-line message
await confirm(\`
  You are about to delete 5 users:
  - John Doe
  - Jane Smith
  - Bob Johnson

  This cannot be undone. Continue?
\`);`;

const destructiveCode = `const { confirm, error } = useLumino();

const handleDeleteAccount = async () => {
  const confirmed = await confirm(
    "Delete your account? This action is permanent and cannot be undone."
  );

  if (confirmed) {
    const doubleConfirm = await confirm(
      "Are you absolutely sure? All your data will be lost forever."
    );

    if (doubleConfirm) {
      try {
        await deleteAccount();
      } catch (err) {
        error("Failed to delete account");
      }
    }
  }
};`;

const formIntegrationCode = `import { useLumino, useForm } from "lumino/react";

function EmployeeForm() {
  const { confirm, alert } = useLumino();
  const form = useForm(new EmployeeForm());

  const handleCancel = async () => {
    if (form.dirty) {
      const discard = await confirm(
        "You have unsaved changes. Discard them?"
      );

      if (discard) {
        navigate("/employees");
      }
    } else {
      navigate("/employees");
    }
  };

  const handleSave = async () => {
    if (await form.validate()) {
      try {
        await saveEmployee(form.values);
        await alert("Employee saved successfully!");
        navigate("/employees");
      } catch (error) {
        await alert("Failed to save employee. Please try again.");
      }
    }
  };

  return (
    <div>
      <FormRenderer form={form} />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}`;

const conditionalCode = `const { confirm } = useLumino();

const handlePublish = async (article: Article) => {
  // Different messages based on state
  let message;

  if (article.published) {
    message = "Unpublish this article? It will no longer be visible to users.";
  } else if (article.draft) {
    message = "Publish draft? This will make it visible to all users.";
  } else {
    message = "Publish article?";
  }

  const confirmed = await confirm(message);

  if (confirmed) {
    await togglePublishState(article);
  }
};`;

const errorHandlingCode = `const { alert } = useLumino();

const handleOperation = async () => {
  try {
    await riskyOperation();
  } catch (error) {
    await alert(\`Operation failed: \${error.message}\`);
  }
};`;

const navigationCode = `const { confirm } = useLumino();

// Before navigation
const handleNavigateAway = async () => {
  if (hasUnsavedChanges) {
    const leave = await confirm("Leave without saving?");
    if (leave) {
      navigate("/dashboard");
    }
  } else {
    navigate("/dashboard");
  }
};`;

const multiStepCode = `const { confirm, alert } = useLumino();

const handleCheckout = async () => {
  // Step 1: Confirm order
  const proceedWithOrder = await confirm(
    "Proceed with order? Total: $99.99"
  );

  if (!proceedWithOrder) return;

  // Step 2: Process payment
  try {
    await processPayment();
  } catch (error) {
    await alert("Payment failed. Please try again.");
    return;
  }

  // Step 3: Confirm shipping
  const confirmShipping = await confirm(
    "Send to default address: 123 Main St?"
  );

  if (confirmShipping) {
    await placeOrder();
    await alert("Order placed successfully!");
    navigate("/orders");
  }
};`;

const batchOperationsCode = `const { confirm, success } = useLumino();

const handleBulkDelete = async (selectedIds: number[]) => {
  const confirmed = await confirm(
    \`Delete \${selectedIds.length} selected items? This cannot be undone.\`
  );

  if (confirmed) {
    await bulkDelete(selectedIds);
    success(\`Deleted \${selectedIds.length} items\`);
    refreshList();
  }
};`;

const workflowCode = `const { confirm, alert } = useLumino();

const handleApprovalWorkflow = async (request: Request) => {
  // Confirm approval
  const approve = await confirm(
    \`Approve request from \${request.user}?\`
  );

  if (!approve) {
    // Confirm rejection
    const reject = await confirm(
      "Reject this request? The user will be notified."
    );

    if (reject) {
      await rejectRequest(request.id);
      await alert("Request rejected");
    }
  } else {
    await approveRequest(request.id);
    await alert("Request approved");
  }
};`;

const implementationNoteCode = `// Implementation Note:
//
// The confirm() and alert() methods are provided by the UI adapter.
// Default implementation uses browser confirm() and alert().
//
// For custom dialogs, implement in your UI adapter:
//
// class MyUIAdapter implements UIAdapter {
//   async confirm(message: string): Promise<boolean> {
//     // Show custom modal dialog
//     return showCustomConfirmDialog(message);
//   }
//
//   async alert(message: string): Promise<void> {
//     // Show custom alert dialog
//     await showCustomAlertDialog(message);
//   }
// }`;

export function UseDialogPage() {
  return (
    <>
      <h1 className="docs-page-title">Dialog Hooks</h1>
      <p className="docs-page-subtitle">
        Confirmation dialogs and alerts via useLumino.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Lumino provides <code>confirm()</code> and <code>alert()</code> methods
          through <code>useLumino()</code> for showing dialogs. These are async
          methods that return promises, making them easy to use in async workflows.
        </p>
        <p>
          The actual dialog implementation is provided by your UI adapter, allowing
          you to use custom dialog components instead of browser defaults.
        </p>
      </div>

      {/* confirm() */}
      <div className="docs-section">
        <h2 className="docs-section-title">confirm() - Confirmation Dialogs</h2>
        <p>
          Show a confirmation dialog and wait for user response:
        </p>
        <CodeBlock code={confirmCode} language="typescript" />
        <p>
          <code>confirm()</code> returns a Promise that resolves to <code>true</code> if
          the user confirms, or <code>false</code> if they cancel.
        </p>
      </div>

      {/* alert() */}
      <div className="docs-section">
        <h2 className="docs-section-title">alert() - Alert Dialogs</h2>
        <p>
          Show an informational alert:
        </p>
        <CodeBlock code={alertCode} language="typescript" />
        <p>
          <code>alert()</code> returns a Promise that resolves when the user
          dismisses the dialog.
        </p>
      </div>

      {/* Custom Messages */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Messages</h2>
        <CodeBlock code={customMessageCode} language="typescript" />
      </div>

      {/* Destructive Actions */}
      <div className="docs-section">
        <h2 className="docs-section-title">Destructive Actions</h2>
        <p>
          Use double confirmation for destructive operations:
        </p>
        <CodeBlock code={destructiveCode} language="typescript" />
      </div>

      {/* Form Integration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Integration</h2>
        <p>
          Common pattern: confirm before discarding changes, alert on save:
        </p>
        <CodeBlock code={formIntegrationCode} language="typescript" />
      </div>

      {/* Conditional Messages */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Messages</h2>
        <p>
          Show different messages based on state:
        </p>
        <CodeBlock code={conditionalCode} language="typescript" />
      </div>

      {/* Error Handling */}
      <div className="docs-section">
        <h2 className="docs-section-title">Error Handling</h2>
        <CodeBlock code={errorHandlingCode} language="typescript" />
      </div>

      {/* Navigation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigation Guards</h2>
        <CodeBlock code={navigationCode} language="typescript" />
      </div>

      {/* Multi-Step */}
      <div className="docs-section">
        <h2 className="docs-section-title">Multi-Step Workflows</h2>
        <CodeBlock code={multiStepCode} language="typescript" />
      </div>

      {/* Batch Operations */}
      <div className="docs-section">
        <h2 className="docs-section-title">Batch Operations</h2>
        <CodeBlock code={batchOperationsCode} language="typescript" />
      </div>

      {/* Approval Workflows */}
      <div className="docs-section">
        <h2 className="docs-section-title">Approval Workflows</h2>
        <CodeBlock code={workflowCode} language="typescript" />
      </div>

      {/* Signatures */}
      <div className="docs-section">
        <h2 className="docs-section-title">Method Signatures</h2>
        <CodeBlock
          code={`// Confirmation dialog
confirm(message: string): Promise<boolean>

// Alert dialog
alert(message: string): Promise<void>

// Usage
const { confirm, alert } = useLumino();`}
          language="typescript"
        />
      </div>

      {/* Implementation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Implementation</h2>
        <p>
          The dialogs are implemented by your UI adapter:
        </p>
        <CodeBlock code={implementationNoteCode} language="typescript" />
      </div>

      {/* Use Cases */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Use Cases</h2>
        <ul>
          <li><strong>Delete confirmation</strong> - Confirm before deleting data</li>
          <li><strong>Unsaved changes</strong> - Warn before navigation with dirty forms</li>
          <li><strong>Success messages</strong> - Inform user of successful operations</li>
          <li><strong>Error messages</strong> - Display error details</li>
          <li><strong>Destructive actions</strong> - Double-confirm dangerous operations</li>
          <li><strong>Batch operations</strong> - Confirm bulk actions</li>
          <li><strong>Workflow steps</strong> - Confirm each step in a process</li>
          <li><strong>Approval flows</strong> - Approve/reject requests</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Clear messages</strong> - Be specific about what will happen</li>
          <li><strong>Use confirm for actions</strong> - Any action that modifies data</li>
          <li><strong>Use alert for info</strong> - Success messages, errors, warnings</li>
          <li><strong>Double-confirm destructive ops</strong> - Delete account, bulk delete, etc.</li>
          <li><strong>Check return value</strong> - Always check confirm() result</li>
          <li><strong>Await the promise</strong> - Use async/await for cleaner code</li>
          <li><strong>Provide context</strong> - Include relevant details in message</li>
          <li><strong>Don't overuse</strong> - Too many confirmations frustrate users</li>
        </ul>
      </div>

      {/* vs Notifications */}
      <div className="docs-section">
        <h2 className="docs-section-title">Dialogs vs Notifications</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Use Dialogs When</th>
              <th>Use Notifications When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Need user decision</td>
              <td>Just informing user</td>
            </tr>
            <tr>
              <td>Block until response</td>
              <td>Non-blocking message</td>
            </tr>
            <tr>
              <td>Critical action</td>
              <td>Status update</td>
            </tr>
            <tr>
              <td>Destructive operation</td>
              <td>Success/error feedback</td>
            </tr>
            <tr>
              <td>Must acknowledge</td>
              <td>Can auto-dismiss</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
