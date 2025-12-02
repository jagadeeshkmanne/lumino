/**
 * usePage Hook Page - Page lifecycle and mode management
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicUsageCode = `import { usePage } from "lumino/react";
import { EmployeePage } from "./EmployeePage";

function EmployeePageComponent() {
  const page = usePage(new EmployeePage());

  const { mode, entity, loading, error } = page;

  if (loading) return <Spinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div>
      <h1>{mode === "create" ? "New" : "Edit"} Employee</h1>
      <PageRenderer page={page} />
    </div>
  );
}`;

const withRouteParamsCode = `import { usePage } from "lumino/react";
import { useParams, useSearchParams } from "react-router-dom";

function EmployeePageComponent() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const page = usePage(new EmployeePage(), {
    routeParams: { id },
    queryParams: Object.fromEntries(searchParams)
  });

  return <PageRenderer page={page} />;
}`;

const modeManagementCode = `const page = usePage(new EmployeePage());

// Current mode (determined by page logic)
console.log(page.mode); // "create" | "edit" | "view"

// Change mode programmatically
page.setMode("edit");

// Mode changes trigger mode handlers
// defined in the Page class`;

const entityManagementCode = `const page = usePage(new EmployeePage());

// Current entity (loaded by mode handler)
const employee = page.entity;

// Set entity manually
page.setEntity({
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com"
});

// Access in child components via pageContext
const employee = page.pageContext.getEntity<Employee>();`;

const loadingStateCode = `const page = usePage(new EmployeePage());

// Loading state (managed by page lifecycle)
if (page.loading) {
  return <Spinner />;
}

// Set loading manually
page.setLoading(true);
try {
  await someAsyncOperation();
} finally {
  page.setLoading(false);
}`;

const errorHandlingCode = `const page = usePage(new EmployeePage());

// Error state
if (page.error) {
  return (
    <ErrorDisplay
      error={page.error}
      onRetry={() => page.refresh()}
    />
  );
}

// Set error manually
page.setError(new Error("Failed to load employee"));`;

const metaDataCode = `const page = usePage(new EmployeePage());

// Set meta data
page.setMeta("lastSaved", new Date());
page.setMeta("isDirty", true);
page.setMeta("permissions", ["read", "write"]);

// Get meta data
const lastSaved = page.getMeta<Date>("lastSaved");
const isDirty = page.getMeta<boolean>("isDirty");
const permissions = page.getMeta<string[]>("permissions");`;

const formsAccessCode = `const page = usePage(new EmployeePage());

// Access forms defined in the page
const employeeForm = page.getForm<Employee>("employee-form");
const addressForm = page.getForm<Address>("address-form");

// Check if form is dirty
if (employeeForm?.dirty || addressForm?.dirty) {
  console.log("Page has unsaved changes");
}

// All forms
page.forms.forEach((form, formId) => {
  console.log(\`Form \${formId} is \${form.dirty ? "dirty" : "clean"}\`);
});`;

const dirtyCheckCode = `const page = usePage(new EmployeePage());

// Check if any form is dirty
if (page.isDirty()) {
  const confirmed = await confirm("Discard unsaved changes?");
  if (!confirmed) {
    return; // Prevent navigation
  }
}`;

const refreshCode = `const page = usePage(new EmployeePage());

const handleRefresh = async () => {
  // Re-run page initialization
  await page.refresh();
};

// Refresh re-executes:
// 1. Mode determination
// 2. onInit handler
// 3. Mode handler
// 4. onLoad handler`;

const pageContextCode = `const page = usePage(new EmployeePage());

// pageContext is available for child components
<CustomSection pageContext={page.pageContext} />

// In child component
function CustomSection({ pageContext }: { pageContext: PageContext }) {
  const employee = pageContext.getEntity<Employee>();
  const mode = pageContext.mode;

  return (
    <div>
      <h3>{mode === "create" ? "New" : "Edit"} Employee</h3>
      <p>{employee.firstName} {employee.lastName}</p>
    </div>
  );
}`;

const navigationGuardCode = `import { usePage, useNavigationGuard } from "lumino/react";

function EmployeePageComponent() {
  const page = usePage(new EmployeePage());

  // Prevent navigation when page is dirty
  useNavigationGuard({
    isDirty: page.isDirty,
    message: "You have unsaved changes. Leave anyway?",
    onBeforeLeave: async () => {
      // Custom logic before leaving
      return await confirm("Discard changes?");
    }
  });

  return <PageRenderer page={page} />;
}`;

const fullExampleCode = `import { usePage } from "lumino/react";
import { useParams } from "react-router-dom";
import { EmployeePage } from "./EmployeePage";

function EmployeePageComponent() {
  const { id } = useParams();

  const page = usePage(new EmployeePage(), {
    routeParams: { id }
  });

  const {
    mode,
    entity: employee,
    loading,
    error,
    setMode,
    isDirty,
    refresh
  } = page;

  // Handle mode changes
  const handleEdit = () => {
    setMode("edit");
  };

  const handleCancel = async () => {
    if (isDirty()) {
      const confirmed = await confirm("Discard changes?");
      if (!confirmed) return;
    }
    setMode("view");
  };

  // Loading state
  if (loading) {
    return <LoadingOverlay />;
  }

  // Error state
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refresh}
      />
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>
          {mode === "create" && "New Employee"}
          {mode === "edit" && \`Edit Employee: \${employee?.firstName}\`}
          {mode === "view" && employee?.firstName}
        </h1>

        <div className="actions">
          {mode === "view" && (
            <button onClick={handleEdit}>Edit</button>
          )}
          {mode === "edit" && (
            <>
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={() => page.getForm("employee-form")?.executeAction("save")}>
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <PageRenderer page={page} />
    </div>
  );
}`;

export function UsePagePage() {
  return (
    <>
      <h1 className="docs-page-title">usePage</h1>
      <p className="docs-page-subtitle">
        Manage page lifecycle, modes, entity loading, and form access.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>usePage()</code> binds a Page class to React component state, managing
          page modes (create/edit/view), entity loading, lifecycle hooks, and form access.
          It handles the complete page initialization sequence and provides programmatic
          mode switching.
        </p>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Route Params */}
      <div className="docs-section">
        <h2 className="docs-section-title">With Route Parameters</h2>
        <p>
          Pass route and query parameters for mode determination:
        </p>
        <CodeBlock code={withRouteParamsCode} language="typescript" />
      </div>

      {/* Mode Management */}
      <div className="docs-section">
        <h2 className="docs-section-title">Mode Management</h2>
        <CodeBlock code={modeManagementCode} language="typescript" />
      </div>

      {/* Entity Management */}
      <div className="docs-section">
        <h2 className="docs-section-title">Entity Management</h2>
        <CodeBlock code={entityManagementCode} language="typescript" />
      </div>

      {/* Loading State */}
      <div className="docs-section">
        <h2 className="docs-section-title">Loading State</h2>
        <CodeBlock code={loadingStateCode} language="typescript" />
      </div>

      {/* Error Handling */}
      <div className="docs-section">
        <h2 className="docs-section-title">Error Handling</h2>
        <CodeBlock code={errorHandlingCode} language="typescript" />
      </div>

      {/* Meta Data */}
      <div className="docs-section">
        <h2 className="docs-section-title">Meta Data</h2>
        <p>
          Store arbitrary page-level state:
        </p>
        <CodeBlock code={metaDataCode} language="typescript" />
      </div>

      {/* Forms Access */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Access</h2>
        <p>
          Access forms defined in the page:
        </p>
        <CodeBlock code={formsAccessCode} language="typescript" />
      </div>

      {/* Dirty Check */}
      <div className="docs-section">
        <h2 className="docs-section-title">Dirty Check</h2>
        <CodeBlock code={dirtyCheckCode} language="typescript" />
      </div>

      {/* Refresh */}
      <div className="docs-section">
        <h2 className="docs-section-title">Refresh Page</h2>
        <CodeBlock code={refreshCode} language="typescript" />
      </div>

      {/* PageContext */}
      <div className="docs-section">
        <h2 className="docs-section-title">PageContext</h2>
        <p>
          Pass pageContext to child components:
        </p>
        <CodeBlock code={pageContextCode} language="typescript" />
      </div>

      {/* Navigation Guard */}
      <div className="docs-section">
        <h2 className="docs-section-title">Navigation Guard</h2>
        <p>
          Prevent navigation when page has unsaved changes:
        </p>
        <CodeBlock code={navigationGuardCode} language="typescript" />
      </div>

      {/* Return Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">Return Type</h2>
        <CodeBlock
          code={`interface UsePageReturn<TEntity> {
  // State
  mode: string;
  entity: TEntity | null;
  loading: boolean;
  error: any | null;
  meta: Record<string, any>;

  // Operations
  setMode: (mode: string) => void;
  setEntity: (entity: TEntity) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  setMeta: (key: string, value: any) => void;
  getMeta: <T>(key: string) => T | undefined;

  // Form access
  getForm: <T>(formId: string) => UseFormReturn<T> | undefined;
  forms: Map<string, UseFormReturn<any>>;

  // Dirty check
  isDirty: () => boolean;

  // Page context
  pageContext: PageContext;
  pageConfig: PageConfig;

  // Lifecycle
  refresh: () => Promise<void>;
}`}
          language="typescript"
        />
      </div>

      {/* Complete Example */}
      <div className="docs-section">
        <h2 className="docs-section-title">Complete Example</h2>
        <CodeBlock code={fullExampleCode} language="typescript" />
      </div>

      {/* Lifecycle Sequence */}
      <div className="docs-section">
        <h2 className="docs-section-title">Lifecycle Sequence</h2>
        <p>
          When a page initializes, the following sequence occurs:
        </p>
        <ol>
          <li><strong>Mode Determination</strong> - page.determineMode() is called</li>
          <li><strong>Init Event</strong> - "page:init" event is emitted</li>
          <li><strong>onInit Hook</strong> - page.onInit() is called (if defined)</li>
          <li><strong>Mode Handler</strong> - Mode-specific handler is executed</li>
          <li><strong>onLoad Hook</strong> - page.onLoad() is called (if defined)</li>
          <li><strong>Load Event</strong> - "page:load" event is emitted</li>
        </ol>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Pass route params</strong> - Enables proper mode determination</li>
          <li><strong>Handle loading states</strong> - Show spinners during initialization</li>
          <li><strong>Handle errors gracefully</strong> - Provide retry mechanism</li>
          <li><strong>Use navigation guard</strong> - Prevent data loss from accidental navigation</li>
          <li><strong>Check dirty state</strong> - Before mode changes or navigation</li>
          <li><strong>Type entities</strong> - Use generics: usePage&lt;Employee&gt;(...)</li>
          <li><strong>Use meta for page state</strong> - Store UI state in meta</li>
        </ul>
      </div>
    </>
  );
}
