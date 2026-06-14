import type { BackendKitConfig } from "../types/config";
import { BackendKitError } from "../utils/errors";

const frameworks = ["express", "fastify", "hono"];
const languages = ["typescript", "javascript"];
const architectures = ["minimal", "modular", "layered"];
const packageManagers = ["npm", "pnpm", "yarn", "bun"];
const validationLibraries = ["zod", "Joi", "none"];

export function validateConfig(value: unknown): BackendKitConfig {
  const config = value as Partial<BackendKitConfig>;

  if (!config || typeof config !== "object") {
    throw new BackendKitError("Invalid backendkit.config.json.");
  }

  if (config.tool !== "backendkit") {
    throw new BackendKitError("This directory is not a BackendKit project.");
  }

  if (!frameworks.includes(config.framework ?? "")) {
    throw new BackendKitError(`Unsupported framework: ${config.framework ?? "unknown"}.`);
  }

  if (!languages.includes(config.language ?? "")) {
    throw new BackendKitError(`Unsupported language: ${config.language ?? "unknown"}.`);
  }

  if (!architectures.includes(config.architecture ?? "")) {
    throw new BackendKitError(`Unsupported architecture: ${config.architecture ?? "unknown"}.`);
  }

  if (!packageManagers.includes(config.packageManager ?? "")) {
    throw new BackendKitError(`Unsupported package manager: ${config.packageManager ?? "unknown"}.`);
  }

  if (!validationLibraries.includes(config.validation ?? "")) {
    throw new BackendKitError(`Unsupported validation library: ${config.validation ?? "unknown"}.`);
  }

  return config as BackendKitConfig;
}
