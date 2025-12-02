/**
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

    // Action buttons - layout [8, 2, 2] with spacer, Cancel aligned right in its column
    this.addRow()
      .layout([8, 2, 2])
      .addComponent("div" as any)
        .children("")
      .endComponent()
      .addComponent(LuminoButton)
        .children("Cancel")
        .props({ variant: "secondary" })
        .style({ paddingLeft: "100%" })
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
}
