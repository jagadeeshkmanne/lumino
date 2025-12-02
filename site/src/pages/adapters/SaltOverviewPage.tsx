/**
 * Salt Adapter Overview Page
 *
 * Documents the Salt Design System adapter implementation.
 */

import React from "react";

export function SaltOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Salt Adapter Overview</h1>
      <p className="docs-page-subtitle">
        The default Lumino adapter implementing JPMorgan's Salt Design System.
      </p>

      <div className="docs-section">
        <h2>What is Salt?</h2>
        <p>
          Salt Design System is JPMorgan's open-source UI component library built on React.
          It provides a comprehensive set of accessible, production-ready components with
          a focus on financial applications.
        </p>
        <ul className="docs-list">
          <li>
            <strong>Enterprise-Ready</strong> - Built for complex financial applications
          </li>
          <li>
            <strong>Accessible</strong> - WCAG 2.1 AA compliant
          </li>
          <li>
            <strong>Themeable</strong> - Light, dark, and custom theme support
          </li>
          <li>
            <strong>Comprehensive</strong> - 50+ components covering all use cases
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Why Salt as Default?</h2>
        <p>
          Lumino uses Salt as the default adapter for several reasons:
        </p>
        <ul className="docs-list">
          <li>
            <strong>Complete Coverage</strong> - Salt provides all components needed for complex forms
          </li>
          <li>
            <strong>Production Quality</strong> - Battle-tested in JPMorgan's enterprise applications
          </li>
          <li>
            <strong>Modern Design</strong> - Clean, professional aesthetics suitable for business apps
          </li>
          <li>
            <strong>Active Development</strong> - Regular updates and community support
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Adapter Structure</h2>
        <p>
          The Salt adapter is organized into logical categories matching Lumino's interface structure:
        </p>
        <pre className="docs-diagram">{`
lumino/adapters/salt/
├── index.ts              - Main adapter export
├── utils.ts              - Helper functions
├── fields/               - Form input components
│   ├── TextInput.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── DatePicker.tsx
│   └── ...
├── layout/               - Layout components
│   ├── Row.tsx
│   ├── Column.tsx
│   ├── Section.tsx
│   ├── Form.tsx
│   └── AppLayoutRenderer.tsx
├── components/           - Container components
│   ├── Dialog.tsx
│   ├── Card.tsx
│   ├── Tabs.tsx
│   └── Panel.tsx
├── actions/              - Action components
│   └── index.tsx         - Button, IconButton
├── feedback/             - Feedback components
│   ├── Alert.tsx
│   ├── Spinner.tsx
│   ├── Toast.tsx
│   └── Badge.tsx
├── navigation/           - Navigation components
│   ├── Menu.tsx
│   ├── Pagination.tsx
│   └── Stepper.tsx
├── loading/              - Loading states
│   ├── Skeleton.tsx
│   └── GlobalLoadingOverlay.tsx
└── errors/               - Error pages
    └── ErrorPage.tsx
        `}</pre>
      </div>

      <div className="docs-section">
        <h2>Adapter Registration</h2>
        <p>
          The Salt adapter is registered as the default adapter automatically when imported:
        </p>
        <pre className="docs-code">
{`// Option 1: Explicit registration (recommended)
import { Lumino } from "lumino";
import { saltAdapter } from "lumino/adapters/salt";

Lumino.ui(saltAdapter);

// Option 2: Automatic (imports set Salt as default)
import "lumino/adapters/salt";
// Salt is now the default adapter

// Option 3: Use individual components directly
import { LuminoTextInput, LuminoSelect } from "lumino/adapters/salt";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Component Mapping</h2>
        <p>
          The adapter maps Lumino's standardized component interfaces to Salt components:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Lumino Interface</th>
              <th>Salt Component</th>
              <th>Adapter Component</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TextInput</td>
              <td>Input</td>
              <td>LuminoTextInput</td>
            </tr>
            <tr>
              <td>Select</td>
              <td>Dropdown</td>
              <td>LuminoSelect</td>
            </tr>
            <tr>
              <td>Checkbox</td>
              <td>Checkbox</td>
              <td>LuminoCheckbox</td>
            </tr>
            <tr>
              <td>DatePicker</td>
              <td>DatePicker</td>
              <td>LuminoDatePicker</td>
            </tr>
            <tr>
              <td>Dialog</td>
              <td>Dialog</td>
              <td>LuminoDialog</td>
            </tr>
            <tr>
              <td>Button</td>
              <td>Button</td>
              <td>LuminoButton</td>
            </tr>
          </tbody>
        </table>
        <p>
          See <a href="#/adapters/salt-components">Salt Components Mapping</a> for the complete list.
        </p>
      </div>

      <div className="docs-section">
        <h2>Prop Normalization</h2>
        <p>
          The adapter normalizes props between Lumino's standard interface and Salt's API:
        </p>
        <h3>Example: TextInput</h3>
        <pre className="docs-code">
{`// Lumino standard props
<LuminoTextInput
  value={text}
  onChange={(value) => setText(value)}  // Clean value
  error="Invalid input"                 // Boolean or string
  required
/>

// Mapped to Salt props
<Input
  value={text}
  onChange={(event) => setText(event.target.value)}  // DOM event
  validationStatus="error"                           // Salt status
  required
/>`}</pre>

        <h3>Example: Select</h3>
        <pre className="docs-code">
{`// Lumino standard props
<LuminoSelect
  value={selectedId}
  onChange={(value) => setSelectedId(value)}  // Clean value
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" }
  ]}
/>

// Mapped to Salt props
<Dropdown
  selected={[selectedId]}
  onSelectionChange={(event, selected) => setSelectedId(selected[0])}
>
  <Option value="1">Option 1</Option>
  <Option value="2">Option 2</Option>
</Dropdown>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Using createLuminoComponent</h2>
        <p>
          All Salt adapter components are built using <code>createLuminoComponent</code>,
          Lumino's universal adapter creation utility:
        </p>
        <pre className="docs-code">
{`import { Input } from "@salt-ds/core";
import { createLuminoComponent } from "lumino/core/adapters";

export const LuminoTextInput = createLuminoComponent(Input, {
  // Map props: Lumino → Salt
  props: {
    error: {
      to: "validationStatus",
      transform: (error) => error ? "error" : undefined
    },
    value: {
      to: "value",
      transform: (value) => value ?? ""
    }
  },

  // Map events: Salt → Lumino (extract clean values)
  events: {
    onChange: {
      to: "onChange",
      extract: (event) => event.target.value
    }
  },

  // Exclude props that need special handling
  exclude: ["name", "type", "autoFocus"],

  // Custom render for complex cases
  render: (transformedProps, Input, originalProps) => {
    const { name, type, autoFocus } = originalProps;
    return (
      <Input
        {...transformedProps}
        inputProps={{ name, type, autoFocus }}
      />
    );
  }
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Utility Functions</h2>
        <p>
          The adapter includes utility functions for common patterns:
        </p>
        <pre className="docs-code">
{`// Combine CSS classes
import { cx, luminoClass } from "lumino/adapters/salt/utils";

// Add Lumino classes to components
const className = luminoClass("field", "text-input", props.className);
// Result: "lumino-field lumino-text-input user-class"

// Combine multiple classes
const combined = cx("base-class", condition && "conditional", className);`}</pre>
      </div>

      <div className="docs-section">
        <h2>Theme Support</h2>
        <p>
          Salt provides built-in theme support that works seamlessly with the adapter:
        </p>
        <pre className="docs-code">
{`import { SaltProvider } from "@salt-ds/core";

function App() {
  return (
    <SaltProvider mode="light" density="medium">
      {/* Your Lumino forms will use Salt's theme */}
      <MyLuminoApp />
    </SaltProvider>
  );
}

// Switch themes dynamically
const [theme, setTheme] = useState<"light" | "dark">("light");
<SaltProvider mode={theme}>...</SaltProvider>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Extended Components</h2>
        <p>
          The Salt adapter provides additional components beyond the core interfaces:
        </p>
        <ul className="docs-list">
          <li><strong>Slider</strong> - Range input component</li>
          <li><strong>FileDropZone</strong> - Drag-and-drop file upload</li>
          <li><strong>Menu</strong> - Navigation menu component</li>
          <li><strong>Pagination</strong> - Page navigation</li>
          <li><strong>Stepper</strong> - Multi-step process indicator</li>
          <li><strong>Accordion</strong> - Collapsible content panels</li>
        </ul>
        <pre className="docs-code">
{`import {
  LuminoSlider,
  LuminoFileDropZone,
  LuminoMenu,
  LuminoPagination
} from "lumino/adapters/salt";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use string-based components</strong> - Prefer <code>"TextInput"</code> over direct imports
            for better adapter portability
          </li>
          <li>
            <strong>Leverage Salt themes</strong> - Wrap your app in <code>SaltProvider</code> for
            consistent theming
          </li>
          <li>
            <strong>Follow Salt guidelines</strong> - Read Salt's design guidelines for best UX practices
          </li>
          <li>
            <strong>Customize carefully</strong> - Use Salt's styling system rather than custom CSS
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li>
            <a href="#/adapters/salt-setup">Salt Setup Guide</a> - Install and configure Salt adapter
          </li>
          <li>
            <a href="#/adapters/salt-components">Salt Components</a> - Complete component mapping reference
          </li>
          <li>
            <a href="https://salt-ds.github.io/salt-ds/" target="_blank" rel="noopener noreferrer">
              Salt Design System Docs
            </a> - Official Salt documentation
          </li>
        </ul>
      </div>
    </div>
  );
}
