/**
 * Adapter Interfaces Page
 *
 * Documents all adapter interface definitions.
 */

import React from "react";

export function AdapterInterfacesPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Adapter Interfaces</h1>
      <p className="docs-page-subtitle">
        Complete reference for all adapter interface definitions in Lumino.
      </p>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          Lumino defines a set of interfaces that adapters must implement. These interfaces
          ensure consistency across different UI libraries and enable framework-agnostic
          form development.
        </p>
        <ul className="docs-list">
          <li>
            <strong>Type-Safe</strong> - Full TypeScript support with strict typing
          </li>
          <li>
            <strong>Consistent</strong> - Same interface regardless of UI library
          </li>
          <li>
            <strong>Extensible</strong> - Easy to add custom components
          </li>
          <li>
            <strong>Optional</strong> - Implement only the components you need
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>IUIAdapter</h2>
        <p>
          The main adapter interface that combines all component adapters:
        </p>
        <pre className="docs-code">
{`export interface IUIAdapter {
  // Adapter identifier
  name: string;

  // Component category adapters
  fields?: IFieldAdapter;
  layout?: ILayoutAdapter;
  containers?: IContainerAdapter;
  actions?: IActionAdapter;
  lists?: IListAdapter;
  feedback?: IFeedbackAdapter;

  // App-level renderers
  AppLayoutRenderer?: ComponentType<AppLayoutRendererProps>;
  NavRenderer?: ComponentType<{
    items: any[];
    currentRoute: string;
    navigate?: (path: string) => void;
    orientation?: "horizontal" | "vertical";
    className?: string;
  }>;

  // Component resolution
  resolveComponent?: (componentType: string | ComponentType) => ComponentType;
}`}</pre>

        <h3>Usage</h3>
        <pre className="docs-code">
{`import { IUIAdapter } from "lumino/core/adapters";
import { saltFieldAdapter, saltLayoutAdapter } from "./adapters";

const myAdapter: IUIAdapter = {
  name: "my-adapter",
  fields: saltFieldAdapter,
  layout: saltLayoutAdapter,
  // ... other adapters
};

// Register adapter
Lumino.ui(myAdapter);`}</pre>
      </div>

      <div className="docs-section">
        <h2>IFieldAdapter</h2>
        <p>
          Defines form input field components:
        </p>
        <pre className="docs-code">
{`export interface IFieldAdapter {
  TextInput?: ComponentType<TextInputProps>;
  NumberInput?: ComponentType<NumberInputProps>;
  TextArea?: ComponentType<TextAreaProps>;
  Checkbox?: ComponentType<CheckboxProps>;
  CheckboxGroup?: ComponentType<CheckboxGroupProps>;
  Switch?: ComponentType<SwitchProps>;
  RadioGroup?: ComponentType<RadioGroupProps>;
  Select?: ComponentType<SelectProps>;
  MultiSelect?: ComponentType<MultiSelectProps>;
  Autocomplete?: ComponentType<AutocompleteProps>;
  DatePicker?: ComponentType<DatePickerProps>;
  TimePicker?: ComponentType<TimePickerProps>;
}`}</pre>

        <h3>Common Field Props</h3>
        <pre className="docs-code">
{`// All field components accept these base props:
interface BaseFieldProps {
  value?: any;
  onChange?: (value: any) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string | boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}`}</pre>

        <h3>Example Implementation</h3>
        <pre className="docs-code">
{`import { Input } from "my-ui-library";
import { createLuminoComponent } from "lumino/core/adapters";

const MyTextInput = createLuminoComponent(Input, {
  props: {
    error: {
      to: "invalid",
      transform: (error) => !!error
    }
  },
  events: {
    onChange: {
      to: "onChange",
      extract: (event) => event.target.value
    }
  }
});

const fieldAdapter: IFieldAdapter = {
  TextInput: MyTextInput,
  // ... other fields
};`}</pre>
      </div>

      <div className="docs-section">
        <h2>ILayoutAdapter</h2>
        <p>
          Defines layout and structural components:
        </p>
        <pre className="docs-code">
{`export interface ILayoutAdapter {
  Row?: ComponentType<RowLayoutProps>;
  Column?: ComponentType<ColumnLayoutProps>;
  Section?: ComponentType<SectionLayoutProps>;
  Form?: ComponentType<FormLayoutProps>;
  FieldWrapper?: ComponentType<FieldWrapperProps>;
  Grid?: ComponentType<GridProps>;
  ErrorMessage?: ComponentType<ErrorMessageProps>;
}`}</pre>

        <h3>Layout Props</h3>
        <pre className="docs-code">
{`interface RowLayoutProps {
  children: ReactNode;
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
}

interface ColumnLayoutProps {
  children: ReactNode;
  gap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
}

interface SectionLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

interface FieldWrapperProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>IContainerAdapter</h2>
        <p>
          Defines UI container components:
        </p>
        <pre className="docs-code">
{`export interface IContainerAdapter {
  Dialog?: ComponentType<DialogProps>;
  Panel?: ComponentType<PanelProps>;
  Card?: ComponentType<CardProps>;
  Tabs?: ComponentType<TabsProps>;
  TabPanel?: ComponentType<TabPanelProps>;
}`}</pre>

        <h3>Container Props</h3>
        <pre className="docs-code">
{`interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "small" | "medium" | "large" | "fullscreen";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

interface CardProps {
  children: ReactNode;
  variant?: "elevated" | "outlined" | "filled";
  padding?: number | string;
  className?: string;
}

interface TabsProps {
  items: any[];
  activeIndex: number;
  onTabChange: (index: number) => void;
  getLabel?: (item: any, index: number) => string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>IActionAdapter</h2>
        <p>
          Defines action components like buttons:
        </p>
        <pre className="docs-code">
{`export interface IActionAdapter {
  Button?: ComponentType<ButtonProps>;
  IconButton?: ComponentType<IconButtonProps>;
  Toolbar?: ComponentType<ToolbarProps>;
  ButtonGroup?: ComponentType<ButtonGroupProps>;
}`}</pre>

        <h3>Action Props</h3>
        <pre className="docs-code">
{`interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  tooltip?: string;
  variant?: "default" | "primary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>IListAdapter</h2>
        <p>
          Defines list and data display components:
        </p>
        <pre className="docs-code">
{`export interface IListAdapter {
  Tabs?: ComponentType<ListTabsProps>;
  Table?: ComponentType<ListTableProps>;
  Cards?: ComponentType<ListCardsProps>;
  TableComponents?: {
    Table: ComponentType<any>;
    THead: ComponentType<any>;
    TBody: ComponentType<any>;
    TR: ComponentType<any>;
    TH: ComponentType<any>;
    TD: ComponentType<any>;
  };
}`}</pre>

        <h3>List Props</h3>
        <pre className="docs-code">
{`interface ListTableProps {
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    width?: number | string;
    render?: (value: any, item: any, index: number) => ReactNode;
  }>;
  onRowClick?: (index: number) => void;
  rowActions?: Array<{
    label: string;
    onClick: (index: number) => void;
    enabled?: (index: number) => boolean;
  }>;
}

interface ListCardsProps {
  items: any[];
  renderCard: (item: any, index: number) => ReactNode;
  columns?: number;
  gap?: number | string;
  className?: string;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>IFeedbackAdapter</h2>
        <p>
          Defines feedback and notification components:
        </p>
        <pre className="docs-code">
{`export interface IFeedbackAdapter {
  Alert?: ComponentType<AlertProps>;
  Badge?: ComponentType<BadgeProps>;
  Avatar?: ComponentType<AvatarProps>;
  Toast?: ComponentType<ToastProps>;
  Spinner?: ComponentType<SpinnerProps>;
  Progress?: ComponentType<ProgressProps>;
  Tooltip?: ComponentType<TooltipProps>;
  Banner?: ComponentType<BannerProps>;
}`}</pre>

        <h3>Feedback Props</h3>
        <pre className="docs-code">
{`interface AlertProps {
  status?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  closable?: boolean;
  className?: string;
}

interface BadgeProps {
  value?: string | number;
  status?: "info" | "success" | "warning" | "error";
  variant?: "solid" | "outlined";
  max?: number;
  showZero?: boolean;
  className?: string;
}

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

interface ProgressProps {
  value: number;
  max?: number;
  variant?: "linear" | "circular";
  showLabel?: boolean;
  className?: string;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Component Resolution</h2>
        <p>
          The <code>resolveComponent</code> method enables string-based component references:
        </p>
        <pre className="docs-code">
{`const adapter: IUIAdapter = {
  name: "my-adapter",
  fields: myFieldAdapter,

  resolveComponent: (componentType) => {
    if (typeof componentType === "string") {
      // Check field adapter
      const field = myFieldAdapter[componentType];
      if (field) return field;

      // Check other adapters...
      // Check custom components...
    }
    return componentType;
  }
};

// Now you can use string references:
this.addField("name")
  .component("TextInput")  // Resolved via resolveComponent
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Extending Adapters</h2>
        <p>
          Use the <code>extendAdapter</code> utility to add components to existing adapters:
        </p>
        <pre className="docs-code">
{`import { extendAdapter } from "lumino/core/adapters";
import { saltAdapter } from "lumino/adapters/salt";
import { MyCustomInput } from "./MyCustomInput";

// Extend Salt adapter with custom component
const customAdapter = extendAdapter(saltAdapter, {
  fields: {
    CustomInput: MyCustomInput
  }
});

// Register extended adapter
Lumino.ui(customAdapter);

// Now you can use your custom component
this.addField("custom")
  .component("CustomInput")
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Partial Adapters</h2>
        <p>
          You don't need to implement all interfaces. Partial adapters are valid:
        </p>
        <pre className="docs-code">
{`// Minimal adapter - only fields
const minimalAdapter: IUIAdapter = {
  name: "minimal",
  fields: {
    TextInput: MyTextInput,
    Select: MySelect
  }
};

// Lumino will use default fallbacks for missing components
Lumino.ui(minimalAdapter);`}</pre>
      </div>

      <div className="docs-section">
        <h2>Type Safety</h2>
        <p>
          All adapter interfaces are fully typed for TypeScript safety:
        </p>
        <pre className="docs-code">
{`import { IFieldAdapter, TextInputProps } from "lumino/core/adapters";

// Component must match interface signature
const MyTextInput: ComponentType<TextInputProps> = (props) => {
  const { value, onChange, label, error } = props;
  // TypeScript ensures all props are correctly typed
  return <input value={value} onChange={(e) => onChange?.(e.target.value)} />;
};

const fieldAdapter: IFieldAdapter = {
  TextInput: MyTextInput,  // Type-checked!
};`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Implement Common Components First</strong> - Start with TextInput, Select,
            Checkbox, and Button
          </li>
          <li>
            <strong>Use createLuminoComponent</strong> - Leverage Lumino's adapter creation
            utility for consistency
          </li>
          <li>
            <strong>Follow Naming Conventions</strong> - Use "Lumino" prefix for all adapted
            components
          </li>
          <li>
            <strong>Provide resolveComponent</strong> - Enable string-based component references
          </li>
          <li>
            <strong>Document Prop Mappings</strong> - Clearly document how props are mapped
          </li>
          <li>
            <strong>Test Thoroughly</strong> - Test all prop combinations and edge cases
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li>
            <a href="#/adapters/create-adapter">Create Custom Adapter</a> - Build your own adapter
          </li>
          <li>
            <a href="#/adapters/salt-overview">Salt Adapter</a> - Study the reference implementation
          </li>
          <li>
            <a href="#/api-reference/prop-interfaces">Prop Interfaces</a> - Detailed prop documentation
          </li>
        </ul>
      </div>
    </div>
  );
}
