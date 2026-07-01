import fs from "fs-extra";
import path from "node:path";
import type { StartXKitConfig, Framework } from "../../types/config";
import type { ModuleOptions } from "../../types/module-options";
import type { ProjectOptions } from "../../types/project-options";
import { writeConfig } from "../../config/write-config";
import { copyTemplate } from "../../template-engine/copy-template";
import { resolveTemplatePath } from "../../template-engine/resolve-template-path";
import { StartXKitError } from "../../utils/errors";
import { toKebabCase, toPluralName } from "../../utils/case";
import { moduleVariables } from "../express/express-project.generator";
import { fallbackDependencyVersion, resolveDependencyVersions } from "../../package-manager/dependency-versions";

export async function createProjectFromTemplates(
  framework: Framework,
  options: ProjectOptions,
): Promise<void> {
  if (options.language !== "typescript") {
    throw new StartXKitError("JavaScript templates are not supported in the MVP.");
  }

  let templateDir = resolveTemplatePath(framework, "typescript", options.architecture, "base");
  if (!(await hasTemplateFiles(templateDir))) {
    templateDir = resolveTemplatePath(framework, "typescript", "layered", "base");
  }

  await copyTemplate(
    templateDir,
    options.targetDir,
    {
      ...options,
      name: options.projectName,
      framework,
      hasCors: options.addCors,
      hasEnv: options.addEnv,
      hasTesting: options.addTesting,
      hasDocker: options.addDocker,
      hasErrorHandler: options.addErrorHandler,
      hasLogger: options.logger !== "none",
      isPino: options.logger === "pino",
      dependencyInjection: options.dependencyInjection,
    },
  );
  if (!options.addDocker) {
    await fs.remove(path.join(options.targetDir, "Dockerfile"));
    await fs.remove(path.join(options.targetDir, "docker-compose.yml"));
  }
  if (!options.addEnv) await fs.remove(path.join(options.targetDir, ".env.example"));
  if (!options.addCors) await fs.remove(path.join(options.targetDir, "src", "config", "cors.ts"));
  if (!options.addEnv) await fs.remove(path.join(options.targetDir, "src", "config", "env.ts"));
  if (!options.addErrorHandler) {
    await fs.remove(path.join(options.targetDir, "src", "shared", "errors", "app-error.ts"));
    await fs.remove(path.join(options.targetDir, "src", "shared", "errors", "error-handler.ts"));
  }

  const dependencies: Record<string, string> =
    framework === "fastify"
      ? { fastify: fallbackDependencyVersion("fastify") }
      : {
          hono: fallbackDependencyVersion("hono"),
          "@hono/node-server": fallbackDependencyVersion("@hono/node-server"),
        };
  if (options.addCors && framework === "fastify") {
    dependencies["@fastify/cors"] = fallbackDependencyVersion("@fastify/cors");
  }
  if (options.addEnv) dependencies.dotenv = fallbackDependencyVersion("dotenv");
  if (options.validation === "zod") dependencies.zod = fallbackDependencyVersion("zod");
  if (options.logger === "pino") dependencies.pino = fallbackDependencyVersion("pino");

  const devDependencies: Record<string, string> = {
    "@types/node": fallbackDependencyVersion("@types/node"),
    tsx: fallbackDependencyVersion("tsx"),
    typescript: fallbackDependencyVersion("typescript"),
  };
  if (options.addTesting) devDependencies.vitest = fallbackDependencyVersion("vitest");

  await fs.writeJson(
    path.join(options.targetDir, "package.json"),
    {
      name: toKebabCase(options.projectName),
      version: "0.1.5",
      private: true,
      type: "module",
      scripts: {
        dev: "tsx watch src/server.ts",
        build: "tsc",
        start: "node dist/server.js",
        typecheck: "tsc --noEmit",
        ...(options.addTesting ? { test: "vitest run --passWithNoTests" } : {}),
      },
      dependencies: await resolveDependencyVersions(dependencies),
      devDependencies: await resolveDependencyVersions(devDependencies),
    },
    { spaces: 2 },
  );

  await writeConfig(options.targetDir, {
    tool: "startxkit",
    version: "0.1.5",
    framework,
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
  });
}

export async function addModuleFromTemplates(
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
    throw new StartXKitError(`Module "${options.name}" already exists.`);
  }

  let templateDir = resolveTemplatePath(config.framework, "typescript", config.architecture, "module");
  if (!(await hasTemplateFiles(templateDir))) {
    templateDir = resolveTemplatePath(config.framework, "typescript", "layered", "module");
  }
  const written = await copyTemplate(
    templateDir,
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
  await registerSimpleFrameworkRoute(projectRoot, config, kebabName);
  return written.filter(
    (file) => !removed.some((r) => file.endsWith(path.join("", r))),
  );
}

async function registerSimpleFrameworkRoute(
  projectRoot: string,
  config: StartXKitConfig,
  kebabName: string,
): Promise<void> {
  const serverPath = path.join(projectRoot, config.srcDir, "server.ts");
  if (!(await fs.pathExists(serverPath))) return;

  const camelName = kebabName.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
  let content = await fs.readFile(serverPath, "utf8");

  if (config.framework === "fastify") {
    const importPath =
      config.architecture === "layered" || config.architecture === "minimal"
        ? `./routes/${kebabName}.route`
        : `./modules/${kebabName}/${kebabName}.route`;
    const importLine = `import { ${camelName}Routes } from "${importPath}";`;
    const routeLine = `app.register(${camelName}Routes, { prefix: "${config.apiPrefix}/${kebabName}" });`;
    if (!content.includes(importLine)) content = insertImport(content, importLine);
    if (!content.includes(routeLine)) content = content.replace("\napp.listen", `\n${routeLine}\n\napp.listen`);
  }

  if (config.framework === "hono") {
    const importPath =
      config.architecture === "layered" || config.architecture === "minimal"
        ? `./routes/${kebabName}.route`
        : `./modules/${kebabName}/${kebabName}.route`;
    const importLine = `import { ${camelName}Routes } from "${importPath}";`;
    const routeLine = `app.route("${config.apiPrefix}/${kebabName}", ${camelName}Routes);`;
    if (!content.includes(importLine)) content = insertImport(content, importLine);
    if (!content.includes(routeLine)) content = content.replace("\nserve({", `\n${routeLine}\n\nserve({`);
  }

  await fs.writeFile(serverPath, content);
}

function insertImport(content: string, importLine: string): string {
  const lines = content.split(/\r?\n/);
  const lastImportIndex = lines.reduce((lastIndex, line, index) => {
    return line.startsWith("import ") ? index : lastIndex;
  }, -1);
  lines.splice(lastImportIndex + 1, 0, importLine);
  return lines.join("\n");
}

async function hasTemplateFiles(templateDir: string): Promise<boolean> {
  if (!(await fs.pathExists(templateDir))) return false;
  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(templateDir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".hbs")) return true;
    if (entry.isDirectory() && (await hasTemplateFiles(entryPath))) return true;
  }

  return false;
}
