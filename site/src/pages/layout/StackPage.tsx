/**
 * Stack Component Page
 *
 * Documents the LuminoStackLayout component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoStackLayout, LuminoFlowLayout, LuminoCard, LuminoCardContent, LuminoText, LuminoButton, LuminoDivider, LuminoH4 } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function VerticalStackDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoCard>
        <LuminoCardContent>
          <LuminoText>Card 1</LuminoText>
        </LuminoCardContent>
      </LuminoCard>
      <LuminoCard>
        <LuminoCardContent>
          <LuminoText>Card 2</LuminoText>
        </LuminoCardContent>
      </LuminoCard>
      <LuminoCard>
        <LuminoCardContent>
          <LuminoText>Card 3</LuminoText>
        </LuminoCardContent>
      </LuminoCard>
    </LuminoStackLayout>
  );
}

function HorizontalStackDemo() {
  return (
    <LuminoStackLayout direction="row" gap={2}>
      <LuminoButton>Button 1</LuminoButton>
      <LuminoButton>Button 2</LuminoButton>
      <LuminoButton>Button 3</LuminoButton>
    </LuminoStackLayout>
  );
}

function AlignmentDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoText variant="secondary">align="start"</LuminoText>
      <LuminoStackLayout direction="row" gap={2} align="start" style={{ minHeight: "60px", background: "var(--salt-palette-neutral-secondary-background)", padding: "8px" }}>
        <LuminoButton>Short</LuminoButton>
        <LuminoButton style={{ height: "50px" }}>Tall</LuminoButton>
      </LuminoStackLayout>

      <LuminoText variant="secondary">align="center"</LuminoText>
      <LuminoStackLayout direction="row" gap={2} align="center" style={{ minHeight: "60px", background: "var(--salt-palette-neutral-secondary-background)", padding: "8px" }}>
        <LuminoButton>Short</LuminoButton>
        <LuminoButton style={{ height: "50px" }}>Tall</LuminoButton>
      </LuminoStackLayout>

      <LuminoText variant="secondary">align="end"</LuminoText>
      <LuminoStackLayout direction="row" gap={2} align="end" style={{ minHeight: "60px", background: "var(--salt-palette-neutral-secondary-background)", padding: "8px" }}>
        <LuminoButton>Short</LuminoButton>
        <LuminoButton style={{ height: "50px" }}>Tall</LuminoButton>
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}

function WithDividerDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoH4>Section 1</LuminoH4>
      <LuminoText variant="secondary">Content for section one goes here.</LuminoText>
      <LuminoDivider />
      <LuminoH4>Section 2</LuminoH4>
      <LuminoText variant="secondary">Content for section two goes here.</LuminoText>
      <LuminoDivider />
      <LuminoH4>Section 3</LuminoH4>
      <LuminoText variant="secondary">Content for section three goes here.</LuminoText>
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const verticalCode = `import { LuminoStackLayout, LuminoCard, LuminoCardContent, LuminoText } from "lumino/react";

function VerticalStackDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoCard>
        <LuminoCardContent>
          <LuminoText>Card 1</LuminoText>
        </LuminoCardContent>
      </LuminoCard>
      <LuminoCard>
        <LuminoCardContent>
          <LuminoText>Card 2</LuminoText>
        </LuminoCardContent>
      </LuminoCard>
      <LuminoCard>
        <LuminoCardContent>
          <LuminoText>Card 3</LuminoText>
        </LuminoCardContent>
      </LuminoCard>
    </LuminoStackLayout>
  );
}`;

const horizontalCode = `import { LuminoStackLayout, LuminoButton } from "lumino/react";

function HorizontalStackDemo() {
  return (
    <LuminoStackLayout direction="row" gap={2}>
      <LuminoButton>Button 1</LuminoButton>
      <LuminoButton>Button 2</LuminoButton>
      <LuminoButton>Button 3</LuminoButton>
    </LuminoStackLayout>
  );
}`;

const alignmentCode = `import { LuminoStackLayout, LuminoButton, LuminoText } from "lumino/react";

function AlignmentDemo() {
  return (
    <LuminoStackLayout gap={3}>
      <LuminoText variant="secondary">align="start"</LuminoText>
      <LuminoStackLayout direction="row" gap={2} align="start" style={{ minHeight: "60px" }}>
        <LuminoButton>Short</LuminoButton>
        <LuminoButton style={{ height: "50px" }}>Tall</LuminoButton>
      </LuminoStackLayout>

      <LuminoText variant="secondary">align="center"</LuminoText>
      <LuminoStackLayout direction="row" gap={2} align="center" style={{ minHeight: "60px" }}>
        <LuminoButton>Short</LuminoButton>
        <LuminoButton style={{ height: "50px" }}>Tall</LuminoButton>
      </LuminoStackLayout>

      <LuminoText variant="secondary">align="end"</LuminoText>
      <LuminoStackLayout direction="row" gap={2} align="end" style={{ minHeight: "60px" }}>
        <LuminoButton>Short</LuminoButton>
        <LuminoButton style={{ height: "50px" }}>Tall</LuminoButton>
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}`;

const dividerCode = `import { LuminoStackLayout, LuminoH4, LuminoText, LuminoDivider } from "lumino/react";

function WithDividerDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoH4>Section 1</LuminoH4>
      <LuminoText variant="secondary">Content for section one goes here.</LuminoText>
      <LuminoDivider />
      <LuminoH4>Section 2</LuminoH4>
      <LuminoText variant="secondary">Content for section two goes here.</LuminoText>
      <LuminoDivider />
      <LuminoH4>Section 3</LuminoH4>
      <LuminoText variant="secondary">Content for section three goes here.</LuminoText>
    </LuminoStackLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function StackPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Stack</h1>
      <p className="docs-page-subtitle">
        A layout component for arranging children in a vertical or horizontal
        stack with consistent spacing.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoStackLayout } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Vertical Stack</h2>
        <p>The default direction stacks items vertically:</p>
        <LiveDemo
          title="Vertical Stack"
          description="Items stacked in a column"
          code={verticalCode}
        >
          <VerticalStackDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Horizontal Stack</h2>
        <p>Use <code>direction="row"</code> for horizontal layout:</p>
        <LiveDemo
          title="Horizontal Stack"
          description="Items arranged in a row"
          code={horizontalCode}
        >
          <HorizontalStackDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Alignment</h2>
        <p>Control cross-axis alignment with the <code>align</code> prop:</p>
        <LiveDemo
          title="Stack Alignment"
          description="Different alignment options"
          code={alignmentCode}
        >
          <AlignmentDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>With Dividers</h2>
        <p>Add visual separation between sections:</p>
        <LiveDemo
          title="Stack with Dividers"
          description="Sections separated by dividers"
          code={dividerCode}
        >
          <WithDividerDemo />
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
              <td><code>direction</code></td>
              <td>"row" | "column"</td>
              <td>"column"</td>
              <td>Stack direction</td>
            </tr>
            <tr>
              <td><code>gap</code></td>
              <td>number (0-3)</td>
              <td>0</td>
              <td>Gap between children</td>
            </tr>
            <tr>
              <td><code>align</code></td>
              <td>"start" | "center" | "end" | "stretch" | "baseline"</td>
              <td>"stretch"</td>
              <td>Cross-axis alignment</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoStackLayout } from "lumino/react";

// Vertical stack (default)
<LuminoStackLayout gap={2}>
  <LuminoCard>Card 1</LuminoCard>
  <LuminoCard>Card 2</LuminoCard>
  <LuminoCard>Card 3</LuminoCard>
</LuminoStackLayout>

// Horizontal stack
<LuminoStackLayout direction="row" gap={2}>
  <LuminoButton>Button 1</LuminoButton>
  <LuminoButton>Button 2</LuminoButton>
  <LuminoButton>Button 3</LuminoButton>
</LuminoStackLayout>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Form Layout Example</h2>
        <pre className="docs-code">{`import { LuminoStackLayout, LuminoTextInput, LuminoButton } from "lumino/react";

function ContactForm() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoStackLayout direction="row" gap={2}>
        <LuminoTextInput label="First Name" />
        <LuminoTextInput label="Last Name" />
      </LuminoStackLayout>
      <LuminoTextInput label="Email" type="email" />
      <LuminoTextArea label="Message" rows={4} />
      <LuminoStackLayout direction="row" gap={1}>
        <LuminoButton>Cancel</LuminoButton>
        <LuminoButton variant="cta">Send</LuminoButton>
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use consistent spacing</strong> - Stick to the gap scale
            for visual harmony
          </li>
          <li>
            <strong>Nest for complex layouts</strong> - Combine horizontal and
            vertical stacks
          </li>
          <li>
            <strong>Consider dividers</strong> - Visual separators can improve
            readability
          </li>
          <li>
            <strong>Prefer Stack over manual CSS</strong> - More maintainable
            and consistent
          </li>
        </ul>
      </div>
    </div>
  );
}
