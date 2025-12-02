/**
 * Link Page
 *
 * Documents the LuminoLink component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const linkVariantsCode = `// Default link
<LuminoLink to="/home">Default Link</LuminoLink>

// Primary - emphasized link
<LuminoLink to="/signup" variant="primary">
  Primary Link
</LuminoLink>

// Secondary - less prominent
<LuminoLink to="/terms" variant="secondary">
  Secondary Link
</LuminoLink>

// Subtle - minimal styling
<LuminoLink to="/help" variant="subtle">
  Subtle Link
</LuminoLink>`;

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function LinkVariantsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}>
          Default Link
        </a>
      </div>
      <div>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#1565c0", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>
          Primary Link
        </a>
      </div>
      <div>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#666", textDecoration: "underline", cursor: "pointer" }}>
          Secondary Link
        </a>
      </div>
      <div>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#333", textDecoration: "none", cursor: "pointer" }}>
          Subtle Link
        </a>
      </div>
    </div>
  );
}

export function LinkPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Link</h1>
      <p className="docs-page-subtitle">
        A styled link component for navigation, both internal routing and
        external URLs, with consistent styling and accessibility.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoLink } from "lumino/react";`}</pre>
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
              <td><code>href</code></td>
              <td>string</td>
              <td>-</td>
              <td>Link destination</td>
            </tr>
            <tr>
              <td><code>to</code></td>
              <td>string</td>
              <td>-</td>
              <td>Internal route (uses Lumino router)</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td>"default" | "primary" | "secondary" | "subtle"</td>
              <td>"default"</td>
              <td>Visual style</td>
            </tr>
            <tr>
              <td><code>external</code></td>
              <td>boolean</td>
              <td>auto-detected</td>
              <td>Open in new tab</td>
            </tr>
            <tr>
              <td><code>disabled</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Disable the link</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td>ReactNode | string</td>
              <td>-</td>
              <td>Icon to display</td>
            </tr>
            <tr>
              <td><code>iconPosition</code></td>
              <td>"left" | "right"</td>
              <td>"left"</td>
              <td>Icon placement</td>
            </tr>
            <tr>
              <td><code>onClick</code></td>
              <td>(event: MouseEvent) =&gt; void</td>
              <td>-</td>
              <td>Click handler</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoLink } from "lumino/react";

function BasicLinks() {
  return (
    <div>
      {/* Internal link using Lumino router */}
      <LuminoLink to="/dashboard">Go to Dashboard</LuminoLink>

      {/* External link */}
      <LuminoLink href="https://example.com">Visit Example</LuminoLink>

      {/* Link with click handler */}
      <LuminoLink onClick={handleClick}>Click Me</LuminoLink>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Internal vs External Links</h2>
        <pre className="docs-code">{`// Internal routing (uses Lumino router, no page reload)
<LuminoLink to="/users">Users Page</LuminoLink>
<LuminoLink to="/users/123">User Details</LuminoLink>
<LuminoLink to="/settings?tab=profile">Profile Settings</LuminoLink>

// External links (opens in new tab by default)
<LuminoLink href="https://github.com">GitHub</LuminoLink>
<LuminoLink href="https://docs.example.com">Documentation</LuminoLink>

// Force external behavior for internal links
<LuminoLink to="/api/download" external>
  Download File
</LuminoLink>

// Force same-tab for external links
<LuminoLink href="https://example.com" external={false}>
  Partner Site
</LuminoLink>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Link Variants</h2>
        <p>Different visual styles for different purposes:</p>
        <LiveDemo
          title="Link Variants"
          description="Default, Primary, Secondary, Subtle"
          code={linkVariantsCode}
        >
          <LinkVariantsDemo />
        </LiveDemo>
        <pre className="docs-code">{`// Default - standard link color
<LuminoLink to="/home">Home</LuminoLink>

// Primary - emphasized link
<LuminoLink to="/signup" variant="primary">
  Sign Up Now
</LuminoLink>

// Secondary - less prominent
<LuminoLink to="/terms" variant="secondary">
  Terms of Service
</LuminoLink>

// Subtle - minimal styling
<LuminoLink to="/help" variant="subtle">
  Need help?
</LuminoLink>`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Icons</h2>
        <pre className="docs-code">{`// Icon on the left
<LuminoLink to="/settings" icon="settings">
  Settings
</LuminoLink>

// Icon on the right
<LuminoLink
  href="https://example.com"
  icon="external-link"
  iconPosition="right"
>
  External Site
</LuminoLink>

// Download link
<LuminoLink href="/files/report.pdf" icon="download">
  Download Report
</LuminoLink>

// Back navigation
<LuminoLink to="/users" icon="arrow-left">
  Back to Users
</LuminoLink>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Inline Links</h2>
        <pre className="docs-code">{`function InlineLinks() {
  return (
    <p>
      Please read our{" "}
      <LuminoLink to="/terms">Terms of Service</LuminoLink>
      {" "}and{" "}
      <LuminoLink to="/privacy">Privacy Policy</LuminoLink>
      {" "}before continuing.
    </p>
  );
}

function ArticleContent() {
  return (
    <article>
      <p>
        For more information, see the{" "}
        <LuminoLink href="https://docs.example.com" icon="external-link" iconPosition="right">
          official documentation
        </LuminoLink>.
      </p>
    </article>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Navigation Links</h2>
        <pre className="docs-code">{`function NavigationBar() {
  return (
    <nav className="nav-links">
      <LuminoLink to="/" variant="subtle">Home</LuminoLink>
      <LuminoLink to="/products" variant="subtle">Products</LuminoLink>
      <LuminoLink to="/about" variant="subtle">About</LuminoLink>
      <LuminoLink to="/contact" variant="subtle">Contact</LuminoLink>
    </nav>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, index) => (
        <span key={item.path}>
          {index > 0 && <span className="separator">/</span>}
          {index === items.length - 1 ? (
            <span className="current">{item.label}</span>
          ) : (
            <LuminoLink to={item.path} variant="subtle">
              {item.label}
            </LuminoLink>
          )}
        </span>
      ))}
    </nav>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Disabled Links</h2>
        <pre className="docs-code">{`// Disabled link (not clickable)
<LuminoLink to="/premium" disabled>
  Premium Features (Upgrade Required)
</LuminoLink>

// Conditionally disabled
<LuminoLink
  to="/admin"
  disabled={!hasAdminAccess}
>
  Admin Panel
</LuminoLink>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Link with onClick</h2>
        <pre className="docs-code">{`// Link-styled action (no navigation)
<LuminoLink onClick={handleLogout}>
  Log Out
</LuminoLink>

// Navigation with tracking
<LuminoLink
  to="/pricing"
  onClick={() => analytics.track("pricing_link_clicked")}
>
  View Pricing
</LuminoLink>

// Prevent navigation conditionally
<LuminoLink
  to="/next-step"
  onClick={(e) => {
    if (!formValid) {
      e.preventDefault();
      showError("Please complete the form first");
    }
  }}
>
  Continue
</LuminoLink>`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Tables</h2>
        <pre className="docs-code">{`const columns = [
  {
    key: "name",
    title: "Name",
    render: (value, row) => (
      <LuminoLink to={\`/users/\${row.id}\`}>
        {value}
      </LuminoLink>
    ),
  },
  {
    key: "email",
    title: "Email",
    render: (value) => (
      <LuminoLink href={\`mailto:\${value}\`} icon="mail">
        {value}
      </LuminoLink>
    ),
  },
  {
    key: "website",
    title: "Website",
    render: (value) => value ? (
      <LuminoLink href={value} external icon="external-link" iconPosition="right">
        {new URL(value).hostname}
      </LuminoLink>
    ) : null,
  },
];`}</pre>
      </div>

      <div className="docs-section">
        <h2>Link Groups</h2>
        <pre className="docs-code">{`function FooterLinks() {
  return (
    <footer>
      <div className="link-group">
        <h4>Product</h4>
        <LuminoLink to="/features">Features</LuminoLink>
        <LuminoLink to="/pricing">Pricing</LuminoLink>
        <LuminoLink to="/integrations">Integrations</LuminoLink>
      </div>

      <div className="link-group">
        <h4>Company</h4>
        <LuminoLink to="/about">About</LuminoLink>
        <LuminoLink to="/careers">Careers</LuminoLink>
        <LuminoLink to="/blog">Blog</LuminoLink>
      </div>

      <div className="link-group">
        <h4>Legal</h4>
        <LuminoLink to="/privacy">Privacy</LuminoLink>
        <LuminoLink to="/terms">Terms</LuminoLink>
        <LuminoLink to="/cookies">Cookies</LuminoLink>
      </div>
    </footer>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Page Builder</h2>
        <pre className="docs-code">{`class DashboardPage extends Page {
  configure() {
    this.setTitle("Dashboard");

    // Quick links section
    this.addSection("Quick Links")
      .addComponent(() => (
        <div className="quick-links">
          <LuminoLink to="/users/new" icon="user-plus" variant="primary">
            Create New User
          </LuminoLink>
          <LuminoLink to="/reports" icon="chart">
            View Reports
          </LuminoLink>
          <LuminoLink to="/settings" icon="settings">
            Settings
          </LuminoLink>
        </div>
      ))
    .endSection();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// External links should indicate they open new tabs
<LuminoLink
  href="https://example.com"
  external
  aria-label="Visit Example (opens in new tab)"
>
  Visit Example
</LuminoLink>

// Download links should indicate file type
<LuminoLink
  href="/files/report.pdf"
  aria-label="Download report (PDF, 2.3MB)"
>
  Download Report
</LuminoLink>

// Use descriptive link text
<LuminoLink to="/pricing">
  View pricing details  {/* Good: Descriptive */}
</LuminoLink>
// Avoid: "Click here" or "Read more"

// Links that trigger actions should be buttons
// Use onClick without href for non-navigation actions
<LuminoLink onClick={handleAction}>
  Perform Action  {/* Consider using LuminoButton instead */}
</LuminoLink>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use descriptive text</strong> - "View pricing" is better than
            "Click here"
          </li>
          <li>
            <strong>Indicate external links</strong> - Use icons or text to show
            links open in new tabs
          </li>
          <li>
            <strong>Use 'to' for internal routing</strong> - Provides better UX
            without page reloads
          </li>
          <li>
            <strong>Use buttons for actions</strong> - Links are for navigation,
            buttons are for actions
          </li>
          <li>
            <strong>Maintain focus visibility</strong> - Links should have clear
            focus indicators for keyboard users
          </li>
          <li>
            <strong>Consider underlines</strong> - Default links should be
            underlined or otherwise distinguishable from text
          </li>
        </ul>
      </div>
    </div>
  );
}
