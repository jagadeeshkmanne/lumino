/**
 * useForm Hook Page - Form state management hook
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoNumberInput } from "lumino/react";

// =============================================================================
// DEMO FORM
// =============================================================================

interface Product {
  name: string;
  price: number;
  description: string;
}

class ProductForm extends Form<Product> {
  constructor() {
    super("product-form");
  }

  configure() {
    this.addSection("Product Details")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Product Name")
          .placeholder("Enter product name")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("price")
          .component(LuminoNumberInput)
          .label("Price")
          .placeholder("0.00")
          .rules(
            Validators.required({ message: "Price is required" }),
            Validators.min(0, "Price must be positive")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("description")
          .component(LuminoTextInput)
          .label("Description")
          .placeholder("Product description")
        .endField()
      .endRow()
    .endSection();
  }
}

const basicUsageCode = `import { useForm } from "lumino/react";
import { ProductForm } from "./ProductForm";

function ProductPage() {
  const form = useForm(new ProductForm());

  const {
    values,      // Current form values
    errors,      // Validation errors
    dirty,       // Has form been modified?
    valid,       // Is form valid?
    setValue,    // Update field value
    validate,    // Run validation
  } = form;

  return <FormRenderer form={form} />;
}`;

const withInitialValuesCode = `const product = {
  name: "Laptop",
  price: 999.99,
  description: "High-performance laptop"
};

const form = useForm(new ProductForm(), {
  initialValues: product,
  mode: "edit",
  readOnly: false,
  validateOnChange: true,
  validateOnBlur: true
});`;

const fieldOperationsCode = `const form = useForm(new EmployeeForm());

// Get field value
const name = form.getValue<string>("name");
const age = form.getValue<number>("age");

// Set field value
form.setValue("name", "John Doe");
form.setValue("age", 30);

// Set multiple values
form.setValues({
  name: "John Doe",
  age: 30,
  email: "john@example.com"
});

// Check field state
const isDirty = form.isFieldDirty("name");
const isTouched = form.isFieldTouched("email");

// Touch field (mark as interacted)
form.touchField("email");`;

const validationCode = `const form = useForm(new ProductForm());

// Validate entire form
const handleSubmit = async () => {
  const isValid = await form.validate();
  if (isValid) {
    // Submit form
    console.log("Form is valid:", form.values);
  }
};

// Validate single field
const handleBlur = async (fieldName: string) => {
  const isValid = await form.validateField(fieldName);
  if (!isValid) {
    console.log("Field errors:", form.getFieldErrors(fieldName));
  }
};

// Get field errors
const nameError = form.getFieldError("name");      // First error
const nameErrors = form.getFieldErrors("name");    // All errors

// Set/clear errors manually
form.setFieldError("email", "Email already exists");
form.clearFieldError("email");`;

const visibilityCode = `const form = useForm(new EmployeeForm());

// Check visibility
const isHidden = form.isFieldHidden("ssn");
const isAccessHidden = form.isFieldAccessHidden("salary");

// Show/hide fields
form.showField("ssn");
form.hideFieldByCondition("bonus");     // Hides + clears data + skips validation
form.hideFieldByAccess("salary");       // Hides + keeps data + validates

// Section visibility
form.showSection("personal-info");
form.hideSectionByCondition("advanced");
form.hideSectionByAccess("admin-only");

// Enable/disable fields
form.enableField("name");
form.disableField("id");
const isDisabled = form.isFieldDisabled("id");`;

const actionsCode = `class ProductForm extends Form<Product> {
  configure() {
    // ... field configuration

    this.addAction("save")
      .label("Save Product")
      .execute(async (ctx) => {
        const isValid = await ctx.validate();
        if (isValid) {
          const response = await ctx.api.post("/products", {
            body: ctx.getEntity()
          });
          ctx.notify.success("Product saved!");
          ctx.navigate(\`/products/\${response.id}\`);
        }
      });
  }
}

// In component
const form = useForm(new ProductForm());

const handleSave = async () => {
  await form.executeAction("save");
};

// Check if action exists
if (form.hasAction("save")) {
  // Show save button
}`;

const formContextCode = `const form = useForm(new EmployeeForm());

// Pass formContext to child components
<FormRenderer form={form}>
  <CustomSection formContext={form.formContext} />
</FormRenderer>

// In child component
function CustomSection({ formContext }: { formContext: FormContext }) {
  const name = formContext.getValue<string>("name");
  const setName = (value: string) => formContext.setValue("name", value);

  return (
    <div>
      <input
        value={name || ""}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}`;

const resetCode = `const form = useForm(new ProductForm());

// Reset entire form to initial values
form.reset();

// Reset single field
form.resetField("price");

// Check dirty state
if (form.dirty) {
  const confirmed = await confirm("Discard changes?");
  if (confirmed) {
    form.reset();
  }
}`;

const fieldOptionsCode = `// Dynamic field options (from dependsOn reloadApi)
const form = useForm(new AddressForm());

// Get options loaded by dependsOn
const states = form.getFieldOptions<State[]>("state");

// Set options manually
form.setFieldOptions("state", [
  { id: 1, name: "California" },
  { id: 2, name: "Texas" }
]);`;

const readOnlyCode = `// Start in read-only mode
const form = useForm(new ProductForm(), {
  mode: "view",
  readOnly: true
});

// Toggle read-only
const handleEdit = () => {
  form.setReadOnly(false);
};

// Check read-only state
if (form.readOnly) {
  // Show "Edit" button instead of "Save"
}`;

const fullExampleCode = `import { useForm } from "lumino/react";
import { EmployeeForm } from "./EmployeeForm";
import { FormRenderer } from "lumino/react";

function EmployeePage({ employeeId }: { employeeId?: number }) {
  const form = useForm(new EmployeeForm(), {
    mode: employeeId ? "edit" : "create",
    validateOnBlur: true
  });

  // Load employee data if editing
  useEffect(() => {
    if (employeeId) {
      loadEmployee(employeeId).then(employee => {
        form.setValues(employee);
      });
    }
  }, [employeeId]);

  const handleSave = async () => {
    // Validate before saving
    if (await form.validate()) {
      try {
        const employee = form.values;
        if (employeeId) {
          await updateEmployee(employeeId, employee);
        } else {
          await createEmployee(employee);
        }
        notify.success("Employee saved!");
        navigate("/employees");
      } catch (error) {
        notify.error("Failed to save employee");
      }
    } else {
      notify.error("Please fix validation errors");
    }
  };

  const handleCancel = () => {
    if (form.dirty) {
      confirm("Discard changes?").then(confirmed => {
        if (confirmed) {
          navigate("/employees");
        }
      });
    } else {
      navigate("/employees");
    }
  };

  return (
    <div>
      <h1>{employeeId ? "Edit" : "Create"} Employee</h1>

      <FormRenderer form={form} />

      <div className="actions">
        <button onClick={handleSave} disabled={form.submitting}>
          {form.submitting ? "Saving..." : "Save"}
        </button>
        <button onClick={handleCancel}>Cancel</button>
        {form.dirty && <span>Unsaved changes</span>}
      </div>

      {/* Show validation errors */}
      {!form.valid && (
        <div className="errors">
          {Object.entries(form.errors).map(([field, errors]) => (
            <div key={field}>
              {field}: {errors.join(", ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

export function UseFormPage() {
  const form = new ProductForm();

  return (
    <>
      <h1 className="docs-page-title">useForm</h1>
      <p className="docs-page-subtitle">
        React hook for binding Form classes to component state with validation.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>useForm()</code> binds a Form class to React component state, providing
          reactive form values, validation, field management, and action execution. It
          handles all form lifecycle events and state updates automatically.
        </p>
      </div>

      {/* Live Demo */}
      <div className="docs-section">
        <h2 className="docs-section-title">Live Demo</h2>
        <LuminoLiveDemo
          title="Product Form"
          description="Interactive form with validation"
          form={form}
          code={basicUsageCode}
          defaultView="split"
        />
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Options */}
      <div className="docs-section">
        <h2 className="docs-section-title">Options</h2>
        <CodeBlock code={withInitialValuesCode} language="typescript" />
        <ul>
          <li><strong>initialValues</strong> - Initial form data (defaults to form's default values)</li>
          <li><strong>mode</strong> - Form mode ("create", "edit", "view", etc.)</li>
          <li><strong>readOnly</strong> - Start form in read-only mode</li>
          <li><strong>validateOnChange</strong> - Validate field on every change</li>
          <li><strong>validateOnBlur</strong> - Validate field when it loses focus</li>
        </ul>
      </div>

      {/* Field Operations */}
      <div className="docs-section">
        <h2 className="docs-section-title">Field Operations</h2>
        <CodeBlock code={fieldOperationsCode} language="typescript" />
      </div>

      {/* Validation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Validation</h2>
        <CodeBlock code={validationCode} language="typescript" />
      </div>

      {/* Field Visibility */}
      <div className="docs-section">
        <h2 className="docs-section-title">Field Visibility</h2>
        <p>
          Control field and section visibility dynamically:
        </p>
        <CodeBlock code={visibilityCode} language="typescript" />
        <p>
          <strong>Important distinction:</strong>
        </p>
        <ul>
          <li><strong>hideFieldByCondition</strong> - Conditional hide: clears data, skips validation</li>
          <li><strong>hideFieldByAccess</strong> - Access-based hide: preserves data, validates normally</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Actions</h2>
        <CodeBlock code={actionsCode} language="typescript" />
      </div>

      {/* FormContext */}
      <div className="docs-section">
        <h2 className="docs-section-title">FormContext</h2>
        <p>
          The <code>formContext</code> provides access to form state and operations
          for child components:
        </p>
        <CodeBlock code={formContextCode} language="typescript" />
      </div>

      {/* Reset */}
      <div className="docs-section">
        <h2 className="docs-section-title">Reset Form</h2>
        <CodeBlock code={resetCode} language="typescript" />
      </div>

      {/* Field Options */}
      <div className="docs-section">
        <h2 className="docs-section-title">Field Options</h2>
        <p>
          Manage dynamic field options (typically populated by dependsOn reloadApi):
        </p>
        <CodeBlock code={fieldOptionsCode} language="typescript" />
      </div>

      {/* Read-Only Mode */}
      <div className="docs-section">
        <h2 className="docs-section-title">Read-Only Mode</h2>
        <CodeBlock code={readOnlyCode} language="typescript" />
      </div>

      {/* Return Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">Return Type</h2>
        <CodeBlock
          code={`interface UseFormReturn<TEntity> {
  // State
  values: Record<string, any>;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  dirty: boolean;
  submitting: boolean;
  readOnly: boolean;
  valid: boolean;

  // Field operations
  getValue: <T>(field: string) => T;
  setValue: (field: string, value: any) => void;
  setValues: (values: Partial<TEntity>) => void;
  getFieldError: (field: string) => string | null;
  getFieldErrors: (field: string) => string[];
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  isFieldDirty: (field: string) => boolean;
  isFieldTouched: (field: string) => boolean;
  touchField: (field: string) => void;

  // Field visibility/state
  isFieldDisabled: (field: string) => boolean;
  isFieldHidden: (field: string) => boolean;
  isFieldAccessHidden: (field: string) => boolean;
  showField: (field: string) => void;
  hideFieldByCondition: (field: string) => void;
  hideFieldByAccess: (field: string) => void;
  enableField: (field: string) => void;
  disableField: (field: string) => void;

  // Section visibility
  isSectionHidden: (sectionId: string) => boolean;
  isSectionAccessHidden: (sectionId: string) => boolean;
  showSection: (sectionId: string) => void;
  hideSectionByCondition: (sectionId: string) => void;
  hideSectionByAccess: (sectionId: string) => void;

  // Form operations
  validate: () => Promise<boolean>;
  validateField: (field: string) => Promise<boolean>;
  reset: () => void;
  resetField: (field: string) => void;
  setReadOnly: (readOnly: boolean) => void;

  // Actions
  executeAction: (actionName: string) => Promise<void>;
  hasAction: (actionName: string) => boolean;

  // Field options
  getFieldOptions: <T>(field: string) => T[] | undefined;
  setFieldOptions: (field: string, options: any[]) => void;

  // Context
  formContext: FormContext;
  formConfig: FormConfig;
}`}
          language="typescript"
        />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <CodeBlock code={fullExampleCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Always validate before submit</strong> - Call validate() before saving</li>
          <li><strong>Handle dirty state</strong> - Warn users about unsaved changes</li>
          <li><strong>Use validateOnBlur</strong> - Better UX than validateOnChange</li>
          <li><strong>Type getValue calls</strong> - Use generics: getValue&lt;string&gt;("name")</li>
          <li><strong>Pass formContext to children</strong> - For custom field components</li>
          <li><strong>Check form.valid</strong> - Show error summary if invalid</li>
          <li><strong>Use form actions</strong> - Define business logic in Form class</li>
        </ul>
      </div>
    </>
  );
}
