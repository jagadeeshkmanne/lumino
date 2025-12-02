/**
 * Api Builder Page - Deep dive into the Api class
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicApiCode = `import { Api } from "lumino/core";

// Define a single API endpoint
class GetUserApi extends Api<User> {
  constructor() {
    super();
    this.id("users.get")
        .url("/api/users/:id")
        .method("GET")
        .mapper(UserMapper)
        .timeout(30000);
  }
}

// Build and use
const getUserApi = new GetUserApi().build();`;

const apiSignatureCode = `class Api<TResponse = any, TBody = void> {
  // Identification
  id(id: string): this;

  // HTTP Configuration
  url(url: string): this;
  method(method: HttpMethod): this;
  timeout(ms: number): this;

  // Headers Builder
  headers(): HeadersBuilder<this>;

  // Data Transformation
  mapper(mapper: BuiltMapper<any, any>): this;

  // Caching
  cache(): CacheBuilder<this>;

  // Pagination
  pagination(): PaginationBuilder<this>;

  // Interceptors
  beforeRequest(fn: (config, ctx) => config): this;
  afterResponse(fn: (response, ctx) => any): this;

  // Build
  build(): BuiltApi<TResponse, TBody>;
}`;

const urlParamsCode = `// Path parameters with :param syntax
class GetUserApi extends Api<User> {
  constructor() {
    super();
    this.id("users.get")
        .url("/api/users/:id")  // :id will be replaced
        .method("GET");
  }
}

// Optional path parameters with :param?
class GetUserProfileApi extends Api<Profile> {
  constructor() {
    super();
    this.id("users.profile")
        .url("/api/users/:userId/profiles/:profileId?")
        .method("GET");
  }
}

// Usage (handled by executor)
// GET /api/users/123
// GET /api/users/123/profiles/456`;

const headersCode = `class CreateUserApi extends Api<User, UserInput> {
  constructor() {
    super();
    this.id("users.create")
        .url("/api/users")
        .method("POST")
        .headers()
          .set("Content-Type", "application/json")
          .set("X-API-Version", "2.0")
        .end();
  }
}

// Headers are merged with defaults
// Default: { "Content-Type": "application/json" }
// Result: { "Content-Type": "application/json", "X-API-Version": "2.0" }`;

const mapperCode = `import { Api, Mapper } from "lumino/core";

// Define mapper
class UserMapper extends Mapper<UserDTO, UserEntity> {
  constructor() {
    super("UserMapper");
    this.field()
      .dto("firstName")
      .entity("first_name")
    .end();
  }
}

// Use in API
class GetUserApi extends Api<User> {
  constructor() {
    super();
    this.id("users.get")
        .url("/api/users/:id")
        .method("GET")
        .mapper(new UserMapper().build());  // Auto transforms response
  }
}

// Response is automatically transformed:
// API returns: { first_name: "John" }
// You get: { firstName: "John" }`;

const cacheCode = `class GetUserApi extends Api<User> {
  constructor() {
    super();
    this.id("users.get")
        .url("/api/users/:id")
        .method("GET")
        .cache()
          .storage("memory")        // memory | localStorage | sessionStorage
          .duration(60000)          // Cache for 1 minute
          .keyPrefix("user_")       // Cache key prefix
        .end();
  }
}

// Only GET requests are cached
// Cache key: user_users.get:{"id":123}`;

const paginationCode = `class ListUsersApi extends Api<User[]> {
  constructor() {
    super();
    this.id("users.list")
        .url("/api/users")
        .method("GET")
        .pagination()
          .type("offset")           // offset | cursor
          .defaultLimit(20)
          .maxLimit(100)
        .end();
  }
}

// Query params automatically added:
// GET /api/users?page=0&limit=20`;

const interceptorsCode = `class CreateUserApi extends Api<User, UserInput> {
  constructor() {
    super();
    this.id("users.create")
        .url("/api/users")
        .method("POST")
        .beforeRequest((config, ctx) => {
          // Modify request before sending
          console.log("Creating user...");
          config.headers["X-Request-ID"] = crypto.randomUUID();
          return config;
        })
        .afterResponse((response, ctx) => {
          // Transform response
          console.log("User created:", response.data);
          ctx.notify?.("User created successfully!", "success");
          return response.data;
        });
  }
}`;

const apiGroupCode = `import { Api, ApiGroup } from "lumino/core";

// Individual APIs
class ListUsersApi extends Api<User[]> {
  constructor() {
    super();
    this.id("users.list")
        .url("/api/users")
        .method("GET");
  }
}

class GetUserApi extends Api<User> {
  constructor() {
    super();
    this.id("users.get")
        .url("/api/users/:id")
        .method("GET");
  }
}

class CreateUserApi extends Api<User, UserInput> {
  constructor() {
    super();
    this.id("users.create")
        .url("/api/users")
        .method("POST");
  }
}

// Group them together
class UsersApi extends ApiGroup {
  list = new ListUsersApi().build();
  get = new GetUserApi().build();
  create = new CreateUserApi().build();
  update = new UpdateUserApi().build();
  delete = new DeleteUserApi().build();
}

// Register
app.apis({
  users: new UsersApi(),
});

// Use in forms
.lookup({
  api: api("UsersApi.list"),  // Reference by group.api
  labelField: "name",
})`;

const completeExampleCode = `import { Api, Mapper } from "lumino/core";

// Entity
class Product {
  id: number = 0;
  name: string = "";
  price: number = 0;
  category: string = "";
  inStock: boolean = true;
}

// Mapper
class ProductMapper extends Mapper<ProductDTO, Product> {
  constructor() {
    super("ProductMapper");
    this.field()
      .dto("inStock")
      .entity("in_stock")
    .end();
  }
}

// API
class GetProductApi extends Api<Product> {
  constructor() {
    super();
    this.id("products.get")
        .url("/api/products/:id")
        .method("GET")
        .mapper(new ProductMapper().build())
        .cache()
          .storage("memory")
          .duration(300000)  // 5 minutes
        .end()
        .timeout(10000)
        .afterResponse((response, ctx) => {
          // Track analytics
          console.log("Product viewed:", response.data.id);
          return response.data;
        });
  }
}`;

const methodsTableData = [
  { method: "id(id: string)", description: "Set unique API identifier (required)" },
  { method: "url(url: string)", description: "Set endpoint URL with :param placeholders (required)" },
  { method: "method(method: HttpMethod)", description: "Set HTTP method (GET, POST, PUT, PATCH, DELETE)" },
  { method: "timeout(ms: number)", description: "Set request timeout in milliseconds" },
  { method: "headers()", description: "Start headers builder (.set, .remove, .end)" },
  { method: "mapper(mapper)", description: "Set DTO/Entity mapper for transformation" },
  { method: "cache()", description: "Start cache builder (.storage, .duration, .end)" },
  { method: "pagination()", description: "Start pagination builder (.type, .defaultLimit, .end)" },
  { method: "beforeRequest(fn)", description: "Set request interceptor" },
  { method: "afterResponse(fn)", description: "Set response interceptor" },
  { method: "build()", description: "Build and return the API configuration" },
];

export function ApiBuilderPage() {
  return (
    <>
      <h1 className="docs-page-title">Api Builder</h1>
      <p className="docs-page-subtitle">
        Fluent builder for defining individual API endpoints.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>Api&lt;TResponse, TBody&gt;</code> class provides a fluent builder
          for defining individual API endpoints with full control over configuration.
        </p>
        <p>
          It's the foundation for <code>CrudApi</code> and <code>LookupApi</code>,
          but can also be used directly when you need a custom endpoint.
        </p>
        <CodeBlock code={basicApiCode} language="typescript" />
      </div>

      {/* API Signature */}
      <div className="docs-section">
        <h2 className="docs-section-title">API Signature</h2>
        <CodeBlock code={apiSignatureCode} language="typescript" />
      </div>

      {/* Generic Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Generic Types</h2>
        <ul>
          <li>
            <strong>TResponse</strong> - The response type this API returns
            <pre className="docs-code">Api&lt;User&gt;          // Returns User
Api&lt;User[]&gt;        // Returns User array
Api&lt;boolean&gt;       // Returns boolean</pre>
          </li>
          <li>
            <strong>TBody</strong> - The request body type (default: void)
            <pre className="docs-code">Api&lt;User, UserInput&gt;  // Accepts UserInput as body
Api&lt;User, Partial&lt;User&gt;&gt;  // Accepts partial User</pre>
          </li>
        </ul>
      </div>

      {/* URL Configuration */}
      <div className="docs-section">
        <h2 className="docs-section-title">URL Configuration</h2>
        <p>
          URLs support path parameters using <code>:param</code> syntax. Parameters
          are replaced at runtime by the ApiExecutor:
        </p>
        <CodeBlock code={urlParamsCode} language="typescript" />
      </div>

      {/* Headers */}
      <div className="docs-section">
        <h2 className="docs-section-title">Headers Configuration</h2>
        <p>
          Use the <code>headers()</code> builder to set custom headers:
        </p>
        <CodeBlock code={headersCode} language="typescript" />
      </div>

      {/* Mapper */}
      <div className="docs-section">
        <h2 className="docs-section-title">Mapper Integration</h2>
        <p>
          Attach a mapper to automatically transform request/response data:
        </p>
        <CodeBlock code={mapperCode} language="typescript" />
      </div>

      {/* Cache */}
      <div className="docs-section">
        <h2 className="docs-section-title">Caching</h2>
        <p>
          Enable caching for GET requests to improve performance:
        </p>
        <CodeBlock code={cacheCode} language="typescript" />
      </div>

      {/* Pagination */}
      <div className="docs-section">
        <h2 className="docs-section-title">Pagination</h2>
        <p>
          Configure pagination for list endpoints:
        </p>
        <CodeBlock code={paginationCode} language="typescript" />
      </div>

      {/* Interceptors */}
      <div className="docs-section">
        <h2 className="docs-section-title">Request/Response Interceptors</h2>
        <p>
          Add API-level interceptors for request/response modification:
        </p>
        <CodeBlock code={interceptorsCode} language="typescript" />
      </div>

      {/* API Groups */}
      <div className="docs-section">
        <h2 className="docs-section-title">ApiGroup - Organizing Related APIs</h2>
        <p>
          Use <code>ApiGroup</code> to organize related APIs together:
        </p>
        <CodeBlock code={apiGroupCode} language="typescript" />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <p>
          Here's a complete API with all features:
        </p>
        <CodeBlock code={completeExampleCode} language="typescript" />
      </div>

      {/* Methods Reference */}
      <div className="docs-section">
        <h2 className="docs-section-title">Methods Reference</h2>
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

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>Always set a unique <code>id()</code> for each API</li>
          <li>Use <code>ApiGroup</code> to organize related endpoints</li>
          <li>Enable caching for read-only GET requests</li>
          <li>Use mappers to keep API format separate from entity format</li>
          <li>Add interceptors for cross-cutting concerns (logging, auth, etc.)</li>
          <li>Set appropriate timeouts based on expected response times</li>
          <li>Use path parameters (<code>:id</code>) instead of query params for resource identifiers</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>CrudApi</strong> - Auto-generated CRUD operations</li>
          <li><strong>LookupApi</strong> - Cached reference data APIs</li>
          <li><strong>Mapper</strong> - DTO/Entity transformation in detail</li>
          <li><strong>ApiRegistry</strong> - How APIs are registered and referenced</li>
        </ul>
      </div>
    </>
  );
}
