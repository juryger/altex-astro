/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true, // Makes describe, it, expect available globally
    //qenvironment: "jsdom",
    // setupFiles: ['./src/test-setup.ts'],
    exclude: ["**/node_modules/**", "**/dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/"],
    },
  },
});
