/**
 * Create Adapter Page
 *
 * Step-by-step guide for creating custom adapters.
 */

import React from "react";

export function CreateAdapterPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Creating Custom Adapters</h1>
      <p className="docs-page-subtitle">
        Step-by-step guide to building your own Lumino adapter for any UI library.
      </p>

      <div className="docs-section">
        <h2>Why Create a Custom Adapter?</h2>
        <p>
          You might want to create a custom adapter for:
        </p>
        <ul className="docs-list">
          <li>Using a different UI library (Material-UI, Ant Design, Chakra UI, etc.)</li>
          <li>Creating a company-specific design system</li>
          <li>Integrating custom components with Lumino forms</li>
          <li>Learning how Lumino's adapter system works</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Prerequisites</h2>
        <p>
          Before creating an adapter, you should be familiar with:
        </p>
        <ul className="docs-list">
          <li>TypeScript and React</li>
          <li>Lumino's form system and core concepts</li>
          <li>The UI library you're adapting</li>
          <li>Lumino's adapter interfaces</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Step 1: Project Setup</h2>
        <p>
          Create a directory structure for your adapter:
        </p>
        <pre className="docs-code">
{`src/adapters/my-adapter/
├── index.ts              # Main adapter export
├── fields/               # Field components
│   ├── TextInput.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   └── index.ts
├── layout/               # Layout components
│   ├── Row.tsx
│   ├── Column.tsx
│   └── index.ts
├── components/           # Container components
│   ├── Dialog.tsx
│   ├── Card.tsx
│   └── index.ts
└── actions/              # Action components
    ├── Button.tsx
    └── index.ts`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 2: Create Your First Component</h2>
        <p>
          Let's create a TextInput adapter using <code>createLuminoComponent</code>:
        </p>
        <pre className="docs-code">
{`// src/adapters/my-adapter/fields/TextInput.tsx
import React from "react";
import { TextField } from "my-ui-library";
import { createLuminoComponent } from "lumino/core/adapters";
import type { TextInputProps } from "lumino/core/adapters";

/**
 * Lumino TextInput adapter for my-ui-library
 */
export const MyTextInput = createLuminoComponent(TextField, {
  // Map props: Lumino → Library
  props: {
    error: {
      to: "error",                    // Target prop name
      transform: (error) => !!error   // Convert to boolean
    },
    value: {
      to: "value",
      transform: (value) => value ?? ""  // Ensure string
    }
  },

  // Map events: Library → Lumino (extract clean values)
  events: {
    onChange: {
      to: "onChange",
      extract: (event) => event.target.value  // Extract value from event
    },
    onBlur: {
      to: "onBlur",
      extract: () => undefined  // onBlur doesn't need a value
    }
  },

  // Props to exclude from pass-through
  exclude: ["helperText"],

  // Custom render for complex cases (optional)
  render: (transformedProps, TextField, originalProps) => {
    const { helperText } = originalProps as TextInputProps;

    return (
      <div>
        <TextField {...transformedProps} />
        {helperText && <small>{helperText}</small>}
      </div>
    );
  }
});`}</pre>

        <h3>Understanding createLuminoComponent</h3>
        <p>
          The <code>createLuminoComponent</code> utility has six configuration options:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Purpose</th>
              <th>When to Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>props</code></td>
              <td>Map Lumino props to library props</td>
              <td>When prop names or formats differ</td>
            </tr>
            <tr>
              <td><code>events</code></td>
              <td>Extract clean values from events</td>
              <td>When library uses DOM events</td>
            </tr>
            <tr>
              <td><code>defaults</code></td>
              <td>Default props to always apply</td>
              <td>For consistent behavior</td>
            </tr>
            <tr>
              <td><code>exclude</code></td>
              <td>Props to not pass through</td>
              <td>For special handling in render</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td>Generate children from options</td>
              <td>For Select, RadioGroup, etc.</td>
            </tr>
            <tr>
              <td><code>render</code></td>
              <td>Custom render function</td>
              <td>When you need full control</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Step 3: Create a Select Component</h2>
        <p>
          Select components require the <code>children</code> config to generate options:
        </p>
        <pre className="docs-code">
{`// src/adapters/my-adapter/fields/Select.tsx
import React from "react";
import { Select, Option } from "my-ui-library";
import { createLuminoComponent } from "lumino/core/adapters";

export const MySelect = createLuminoComponent(Select, {
  props: {
    error: {
      to: "error",
      transform: (error) => !!error
    }
  },

  events: {
    onChange: {
      to: "onChange",
      extract: (event) => event.target.value
    }
  },

  // Generate <Option> children from options prop
  children: {
    from: "options",           // Source prop name
    Component: Option,         // Component to render
    getProps: (option) => ({   // Extract props for each option
      value: option.value,
      disabled: option.disabled
    }),
    getChildren: (option) => option.label  // Option content
  }
});

// This enables:
// <MySelect
//   options={[
//     { value: "1", label: "Option 1" },
//     { value: "2", label: "Option 2" }
//   ]}
// />
//
// Which renders:
// <Select>
//   <Option value="1">Option 1</Option>
//   <Option value="2">Option 2</Option>
// </Select>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 4: Create a Field Adapter</h2>
        <p>
          Group your field components into a field adapter:
        </p>
        <pre className="docs-code">
{`// src/adapters/my-adapter/fields/index.ts
import type { IFieldAdapter } from "lumino/core/adapters";
import { MyTextInput } from "./TextInput";
import { MySelect } from "./Select";
import { MyCheckbox } from "./Checkbox";
// ... import other fields

export const myFieldAdapter: IFieldAdapter = {
  TextInput: MyTextInput,
  Select: MySelect,
  Checkbox: MyCheckbox,
  // Add more as you implement them
};

// Re-export individual components
export { MyTextInput, MySelect, MyCheckbox };`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 5: Create Layout Components</h2>
        <p>
          Layout components are often simple wrappers:
        </p>
        <pre className="docs-code">
{`// src/adapters/my-adapter/layout/Row.tsx
import React from "react";

export interface MyRowProps {
  children: React.ReactNode;
  gap?: number | string;
  className?: string;
}

export function MyRow({ children, gap = 16, className }: MyRowProps) {
  return (
    <div
      className={\`my-row \${className || ""}\`}
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gap: typeof gap === "number" ? \`\${gap}px\` : gap,
        gridAutoColumns: "1fr"
      }}
    >
      {children}
    </div>
  );
}

// src/adapters/my-adapter/layout/index.ts
import type { ILayoutAdapter } from "lumino/core/adapters";
import { MyRow } from "./Row";
import { MyColumn } from "./Column";
import { MySection } from "./Section";
// ... import others

export const myLayoutAdapter: ILayoutAdapter = {
  Row: MyRow,
  Column: MyColumn,
  Section: MySection,
  // ... add more
};

export { MyRow, MyColumn, MySection };`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 6: Create the Main Adapter</h2>
        <p>
          Combine all adapters into the main IUIAdapter:
        </p>
        <pre className="docs-code">
{`// src/adapters/my-adapter/index.ts
import type { IUIAdapter } from "lumino/core/adapters";
import { myFieldAdapter } from "./fields";
import { myLayoutAdapter } from "./layout";
import { myContainerAdapter } from "./components";
import { myActionAdapter } from "./actions";

/**
 * My UI Library Adapter for Lumino
 */
export const myAdapter: IUIAdapter = {
  name: "my-adapter",
  fields: myFieldAdapter,
  layout: myLayoutAdapter,
  containers: myContainerAdapter,
  actions: myActionAdapter,

  // Component resolution for string references
  resolveComponent: (componentType) => {
    if (typeof componentType === "string") {
      // Check field adapter
      const field = (myFieldAdapter as any)[componentType];
      if (field) return field;

      // Check container adapter
      const container = (myContainerAdapter as any)[componentType];
      if (container) return container;

      // Check action adapter
      const action = (myActionAdapter as any)[componentType];
      if (action) return action;
    }
    return componentType;
  }
};

// Re-export all components
export * from "./fields";
export * from "./layout";
export * from "./components";
export * from "./actions";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 7: Register and Test</h2>
        <p>
          Register your adapter and test it with a simple form:
        </p>
        <pre className="docs-code">
{`// main.tsx
import { Lumino } from "lumino";
import { myAdapter } from "./adapters/my-adapter";

// Register adapter
Lumino.ui(myAdapter);

// Test with a form
import { Form } from "lumino/core";
import { FormRenderer } from "lumino/react";

class TestEntity {
  name = "";
  email = "";
}

class TestForm extends Form<TestEntity> {
  constructor() {
    super("test-form");
  }

  configure() {
    this.addSection("Test")
      .addRow()
        .addField("name")
          .component("TextInput")  // Will use MyTextInput
          .label("Name")
          .endField()
        .addField("email")
          .component("TextInput")
          .label("Email")
          .endField()
      .endRow()
    .endSection();
  }
}

function App() {
  return <FormRenderer form={new TestForm()} entity={new TestEntity()} />;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Advanced: Complex Component with Render</h2>
        <p>
          For components requiring complex structure, use the <code>render</code> function:
        </p>
        <pre className="docs-code">
{`import { Dialog, DialogHeader, DialogBody, DialogFooter } from "my-ui-library";
import { createLuminoComponent } from "lumino/core/adapters";

export const MyDialog = createLuminoComponent(Dialog, {
  exclude: ["title", "footer", "onClose"],

  render: (transformedProps, Dialog, originalProps) => {
    const { open, onClose, title, footer, children } = originalProps as any;

    return (
      <Dialog
        {...transformedProps}
        open={open}
        onClose={onClose}
      >
        {title && <DialogHeader>{title}</DialogHeader>}
        <DialogBody>{children}</DialogBody>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </Dialog>
    );
  }
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Handling Different Event Patterns</h2>
        <p>
          Different UI libraries use different event patterns. Here's how to handle them:
        </p>

        <h3>Pattern 1: DOM Events (Most Common)</h3>
        <pre className="docs-code">
{`// Library: onChange(event)
events: {
  onChange: {
    to: "onChange",
    extract: (event) => event.target.value
  }
}`}</pre>

        <h3>Pattern 2: Direct Values</h3>
        <pre className="docs-code">
{`// Library: onChange(value)
events: {
  onChange: {
    to: "onChange",
    extract: (value) => value  // Pass through
  }
}`}</pre>

        <h3>Pattern 3: Multiple Arguments</h3>
        <pre className="docs-code">
{`// Library: onSelectionChange(event, selected[])
// Lumino: onChange(value)
render: (transformedProps, Component, originalProps) => {
  const { onChange } = originalProps as any;

  const handleChange = (event: any, selected: any[]) => {
    onChange?.(selected[0]); // Extract first selected
  };

  return <Component {...transformedProps} onSelectionChange={handleChange} />;
}`}</pre>

        <h3>Pattern 4: Checkbox (Checked State)</h3>
        <pre className="docs-code">
{`// Library: onChange(event)
// Lumino: onChange(boolean)
events: {
  onChange: {
    to: "onChange",
    extract: (event) => event.target.checked
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Prop Transformation Examples</h2>

        <h3>Error Handling</h3>
        <pre className="docs-code">
{`// Lumino: error?: string | boolean
// Library: invalid?: boolean

props: {
  error: {
    to: "invalid",
    transform: (error) => !!error  // Convert to boolean
  }
}

// Or for libraries that expect error text:
props: {
  error: {
    to: "errorText",
    transform: (error) => typeof error === "string" ? error : undefined
  }
}`}</pre>

        <h3>Variant Mapping</h3>
        <pre className="docs-code">
{`// Lumino: variant: "primary" | "secondary" | "tertiary"
// Library: color: "primary" | "default" | "secondary"

props: {
  variant: {
    to: "color",
    transform: (variant) => {
      if (variant === "primary") return "primary";
      if (variant === "secondary") return "default";
      return "secondary";
    }
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Testing Your Adapter</h2>
        <p>
          Create comprehensive tests for your adapter:
        </p>
        <pre className="docs-code">
{`// __tests__/MyTextInput.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MyTextInput } from "../fields/TextInput";

describe("MyTextInput", () => {
  it("renders with value", () => {
    render(<MyTextInput value="test" onChange={() => {}} />);
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });

  it("calls onChange with clean value", () => {
    const onChange = jest.fn();
    render(<MyTextInput value="" onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(onChange).toHaveBeenCalledWith("new value");
  });

  it("shows error state", () => {
    render(<MyTextInput value="" error="Required" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Start Small</strong> - Begin with TextInput, Select, and Checkbox
          </li>
          <li>
            <strong>Follow Lumino Patterns</strong> - Study the Salt adapter as a reference
          </li>
          <li>
            <strong>Use createLuminoComponent</strong> - Don't manually wire up props
          </li>
          <li>
            <strong>Test Thoroughly</strong> - Test all prop combinations and events
          </li>
          <li>
            <strong>Document Mappings</strong> - Document how props are transformed
          </li>
          <li>
            <strong>Handle Edge Cases</strong> - null/undefined values, empty strings, etc.
          </li>
          <li>
            <strong>Provide TypeScript Types</strong> - Export all component prop types
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Common Pitfalls</h2>
        <ul className="docs-list">
          <li>
            <strong>Forgetting to Extract Event Values</strong> - Always use <code>events.extract</code>
          </li>
          <li>
            <strong>Not Handling Null/Undefined</strong> - Check for null values in transforms
          </li>
          <li>
            <strong>Incorrect Prop Mapping</strong> - Verify library's actual prop names
          </li>
          <li>
            <strong>Missing resolveComponent</strong> - Implement it for string references to work
          </li>
          <li>
            <strong>Inconsistent Naming</strong> - Use consistent prefixes (e.g., "My" or "Lumino")
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Publishing Your Adapter</h2>
        <p>
          If you want to share your adapter with the community:
        </p>
        <ol className="docs-list">
          <li>Create a separate npm package (e.g., <code>lumino-mui-adapter</code>)</li>
          <li>Add peer dependencies for Lumino and your UI library</li>
          <li>Write comprehensive documentation</li>
          <li>Include examples and demos</li>
          <li>Set up CI/CD for testing</li>
          <li>Publish to npm with appropriate keywords</li>
        </ol>

        <pre className="docs-code">
{`// package.json
{
  "name": "lumino-my-adapter",
  "version": "1.0.0",
  "description": "Lumino adapter for My UI Library",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "lumino": "^1.0.0",
    "my-ui-library": "^5.0.0",
    "react": "^18.0.0"
  },
  "keywords": ["lumino", "adapter", "my-ui-library", "forms"]
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Example: Complete Checkbox Adapter</h2>
        <p>
          Here's a complete example showing all aspects:
        </p>
        <pre className="docs-code">
{`import React from "react";
import { Checkbox } from "my-ui-library";
import { createLuminoComponent } from "lumino/core/adapters";
import type { CheckboxProps } from "lumino/core/adapters";

/**
 * Lumino Checkbox adapter for My UI Library
 *
 * Prop Mappings:
 * - checked → checked
 * - onChange(boolean) ← onChange(event)
 * - error → error (boolean)
 * - label → label
 */
export const MyCheckbox = createLuminoComponent(Checkbox, {
  // Prop transformations
  props: {
    checked: {
      to: "checked",
      transform: (checked) => !!checked
    },
    error: {
      to: "error",
      transform: (error) => !!error
    }
  },

  // Event extraction
  events: {
    onChange: {
      to: "onChange",
      extract: (event) => event.target.checked
    }
  },

  // Default props
  defaults: {
    color: "primary"
  }
});

// Export with type
export type { CheckboxProps };`}</pre>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li>
            <a href="#/adapters/adapter-interfaces">Adapter Interfaces</a> - Study all interface definitions
          </li>
          <li>
            <a href="#/adapters/salt-overview">Salt Adapter</a> - Reference implementation
          </li>
          <li>
            <a href="https://github.com/lumino-framework/lumino" target="_blank" rel="noopener noreferrer">
              Lumino GitHub
            </a> - Contribute your adapter
          </li>
        </ul>
      </div>
    </div>
  );
}
