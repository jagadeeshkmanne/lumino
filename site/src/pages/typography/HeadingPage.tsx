/**
 * Heading Component Page
 *
 * Documents the LuminoH1, LuminoH2, LuminoH3, LuminoH4 typography components.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoH1, LuminoH2, LuminoH3, LuminoH4, LuminoStackLayout, LuminoText } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function HeadingDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoH1>Heading 1</LuminoH1>
      <LuminoH2>Heading 2</LuminoH2>
      <LuminoH3>Heading 3</LuminoH3>
      <LuminoH4>Heading 4</LuminoH4>
    </LuminoStackLayout>
  );
}

function HeadingStylesDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoH2>Default Heading</LuminoH2>
      <LuminoH2 styleAs="h1">H2 styled as H1</LuminoH2>
      <LuminoH2 styleAs="h3">H2 styled as H3</LuminoH2>
      <LuminoH2 styleAs="h4">H2 styled as H4</LuminoH2>
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCode = `import { LuminoH1, LuminoH2, LuminoH3, LuminoH4, LuminoStackLayout } from "lumino/react";

function HeadingDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoH1>Heading 1</LuminoH1>
      <LuminoH2>Heading 2</LuminoH2>
      <LuminoH3>Heading 3</LuminoH3>
      <LuminoH4>Heading 4</LuminoH4>
    </LuminoStackLayout>
  );
}`;

const stylesCode = `import { LuminoH2, LuminoStackLayout } from "lumino/react";

function HeadingStylesDemo() {
  return (
    <LuminoStackLayout gap={2}>
      <LuminoH2>Default Heading</LuminoH2>
      <LuminoH2 styleAs="h1">H2 styled as H1</LuminoH2>
      <LuminoH2 styleAs="h3">H2 styled as H3</LuminoH2>
      <LuminoH2 styleAs="h4">H2 styled as H4</LuminoH2>
    </LuminoStackLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function HeadingPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Heading</h1>
      <p className="docs-page-subtitle">
        Typography heading components for rendering semantic HTML heading elements (h1-h4)
        with consistent styling.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoH1, LuminoH2, LuminoH3, LuminoH4 } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Headings</h2>
        <p>Use heading components for different levels of content hierarchy:</p>
        <LiveDemo
          title="Heading Levels"
          description="H1 through H4 heading components"
          code={basicCode}
        >
          <HeadingDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Visual Styling</h2>
        <p>Use <code>styleAs</code> to change visual appearance while keeping semantic level:</p>
        <LiveDemo
          title="styleAs Prop"
          description="H2 elements styled as different heading sizes"
          code={stylesCode}
        >
          <HeadingStylesDemo />
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
              <td>Heading content</td>
            </tr>
            <tr>
              <td><code>styleAs</code></td>
              <td>"h1" | "h2" | "h3" | "h4"</td>
              <td>-</td>
              <td>Override visual level (keeps semantic level)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Component Usage</h2>
        <pre className="docs-code">{`import { LuminoH1, LuminoH2, LuminoH3, LuminoH4 } from "lumino/react";

// Basic usage
<LuminoH1>Main Page Title</LuminoH1>
<LuminoH2>Section Title</LuminoH2>
<LuminoH3>Subsection Title</LuminoH3>
<LuminoH4>Minor Title</LuminoH4>

// Visual override - semantic h2, styled as h1
<LuminoH2 styleAs="h1">
  Looks like H1, semantic H2
</LuminoH2>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Header Pattern</h2>
        <pre className="docs-code">{`import { LuminoH1, LuminoText, LuminoStackLayout } from "lumino/react";

function PageHeader({ title, subtitle }) {
  return (
    <LuminoStackLayout gap={1}>
      <LuminoH1>{title}</LuminoH1>
      {subtitle && (
        <LuminoText styleAs="label">{subtitle}</LuminoText>
      )}
    </LuminoStackLayout>
  );
}

// Usage
<PageHeader
  title="User Management"
  subtitle="Manage your team members and their permissions"
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// Proper heading hierarchy
<main>
  <LuminoH1>Page Title</LuminoH1>

  <section>
    <LuminoH2>First Section</LuminoH2>
    <LuminoText>Content...</LuminoText>

    <article>
      <LuminoH3>Subsection</LuminoH3>
      <LuminoText>More content...</LuminoText>
    </article>
  </section>

  <section>
    <LuminoH2>Second Section</LuminoH2>
    <LuminoText>Content...</LuminoText>
  </section>
</main>

// DO: Maintain sequential heading levels
// DON'T: Skip levels (h1 → h3)`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>One h1 per page</strong> - Use only one h1 as the main page
            title
          </li>
          <li>
            <strong>Sequential levels</strong> - Don't skip heading levels (h1
            → h2 → h3)
          </li>
          <li>
            <strong>Meaningful text</strong> - Headings should describe the
            content that follows
          </li>
          <li>
            <strong>Use styleAs for styling</strong> - Keep semantic level, change
            visual appearance
          </li>
          <li>
            <strong>Keep it concise</strong> - Headings should be brief and
            descriptive
          </li>
        </ul>
      </div>
    </div>
  );
}
