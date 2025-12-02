/**
 * Sidebar Component Page
 *
 * Documents the LuminoSidebar component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function SidebarPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Sidebar</h1>
      <p className="docs-page-subtitle">
        A collapsible side navigation component for organizing app navigation
        with nested items and groups.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoSidebar } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>collapsed</code>
              </td>
              <td>boolean</td>
              <td>false</td>
              <td>Sidebar collapsed state</td>
            </tr>
            <tr>
              <td>
                <code>onCollapse</code>
              </td>
              <td>(collapsed: boolean) =&gt; void</td>
              <td>-</td>
              <td>Collapse state change handler</td>
            </tr>
            <tr>
              <td>
                <code>width</code>
              </td>
              <td>number | string</td>
              <td>240</td>
              <td>Expanded sidebar width</td>
            </tr>
            <tr>
              <td>
                <code>collapsedWidth</code>
              </td>
              <td>number | string</td>
              <td>64</td>
              <td>Collapsed sidebar width</td>
            </tr>
            <tr>
              <td>
                <code>position</code>
              </td>
              <td>"left" | "right"</td>
              <td>"left"</td>
              <td>Sidebar position</td>
            </tr>
            <tr>
              <td>
                <code>variant</code>
              </td>
              <td>"default" | "bordered" | "floating"</td>
              <td>"default"</td>
              <td>Visual variant</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Sub-Components</h2>
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
                <code>LuminoSidebar.Header</code>
              </td>
              <td>Top section with logo/brand</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSidebar.Nav</code>
              </td>
              <td>Main navigation container</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSidebar.Item</code>
              </td>
              <td>Single navigation item</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSidebar.Group</code>
              </td>
              <td>Collapsible group of items</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSidebar.Divider</code>
              </td>
              <td>Visual separator</td>
            </tr>
            <tr>
              <td>
                <code>LuminoSidebar.Footer</code>
              </td>
              <td>Bottom section</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoSidebar } from "lumino/react";

function BasicSidebar() {
  return (
    <LuminoSidebar>
      <LuminoSidebar.Header>
        <img src="/logo.svg" alt="Logo" />
        <span>My App</span>
      </LuminoSidebar.Header>

      <LuminoSidebar.Nav>
        <LuminoSidebar.Item
          icon="home"
          label="Dashboard"
          href="/dashboard"
        />
        <LuminoSidebar.Item
          icon="users"
          label="Users"
          href="/users"
        />
        <LuminoSidebar.Item
          icon="file"
          label="Documents"
          href="/documents"
        />
        <LuminoSidebar.Item
          icon="settings"
          label="Settings"
          href="/settings"
        />
      </LuminoSidebar.Nav>
    </LuminoSidebar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Groups</h2>
        <pre className="docs-code">{`function SidebarWithGroups() {
  return (
    <LuminoSidebar>
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
          defaultOpen
        >
          <LuminoSidebar.Item label="All Users" href="/users" />
          <LuminoSidebar.Item label="Add User" href="/users/new" />
          <LuminoSidebar.Item label="Roles" href="/users/roles" />
          <LuminoSidebar.Item label="Permissions" href="/users/permissions" />
        </LuminoSidebar.Group>

        <LuminoSidebar.Group
          icon="folder"
          label="Projects"
        >
          <LuminoSidebar.Item label="Active" href="/projects/active" />
          <LuminoSidebar.Item label="Archived" href="/projects/archived" />
          <LuminoSidebar.Item label="Templates" href="/projects/templates" />
        </LuminoSidebar.Group>

        <LuminoSidebar.Divider />

        <LuminoSidebar.Item
          icon="settings"
          label="Settings"
          href="/settings"
        />
      </LuminoSidebar.Nav>
    </LuminoSidebar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Collapsible Sidebar</h2>
        <pre className="docs-code">{`function CollapsibleSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <LuminoSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <LuminoSidebar.Header>
          {collapsed ? (
            <img src="/logo-icon.svg" alt="Logo" />
          ) : (
            <>
              <img src="/logo.svg" alt="Logo" />
              <span>My App</span>
            </>
          )}
        </LuminoSidebar.Header>

        <LuminoSidebar.Nav>
          <LuminoSidebar.Item
            icon="home"
            label="Dashboard"
            href="/dashboard"
          />
          <LuminoSidebar.Item
            icon="users"
            label="Users"
            href="/users"
          />
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
            fullWidth
          >
            {collapsed ? "»" : "«"}
          </LuminoButton>
        </LuminoSidebar.Footer>
      </LuminoSidebar>

      <main className="main-content">
        {/* Page content */}
      </main>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Active State</h2>
        <pre className="docs-code">{`import { useRouter } from "lumino/react";

function SidebarWithActiveState() {
  const router = useRouter();
  const currentPath = router.currentRoute;

  return (
    <LuminoSidebar>
      <LuminoSidebar.Nav>
        <LuminoSidebar.Item
          icon="home"
          label="Dashboard"
          href="/dashboard"
          active={currentPath === "/dashboard"}
        />
        <LuminoSidebar.Item
          icon="users"
          label="Users"
          href="/users"
          active={currentPath.startsWith("/users")}
        />
        <LuminoSidebar.Item
          icon="settings"
          label="Settings"
          href="/settings"
          active={currentPath === "/settings"}
        />
      </LuminoSidebar.Nav>
    </LuminoSidebar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Badges</h2>
        <pre className="docs-code">{`function SidebarWithBadges() {
  return (
    <LuminoSidebar>
      <LuminoSidebar.Nav>
        <LuminoSidebar.Item
          icon="home"
          label="Dashboard"
          href="/dashboard"
        />
        <LuminoSidebar.Item
          icon="inbox"
          label="Inbox"
          href="/inbox"
          badge={12}
          badgeColor="primary"
        />
        <LuminoSidebar.Item
          icon="bell"
          label="Notifications"
          href="/notifications"
          badge="New"
          badgeColor="success"
        />
        <LuminoSidebar.Item
          icon="alert-triangle"
          label="Issues"
          href="/issues"
          badge={3}
          badgeColor="error"
        />
      </LuminoSidebar.Nav>
    </LuminoSidebar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Sidebar Variants</h2>
        <pre className="docs-code">{`// Default - solid background
<LuminoSidebar variant="default">
  {/* ... */}
</LuminoSidebar>

// Bordered - with right border
<LuminoSidebar variant="bordered">
  {/* ... */}
</LuminoSidebar>

// Floating - with shadow and rounded corners
<LuminoSidebar variant="floating">
  {/* ... */}
</LuminoSidebar>`}</pre>
      </div>

      <div className="docs-section">
        <h2>With User Info</h2>
        <pre className="docs-code">{`function SidebarWithUser() {
  const user = { name: "John Doe", email: "john@example.com" };

  return (
    <LuminoSidebar>
      <LuminoSidebar.Header>
        <img src="/logo.svg" alt="Logo" />
      </LuminoSidebar.Header>

      <LuminoSidebar.Nav>
        {/* Navigation items */}
      </LuminoSidebar.Nav>

      <LuminoSidebar.Footer>
        <div className="user-info">
          <LuminoAvatar name={user.name} size="sm" />
          <div className="user-details">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <LuminoMenu
            trigger={<LuminoIconButton icon="more-vertical" size="sm" />}
          >
            <LuminoMenu.Item icon="user">Profile</LuminoMenu.Item>
            <LuminoMenu.Item icon="settings">Settings</LuminoMenu.Item>
            <LuminoMenu.Divider />
            <LuminoMenu.Item icon="logout">Logout</LuminoMenu.Item>
          </LuminoMenu>
        </div>
      </LuminoSidebar.Footer>
    </LuminoSidebar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Multi-Level Navigation</h2>
        <pre className="docs-code">{`function MultiLevelSidebar() {
  return (
    <LuminoSidebar>
      <LuminoSidebar.Nav>
        <LuminoSidebar.Item icon="home" label="Dashboard" href="/" />

        <LuminoSidebar.Group icon="shopping-bag" label="E-commerce">
          <LuminoSidebar.Item label="Products" href="/products" />
          <LuminoSidebar.Group label="Orders">
            <LuminoSidebar.Item label="All Orders" href="/orders" />
            <LuminoSidebar.Item label="Pending" href="/orders/pending" />
            <LuminoSidebar.Item label="Completed" href="/orders/completed" />
          </LuminoSidebar.Group>
          <LuminoSidebar.Item label="Customers" href="/customers" />
        </LuminoSidebar.Group>

        <LuminoSidebar.Group icon="bar-chart" label="Analytics">
          <LuminoSidebar.Item label="Overview" href="/analytics" />
          <LuminoSidebar.Item label="Reports" href="/analytics/reports" />
        </LuminoSidebar.Group>
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

    // Configure sidebar navigation
    this.addSidebar()
      .header()
        .logo("/logo.svg")
        .title("My App")
        .endHeader()
      .addItem("dashboard", "Dashboard")
        .icon("home")
        .route("/dashboard")
        .endItem()
      .addGroup("users", "Users")
        .icon("users")
        .addItem("all", "All Users")
          .route("/users")
          .endItem()
        .addItem("roles", "Roles")
          .route("/users/roles")
          .endItem()
        .endGroup()
      .addItem("settings", "Settings")
        .icon("settings")
        .route("/settings")
        .position("bottom")  // Places in footer
        .endItem()
      .collapsible(true)
    .endSidebar();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Limit nesting</strong> - No more than 2-3 levels of
            navigation depth
          </li>
          <li>
            <strong>Use icons</strong> - Icons help with recognition when
            collapsed
          </li>
          <li>
            <strong>Group related items</strong> - Use groups to organize
            similar sections
          </li>
          <li>
            <strong>Show active state</strong> - Clearly indicate current
            location
          </li>
          <li>
            <strong>Consider mobile</strong> - Use drawer pattern on smaller
            screens
          </li>
        </ul>
      </div>
    </div>
  );
}
