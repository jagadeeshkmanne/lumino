/**
 * Page Builder Overview Page
 *
 * Overview of the Page Builder pattern in Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function PageBuilderOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Page Builder</h1>
      <p className="docs-page-subtitle">
        Build dynamic pages using Lumino's declarative Page Builder pattern with
        automatic state management, data binding, and component composition.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>What is Page Builder?</h2>
        <p>
          Page Builder is Lumino's declarative approach to creating pages. Each
          page is defined as a class that extends <code>Page</code>, with a
          fluent API for adding components, handling data, and managing state.
        </p>
      </div>

      <div className="docs-section">
        <h2>Quick Start</h2>
        <pre className="docs-code">{`import { Page } from "lumino";

class DashboardPage extends Page {
  configure() {
    this.setTitle("Dashboard");
    this.setDescription("Overview of your data");

    // Add components
    this.addHeading("Welcome back, {user.name}!");

    this.addGrid({ columns: 4, gap: 4 })
      .addComponent(StatCard)
        .props({ label: "Users", value: "{stats.users}" })
        .endComponent()
      .addComponent(StatCard)
        .props({ label: "Revenue", value: "{stats.revenue}" })
        .endComponent()
      .addComponent(StatCard)
        .props({ label: "Orders", value: "{stats.orders}" })
        .endComponent()
      .addComponent(StatCard)
        .props({ label: "Growth", value: "{stats.growth}" })
        .endComponent()
      .endGrid();

    this.addComponent(RecentOrdersTable)
      .dataBind("orders")
      .endComponent();
  }

  async onMount() {
    const [stats, orders] = await Promise.all([
      this.api.get("/stats"),
      this.api.get("/orders"),
    ]);
    this.setState({ stats, orders });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Class Structure</h2>
        <pre className="docs-code">{`class MyPage extends Page {
  // Required: Configure page layout and components
  configure() {
    // Setup page metadata
    this.setTitle("Page Title");

    // Add components
    this.addComponent(MyComponent).endComponent();
  }

  // Optional: Called when page mounts
  async onMount() {
    // Load data, start subscriptions
  }

  // Optional: Called when page unmounts
  async onUnmount() {
    // Cleanup, cancel subscriptions
  }

  // Optional: Called when route params change
  async onParamsChange(params) {
    // Handle route param changes
  }

  // Optional: Called when query params change
  async onQueryChange(query) {
    // Handle query param changes
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Adding Components</h2>
        <pre className="docs-code">{`class MyPage extends Page {
  configure() {
    // Add a heading
    this.addHeading("Page Title", { level: 1 });

    // Add text
    this.addText("Some description text");

    // Add a custom component
    this.addComponent(UserCard)
      .props({ userId: "{params.id}" })
      .endComponent();

    // Add multiple components in a grid
    this.addGrid({ columns: 3 })
      .addComponent(Card1).endComponent()
      .addComponent(Card2).endComponent()
      .addComponent(Card3).endComponent()
      .endGrid();

    // Add a form
    this.addForm(ContactForm)
      .onSubmit((data) => this.handleSubmit(data))
      .endForm();

    // Add a table
    this.addTable()
      .columns([
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
      ])
      .dataBind("users")
      .endTable();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>State Management</h2>
        <pre className="docs-code">{`class UserListPage extends Page {
  // Define initial state
  getInitialState() {
    return {
      users: [],
      loading: true,
      error: null,
      filter: "",
      sortBy: "name",
    };
  }

  configure() {
    this.setTitle("Users");

    // Add filter input
    this.addTextInput("filter")
      .placeholder("Search users...")
      .value("{state.filter}")
      .onChange((value) => this.setState({ filter: value }))
      .endInput();

    // Conditional loading state
    this.addConditional()
      .when("{state.loading}")
      .then(this.addSpinner().endSpinner())
      .otherwise(
        this.addTable()
          .dataBind("filteredUsers")
          .endTable()
      )
      .endConditional();
  }

  // Computed property
  get filteredUsers() {
    const { users, filter } = this.state;
    if (!filter) return users;
    return users.filter((u) =>
      u.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  async onMount() {
    try {
      const users = await this.api.get("/users");
      this.setState({ users, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Data Binding</h2>
        <pre className="docs-code">{`class ProductPage extends Page {
  configure() {
    // Bind to state property
    this.addComponent(ProductList)
      .dataBind("products")
      .endComponent();

    // Bind to computed property
    this.addComponent(ProductSummary)
      .dataBind("productStats")
      .endComponent();

    // Bind with transformation
    this.addTable()
      .dataBind("products", {
        transform: (products) => products.map((p) => ({
          ...p,
          displayPrice: \`$\${p.price.toFixed(2)}\`,
        })),
      })
      .endTable();

    // Multiple bindings
    this.addComponent(Dashboard)
      .props({
        users: "{state.users}",
        orders: "{state.orders}",
        revenue: "{computed.totalRevenue}",
      })
      .endComponent();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Route Parameters</h2>
        <pre className="docs-code">{`// Route: /users/:id

class UserDetailPage extends Page {
  configure() {
    this.setTitle("User Details");

    // Access route params
    this.addHeading("User: {params.id}");

    this.addComponent(UserProfile)
      .props({ userId: "{params.id}" })
      .endComponent();
  }

  async onMount() {
    const userId = this.params.id;
    const user = await this.api.get(\`/users/\${userId}\`);
    this.setState({ user });
  }

  async onParamsChange(newParams, oldParams) {
    // Called when route params change
    if (newParams.id !== oldParams.id) {
      const user = await this.api.get(\`/users/\${newParams.id}\`);
      this.setState({ user });
    }
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Query Parameters</h2>
        <pre className="docs-code">{`// Route: /products?category=electronics&sort=price

class ProductListPage extends Page {
  configure() {
    this.setTitle("Products");

    // Access query params
    this.addSelect("category")
      .options([
        { value: "", label: "All Categories" },
        { value: "electronics", label: "Electronics" },
        { value: "clothing", label: "Clothing" },
      ])
      .value("{query.category}")
      .onChange((value) => this.setQuery({ category: value }))
      .endSelect();

    this.addSelect("sort")
      .options([
        { value: "name", label: "Name" },
        { value: "price", label: "Price" },
        { value: "date", label: "Date" },
      ])
      .value("{query.sort}")
      .onChange((value) => this.setQuery({ sort: value }))
      .endSelect();
  }

  async onMount() {
    await this.loadProducts();
  }

  async onQueryChange(newQuery, oldQuery) {
    // Called when query params change
    await this.loadProducts();
  }

  async loadProducts() {
    const { category, sort } = this.query;
    const products = await this.api.get("/products", {
      params: { category, sort },
    });
    this.setState({ products });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Actions</h2>
        <pre className="docs-code">{`class OrderPage extends Page {
  configure() {
    this.setTitle("Order Details");

    // Add action buttons
    this.addActions()
      .addButton("Edit")
        .icon("edit")
        .onClick(() => this.editOrder())
        .endButton()
      .addButton("Delete")
        .icon("trash")
        .variant("danger")
        .onClick(() => this.deleteOrder())
        .endButton()
      .addButton("Print")
        .icon("printer")
        .variant("secondary")
        .onClick(() => this.printOrder())
        .endButton()
      .endActions();

    this.addComponent(OrderDetails)
      .dataBind("order")
      .endComponent();
  }

  async editOrder() {
    this.navigate(\`/orders/\${this.params.id}/edit\`);
  }

  async deleteOrder() {
    const confirmed = await this.confirm({
      title: "Delete Order",
      message: "Are you sure you want to delete this order?",
    });

    if (confirmed) {
      await this.api.delete(\`/orders/\${this.params.id}\`);
      this.toast.success("Order deleted");
      this.navigate("/orders");
    }
  }

  printOrder() {
    window.print();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Guards</h2>
        <pre className="docs-code">{`class AdminPage extends Page {
  // Check before page loads
  async canActivate() {
    const user = this.auth.user;
    if (!user) {
      this.navigate("/login");
      return false;
    }
    if (!user.isAdmin) {
      this.navigate("/unauthorized");
      return false;
    }
    return true;
  }

  // Check before leaving page
  async canDeactivate() {
    if (this.state.hasUnsavedChanges) {
      return this.confirm({
        title: "Unsaved Changes",
        message: "You have unsaved changes. Are you sure you want to leave?",
      });
    }
    return true;
  }

  configure() {
    this.setTitle("Admin Panel");
    // ...
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Loading States</h2>
        <pre className="docs-code">{`class DataPage extends Page {
  configure() {
    this.setTitle("Data");

    // Built-in loading handling
    this.addLoadingWrapper()
      .loading("{state.loading}")
      .error("{state.error}")
      .skeleton(DataSkeleton)
      .children(
        this.addComponent(DataDisplay)
          .dataBind("data")
          .endComponent()
      )
      .endLoadingWrapper();
  }

  async onMount() {
    this.setState({ loading: true });
    try {
      const data = await this.api.get("/data");
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Complete Example</h2>
        <pre className="docs-code">{`import { Page } from "lumino";

class UserManagementPage extends Page {
  getInitialState() {
    return {
      users: [],
      loading: true,
      search: "",
      selectedRole: "",
      selectedUser: null,
      isDialogOpen: false,
    };
  }

  configure() {
    this.setTitle("User Management");

    // Page header with actions
    this.addFlex()
      .justify("between")
      .align("center")
      .children(
        this.addHeading("Users", { level: 1 }).endHeading(),
        this.addButton("Add User")
          .icon("plus")
          .onClick(() => this.openDialog())
          .endButton()
      )
      .endFlex();

    // Filters
    this.addFlex()
      .gap(4)
      .children(
        this.addTextInput("search")
          .placeholder("Search users...")
          .value("{state.search}")
          .onChange((v) => this.setState({ search: v }))
          .endInput(),
        this.addSelect("role")
          .options(this.roleOptions)
          .value("{state.selectedRole}")
          .onChange((v) => this.setState({ selectedRole: v }))
          .endSelect()
      )
      .endFlex();

    // Users table
    this.addLoadingWrapper()
      .loading("{state.loading}")
      .children(
        this.addTable()
          .columns(this.columns)
          .dataBind("filteredUsers")
          .onRowClick((user) => this.selectUser(user))
          .endTable()
      )
      .endLoadingWrapper();

    // User dialog
    this.addDialog()
      .open("{state.isDialogOpen}")
      .title("{state.selectedUser ? 'Edit User' : 'Add User'}")
      .onClose(() => this.closeDialog())
      .children(
        this.addForm(UserForm)
          .entity("{state.selectedUser}")
          .onSubmit((data) => this.saveUser(data))
          .endForm()
      )
      .endDialog();
  }

  get columns() {
    return [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      {
        key: "actions",
        label: "",
        render: (user) => (
          <ActionMenu
            onEdit={() => this.editUser(user)}
            onDelete={() => this.deleteUser(user)}
          />
        ),
      },
    ];
  }

  get roleOptions() {
    return [
      { value: "", label: "All Roles" },
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ];
  }

  get filteredUsers() {
    const { users, search, selectedRole } = this.state;
    return users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !selectedRole || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }

  async onMount() {
    const users = await this.api.get("/users");
    this.setState({ users, loading: false });
  }

  openDialog() {
    this.setState({ isDialogOpen: true, selectedUser: null });
  }

  closeDialog() {
    this.setState({ isDialogOpen: false, selectedUser: null });
  }

  editUser(user) {
    this.setState({ isDialogOpen: true, selectedUser: user });
  }

  async saveUser(data) {
    if (this.state.selectedUser) {
      await this.api.put(\`/users/\${this.state.selectedUser.id}\`, data);
      this.toast.success("User updated");
    } else {
      await this.api.post("/users", data);
      this.toast.success("User created");
    }
    this.closeDialog();
    await this.onMount(); // Reload users
  }

  async deleteUser(user) {
    const confirmed = await this.confirm({
      title: "Delete User",
      message: \`Delete \${user.name}?\`,
    });
    if (confirmed) {
      await this.api.delete(\`/users/\${user.id}\`);
      this.toast.success("User deleted");
      await this.onMount();
    }
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Keep pages focused</strong> - One main purpose per page
          </li>
          <li>
            <strong>Use computed properties</strong> - For derived data
          </li>
          <li>
            <strong>Handle loading states</strong> - Always show feedback
          </li>
          <li>
            <strong>Implement guards</strong> - Protect sensitive pages
          </li>
          <li>
            <strong>Extract reusable components</strong> - Don't repeat code
          </li>
          <li>
            <strong>Use data binding</strong> - Keep UI in sync with state
          </li>
        </ul>
      </div>
    </div>
  );
}
