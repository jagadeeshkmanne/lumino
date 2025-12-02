/**
 * Table Container Page
 *
 * Documents the LuminoDataTable component with live demos.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import {
  LuminoDataTable,
  LuminoTHead,
  LuminoTBody,
  LuminoTR,
  LuminoTH,
  LuminoTD,
  LuminoStackLayout,
  LuminoText,
} from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BasicTableDemo() {
  return (
    <LuminoDataTable>
      <LuminoTHead>
        <LuminoTR>
          <LuminoTH>Name</LuminoTH>
          <LuminoTH>Email</LuminoTH>
          <LuminoTH>Role</LuminoTH>
        </LuminoTR>
      </LuminoTHead>
      <LuminoTBody>
        <LuminoTR>
          <LuminoTD>John Doe</LuminoTD>
          <LuminoTD>john@example.com</LuminoTD>
          <LuminoTD>Admin</LuminoTD>
        </LuminoTR>
        <LuminoTR>
          <LuminoTD>Jane Smith</LuminoTD>
          <LuminoTD>jane@example.com</LuminoTD>
          <LuminoTD>User</LuminoTD>
        </LuminoTR>
        <LuminoTR>
          <LuminoTD>Bob Johnson</LuminoTD>
          <LuminoTD>bob@example.com</LuminoTD>
          <LuminoTD>Manager</LuminoTD>
        </LuminoTR>
      </LuminoTBody>
    </LuminoDataTable>
  );
}

function DynamicTableDemo() {
  const users = [
    { id: 1, name: "Alice Brown", department: "Engineering", status: "Active" },
    { id: 2, name: "Charlie Davis", department: "Marketing", status: "Active" },
    { id: 3, name: "Diana Evans", department: "Sales", status: "On Leave" },
  ];

  return (
    <LuminoDataTable>
      <LuminoTHead>
        <LuminoTR>
          <LuminoTH>Name</LuminoTH>
          <LuminoTH>Department</LuminoTH>
          <LuminoTH>Status</LuminoTH>
        </LuminoTR>
      </LuminoTHead>
      <LuminoTBody>
        {users.map((user) => (
          <LuminoTR key={user.id}>
            <LuminoTD>{user.name}</LuminoTD>
            <LuminoTD>{user.department}</LuminoTD>
            <LuminoTD>{user.status}</LuminoTD>
          </LuminoTR>
        ))}
      </LuminoTBody>
    </LuminoDataTable>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicTableCode = `import { LuminoDataTable, LuminoTHead, LuminoTBody, LuminoTR, LuminoTH, LuminoTD } from "lumino/react";

function BasicTableDemo() {
  return (
    <LuminoDataTable>
      <LuminoTHead>
        <LuminoTR>
          <LuminoTH>Name</LuminoTH>
          <LuminoTH>Email</LuminoTH>
          <LuminoTH>Role</LuminoTH>
        </LuminoTR>
      </LuminoTHead>
      <LuminoTBody>
        <LuminoTR>
          <LuminoTD>John Doe</LuminoTD>
          <LuminoTD>john@example.com</LuminoTD>
          <LuminoTD>Admin</LuminoTD>
        </LuminoTR>
        <LuminoTR>
          <LuminoTD>Jane Smith</LuminoTD>
          <LuminoTD>jane@example.com</LuminoTD>
          <LuminoTD>User</LuminoTD>
        </LuminoTR>
        <LuminoTR>
          <LuminoTD>Bob Johnson</LuminoTD>
          <LuminoTD>bob@example.com</LuminoTD>
          <LuminoTD>Manager</LuminoTD>
        </LuminoTR>
      </LuminoTBody>
    </LuminoDataTable>
  );
}`;

const dynamicTableCode = `import { LuminoDataTable, LuminoTHead, LuminoTBody, LuminoTR, LuminoTH, LuminoTD } from "lumino/react";

function DynamicTableDemo() {
  const users = [
    { id: 1, name: "Alice Brown", department: "Engineering", status: "Active" },
    { id: 2, name: "Charlie Davis", department: "Marketing", status: "Active" },
    { id: 3, name: "Diana Evans", department: "Sales", status: "On Leave" },
  ];

  return (
    <LuminoDataTable>
      <LuminoTHead>
        <LuminoTR>
          <LuminoTH>Name</LuminoTH>
          <LuminoTH>Department</LuminoTH>
          <LuminoTH>Status</LuminoTH>
        </LuminoTR>
      </LuminoTHead>
      <LuminoTBody>
        {users.map((user) => (
          <LuminoTR key={user.id}>
            <LuminoTD>{user.name}</LuminoTD>
            <LuminoTD>{user.department}</LuminoTD>
            <LuminoTD>{user.status}</LuminoTD>
          </LuminoTR>
        ))}
      </LuminoTBody>
    </LuminoDataTable>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function TablePage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Table</h1>
      <p className="docs-page-subtitle">
        Semantic HTML table components for displaying tabular data with full control over structure.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoDataTable, LuminoTHead, LuminoTBody, LuminoTR, LuminoTH, LuminoTD } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Table</h2>
        <p>A simple table with header and body rows:</p>
        <LiveDemo
          title="Basic Table"
          description="Table with headers and data rows"
          code={basicTableCode}
        >
          <BasicTableDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Dynamic Table</h2>
        <p>Render table rows from an array of data:</p>
        <LiveDemo
          title="Dynamic Table"
          description="Table populated from array data"
          code={dynamicTableCode}
        >
          <DynamicTableDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Prop</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>LuminoDataTable</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Table sections (THead, TBody)</td>
            </tr>
            <tr>
              <td><code>LuminoTHead</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Header rows (TR elements)</td>
            </tr>
            <tr>
              <td><code>LuminoTBody</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Body rows (TR elements)</td>
            </tr>
            <tr>
              <td><code>LuminoTR</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Table cells (TH or TD)</td>
            </tr>
            <tr>
              <td><code>LuminoTH</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Header cell content</td>
            </tr>
            <tr>
              <td><code>LuminoTD</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Data cell content</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use semantic structure</strong> - Always use THead for headers
            and TBody for data rows
          </li>
          <li>
            <strong>Provide meaningful headers</strong> - Use TH elements to
            improve accessibility
          </li>
          <li>
            <strong>Consider responsive design</strong> - For mobile, consider
            horizontal scrolling or alternative layouts
          </li>
          <li>
            <strong>Keep tables focused</strong> - Don't display too many columns;
            prioritize the most important data
          </li>
        </ul>
      </div>
    </div>
  );
}
