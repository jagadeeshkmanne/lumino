/**
 * LookupApi Page - Cached reference data APIs
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicLookupCode = `import { LookupApi } from "lumino/core";

// Define entity
class Country {
  code: string = "";
  name: string = "";
  continent: string = "";
}

// Define Lookup API - automatically generates cached operations
class CountriesApi extends LookupApi<Country> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/countries")
        .cache()
          .storage("localStorage")  // Persist across sessions
          .duration(86400000)       // 24 hours
        .end();
  }
  // Auto-registration happens in constructor
}

// Register in app
app.apis({
  countries: new CountriesApi(),
});

// Auto-generated operations (with caching):
// - list: GET /api/lookups/countries (cached)
// - get:  GET /api/lookups/countries/:id (cached)`;

const lookupSignatureCode = `class LookupApi<TEntity> {
  // Configuration
  baseUrl(url: string): this;
  mapper(mapper: BuiltMapper<any, TEntity>): this;
  cache(): LookupCacheBuilder<this>;

  // Auto-generated operations (both cached)
  list: BuiltApi<TEntity[]>;
  get: BuiltApi<TEntity>;
}`;

const cacheConfigCode = `class DepartmentsApi extends LookupApi<Department> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/departments")
        .cache()
          .storage("localStorage")   // memory | localStorage | sessionStorage
          .duration(3600000)         // 1 hour in milliseconds
          .keyPrefix("dept_")        // Custom cache key prefix
        .end();
  }
}

// Cache Storage Options:
// - memory: Cleared on page refresh (default)
// - localStorage: Persists across sessions
// - sessionStorage: Cleared when tab closes`;

const inFormsCode = `import { Form, api } from "lumino/core";
import { LuminoSelect, LuminoAutocomplete } from "lumino/react";

class EmployeeForm extends Form<Employee> {
  configure() {
    // Simple dropdown
    this.addRow()
      .addField("countryCode")
        .component(LuminoSelect)
        .label("Country")
        .lookup({
          api: api("CountriesApi.list"),  // Uses cached list
          labelField: "name",
          valueHandler: (country) => country.code,
        })
      .endField()
    .endRow();

    // Autocomplete with search
    this.addRow()
      .addField("departmentId")
        .component(LuminoAutocomplete)
        .label("Department")
        .lookup({
          api: api("DepartmentsApi.list"),  // Uses cached list
          labelField: "name",
          searchFields: ["name", "code"],
        })
      .endField()
    .endRow();

    // With filtering
    this.addRow()
      .addField("stateCode")
        .component(LuminoSelect)
        .label("State")
        .lookup({
          api: api("StatesApi.list"),
          query: { countryCode: ctx.getValue("countryCode") },  // Filter by country
          labelField: "name",
        })
      .endField()
    .endRow();
  }
}`;

const withMapperCode = `import { LookupApi, Mapper } from "lumino/core";

// Entity
class Currency {
  code: string = "";
  name: string = "";
  symbol: string = "";
}

// Mapper
class CurrencyMapper extends Mapper<CurrencyDTO, Currency> {
  constructor() {
    super("CurrencyMapper");

    // Map API format to entity format
    this.field()
      .dto("code")
      .entity("currency_code")
    .end();

    this.field()
      .dto("name")
      .entity("currency_name")
    .end();

    // Computed field
    this.computed()
      .dto("displayName")
      .value((entity) => \`\${entity.currency_name} (\${entity.symbol})\`)
    .end();
  }
}

// LookupApi with mapper
class CurrenciesApi extends LookupApi<Currency> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/currencies")
        .mapper(new CurrencyMapper().build())
        .cache()
          .storage("localStorage")
          .duration(604800000)  // 7 days
        .end();
  }
}`;

const multipleLookupsCode = `// Define all lookup APIs
class CountriesApi extends LookupApi<Country> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/countries")
        .cache()
          .storage("localStorage")
          .duration(86400000)  // 24 hours
        .end();
  }
}

class DepartmentsApi extends LookupApi<Department> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/departments")
        .cache()
          .storage("memory")
          .duration(3600000)  // 1 hour
        .end();
  }
}

class StatusesApi extends LookupApi<Status> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/statuses")
        .cache()
          .storage("sessionStorage")
          .duration(1800000)  // 30 minutes
        .end();
  }
}

// Register all
app.apis({
  countries: new CountriesApi(),
  departments: new DepartmentsApi(),
  statuses: new StatusesApi(),
});`;

const cacheManagementCode = `// Get cache manager from context
onLoad(async (ctx) => {
  const cacheManager = ctx.executor.getCacheManager();

  // Check cache stats
  const stats = cacheManager.getStats();
  console.log("Cache stats:", stats);
  // { memory: 5, localStorage: 2, sessionStorage: 0 }

  // Clear specific storage
  cacheManager.clear("memory");

  // Clear all caches
  cacheManager.clearAll();

  // Check if cached
  const countriesApi = ctx.apis.countries.list;
  const hasCached = cacheManager.has(
    "countries.list",
    countriesApi.config.cache!
  );
});`;

const whenToUseLookupCode = `// ✅ Use LookupApi for:
// - Countries, states, cities
// - Departments, teams, offices
// - Statuses, priorities, categories
// - Currencies, languages, timezones
// - Any reference data that:
//   - Changes infrequently
//   - Is read far more than written
//   - Should be cached
//   - Needs to be available offline (localStorage)

// ❌ Don't use LookupApi for:
// - User lists (use CrudApi)
// - Product catalogs (use CrudApi)
// - Transaction data (use CrudApi)
// - Any frequently changing data
// - Data that requires real-time updates`;

const completeExampleCode = `import { LookupApi, Mapper } from "lumino/core";

// 1. Entity
class Language {
  code: string = "";
  name: string = "";
  nativeName: string = "";
  direction: "ltr" | "rtl" = "ltr";
}

// 2. Mapper
class LanguageMapper extends Mapper<LanguageDTO, Language> {
  constructor() {
    super("LanguageMapper");

    this.field()
      .dto("code")
      .entity("language_code")
    .end();

    this.field()
      .dto("name")
      .entity("english_name")
    .end();

    this.field()
      .dto("nativeName")
      .entity("native_name")
    .end();

    this.computed()
      .dto("displayName")
      .value((entity) => \`\${entity.english_name} (\${entity.native_name})\`)
    .end();
  }
}

// 3. LookupApi
class LanguagesApi extends LookupApi<Language> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/languages")
        .mapper(new LanguageMapper().build())
        .cache()
          .storage("localStorage")    // Persist across sessions
          .duration(604800000)        // 7 days
          .keyPrefix("lang_")
        .end();
  }
}

// 4. Register
app.apis({
  languages: new LanguagesApi(),
});

// 5. Use in forms
class UserProfileForm extends Form<UserProfile> {
  configure() {
    this.addRow()
      .addField("preferredLanguage")
        .component(LuminoSelect)
        .label("Language")
        .lookup({
          api: api("LanguagesApi.list"),
          labelField: "displayName",
          valueHandler: (lang) => lang.code,
        })
      .endField()
    .endRow();
  }
}`;

const operationsTableData = [
  {
    operation: "list",
    method: "GET",
    url: "/baseUrl",
    caching: "Yes",
    description: "Get all lookup entities (cached)",
  },
  {
    operation: "get",
    method: "GET",
    url: "/baseUrl/:id",
    caching: "Yes",
    description: "Get single lookup entity by ID (cached)",
  },
];

export function LookupApiPage() {
  return (
    <>
      <h1 className="docs-page-title">LookupApi</h1>
      <p className="docs-page-subtitle">
        Specialized API for cached reference/lookup data.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>LookupApi&lt;TEntity&gt;</code> is a specialized API class for reference
          data that changes infrequently. It automatically caches responses and is optimized
          for dropdown lists, autocomplete fields, and other lookup scenarios.
        </p>
        <p>
          Unlike CrudApi, LookupApi only generates read operations (list and get) and
          always includes caching configuration.
        </p>
        <CodeBlock code={basicLookupCode} language="typescript" />
      </div>

      {/* Class Signature */}
      <div className="docs-section">
        <h2 className="docs-section-title">Class Signature</h2>
        <CodeBlock code={lookupSignatureCode} language="typescript" />
        <p>
          <strong>Generic Type:</strong>
        </p>
        <ul>
          <li><code>TEntity</code> - Your lookup entity type (e.g., Country, Department)</li>
        </ul>
      </div>

      {/* Auto-generated Operations */}
      <div className="docs-section">
        <h2 className="docs-section-title">Auto-generated Operations</h2>
        <p>
          When you call <code>.baseUrl()</code>, LookupApi generates these 2 cached operations:
        </p>
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>Method</th>
                <th>URL</th>
                <th>Caching</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {operationsTableData.map((row, idx) => (
                <tr key={idx}>
                  <td><code>{row.operation}</code></td>
                  <td><strong>{row.method}</strong></td>
                  <td><code>{row.url}</code></td>
                  <td><strong>{row.caching}</strong></td>
                  <td>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cache Configuration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Cache Configuration</h2>
        <p>
          LookupApi includes built-in caching with configurable storage:
        </p>
        <CodeBlock code={cacheConfigCode} language="typescript" />
      </div>

      {/* Usage in Forms */}
      <div className="docs-section">
        <h2 className="docs-section-title">Usage in Forms</h2>
        <p>
          LookupApi is designed to work seamlessly with lookup fields in forms:
        </p>
        <CodeBlock code={inFormsCode} language="typescript" />
      </div>

      {/* With Mapper */}
      <div className="docs-section">
        <h2 className="docs-section-title">With Mapper</h2>
        <p>
          Add a mapper to transform API data to your entity format:
        </p>
        <CodeBlock code={withMapperCode} language="typescript" />
      </div>

      {/* Multiple Lookups */}
      <div className="docs-section">
        <h2 className="docs-section-title">Multiple Lookup APIs</h2>
        <p>
          Most applications have multiple lookup APIs. Here's how to organize them:
        </p>
        <CodeBlock code={multipleLookupsCode} language="typescript" />
      </div>

      {/* Cache Management */}
      <div className="docs-section">
        <h2 className="docs-section-title">Cache Management</h2>
        <p>
          Access the cache manager to manually control caching:
        </p>
        <CodeBlock code={cacheManagementCode} language="typescript" />
      </div>

      {/* When to Use */}
      <div className="docs-section">
        <h2 className="docs-section-title">When to Use LookupApi</h2>
        <CodeBlock code={whenToUseLookupCode} language="typescript" />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <p>
          Here's a complete example with entity, mapper, and form integration:
        </p>
        <CodeBlock code={completeExampleCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>Use localStorage for data that should persist across sessions</li>
          <li>Use sessionStorage for data that should be cleared when tab closes</li>
          <li>Use memory for frequently changing lookup data</li>
          <li>Set appropriate cache durations based on how often data changes</li>
          <li>Use longer durations (24h+) for truly static data like countries</li>
          <li>Use shorter durations (1h) for data that might change daily</li>
          <li>Add custom cache key prefixes to avoid collisions</li>
          <li>Group all lookup APIs together in <code>app.apis()</code></li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>Mapper</strong> - Deep dive into DTO/Entity transformation</li>
          <li><strong>ApiRegistry</strong> - How APIs are registered and referenced</li>
          <li><strong>CacheManager</strong> - Advanced cache configuration</li>
          <li><strong>CrudApi</strong> - For full CRUD operations on mutable data</li>
        </ul>
      </div>
    </>
  );
}
