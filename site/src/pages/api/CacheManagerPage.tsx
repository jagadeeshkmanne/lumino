/**
 * CacheManager Page - API response caching
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicCacheCode = `import { CacheManager, cacheManager } from "lumino/core";

// Global cache manager instance
const cache = cacheManager;

// Or create your own
const customCache = new CacheManager();

// Get cached data
const data = cache.get("my-key", {
  enabled: true,
  storage: "memory",
  duration: 60000,
  keyPrefix: "app_",
});

// Set cached data
cache.set("my-key", { foo: "bar" }, {
  enabled: true,
  storage: "memory",
  duration: 60000,
  keyPrefix: "app_",
});

// Check if cached
if (cache.has("my-key", config)) {
  console.log("Data is cached");
}

// Remove cached data
cache.remove("my-key", config);`;

const storageTypesCode = `// Memory storage (default) - cleared on page refresh
cache.set("user", userData, {
  enabled: true,
  storage: "memory",
  duration: 60000,      // 1 minute
  keyPrefix: "user_",
});

// localStorage - persists across sessions
cache.set("countries", countries, {
  enabled: true,
  storage: "localStorage",
  duration: 86400000,   // 24 hours
  keyPrefix: "lookup_",
});

// sessionStorage - cleared when tab closes
cache.set("temp", tempData, {
  enabled: true,
  storage: "sessionStorage",
  duration: 1800000,    // 30 minutes
  keyPrefix: "session_",
});`;

const withApisCode = `import { Api, CrudApi, LookupApi } from "lumino/core";

// Individual API with caching
class GetUserApi extends Api<User> {
  constructor() {
    super();
    this.id("users.get")
        .url("/api/users/:id")
        .method("GET")
        .cache()
          .storage("memory")
          .duration(60000)     // 1 minute
          .keyPrefix("user_")
        .end();
  }
}

// CrudApi with caching (applied to list, get, search)
class ProductsApi extends CrudApi<Product> {
  constructor() {
    super();
    this.entity(Product)
        .baseUrl("/api/products")
        .cache()
          .storage("memory")
          .duration(300000)    // 5 minutes
        .end();
  }
}

// LookupApi with persistent caching
class CountriesApi extends LookupApi<Country> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/countries")
        .cache()
          .storage("localStorage")
          .duration(86400000)  // 24 hours
        .end();
  }
}`;

const managingCacheCode = `// Get cache manager from executor
const cache = executor.getCacheManager();

// Clear specific storage type
cache.clear("memory");
cache.clear("localStorage");
cache.clear("sessionStorage");

// Clear all caches
cache.clearAll();

// Get cache statistics
const stats = cache.getStats();
console.log(stats);
// {
//   memory: 5,
//   localStorage: 2,
//   sessionStorage: 0
// }`;

const cacheKeysCode = `// Cache keys are built from:
// 1. Key prefix (from config)
// 2. API ID
// 3. Path parameters (if any)
// 4. Query parameters (if any)

// Example cache keys:
// - "lumino_cache_users.list"
// - "lumino_cache_users.get:{"id":123}"
// - "lumino_cache_products.search:{"category":"electronics","page":0}"

// Custom key prefix
class UsersApi extends CrudApi<User> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users")
        .cache()
          .keyPrefix("users_")  // Custom prefix
        .end();
  }
}
// Cache key: "users_user.list"`;

const cacheExpirationCode = `// Cache entries expire after their duration
cache.set("data", myData, {
  enabled: true,
  storage: "memory",
  duration: 60000,  // Expires after 1 minute
  keyPrefix: "app_",
});

// After 1 minute:
const data = cache.get("data", config);  // Returns null (expired)

// Common durations:
const ONE_MINUTE = 60000;
const FIVE_MINUTES = 300000;
const ONE_HOUR = 3600000;
const ONE_DAY = 86400000;
const ONE_WEEK = 604800000;

// Use appropriate duration based on data volatility
cache.set("static-data", data, {
  enabled: true,
  storage: "localStorage",
  duration: ONE_WEEK,      // Rarely changes
  keyPrefix: "static_",
});

cache.set("user-data", data, {
  enabled: true,
  storage: "memory",
  duration: FIVE_MINUTES,  // Changes frequently
  keyPrefix: "user_",
});`;

const skipCacheCode = `import { Form } from "lumino/core";

class MyForm extends Form<MyEntity> {
  configure() {
    this.onLoad(async (ctx) => {
      // Skip cache for fresh data
      const users = await ctx.call(ctx.apis.users.list, {
        skipCache: true,  // Force fresh API call
      });
    });

    // Button to refresh data
    this.addRow()
      .addComponent(LuminoButton)
        .children("Refresh")
        .onClick(async (ctx) => {
          // Clear cache
          ctx.executor.getCacheManager().clear("memory");

          // Reload data
          const data = await ctx.call(ctx.apis.users.list);
          ctx.notify?.("Data refreshed!", "success");
        })
      .endComponent()
    .endRow();
  }
}`;

const inContextCode = `class MyForm extends Form<MyEntity> {
  configure() {
    this.onLoad(async (ctx) => {
      const cache = ctx.executor.getCacheManager();

      // Check cache stats
      const stats = cache.getStats();
      console.log("Cache entries:", stats);

      // Clear old cache before loading
      cache.clear("memory");

      // Load data (will be cached)
      const users = await ctx.call(ctx.apis.users.list);

      // Manually cache custom data
      cache.set("form-state", ctx.getFormData(), {
        enabled: true,
        storage: "sessionStorage",
        duration: 3600000,  // 1 hour
        keyPrefix: "form_",
      });
    });

    this.onSubmit(async (ctx) => {
      // Clear user cache after update
      const cache = ctx.executor.getCacheManager();
      cache.clear("memory");

      // Submit data
      await ctx.call(ctx.apis.users.update, {
        path: { id: ctx.entity.id },
        body: ctx.getFormData(),
      });
    });
  }
}`;

const completeExampleCode = `import { CrudApi, LookupApi, CacheManager } from "lumino/core";

// 1. Define APIs with different cache strategies

// Frequently changing data - short cache
class UsersApi extends CrudApi<User> {
  constructor() {
    super();
    this.entity(User)
        .baseUrl("/api/users")
        .cache()
          .storage("memory")
          .duration(60000)        // 1 minute
          .keyPrefix("users_")
        .end();
  }
}

// Moderately changing data - medium cache
class ProductsApi extends CrudApi<Product> {
  constructor() {
    super();
    this.entity(Product)
        .baseUrl("/api/products")
        .cache()
          .storage("memory")
          .duration(300000)       // 5 minutes
          .keyPrefix("products_")
        .end();
  }
}

// Static reference data - long cache with localStorage
class CountriesApi extends LookupApi<Country> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/countries")
        .cache()
          .storage("localStorage")
          .duration(86400000)     // 24 hours
          .keyPrefix("countries_")
        .end();
  }
}

// 2. Use in form with cache management
class OrderForm extends Form<Order> {
  configure() {
    this.onLoad(async (ctx) => {
      const cache = ctx.executor.getCacheManager();

      // Log cache stats
      const stats = cache.getStats();
      console.log("Cache stats:", stats);

      // Load data (will use cache if available)
      const products = await ctx.call(ctx.apis.products.list);
      const countries = await ctx.call(ctx.apis.countries.list);
    });

    // Add refresh button
    this.addRow()
      .addComponent(LuminoButton)
        .children("Refresh Data")
        .onClick(async (ctx) => {
          // Clear memory cache
          ctx.executor.getCacheManager().clear("memory");

          // Reload fresh data
          const products = await ctx.call(ctx.apis.products.list, {
            skipCache: true,
          });

          ctx.notify?.("Data refreshed!", "success");
        })
      .endComponent()
    .endRow();
  }
}

// 3. Clear cache on logout
function logout(ctx) {
  const cache = ctx.executor.getCacheManager();

  // Clear all caches
  cache.clearAll();

  // Or clear specific storage
  cache.clear("memory");
  cache.clear("sessionStorage");
  // Keep localStorage for reference data

  // Redirect to login
  ctx.navigate("/login");
}`;

const methodsTableData = [
  { method: "get<T>(key, config)", description: "Get cached data (returns null if expired or missing)" },
  { method: "set<T>(key, data, config)", description: "Set cached data with expiration" },
  { method: "remove(key, config)", description: "Remove specific cached entry" },
  { method: "has(key, config)", description: "Check if entry exists and is valid" },
  { method: "clear(storage)", description: "Clear all entries in storage (memory/localStorage/sessionStorage)" },
  { method: "clearAll()", description: "Clear all caches across all storage types" },
  { method: "getStats()", description: "Get count of entries in each storage type" },
];

const configTableData = [
  { field: "enabled", type: "boolean", description: "Whether caching is enabled" },
  { field: "storage", type: "'memory' | 'localStorage' | 'sessionStorage'", description: "Storage backend" },
  { field: "duration", type: "number", description: "Cache duration in milliseconds" },
  { field: "keyPrefix", type: "string", description: "Prefix for cache keys (default: 'lumino_cache_')" },
];

export function CacheManagerPage() {
  return (
    <>
      <h1 className="docs-page-title">CacheManager</h1>
      <p className="docs-page-subtitle">
        Manage API response caching with multiple storage backends.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>CacheManager</code> handles caching of API responses with support for
          multiple storage backends: memory, localStorage, and sessionStorage. It
          automatically handles cache expiration and cleanup.
        </p>
        <p>
          APIs can enable caching through the <code>.cache()</code> builder, and the
          CacheManager handles the rest automatically.
        </p>
        <CodeBlock code={basicCacheCode} language="typescript" />
      </div>

      {/* Storage Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Storage Types</h2>
        <p>
          CacheManager supports three storage backends, each with different persistence:
        </p>
        <CodeBlock code={storageTypesCode} language="typescript" />
        <ul>
          <li><strong>memory</strong> - Fast, cleared on page refresh (default)</li>
          <li><strong>localStorage</strong> - Persists across sessions and tabs</li>
          <li><strong>sessionStorage</strong> - Persists until tab is closed</li>
        </ul>
      </div>

      {/* With APIs */}
      <div className="docs-section">
        <h2 className="docs-section-title">Caching with APIs</h2>
        <p>
          Enable caching through the API builder:
        </p>
        <CodeBlock code={withApisCode} language="typescript" />
      </div>

      {/* Managing Cache */}
      <div className="docs-section">
        <h2 className="docs-section-title">Managing Cache</h2>
        <p>
          Clear and inspect cache manually:
        </p>
        <CodeBlock code={managingCacheCode} language="typescript" />
      </div>

      {/* Cache Keys */}
      <div className="docs-section">
        <h2 className="docs-section-title">Cache Keys</h2>
        <p>
          Cache keys are automatically generated from API configuration:
        </p>
        <CodeBlock code={cacheKeysCode} language="typescript" />
      </div>

      {/* Cache Expiration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Cache Expiration</h2>
        <p>
          Cached entries automatically expire after their configured duration:
        </p>
        <CodeBlock code={cacheExpirationCode} language="typescript" />
      </div>

      {/* Skip Cache */}
      <div className="docs-section">
        <h2 className="docs-section-title">Skipping Cache</h2>
        <p>
          Force fresh API calls by skipping cache:
        </p>
        <CodeBlock code={skipCacheCode} language="typescript" />
      </div>

      {/* In Context */}
      <div className="docs-section">
        <h2 className="docs-section-title">Using in Form Context</h2>
        <p>
          Access CacheManager through the form context:
        </p>
        <CodeBlock code={inContextCode} language="typescript" />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <p>
          Here's a complete example with different cache strategies:
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

      {/* Cache Config */}
      <div className="docs-section">
        <h2 className="docs-section-title">CacheConfig Options</h2>
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {configTableData.map((row, idx) => (
                <tr key={idx}>
                  <td><code>{row.field}</code></td>
                  <td><code>{row.type}</code></td>
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
          <li>Use memory for frequently changing data (user lists, real-time data)</li>
          <li>Use localStorage for static reference data (countries, categories)</li>
          <li>Use sessionStorage for temporary session data</li>
          <li>Set appropriate durations based on data volatility</li>
          <li>Clear memory cache after mutations (create/update/delete)</li>
          <li>Keep localStorage small - it has size limits</li>
          <li>Add custom key prefixes to avoid collisions</li>
          <li>Use <code>skipCache: true</code> when you need guaranteed fresh data</li>
          <li>Monitor cache stats in development to tune durations</li>
          <li>Clear all caches on logout for security</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>Api Builder</strong> - Configuring caching in API definitions</li>
          <li><strong>CrudApi</strong> - Auto-generated CRUD with caching</li>
          <li><strong>LookupApi</strong> - Specialized caching for reference data</li>
          <li><strong>ApiRegistry</strong> - Managing registered APIs</li>
        </ul>
      </div>
    </>
  );
}
