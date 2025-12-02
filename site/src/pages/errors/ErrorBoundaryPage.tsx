/**
 * Error Boundary Component Page
 *
 * Documents the LuminoErrorBoundary component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function ErrorBoundaryPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Error Boundary</h1>
      <p className="docs-page-subtitle">
        A React error boundary component that catches JavaScript errors in child
        components and displays a fallback UI.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoErrorBoundary } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>fallback</code>
              </td>
              <td>ReactNode | (error, reset) =&gt; ReactNode</td>
              <td>Default error UI</td>
              <td>Fallback UI to display on error</td>
            </tr>
            <tr>
              <td>
                <code>onError</code>
              </td>
              <td>(error: Error, info: ErrorInfo) =&gt; void</td>
              <td>-</td>
              <td>Callback when error is caught</td>
            </tr>
            <tr>
              <td>
                <code>onReset</code>
              </td>
              <td>() =&gt; void</td>
              <td>-</td>
              <td>Callback when error is reset</td>
            </tr>
            <tr>
              <td>
                <code>resetKeys</code>
              </td>
              <td>any[]</td>
              <td>-</td>
              <td>Keys that trigger reset when changed</td>
            </tr>
            <tr>
              <td>
                <code>showDetails</code>
              </td>
              <td>boolean</td>
              <td>false (prod), true (dev)</td>
              <td>Show error stack trace</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoErrorBoundary } from "lumino/react";

function App() {
  return (
    <LuminoErrorBoundary>
      <MyComponent />
    </LuminoErrorBoundary>
  );
}

// Component that might throw an error
function MyComponent() {
  const [data, setData] = useState(null);

  if (!data) {
    throw new Error("Data not loaded");
  }

  return <div>{data.value}</div>;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom Fallback</h2>
        <pre className="docs-code">{`function ErrorFallback({ error, resetError }) {
  return (
    <div className="error-fallback">
      <LuminoIcon name="alert-triangle" size="xl" color="error" />
      <LuminoHeading level={3}>Something went wrong</LuminoHeading>
      <LuminoText color="muted">{error.message}</LuminoText>
      <LuminoButton onClick={resetError}>
        Try Again
      </LuminoButton>
    </div>
  );
}

function App() {
  return (
    <LuminoErrorBoundary
      fallback={(error, resetError) => (
        <ErrorFallback error={error} resetError={resetError} />
      )}
    >
      <MyComponent />
    </LuminoErrorBoundary>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Error Logging</h2>
        <pre className="docs-code">{`import { logErrorToService } from "./errorService";

function App() {
  const handleError = (error, errorInfo) => {
    // Log to error monitoring service
    logErrorToService({
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    });
  };

  return (
    <LuminoErrorBoundary onError={handleError}>
      <MyComponent />
    </LuminoErrorBoundary>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Reset on Key Change</h2>
        <pre className="docs-code">{`function UserProfile({ userId }) {
  return (
    <LuminoErrorBoundary
      // Reset error boundary when userId changes
      resetKeys={[userId]}
      onReset={() => {
        // Clear any cached state
        queryCache.clear();
      }}
    >
      <UserDetails userId={userId} />
    </LuminoErrorBoundary>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Nested Error Boundaries</h2>
        <pre className="docs-code">{`function App() {
  return (
    // App-level boundary catches everything
    <LuminoErrorBoundary fallback={<AppErrorFallback />}>
      <Header />

      <main>
        {/* Feature-level boundary - isolates failures */}
        <LuminoErrorBoundary fallback={<WidgetErrorFallback />}>
          <DashboardWidget />
        </LuminoErrorBoundary>

        <LuminoErrorBoundary fallback={<WidgetErrorFallback />}>
          <AnalyticsWidget />
        </LuminoErrorBoundary>

        <LuminoErrorBoundary fallback={<WidgetErrorFallback />}>
          <RecentActivityWidget />
        </LuminoErrorBoundary>
      </main>

      <Footer />
    </LuminoErrorBoundary>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Suspense</h2>
        <pre className="docs-code">{`import { Suspense } from "react";

function App() {
  return (
    <LuminoErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LuminoSpinner />}>
        <LazyComponent />
      </Suspense>
    </LuminoErrorBoundary>
  );
}

// Error boundary catches errors from lazy loading
const LazyComponent = React.lazy(() => import("./LazyComponent"));`}</pre>
      </div>

      <div className="docs-section">
        <h2>Show Error Details (Development)</h2>
        <pre className="docs-code">{`// Show full stack trace in development
<LuminoErrorBoundary
  showDetails={process.env.NODE_ENV === "development"}
  fallback={(error, reset) => (
    <div className="dev-error">
      <h3>Error: {error.message}</h3>
      {process.env.NODE_ENV === "development" && (
        <pre className="error-stack">{error.stack}</pre>
      )}
      <button onClick={reset}>Reset</button>
    </div>
  )}
>
  <MyComponent />
</LuminoErrorBoundary>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Error Recovery Strategies</h2>
        <pre className="docs-code">{`function RecoverableComponent() {
  const [retryCount, setRetryCount] = useState(0);

  return (
    <LuminoErrorBoundary
      resetKeys={[retryCount]}
      fallback={(error, reset) => (
        <div className="error-recovery">
          <LuminoText>Failed to load component</LuminoText>
          <LuminoButton
            onClick={() => {
              setRetryCount((c) => c + 1);
              reset();
            }}
          >
            Retry ({3 - retryCount} attempts left)
          </LuminoButton>
        </div>
      )}
      onError={(error) => {
        if (retryCount >= 3) {
          // Report persistent error
          reportCriticalError(error);
        }
      }}
    >
      <UnstableComponent />
    </LuminoErrorBoundary>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Route-Level Error Boundary</h2>
        <pre className="docs-code">{`import { LuminoRouter } from "lumino/react";

function App() {
  return (
    <LuminoRouter>
      <Route
        path="/dashboard"
        element={
          <LuminoErrorBoundary
            fallback={<PageErrorFallback />}
            onReset={() => window.location.reload()}
          >
            <DashboardPage />
          </LuminoErrorBoundary>
        }
      />
      <Route
        path="/settings"
        element={
          <LuminoErrorBoundary fallback={<PageErrorFallback />}>
            <SettingsPage />
          </LuminoErrorBoundary>
        }
      />
    </LuminoRouter>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class DashboardPage extends Page {
  configure() {
    this.setTitle("Dashboard");

    // Wrap widgets in error boundaries
    this.addErrorBoundary()
      .fallback(WidgetErrorFallback)
      .onError((error) => this.logError(error))
      .children(
        this.addComponent(AnalyticsWidget)
          .props({ userId: this.context.userId })
          .endComponent()
      )
      .endErrorBoundary();

    this.addErrorBoundary()
      .fallback(WidgetErrorFallback)
      .children(
        this.addComponent(RecentOrders)
          .dataBind("orders")
          .endComponent()
      )
      .endErrorBoundary();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// Error fallback should be accessible
function AccessibleErrorFallback({ error, resetError }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="error-fallback"
    >
      <LuminoIcon
        name="alert-circle"
        aria-hidden="true"
      />
      <LuminoHeading level={2}>
        An error occurred
      </LuminoHeading>
      <LuminoText>
        {error.message}
      </LuminoText>
      <LuminoButton
        onClick={resetError}
        aria-label="Try loading the content again"
      >
        Try Again
      </LuminoButton>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Granular boundaries</strong> - Wrap individual features to
            prevent cascading failures
          </li>
          <li>
            <strong>Always provide fallback</strong> - Never leave users with a
            blank screen
          </li>
          <li>
            <strong>Log errors</strong> - Send errors to monitoring service for
            debugging
          </li>
          <li>
            <strong>Use resetKeys</strong> - Automatically recover when relevant
            props change
          </li>
          <li>
            <strong>Limit retry attempts</strong> - Prevent infinite retry loops
          </li>
          <li>
            <strong>Test error states</strong> - Verify fallback UI renders
            correctly
          </li>
        </ul>
      </div>
    </div>
  );
}
