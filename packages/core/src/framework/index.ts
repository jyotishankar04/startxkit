import type { Framework } from "../types/config";
import type { FrameworkGenerator } from "../types/framework-generator";
import { expressGenerator } from "./express/express-project.generator";
import { fastifyGenerator } from "./fastify/fastify-project.generator";
import { honoGenerator } from "./hono/hono-project.generator";
import { StartXKitError } from "../utils/errors";

const generators: Record<Framework, FrameworkGenerator> = {
  express: expressGenerator,
  fastify: fastifyGenerator,
  hono: honoGenerator,
  // TODO: Add NestJS when it enters StartXKit's supported framework union.
  // TODO: Add JavaScript templates alongside TypeScript once language support is implemented.
};

export function getFrameworkGenerator(framework: Framework): FrameworkGenerator {
  const generator = generators[framework];
  if (!generator) throw new StartXKitError(`Unsupported framework: ${framework}.`);
  return generator;
}
