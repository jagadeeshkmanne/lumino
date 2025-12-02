/**
 * UI Adapters Documentation Page
 *
 * Documents how UI adapters work in Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function UIAdaptersPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">UI Adapters</h1>
      <p className="docs-page-subtitle">
        UI Adapters allow Lumino to work with any UI component library.
        They provide an abstraction layer between Lumino's form/page builders
        and the actual UI components.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        UI Adapters are the key to Lumino's component library independence.
      </div>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          Lumino doesn't ship with any specific UI library. Instead, it uses
          adapters to connect to your preferred component library:
        </p>
        <pre className="docs-code">{`┌─────────────────────────────────────────────────────────────┐
│                     Lumino Core                              │
│  (Forms, Pages, APIs, State Management)                      │
├─────────────────────────────────────────────────────────────┤
│                    UI Adapter Interface                      │
├────────────┬────────────┬────────────┬─────────────────────┤
│   Salt     │  Material  │  Chakra    │   Custom Adapter    │
│  Adapter   │  Adapter   │  Adapter   │   (Your Library)    │
└────────────┴────────────┴────────────┴─────────────────────┘`}</pre>
      </div>

      <div className="docs-section">
        <h2>Using an Adapter</h2>
        <p>
          Set the UI adapter when creating your Lumino app:
        </p>
        <pre className="docs-code">{`import { lumino } from "lumino/core";
import { LuminoProvider } from "lumino/react";
import { SaltUIAdapter } from "lumino/salt";

// Create app with Salt adapter
const app = lumino()
  .uiAdapter(SaltUIAdapter)
  .build();

// Use in your app
function Root() {
  return (
    <LuminoProvider app={app}>
      <App />
    </LuminoProvider>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Adapter Interface</h2>
        <p>
          A UI adapter must implement the <code>UIAdapter</code> interface:
        </p>
        <pre className="docs-code">{`interface UIAdapter {
  // Field Components
  fields: {
    TextInput: ComponentType<FieldProps>;
    NumberInput: ComponentType<FieldProps>;
    TextArea: ComponentType<FieldProps>;
    Select: ComponentType<SelectFieldProps>;
    MultiSelect: ComponentType<SelectFieldProps>;
    Autocomplete: ComponentType<AutocompleteProps>;
    Checkbox: ComponentType<FieldProps>;
    CheckboxGroup: ComponentType<FieldProps>;
    Switch: ComponentType<FieldProps>;
    RadioGroup: ComponentType<RadioGroupProps>;
    DatePicker: ComponentType<DateFieldProps>;
    TimePicker: ComponentType<TimeFieldProps>;
  };

  // Container Components
  containers: {
    Card: ComponentType<CardProps>;
    Table: ComponentType<TableProps>;
    Tabs: ComponentType<TabsProps>;
    Dialog: ComponentType<DialogProps>;
    Accordion: ComponentType<AccordionProps>;
  };

  // Action Components
  actions: {
    Button: ComponentType<ButtonProps>;
    IconButton: ComponentType<IconButtonProps>;
    Link: ComponentType<LinkProps>;
  };

  // Feedback Components
  feedback: {
    Toast: ComponentType<ToastProps>;
    Spinner: ComponentType<SpinnerProps>;
    Progress: ComponentType<ProgressProps>;
    Badge: ComponentType<BadgeProps>;
  };

  // Layout Components
  layout: {
    Box: ComponentType<BoxProps>;
    Stack: ComponentType<StackProps>;
    Grid: ComponentType<GridProps>;
    Divider: ComponentType<DividerProps>;
  };

  // UI Actions (imperative)
  showLoader: () => void;
  hideLoader: () => void;
  notify: (message: string, type?: NotificationType) => void;
  confirm: (message: string) => Promise<boolean>;
  alert: (message: string) => Promise<void>;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Built-in Adapters</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Adapter</th>
              <th>Package</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>SaltUIAdapter</code></td>
              <td>lumino/salt</td>
              <td>J.P. Morgan Salt Design System</td>
            </tr>
            <tr>
              <td><code>LuminoUIAdapter</code></td>
              <td>lumino/react</td>
              <td>Default Lumino components (lightweight)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Creating a Custom Adapter</h2>
        <p>
          You can create your own adapter for any component library:
        </p>
        <pre className="docs-code">{`import { UIAdapter } from "lumino/core";
import {
  TextField,
  Select,
  Button,
  Card,
  // ... other MUI components
} from "@mui/material";
import { toast } from "react-hot-toast";

// Wrapper to adapt MUI TextField to Lumino's FieldProps
function MUITextInput({ value, onChange, label, error, ...props }) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
      error={!!error}
      helperText={error}
      fullWidth
      {...props}
    />
  );
}

// Create the adapter
export const MaterialUIAdapter: UIAdapter = {
  fields: {
    TextInput: MUITextInput,
    NumberInput: MUINumberInput,
    TextArea: MUITextArea,
    Select: MUISelect,
    MultiSelect: MUIMultiSelect,
    Autocomplete: MUIAutocomplete,
    Checkbox: MUICheckbox,
    CheckboxGroup: MUICheckboxGroup,
    Switch: MUISwitch,
    RadioGroup: MUIRadioGroup,
    DatePicker: MUIDatePicker,
    TimePicker: MUITimePicker,
  },

  containers: {
    Card: MUICard,
    Table: MUITable,
    Tabs: MUITabs,
    Dialog: MUIDialog,
    Accordion: MUIAccordion,
  },

  actions: {
    Button: MUIButton,
    IconButton: MUIIconButton,
    Link: MUILink,
  },

  feedback: {
    Toast: MUIToast,
    Spinner: MUISpinner,
    Progress: MUIProgress,
    Badge: MUIBadge,
  },

  layout: {
    Box: MUIBox,
    Stack: MUIStack,
    Grid: MUIGrid,
    Divider: MUIDivider,
  },

  showLoader: () => {
    // Show global loading overlay
  },
  hideLoader: () => {
    // Hide global loading overlay
  },
  notify: (message, type = "info") => {
    toast[type](message);
  },
  confirm: async (message) => {
    return window.confirm(message);
  },
  alert: async (message) => {
    window.alert(message);
  },
};`}</pre>
      </div>

      <div className="docs-section">
        <h2>Field Component Props</h2>
        <p>
          All field components receive a standard set of props:
        </p>
        <pre className="docs-code">{`interface FieldProps {
  // Value & Change
  value: any;
  onChange: (value: any) => void;

  // Labels & Help
  label?: string;
  placeholder?: string;
  helperText?: string;

  // State
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;

  // Styling
  className?: string;
  style?: CSSProperties;

  // Form context
  fieldName?: string;
  formContext?: FormContext;

  // Additional props passed via .props()
  [key: string]: any;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Partial Adapters</h2>
        <p>
          You can extend an existing adapter with partial overrides:
        </p>
        <pre className="docs-code">{`import { SaltUIAdapter } from "lumino/salt";
import { CustomTextInput, CustomSelect } from "./components";

// Extend Salt adapter with custom components
const MyAdapter = {
  ...SaltUIAdapter,
  fields: {
    ...SaltUIAdapter.fields,
    // Override specific fields
    TextInput: CustomTextInput,
    Select: CustomSelect,
  },
  // Override notification behavior
  notify: (message, type) => {
    myCustomToast.show(message, { type });
  },
};

// Use the extended adapter
const app = lumino()
  .uiAdapter(MyAdapter)
  .build();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Component Resolution</h2>
        <p>
          When you use <code>.component()</code> in a form, Lumino resolves
          the actual component from the adapter:
        </p>
        <pre className="docs-code">{`// In your form
.addField("name")
  .component(LuminoTextInput)  // Symbolic reference
  .endField()

// Lumino maps this to the adapter's component:
// adapter.fields.TextInput

// So with SaltUIAdapter, it becomes:
// <SaltInput ... />

// With MaterialUIAdapter, it becomes:
// <MUITextField ... />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Runtime Adapter Switching</h2>
        <p>
          You can switch adapters at runtime (e.g., for theming):
        </p>
        <pre className="docs-code">{`function App() {
  const [adapter, setAdapter] = useState(SaltUIAdapter);

  const switchToMaterial = () => {
    setAdapter(MaterialUIAdapter);
  };

  return (
    <LuminoProvider
      app={app}
      uiAdapter={adapter}
    >
      <button onClick={switchToMaterial}>
        Switch to Material UI
      </button>
      <MainContent />
    </LuminoProvider>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Adapter Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Consistent Props</strong> - Ensure all field wrappers handle
            the standard FieldProps interface
          </li>
          <li>
            <strong>Error Handling</strong> - Make sure error states are properly
            displayed for each field type
          </li>
          <li>
            <strong>Accessibility</strong> - Ensure your adapter components maintain
            accessibility (labels, ARIA attributes)
          </li>
          <li>
            <strong>Theme Integration</strong> - Integrate with your component
            library's theming system
          </li>
          <li>
            <strong>Performance</strong> - Use React.memo for frequently updated
            components
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Testing Adapters</h2>
        <pre className="docs-code">{`import { render, screen, fireEvent } from "@testing-library/react";
import { MyAdapter } from "./MyAdapter";

describe("MyAdapter", () => {
  describe("fields.TextInput", () => {
    it("renders with label", () => {
      const { TextInput } = MyAdapter.fields;
      render(
        <TextInput
          label="Name"
          value=""
          onChange={() => {}}
        />
      );
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("displays error state", () => {
      const { TextInput } = MyAdapter.fields;
      render(
        <TextInput
          label="Email"
          value="invalid"
          error="Invalid email"
          onChange={() => {}}
        />
      );
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    it("calls onChange with new value", () => {
      const handleChange = jest.fn();
      const { TextInput } = MyAdapter.fields;
      render(
        <TextInput
          label="Name"
          value=""
          onChange={handleChange}
        />
      );
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "John" },
      });
      expect(handleChange).toHaveBeenCalledWith("John");
    });
  });
});`}</pre>
      </div>
    </div>
  );
}
