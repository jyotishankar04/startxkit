import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";
import { cancel, confirm, intro, isCancel, note, outro, select, text } from "@clack/prompts";
import {
  createProject,
  detectPackageManager,
  installDependencies as installProjectDependencies,
  isStartXKitError,
  type Architecture,
  type Framework,
  type Language,
  type LoggerOption,
  type PackageManager,
  type ProjectOptions,
  type ValidationLibrary,
} from "@startxkit/core";

function abortIfCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel("Project creation cancelled.");
    process.exit(0);
  }
  return value;
}

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const startXKitBanner = String.raw`
██████╗  █████╗  ██████╗██╗  ██╗███████╗███╗   ██╗██████╗ ██╗  ██╗██╗████████╗
██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝████╗  ██║██╔══██╗██║ ██╔╝██║╚══██╔══╝
██████╔╝███████║██║     █████╔╝ █████╗  ██╔██╗ ██║██║  ██║█████╔╝ ██║   ██║
██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██║╚██╗██║██║  ██║██╔═██╗ ██║   ██║
██████╔╝██║  ██║╚██████╗██║  ██╗███████╗██║ ╚████║██████╔╝██║  ██╗██║   ██║
╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝
`;

export async function runCreate(): Promise<void> {
  intro(
    `${pc.red(startXKitBanner)}\n${pc.bold("Welcome to StartXKit")}\nCreate scalable backend boilerplates for Express, Fastify, and Hono.`,
  );

  try {
    const projectName = String(
      abortIfCancel(
        await text({
          message: "Project name",
          placeholder: "my-api",
          defaultValue: "my-api",
          validate: (value) => (value.trim() ? undefined : "Project name is required."),
        }),
      ),
    );
    const targetDir = path.resolve(process.cwd(), projectName);

    if (await fs.pathExists(targetDir)) {
      const action = abortIfCancel(
        await select({
          message: "Project directory already exists.",
          options: [
            { label: "Continue and merge files", value: "continue" },
            { label: "Overwrite", value: "overwrite" },
            { label: "Cancel", value: "cancel" },
          ],
        }),
      );
      if (action === "cancel") {
        cancel("Project creation cancelled.");
        return;
      }
      if (action === "overwrite") await fs.emptyDir(targetDir);
    }

    const language = abortIfCancel(
      await select<Language>({
        message: "Language",
        options: [
          { label: "TypeScript", value: "typescript" },
          { label: "JavaScript (not supported yet)", value: "javascript" },
        ],
        initialValue: "typescript",
      }),
    );
    const framework = abortIfCancel(
      await select<Framework>({
        message: "Framework",
        options: [
          { label: "Express", value: "express" },
          { label: "Fastify", value: "fastify" },
          { label: "Hono", value: "hono" },
        ],
        initialValue: "express",
      }),
    );
    const architecture = abortIfCancel(
      await select<Architecture>({
        message: "Architecture",
        options: [
          { label: "Minimal", value: "minimal" },
          { label: "Modular", value: "modular" },
          { label: "Layered", value: "layered" },
        ],
        initialValue: "layered",
      }),
    );
    const apiChoice = abortIfCancel(
      await select<string>({
        message: "API prefix",
        options: [
          { label: "/api/v1", value: "/api/v1" },
          { label: "/api", value: "/api" },
          { label: "none", value: "" },
          { label: "custom", value: "custom" },
        ],
        initialValue: "/api/v1",
      }),
    );
    const apiPrefix =
      apiChoice === "custom"
        ? String(
            abortIfCancel(await text({ message: "Custom API prefix", defaultValue: "/api/v1" })),
          )
        : apiChoice;
    const detected = detectPackageManager();
    const packageManager = abortIfCancel(
      await select<PackageManager>({
        message: "Package manager",
        options: [
          { label: "pnpm", value: "pnpm" },
          { label: "npm", value: "npm" },
          { label: "yarn", value: "yarn" },
          { label: "bun", value: "bun" },
        ],
        initialValue: detected === "npm" ? "pnpm" : detected,
      }),
    );
    const addCors = abortIfCancel(await confirm({ message: "Add CORS?", initialValue: true }));
    const addEnv = abortIfCancel(await confirm({ message: "Add env config?", initialValue: true }));
    const validation = abortIfCancel(
      await select<ValidationLibrary>({
        message: "Add request validation?",
        options: [
          { label: "Zod", value: "zod" },
          { label: "None", value: "none" },
        ],
        initialValue: "zod",
      }),
    );
    const logger = abortIfCancel(
      await select<LoggerOption>({
        message: "Add logger?",
        options: [
          { label: "Console", value: "console" },
          { label: "Pino", value: "pino" },
          { label: "None", value: "none" },
        ],
        initialValue: "console",
      }),
    );
    const addErrorHandler = abortIfCancel(
      await confirm({ message: "Add error handler?", initialValue: true }),
    );
    const dependencyInjection = abortIfCancel(
      await confirm({
        message: "Use dependency injection?",
        initialValue: architecture === "layered",
      }),
    );
    const addTesting = abortIfCancel(
      await select<boolean>({
        message: "Add testing setup?",
        options: [
          { label: "Vitest", value: true },
          { label: "None", value: false },
        ],
        initialValue: true,
      }),
    );
    const addDocker = abortIfCancel(await confirm({ message: "Add Docker?", initialValue: true }));
    const installDependencies = abortIfCancel(
      await confirm({ message: "Install dependencies now?", initialValue: true }),
    );

    const features = [
      addCors && "CORS",
      addEnv && "Env config",
      validation === "zod" && "Zod validation",
      logger !== "none" && `${titleCase(logger)} logger`,
      addErrorHandler && "Error handler",
      dependencyInjection && "Dependency injection",
      addDocker && "Docker",
      addTesting && "Vitest",
    ].filter(Boolean);

    note(
      [
        `Project: ${projectName}`,
        `Language: ${titleCase(language)}`,
        `Framework: ${titleCase(framework)}`,
        `Architecture: ${titleCase(architecture)}`,
        `Package Manager: ${packageManager}`,
        `API Prefix: ${apiPrefix || "none"}`,
        "",
        "Features:",
        ...features.map((feature) => `- ${feature}`),
      ].join("\n"),
      "Summary",
    );

    if (!abortIfCancel(await confirm({ message: "Create project?", initialValue: true }))) {
      cancel("Project creation cancelled.");
      return;
    }

    const options: ProjectOptions = {
      projectName,
      targetDir,
      framework,
      language,
      architecture,
      packageManager,
      apiPrefix,
      addCors,
      addEnv,
      validation,
      logger,
      addLogger: logger !== "none",
      addErrorHandler,
      dependencyInjection,
      addTesting,
      addDocker,
      installDependencies,
    };

    await createProject({ ...options, installDependencies: false });

    let installFailed = false;
    if (installDependencies) {
      try {
        await installProjectDependencies(packageManager, targetDir);
      } catch {
        installFailed = true;
      }
    }

    outro(
      [
        `Created ${pc.green(projectName)}.`,
        installFailed
          ? `Dependency install did not complete. Run ${pc.cyan(`${packageManager} install`)} in the project after resolving the package-manager warning.`
          : undefined,
        "",
        "Next steps:",
        `  cd ${projectName}`,
        installFailed ? `  ${packageManager} install` : undefined,
        `  ${packageManager} dev`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  } catch (error) {
    cancel(isStartXKitError(error) ? error.message : "Project creation failed.");
    process.exit(1);
  }
}
