import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createProject } from "./create-project.generator";
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
});
