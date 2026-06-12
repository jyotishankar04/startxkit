import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsdown";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function copyTemplates() {
  const src = path.resolve(__dirname, "..", "templates");
  const dest = path.resolve(__dirname, "dist", "templates");
  await fs.copy(src, dest, { overwrite: true });
}

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  clean: true,
  format: ["esm"],
  onSuccess: copyTemplates,
});
