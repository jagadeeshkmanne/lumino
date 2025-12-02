/**
 * Actions Overview Page
 *
 * Overview of all Lumino action components.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function ActionsOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Action Components Overview</h1>
      <p className="docs-page-subtitle">
        Lumino provides action components for triggering operations and navigation.
        These components handle user interactions and form submissions.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        All action components follow consistent patterns for variants, sizes, and states.
      </div>

      <div className="docs-section">
        <h2>Available Action Components</h2>
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
              <td><code>LuminoButton</code></td>
              <td>Standard button with variants</td>
              <td>Form submissions, actions</td>
            </tr>
            <tr>
              <td><code>LuminoIconButton</code></td>
              <td>Icon-only button</td>
              <td>Toolbar actions, compact UI</td>
            </tr>
            <tr>
              <td><code>LuminoLink</code></td>
              <td>Styled link component</td>
              <td>Navigation, inline links</td>
            </tr>
            <tr>
              <td><code>LuminoButtonGroup</code></td>
              <td>Grouped buttons</td>
              <td>Related actions, toggles</td>
            </tr>
            <tr>
              <td><code>LuminoDropdownButton</code></td>
              <td>Button with dropdown menu</td>
              <td>Secondary actions, split buttons</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Common Props</h2>
        <p>
          All action components share these common props:
        </p>
        <pre className="docs-code">{`interface ActionProps {
  // Variants
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";

  // State
  disabled?: boolean;
  loading?: boolean;

  // Events
  onClick?: (event: MouseEvent) => void;

  // Styling
  className?: string;
  style?: CSSProperties;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Button Variants</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Variant</th>
              <th>Use Case</th>
              <th>Visual Style</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>primary</code></td>
              <td>Main action on page</td>
              <td>Solid background, high contrast</td>
            </tr>
            <tr>
              <td><code>secondary</code></td>
              <td>Alternative actions</td>
              <td>Outlined, subtle background</td>
            </tr>
            <tr>
              <td><code>tertiary</code></td>
              <td>Low emphasis actions</td>
              <td>Text only, minimal styling</td>
            </tr>
            <tr>
              <td><code>danger</code></td>
              <td>Destructive actions</td>
              <td>Red/warning colors</td>
            </tr>
            <tr>
              <td><code>ghost</code></td>
              <td>Inline, subtle actions</td>
              <td>Transparent background</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Using Actions in Forms</h2>
        <p>
          Actions are added to forms using the <code>.addAction()</code> method:
        </p>
        <pre className="docs-code">{`import { Form } from "lumino/core";

class MyForm extends Form<Entity> {
  configure() {
    this.addSection("Details")
      .addField("name")
        .component(LuminoTextInput)
        .label("Name")
        .endField()
    .endSection();

    // Add form actions
    this.addActions()
      .addButton("submit")
        .label("Save")
        .variant("primary")
        .onClick(() => this.submit())
        .endButton()
      .addButton("cancel")
        .label("Cancel")
        .variant("secondary")
        .onClick(() => this.cancel())
        .endButton()
    .endActions();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Using Actions in Page Builder</h2>
        <pre className="docs-code">{`import { Page } from "lumino/core";

class ListPage extends Page {
  configure() {
    this.setTitle("Users");

    // Toolbar with actions
    this.addToolbar()
      .addButton("create")
        .label("Create User")
        .variant("primary")
        .icon("plus")
        .onClick(() => this.navigate("/users/new"))
        .endButton()
      .addButton("export")
        .label("Export")
        .variant("secondary")
        .onClick(() => this.exportData())
        .endButton()
      .addDropdownButton("more")
        .label("More Actions")
        .addItem("import", "Import", () => this.importData())
        .addItem("archive", "Archive All", () => this.archiveAll())
        .endDropdownButton()
    .endToolbar();

    // Table content
    this.addTable()
      .columns(userColumns)
      .dataBind("users")
      .rowActions([
        { icon: "edit", onClick: (row) => this.editUser(row) },
        { icon: "delete", onClick: (row) => this.deleteUser(row) },
      ])
    .endTable();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Standalone Usage</h2>
        <pre className="docs-code">{`import {
  LuminoButton,
  LuminoIconButton,
  LuminoLink,
  LuminoButtonGroup,
} from "lumino/react";

function MyComponent() {
  return (
    <div>
      {/* Basic buttons */}
      <LuminoButton variant="primary" onClick={handleSave}>
        Save
      </LuminoButton>
      <LuminoButton variant="secondary" onClick={handleCancel}>
        Cancel
      </LuminoButton>

      {/* Icon button */}
      <LuminoIconButton
        icon="settings"
        onClick={openSettings}
        aria-label="Open settings"
      />

      {/* Link */}
      <LuminoLink href="/help">Learn more</LuminoLink>

      {/* Button group */}
      <LuminoButtonGroup>
        <LuminoButton>Option 1</LuminoButton>
        <LuminoButton>Option 2</LuminoButton>
        <LuminoButton>Option 3</LuminoButton>
      </LuminoButtonGroup>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Loading States</h2>
        <pre className="docs-code">{`function AsyncButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await saveData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LuminoButton
      variant="primary"
      loading={loading}
      onClick={handleClick}
    >
      {loading ? "Saving..." : "Save"}
    </LuminoButton>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>One primary per section</strong> - Only one primary button
            should be visible at a time
          </li>
          <li>
            <strong>Clear labels</strong> - Use action verbs that describe what
            will happen
          </li>
          <li>
            <strong>Consistent placement</strong> - Primary actions typically go
            on the right
          </li>
          <li>
            <strong>Loading feedback</strong> - Show loading state during async
            operations
          </li>
          <li>
            <strong>Disable when invalid</strong> - Disable submit buttons when
            form is invalid
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <p>
          Explore individual action components:
        </p>
        <ul className="docs-list">
          <li><strong>Button</strong> - Standard button variants</li>
          <li><strong>IconButton</strong> - Icon-only buttons</li>
          <li><strong>Link</strong> - Navigation links</li>
          <li><strong>ButtonGroup</strong> - Grouped buttons</li>
        </ul>
      </div>
    </div>
  );
}
