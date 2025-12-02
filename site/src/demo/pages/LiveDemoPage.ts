/**
 * LiveDemoPage - Experimental page for LuminoLiveDemo component
 *
 * This page demonstrates actual Lumino forms with code + live preview.
 * Separate from FormBuilderPage to avoid disturbing existing demos.
 */

import { LuminoTextInput, LuminoSelect } from "lumino/react";
import { Form, Validators } from "lumino/core";

// =============================================================================
// SAMPLE FORM: Contact Form
// =============================================================================

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactForm extends Form<ContactFormData> {
  constructor() {
    super("contact-form");
  }

  configure() {
    this.addSection("Contact Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .rules(Validators.required())
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .rules(Validators.required())
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .rules(Validators.required(), Validators.email())
        .endField()
      .endRow()
      .addRow()
        .addField("subject")
          .component(LuminoSelect)
          .label("Subject")
          .props({ options: [
            { value: "general", label: "General Inquiry" },
            { value: "support", label: "Technical Support" },
            { value: "sales", label: "Sales" },
            { value: "feedback", label: "Feedback" },
          ]})
        .endField()
      .endRow()
    .endSection();
  }
}

// =============================================================================
// EXPORTED CODE SNIPPETS FOR DISPLAY
// =============================================================================

export const contactFormCode = `// =============================================================================
// IMPORTS
// =============================================================================
import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect } from "lumino/react";`;

// =============================================================================
// SAMPLE FORM: Employee Form (Multi-file)
// =============================================================================

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  startDate: string;
  salary: number;
}

export class EmployeeForm extends Form<EmployeeFormData> {
  constructor() {
    super("employee-form");
  }

  configure() {
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .rules(Validators.required())
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .rules(Validators.required())
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email Address")
          .rules(Validators.required(), Validators.email())
        .endField()
      .endRow()
    .endSection()

    .addSection("Employment Details")
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .props({ options: [
            { value: "engineering", label: "Engineering" },
            { value: "design", label: "Design" },
            { value: "product", label: "Product" },
            { value: "marketing", label: "Marketing" },
            { value: "hr", label: "Human Resources" },
          ]})
          .rules(Validators.required())
        .endField()
        .addField("role")
          .component(LuminoTextInput)
          .label("Job Title")
          .rules(Validators.required())
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("startDate")
          .component(LuminoTextInput)
          .label("Start Date")
          .props({ placeholder: "YYYY-MM-DD" })
        .endField()
        .addField("salary")
          .component(LuminoTextInput)
          .label("Annual Salary")
          .props({ type: "number" })
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

// Employee Form - Types file content
export const employeeTypesCode = `// =============================================================================
// types.ts - Employee Form Types
// =============================================================================

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  startDate: string;
  salary: number;
}

// Department options type
type Department =
  | "engineering"
  | "design"
  | "product"
  | "marketing"
  | "hr";
`;

// Employee Form - Main form file content
export const employeeFormCode = `// =============================================================================
// EmployeeForm.ts - Main Form Class
// =============================================================================
import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect } from "lumino/react";

class EmployeeForm extends Form<EmployeeFormData> {
  configure() {
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .rules(Validators.required())
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .rules(Validators.required())
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email Address")
          .rules(Validators.required(), Validators.email())
        .endField()
      .endRow()
    .endSection()

    .addSection("Employment Details")
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .props({ options: [
            { value: "engineering", label: "Engineering" },
            { value: "design", label: "Design" },
            { value: "product", label: "Product" },
            { value: "marketing", label: "Marketing" },
            { value: "hr", label: "Human Resources" },
          ]})
          .rules(Validators.required())
        .endField()
        .addField("role")
          .component(LuminoTextInput)
          .label("Job Title")
          .rules(Validators.required())
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("startDate")
          .component(LuminoTextInput)
          .label("Start Date")
          .props({ placeholder: "YYYY-MM-DD" })
        .endField()
        .addField("salary")
          .component(LuminoTextInput)
          .label("Annual Salary")
          .props({ type: "number" })
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// Contact Form - Full code snippet for display
export const contactFormCodeFull = `// =============================================================================
// IMPORTS
// =============================================================================
import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect } from "lumino/react";

// =============================================================================
// INTERFACE: Form Data Type
// =============================================================================
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
}

// =============================================================================
// CLASS: Contact Form Definition
// =============================================================================
class ContactForm extends Form<ContactFormData> {
  configure() {
    this.addSection("Contact Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .rules(Validators.required())
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .rules(Validators.required())
        .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .rules(Validators.required(), Validators.email())
        .endField()
      .endRow()
      .addRow()
        .addField("subject")
          .component(LuminoSelect)
          .label("Subject")
          .props({ options: [
            { value: "general", label: "General Inquiry" },
            { value: "support", label: "Technical Support" },
            { value: "sales", label: "Sales" },
            { value: "feedback", label: "Feedback" },
          ]})
        .endField()
      .endRow()
    .endSection();
  }
}`;
