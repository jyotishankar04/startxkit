import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/cli.ts"],
  dts: true,
  sourcemap: true,
  clean: true,
  format: ["esm"],
  shims: true,
});
