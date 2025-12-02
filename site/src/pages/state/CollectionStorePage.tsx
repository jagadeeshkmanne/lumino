/**
 * CollectionStore Page - Managing collections with CRUD operations
 */

import { CodeBlock } from "../../components/CodeBlock";

const importCode = `import { stateManager, CollectionStore } from "lumino/core";

// Via StateManager (recommended)
const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Direct instantiation (for custom use cases)
const customStore = new CollectionStore<User, number>("id");`;

const basicUsageCode = `import { stateManager } from "lumino/core";

interface User {
  id: number;
  name: string;
  email: string;
}

// Create collection store
const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Set all items
usersStore.setAll([
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" }
]);

// Get all items
const users = usersStore.getAll(); // Array of users

// Get single item by ID
const user = usersStore.getById(1); // { id: 1, name: "John Doe", ... }

// Get all IDs
const ids = usersStore.getIds(); // [1, 2, 3]

// Get count
const count = usersStore.count; // 3

// Check loading/error
const loading = usersStore.loading; // false
const error = usersStore.error; // null`;

const upsertCode = `import { stateManager } from "lumino/core";

const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Add new item
usersStore.upsert({ id: 4, name: "Alice Brown", email: "alice@example.com" });

// Update existing item
usersStore.upsert({ id: 1, name: "John Updated", email: "john@example.com" });

// Add or update multiple items
usersStore.upsertMany([
  { id: 5, name: "Charlie", email: "charlie@example.com" },
  { id: 2, name: "Jane Updated", email: "jane@example.com" }
]);

// Note: Upsert checks if ID exists and either adds or updates`;

const removeCode = `import { stateManager } from "lumino/core";

const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Remove single item
usersStore.remove(1);

// Remove multiple items
usersStore.removeMany([2, 3, 4]);

// Clear all items
usersStore.clear();`;

const loadingErrorCode = `import { stateManager } from "lumino/core";

const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Set loading
usersStore.setLoading(true);

try {
  const users = await fetchUsers();

  // setAll automatically clears loading and error
  usersStore.setAll(users);
} catch (err) {
  // setError automatically clears loading
  usersStore.setError(err);
}

// Check states
if (usersStore.loading) {
  console.log("Loading...");
}

if (usersStore.error) {
  console.error("Error:", usersStore.error);
}`;

const subscriptionsCode = `import { stateManager } from "lumino/core";

const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Subscribe to changes (receives array of items)
const unsubscribe = usersStore.subscribe((items, prevItems) => {
  console.log("Current items:", items);
  console.log("Previous items:", prevItems);
  console.log("Count changed from", prevItems.length, "to", items.length);
});

// Trigger change
usersStore.upsert({ id: 1, name: "John", email: "john@example.com" });

// Cleanup
unsubscribe();`;

const normalizedStorageCode = `// CollectionStore uses normalized storage internally
//
// Instead of storing an array:
// [
//   { id: 1, name: "John" },
//   { id: 2, name: "Jane" }
// ]
//
// It stores a normalized structure:
// {
//   items: {
//     1: { id: 1, name: "John" },
//     2: { id: 2, name: "Jane" }
//   },
//   ids: [1, 2]
// }
//
// Benefits:
// - O(1) lookups by ID
// - Efficient updates (no array iteration)
// - Maintains insertion order via ids array`;

const apiIntegrationCode = `import { stateManager } from "lumino/core";
import { apiClient } from "./api";

interface User {
  id: number;
  name: string;
  email: string;
}

// Create store
const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Fetch all users
async function loadUsers() {
  usersStore.setLoading(true);

  try {
    const response = await apiClient.get<User[]>("/users");
    usersStore.setAll(response.data);
  } catch (error) {
    usersStore.setError(error);
  }
}

// Create user
async function createUser(user: Omit<User, "id">) {
  usersStore.setLoading(true);

  try {
    const response = await apiClient.post<User>("/users", user);
    usersStore.upsert(response.data); // Add to collection
  } catch (error) {
    usersStore.setError(error);
  }
}

// Update user
async function updateUser(userId: number, updates: Partial<User>) {
  usersStore.setLoading(true);

  try {
    const response = await apiClient.put<User>(\`/users/\${userId}\`, updates);
    usersStore.upsert(response.data); // Update in collection
  } catch (error) {
    usersStore.setError(error);
  }
}

// Delete user
async function deleteUser(userId: number) {
  usersStore.setLoading(true);

  try {
    await apiClient.delete(\`/users/\${userId}\`);
    usersStore.remove(userId); // Remove from collection
  } catch (error) {
    usersStore.setError(error);
  }
}`;

const reactIntegrationCode = `import { useCollection } from "lumino/react";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const {
    items: users,
    loading,
    error,
    count,
    getById,
    setAll,
    upsert,
    remove,
    clear
  } = useCollection<User, number>({
    name: "users",
    idField: "id"
  });

  const handleCreate = async () => {
    const newUser = await createUserApi({ name: "New User", email: "new@example.com" });
    upsert(newUser);
  };

  const handleUpdate = async (userId: number) => {
    const updated = await updateUserApi(userId, { name: "Updated" });
    upsert(updated);
  };

  const handleDelete = async (userId: number) => {
    await deleteUserApi(userId);
    remove(userId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users ({count})</h2>
      <button onClick={handleCreate}>Add User</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleUpdate(user.id)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`;

const customIdFieldCode = `import { stateManager } from "lumino/core";

// Entity with custom ID field
interface Product {
  productId: string; // Not "id"
  name: string;
  price: number;
}

// Specify custom ID field
const productsStore = stateManager.createCollectionStore<Product, string>(
  "products",
  "productId" // Use "productId" as the ID field
);

// Now works with productId
productsStore.setAll([
  { productId: "PROD-001", name: "Widget", price: 9.99 },
  { productId: "PROD-002", name: "Gadget", price: 19.99 }
]);

const product = productsStore.getById("PROD-001");
productsStore.remove("PROD-002");`;

const masterDetailCode = `import { stateManager } from "lumino/core";

// Collection of all users
const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Selected user (entity store)
const selectedUserStore = stateManager.createEntityStore<User>("selectedUser");

// Load all users
usersStore.setAll(users);

// Select a user from the collection
const selectUser = (userId: number) => {
  const user = usersStore.getById(userId);
  if (user) {
    selectedUserStore.setData(user);
  }
};

// Update selected user
const updateSelected = (updates: Partial<User>) => {
  const current = selectedUserStore.data;
  if (current) {
    const updated = { ...current, ...updates };

    // Update both stores
    selectedUserStore.setData(updated);
    usersStore.upsert(updated);
  }
};`;

const paginationCode = `import { stateManager } from "lumino/core";

interface User {
  id: number;
  name: string;
  email: string;
}

const usersStore = stateManager.createCollectionStore<User, number>("users", "id");

// Load page 1
async function loadPage(page: number, pageSize: number) {
  usersStore.setLoading(true);

  try {
    const response = await apiClient.get(\`/users?page=\${page}&size=\${pageSize}\`);

    if (page === 1) {
      // First page: replace all
      usersStore.setAll(response.data);
    } else {
      // Additional pages: append
      usersStore.upsertMany(response.data);
    }
  } catch (error) {
    usersStore.setError(error);
  }
}

// Load first page
await loadPage(1, 20);

// Load more
await loadPage(2, 20);`;

export function CollectionStorePage() {
  return (
    <>
      <h1 className="docs-page-title">CollectionStore</h1>
      <p className="docs-page-subtitle">
        Store for managing collections with efficient CRUD operations and normalized storage.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>CollectionStore&lt;T, TId&gt;</code> is a specialized store for managing
          collections of entities (like lists of users, products, or tasks). It uses
          normalized storage internally for efficient lookups and updates.
        </p>
        <p>
          CollectionStore is ideal for:
        </p>
        <ul>
          <li>Data tables and lists</li>
          <li>Search results</li>
          <li>Shopping carts</li>
          <li>Todo lists</li>
          <li>Any array of entities with unique IDs</li>
        </ul>
      </div>

      {/* Import */}
      <div className="docs-section">
        <h2 className="docs-section-title">Import</h2>
        <CodeBlock code={importCode} language="typescript" />
        <p>
          <code>T</code> is the entity type, <code>TId</code> is the ID type
          (usually <code>number</code> or <code>string</code>).
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
              <td><code>count</code></td>
              <td><code>number</code></td>
              <td>Number of items in the collection</td>
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
              <td><code>getAll()</code></td>
              <td>Get all items as array</td>
            </tr>
            <tr>
              <td><code>getById(id)</code></td>
              <td>Get item by ID (undefined if not found)</td>
            </tr>
            <tr>
              <td><code>getIds()</code></td>
              <td>Get array of all IDs</td>
            </tr>
            <tr>
              <td><code>setAll(items)</code></td>
              <td>Replace all items, clears loading/error, sets lastUpdated</td>
            </tr>
            <tr>
              <td><code>upsert(item)</code></td>
              <td>Add or update single item</td>
            </tr>
            <tr>
              <td><code>upsertMany(items)</code></td>
              <td>Add or update multiple items</td>
            </tr>
            <tr>
              <td><code>remove(id)</code></td>
              <td>Remove item by ID</td>
            </tr>
            <tr>
              <td><code>removeMany(ids)</code></td>
              <td>Remove multiple items by IDs</td>
            </tr>
            <tr>
              <td><code>setLoading(loading)</code></td>
              <td>Set loading state</td>
            </tr>
            <tr>
              <td><code>setError(error)</code></td>
              <td>Set error, clears loading</td>
            </tr>
            <tr>
              <td><code>clear()</code></td>
              <td>Remove all items and reset state</td>
            </tr>
            <tr>
              <td><code>subscribe(subscriber)</code></td>
              <td>Subscribe to changes, returns unsubscribe function</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Upsert */}
      <div className="docs-section">
        <h2 className="docs-section-title">Adding and Updating (Upsert)</h2>
        <p>
          The <code>upsert</code> method adds new items or updates existing ones
          based on the ID field:
        </p>
        <CodeBlock code={upsertCode} language="typescript" />
      </div>

      {/* Remove */}
      <div className="docs-section">
        <h2 className="docs-section-title">Removing Items</h2>
        <CodeBlock code={removeCode} language="typescript" />
      </div>

      {/* Loading and Error */}
      <div className="docs-section">
        <h2 className="docs-section-title">Loading and Error States</h2>
        <CodeBlock code={loadingErrorCode} language="typescript" />
      </div>

      {/* Subscriptions */}
      <div className="docs-section">
        <h2 className="docs-section-title">Subscriptions</h2>
        <p>
          Subscribe to collection changes for reactive updates:
        </p>
        <CodeBlock code={subscriptionsCode} language="typescript" />
        <p>
          The subscriber receives the full array of items on each change. The
          subscription is triggered for any modification (add, update, remove).
        </p>
      </div>

      {/* Normalized Storage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Normalized Storage</h2>
        <p>
          CollectionStore uses normalized storage internally for efficiency:
        </p>
        <CodeBlock code={normalizedStorageCode} language="typescript" />
      </div>

      {/* API Integration */}
      <div className="docs-section">
        <h2 className="docs-section-title">API Integration Example</h2>
        <p>
          Complete CRUD operations with API integration:
        </p>
        <CodeBlock code={apiIntegrationCode} language="typescript" />
      </div>

      {/* React Integration */}
      <div className="docs-section">
        <h2 className="docs-section-title">React Integration</h2>
        <p>
          Use the <code>useCollection</code> hook for automatic subscriptions:
        </p>
        <CodeBlock code={reactIntegrationCode} language="typescript" />
      </div>

      {/* Custom ID Field */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom ID Field</h2>
        <p>
          By default, CollectionStore uses <code>"id"</code> as the ID field.
          You can specify a different field:
        </p>
        <CodeBlock code={customIdFieldCode} language="typescript" />
      </div>

      {/* Master-Detail Pattern */}
      <div className="docs-section">
        <h2 className="docs-section-title">Master-Detail Pattern</h2>
        <p>
          Combine CollectionStore with EntityStore for master-detail views:
        </p>
        <CodeBlock code={masterDetailCode} language="typescript" />
      </div>

      {/* Pagination */}
      <div className="docs-section">
        <h2 className="docs-section-title">Pagination Example</h2>
        <p>
          Handle paginated API responses:
        </p>
        <CodeBlock code={paginationCode} language="typescript" />
      </div>

      {/* Use Cases */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Use Cases</h2>
        <ul>
          <li><strong>Data Tables</strong> - Store table rows with CRUD operations</li>
          <li><strong>User Lists</strong> - Manage lists of users, employees, contacts</li>
          <li><strong>Product Catalogs</strong> - E-commerce product listings</li>
          <li><strong>Shopping Cart</strong> - Items in cart with add/remove</li>
          <li><strong>Todo Lists</strong> - Tasks with create, update, delete</li>
          <li><strong>Search Results</strong> - Store and update search results</li>
          <li><strong>Real-time Updates</strong> - Update collection from WebSocket events</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use descriptive names</strong> - "users", "products", "tasks"</li>
          <li><strong>Specify ID field</strong> - Explicitly set idField parameter for clarity</li>
          <li><strong>Use upsert for updates</strong> - Prefer upsert over manual array manipulation</li>
          <li><strong>Batch operations</strong> - Use upsertMany/removeMany for multiple items</li>
          <li><strong>Handle loading states</strong> - Always set loading before async operations</li>
          <li><strong>Set errors properly</strong> - Use setError to communicate failures</li>
          <li><strong>Use React hooks</strong> - In React, prefer useCollection over manual subscriptions</li>
          <li><strong>Consider pagination</strong> - Use setAll for first page, upsertMany for subsequent pages</li>
          <li><strong>Type safety</strong> - Always provide generic types (T and TId)</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>State Hooks</strong> - useCollection hook and other React hooks</li>
          <li><strong>EntityStore</strong> - Managing single entities</li>
          <li><strong>StateManager</strong> - Central state manager API</li>
        </ul>
      </div>
    </>
  );
}
