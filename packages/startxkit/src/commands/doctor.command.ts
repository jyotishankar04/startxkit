import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import { isStartXKitError, readConfig, validateConfig } from "@startxkit/core";

export async function doctorCommand(): Promise<void> {
  try {
    const cwd = process.cwd();
    const config = await readConfig(cwd);
    validateConfig(config);

    const checks = [
      ["startxkit.config.json", await fs.pathExists(path.join(cwd, "startxkit.config.json"))],
      ["package.json", await fs.pathExists(path.join(cwd, "package.json"))],
      ["module directory", await fs.pathExists(path.join(cwd, config.moduleDir))],
      ["framework supported", ["express", "fastify", "hono"].includes(config.framework)],
      ["architecture supported", ["minimal", "modular", "layered"].includes(config.architecture)],
      ["package manager supported", ["npm", "pnpm", "yarn", "bun"].includes(config.packageManager)],
    ] as const;

    for (const [label, ok] of checks) {
      console.log(`${ok ? pc.green("✓") : pc.red("✗")} ${label}`);
    }

    if (checks.some(([, ok]) => !ok)) process.exitCode = 1;
  } catch (error) {
    console.error(pc.red(isStartXKitError(error) ? error.message : "Doctor failed."));
    process.exit(1);
  }
}
