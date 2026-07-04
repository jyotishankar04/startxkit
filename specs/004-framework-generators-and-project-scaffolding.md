# 004 - Framework Generators and Project Scaffolding

Status: Done

## Goal

Create runnable backend project scaffolds for Express, Fastify, and Hono.

## What is in place

- Framework selection through a shared generator interface.
- Express-specific generator with direct source construction.
- Fastify and Hono generators backed by the shared template-based generator.
- Project creation flow that writes project files, config, and package metadata.

## Important files

- `packages/core/src/framework/index.ts`
- `packages/core/src/framework/express/express-project.generator.ts`
- `packages/core/src/framework/fastify/fastify-project.generator.ts`
- `packages/core/src/framework/hono/hono-project.generator.ts`
- `packages/core/src/framework/shared/simple-framework-generator.ts`
- `packages/core/src/generators/create-project.generator.ts`

## Behavior implemented

- Supports TypeScript project generation.
- Writes a `package.json` with scripts and dependencies.
- Writes `startxkit.config.json` for later commands.
- Removes optional files when features are disabled, such as:
  - Docker files
  - env config
  - CORS helpers
  - error handler files

## Current outcome

The toolkit can create framework-specific backend starter projects with a consistent StartXKit config file and generated dependency list.

