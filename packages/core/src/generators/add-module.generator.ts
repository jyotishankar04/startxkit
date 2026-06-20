import { getFrameworkGenerator } from "../framework/index";
import type { BackendKitConfig } from "../types/config";
import type { ModuleOptions } from "../types/module-options";

export async function addModule(config: BackendKitConfig, options: ModuleOptions): Promise<string[]> {
  return getFrameworkGenerator(config.framework).addModule(config, options);
}
