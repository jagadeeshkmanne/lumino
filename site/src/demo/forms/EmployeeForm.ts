/**
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
import { Employee } from "../entities/Employee";
import { Address } from "../entities/Address";
import { Experience } from "../entities/Experience";
import {
  departments,
  priorities,
  statuses,
  countries,
  sizes,
  notifications,
} from "../data/options";
import { AddressFields } from "../components/AddressFields";
import { ExperienceDialog } from "../components/ExperienceDialog";
import { ExperienceTable } from "../components/ExperienceTable";

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
          .label("Priority")
          .placeholder("Select priority")
          .props({ options: priorities })
          .rules(Validators.required({ message: "Priority is required" }))
          .visibleByAccess((ctx) => ctx.user?.hasRole?.("admin"))
        .endField()
        .addField("status")
          .component(LuminoSelect)
          .label("Status")
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
    // =========================================================================
    this.addSection("Boolean Fields")
      .addRow()
        .addField("isActive")
          .component(LuminoCheckbox)
          .label("Active Employee")
          .rules(Validators.required({ message: "Please indicate if employee is active" }))
          .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
        .endField()
        .addField("receiveNewsletter")
          .component(LuminoSwitch)
          .label("Receive Newsletter")
          .rules(Validators.required({ message: "Please indicate newsletter preference" }))
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
    // Admin + HR can see this section
    // =========================================================================
    this.addSection("Addresses")
      .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
      .addComponent(LuminoButton)
        .children("+ Add Address")
        .props({ variant: "secondary" })
        .onClick((ctx) => { ctx.list("addresses").add(new Address()); })
        .hideByCondition((ctx) => ctx.mode === "view")
      .endComponent()
    .endSection();

    this.addList<Address>("addresses")
      .as(LuminoTabs)
      .min(1)
      .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
      .tabLabel((addr, index) => {
        if (addr.street) return addr.street;
        const typeLabel = addr.type
          ? `${addr.type.charAt(0).toUpperCase()}${addr.type.slice(1)}`
          : "Address";
        return `${typeLabel} #${index + 1}`;
      })
      .include(AddressFields)
      .end();

    // =========================================================================
    // SECTION 6: Work Experience (List with Table + Dialog)
    // Admin + Employee can see this section
    // =========================================================================
    this.addSection("Work Experience")
      .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "employee"))
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
      .min(1)
      .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "employee"))
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

export { EmployeeForm };
