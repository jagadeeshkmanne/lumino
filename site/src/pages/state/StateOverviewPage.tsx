/**
 * State Overview Page - Introduction to Lumino State Management
 */

import { CodeBlock } from "../../components/CodeBlock";

const overviewCode = `// State Management Architecture
//
// StateManager (singleton)
//   ├── App State (loading, locale, theme, user, meta)
//   ├── Entity Stores (single entities)
//   ├── Collection Stores (lists/arrays)
//   └── Cache (TTL-based caching)`;

const quickStartCode = `import { stateManager } from "lumino/core";

// Create entity store for a single user
const userStore = stateManager.createEntityStore<User>("currentUser");
userStore.setData({ id: 1, name: "John Doe", email: "john@example.com" });

// Create collection store for a list of users
const usersStore = stateManager.createCollectionStore<User, number>("users", "id");
usersStore.setAll([
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
]);

// Subscribe to changes
userStore.subscribe((state) => {
  console.log("User changed:", state.data);
});

// Global loading state
stateManager.setGlobalLoading(true);
const isLoading = stateManager.isLoading();`;

const reactHooksCode = `import { useEntity, useCollection } from "lumino/react";

function UserProfile() {
  // Hook for single entity
  const { data: user, loading, setData } = useEntity<User>({
    name: "currentUser"
  });

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user</div>;

  return <div>Hello, {user.name}!</div>;
}

function UserList() {
  // Hook for collection
  const { items: users, loading, upsert, remove } = useCollection<User, number>({
    name: "users",
    idField: "id"
  });

  const handleUpdate = (user: User) => {
    upsert(user); // Add or update
  };

  const handleDelete = (userId: number) => {
    remove(userId);
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`;

const loadingStateCode = `import { stateManager } from "lumino/core";

// Global loading (shows page loader)
stateManager.setGlobalLoading(true);

// API-specific loading
stateManager.setApiLoading("fetchUsers", true);
const isFetching = stateManager.isApiLoading("fetchUsers");

// Form-specific loading
stateManager.setFormLoading("employee-form", true);
const isFormLoading = stateManager.isFormLoading("employee-form");

// Page-specific loading
stateManager.setPageLoading("dashboard", true);
const isPageLoading = stateManager.isPageLoading("dashboard");

// Subscribe to loading changes
stateManager.onLoadingChange((loadingState) => {
  console.log("Global:", loadingState.global);
  console.log("APIs:", loadingState.apis);
  console.log("Forms:", loadingState.forms);
});`;

const appStateCode = `import { stateManager } from "lumino/core";

// Locale
stateManager.setLocale("fr");
const locale = stateManager.getLocale(); // "fr"

// Theme
stateManager.setTheme("dark");
const theme = stateManager.getTheme(); // "dark"

// User
stateManager.setUser({ id: 1, name: "John Doe" });
const user = stateManager.getUser();

// Meta (arbitrary app state)
stateManager.setMeta("sidebarCollapsed", true);
const collapsed = stateManager.getMeta<boolean>("sidebarCollapsed");`;

const cacheCode = `import { stateManager } from "lumino/core";

// Cache with 5 minute TTL (default)
stateManager.setCached("users-list", users);

// Cache with custom TTL (10 minutes)
stateManager.setCached("config", config, 10 * 60 * 1000);

// Retrieve from cache
const cachedUsers = stateManager.getCached<User[]>("users-list");

// Clear specific cache entry
stateManager.clearCached("users-list");

// Clear all cache
stateManager.clearAllCache();`;

export function StateOverviewPage() {
  return (
    <>
      <h1 className="docs-page-title">State Management</h1>
      <p className="docs-page-subtitle">
        UI-agnostic state management for entities, collections, and application state.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">What is State Management?</h2>
        <p>
          Lumino provides a <strong>UI-agnostic state management system</strong> that works
          with any UI library (React, Vue, Svelte, etc.). It's designed specifically for
          managing entity data, collections, loading states, and general application state.
        </p>
        <p>
          Unlike general-purpose state managers (Redux, MobX), Lumino's state management
          is purpose-built for <strong>data-driven applications</strong> with entities
          and collections that need to be kept in sync across components.
        </p>
      </div>

      {/* Key Features */}
      <div className="docs-section">
        <h2 className="docs-section-title">Key Features</h2>
        <ul>
          <li><strong>UI-agnostic</strong> - Core state logic works independently of any UI framework</li>
          <li><strong>Entity stores</strong> - Manage single entities with loading/error states</li>
          <li><strong>Collection stores</strong> - Manage lists with efficient updates (normalized storage)</li>
          <li><strong>Type-safe</strong> - Full TypeScript support with generics</li>
          <li><strong>React hooks</strong> - useEntity, useCollection for reactive components</li>
          <li><strong>Loading states</strong> - Built-in support for global, API, form, and page loading</li>
          <li><strong>Subscriptions</strong> - Fine-grained reactivity with selector subscriptions</li>
          <li><strong>Caching</strong> - TTL-based caching for API responses</li>
        </ul>
      </div>

      {/* Architecture */}
      <div className="docs-section">
        <h2 className="docs-section-title">Architecture</h2>
        <p>
          State management is built on a layered architecture:
        </p>
        <CodeBlock code={overviewCode} language="typescript" />
        <ul>
          <li><strong>StateManager</strong> - Singleton managing global app state and store registry</li>
          <li><strong>EntityStore</strong> - Store for single entities (user profile, settings, etc.)</li>
          <li><strong>CollectionStore</strong> - Store for lists (users, products, tasks, etc.)</li>
          <li><strong>Store</strong> - Low-level reactive store with subscriptions</li>
        </ul>
      </div>

      {/* Quick Start */}
      <div className="docs-section">
        <h2 className="docs-section-title">Quick Start</h2>
        <p>
          Here's a quick example showing the basic state management pattern:
        </p>
        <CodeBlock code={quickStartCode} language="typescript" />
      </div>

      {/* React Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">React Hooks</h2>
        <p>
          For React applications, use the provided hooks for automatic subscriptions
          and re-renders:
        </p>
        <CodeBlock code={reactHooksCode} language="typescript" />
        <p>
          The hooks automatically subscribe to store changes and trigger re-renders
          when data updates. They also handle cleanup on unmount.
        </p>
      </div>

      {/* Loading States */}
      <div className="docs-section">
        <h2 className="docs-section-title">Loading States</h2>
        <p>
          StateManager provides built-in loading state management for different
          parts of your application:
        </p>
        <CodeBlock code={loadingStateCode} language="typescript" />
        <p>
          Global loading automatically triggers the <code>ui:loader:show</code> and
          <code>ui:loader:hide</code> events, which the LoadingOverlay component listens to.
        </p>
      </div>

      {/* Application State */}
      <div className="docs-section">
        <h2 className="docs-section-title">Application State</h2>
        <p>
          StateManager manages common application state like locale, theme, and user:
        </p>
        <CodeBlock code={appStateCode} language="typescript" />
      </div>

      {/* Caching */}
      <div className="docs-section">
        <h2 className="docs-section-title">Caching</h2>
        <p>
          Built-in TTL-based caching for API responses and computed values:
        </p>
        <CodeBlock code={cacheCode} language="typescript" />
        <p>
          Cache entries are automatically expired based on their TTL. Expired
          entries return <code>null</code> when retrieved.
        </p>
      </div>

      {/* Use Cases */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Use Cases</h2>
        <ul>
          <li><strong>User profile</strong> - Single entity store for current user</li>
          <li><strong>Data tables</strong> - Collection store for table rows with CRUD operations</li>
          <li><strong>Master-detail</strong> - Entity store for selected item from collection</li>
          <li><strong>Shopping cart</strong> - Collection store for cart items</li>
          <li><strong>Real-time updates</strong> - Subscribe to changes and update UI automatically</li>
          <li><strong>API caching</strong> - Cache expensive API calls with TTL expiration</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use descriptive store names</strong> - "currentUser", "productList", etc.</li>
          <li><strong>Create stores once</strong> - Let StateManager manage store lifecycle</li>
          <li><strong>Use hooks in React</strong> - useEntity/useCollection for automatic subscriptions</li>
          <li><strong>Normalize collections</strong> - CollectionStore uses normalized storage for efficiency</li>
          <li><strong>Handle loading states</strong> - Always set loading before async operations</li>
          <li><strong>Set errors properly</strong> - Use setError to communicate failures to UI</li>
          <li><strong>Clean up subscriptions</strong> - Hooks do this automatically, manual subscriptions need cleanup</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>StateManager</strong> - Complete API reference for StateManager class</li>
          <li><strong>EntityStore</strong> - Managing single entities with loading/error states</li>
          <li><strong>CollectionStore</strong> - Managing lists with CRUD operations</li>
          <li><strong>State Hooks</strong> - React hooks for useEntity, useCollection, and more</li>
        </ul>
      </div>
    </>
  );
}
