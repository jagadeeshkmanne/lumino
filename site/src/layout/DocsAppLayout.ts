/**
 * Documentation Site Layout - Using Lumino AppLayout
 *
 * Defines the app shell using Lumino's fluent builder pattern.
 */

import { AppLayout } from "lumino/core";

/**
 * Documentation site layout using Lumino's AppLayout class
 */
export class DocsAppLayout extends AppLayout {
  configure() {
    // Header configuration
    this.header()
      .title("Lumino")
      .subtitle("v1.0.0")
      .height(56)
      .end();

    // Sidebar navigation
    this.sidebar()
      .width(280)
      .collapsible(false)
      // Getting Started section
      .addGroup("Getting Started", [
        { path: "/", label: "Introduction" },
        { path: "/getting-started/installation", label: "Installation" },
        { path: "/getting-started/quick-start", label: "Quick Start" },
      ])
      // Core Concepts section
      .addGroup("Core Concepts", [
        { path: "/concepts/forms", label: "Forms" },
        { path: "/concepts/pages", label: "Pages" },
        { path: "/concepts/components", label: "Components" },
        { path: "/concepts/validation", label: "Validation" },
        { path: "/concepts/visibility", label: "Visibility" },
      ])
      // API Reference section
      .addGroup("API Reference", [
        { path: "/api/form", label: "Form" },
        { path: "/api/page", label: "Page" },
        { path: "/api/component", label: "Component" },
        { path: "/api/containers", label: "Containers" },
      ])
      // Demos section
      .addDivider()
      .addGroup("Demos", [
        { path: "/demos/form-builder", label: "Form Builder" },
      ])
      .end();

    // Footer configuration
    this.footer()
      .text("Built with Lumino by Jagadeesh Manne")
      .height(40)
      .end();
  }
}

// Create singleton instance
export const docsLayout = new DocsAppLayout("docs-layout");
