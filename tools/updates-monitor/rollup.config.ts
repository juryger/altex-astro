import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

//const isDev =
//  process.env.ROLLUP_WATCH === "true" || process.env.BUILD_MODE === "dev";

export default {
  input: "./src/index.ts",
  output: {
    file: "./dist/index.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    alias({
      entries: [
        {
          find: "@/lib/domain",
          replacement: new URL("../../lib/domain/dist", import.meta.url)
            .pathname,
        },
        {
          find: "@/lib/dal",
          replacement: new URL("../../lib/dal/dist", import.meta.url).pathname,
        },
        {
          find: "@/lib/cqrs",
          replacement: new URL("../../lib/cqrs/dist", import.meta.url).pathname,
        },
        {
          find: "@/lib/email",
          replacement: new URL("../../lib/email/dist", import.meta.url)
            .pathname,
        },
      ],
    }),
    typescript({
      compilerOptions: {
        module: "es2022",
        sourceMap: false,
      },
      tsconfig: "./tsconfig.json",
      sourceMap: false,
    }),
    resolve(),
    //terser(),
  ],
  external: [
    "zod",
    "unzipper",
    "drizzle-orm",
    "better-sqlite3",
    "googleapis",
    "handlebars",
    "nodemailer",
  ],
};
