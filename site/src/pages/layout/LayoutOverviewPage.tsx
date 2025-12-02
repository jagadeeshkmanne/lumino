/**
 * Layout Overview Page
 *
 * Overview of layout components and patterns in Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function LayoutOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Layout</h1>
      <p className="docs-page-subtitle">
        Layout components and utilities for building responsive, structured
        application layouts with headers, sidebars, and content areas.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Layout Components</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>LuminoLayout</code>
              </td>
              <td>Main layout wrapper with header, sidebar, and content</td>
            </tr>
            <tr>
              <td>
                <code>LuminoContainer</code>
              </td>
              <td>Responsive container with max-width constraints</td>
            </tr>
            <tr>
              <td>
                <code>LuminoStack</code>
              </td>
              <td>Vertical or horizontal flex stack</td>
            </tr>
            <tr>
              <td>
                <code>LuminoBox</code>
              </td>
              <td>Flexible box container with spacing utilities</td>
            </tr>
            <tr>
              <td>
                <code>LuminoFlex</code>
              </td>
              <td>Flexbox container component</td>
            </tr>
            <tr>
              <td>
                <code>LuminoGrid</code>
              </td>
              <td>CSS Grid layout component</td>
            </tr>
            <tr>
              <td>
                <code>LuminoDivider</code>
              </td>
              <td>Horizontal or vertical divider line</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSpacer</code>
              </td>
              <td>Flexible spacing component</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Quick Example</h2>
        <pre className="docs-code">{`import {
  LuminoLayout,
  LuminoNavbar,
  LuminoSidebar,
  LuminoContainer,
  LuminoStack
} from "lumino/react";

function AppLayout({ children }) {
  return (
    <LuminoLayout>
      <LuminoNavbar>
        <LuminoNavbar.Brand>My App</LuminoNavbar.Brand>
        <LuminoNavbar.Actions>
          <UserMenu />
        </LuminoNavbar.Actions>
      </LuminoNavbar>

      <LuminoLayout.Body>
        <LuminoSidebar>
          <NavLinks />
        </LuminoSidebar>

        <LuminoLayout.Main>
          <LuminoContainer>
            {children}
          </LuminoContainer>
        </LuminoLayout.Main>
      </LuminoLayout.Body>
    </LuminoLayout>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Layout Patterns</h2>

        <h3>1. App Shell Layout</h3>
        <pre className="docs-code">{`// Standard app with navbar, sidebar, and content
<LuminoLayout variant="app-shell">
  <LuminoLayout.Header>
    <LuminoNavbar />
  </LuminoLayout.Header>

  <LuminoLayout.Body>
    <LuminoLayout.Sidebar>
      <Navigation />
    </LuminoLayout.Sidebar>

    <LuminoLayout.Main>
      <Outlet />
    </LuminoLayout.Main>
  </LuminoLayout.Body>
</LuminoLayout>`}</pre>

        <h3>2. Dashboard Layout</h3>
        <pre className="docs-code">{`// Dashboard with collapsible sidebar
<LuminoLayout variant="dashboard">
  <LuminoSidebar collapsible defaultCollapsed={false}>
    <Logo />
    <Navigation />
  </LuminoSidebar>

  <LuminoLayout.Content>
    <LuminoNavbar variant="minimal" />
    <LuminoContainer size="xl">
      <DashboardContent />
    </LuminoContainer>
  </LuminoLayout.Content>
</LuminoLayout>`}</pre>

        <h3>3. Centered Layout</h3>
        <pre className="docs-code">{`// Centered content (auth pages, landing)
<LuminoLayout variant="centered">
  <LuminoContainer size="sm">
    <LoginForm />
  </LuminoContainer>
</LuminoLayout>`}</pre>

        <h3>4. Full Width Layout</h3>
        <pre className="docs-code">{`// Full width without sidebar
<LuminoLayout variant="full-width">
  <LuminoNavbar />
  <LuminoContainer size="xl">
    <PageContent />
  </LuminoContainer>
  <LuminoFooter />
</LuminoLayout>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Spacing System</h2>
        <pre className="docs-code">{`// Lumino uses a consistent spacing scale
const spacing = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
};

// Use spacing props
<LuminoStack spacing={4}>  {/* 16px gap */}
  <Card />
  <Card />
</LuminoStack>

<LuminoBox p={4} m={2}>  {/* padding: 16px, margin: 8px */}
  Content
</LuminoBox>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Responsive Design</h2>
        <pre className="docs-code">{`// Responsive props using breakpoints
<LuminoContainer
  size={{ base: "full", md: "lg", xl: "xl" }}
>
  Content adapts to screen size
</LuminoContainer>

<LuminoStack
  direction={{ base: "column", md: "row" }}
  spacing={{ base: 2, md: 4 }}
>
  <Card />
  <Card />
</LuminoStack>

// Breakpoints
// base: 0px (mobile)
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px`}</pre>
      </div>

      <div className="docs-section">
        <h2>In App Builder</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    // Configure app layout
    this.setLayout("app-shell");

    // Add navbar
    this.addNavbar()
      .brand()
        .logo("/logo.svg")
        .title("My App")
        .endBrand()
      .endNavbar();

    // Add sidebar
    this.addSidebar()
      .collapsible()
      .addLink("Dashboard", "/", "home")
      .addLink("Users", "/users", "users")
      .addLink("Settings", "/settings", "settings")
      .endSidebar();

    // Configure pages
    this.addPage("/", DashboardPage);
    this.addPage("/users", UsersPage);
    this.addPage("/settings", SettingsPage);
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use semantic layout</strong> - Choose the right layout
            pattern for your app type
          </li>
          <li>
            <strong>Consistent spacing</strong> - Use the spacing scale instead
            of custom values
          </li>
          <li>
            <strong>Mobile-first</strong> - Design for mobile, then enhance for
            larger screens
          </li>
          <li>
            <strong>Container constraints</strong> - Use containers to limit
            content width for readability
          </li>
          <li>
            <strong>Flexible layouts</strong> - Use flex and grid for adaptable
            layouts
          </li>
        </ul>
      </div>
    </div>
  );
}
