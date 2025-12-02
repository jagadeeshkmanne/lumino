/**
 * Accordion Container Page
 *
 * Documents the LuminoAccordion component with live demos.
 * Uses Lumino components directly - no useState needed for demos.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import {
  LuminoAccordion,
  LuminoStackLayout,
  LuminoFlowLayout,
  LuminoText,
  LuminoButton,
} from "lumino/react";

// =============================================================================
// DEMO COMPONENTS - No useState, static Lumino components
// =============================================================================

function BasicAccordionDemo() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "section1",
          header: "Section 1",
          content: (
            <LuminoStackLayout gap={1}>
              <LuminoText>Content for section 1 goes here.</LuminoText>
              <LuminoText variant="secondary">This section is expanded by default.</LuminoText>
            </LuminoStackLayout>
          ),
        },
        {
          key: "section2",
          header: "Section 2",
          content: (
            <LuminoText>Content for section 2 goes here.</LuminoText>
          ),
        },
        {
          key: "section3",
          header: "Section 3",
          content: (
            <LuminoText>Content for section 3 goes here.</LuminoText>
          ),
        },
      ]}
      defaultExpandedKeys={["section1"]}
    />
  );
}

function FAQAccordionDemo() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "faq1",
          header: "What is Lumino?",
          content: (
            <LuminoText>
              Lumino is a React component framework for building enterprise applications
              with a consistent design system and powerful form builder.
            </LuminoText>
          ),
        },
        {
          key: "faq2",
          header: "How do I get started?",
          content: (
            <LuminoStackLayout gap={1}>
              <LuminoText>Install the package via npm:</LuminoText>
              <pre style={{ margin: 0, padding: 8, background: "#f5f5f5", borderRadius: 4 }}>
                npm install lumino
              </pre>
              <LuminoText>Then configure your app with LuminoProvider.</LuminoText>
            </LuminoStackLayout>
          ),
        },
        {
          key: "faq3",
          header: "Is it free to use?",
          content: (
            <LuminoText>
              Yes, Lumino is open source and free to use in both personal and commercial projects.
            </LuminoText>
          ),
        },
      ]}
      defaultExpandedKeys={["faq1"]}
    />
  );
}

function SingleExpandAccordionDemo() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "item1",
          header: "First Item",
          content: <LuminoText>Only one item can be expanded at a time.</LuminoText>,
        },
        {
          key: "item2",
          header: "Second Item",
          content: <LuminoText>Click this to collapse the first item.</LuminoText>,
        },
        {
          key: "item3",
          header: "Third Item",
          content: <LuminoText>Single expand mode is useful for FAQs.</LuminoText>,
        },
      ]}
      multiple={false}
      defaultExpandedKeys={["item1"]}
    />
  );
}

function SettingsAccordionDemo() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "profile",
          header: "Profile Settings",
          content: (
            <LuminoStackLayout gap={2}>
              <LuminoText>Configure your profile settings here.</LuminoText>
              <LuminoFlowLayout gap={1}>
                <LuminoButton variant="secondary">Edit Profile</LuminoButton>
                <LuminoButton variant="secondary">Change Avatar</LuminoButton>
              </LuminoFlowLayout>
            </LuminoStackLayout>
          ),
        },
        {
          key: "preferences",
          header: "Preferences",
          content: (
            <LuminoStackLayout gap={2}>
              <LuminoText>Manage your application preferences.</LuminoText>
              <LuminoFlowLayout gap={1}>
                <LuminoButton variant="secondary">Notifications</LuminoButton>
                <LuminoButton variant="secondary">Theme</LuminoButton>
              </LuminoFlowLayout>
            </LuminoStackLayout>
          ),
        },
        {
          key: "security",
          header: "Security",
          content: (
            <LuminoStackLayout gap={2}>
              <LuminoText>Security and authentication options.</LuminoText>
              <LuminoFlowLayout gap={1}>
                <LuminoButton variant="secondary">Change Password</LuminoButton>
                <LuminoButton variant="secondary">Two-Factor Auth</LuminoButton>
              </LuminoFlowLayout>
            </LuminoStackLayout>
          ),
        },
      ]}
      defaultExpandedKeys={["profile"]}
    />
  );
}

function DisabledAccordionDemo() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "active",
          header: "Active Section",
          content: <LuminoText>This section is active and can be expanded.</LuminoText>,
        },
        {
          key: "disabled",
          header: "Disabled Section (Premium Feature)",
          content: <LuminoText>This content is not accessible.</LuminoText>,
          disabled: true,
        },
        {
          key: "another",
          header: "Another Active Section",
          content: <LuminoText>This section is also active.</LuminoText>,
        },
      ]}
      defaultExpandedKeys={["active"]}
    />
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCode = `import { LuminoAccordion, LuminoStackLayout, LuminoText } from "lumino/react";

function BasicAccordionDemo() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "section1",
          header: "Section 1",
          content: (
            <LuminoStackLayout gap={1}>
              <LuminoText>Content for section 1 goes here.</LuminoText>
              <LuminoText variant="secondary">This section is expanded by default.</LuminoText>
            </LuminoStackLayout>
          ),
        },
        {
          key: "section2",
          header: "Section 2",
          content: <LuminoText>Content for section 2 goes here.</LuminoText>,
        },
        {
          key: "section3",
          header: "Section 3",
          content: <LuminoText>Content for section 3 goes here.</LuminoText>,
        },
      ]}
      defaultExpandedKeys={["section1"]}
    />
  );
}`;

const faqCode = `import { LuminoAccordion, LuminoStackLayout, LuminoText } from "lumino/react";

function FAQAccordionDemo() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "faq1",
          header: "What is Lumino?",
          content: (
            <LuminoText>
              Lumino is a React component framework for building enterprise applications
              with a consistent design system and powerful form builder.
            </LuminoText>
          ),
        },
        {
          key: "faq2",
          header: "How do I get started?",
          content: (
            <LuminoStackLayout gap={1}>
              <LuminoText>Install the package via npm:</LuminoText>
              <pre>npm install lumino</pre>
              <LuminoText>Then configure your app with LuminoProvider.</LuminoText>
            </LuminoStackLayout>
          ),
        },
        {
          key: "faq3",
          header: "Is it free to use?",
          content: (
            <LuminoText>
              Yes, Lumino is open source and free to use.
            </LuminoText>
          ),
        },
      ]}
      defaultExpandedKeys={["faq1"]}
    />
  );
}`;

const singleExpandCode = `import { LuminoAccordion, LuminoText } from "lumino/react";

function SingleExpandAccordion() {
  return (
    <LuminoAccordion
      items={[
        { key: "item1", header: "First Item", content: <LuminoText>Content 1</LuminoText> },
        { key: "item2", header: "Second Item", content: <LuminoText>Content 2</LuminoText> },
        { key: "item3", header: "Third Item", content: <LuminoText>Content 3</LuminoText> },
      ]}
      multiple={false}  // Only one item can be expanded at a time
      defaultExpandedKeys={["item1"]}
    />
  );
}`;

const settingsCode = `import { LuminoAccordion, LuminoStackLayout, LuminoFlowLayout, LuminoText, LuminoButton } from "lumino/react";

function SettingsAccordion() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "profile",
          header: "Profile Settings",
          content: (
            <LuminoStackLayout gap={2}>
              <LuminoText>Configure your profile settings here.</LuminoText>
              <LuminoFlowLayout gap={1}>
                <LuminoButton variant="secondary">Edit Profile</LuminoButton>
                <LuminoButton variant="secondary">Change Avatar</LuminoButton>
              </LuminoFlowLayout>
            </LuminoStackLayout>
          ),
        },
        {
          key: "preferences",
          header: "Preferences",
          content: (
            <LuminoStackLayout gap={2}>
              <LuminoText>Manage your preferences.</LuminoText>
            </LuminoStackLayout>
          ),
        },
      ]}
      defaultExpandedKeys={["profile"]}
    />
  );
}`;

const disabledCode = `import { LuminoAccordion, LuminoText } from "lumino/react";

function DisabledAccordion() {
  return (
    <LuminoAccordion
      items={[
        {
          key: "active",
          header: "Active Section",
          content: <LuminoText>This section is active.</LuminoText>,
        },
        {
          key: "disabled",
          header: "Disabled Section (Premium Feature)",
          content: <LuminoText>This content is not accessible.</LuminoText>,
          disabled: true,  // This item cannot be expanded
        },
        {
          key: "another",
          header: "Another Active Section",
          content: <LuminoText>This section is also active.</LuminoText>,
        },
      ]}
      defaultExpandedKeys={["active"]}
    />
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function AccordionPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Accordion</h1>
      <p className="docs-page-subtitle">
        A collapsible container component for organizing content into expandable sections.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoAccordion } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Accordion</h2>
        <p>A simple accordion with multiple sections:</p>
        <LiveDemo
          title="Basic"
          description="Multiple expandable sections"
          code={basicCode}
        >
          <BasicAccordionDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>FAQ Example</h2>
        <p>A common FAQ pattern:</p>
        <LiveDemo
          title="FAQ"
          description="Frequently asked questions"
          code={faqCode}
        >
          <FAQAccordionDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Single Expand Mode</h2>
        <p>Only one section can be expanded at a time:</p>
        <LiveDemo
          title="Single Expand"
          description="Mutual exclusion mode"
          code={singleExpandCode}
        >
          <SingleExpandAccordionDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Settings Panel</h2>
        <p>Accordion with actions inside:</p>
        <LiveDemo
          title="Settings"
          description="Actions inside accordion sections"
          code={settingsCode}
        >
          <SettingsAccordionDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Disabled Items</h2>
        <p>Some accordion items can be disabled:</p>
        <LiveDemo
          title="Disabled"
          description="Disabled accordion item"
          code={disabledCode}
        >
          <DisabledAccordionDemo />
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
              <td><code>items</code></td>
              <td>AccordionItem[]</td>
              <td>[]</td>
              <td>Array of accordion items</td>
            </tr>
            <tr>
              <td><code>expandedKeys</code></td>
              <td>string[]</td>
              <td>-</td>
              <td>Controlled expanded item keys</td>
            </tr>
            <tr>
              <td><code>defaultExpandedKeys</code></td>
              <td>string[]</td>
              <td>[]</td>
              <td>Initially expanded item keys</td>
            </tr>
            <tr>
              <td><code>multiple</code></td>
              <td>boolean</td>
              <td>true</td>
              <td>Allow multiple items expanded</td>
            </tr>
            <tr>
              <td><code>onExpandedChange</code></td>
              <td>(keys: string[]) =&gt; void</td>
              <td>-</td>
              <td>Called when expansion changes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>AccordionItem Type</h2>
        <pre className="docs-code">{`interface AccordionItem {
  key: string;         // Unique identifier
  header: ReactNode;   // Header content (shown always)
  content: ReactNode;  // Body content (shown when expanded)
  disabled?: boolean;  // Disable this item
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use descriptive headers</strong> - Users should understand
            content before expanding
          </li>
          <li>
            <strong>Group related content</strong> - Each section should contain
            logically related information
          </li>
          <li>
            <strong>Consider default expansion</strong> - Expand important sections
            by default for discoverability
          </li>
          <li>
            <strong>Use single expand for FAQs</strong> - Set multiple=false for
            FAQ-style accordions
          </li>
          <li>
            <strong>Avoid deep nesting</strong> - Nested accordions can confuse users
          </li>
        </ul>
      </div>
    </div>
  );
}
