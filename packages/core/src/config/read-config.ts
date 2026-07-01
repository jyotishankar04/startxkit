import fs from "fs-extra";
import path from "node:path";
import { validateConfig } from "./validate-config";
import { StartXKitError } from "../utils/errors";

export async function readConfig(cwd = process.cwd()) {
  const configPath = path.join(cwd, "startxkit.config.json");

  if (!(await fs.pathExists(configPath))) {
    throw new StartXKitError("No startxkit.config.json found. Run this command inside a StartXKit project.");
  }

  return validateConfig(await fs.readJson(configPath));
}
