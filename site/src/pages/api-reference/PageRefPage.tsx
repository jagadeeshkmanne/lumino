/**
 * Page Class API Reference
 */

import { CodeBlock } from "../../components/CodeBlock";

const signatureCode = `abstract class Page<TEntity = any> implements PageLifecycle {
  constructor(id: string);

  // Abstract method - must implement
  abstract configure(): void;

  // Properties
  readonly id: string;
  getRoute(): string;
  getLayoutOverride(): (new (id: string) => any) | null;

  // Mode handling
  determineMode(ctx: PageContext): string;
  getModeHandler(modeName: string): OnModeHandler | undefined;
  getModeNames(): string[];

  // Form access
  getForm(formId: string): Form<any> | undefined;
  getForms(): Map<string, Form<any>>;

  // Tabs access
  getTabs(tabsId: string): Tabs | undefined;
  getAllTabs(): Map<string, Tabs>;

  // Metadata
  getMeta<T>(key: string): T | undefined;

  // Build
  build(): PageConfig;

  // Lifecycle hooks (optional)
  onInit?(ctx: PageContext): void | Promise<void>;
  onLoad?(ctx: PageContext): void;
  onBeforeLeave?(ctx: PageContext): boolean | Promise<boolean>;
  onDestroy?(ctx: PageContext): void;

  // Protected builder methods
  protected route(path: string): this;
  protected layout(layoutClass: new (id: string) => any): this;
  protected mode(modeFn: ModeFunction): this;
  protected onMode(modeName: string, handler: OnModeHandler): this;
  protected addComponent(component: ComponentType): ComponentBuilder<Page<TEntity>>;
  protected addRow(): RowBuilder<Page<TEntity>>;
  protected addForm(form: Form<any>): this;
  protected addTabs(tabs: Tabs): this;
  protected include<TProps>(ComponentClass, props?: TProps): this;
  protected setMeta(key: string, value: any): this;
}`;

const basicPageCode = `import { Page } from "lumino/core";

class EmployeeListPage extends Page<Employee[]> {
  constructor() {
    super("employeeList");
  }

  configure() {
    // Define route
    this.route("/employees");

    // Load data
    this.onMode("default", async (ctx) => {
      const employees = await ctx.call(ctx.api.EmployeesApi.list);
      ctx.setEntity(employees);
    });

    // Add components
    this.addComponent(PageHeader)
      .props({ title: "Employees" })
      .end();

    this.addComponent(EmployeeTable)
      .props((ctx) => ({ data: ctx.getEntity() }))
      .end();
  }
}`;

const formPageCode = `import { Page, Form } from "lumino/core";

class EmployeeFormPage extends Page<Employee> {
  private employeeForm = new EmployeeForm();

  constructor() {
    super("employeeForm");
  }

  configure() {
    // Route with parameter
    this.route("/employees/:id?");

    // Determine mode from route params
    this.mode((ctx) => ctx.routeParams.id ? "edit" : "new");

    // Mode handler for new
    this.onMode("new", (ctx) => {
      ctx.setEntity(new Employee());
    });

    // Mode handler for edit
    this.onMode("edit", async (ctx) => {
      const employee = await ctx.call(ctx.api.EmployeesApi.get, {
        path: { id: ctx.routeParams.id }
      });
      ctx.setEntity(employee);
    });

    // Add page header
    this.addComponent(PageHeader)
      .props((ctx) => ({
        title: ctx.mode === "new" ? "New Employee" : "Edit Employee"
      }))
      .end();

    // Add form
    this.addForm(this.employeeForm);
  }
}`;

const modeHandlingCode = `class OrderPage extends Page<Order> {
  configure() {
    this.route("/orders/:id?");

    // Dynamic mode based on route and query params
    this.mode((ctx) => {
      if (ctx.queryParams.view === "readonly") return "view";
      if (ctx.routeParams.id) return "edit";
      return "new";
    });

    // Handlers for each mode
    this.onMode("new", (ctx) => {
      ctx.setEntity({ status: "draft", items: [] });
    });

    this.onMode("edit", async (ctx) => {
      const order = await ctx.call(ctx.api.OrdersApi.get, {
        path: { id: ctx.routeParams.id }
      });
      ctx.setEntity(order);
    });

    this.onMode("view", async (ctx) => {
      const order = await ctx.call(ctx.api.OrdersApi.get, {
        path: { id: ctx.routeParams.id }
      });
      ctx.setEntity(order);
      // Forms will be read-only in view mode
    });
  }
}`;

const componentsCode = `class DashboardPage extends Page {
  configure() {
    this.route("/dashboard");

    // Add a row of components
    this.addRow()
      .addComponent(StatCard)
        .props({ title: "Total Sales", value: "$1.2M" })
        .colSpan(4)
        .end()
      .addComponent(StatCard)
        .props({ title: "Orders", value: "234" })
        .colSpan(4)
        .end()
      .addComponent(StatCard)
        .props({ title: "Customers", value: "1,234" })
        .colSpan(4)
        .end()
      .layout([4, 4, 4])
      .end();

    // Add a single component
    this.addComponent(RecentOrders)
      .props((ctx) => ({ orders: ctx.getEntity() }))
      .margin({ top: 24 })
      .end();
  }
}`;

const includeCode = `import { Component } from "lumino/core";

// Define reusable component
class ModeButtons extends Component {
  configure() {
    this.addRow()
      .addComponent(Button)
        .children("New")
        .onClick((ctx) => ctx.navigate("/employees/new"))
        .end()
      .addComponent(Button)
        .children("Edit")
        .onClick((ctx) => {
          const id = ctx.getValue("id");
          ctx.navigate(\`/employees/\${id}\`);
        })
        .end()
      .end();
  }
}

// Include in page
class EmployeePage extends Page<Employee> {
  configure() {
    this.route("/employees/:id?");

    // Include the component
    this.include(ModeButtons);

    // Add form
    this.addForm(this.employeeForm);
  }
}`;

const layoutOverrideCode = `import { AppLayout } from "lumino/core";

// Define custom layout for admin pages
class AdminLayout extends AppLayout {
  configure() {
    this.header()
      .title("Admin Panel")
      .end();

    this.sidebar()
      .addItem("/admin/users", "Users")
      .addItem("/admin/settings", "Settings")
      .end();
  }
}

// Use custom layout for specific page
class AdminUsersPage extends Page {
  configure() {
    this.route("/admin/users")
        .layout(AdminLayout);  // Override app layout

    // Page content...
  }
}`;

const lifecycleCode = `class EmployeePage extends Page<Employee> {
  // Called when page is initialized (before mode is determined)
  onInit(ctx: PageContext) {
    console.log("Page initializing");
    // Can load common data here
  }

  // Called after mode handler completes
  onLoad(ctx: PageContext) {
    console.log("Page loaded with entity:", ctx.getEntity());
    // Can setup subscriptions, etc.
  }

  // Called before leaving the page
  async onBeforeLeave(ctx: PageContext): Promise<boolean> {
    if (ctx.isDirty()) {
      const confirmed = await ctx.confirm("You have unsaved changes. Leave anyway?");
      return confirmed; // return false to prevent navigation
    }
    return true;
  }

  // Called when page is destroyed/unmounted
  onDestroy(ctx: PageContext) {
    console.log("Page destroyed");
    // Cleanup subscriptions, timers, etc.
  }

  configure() {
    this.route("/employees/:id");
    // ... rest of configuration
  }
}`;

const metadataCode = `class EmployeePage extends Page<Employee> {
  configure() {
    this.route("/employees/:id");

    // Set metadata
    this.setMeta("title", "Employee Management");
    this.setMeta("breadcrumbs", ["Home", "Employees"]);
    this.setMeta("permissions", ["employee.view", "employee.edit"]);
  }
}

// Access metadata
const title = page.getMeta<string>("title");
const breadcrumbs = page.getMeta<string[]>("breadcrumbs");`;

const tabsCode = `import { Tabs } from "lumino/core";

class EmployeeDetailPage extends Page<Employee> {
  private infoTab = new Tabs("infoTab")
    .tab("personal", "Personal Info", PersonalInfoForm)
    .tab("employment", "Employment", EmploymentForm)
    .tab("documents", "Documents", DocumentsForm)
    .build();

  configure() {
    this.route("/employees/:id");

    this.onMode("edit", async (ctx) => {
      const employee = await ctx.call(ctx.api.EmployeesApi.get, {
        path: { id: ctx.routeParams.id }
      });
      ctx.setEntity(employee);
    });

    // Add tabs to page
    this.addTabs(this.infoTab);
  }
}`;

const multipleFormsCode = `class CheckoutPage extends Page {
  private shippingForm = new ShippingForm();
  private paymentForm = new PaymentForm();

  configure() {
    this.route("/checkout");

    // Add multiple forms
    this.addForm(this.shippingForm);
    this.addForm(this.paymentForm);

    // Access forms later
    const shipping = this.getForm("shippingForm");
    const payment = this.getForm("paymentForm");
  }
}`;

export function PageRefPage() {
  return (
    <>
      <h1 className="docs-page-title">Page Class Reference</h1>
      <p className="docs-page-subtitle">
        Base class for defining pages with fluent builder pattern and lifecycle hooks.
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
          The <code>Page</code> class is the base class for defining pages in Lumino. Pages are
          UI-independent and use a fluent builder pattern to define their structure, routing, mode
          handling, and lifecycle.
        </p>
        <p>
          <strong>Key Features:</strong>
        </p>
        <ul>
          <li>Fluent builder pattern for declarative page definition</li>
          <li>Mode-based data loading (new, edit, view, etc.)</li>
          <li>Route definition with parameters</li>
          <li>Component and form composition</li>
          <li>Lifecycle hooks for initialization and cleanup</li>
          <li>Layout override per page</li>
          <li>Auto-registration with routes</li>
        </ul>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicPageCode} language="typescript" />
      </div>

      {/* Form Pages */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Pages</h2>
        <CodeBlock code={formPageCode} language="typescript" />
      </div>

      {/* Mode Handling */}
      <div className="docs-section">
        <h2 className="docs-section-title">Mode Handling</h2>
        <p>
          Pages support multiple modes (new, edit, view, etc.) with dedicated handlers for each mode.
        </p>
        <CodeBlock code={modeHandlingCode} language="typescript" />
      </div>

      {/* Components */}
      <div className="docs-section">
        <h2 className="docs-section-title">Adding Components</h2>
        <CodeBlock code={componentsCode} language="typescript" />
      </div>

      {/* Include */}
      <div className="docs-section">
        <h2 className="docs-section-title">Including Reusable Components</h2>
        <CodeBlock code={includeCode} language="typescript" />
      </div>

      {/* Layout Override */}
      <div className="docs-section">
        <h2 className="docs-section-title">Layout Override</h2>
        <CodeBlock code={layoutOverrideCode} language="typescript" />
      </div>

      {/* Lifecycle Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Lifecycle Hooks</h2>
        <CodeBlock code={lifecycleCode} language="typescript" />
      </div>

      {/* Tabs */}
      <div className="docs-section">
        <h2 className="docs-section-title">Using Tabs</h2>
        <CodeBlock code={tabsCode} language="typescript" />
      </div>

      {/* Multiple Forms */}
      <div className="docs-section">
        <h2 className="docs-section-title">Multiple Forms</h2>
        <CodeBlock code={multipleFormsCode} language="typescript" />
      </div>

      {/* Metadata */}
      <div className="docs-section">
        <h2 className="docs-section-title">Page Metadata</h2>
        <CodeBlock code={metadataCode} language="typescript" />
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
              <td><code>route(path)</code></td>
              <td>Set the page route (auto-registers with router)</td>
            </tr>
            <tr>
              <td><code>layout(layoutClass)</code></td>
              <td>Override app layout for this page</td>
            </tr>
            <tr>
              <td><code>mode(modeFn)</code></td>
              <td>Define function to determine page mode</td>
            </tr>
            <tr>
              <td><code>onMode(modeName, handler)</code></td>
              <td>Register handler for a specific mode</td>
            </tr>
            <tr>
              <td><code>addComponent(component)</code></td>
              <td>Add a component to the page</td>
            </tr>
            <tr>
              <td><code>addRow()</code></td>
              <td>Add a row of components</td>
            </tr>
            <tr>
              <td><code>addForm(form)</code></td>
              <td>Add a form to the page</td>
            </tr>
            <tr>
              <td><code>addTabs(tabs)</code></td>
              <td>Add a tabs container to the page</td>
            </tr>
            <tr>
              <td><code>include(ComponentClass, props?)</code></td>
              <td>Include a reusable Component</td>
            </tr>
            <tr>
              <td><code>setMeta(key, value)</code></td>
              <td>Set page metadata</td>
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
              <td>Before mode is determined</td>
              <td>Load common data, setup</td>
            </tr>
            <tr>
              <td><code>onLoad(ctx)</code></td>
              <td>After mode handler completes</td>
              <td>Setup subscriptions, derived state</td>
            </tr>
            <tr>
              <td><code>onBeforeLeave(ctx)</code></td>
              <td>Before navigating away</td>
              <td>Check unsaved changes, confirm</td>
            </tr>
            <tr>
              <td><code>onDestroy(ctx)</code></td>
              <td>When page is unmounted</td>
              <td>Cleanup subscriptions, timers</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Access Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">Access Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Returns</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>getForm(formId)</code></td>
              <td><code>Form | undefined</code></td>
              <td>Get a form by ID</td>
            </tr>
            <tr>
              <td><code>getForms()</code></td>
              <td><code>Map&lt;string, Form&gt;</code></td>
              <td>Get all forms</td>
            </tr>
            <tr>
              <td><code>getTabs(tabsId)</code></td>
              <td><code>Tabs | undefined</code></td>
              <td>Get a tabs container by ID</td>
            </tr>
            <tr>
              <td><code>getAllTabs()</code></td>
              <td><code>Map&lt;string, Tabs&gt;</code></td>
              <td>Get all tabs containers</td>
            </tr>
            <tr>
              <td><code>getMeta&lt;T&gt;(key)</code></td>
              <td><code>T | undefined</code></td>
              <td>Get page metadata by key</td>
            </tr>
            <tr>
              <td><code>getModeHandler(mode)</code></td>
              <td><code>OnModeHandler | undefined</code></td>
              <td>Get mode handler function</td>
            </tr>
            <tr>
              <td><code>getModeNames()</code></td>
              <td><code>string[]</code></td>
              <td>Get all registered mode names</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>Use modes</strong> - Leverage mode handlers for different page states
          </li>
          <li>
            <strong>Load data in onMode</strong> - Fetch data in mode handlers, not in configure()
          </li>
          <li>
            <strong>Use lifecycle hooks</strong> - Implement onBeforeLeave for unsaved changes
          </li>
          <li>
            <strong>Compose with components</strong> - Use include() for reusable page sections
          </li>
          <li>
            <strong>Override layouts</strong> - Use layout() for pages with different navigation
          </li>
          <li>
            <strong>Set metadata</strong> - Use setMeta() for page titles, breadcrumbs, permissions
          </li>
        </ul>
      </div>
    </>
  );
}
