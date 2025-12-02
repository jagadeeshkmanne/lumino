/**
 * Navigation Components Overview Page
 *
 * Documents navigation components in Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function NavigationOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Navigation Components</h1>
      <p className="docs-page-subtitle">
        Components for building navigation structures, menus, sidebars, and
        breadcrumbs in your Lumino applications.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Available Components</h2>
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
              <td>
                <code>LuminoNavbar</code>
              </td>
              <td>Top navigation bar</td>
              <td>App header with logo, links, and actions</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSidebar</code>
              </td>
              <td>Collapsible side navigation</td>
              <td>Main app navigation with nested items</td>
            </tr>
            <tr>
              <td>
                <code>LuminoMenu</code>
              </td>
              <td>Dropdown menu</td>
              <td>Contextual actions or nested navigation</td>
            </tr>
            <tr>
              <td>
                <code>LuminoBreadcrumbs</code>
              </td>
              <td>Hierarchical trail</td>
              <td>Show current location in app hierarchy</td>
            </tr>
            <tr>
              <td>
                <code>LuminoPagination</code>
              </td>
              <td>Page navigation</td>
              <td>Navigate through paginated data</td>
            </tr>
            <tr>
              <td>
                <code>LuminoStepper</code>
              </td>
              <td>Step indicator</td>
              <td>Multi-step processes and wizards</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import {
  LuminoNavbar,
  LuminoSidebar,
  LuminoMenu,
  LuminoBreadcrumbs,
  LuminoPagination,
  LuminoStepper,
} from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Navigation Patterns</h2>

        <h3>Top Navigation</h3>
        <pre className="docs-code">{`function AppLayout() {
  return (
    <div className="app">
      <LuminoNavbar>
        <LuminoNavbar.Brand>
          <img src="/logo.svg" alt="Logo" />
          <span>My App</span>
        </LuminoNavbar.Brand>

        <LuminoNavbar.Links>
          <LuminoLink href="/dashboard">Dashboard</LuminoLink>
          <LuminoLink href="/users">Users</LuminoLink>
          <LuminoLink href="/settings">Settings</LuminoLink>
        </LuminoNavbar.Links>

        <LuminoNavbar.Actions>
          <LuminoIconButton icon="bell" />
          <LuminoMenu trigger={<LuminoAvatar name="John" />}>
            <LuminoMenu.Item>Profile</LuminoMenu.Item>
            <LuminoMenu.Item>Settings</LuminoMenu.Item>
            <LuminoMenu.Divider />
            <LuminoMenu.Item>Logout</LuminoMenu.Item>
          </LuminoMenu>
        </LuminoNavbar.Actions>
      </LuminoNavbar>

      <main>{/* Content */}</main>
    </div>
  );
}`}</pre>

        <h3>Side Navigation</h3>
        <pre className="docs-code">{`function SidebarLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <LuminoSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <LuminoSidebar.Header>
          <img src="/logo.svg" alt="Logo" />
        </LuminoSidebar.Header>

        <LuminoSidebar.Nav>
          <LuminoSidebar.Item
            icon="home"
            label="Dashboard"
            href="/dashboard"
          />
          <LuminoSidebar.Group
            icon="users"
            label="Users"
          >
            <LuminoSidebar.Item label="All Users" href="/users" />
            <LuminoSidebar.Item label="Add User" href="/users/new" />
            <LuminoSidebar.Item label="Roles" href="/users/roles" />
          </LuminoSidebar.Group>
          <LuminoSidebar.Item
            icon="settings"
            label="Settings"
            href="/settings"
          />
        </LuminoSidebar.Nav>

        <LuminoSidebar.Footer>
          <LuminoButton
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "»" : "«"}
          </LuminoButton>
        </LuminoSidebar.Footer>
      </LuminoSidebar>

      <main>{/* Content */}</main>
    </div>
  );
}`}</pre>

        <h3>Breadcrumb Navigation</h3>
        <pre className="docs-code">{`function PageWithBreadcrumbs() {
  return (
    <div>
      <LuminoBreadcrumbs>
        <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
        <LuminoBreadcrumbs.Item href="/users">Users</LuminoBreadcrumbs.Item>
        <LuminoBreadcrumbs.Item>John Doe</LuminoBreadcrumbs.Item>
      </LuminoBreadcrumbs>

      <h1>John Doe</h1>
      {/* Page content */}
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Router Integration</h2>
        <pre className="docs-code">{`import { useRouter } from "lumino/react";

function NavigationWithRouter() {
  const router = useRouter();
  const currentRoute = router.currentRoute;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "home" },
    { path: "/users", label: "Users", icon: "users" },
    { path: "/settings", label: "Settings", icon: "settings" },
  ];

  return (
    <LuminoSidebar>
      <LuminoSidebar.Nav>
        {navItems.map((item) => (
          <LuminoSidebar.Item
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={currentRoute === item.path}
            onClick={() => router.navigate(item.path)}
          />
        ))}
      </LuminoSidebar.Nav>
    </LuminoSidebar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In App Builder</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    this.setTitle("My Application");

    // Configure navigation
    this.addNavigation()
      .addItem("dashboard", "Dashboard")
        .icon("home")
        .route("/dashboard")
        .endItem()
      .addGroup("users", "Users")
        .icon("users")
        .addItem("all", "All Users")
          .route("/users")
          .endItem()
        .addItem("new", "Add User")
          .route("/users/new")
          .endItem()
        .endGroup()
      .addItem("settings", "Settings")
        .icon("settings")
        .route("/settings")
        .endItem()
    .endNavigation();

    // Configure pages
    this.addPage("dashboard", DashboardPage)
      .route("/dashboard")
      .endPage();

    this.addPage("users", UsersPage)
      .route("/users")
      .endPage();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Responsive Navigation</h2>
        <pre className="docs-code">{`function ResponsiveNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <LuminoIconButton
        icon="menu"
        className="mobile-only"
        onClick={() => setMobileOpen(true)}
      />

      {/* Desktop sidebar */}
      <LuminoSidebar className="desktop-only">
        {/* Nav items */}
      </LuminoSidebar>

      {/* Mobile drawer */}
      <LuminoDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        position="left"
      >
        <LuminoSidebar>
          {/* Same nav items */}
        </LuminoSidebar>
      </LuminoDrawer>
    </>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Consistent navigation</strong> - Keep nav structure
            consistent across all pages
          </li>
          <li>
            <strong>Active state indication</strong> - Clearly show current
            location
          </li>
          <li>
            <strong>Keyboard navigation</strong> - Ensure all nav items are
            keyboard accessible
          </li>
          <li>
            <strong>Responsive design</strong> - Collapse or hide navigation on
            smaller screens
          </li>
          <li>
            <strong>Limit depth</strong> - Avoid deeply nested navigation (max
            2-3 levels)
          </li>
        </ul>
      </div>
    </div>
  );
}
