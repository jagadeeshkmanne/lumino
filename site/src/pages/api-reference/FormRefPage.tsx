/**
 * Form Class API Reference
 */

import { CodeBlock } from "../../components/CodeBlock";

const signatureCode = `abstract class Form<TEntity = any> implements FormLifecycle<TEntity> {
  constructor(id: string);

  // Abstract method - must implement
  abstract configure(): void;

  // Properties
  readonly id: string;
  build(): FormConfig<TEntity>;

  // Lifecycle hooks (optional)
  onInit?(ctx: FormContext): void | Promise<void>;
  onLoad?(ctx: FormContext): void;
  onFieldChange?(field: string, value: any, ctx: FormContext): void;
  onBeforeSubmit?(action: string, ctx: FormContext): boolean | Promise<boolean>;
  onAfterSubmit?(action: string, response: any, ctx: FormContext): void;
  onValidationError?(errors: ValidationErrors, ctx: FormContext): void;
  onBeforeReset?(ctx: FormContext): boolean;
  onAfterReset?(ctx: FormContext): void;

  // Protected builder methods
  protected addSection(title: string): SectionBuilder<Form<TEntity>>;
  protected addRow(): RowBuilder<Form<TEntity>>;
  protected addAction(actionId: string, label: string): ActionBuilder<Form<TEntity>>;
  protected readOnly(condition?: boolean | ((ctx: FormContext) => boolean)): this;
  protected addList<T>(fieldName: string): ListBuilder<Form<TEntity>, T>;
  protected addObject(fieldName: string): ObjectBuilder<Form<TEntity>>;
  protected include<TProps>(ComponentClass, props?: TProps): this;
  protected addTabs(): TabsBuilder<Form<TEntity>>;
}`;

const basicFormCode = `import { Form, Validators } from "lumino/core";
import { TextField, Select } from "lumino/salt";

class EmployeeForm extends Form<Employee> {
  constructor() {
    super("employeeForm");
  }

  configure() {
    // Add section
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(TextField)
          .label("First Name")
          .rules(Validators.required())
        .endField()
        .addField("lastName")
          .component(TextField)
          .label("Last Name")
          .rules(Validators.required())
        .endField()
        .layout([6, 6])
      .endRow()
      .addRow()
        .addField("email")
          .component(TextField)
          .label("Email")
          .rules(Validators.required(), Validators.email())
        .endField()
        .addField("department")
          .component(Select)
          .label("Department")
          .lookup({
            api: api("DepartmentsApi.list"),
            labelHandler: (dept) => dept.name,
            valueHandler: (dept) => dept.id,
          })
        .endField()
        .layout([6, 6])
      .endRow()
    .endSection();

    // Add actions
    this.addAction("save", "Save")
      .onClick(async (ctx) => {
        const employee = ctx.getFormData();
        await ctx.call(ctx.api.EmployeesApi.create, { body: employee });
        ctx.notify("Employee saved!", "success");
        ctx.navigate("/employees");
      })
    .endAction();

    this.addAction("cancel", "Cancel")
      .variant("secondary")
      .onClick((ctx) => ctx.navigate("/employees"))
    .endAction();
  }
}`;

const sectionsCode = `configure() {
  // Section with title
  this.addSection("Personal Information")
    .addRow()
      .addField("firstName").component(TextField).label("First Name").endField()
    .endRow()
  .endSection();

  // Collapsible section
  this.addSection("Additional Details")
    .collapsible(true)
    .collapsed(false)  // Start expanded
    .addRow()
      .addField("notes").component(TextField).label("Notes").endField()
    .endRow()
  .endSection();

  // Conditional section visibility
  this.addSection("Employment Details")
    .visibleByCondition((ctx) => ctx.getValue("employeeType") === "fulltime")
    .addRow()
      .addField("salary").component(TextField).label("Salary").endField()
    .endRow()
  .endSection();

  // Access-based visibility
  this.addSection("Salary Information")
    .visibleByAccess((ctx) => ctx.user.hasRole("hr"))
    .addRow()
      .addField("baseSalary").component(TextField).label("Base Salary").endField()
    .endRow()
  .endSection();
}`;

const fieldsCode = `this.addRow()
  // Basic field
  .addField("name")
    .component(TextField)
    .label("Name")
    .placeholder("Enter name")
    .rules(Validators.required(), Validators.minLength(3))
  .endField()

  // Field with dynamic props
  .addField("status")
    .component(Select)
    .label("Status")
    .props((ctx) => ({
      options: ctx.mode === "new" ? ["draft", "active"] : ["draft", "active", "archived"],
      disabled: ctx.mode === "view"
    }))
  .endField()

  // Conditional visibility
  .addField("otherReason")
    .component(TextField)
    .label("Other Reason")
    .visibleByCondition((ctx) => ctx.getValue("reason") === "other")
  .endField()

  // Lookup field
  .addField("customer")
    .label("Customer")
    .lookup({
      api: api("CustomersApi.search"),
      labelHandler: (c) => c.name,
      valueHandler: (c) => c.id,
      columns: [
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
      ],
    })
  .endField()
.endRow();`;

const listFieldsCode = `// Array of items with inline fields
this.addList<Address>("addresses")
  .as(Tabs)
  .tabLabel((item) => item.type || "Address")
  .actions({
    add: { label: "+ Add Address", position: "bottom" },
    remove: { position: "tabBar", confirm: true },
    close: { confirm: "Are you sure?" }
  })
  .defaults({ type: "home", country: "US" })
  .row()
    .addField("street").component(TextField).label("Street").endField()
  .endRow()
  .row()
    .addField("city").component(TextField).label("City").endField()
    .addField("state").component(TextField).label("State").endField()
    .addField("zipCode").component(TextField).label("Zip").endField()
    .layout([4, 4, 4])
  .endRow()
.endList();

// Array with form class
this.addList<Experience>("experiences")
  .as(Tabs)
  .itemForm(ExperienceForm)  // Separate form for each item
  .actions({
    add: { label: "+ Add Experience" },
    remove: { position: "tabBar" }
  })
.endList();`;

const actionsCode = `// Save action
this.addAction("save", "Save")
  .variant("primary")
  .onClick(async (ctx) => {
    const isValid = await ctx.validate();
    if (!isValid) return;

    const data = ctx.getFormData();
    if (ctx.mode === "new") {
      await ctx.call(ctx.api.EmployeesApi.create, { body: data });
    } else {
      await ctx.call(ctx.api.EmployeesApi.update, {
        path: { id: ctx.getValue("id") },
        body: data
      });
    }
    ctx.notify("Saved successfully!", "success");
    ctx.navigate("/employees");
  })
.endAction();

// Cancel action
this.addAction("cancel", "Cancel")
  .variant("secondary")
  .onClick((ctx) => ctx.back())
.endAction();

// Delete action with confirmation
this.addAction("delete", "Delete")
  .variant("danger")
  .visibleByCondition((ctx) => ctx.mode === "edit")
  .onClick(async (ctx) => {
    const confirmed = await ctx.confirm("Delete this employee?");
    if (!confirmed) return;

    await ctx.call(ctx.api.EmployeesApi.delete, {
      path: { id: ctx.getValue("id") }
    });
    ctx.notify("Deleted successfully!", "success");
    ctx.navigate("/employees");
  })
.endAction();`;

const lifecycleCode = `class EmployeeForm extends Form<Employee> {
  // Called when form is initialized
  onInit(ctx: FormContext) {
    console.log("Form initializing, mode:", ctx.mode);
    // Load dropdown options, etc.
  }

  // Called after form is loaded with data
  onLoad(ctx: FormContext) {
    console.log("Form loaded with entity:", ctx.getEntity());
    // Can setup computed fields, watchers, etc.
  }

  // Called when any field changes
  onFieldChange(field: string, value: any, ctx: FormContext) {
    console.log(\`Field \${field} changed to:\`, value);

    // Cross-field logic
    if (field === "country" && value !== ctx.getValue("previousCountry")) {
      ctx.setValue("state", null); // Clear dependent field
    }
  }

  // Called before form submission
  async onBeforeSubmit(action: string, ctx: FormContext): Promise<boolean> {
    console.log(\`Submitting action: \${action}\`);

    // Custom validation
    if (action === "save" && ctx.getValue("age") < 18) {
      ctx.setFieldError("age", "Must be 18 or older");
      return false; // Prevent submission
    }

    return true; // Allow submission
  }

  // Called after successful submission
  onAfterSubmit(action: string, response: any, ctx: FormContext) {
    console.log("Submit successful:", response);
    // Could update UI, redirect, etc.
  }

  // Called when validation fails
  onValidationError(errors: ValidationErrors, ctx: FormContext) {
    console.error("Validation errors:", errors);
    ctx.notify("Please fix the errors", "error");
  }

  // Called before form reset
  onBeforeReset(ctx: FormContext): boolean {
    if (ctx.isDirty()) {
      return confirm("Discard changes?");
    }
    return true;
  }

  // Called after form reset
  onAfterReset(ctx: FormContext) {
    console.log("Form reset");
  }

  configure() {
    // Form configuration...
  }
}`;

const dependenciesCode = `// Field that clears when dependency changes
.addField("state")
  .component(Select)
  .label("State")
  .dependsOn("country", { clear: true })
.endField()

// Field that reloads options when dependency changes
.addField("city")
  .component(Select)
  .label("City")
  .dependsOn("state", {
    clear: true,
    reloadApi: "CitiesApi.getByState",
    reloadParams: (ctx) => ({ path: { stateId: ctx.getValue("state") } })
  })
.endField()

// Multiple dependencies
.addField("region")
  .component(Select)
  .label("Region")
  .dependsOn(["country", "state"], {
    clear: true,
    handler: async (value, ctx) => {
      // Custom logic when country OR state changes
      const country = ctx.getValue("country");
      const state = ctx.getValue("state");
      if (country && state) {
        // Fetch regions
      }
    }
  })
.endField()`;

const tabsCode = `this.addTabs()
  .tab("personal", "Personal Info")
    .addSection("Basic Information")
      .addRow()
        .addField("firstName").component(TextField).label("First Name").endField()
      .endRow()
    .endSection()
  .endTab()

  .tab("employment", "Employment")
    .addSection("Employment Details")
      .addRow()
        .addField("department").component(Select).label("Department").endField()
      .endRow()
    .endSection()
  .endTab()

  .tab("documents", "Documents")
    .badge((ctx) => ctx.getValue("documents")?.length || 0)
    .disabled((ctx) => ctx.mode === "new")
    .form(DocumentsForm)  // Use separate form for this tab
  .endTab()
.endTabs();`;

const validationCode = `// Built-in validators
.addField("email")
  .component(TextField)
  .label("Email")
  .rules(
    Validators.required(),
    Validators.email(),
    Validators.maxLength(100)
  )
.endField()

// Custom validator
.addField("age")
  .component(TextField)
  .label("Age")
  .rules(
    Validators.required(),
    Validators.custom({
      validate: (value) => value >= 18,
      message: "Must be 18 or older"
    })
  )
.endField()

// Async validator (e.g., check uniqueness)
.addField("username")
  .component(TextField)
  .label("Username")
  .rules(
    Validators.required(),
    Validators.custom({
      validate: async (value, ctx) => {
        const exists = await ctx.call(ctx.api.UsersApi.checkUsername, {
          body: { username: value }
        });
        return !exists;
      },
      message: "Username already taken",
      skipOn: ["draft"]  // Skip on draft action
    })
  )
.endField()`;

const includeCode = `import { Component } from "lumino/core";

// Define reusable component
class AddressFields extends Component<Address> {
  configure() {
    this.addRow()
      .addField("street").component(TextField).label("Street").endField()
    .endRow();
    this.addRow()
      .addField("city").component(TextField).label("City").endField()
      .addField("state").component(TextField).label("State").endField()
      .layout([6, 6])
    .endRow();
  }
}

// Include in form
class EmployeeForm extends Form<Employee> {
  configure() {
    this.addSection("Address")
      .include(AddressFields)
    .endSection();
  }
}`;

export function FormRefPage() {
  return (
    <>
      <h1 className="docs-page-title">Form Class Reference</h1>
      <p className="docs-page-subtitle">
        Base class for defining forms with fluent builder pattern, validation, and lifecycle hooks.
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
          The <code>Form</code> class is the base class for defining forms in Lumino. Forms are
          UI-independent and use a fluent builder pattern to define their structure, validation,
          actions, and behavior.
        </p>
        <p>
          <strong>Key Features:</strong>
        </p>
        <ul>
          <li>Fluent builder pattern for declarative form definition</li>
          <li>Built-in validation with sync/async validators</li>
          <li>Field dependencies and conditional visibility</li>
          <li>Dynamic lists and nested objects</li>
          <li>Lookup fields with search dialogs</li>
          <li>Custom actions with lifecycle hooks</li>
          <li>Tabs for multi-step forms</li>
          <li>Component composition and reuse</li>
        </ul>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicFormCode} language="typescript" />
      </div>

      {/* Sections */}
      <div className="docs-section">
        <h2 className="docs-section-title">Sections</h2>
        <CodeBlock code={sectionsCode} language="typescript" />
      </div>

      {/* Fields */}
      <div className="docs-section">
        <h2 className="docs-section-title">Fields</h2>
        <CodeBlock code={fieldsCode} language="typescript" />
      </div>

      {/* Lists */}
      <div className="docs-section">
        <h2 className="docs-section-title">List Fields (Arrays)</h2>
        <CodeBlock code={listFieldsCode} language="typescript" />
      </div>

      {/* Actions */}
      <div className="docs-section">
        <h2 className="docs-section-title">Actions</h2>
        <CodeBlock code={actionsCode} language="typescript" />
      </div>

      {/* Lifecycle */}
      <div className="docs-section">
        <h2 className="docs-section-title">Lifecycle Hooks</h2>
        <CodeBlock code={lifecycleCode} language="typescript" />
      </div>

      {/* Dependencies */}
      <div className="docs-section">
        <h2 className="docs-section-title">Field Dependencies</h2>
        <CodeBlock code={dependenciesCode} language="typescript" />
      </div>

      {/* Tabs */}
      <div className="docs-section">
        <h2 className="docs-section-title">Tabs</h2>
        <CodeBlock code={tabsCode} language="typescript" />
      </div>

      {/* Validation */}
      <div className="docs-section">
        <h2 className="docs-section-title">Validation</h2>
        <CodeBlock code={validationCode} language="typescript" />
      </div>

      {/* Include */}
      <div className="docs-section">
        <h2 className="docs-section-title">Component Composition</h2>
        <CodeBlock code={includeCode} language="typescript" />
      </div>

      {/* Builder Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">Builder Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>addSection(title)</code></td>
              <td>Add a section with title</td>
            </tr>
            <tr>
              <td><code>addRow()</code></td>
              <td>Add a row of fields (outside sections)</td>
            </tr>
            <tr>
              <td><code>addAction(id, label)</code></td>
              <td>Add an action button</td>
            </tr>
            <tr>
              <td><code>addList&lt;T&gt;(fieldName)</code></td>
              <td>Add a list/array field</td>
            </tr>
            <tr>
              <td><code>addObject(fieldName)</code></td>
              <td>Add a nested object field</td>
            </tr>
            <tr>
              <td><code>addTabs()</code></td>
              <td>Add tabs container</td>
            </tr>
            <tr>
              <td><code>include(ComponentClass, props?)</code></td>
              <td>Include a reusable Component</td>
            </tr>
            <tr>
              <td><code>readOnly(condition?)</code></td>
              <td>Make form read-only (static or dynamic)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lifecycle Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Lifecycle Hook Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Hook</th>
              <th>When Called</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>onInit(ctx)</code></td>
              <td>Form initialization</td>
              <td>Load dropdown options, setup</td>
            </tr>
            <tr>
              <td><code>onLoad(ctx)</code></td>
              <td>After entity is loaded</td>
              <td>Computed fields, watchers</td>
            </tr>
            <tr>
              <td><code>onFieldChange(field, value, ctx)</code></td>
              <td>When any field changes</td>
              <td>Cross-field logic, side effects</td>
            </tr>
            <tr>
              <td><code>onBeforeSubmit(action, ctx)</code></td>
              <td>Before submission</td>
              <td>Custom validation, confirmation</td>
            </tr>
            <tr>
              <td><code>onAfterSubmit(action, response, ctx)</code></td>
              <td>After successful submission</td>
              <td>Notifications, redirects</td>
            </tr>
            <tr>
              <td><code>onValidationError(errors, ctx)</code></td>
              <td>When validation fails</td>
              <td>Custom error handling</td>
            </tr>
            <tr>
              <td><code>onBeforeReset(ctx)</code></td>
              <td>Before form reset</td>
              <td>Confirm discard changes</td>
            </tr>
            <tr>
              <td><code>onAfterReset(ctx)</code></td>
              <td>After form reset</td>
              <td>Cleanup, notifications</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Field Builder Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">Field Builder Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>component(type)</code></td>
              <td>Set field component</td>
            </tr>
            <tr>
              <td><code>label(text)</code></td>
              <td>Set field label</td>
            </tr>
            <tr>
              <td><code>placeholder(text)</code></td>
              <td>Set field placeholder</td>
            </tr>
            <tr>
              <td><code>rules(...rules)</code></td>
              <td>Add validation rules</td>
            </tr>
            <tr>
              <td><code>props(props)</code></td>
              <td>Set component props (static or dynamic)</td>
            </tr>
            <tr>
              <td><code>lookup(config)</code></td>
              <td>Configure lookup field with search</td>
            </tr>
            <tr>
              <td><code>dependsOn(fields, config)</code></td>
              <td>Add field dependency</td>
            </tr>
            <tr>
              <td><code>visibleByCondition(condition)</code></td>
              <td>Conditional visibility</td>
            </tr>
            <tr>
              <td><code>visibleByAccess(condition)</code></td>
              <td>Access-based visibility</td>
            </tr>
            <tr>
              <td><code>disable(condition)</code></td>
              <td>Disable field conditionally</td>
            </tr>
            <tr>
              <td><code>readOnly(condition)</code></td>
              <td>Make field read-only</td>
            </tr>
            <tr>
              <td><code>type(type)</code></td>
              <td>Set field type (e.g., "hidden")</td>
            </tr>
            <tr>
              <td><code>colSpan(span)</code></td>
              <td>Set column span in row</td>
            </tr>
            <tr>
              <td><code>css(className)</code></td>
              <td>Set CSS class</td>
            </tr>
            <tr>
              <td><code>style(styles)</code></td>
              <td>Set inline styles</td>
            </tr>
            <tr>
              <td><code>wrapper(component)</code></td>
              <td>Wrap field with custom component</td>
            </tr>
            <tr>
              <td><code>endField()</code></td>
              <td>Finish field and return to row</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>Use sections</strong> - Group related fields in sections
          </li>
          <li>
            <strong>Add validation</strong> - Use Validators for built-in rules
          </li>
          <li>
            <strong>Leverage lifecycle hooks</strong> - Use onFieldChange for cross-field logic
          </li>
          <li>
            <strong>Use dependencies</strong> - Configure field dependencies for cascading dropdowns
          </li>
          <li>
            <strong>Compose with components</strong> - Extract reusable field groups
          </li>
          <li>
            <strong>Use lookup fields</strong> - For entity references with search
          </li>
          <li>
            <strong>Handle errors</strong> - Implement onValidationError for custom error UI
          </li>
          <li>
            <strong>Use tabs</strong> - Split large forms into manageable tabs
          </li>
        </ul>
      </div>
    </>
  );
}
