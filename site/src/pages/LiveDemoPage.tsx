/**
 * LiveDemoPage - React page component for experimental Lumino live demos
 *
 * Shows actual Lumino forms with code + live preview side by side.
 */

import { MultiFileLiveDemo, DemoFile } from "../components/MultiFileLiveDemo";
import { FormBuilderPage } from "../demo/pages/FormBuilderPage";

// Create page instance
const formBuilderPage = new FormBuilderPage();

// =============================================================================
// EMPLOYEE FORM FILES (for MultiFileLiveDemo)
// Complete form with all components including Lists
// =============================================================================

const employeeFormFiles: DemoFile[] = [
  {
    name: "EmployeeForm.ts",
    language: "typescript",
    content: `/**
 * Employee Form
 *
 * Demonstrates the Form Builder pattern with ALL Lumino components:
 * - TextInput, NumberInput, TextArea
 * - Select, MultiSelect, Autocomplete
 * - Checkbox, Switch, RadioGroup, CheckboxGroup
 * - DatePicker, TimePicker
 * - Lists with Tabs (Addresses)
 * - Lists with Table + Dialog (Experiences)
 */

import { Form, Validators } from "lumino/core";
import type { FormContext } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoTextArea,
  LuminoSelect,
  LuminoMultiSelect,
  LuminoAutocomplete,
  LuminoCheckbox,
  LuminoSwitch,
  LuminoRadioGroup,
  LuminoCheckboxGroup,
  LuminoDatePicker,
  LuminoTimePicker,
  LuminoTabs,
  LuminoButton,
} from "lumino/react";
import { Employee } from "./Employee";
import { Address } from "./Address";
import { Experience } from "./Experience";
import {
  departments,
  priorities,
  statuses,
  countries,
  sizes,
  notifications,
} from "./options";
import { AddressFields } from "./AddressFields";
import { ExperienceDialog } from "./ExperienceDialog";
import { ExperienceTable } from "./ExperienceTable";

class EmployeeForm extends Form<Employee> {
  constructor() {
    super("employee-form");
  }

  configure() {
    // Set form to read-only when page mode is "view"
    this.setReadOnly((ctx) => ctx.mode === "view");

    // =========================================================================
    // SECTION 1: Basic Information (TextInput, NumberInput, TextArea)
    // =========================================================================
    this.addSection("Basic Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter first name")
          .rules(Validators.required({ message: "First name is required" }))
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter last name")
          .rules(Validators.required({ message: "Last name is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("Enter email address")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
        .endField()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          .placeholder("Enter age")
          .props({ min: 18, max: 100 })
          .rules(Validators.required({ message: "Age is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Bio")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3 })
          .rules(Validators.required({ message: "Bio is required" }))
        .endField()
      .endRow()
    .endSection();

    // =========================================================================
    // SECTION 2: Selection Fields (Select, MultiSelect, Autocomplete)
    // Role-based: Department (Admin/HR), Priority & Status (Admin only)
    // =========================================================================
    this.addSection("Selection Fields")
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .placeholder("Select department")
          .props({ options: departments })
          .rules(Validators.required({ message: "Department is required" }))
          .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
        .endField()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority (Admin only)")
          .placeholder("Select priority")
          .props({ options: priorities })
          .rules(Validators.required({ message: "Priority is required" }))
          .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
        .endField()
        .addField("status")
          .component(LuminoSelect)
          .label("Status (Admin only)")
          .placeholder("Select status")
          .props({ options: statuses })
          .rules(Validators.required({ message: "Status is required" }))
          .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
        .endField()
        .layout([1, 1, 1])
      .endRow()
      .addRow()
        .addField("countries")
          .component(LuminoMultiSelect)
          .label("Countries (Multi)")
          .placeholder("Select countries")
          .props({ options: countries })
          .rules(Validators.required({ message: "At least one country is required" }))
        .endField()
        .addField("preferredCountry")
          .component(LuminoAutocomplete)
          .label("Preferred Country (Autocomplete)")
          .placeholder("Search for a country")
          .props({ options: countries })
          .rules(Validators.required({ message: "Preferred country is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // =========================================================================
    // SECTION 3: Boolean Fields (Checkbox, Switch, RadioGroup, CheckboxGroup)
    // Role-based: isActive (Admin/HR only)
    // =========================================================================
    this.addSection("Boolean Fields")
      .addRow()
        .addField("isActive")
          .component(LuminoCheckbox)
          .label("Active Employee (Admin/HR)")
          .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
        .endField()
        .addField("receiveNewsletter")
          .component(LuminoSwitch)
          .label("Receive Newsletter")
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("size")
          .component(LuminoRadioGroup)
          .label("T-Shirt Size")
          .props({ options: sizes })
          .rules(Validators.required({ message: "T-Shirt size is required" }))
        .endField()
        .addField("notifications")
          .component(LuminoCheckboxGroup)
          .label("Notification Preferences")
          .props({ options: notifications })
          .rules(Validators.required({ message: "At least one notification preference is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // =========================================================================
    // SECTION 4: Date & Time (DatePicker, TimePicker)
    // =========================================================================
    this.addSection("Date & Time")
      .addRow()
        .addField("startDate")
          .component(LuminoDatePicker)
          .label("Start Date")
          .placeholder("Select date")
          .rules(Validators.required({ message: "Start date is required" }))
        .endField()
        .addField("preferredTime")
          .component(LuminoTimePicker)
          .label("Preferred Meeting Time")
          .placeholder("Select time")
          .rules(Validators.required({ message: "Preferred time is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // =========================================================================
    // SECTION 5: Addresses (List with Tabs)
    // =========================================================================
    this.addSection("Addresses")
      .addComponent(LuminoButton)
        .children("+ Add Address")
        .props({ variant: "secondary" })
        .onClick((ctx) => { ctx.list("addresses").add(new Address()); })
        .hideByCondition((ctx) => ctx.mode === "view")
      .endComponent()
    .endSection();

    this.addList<Address>("addresses")
      .as(LuminoTabs)
      .tabLabel((addr, index) => {
        if (addr.street) return addr.street;
        const typeLabel = addr.type
          ? \`\${addr.type.charAt(0).toUpperCase()}\${addr.type.slice(1)}\`
          : "Address";
        return \`\${typeLabel} #\${index + 1}\`;
      })
      .include(AddressFields)
      .end();

    // =========================================================================
    // SECTION 6: Work Experience (List with Table + Dialog)
    // Role-based: Entire section visible only to Admin
    // =========================================================================
    this.addSection("Work Experience (Admin only)")
      .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
      .addComponent(LuminoButton)
        .children("+ Add Experience")
        .props({ variant: "secondary" })
        .onClick((ctx: FormContext) => {
          ctx.open(ExperienceDialog, {
            data: new Experience(),
            mode: "add",
            onSave: (data: Experience) => {
              ctx.list("experiences").add(data);
              ctx.notify?.("Experience added", "success");
            },
          });
        })
        .hideByCondition((ctx) => ctx.mode === "view")
      .endComponent()
    .endSection();

    this.addList<Experience>("experiences")
      .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
      .include(ExperienceTable)
      .defaults(() => new Experience())
      .end();

    // =========================================================================
    // Submit Button (standalone, no section wrapper)
    // =========================================================================
    this.addRow()
      .addComponent(LuminoButton)
        .children("Submit")
        .props({ variant: "primary" })
        .onClick(async (ctx) => {
          const isValid = await ctx.validate?.();
          if (isValid) {
            ctx.notify?.("Form is valid! Ready to submit.", "success");
          } else {
            ctx.notify?.("Please fix the validation errors.", "error");
          }
        })
        .hideByCondition((ctx) => ctx.mode === "view")
      .endComponent()
    .endRow();
  }
}

export { EmployeeForm };`,
  },
  {
    name: "Employee.ts",
    language: "typescript",
    content: `/**
 * Employee Entity
 *
 * Entity class with defaults for all form fields.
 */

import { Address } from "./Address";
import { Experience } from "./Experience";

export class Employee {
  id?: number;

  // Basic Information
  firstName = "";
  lastName = "";
  email = "";
  age: number | null = null;
  bio = "";

  // Selection Fields
  department = "";
  priority = "medium";
  status = "active";
  countries: string[] = [];
  preferredCountry: string | null = null;

  // Boolean Fields
  isActive = true;
  receiveNewsletter = false;
  size = "medium";
  notifications: string[] = ["email"];

  // Date/Time Fields
  startDate: string | null = null;
  preferredTime: string | null = null;

  // Lists
  addresses: Address[] = [];
  experiences: Experience[] = [];
}

// Factory for creating empty Employee entity
export const createEmptyEmployee = (): Employee => new Employee();

// Factory for creating sample Employee (for edit mode demo)
export const createSampleEmployee = (): Employee => {
  const emp = new Employee();
  emp.id = 1;
  emp.firstName = "Jagadeesh";
  emp.lastName = "Manne";
  emp.email = "jagadeesh.manne@example.com";
  emp.age = 41;
  emp.bio = "Senior software architect with expertise in TypeScript frameworks and React.";
  emp.department = "engineering";
  emp.priority = "high";
  emp.status = "active";
  emp.countries = ["us", "uk", "ca"];
  emp.preferredCountry = "us";
  emp.isActive = true;
  emp.receiveNewsletter = true;
  emp.size = "large";
  emp.notifications = ["email", "push"];
  emp.startDate = "2020-01-15";
  emp.preferredTime = "09:00";

  // Addresses
  emp.addresses = [
    { type: "home", street: "123 Oak Avenue", city: "San Jose", state: "CA", zipCode: "95134", country: "us" },
    { type: "work", street: "1 Infinite Loop", city: "Cupertino", state: "CA", zipCode: "95014", country: "us" },
  ];

  // Experiences
  emp.experiences = [
    { company: "Apple", title: "Senior Software Engineer", startDate: "2020-01-15", endDate: "", description: "Leading frontend architecture for enterprise applications" },
    { company: "Google", title: "Software Engineer", startDate: "2017-06-01", endDate: "2019-12-31", description: "Built scalable web applications with React and TypeScript" },
  ];

  return emp;
};`,
  },
  {
    name: "Address.ts",
    language: "typescript",
    content: `/**
 * Address Entity
 *
 * Entity class for address data used in Lists.
 */

export class Address {
  type: "home" | "work" | "other" = "home";
  street = "";
  city = "";
  state = "";
  zipCode = "";
  country = "us";
}`,
  },
  {
    name: "Experience.ts",
    language: "typescript",
    content: `/**
 * Experience Entity
 *
 * Entity class for work experience data used in Lists.
 */

export class Experience {
  company = "";
  title = "";
  startDate = "";
  endDate = "";
  description = "";
}`,
  },
  {
    name: "options.ts",
    language: "typescript",
    content: `/**
 * Static Options
 *
 * Reusable option lists for Select, RadioGroup, etc.
 */

export const addressTypes = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

export const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
];

export const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const statuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "au", label: "Australia" },
];

export const sizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export const notifications = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push Notifications" },
];`,
  },
  {
    name: "AddressFields.ts",
    language: "typescript",
    content: `/**
 * AddressFields Component
 *
 * Reusable field definitions for Address entity.
 * Can be included in Forms or Lists via .include(AddressFields)
 */

import { Component, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect, LuminoButton } from "lumino/react";
import { Address } from "./Address";
import { addressTypes, countries } from "./options";

export class AddressFields extends Component<Address> {
  configure() {
    this.addRow()
      .addField("type")
        .component(LuminoSelect)
        .label("Address Type")
        .placeholder("Select type")
        .props({ options: addressTypes })
        .rules(Validators.required({ message: "Address type is required" }))
      .endField()
    .endRow();

    this.addRow()
      .addField("street")
        .component(LuminoTextInput)
        .label("Street Address")
        .placeholder("Enter street address")
        .rules(Validators.required({ message: "Street address is required" }))
      .endField()
    .endRow();

    this.addRow()
      .addField("city")
        .component(LuminoTextInput)
        .label("City")
        .placeholder("Enter city")
        .rules(Validators.required({ message: "City is required" }))
      .endField()
      .addField("state")
        .component(LuminoTextInput)
        .label("State")
        .placeholder("Enter state")
        .rules(Validators.required({ message: "State is required" }))
      .endField()
      .layout([1, 1])
    .endRow();

    this.addRow()
      .addField("zipCode")
        .component(LuminoTextInput)
        .label("ZIP Code")
        .placeholder("Enter ZIP code")
        .rules(Validators.required({ message: "ZIP code is required" }))
      .endField()
      .addField("country")
        .component(LuminoSelect)
        .label("Country")
        .placeholder("Select country")
        .props({ options: countries })
        .rules(Validators.required({ message: "Country is required" }))
      .endField()
      .layout([1, 1])
    .endRow();

    // Delete button - hidden in view mode
    this.addRow()
      .addComponent(LuminoButton)
        .children("Delete Address")
        .props({ variant: "secondary" })
        .onClick((ctx) => { ctx.removeCurrentItem?.(); })
        .hideByCondition((ctx) => ctx.mode === "view")
      .endComponent()
    .endRow();
  }
}`,
  },
  {
    name: "ExperienceTable.ts",
    language: "typescript",
    content: `/**
 * ExperienceTable Component
 *
 * Displays experiences as a table using the container() API.
 * Uses Lumino abstract components (LumTable, LumTR, etc.)
 */

import { Component } from "lumino/core";
import { LuminoButton } from "lumino/react";
import { LumTable, LumTHead, LumTBody, LumTR, LumTH, LumTD } from "lumino/react/components/Containers";
import { Experience } from "./Experience";
import { ExperienceDialog } from "./ExperienceDialog";

export class ExperienceTable extends Component<Experience> {
  configure() {
    this.container(LumTable)
      .add(LumTHead)
        .add(LumTR)
          .add(LumTH).text("Company").end()
          .add(LumTH).text("Job Title").end()
          .add(LumTH).text("Start Date").end()
          .add(LumTH).text("End Date").end()
          .add(LumTH).text("Actions").hideByCondition((ctx) => ctx.mode === "view").end()
        .end()
      .end()
      .add(LumTBody)
        .each()
          .add(LumTR)
            .add(LumTD).field("company").display().end()
            .add(LumTD).field("title").display().end()
            .add(LumTD).field("startDate").display().end()
            .add(LumTD).field("endDate").display().end()
            .add(LumTD)
              .hideByCondition((ctx) => ctx.mode === "view")
              .add(LuminoButton)
                .props({ variant: "secondary" })
                .text("Edit")
                .onClick((ctx) => {
                  ctx.open(ExperienceDialog, {
                    data: ctx.getFormData(),
                    mode: "edit",
                    onSave: (data: Experience) => {
                      ctx.updateCurrentItem?.(data);
                      ctx.notify?.("Experience updated", "success");
                    },
                  });
                })
              .end()
              .add(LuminoButton)
                .props({ variant: "secondary" })
                .text("Delete")
                .onClick((ctx) => {
                  ctx.removeCurrentItem?.();
                  ctx.notify?.("Experience removed", "success");
                })
              .end()
            .end()
          .end()
        .endEach()
      .end()
    .end();
  }
}`,
  },
  {
    name: "ExperienceDialog.ts",
    language: "typescript",
    content: `/**
 * ExperienceDialog Component
 *
 * Modal dialog for adding/editing Experience entries.
 * Used with ctx.open(ExperienceDialog, { data, mode, onSave })
 */

import { Dialog, Validators } from "lumino/core";
import { LuminoTextInput, LuminoDatePicker, LuminoButton } from "lumino/react";

export class ExperienceDialog extends Dialog {
  constructor() {
    super("experience-dialog");
  }

  configure() {
    // Dynamic title based on mode
    this.title((ctx) =>
      ctx.dialogOptions?.mode === "edit" ? "Edit Experience" : "Add Experience"
    );
    this.size("medium");

    // Form fields
    this.addRow()
      .addField("company")
        .component(LuminoTextInput)
        .label("Company")
        .placeholder("Enter company name")
        .rules(Validators.required({ message: "Company is required" }))
      .endField()
      .addField("title")
        .component(LuminoTextInput)
        .label("Job Title")
        .placeholder("Enter job title")
        .rules(Validators.required({ message: "Job title is required" }))
      .endField()
      .layout([1, 1])
    .endRow();

    this.addRow()
      .addField("startDate")
        .component(LuminoDatePicker)
        .label("Start Date")
        .placeholder("Select start date")
        .rules(Validators.required({ message: "Start date is required" }))
      .endField()
      .addField("endDate")
        .component(LuminoDatePicker)
        .label("End Date")
        .placeholder("Select end date")
      .endField()
      .layout([1, 1])
    .endRow();

    this.addRow()
      .addField("description")
        .component(LuminoTextInput)
        .label("Description")
        .placeholder("Enter job description")
        .rules(Validators.required({ message: "Description is required" }))
      .endField()
    .endRow();

    // Action buttons
    this.addRow()
      .style({ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" })
      .addComponent(LuminoButton)
        .children("Cancel")
        .props({ variant: "secondary" })
        .onClick((ctx) => {
          ctx.dialogOptions?.onCancel?.();
          ctx.close?.();
        })
      .endComponent()
      .addComponent(LuminoButton)
        .children("Save")
        .props({ variant: "primary" })
        .onClick(async (ctx) => {
          if (await ctx.validate?.()) {
            const data = ctx.getFormData?.();
            ctx.dialogOptions?.onSave?.(data);
            ctx.close?.();
          }
        })
      .endComponent()
    .endRow();
  }
}`,
  },
  {
    name: "FormBuilderPage.ts",
    language: "typescript",
    isEntry: true,
    content: `/**
 * Form Builder Demo Page
 *
 * Demonstrates the Page pattern with modes (new/edit/view) and role-based access.
 */

import { Page } from "lumino/core";
import { EmployeeForm } from "./EmployeeForm";
import { Employee, createEmptyEmployee, createSampleEmployee } from "./Employee";
import { PageToolbar } from "./PageToolbar";

class FormBuilderPage extends Page<Employee> {
  private form = new EmployeeForm();

  constructor() {
    super("form-builder-page");
  }

  configure() {
    // Route with optional mode param - for live demo at /demos/live
    this.route("/demos/live/:mode?");

    // Determine mode from route params
    this.mode((ctx) => {
      const mode = ctx.routeParams.mode;
      if (mode === "edit" || mode === "view") return mode;
      return "new";
    });

    // Mode handlers
    this.onMode("new", (ctx) => {
      ctx.setEntity(createEmptyEmployee());
    });

    this.onMode("edit", (ctx) => {
      ctx.setEntity(createSampleEmployee());
    });

    this.onMode("view", (ctx) => {
      ctx.setEntity(createSampleEmployee());
    });

    // Combined toolbar: Role buttons (left) + Mode buttons (right)
    this.include(PageToolbar);

    this.addForm(this.form);
  }
}

export { FormBuilderPage };`,
  },
  {
    name: "PageToolbar.ts",
    language: "typescript",
    content: `/**
 * PageToolbar Component
 *
 * A combined toolbar with:
 * - Left side: Role buttons (Admin/HR/Employee) - demonstrates visibleByAccess
 * - Right side: Mode buttons (New/Edit/View)
 */

import { Component } from "lumino/core";
import { LuminoButton } from "lumino/react";

const roles = ["admin", "hr", "employee"];
const modes = [
  { mode: "new", label: "New" },
  { mode: "edit", label: "Edit" },
  { mode: "view", label: "View" },
];

class PageToolbar extends Component {
  configure() {
    // Single row with all buttons - using CSS to group them visually
    const row = this.addRow()
      .style({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      });

    // === LEFT SIDE: Role buttons (with minimal gap) ===
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      row.addComponent(LuminoButton)
        .children(role.charAt(0).toUpperCase() + role.slice(1))
        .props((ctx) => ({
          variant: ctx.user?.hasRole?.(role) ? "cta" : "secondary",
        }))
        .style({
          marginRight: i < roles.length - 1 ? "1px" : "auto",
        })
        .onClick((ctx) => {
          ctx.setUser?.({
            id: "demo-user",
            name: "Demo User",
            email: "demo@example.com",
            roles: [role],
            permissions: role === "admin"
              ? ["view_all", "edit_all", "manage_employees"]
              : role === "hr"
              ? ["view_employees", "edit_employees"]
              : ["view_own"],
          });
        })
      .endComponent();
    }

    // === RIGHT SIDE: Mode buttons (with minimal gap) ===
    for (let i = 0; i < modes.length; i++) {
      const modeConfig = modes[i];
      row.addComponent(LuminoButton)
        .children(modeConfig.label)
        .props((ctx) => ({
          variant: ctx.mode === modeConfig.mode ? "primary" : "secondary",
        }))
        .style({
          marginLeft: i > 0 ? "1px" : "0",
        })
        .onClick((ctx) => {
          ctx.setMode?.(modeConfig.mode);
        })
      .endComponent();
    }

    row.endRow();
  }
}

export { PageToolbar };`,
  },
];

export function LiveDemoPage() {
  return (
    <>
      <h1 className="docs-page-title">Live Lumino Demo</h1>
      <p className="docs-page-subtitle">
        Interactive demos showing actual Lumino forms with code and live preview.
        Edit the code and click <strong>Run</strong> to see changes!
      </p>

      {/* Multi-File Employee Form Demo */}
      <div className="docs-section">
        <MultiFileLiveDemo
          title="Employee Form"
          description="Complete form with all component types including Lists"
          page={formBuilderPage}
          files={employeeFormFiles}
          defaultView="split"
        />
      </div>

      <div className="docs-section">
        <h2 className="docs-section-title">How It Works</h2>
        <p>
          The live demo components use <strong>Sucrase</strong> to transpile TypeScript
          in the browser, allowing you to edit and run code instantly:
        </p>
        <ul>
          <li><strong>Code Panel</strong> - Editable code with syntax highlighting (react-live)</li>
          <li><strong>Preview Panel</strong> - Live rendered page using <code>PageRenderer</code></li>
          <li><strong>Run Button</strong> - Compiles code and updates the preview</li>
        </ul>
        <p>
          The multi-file demo supports switching between files, making it easy to
          organize pages across entities, options, components, forms, and page definitions.
        </p>
      </div>
    </>
  );
}
