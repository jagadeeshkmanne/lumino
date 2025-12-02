/**
 * Breadcrumbs Component Page
 *
 * Documents the LuminoBreadcrumbs component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicBreadcrumbsCode = `// Basic breadcrumb navigation
<nav style={{ padding: 16 }}>
  <ol style={{
    display: "flex",
    alignItems: "center",
    listStyle: "none",
    padding: 0,
    margin: 0,
    gap: 8
  }}>
    <li>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ color: "#1976d2", textDecoration: "none" }}
      >
        Home
      </a>
    </li>
    <li aria-hidden="true" style={{ color: "#666" }}>/</li>
    <li>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ color: "#1976d2", textDecoration: "none" }}
      >
        Products
      </a>
    </li>
    <li aria-hidden="true" style={{ color: "#666" }}>/</li>
    <li>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ color: "#1976d2", textDecoration: "none" }}
      >
        Electronics
      </a>
    </li>
    <li aria-hidden="true" style={{ color: "#666" }}>/</li>
    <li aria-current="page" style={{ color: "#333", fontWeight: 500 }}>
      Smartphones
    </li>
  </ol>
</nav>`;

const customSeparatorCode = `// Breadcrumbs with custom separators
<div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 16 }}>
  {/* Arrow separator */}
  <nav>
    <ol style={{
      display: "flex",
      alignItems: "center",
      listStyle: "none",
      padding: 0,
      margin: 0,
      gap: 8
    }}>
      <li>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "none" }}>
          Home
        </a>
      </li>
      <li aria-hidden="true" style={{ color: "#666" }}>›</li>
      <li>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "none" }}>
          Docs
        </a>
      </li>
      <li aria-hidden="true" style={{ color: "#666" }}>›</li>
      <li aria-current="page" style={{ color: "#333", fontWeight: 500 }}>
        Guide
      </li>
    </ol>
  </nav>

  {/* Dot separator */}
  <nav>
    <ol style={{
      display: "flex",
      alignItems: "center",
      listStyle: "none",
      padding: 0,
      margin: 0,
      gap: 8
    }}>
      <li>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "none" }}>
          Home
        </a>
      </li>
      <li aria-hidden="true" style={{ color: "#999" }}>•</li>
      <li>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "none" }}>
          Docs
        </a>
      </li>
      <li aria-hidden="true" style={{ color: "#999" }}>•</li>
      <li aria-current="page" style={{ color: "#333", fontWeight: 500 }}>
        Guide
      </li>
    </ol>
  </nav>
</div>`;

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BasicBreadcrumbsDemo() {
  return (
    <nav style={{ padding: 16 }}>
      <ol style={{
        display: "flex",
        alignItems: "center",
        listStyle: "none",
        padding: 0,
        margin: 0,
        gap: 8
      }}>
        <li>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            Home
          </a>
        </li>
        <li aria-hidden="true" style={{ color: "#666" }}>/</li>
        <li>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            Products
          </a>
        </li>
        <li aria-hidden="true" style={{ color: "#666" }}>/</li>
        <li>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ color: "#1976d2", textDecoration: "none" }}
          >
            Electronics
          </a>
        </li>
        <li aria-hidden="true" style={{ color: "#666" }}>/</li>
        <li aria-current="page" style={{ color: "#333", fontWeight: 500 }}>
          Smartphones
        </li>
      </ol>
    </nav>
  );
}

function CustomSeparatorDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 16 }}>
      {/* Arrow separator */}
      <nav>
        <ol style={{
          display: "flex",
          alignItems: "center",
          listStyle: "none",
          padding: 0,
          margin: 0,
          gap: 8
        }}>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "none" }}>
              Home
            </a>
          </li>
          <li aria-hidden="true" style={{ color: "#666" }}>›</li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "none" }}>
              Docs
            </a>
          </li>
          <li aria-hidden="true" style={{ color: "#666" }}>›</li>
          <li aria-current="page" style={{ color: "#333", fontWeight: 500 }}>
            Guide
          </li>
        </ol>
      </nav>

      {/* Dot separator */}
      <nav>
        <ol style={{
          display: "flex",
          alignItems: "center",
          listStyle: "none",
          padding: 0,
          margin: 0,
          gap: 8
        }}>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "none" }}>
              Home
            </a>
          </li>
          <li aria-hidden="true" style={{ color: "#999" }}>•</li>
          <li>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "none" }}>
              Docs
            </a>
          </li>
          <li aria-hidden="true" style={{ color: "#999" }}>•</li>
          <li aria-current="page" style={{ color: "#333", fontWeight: 500 }}>
            Guide
          </li>
        </ol>
      </nav>
    </div>
  );
}

export function BreadcrumbsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Breadcrumbs</h1>
      <p className="docs-page-subtitle">
        A navigation trail showing the user's current location in the app
        hierarchy with clickable links to parent pages.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoBreadcrumbs } from "lumino/react";`}</pre>
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
                <code>separator</code>
              </td>
              <td>ReactNode</td>
              <td>"/"</td>
              <td>Separator between items</td>
            </tr>
            <tr>
              <td>
                <code>maxItems</code>
              </td>
              <td>number</td>
              <td>-</td>
              <td>Max items before collapsing</td>
            </tr>
            <tr>
              <td>
                <code>itemsBeforeCollapse</code>
              </td>
              <td>number</td>
              <td>1</td>
              <td>Items to show at start when collapsed</td>
            </tr>
            <tr>
              <td>
                <code>itemsAfterCollapse</code>
              </td>
              <td>number</td>
              <td>1</td>
              <td>Items to show at end when collapsed</td>
            </tr>
            <tr>
              <td>
                <code>size</code>
              </td>
              <td>"sm" | "md" | "lg"</td>
              <td>"md"</td>
              <td>Text size</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Item Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>href</code>
              </td>
              <td>string</td>
              <td>Link destination</td>
            </tr>
            <tr>
              <td>
                <code>onClick</code>
              </td>
              <td>() =&gt; void</td>
              <td>Click handler</td>
            </tr>
            <tr>
              <td>
                <code>icon</code>
              </td>
              <td>ReactNode</td>
              <td>Optional icon</td>
            </tr>
            <tr>
              <td>
                <code>current</code>
              </td>
              <td>boolean</td>
              <td>Mark as current page</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Basic Breadcrumbs"
          description="Simple breadcrumb navigation trail"
          code={basicBreadcrumbsCode}
        >
          <BasicBreadcrumbsDemo />
        </LiveDemo>
        <pre className="docs-code">{`import { LuminoBreadcrumbs } from "lumino/react";

function BasicBreadcrumbs() {
  return (
    <LuminoBreadcrumbs>
      <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item href="/products">Products</LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item href="/products/electronics">
        Electronics
      </LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item current>Smartphones</LuminoBreadcrumbs.Item>
    </LuminoBreadcrumbs>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Icons</h2>
        <pre className="docs-code">{`function BreadcrumbsWithIcons() {
  return (
    <LuminoBreadcrumbs>
      <LuminoBreadcrumbs.Item href="/" icon={<LuminoIcon name="home" />}>
        Home
      </LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item href="/settings" icon={<LuminoIcon name="settings" />}>
        Settings
      </LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item current icon={<LuminoIcon name="user" />}>
        Profile
      </LuminoBreadcrumbs.Item>
    </LuminoBreadcrumbs>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom Separator</h2>
        <LiveDemo
          title="Custom Separators"
          description="Different separator styles"
          code={customSeparatorCode}
        >
          <CustomSeparatorDemo />
        </LiveDemo>
        <pre className="docs-code">{`// Arrow separator
<LuminoBreadcrumbs separator="›">
  <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item href="/docs">Docs</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item current>Guide</LuminoBreadcrumbs.Item>
</LuminoBreadcrumbs>

// Chevron separator
<LuminoBreadcrumbs separator={<LuminoIcon name="chevron-right" size="sm" />}>
  <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item href="/docs">Docs</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item current>Guide</LuminoBreadcrumbs.Item>
</LuminoBreadcrumbs>

// Dot separator
<LuminoBreadcrumbs separator="•">
  <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item href="/docs">Docs</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item current>Guide</LuminoBreadcrumbs.Item>
</LuminoBreadcrumbs>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Collapsed Breadcrumbs</h2>
        <pre className="docs-code">{`function CollapsedBreadcrumbs() {
  return (
    <LuminoBreadcrumbs
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
    >
      <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item href="/products">Products</LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item href="/products/electronics">
        Electronics
      </LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item href="/products/electronics/phones">
        Phones
      </LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item href="/products/electronics/phones/smartphones">
        Smartphones
      </LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item current>iPhone 15 Pro</LuminoBreadcrumbs.Item>
    </LuminoBreadcrumbs>
  );
  // Renders: Home / ... / Smartphones / iPhone 15 Pro
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Router Integration</h2>
        <pre className="docs-code">{`import { useRouter } from "lumino/react";

function RouterBreadcrumbs() {
  const router = useRouter();

  // Parse current route into breadcrumb items
  const pathSegments = router.currentRoute.split("/").filter(Boolean);

  return (
    <LuminoBreadcrumbs>
      <LuminoBreadcrumbs.Item
        href="/"
        onClick={() => router.navigate("/")}
      >
        Home
      </LuminoBreadcrumbs.Item>

      {pathSegments.map((segment, index) => {
        const path = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <LuminoBreadcrumbs.Item
            key={path}
            href={isLast ? undefined : path}
            onClick={isLast ? undefined : () => router.navigate(path)}
            current={isLast}
          >
            {label}
          </LuminoBreadcrumbs.Item>
        );
      })}
    </LuminoBreadcrumbs>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Dynamic Breadcrumbs</h2>
        <pre className="docs-code">{`function DynamicBreadcrumbs({ items }) {
  const router = useRouter();

  return (
    <LuminoBreadcrumbs>
      {items.map((item, index) => (
        <LuminoBreadcrumbs.Item
          key={item.path}
          href={index < items.length - 1 ? item.path : undefined}
          onClick={() => index < items.length - 1 && router.navigate(item.path)}
          icon={item.icon}
          current={index === items.length - 1}
        >
          {item.label}
        </LuminoBreadcrumbs.Item>
      ))}
    </LuminoBreadcrumbs>
  );
}

// Usage
<DynamicBreadcrumbs
  items={[
    { path: "/", label: "Home", icon: "home" },
    { path: "/users", label: "Users", icon: "users" },
    { path: "/users/123", label: "John Doe" },
  ]}
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Breadcrumb Sizes</h2>
        <pre className="docs-code">{`// Small
<LuminoBreadcrumbs size="sm">
  <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item current>Page</LuminoBreadcrumbs.Item>
</LuminoBreadcrumbs>

// Medium (default)
<LuminoBreadcrumbs size="md">
  <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item current>Page</LuminoBreadcrumbs.Item>
</LuminoBreadcrumbs>

// Large
<LuminoBreadcrumbs size="lg">
  <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item current>Page</LuminoBreadcrumbs.Item>
</LuminoBreadcrumbs>`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Page Builder</h2>
        <pre className="docs-code">{`class ProductDetailPage extends Page {
  configure() {
    this.setTitle("Product Details");

    // Auto-generate breadcrumbs from route
    this.addBreadcrumbs()
      .auto()  // Auto-generate from route hierarchy
      .endBreadcrumbs();

    // Or manually configure
    this.addBreadcrumbs()
      .addItem("Home", "/")
      .addItem("Products", "/products")
      .addItem(() => this.getProductCategory(), () => this.getCategoryPath())
      .addItem(() => this.getProductName())  // Current page, no link
      .separator("›")
      .endBreadcrumbs();

    // Page content
    this.addComponent(ProductDetails)
      .dataBind("product")
      .endComponent();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Dropdown for Long Paths</h2>
        <pre className="docs-code">{`function BreadcrumbsWithDropdown() {
  const middleItems = [
    { path: "/products", label: "Products" },
    { path: "/products/electronics", label: "Electronics" },
    { path: "/products/electronics/phones", label: "Phones" },
  ];

  return (
    <LuminoBreadcrumbs>
      <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>

      <LuminoMenu
        trigger={
          <LuminoBreadcrumbs.Item as="button">
            ...
          </LuminoBreadcrumbs.Item>
        }
      >
        {middleItems.map((item) => (
          <LuminoMenu.Item key={item.path} href={item.path}>
            {item.label}
          </LuminoMenu.Item>
        ))}
      </LuminoMenu>

      <LuminoBreadcrumbs.Item href="/products/electronics/phones/smartphones">
        Smartphones
      </LuminoBreadcrumbs.Item>
      <LuminoBreadcrumbs.Item current>iPhone 15 Pro</LuminoBreadcrumbs.Item>
    </LuminoBreadcrumbs>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// Breadcrumbs are wrapped in a nav element with aria-label
<LuminoBreadcrumbs aria-label="Breadcrumb navigation">
  <LuminoBreadcrumbs.Item href="/">Home</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item href="/docs">Documentation</LuminoBreadcrumbs.Item>
  <LuminoBreadcrumbs.Item current aria-current="page">
    Getting Started
  </LuminoBreadcrumbs.Item>
</LuminoBreadcrumbs>

// Renders:
// <nav aria-label="Breadcrumb navigation">
//   <ol>
//     <li><a href="/">Home</a></li>
//     <li aria-hidden="true">/</li>
//     <li><a href="/docs">Documentation</a></li>
//     <li aria-hidden="true">/</li>
//     <li aria-current="page">Getting Started</li>
//   </ol>
// </nav>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Always include Home</strong> - Start with a link to the
            homepage
          </li>
          <li>
            <strong>Current page not clickable</strong> - The last item should
            not be a link
          </li>
          <li>
            <strong>Keep labels short</strong> - Truncate long labels if needed
          </li>
          <li>
            <strong>Collapse long paths</strong> - Use maxItems for deep
            hierarchies
          </li>
          <li>
            <strong>Match page titles</strong> - Breadcrumb labels should match
            their page titles
          </li>
        </ul>
      </div>
    </div>
  );
}
