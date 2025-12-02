/**
 * Form Visibility Page - Documentation for visibility and access control
 *
 * I have carefully read the Lumino source code and API documentation.
 * This page includes mini demos for each visibility configuration.
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect, LuminoCheckbox } from "lumino/react";

// =============================================================================
// CONDITIONAL VISIBILITY (hideByCondition/visibleByCondition)
// =============================================================================

class ConditionalVisibilityForm extends Form<{ employmentType: string; companyName: string; freelanceRate: string }> {
  constructor() { super("conditional-visibility-form"); }
  configure() {
    this.addSection("Conditional Visibility")
      .addRow()
        .addField("employmentType")
          .component(LuminoSelect)
          .label("Employment Type")
          .props({
            options: [
              { value: "employed", label: "Employed" },
              { value: "freelance", label: "Freelance" },
              { value: "unemployed", label: "Unemployed" },
            ]
          })
          .rules(Validators.required({ message: "Please select employment type" }))
        .endField()
      .endRow()
      .addRow()
        .addField("companyName")
          .component(LuminoTextInput)
          .label("Company Name")
          .placeholder("Enter company name")
          .rules(Validators.required({ message: "Company name is required" }))
          .visibleByCondition((ctx) => ctx.getValue("employmentType") === "employed")
        .endField()
      .endRow()
      .addRow()
        .addField("freelanceRate")
          .component(LuminoTextInput)
          .label("Hourly Rate ($)")
          .placeholder("Enter hourly rate")
          .rules(Validators.required({ message: "Rate is required" }))
          .visibleByCondition((ctx) => ctx.getValue("employmentType") === "freelance")
        .endField()
      .endRow()
    .endSection();
  }
}

const conditionalVisibilityCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect } from "lumino/react";

class ConditionalVisibilityForm extends Form<{
  employmentType: string;
  companyName: string;
  freelanceRate: string;
}> {
  configure() {
    this.addSection("Conditional Visibility")
      .addRow()
        .addField("employmentType")
          .component(LuminoSelect)
          .label("Employment Type")
          .props({
            options: [
              { value: "employed", label: "Employed" },
              { value: "freelance", label: "Freelance" },
              { value: "unemployed", label: "Unemployed" },
            ]
          })
          .rules(Validators.required({ message: "Please select" }))
        .endField()
      .endRow()
      .addRow()
        .addField("companyName")
          .component(LuminoTextInput)
          .label("Company Name")
          // Shows only when employment type is "employed"
          .visibleByCondition((ctx) => ctx.getValue("employmentType") === "employed")
          .rules(Validators.required({ message: "Company name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("freelanceRate")
          .component(LuminoTextInput)
          .label("Hourly Rate ($)")
          // Shows only when employment type is "freelance"
          .visibleByCondition((ctx) => ctx.getValue("employmentType") === "freelance")
          .rules(Validators.required({ message: "Rate is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// HIDE BY CONDITION (inverse logic)
// =============================================================================

class HideByConditionForm extends Form<{ hasDiscount: boolean; discountCode: string; regularPrice: string }> {
  constructor() { super("hide-by-condition-form"); }
  configure() {
    this.addSection("Hide By Condition")
      .addRow()
        .addField("hasDiscount")
          .component(LuminoCheckbox)
          .label("Apply discount code")
        .endField()
      .endRow()
      .addRow()
        .addField("discountCode")
          .component(LuminoTextInput)
          .label("Discount Code")
          .placeholder("Enter code")
          .rules(Validators.required({ message: "Enter discount code" }))
          // hideByCondition: hide when checkbox is NOT checked
          .hideByCondition((ctx) => !ctx.getValue("hasDiscount"))
        .endField()
      .endRow()
      .addRow()
        .addField("regularPrice")
          .component(LuminoTextInput)
          .label("Price")
          .placeholder("$0.00")
          // This field is always visible
          .rules(Validators.required({ message: "Price is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const hideByConditionCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoCheckbox } from "lumino/react";

class HideByConditionForm extends Form<{
  hasDiscount: boolean;
  discountCode: string;
  regularPrice: string;
}> {
  configure() {
    this.addSection("Hide By Condition")
      .addRow()
        .addField("hasDiscount")
          .component(LuminoCheckbox)
          .label("Apply discount code")
        .endField()
      .endRow()
      .addRow()
        .addField("discountCode")
          .component(LuminoTextInput)
          .label("Discount Code")
          // hideByCondition: hide when checkbox is NOT checked
          // Data is CLEARED when hidden, validation is SKIPPED
          .hideByCondition((ctx) => !ctx.getValue("hasDiscount"))
          .rules(Validators.required({ message: "Enter discount code" }))
        .endField()
      .endRow()
      .addRow()
        .addField("regularPrice")
          .component(LuminoTextInput)
          .label("Price")
          .rules(Validators.required({ message: "Price is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// ACCESS-BASED VISIBILITY (visibleByAccess/hideByAccess)
// =============================================================================

class AccessBasedVisibilityForm extends Form<{
  publicField: string;
  adminField: string;
  hrField: string;
  managerField: string;
}> {
  constructor() { super("access-visibility-form"); }
  configure() {
    this.addSection("Access-Based Visibility")
      .addRow()
        .addField("publicField")
          .component(LuminoTextInput)
          .label("Public Field (everyone sees)")
          .placeholder("Visible to all users")
        .endField()
      .endRow()
      .addRow()
        .addField("adminField")
          .component(LuminoTextInput)
          .label("Admin Only Field")
          .placeholder("Only visible to admins")
          // Only admins can see this field
          .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
        .endField()
      .endRow()
      .addRow()
        .addField("hrField")
          .component(LuminoTextInput)
          .label("HR Department Field")
          .placeholder("Visible to HR and Admin")
          // HR or Admin can see this field
          .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
        .endField()
      .endRow()
      .addRow()
        .addField("managerField")
          .component(LuminoTextInput)
          .label("Manager Permission Field")
          .placeholder("Visible with manage_employees permission")
          // Users with specific permission can see this field
          .visibleByAccess((ctx) => ctx.user?.hasPermission?.("manage_employees"))
        .endField()
      .endRow()
    .endSection();
  }
}

const accessBasedCode = `import { Form } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class AccessBasedVisibilityForm extends Form<{
  publicField: string;
  adminField: string;
  hrField: string;
  managerField: string;
}> {
  configure() {
    this.addSection("Access-Based Visibility")
      .addRow()
        .addField("publicField")
          .component(LuminoTextInput)
          .label("Public Field (everyone sees)")
        .endField()
      .endRow()
      .addRow()
        .addField("adminField")
          .component(LuminoTextInput)
          .label("Admin Only Field")
          // Only admins can see this field
          // Data is PRESERVED when hidden, validation RUNS
          .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
        .endField()
      .endRow()
      .addRow()
        .addField("hrField")
          .component(LuminoTextInput)
          .label("HR Department Field")
          // HR or Admin can see this field
          .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
        .endField()
      .endRow()
      .addRow()
        .addField("managerField")
          .component(LuminoTextInput)
          .label("Manager Permission Field")
          // Users with specific permission can see this field
          .visibleByAccess((ctx) => ctx.user?.hasPermission?.("manage_employees"))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// SECTION VISIBILITY
// =============================================================================

class SectionVisibilityForm extends Form<{
  userType: string;
  personalInfo: string;
  bankDetails: string;
  adminNotes: string;
}> {
  constructor() { super("section-visibility-form"); }
  configure() {
    // Always visible section
    this.addSection("Basic Info")
      .addRow()
        .addField("userType")
          .component(LuminoSelect)
          .label("User Type")
          .props({
            options: [
              { value: "customer", label: "Customer" },
              { value: "vendor", label: "Vendor" },
              { value: "employee", label: "Employee" },
            ]
          })
          .rules(Validators.required({ message: "Select user type" }))
        .endField()
      .endRow()
    .endSection();

    // Section visible only for vendors
    this.addSection("Bank Details")
      .visibleByCondition((ctx) => ctx.getValue("userType") === "vendor")
      .addRow()
        .addField("bankDetails")
          .component(LuminoTextInput)
          .label("Bank Account")
          .placeholder("Enter bank account number")
          .rules(Validators.required({ message: "Bank details required for vendors" }))
        .endField()
      .endRow()
    .endSection();

    // Section visible only to admins (access-based)
    this.addSection("Admin Notes")
      .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
      .addRow()
        .addField("adminNotes")
          .component(LuminoTextInput)
          .label("Internal Notes")
          .placeholder("Admin-only notes")
        .endField()
      .endRow()
    .endSection();
  }
}

const sectionVisibilityCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect } from "lumino/react";

class SectionVisibilityForm extends Form<{
  userType: string;
  bankDetails: string;
  adminNotes: string;
}> {
  configure() {
    // Always visible section
    this.addSection("Basic Info")
      .addRow()
        .addField("userType")
          .component(LuminoSelect)
          .label("User Type")
          .props({
            options: [
              { value: "customer", label: "Customer" },
              { value: "vendor", label: "Vendor" },
              { value: "employee", label: "Employee" },
            ]
          })
        .endField()
      .endRow()
    .endSection();

    // Section visible only for vendors (conditional)
    this.addSection("Bank Details")
      .visibleByCondition((ctx) => ctx.getValue("userType") === "vendor")
      .addRow()
        .addField("bankDetails")
          .component(LuminoTextInput)
          .label("Bank Account")
          .rules(Validators.required({ message: "Required for vendors" }))
        .endField()
      .endRow()
    .endSection();

    // Section visible only to admins (access-based)
    this.addSection("Admin Notes")
      .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
      .addRow()
        .addField("adminNotes")
          .component(LuminoTextInput)
          .label("Internal Notes")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DISABLE VS READONLY
// =============================================================================

class DisableReadOnlyForm extends Form<{
  status: string;
  editableField: string;
  disabledField: string;
  readOnlyField: string;
}> {
  constructor() { super("disable-readonly-form"); }
  configure() {
    this.addSection("Disable vs Read-Only")
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .props({
            options: [
              { value: "draft", label: "Draft" },
              { value: "review", label: "In Review" },
              { value: "published", label: "Published" },
            ]
          })
        .endField()
      .endRow()
      .addRow()
        .addField("editableField")
          .component(LuminoTextInput)
          .label("Editable (draft only)")
          .placeholder("Edit when draft")
          // Disable when NOT in draft - greyed out but validates
          .disable((ctx) => ctx.getValue("status") !== "draft")
        .endField()
      .endRow()
      .addRow()
        .addField("readOnlyField")
          .component(LuminoTextInput)
          .label("Read-Only (published)")
          .placeholder("Read-only when published")
          // Read-only when published - viewable text, not editable
          .readOnly((ctx) => ctx.getValue("status") === "published")
        .endField()
      .endRow()
    .endSection();
  }
}

const disableReadOnlyCode = `import { Form } from "lumino/core";
import { LuminoTextInput, LuminoSelect } from "lumino/react";

class DisableReadOnlyForm extends Form<{
  status: string;
  editableField: string;
  readOnlyField: string;
}> {
  configure() {
    this.addSection("Disable vs Read-Only")
      .addRow()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
          .props({
            options: [
              { value: "draft", label: "Draft" },
              { value: "review", label: "In Review" },
              { value: "published", label: "Published" },
            ]
          })
        .endField()
      .endRow()
      .addRow()
        .addField("editableField")
          .component(LuminoTextInput)
          .label("Editable (draft only)")
          // .disable() - greyed out input, validation still runs
          .disable((ctx) => ctx.getValue("status") !== "draft")
        .endField()
      .endRow()
      .addRow()
        .addField("readOnlyField")
          .component(LuminoTextInput)
          .label("Read-Only (published)")
          // .readOnly() - displays as text, not an input
          .readOnly((ctx) => ctx.getValue("status") === "published")
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export function FormVisibilityPage() {
  return (
    <>
      <h1 className="docs-page-title">Field Visibility</h1>
      <p className="docs-page-subtitle">
        Lumino provides two types of visibility control: conditional visibility based on
        form data, and access-based visibility based on user roles/permissions.
      </p>

      {/* Key Differences */}
      <div className="docs-section">
        <h2 className="docs-section-title">Two Types of Visibility</h2>
        <p>
          Understanding the difference between conditional and access-based visibility is crucial:
        </p>
        <table className="props-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Methods</th>
              <th>When Hidden</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="props-name">Conditional</span></td>
              <td><code>hideByCondition</code><br/><code>visibleByCondition</code></td>
              <td>Data is <strong>cleared</strong>, validation is <strong>skipped</strong></td>
              <td>Dynamic forms based on user input</td>
            </tr>
            <tr>
              <td><span className="props-name">Access-Based</span></td>
              <td><code>hideByAccess</code><br/><code>visibleByAccess</code></td>
              <td>Data is <strong>preserved</strong>, validation <strong>runs</strong></td>
              <td>Role-based field restrictions</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Conditional Visibility */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Visibility</h2>
        <p>
          Use <code>visibleByCondition</code> to show/hide fields based on other field values.
          When a field is hidden this way, its data is <strong>cleared</strong> and validation
          is <strong>skipped</strong>.
        </p>
        <LuminoLiveDemo
          title="Conditional Visibility"
          description="Fields appear based on selection"
          form={new ConditionalVisibilityForm()}
          code={conditionalVisibilityCode}
          defaultView="split"
        />
      </div>

      {/* Hide By Condition */}
      <div className="docs-section">
        <h2 className="docs-section-title">hideByCondition (Inverse Logic)</h2>
        <p>
          <code>hideByCondition</code> is the inverse of <code>visibleByCondition</code>.
          Use it when it's more natural to express "hide when X" rather than "show when Y".
        </p>
        <LuminoLiveDemo
          title="hideByCondition"
          description="Hide field when condition is true"
          form={new HideByConditionForm()}
          code={hideByConditionCode}
          defaultView="split"
        />
      </div>

      {/* Access-Based Visibility */}
      <div className="docs-section">
        <h2 className="docs-section-title">Access-Based Visibility</h2>
        <p>
          Use <code>visibleByAccess</code> for role/permission-based visibility.
          When a field is hidden this way, data is <strong>preserved</strong> and validation
          <strong>still runs</strong> (for data integrity).
        </p>
        <LuminoLiveDemo
          title="Access-Based Visibility"
          description="Fields visible based on user roles"
          form={new AccessBasedVisibilityForm()}
          code={accessBasedCode}
          defaultView="split"
        />
        <p style={{ marginTop: '16px', fontSize: '13px', color: '#666' }}>
          <strong>Note:</strong> In this demo, no user is logged in, so access-based fields are hidden.
          In a real app, the <code>ctx.user</code> object would contain the current user's roles and permissions.
        </p>
      </div>

      {/* Section Visibility */}
      <div className="docs-section">
        <h2 className="docs-section-title">Section Visibility</h2>
        <p>
          Entire sections can be shown/hidden using the same visibility methods.
          This is useful for grouping related fields that should appear together.
        </p>
        <LuminoLiveDemo
          title="Section Visibility"
          description="Show/hide entire sections"
          form={new SectionVisibilityForm()}
          code={sectionVisibilityCode}
          defaultView="split"
        />
      </div>

      {/* Disable vs Read-Only */}
      <div className="docs-section">
        <h2 className="docs-section-title">Disable vs Read-Only</h2>
        <p>
          <code>disable</code> and <code>readOnly</code> prevent editing but don't hide the field:
        </p>
        <ul>
          <li><strong>disable</strong> - Field is greyed out, validation still runs</li>
          <li><strong>readOnly</strong> - Field displays as text (not an input)</li>
        </ul>
        <LuminoLiveDemo
          title="Disable vs Read-Only"
          description="Different ways to prevent editing"
          form={new DisableReadOnlyForm()}
          code={disableReadOnlyCode}
          defaultView="split"
        />
      </div>

      {/* UserContext Methods */}
      <div className="docs-section">
        <h2 className="docs-section-title">UserContext Methods</h2>
        <p>
          The <code>ctx.user</code> object (type <code>UserContext</code>) provides these helper methods:
        </p>
        <CodeBlock
          code={`// UserContext helper methods
ctx.user?.hasRole("admin")           // Check single role
ctx.user?.hasAnyRole("admin", "hr")  // Check any of these roles
ctx.user?.hasAllRoles("admin", "hr") // Check all roles required

ctx.user?.hasPermission("edit_users")      // Check single permission
ctx.user?.hasAnyPermission("edit", "view") // Check any permission
ctx.user?.hasAllPermissions("edit", "view") // Check all permissions

// Access user properties
ctx.user?.id
ctx.user?.name
ctx.user?.email
ctx.user?.roles       // string[]
ctx.user?.permissions // string[]
ctx.user?.get<T>("customField") // Get custom user data`}
          language="typescript"
        />
      </div>

      {/* Combining Visibility Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Combining Visibility Types</h2>
        <p>
          You can combine conditional and access-based visibility. The field is hidden
          if <strong>either</strong> condition hides it:
        </p>
        <CodeBlock
          code={`.addField("salary")
  .component(LuminoNumberInput)
  .label("Salary")
  // Only HR/Admin can see this field
  .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
  // AND only show for employed status
  .visibleByCondition((ctx) => ctx.getValue("status") === "employed")
.endField()

// Field is visible only if:
// 1. User has admin OR hr role
// 2. AND status field equals "employed"`}
          language="typescript"
        />
      </div>

      {/* Form-Level Read-Only */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form-Level Read-Only</h2>
        <p>
          You can set the entire form to read-only mode using <code>setReadOnly()</code>:
        </p>
        <CodeBlock
          code={`class EmployeeForm extends Form<Employee> {
  configure() {
    // Set form read-only based on page mode
    this.setReadOnly((ctx) => ctx.mode === "view");

    // Or based on user permissions
    this.setReadOnly((ctx) => !ctx.user?.hasPermission?.("edit_employees"));

    // Fields...
  }
}`}
          language="typescript"
        />
      </div>
    </>
  );
}
