// got it from here https://gist.github.com/0x80/586283af54ff2b8a436a01a4b62bcea6
import { builtinModules } from "node:module";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { dependencies, name } from "./package.json";

/**
 * Core modules could be imported in two ways, with or without the `node:`
 * specifier, so we create a list of all possible core modules.
 */
const allCoreModules = builtinModules.flatMap((moduleName) => [
  moduleName,
  `node:${moduleName}`,
]);

const globalsForAllCoreModules = allCoreModules.reduce(
  (acc, moduleName) => {
    const [prefix, namePart] = moduleName.split(":");
    acc[moduleName] = prefix === "node" ? namePart : moduleName;
    return acc;
  },
  {} as Record<string, string>,
);
//console.log("globalsForAllCoreModules", globalsForAllCoreModules);

/**
 * Extract the external dependencies but keep monorepo workspace packages as part of
 * the bundle.
 */
const externalDependencies = Object.entries(dependencies)
  .filter(([, value]) => value !== "workspace:*")
  .map(([key]) => key);
//console.log("externalDependencies", externalDependencies);

export default defineConfig({
  root: "src",
  build: {
    target: ["node22"],
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name,
      fileName: "index",
      formats: ["es"],
    },
    sourcemap: true,
    outDir: "../dist",
    emptyOutDir: true,
    polyfillModulePreload: false,
    rollupOptions: {
      input: resolve(__dirname, "src/index.ts"),
      external: [...allCoreModules, ...externalDependencies],
      output: {
        globals: globalsForAllCoreModules,
        codeSplitting: false,
      },
    },
  },
  resolve: {
    alias: {
      "@/": new URL("../../", import.meta.url).pathname,
      "@/lib": new URL("../../lib", import.meta.url).pathname,
      "@/lib/domain": new URL("../../lib/domain", import.meta.url).pathname,
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"', // Inject environment variables
  },
});
