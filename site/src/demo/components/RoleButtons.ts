/**
 * RoleButtons Component
 *
 * A reusable Lumino Component for switching user roles (Admin/HR/Employee).
 * Demonstrates role-based access control with visibleByAccess().
 * Also shows form validation status to demonstrate hidden field validation.
 */

import { Component } from "lumino/core";
import { LuminoButton } from "lumino/react";

const roles = ["admin", "hr", "employee"];

class RoleButtons extends Component {
  configure() {
    // Combined row: Role buttons + Validation Status
    const row = this.addRow()
      .style({ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: "8px" });

    // Validation status on the left
    row.addComponent(LuminoButton)
      .children((ctx) => {
        const errors = ctx.getErrors?.() || {};
        const errorCount = Object.keys(errors).length;
        return errorCount === 0 ? "✓ Valid" : "✗ Errors: " + errorCount;
      })
      .props((ctx) => {
        const errors = ctx.getErrors?.() || {};
        const errorCount = Object.keys(errors).length;
        return {
          variant: errorCount === 0 ? "cta" : "secondary",
          disabled: true,
        };
      })
    .endComponent();

    // Role buttons container (right side)
    row.addComponent(LuminoButton)
      .children((ctx) => "Role: " + (ctx.user?.roles?.[0] || "employee").toUpperCase())
      .props({ variant: "secondary", disabled: true })
    .endComponent();

    for (const role of roles) {
      row.addComponent(LuminoButton)
        .children(role.charAt(0).toUpperCase() + role.slice(1))
        .props((ctx) => ({
          variant: ctx.user?.hasRole?.(role) ? "cta" : "secondary",
        }))
        .onClick((ctx) => {
          // Update user role - this triggers re-render with new access
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

    row.endRow();
  }
}

export { RoleButtons };
