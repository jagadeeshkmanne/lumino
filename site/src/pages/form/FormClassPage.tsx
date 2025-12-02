/**
 * Form Class Page - Deep dive into the Form class
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoCheckbox,
  LuminoButton,
} from "lumino/react";

// =============================================================================
// EMPLOYEE FORM WITH ALL METHODS DEMONSTRATED
// =============================================================================

interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  isActive: boolean;
  salary: number | null;
}

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

class EmployeeFormDemo extends Form<EmployeeData> {
  constructor() {
    super("employee-form");
  }

  configure() {
    // Set read-only based on context mode
    this.setReadOnly((ctx) => ctx.mode === "view");

    // Personal Information Section
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter first name")
          .rules(Validators.required({ message: "First name is required" }))
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter last name")
          .rules(Validators.required({ message: "Last name is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("name@company.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
        .endField()
      .endRow()
    .endSection();

    // Employment Section
    this.addSection("Employment Details")
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .placeholder("Select department")
          .props({ options: departments })
          .rules(Validators.required({ message: "Department is required" }))
        .endField()
        .addField("salary")
          .component(LuminoNumberInput)
          .label("Salary")
          .placeholder("Enter salary")
          .props({ min: 0 })
          .hideByCondition((ctx) => !ctx.getValue("isActive"))
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("isActive")
          .component(LuminoCheckbox)
          .label("Active Employee")
        .endField()
      .endRow()
    .endSection();

    // Submit Button (outside sections)
    this.addRow()
      .addComponent(LuminoButton)
        .children("Submit")
        .props({ variant: "cta" })
        .onClick(async (ctx) => {
          const isValid = await ctx.validate?.();
          if (isValid) {
            ctx.notify?.("Form submitted successfully!", "success");
          } else {
            ctx.notify?.("Please fix the validation errors.", "error");
          }
        })
        .hideByCondition((ctx) => ctx.mode === "view")
      .endComponent()
    .endRow();
  }
}

const formClassCode = `import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoCheckbox,
  LuminoButton,
} from "lumino/react";

interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  isActive: boolean;
  salary: number | null;
}

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

class EmployeeForm extends Form<EmployeeData> {
  constructor() {
    super("employee-form");
  }

  configure() {
    // Set read-only based on context mode
    this.setReadOnly((ctx) => ctx.mode === "view");

    // Personal Information Section
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter first name")
          .rules(Validators.required({ message: "First name is required" }))
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter last name")
          .rules(Validators.required({ message: "Last name is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("name@company.com")
          .rules(
            Validators.required(),
            Validators.email("Please enter a valid email")
          )
        .endField()
      .endRow()
    .endSection();

    // Employment Section
    this.addSection("Employment Details")
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .placeholder("Select department")
          .props({ options: departments })
          .rules(Validators.required())
        .endField()
        .addField("salary")
          .component(LuminoNumberInput)
          .label("Salary")
          .placeholder("Enter salary")
          .props({ min: 0 })
          .hideByCondition((ctx) => !ctx.getValue("isActive"))
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("isActive")
          .component(LuminoCheckbox)
          .label("Active Employee")
        .endField()
      .endRow()
    .endSection();

    // Submit Button
    this.addRow()
      .addComponent(LuminoButton)
        .children("Submit")
        .props({ variant: "cta" })
        .onClick(async (ctx) => {
          const isValid = await ctx.validate?.();
          if (isValid) {
            ctx.notify?.("Form submitted!", "success");
          } else {
            ctx.notify?.("Fix validation errors.", "error");
          }
        })
        .hideByCondition((ctx) => ctx.mode === "view")
      .endComponent()
    .endRow();
  }
}`;

const formSignatureCode = `class Form<T> {
  constructor(id: string);

  // MUST override - define form structure here
  configure(): void;

  // Form-level settings
  setReadOnly(condition: boolean | ((ctx: FormContext<T>) => boolean)): this;

  // Building blocks
  addSection(title: string): SectionBuilder<T>;
  addRow(): RowBuilder<T>;
  addList<L>(name: keyof T): ListBuilder<T, L>;

  // Lifecycle hooks
  onLoad(handler: (ctx: FormContext<T>) => void | Promise<void>): this;
  onSubmit(handler: (ctx: FormContext<T>) => void | Promise<void>): this;
  onValidate(handler: (ctx: FormContext<T>) => boolean | Promise<boolean>): this;
  onChange(handler: (ctx: FormContext<T>, field: string, value: any) => void): this;
}`;

const constructorCode = `class MyForm extends Form<MyEntity> {
  constructor() {
    // Pass a unique form ID
    super("my-form-id");
  }

  configure() {
    // Define form structure here
  }
}`;

const setReadOnlyCode = `// Static read-only
this.setReadOnly(true);

// Dynamic based on context
this.setReadOnly((ctx) => ctx.mode === "view");

// Based on entity state
this.setReadOnly((ctx) => ctx.entity?.status === "approved");`;

const buildingBlocksCode = `// Sections - visual grouping with headers
this.addSection("Personal Info")
  // ... fields
.endSection();

// Rows - horizontal layout
this.addRow()
  .addField("field1").component(LuminoTextInput).label("Field 1").endField()
  .addField("field2").component(LuminoTextInput).label("Field 2").endField()
  .layout([1, 1])  // Equal columns
.endRow();

// Lists - array fields (addresses, experiences)
this.addList<Address>("addresses")
  .as(LuminoTabs)
  .include(AddressFields)
.end();`;

const lifecycleCode = `class MyForm extends Form<MyEntity> {
  configure() {
    // Called when form loads
    this.onLoad(async (ctx) => {
      const data = await fetchData();
      ctx.setEntity(data);
    });

    // Called on form submit
    this.onSubmit(async (ctx) => {
      const data = ctx.getFormData();
      await saveData(data);
      ctx.notify?.("Saved!", "success");
    });

    // Custom validation (runs after field validators)
    this.onValidate(async (ctx) => {
      // Return false to fail validation
      if (ctx.getValue("endDate") < ctx.getValue("startDate")) {
        return false;
      }
      return true;
    });

    // Watch for field changes
    this.onChange((ctx, field, value) => {
      console.log(\`Field \${field} changed to\`, value);
    });
  }
}`;

export function FormClassPage() {
  const form = new EmployeeFormDemo();

  return (
    <>
      <h1 className="docs-page-title">Form Class</h1>
      <p className="docs-page-subtitle">
        The Form class is the foundation of Lumino's declarative form building.
      </p>

      {/* Class Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>Form&lt;T&gt;</code> class is a generic class where <code>T</code> is
          your entity type. It provides methods for defining form structure, handling
          lifecycle events, and configuring form behavior.
        </p>
        <CodeBlock code={formSignatureCode} language="typescript" />
      </div>

      {/* Live Demo */}
      <div className="docs-section">
        <h2 className="docs-section-title">Live Example</h2>
        <p>
          Here's a complete form demonstrating sections, conditional visibility,
          validation, and action buttons:
        </p>
        <LuminoLiveDemo
          title="Employee Form"
          description="Complete form with all Form class features"
          form={form}
          code={formClassCode}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            department: "",
            isActive: true,
            salary: null,
          }}
          defaultView="split"
        />
        <p style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
          Try toggling "Active Employee" to see conditional field visibility.
        </p>
      </div>

      {/* Constructor */}
      <div className="docs-section">
        <h2 className="docs-section-title">Constructor</h2>
        <p>
          Every Form must call <code>super(id)</code> with a unique form identifier.
          This ID is used for form state management and debugging.
        </p>
        <CodeBlock code={constructorCode} language="typescript" />
      </div>

      {/* configure() */}
      <div className="docs-section">
        <h2 className="docs-section-title">The configure() Method</h2>
        <p>
          The <code>configure()</code> method is <strong>required</strong> and is where you define
          your form structure. It's called automatically when the form is instantiated.
        </p>
        <p>
          Inside <code>configure()</code>, you use the fluent API to add sections, rows,
          fields, and configure form behavior.
        </p>
      </div>

      {/* setReadOnly */}
      <div className="docs-section">
        <h2 className="docs-section-title">setReadOnly()</h2>
        <p>
          Control whether the entire form is read-only. Can be a static boolean
          or a function that receives the form context:
        </p>
        <CodeBlock code={setReadOnlyCode} language="typescript" />
      </div>

      {/* Building Blocks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Building Blocks</h2>
        <p>
          The Form class provides three main building blocks:
        </p>
        <CodeBlock code={buildingBlocksCode} language="typescript" />
        <ul>
          <li><strong>addSection(title)</strong> - Creates a visual group with a header</li>
          <li><strong>addRow()</strong> - Creates a horizontal container for fields</li>
          <li><strong>addList(name)</strong> - Creates a repeatable section for array fields</li>
        </ul>
      </div>

      {/* Lifecycle Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Lifecycle Hooks</h2>
        <p>
          Forms support lifecycle hooks for handling common events:
        </p>
        <CodeBlock code={lifecycleCode} language="typescript" />
        <ul>
          <li><strong>onLoad</strong> - Called when form mounts (async supported)</li>
          <li><strong>onSubmit</strong> - Called on form submission</li>
          <li><strong>onValidate</strong> - Custom validation after field validators</li>
          <li><strong>onChange</strong> - Watch field value changes</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>Entity Binding</strong> - How forms bind to your data models</li>
          <li><strong>Sections</strong> - Deep dive into section configuration</li>
          <li><strong>Rows</strong> - Layout configuration and column systems</li>
          <li><strong>FormContext</strong> - Understanding the context object</li>
        </ul>
      </div>
    </>
  );
}
