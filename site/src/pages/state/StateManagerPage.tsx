/**
 * StateManager Page - Complete API reference for StateManager
 */

import { CodeBlock } from "../../components/CodeBlock";

const importCode = `import { stateManager } from "lumino/core";
// or
import { StateManager } from "lumino/core";
const customManager = new StateManager();`;

const loadingApiCode = `import { stateManager } from "lumino/core";

// Global loading state
stateManager.setGlobalLoading(true);
const isLoading = stateManager.isLoading(); // true

// API-specific loading
stateManager.setApiLoading("fetchUsers", true);
stateManager.setApiLoading("fetchProducts", true);
const isFetchingUsers = stateManager.isApiLoading("fetchUsers"); // true

// Form-specific loading
stateManager.setFormLoading("employee-form", true);
const isFormLoading = stateManager.isFormLoading("employee-form"); // true

// Page-specific loading
stateManager.setPageLoading("dashboard", true);
const isPageLoading = stateManager.isPageLoading("dashboard"); // true

// Subscribe to all loading changes
const unsubscribe = stateManager.onLoadingChange((loadingState) => {
  console.log("Global:", loadingState.global);
  console.log("APIs:", loadingState.apis);
  console.log("Forms:", loadingState.forms);
  console.log("Pages:", loadingState.pages);
});

// Cleanup
unsubscribe();`;

const localeThemeCode = `import { stateManager } from "lumino/core";

// Locale management
stateManager.setLocale("es");
const locale = stateManager.getLocale(); // "es"

// Theme management
stateManager.setTheme("dark");
const theme = stateManager.getTheme(); // "dark"

// Note: setLocale emits "app:locale:change" event
// This allows components to react to locale changes`;

const userStateCode = `import { stateManager } from "lumino/core";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Set current user
stateManager.setUser<User>({
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Get current user
const user = stateManager.getUser<User>();
console.log(user?.name); // "John Doe"

// Clear user (logout)
stateManager.clearUser();`;

const metaStateCode = `import { stateManager } from "lumino/core";

// Store arbitrary application state
stateManager.setMeta("sidebarCollapsed", true);
stateManager.setMeta("lastViewedPage", "/dashboard");
stateManager.setMeta("preferences", {
  notifications: true,
  autoSave: false
});

// Retrieve meta values
const collapsed = stateManager.getMeta<boolean>("sidebarCollapsed"); // true
const lastPage = stateManager.getMeta<string>("lastViewedPage"); // "/dashboard"
const prefs = stateManager.getMeta<any>("preferences");

// Clear all meta
stateManager.clearMeta();`;

const entityStoresCode = `import { stateManager } from "lumino/core";

interface User {
  id: number;
  name: string;
  email: string;
}

// Create or get entity store
const userStore = stateManager.createEntityStore<User>("currentUser");

// Set data
userStore.setData({ id: 1, name: "John", email: "john@example.com" });

// Get entity store later
const sameStore = stateManager.getEntityStore<User>("currentUser");
console.log(sameStore?.data); // { id: 1, name: "John", ... }

// Remove store (cleanup)
stateManager.removeEntityStore("currentUser");`;

const collectionStoresCode = `import { stateManager } from "lumino/core";

interface Product {
  id: number;
  name: string;
  price: number;
}

// Create or get collection store
const productsStore = stateManager.createCollectionStore<Product, number>(
  "products",
  "id" // ID field (default is "id")
);

// Set all items
productsStore.setAll([
  { id: 1, name: "Widget", price: 9.99 },
  { id: 2, name: "Gadget", price: 19.99 }
]);

// Get collection store later
const sameStore = stateManager.getCollectionStore<Product, number>("products");
console.log(sameStore?.count); // 2

// Remove store (cleanup)
stateManager.removeCollectionStore("products");`;

const cacheCode = `import { stateManager } from "lumino/core";

interface ApiResponse {
  data: any[];
  total: number;
}

// Cache with default TTL (5 minutes)
stateManager.setCached("api-users", { data: [...], total: 100 });

// Cache with custom TTL (10 minutes)
const tenMinutes = 10 * 60 * 1000;
stateManager.setCached("api-config", configData, tenMinutes);

// Retrieve from cache
const cached = stateManager.getCached<ApiResponse>("api-users");
if (cached) {
  console.log("Using cached data:", cached.data);
} else {
  console.log("Cache expired or not found");
}

// Clear specific cache entry
stateManager.clearCached("api-users");

// Clear all cache
stateManager.clearAllCache();`;

const subscriptionsCode = `import { stateManager } from "lumino/core";

// Subscribe to all state changes
const unsubscribe = stateManager.subscribe((state, prevState) => {
  console.log("State changed:", state);
  console.log("Previous state:", prevState);
});

// Get full app state
const appState = stateManager.getState();
console.log(appState.loading);
console.log(appState.locale);
console.log(appState.theme);
console.log(appState.user);
console.log(appState.meta);

// Cleanup
unsubscribe();`;

const resetCode = `import { stateManager } from "lumino/core";

// Reset everything to initial state
stateManager.reset();

// This clears:
// - All loading states
// - Locale (back to "en")
// - Theme (back to "light")
// - User (null)
// - Meta (empty)
// - All entity stores
// - All collection stores
// - All cache entries`;

const exampleIntegrationCode = `import { stateManager } from "lumino/core";
import { apiClient } from "./api";

// API integration example
async function fetchUser(userId: number) {
  // Check cache first
  const cached = stateManager.getCached<User>(\`user-\${userId}\`);
  if (cached) {
    return cached;
  }

  // Set loading
  stateManager.setApiLoading("fetchUser", true);

  try {
    const user = await apiClient.get(\`/users/\${userId}\`);

    // Update store
    const userStore = stateManager.createEntityStore<User>("currentUser");
    userStore.setData(user);

    // Cache for 5 minutes
    stateManager.setCached(\`user-\${userId}\`, user);

    return user;
  } catch (error) {
    // Set error on store
    const userStore = stateManager.getEntityStore<User>("currentUser");
    userStore?.setError(error);
    throw error;
  } finally {
    // Clear loading
    stateManager.setApiLoading("fetchUser", false);
  }
}

// Usage in component
const user = await fetchUser(1);`;

export function StateManagerPage() {
  return (
    <>
      <h1 className="docs-page-title">StateManager</h1>
      <p className="docs-page-subtitle">
        Central state manager for application state, entity stores, and loading states.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          The <code>StateManager</code> class is the central hub for managing all application
          state. It provides a singleton instance (<code>stateManager</code>) that you can use
          throughout your application, or you can create custom instances for specific use cases.
        </p>
        <p>
          StateManager handles:
        </p>
        <ul>
          <li>Global application state (loading, locale, theme, user)</li>
          <li>Registry of entity and collection stores</li>
          <li>TTL-based caching</li>
          <li>State subscriptions</li>
        </ul>
      </div>

      {/* Import */}
      <div className="docs-section">
        <h2 className="docs-section-title">Import</h2>
        <CodeBlock code={importCode} language="typescript" />
        <p>
          Most applications use the singleton <code>stateManager</code> instance. Use a
          custom instance if you need isolated state (e.g., for testing or multi-tenant apps).
        </p>
      </div>

      {/* Loading State API */}
      <div className="docs-section">
        <h2 className="docs-section-title">Loading State API</h2>
        <p>
          StateManager provides comprehensive loading state management for different
          parts of your application:
        </p>
        <CodeBlock code={loadingApiCode} language="typescript" />

        <h3 className="docs-subsection-title">Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>isLoading()</code></td>
              <td>Get global loading state (boolean)</td>
            </tr>
            <tr>
              <td><code>setGlobalLoading(loading)</code></td>
              <td>Set global loading state, emits ui:loader events</td>
            </tr>
            <tr>
              <td><code>setApiLoading(apiId, loading)</code></td>
              <td>Set loading state for specific API call</td>
            </tr>
            <tr>
              <td><code>isApiLoading(apiId)</code></td>
              <td>Check if specific API is loading</td>
            </tr>
            <tr>
              <td><code>setFormLoading(formId, loading)</code></td>
              <td>Set loading state for specific form</td>
            </tr>
            <tr>
              <td><code>isFormLoading(formId)</code></td>
              <td>Check if specific form is loading</td>
            </tr>
            <tr>
              <td><code>setPageLoading(pageId, loading)</code></td>
              <td>Set loading state for specific page</td>
            </tr>
            <tr>
              <td><code>isPageLoading(pageId)</code></td>
              <td>Check if specific page is loading</td>
            </tr>
            <tr>
              <td><code>onLoadingChange(subscriber)</code></td>
              <td>Subscribe to loading state changes, returns unsubscribe function</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Locale & Theme */}
      <div className="docs-section">
        <h2 className="docs-section-title">Locale & Theme</h2>
        <p>
          Manage application locale and theme settings:
        </p>
        <CodeBlock code={localeThemeCode} language="typescript" />

        <h3 className="docs-subsection-title">Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>getLocale()</code></td>
              <td>Get current locale (default: "en")</td>
            </tr>
            <tr>
              <td><code>setLocale(locale)</code></td>
              <td>Set locale, emits app:locale:change event</td>
            </tr>
            <tr>
              <td><code>getTheme()</code></td>
              <td>Get current theme (default: "light")</td>
            </tr>
            <tr>
              <td><code>setTheme(theme)</code></td>
              <td>Set theme (e.g., "light", "dark")</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* User State */}
      <div className="docs-section">
        <h2 className="docs-section-title">User State</h2>
        <p>
          Manage the current user (authentication state):
        </p>
        <CodeBlock code={userStateCode} language="typescript" />

        <h3 className="docs-subsection-title">Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>getUser&lt;T&gt;()</code></td>
              <td>Get current user (null if not logged in)</td>
            </tr>
            <tr>
              <td><code>setUser(user)</code></td>
              <td>Set current user</td>
            </tr>
            <tr>
              <td><code>clearUser()</code></td>
              <td>Clear user (logout)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Meta State */}
      <div className="docs-section">
        <h2 className="docs-section-title">Meta State</h2>
        <p>
          Store arbitrary application state using key-value pairs:
        </p>
        <CodeBlock code={metaStateCode} language="typescript" />

        <h3 className="docs-subsection-title">Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>getMeta&lt;T&gt;(key)</code></td>
              <td>Get meta value by key (undefined if not found)</td>
            </tr>
            <tr>
              <td><code>setMeta(key, value)</code></td>
              <td>Set meta value</td>
            </tr>
            <tr>
              <td><code>clearMeta()</code></td>
              <td>Clear all meta values</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Entity Stores */}
      <div className="docs-section">
        <h2 className="docs-section-title">Entity Stores</h2>
        <p>
          Create and manage stores for single entities:
        </p>
        <CodeBlock code={entityStoresCode} language="typescript" />

        <h3 className="docs-subsection-title">Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>createEntityStore&lt;T&gt;(name)</code></td>
              <td>Create or get existing entity store</td>
            </tr>
            <tr>
              <td><code>getEntityStore&lt;T&gt;(name)</code></td>
              <td>Get entity store by name (undefined if not exists)</td>
            </tr>
            <tr>
              <td><code>removeEntityStore(name)</code></td>
              <td>Remove entity store from registry</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Collection Stores */}
      <div className="docs-section">
        <h2 className="docs-section-title">Collection Stores</h2>
        <p>
          Create and manage stores for collections (lists):
        </p>
        <CodeBlock code={collectionStoresCode} language="typescript" />

        <h3 className="docs-subsection-title">Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>createCollectionStore&lt;T, TId&gt;(name, idField)</code></td>
              <td>Create or get existing collection store</td>
            </tr>
            <tr>
              <td><code>getCollectionStore&lt;T, TId&gt;(name)</code></td>
              <td>Get collection store by name (undefined if not exists)</td>
            </tr>
            <tr>
              <td><code>removeCollectionStore(name)</code></td>
              <td>Remove collection store from registry</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cache */}
      <div className="docs-section">
        <h2 className="docs-section-title">Cache</h2>
        <p>
          TTL-based caching for API responses and computed values:
        </p>
        <CodeBlock code={cacheCode} language="typescript" />

        <h3 className="docs-subsection-title">Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>getCached&lt;T&gt;(key)</code></td>
              <td>Get cached value (null if expired or not found)</td>
            </tr>
            <tr>
              <td><code>setCached&lt;T&gt;(key, data, ttl?)</code></td>
              <td>Set cached value with TTL (default: 5 minutes)</td>
            </tr>
            <tr>
              <td><code>clearCached(key)</code></td>
              <td>Remove specific cache entry</td>
            </tr>
            <tr>
              <td><code>clearAllCache()</code></td>
              <td>Remove all cache entries</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Subscriptions */}
      <div className="docs-section">
        <h2 className="docs-section-title">Subscriptions</h2>
        <p>
          Subscribe to state changes and access the full app state:
        </p>
        <CodeBlock code={subscriptionsCode} language="typescript" />

        <h3 className="docs-subsection-title">Methods</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>subscribe(subscriber)</code></td>
              <td>Subscribe to all state changes, returns unsubscribe function</td>
            </tr>
            <tr>
              <td><code>getState()</code></td>
              <td>Get full app state snapshot</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Reset */}
      <div className="docs-section">
        <h2 className="docs-section-title">Reset</h2>
        <p>
          Reset all state to initial values (useful for logout or testing):
        </p>
        <CodeBlock code={resetCode} language="typescript" />
      </div>

      {/* Example Integration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Example: API Integration</h2>
        <p>
          Here's a complete example showing how to integrate StateManager with API calls:
        </p>
        <CodeBlock code={exampleIntegrationCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use singleton instance</strong> - Use <code>stateManager</code> instead of creating new instances</li>
          <li><strong>Descriptive store names</strong> - Use clear names like "currentUser", "productList"</li>
          <li><strong>Set loading states</strong> - Always manage loading before/after async operations</li>
          <li><strong>Handle errors</strong> - Use store.setError() to communicate failures</li>
          <li><strong>Cache expensive operations</strong> - Use cache for API responses and computed data</li>
          <li><strong>Clean up subscriptions</strong> - Always call the returned unsubscribe function</li>
          <li><strong>Use appropriate stores</strong> - EntityStore for singles, CollectionStore for lists</li>
          <li><strong>Reset on logout</strong> - Call reset() when user logs out</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>EntityStore</strong> - Deep dive into entity store API</li>
          <li><strong>CollectionStore</strong> - Managing collections with CRUD operations</li>
          <li><strong>State Hooks</strong> - React hooks for reactive components</li>
        </ul>
      </div>
    </>
  );
}
