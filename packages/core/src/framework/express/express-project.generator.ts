import fs from "fs-extra";
import path from "node:path";
import type { StartXKitConfig } from "../../types/config";
import type { FrameworkGenerator } from "../../types/framework-generator";
import type { ModuleOptions } from "../../types/module-options";
import type { ProjectOptions } from "../../types/project-options";
import { writeConfig } from "../../config/write-config";
import { copyTemplate } from "../../template-engine/copy-template";
import { resolveTemplatePath } from "../../template-engine/resolve-template-path";
import { toCamelCase, toKebabCase, toPascalCase, toPluralName, toSingularName } from "../../utils/case";
import { addExpressModule } from "./express-module.generator";
import { fallbackDependencyVersion, resolveDependencyVersions } from "../../package-manager/dependency-versions";

export function sourceExtension(language: ProjectOptions["language"] | StartXKitConfig["language"]): "ts" | "js" {
  return language === "javascript" ? "js" : "ts";
}

export function importExtension(language: ProjectOptions["language"] | StartXKitConfig["language"]): "" | ".js" {
  return language === "javascript" ? ".js" : "";
}

function projectVariables(options: ProjectOptions) {
  return {
    ...options,
    name: options.projectName,
    apiPrefix: options.apiPrefix,
    framework: options.framework,
    architecture: options.architecture,
    language: options.language,
    validation: options.validation,
    hasCors: options.addCors,
    hasEnv: options.addEnv,
    hasErrorHandler: options.addErrorHandler,
    hasTesting: options.addTesting,
    hasDocker: options.addDocker,
    hasLogger: options.logger !== "none",
    isPino: options.logger === "pino",
    dependencyInjection: options.dependencyInjection,
    logger: options.logger,
  };
}

async function writePackageJson(options: ProjectOptions): Promise<void> {
  const dependencies: Record<string, string> = { express: fallbackDependencyVersion("express") };
  const isJavaScript = options.language === "javascript";
  const devDependencies: Record<string, string> = isJavaScript
    ? {}
    : {
        "@types/express": fallbackDependencyVersion("@types/express"),
        "@types/node": fallbackDependencyVersion("@types/node"),
        tsx: fallbackDependencyVersion("tsx"),
        typescript: fallbackDependencyVersion("typescript"),
      };

  if (options.addCors) {
    dependencies.cors = fallbackDependencyVersion("cors");
    if (!isJavaScript) devDependencies["@types/cors"] = fallbackDependencyVersion("@types/cors");
  }
  if (options.addEnv) dependencies.dotenv = fallbackDependencyVersion("dotenv");
  if (options.validation === "zod") dependencies.zod = fallbackDependencyVersion("zod");
  if (options.logger === "pino") dependencies.pino = fallbackDependencyVersion("pino");
  if (options.addTesting) devDependencies.vitest = fallbackDependencyVersion("vitest");

  const scripts: Record<string, string> = isJavaScript
    ? {
        dev: "node --watch src/server.js",
        start: "node src/server.js",
      }
    : {
        dev: "tsx watch src/server.ts",
        build: "tsc",
        start: "node dist/server.js",
        typecheck: "tsc --noEmit",
      };
  
  if (options.addTesting) scripts.test = "vitest run --passWithNoTests";

  await fs.writeJson(
    path.join(options.targetDir, "package.json"),
    {
      name: toKebabCase(options.projectName),
      version: "1.0.0",
      private: true,
      type: "module",
      scripts,
      dependencies: await resolveDependencyVersions(dependencies),
      devDependencies: await resolveDependencyVersions(devDependencies),
    },
    { spaces: 2 },
  );
}

async function createExpressProject(options: ProjectOptions): Promise<void> {
  let templateDir = resolveTemplatePath(
    "express",
    options.language,
    options.architecture,
    "base",
  );
  if (!(await hasTemplateFiles(templateDir))) {
    templateDir = resolveTemplatePath("express", options.language, "layered", "base");
  }
  await copyTemplate(templateDir, options.targetDir, projectVariables(options));
  if (!options.addDocker) {
    await fs.remove(path.join(options.targetDir, "Dockerfile"));
    await fs.remove(path.join(options.targetDir, "docker-compose.yml"));
  }
  if (!options.addCors) await fs.remove(path.join(options.targetDir, "src", "config", "cors.ts"));
  if (!options.addEnv) await fs.remove(path.join(options.targetDir, "src", "config", "env.ts"));
  if (!options.addErrorHandler) {
    await fs.remove(path.join(options.targetDir, "src", "shared", "errors", "app-error.ts"));
    await fs.remove(path.join(options.targetDir, "src", "shared", "errors", "error-handler.ts"));
  }
  await writePackageJson(options);
  await writeConfig(options.targetDir, {
    tool: "startxkit",
      version: "1.0.0",
    framework: "express",
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

export const expressGenerator: FrameworkGenerator = {
  createProject: createExpressProject,
  addModule: addExpressModule,
};

export function moduleVariables(config: StartXKitConfig, options: ModuleOptions) {
  const kebabName = toPluralName(options.name);
  const isLayered = config.architecture === "layered";
  const importSuffix = importExtension(config.language);
  return {
    ...options,
    name: options.name,
    pascalName: toPascalCase(kebabName),
    singularPascalName: toPascalCase(toSingularName(kebabName)),
    camelName: toCamelCase(kebabName),
    fileName: kebabName,
    kebabName,
    routePath: `/${kebabName}`,
    apiPrefix: config.apiPrefix,
    framework: config.framework,
    architecture: config.architecture,
    language: config.language,
    validation: config.validation,
    hasService: options.layer !== "route-controller",
    hasRepository:
      options.layer === "route-controller-service-repository" || options.layer === "full",
    hasInterface: options.layer === "full",
    hasValidator: options.layer === "full" && options.validation,
    dependencyInjection: config.dependencyInjection === true,
    crud: options.crud,
    routeImportPath: isLayered ? `../controllers/${kebabName}.controller${importSuffix}` : `./${kebabName}.controller${importSuffix}`,
    serviceImportPath: isLayered ? `../services/${kebabName}.service${importSuffix}` : `./${kebabName}.service${importSuffix}`,
    repositoryImportPath: isLayered ? `../repositories/${kebabName}.repository${importSuffix}` : `./${kebabName}.repository${importSuffix}`,
    interfaceImportPath: isLayered ? `../interfaces/${kebabName}.interface${importSuffix}` : `./${kebabName}.interface${importSuffix}`,
  };
}

export async function resolveExpressModuleTemplate(config: StartXKitConfig): Promise<string> {
  const templateDir = resolveTemplatePath("express", config.language, config.architecture, "module");
  if (await hasTemplateFiles(templateDir)) return templateDir;
  return resolveTemplatePath("express", config.language, "layered", "module");
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
