import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { addModule } from "./add-module.generator";
import { createProject } from "./create-project.generator";
import type { StartXKitConfig } from "../types/config";
import type { ProjectOptions } from "../types/project-options";

const tempDirs: string[] = [];

function baseOptions(targetDir: string): ProjectOptions {
  return {
    projectName: "optional-api",
    targetDir,
    framework: "express",
    language: "typescript",
    architecture: "layered",
    packageManager: "pnpm",
    apiPrefix: "/api/v1",
    addCors: false,
    addEnv: false,
    validation: "none",
    logger: "none",
    addLogger: false,
    addErrorHandler: false,
    dependencyInjection: false,
    addTesting: false,
    addDocker: false,
    installDependencies: false,
  };
}

function projectOptions(targetDir: string, overrides: Partial<ProjectOptions>): ProjectOptions {
  return {
    ...baseOptions(targetDir),
    projectName: "generated-api",
    ...overrides,
  };
}

function configFromOptions(options: ProjectOptions): StartXKitConfig {
  return {
    tool: "startxkit",
    version: "0.1.4",
    framework: options.framework,
    language: options.language,
    architecture: options.architecture,
    packageManager: options.packageManager,
    srcDir: "src",
    moduleDir: options.architecture === "modular" ? "src/modules" : "src",
    apiPrefix: options.apiPrefix,
    validation: options.validation,
    database: null,
    orm: null,
    auth: false,
    fileNaming: "kebab-case",
    logger: options.logger,
    dependencyInjection: options.dependencyInjection,
  };
}

async function makeTempDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "startxkit-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.remove(dir)));
});

describe("createProject", () => {
  it("does not emit disabled optional Express files", async () => {
    const targetDir = await makeTempDir();

    await createProject(baseOptions(targetDir));

    await expect(fs.pathExists(path.join(targetDir, "Dockerfile"))).resolves.toBe(false);
    await expect(fs.pathExists(path.join(targetDir, "docker-compose.yml"))).resolves.toBe(false);
    await expect(fs.pathExists(path.join(targetDir, "src", "config", "cors.ts"))).resolves.toBe(false);
    await expect(fs.pathExists(path.join(targetDir, "src", "config", "env.ts"))).resolves.toBe(false);
    await expect(
      fs.pathExists(path.join(targetDir, "src", "shared", "errors", "error-handler.ts")),
    ).resolves.toBe(false);
    await expect(
      fs.pathExists(path.join(targetDir, "src", "shared", "middlewares", "not-found.ts")),
    ).resolves.toBe(true);
  });

  it("generates distinct Express architecture layouts", async () => {
    const minimalDir = await makeTempDir();
    const modularDir = await makeTempDir();
    const layeredDir = await makeTempDir();

    await createProject(projectOptions(minimalDir, { architecture: "minimal" }));
    await createProject(projectOptions(modularDir, { architecture: "modular" }));
    await createProject(projectOptions(layeredDir, { architecture: "layered" }));

    await expect(fs.pathExists(path.join(minimalDir, "src", "routes", "health.route.ts"))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(minimalDir, "src", "modules", "health", "health.controller.ts"))).resolves.toBe(false);

    await expect(fs.pathExists(path.join(modularDir, "src", "modules", "health", "health.route.ts"))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(modularDir, "src", "modules", "health", "health.controller.ts"))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(modularDir, "src", "services", "health.service.ts"))).resolves.toBe(false);

    await expect(fs.pathExists(path.join(layeredDir, "src", "routes", "health.route.ts"))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(layeredDir, "src", "controllers", "health.controller.ts"))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(layeredDir, "src", "services", "health.service.ts"))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(layeredDir, "src", "repositories", "health.repository.ts"))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(layeredDir, "src", "interfaces", "health.interface.ts"))).resolves.toBe(true);
  });

  it("adds modules to modular and layered layouts with selected layers", async () => {
    const modularDir = await makeTempDir();
    const layeredDir = await makeTempDir();
    const modularOptions = projectOptions(modularDir, { architecture: "modular", dependencyInjection: true });
    const layeredOptions = projectOptions(layeredDir, { architecture: "layered", dependencyInjection: true });

    await createProject(modularOptions);
    await createProject(layeredOptions);

    const cases = [
      { name: "accounts", layer: "route-controller", service: false, repository: false, iface: false, validator: false },
      { name: "profiles", layer: "route-controller-service", service: true, repository: false, iface: false, validator: false },
      { name: "orders", layer: "route-controller-service-repository", service: true, repository: true, iface: false, validator: false },
      { name: "users", layer: "full", service: true, repository: true, iface: true, validator: true },
    ] as const;

    for (const item of cases) {
      await addModule(configFromOptions(modularOptions), {
        name: item.name,
        layer: item.layer,
        crud: true,
        validation: true,
        tests: false,
        cwd: modularDir,
      });
      await addModule(configFromOptions(layeredOptions), {
        name: item.name,
        layer: item.layer,
        crud: true,
        validation: true,
        tests: false,
        cwd: layeredDir,
      });

      const pluralName = item.name;
      await expect(fs.pathExists(path.join(modularDir, "src", "modules", pluralName, `${pluralName}.route.ts`))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(modularDir, "src", "modules", pluralName, `${pluralName}.controller.ts`))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(modularDir, "src", "modules", pluralName, `${pluralName}.service.ts`))).resolves.toBe(item.service);
      await expect(fs.pathExists(path.join(modularDir, "src", "modules", pluralName, `${pluralName}.repository.ts`))).resolves.toBe(item.repository);
      await expect(fs.pathExists(path.join(modularDir, "src", "modules", pluralName, `${pluralName}.interface.ts`))).resolves.toBe(item.iface);
      await expect(fs.pathExists(path.join(modularDir, "src", "modules", pluralName, `${pluralName}.validation.ts`))).resolves.toBe(item.validator);

      await expect(fs.pathExists(path.join(layeredDir, "src", "routes", `${pluralName}.route.ts`))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(layeredDir, "src", "controllers", `${pluralName}.controller.ts`))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(layeredDir, "src", "services", `${pluralName}.service.ts`))).resolves.toBe(item.service);
      await expect(fs.pathExists(path.join(layeredDir, "src", "repositories", `${pluralName}.repository.ts`))).resolves.toBe(item.repository);
      await expect(fs.pathExists(path.join(layeredDir, "src", "interfaces", `${pluralName}.interface.ts`))).resolves.toBe(item.iface);
      await expect(fs.pathExists(path.join(layeredDir, "src", "validators", `${pluralName}.validation.ts`))).resolves.toBe(item.validator);
    }
  });

  it("generates Fastify and Hono CORS env and error-handler files when enabled", async () => {
    for (const framework of ["fastify", "hono"] as const) {
      const targetDir = await makeTempDir();
      const options = projectOptions(targetDir, {
        framework,
        architecture: "layered",
        addCors: true,
        addEnv: true,
        addErrorHandler: true,
      });

      await createProject(options);

      await expect(fs.pathExists(path.join(targetDir, "src", "config", "cors.ts"))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(targetDir, "src", "config", "env.ts"))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(targetDir, "src", "shared", "errors", "error-handler.ts"))).resolves.toBe(true);

      const server = await fs.readFile(path.join(targetDir, "src", "server.ts"), "utf8");
      expect(server).toContain(framework === "fastify" ? "fastifyCors" : "hono/cors");
      expect(server).toContain(framework === "fastify" ? "setErrorHandler" : "onError");
      expect(server).toContain("env.PORT");
    }
  });
});
