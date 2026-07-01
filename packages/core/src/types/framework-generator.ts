import type { StartXKitConfig } from "./config";
import type { ModuleOptions } from "./module-options";
import type { ProjectOptions } from "./project-options";

export interface FrameworkGenerator {
  createProject(options: ProjectOptions): Promise<void>;
  addModule(config: StartXKitConfig, options: ModuleOptions): Promise<string[]>;
}
