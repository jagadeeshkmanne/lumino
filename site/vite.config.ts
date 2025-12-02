import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "lumino/core": path.resolve(__dirname, "../lumino/core"),
      "lumino/react": path.resolve(__dirname, "../lumino/react"),
      "lumino/adapters/salt": path.resolve(__dirname, "../lumino/adapters/salt"),
      "lumino": path.resolve(__dirname, "../lumino"),
      // Resolve Salt packages from site's node_modules for the lumino folder
      "@salt-ds/core": path.resolve(__dirname, "node_modules/@salt-ds/core"),
      "@salt-ds/lab": path.resolve(__dirname, "node_modules/@salt-ds/lab"),
      "@salt-ds/icons": path.resolve(__dirname, "node_modules/@salt-ds/icons"),
      "@salt-ds/theme": path.resolve(__dirname, "node_modules/@salt-ds/theme"),
    },
  },
});
