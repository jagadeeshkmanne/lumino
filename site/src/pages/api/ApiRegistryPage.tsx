/**
 * ApiRegistry Page - Central API registry and type-safe references
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicRegistryCode = `import { ApiRegistry, api } from "lumino/core";

// APIs auto-register when instantiated
class UsersApi extends CrudApi<User> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users");
    // Automatic registration happens in queueMicrotask
  }
}

class CountriesApi extends LookupApi<Country> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/countries");
    // Automatic registration happens in queueMicrotask
  }
}

// Register in app
app.apis({
  users: new UsersApi(),
  countries: new CountriesApi(),
});

// Now available globally via ApiRegistry
ApiRegistry.getGroup("UsersApi");          // Returns UsersApi instance
ApiRegistry.get("UsersApi", "list");       // Returns list API
ApiRegistry.getById("user.list");          // Returns list API by ID

// Type-safe references (no import needed!)
.lookup({
  api: api("CountriesApi.list"),  // Type-safe, IDE autocomplete!
  labelField: "name",
})`;

const apiRefCode = `import { api } from "lumino/core";

// Create type-safe API reference
const countriesListRef = api("CountriesApi.list");

// With explicit type annotation for better IDE support
const usersListRef = api<User[]>("UsersApi.list");

// API reference structure
interface ApiRef<T> {
  readonly ref: string;           // "UsersApi.list"
  readonly __apiRef: true;        // Marker for identification
  readonly __type?: T;            // Phantom type for return type
}

// Check if value is an ApiRef
if (isApiRef(value)) {
  console.log("This is an API reference:", value.ref);
}`;

const inLookupsCode = `import { Form, api } from "lumino/core";
import { LuminoSelect, LuminoAutocomplete } from "lumino/react";

class EmployeeForm extends Form<Employee> {
  configure() {
    // Simple lookup - no API import needed!
    this.addRow()
      .addField("departmentId")
        .component(LuminoSelect)
        .label("Department")
        .lookup({
          api: api("DepartmentsApi.list"),  // Type-safe reference
          labelField: "name",
        })
      .endField()
    .endRow();

    // Lookup with filtering
    this.addRow()
      .addField("managerId")
        .component(LuminoAutocomplete)
        .label("Manager")
        .lookup({
          api: api("UsersApi.search"),
          query: { role: "manager", isActive: true },
          labelField: "fullName",
          searchFields: ["firstName", "lastName", "email"],
        })
      .endField()
    .endRow();

    // Dependent lookup
    this.addRow()
      .addField("cityId")
        .component(LuminoSelect)
        .label("City")
        .lookup({
          api: api("CitiesApi.list"),
          query: { countryCode: ctx.getValue("countryCode") },
          labelField: "name",
        })
      .endField()
    .endRow();
  }
}`;

const registryMethodsCode = `import { ApiRegistry } from "lumino/core";

// Register API group manually (usually done automatically)
ApiRegistry.register("UsersApi", new UsersApi());

// Get API by group and name
const listApi = ApiRegistry.get("UsersApi", "list");

// Get API by ID
const getUserApi = ApiRegistry.getById("users.get");

// Get entire API group
const usersApiGroup = ApiRegistry.getGroup("UsersApi");

// Get all registered APIs
const allApis = ApiRegistry.getAll();
// { UsersApi: { list: ..., get: ..., ... }, CountriesApi: { ... } }

// Check if group exists
if (ApiRegistry.hasGroup("UsersApi")) {
  console.log("UsersApi is registered");
}

// Get all group names
const groupNames = ApiRegistry.getGroupNames();
// ["UsersApi", "CountriesApi", "DepartmentsApi", ...]

// Clear all registrations (for testing)
ApiRegistry.clear();`;

const autoRegistrationCode = `// CrudApi and LookupApi auto-register using queueMicrotask
class ProductsApi extends CrudApi<Product> {
  constructor() {
    super();
    this.entity(Product)
        .baseUrl("/api/products");

    // Registration happens here:
    // queueMicrotask(() => ApiRegistry.register("ProductsApi", this));
  }
}

// When you instantiate, it registers automatically
const productsApi = new ProductsApi();

// Available immediately after microtask
setTimeout(() => {
  const api = ApiRegistry.getGroup("ProductsApi");
  console.log(api);  // ProductsApi instance
}, 0);

// Why queueMicrotask?
// - Allows constructor to complete first
// - Ensures all APIs are initialized before registration
// - Prevents "cannot access before initialization" errors`;

const namingConventionCode = `// API IDs follow pattern: entityName.operation

// CrudApi generates these IDs automatically
class UsersApi extends CrudApi<User> {
  constructor() {
    super();
    this.entity(User)  // entity name becomes "user"
        .baseUrl("/api/users");
  }
}

// Generated IDs:
// - user.list
// - user.get
// - user.create
// - user.update
// - user.patch
// - user.delete
// - user.search

// LookupApi generates these IDs
class CountriesApi extends LookupApi<Country> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/countries");  // extracts "countries"
  }
}

// Generated IDs:
// - lookup.countries.list
// - lookup.countries.get

// Custom API IDs
class CustomApi extends Api<Response> {
  constructor() {
    super();
    this.id("custom.myOperation")  // Explicit ID
        .url("/api/custom")
        .method("GET");
  }
}`;

const appApisCode = `import { createLuminoApp } from "lumino/core";

const app = createLuminoApp();

// Register all APIs at once
app.apis({
  // CRUD APIs
  users: new UsersApi(),
  products: new ProductsApi(),
  orders: new OrdersApi(),

  // Lookup APIs
  countries: new CountriesApi(),
  departments: new DepartmentsApi(),
  statuses: new StatusesApi(),

  // Custom API groups
  reports: new ReportsApi(),
  analytics: new AnalyticsApi(),
});

// All APIs are now registered and available via api() references`;

const contextAccessCode = `import { Form, api } from "lumino/core";

class MyForm extends Form<MyEntity> {
  configure() {
    this.onLoad(async (ctx) => {
      // Access APIs via context
      const usersApi = ctx.apis.users;

      // Call API directly
      const users = await ctx.call(usersApi.list);

      // Or use with api() reference
      const countries = await ctx.call(api("CountriesApi.list"));
    });

    // Use in lookup fields
    this.addRow()
      .addField("userId")
        .component(LuminoSelect)
        .lookup({
          api: api("UsersApi.list"),  // Resolved at runtime
          labelField: "name",
        })
      .endField()
    .endRow();
  }
}`;

const completeExampleCode = `import { createLuminoApp, CrudApi, LookupApi, api } from "lumino/core";

// 1. Define APIs
class UsersApi extends CrudApi<User> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users");
  }

  // Custom API
  checkEmail = new Api<boolean>()
    .id("users.checkEmail")
    .url("/api/users/check-email")
    .method("POST")
    .build();
}

class DepartmentsApi extends LookupApi<Department> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/departments")
        .cache()
          .storage("localStorage")
          .duration(3600000)
        .end();
  }
}

// 2. Create app and register APIs
const app = createLuminoApp();

app.apis({
  users: new UsersApi(),
  departments: new DepartmentsApi(),
});

// 3. Use in forms with type-safe references
class EmployeeForm extends Form<Employee> {
  configure() {
    this.addRow()
      .addField("departmentId")
        .component(LuminoSelect)
        .label("Department")
        .lookup({
          api: api("DepartmentsApi.list"),  // No import needed!
          labelField: "name",
        })
      .endField()
    .endRow();

    this.onLoad(async (ctx) => {
      // Access via context
      const users = await ctx.call(ctx.apis.users.list);
      console.log("Loaded users:", users);
    });
  }
}

// 4. Access anywhere via ApiRegistry
import { ApiRegistry } from "lumino/core";

const usersApi = ApiRegistry.getGroup("UsersApi");
const listApi = ApiRegistry.get("UsersApi", "list");
const checkEmailApi = ApiRegistry.getById("users.checkEmail");`;

const methodsTableData = [
  { method: "register(name, apiGroup)", description: "Register an API group (called automatically)" },
  { method: "get(groupName, apiName)", description: "Get API by group and name" },
  { method: "getById(id)", description: "Get API by its ID" },
  { method: "getGroup(groupName)", description: "Get entire API group" },
  { method: "getAll()", description: "Get all registered APIs as object" },
  { method: "hasGroup(groupName)", description: "Check if group is registered" },
  { method: "getGroupNames()", description: "Get all registered group names" },
  { method: "clear()", description: "Clear all registrations (testing)" },
];

const helperMethodsTableData = [
  { method: "api(ref)", description: "Create type-safe API reference" },
  { method: "api<T>(ref)", description: "Create API reference with explicit type" },
  { method: "isApiRef(value)", description: "Check if value is an ApiRef" },
];

export function ApiRegistryPage() {
  return (
    <>
      <h1 className="docs-page-title">ApiRegistry</h1>
      <p className="docs-page-subtitle">
        Central registry for APIs with auto-registration and type-safe references.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>ApiRegistry</code> is a global singleton that stores all registered APIs.
          CrudApi and LookupApi automatically register themselves when instantiated, making
          them available throughout your application.
        </p>
        <p>
          The <code>api()</code> function provides type-safe references to registered APIs
          without requiring direct imports, perfect for lookup fields and form configurations.
        </p>
        <CodeBlock code={basicRegistryCode} language="typescript" />
      </div>

      {/* API References */}
      <div className="docs-section">
        <h2 className="docs-section-title">Type-safe API References</h2>
        <p>
          Use <code>api()</code> to create references to registered APIs:
        </p>
        <CodeBlock code={apiRefCode} language="typescript" />
      </div>

      {/* In Lookups */}
      <div className="docs-section">
        <h2 className="docs-section-title">Using in Lookup Fields</h2>
        <p>
          The primary use case for API references is in lookup field configurations:
        </p>
        <CodeBlock code={inLookupsCode} language="typescript" />
      </div>

      {/* Registry Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">ApiRegistry Methods</h2>
        <CodeBlock code={registryMethodsCode} language="typescript" />
      </div>

      {/* Auto-registration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Auto-registration</h2>
        <p>
          CrudApi and LookupApi automatically register themselves using <code>queueMicrotask</code>:
        </p>
        <CodeBlock code={autoRegistrationCode} language="typescript" />
      </div>

      {/* Naming Convention */}
      <div className="docs-section">
        <h2 className="docs-section-title">API ID Naming Convention</h2>
        <p>
          APIs use a consistent naming pattern: <code>entityName.operation</code>
        </p>
        <CodeBlock code={namingConventionCode} language="typescript" />
      </div>

      {/* app.apis() */}
      <div className="docs-section">
        <h2 className="docs-section-title">Registering with app.apis()</h2>
        <p>
          Register all your APIs at once in your app configuration:
        </p>
        <CodeBlock code={appApisCode} language="typescript" />
      </div>

      {/* Context Access */}
      <div className="docs-section">
        <h2 className="docs-section-title">Accessing via Context</h2>
        <p>
          Registered APIs are available via the context object in forms:
        </p>
        <CodeBlock code={contextAccessCode} language="typescript" />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <p>
          Here's a complete example from API definition to usage:
        </p>
        <CodeBlock code={completeExampleCode} language="typescript" />
      </div>

      {/* Registry Methods Reference */}
      <div className="docs-section">
        <h2 className="docs-section-title">ApiRegistry Methods</h2>
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {methodsTableData.map((row, idx) => (
                <tr key={idx}>
                  <td><code>{row.method}</code></td>
                  <td>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Helper Methods Reference */}
      <div className="docs-section">
        <h2 className="docs-section-title">Helper Methods</h2>
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {helperMethodsTableData.map((row, idx) => (
                <tr key={idx}>
                  <td><code>{row.method}</code></td>
                  <td>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>Register all APIs in <code>app.apis()</code> at application startup</li>
          <li>Use <code>api()</code> references in lookup configs instead of direct imports</li>
          <li>Follow the naming convention: EntityNameApi for API classes</li>
          <li>Use descriptive API IDs that match the pattern: entity.operation</li>
          <li>Avoid calling ApiRegistry methods directly - use <code>api()</code> instead</li>
          <li>Let CrudApi and LookupApi handle auto-registration automatically</li>
          <li>Only use <code>ApiRegistry.clear()</code> in tests</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>CacheManager</strong> - Managing API response caching</li>
          <li><strong>CrudApi</strong> - Auto-generated CRUD operations</li>
          <li><strong>LookupApi</strong> - Cached reference data</li>
          <li><strong>FormContext</strong> - Accessing APIs in form callbacks</li>
        </ul>
      </div>
    </>
  );
}
