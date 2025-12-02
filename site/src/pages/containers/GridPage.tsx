/**
 * Grid Container Page
 *
 * Documents the LuminoGridLayout component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoGridLayout, LuminoGridItem, LuminoText, LuminoCard } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BasicGridDemo() {
  return (
    <LuminoGridLayout columns={3} gap={2}>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Column 1</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Column 2</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Column 3</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
    </LuminoGridLayout>
  );
}

function SpanningGridDemo() {
  return (
    <LuminoGridLayout columns={12} gap={2}>
      <LuminoGridItem colSpan={8}>
        <LuminoCard>
          <LuminoText>Main Content (8 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem colSpan={4}>
        <LuminoCard>
          <LuminoText>Sidebar (4 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem colSpan={4}>
        <LuminoCard>
          <LuminoText>Box 1 (4 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem colSpan={4}>
        <LuminoCard>
          <LuminoText>Box 2 (4 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem colSpan={4}>
        <LuminoCard>
          <LuminoText>Box 3 (4 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
    </LuminoGridLayout>
  );
}

function RowSpanDemo() {
  return (
    <LuminoGridLayout columns={4} gap={2}>
      <LuminoGridItem rowSpan={2}>
        <LuminoCard style={{ height: "100%" }}>
          <LuminoText>Tall Item (spans 2 rows)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 1</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 2</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 3</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 4</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 5</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 6</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
    </LuminoGridLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicGridCode = `import { LuminoGridLayout, LuminoGridItem, LuminoText, LuminoCard } from "lumino/react";

function BasicGridDemo() {
  return (
    <LuminoGridLayout columns={3} gap={2}>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Column 1</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Column 2</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Column 3</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
    </LuminoGridLayout>
  );
}`;

const spanningGridCode = `import { LuminoGridLayout, LuminoGridItem, LuminoText, LuminoCard } from "lumino/react";

function SpanningGridDemo() {
  return (
    <LuminoGridLayout columns={12} gap={2}>
      <LuminoGridItem colSpan={8}>
        <LuminoCard>
          <LuminoText>Main Content (8 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem colSpan={4}>
        <LuminoCard>
          <LuminoText>Sidebar (4 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem colSpan={4}>
        <LuminoCard>
          <LuminoText>Box 1 (4 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem colSpan={4}>
        <LuminoCard>
          <LuminoText>Box 2 (4 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem colSpan={4}>
        <LuminoCard>
          <LuminoText>Box 3 (4 columns)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
    </LuminoGridLayout>
  );
}`;

const rowSpanCode = `import { LuminoGridLayout, LuminoGridItem, LuminoText, LuminoCard } from "lumino/react";

function RowSpanDemo() {
  return (
    <LuminoGridLayout columns={4} gap={2}>
      <LuminoGridItem rowSpan={2}>
        <LuminoCard style={{ height: "100%" }}>
          <LuminoText>Tall Item (spans 2 rows)</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 1</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 2</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 3</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 4</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 5</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
      <LuminoGridItem>
        <LuminoCard>
          <LuminoText>Item 6</LuminoText>
        </LuminoCard>
      </LuminoGridItem>
    </LuminoGridLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function GridPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Grid Layout</h1>
      <p className="docs-page-subtitle">
        A responsive grid layout component for arranging content in rows and columns.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoGridLayout, LuminoGridItem } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Interactive Demos</h2>
      </div>

      <div className="docs-section">
        <h3>1. Basic Grid</h3>
        <p>A simple 3-column grid with equal-width columns:</p>
        <LiveDemo
          title="Basic 3-Column Grid"
          description="Equal width columns with gap"
          code={basicGridCode}
        >
          <BasicGridDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h3>2. Column Spanning</h3>
        <p>Use colSpan to create items that span multiple columns:</p>
        <LiveDemo
          title="12-Column Grid with Spanning"
          description="Items spanning different numbers of columns"
          code={spanningGridCode}
        >
          <SpanningGridDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h3>3. Row Spanning</h3>
        <p>Use rowSpan to create items that span multiple rows:</p>
        <LiveDemo
          title="Grid with Row Spanning"
          description="Items spanning multiple rows"
          code={rowSpanCode}
        >
          <RowSpanDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>LuminoGridLayout Props</h2>
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
              <td><code>columns</code></td>
              <td>number | string</td>
              <td>12</td>
              <td>Number of columns in the grid</td>
            </tr>
            <tr>
              <td><code>rows</code></td>
              <td>number | string</td>
              <td>1</td>
              <td>Number of rows in the grid</td>
            </tr>
            <tr>
              <td><code>gap</code></td>
              <td>number | string</td>
              <td>3</td>
              <td>Gap between grid items (density multiplier)</td>
            </tr>
            <tr>
              <td><code>columnGap</code></td>
              <td>number | string</td>
              <td>-</td>
              <td>Horizontal gap between columns</td>
            </tr>
            <tr>
              <td><code>rowGap</code></td>
              <td>number | string</td>
              <td>-</td>
              <td>Vertical gap between rows</td>
            </tr>
            <tr>
              <td><code>margin</code></td>
              <td>number | string</td>
              <td>0</td>
              <td>Margin around the grid</td>
            </tr>
            <tr>
              <td><code>padding</code></td>
              <td>number | string</td>
              <td>0</td>
              <td>Padding within the grid</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>LuminoGridItem Props</h2>
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
              <td><code>colSpan</code></td>
              <td>number | "auto"</td>
              <td>"auto"</td>
              <td>Number of columns to span</td>
            </tr>
            <tr>
              <td><code>rowSpan</code></td>
              <td>number | "auto"</td>
              <td>"auto"</td>
              <td>Number of rows to span</td>
            </tr>
            <tr>
              <td><code>horizontalAlignment</code></td>
              <td>"start" | "center" | "end" | "stretch"</td>
              <td>"stretch"</td>
              <td>Horizontal alignment within cell</td>
            </tr>
            <tr>
              <td><code>verticalAlignment</code></td>
              <td>"start" | "center" | "end" | "stretch"</td>
              <td>"stretch"</td>
              <td>Vertical alignment within cell</td>
            </tr>
            <tr>
              <td><code>margin</code></td>
              <td>number | string</td>
              <td>0</td>
              <td>Margin around the item</td>
            </tr>
            <tr>
              <td><code>padding</code></td>
              <td>number | string</td>
              <td>0</td>
              <td>Padding within the item</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoGridLayout, LuminoGridItem } from "lumino/react";

function BasicGrid() {
  return (
    <LuminoGridLayout columns={12} gap={2}>
      <LuminoGridItem colSpan={4}>Column 1 (4/12)</LuminoGridItem>
      <LuminoGridItem colSpan={4}>Column 2 (4/12)</LuminoGridItem>
      <LuminoGridItem colSpan={4}>Column 3 (4/12)</LuminoGridItem>
    </LuminoGridLayout>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class UserForm extends Form<User> {
  configure() {
    this.addSection("User Details")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .endField()
        .layout([1, 1])  // Equal columns via Form builder
      .endRow()
    .endSection();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use 12-column grids</strong> - Provides flexibility for common
            layouts (halves, thirds, quarters)
          </li>
          <li>
            <strong>Design mobile-first</strong> - Start with single column and
            add responsive breakpoints
          </li>
          <li>
            <strong>Consistent gaps</strong> - Use density multipliers (1, 2, 3) for spacing
          </li>
          <li>
            <strong>Avoid deep nesting</strong> - Nested grids can become hard to
            maintain
          </li>
        </ul>
      </div>
    </div>
  );
}
