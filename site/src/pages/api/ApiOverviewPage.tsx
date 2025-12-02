/**
 * API Overview Page - Introduction to Lumino's API System
 */

import { CodeBlock } from "../../components/CodeBlock";

const overviewCode = `// Lumino API Architecture
//
// Api - Base class for individual API endpoints
//   └── Fluent builder pattern for endpoint configuration
//
// CrudApi - Auto-generates CRUD operations (like Spring JpaRepository)
//   └── list, get, create, update, patch, delete, search
//
// LookupApi - Specialized API for cached reference data
//   └── list, get (with automatic caching)
//
// Mapper - DTO/Entity transformation
//   └── Bidirectional mapping with field transformations
//
// ApiRegistry - Central registry (auto-registration)
//   └── Type-safe API references via api() function
//
// CacheManager - Response caching
//   └── Memory, localStorage, sessionStorage support`;

const quickStartCode = `import { CrudApi, Mapper } from "lumino/core";

// 1. Define Entity
class User {
  id: number = 0;
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  department: string = "";
}

// 2. Define Mapper (optional)
class UserMapper extends Mapper<UserDTO, User> {
  constructor() {
    super("UserMapper");

    // Map snake_case API to camelCase entity
    this.field()
      .dto("firstName")
      .entity("first_name")
    .end();

    this.field()
      .dto("lastName")
      .entity("last_name")
    .end();
  }
}

// 3. Define API
class UsersApi extends CrudApi<User, number> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users")
        .mapper(new UserMapper().build())
        .pagination()
          .type("offset")
          .defaultLimit(20)
        .end();
  }
  // Registration happens automatically!
}

// 4. Register in App
app.apis({
  users: new UsersApi(),
});

// 5. Use in Forms
class UserForm extends Form<User> {
  configure() {
    this.addRow()
      .addField("department")
        .component(LuminoSelect)
        .label("Department")
        .lookup({
          api: api("DepartmentsApi.list"),  // Type-safe reference!
          labelField: "name",
        })
      .endField()
    .endRow();
  }
}`;

const apiBuilderCode = `import { Api } from "lumino/core";

// Individual API endpoint
class GetUserApi extends Api<User> {
  constructor() {
    super();
    this.id("users.get")
        .url("/api/users/:id")
        .method("GET")
        .mapper(UserMapper)
        .cache()
          .storage("memory")
          .duration(60000)
        .end()
        .timeout(30000);
  }
}

// Group related APIs
class UsersApiGroup extends ApiGroup {
  list = new ListUsersApi().build();
  get = new GetUserApi().build();
  create = new CreateUserApi().build();
  update = new UpdateUserApi().build();
}`;

const crudApiCode = `import { CrudApi } from "lumino/core";

// Auto-generates 7 CRUD operations
class ProductsApi extends CrudApi<Product, number> {
  constructor() {
    super();
    this.entity(Product)
        .baseUrl("/api/products")
        .mapper(ProductMapper)
        .pagination()
          .type("offset")
          .defaultLimit(20)
        .end();
  }

  // Auto-generated:
  // - list: GET /api/products
  // - get: GET /api/products/:id
  // - create: POST /api/products
  // - update: PUT /api/products/:id
  // - patch: PATCH /api/products/:id
  // - delete: DELETE /api/products/:id
  // - search: GET /api/products (with criteria)

  // Add custom APIs
  featured = new Api<Product[]>()
    .id("products.featured")
    .url("/api/products/featured")
    .method("GET")
    .build();
}`;

const lookupApiCode = `import { LookupApi } from "lumino/core";

// Cached reference data
class CountriesApi extends LookupApi<Country> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/countries")
        .cache()
          .storage("localStorage")
          .duration(86400000)  // 24 hours
        .end();
  }

  // Auto-generated with caching:
  // - list: GET /api/lookups/countries (cached)
  // - get: GET /api/lookups/countries/:id (cached)
}

// Use in lookup fields
.lookup({
  api: api("CountriesApi.list"),
  labelField: "name",
  valueHandler: (country) => country.code,
})`;

const mapperCode = `import { Mapper } from "lumino/core";

class UserMapper extends Mapper<UserDTO, UserEntity> {
  constructor() {
    super("UserMapper");

    // Field mapping with transformation
    this.field()
      .dto("userName")
      .entity("user_name")
      .toDTO((value) => value.toUpperCase())
      .toEntity((value) => value.toLowerCase())
    .end();

    // Simple field mapping
    this.field()
      .dto("email")
      .entity("email_address")
    .end();

    // Computed DTO field
    this.computed()
      .dto("fullName")
      .value((entity) => \`\${entity.first_name} \${entity.last_name}\`)
    .end();

    // Ignore sensitive fields
    this.ignore("password", "token");
  }
}`;

const cachingCode = `// Automatic caching for GET requests
class UsersApi extends CrudApi<User> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users")
        .cache()
          .storage("memory")       // memory | localStorage | sessionStorage
          .duration(60000)         // 1 minute
          .keyPrefix("users_")
        .end();
  }
}

// Access cache manager
const cacheManager = executor.getCacheManager();
cacheManager.clear("memory");
cacheManager.clearAll();
cacheManager.getStats(); // { memory: 5, localStorage: 2, sessionStorage: 0 }`;

const interceptorsCode = `import { createAuthInterceptor, createLoggingInterceptor } from "lumino/core";

// Global interceptors run on all API calls
app.interceptors([
  // Add auth token
  createAuthInterceptor(),

  // Log all requests
  createLoggingInterceptor({ logBody: true }),

  // Custom interceptor
  {
    name: "tenant",
    priority: 10,
    request: (config, ctx) => {
      config.headers["X-Tenant-ID"] = ctx.user.get("tenantId");
      return config;
    },
  },
]);

// API-level interceptors
class UsersApi extends Api<User> {
  constructor() {
    super();
    this.id("users.get")
        .url("/api/users/:id")
        .beforeRequest((config, ctx) => {
          // Modify request before sending
          config.headers["X-Custom"] = "value";
          return config;
        })
        .afterResponse((response, ctx) => {
          // Transform response
          return response.data;
        });
  }
}`;

export function ApiOverviewPage() {
  return (
    <>
      <h1 className="docs-page-title">API System</h1>
      <p className="docs-page-subtitle">
        Type-safe API definitions with auto-registration, caching, and transformation.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">What is the API System?</h2>
        <p>
          Lumino's API system provides a <strong>declarative, type-safe way</strong> to define
          API endpoints. It includes built-in support for CRUD operations, reference data lookups,
          DTO/Entity mapping, caching, and request/response interceptors.
        </p>
        <p>
          The system is inspired by <strong>Spring Boot's JpaRepository</strong> pattern -
          define your API once and get all standard operations automatically generated.
        </p>
        <CodeBlock code={overviewCode} language="typescript" />
      </div>

      {/* Key Features */}
      <div className="docs-section">
        <h2 className="docs-section-title">Key Features</h2>
        <ul>
          <li><strong>Auto-generated CRUD</strong> - Define baseUrl, get 7 operations automatically</li>
          <li><strong>Type-safe references</strong> - Use <code>api("UsersApi.list")</code> without imports</li>
          <li><strong>Auto-registration</strong> - APIs register themselves when instantiated</li>
          <li><strong>DTO/Entity mapping</strong> - Transform API data to/from your entity shape</li>
          <li><strong>Response caching</strong> - Memory, localStorage, or sessionStorage</li>
          <li><strong>Interceptors</strong> - Global or per-API request/response modification</li>
          <li><strong>Lookup integration</strong> - Seamless integration with form lookup fields</li>
          <li><strong>Pagination support</strong> - Offset or cursor-based pagination</li>
        </ul>
      </div>

      {/* Quick Start */}
      <div className="docs-section">
        <h2 className="docs-section-title">Quick Start</h2>
        <p>
          Here's a complete example showing entity, mapper, API, and form integration:
        </p>
        <CodeBlock code={quickStartCode} language="typescript" />
      </div>

      {/* Core Concepts */}
      <div className="docs-section">
        <h2 className="docs-section-title">Core Concepts</h2>

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          1. Api - Individual Endpoints
        </h3>
        <p>
          The <code>Api</code> class is for defining individual API endpoints with full control:
        </p>
        <CodeBlock code={apiBuilderCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          2. CrudApi - Auto-generated Operations
        </h3>
        <p>
          The <code>CrudApi</code> class automatically generates 7 CRUD operations:
        </p>
        <CodeBlock code={crudApiCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          3. LookupApi - Cached Reference Data
        </h3>
        <p>
          The <code>LookupApi</code> class is optimized for reference data with caching:
        </p>
        <CodeBlock code={lookupApiCode} language="typescript" />

        <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12 }}>
          4. Mapper - DTO/Entity Transformation
        </h3>
        <p>
          The <code>Mapper</code> class transforms data between API format and entity format:
        </p>
        <CodeBlock code={mapperCode} language="typescript" />
      </div>

      {/* Caching */}
      <div className="docs-section">
        <h2 className="docs-section-title">Response Caching</h2>
        <p>
          APIs support automatic caching of GET requests with configurable storage:
        </p>
        <CodeBlock code={cachingCode} language="typescript" />
      </div>

      {/* Interceptors */}
      <div className="docs-section">
        <h2 className="docs-section-title">Request/Response Interceptors</h2>
        <p>
          Interceptors allow you to modify requests and responses globally or per-API:
        </p>
        <CodeBlock code={interceptorsCode} language="typescript" />
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>Api Builder</strong> - Deep dive into the Api class and fluent API</li>
          <li><strong>CrudApi</strong> - Auto-generated CRUD operations</li>
          <li><strong>LookupApi</strong> - Cached reference data APIs</li>
          <li><strong>Mapper</strong> - DTO/Entity transformation</li>
          <li><strong>ApiRegistry</strong> - Central registry and type-safe references</li>
          <li><strong>CacheManager</strong> - Cache management and configuration</li>
        </ul>
      </div>
    </>
  );
}
