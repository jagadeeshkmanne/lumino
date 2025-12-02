/**
 * useFormData Hook Page - Real-time form data subscriptions
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicUsageCode = `import { useFormData } from "lumino/react";

function FormDataDisplay() {
  // Subscribe to form data changes
  const formData = useFormData<Employee>("employee-form");

  return (
    <pre>
      {JSON.stringify(formData, null, 2)}
    </pre>
  );
}`;

const typedUsageCode = `interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

function EmployeePreview() {
  const employee = useFormData<Employee>("employee-form");

  return (
    <div>
      <h3>Preview</h3>
      <p>Name: {employee.firstName} {employee.lastName}</p>
      <p>Email: {employee.email}</p>
      <p>Department: {employee.department}</p>
    </div>
  );
}`;

const livePreviewCode = `import { useForm, useFormData } from "lumino/react";
import { EmployeeForm } from "./EmployeeForm";

function EmployeePage() {
  const form = useForm(new EmployeeForm());

  return (
    <div className="grid">
      <div className="col-8">
        <FormRenderer form={form} />
      </div>
      <div className="col-4">
        <EmployeePreview formId="employee-form" />
      </div>
    </div>
  );
}

function EmployeePreview({ formId }: { formId: string }) {
  // This component updates automatically when any field changes
  const data = useFormData<Employee>(formId);

  return (
    <div className="preview-panel">
      <h3>Live Preview</h3>
      <div className="preview-card">
        <h4>{data.firstName} {data.lastName}</h4>
        <p>{data.title}</p>
        <p>{data.department}</p>
        <p>{data.email}</p>
      </div>
    </div>
  );
}`;

const allFormsCode = `function GlobalFormMonitor() {
  // Listen to all forms (no formId specified)
  const formData = useFormData();

  useEffect(() => {
    console.log("Some form changed:", formData);
  }, [formData]);

  return null; // Background monitor
}`;

const computedValuesCode = `function EmployeeSummary() {
  const employee = useFormData<Employee>("employee-form");

  // Compute derived values
  const fullName = \`\${employee.firstName || ""} \${employee.lastName || ""}\`.trim();
  const yearsOfService = employee.startDate
    ? new Date().getFullYear() - new Date(employee.startDate).getFullYear()
    : 0;

  return (
    <div>
      <h3>{fullName || "New Employee"}</h3>
      <p>Years of Service: {yearsOfService}</p>
    </div>
  );
}`;

const conditionalRenderCode = `function EmployeePreview() {
  const employee = useFormData<Employee>("employee-form");

  // Conditionally render based on form data
  const showContactInfo = employee.email || employee.phone;
  const isManager = employee.role === "manager";

  return (
    <div>
      {showContactInfo && (
        <div className="contact-section">
          <h4>Contact Information</h4>
          {employee.email && <p>Email: {employee.email}</p>}
          {employee.phone && <p>Phone: {employee.phone}</p>}
        </div>
      )}

      {isManager && (
        <div className="manager-section">
          <h4>Manager Information</h4>
          <p>Direct Reports: {employee.directReports?.length || 0}</p>
        </div>
      )}
    </div>
  );
}`;

const validationSummaryCode = `import { useForm, useFormData } from "lumino/react";

function ValidationSummary() {
  const form = useForm(new EmployeeForm());
  const employee = useFormData<Employee>("employee-form");

  // Compute validation summary
  const requiredFields = ["firstName", "lastName", "email"];
  const completedFields = requiredFields.filter(field => employee[field]);
  const progress = (completedFields.length / requiredFields.length) * 100;

  return (
    <div className="validation-summary">
      <h4>Form Completion: {progress.toFixed(0)}%</h4>
      <progress value={progress} max={100} />

      <ul>
        {requiredFields.map(field => (
          <li key={field} className={employee[field] ? "complete" : "incomplete"}>
            {field}: {employee[field] ? "✓" : "✗"}
          </li>
        ))}
      </ul>

      {!form.valid && (
        <div className="errors">
          {Object.keys(form.errors).length} validation errors
        </div>
      )}
    </div>
  );
}`;

const sideEffectsCode = `import { useFormData } from "lumino/react";
import { useEffect } from "react";

function AutoSaveMonitor() {
  const employee = useFormData<Employee>("employee-form");

  // Auto-save draft on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(employee).length > 0) {
        localStorage.setItem("employee-draft", JSON.stringify(employee));
        console.log("Draft saved");
      }
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(timer);
  }, [employee]);

  return null;
}`;

const multipleFormsCode = `function MultiFormDashboard() {
  const personalInfo = useFormData<PersonalInfo>("personal-form");
  const addressInfo = useFormData<Address>("address-form");
  const employment = useFormData<Employment>("employment-form");

  const isComplete =
    personalInfo.firstName &&
    addressInfo.street &&
    employment.department;

  return (
    <div className="dashboard">
      <h2>Employee Onboarding</h2>

      <div className="status">
        {isComplete ? "✓ Ready to submit" : "⚠ Incomplete"}
      </div>

      <div className="sections">
        <Section title="Personal" data={personalInfo} />
        <Section title="Address" data={addressInfo} />
        <Section title="Employment" data={employment} />
      </div>
    </div>
  );
}`;

const eventBasedCode = `// How it works under the hood
//
// useFormData subscribes to these events:
// - form:ready  (initial data when form loads)
// - form:change (incremental updates when fields change)
// - form:reset  (clears data when form is reset)
//
// The hook maintains its own state and updates automatically
// whenever these events fire for the specified formId.`;

const performanceCode = `// Performance optimization

function EmployeePreview() {
  const employee = useFormData<Employee>("employee-form");

  // Memoize expensive computations
  const fullName = useMemo(
    () => \`\${employee.firstName || ""} \${employee.lastName || ""}\`.trim(),
    [employee.firstName, employee.lastName]
  );

  // Memoize derived objects
  const contactInfo = useMemo(
    () => ({
      email: employee.email,
      phone: employee.phone,
      address: employee.address
    }),
    [employee.email, employee.phone, employee.address]
  );

  return (
    <div>
      <h3>{fullName}</h3>
      <ContactDisplay info={contactInfo} />
    </div>
  );
}`;

export function UseFormDataPage() {
  return (
    <>
      <h1 className="docs-page-title">useFormData</h1>
      <p className="docs-page-subtitle">
        Real-time form data subscriptions for previews, summaries, and monitoring.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>useFormData()</code> provides <strong>read-only access</strong> to form data
          that updates automatically when any field changes. It's perfect for building
          live previews, validation summaries, progress indicators, and auto-save features.
        </p>
        <p>
          Unlike <code>useForm()</code> which manages form state, <code>useFormData()</code>
          simply subscribes to form data changes via the event system. This makes it ideal
          for separate components that need to react to form changes without managing the form itself.
        </p>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Typed Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Type-Safe Usage</h2>
        <p>
          Always provide a type parameter for type-safe access to form data:
        </p>
        <CodeBlock code={typedUsageCode} language="typescript" />
      </div>

      {/* Live Preview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Live Preview Pattern</h2>
        <p>
          A common pattern is showing a live preview alongside the form:
        </p>
        <CodeBlock code={livePreviewCode} language="typescript" />
      </div>

      {/* All Forms */}
      <div className="docs-section">
        <h2 className="docs-section-title">Listen to All Forms</h2>
        <p>
          Omit the formId to listen to changes from any form:
        </p>
        <CodeBlock code={allFormsCode} language="typescript" />
      </div>

      {/* Computed Values */}
      <div className="docs-section">
        <h2 className="docs-section-title">Computed Values</h2>
        <p>
          Derive computed values from form data:
        </p>
        <CodeBlock code={computedValuesCode} language="typescript" />
      </div>

      {/* Conditional Rendering */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Rendering</h2>
        <CodeBlock code={conditionalRenderCode} language="typescript" />
      </div>

      {/* Validation Summary */}
      <div className="docs-section">
        <h2 className="docs-section-title">Validation Summary</h2>
        <p>
          Build a validation progress indicator:
        </p>
        <CodeBlock code={validationSummaryCode} language="typescript" />
      </div>

      {/* Side Effects */}
      <div className="docs-section">
        <h2 className="docs-section-title">Side Effects (Auto-Save)</h2>
        <p>
          React to form changes with side effects like auto-save:
        </p>
        <CodeBlock code={sideEffectsCode} language="typescript" />
      </div>

      {/* Multiple Forms */}
      <div className="docs-section">
        <h2 className="docs-section-title">Multiple Forms</h2>
        <p>
          Subscribe to multiple forms in a single component:
        </p>
        <CodeBlock code={multipleFormsCode} language="typescript" />
      </div>

      {/* How It Works */}
      <div className="docs-section">
        <h2 className="docs-section-title">How It Works</h2>
        <CodeBlock code={eventBasedCode} language="typescript" />
        <p>
          The hook automatically subscribes to form events and maintains its own state.
          When the component unmounts, subscriptions are cleaned up automatically.
        </p>
      </div>

      {/* Performance */}
      <div className="docs-section">
        <h2 className="docs-section-title">Performance Optimization</h2>
        <p>
          Use memoization for expensive computations:
        </p>
        <CodeBlock code={performanceCode} language="typescript" />
      </div>

      {/* Return Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">Return Type</h2>
        <CodeBlock
          code={`// Generic type parameter for type safety
function useFormData<T = Record<string, unknown>>(formId?: string): T

// Example
interface Employee {
  firstName: string;
  lastName: string;
  email: string;
}

const employee = useFormData<Employee>("employee-form");
// employee is typed as Employee`}
          language="typescript"
        />
      </div>

      {/* Use Cases */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Use Cases</h2>
        <ul>
          <li><strong>Live previews</strong> - Show formatted output alongside the form</li>
          <li><strong>Progress indicators</strong> - Track form completion percentage</li>
          <li><strong>Validation summaries</strong> - Show validation status overview</li>
          <li><strong>Auto-save drafts</strong> - Save form data to localStorage periodically</li>
          <li><strong>Dependent components</strong> - Update UI based on form values</li>
          <li><strong>Debug panels</strong> - Display current form state for debugging</li>
          <li><strong>Multi-step wizards</strong> - Show progress across multiple forms</li>
          <li><strong>Computed totals</strong> - Calculate sums, averages, etc.</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Always use type parameters</strong> - useFormData&lt;Employee&gt;(...)</li>
          <li><strong>Read-only access</strong> - Don't modify the returned object</li>
          <li><strong>Use for display only</strong> - Use useForm() for form control</li>
          <li><strong>Memoize computations</strong> - Use useMemo for derived values</li>
          <li><strong>Debounce side effects</strong> - Use setTimeout for auto-save, etc.</li>
          <li><strong>Handle empty state</strong> - Form data starts as empty object</li>
          <li><strong>Specify formId when possible</strong> - Better performance than listening to all forms</li>
        </ul>
      </div>

      {/* vs useForm */}
      <div className="docs-section">
        <h2 className="docs-section-title">useFormData vs useForm</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>useFormData</th>
              <th>useForm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Purpose</td>
              <td>Subscribe to form data</td>
              <td>Manage form state</td>
            </tr>
            <tr>
              <td>Access</td>
              <td>Read-only</td>
              <td>Read/Write</td>
            </tr>
            <tr>
              <td>Validation</td>
              <td>No</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Updates</td>
              <td>Automatic (event-based)</td>
              <td>Manual (setValue)</td>
            </tr>
            <tr>
              <td>Use Case</td>
              <td>Previews, summaries</td>
              <td>Form control</td>
            </tr>
            <tr>
              <td>Form Instance</td>
              <td>Not needed</td>
              <td>Required</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
