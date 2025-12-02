/**
 * Form Builder Demo Page
 *
 * Demonstrates the Form Builder pattern.
 */

import { Page } from "lumino/core";
import { EmployeeForm } from "../forms/EmployeeForm";
import { Employee, createEmptyEmployee, createSampleEmployee } from "../entities/Employee";
import { PageToolbar } from "../components/PageToolbar";

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
    this.include(PageToolbar, { basePath: "/demos/live" });

    this.addForm(this.form);
  }
}

export { FormBuilderPage };
