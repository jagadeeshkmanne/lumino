/**
 * CrudApi Page - Auto-generated CRUD operations
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicCrudCode = `import { CrudApi } from "lumino/core";

// Define entity
class Product {
  id: number = 0;
  name: string = "";
  price: number = 0;
  category: string = "";
  inStock: boolean = true;
}

// Define CRUD API - automatically generates 7 operations!
class ProductsApi extends CrudApi<Product, number> {
  constructor() {
    super();
    this.entity(Product)
        .baseUrl("/api/products");
  }
  // Auto-registration happens in constructor
}

// Register in app
app.apis({
  products: new ProductsApi(),
});

// Auto-generated operations:
// - list:   GET    /api/products
// - get:    GET    /api/products/:id
// - create: POST   /api/products
// - update: PUT    /api/products/:id
// - patch:  PATCH  /api/products/:id
// - delete: DELETE /api/products/:id
// - search: GET    /api/products (with criteria)`;

const crudSignatureCode = `class CrudApi<TEntity, TId = number> {
  // Configuration
  entity(entityClass: new () => TEntity): this;
  baseUrl(url: string): this;
  mapper(mapper: BuiltMapper<any, TEntity>): this;
  pagination(): CrudPaginationBuilder<this>;
  cache(): CrudCacheBuilder<this>;

  // Auto-generated operations
  list: BuiltApi<TEntity[]>;
  get: BuiltApi<TEntity>;
  create: BuiltApi<TEntity, Partial<TEntity>>;
  update: BuiltApi<TEntity, Partial<TEntity>>;
  patch: BuiltApi<TEntity, Partial<TEntity>>;
  delete: BuiltApi<void>;
  search: BuiltApi<TEntity[]>;
}`;

const withMapperCode = `import { CrudApi, Mapper } from "lumino/core";

// Entity
class User {
  id: number = 0;
  firstName: string = "";
  lastName: string = "";
  email: string = "";
}

// Mapper for API transformations
class UserMapper extends Mapper<UserDTO, User> {
  constructor() {
    super("UserMapper");

    // Map snake_case to camelCase
    this.field()
      .dto("firstName")
      .entity("first_name")
    .end();

    this.field()
      .dto("lastName")
      .entity("last_name")
    .end();

    // Computed field
    this.computed()
      .dto("fullName")
      .value((entity) => \`\${entity.first_name} \${entity.last_name}\`)
    .end();
  }
}

// CrudApi with mapper
class UsersApi extends CrudApi<User, number> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users")
        .mapper(new UserMapper().build());
  }
}

// Mapper is applied to ALL operations:
// - Request bodies (create/update/patch) are transformed TO entity format
// - Responses (list/get/search) are transformed TO DTO format`;

const withPaginationCode = `class ProductsApi extends CrudApi<Product, number> {
  constructor() {
    super();
    this.entity(Product)
        .baseUrl("/api/products")
        .pagination()
          .type("offset")           // offset | cursor
          .defaultLimit(20)         // Default items per page
          .maxLimit(100)            // Maximum allowed
        .end();
  }
}

// Pagination is applied to list and search operations:
// GET /api/products?page=0&limit=20
// GET /api/products?page=1&limit=20`;

const withCacheCode = `class CountriesApi extends CrudApi<Country, number> {
  constructor() {
    super();
    this.entity(Country)
        .baseUrl("/api/countries")
        .cache()
          .storage("localStorage")  // memory | localStorage | sessionStorage
          .duration(86400000)       // 24 hours
          .keyPrefix("countries_")
        .end();
  }
}

// Cache is applied to GET operations (list, get, search)
// POST/PUT/PATCH/DELETE operations are never cached`;

const customApisCode = `class UsersApi extends CrudApi<User, number> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users");
  }

  // Add custom APIs beyond CRUD
  checkEmail = new Api<boolean>()
    .id("users.checkEmail")
    .url("/api/users/check-email")
    .method("POST")
    .build();

  resetPassword = new Api<void>()
    .id("users.resetPassword")
    .url("/api/users/:id/reset-password")
    .method("POST")
    .build();

  getByDepartment = new Api<User[]>()
    .id("users.getByDepartment")
    .url("/api/users/department/:departmentId")
    .method("GET")
    .build();
}

// Use custom APIs
.lookup({
  api: api("UsersApi.getByDepartment"),
  path: { departmentId: ctx.getValue("departmentId") },
  labelField: "name",
})`;

const operationsTableData = [
  {
    operation: "list",
    method: "GET",
    url: "/baseUrl",
    description: "Get all entities (with pagination if configured)",
  },
  {
    operation: "get",
    method: "GET",
    url: "/baseUrl/:id",
    description: "Get single entity by ID",
  },
  {
    operation: "create",
    method: "POST",
    url: "/baseUrl",
    description: "Create new entity",
  },
  {
    operation: "update",
    method: "PUT",
    url: "/baseUrl/:id",
    description: "Replace entire entity",
  },
  {
    operation: "patch",
    method: "PATCH",
    url: "/baseUrl/:id",
    description: "Partially update entity",
  },
  {
    operation: "delete",
    method: "DELETE",
    url: "/baseUrl/:id",
    description: "Delete entity",
  },
  {
    operation: "search",
    method: "GET",
    url: "/baseUrl",
    description: "Search with criteria (same as list but for explicit search)",
  },
];

const autoRegistrationCode = `// CrudApi auto-registers when instantiated
class ProductsApi extends CrudApi<Product> {
  constructor() {
    super();
    this.entity(Product)
        .baseUrl("/api/products");

    // Registration happens automatically in queueMicrotask
    // No need to call ApiRegistry.register()
  }
}

// Instantiate to register
const productsApi = new ProductsApi();

// Now available via ApiRegistry
ApiRegistry.getGroup("ProductsApi");  // Returns the instance
ApiRegistry.get("ProductsApi", "list");  // Returns list API
ApiRegistry.getById("product.list");  // Returns list API by ID`;

const usageInFormsCode = `import { Form, api } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class OrderForm extends Form<Order> {
  configure() {
    this.addRow()
      .addField("productId")
        .component(LuminoSelect)
        .label("Product")
        .lookup({
          api: api("ProductsApi.list"),  // Uses auto-generated list API
          labelField: "name",
          valueHandler: (product) => product.id,
        })
      .endField()
    .endRow();

    this.addRow()
      .addField("customerId")
        .component(LuminoSelect)
        .label("Customer")
        .lookup({
          api: api("CustomersApi.search"),  // Uses auto-generated search API
          query: { status: "active" },
          labelField: "name",
        })
      .endField()
    .endRow();
  }
}`;

const completeExampleCode = `import { CrudApi, Mapper } from "lumino/core";

// 1. Entity
class Employee {
  id: number = 0;
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  departmentId: number = 0;
  salary: number = 0;
  isActive: boolean = true;
}

// 2. Mapper (optional)
class EmployeeMapper extends Mapper<EmployeeDTO, Employee> {
  constructor() {
    super("EmployeeMapper");

    this.field()
      .dto("firstName")
      .entity("first_name")
    .end();

    this.field()
      .dto("lastName")
      .entity("last_name")
    .end();

    this.field()
      .dto("departmentId")
      .entity("department_id")
    .end();

    this.field()
      .dto("isActive")
      .entity("is_active")
    .end();

    this.computed()
      .dto("fullName")
      .value((entity) => \`\${entity.first_name} \${entity.last_name}\`)
    .end();
  }
}

// 3. CrudApi
class EmployeesApi extends CrudApi<Employee, number> {
  constructor() {
    super();
    this.entity(Employee)
        .baseUrl("/api/employees")
        .mapper(new EmployeeMapper().build())
        .pagination()
          .type("offset")
          .defaultLimit(25)
          .maxLimit(100)
        .end()
        .cache()
          .storage("memory")
          .duration(60000)  // 1 minute
        .end();
  }

  // Custom APIs
  active = new Api<Employee[]>()
    .id("employees.active")
    .url("/api/employees/active")
    .method("GET")
    .build();

  byDepartment = new Api<Employee[]>()
    .id("employees.byDepartment")
    .url("/api/employees/department/:departmentId")
    .method("GET")
    .build();
}

// 4. Register
app.apis({
  employees: new EmployeesApi(),
});`;

export function CrudApiPage() {
  return (
    <>
      <h1 className="docs-page-title">CrudApi</h1>
      <p className="docs-page-subtitle">
        Auto-generated CRUD operations inspired by Spring Boot's JpaRepository.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>CrudApi&lt;TEntity, TId&gt;</code> automatically generates 7 standard CRUD
          operations when you provide a base URL. This eliminates boilerplate and ensures
          consistency across your API definitions.
        </p>
        <p>
          Just define your entity, set the base URL, and you're done. No need to manually
          create list, get, create, update, patch, delete, and search endpoints.
        </p>
        <CodeBlock code={basicCrudCode} language="typescript" />
      </div>

      {/* Class Signature */}
      <div className="docs-section">
        <h2 className="docs-section-title">Class Signature</h2>
        <CodeBlock code={crudSignatureCode} language="typescript" />
        <p>
          <strong>Generic Types:</strong>
        </p>
        <ul>
          <li><code>TEntity</code> - Your entity type (e.g., User, Product)</li>
          <li><code>TId</code> - The ID type (default: number, can be string, etc.)</li>
        </ul>
      </div>

      {/* Auto-generated Operations */}
      <div className="docs-section">
        <h2 className="docs-section-title">Auto-generated Operations</h2>
        <p>
          When you call <code>.baseUrl()</code>, CrudApi generates these 7 operations:
        </p>
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Method</th>
                <th>URL</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {operationsTableData.map((row, idx) => (
                <tr key={idx}>
                  <td><code>{row.operation}</code></td>
                  <td><strong>{row.method}</strong></td>
                  <td><code>{row.url}</code></td>
                  <td>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* With Mapper */}
      <div className="docs-section">
        <h2 className="docs-section-title">With Mapper</h2>
        <p>
          Add a mapper to transform data between API format and entity format:
        </p>
        <CodeBlock code={withMapperCode} language="typescript" />
      </div>

      {/* With Pagination */}
      <div className="docs-section">
        <h2 className="docs-section-title">With Pagination</h2>
        <p>
          Configure pagination for list and search operations:
        </p>
        <CodeBlock code={withPaginationCode} language="typescript" />
      </div>

      {/* With Cache */}
      <div className="docs-section">
        <h2 className="docs-section-title">With Cache</h2>
        <p>
          Enable caching for read operations (list, get, search):
        </p>
        <CodeBlock code={withCacheCode} language="typescript" />
      </div>

      {/* Custom APIs */}
      <div className="docs-section">
        <h2 className="docs-section-title">Adding Custom APIs</h2>
        <p>
          Extend CrudApi with custom endpoints beyond the standard CRUD operations:
        </p>
        <CodeBlock code={customApisCode} language="typescript" />
      </div>

      {/* Auto-registration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Auto-registration</h2>
        <p>
          CrudApi instances automatically register themselves in the ApiRegistry when instantiated.
          This happens in a <code>queueMicrotask</code> after the constructor completes:
        </p>
        <CodeBlock code={autoRegistrationCode} language="typescript" />
      </div>

      {/* Usage in Forms */}
      <div className="docs-section">
        <h2 className="docs-section-title">Usage in Forms</h2>
        <p>
          Use auto-generated APIs in lookup fields with type-safe references:
        </p>
        <CodeBlock code={usageInFormsCode} language="typescript" />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <p>
          Here's a complete example with entity, mapper, pagination, caching, and custom APIs:
        </p>
        <CodeBlock code={completeExampleCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>Use CrudApi for entities with standard CRUD operations</li>
          <li>Add custom APIs as class properties for domain-specific operations</li>
          <li>Enable pagination for list and search operations to handle large datasets</li>
          <li>Use mappers to keep API format separate from entity format</li>
          <li>Cache read operations when data doesn't change frequently</li>
          <li>Use meaningful entity names - they become part of API IDs (e.g., "product.list")</li>
          <li>Register CrudApi instances in <code>app.apis()</code> for global access</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>LookupApi</strong> - Specialized API for cached reference data</li>
          <li><strong>Mapper</strong> - Deep dive into DTO/Entity transformation</li>
          <li><strong>ApiRegistry</strong> - How APIs are registered and referenced</li>
          <li><strong>CacheManager</strong> - Cache configuration and management</li>
        </ul>
      </div>
    </>
  );
}
