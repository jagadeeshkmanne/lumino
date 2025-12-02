/**
 * LookupField Page
 *
 * Documents the Lookup API pattern for cached reference data.
 * Uses Form Builder pattern with LuminoLiveDemo component.
 */

import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoSelect, LuminoAutocomplete } from "lumino/react";

// =============================================================================
// COUNTRY LOOKUP FORM
// =============================================================================

class CountryLookupForm extends Form<{ country: string }> {
  constructor() { super("country-lookup-form"); }
  configure() {
    this.addSection("Country Selection")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Select Country")
          .placeholder("Choose a country...")
          .props({
            options: [
              { value: "us", label: "United States" },
              { value: "uk", label: "United Kingdom" },
              { value: "ca", label: "Canada" },
              { value: "au", label: "Australia" },
              { value: "de", label: "Germany" },
              { value: "fr", label: "France" },
              { value: "jp", label: "Japan" },
            ]
          })
          .rules(Validators.required({ message: "Please select a country" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const countryLookupCode = `import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class CountryLookupForm extends Form<{ country: string }> {
  constructor() { super("country-lookup-form"); }

  configure() {
    this.addSection("Country Selection")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Select Country")
          .placeholder("Choose a country...")
          .props({
            options: [
              { value: "us", label: "United States" },
              { value: "uk", label: "United Kingdom" },
              { value: "ca", label: "Canada" },
              { value: "au", label: "Australia" },
              { value: "de", label: "Germany" },
              { value: "fr", label: "France" },
              { value: "jp", label: "Japan" },
            ]
          })
          .rules(Validators.required({ message: "Please select a country" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CATEGORY LOOKUP FORM (with count display)
// =============================================================================

class CategoryLookupForm extends Form<{ category: string }> {
  constructor() { super("category-lookup-form"); }
  configure() {
    this.addSection("Category Selection")
      .addRow()
        .addField("category")
          .component(LuminoSelect)
          .label("Product Category")
          .placeholder("Select a category...")
          .props({
            options: [
              { value: "1", label: "Electronics (1234 items)" },
              { value: "2", label: "Clothing (567 items)" },
              { value: "3", label: "Home & Garden (890 items)" },
              { value: "4", label: "Sports (432 items)" },
              { value: "5", label: "Books (2100 items)" },
            ]
          })
          .rules(Validators.required({ message: "Please select a category" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const categoryLookupCode = `import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class CategoryLookupForm extends Form<{ category: string }> {
  constructor() { super("category-lookup-form"); }

  configure() {
    this.addSection("Category Selection")
      .addRow()
        .addField("category")
          .component(LuminoSelect)
          .label("Product Category")
          .placeholder("Select a category...")
          .props({
            options: [
              { value: "1", label: "Electronics (1234 items)" },
              { value: "2", label: "Clothing (567 items)" },
              { value: "3", label: "Home & Garden (890 items)" },
              { value: "4", label: "Sports (432 items)" },
              { value: "5", label: "Books (2100 items)" },
            ]
          })
          .rules(Validators.required({ message: "Please select a category" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// STATUS LOOKUP FORM
// =============================================================================

class StatusLookupForm extends Form<{ status: string }> {
  constructor() { super("status-lookup-form"); }
  configure() {
    this.addSection("Status Selection")
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Order Status")
          .props({
            options: [
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending Review" },
              { value: "archived", label: "Archived" },
            ]
          })
        .endField()
      .endRow()
    .endSection();
  }
}

const statusLookupCode = `import { Form } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class StatusLookupForm extends Form<{ status: string }> {
  constructor() { super("status-lookup-form"); }

  configure() {
    this.addSection("Status Selection")
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Order Status")
          .props({
            options: [
              { value: "draft", label: "Draft" },
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending Review" },
              { value: "archived", label: "Archived" },
            ]
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CITY AUTOCOMPLETE FORM
// =============================================================================

class CityAutocompleteForm extends Form<{ city: string }> {
  constructor() { super("city-autocomplete-form"); }
  configure() {
    this.addSection("City Search")
      .addRow()
        .addField("city")
          .component(LuminoAutocomplete)
          .label("Search City")
          .placeholder("Type to search cities...")
          .props({
            options: [
              { value: "NYC", label: "New York, USA" },
              { value: "LON", label: "London, UK" },
              { value: "TKY", label: "Tokyo, Japan" },
              { value: "PAR", label: "Paris, France" },
              { value: "BER", label: "Berlin, Germany" },
              { value: "SYD", label: "Sydney, Australia" },
              { value: "TOR", label: "Toronto, Canada" },
              { value: "SIN", label: "Singapore, Singapore" },
            ]
          })
          .rules(Validators.required({ message: "Please select a city" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const cityAutocompleteCode = `import { Form, Validators } from "lumino/core";
import { LuminoAutocomplete } from "lumino/react";

class CityAutocompleteForm extends Form<{ city: string }> {
  constructor() { super("city-autocomplete-form"); }

  configure() {
    this.addSection("City Search")
      .addRow()
        .addField("city")
          .component(LuminoAutocomplete)
          .label("Search City")
          .placeholder("Type to search cities...")
          .props({
            options: [
              { value: "NYC", label: "New York, USA" },
              { value: "LON", label: "London, UK" },
              { value: "TKY", label: "Tokyo, Japan" },
              { value: "PAR", label: "Paris, France" },
              { value: "BER", label: "Berlin, Germany" },
              { value: "SYD", label: "Sydney, Australia" },
              { value: "TOR", label: "Toronto, Canada" },
              { value: "SIN", label: "Singapore, Singapore" },
            ]
          })
          .rules(Validators.required({ message: "Please select a city" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// ORDER FORM (Multiple Lookups)
// =============================================================================

class OrderLookupForm extends Form<{ country: string; category: string; status: string }> {
  constructor() { super("order-lookup-form"); }
  configure() {
    this.addSection("Order Details")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Shipping Country")
          .placeholder("Select shipping country...")
          .props({
            options: [
              { value: "us", label: "United States" },
              { value: "uk", label: "United Kingdom" },
              { value: "ca", label: "Canada" },
            ]
          })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("category")
          .component(LuminoSelect)
          .label("Product Category")
          .placeholder("Select product category...")
          .props({
            options: [
              { value: "electronics", label: "Electronics" },
              { value: "clothing", label: "Clothing" },
              { value: "home", label: "Home & Garden" },
            ]
          })
          .rules(Validators.required({ message: "Category is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Order Status")
          .props({
            options: [
              { value: "draft", label: "Draft" },
              { value: "submitted", label: "Submitted" },
              { value: "approved", label: "Approved" },
              { value: "shipped", label: "Shipped" },
            ]
          })
        .endField()
      .endRow()
    .endSection();
  }
}

const orderLookupCode = `import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";

class OrderLookupForm extends Form<{ country: string; category: string; status: string }> {
  constructor() { super("order-lookup-form"); }

  configure() {
    this.addSection("Order Details")
      .addRow()
        .addField("country")
          .component(LuminoSelect)
          .label("Shipping Country")
          .placeholder("Select shipping country...")
          .props({
            options: [
              { value: "us", label: "United States" },
              { value: "uk", label: "United Kingdom" },
              { value: "ca", label: "Canada" },
            ]
          })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("category")
          .component(LuminoSelect)
          .label("Product Category")
          .placeholder("Select product category...")
          .props({
            options: [
              { value: "electronics", label: "Electronics" },
              { value: "clothing", label: "Clothing" },
              { value: "home", label: "Home & Garden" },
            ]
          })
          .rules(Validators.required({ message: "Category is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Order Status")
          .props({
            options: [
              { value: "draft", label: "Draft" },
              { value: "submitted", label: "Submitted" },
              { value: "approved", label: "Approved" },
              { value: "shipped", label: "Shipped" },
            ]
          })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CODE EXAMPLES (Non-form)
// =============================================================================

const lookupApiCode = `// Define a Lookup API for caching reference data
class CountriesApi extends LookupApi<Country> {
  constructor() {
    super();
    this.baseUrl("/api/lookups/countries")
        .cache()
          .storage("localStorage")  // or "sessionStorage" or "memory"
          .duration(86400000)       // 24 hours in ms
          .end();
  }
}

// Entity interface
interface Country {
  code: string;
  name: string;
  region: string;
}

// Registration happens automatically!
// Access via: ApiRegistry.get("CountriesApi")`;

const cacheConfigCode = `// Cache in localStorage (persists between sessions)
this.baseUrl("/api/lookups/countries")
    .cache()
      .storage("localStorage")
      .duration(86400000)  // 24 hours
      .end();

// Cache in sessionStorage (cleared on browser close)
this.baseUrl("/api/lookups/categories")
    .cache()
      .storage("sessionStorage")
      .duration(3600000)  // 1 hour
      .end();

// Cache in memory (cleared on page refresh)
this.baseUrl("/api/lookups/statuses")
    .cache()
      .storage("memory")
      .duration(600000)  // 10 minutes
      .end();`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function LookupFieldPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Lookup Fields</h1>
      <p className="docs-page-subtitle">
        Use LookupApi for cached reference data like countries, categories, and statuses.
        Perfect for dropdown options that rarely change.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { Form, Validators } from "lumino/core";
import { LuminoSelect, LuminoAutocomplete } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Country Lookup</h2>
        <p>Basic country selection using lookup data with Form Builder:</p>
        <LuminoLiveDemo
          title="Country Select"
          description="Dropdown with country lookup data"
          form={new CountryLookupForm()}
          code={countryLookupCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Category Lookup with Count</h2>
        <p>Show additional data in option labels:</p>
        <LuminoLiveDemo
          title="Category Select"
          description="Dropdown with category data and counts"
          form={new CategoryLookupForm()}
          code={categoryLookupCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Status Lookup</h2>
        <p>Status selection with pre-selected value:</p>
        <LuminoLiveDemo
          title="Status Select"
          description="Dropdown for status values"
          form={new StatusLookupForm()}
          code={statusLookupCode}
          initialValues={{ status: "active" }}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Autocomplete City Search</h2>
        <p>Use Autocomplete for searchable lookup data:</p>
        <LuminoLiveDemo
          title="City Autocomplete"
          description="Searchable dropdown with city data"
          form={new CityAutocompleteForm()}
          code={cityAutocompleteCode}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>Order Form Example</h2>
        <p>Multiple lookup fields in a form:</p>
        <LuminoLiveDemo
          title="Order Form"
          description="Form with multiple lookup selects"
          form={new OrderLookupForm()}
          code={orderLookupCode}
          initialValues={{ status: "draft" }}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2>LookupApi Class</h2>
        <p>
          LookupApi is a specialized API class for reference data that should be cached.
          It automatically caches responses to reduce server requests.
        </p>
        <pre className="docs-code">{lookupApiCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Cache Configuration</h2>
        <p>
          Configure caching behavior for your lookup data:
        </p>
        <pre className="docs-code">{cacheConfigCode}</pre>
      </div>

      <div className="docs-section">
        <h2>LookupApi Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>baseUrl(url: string)</code></td>
              <td>Set the API endpoint URL</td>
            </tr>
            <tr>
              <td><code>cache()</code></td>
              <td>Configure caching options</td>
            </tr>
            <tr>
              <td><code>.storage(type)</code></td>
              <td>Set storage type: "localStorage", "sessionStorage", or "memory"</td>
            </tr>
            <tr>
              <td><code>.duration(ms)</code></td>
              <td>Set cache duration in milliseconds</td>
            </tr>
            <tr>
              <td><code>.keyPrefix(prefix)</code></td>
              <td>Set custom cache key prefix</td>
            </tr>
            <tr>
              <td><code>.end()</code></td>
              <td>End cache configuration</td>
            </tr>
            <tr>
              <td><code>mapper(mapper)</code></td>
              <td>Set DTO to entity mapper</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use for reference data</strong> - Countries, categories,
            statuses, and other rarely-changing data
          </li>
          <li>
            <strong>Choose appropriate cache duration</strong> - Balance between
            freshness and performance
          </li>
          <li>
            <strong>Use localStorage for persistent data</strong> - Data that
            rarely changes (countries, currencies)
          </li>
          <li>
            <strong>Use sessionStorage for session data</strong> - Data that
            might change between sessions
          </li>
          <li>
            <strong>Use memory for frequently updated data</strong> - Data that
            changes often but benefits from short-term caching
          </li>
          <li>
            <strong>Keep lookup lists small</strong> - For large datasets, use
            server-side filtering with Autocomplete
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Common Lookup Examples</h2>
        <ul className="docs-list">
          <li><strong>Countries</strong> - ISO country codes and names</li>
          <li><strong>Currencies</strong> - Currency codes and symbols</li>
          <li><strong>Languages</strong> - Language codes and names</li>
          <li><strong>Timezones</strong> - Timezone identifiers</li>
          <li><strong>Categories</strong> - Product/content categories</li>
          <li><strong>Statuses</strong> - Order/ticket/task statuses</li>
          <li><strong>Departments</strong> - Company departments</li>
          <li><strong>Roles</strong> - User roles and permissions</li>
        </ul>
      </div>
    </div>
  );
}
