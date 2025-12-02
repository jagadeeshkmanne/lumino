/**
 * LuminoFloatingPanel Component
 *
 * A Lumino Component for displaying a floating side panel with:
 * - Source Code tab with file navigation
 * - Form Data tab showing real-time JSON
 *
 * Uses the Lumino Component pattern with state management.
 */

import { Component } from "lumino/core";
import { createLuminoComponent } from "lumino/react";
import { FloatingPanel } from "./FloatingPanel";

// =============================================================================
// TYPES
// =============================================================================

export interface CodeFile {
  name: string;
  language: "typescript" | "tsx" | "javascript" | "json";
  code: string;
}

export interface LuminoFloatingPanelProps {
  files: CodeFile[];
  title?: string;
  defaultTab?: "code" | "data";
  defaultExpanded?: boolean;
}

// State is managed by the React component internally
type FloatingPanelState = Record<string, never>;

// =============================================================================
// COMPONENT
// =============================================================================

class LuminoFloatingPanelComponent extends Component<unknown, LuminoFloatingPanelProps, FloatingPanelState> {
  configure() {
    const {
      files = [],
      defaultTab = "code",
      defaultExpanded = false,
    } = this.props || {};

    // The FloatingPanel handles its own fixed positioning
    // We access form data via the props callback which receives context
    this.addRow()
      .addComponent(FloatingPanel)
        .props((ctx) => ({
          files,
          formData: ctx.getFormData?.() || {},
          defaultTab,
          defaultExpanded,
        }))
      .endComponent()
    .endRow();
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

const LuminoFloatingPanel = createLuminoComponent<LuminoFloatingPanelProps, FloatingPanelState>(
  LuminoFloatingPanelComponent
);

export { LuminoFloatingPanel, LuminoFloatingPanelComponent };
export type { FloatingPanelState };
