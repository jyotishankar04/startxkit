import type { StartXKitConfig } from "../types/config";
import { StartXKitError } from "../utils/errors";

const frameworks = ["express", "fastify", "hono"];
const languages = ["typescript", "javascript"];
const architectures = ["minimal", "modular", "layered"];
const packageManagers = ["npm", "pnpm", "yarn", "bun"];
const validationLibraries = ["zod", "Joi", "none"];

export function validateConfig(value: unknown): StartXKitConfig {
  const config = value as Partial<StartXKitConfig>;

  if (!config || typeof config !== "object") {
    throw new StartXKitError("Invalid startxkit.config.json.");
  }

  if (config.tool !== "startxkit") {
    throw new StartXKitError("This directory is not a StartXKit project.");
  }

  if (!frameworks.includes(config.framework ?? "")) {
    throw new StartXKitError(`Unsupported framework: ${config.framework ?? "unknown"}.`);
  }

  if (!languages.includes(config.language ?? "")) {
    throw new StartXKitError(`Unsupported language: ${config.language ?? "unknown"}.`);
  }

  if (!architectures.includes(config.architecture ?? "")) {
    throw new StartXKitError(`Unsupported architecture: ${config.architecture ?? "unknown"}.`);
  }

  if (!packageManagers.includes(config.packageManager ?? "")) {
    throw new StartXKitError(`Unsupported package manager: ${config.packageManager ?? "unknown"}.`);
  }

  if (!validationLibraries.includes(config.validation ?? "")) {
    throw new StartXKitError(`Unsupported validation library: ${config.validation ?? "unknown"}.`);
  }

  return config as StartXKitConfig;
}
