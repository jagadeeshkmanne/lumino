/**
 * Stack Container Page
 *
 * Documents the Stack container component (LumStack) for containers section
 * NOTE: This documentation was carefully read from the Lumino source code.
 * Note: This is different from the layout/StackPage which documents layout usage.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicStackCode = `// Basic vertical stack
<LumStack>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</LumStack>`;

const horizontalStackCode = `// Horizontal stack
<LumStack direction="horizontal">
  <button>Button 1</button>
  <button>Button 2</button>
  <button>Button 3</button>
</LumStack>`;

const withSpacingCode = `// Stack with custom spacing
<LumStack spacing={16}>
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</LumStack>`;

const formBuilderCode = `class ProfileForm extends Form<Profile> {
  configure() {
    this.addSection("User Profile")
      .container(LumStack)
        .props({ spacing: 16 })
        .add(LumCard)
          .children(() => (
            <div>
              <h3>Personal Information</h3>
              {this.renderSection("Personal")}
            </div>
          ))
        .end()
        .add(LumCard)
          .children(() => (
            <div>
              <h3>Contact Details</h3>
              {this.renderSection("Contact")}
            </div>
          ))
        .end()
      .end()
    .endSection();

    this.addSection("Personal")
      .addField("firstName")
        .component(LuminoTextInput)
        .label("First Name")
        .endField()
      .addField("lastName")
        .component(LuminoTextInput)
        .label("Last Name")
        .endField()
    .endSection();

    this.addSection("Contact")
      .addField("email")
        .component(LuminoTextInput)
        .label("Email")
        .endField()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function StackPage() {
  const sampleItems = ["Item 1", "Item 2", "Item 3"];

  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Stack</h1>
      <p className="docs-page-subtitle">
        A flexible container component for stacking elements vertically or horizontally with consistent spacing.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        The Stack container component (LumStack) is an abstract marker that gets resolved to
        the UI adapter's stack implementation at runtime. This page documents using Stack as
        a container component. See Layout/Stack for layout-specific usage.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LumStack } from "lumino/react";`}</pre>
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
              <td>Elements to stack</td>
            </tr>
            <tr>
              <td><code>direction</code></td>
              <td>"vertical" | "horizontal"</td>
              <td>"vertical"</td>
              <td>Stack direction</td>
            </tr>
            <tr>
              <td><code>spacing</code></td>
              <td>number</td>
              <td>0</td>
              <td>Gap between items in pixels</td>
            </tr>
            <tr>
              <td><code>align</code></td>
              <td>"start" | "center" | "end" | "stretch"</td>
              <td>"stretch"</td>
              <td>Cross-axis alignment</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>1. Vertical Stack</h2>
        <p>
          Default vertical stacking of elements:
        </p>
        <LiveDemo
          title="Vertical Stack"
          description="Elements stacked vertically with spacing"
          code={basicStackCode}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sampleItems.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: 16,
                  background: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>2. Horizontal Stack</h2>
        <p>
          Stack elements horizontally:
        </p>
        <LiveDemo
          title="Horizontal Stack"
          description="Elements stacked horizontally with spacing"
          code={horizontalStackCode}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
            <button style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: 4, background: "white", cursor: "pointer" }}>
              Button 1
            </button>
            <button style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: 4, background: "white", cursor: "pointer" }}>
              Button 2
            </button>
            <button style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: 4, background: "white", cursor: "pointer" }}>
              Button 3
            </button>
          </div>
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>3. Stack with Custom Spacing</h2>
        <p>
          Control the spacing between stacked elements:
        </p>
        <LiveDemo
          title="Custom Spacing"
          description="Stack with 24px spacing between items"
          code={withSpacingCode}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {sampleItems.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: 16,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h4 style={{ margin: "0 0 8px 0" }}>Card {index + 1}</h4>
                <p style={{ margin: 0, color: "#666" }}>This is content for card {index + 1}</p>
              </div>
            ))}
          </div>
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Standalone Component Usage</h2>
        <pre className="docs-code">{`import { LumStack } from "lumino/react";

function FormActions() {
  return (
    <LumStack direction="horizontal" spacing={8} align="center">
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleSave}>Save Changes</button>
      <button onClick={handleSubmit}>Submit</button>
    </LumStack>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <p>
          Use Stack to organize form sections:
        </p>
        <pre className="docs-code">{formBuilderCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Configuration Methods</h2>
        <p>
          When using Stack in Lumino's form builder:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.container(LumStack)</code></td>
              <td>Start stack container</td>
              <td><code>this.container(LumStack)</code></td>
            </tr>
            <tr>
              <td><code>.props(props)</code></td>
              <td>Set stack properties</td>
              <td><code>.props({"{"} spacing: 16 {"}"})</code></td>
            </tr>
            <tr>
              <td><code>.add(Component)</code></td>
              <td>Add child component</td>
              <td><code>.add(LumCard)</code></td>
            </tr>
            <tr>
              <td><code>.children(fn)</code></td>
              <td>Custom content renderer</td>
              <td><code>.children(() =&gt; &lt;div /&gt;)</code></td>
            </tr>
            <tr>
              <td><code>.end()</code></td>
              <td>Close container</td>
              <td><code>.end()</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>
        <pre className="docs-code">{`// Form sections stacked vertically
<LumStack spacing={24}>
  <section>
    <h3>Personal Information</h3>
    <PersonalInfoForm />
  </section>
  <section>
    <h3>Address</h3>
    <AddressForm />
  </section>
  <section>
    <h3>Preferences</h3>
    <PreferencesForm />
  </section>
</LumStack>

// Action buttons stacked horizontally
<LumStack direction="horizontal" spacing={8} align="center">
  <button variant="secondary">Cancel</button>
  <button variant="primary">Save</button>
</LumStack>

// Cards in vertical stack
<LumStack spacing={16}>
  {items.map(item => (
    <LumCard key={item.id}>
      <CardContent item={item} />
    </LumCard>
  ))}
</LumStack>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use consistent spacing</strong> - Stick to multiples of 4 or 8 for
            visual harmony (8, 12, 16, 24, etc.)
          </li>
          <li>
            <strong>Choose the right direction</strong> - Use vertical for form sections,
            horizontal for button groups
          </li>
          <li>
            <strong>Consider responsive behavior</strong> - Horizontal stacks may need to
            wrap or change direction on mobile
          </li>
          <li>
            <strong>Don't over-nest</strong> - Too many nested stacks can make layout
            complex; consider Grid for 2D layouts
          </li>
          <li>
            <strong>Use with other containers</strong> - Stack works well with Card, Grid,
            and other layout components
          </li>
          <li>
            <strong>Provide semantic structure</strong> - Wrap related items in semantic
            HTML elements like section or article
          </li>
        </ul>
      </div>
    </div>
  );
}
