/**
 * Containers Overview Page
 *
 * Overview of all Lumino container components.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function ContainersOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Container Components Overview</h1>
      <p className="docs-page-subtitle">
        Lumino provides container components for organizing and structuring
        your application's UI. These components handle layout, grouping, and
        interactive content presentation.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        All container components follow consistent patterns for configuration.
      </div>

      <div className="docs-section">
        <h2>Available Container Components</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Description</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>LuminoCard</code></td>
              <td>Content container with optional header and actions</td>
              <td>Grouping related content, dashboard widgets</td>
            </tr>
            <tr>
              <td><code>LuminoTable</code></td>
              <td>Data table with sorting, pagination, selection</td>
              <td>Displaying tabular data, lists</td>
            </tr>
            <tr>
              <td><code>LuminoTabs</code></td>
              <td>Tabbed navigation for sectioned content</td>
              <td>Multi-section forms, settings pages</td>
            </tr>
            <tr>
              <td><code>LuminoDialog</code></td>
              <td>Modal dialog for focused interactions</td>
              <td>Confirmations, forms, details view</td>
            </tr>
            <tr>
              <td><code>LuminoAccordion</code></td>
              <td>Expandable/collapsible content sections</td>
              <td>FAQ, long forms, grouped settings</td>
            </tr>
            <tr>
              <td><code>LuminoGrid</code></td>
              <td>CSS Grid-based layout container</td>
              <td>Complex layouts, dashboards</td>
            </tr>
            <tr>
              <td><code>LuminoStack</code></td>
              <td>Flexbox-based stack layout</td>
              <td>Horizontal/vertical layouts</td>
            </tr>
            <tr>
              <td><code>LuminoList</code></td>
              <td>List container for repeated items</td>
              <td>Navigation lists, action lists</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Using Containers in Forms</h2>
        <p>
          Containers can be used with the Form Builder's <code>.addComponent()</code> method:
        </p>
        <pre className="docs-code">{`import { Form } from "lumino/core";
import { LuminoCard, LuminoTabs, LuminoButton } from "lumino/react";

class MyForm extends Form<MyEntity> {
  configure() {
    // Wrap form sections in a Card
    this.addComponent(LuminoCard)
      .props({ title: "User Details", elevation: 1 })
      .children(() => (
        <>
          {/* Form fields go here */}
        </>
      ))
    .endComponent();

    // Or use Tabs for multi-section forms
    this.addComponent(LuminoTabs)
      .props({
        tabs: [
          { id: "basic", label: "Basic Info" },
          { id: "advanced", label: "Advanced" },
        ]
      })
    .endComponent();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Using Containers in Pages</h2>
        <p>
          The Page Builder also supports container components:
        </p>
        <pre className="docs-code">{`import { Page } from "lumino/core";
import { LuminoCard, LuminoTable } from "lumino/react";

class DashboardPage extends Page {
  configure() {
    this.addSection("metrics")
      .addComponent(LuminoCard)
        .props({ title: "Key Metrics" })
        .children(() => <MetricsWidget />)
      .endComponent()
    .endSection();

    this.addSection("data")
      .addComponent(LuminoTable)
        .props({
          columns: [...],
          data: [],
          pagination: true,
        })
      .endComponent()
    .endSection();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Props</h2>
        <p>
          Most container components share these common props:
        </p>
        <pre className="docs-code">{`interface CommonContainerProps {
  // Content
  children?: ReactNode;

  // Styling
  className?: string;
  style?: CSSProperties;

  // Layout
  padding?: number | string;
  margin?: number | string;

  // Accessibility
  role?: string;
  "aria-label"?: string;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Nesting Containers</h2>
        <p>
          Containers can be nested for complex layouts:
        </p>
        <pre className="docs-code">{`<LuminoCard title="Dashboard">
  <LuminoGrid columns={2} gap={16}>
    <LuminoCard title="Widget 1">
      {/* Content */}
    </LuminoCard>
    <LuminoCard title="Widget 2">
      {/* Content */}
    </LuminoCard>
  </LuminoGrid>

  <LuminoTabs tabs={[...]}>
    <LuminoAccordion items={[...]}>
      {/* Nested content */}
    </LuminoAccordion>
  </LuminoTabs>
</LuminoCard>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Responsive Design</h2>
        <p>
          Container components support responsive breakpoints:
        </p>
        <pre className="docs-code">{`<LuminoGrid
  columns={{ sm: 1, md: 2, lg: 3 }}
  gap={{ sm: 8, md: 16 }}
>
  {items.map(item => (
    <LuminoCard key={item.id}>
      {/* ... */}
    </LuminoCard>
  ))}
</LuminoGrid>

<LuminoStack
  direction={{ sm: "column", md: "row" }}
  spacing={{ sm: 8, md: 16 }}
>
  {/* ... */}
</LuminoStack>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use semantic containers</strong> - Choose the right container
            for the content type (Card for grouping, Table for data, etc.)
          </li>
          <li>
            <strong>Keep nesting shallow</strong> - Too many nested containers
            can make layouts hard to maintain
          </li>
          <li>
            <strong>Responsive design</strong> - Use responsive props for
            layouts that work across screen sizes
          </li>
          <li>
            <strong>Consistent spacing</strong> - Use design tokens or consistent
            values for padding and margins
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <p>
          Explore individual container components:
        </p>
        <ul className="docs-list">
          <li><strong>Card</strong> - Content grouping with headers</li>
          <li><strong>Table</strong> - Data display with features</li>
          <li><strong>Tabs</strong> - Tabbed content navigation</li>
          <li><strong>Dialog</strong> - Modal interactions</li>
          <li><strong>Accordion</strong> - Expandable sections</li>
          <li><strong>Grid / Flex</strong> - Layout containers</li>
        </ul>
      </div>
    </div>
  );
}
