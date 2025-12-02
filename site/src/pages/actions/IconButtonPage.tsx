/**
 * IconButton Page
 *
 * Documents the LuminoIconButton component.
 * Uses Lumino components directly - no useState needed for demos.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import {
  LuminoIconButton,
  LuminoStackLayout,
  LuminoFlowLayout,
  LuminoText,
} from "lumino/react";

// Simple SVG icons for demos
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg>
);

// =============================================================================
// DEMO COMPONENTS - No useState, static Lumino components
// =============================================================================

function IconButtonDemo() {
  return (
    <LuminoFlowLayout gap={2}>
      <LuminoIconButton
        icon={<EditIcon />}
        aria-label="Edit"
      />
      <LuminoIconButton
        icon={<DeleteIcon />}
        aria-label="Delete"
      />
      <LuminoIconButton
        icon={<SettingsIcon />}
        aria-label="Settings"
      />
    </LuminoFlowLayout>
  );
}

function IconButtonVariantsDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoStackLayout gap={1}>
        <LuminoText variant="secondary">Default</LuminoText>
        <LuminoIconButton
          icon={<InfoIcon />}
          variant="secondary"
          aria-label="Info"
        />
      </LuminoStackLayout>

      <LuminoStackLayout gap={1}>
        <LuminoText variant="secondary">Primary</LuminoText>
        <LuminoIconButton
          icon={<PlusIcon />}
          variant="primary"
          aria-label="Add new"
        />
      </LuminoStackLayout>

      <LuminoStackLayout gap={1}>
        <LuminoText variant="secondary">CTA</LuminoText>
        <LuminoIconButton
          icon={<SettingsIcon />}
          variant="cta"
          aria-label="Settings"
        />
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}

function IconButtonSizesDemo() {
  return (
    <LuminoFlowLayout gap={3} style={{ alignItems: "flex-end" }}>
      <LuminoStackLayout gap={1} style={{ alignItems: "center" }}>
        <LuminoIconButton
          icon={<SettingsIcon />}
          aria-label="Small settings"
        />
        <LuminoText variant="secondary">Default</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}

function DisabledIconButtonDemo() {
  return (
    <LuminoFlowLayout gap={2}>
      <LuminoIconButton
        icon={<EditIcon />}
        aria-label="Edit (disabled)"
        disabled
      />
      <LuminoIconButton
        icon={<DeleteIcon />}
        aria-label="Delete (disabled)"
        disabled
      />
      <LuminoIconButton
        icon={<SettingsIcon />}
        aria-label="Settings (disabled)"
        disabled
      />
    </LuminoFlowLayout>
  );
}

function ToolbarDemo() {
  return (
    <LuminoFlowLayout gap={1} style={{ padding: "8px", background: "#f5f5f5", borderRadius: "4px" }}>
      <LuminoIconButton
        icon={<EditIcon />}
        variant="secondary"
        aria-label="Edit"
      />
      <LuminoIconButton
        icon={<PlusIcon />}
        variant="secondary"
        aria-label="Add"
      />
      <LuminoIconButton
        icon={<DeleteIcon />}
        variant="secondary"
        aria-label="Delete"
      />
      <div style={{ width: "1px", height: "24px", background: "#ccc", margin: "0 8px" }} />
      <LuminoIconButton
        icon={<SettingsIcon />}
        variant="secondary"
        aria-label="Settings"
      />
    </LuminoFlowLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCode = `import { LuminoIconButton, LuminoFlowLayout } from "lumino/react";

function IconButtonDemo() {
  return (
    <LuminoFlowLayout gap={2}>
      <LuminoIconButton
        icon={<EditIcon />}
        aria-label="Edit"
      />
      <LuminoIconButton
        icon={<DeleteIcon />}
        aria-label="Delete"
      />
      <LuminoIconButton
        icon={<SettingsIcon />}
        aria-label="Settings"
      />
    </LuminoFlowLayout>
  );
}`;

const variantsCode = `import { LuminoIconButton, LuminoStackLayout, LuminoText } from "lumino/react";

function IconButtonVariants() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoStackLayout gap={1}>
        <LuminoText variant="secondary">Default (Secondary)</LuminoText>
        <LuminoIconButton
          icon={<InfoIcon />}
          variant="secondary"
          aria-label="Info"
        />
      </LuminoStackLayout>

      <LuminoStackLayout gap={1}>
        <LuminoText variant="secondary">Primary</LuminoText>
        <LuminoIconButton
          icon={<PlusIcon />}
          variant="primary"
          aria-label="Add new"
        />
      </LuminoStackLayout>

      <LuminoStackLayout gap={1}>
        <LuminoText variant="secondary">CTA</LuminoText>
        <LuminoIconButton
          icon={<SettingsIcon />}
          variant="cta"
          aria-label="Settings"
        />
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}`;

const disabledCode = `import { LuminoIconButton, LuminoFlowLayout } from "lumino/react";

function DisabledIconButtons() {
  return (
    <LuminoFlowLayout gap={2}>
      <LuminoIconButton
        icon={<EditIcon />}
        aria-label="Edit (disabled)"
        disabled
      />
      <LuminoIconButton
        icon={<DeleteIcon />}
        aria-label="Delete (disabled)"
        disabled
      />
    </LuminoFlowLayout>
  );
}`;

const toolbarCode = `import { LuminoIconButton, LuminoFlowLayout } from "lumino/react";

function Toolbar() {
  return (
    <LuminoFlowLayout gap={1} style={{ padding: "8px", background: "#f5f5f5" }}>
      <LuminoIconButton icon={<EditIcon />} variant="secondary" aria-label="Edit" />
      <LuminoIconButton icon={<PlusIcon />} variant="secondary" aria-label="Add" />
      <LuminoIconButton icon={<DeleteIcon />} variant="secondary" aria-label="Delete" />
      <div style={{ width: "1px", height: "24px", background: "#ccc", margin: "0 8px" }} />
      <LuminoIconButton icon={<SettingsIcon />} variant="secondary" aria-label="Settings" />
    </LuminoFlowLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function IconButtonPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Icon Button</h1>
      <p className="docs-page-subtitle">
        A compact button component displaying only an icon, ideal for toolbars,
        table actions, and space-constrained UI areas.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoIconButton } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <p>Icon buttons with different icons:</p>
        <LiveDemo
          title="Basic"
          description="Edit, Delete, and Settings icons"
          code={basicCode}
        >
          <IconButtonDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Variants</h2>
        <p>Different visual styles for various use cases:</p>
        <LiveDemo
          title="Variants"
          description="Secondary, Primary, and CTA variants"
          code={variantsCode}
        >
          <IconButtonVariantsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Disabled State</h2>
        <p>Disabled icon buttons cannot be interacted with:</p>
        <LiveDemo
          title="Disabled"
          description="Disabled icon buttons"
          code={disabledCode}
        >
          <DisabledIconButtonDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Toolbar Example</h2>
        <p>Icon buttons grouped in a toolbar:</p>
        <LiveDemo
          title="Toolbar"
          description="Icon buttons in a toolbar layout"
          code={toolbarCode}
        >
          <ToolbarDemo />
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
              <td><code>icon</code></td>
              <td>string | ReactNode</td>
              <td>-</td>
              <td>Icon to display (required)</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td>"primary" | "secondary" | "cta"</td>
              <td>"secondary"</td>
              <td>Visual style variant</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable the button</td>
            </tr>
            <tr>
              <td><code>aria-label</code></td>
              <td>string</td>
              <td>-</td>
              <td>Accessible label (required)</td>
            </tr>
            <tr>
              <td><code>onClick</code></td>
              <td>(event) =&gt; void</td>
              <td>-</td>
              <td>Click handler</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// ALWAYS provide aria-label for icon buttons
<LuminoIconButton
  icon={<DeleteIcon />}
  aria-label="Delete item"  // Required for accessibility!
/>

// Describe the action, not the icon
<LuminoIconButton
  icon={<PlusIcon />}
  aria-label="Add new user"      // Good: Describes action
  // aria-label="Plus icon"      // Bad: Describes icon
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Always use aria-label</strong> - Icon buttons have no visible
            text, so accessibility labels are essential
          </li>
          <li>
            <strong>Use consistent sizes</strong> - Keep icon buttons the same size
            within a toolbar or action group
          </li>
          <li>
            <strong>Group related actions</strong> - Place related icon buttons
            together with appropriate spacing
          </li>
          <li>
            <strong>Limit icon buttons</strong> - Too many can overwhelm users;
            consider using a dropdown for additional actions
          </li>
        </ul>
      </div>
    </div>
  );
}
