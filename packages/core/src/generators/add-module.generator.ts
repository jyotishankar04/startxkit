import { getFrameworkGenerator } from "../framework/index";
import type { StartXKitConfig } from "../types/config";
import type { ModuleOptions } from "../types/module-options";

export async function addModule(config: StartXKitConfig, options: ModuleOptions): Promise<string[]> {
  return getFrameworkGenerator(config.framework).addModule(config, options);
}
