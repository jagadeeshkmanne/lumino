/**
 * Feedback Components Overview Page
 *
 * Overview of all Lumino feedback components.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function FeedbackOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Feedback Components Overview</h1>
      <p className="docs-page-subtitle">
        Lumino provides feedback components for communicating status, progress,
        and notifications to users.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        All feedback components follow consistent patterns for types and styling.
      </div>

      <div className="docs-section">
        <h2>Available Feedback Components</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Description</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>LuminoToast</code></td>
              <td>Temporary notification message</td>
              <td>Success/error messages, alerts</td>
            </tr>
            <tr>
              <td><code>LuminoBadge</code></td>
              <td>Small status indicator</td>
              <td>Counts, status labels, tags</td>
            </tr>
            <tr>
              <td><code>LuminoProgress</code></td>
              <td>Progress bar</td>
              <td>File uploads, task progress</td>
            </tr>
            <tr>
              <td><code>LuminoSpinner</code></td>
              <td>Loading indicator</td>
              <td>Async operations, loading states</td>
            </tr>
            <tr>
              <td><code>LuminoAlert</code></td>
              <td>Inline notification banner</td>
              <td>Warnings, info messages</td>
            </tr>
            <tr>
              <td><code>LuminoTooltip</code></td>
              <td>Hover tooltip</td>
              <td>Additional context, hints</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Feedback Types</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Color</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>success</code></td>
              <td>Green</td>
              <td>Successful operations</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td>Red</td>
              <td>Errors, failures</td>
            </tr>
            <tr>
              <td><code>warning</code></td>
              <td>Orange/Yellow</td>
              <td>Warnings, cautions</td>
            </tr>
            <tr>
              <td><code>info</code></td>
              <td>Blue</td>
              <td>Informational messages</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Programmatic Usage</h2>
        <p>
          Feedback components can be triggered programmatically via Lumino:
        </p>
        <pre className="docs-code">{`import { useLumino } from "lumino/react";

function MyComponent() {
  const { ui } = useLumino();

  const handleSuccess = () => {
    ui.notify("Operation completed successfully!", "success");
  };

  const handleError = () => {
    ui.notify("Something went wrong", "error");
  };

  const handleWithLoader = async () => {
    ui.showLoader();
    try {
      await performOperation();
      ui.notify("Done!", "success");
    } catch (error) {
      ui.notify(error.message, "error");
    } finally {
      ui.hideLoader();
    }
  };

  return (
    <div>
      <LuminoButton onClick={handleSuccess}>Show Success</LuminoButton>
      <LuminoButton onClick={handleError}>Show Error</LuminoButton>
      <LuminoButton onClick={handleWithLoader}>With Loading</LuminoButton>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class MyForm extends Form<Entity> {
  configure() {
    // Form configuration...
  }

  async onSubmit(data: Entity) {
    try {
      await this.api.save(data);
      this.ui.notify("Saved successfully!", "success");
      this.close();
    } catch (error) {
      this.ui.notify("Failed to save", "error");
    }
  }

  async onLoad() {
    this.ui.showLoader();
    try {
      const data = await this.api.fetch();
      this.setData(data);
    } finally {
      this.ui.hideLoader();
    }
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Standalone Components</h2>
        <pre className="docs-code">{`import {
  LuminoToast,
  LuminoBadge,
  LuminoProgress,
  LuminoSpinner,
  LuminoAlert,
} from "lumino/react";

function FeedbackExamples() {
  return (
    <div>
      {/* Badge */}
      <LuminoBadge color="success">Active</LuminoBadge>
      <LuminoBadge color="warning">Pending</LuminoBadge>
      <LuminoBadge color="error">Failed</LuminoBadge>

      {/* Progress */}
      <LuminoProgress value={75} />
      <LuminoProgress value={50} variant="indeterminate" />

      {/* Spinner */}
      <LuminoSpinner size="sm" />
      <LuminoSpinner size="md" />
      <LuminoSpinner size="lg" />

      {/* Alert */}
      <LuminoAlert type="info">
        This is an informational message.
      </LuminoAlert>
      <LuminoAlert type="warning" dismissible>
        This warning can be dismissed.
      </LuminoAlert>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Toast Configuration</h2>
        <pre className="docs-code">{`// Configure toast defaults in lumino setup
const app = lumino()
  .toastConfig({
    position: "top-right",      // top-left, top-center, top-right,
                                // bottom-left, bottom-center, bottom-right
    duration: 5000,             // Auto-dismiss after 5 seconds
    maxToasts: 5,               // Maximum visible toasts
    pauseOnHover: true,         // Pause timer when hovered
  })
  .build();

// Show toast with custom options
ui.notify("Custom toast", "info", {
  duration: 10000,              // Override default duration
  dismissible: true,            // Show close button
  action: {
    label: "Undo",
    onClick: () => undoAction(),
  },
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Loading States</h2>
        <pre className="docs-code">{`// Global loading overlay
ui.showLoader();
ui.showLoader("Loading data...");  // With message
ui.hideLoader();

// Component-level loading
function DataTable() {
  const [loading, setLoading] = useState(true);

  return (
    <LuminoCard>
      {loading ? (
        <div className="loading-container">
          <LuminoSpinner size="lg" />
          <p>Loading data...</p>
        </div>
      ) : (
        <LuminoTable data={data} columns={columns} />
      )}
    </LuminoCard>
  );
}

// Skeleton loading
<LuminoSkeleton variant="table" rows={5} />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Be concise</strong> - Keep toast messages short and actionable
          </li>
          <li>
            <strong>Use appropriate types</strong> - Success for positive outcomes,
            error for failures
          </li>
          <li>
            <strong>Don't overuse toasts</strong> - Too many notifications can
            overwhelm users
          </li>
          <li>
            <strong>Show progress for long operations</strong> - Don't leave users
            wondering
          </li>
          <li>
            <strong>Allow dismissal</strong> - Let users close notifications when
            appropriate
          </li>
          <li>
            <strong>Provide actions when helpful</strong> - "Undo" for destructive
            actions
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <p>
          Explore individual feedback components:
        </p>
        <ul className="docs-list">
          <li><strong>Toast</strong> - Notification messages</li>
          <li><strong>Badge</strong> - Status indicators</li>
          <li><strong>Progress</strong> - Progress bars</li>
          <li><strong>Spinner</strong> - Loading indicators</li>
          <li><strong>Alert</strong> - Inline notifications</li>
        </ul>
      </div>
    </div>
  );
}
