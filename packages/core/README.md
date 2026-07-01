# @startxkit/core

Core generation engine for StartXKit.

This package contains the framework generators, template rendering, configuration helpers, and module generation logic used by the public StartXKit CLIs.

Most users should start with:

```sh
npm create @startxkit@latest
```

Use `@startxkit/core` directly only if you are building tooling around StartXKit.

## What It Provides

- Project generation for Express, Fastify, and Hono
- TypeScript template rendering
- Minimal, modular, and layered architecture templates
- Module generation for route/controller/service/repository/interface/validator layers
- `startxkit.config.json` read/write helpers
- Dependency version resolution
- Validation for StartXKit project config

## Architecture Layouts

### Minimal

```text
src/
  routes/
    users.route.ts
```

Minimal projects keep handlers inline in route files.

### Modular

```text
src/
  modules/
    users/
      users.route.ts
      users.controller.ts
      users.service.ts
```

Modular projects group files by feature.

### Layered

```text
src/
  routes/
    users.route.ts
  controllers/
    users.controller.ts
  services/
    users.service.ts
  repositories/
    users.repository.ts
  interfaces/
    users.interface.ts
  validators/
    users.validation.ts
```

Layered projects group files by responsibility.

## Public API

```ts
import { createProject, addModule, readConfig } from "@startxkit/core";
```

### Create A Project

```ts
await createProject({
  projectName: "my-api",
  targetDir: "./my-api",
  framework: "express",
  language: "typescript",
  architecture: "modular",
  packageManager: "pnpm",
  apiPrefix: "/api/v1",
  addCors: true,
  addEnv: true,
  validation: "zod",
  logger: "pino",
  addLogger: true,
  addErrorHandler: true,
  dependencyInjection: true,
  addTesting: true,
  addDocker: false,
  installDependencies: false,
});
```

### Add A Module

```ts
const config = await readConfig("./my-api");

await addModule(config, {
  name: "users",
  layer: "full",
  crud: true,
  validation: true,
  tests: false,
  cwd: "./my-api",
});
```

## Supported In The MVP

- TypeScript only
- Express, Fastify, Hono
- Minimal, modular, layered architectures
- Optional CORS, env config, Zod, Pino, error handler, dependency injection, Vitest, Docker

## Not Included Yet

- Auth
- Database setup
- ORM setup
- JavaScript templates
- NestJS

## License

MIT
