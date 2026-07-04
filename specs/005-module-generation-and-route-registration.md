# 005 - Module Generation and Route Registration

Status: Done

## Goal

Add backend modules to generated projects with architecture-aware file placement.

## What is in place

- Shared `addModule` entrypoint.
- Module layer selection for:
  - route + controller
  - route + controller + service
  - route + controller + service + repository
  - full module stack
- CRUD toggle.
- Validation toggle.
- Optional test file generation.
- Module overwrite handling.
- Route registration for Fastify and Hono project entrypoints.

## Important files

- `packages/core/src/generators/add-module.generator.ts`
- `packages/core/src/framework/express/express-module.generator.ts`
- `packages/core/src/framework/shared/simple-framework-generator.ts`
- `packages/core/src/types/module-options.ts`

## Behavior implemented

- Normalizes module names to plural kebab-case.
- Resolves module file placement based on architecture:
  - minimal
  - modular
  - layered
- Inserts generated routes into `server.ts` for simple framework setups.
- Removes files that are not needed for the chosen module layer.

## Current outcome

The CLI can extend an existing StartXKit project with structured modules instead of only generating the initial app scaffold.

