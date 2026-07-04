# 010 - JavaScript Support

Status: Implemented

## Goal

Enable JavaScript project and module generation alongside the existing TypeScript support.

## What is included

- JavaScript templates for Express, Fastify, and Hono.
- JavaScript templates for minimal, modular, and layered architectures.
- JavaScript module generation through `startxkit add module`.
- ESM output with `.js` relative imports.
- JavaScript package scripts that run directly with Node.

## Expected behavior

- Select `JavaScript` in the create CLI language prompt.
- Generated projects use `.js` source files.
- Generated JavaScript projects do not include `tsconfig.json`, `tsx`, `typescript`, or TypeScript type packages.
- Existing TypeScript generation remains unchanged.
