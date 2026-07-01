import { describe, expect, it } from "vitest";
import { validateConfig } from "./validate-config";

const validConfig = {
  tool: "startxkit",
  version: "0.1.3",
  framework: "express",
  language: "typescript",
  architecture: "layered",
  packageManager: "pnpm",
  srcDir: "src",
  moduleDir: "src/modules",
  apiPrefix: "/api/v1",
  validation: "zod",
  database: null,
  orm: null,
  auth: false,
  fileNaming: "kebab-case",
  dependencyInjection: true,
} as const;

describe("validateConfig", () => {
  it("returns a valid config", () => {
    expect(validateConfig(validConfig)).toEqual(validConfig);
  });

  it("rejects unsupported framework values", () => {
    expect(() => validateConfig({ ...validConfig, framework: "nestjs" })).toThrow("Unsupported framework");
  });

  it("rejects unsupported package managers", () => {
    expect(() => validateConfig({ ...validConfig, packageManager: "pip" })).toThrow(
      "Unsupported package manager",
    );
  });
});
