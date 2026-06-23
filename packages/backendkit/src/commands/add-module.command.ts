import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import { cancel, confirm, isCancel, outro, select } from "@clack/prompts";
import { addModule, isBackendKitError, readConfig, toPluralName, type ModuleLayer } from "@backendkit/core";

function abortIfCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel("Add module cancelled.");
    process.exit(0);
  }
  return value;
}

export async function addModuleCommand(name: string): Promise<void> {
  try {
    const config = await readConfig();
    const moduleName = toPluralName(name);
    const modulePath = path.join(process.cwd(), config.moduleDir, moduleName);
    let overwrite = false;

    if (await fs.pathExists(modulePath)) {
      overwrite = abortIfCancel(
        await confirm({ message: `Module "${moduleName}" already exists. Overwrite?`, initialValue: false }),
      );
      if (!overwrite) {
        cancel("Add module cancelled.");
        return;
      }
    }

    const layer = abortIfCancel(
      await select<ModuleLayer>({
        message: "Select module layer:",
        options: [
          { label: "Route + Controller", value: "route-controller" },
          { label: "Route + Controller + Service", value: "route-controller-service" },
          {
            label: "Route + Controller + Service + Repository",
            value: "route-controller-service-repository",
          },
          {
            label: "Full: Route + Controller + Service + Repository + Interface + Validator",
            value: "full",
          },
        ],
        initialValue: config.architecture === "layered" ? "full" : "route-controller-service",
      }),
    );
    const crud = abortIfCancel(await confirm({ message: "Add CRUD endpoints?", initialValue: true }));
    const tests = abortIfCancel(await confirm({ message: "Add tests?", initialValue: false }));

    const written = await addModule(config, {
      name,
      layer,
      crud,
      validation: config.validation !== "none",
      tests,
      overwrite,
      cwd: process.cwd(),
    });

    outro(["Generated files:", ...written.map((file) => `- ${pc.green(path.relative(process.cwd(), file))}`)].join("\n"));
  } catch (error) {
    cancel(isBackendKitError(error) ? error.message : "Failed to add module.");
    process.exit(1);
  }
}
