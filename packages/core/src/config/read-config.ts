import fs from "fs-extra";
import path from "node:path";
import { validateConfig } from "./validate-config";
import { BackendKitError } from "../utils/errors";

export async function readConfig(cwd = process.cwd()) {
  const configPath = path.join(cwd, "backendkit.config.json");

  if (!(await fs.pathExists(configPath))) {
    throw new BackendKitError("No backendkit.config.json found. Run this command inside a BackendKit project.");
  }

  return validateConfig(await fs.readJson(configPath));
}
