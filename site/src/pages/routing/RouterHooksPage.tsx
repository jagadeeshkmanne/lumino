/**
 * Router Hooks Page - Documentation for useRouter, useParams, and useQuery
 */

import { CodeBlock } from "../../components/CodeBlock";

const useRouterBasicCode = `import { useRouter } from "lumino/react";

function EmployeeDetail() {
  const router = useRouter();

  console.log(router.currentRoute);  // "/employees/123"
  console.log(router.match);         // RouteMatch object
  console.log(router.params);        // { id: "123" }
  console.log(router.query);         // { tab: "info" }

  return <div>Employee Detail</div>;
}`;

const useRouterNavigateCode = `import { useRouter } from "lumino/react";

function EmployeeForm() {
  const { navigate } = useRouter();

  const handleSubmit = async (data) => {
    await saveEmployee(data);
    // Navigate to employee list
    navigate("/employees");
  };

  const handleViewEmployee = (id: string) => {
    // Navigate with params
    navigate(\`/employees/\${id}\`);
  };

  const handleSearch = (query: string) => {
    // Navigate with query string
    navigate(\`/employees?search=\${query}\`);
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}`;

const useRouterRedirectCode = `import { useRouter } from "lumino/react";

function DeprecatedPage() {
  const { redirect } = useRouter();

  useEffect(() => {
    // Replace current entry in history
    redirect("/new-page");
  }, [redirect]);

  return <div>Redirecting...</div>;
}`;

const useRouterBackCode = `import { useRouter } from "lumino/react";

function EmployeeDetail() {
  const { back } = useRouter();

  return (
    <div>
      <button onClick={back}>Go Back</button>
      <h1>Employee Details</h1>
      {/* ... */}
    </div>
  );
}`;

const useParamsBasicCode = `import { useParams } from "lumino/react";

// Route: /employees/:id
function EmployeeDetail() {
  const { id } = useParams();  // { id: "123" }

  useEffect(() => {
    loadEmployee(id);
  }, [id]);

  return <div>Employee {id}</div>;
}`;

const useParamsMultipleCode = `import { useParams } from "lumino/react";

// Route: /departments/:deptId/employees/:empId
function EmployeeDetail() {
  const { deptId, empId } = useParams();
  // URL: /departments/IT/employees/123
  // Result: { deptId: "IT", empId: "123" }

  return (
    <div>
      <h1>Department: {deptId}</h1>
      <h2>Employee: {empId}</h2>
    </div>
  );
}`;

const useParamsOptionalCode = `import { useParams } from "lumino/react";

// Route: /employees/:id?
function EmployeeForm() {
  const { id } = useParams();  // { id: "123" } or { id: undefined }

  const isEditMode = id !== undefined;

  useEffect(() => {
    if (isEditMode) {
      loadEmployee(id);
    }
  }, [id, isEditMode]);

  return (
    <div>
      <h1>{isEditMode ? \`Edit Employee \${id}\` : "New Employee"}</h1>
      {/* Form fields */}
    </div>
  );
}`;

const useQueryBasicCode = `import { useQuery } from "lumino/react";

// URL: /employees?search=john&status=active
function EmployeeList() {
  const { search, status } = useQuery();
  // Result: { search: "john", status: "active" }

  useEffect(() => {
    loadEmployees({ search, status });
  }, [search, status]);

  return <div>Employee List</div>;
}`;

const useQueryFilteringCode = `import { useQuery } from "lumino/react";

// URL: /employees?department=IT&status=active&page=2
function EmployeeList() {
  const query = useQuery();

  const filters = {
    department: query.department,
    status: query.status,
    page: parseInt(query.page || "1", 10),
  };

  useEffect(() => {
    loadEmployees(filters);
  }, [filters.department, filters.status, filters.page]);

  return <div>Employee List (Page {filters.page})</div>;
}`;

const useQueryUpdateCode = `import { useRouter, useQuery } from "lumino/react";

function EmployeeList() {
  const { navigate } = useRouter();
  const query = useQuery();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(query);
    params.set(key, value);
    navigate(\`/employees?\${params.toString()}\`);
  };

  const clearFilters = () => {
    navigate("/employees");
  };

  return (
    <div>
      <button onClick={() => updateFilter("status", "active")}>
        Show Active
      </button>
      <button onClick={() => updateFilter("status", "inactive")}>
        Show Inactive
      </button>
      <button onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
}`;

const combinedHooksCode = `import { useRouter, useParams, useQuery } from "lumino/react";

// Route: /employees/:id
// URL: /employees/123?tab=info&edit=true
function EmployeeDetail() {
  const { navigate, back } = useRouter();
  const { id } = useParams();       // { id: "123" }
  const { tab, edit } = useQuery(); // { tab: "info", edit: "true" }

  const isEditMode = edit === "true";

  const switchTab = (newTab: string) => {
    navigate(\`/employees/\${id}?tab=\${newTab}\`);
  };

  const enableEdit = () => {
    navigate(\`/employees/\${id}?tab=\${tab}&edit=true\`);
  };

  return (
    <div>
      <button onClick={back}>Back</button>
      <h1>Employee {id}</h1>

      <Tabs value={tab} onChange={switchTab}>
        <Tab value="info">Info</Tab>
        <Tab value="history">History</Tab>
      </Tabs>

      {isEditMode ? <EditForm /> : <ViewDetails />}
      {!isEditMode && <button onClick={enableEdit}>Edit</button>}
    </div>
  );
}`;

const routerContextValueCode = `interface RouterContextValue {
  currentRoute: string;                      // Current URL path
  match: RouteMatch | null;                  // Matched route info
  params: Record<string, string>;            // URL parameters
  query: Record<string, string>;             // Query string parameters
  navigate: (path: string) => void;          // Navigate to new route
  redirect: (path: string) => void;          // Replace current route
  back: () => void;                          // Go back in history
  setLayout: (layout: LayoutClass | null) => void;  // Set dynamic layout
  getLayout: () => LayoutClass | null;       // Get dynamic layout
}`;

const routeMatchCode = `interface RouteMatch {
  path: string;                    // Route pattern (e.g., "/employees/:id")
  pageId: string;                  // Registered page ID
  params: Record<string, string>;  // URL parameters
  query: Record<string, string>;   // Query parameters
}`;

const typeSafeParamsCode = `import { useParams } from "lumino/react";

// Define param types
interface EmployeeParams {
  id: string;
}

function EmployeeDetail() {
  const params = useParams() as EmployeeParams;
  // params.id is type-safe

  return <div>Employee {params.id}</div>;
}

// Or with inline type assertion
function EmployeeDetail() {
  const { id } = useParams() as { id: string };
  // id is string, not string | undefined

  return <div>Employee {id}</div>;
}`;

const dynamicLayoutCode = `import { useRouter } from "lumino/react";
import { FullWidthLayout } from "./layouts/FullWidthLayout";

function ReportPage() {
  const { setLayout, getLayout } = useRouter();

  useEffect(() => {
    // Switch to full-width layout for this page
    setLayout(FullWidthLayout);

    // Cleanup - restore default layout
    return () => setLayout(null);
  }, [setLayout]);

  return <div>Report Content</div>;
}`;

export function RouterHooksPage() {
  return (
    <>
      <h1 className="docs-page-title">Router Hooks</h1>
      <p className="docs-page-subtitle">
        React hooks for accessing routing context, parameters, and navigation.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Lumino provides three React hooks for accessing router functionality:
        </p>
        <ul>
          <li><code>useRouter</code> - Full router context with navigation methods</li>
          <li><code>useParams</code> - URL route parameters (e.g., <code>:id</code>)</li>
          <li><code>useQuery</code> - Query string parameters (e.g., <code>?search=john</code>)</li>
        </ul>
        <p>
          All hooks must be used within a <code>LuminoRouter</code> component.
        </p>
      </div>

      {/* useRouter Hook */}
      <div className="docs-section">
        <h2 className="docs-section-title">useRouter</h2>
        <p>
          The <code>useRouter</code> hook provides full access to the router context including
          navigation methods and route information.
        </p>

        <h3>Return Value</h3>
        <CodeBlock code={routerContextValueCode} language="typescript" />

        <h3>Basic Usage</h3>
        <CodeBlock code={useRouterBasicCode} language="typescript" />

        <h3>Navigation</h3>
        <p>
          Use <code>navigate</code> to push a new entry to browser history:
        </p>
        <CodeBlock code={useRouterNavigateCode} language="typescript" />

        <h3>Redirect (Replace)</h3>
        <p>
          Use <code>redirect</code> to replace the current history entry:
        </p>
        <CodeBlock code={useRouterRedirectCode} language="typescript" />

        <h3>Back Navigation</h3>
        <CodeBlock code={useRouterBackCode} language="typescript" />

        <h3>Dynamic Layouts</h3>
        <p>
          Use <code>setLayout</code> to dynamically change the layout for the current page:
        </p>
        <CodeBlock code={dynamicLayoutCode} language="typescript" />
      </div>

      {/* useParams Hook */}
      <div className="docs-section">
        <h2 className="docs-section-title">useParams</h2>
        <p>
          The <code>useParams</code> hook returns URL route parameters from the current route.
        </p>

        <h3>Return Value</h3>
        <pre className="docs-code">
{`Record<string, string>  // Object with param name -> param value`}
        </pre>

        <h3>Basic Usage</h3>
        <CodeBlock code={useParamsBasicCode} language="typescript" />

        <h3>Multiple Parameters</h3>
        <CodeBlock code={useParamsMultipleCode} language="typescript" />

        <h3>Optional Parameters</h3>
        <CodeBlock code={useParamsOptionalCode} language="typescript" />

        <h3>Type Safety</h3>
        <p>
          For TypeScript type safety, cast the result:
        </p>
        <CodeBlock code={typeSafeParamsCode} language="typescript" />
      </div>

      {/* useQuery Hook */}
      <div className="docs-section">
        <h2 className="docs-section-title">useQuery</h2>
        <p>
          The <code>useQuery</code> hook returns query string parameters from the current URL.
        </p>

        <h3>Return Value</h3>
        <pre className="docs-code">
{`Record<string, string>  // Object with query param name -> value`}
        </pre>

        <h3>Basic Usage</h3>
        <CodeBlock code={useQueryBasicCode} language="typescript" />

        <h3>Filtering and Pagination</h3>
        <CodeBlock code={useQueryFilteringCode} language="typescript" />

        <h3>Updating Query Parameters</h3>
        <CodeBlock code={useQueryUpdateCode} language="typescript" />
      </div>

      {/* Combining Hooks */}
      <div className="docs-section">
        <h2 className="docs-section-title">Combining Hooks</h2>
        <p>
          Use multiple hooks together for complex routing scenarios:
        </p>
        <CodeBlock code={combinedHooksCode} language="typescript" />
      </div>

      {/* RouteMatch Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">RouteMatch Type</h2>
        <p>
          The <code>match</code> property from <code>useRouter</code> contains detailed route information:
        </p>
        <CodeBlock code={routeMatchCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Use hooks in components</strong> - Not in event handlers or outside React</li>
          <li><strong>Type-safe params</strong> - Cast params/query for TypeScript safety</li>
          <li><strong>Validate params</strong> - Check for undefined optional params</li>
          <li><strong>Parse query values</strong> - Query params are always strings</li>
          <li><strong>Use navigate for push</strong> - Use redirect for replace</li>
          <li><strong>Prefer Link/Navigate</strong> - Use hooks for programmatic navigation only</li>
          <li><strong>Handle missing params</strong> - Optional params may be undefined</li>
        </ul>
      </div>

      {/* Common Patterns */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Patterns</h2>

        <h3>Edit/View Toggle</h3>
        <pre className="docs-code">
{`import { useRouter, useParams, useQuery } from "lumino/react";

function EmployeeDetail() {
  const { navigate } = useRouter();
  const { id } = useParams();
  const { mode } = useQuery();

  const isEditMode = mode === "edit";

  const toggleMode = () => {
    const newMode = isEditMode ? "view" : "edit";
    navigate(\`/employees/\${id}?mode=\${newMode}\`);
  };

  return (
    <div>
      {isEditMode ? <EditForm /> : <ViewDetails />}
      <button onClick={toggleMode}>
        {isEditMode ? "Cancel" : "Edit"}
      </button>
    </div>
  );
}`}
        </pre>

        <h3>Breadcrumb Navigation</h3>
        <pre className="docs-code">
{`import { useRouter } from "lumino/react";

function Breadcrumbs() {
  const { currentRoute } = useRouter();
  const segments = currentRoute.split("/").filter(Boolean);

  return (
    <nav>
      <Link to="/">Home</Link>
      {segments.map((segment, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        return <Link key={path} to={path}>{segment}</Link>;
      })}
    </nav>
  );
}`}
        </pre>

        <h3>Preserving Query Params</h3>
        <pre className="docs-code">
{`import { useRouter, useQuery } from "lumino/react";

function EmployeeList() {
  const { navigate } = useRouter();
  const query = useQuery();

  const viewEmployee = (id: string) => {
    // Preserve existing query params when navigating
    const params = new URLSearchParams(query);
    navigate(\`/employees/\${id}?\${params.toString()}\`);
  };

  return <div>{/* Employee list */}</div>;
}`}
        </pre>

        <h3>Tab Navigation</h3>
        <pre className="docs-code">
{`import { useRouter, useParams, useQuery } from "lumino/react";

function ProfilePage() {
  const { navigate } = useRouter();
  const { userId } = useParams();
  const { tab = "overview" } = useQuery();

  const changeTab = (newTab: string) => {
    navigate(\`/profile/\${userId}?tab=\${newTab}\`);
  };

  return (
    <Tabs value={tab} onChange={changeTab}>
      <Tab value="overview">Overview</Tab>
      <Tab value="activity">Activity</Tab>
      <Tab value="settings">Settings</Tab>
    </Tabs>
  );
}`}
        </pre>

        <h3>Search with Debounce</h3>
        <pre className="docs-code">
{`import { useRouter, useQuery } from "lumino/react";
import { useState, useEffect } from "react";

function EmployeeSearch() {
  const { navigate } = useRouter();
  const { search = "" } = useQuery();
  const [input, setInput] = useState(search);

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(\`/employees?search=\${input}\`);
    }, 300);

    return () => clearTimeout(timer);
  }, [input, navigate]);

  return (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Search employees..."
    />
  );
}`}
        </pre>
      </div>

      {/* Error Handling */}
      <div className="docs-section">
        <h2 className="docs-section-title">Error Handling</h2>
        <pre className="docs-code">
{`import { useParams } from "lumino/react";

function EmployeeDetail() {
  const params = useParams();

  // Check for required params
  if (!params.id) {
    return <div>Error: Employee ID is required</div>;
  }

  // Validate param format
  if (!/^\\d+$/.test(params.id)) {
    return <div>Error: Invalid employee ID</div>;
  }

  return <div>Employee {params.id}</div>;
}`}
        </pre>
      </div>

      {/* Related */}
      <div className="docs-section">
        <h2 className="docs-section-title">Related</h2>
        <ul>
          <li><strong>LuminoRouter</strong> - The router component</li>
          <li><strong>Link and Navigate</strong> - Navigation components</li>
          <li><strong>Route Guards</strong> - Protecting routes</li>
        </ul>
      </div>
    </>
  );
}
