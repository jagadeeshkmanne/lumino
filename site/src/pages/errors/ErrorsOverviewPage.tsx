/**
 * Errors Overview Page
 *
 * Comprehensive documentation for error handling and API loading in Lumino.
 * Shows automatic error handling, loading states, and error pages.
 */

import React, { useState, useCallback } from "react";
import { LiveDemo } from "../../components/LiveDemo";
import {
  LuminoAlert,
  LuminoStackLayout,
  LuminoButton,
  LuminoText,
  LuminoSpinner,
  LuminoErrorPage,
  LuminoCard,
  LuminoH3,
} from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function LoadingStateDemo() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Random success or error
    if (Math.random() > 0.5) {
      setData("Data loaded successfully!");
    } else {
      setError("Failed to load data. Please try again.");
    }
    setLoading(false);
  }, []);

  return (
    <LuminoStackLayout gap={3}>
      <LuminoButton onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Data"}
      </LuminoButton>

      {loading && (
        <LuminoStackLayout gap={2} align="center">
          <LuminoSpinner size="medium" />
          <LuminoText>Loading data...</LuminoText>
        </LuminoStackLayout>
      )}

      {error && (
        <LuminoAlert status="error" closable onClose={() => setError(null)}>
          {error}
        </LuminoAlert>
      )}

      {data && (
        <LuminoAlert status="success">
          {data}
        </LuminoAlert>
      )}
    </LuminoStackLayout>
  );
}

function ErrorPagePreviewDemo() {
  const [errorCode, setErrorCode] = useState<number | null>(null);

  if (errorCode) {
    return (
      <LuminoStackLayout gap={2}>
        <LuminoButton onClick={() => setErrorCode(null)}>
          ← Back to buttons
        </LuminoButton>
        <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
          <LuminoErrorPage
            statusCode={errorCode as any}
            showHome={false}
            showRetry
            onRetry={() => setErrorCode(null)}
          />
        </div>
      </LuminoStackLayout>
    );
  }

  return (
    <LuminoStackLayout gap={2}>
      <LuminoText>Click to preview error pages:</LuminoText>
      <LuminoStackLayout direction="row" gap={2}>
        <LuminoButton onClick={() => setErrorCode(404)}>404 Page</LuminoButton>
        <LuminoButton onClick={() => setErrorCode(401)}>401 Unauthorized</LuminoButton>
        <LuminoButton onClick={() => setErrorCode(403)}>403 Forbidden</LuminoButton>
        <LuminoButton onClick={() => setErrorCode(500)}>500 Server Error</LuminoButton>
      </LuminoStackLayout>
    </LuminoStackLayout>
  );
}

function AutomaticErrorDemo() {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const simulateApiCall = async () => {
    setLoading(true);
    setShowError(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setShowError(true);
  };

  return (
    <LuminoStackLayout gap={3}>
      <LuminoText>
        Lumino automatically handles API errors and shows appropriate feedback:
      </LuminoText>

      <LuminoButton onClick={simulateApiCall} disabled={loading}>
        {loading ? "Calling API..." : "Simulate Failed API Call"}
      </LuminoButton>

      {loading && <LuminoSpinner size="small" />}

      {showError && (
        <LuminoStackLayout gap={2}>
          <LuminoAlert status="error">
            <strong>API Error (422):</strong> Validation failed - Email already exists
          </LuminoAlert>
          <LuminoText variant="secondary">
            This toast/alert appears automatically via ErrorHandlerProvider
          </LuminoText>
        </LuminoStackLayout>
      )}
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const loadingStateCode = `import { useApi } from "lumino/react";
import { UsersApi } from "./api/users";

function UserList() {
  // useApi provides automatic loading and error states
  const { data, loading, error, execute, refetch } = useApi(UsersApi.list, {
    immediate: true, // Fetch on mount
    onError: (error) => console.error("Failed to load users:", error),
  });

  if (loading) {
    return <LuminoSpinner size="large" />;
  }

  if (error) {
    return (
      <LuminoStackLayout gap={2}>
        <LuminoAlert status="error">
          Failed to load users: {error.message}
        </LuminoAlert>
        <LuminoButton onClick={refetch}>Retry</LuminoButton>
      </LuminoStackLayout>
    );
  }

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`;

const errorPageCode = `import { LuminoErrorPage } from "lumino/react";
import { useRouter } from "lumino/react";

// 404 Page
function NotFoundPage() {
  const router = useRouter();

  return (
    <LuminoErrorPage
      statusCode={404}
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      onHome={() => router.navigate("/")}
      showRetry={false}
    />
  );
}

// 500 Error Page
function ServerErrorPage() {
  return (
    <LuminoErrorPage
      statusCode={500}
      title="Server Error"
      message="Something went wrong on our end. Please try again later."
      showRetry
      onRetry={() => window.location.reload()}
      showHome
      onHome={() => window.location.href = "/"}
    />
  );
}`;

const errorHandlerCode = `import { ErrorHandlerProvider, useErrorHandler } from "lumino/core";

// 1. Wrap your app with ErrorHandlerProvider
function App() {
  return (
    <ErrorHandlerProvider
      config={{
        // Minor errors (validation) show as toast
        defaultDisplayMode: "toast",

        // Major errors (401, 403, 404, 500) show as full page
        statusCodeDisplayModes: {
          401: "page", // Unauthorized -> Error Page
          403: "page", // Forbidden -> Error Page
          404: "page", // Not Found -> Error Page
          500: "page", // Server Error -> Error Page
          422: "toast", // Validation Error -> Toast
        },

        toast: {
          duration: 5000,
          position: "bottom-right",
        },
      }}
    >
      <MainApp />
    </ErrorHandlerProvider>
  );
}

// 2. Errors are handled automatically via useApi/useMutation
function CreateUserForm() {
  const { mutate, loading } = useMutation(UsersApi.create, {
    onSuccess: (user) => navigate(\`/users/\${user.id}\`),
    // onError is optional - errors are auto-handled by ErrorHandlerProvider
  });

  const handleSubmit = async (data) => {
    await mutate(data); // If this fails, error appears automatically
  };

  return <form onSubmit={handleSubmit}>...</form>;
}`;

const manualErrorCode = `import { useErrorHandler } from "lumino/core";

function MyComponent() {
  const { handleError, clearPageError, pageError } = useErrorHandler();

  const doSomethingRisky = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      // Manually trigger error handling
      handleError(error);
    }
  };

  // If page error, show error page
  if (pageError) {
    return (
      <LuminoErrorPage
        statusCode={pageError.statusCode || 500}
        message={pageError.message}
        onRetry={clearPageError}
      />
    );
  }

  return <button onClick={doSomethingRisky}>Do Something</button>;
}`;

const globalLoaderCode = `import { useApi, useMutation } from "lumino/react";

// Global loader appears automatically when showLoader: true
const { data, loading } = useApi(UsersApi.list, {
  showLoader: true, // Shows global full-page loader
});

// For mutations, showLoader defaults to true
const { mutate } = useMutation(UsersApi.create, {
  showLoader: true, // Shows loader during mutation
});

// The LuminoProvider handles showing/hiding the global loader
// You just need to configure it:
<LuminoProvider
  config={{
    loader: {
      component: CustomSpinner, // Optional: custom loader component
      delay: 200, // Don't show for fast requests
    },
  }}
>
  <App />
</LuminoProvider>`;

const demoCode = `import { useState, useCallback } from "react";
import { LuminoSpinner, LuminoAlert, LuminoButton, LuminoStackLayout } from "lumino/react";

function LoadingStateDemo() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (Math.random() > 0.5) {
      setData("Data loaded successfully!");
    } else {
      setError("Failed to load data. Please try again.");
    }
    setLoading(false);
  };

  return (
    <LuminoStackLayout gap={3}>
      <LuminoButton onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Fetch Data"}
      </LuminoButton>

      {loading && (
        <LuminoStackLayout gap={2} align="center">
          <LuminoSpinner size="medium" />
          <LuminoText>Loading data...</LuminoText>
        </LuminoStackLayout>
      )}

      {error && <LuminoAlert status="error">{error}</LuminoAlert>}
      {data && <LuminoAlert status="success">{data}</LuminoAlert>}
    </LuminoStackLayout>
  );
}`;

const errorPageDemoCode = `import { LuminoErrorPage, LuminoButton, LuminoStackLayout } from "lumino/react";
import { useState } from "react";

function ErrorPagePreview() {
  const [errorCode, setErrorCode] = useState(null);

  if (errorCode) {
    return (
      <LuminoErrorPage
        statusCode={errorCode}
        onRetry={() => setErrorCode(null)}
        showHome={false}
        showRetry
      />
    );
  }

  return (
    <LuminoStackLayout direction="row" gap={2}>
      <LuminoButton onClick={() => setErrorCode(404)}>404</LuminoButton>
      <LuminoButton onClick={() => setErrorCode(401)}>401</LuminoButton>
      <LuminoButton onClick={() => setErrorCode(500)}>500</LuminoButton>
    </LuminoStackLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function ErrorsOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Error Handling</h1>
      <p className="docs-page-subtitle">
        Lumino provides automatic error handling and loading states for API calls.
        Minor errors show as toasts, major errors (401, 403, 404, 500) show as full pages.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`// Error handling hooks and providers
import { ErrorHandlerProvider, useErrorHandler } from "lumino/core";

// API hooks with automatic loading/error states
import { useApi, useMutation } from "lumino/react";

// Error display components
import { LuminoErrorPage, LuminoErrorBoundary, LuminoAlert } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Quick Start</h2>
        <p>
          Lumino handles errors automatically. Just wrap your app with{" "}
          <code>ErrorHandlerProvider</code> and use <code>useApi</code>/{" "}
          <code>useMutation</code> for API calls:
        </p>
        <pre className="docs-code">{`// 1. Wrap app with ErrorHandlerProvider (in LuminoProvider)
<LuminoProvider>
  <App />
</LuminoProvider>

// 2. Use useApi for GET requests
const { data, loading, error } = useApi(UsersApi.list, { immediate: true });

// 3. Use useMutation for POST/PUT/DELETE
const { mutate, loading } = useMutation(UsersApi.create);

// Errors are automatically displayed as toast or error page!`}</pre>
      </div>

      <div className="docs-section">
        <h2>Loading States Demo</h2>
        <p>
          Click the button to simulate an API call. The loading spinner appears
          automatically, and errors are displayed as alerts:
        </p>
        <LiveDemo
          title="Loading & Error States"
          description="Simulated API call with automatic loading and error handling"
          code={demoCode}
        >
          <LoadingStateDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Error Pages (404, 401, 500, etc.)</h2>
        <p>
          For major HTTP errors, Lumino automatically displays full-page error screens.
          Click to preview different error pages:
        </p>
        <LiveDemo
          title="Error Page Preview"
          description="Click buttons to see different error pages"
          code={errorPageDemoCode}
        >
          <ErrorPagePreviewDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Using useApi for Loading States</h2>
        <p>
          The <code>useApi</code> hook automatically manages loading, error, and data states:
        </p>
        <pre className="docs-code">{loadingStateCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Automatic Error Display Modes</h2>
        <p>
          Lumino routes errors to different display modes based on status code:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Status Code</th>
              <th>Display Mode</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>401</code></td>
              <td>Full Page</td>
              <td>Unauthorized - redirect to login</td>
            </tr>
            <tr>
              <td><code>403</code></td>
              <td>Full Page</td>
              <td>Forbidden - access denied</td>
            </tr>
            <tr>
              <td><code>404</code></td>
              <td>Full Page</td>
              <td>Not Found - resource doesn't exist</td>
            </tr>
            <tr>
              <td><code>500-503</code></td>
              <td>Full Page</td>
              <td>Server Error - something went wrong</td>
            </tr>
            <tr>
              <td><code>400, 422</code></td>
              <td>Toast</td>
              <td>Validation errors - show inline</td>
            </tr>
            <tr>
              <td>Other</td>
              <td>Toast</td>
              <td>Minor errors - non-blocking notification</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>ErrorHandlerProvider Configuration</h2>
        <p>
          Configure how errors are displayed and handled:
        </p>
        <pre className="docs-code">{errorHandlerCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Global Loader for API Calls</h2>
        <p>
          Show a global loading indicator during API calls with <code>showLoader: true</code>:
        </p>
        <pre className="docs-code">{globalLoaderCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Manual Error Handling</h2>
        <p>
          For custom error handling, use the <code>useErrorHandler</code> hook:
        </p>
        <pre className="docs-code">{manualErrorCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom Error Pages</h2>
        <p>
          Create custom error pages for specific status codes:
        </p>
        <pre className="docs-code">{errorPageCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Error Components</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Description</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>LuminoErrorPage</code></td>
              <td>Full-page error display</td>
              <td>404, 401, 403, 500 errors</td>
            </tr>
            <tr>
              <td><code>LuminoErrorBoundary</code></td>
              <td>React error boundary</td>
              <td>Catch JavaScript runtime errors</td>
            </tr>
            <tr>
              <td><code>LuminoAlert</code></td>
              <td>Inline alert banner</td>
              <td>Validation errors, warnings</td>
            </tr>
            <tr>
              <td><code>Toast</code></td>
              <td>Non-blocking notification</td>
              <td>Minor errors, success messages</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Do Users Need Custom Code?</h2>
        <p>
          <strong>For most cases, NO!</strong> Lumino handles errors automatically:
        </p>
        <ul className="docs-list">
          <li>
            <strong>API Loading</strong> - Use <code>useApi</code> hook, get{" "}
            <code>loading</code> state automatically
          </li>
          <li>
            <strong>API Errors</strong> - Errors are auto-routed to toast or error page
          </li>
          <li>
            <strong>Error Pages</strong> - 401/403/404/500 errors show{" "}
            <code>LuminoErrorPage</code> automatically
          </li>
          <li>
            <strong>Global Loader</strong> - Set <code>showLoader: true</code> for
            full-page spinner
          </li>
        </ul>

        <p>
          <strong>Custom code needed only for:</strong>
        </p>
        <ul className="docs-list">
          <li>Custom error page designs</li>
          <li>Special error recovery logic</li>
          <li>Error logging to external services</li>
          <li>Custom toast/notification styling</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use useApi/useMutation</strong> - Don't manually fetch with
            fetch/axios, use Lumino hooks
          </li>
          <li>
            <strong>Wrap features with ErrorBoundary</strong> - Prevent cascading
            failures
          </li>
          <li>
            <strong>Provide retry options</strong> - Let users retry failed operations
          </li>
          <li>
            <strong>Show appropriate detail</strong> - More detail in dev, less in prod
          </li>
          <li>
            <strong>Log errors</strong> - Use onError callback to send to monitoring
          </li>
        </ul>
      </div>
    </div>
  );
}
