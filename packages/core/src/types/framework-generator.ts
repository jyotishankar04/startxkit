import type { BackendKitConfig } from "./config";
import type { ModuleOptions } from "./module-options";
import type { ProjectOptions } from "./project-options";

export interface FrameworkGenerator {
  createProject(options: ProjectOptions): Promise<void>;
  addModule(config: BackendKitConfig, options: ModuleOptions): Promise<string[]>;
}
