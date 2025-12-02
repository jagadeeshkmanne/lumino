/**
 * PageToolbar Component
 *
 * A combined toolbar with:
 * - Left side: Role buttons (Admin/HR/Employee) - demonstrates visibleByAccess
 * - Right side: Mode buttons (New/Edit/View)
 */

import { Component } from "lumino/core";
import { LuminoButton } from "lumino/react";

interface PageToolbarProps {
  basePath?: string;
}

const roles = ["admin", "hr", "employee"];
const modes = [
  { mode: "new", label: "New" },
  { mode: "edit", label: "Edit" },
  { mode: "view", label: "View" },
];

class PageToolbar extends Component<unknown, PageToolbarProps> {
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
          marginRight: i < roles.length - 1 ? "1px" : "auto", // auto margin pushes mode buttons to the right
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

export { PageToolbar };
export type { PageToolbarProps };
