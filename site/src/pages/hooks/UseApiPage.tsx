/**
 * useApi and useMutation Hooks Page - API calls with loading states
 */

import { CodeBlock } from "../../components/CodeBlock";

const useApiBasicCode = `import { useApi } from "lumino/react";
import { UsersApi } from "./api/UsersApi";

function UsersList() {
  const { data: users, loading, error, execute } = useApi(UsersApi.list, {
    immediate: true  // Execute on mount
  });

  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`;

const useApiManualCode = `function UserDetails({ userId }: { userId: number }) {
  const { data: user, loading, execute } = useApi(UsersApi.get);

  useEffect(() => {
    // Execute manually with path params
    execute({ path: { id: userId } });
  }, [userId, execute]);

  if (loading) return <Spinner />;
  return <UserCard user={user} />;
}`;

const useApiOptionsCode = `const { data, loading, error, execute, refetch } = useApi(UsersApi.list, {
  immediate: true,                    // Execute on mount
  initialData: [],                    // Initial data before first load
  showLoader: true,                   // Show global loader
  refetchInterval: 30000,             // Auto-refetch every 30 seconds
  skipCache: false,                   // Use cached response if available
  onSuccess: (data) => {              // Called on success
    console.log("Loaded users:", data);
  },
  onError: (error) => {               // Called on error
    notify.error("Failed to load users");
  }
});`;

const useApiCallOptionsCode = `const { execute } = useApi(UsersApi.get);

// Execute with call options
await execute({
  path: { id: 123 },                  // Path parameters
  query: { include: "orders" },       // Query parameters
  headers: { "X-Custom": "value" },   // Custom headers
  skipCache: true                     // Skip cache for this call
});`;

const useApiRefetchCode = `const { data, loading, execute, refetch, reset } = useApi(UsersApi.list, {
  immediate: true
});

// Refetch with same options
const handleRefresh = async () => {
  await refetch();
};

// Execute with new options
const handleSearch = async (query: string) => {
  await execute({ query: { search: query } });
};

// Reset to initial state
const handleReset = () => {
  reset();
};`;

const useLazyApiCode = `import { useLazyApi } from "lumino/react";

function UserSearch() {
  // Lazy API - only executes when called
  const { data: results, loading, execute } = useLazyApi(UsersApi.search);

  const handleSearch = async (query: string) => {
    await execute({
      query: { q: query }
    });
  };

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      {loading && <Spinner />}
      {results && <ResultsList results={results} />}
    </div>
  );
}`;

const useMutationBasicCode = `import { useMutation } from "lumino/react";
import { UsersApi } from "./api/UsersApi";

function CreateUserForm() {
  const { mutate, loading, error } = useMutation(UsersApi.create, {
    onSuccess: (user) => {
      notify.success(\`Created user: \${user.name}\`);
      navigate(\`/users/\${user.id}\`);
    },
    onError: (error) => {
      notify.error("Failed to create user");
    }
  });

  const handleSubmit = async (values: CreateUserInput) => {
    await mutate(values);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(formValues);
    }}>
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
      {error && <ErrorMessage error={error} />}
    </form>
  );
}`;

const useMutationWithParamsCode = `const { mutate, loading } = useMutation(UsersApi.update);

const handleUpdate = async (userId: number, data: UpdateUserInput) => {
  // Pass variables and call options
  await mutate(data, {
    path: { id: userId }
  });
};`;

const useMutationCallbacksCode = `const { mutate, data, loading, error } = useMutation(UsersApi.create, {
  onSuccess: (user, variables) => {
    console.log("Created:", user);
    console.log("With input:", variables);
    navigate(\`/users/\${user.id}\`);
  },
  onError: (error, variables) => {
    console.error("Failed:", error);
    console.log("Attempted to create:", variables);
  },
  onSettled: (data, error, variables) => {
    console.log("Mutation completed");
    // Always called after success or error
  },
  showLoader: true  // Show global loader
});`;

const useQueriesCode = `import { useQueries } from "lumino/react";

function Dashboard() {
  const { data, loading, errors, refetchAll } = useQueries([
    { api: UsersApi.list },
    { api: OrdersApi.list },
    { api: ProductsApi.list, options: { query: { limit: 10 } } }
  ]);

  const [users, orders, products] = data;

  if (loading) return <Spinner />;

  return (
    <div>
      <button onClick={refetchAll}>Refresh All</button>
      <UsersList users={users} />
      <OrdersList orders={orders} />
      <ProductsList products={products} />
    </div>
  );
}`;

const pollingCode = `// Auto-refresh every 10 seconds
const { data, loading } = useApi(OrdersApi.pending, {
  immediate: true,
  refetchInterval: 10000  // 10 seconds
});

// Stop polling when component unmounts (automatic cleanup)`;

const cacheCode = `// First call - fetches from server
const { data } = useApi(UsersApi.list, {
  immediate: true,
  skipCache: false  // Use cache (default)
});

// Second call - uses cached response
const { data } = useApi(UsersApi.list, {
  immediate: true,
  skipCache: false
});

// Force fresh data
const { data } = useApi(UsersApi.list, {
  immediate: true,
  skipCache: true  // Bypass cache
});`;

const fullExampleCode = `import { useApi, useMutation } from "lumino/react";
import { UsersApi } from "./api/UsersApi";
import { useState } from "react";

function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // List users (auto-fetch on mount)
  const {
    data: users,
    loading: loadingList,
    error: listError,
    refetch
  } = useApi(UsersApi.list, {
    immediate: true,
    onError: (error) => notify.error("Failed to load users")
  });

  // Search users (lazy)
  const {
    data: searchResults,
    loading: searching,
    execute: search
  } = useLazyApi(UsersApi.search);

  // Delete user mutation
  const { mutate: deleteUser, loading: deleting } = useMutation(UsersApi.delete, {
    onSuccess: (_, variables) => {
      notify.success("User deleted");
      refetch(); // Refresh list
    },
    onError: (error) => {
      notify.error(\`Delete failed: \${error.message}\`);
    }
  });

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      await search({ query: { q: query } });
    }
  };

  const handleDelete = async (userId: number) => {
    const confirmed = await confirm("Delete this user?");
    if (confirmed) {
      await deleteUser(null, { path: { id: userId } });
    }
  };

  if (loadingList) return <Spinner />;
  if (listError) return <ErrorDisplay error={listError} />;

  const displayUsers = searchResults || users;

  return (
    <div>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        loading={searching}
      />

      <button onClick={() => refetch()}>Refresh</button>

      <UserTable
        users={displayUsers}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}`;

export function UseApiPage() {
  return (
    <>
      <h1 className="docs-page-title">useApi & useMutation</h1>
      <p className="docs-page-subtitle">
        React hooks for API calls with automatic loading states and error handling.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>useApi()</code> and <code>useMutation()</code> are hooks for making
          API calls with built-in loading state management, error handling, caching,
          and automatic cleanup. Use <code>useApi()</code> for queries (GET) and
          <code>useMutation()</code> for mutations (POST/PUT/DELETE).
        </p>
      </div>

      {/* useApi Basic */}
      <div className="docs-section">
        <h2 className="docs-section-title">useApi - Basic Usage</h2>
        <p>
          Execute API calls automatically on mount:
        </p>
        <CodeBlock code={useApiBasicCode} language="typescript" />
      </div>

      {/* useApi Manual */}
      <div className="docs-section">
        <h2 className="docs-section-title">useApi - Manual Execution</h2>
        <p>
          Execute API calls manually:
        </p>
        <CodeBlock code={useApiManualCode} language="typescript" />
      </div>

      {/* useApi Options */}
      <div className="docs-section">
        <h2 className="docs-section-title">useApi - Options</h2>
        <CodeBlock code={useApiOptionsCode} language="typescript" />
      </div>

      {/* Call Options */}
      <div className="docs-section">
        <h2 className="docs-section-title">Call Options</h2>
        <p>
          Pass path, query, headers, and other options to execute():
        </p>
        <CodeBlock code={useApiCallOptionsCode} language="typescript" />
      </div>

      {/* Refetch */}
      <div className="docs-section">
        <h2 className="docs-section-title">Refetch & Reset</h2>
        <CodeBlock code={useApiRefetchCode} language="typescript" />
      </div>

      {/* useLazyApi */}
      <div className="docs-section">
        <h2 className="docs-section-title">useLazyApi</h2>
        <p>
          For APIs that should only execute when explicitly called:
        </p>
        <CodeBlock code={useLazyApiCode} language="typescript" />
      </div>

      {/* useMutation Basic */}
      <div className="docs-section">
        <h2 className="docs-section-title">useMutation - Basic Usage</h2>
        <p>
          For create, update, and delete operations:
        </p>
        <CodeBlock code={useMutationBasicCode} language="typescript" />
      </div>

      {/* useMutation with Params */}
      <div className="docs-section">
        <h2 className="docs-section-title">useMutation - With Parameters</h2>
        <CodeBlock code={useMutationWithParamsCode} language="typescript" />
      </div>

      {/* Callbacks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Mutation Callbacks</h2>
        <CodeBlock code={useMutationCallbacksCode} language="typescript" />
      </div>

      {/* useQueries */}
      <div className="docs-section">
        <h2 className="docs-section-title">useQueries - Multiple APIs</h2>
        <p>
          Execute multiple API calls in parallel:
        </p>
        <CodeBlock code={useQueriesCode} language="typescript" />
      </div>

      {/* Polling */}
      <div className="docs-section">
        <h2 className="docs-section-title">Polling / Auto-Refresh</h2>
        <CodeBlock code={pollingCode} language="typescript" />
      </div>

      {/* Caching */}
      <div className="docs-section">
        <h2 className="docs-section-title">Caching</h2>
        <CodeBlock code={cacheCode} language="typescript" />
      </div>

      {/* Return Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Return Types</h2>
        <CodeBlock
          code={`// useApi Return Type
interface UseApiReturn<TResponse, TBody> {
  data: TResponse | null;
  loading: boolean;
  error: ErrorResponse | null;
  execute: (options?: CallOptions) => Promise<TResponse | null>;
  reset: () => void;
  refetch: () => Promise<TResponse | null>;
  called: boolean;
}

// useMutation Return Type
interface UseMutationReturn<TResponse, TVariables> {
  data: TResponse | null;
  loading: boolean;
  error: ErrorResponse | null;
  mutate: (variables: TVariables, callOptions?: CallOptions) => Promise<TResponse | null>;
  reset: () => void;
}`}
          language="typescript"
        />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <CodeBlock code={fullExampleCode} language="typescript" />
      </div>

      {/* When to Use What */}
      <div className="docs-section">
        <h2 className="docs-section-title">When to Use What</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Hook</th>
              <th>Use Case</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>useApi</td>
              <td>GET requests, auto-fetch on mount</td>
              <td>Load users list on page load</td>
            </tr>
            <tr>
              <td>useLazyApi</td>
              <td>GET requests, manual trigger</td>
              <td>Search, export, manual refresh</td>
            </tr>
            <tr>
              <td>useMutation</td>
              <td>POST/PUT/DELETE operations</td>
              <td>Create, update, delete user</td>
            </tr>
            <tr>
              <td>useQueries</td>
              <td>Multiple parallel API calls</td>
              <td>Dashboard with multiple data sources</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use immediate: true for lists</strong> - Auto-fetch on mount</li>
          <li><strong>Use useLazyApi for searches</strong> - Only fetch when user searches</li>
          <li><strong>Always handle errors</strong> - Provide onError callback or check error state</li>
          <li><strong>Show loading indicators</strong> - Use loading state for spinners</li>
          <li><strong>Type your responses</strong> - useApi&lt;User[]&gt;(...) for type safety</li>
          <li><strong>Use refetch for refresh</strong> - Maintains previous options</li>
          <li><strong>Reset on unmount if needed</strong> - Clean up state for reusable components</li>
          <li><strong>Cache by default</strong> - Only set skipCache: true when necessary</li>
          <li><strong>Use onSuccess for navigation</strong> - Navigate after successful mutation</li>
          <li><strong>Refetch queries after mutations</strong> - Keep data in sync</li>
        </ul>
      </div>
    </>
  );
}
