/**
 * ModeButtons Component
 *
 * A reusable Lumino Component for rendering mode toggle buttons (New/Edit/View).
 * Uses the Lumino Component pattern for framework consistency.
 */

import { Component } from "lumino/core";
import { LuminoButton } from "lumino/react";

interface ModeConfig {
  mode: string;
  label: string;
  route: string;
}

interface ModeButtonsProps {
  /** Base route path (e.g., "/form-builder") */
  basePath: string;
  /** Custom mode configurations - defaults to New/Edit/View */
  modes?: ModeConfig[];
}

const defaultModes: ModeConfig[] = [
  { mode: "new", label: "New", route: "" },
  { mode: "edit", label: "Edit", route: "/edit" },
  { mode: "view", label: "View", route: "/view" },
];

class ModeButtons extends Component<unknown, ModeButtonsProps> {
  configure() {
    const { basePath = "", modes = defaultModes } = this.props || {};

    // Create a row with flex layout, justified to the right
    const row = this.addRow()
      .style({ display: "flex", justifyContent: "flex-end", marginBottom: 16 })
      .css("mode-button-group");

    // Add a button for each mode
    for (const modeConfig of modes) {
      row.addComponent(LuminoButton)
        .children(modeConfig.label)
        .props((ctx) => ({
          variant: ctx.mode === modeConfig.mode ? "primary" : "secondary",
        }))
        .onClick((ctx) => {
          // Use setMode to change mode within the current page context
          // without triggering browser navigation
          ctx.setMode?.(modeConfig.mode);
        })
      .endComponent();
    }

    row.endRow();
  }
}

export { ModeButtons };
export type { ModeButtonsProps, ModeConfig };
