/**
 * DocsLayout - Storybook-style Documentation Layout
 *
 * Main layout with sidebar navigation and content area.
 */

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="docs-layout">
      {/* Header */}
      <header className="docs-header">
        <div className="docs-logo">Lumino</div>
        <div className="docs-version">v1.0.0</div>
      </header>

      {/* Main */}
      <div className="docs-main">
        <Sidebar />
        <main className="docs-content">
          <div className="docs-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
