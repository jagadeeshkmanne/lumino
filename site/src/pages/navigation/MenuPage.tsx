/**
 * Menu Component Page
 *
 * Documents the LuminoMenu component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React, { useState } from "react";
import { LiveDemo } from "../../components/LiveDemo";

function MenuDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Actions {isOpen ? "▲" : "▼"}
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              minWidth: "200px",
              zIndex: 1000,
            }}
          >
            <div
              onClick={() => {
                setSelectedAction("New File");
                setIsOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              New File
            </div>
            <div
              onClick={() => {
                setSelectedAction("Open");
                setIsOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Open
            </div>
            <div
              onClick={() => {
                setSelectedAction("Save");
                setIsOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Save
            </div>
          </div>
        )}
      </div>

      {selectedAction && (
        <div style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
          Last action: <strong>{selectedAction}</strong>
        </div>
      )}
    </div>
  );
}

export function MenuPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Menu</h1>
      <p className="docs-page-subtitle">
        A dropdown menu component for contextual actions, navigation options,
        and nested menu items.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <LiveDemo
        title="Interactive Menu Demo"
        description="Click the button to open a dropdown menu with multiple actions"
        code={`import React, { useState } from "react";

function MenuDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Actions {isOpen ? "▲" : "▼"}
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              minWidth: "200px",
              zIndex: 1000,
            }}
          >
            <div
              onClick={() => {
                setSelectedAction("New File");
                setIsOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              New File
            </div>
            <div
              onClick={() => {
                setSelectedAction("Open");
                setIsOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Open
            </div>
            <div
              onClick={() => {
                setSelectedAction("Save");
                setIsOpen(false);
              }}
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Save
            </div>
          </div>
        )}
      </div>

      {selectedAction && (
        <div style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
          Last action: <strong>{selectedAction}</strong>
        </div>
      )}
    </div>
  );
}`}
        defaultView="split"
      >
        <MenuDemo />
      </LiveDemo>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoMenu } from "lumino/react";`}</pre>
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
              <td>
                <code>trigger</code>
              </td>
              <td>ReactNode</td>
              <td>-</td>
              <td>Element that triggers the menu</td>
            </tr>
            <tr>
              <td>
                <code>open</code>
              </td>
              <td>boolean</td>
              <td>-</td>
              <td>Controlled open state</td>
            </tr>
            <tr>
              <td>
                <code>onOpenChange</code>
              </td>
              <td>(open: boolean) =&gt; void</td>
              <td>-</td>
              <td>Open state change handler</td>
            </tr>
            <tr>
              <td>
                <code>position</code>
              </td>
              <td>
                "top" | "bottom" | "left" | "right" | "top-start" | etc.
              </td>
              <td>"bottom-start"</td>
              <td>Menu position relative to trigger</td>
            </tr>
            <tr>
              <td>
                <code>closeOnSelect</code>
              </td>
              <td>boolean</td>
              <td>true</td>
              <td>Close menu when item selected</td>
            </tr>
            <tr>
              <td>
                <code>closeOnOutsideClick</code>
              </td>
              <td>boolean</td>
              <td>true</td>
              <td>Close when clicking outside</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Sub-Components</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>LuminoMenu.Item</code>
              </td>
              <td>Clickable menu item</td>
            </tr>
            <tr>
              <td>
                <code>LuminoMenu.Header</code>
              </td>
              <td>Non-interactive header</td>
            </tr>
            <tr>
              <td>
                <code>LuminoMenu.Divider</code>
              </td>
              <td>Visual separator</td>
            </tr>
            <tr>
              <td>
                <code>LuminoMenu.Group</code>
              </td>
              <td>Grouped items with label</td>
            </tr>
            <tr>
              <td>
                <code>LuminoMenu.Sub</code>
              </td>
              <td>Nested submenu</td>
            </tr>
            <tr>
              <td>
                <code>LuminoMenu.CheckItem</code>
              </td>
              <td>Checkable menu item</td>
            </tr>
            <tr>
              <td>
                <code>LuminoMenu.RadioGroup</code>
              </td>
              <td>Radio button group</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoMenu, LuminoButton } from "lumino/react";

function BasicMenu() {
  return (
    <LuminoMenu
      trigger={<LuminoButton>Open Menu</LuminoButton>}
    >
      <LuminoMenu.Item onClick={() => console.log("New")}>
        New File
      </LuminoMenu.Item>
      <LuminoMenu.Item onClick={() => console.log("Open")}>
        Open File
      </LuminoMenu.Item>
      <LuminoMenu.Item onClick={() => console.log("Save")}>
        Save
      </LuminoMenu.Item>
      <LuminoMenu.Divider />
      <LuminoMenu.Item onClick={() => console.log("Exit")}>
        Exit
      </LuminoMenu.Item>
    </LuminoMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Icons</h2>
        <pre className="docs-code">{`function MenuWithIcons() {
  return (
    <LuminoMenu
      trigger={<LuminoButton leftIcon="menu">Actions</LuminoButton>}
    >
      <LuminoMenu.Item icon="file-plus">New File</LuminoMenu.Item>
      <LuminoMenu.Item icon="folder-open">Open</LuminoMenu.Item>
      <LuminoMenu.Item icon="save">Save</LuminoMenu.Item>
      <LuminoMenu.Item icon="download">Download</LuminoMenu.Item>
      <LuminoMenu.Divider />
      <LuminoMenu.Item icon="trash" color="error">
        Delete
      </LuminoMenu.Item>
    </LuminoMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Keyboard Shortcuts</h2>
        <pre className="docs-code">{`function MenuWithShortcuts() {
  return (
    <LuminoMenu trigger={<LuminoButton>Edit</LuminoButton>}>
      <LuminoMenu.Item icon="scissors" shortcut="Ctrl+X">
        Cut
      </LuminoMenu.Item>
      <LuminoMenu.Item icon="copy" shortcut="Ctrl+C">
        Copy
      </LuminoMenu.Item>
      <LuminoMenu.Item icon="clipboard" shortcut="Ctrl+V">
        Paste
      </LuminoMenu.Item>
      <LuminoMenu.Divider />
      <LuminoMenu.Item icon="rotate-ccw" shortcut="Ctrl+Z">
        Undo
      </LuminoMenu.Item>
      <LuminoMenu.Item icon="rotate-cw" shortcut="Ctrl+Y">
        Redo
      </LuminoMenu.Item>
    </LuminoMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Submenu</h2>
        <pre className="docs-code">{`function MenuWithSubmenu() {
  return (
    <LuminoMenu trigger={<LuminoButton>File</LuminoButton>}>
      <LuminoMenu.Item>New</LuminoMenu.Item>
      <LuminoMenu.Item>Open</LuminoMenu.Item>

      <LuminoMenu.Sub label="Export As">
        <LuminoMenu.Item>PDF</LuminoMenu.Item>
        <LuminoMenu.Item>Word Document</LuminoMenu.Item>
        <LuminoMenu.Item>Plain Text</LuminoMenu.Item>
        <LuminoMenu.Sub label="Image">
          <LuminoMenu.Item>PNG</LuminoMenu.Item>
          <LuminoMenu.Item>JPEG</LuminoMenu.Item>
          <LuminoMenu.Item>SVG</LuminoMenu.Item>
        </LuminoMenu.Sub>
      </LuminoMenu.Sub>

      <LuminoMenu.Divider />
      <LuminoMenu.Item>Close</LuminoMenu.Item>
    </LuminoMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Groups</h2>
        <pre className="docs-code">{`function MenuWithGroups() {
  return (
    <LuminoMenu trigger={<LuminoButton>View</LuminoButton>}>
      <LuminoMenu.Group label="Layout">
        <LuminoMenu.Item>Single Column</LuminoMenu.Item>
        <LuminoMenu.Item>Two Columns</LuminoMenu.Item>
        <LuminoMenu.Item>Grid</LuminoMenu.Item>
      </LuminoMenu.Group>

      <LuminoMenu.Group label="Zoom">
        <LuminoMenu.Item>Zoom In</LuminoMenu.Item>
        <LuminoMenu.Item>Zoom Out</LuminoMenu.Item>
        <LuminoMenu.Item>Reset Zoom</LuminoMenu.Item>
      </LuminoMenu.Group>

      <LuminoMenu.Group label="Panels">
        <LuminoMenu.Item>Show Sidebar</LuminoMenu.Item>
        <LuminoMenu.Item>Show Console</LuminoMenu.Item>
      </LuminoMenu.Group>
    </LuminoMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Checkable Items</h2>
        <pre className="docs-code">{`function MenuWithCheckItems() {
  const [showToolbar, setShowToolbar] = useState(true);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);

  return (
    <LuminoMenu trigger={<LuminoButton>View</LuminoButton>}>
      <LuminoMenu.CheckItem
        checked={showToolbar}
        onCheckedChange={setShowToolbar}
      >
        Show Toolbar
      </LuminoMenu.CheckItem>
      <LuminoMenu.CheckItem
        checked={showStatusBar}
        onCheckedChange={setShowStatusBar}
      >
        Show Status Bar
      </LuminoMenu.CheckItem>
      <LuminoMenu.CheckItem
        checked={wordWrap}
        onCheckedChange={setWordWrap}
      >
        Word Wrap
      </LuminoMenu.CheckItem>
    </LuminoMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Radio Group</h2>
        <pre className="docs-code">{`function MenuWithRadioGroup() {
  const [fontSize, setFontSize] = useState("medium");

  return (
    <LuminoMenu trigger={<LuminoButton>Font Size</LuminoButton>}>
      <LuminoMenu.RadioGroup value={fontSize} onValueChange={setFontSize}>
        <LuminoMenu.RadioItem value="small">Small</LuminoMenu.RadioItem>
        <LuminoMenu.RadioItem value="medium">Medium</LuminoMenu.RadioItem>
        <LuminoMenu.RadioItem value="large">Large</LuminoMenu.RadioItem>
        <LuminoMenu.RadioItem value="xlarge">Extra Large</LuminoMenu.RadioItem>
      </LuminoMenu.RadioGroup>
    </LuminoMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Context Menu</h2>
        <pre className="docs-code">{`import { LuminoContextMenu } from "lumino/react";

function ContextMenuExample() {
  return (
    <LuminoContextMenu>
      <LuminoContextMenu.Trigger>
        <div className="context-area" style={{
          width: 300,
          height: 200,
          border: "1px dashed #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          Right-click here
        </div>
      </LuminoContextMenu.Trigger>

      <LuminoContextMenu.Content>
        <LuminoMenu.Item icon="copy">Copy</LuminoMenu.Item>
        <LuminoMenu.Item icon="clipboard">Paste</LuminoMenu.Item>
        <LuminoMenu.Divider />
        <LuminoMenu.Item icon="edit">Edit</LuminoMenu.Item>
        <LuminoMenu.Item icon="trash" color="error">Delete</LuminoMenu.Item>
      </LuminoContextMenu.Content>
    </LuminoContextMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Menu Positions</h2>
        <pre className="docs-code">{`// Bottom (default)
<LuminoMenu position="bottom-start" trigger={...}>
  {/* ... */}
</LuminoMenu>

// Top
<LuminoMenu position="top-start" trigger={...}>
  {/* ... */}
</LuminoMenu>

// Right
<LuminoMenu position="right-start" trigger={...}>
  {/* ... */}
</LuminoMenu>

// Left
<LuminoMenu position="left-start" trigger={...}>
  {/* ... */}
</LuminoMenu>

// Centered variations
<LuminoMenu position="bottom" trigger={...}>
  {/* Centered below trigger */}
</LuminoMenu>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Disabled Items</h2>
        <pre className="docs-code">{`function MenuWithDisabledItems() {
  const canDelete = false;
  const canEdit = true;

  return (
    <LuminoMenu trigger={<LuminoIconButton icon="more-vertical" />}>
      <LuminoMenu.Item icon="eye">View</LuminoMenu.Item>
      <LuminoMenu.Item icon="edit" disabled={!canEdit}>
        Edit
      </LuminoMenu.Item>
      <LuminoMenu.Item icon="copy">Duplicate</LuminoMenu.Item>
      <LuminoMenu.Divider />
      <LuminoMenu.Item
        icon="trash"
        color="error"
        disabled={!canDelete}
      >
        Delete
      </LuminoMenu.Item>
    </LuminoMenu>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class UserListPage extends Page {
  configure() {
    this.setTitle("Users");

    // Table with row actions menu
    this.addComponent(LuminoTable)
      .props({
        columns: [
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          {
            key: "actions",
            label: "",
            render: (row) => (
              <LuminoMenu
                trigger={<LuminoIconButton icon="more-vertical" size="sm" />}
              >
                <LuminoMenu.Item
                  icon="eye"
                  onClick={() => this.viewUser(row.id)}
                >
                  View
                </LuminoMenu.Item>
                <LuminoMenu.Item
                  icon="edit"
                  onClick={() => this.editUser(row.id)}
                >
                  Edit
                </LuminoMenu.Item>
                <LuminoMenu.Divider />
                <LuminoMenu.Item
                  icon="trash"
                  color="error"
                  onClick={() => this.deleteUser(row.id)}
                >
                  Delete
                </LuminoMenu.Item>
              </LuminoMenu>
            ),
          },
        ],
      })
      .dataBind("users")
      .endComponent();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Keep menus focused</strong> - Group related actions together
          </li>
          <li>
            <strong>Use icons consistently</strong> - Either all items have
            icons or none
          </li>
          <li>
            <strong>Show keyboard shortcuts</strong> - For power users
          </li>
          <li>
            <strong>Limit submenu depth</strong> - No more than 2 levels
          </li>
          <li>
            <strong>Use dividers sparingly</strong> - Only between distinct
            groups
          </li>
          <li>
            <strong>Dangerous actions last</strong> - Place delete/destructive
            actions at bottom
          </li>
        </ul>
      </div>
    </div>
  );
}
