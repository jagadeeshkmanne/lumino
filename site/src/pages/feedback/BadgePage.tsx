/**
 * Badge Page
 *
 * Documents the LuminoBadge component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoBadge, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BadgesDemo() {
  return (
    <LuminoStackLayout gap={3}>
      {/* Colors */}
      <LuminoStackLayout gap={1}>
        <LuminoText styleAs="label">Colors</LuminoText>
        <LuminoFlowLayout gap={1}>
          <LuminoBadge>Default</LuminoBadge>
          <LuminoBadge value="Primary" />
          <LuminoBadge value="Info" />
        </LuminoFlowLayout>
      </LuminoStackLayout>

      {/* With values */}
      <LuminoStackLayout gap={1}>
        <LuminoText styleAs="label">Count Badges</LuminoText>
        <LuminoFlowLayout gap={1}>
          <LuminoBadge value={5} />
          <LuminoBadge value={25} />
          <LuminoBadge value={99} />
          <LuminoBadge value={150} max={99} />
        </LuminoFlowLayout>
      </LuminoStackLayout>

      {/* Status Examples */}
      <LuminoStackLayout gap={1}>
        <LuminoText styleAs="label">Status Examples</LuminoText>
        <LuminoFlowLayout gap={1}>
          <LuminoBadge value="Active" />
          <LuminoBadge value="Pending" />
          <LuminoBadge value="Inactive" />
          <LuminoBadge value="Draft" />
        </LuminoFlowLayout>
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}

export function BadgePage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Badge</h1>
      <p className="docs-page-subtitle">
        A small status indicator component for displaying counts, labels,
        and status information.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoBadge } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Interactive Demo</h2>
        <LiveDemo
          code={`import { LuminoBadge, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

function BadgesDemo() {
  return (
    <LuminoStackLayout gap={3}>
      {/* Colors */}
      <LuminoStackLayout gap={1}>
        <LuminoText styleAs="label">Colors</LuminoText>
        <LuminoFlowLayout gap={1}>
          <LuminoBadge>Default</LuminoBadge>
          <LuminoBadge value="Primary" />
          <LuminoBadge value="Info" />
        </LuminoFlowLayout>
      </LuminoStackLayout>

      {/* With values */}
      <LuminoStackLayout gap={1}>
        <LuminoText styleAs="label">Count Badges</LuminoText>
        <LuminoFlowLayout gap={1}>
          <LuminoBadge value={5} />
          <LuminoBadge value={25} />
          <LuminoBadge value={99} />
          <LuminoBadge value={150} max={99} />
        </LuminoFlowLayout>
      </LuminoStackLayout>

      {/* Status Examples */}
      <LuminoStackLayout gap={1}>
        <LuminoText styleAs="label">Status Examples</LuminoText>
        <LuminoFlowLayout gap={1}>
          <LuminoBadge value="Active" />
          <LuminoBadge value="Pending" />
          <LuminoBadge value="Inactive" />
          <LuminoBadge value="Draft" />
        </LuminoFlowLayout>
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}`}
        >
          <BadgesDemo />
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
              <td><code>value</code></td>
              <td>number | string</td>
              <td>-</td>
              <td>Badge content value</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>-</td>
              <td>Badge content (alternative to value)</td>
            </tr>
            <tr>
              <td><code>max</code></td>
              <td>number</td>
              <td>-</td>
              <td>Max number to display (shows "99+" if exceeded)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoBadge } from "lumino/react";

// Text badge
<LuminoBadge>Default</LuminoBadge>

// With value prop
<LuminoBadge value="Active" />

// Count badge
<LuminoBadge value={5} />

// With max limit
<LuminoBadge value={150} max={99} />  // Shows "99+"`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Tables</h2>
        <pre className="docs-code">{`const columns = [
  { key: "name", title: "Name" },
  {
    key: "status",
    title: "Status",
    render: (value) => (
      <LuminoBadge value={value} />
    ),
  },
];`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Lumino Layout</h2>
        <pre className="docs-code">{`import { LuminoBadge, LuminoStackLayout, LuminoFlowLayout } from "lumino/react";

function StatusBadges() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoFlowLayout gap={1}>
        <LuminoBadge value="Active" />
        <LuminoBadge value="Pending" />
        <LuminoBadge value="Inactive" />
      </LuminoFlowLayout>
    </LuminoStackLayout>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Keep text short</strong> - Badges work best with
            1-2 words
          </li>
          <li>
            <strong>Use max for counts</strong> - Prevents layout issues
            with large numbers
          </li>
          <li>
            <strong>Don't overuse</strong> - Too many badges can create
            visual clutter
          </li>
        </ul>
      </div>
    </div>
  );
}
