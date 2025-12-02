/**
 * Loading Components Overview Page
 *
 * Documents loading and skeleton components in Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function LoadingOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Loading Components</h1>
      <p className="docs-page-subtitle">
        Components for displaying loading states, spinners, skeletons, and
        progress indicators to improve perceived performance.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Available Components</h2>
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
              <td>
                <code>LuminoSpinner</code>
              </td>
              <td>Animated spinner</td>
              <td>Quick loading states, buttons</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSkeleton</code>
              </td>
              <td>Content placeholder</td>
              <td>Page/component loading previews</td>
            </tr>
            <tr>
              <td>
                <code>LuminoLoadingOverlay</code>
              </td>
              <td>Overlay with spinner</td>
              <td>Form submissions, blocking operations</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSuspense</code>
              </td>
              <td>React Suspense wrapper</td>
              <td>Lazy-loaded components</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import {
  LuminoSpinner,
  LuminoSkeleton,
  LuminoLoadingOverlay,
  LuminoSuspense,
} from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Spinner</h2>
        <pre className="docs-code">{`// Basic spinner
<LuminoSpinner />

// Sizes
<LuminoSpinner size="sm" />  {/* 16px */}
<LuminoSpinner size="md" />  {/* 24px */}
<LuminoSpinner size="lg" />  {/* 32px */}
<LuminoSpinner size={48} />  {/* Custom size */}

// Colors
<LuminoSpinner color="primary" />
<LuminoSpinner color="secondary" />
<LuminoSpinner color="white" />

// With label
<LuminoSpinner label="Loading..." />

// Centered
<LuminoSpinner centered />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Skeleton</h2>
        <pre className="docs-code">{`// Basic shapes
<LuminoSkeleton variant="text" />
<LuminoSkeleton variant="circular" width={40} height={40} />
<LuminoSkeleton variant="rectangular" width={200} height={100} />

// Text lines
<LuminoSkeleton variant="text" lines={3} />

// With animation
<LuminoSkeleton animation="pulse" />
<LuminoSkeleton animation="wave" />
<LuminoSkeleton animation={false} />

// Card skeleton
function CardSkeleton() {
  return (
    <LuminoCard>
      <LuminoSkeleton variant="rectangular" height={200} />
      <div style={{ padding: 16 }}>
        <LuminoSkeleton variant="text" width="60%" />
        <LuminoSkeleton variant="text" lines={2} />
        <LuminoSkeleton variant="text" width="40%" />
      </div>
    </LuminoCard>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Loading Overlay</h2>
        <pre className="docs-code">{`function FormWithOverlay() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await submitForm();
    setLoading(false);
  };

  return (
    <LuminoLoadingOverlay loading={loading}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <LuminoButton type="submit">Submit</LuminoButton>
      </form>
    </LuminoLoadingOverlay>
  );
}

// With custom spinner
<LuminoLoadingOverlay
  loading={loading}
  spinner={<LuminoSpinner size="lg" color="primary" />}
  text="Processing..."
>
  {/* Content */}
</LuminoLoadingOverlay>

// Blur background
<LuminoLoadingOverlay loading={loading} blur>
  {/* Content */}
</LuminoLoadingOverlay>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Suspense Wrapper</h2>
        <pre className="docs-code">{`// Lazy-loaded component
const LazyComponent = React.lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <LuminoSuspense fallback={<PageSkeleton />}>
      <LazyComponent />
    </LuminoSuspense>
  );
}

// With default skeleton
<LuminoSuspense>
  <LazyComponent />
</LuminoSuspense>

// Custom fallback
<LuminoSuspense fallback={<CustomLoader />}>
  <LazyComponent />
</LuminoSuspense>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Loading Patterns</h2>

        <h3>Data Fetching</h3>
        <pre className="docs-code">{`function UserList() {
  const { data, loading, error } = useQuery("users");

  if (loading) {
    return (
      <div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="user-row">
            <LuminoSkeleton variant="circular" width={40} height={40} />
            <div className="user-info">
              <LuminoSkeleton variant="text" width={120} />
              <LuminoSkeleton variant="text" width={180} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      {data.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  );
}`}</pre>

        <h3>Button Loading</h3>
        <pre className="docs-code">{`function SubmitButton() {
  const [loading, setLoading] = useState(false);

  return (
    <LuminoButton
      onClick={handleSubmit}
      loading={loading}
      disabled={loading}
    >
      {loading ? "Saving..." : "Save"}
    </LuminoButton>
  );
}`}</pre>

        <h3>Inline Loading</h3>
        <pre className="docs-code">{`function InlineLoader({ loading, children }) {
  return (
    <span className="inline-loader">
      {children}
      {loading && <LuminoSpinner size="sm" className="ml-2" />}
    </span>
  );
}

// Usage
<InlineLoader loading={isSaving}>
  Saving changes
</InlineLoader>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Skeleton</h2>
        <pre className="docs-code">{`function PageSkeleton() {
  return (
    <div className="page-skeleton">
      {/* Header */}
      <LuminoSkeleton variant="text" width="30%" height={32} />
      <LuminoSkeleton variant="text" width="60%" />

      {/* Content grid */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <LuminoCard key={i}>
            <LuminoSkeleton variant="rectangular" height={120} />
            <div className="p-4">
              <LuminoSkeleton variant="text" />
              <LuminoSkeleton variant="text" width="70%" />
            </div>
          </LuminoCard>
        ))}
      </div>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class UserListPage extends Page {
  configure() {
    this.setTitle("Users");

    // Show skeleton while loading
    this.setLoadingComponent(() => (
      <TableSkeleton rows={10} columns={5} />
    ));

    // Page content
    this.addComponent(LuminoTable)
      .props({
        columns: userColumns,
      })
      .dataBind("users")
      .loading(() => this.state.isLoading)
      .endComponent();
  }

  async onMount() {
    this.setState({ isLoading: true });
    const users = await this.api.getUsers();
    this.setState({ users, isLoading: false });
  }
}

// Button with loading state
this.addButton("Save")
  .onClick(async () => {
    this.setButtonLoading("save", true);
    await this.save();
    this.setButtonLoading("save", false);
  })
  .loading(() => this.state.buttonLoading.save)
.endButton();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Show progress early</strong> - Display loading state
            immediately when action starts
          </li>
          <li>
            <strong>Use skeletons for layout</strong> - Match skeleton to actual
            content structure
          </li>
          <li>
            <strong>Provide context</strong> - Use labels to explain what's
            loading
          </li>
          <li>
            <strong>Avoid loading flicker</strong> - Don't show spinner for
            fast operations (&lt;200ms)
          </li>
          <li>
            <strong>Block duplicate actions</strong> - Disable buttons while
            loading
          </li>
        </ul>
      </div>
    </div>
  );
}
