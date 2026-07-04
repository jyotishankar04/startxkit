# 001 - Repository Foundation and Workspace

Status: Done

## Goal

Set up the monorepo structure for the CLI, core library, template assets, and docs site.

## What is in place

- Root `package.json` with workspace-wide scripts for build, dev, test, lint, and docs.
- `pnpm-workspace.yaml` for multi-package development.
- Root TypeScript base config and shared formatting settings.
- Separate apps and packages layout:
  - `apps/docs`
  - `packages/core`
  - `packages/startxkit`
  - `packages/create-startxkit`
  - `packages/templates`

## Why this step matters

The toolkit is designed as a monorepo so the CLI, shared logic, template source files, and documentation can evolve independently without duplication.

## Evidence in code

- Root scripts in `package.json`
- Workspace package manifests in each package directory
- Docs app and generated template asset trees already present

## Current outcome

The repository is already organized as a publishable workspace, not a single-package project.

