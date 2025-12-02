/**
 * Dialog Container Page
 *
 * Documents the Dialog container using Lumino's Dialog class, useDialog hook,
 * and DialogRenderer pattern instead of plain useState.
 */

import React, { useMemo } from "react";
import { LiveDemo } from "../../components/LiveDemo";
import {
  DialogRenderer,
  useDialog,
  LuminoButton,
  LuminoStackLayout,
  LuminoFlowLayout,
  LuminoText,
  LuminoTextInput,
} from "lumino/react";
import { Dialog, createDialog, createConfirmDialog } from "lumino/core";

// =============================================================================
// DIALOG CLASS DEFINITIONS
// =============================================================================

/**
 * Basic dialog with title and content
 */
class BasicDialog extends Dialog {
  configure() {
    this.title("Dialog Title")
      .size("medium");

    this.content("This is the dialog content. You can add any content here.");

    this.action("close", "Close")
      .variant("secondary")
      .end();
  }
}

/**
 * Confirm dialog with footer actions
 */
class ConfirmDialog extends Dialog {
  configure() {
    this.title("Confirm Action")
      .size("medium");

    this.content("Are you sure you want to perform this action?");

    this.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    this.action("confirm", "Confirm")
      .variant("primary")
      .onClick((ctx) => {
        ctx.notify?.("Action confirmed!", "success");
      })
      .end();
  }
}

/**
 * Dialog with inline form fields
 */
class FormDialog extends Dialog {
  configure() {
    this.title("Create User")
      .size("medium");

    // Inline field definitions (inherited from Component)
    this.addRow()
      .addField("name")
        .component(LuminoTextInput)
        .label("Name")
        .placeholder("Enter name")
        .required()
      .endField()
    .endRow();

    this.addRow()
      .addField("email")
        .component(LuminoTextInput)
        .label("Email")
        .placeholder("Enter email")
        .required()
      .endField()
    .endRow();

    this.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    this.action("create", "Create")
      .variant("primary")
      .onClick(async (ctx) => {
        const valid = await ctx.validate?.();
        if (!valid) return false;
        const data = ctx.getFormData?.();
        ctx.notify?.(`Created user: ${data?.name}`, "success");
        return true;
      })
      .end();
  }
}

/**
 * Dialog with loading state on action
 */
class LoadingDialog extends Dialog {
  configure() {
    this.title("Submit Data")
      .size("medium");

    this.content("Click submit to see the loading state on the action button.");

    this.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    this.action("submit", "Submit")
      .variant("primary")
      .onClick(async (ctx) => {
        // Simulate async operation - loading state is automatic
        await new Promise(resolve => setTimeout(resolve, 2000));
        ctx.notify?.("Data submitted!", "success");
      })
      .end();
  }
}

/**
 * Delete confirmation dialog
 */
class DeleteDialog extends Dialog {
  configure() {
    this.title("Confirm Delete")
      .size("small")
      .closeOnBackdrop(false);

    this.content((ctx) =>
      `Are you sure you want to delete "${ctx.dialogData?.itemName || "this item"}"? This action cannot be undone.`
    );

    this.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    this.action("delete", "Delete")
      .variant("danger")
      .onClick(async (ctx) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        ctx.notify?.("Item deleted!", "success");
      })
      .end();
  }
}

/**
 * Dialog without close button
 */
class NoCloseButtonDialog extends Dialog {
  configure() {
    this.title("No Close Button")
      .size("medium")
      .showCloseButton(false);

    this.content("This dialog has no close button in the header. Use the Done button to close.");

    this.action("done", "Done")
      .variant("primary")
      .end();
  }
}

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BasicDialogDemo() {
  const dialog = useDialog();
  const config = useMemo(() => new BasicDialog("basic-dialog").build(), []);

  return (
    <LuminoStackLayout gap={2}>
      <LuminoButton onClick={dialog.open}>Open Dialog</LuminoButton>
      <DialogRenderer
        config={config}
        context={{} as any}
        {...dialog.dialogProps}
      />
    </LuminoStackLayout>
  );
}

function ConfirmDialogDemo() {
  const dialog = useDialog();
  const config = useMemo(() => new ConfirmDialog("confirm-dialog").build(), []);

  return (
    <LuminoStackLayout gap={2}>
      <LuminoButton onClick={dialog.open}>Open Confirm Dialog</LuminoButton>
      <DialogRenderer
        config={config}
        context={{} as any}
        {...dialog.dialogProps}
      />
    </LuminoStackLayout>
  );
}

function SizesDialogDemo() {
  const smallDialog = useDialog();
  const mediumDialog = useDialog();
  const largeDialog = useDialog();

  const smallConfig = useMemo(() => createDialog("small-dialog", (d) => {
    d.title("Small Dialog").size("small");
    d.content("This is a small sized dialog.");
    d.action("close", "Close").variant("secondary").end();
  }), []);

  const mediumConfig = useMemo(() => createDialog("medium-dialog", (d) => {
    d.title("Medium Dialog").size("medium");
    d.content("This is a medium sized dialog.");
    d.action("close", "Close").variant("secondary").end();
  }), []);

  const largeConfig = useMemo(() => createDialog("large-dialog", (d) => {
    d.title("Large Dialog").size("large");
    d.content("This is a large sized dialog.");
    d.action("close", "Close").variant("secondary").end();
  }), []);

  return (
    <LuminoStackLayout gap={2}>
      <LuminoFlowLayout gap={1}>
        <LuminoButton onClick={smallDialog.open}>Small</LuminoButton>
        <LuminoButton onClick={mediumDialog.open}>Medium</LuminoButton>
        <LuminoButton onClick={largeDialog.open}>Large</LuminoButton>
      </LuminoFlowLayout>
      <DialogRenderer config={smallConfig} context={{} as any} {...smallDialog.dialogProps} />
      <DialogRenderer config={mediumConfig} context={{} as any} {...mediumDialog.dialogProps} />
      <DialogRenderer config={largeConfig} context={{} as any} {...largeDialog.dialogProps} />
    </LuminoStackLayout>
  );
}

function FormDialogDemo() {
  const dialog = useDialog();
  const config = useMemo(() => new FormDialog("form-dialog").build(), []);

  return (
    <LuminoStackLayout gap={2}>
      <LuminoButton onClick={dialog.open}>Open Form Dialog</LuminoButton>
      <DialogRenderer
        config={config}
        context={{} as any}
        {...dialog.dialogProps}
      />
    </LuminoStackLayout>
  );
}

function LoadingDialogDemo() {
  const dialog = useDialog();
  const config = useMemo(() => new LoadingDialog("loading-dialog").build(), []);

  return (
    <LuminoStackLayout gap={2}>
      <LuminoButton onClick={dialog.open}>Open Loading Dialog</LuminoButton>
      <DialogRenderer
        config={config}
        context={{} as any}
        {...dialog.dialogProps}
      />
    </LuminoStackLayout>
  );
}

function NoCloseButtonDemo() {
  const dialog = useDialog();
  const config = useMemo(() => new NoCloseButtonDialog("no-close-dialog").build(), []);

  return (
    <LuminoStackLayout gap={2}>
      <LuminoButton onClick={dialog.open}>Open Dialog (No Close Button)</LuminoButton>
      <DialogRenderer
        config={config}
        context={{} as any}
        {...dialog.dialogProps}
      />
    </LuminoStackLayout>
  );
}

function DeleteConfirmDemo() {
  const dialog = useDialog();
  const config = useMemo(() => new DeleteDialog("delete-dialog").build(), []);

  return (
    <LuminoStackLayout gap={2}>
      <LuminoButton variant="secondary" onClick={dialog.open}>
        Delete Item
      </LuminoButton>
      <DialogRenderer
        config={config}
        context={{ dialogData: { itemName: "Project Alpha" } } as any}
        {...dialog.dialogProps}
      />
    </LuminoStackLayout>
  );
}

function CreateConfirmDialogDemo() {
  const dialog = useDialog();

  const config = useMemo(() => createConfirmDialog({
    id: "quick-confirm",
    title: "Quick Confirm",
    message: "Do you want to proceed with this operation?",
    confirmLabel: "Yes, Proceed",
    cancelLabel: "No, Cancel",
    confirmVariant: "primary",
    onConfirm: (ctx) => {
      ctx.notify?.("Operation completed!", "success");
    },
  }), []);

  return (
    <LuminoStackLayout gap={2}>
      <LuminoButton onClick={dialog.open}>Quick Confirm</LuminoButton>
      <DialogRenderer
        config={config}
        context={{} as any}
        {...dialog.dialogProps}
      />
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCode = `import { Dialog, DialogRenderer, useDialog } from "lumino/react";
import { useMemo } from "react";

class BasicDialog extends Dialog {
  configure() {
    this.title("Dialog Title")
      .size("medium");

    this.content("This is the dialog content.");

    this.action("close", "Close")
      .variant("secondary")
      .end();
  }
}

function BasicDialogDemo() {
  const dialog = useDialog();
  const config = useMemo(() => new BasicDialog("basic-dialog").build(), []);

  return (
    <>
      <LuminoButton onClick={dialog.open}>Open Dialog</LuminoButton>
      <DialogRenderer
        config={config}
        context={{} as any}
        {...dialog.dialogProps}
      />
    </>
  );
}`;

const confirmCode = `import { Dialog, DialogRenderer, useDialog } from "lumino/react";
import { useMemo } from "react";

class ConfirmDialog extends Dialog {
  configure() {
    this.title("Confirm Action")
      .size("medium");

    this.content("Are you sure you want to perform this action?");

    this.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    this.action("confirm", "Confirm")
      .variant("primary")
      .onClick((ctx) => {
        ctx.notify?.("Action confirmed!", "success");
      })
      .end();
  }
}

function ConfirmDialogDemo() {
  const dialog = useDialog();
  const config = useMemo(() => new ConfirmDialog("confirm-dialog").build(), []);

  return (
    <>
      <LuminoButton onClick={dialog.open}>Open Confirm Dialog</LuminoButton>
      <DialogRenderer
        config={config}
        context={{} as any}
        {...dialog.dialogProps}
      />
    </>
  );
}`;

const sizesCode = `import { createDialog, DialogRenderer, useDialog } from "lumino/react";
import { useMemo } from "react";

function SizesDialogDemo() {
  const smallDialog = useDialog();
  const mediumDialog = useDialog();
  const largeDialog = useDialog();

  const smallConfig = useMemo(() => createDialog("small-dialog", (d) => {
    d.title("Small Dialog").size("small");
    d.content("This is a small sized dialog.");
    d.action("close", "Close").variant("secondary").end();
  }), []);

  // Similar for medium and large...

  return (
    <>
      <LuminoButton onClick={smallDialog.open}>Small</LuminoButton>
      <LuminoButton onClick={mediumDialog.open}>Medium</LuminoButton>
      <LuminoButton onClick={largeDialog.open}>Large</LuminoButton>
      <DialogRenderer config={smallConfig} context={{} as any} {...smallDialog.dialogProps} />
      {/* etc. */}
    </>
  );
}`;

const formCode = `import { Dialog, DialogRenderer, useDialog, LuminoTextInput } from "lumino/react";
import { useMemo } from "react";

class FormDialog extends Dialog {
  configure() {
    this.title("Create User")
      .size("medium");

    // Inline field definitions (inherited from Component)
    this.addRow()
      .addField("name")
        .component(LuminoTextInput)
        .label("Name")
        .placeholder("Enter name")
        .required()
      .endField()
    .endRow();

    this.addRow()
      .addField("email")
        .component(LuminoTextInput)
        .label("Email")
        .placeholder("Enter email")
        .required()
      .endField()
    .endRow();

    this.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    this.action("create", "Create")
      .variant("primary")
      .onClick(async (ctx) => {
        const valid = await ctx.validate?.();
        if (!valid) return false; // Keep dialog open
        const data = ctx.getFormData?.();
        ctx.notify?.(\`Created user: \${data?.name}\`, "success");
        return true; // Close dialog
      })
      .end();
  }
}`;

const loadingCode = `import { Dialog, DialogRenderer, useDialog } from "lumino/react";
import { useMemo } from "react";

class LoadingDialog extends Dialog {
  configure() {
    this.title("Submit Data")
      .size("medium");

    this.content("Click submit to see the loading state.");

    this.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    this.action("submit", "Submit")
      .variant("primary")
      .onClick(async (ctx) => {
        // Loading state is automatic during async operations
        await new Promise(resolve => setTimeout(resolve, 2000));
        ctx.notify?.("Data submitted!", "success");
      })
      .end();
  }
}`;

const noCloseButtonCode = `import { Dialog, DialogRenderer, useDialog } from "lumino/react";
import { useMemo } from "react";

class NoCloseButtonDialog extends Dialog {
  configure() {
    this.title("No Close Button")
      .size("medium")
      .showCloseButton(false); // Hide the X button

    this.content("Use the Done button to close.");

    this.action("done", "Done")
      .variant("primary")
      .end();
  }
}`;

const deleteConfirmCode = `import { Dialog, DialogRenderer, useDialog } from "lumino/react";
import { useMemo } from "react";

class DeleteDialog extends Dialog {
  configure() {
    this.title("Confirm Delete")
      .size("small")
      .closeOnBackdrop(false); // Prevent accidental close

    // Dynamic content using context
    this.content((ctx) =>
      \`Are you sure you want to delete "\${ctx.dialogData?.itemName}"?\`
    );

    this.action("cancel", "Cancel")
      .variant("secondary")
      .end();

    this.action("delete", "Delete")
      .variant("danger") // Red button for destructive action
      .onClick(async (ctx) => {
        await deleteItem(ctx.dialogData?.itemId);
        ctx.notify?.("Item deleted!", "success");
      })
      .end();
  }
}

// Usage with context data:
<DialogRenderer
  config={config}
  context={{ dialogData: { itemName: "Project Alpha", itemId: 123 } } as any}
  {...dialog.dialogProps}
/>`;

const quickConfirmCode = `import { createConfirmDialog, DialogRenderer, useDialog } from "lumino/react";
import { useMemo } from "react";

function CreateConfirmDialogDemo() {
  const dialog = useDialog();

  // Quick way to create confirm dialogs
  const config = useMemo(() => createConfirmDialog({
    id: "quick-confirm",
    title: "Quick Confirm",
    message: "Do you want to proceed?",
    confirmLabel: "Yes, Proceed",
    cancelLabel: "No, Cancel",
    confirmVariant: "primary", // or "danger" for destructive
    onConfirm: (ctx) => {
      ctx.notify?.("Operation completed!", "success");
    },
  }), []);

  return (
    <>
      <LuminoButton onClick={dialog.open}>Quick Confirm</LuminoButton>
      <DialogRenderer config={config} context={{} as any} {...dialog.dialogProps} />
    </>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function DialogPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Dialog</h1>
      <p className="docs-page-subtitle">
        A modal dialog component for focused user interactions, confirmations,
        and forms. Uses Lumino's Dialog class with useDialog hook.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { Dialog, DialogRenderer, useDialog, createDialog, createConfirmDialog } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Dialog</h2>
        <p>Define a dialog by extending the Dialog class:</p>
        <LiveDemo
          title="Basic"
          description="Simple dialog with content"
          code={basicCode}
        >
          <BasicDialogDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Confirm Dialog</h2>
        <p>Dialog with cancel and confirm action buttons:</p>
        <LiveDemo
          title="Confirm"
          description="Dialog with action buttons"
          code={confirmCode}
        >
          <ConfirmDialogDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Dialog Sizes</h2>
        <p>Use createDialog for inline dialog definitions:</p>
        <LiveDemo
          title="Sizes"
          description="Small, medium, and large dialogs"
          code={sizesCode}
        >
          <SizesDialogDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Form Dialog</h2>
        <p>Dialog extends Component, so you can add inline fields with addRow():</p>
        <LiveDemo
          title="Form"
          description="Dialog with form fields"
          code={formCode}
        >
          <FormDialogDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Loading State</h2>
        <p>Action buttons automatically show loading state during async operations:</p>
        <LiveDemo
          title="Loading"
          description="Automatic loading on actions"
          code={loadingCode}
        >
          <LoadingDialogDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>No Close Button</h2>
        <p>Hide the header close button for required dialogs:</p>
        <LiveDemo
          title="No Close Button"
          description="Close only via action"
          code={noCloseButtonCode}
        >
          <NoCloseButtonDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Delete Confirmation</h2>
        <p>A common pattern for dangerous actions with dynamic content:</p>
        <LiveDemo
          title="Delete Confirm"
          description="Destructive action confirmation"
          code={deleteConfirmCode}
        >
          <DeleteConfirmDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Quick Confirm Dialog</h2>
        <p>Use createConfirmDialog for simple confirmations:</p>
        <LiveDemo
          title="Quick Confirm"
          description="Factory function for confirms"
          code={quickConfirmCode}
        >
          <CreateConfirmDialogDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Dialog Class API</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>title(text)</code></td>
              <td>Set dialog title (string or function returning string)</td>
            </tr>
            <tr>
              <td><code>subtitle(text)</code></td>
              <td>Set dialog subtitle</td>
            </tr>
            <tr>
              <td><code>size(size)</code></td>
              <td>"small" | "medium" | "large" | "fullscreen"</td>
            </tr>
            <tr>
              <td><code>content(text)</code></td>
              <td>Set dialog body content (string or render function)</td>
            </tr>
            <tr>
              <td><code>showCloseButton(bool)</code></td>
              <td>Show/hide close button in header</td>
            </tr>
            <tr>
              <td><code>closeOnBackdrop(bool)</code></td>
              <td>Close when clicking backdrop</td>
            </tr>
            <tr>
              <td><code>closeOnEscape(bool)</code></td>
              <td>Close on Escape key</td>
            </tr>
            <tr>
              <td><code>addRow()</code></td>
              <td>Add inline form fields (inherited from Component)</td>
            </tr>
            <tr>
              <td><code>form(FormClass)</code></td>
              <td>Render an existing Form class inside dialog</td>
            </tr>
            <tr>
              <td><code>action(id, label)</code></td>
              <td>Add action button to footer</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Action Builder API</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.variant(v)</code></td>
              <td>"primary" | "secondary" | "danger" | "ghost"</td>
            </tr>
            <tr>
              <td><code>.onClick(fn)</code></td>
              <td>Click handler; return false to prevent close</td>
            </tr>
            <tr>
              <td><code>.disabled(cond)</code></td>
              <td>Disable button (boolean or function)</td>
            </tr>
            <tr>
              <td><code>.loading(cond)</code></td>
              <td>Show loading state (automatic during async onClick)</td>
            </tr>
            <tr>
              <td><code>.keepOpen()</code></td>
              <td>Don't close dialog after action</td>
            </tr>
            <tr>
              <td><code>.position(pos)</code></td>
              <td>"left" | "right" position in footer</td>
            </tr>
            <tr>
              <td><code>.icon(icon)</code></td>
              <td>Add icon to button</td>
            </tr>
            <tr>
              <td><code>.end()</code></td>
              <td>End action definition and return to dialog</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>useDialog Hook</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Return Value</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>isOpen</code></td>
              <td>boolean</td>
              <td>Current open state</td>
            </tr>
            <tr>
              <td><code>open()</code></td>
              <td>function</td>
              <td>Open the dialog</td>
            </tr>
            <tr>
              <td><code>close()</code></td>
              <td>function</td>
              <td>Close the dialog</td>
            </tr>
            <tr>
              <td><code>toggle()</code></td>
              <td>function</td>
              <td>Toggle open state</td>
            </tr>
            <tr>
              <td><code>dialogProps</code></td>
              <td>object</td>
              <td>Spread onto DialogRenderer: {`{ open, onClose }`}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use Dialog class</strong> - Extend Dialog for reusable dialog definitions with type safety
          </li>
          <li>
            <strong>Use useDialog hook</strong> - Manages open/close state and provides dialogProps
          </li>
          <li>
            <strong>Use createDialog for one-offs</strong> - Quick inline dialog definitions
          </li>
          <li>
            <strong>Loading is automatic</strong> - Async onClick handlers show loading state automatically
          </li>
          <li>
            <strong>Return false to prevent close</strong> - In onClick, return false to keep dialog open (e.g., on validation failure)
          </li>
          <li>
            <strong>Use context for dynamic data</strong> - Pass data via context.dialogData for dynamic content
          </li>
        </ul>
      </div>
    </div>
  );
}
