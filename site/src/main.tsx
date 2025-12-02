/**
 * Lumino Documentation Site - Entry Point
 *
 * Uses LuminoRouter at the root level so AppLayoutRenderer can access router context.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { SaltProvider } from "@salt-ds/core";
import { LuminoProvider, DialogProvider, LuminoRouter } from "lumino/react";
import { getLuminoApp } from "./demo/app";
import { App } from "./App";

import "@salt-ds/theme/index.css";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SaltProvider>
      <LuminoProvider app={getLuminoApp()}>
        <DialogProvider>
          <LuminoRouter>
            <App />
          </LuminoRouter>
        </DialogProvider>
      </LuminoProvider>
    </SaltProvider>
  </React.StrictMode>
);
