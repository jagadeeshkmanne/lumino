/**
 * EntityStore Page - Managing single entities with loading/error states
 */

import { CodeBlock } from "../../components/CodeBlock";

const importCode = `import { stateManager, EntityStore } from "lumino/core";

// Via StateManager (recommended)
const userStore = stateManager.createEntityStore<User>("currentUser");

// Direct instantiation (for custom use cases)
const customStore = new EntityStore<User>();`;

const basicUsageCode = `import { stateManager } from "lumino/core";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Create store
const userStore = stateManager.createEntityStore<User>("currentUser");

// Set data
userStore.setData({
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  role: "admin"
});

// Read data
const user = userStore.data; // { id: 1, name: "John Doe", ... }
const loading = userStore.loading; // false
const error = userStore.error; // null

// Get full state
const state = userStore.getState();
// {
//   data: { id: 1, name: "John Doe", ... },
//   loading: false,
//   error: null,
//   lastUpdated: 1234567890
// }`;

const loadingStateCode = `import { stateManager } from "lumino/core";

const userStore = stateManager.createEntityStore<User>("currentUser");

// Set loading before async operation
userStore.setLoading(true);

try {
  const user = await fetchUser();

  // setData automatically sets loading to false
  userStore.setData(user);
} catch (err) {
  // setError automatically sets loading to false
  userStore.setError(err);
}`;

const errorHandlingCode = `import { stateManager } from "lumino/core";

const userStore = stateManager.createEntityStore<User>("currentUser");

// Set error
userStore.setError(new Error("Failed to fetch user"));

// Check error state
if (userStore.error) {
  console.error("Error:", userStore.error.message);
}

// Clear error by setting new data
userStore.setData(user); // error is automatically cleared`;

const clearCode = `import { stateManager } from "lumino/core";

const userStore = stateManager.createEntityStore<User>("currentUser");

// Clear all state
userStore.clear();

// After clear:
// data: null
// loading: false
// error: null
// lastUpdated: null`;

const subscriptionsCode = `import { stateManager } from "lumino/core";

const userStore = stateManager.createEntityStore<User>("currentUser");

// Subscribe to all state changes
const unsubscribe = userStore.subscribe((state, prevState) => {
  console.log("Current state:", state);
  console.log("Previous state:", prevState);

  if (state.data !== prevState.data) {
    console.log("Data changed:", state.data);
  }
});

// Subscribe to data changes only
const unsubscribeData = userStore.subscribeToData((data, prevData) => {
  console.log("Data changed from", prevData, "to", data);
});

// Cleanup
unsubscribe();
unsubscribeData();`;

const apiIntegrationCode = `import { stateManager } from "lumino/core";
import { apiClient } from "./api";

interface User {
  id: number;
  name: string;
  email: string;
}

// Create store
const userStore = stateManager.createEntityStore<User>("currentUser");

// Fetch and store user
async function loadUser(userId: number) {
  // Set loading
  userStore.setLoading(true);

  try {
    const response = await apiClient.get<User>(\`/users/\${userId}\`);
    userStore.setData(response.data);
  } catch (error) {
    userStore.setError(error);
  }
}

// Update user
async function updateUser(userId: number, updates: Partial<User>) {
  userStore.setLoading(true);

  try {
    const response = await apiClient.put<User>(\`/users/\${userId}\`, updates);
    userStore.setData(response.data);
  } catch (error) {
    userStore.setError(error);
  }
}

// Usage
await loadUser(1);
const user = userStore.data; // User data
const isLoading = userStore.loading; // false
const error = userStore.error; // null`;

const reactIntegrationCode = `import { useEntity } from "lumino/react";

function UserProfile() {
  const { data: user, loading, error, setData } = useEntity<User>({
    name: "currentUser"
  });

  if (loading) {
    return <div>Loading user...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  const handleUpdate = async () => {
    const updated = await updateUserApi(user.id, { name: "New Name" });
    setData(updated);
  };

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}`;

const multipleStoresCode = `import { stateManager } from "lumino/core";

// Different entity stores for different purposes
const currentUserStore = stateManager.createEntityStore<User>("currentUser");
const selectedUserStore = stateManager.createEntityStore<User>("selectedUser");
const userSettingsStore = stateManager.createEntityStore<Settings>("userSettings");
const appConfigStore = stateManager.createEntityStore<Config>("appConfig");

// Each store maintains independent state
currentUserStore.setData(currentUser);
selectedUserStore.setData(selectedUser);
userSettingsStore.setData(settings);
appConfigStore.setData(config);`;

const lastUpdatedCode = `import { stateManager } from "lumino/core";

const userStore = stateManager.createEntityStore<User>("currentUser");

// Set data
userStore.setData(user);

// Check when data was last updated
const state = userStore.getState();
const timestamp = state.lastUpdated; // Unix timestamp in milliseconds

// Calculate age
const ageInSeconds = (Date.now() - timestamp) / 1000;
console.log(\`Data is \${ageInSeconds} seconds old\`);

// Determine if refresh is needed
const FIVE_MINUTES = 5 * 60 * 1000;
const needsRefresh = !timestamp || (Date.now() - timestamp) > FIVE_MINUTES;`;

export function EntityStorePage() {
  return (
    <>
      <h1 className="docs-page-title">EntityStore</h1>
      <p className="docs-page-subtitle">
        Store for managing single entities with loading and error states.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>EntityStore&lt;T&gt;</code> is a specialized store for managing a single entity
          (like a user profile, settings object, or selected item). It automatically tracks
          loading state, error state, and the last update timestamp.
        </p>
        <p>
          EntityStore is ideal for:
        </p>
        <ul>
          <li>Current user profile</li>
          <li>Application settings</li>
          <li>Selected item from a list (master-detail pattern)</li>
          <li>Detail views</li>
          <li>Singleton data that needs loading/error states</li>
        </ul>
      </div>

      {/* Import */}
      <div className="docs-section">
        <h2 className="docs-section-title">Import</h2>
        <CodeBlock code={importCode} language="typescript" />
        <p>
          Use <code>stateManager.createEntityStore()</code> to let StateManager manage
          the store lifecycle. Direct instantiation is useful for custom, isolated stores.
        </p>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Properties */}
      <div className="docs-section">
        <h2 className="docs-section-title">Properties</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>data</code></td>
              <td><code>T | null</code></td>
              <td>The entity data (null if not set)</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td>Loading state (true during async operations)</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td><code>any | null</code></td>
              <td>Error object (null if no error)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">Methods</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>getState()</code></td>
              <td>Get full state object (data, loading, error, lastUpdated)</td>
            </tr>
            <tr>
              <td><code>setData(data: T)</code></td>
              <td>Set entity data, clears loading and error, sets lastUpdated</td>
            </tr>
            <tr>
              <td><code>setLoading(loading: boolean)</code></td>
              <td>Set loading state</td>
            </tr>
            <tr>
              <td><code>setError(error: any)</code></td>
              <td>Set error, clears loading</td>
            </tr>
            <tr>
              <td><code>clear()</code></td>
              <td>Reset all state to initial values</td>
            </tr>
            <tr>
              <td><code>subscribe(subscriber)</code></td>
              <td>Subscribe to all state changes, returns unsubscribe function</td>
            </tr>
            <tr>
              <td><code>subscribeToData(subscriber)</code></td>
              <td>Subscribe to data changes only, returns unsubscribe function</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Loading State */}
      <div className="docs-section">
        <h2 className="docs-section-title">Loading State</h2>
        <p>
          EntityStore automatically manages loading state during async operations:
        </p>
        <CodeBlock code={loadingStateCode} language="typescript" />
        <p>
          Note that both <code>setData()</code> and <code>setError()</code> automatically
          set <code>loading</code> to <code>false</code>.
        </p>
      </div>

      {/* Error Handling */}
      <div className="docs-section">
        <h2 className="docs-section-title">Error Handling</h2>
        <CodeBlock code={errorHandlingCode} language="typescript" />
        <p>
          When you call <code>setData()</code>, the error is automatically cleared.
          This makes it easy to show error states in your UI.
        </p>
      </div>

      {/* Clear */}
      <div className="docs-section">
        <h2 className="docs-section-title">Clearing State</h2>
        <CodeBlock code={clearCode} language="typescript" />
      </div>

      {/* Subscriptions */}
      <div className="docs-section">
        <h2 className="docs-section-title">Subscriptions</h2>
        <p>
          Subscribe to changes for reactive updates:
        </p>
        <CodeBlock code={subscriptionsCode} language="typescript" />
        <p>
          <code>subscribeToData()</code> only notifies when the data property changes,
          ignoring changes to loading/error. This is useful for components that only
          care about data updates.
        </p>
      </div>

      {/* API Integration */}
      <div className="docs-section">
        <h2 className="docs-section-title">API Integration Example</h2>
        <p>
          Complete example showing API integration with error handling:
        </p>
        <CodeBlock code={apiIntegrationCode} language="typescript" />
      </div>

      {/* React Integration */}
      <div className="docs-section">
        <h2 className="docs-section-title">React Integration</h2>
        <p>
          Use the <code>useEntity</code> hook for automatic subscriptions and re-renders:
        </p>
        <CodeBlock code={reactIntegrationCode} language="typescript" />
        <p>
          The hook automatically subscribes to store changes and triggers component
          re-renders. It also handles cleanup on unmount.
        </p>
      </div>

      {/* Multiple Stores */}
      <div className="docs-section">
        <h2 className="docs-section-title">Multiple Entity Stores</h2>
        <p>
          You can create multiple entity stores for different purposes:
        </p>
        <CodeBlock code={multipleStoresCode} language="typescript" />
      </div>

      {/* Last Updated */}
      <div className="docs-section">
        <h2 className="docs-section-title">Last Updated Timestamp</h2>
        <p>
          EntityStore tracks when data was last updated using a Unix timestamp:
        </p>
        <CodeBlock code={lastUpdatedCode} language="typescript" />
        <p>
          Use <code>lastUpdated</code> to implement cache invalidation, stale data
          indicators, or automatic refresh logic.
        </p>
      </div>

      {/* State Interface */}
      <div className="docs-section">
        <h2 className="docs-section-title">EntityState Interface</h2>
        <pre className="docs-code">
{`interface EntityState<T> {
  data: T | null;
  loading: boolean;
  error: any | null;
  lastUpdated: number | null;
}`}
        </pre>
      </div>

      {/* Use Cases */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Use Cases</h2>
        <ul>
          <li><strong>User Profile</strong> - Current logged-in user data</li>
          <li><strong>Settings</strong> - Application or user preferences</li>
          <li><strong>Selected Item</strong> - Item selected from a list (master-detail)</li>
          <li><strong>Detail View</strong> - Full details of an entity being viewed/edited</li>
          <li><strong>Singleton Data</strong> - Any data where only one instance exists at a time</li>
          <li><strong>Form Entity</strong> - Entity being edited in a form</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use descriptive names</strong> - "currentUser", "selectedProduct", "userSettings"</li>
          <li><strong>Always set loading</strong> - Set loading before async operations</li>
          <li><strong>Handle errors</strong> - Use setError() to communicate failures</li>
          <li><strong>Clear when done</strong> - Call clear() when entity is no longer needed</li>
          <li><strong>Subscribe carefully</strong> - Remember to unsubscribe to prevent memory leaks</li>
          <li><strong>Use React hooks</strong> - In React, prefer useEntity over manual subscriptions</li>
          <li><strong>Check lastUpdated</strong> - Use timestamp for cache invalidation logic</li>
          <li><strong>Type safety</strong> - Always provide generic type for type safety</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>CollectionStore</strong> - Managing lists of entities</li>
          <li><strong>State Hooks</strong> - useEntity hook and other React hooks</li>
          <li><strong>StateManager</strong> - Central state manager API</li>
        </ul>
      </div>
    </>
  );
}
