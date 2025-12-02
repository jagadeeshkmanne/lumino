/**
 * Alert Component Page
 *
 * Documents the LuminoAlert (LuminoBanner) component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React, { useState } from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoAlert, LuminoStackLayout, LuminoText, LuminoButton } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function AlertVariantsDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoAlert status="info">
        This is an informational message.
      </LuminoAlert>
      <LuminoAlert status="success">
        Operation completed successfully!
      </LuminoAlert>
      <LuminoAlert status="warning">
        Please review the changes before continuing.
      </LuminoAlert>
      <LuminoAlert status="error">
        An error occurred while processing your request.
      </LuminoAlert>
    </LuminoStackLayout>
  );
}

function AlertClosableDemo() {
  const [showInfo, setShowInfo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);

  return (
    <LuminoStackLayout gap={2}>
      {showInfo && (
        <LuminoAlert status="info" closable onClose={() => setShowInfo(false)}>
          Click the close button to dismiss this alert.
        </LuminoAlert>
      )}
      {showSuccess && (
        <LuminoAlert status="success" closable onClose={() => setShowSuccess(false)}>
          This success message can also be dismissed.
        </LuminoAlert>
      )}
      {!showInfo && !showSuccess && (
        <LuminoStackLayout gap={1}>
          <LuminoText variant="secondary">All alerts dismissed!</LuminoText>
          <LuminoButton onClick={() => { setShowInfo(true); setShowSuccess(true); }}>
            Show Alerts
          </LuminoButton>
        </LuminoStackLayout>
      )}
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const variantsCode = `import { LuminoAlert, LuminoStackLayout } from "lumino/react";

function AlertVariantsDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoAlert status="info">
        This is an informational message.
      </LuminoAlert>
      <LuminoAlert status="success">
        Operation completed successfully!
      </LuminoAlert>
      <LuminoAlert status="warning">
        Please review the changes before continuing.
      </LuminoAlert>
      <LuminoAlert status="error">
        An error occurred while processing your request.
      </LuminoAlert>
    </LuminoStackLayout>
  );
}`;

const closableCode = `import { LuminoAlert, LuminoStackLayout, LuminoText, LuminoButton } from "lumino/react";
import { useState } from "react";

function AlertClosableDemo() {
  const [showInfo, setShowInfo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(true);

  return (
    <LuminoStackLayout gap={2}>
      {showInfo && (
        <LuminoAlert status="info" closable onClose={() => setShowInfo(false)}>
          Click the close button to dismiss this alert.
        </LuminoAlert>
      )}
      {showSuccess && (
        <LuminoAlert status="success" closable onClose={() => setShowSuccess(false)}>
          This success message can also be dismissed.
        </LuminoAlert>
      )}
      {!showInfo && !showSuccess && (
        <LuminoStackLayout gap={1}>
          <LuminoText variant="secondary">All alerts dismissed!</LuminoText>
          <LuminoButton onClick={() => { setShowInfo(true); setShowSuccess(true); }}>
            Show Alerts
          </LuminoButton>
        </LuminoStackLayout>
      )}
    </LuminoStackLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function AlertPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Alert</h1>
      <p className="docs-page-subtitle">
        An inline alert component for displaying important messages, warnings,
        errors, and success notifications.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoAlert } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Alert Variants</h2>
        <p>Use <code>status</code> to indicate the alert type:</p>
        <LiveDemo
          title="Alert Variants"
          description="Different alert types for various messages"
          code={variantsCode}
        >
          <AlertVariantsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Closable Alerts</h2>
        <p>Add <code>closable</code> and <code>onClose</code> for dismissible alerts:</p>
        <LiveDemo
          title="Closable Alerts"
          description="Alerts that can be dismissed by the user"
          code={closableCode}
        >
          <AlertClosableDemo />
        </LiveDemo>
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
              <td><code>status</code></td>
              <td>"info" | "success" | "warning" | "error"</td>
              <td>"info"</td>
              <td>Alert type/color</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>-</td>
              <td>Alert content</td>
            </tr>
            <tr>
              <td><code>closable</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Show close button</td>
            </tr>
            <tr>
              <td><code>onClose</code></td>
              <td>() =&gt; void</td>
              <td>-</td>
              <td>Close button callback</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoAlert } from "lumino/react";

// Info alert
<LuminoAlert status="info">
  This is an informational message.
</LuminoAlert>

// Success alert
<LuminoAlert status="success">
  Operation completed successfully!
</LuminoAlert>

// Warning alert
<LuminoAlert status="warning">
  Please review the changes before continuing.
</LuminoAlert>

// Error alert
<LuminoAlert status="error">
  An error occurred while processing your request.
</LuminoAlert>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Dismissible Alerts</h2>
        <pre className="docs-code">{`import { LuminoAlert } from "lumino/react";
import { useState } from "react";

function DismissibleAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <LuminoAlert
      status="info"
      closable
      onClose={() => setVisible(false)}
    >
      This alert can be dismissed by clicking the close button.
    </LuminoAlert>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Form Validation Alert</h2>
        <pre className="docs-code">{`import { LuminoAlert, LuminoStackLayout } from "lumino/react";

function FormWithAlert({ errors }) {
  return (
    <LuminoStackLayout gap={2}>
      {errors.length > 0 && (
        <LuminoAlert status="error">
          Please fix the following errors before submitting.
        </LuminoAlert>
      )}
      {/* Form fields... */}
    </LuminoStackLayout>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use appropriate status</strong> - Error for failures,
            warning for caution, info for information
          </li>
          <li>
            <strong>Keep messages concise</strong> - Clear, actionable text
            works best
          </li>
          <li>
            <strong>Position appropriately</strong> - Place near relevant
            content
          </li>
          <li>
            <strong>Don't overuse</strong> - Too many alerts can overwhelm users
          </li>
        </ul>
      </div>
    </div>
  );
}
