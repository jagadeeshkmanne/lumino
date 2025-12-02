/**
 * Installation Page
 *
 * Documents how to install and set up Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function InstallationPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Installation</h1>
      <p className="docs-page-subtitle">
        Get started with Lumino in your React project. This guide covers installation,
        basic setup, and project configuration.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code
        and package configuration.
      </div>

      <div className="docs-section">
        <h2>Prerequisites</h2>
        <ul className="docs-list">
          <li><strong>Node.js</strong> 18.0 or higher</li>
          <li><strong>React</strong> 18.0 or higher</li>
          <li><strong>TypeScript</strong> 5.0 or higher (recommended)</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Installation</h2>
        <p>Install Lumino using npm or yarn:</p>
        <pre className="docs-code">{`# Using npm
npm install lumino

# Using yarn
yarn add lumino

# Using pnpm
pnpm add lumino`}</pre>
      </div>

      <div className="docs-section">
        <h2>Project Setup</h2>

        <h3>1. Create Your App Entry</h3>
        <pre className="docs-code">{`// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createApp, LuminoProvider } from "lumino/react";
import { App } from "./App";

// Create the Lumino app instance
const app = createApp({
  name: "My App",
  version: "1.0.0",
  baseUrl: "/api",  // API base URL
  defaultLocale: "en",
  defaultTheme: "light",
});

// Mount the app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LuminoProvider app={app}>
      <App />
    </LuminoProvider>
  </React.StrictMode>
);`}</pre>

        <h3>2. Create Your App Component</h3>
        <pre className="docs-code">{`// src/App.tsx
import { LuminoRouter } from "lumino/react";

export function App() {
  return (
    <div className="app">
      <LuminoRouter />
    </div>
  );
}`}</pre>

        <h3>3. TypeScript Configuration</h3>
        <p>Ensure your <code>tsconfig.json</code> includes these settings:</p>
        <pre className="docs-code">{`{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "lumino/*": ["./node_modules/lumino/*"]
    }
  },
  "include": ["src"]
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Package Exports</h2>
        <p>Lumino provides multiple entry points for different use cases:</p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Import Path</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>lumino/core</code></td>
              <td>Core classes: Form, Page, Api, Validators, etc.</td>
            </tr>
            <tr>
              <td><code>lumino/react</code></td>
              <td>React components: LuminoProvider, FormRenderer, all UI components</td>
            </tr>
            <tr>
              <td><code>lumino/types</code></td>
              <td>TypeScript types and interfaces</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Import Examples</h2>
        <pre className="docs-code">{`// Core classes
import { Form, Page, Api, Validators } from "lumino/core";

// React components and hooks
import {
  LuminoProvider,
  LuminoRouter,
  FormRenderer,
  useRouter,
  useLumino,
  LuminoTextInput,
  LuminoSelect,
  LuminoButton,
} from "lumino/react";

// Types (for TypeScript)
import type {
  FormContext,
  PageContext,
  AppContext,
  UserContext,
} from "lumino/core";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Development Setup</h2>
        <p>For development with hot reloading:</p>
        <pre className="docs-code">{`# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck`}</pre>
      </div>

      <div className="docs-section">
        <h2>Vite Configuration</h2>
        <p>If using Vite, add Lumino to your configuration:</p>
        <pre className="docs-code">{`// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "lumino": path.resolve(__dirname, "./node_modules/lumino"),
    },
  },
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li>
            <strong>Quick Start Guide</strong> - Build your first form in minutes
          </li>
          <li>
            <strong>Core Concepts</strong> - Understand Lumino's architecture
          </li>
          <li>
            <strong>Form Builder</strong> - Create powerful forms with validation
          </li>
          <li>
            <strong>API Builder</strong> - Define type-safe API calls
          </li>
        </ul>
      </div>
    </div>
  );
}
