/**
 * IntroductionPage - Main documentation landing page
 */

import { CodeBlock } from "../components/CodeBlock";

const quickStartCode = `import { App, Page, Form, Validators } from "lumino";
import { LuminoTextInput } from "lumino/react";

// Define your form data type
interface ContactForm {
  name: string;
  email: string;
}

// Create a form
class MyForm extends Form<ContactForm> {
  configure() {
    this.addSection("Contact")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Name")
          .rules(Validators.required())
        .endField()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .rules(Validators.email())
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

export function IntroductionPage() {
  return (
    <>
      <h1 className="docs-page-title">Lumino</h1>
      <p className="docs-page-subtitle">
        A TypeScript-first form and page builder framework with a fluent, chainable API.
      </p>

      <div className="docs-section">
        <h2 className="docs-section-title">Features</h2>
        <ul>
          <li><strong>Type-safe</strong> - Full TypeScript support with inferred types</li>
          <li><strong>Fluent API</strong> - Chainable builder pattern for clean, readable code</li>
          <li><strong>Framework agnostic</strong> - Core logic works anywhere, adapters for React</li>
          <li><strong>UI agnostic</strong> - Use any component library via adapters (Salt, MUI, etc.)</li>
          <li><strong>Validation</strong> - Built-in validators + custom validation support</li>
          <li><strong>Dynamic forms</strong> - Conditional visibility, dependencies, async validation</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">Quick Example</h2>
        <p>Here's how you define a form with Lumino's fluent API:</p>
        <CodeBlock code={quickStartCode} language="typescript" />
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">Core Concepts</h2>
        <p>Lumino is built around four main concepts:</p>
        <ul>
          <li><strong>App</strong> - Application container with routes, APIs, and configuration</li>
          <li><strong>Page</strong> - A route-able view that can contain forms, components, tables</li>
          <li><strong>Form</strong> - A data entry form with sections, rows, and fields</li>
          <li><strong>Validators</strong> - Validation rules that can be sync, async, or cross-field</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">Architecture</h2>
        <p>
          Lumino separates concerns into layers:
        </p>
        <ul>
          <li><strong>Core</strong> - Pure TypeScript classes (Form, Page, App, Validators)</li>
          <li><strong>React</strong> - React bindings and renderers (FormRenderer, PageRenderer)</li>
          <li><strong>Adapters</strong> - UI library integrations (Salt, custom components)</li>
        </ul>
      </div>
    </>
  );
}
