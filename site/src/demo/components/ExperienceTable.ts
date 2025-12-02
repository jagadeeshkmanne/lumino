/**
 * ExperienceTable Component
 *
 * Displays experiences as a table using the container() API.
 * Uses Lumino abstract components (LumTable, LumTR, etc.)
 */

import { Component } from "lumino/core";
import { LuminoButton } from "lumino/react";
import { LumTable, LumTHead, LumTBody, LumTR, LumTH, LumTD } from "lumino/react/components/Containers";
import { Experience } from "../entities/Experience";
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
}
