import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["lumino/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "lumino/core/utils/visibility.ts",
        "lumino/core/context/FormContextImpl.ts",
        "lumino/core/form/Form.ts",
        "lumino/core/types/ui.ts",
        "lumino/ui/salt/normalizers.ts",
        "lumino/ui/salt/styles.ts",
        "lumino/ui/salt/SaltAdapter.ts",
      ],
      exclude: [
        "lumino/core/index.ts",
        "**/*.test.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@lumino/core": "/Users/jags/Desktop/lumino/lumino/core",
      "@lumino/react": "/Users/jags/Desktop/lumino/lumino/react",
      "@lumino/ui": "/Users/jags/Desktop/lumino/lumino/ui",
    },
  },
});
