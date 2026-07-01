import fs from "fs-extra";
import path from "node:path";
import type { StartXKitConfig } from "../../types/config";
import type { ModuleOptions } from "../../types/module-options";
import { copyTemplate } from "../../template-engine/copy-template";
import { StartXKitError } from "../../utils/errors";
import { toPluralName } from "../../utils/case";
import { moduleVariables, resolveExpressModuleTemplate } from "./express-project.generator";

async function ensureRoutesIndex(projectRoot: string, config: StartXKitConfig): Promise<void> {
  const routesPath = path.join(projectRoot, config.srcDir, "routes", "index.ts");
  if (!(await fs.pathExists(routesPath))) {
    await fs.ensureDir(path.dirname(routesPath));
    const healthImport =
      config.architecture === "layered" || config.architecture === "minimal"
        ? 'import healthRoutes from "./health.route";'
        : 'import healthRoutes from "../modules/health/health.route";';
    await fs.writeFile(
      routesPath,
      [
        'import { Router } from "express";',
        healthImport,
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
  config: StartXKitConfig,
  moduleName: string,
): Promise<void> {
  const kebabName = toPluralName(moduleName);
  const routesPath = path.join(projectRoot, config.srcDir, "routes", "index.ts");
  let content = await fs.readFile(routesPath, "utf8");
  const importPath =
    config.architecture === "layered" || config.architecture === "minimal"
      ? `./${kebabName}.route`
      : `../modules/${kebabName}/${kebabName}.route`;
  const importLine = `import ${kebabName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())}Routes from "${importPath}";`;
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
  config: StartXKitConfig,
  options: ModuleOptions,
): Promise<string[]> {
  const projectRoot = options.cwd ?? process.cwd();
  const kebabName = toPluralName(options.name);
  const targetDir =
    config.architecture === "layered" || config.architecture === "minimal"
      ? path.join(projectRoot, config.srcDir)
      : path.join(projectRoot, config.moduleDir, kebabName);
  const existsPath =
    config.architecture === "layered" || config.architecture === "minimal"
      ? path.join(projectRoot, config.srcDir, "routes", `${kebabName}.route.ts`)
      : targetDir;

  if ((await fs.pathExists(existsPath)) && !options.overwrite) {
    throw new StartXKitError(`Module "${kebabName}" already exists.`);
  }

  await fs.ensureDir(targetDir);
  const written = await copyTemplate(
    await resolveExpressModuleTemplate(config),
    targetDir,
    moduleVariables(config, options),
  );
  const removed: string[] = [];
  const filePath = (folder: string, suffix: string) =>
    config.architecture === "layered"
      ? path.join(folder, `${kebabName}.${suffix}.ts`)
      : `${kebabName}.${suffix}.ts`;

  if (config.architecture === "minimal") {
    removed.push(
      filePath("controllers", "controller"),
      filePath("services", "service"),
      filePath("repositories", "repository"),
      filePath("interfaces", "interface"),
      filePath("validators", "validation"),
    );
  } else if (options.layer === "route-controller") {
    removed.push(filePath("services", "service"), filePath("repositories", "repository"));
  }
  if (config.architecture !== "minimal" && options.layer === "route-controller-service") {
    removed.push(filePath("repositories", "repository"));
  }
  if (config.architecture !== "minimal" && options.layer !== "full") {
    removed.push(filePath("interfaces", "interface"), filePath("validators", "validation"));
  }
  if (!options.validation) removed.push(filePath("validators", "validation"));
  for (const file of removed) await fs.remove(path.join(targetDir, file));
  await ensureRoutesIndex(projectRoot, config);
  await registerModuleRoute(projectRoot, config, options.name);

  return written.filter(
    (file) => !removed.some((r) => file.endsWith(path.join("", r))),
  );
}
