/**
 * Core Concepts Overview Page
 *
 * Explains the fundamental architecture and concepts of Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function ConceptsOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Core Concepts Overview</h1>
      <p className="docs-page-subtitle">
        Understand the fundamental architecture and concepts that power Lumino.
        This guide explains how the different parts work together.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code
        to ensure accuracy.
      </div>

      <div className="docs-section">
        <h2>Architecture Overview</h2>
        <p>
          Lumino is built around a layered architecture that separates concerns
          and promotes reusability:
        </p>
        <pre className="docs-code">{`┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
├─────────────────────────────────────────────────────────────┤
│  LuminoProvider                                              │
│  ├── AppContext (user, api, navigation, ui, config)         │
│  ├── StateManager (global state, loading, user)             │
│  └── EventEmitter (form, page, api, app events)             │
├─────────────────────────────────────────────────────────────┤
│  Builders (Fluent API for configuration)                    │
│  ├── Form Builder → FormRenderer                            │
│  ├── Page Builder → PageRenderer                            │
│  └── Api Builder → ApiRegistry                              │
├─────────────────────────────────────────────────────────────┤
│  Components (UI Layer)                                       │
│  ├── Fields (TextInput, Select, DatePicker, etc.)           │
│  ├── Containers (Card, Table, Tabs, Dialog, etc.)           │
│  ├── Actions (Button, Link, IconButton)                     │
│  └── Feedback (Toast, Spinner, Badge, etc.)                 │
└─────────────────────────────────────────────────────────────┘`}</pre>
      </div>

      <div className="docs-section">
        <h2>Key Concepts</h2>

        <h3>1. Builder Pattern</h3>
        <p>
          Lumino uses the builder pattern extensively. This provides a fluent,
          chainable API for configuration:
        </p>
        <pre className="docs-code">{`// Form Builder example
class MyForm extends Form<MyEntity> {
  configure() {
    this.addSection("Details")      // Returns SectionBuilder
      .addRow()                     // Returns RowBuilder
        .addField("name")           // Returns FieldBuilder
          .component(LuminoTextInput)
          .label("Name")
          .rules(Validators.required())
          .endField()               // Returns to RowBuilder
        .layout([1])
      .endRow()                     // Returns to SectionBuilder
    .endSection();                  // Returns to Form
  }
}`}</pre>

        <h3>2. Context System</h3>
        <p>
          Lumino provides several contexts that flow through your application:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Context</th>
              <th>Purpose</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>AppContext</code></td>
              <td>Global app state, user, navigation, API calls</td>
              <td><code>useLumino()</code></td>
            </tr>
            <tr>
              <td><code>FormContext</code></td>
              <td>Form state, values, validation, field operations</td>
              <td>Passed to field builders</td>
            </tr>
            <tr>
              <td><code>PageContext</code></td>
              <td>Page state, lifecycle, data loading</td>
              <td>Passed to page components</td>
            </tr>
            <tr>
              <td><code>UserContext</code></td>
              <td>Current user, roles, permissions</td>
              <td><code>ctx.user</code></td>
            </tr>
          </tbody>
        </table>

        <h3>3. Entity Binding</h3>
        <p>
          Forms are strongly typed and bind to entity classes:
        </p>
        <pre className="docs-code">{`// Define your entity
class Employee {
  id = "";
  firstName = "";
  lastName = "";
  email = "";
  department = "";
  salary = 0;
}

// Form is generic over entity type
class EmployeeForm extends Form<Employee> {
  configure() {
    // Field names are type-checked against Employee
    this.addField("firstName")  // ✓ Valid
    this.addField("unknown")    // ✗ TypeScript error
  }
}`}</pre>

        <h3>4. Validation System</h3>
        <p>
          Lumino provides built-in validators and supports custom validation:
        </p>
        <pre className="docs-code">{`// Built-in validators
.rules(
  Validators.required({ message: "Required" }),
  Validators.email("Invalid email"),
  Validators.minLength(3, "Too short"),
  Validators.pattern(/^[A-Z]/, "Must start with uppercase")
)

// Custom validators
.rules({
  type: "custom",
  message: "Must be unique",
  validate: async (value, ctx) => {
    const exists = await checkExists(value);
    return !exists;
  }
})`}</pre>

        <h3>5. Visibility System</h3>
        <p>
          Fields and sections can be conditionally shown/hidden:
        </p>
        <pre className="docs-code">{`// Conditional visibility (clears data when hidden)
.hideByCondition((ctx) => ctx.getValue("type") !== "other")

// Access-based visibility (preserves data when hidden)
.visibleByAccess((ctx) => ctx.user?.hasRole("admin"))

// Key difference:
// - hideByCondition: Data cleared, validation skipped
// - visibleByAccess: Data preserved, validation runs`}</pre>

        <h3>6. Event System</h3>
        <p>
          Lumino emits events for various operations:
        </p>
        <pre className="docs-code">{`// Subscribe to events
eventEmitter.on("form:submit:success", (data) => {
  console.log("Form submitted:", data);
});

eventEmitter.on("api:request:error", (error) => {
  console.error("API error:", error);
});

// Event categories:
// - form:* (submit, validate, change)
// - page:* (load, unload, navigate)
// - api:* (request, response, error)
// - ui:* (loader, notify, modal)
// - app:* (init, error)`}</pre>
      </div>

      <div className="docs-section">
        <h2>Data Flow</h2>
        <pre className="docs-code">{`User Interaction
      │
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│  FormContext│────▶│   Entity    │
│  (Input)    │     │  (setValue) │     │   (Data)    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │
      │                    ▼
      │             ┌─────────────┐
      │             │  Validators │
      │             │  (validate) │
      │             └─────────────┘
      │                    │
      ▼                    ▼
┌─────────────┐     ┌─────────────┐
│   Events    │     │   Errors    │
│   (emit)    │     │  (display)  │
└─────────────┘     └─────────────┘`}</pre>
      </div>

      <div className="docs-section">
        <h2>Module Organization</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Contents</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>lumino/core</code></td>
              <td>Form, Page, Api, Validators, StateManager, EventEmitter</td>
            </tr>
            <tr>
              <td><code>lumino/react</code></td>
              <td>LuminoProvider, Renderers, Components, Hooks</td>
            </tr>
            <tr>
              <td><code>lumino/types</code></td>
              <td>TypeScript interfaces and type definitions</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li><strong>Lumino Namespace</strong> - Learn about the lumino() function</li>
          <li><strong>LuminoProvider</strong> - Setting up your app</li>
          <li><strong>UI Adapters</strong> - Customizing UI components</li>
          <li><strong>Form Builder</strong> - Creating forms</li>
        </ul>
      </div>
    </div>
  );
}
