export type Framework = "express" | "fastify" | "hono";
export type Language = "typescript" | "javascript";
export type Architecture = "minimal" | "modular" | "layered";
export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export type ValidationLibrary = "zod" | "Joi" | "none";
export type LoggerOption = "console" | "pino" | "none";

export interface StartXKitConfig {
  tool: "startxkit";
  version: string;
  framework: Framework;
  language: Language;
  architecture: Architecture;
  packageManager: PackageManager;
  srcDir: string;
  moduleDir: string;
  apiPrefix: string;
  validation: ValidationLibrary;
  database: null;
  orm: null;
  auth: false;
  fileNaming: "kebab-case";
  logger?: LoggerOption;
  dependencyInjection?: boolean;
}
