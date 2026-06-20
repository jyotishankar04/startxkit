import fs from "fs-extra";
import { getFrameworkGenerator } from "../framework/index";
import type { ProjectOptions } from "../types/project-options";
import { installDependencies } from "../package-manager/install-dependencies";

export async function createProject(options: ProjectOptions): Promise<void> {
  await fs.ensureDir(options.targetDir);
  await getFrameworkGenerator(options.framework).createProject(options);

  if (options.installDependencies) {
    await installDependencies(options.packageManager, options.targetDir);
  }
}
