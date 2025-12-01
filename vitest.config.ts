import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["vitest/**/*.spec.ts"],
    exclude: ["dist/**", "node_modules/**"],
  },
});
