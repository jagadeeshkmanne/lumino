/**
 * Form Renderer Page - Rendering forms in React
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicUsageCode = `import { FormRenderer } from "lumino/react";
import { MyForm } from "./MyForm";

// Create form instance
const form = new MyForm();

// Render the form
function MyComponent() {
  return (
    <FormRenderer
      form={form}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
    />
  );
}`;

const formRendererPropsCode = `interface FormRendererProps<T> {
  // Required
  form: Form<T>;                         // The form instance

  // Data
  initialValues?: Partial<T>;            // Initial form values
  entity?: T;                            // Full entity instance

  // Mode
  mode?: "new" | "edit" | "view";        // Form mode (default: "new")

  // Callbacks
  onChange?: (values: Partial<T>) => void;    // Called on any change
  onSubmit?: (values: Partial<T>) => void;    // Called on submit
  onValidate?: (isValid: boolean) => void;    // Called after validation

  // Integration
  notificationContext?: NotificationContextValue;  // For notifications
  navigate?: (path: string) => void;               // For navigation

  // Styling
  className?: string;                    // Custom CSS class
  style?: React.CSSProperties;           // Inline styles
}`;

const withCallbacksCode = `function EmployeeEditor() {
  const [formData, setFormData] = useState<Employee>({});
  const navigate = useNavigate();

  const form = useMemo(() => new EmployeeForm(), []);

  return (
    <FormRenderer
      form={form}
      initialValues={formData}
      mode="edit"
      onChange={(values) => {
        console.log("Form changed:", values);
        setFormData(values);
      }}
      onSubmit={async (values) => {
        await api.saveEmployee(values);
        navigate("/employees");
      }}
      onValidate={(isValid) => {
        console.log("Validation result:", isValid);
      }}
    />
  );
}`;

const withEntityCode = `// Using full entity class instance
class Employee {
  id?: number;
  firstName = "";
  lastName = "";
  email = "";
  department = "";

  get fullName() {
    return \`\${this.firstName} \${this.lastName}\`;
  }
}

function EmployeeForm() {
  // Fetch or create entity
  const employee = new Employee();
  employee.id = 1;
  employee.firstName = "John";
  employee.lastName = "Doe";

  const form = useMemo(() => new EmployeeForm(), []);

  return (
    <FormRenderer
      form={form}
      entity={employee}
      mode="edit"
    />
  );
}`;

const modesCode = `// New mode - empty form for creating new records
<FormRenderer
  form={form}
  mode="new"
  initialValues={{}}
/>

// Edit mode - pre-filled form for editing
<FormRenderer
  form={form}
  mode="edit"
  initialValues={existingEmployee}
/>

// View mode - read-only display
<FormRenderer
  form={form}
  mode="view"
  initialValues={existingEmployee}
/>`;

const withNotificationsCode = `import { useNotification } from "lumino/core";

function MyFormPage() {
  const { notify } = useNotification();
  const form = useMemo(() => new ContactForm(), []);

  return (
    <FormRenderer
      form={form}
      notificationContext={notify}
      onSubmit={async (values) => {
        try {
          await api.save(values);
          // Notifications available in form via ctx.notify
        } catch (error) {
          // Error handling
        }
      }}
    />
  );
}`;

const dynamicFormCode = `function DynamicForm({ type }: { type: "simple" | "advanced" }) {
  // Create different forms based on type
  const form = useMemo(() => {
    return type === "advanced"
      ? new AdvancedContactForm()
      : new SimpleContactForm();
  }, [type]);

  return (
    <FormRenderer
      form={form}
      key={type}  // Force re-render when type changes
      initialValues={{}}
    />
  );
}`;

const withHooksCode = `import { useForm, useFormData } from "lumino/react";

function MyFormComponent() {
  // Access form state via hooks
  const { form, validate, reset } = useForm(MyForm);
  const { values, setValue, isDirty } = useFormData();

  return (
    <div>
      <FormRenderer form={form} />

      <div className="form-actions">
        <button onClick={reset} disabled={!isDirty}>
          Reset
        </button>
        <button onClick={validate}>
          Validate
        </button>
        <p>Values: {JSON.stringify(values)}</p>
      </div>
    </div>
  );
}`;

const styledFormCode = `// Custom styling
<FormRenderer
  form={form}
  className="my-custom-form"
  style={{
    maxWidth: 800,
    margin: "0 auto",
    padding: 24,
  }}
/>

// CSS file
.my-custom-form {
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.my-custom-form .lumino-section {
  margin-bottom: 24px;
}

.my-custom-form .lumino-field {
  margin-bottom: 16px;
}`;

const pageVsFormRendererCode = `// Option 1: Direct FormRenderer (simple cases)
function SimplePage() {
  const form = new ContactForm();
  return <FormRenderer form={form} initialValues={{}} />;
}

// Option 2: PageRenderer (with routing, modes, multiple forms)
class ContactPage extends Page<Contact> {
  private form = new ContactForm();

  configure() {
    this.route("/contacts/:id?");
    this.mode((ctx) => ctx.routeParams.id ? "edit" : "new");

    this.onMode("edit", async (ctx) => {
      const contact = await api.getContact(ctx.routeParams.id);
      ctx.setEntity(contact);
    });

    this.addForm(this.form);
  }
}

function ContactsPage() {
  const page = new ContactPage();
  return <PageRenderer page={page} />;
}`;

export function FormRendererPage() {
  return (
    <>
      <h1 className="docs-page-title">FormRenderer</h1>
      <p className="docs-page-subtitle">
        The React component that renders Lumino forms.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>FormRenderer</code> is the React component that takes a Form instance
          and renders it to the DOM. It handles state management, validation triggering,
          and all the React lifecycle integration.
        </p>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Props */}
      <div className="docs-section">
        <h2 className="docs-section-title">Props Reference</h2>
        <CodeBlock code={formRendererPropsCode} language="typescript" />
      </div>

      {/* With Callbacks */}
      <div className="docs-section">
        <h2 className="docs-section-title">With Callbacks</h2>
        <p>
          Handle form changes, submission, and validation via callbacks:
        </p>
        <CodeBlock code={withCallbacksCode} language="typescript" />
      </div>

      {/* With Entity */}
      <div className="docs-section">
        <h2 className="docs-section-title">With Entity Instance</h2>
        <p>
          Pass a full entity instance when you need access to computed properties
          or methods:
        </p>
        <CodeBlock code={withEntityCode} language="typescript" />
      </div>

      {/* Form Modes */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Modes</h2>
        <p>
          Control the form mode (new/edit/view):
        </p>
        <CodeBlock code={modesCode} language="typescript" />
      </div>

      {/* With Notifications */}
      <div className="docs-section">
        <h2 className="docs-section-title">With Notifications</h2>
        <p>
          Integrate with the notification system:
        </p>
        <CodeBlock code={withNotificationsCode} language="typescript" />
      </div>

      {/* Dynamic Forms */}
      <div className="docs-section">
        <h2 className="docs-section-title">Dynamic Forms</h2>
        <p>
          Switch between different form types:
        </p>
        <CodeBlock code={dynamicFormCode} language="typescript" />
      </div>

      {/* With Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Using Form Hooks</h2>
        <p>
          Access form state outside the form via React hooks:
        </p>
        <CodeBlock code={withHooksCode} language="typescript" />
      </div>

      {/* Styling */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Styling</h2>
        <p>
          Apply custom styles to the form:
        </p>
        <CodeBlock code={styledFormCode} language="typescript" />
      </div>

      {/* FormRenderer vs PageRenderer */}
      <div className="docs-section">
        <h2 className="docs-section-title">FormRenderer vs PageRenderer</h2>
        <p>
          Choose the right renderer for your use case:
        </p>
        <CodeBlock code={pageVsFormRendererCode} language="typescript" />
        <ul>
          <li>
            <strong>FormRenderer</strong> - Simple forms without routing or complex
            mode management
          </li>
          <li>
            <strong>PageRenderer</strong> - Full pages with routing, modes, multiple
            forms, and lifecycle hooks
          </li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>Page Builder</strong> - Building full pages with forms</li>
          <li><strong>Lumino Fields</strong> - Available field components</li>
          <li><strong>Validation</strong> - Adding validation rules</li>
        </ul>
      </div>
    </>
  );
}
