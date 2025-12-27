import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    main: "src/main.ts",
  },
  format: [ "esm", "cjs" ],

  dts: true,
  sourcemap: true,

  treeshake: false,
  minify: false,
  clean: true,
});
