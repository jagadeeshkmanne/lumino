/**
 * Adapters Overview Page
 *
 * Documents the Lumino adapter system and architecture.
 */

import React from "react";

export function AdaptersOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Adapters Overview</h1>
      <p className="docs-page-subtitle">
        Understand Lumino's adapter system that enables framework-agnostic UI integration.
      </p>

      <div className="docs-section">
        <h2>What are Adapters?</h2>
        <p>
          Adapters are Lumino's abstraction layer between your application logic and UI components.
          They allow you to use any UI library (Salt, Material-UI, Ant Design, etc.) without
          changing your business code.
        </p>
        <ul className="docs-list">
          <li>
            <strong>Framework Independence</strong> - Write forms once, render with any UI library
          </li>
          <li>
            <strong>Consistent Interface</strong> - All adapters implement the same interfaces
          </li>
          <li>
            <strong>Type Safety</strong> - Full TypeScript support with strict typing
          </li>
          <li>
            <strong>Extensible</strong> - Create custom adapters for your component library
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Architecture</h2>
        <p>
          The adapter system consists of several layers that work together:
        </p>
        <pre className="docs-diagram">{`
┌─────────────────────────────────────────────────────┐
│           Your Application Code                     │
│  (Forms, Fields, Validation, State Management)      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│          Lumino Standard Interfaces                 │
│  (IFieldAdapter, ILayoutAdapter, IUIAdapter, etc.)  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Adapter Implementation                  │
│      (saltAdapter, muiAdapter, antAdapter)          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│            UI Library Components                    │
│    (@salt-ds/core, @mui/material, antd, etc.)       │
└─────────────────────────────────────────────────────┘
        `}</pre>
      </div>

      <div className="docs-section">
        <h2>Core Adapter Interfaces</h2>
        <p>
          Lumino defines several adapter interfaces, each responsible for a category of components:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Interface</th>
              <th>Purpose</th>
              <th>Components</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>IFieldAdapter</code></td>
              <td>Form input fields</td>
              <td>TextInput, Select, Checkbox, DatePicker, etc.</td>
            </tr>
            <tr>
              <td><code>ILayoutAdapter</code></td>
              <td>Layout containers</td>
              <td>Row, Column, Section, Form, FieldWrapper</td>
            </tr>
            <tr>
              <td><code>IContainerAdapter</code></td>
              <td>UI containers</td>
              <td>Dialog, Card, Panel, Tabs</td>
            </tr>
            <tr>
              <td><code>IActionAdapter</code></td>
              <td>User actions</td>
              <td>Button, IconButton, Toolbar, ButtonGroup</td>
            </tr>
            <tr>
              <td><code>IListAdapter</code></td>
              <td>Data display</td>
              <td>Table, Tabs, Cards</td>
            </tr>
            <tr>
              <td><code>IFeedbackAdapter</code></td>
              <td>User feedback</td>
              <td>Alert, Spinner, Toast, Progress, Badge</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Using an Adapter</h2>
        <p>
          Register an adapter when initializing your application:
        </p>
        <pre className="docs-code">{`import { Lumino } from "lumino";
import { saltAdapter } from "lumino/adapters/salt";

// Register Salt as the UI adapter
Lumino.ui(saltAdapter);

// Now all forms will render with Salt components
class MyForm extends Form<MyEntity> {
  configure() {
    this.addSection("User Info")
      .addRow()
        .addField("name")
          .component("TextInput")  // Uses Salt Input
          .label("Name")
          .endField()
      .endRow()
    .endSection();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Available Adapters</h2>
        <p>
          Lumino currently provides the following official adapters:
        </p>
        <div className="docs-card">
          <h3>Salt Design System</h3>
          <p>
            The default adapter for Lumino, implementing JPMorgan's Salt Design System.
            Includes all components and is production-ready.
          </p>
          <pre className="docs-code">{`import { saltAdapter } from "lumino/adapters/salt";
Lumino.ui(saltAdapter);`}</pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>Component Resolution</h2>
        <p>
          Lumino supports two ways to specify components:
        </p>
        <h3>1. String-based (Recommended)</h3>
        <pre className="docs-code">{`this.addField("email")
  .component("TextInput")  // Resolved by adapter
  .label("Email")
  .endField()`}</pre>
        <p>
          The adapter's <code>resolveComponent</code> method maps the string to the actual component.
        </p>

        <h3>2. Direct Component Reference</h3>
        <pre className="docs-code">{`import { LuminoTextInput } from "lumino/react";

this.addField("email")
  .component(LuminoTextInput)  // Direct reference
  .label("Email")
  .endField()`}</pre>
        <p>
          Useful when you need to use a component not registered in the adapter.
        </p>
      </div>

      <div className="docs-section">
        <h2>Adapter Benefits</h2>
        <ul className="docs-list">
          <li>
            <strong>Separation of Concerns</strong> - Business logic is independent of UI framework
          </li>
          <li>
            <strong>Easy Theming</strong> - Switch entire UI library by changing one line
          </li>
          <li>
            <strong>Progressive Enhancement</strong> - Start with basic components, enhance later
          </li>
          <li>
            <strong>Testing</strong> - Test business logic without UI dependencies
          </li>
          <li>
            <strong>Migration</strong> - Migrate from one UI library to another incrementally
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li>
            <a href="#/adapters/salt-overview">Salt Adapter Overview</a> - Learn about the default Salt adapter
          </li>
          <li>
            <a href="#/adapters/adapter-interfaces">Adapter Interfaces</a> - Detailed interface documentation
          </li>
          <li>
            <a href="#/adapters/create-adapter">Create Custom Adapter</a> - Build your own adapter
          </li>
        </ul>
      </div>
    </div>
  );
}
