import type { FrameworkGenerator } from "../../types/framework-generator";
import { createProjectFromTemplates, addModuleFromTemplates } from "../shared/simple-framework-generator";

export const honoGenerator: FrameworkGenerator = {
  createProject: (options) => createProjectFromTemplates("hono", options),
  addModule: (config, options) => addModuleFromTemplates(config, options),
};
