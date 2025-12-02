/**
 * Salt Setup Page
 *
 * Step-by-step guide for setting up the Salt adapter.
 */

import React from "react";

export function SaltSetupPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Salt Adapter Setup</h1>
      <p className="docs-page-subtitle">
        Complete guide to installing and configuring the Salt Design System adapter.
      </p>

      <div className="docs-section">
        <h2>Prerequisites</h2>
        <p>
          Before setting up the Salt adapter, ensure you have:
        </p>
        <ul className="docs-list">
          <li>Node.js 16+ and npm/yarn/pnpm</li>
          <li>React 18+</li>
          <li>Lumino installed in your project</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Step 1: Install Dependencies</h2>
        <p>
          Install the Salt Design System packages:
        </p>
        <pre className="docs-code">
{`# Using npm
npm install @salt-ds/core @salt-ds/theme @salt-ds/icons @salt-ds/lab

# Using yarn
yarn add @salt-ds/core @salt-ds/theme @salt-ds/icons @salt-ds/lab

# Using pnpm
pnpm add @salt-ds/core @salt-ds/theme @salt-ds/icons @salt-ds/lab`}</pre>

        <div className="docs-note">
          <strong>Note:</strong> The Salt adapter is included with Lumino. You only need to install
          Salt's packages, not a separate adapter package.
        </div>
      </div>

      <div className="docs-section">
        <h2>Step 2: Import Salt Styles</h2>
        <p>
          Add Salt's CSS to your application entry point:
        </p>
        <pre className="docs-code">
{`// main.tsx or App.tsx
import "@salt-ds/theme/index.css";

// Optional: Include Salt icons CSS if using icons
import "@salt-ds/icons/dist/salt-icons.css";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Step 3: Wrap App with SaltProvider</h2>
        <p>
          Wrap your application with <code>SaltProvider</code> to enable theming:
        </p>
        <pre className="docs-code">
{`import React from "react";
import { SaltProvider } from "@salt-ds/core";
import { App } from "./App";

function Root() {
  return (
    <SaltProvider mode="light" density="medium">
      <App />
    </SaltProvider>
  );
}

export default Root;`}</pre>

        <h3>SaltProvider Props</h3>
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
              <td><code>mode</code></td>
              <td>"light" | "dark"</td>
              <td>"light"</td>
              <td>Theme mode</td>
            </tr>
            <tr>
              <td><code>density</code></td>
              <td>"high" | "medium" | "low" | "touch"</td>
              <td>"medium"</td>
              <td>Component density/spacing</td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td>ThemeDefinition</td>
              <td>-</td>
              <td>Custom theme object</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Step 4: Register Salt Adapter</h2>
        <p>
          Register the Salt adapter with Lumino:
        </p>
        <pre className="docs-code">
{`import { Lumino } from "lumino";
import { saltAdapter } from "lumino/adapters/salt";

// Register Salt as the UI adapter
Lumino.ui(saltAdapter);

// Or let Lumino auto-register (Salt is default)
import "lumino/adapters/salt";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Complete Setup Example</h2>
        <p>
          Here's a complete example showing all setup steps together:
        </p>
        <pre className="docs-code">
{`// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { SaltProvider } from "@salt-ds/core";
import { Lumino } from "lumino";
import { saltAdapter } from "lumino/adapters/salt";

// Import Salt styles
import "@salt-ds/theme/index.css";

// Import your app
import { App } from "./App";

// Register Salt adapter
Lumino.ui(saltAdapter);

// Render
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SaltProvider mode="light" density="medium">
      <App />
    </SaltProvider>
  </React.StrictMode>
);`}</pre>
      </div>

      <div className="docs-section">
        <h2>Verify Installation</h2>
        <p>
          Create a simple form to verify everything is working:
        </p>
        <pre className="docs-code">
{`// TestForm.tsx
import { Form } from "lumino/core";

class TestEntity {
  name = "";
}

class TestForm extends Form<TestEntity> {
  constructor() {
    super("test-form");
  }

  configure() {
    this.addSection("Test")
      .addRow()
        .addField("name")
          .component("TextInput")
          .label("Name")
          .placeholder("Enter your name")
          .endField()
      .endRow()
    .endSection();
  }
}

// App.tsx
import { FormRenderer } from "lumino/react";
import { TestForm } from "./TestForm";

export function App() {
  return (
    <div>
      <h1>Salt Adapter Test</h1>
      <FormRenderer form={new TestForm()} entity={new TestEntity()} />
    </div>
  );
}`}</pre>

        <p>
          If you see a styled Salt input field, the setup is complete!
        </p>
      </div>

      <div className="docs-section">
        <h2>Theme Customization</h2>
        <p>
          Customize Salt's theme to match your brand:
        </p>

        <h3>Using Built-in Themes</h3>
        <pre className="docs-code">
{`import { SaltProvider } from "@salt-ds/core";

// Light theme
<SaltProvider mode="light">...</SaltProvider>

// Dark theme
<SaltProvider mode="dark">...</SaltProvider>

// Different densities
<SaltProvider density="high">...</SaltProvider>    // Compact
<SaltProvider density="medium">...</SaltProvider>  // Default
<SaltProvider density="low">...</SaltProvider>     // Spacious
<SaltProvider density="touch">...</SaltProvider>   // Touch-optimized`}</pre>

        <h3>Dynamic Theme Switching</h3>
        <pre className="docs-code">
{`import { useState } from "react";
import { SaltProvider } from "@salt-ds/core";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <SaltProvider mode={theme}>
      <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
        Toggle Theme
      </button>
      {/* Your app */}
    </SaltProvider>
  );
}`}</pre>

        <h3>Custom Theme</h3>
        <pre className="docs-code">
{`import { SaltProvider } from "@salt-ds/core";

const customTheme = {
  name: "MyTheme",
  mode: "light",
  color: {
    action: {
      primary: "#0066CC",
      secondary: "#6C757D"
    },
    status: {
      error: "#DC3545",
      warning: "#FFC107",
      success: "#28A745",
      info: "#17A2B8"
    }
  }
};

<SaltProvider theme={customTheme}>
  {/* Your app with custom theme */}
</SaltProvider>`}</pre>
      </div>

      <div className="docs-section">
        <h2>TypeScript Configuration</h2>
        <p>
          Ensure your <code>tsconfig.json</code> includes proper settings:
        </p>
        <pre className="docs-code">
{`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Vite Configuration</h2>
        <p>
          If using Vite, add this to <code>vite.config.ts</code>:
        </p>
        <pre className="docs-code">
{`import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@salt-ds/core",
      "@salt-ds/theme",
      "@salt-ds/icons",
      "@salt-ds/lab"
    ]
  }
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Troubleshooting</h2>

        <h3>Styles Not Appearing</h3>
        <p>
          If components render without styles:
        </p>
        <ul className="docs-list">
          <li>Verify <code>@salt-ds/theme/index.css</code> is imported</li>
          <li>Check that <code>SaltProvider</code> wraps your app</li>
          <li>Clear your build cache and restart dev server</li>
        </ul>

        <h3>Type Errors</h3>
        <p>
          If you encounter TypeScript errors:
        </p>
        <ul className="docs-list">
          <li>Ensure all Salt packages are the same version</li>
          <li>Run <code>npm install</code> to update dependencies</li>
          <li>Check that <code>skipLibCheck: true</code> in tsconfig.json</li>
        </ul>

        <h3>Components Not Found</h3>
        <p>
          If component resolution fails:
        </p>
        <ul className="docs-list">
          <li>Verify the adapter is registered: <code>Lumino.ui(saltAdapter)</code></li>
          <li>Check component name spelling (case-sensitive)</li>
          <li>Import the component directly if needed</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Production Optimization</h2>
        <p>
          For production builds, consider these optimizations:
        </p>
        <ul className="docs-list">
          <li>
            <strong>Tree Shaking</strong> - Import only components you use
          </li>
          <li>
            <strong>CSS Purging</strong> - Remove unused Salt CSS (use PurgeCSS carefully)
          </li>
          <li>
            <strong>Icon Subsetting</strong> - Import only needed icons from @salt-ds/icons
          </li>
          <li>
            <strong>Code Splitting</strong> - Lazy load forms and components
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li>
            <a href="#/adapters/salt-overview">Salt Overview</a> - Learn about Salt adapter architecture
          </li>
          <li>
            <a href="#/adapters/salt-components">Salt Components</a> - Browse available components
          </li>
          <li>
            <a href="#/quick-start">Quick Start</a> - Build your first Lumino form
          </li>
        </ul>
      </div>
    </div>
  );
}
