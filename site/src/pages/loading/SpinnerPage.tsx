/**
 * Spinner Component Page
 *
 * Documents the LuminoSpinner component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoSpinner, LuminoStackLayout, LuminoFlowLayout, LuminoText, LuminoCard } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function SpinnerSizesDemo() {
  return (
    <LuminoFlowLayout gap={3}>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSpinner size="small" />
        <LuminoText variant="secondary">Small</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSpinner size="medium" />
        <LuminoText variant="secondary">Medium</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSpinner size="large" />
        <LuminoText variant="secondary">Large</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}

function SpinnerWithLabelDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoFlowLayout gap={2} align="center">
        <LuminoSpinner size="medium" label="Loading data..." />
        <LuminoText>Loading data...</LuminoText>
      </LuminoFlowLayout>
      <LuminoFlowLayout gap={2} align="center">
        <LuminoSpinner size="small" label="Saving changes..." />
        <LuminoText variant="secondary">Saving changes...</LuminoText>
      </LuminoFlowLayout>
    </LuminoStackLayout>
  );
}

function SpinnerInCardDemo() {
  return (
    <LuminoCard style={{ padding: "24px", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LuminoStackLayout gap={2} align="center">
        <LuminoSpinner size="large" label="Loading content..." />
        <LuminoText variant="secondary">Loading content...</LuminoText>
      </LuminoStackLayout>
    </LuminoCard>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const sizesCode = `import { LuminoSpinner, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

function SpinnerSizesDemo() {
  return (
    <LuminoFlowLayout gap={3}>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSpinner size="small" />
        <LuminoText variant="secondary">Small</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSpinner size="medium" />
        <LuminoText variant="secondary">Medium</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSpinner size="large" />
        <LuminoText variant="secondary">Large</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}`;

const withLabelCode = `import { LuminoSpinner, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

function SpinnerWithLabelDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoFlowLayout gap={2} align="center">
        <LuminoSpinner size="medium" label="Loading data..." />
        <LuminoText>Loading data...</LuminoText>
      </LuminoFlowLayout>
      <LuminoFlowLayout gap={2} align="center">
        <LuminoSpinner size="small" label="Saving changes..." />
        <LuminoText variant="secondary">Saving changes...</LuminoText>
      </LuminoFlowLayout>
    </LuminoStackLayout>
  );
}`;

const inCardCode = `import { LuminoSpinner, LuminoStackLayout, LuminoText, LuminoCard } from "lumino/react";

function SpinnerInCardDemo() {
  return (
    <LuminoCard style={{ padding: "24px", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LuminoStackLayout gap={2} align="center">
        <LuminoSpinner size="large" label="Loading content..." />
        <LuminoText variant="secondary">Loading content...</LuminoText>
      </LuminoStackLayout>
    </LuminoCard>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function SpinnerPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Spinner</h1>
      <p className="docs-page-subtitle">
        An animated loading spinner for indicating loading states in buttons,
        forms, and content areas.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoSpinner } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Spinner Sizes</h2>
        <p>Use the <code>size</code> prop to control spinner size:</p>
        <LiveDemo
          title="Spinner Sizes"
          description="Different spinner size options"
          code={sizesCode}
        >
          <SpinnerSizesDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>With Label</h2>
        <p>Add context with accessible labels:</p>
        <LiveDemo
          title="Spinner with Label"
          description="Spinners with visible loading text"
          code={withLabelCode}
        >
          <SpinnerWithLabelDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>In Card/Container</h2>
        <p>Center spinner in loading containers:</p>
        <LiveDemo
          title="Spinner in Card"
          description="Centered spinner for content loading"
          code={inCardCode}
        >
          <SpinnerInCardDemo />
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
              <td><code>size</code></td>
              <td>"small" | "medium" | "large"</td>
              <td>"medium"</td>
              <td>Spinner size</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td>string</td>
              <td>-</td>
              <td>Accessible aria-label</td>
            </tr>
            <tr>
              <td><code>className</code></td>
              <td>string</td>
              <td>-</td>
              <td>Additional CSS class</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoSpinner } from "lumino/react";

// Default spinner
<LuminoSpinner />

// With size
<LuminoSpinner size="large" />

// With accessible label
<LuminoSpinner label="Loading user data" />`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Buttons</h2>
        <pre className="docs-code">{`import { LuminoSpinner, LuminoButton, LuminoFlowLayout } from "lumino/react";

function LoadingButton() {
  const [loading, setLoading] = useState(false);

  return (
    <LuminoButton
      onClick={async () => {
        setLoading(true);
        await performAction();
        setLoading(false);
      }}
      disabled={loading}
    >
      {loading ? (
        <LuminoFlowLayout gap={1} align="center">
          <LuminoSpinner size="small" />
          <span>Saving...</span>
        </LuminoFlowLayout>
      ) : (
        "Save"
      )}
    </LuminoButton>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Full Page Loading</h2>
        <pre className="docs-code">{`import { LuminoSpinner, LuminoStackLayout, LuminoText } from "lumino/react";

function FullPageLoader() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255, 255, 255, 0.9)",
    }}>
      <LuminoStackLayout gap={2} align="center">
        <LuminoSpinner size="large" />
        <LuminoText>Loading application...</LuminoText>
      </LuminoStackLayout>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// Always provide a label for screen readers
<LuminoSpinner label="Loading data" />

// The component sets role="status" automatically`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use appropriate size</strong> - Match spinner size to
            context (small for buttons, large for pages)
          </li>
          <li>
            <strong>Provide context</strong> - Add labels to explain what's
            loading
          </li>
          <li>
            <strong>Avoid spinner flash</strong> - Delay display for quick
            operations
          </li>
          <li>
            <strong>Disable controls</strong> - Prevent double-clicks while
            loading
          </li>
        </ul>
      </div>
    </div>
  );
}
