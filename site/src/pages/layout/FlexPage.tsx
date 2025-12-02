/**
 * Flex Component Page
 *
 * Documents the LuminoFlowLayout component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoFlowLayout, LuminoStackLayout, LuminoCard, LuminoCardContent, LuminoText, LuminoButton, LuminoH4 } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function FlowLayoutDemo() {
  return (
    <LuminoFlowLayout gap={2}>
      <LuminoButton>Button 1</LuminoButton>
      <LuminoButton>Button 2</LuminoButton>
      <LuminoButton>Button 3</LuminoButton>
      <LuminoButton>Button 4</LuminoButton>
      <LuminoButton>Button 5</LuminoButton>
    </LuminoFlowLayout>
  );
}

function JustifyDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoText variant="secondary">justify="start" (default)</LuminoText>
      <LuminoFlowLayout gap={2} justify="start" style={{ background: "var(--salt-palette-neutral-secondary-background)", padding: "8px" }}>
        <LuminoButton>A</LuminoButton>
        <LuminoButton>B</LuminoButton>
        <LuminoButton>C</LuminoButton>
      </LuminoFlowLayout>

      <LuminoText variant="secondary">justify="center"</LuminoText>
      <LuminoFlowLayout gap={2} justify="center" style={{ background: "var(--salt-palette-neutral-secondary-background)", padding: "8px" }}>
        <LuminoButton>A</LuminoButton>
        <LuminoButton>B</LuminoButton>
        <LuminoButton>C</LuminoButton>
      </LuminoFlowLayout>

      <LuminoText variant="secondary">justify="end"</LuminoText>
      <LuminoFlowLayout gap={2} justify="end" style={{ background: "var(--salt-palette-neutral-secondary-background)", padding: "8px" }}>
        <LuminoButton>A</LuminoButton>
        <LuminoButton>B</LuminoButton>
        <LuminoButton>C</LuminoButton>
      </LuminoFlowLayout>

      <LuminoText variant="secondary">justify="space-between"</LuminoText>
      <LuminoFlowLayout gap={2} justify="space-between" style={{ background: "var(--salt-palette-neutral-secondary-background)", padding: "8px" }}>
        <LuminoButton>A</LuminoButton>
        <LuminoButton>B</LuminoButton>
        <LuminoButton>C</LuminoButton>
      </LuminoFlowLayout>
    </LuminoStackLayout>
  );
}

function WrappingDemo() {
  const tags = ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Node.js", "Express", "MongoDB", "PostgreSQL", "Redis"];
  return (
    <LuminoFlowLayout gap={1}>
      {tags.map((tag) => (
        <LuminoButton key={tag} variant="secondary">
          {tag}
        </LuminoButton>
      ))}
    </LuminoFlowLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const flowLayoutCode = `import { LuminoFlowLayout, LuminoButton } from "lumino/react";

function FlowLayoutDemo() {
  return (
    <LuminoFlowLayout gap={2}>
      <LuminoButton>Button 1</LuminoButton>
      <LuminoButton>Button 2</LuminoButton>
      <LuminoButton>Button 3</LuminoButton>
      <LuminoButton>Button 4</LuminoButton>
      <LuminoButton>Button 5</LuminoButton>
    </LuminoFlowLayout>
  );
}`;

const justifyCode = `import { LuminoFlowLayout, LuminoStackLayout, LuminoButton, LuminoText } from "lumino/react";

function JustifyDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoText variant="secondary">justify="start" (default)</LuminoText>
      <LuminoFlowLayout gap={2} justify="start">
        <LuminoButton>A</LuminoButton>
        <LuminoButton>B</LuminoButton>
        <LuminoButton>C</LuminoButton>
      </LuminoFlowLayout>

      <LuminoText variant="secondary">justify="center"</LuminoText>
      <LuminoFlowLayout gap={2} justify="center">
        <LuminoButton>A</LuminoButton>
        <LuminoButton>B</LuminoButton>
        <LuminoButton>C</LuminoButton>
      </LuminoFlowLayout>

      <LuminoText variant="secondary">justify="end"</LuminoText>
      <LuminoFlowLayout gap={2} justify="end">
        <LuminoButton>A</LuminoButton>
        <LuminoButton>B</LuminoButton>
        <LuminoButton>C</LuminoButton>
      </LuminoFlowLayout>

      <LuminoText variant="secondary">justify="space-between"</LuminoText>
      <LuminoFlowLayout gap={2} justify="space-between">
        <LuminoButton>A</LuminoButton>
        <LuminoButton>B</LuminoButton>
        <LuminoButton>C</LuminoButton>
      </LuminoFlowLayout>
    </LuminoStackLayout>
  );
}`;

const wrappingCode = `import { LuminoFlowLayout, LuminoButton } from "lumino/react";

function WrappingDemo() {
  const tags = ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Node.js", "Express", "MongoDB", "PostgreSQL", "Redis"];
  return (
    <LuminoFlowLayout gap={1}>
      {tags.map((tag) => (
        <LuminoButton key={tag} variant="secondary">
          {tag}
        </LuminoButton>
      ))}
    </LuminoFlowLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function FlexPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Flex (Flow Layout)</h1>
      <p className="docs-page-subtitle">
        A flexible layout component for creating responsive row-based layouts
        with automatic wrapping.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoFlowLayout } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Flow Layout</h2>
        <p>Items flow horizontally and wrap to new lines:</p>
        <LiveDemo
          title="Flow Layout"
          description="Items arranged in a flowing row"
          code={flowLayoutCode}
        >
          <FlowLayoutDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Justify Content</h2>
        <p>Use <code>justify</code> to control horizontal distribution:</p>
        <LiveDemo
          title="Justify Options"
          description="Different justify-content values"
          code={justifyCode}
        >
          <JustifyDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Wrapping Items</h2>
        <p>Items automatically wrap when they exceed container width:</p>
        <LiveDemo
          title="Wrapping"
          description="Items wrap to multiple rows"
          code={wrappingCode}
        >
          <WrappingDemo />
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
              <td><code>gap</code></td>
              <td>number (0-3)</td>
              <td>0</td>
              <td>Gap between items</td>
            </tr>
            <tr>
              <td><code>justify</code></td>
              <td>"start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"</td>
              <td>"start"</td>
              <td>Horizontal alignment</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoFlowLayout } from "lumino/react";

// Basic flow layout
<LuminoFlowLayout gap={2}>
  <LuminoButton>Button 1</LuminoButton>
  <LuminoButton>Button 2</LuminoButton>
  <LuminoButton>Button 3</LuminoButton>
</LuminoFlowLayout>

// Centered items
<LuminoFlowLayout gap={2} justify="center">
  <LuminoButton>Button 1</LuminoButton>
  <LuminoButton>Button 2</LuminoButton>
</LuminoFlowLayout>

// Space between
<LuminoFlowLayout gap={2} justify="space-between">
  <LuminoButton>Left</LuminoButton>
  <LuminoButton>Right</LuminoButton>
</LuminoFlowLayout>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>
        <pre className="docs-code">{`import { LuminoFlowLayout, LuminoButton } from "lumino/react";

// Tag cloud
<LuminoFlowLayout gap={1}>
  {tags.map((tag) => (
    <LuminoBadge key={tag}>{tag}</LuminoBadge>
  ))}
</LuminoFlowLayout>

// Toolbar
<LuminoFlowLayout gap={1} justify="space-between">
  <LuminoFlowLayout gap={1}>
    <LuminoButton>New</LuminoButton>
    <LuminoButton>Edit</LuminoButton>
    <LuminoButton>Delete</LuminoButton>
  </LuminoFlowLayout>
  <LuminoFlowLayout gap={1}>
    <LuminoButton>Export</LuminoButton>
    <LuminoButton>Settings</LuminoButton>
  </LuminoFlowLayout>
</LuminoFlowLayout>

// Card footer actions
<LuminoFlowLayout gap={1} justify="end">
  <LuminoButton variant="secondary">Cancel</LuminoButton>
  <LuminoButton variant="cta">Save</LuminoButton>
</LuminoFlowLayout>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use FlowLayout for wrapping content</strong> - Tags, buttons,
            and other inline items
          </li>
          <li>
            <strong>Use StackLayout for structured layouts</strong> - Forms,
            cards, and page sections
          </li>
          <li>
            <strong>Consistent gap values</strong> - Use the spacing scale for
            visual harmony
          </li>
          <li>
            <strong>Combine with StackLayout</strong> - Nest layouts for complex
            arrangements
          </li>
        </ul>
      </div>
    </div>
  );
}
