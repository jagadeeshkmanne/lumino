/**
 * Text Component Page
 *
 * Documents the LuminoText component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoText, LuminoStackLayout, LuminoDivider } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function TextStylesDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Default body text</LuminoText>
      <LuminoText styleAs="label">Label style text</LuminoText>
      <LuminoText styleAs="display1">Display 1 style</LuminoText>
      <LuminoText styleAs="display2">Display 2 style</LuminoText>
      <LuminoText styleAs="display3">Display 3 style</LuminoText>
    </LuminoStackLayout>
  );
}

function TextVariantsDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Primary text (default)</LuminoText>
      <LuminoText variant="secondary">Secondary text</LuminoText>
      <LuminoDivider />
      <LuminoText styleAs="label">Primary Label</LuminoText>
      <LuminoText styleAs="label" variant="secondary">Secondary Label</LuminoText>
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const stylesCode = `import { LuminoText, LuminoStackLayout } from "lumino/react";

function TextStylesDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Default body text</LuminoText>
      <LuminoText styleAs="label">Label style text</LuminoText>
      <LuminoText styleAs="display1">Display 1 style</LuminoText>
      <LuminoText styleAs="display2">Display 2 style</LuminoText>
      <LuminoText styleAs="display3">Display 3 style</LuminoText>
    </LuminoStackLayout>
  );
}`;

const variantsCode = `import { LuminoText, LuminoStackLayout, LuminoDivider } from "lumino/react";

function TextVariantsDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Primary text (default)</LuminoText>
      <LuminoText variant="secondary">Secondary text</LuminoText>
      <LuminoDivider />
      <LuminoText styleAs="label">Primary Label</LuminoText>
      <LuminoText styleAs="label" variant="secondary">Secondary Label</LuminoText>
    </LuminoStackLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function TextPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Text</h1>
      <p className="docs-page-subtitle">
        A versatile text component for rendering paragraphs, descriptions, and
        inline text with consistent styling.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoText } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Text Styles</h2>
        <p>Use <code>styleAs</code> to apply different text styles:</p>
        <LiveDemo
          title="Text Styles"
          description="Different styleAs values"
          code={stylesCode}
        >
          <TextStylesDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Text Variants</h2>
        <p>Use <code>variant</code> for primary/secondary text colors:</p>
        <LiveDemo
          title="Text Variants"
          description="Primary and secondary variants"
          code={variantsCode}
        >
          <TextVariantsDemo />
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
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>-</td>
              <td>Text content</td>
            </tr>
            <tr>
              <td><code>styleAs</code></td>
              <td>"label" | "display1" | "display2" | "display3" | etc.</td>
              <td>-</td>
              <td>Visual text style</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td>"primary" | "secondary"</td>
              <td>"primary"</td>
              <td>Text color variant</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Apply disabled styling</td>
            </tr>
            <tr>
              <td><code>maxRows</code></td>
              <td>number</td>
              <td>-</td>
              <td>Maximum rows before truncation</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoText } from "lumino/react";

// Default body text
<LuminoText>
  This is a paragraph of text with default styling.
</LuminoText>

// Label text
<LuminoText styleAs="label">Form Label</LuminoText>

// Secondary text
<LuminoText variant="secondary">
  Secondary description text
</LuminoText>

// Display text (for large headings)
<LuminoText styleAs="display1">Large Display Text</LuminoText>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Truncation</h2>
        <pre className="docs-code">{`// Truncate to 2 lines
<LuminoText maxRows={2}>
  This text will show at most 2 lines and then truncate with
  an ellipsis if it exceeds that limit. This is useful for
  card previews and constrained layouts.
</LuminoText>

// Single line truncation
<LuminoText maxRows={1}>
  Very long text that will be truncated...
</LuminoText>`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Layout Components</h2>
        <pre className="docs-code">{`import { LuminoText, LuminoStackLayout, LuminoH1 } from "lumino/react";

function PageHeader({ title, description }) {
  return (
    <LuminoStackLayout gap={1}>
      <LuminoH1>{title}</LuminoH1>
      <LuminoText variant="secondary">
        {description}
      </LuminoText>
    </LuminoStackLayout>
  );
}

// Usage
<PageHeader
  title="User Management"
  description="Manage your team members and permissions"
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>
        <pre className="docs-code">{`// Form field label
<LuminoText styleAs="label">Email Address</LuminoText>

// Helper/description text
<LuminoText variant="secondary">
  We'll never share your email with anyone else.
</LuminoText>

// Card description with truncation
<LuminoText variant="secondary" maxRows={3}>
  {article.excerpt}
</LuminoText>

// Disabled state
<LuminoText disabled>This field is disabled</LuminoText>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use semantic styles</strong> - Use styleAs to match the
            content type (label for labels, etc.)
          </li>
          <li>
            <strong>Use variants for hierarchy</strong> - Primary for main content,
            secondary for supporting text
          </li>
          <li>
            <strong>Truncate responsibly</strong> - Use maxRows when space is
            constrained
          </li>
          <li>
            <strong>Combine with layout</strong> - Use LuminoStackLayout for
            proper spacing
          </li>
        </ul>
      </div>
    </div>
  );
}
