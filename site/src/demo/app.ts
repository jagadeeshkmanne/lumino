/**
 * Lumino Site - App Configuration
 *
 * Main app configuration for the documentation site demo.
 */

import { App as AppBase } from "lumino/core";
import { saltAdapter } from "lumino/adapters/salt";
import { FormBuilderPage } from "./pages/FormBuilderPage";

class App extends AppBase {
  configure() {
    this.baseUrl("http://localhost:5175")
      .environment("development")
      .locale("en")
      .theme("light");

    this.adapter(saltAdapter as any);

    // Routes - use /demos prefix to match sidebar navigation
    this.routes([
      { path: "/demos/form-builder", page: FormBuilderPage },
      { path: "/demos/form-builder/:mode?", page: FormBuilderPage },
    ]);
  }
}

export const app = new App();
export const getLuminoApp = () => app.getLuminoApp();
