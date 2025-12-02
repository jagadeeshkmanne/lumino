/**
 * Lumino Namespace API Reference
 */

import { CodeBlock } from "../../components/CodeBlock";

const signatureCode = `// Global namespace for framework configuration
export const Lumino = {
  ui: UIAdapterFunction & UIAdapterMethods
};

interface UIAdapterMethods {
  // Register a named adapter
  register(name: string, adapter: UIAdapter): void;

  // Extend layout components
  extend(components: Partial<LayoutAdapter>): void;

  // Get the effective adapter with overrides
  get(): UIAdapter | null;

  // Add or override a component
  component(name: string, component: ComponentType<any>, options?: ComponentEntry): void;

  // Resolve component type to actual component
  resolve(componentType: any): ComponentType<any> | null;

  // Normalize onChange handler
  normalizeOnChange(componentType: any, onChange: (value: any) => void): (...args: any[]) => void;

  // Check if adapter is configured
  hasAdapter(): boolean;

  // Clear adapter (for testing)
  clear(): void;
}`;

const basicUsageCode = `import { Lumino } from "lumino/core";
import { muiAdapter } from "lumino/mui";

// Set the UI adapter
Lumino.ui(muiAdapter);

// Check if adapter is configured
if (Lumino.ui.hasAdapter()) {
  console.log("Adapter is configured");
}

// Get current adapter
const adapter = Lumino.ui.get();`;

const registerAdapterCode = `import { Lumino } from "lumino/core";
import { muiAdapter } from "lumino/mui";
import { saltAdapter } from "lumino/salt";

// Register named adapters
Lumino.ui.register("mui", muiAdapter);
Lumino.ui.register("salt", saltAdapter);

// Use adapter by name
Lumino.ui("mui");`;

const extendLayoutCode = `import { Lumino } from "lumino/core";
import { MyCustomSection } from "./components/MyCustomSection";
import { MyCustomRow } from "./components/MyCustomRow";

// Extend layout components
Lumino.ui.extend({
  Section: MyCustomSection,
  Row: MyCustomRow,
  // Also available: Column, Form, FieldWrapper
});

// The custom components will be used throughout your app`;

const customComponentCode = `import { Lumino } from "lumino/core";
import { RichTextEditor } from "./components/RichTextEditor";

// Add a custom component
Lumino.ui.component("RichEditor", RichTextEditor, {
  normalizeOnChange: (onChange) => {
    // Customize how onChange events are handled
    return (event) => onChange(event.target.value);
  }
});

// Use in forms
this.addRow()
  .addField("description")
    .component("RichEditor")  // Reference by name
    .label("Description")
  .endField()
.endRow();`;

const resolveComponentCode = `import { Lumino } from "lumino/core";

// Resolve a component type
const TextField = Lumino.ui.resolve("TextField");

// This works for:
// 1. String names (e.g., "TextField")
// 2. Custom component overrides
// 3. Direct component references`;

const clearAdapterCode = `import { Lumino } from "lumino/core";

// Clear adapter (useful for testing)
Lumino.ui.clear();

// Verify
console.log(Lumino.ui.hasAdapter()); // false`;

const uiAdapterTypeCode = `export interface UIAdapter {
  name: string;
  components: Record<string, ComponentEntry>;
  layout?: LayoutAdapter;
  customComponents?: Record<string, ComponentType<any>>;
  resolveComponent?: (componentType: any) => ComponentType<any> | null;
  normalizeOnChange?: (componentType: any, onChange: (value: any) => void) => (...args: any[]) => void;
}

export interface LayoutAdapter {
  Row?: ComponentType<any>;
  Column?: ComponentType<any>;
  Section?: ComponentType<any>;
  Form?: ComponentType<any>;
  FieldWrapper?: ComponentType<any>;
}

export interface ComponentEntry {
  component: ComponentType<any>;
  normalizeOnChange?: (onChange: (value: any) => void) => (...args: any[]) => void;
}`;

const extendAdapterCode = `import { extendAdapter } from "lumino/core";
import { muiAdapter } from "lumino/mui";
import { MyTextField } from "./components/MyTextField";

// Extend an adapter with custom components
const myAdapter = extendAdapter(muiAdapter, {
  TextField: MyTextField,
  Select: MySelect,
});

Lumino.ui(myAdapter);`;

export function LuminoRefPage() {
  return (
    <>
      <h1 className="docs-page-title">Lumino Namespace Reference</h1>
      <p className="docs-page-subtitle">
        Global namespace for configuring the Lumino framework and UI adapters.
      </p>

      {/* Signature */}
      <div className="docs-section">
        <h2 className="docs-section-title">Type Signature</h2>
        <CodeBlock code={signatureCode} language="typescript" />
      </div>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>Lumino</code> namespace is the central entry point for framework configuration.
          It provides methods to configure UI adapters, extend layout components, and register custom
          components.
        </p>
        <p>
          <strong>Key Features:</strong>
        </p>
        <ul>
          <li>Configure UI adapters (MUI, Ant Design, Salt, custom)</li>
          <li>Extend layout components globally</li>
          <li>Register custom field components</li>
          <li>Resolve component references</li>
          <li>Normalize onChange handlers for different UI libraries</li>
        </ul>
      </div>

      {/* Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">Methods</h2>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui(adapter?)
        </h3>
        <p>
          Set or get the active UI adapter. When called with an adapter, sets it as active. When
          called without arguments, returns the current adapter.
        </p>
        <CodeBlock code={basicUsageCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui.register(name, adapter)
        </h3>
        <p>
          Register a named UI adapter. This allows you to switch between adapters by name.
        </p>
        <CodeBlock code={registerAdapterCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui.extend(components)
        </h3>
        <p>
          Extend the current adapter's layout components. Use this to customize Row, Column,
          Section, Form, or FieldWrapper components globally.
        </p>
        <CodeBlock code={extendLayoutCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui.component(name, component, options?)
        </h3>
        <p>
          Add or override a component. Components registered this way can be referenced by name
          throughout your forms.
        </p>
        <CodeBlock code={customComponentCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui.resolve(componentType)
        </h3>
        <p>
          Resolve a component type to an actual component. Handles string names, custom overrides,
          and direct component references.
        </p>
        <CodeBlock code={resolveComponentCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui.get()
        </h3>
        <p>
          Get the effective adapter with all overrides applied. Returns <code>null</code> if no
          adapter is configured.
        </p>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui.hasAdapter()
        </h3>
        <p>
          Check if a UI adapter is currently configured. Returns <code>true</code> if an adapter is
          set, <code>false</code> otherwise.
        </p>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui.clear()
        </h3>
        <p>
          Clear the current adapter and all overrides. Useful for testing.
        </p>
        <CodeBlock code={clearAdapterCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          Lumino.ui.normalizeOnChange(componentType, onChange)
        </h3>
        <p>
          Get a normalized onChange handler for a component. Different UI libraries have different
          event signatures - this method normalizes them.
        </p>
      </div>

      {/* Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Related Types</h2>
        <CodeBlock code={uiAdapterTypeCode} language="typescript" />
      </div>

      {/* Helper Functions */}
      <div className="docs-section">
        <h2 className="docs-section-title">Helper Functions</h2>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          extendAdapter(adapter, customComponents)
        </h3>
        <p>
          Create a new adapter by extending an existing one with custom components.
        </p>
        <CodeBlock code={extendAdapterCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>Configure once</strong> - Set up your adapter once at app initialization
          </li>
          <li>
            <strong>Use extend() for layout</strong> - Extend layout components for global customization
          </li>
          <li>
            <strong>Use component() for fields</strong> - Register custom field components by name
          </li>
          <li>
            <strong>Prefer adapter switching</strong> - Register multiple adapters and switch by name
          </li>
          <li>
            <strong>Test adapter clearing</strong> - Use clear() in test cleanup
          </li>
        </ul>
      </div>

      {/* Examples */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <CodeBlock
          code={`import { Lumino, extendAdapter } from "lumino/core";
import { muiAdapter } from "lumino/mui";
import { saltAdapter } from "lumino/salt";
import { MyCustomSection } from "./components/MyCustomSection";
import { RichTextEditor } from "./components/RichTextEditor";

// Configure adapters
Lumino.ui.register("mui", muiAdapter);
Lumino.ui.register("salt", saltAdapter);

// Set active adapter
Lumino.ui("mui");

// Extend layout
Lumino.ui.extend({
  Section: MyCustomSection,
});

// Add custom component
Lumino.ui.component("RichEditor", RichTextEditor);

// Verify configuration
console.log(Lumino.ui.hasAdapter()); // true

// Use in app
function App() {
  return (
    <LuminoProvider app={app}>
      <YourApp />
    </LuminoProvider>
  );
}`}
          language="typescript"
        />
      </div>
    </>
  );
}
