/**
 * Navbar Component Page
 *
 * Documents the LuminoNavbar component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";

function NavbarDemo() {
  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '8px'
    }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: '12px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '6px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#6366f1',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>L</div>
          <span style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937'
          }}>My App</span>
        </div>

        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <a href="#" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Home</a>
          <a href="#" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Features</a>
          <a href="#" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Pricing</a>
          <a href="#" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>About</a>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>Login</button>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>Sign Up</button>
        </div>
      </nav>
    </div>
  );
}

export function NavbarPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Navbar</h1>
      <p className="docs-page-subtitle">
        A top navigation bar component for app headers with branding, links,
        and action items.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Live Demo</h2>
        <LiveDemo code={`function NavbarDemo() {
  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '8px'
    }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: '12px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '6px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#6366f1',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>L</div>
          <span style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937'
          }}>My App</span>
        </div>

        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <a href="#" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Home</a>
          <a href="#" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Features</a>
          <a href="#" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Pricing</a>
          <a href="#" style={{
            color: '#4b5563',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>About</a>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>Login</button>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>Sign Up</button>
        </div>
      </nav>
    </div>
  );
}`}>
          <NavbarDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoNavbar } from "lumino/react";`}</pre>
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
                <code>position</code>
              </td>
              <td>"static" | "fixed" | "sticky"</td>
              <td>"static"</td>
              <td>Navbar positioning</td>
            </tr>
            <tr>
              <td>
                <code>variant</code>
              </td>
              <td>"default" | "transparent" | "colored"</td>
              <td>"default"</td>
              <td>Visual variant</td>
            </tr>
            <tr>
              <td>
                <code>height</code>
              </td>
              <td>"sm" | "md" | "lg"</td>
              <td>"md"</td>
              <td>Navbar height</td>
            </tr>
            <tr>
              <td>
                <code>shadow</code>
              </td>
              <td>boolean</td>
              <td>true</td>
              <td>Show bottom shadow</td>
            </tr>
            <tr>
              <td>
                <code>bordered</code>
              </td>
              <td>boolean</td>
              <td>false</td>
              <td>Show bottom border</td>
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
                <code>LuminoNavbar.Brand</code>
              </td>
              <td>Logo and app name section (left)</td>
            </tr>
            <tr>
              <td>
                <code>LuminoNavbar.Links</code>
              </td>
              <td>Navigation links container (center)</td>
            </tr>
            <tr>
              <td>
                <code>LuminoNavbar.Actions</code>
              </td>
              <td>Action buttons and menus (right)</td>
            </tr>
            <tr>
              <td>
                <code>LuminoNavbar.Toggle</code>
              </td>
              <td>Mobile menu toggle button</td>
            </tr>
            <tr>
              <td>
                <code>LuminoNavbar.Menu</code>
              </td>
              <td>Collapsible menu for mobile</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoNavbar, LuminoLink } from "lumino/react";

function BasicNavbar() {
  return (
    <LuminoNavbar>
      <LuminoNavbar.Brand>
        <img src="/logo.svg" alt="Logo" height={32} />
        <span>My App</span>
      </LuminoNavbar.Brand>

      <LuminoNavbar.Links>
        <LuminoLink href="/">Home</LuminoLink>
        <LuminoLink href="/features">Features</LuminoLink>
        <LuminoLink href="/pricing">Pricing</LuminoLink>
        <LuminoLink href="/about">About</LuminoLink>
      </LuminoNavbar.Links>

      <LuminoNavbar.Actions>
        <LuminoButton variant="secondary">Login</LuminoButton>
        <LuminoButton variant="primary">Sign Up</LuminoButton>
      </LuminoNavbar.Actions>
    </LuminoNavbar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With User Menu</h2>
        <pre className="docs-code">{`function NavbarWithUserMenu() {
  const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" });

  const handleLogout = () => {
    // Handle logout
  };

  return (
    <LuminoNavbar>
      <LuminoNavbar.Brand>
        <img src="/logo.svg" alt="Logo" />
        <span>Dashboard</span>
      </LuminoNavbar.Brand>

      <LuminoNavbar.Links>
        <LuminoLink href="/dashboard">Dashboard</LuminoLink>
        <LuminoLink href="/projects">Projects</LuminoLink>
        <LuminoLink href="/reports">Reports</LuminoLink>
      </LuminoNavbar.Links>

      <LuminoNavbar.Actions>
        <LuminoIconButton icon="bell" badge={3} />
        <LuminoIconButton icon="help" />

        <LuminoMenu
          trigger={
            <LuminoAvatar
              name={user.name}
              size="sm"
              cursor="pointer"
            />
          }
        >
          <LuminoMenu.Header>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </LuminoMenu.Header>
          <LuminoMenu.Divider />
          <LuminoMenu.Item icon="user" href="/profile">
            Profile
          </LuminoMenu.Item>
          <LuminoMenu.Item icon="settings" href="/settings">
            Settings
          </LuminoMenu.Item>
          <LuminoMenu.Divider />
          <LuminoMenu.Item icon="logout" onClick={handleLogout}>
            Logout
          </LuminoMenu.Item>
        </LuminoMenu>
      </LuminoNavbar.Actions>
    </LuminoNavbar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Fixed Position</h2>
        <pre className="docs-code">{`// Fixed navbar that stays at top
<LuminoNavbar position="fixed">
  <LuminoNavbar.Brand>
    <span>Fixed Navbar</span>
  </LuminoNavbar.Brand>
  {/* ... */}
</LuminoNavbar>

// Add padding to body to account for fixed navbar
<style>
  body {
    padding-top: 64px; /* Height of navbar */
  }
</style>

// Or use sticky positioning
<LuminoNavbar position="sticky">
  <LuminoNavbar.Brand>
    <span>Sticky Navbar</span>
  </LuminoNavbar.Brand>
  {/* ... */}
</LuminoNavbar>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Responsive Navbar</h2>
        <pre className="docs-code">{`function ResponsiveNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <LuminoNavbar>
      <LuminoNavbar.Brand>
        <img src="/logo.svg" alt="Logo" />
        <span>My App</span>
      </LuminoNavbar.Brand>

      {/* Desktop Links - hidden on mobile */}
      <LuminoNavbar.Links className="hide-mobile">
        <LuminoLink href="/">Home</LuminoLink>
        <LuminoLink href="/features">Features</LuminoLink>
        <LuminoLink href="/pricing">Pricing</LuminoLink>
      </LuminoNavbar.Links>

      {/* Desktop Actions - hidden on mobile */}
      <LuminoNavbar.Actions className="hide-mobile">
        <LuminoButton>Login</LuminoButton>
      </LuminoNavbar.Actions>

      {/* Mobile Toggle - visible on mobile only */}
      <LuminoNavbar.Toggle
        className="show-mobile"
        open={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Mobile Menu */}
      <LuminoNavbar.Menu open={mobileMenuOpen}>
        <LuminoLink href="/">Home</LuminoLink>
        <LuminoLink href="/features">Features</LuminoLink>
        <LuminoLink href="/pricing">Pricing</LuminoLink>
        <LuminoButton fullWidth>Login</LuminoButton>
      </LuminoNavbar.Menu>
    </LuminoNavbar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Navbar Variants</h2>
        <pre className="docs-code">{`// Default - solid background
<LuminoNavbar variant="default">
  {/* ... */}
</LuminoNavbar>

// Transparent - for hero sections
<LuminoNavbar variant="transparent">
  {/* ... */}
</LuminoNavbar>

// Colored - with brand color
<LuminoNavbar variant="colored" color="primary">
  {/* ... */}
</LuminoNavbar>`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Search</h2>
        <pre className="docs-code">{`function NavbarWithSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <LuminoNavbar>
      <LuminoNavbar.Brand>
        <span>My App</span>
      </LuminoNavbar.Brand>

      <LuminoNavbar.Links>
        <LuminoTextInput
          placeholder="Search..."
          value={searchQuery}
          onChange={setSearchQuery}
          leftIcon="search"
          size="sm"
          style={{ width: 300 }}
        />
      </LuminoNavbar.Links>

      <LuminoNavbar.Actions>
        <LuminoButton>Sign In</LuminoButton>
      </LuminoNavbar.Actions>
    </LuminoNavbar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Dropdown Navigation</h2>
        <pre className="docs-code">{`function NavbarWithDropdowns() {
  return (
    <LuminoNavbar>
      <LuminoNavbar.Brand>
        <span>My App</span>
      </LuminoNavbar.Brand>

      <LuminoNavbar.Links>
        <LuminoLink href="/">Home</LuminoLink>

        <LuminoMenu
          trigger={<LuminoLink>Products ▾</LuminoLink>}
          position="bottom-start"
        >
          <LuminoMenu.Item href="/products/software">Software</LuminoMenu.Item>
          <LuminoMenu.Item href="/products/hardware">Hardware</LuminoMenu.Item>
          <LuminoMenu.Item href="/products/services">Services</LuminoMenu.Item>
        </LuminoMenu>

        <LuminoMenu
          trigger={<LuminoLink>Resources ▾</LuminoLink>}
          position="bottom-start"
        >
          <LuminoMenu.Item href="/docs">Documentation</LuminoMenu.Item>
          <LuminoMenu.Item href="/tutorials">Tutorials</LuminoMenu.Item>
          <LuminoMenu.Item href="/blog">Blog</LuminoMenu.Item>
        </LuminoMenu>

        <LuminoLink href="/pricing">Pricing</LuminoLink>
      </LuminoNavbar.Links>

      <LuminoNavbar.Actions>
        <LuminoButton>Get Started</LuminoButton>
      </LuminoNavbar.Actions>
    </LuminoNavbar>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In App Builder</h2>
        <pre className="docs-code">{`class MyApp extends App {
  configure() {
    this.setTitle("My Application");

    // Configure navbar
    this.addNavbar()
      .brand()
        .logo("/logo.svg")
        .title("My App")
        .endBrand()
      .addLink("Home", "/")
      .addLink("Features", "/features")
      .addLink("Pricing", "/pricing")
      .addAction()
        .button("Login")
          .variant("secondary")
          .onClick(() => this.navigate("/login"))
        .endButton()
        .button("Sign Up")
          .variant("primary")
          .onClick(() => this.navigate("/signup"))
        .endButton()
      .endAction()
    .endNavbar();

    // Configure pages...
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Keep it simple</strong> - Limit to 5-7 main navigation items
          </li>
          <li>
            <strong>Prioritize actions</strong> - Place primary CTA on the right
          </li>
          <li>
            <strong>Mobile-first</strong> - Design mobile navigation before
            desktop
          </li>
          <li>
            <strong>Consistent branding</strong> - Include logo for brand
            recognition
          </li>
          <li>
            <strong>Clear hierarchy</strong> - Group related links logically
          </li>
        </ul>
      </div>
    </div>
  );
}
