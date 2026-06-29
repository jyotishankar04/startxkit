import type { FrameworkGenerator } from "../../types/framework-generator";
import { createProjectFromTemplates, addModuleFromTemplates } from "../shared/simple-framework-generator";

export const fastifyGenerator: FrameworkGenerator = {
  createProject: (options) => createProjectFromTemplates("fastify", options),
  addModule: (config, options) => addModuleFromTemplates(config, options),
};
