/**
 * Card Container Page
 *
 * Documents the LuminoCard component with live demos.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import {
  LuminoCard,
  LuminoCardHeader,
  LuminoCardContent,
  LuminoCardFooter,
  LuminoStackLayout,
  LuminoFlowLayout,
  LuminoText,
  LuminoButton,
  LuminoTextInput,
  LuminoH4,
} from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BasicCardDemo() {
  return (
    <LuminoCard>
      <LuminoCardHeader>
        <LuminoH4>User Details</LuminoH4>
      </LuminoCardHeader>
      <LuminoCardContent>
        <LuminoText>This is basic card content. Cards provide a container for grouping related information.</LuminoText>
      </LuminoCardContent>
    </LuminoCard>
  );
}

function CardWithFooterDemo() {
  return (
    <LuminoCard>
      <LuminoCardHeader>
        <LuminoH4>Contact Form</LuminoH4>
      </LuminoCardHeader>
      <LuminoCardContent>
        <LuminoStackLayout gap={2}>
          <LuminoTextInput label="Name" placeholder="Enter your name" />
          <LuminoTextInput label="Email" placeholder="you@example.com" />
        </LuminoStackLayout>
      </LuminoCardContent>
      <LuminoCardFooter>
        <LuminoButton variant="secondary">Cancel</LuminoButton>
        <LuminoButton variant="cta">Submit</LuminoButton>
      </LuminoCardFooter>
    </LuminoCard>
  );
}

function CardGridDemo() {
  const items = [
    { title: "Dashboard", description: "View your analytics and metrics" },
    { title: "Settings", description: "Configure your preferences" },
    { title: "Reports", description: "Generate and export reports" },
  ];

  return (
    <LuminoFlowLayout gap={2}>
      {items.map((item, index) => (
        <LuminoCard key={index} style={{ width: "200px" }}>
          <LuminoCardHeader>
            <LuminoH4>{item.title}</LuminoH4>
          </LuminoCardHeader>
          <LuminoCardContent>
            <LuminoText variant="secondary">{item.description}</LuminoText>
          </LuminoCardContent>
          <LuminoCardFooter>
            <LuminoButton variant="secondary">Open</LuminoButton>
          </LuminoCardFooter>
        </LuminoCard>
      ))}
    </LuminoFlowLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCardCode = `import { LuminoCard, LuminoCardHeader, LuminoCardContent, LuminoH4, LuminoText } from "lumino/react";

function BasicCardDemo() {
  return (
    <LuminoCard>
      <LuminoCardHeader>
        <LuminoH4>User Details</LuminoH4>
      </LuminoCardHeader>
      <LuminoCardContent>
        <LuminoText>This is basic card content. Cards provide a container for grouping related information.</LuminoText>
      </LuminoCardContent>
    </LuminoCard>
  );
}`;

const cardWithFooterCode = `import { LuminoCard, LuminoCardHeader, LuminoCardContent, LuminoCardFooter, LuminoStackLayout, LuminoTextInput, LuminoButton, LuminoH4 } from "lumino/react";

function CardWithFooterDemo() {
  return (
    <LuminoCard>
      <LuminoCardHeader>
        <LuminoH4>Contact Form</LuminoH4>
      </LuminoCardHeader>
      <LuminoCardContent>
        <LuminoStackLayout gap={2}>
          <LuminoTextInput label="Name" placeholder="Enter your name" />
          <LuminoTextInput label="Email" placeholder="you@example.com" />
        </LuminoStackLayout>
      </LuminoCardContent>
      <LuminoCardFooter>
        <LuminoButton variant="secondary">Cancel</LuminoButton>
        <LuminoButton variant="cta">Submit</LuminoButton>
      </LuminoCardFooter>
    </LuminoCard>
  );
}`;

const cardGridCode = `import { LuminoCard, LuminoCardHeader, LuminoCardContent, LuminoCardFooter, LuminoFlowLayout, LuminoH4, LuminoText, LuminoButton } from "lumino/react";

function CardGridDemo() {
  const items = [
    { title: "Dashboard", description: "View your analytics and metrics" },
    { title: "Settings", description: "Configure your preferences" },
    { title: "Reports", description: "Generate and export reports" },
  ];

  return (
    <LuminoFlowLayout gap={2}>
      {items.map((item, index) => (
        <LuminoCard key={index} style={{ width: "200px" }}>
          <LuminoCardHeader>
            <LuminoH4>{item.title}</LuminoH4>
          </LuminoCardHeader>
          <LuminoCardContent>
            <LuminoText variant="secondary">{item.description}</LuminoText>
          </LuminoCardContent>
          <LuminoCardFooter>
            <LuminoButton variant="secondary">Open</LuminoButton>
          </LuminoCardFooter>
        </LuminoCard>
      ))}
    </LuminoFlowLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function CardPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Card</h1>
      <p className="docs-page-subtitle">
        A versatile container component for grouping related content with
        optional headers, footers, and actions.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoCard, LuminoCardHeader, LuminoCardContent, LuminoCardFooter } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Card</h2>
        <p>A simple card with header and content:</p>
        <LiveDemo
          title="Basic Card"
          description="Card with header and content"
          code={basicCardCode}
        >
          <BasicCardDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Card with Footer</h2>
        <p>Card with header, content, and footer actions:</p>
        <LiveDemo
          title="Card with Footer"
          description="Complete card with form and actions"
          code={cardWithFooterCode}
        >
          <CardWithFooterDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Card Grid</h2>
        <p>Multiple cards in a grid layout:</p>
        <LiveDemo
          title="Card Grid"
          description="Cards arranged in a flow layout"
          code={cardGridCode}
        >
          <CardGridDemo />
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
              <td><code>LuminoCard</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Card content (header, content, footer)</td>
            </tr>
            <tr>
              <td><code>LuminoCard</code></td>
              <td><code>clickable</code></td>
              <td>boolean</td>
              <td>Enable hover effect</td>
            </tr>
            <tr>
              <td><code>LuminoCardHeader</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Header content (typically a title)</td>
            </tr>
            <tr>
              <td><code>LuminoCardContent</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Main card content</td>
            </tr>
            <tr>
              <td><code>LuminoCardFooter</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>Footer content (usually actions)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use meaningful titles</strong> - Help users understand the
            card's purpose at a glance
          </li>
          <li>
            <strong>Consistent structure</strong> - Use Header, Content, Footer
            in that order for predictable layout
          </li>
          <li>
            <strong>Action placement</strong> - Primary actions in footer,
            contextual actions in header
          </li>
          <li>
            <strong>Don't overload</strong> - Keep card content focused;
            use multiple cards for distinct content
          </li>
        </ul>
      </div>
    </div>
  );
}
