/**
 * Hooks Overview Page - Introduction to Lumino React Hooks
 */

import { CodeBlock } from "../../components/CodeBlock";

const overviewCode = `// React Hooks Architecture
//
// Lumino Hooks
//   ├── useLumino - Main framework hook (all-in-one)
//   ├── useForm - Form state management
//   ├── usePage - Page lifecycle and mode management
//   ├── useApi / useMutation - API calls with loading states
//   ├── useEntity / useCollection - State store subscriptions
//   ├── useNavigation - Routing and navigation
//   ├── useEvents - Event bus subscriptions
//   └── Convenience hooks (useNotify, useI18n, etc.)`;

const quickStartCode = `import { useLumino, useForm } from "lumino/react";
import { EmployeeForm } from "./EmployeeForm";

function EmployeePage() {
  // Main framework hook - provides everything
  const {
    navigate,
    notify,
    loading,
    user,
    locale,
    setLocale
  } = useLumino();

  // Form hook - binds form to React state
  const form = useForm(new EmployeeForm());

  const handleSave = async () => {
    if (await form.validate()) {
      notify.success("Employee saved!");
      navigate("/employees");
    }
  };

  return (
    <div>
      <FormRenderer form={form} />
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}`;

const formHooksCode = `import { useForm, useFormData } from "lumino/react";

// useForm - Complete form state management
const {
  values,          // Current form values
  errors,          // Validation errors
  dirty,           // Has form been modified?
  setValue,        // Update a field value
  validate,        // Run validation
  executeAction,   // Execute form action
  formContext      // Full FormContext for child components
} = useForm(form);

// useFormData - Subscribe to form data changes (read-only)
const formData = useFormData<Employee>("employee-form");
// Updates automatically when any field changes`;

const apiHooksCode = `import { useApi, useMutation } from "lumino/react";

// useApi - For GET requests
const { data: users, loading, execute } = useApi(UsersApi.list, {
  immediate: true  // Execute on mount
});

// useMutation - For POST/PUT/DELETE
const { mutate, loading } = useMutation(UsersApi.create, {
  onSuccess: (user) => {
    notify.success(\`Created user: \${user.name}\`);
    navigate(\`/users/\${user.id}\`);
  }
});

await mutate({ name: "John", email: "john@example.com" });`;

const stateHooksCode = `import {
  useEntity,
  useCollection,
  useLoading,
  useLocale,
  useTheme,
  useUser
} from "lumino/react";

// Entity store (single item)
const { data: user, setData } = useEntity<User>({
  name: "currentUser"
});

// Collection store (list)
const { items: products, upsert, remove } = useCollection<Product>({
  name: "products",
  idField: "id"
});

// App state
const loading = useLoading();
const [locale, setLocale] = useLocale();
const [theme, setTheme] = useTheme();
const [user, setUser] = useUser();`;

const eventHooksCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

function Dashboard() {
  const { on, emit } = useEvents();

  useEffect(() => {
    // Subscribe to form submit events
    const unsubscribe = on("form:submit", ({ formId, action, values }) => {
      console.log(\`Form \${formId} submitted:\`, values);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [on]);

  const handleRefresh = () => {
    emit("dashboard:refresh", { timestamp: Date.now() });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}`;

export function HooksOverviewPage() {
  return (
    <>
      <h1 className="docs-page-title">React Hooks</h1>
      <p className="docs-page-subtitle">
        Type-safe React hooks for forms, state, API calls, and framework features.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">What are Lumino Hooks?</h2>
        <p>
          Lumino provides a comprehensive set of <strong>React hooks</strong> that bind
          the framework's core features to React's component lifecycle and state management.
          These hooks follow React best practices and are fully type-safe with TypeScript.
        </p>
        <p>
          The hooks are organized by feature area: form management, page lifecycle,
          API calls, state subscriptions, navigation, and events. Most applications
          will primarily use <code>useLumino()</code> and <code>useForm()</code>.
        </p>
      </div>

      {/* Key Features */}
      <div className="docs-section">
        <h2 className="docs-section-title">Key Features</h2>
        <ul>
          <li><strong>Type-safe</strong> - Full TypeScript support with generics</li>
          <li><strong>Reactive</strong> - Automatic re-renders when state changes</li>
          <li><strong>Composable</strong> - Mix and match hooks as needed</li>
          <li><strong>Automatic cleanup</strong> - Subscriptions cleaned up on unmount</li>
          <li><strong>Consistent API</strong> - Similar patterns across all hooks</li>
          <li><strong>Performance</strong> - Optimized with memoization and selective updates</li>
        </ul>
      </div>

      {/* Architecture */}
      <div className="docs-section">
        <h2 className="docs-section-title">Hook Architecture</h2>
        <CodeBlock code={overviewCode} language="typescript" />
        <ul>
          <li><strong>useLumino</strong> - Main hook providing access to all framework features</li>
          <li><strong>useForm</strong> - Binds Form class to React state with validation</li>
          <li><strong>usePage</strong> - Manages page modes and entity loading</li>
          <li><strong>useApi/useMutation</strong> - API calls with loading/error states</li>
          <li><strong>useEntity/useCollection</strong> - State store subscriptions</li>
          <li><strong>useNavigation</strong> - Routing and programmatic navigation</li>
          <li><strong>useEvents</strong> - Event bus subscriptions and emissions</li>
        </ul>
      </div>

      {/* Quick Start */}
      <div className="docs-section">
        <h2 className="docs-section-title">Quick Start</h2>
        <p>
          Here's a basic example using the most common hooks:
        </p>
        <CodeBlock code={quickStartCode} language="typescript" />
      </div>

      {/* Form Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Hooks</h2>
        <p>
          Form hooks bind Form classes to React state and provide validation,
          field management, and action execution:
        </p>
        <CodeBlock code={formHooksCode} language="typescript" />
      </div>

      {/* API Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">API Hooks</h2>
        <p>
          API hooks handle loading states, error handling, and automatic retries:
        </p>
        <CodeBlock code={apiHooksCode} language="typescript" />
      </div>

      {/* State Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">State Hooks</h2>
        <p>
          State hooks subscribe to StateManager stores and app state:
        </p>
        <CodeBlock code={stateHooksCode} language="typescript" />
      </div>

      {/* Event Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Event Hooks</h2>
        <p>
          Event hooks provide type-safe access to the event bus:
        </p>
        <CodeBlock code={eventHooksCode} language="typescript" />
      </div>

      {/* Hook Categories */}
      <div className="docs-section">
        <h2 className="docs-section-title">Hook Categories</h2>

        <h3>Core Hooks</h3>
        <ul>
          <li><strong>useLumino</strong> - All-in-one hook for framework features</li>
          <li><strong>useForm</strong> - Form state and validation</li>
          <li><strong>usePage</strong> - Page lifecycle and modes</li>
        </ul>

        <h3>Data Hooks</h3>
        <ul>
          <li><strong>useApi</strong> - API calls with loading states</li>
          <li><strong>useMutation</strong> - Mutations (POST/PUT/DELETE)</li>
          <li><strong>useEntity</strong> - Single entity subscriptions</li>
          <li><strong>useCollection</strong> - Collection subscriptions</li>
          <li><strong>useFormData</strong> - Real-time form data</li>
        </ul>

        <h3>Navigation Hooks</h3>
        <ul>
          <li><strong>useNavigation</strong> - Navigate, back, redirect</li>
          <li><strong>useNavigationGuard</strong> - Prevent navigation when dirty</li>
        </ul>

        <h3>Utility Hooks</h3>
        <ul>
          <li><strong>useEvents</strong> - Event subscriptions</li>
          <li><strong>useNotify</strong> - Notifications (success, error, etc.)</li>
          <li><strong>useI18n</strong> - Translations and locale</li>
          <li><strong>useLoading</strong> - Global loading state</li>
          <li><strong>useTheme</strong> - Theme management</li>
          <li><strong>useUser</strong> - Current user</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use useLumino for convenience</strong> - It provides most common features</li>
          <li><strong>Destructure what you need</strong> - Don't use the entire object if not needed</li>
          <li><strong>Memoize callbacks</strong> - Use useCallback for event handlers</li>
          <li><strong>Clean up subscriptions</strong> - Return cleanup functions from useEffect</li>
          <li><strong>Handle loading states</strong> - Always show loading indicators</li>
          <li><strong>Type your entities</strong> - Use generics for type safety</li>
          <li><strong>Use specialized hooks</strong> - useApi for queries, useMutation for mutations</li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>useLumino</strong> - Main framework hook with all features</li>
          <li><strong>useForm</strong> - Form state management and validation</li>
          <li><strong>usePage</strong> - Page lifecycle and mode management</li>
          <li><strong>useApi</strong> - API calls with loading states</li>
          <li><strong>useFormData</strong> - Real-time form data subscriptions</li>
          <li><strong>useNavigation</strong> - Routing and navigation</li>
          <li><strong>useEvents</strong> - Event bus subscriptions</li>
        </ul>
      </div>
    </>
  );
}
