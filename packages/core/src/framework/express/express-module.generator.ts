import fs from "fs-extra";
import path from "node:path";
import type { BackendKitConfig } from "../../types/config";
import type { ModuleOptions } from "../../types/module-options";
import { copyTemplate } from "../../template-engine/copy-template";
import { BackendKitError } from "../../utils/errors";
import { toPluralName } from "../../utils/case";
import { moduleVariables, resolveExpressModuleTemplate } from "./express-project.generator";

async function ensureRoutesIndex(projectRoot: string, config: BackendKitConfig): Promise<void> {
  const routesPath = path.join(projectRoot, config.srcDir, "routes", "index.ts");
  if (!(await fs.pathExists(routesPath))) {
    await fs.ensureDir(path.dirname(routesPath));
    await fs.writeFile(
      routesPath,
      [
        'import { Router } from "express";',
        'import healthRoutes from "../modules/health/health.route";',
        "",
        "const router = Router();",
        "",
        'router.use("/health", healthRoutes);',
        "",
        "export default router;",
        "",
      ].join("\n"),
    );
  }
}

async function registerModuleRoute(
  projectRoot: string,
  config: BackendKitConfig,
  moduleName: string,
): Promise<void> {
  const kebabName = toPluralName(moduleName);
  const routesPath = path.join(projectRoot, config.srcDir, "routes", "index.ts");
  let content = await fs.readFile(routesPath, "utf8");
  const importLine = `import ${kebabName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}Routes from "../modules/${kebabName}/${kebabName}.route";`;
  const routeLine = `router.use("/${kebabName}", ${kebabName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}Routes);`;

  if (!content.includes(importLine)) {
    const lines = content.split(/\r?\n/);
    const lastImportIndex = lines.reduce((lastIndex, line, index) => {
      return line.startsWith("import ") ? index : lastIndex;
    }, -1);
    lines.splice(lastImportIndex + 1, 0, importLine);
    content = lines.join("\n");
  }
  if (!content.includes(routeLine)) {
    content = content.replace("\nexport default router;", `\n${routeLine}\n\nexport default router;`);
  }

  await fs.writeFile(routesPath, content);
}

export async function addExpressModule(
  config: BackendKitConfig,
  options: ModuleOptions,
): Promise<string[]> {
  const projectRoot = options.cwd ?? process.cwd();
  const kebabName = toPluralName(options.name);
  const targetDir = path.join(projectRoot, config.moduleDir, kebabName);

  if ((await fs.pathExists(targetDir)) && !options.overwrite) {
    throw new BackendKitError(`Module "${kebabName}" already exists.`);
  }

  await fs.ensureDir(targetDir);
  const written = await copyTemplate(
    await resolveExpressModuleTemplate(config),
    targetDir,
    moduleVariables(config, options),
  );
  if (options.layer === "route-controller") {
    await fs.remove(path.join(targetDir, `${kebabName}.service.ts`));
    await fs.remove(path.join(targetDir, `${kebabName}.repository.ts`));
  }
  if (options.layer === "route-controller-service") {
    await fs.remove(path.join(targetDir, `${kebabName}.repository.ts`));
  }
  if (options.layer !== "full") {
    await fs.remove(path.join(targetDir, `${kebabName}.interface.ts`));
    await fs.remove(path.join(targetDir, `${kebabName}.validation.ts`));
  }
  if (!options.validation) await fs.remove(path.join(targetDir, `${kebabName}.validation.ts`));
  await ensureRoutesIndex(projectRoot, config);
  await registerModuleRoute(projectRoot, config, options.name);

  return written;
}
