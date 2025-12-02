/**
 * State Hooks Page - React hooks for state management
 */

import { CodeBlock } from "../../components/CodeBlock";

const importCode = `import {
  useEntity,
  useCollection,
  useStateSelector,
  useLoading,
  useApiLoading,
  useFormLoading,
  usePageLoading,
  useLocale,
  useTheme,
  useUser,
  useMeta,
} from "lumino/react";`;

const useEntityCode = `import { useEntity } from "lumino/react";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  const {
    data: user,
    loading,
    error,
    setData,
    setLoading,
    setError,
    clear,
    state
  } = useEntity<User>({
    name: "currentUser",
    initialData: null // Optional
  });

  const loadUser = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetchUser(userId);
      setData(response);
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user loaded</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => loadUser(user.id)}>Refresh</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}`;

const useCollectionCode = `import { useCollection } from "lumino/react";

interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductList() {
  const {
    items: products,
    loading,
    error,
    count,
    getById,
    setAll,
    upsert,
    upsertMany,
    remove,
    removeMany,
    setLoading,
    setError,
    clear
  } = useCollection<Product, number>({
    name: "products",
    idField: "id",
    initialItems: [] // Optional
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProducts();
      setAll(response);
    } catch (err) {
      setError(err);
    }
  };

  const handleCreate = async (product: Omit<Product, "id">) => {
    const newProduct = await createProduct(product);
    upsert(newProduct);
  };

  const handleUpdate = async (productId: number, updates: Partial<Product>) => {
    const updated = await updateProduct(productId, updates);
    upsert(updated);
  };

  const handleDelete = async (productId: number) => {
    await deleteProduct(productId);
    remove(productId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Products ({count})</h2>
      <button onClick={loadProducts}>Refresh</button>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>\${product.price}</p>
          <button onClick={() => handleUpdate(product.id, { price: 9.99 })}>
            Update
          </button>
          <button onClick={() => handleDelete(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}`;

const useStateSelectorCode = `import { useStateSelector } from "lumino/react";

function AppHeader() {
  // Select specific slices of app state
  const globalLoading = useStateSelector(state => state.loading.global);
  const locale = useStateSelector(state => state.locale);
  const theme = useStateSelector(state => state.theme);
  const user = useStateSelector(state => state.user);

  return (
    <header>
      {globalLoading && <Spinner />}
      <span>Locale: {locale}</span>
      <span>Theme: {theme}</span>
      {user && <span>User: {user.name}</span>}
    </header>
  );
}`;

const useLoadingCode = `import { useLoading, useApiLoading, useFormLoading, usePageLoading } from "lumino/react";

function LoadingIndicators() {
  // Global loading
  const isLoading = useLoading();

  // API-specific loading
  const isFetchingUsers = useApiLoading("fetchUsers");
  const isFetchingProducts = useApiLoading("fetchProducts");

  // Form-specific loading
  const isFormSubmitting = useFormLoading("employee-form");

  // Page-specific loading
  const isPageLoading = usePageLoading("dashboard");

  return (
    <div>
      {isLoading && <GlobalLoader />}
      {isFetchingUsers && <p>Loading users...</p>}
      {isFetchingProducts && <p>Loading products...</p>}
      {isFormSubmitting && <p>Submitting form...</p>}
      {isPageLoading && <p>Loading page...</p>}
    </div>
  );
}`;

const useLocaleThemeCode = `import { useLocale, useTheme } from "lumino/react";

function SettingsPanel() {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();

  return (
    <div>
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>

      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}`;

const useUserCode = `import { useUser } from "lumino/react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function UserMenu() {
  const [user, setUser] = useUser<User>();

  const handleLogin = async (credentials: LoginCredentials) => {
    const loggedInUser = await loginApi(credentials);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null); // Clear user
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}`;

const useMetaCode = `import { useMeta } from "lumino/react";

function SidebarToggle() {
  const [collapsed, setCollapsed] = useMeta<boolean>("sidebarCollapsed");

  return (
    <button onClick={() => setCollapsed(!collapsed)}>
      {collapsed ? "Expand" : "Collapse"} Sidebar
    </button>
  );
}

function AppPreferences() {
  const [notifications, setNotifications] = useMeta<boolean>("enableNotifications");
  const [autoSave, setAutoSave] = useMeta<boolean>("autoSave");

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={notifications ?? true}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        Enable Notifications
      </label>

      <label>
        <input
          type="checkbox"
          checked={autoSave ?? false}
          onChange={(e) => setAutoSave(e.target.checked)}
        />
        Auto Save
      </label>
    </div>
  );
}`;

const masterDetailCode = `import { useCollection, useEntity } from "lumino/react";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserManagement() {
  // Collection of all users
  const { items: users, loading, upsert, remove } = useCollection<User, number>({
    name: "users",
    idField: "id"
  });

  // Selected user for editing
  const { data: selectedUser, setData } = useEntity<User>({
    name: "selectedUser"
  });

  const handleSelect = (user: User) => {
    setData(user);
  };

  const handleUpdate = async (updates: Partial<User>) => {
    if (selectedUser) {
      const updated = { ...selectedUser, ...updates };
      await updateUserApi(updated.id, updates);

      // Update both stores
      setData(updated);
      upsert(updated);
    }
  };

  const handleDelete = async (userId: number) => {
    await deleteUserApi(userId);
    remove(userId);

    // Clear selection if deleted user was selected
    if (selectedUser?.id === userId) {
      setData(null);
    }
  };

  return (
    <div className="master-detail">
      <div className="master">
        <h2>Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {users.map(user => (
              <li
                key={user.id}
                onClick={() => handleSelect(user)}
                className={selectedUser?.id === user.id ? "selected" : ""}
              >
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detail">
        {selectedUser ? (
          <div>
            <h2>Edit User</h2>
            <input
              value={selectedUser.name}
              onChange={(e) => handleUpdate({ name: e.target.value })}
            />
            <input
              value={selectedUser.email}
              onChange={(e) => handleUpdate({ email: e.target.value })}
            />
            <button onClick={() => handleDelete(selectedUser.id)}>
              Delete
            </button>
          </div>
        ) : (
          <p>Select a user to edit</p>
        )}
      </div>
    </div>
  );
}`;

const optimisticUpdatesCode = `import { useCollection } from "lumino/react";

function TodoList() {
  const { items: todos, upsert, remove } = useCollection<Todo, number>({
    name: "todos",
    idField: "id"
  });

  const handleToggle = async (todo: Todo) => {
    // Optimistic update
    const optimistic = { ...todo, completed: !todo.completed };
    upsert(optimistic);

    try {
      // Send to API
      await updateTodoApi(todo.id, { completed: !todo.completed });
    } catch (error) {
      // Revert on error
      upsert(todo);
      console.error("Failed to update todo:", error);
    }
  };

  const handleDelete = async (todoId: number) => {
    // Find todo before deleting
    const todo = todos.find(t => t.id === todoId);

    // Optimistic delete
    remove(todoId);

    try {
      await deleteTodoApi(todoId);
    } catch (error) {
      // Restore on error
      if (todo) {
        upsert(todo);
      }
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo)}
          />
          {todo.title}
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`;

export function StateHooksPage() {
  return (
    <>
      <h1 className="docs-page-title">State Hooks</h1>
      <p className="docs-page-subtitle">
        React hooks for reactive state management with automatic subscriptions.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Lumino provides a comprehensive set of React hooks for state management.
          These hooks automatically subscribe to state changes and trigger component
          re-renders when data updates. They also handle cleanup on unmount.
        </p>
        <p>
          All hooks are built on top of the core state management system, providing
          a React-friendly API while maintaining UI independence at the core.
        </p>
      </div>

      {/* Import */}
      <div className="docs-section">
        <h2 className="docs-section-title">Import</h2>
        <CodeBlock code={importCode} language="typescript" />
      </div>

      {/* useEntity */}
      <div className="docs-section">
        <h2 className="docs-section-title">useEntity</h2>
        <p>
          Hook for managing single entity state with loading and error handling:
        </p>
        <CodeBlock code={useEntityCode} language="typescript" />

        <h3 className="docs-subsection-title">Options</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>name</code></td>
              <td><code>string</code></td>
              <td>Store name (required)</td>
            </tr>
            <tr>
              <td><code>initialData</code></td>
              <td><code>T</code></td>
              <td>Initial entity data (optional)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="docs-subsection-title">Returns</h3>
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
              <td>Entity data</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td>Loading state</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td><code>any | null</code></td>
              <td>Error object</td>
            </tr>
            <tr>
              <td><code>setData</code></td>
              <td><code>(data: T) =&gt; void</code></td>
              <td>Set entity data</td>
            </tr>
            <tr>
              <td><code>setLoading</code></td>
              <td><code>(loading: boolean) =&gt; void</code></td>
              <td>Set loading state</td>
            </tr>
            <tr>
              <td><code>setError</code></td>
              <td><code>(error: any) =&gt; void</code></td>
              <td>Set error</td>
            </tr>
            <tr>
              <td><code>clear</code></td>
              <td><code>() =&gt; void</code></td>
              <td>Clear all state</td>
            </tr>
            <tr>
              <td><code>state</code></td>
              <td><code>EntityState&lt;T&gt;</code></td>
              <td>Full state object</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* useCollection */}
      <div className="docs-section">
        <h2 className="docs-section-title">useCollection</h2>
        <p>
          Hook for managing collection state with CRUD operations:
        </p>
        <CodeBlock code={useCollectionCode} language="typescript" />

        <h3 className="docs-subsection-title">Options</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>name</code></td>
              <td><code>string</code></td>
              <td>Store name (required)</td>
            </tr>
            <tr>
              <td><code>idField</code></td>
              <td><code>keyof T</code></td>
              <td>ID field name (default: "id")</td>
            </tr>
            <tr>
              <td><code>initialItems</code></td>
              <td><code>T[]</code></td>
              <td>Initial items array (optional)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="docs-subsection-title">Returns</h3>
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
              <td><code>items</code></td>
              <td><code>T[]</code></td>
              <td>Array of items</td>
            </tr>
            <tr>
              <td><code>loading</code></td>
              <td><code>boolean</code></td>
              <td>Loading state</td>
            </tr>
            <tr>
              <td><code>error</code></td>
              <td><code>any | null</code></td>
              <td>Error object</td>
            </tr>
            <tr>
              <td><code>count</code></td>
              <td><code>number</code></td>
              <td>Number of items</td>
            </tr>
            <tr>
              <td><code>getById</code></td>
              <td><code>(id: TId) =&gt; T | undefined</code></td>
              <td>Get item by ID</td>
            </tr>
            <tr>
              <td><code>setAll</code></td>
              <td><code>(items: T[]) =&gt; void</code></td>
              <td>Replace all items</td>
            </tr>
            <tr>
              <td><code>upsert</code></td>
              <td><code>(item: T) =&gt; void</code></td>
              <td>Add or update item</td>
            </tr>
            <tr>
              <td><code>upsertMany</code></td>
              <td><code>(items: T[]) =&gt; void</code></td>
              <td>Add or update multiple items</td>
            </tr>
            <tr>
              <td><code>remove</code></td>
              <td><code>(id: TId) =&gt; void</code></td>
              <td>Remove item by ID</td>
            </tr>
            <tr>
              <td><code>removeMany</code></td>
              <td><code>(ids: TId[]) =&gt; void</code></td>
              <td>Remove multiple items</td>
            </tr>
            <tr>
              <td><code>setLoading</code></td>
              <td><code>(loading: boolean) =&gt; void</code></td>
              <td>Set loading state</td>
            </tr>
            <tr>
              <td><code>setError</code></td>
              <td><code>(error: any) =&gt; void</code></td>
              <td>Set error</td>
            </tr>
            <tr>
              <td><code>clear</code></td>
              <td><code>() =&gt; void</code></td>
              <td>Clear all items</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* useStateSelector */}
      <div className="docs-section">
        <h2 className="docs-section-title">useStateSelector</h2>
        <p>
          Hook for selecting specific slices of app state:
        </p>
        <CodeBlock code={useStateSelectorCode} language="typescript" />
      </div>

      {/* useLoading hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Loading Hooks</h2>
        <p>
          Hooks for different types of loading states:
        </p>
        <CodeBlock code={useLoadingCode} language="typescript" />

        <h3 className="docs-subsection-title">Available Hooks</h3>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Hook</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>useLoading()</code></td>
              <td>Global loading state</td>
            </tr>
            <tr>
              <td><code>useApiLoading(apiId)</code></td>
              <td>API-specific loading state</td>
            </tr>
            <tr>
              <td><code>useFormLoading(formId)</code></td>
              <td>Form-specific loading state</td>
            </tr>
            <tr>
              <td><code>usePageLoading(pageId)</code></td>
              <td>Page-specific loading state</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* useLocale & useTheme */}
      <div className="docs-section">
        <h2 className="docs-section-title">useLocale & useTheme</h2>
        <p>
          Hooks for locale and theme settings:
        </p>
        <CodeBlock code={useLocaleThemeCode} language="typescript" />
      </div>

      {/* useUser */}
      <div className="docs-section">
        <h2 className="docs-section-title">useUser</h2>
        <p>
          Hook for current user state (authentication):
        </p>
        <CodeBlock code={useUserCode} language="typescript" />
      </div>

      {/* useMeta */}
      <div className="docs-section">
        <h2 className="docs-section-title">useMeta</h2>
        <p>
          Hook for arbitrary application state:
        </p>
        <CodeBlock code={useMetaCode} language="typescript" />
      </div>

      {/* Master-Detail Pattern */}
      <div className="docs-section">
        <h2 className="docs-section-title">Pattern: Master-Detail</h2>
        <p>
          Combine useCollection and useEntity for master-detail views:
        </p>
        <CodeBlock code={masterDetailCode} language="typescript" />
      </div>

      {/* Optimistic Updates */}
      <div className="docs-section">
        <h2 className="docs-section-title">Pattern: Optimistic Updates</h2>
        <p>
          Update UI immediately and revert on error:
        </p>
        <CodeBlock code={optimisticUpdatesCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use hooks in components</strong> - Don't use in class components or outside React</li>
          <li><strong>Consistent store names</strong> - Use the same name across components for shared state</li>
          <li><strong>Handle all states</strong> - Always check loading, error, and data states</li>
          <li><strong>Set loading before async</strong> - Call setLoading before API calls</li>
          <li><strong>Clear on unmount</strong> - Consider clearing entity stores when no longer needed</li>
          <li><strong>Optimistic updates</strong> - Update UI immediately, revert on error</li>
          <li><strong>Type safety</strong> - Always provide generic types</li>
          <li><strong>Share stores wisely</strong> - Use same store name for shared state, different names for isolated state</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>StateManager</strong> - Core state manager API</li>
          <li><strong>EntityStore</strong> - Entity store class reference</li>
          <li><strong>CollectionStore</strong> - Collection store class reference</li>
        </ul>
      </div>
    </>
  );
}
