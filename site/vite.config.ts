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
    },
  },
});
