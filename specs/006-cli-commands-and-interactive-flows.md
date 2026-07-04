# 006 - CLI Commands and Interactive Flows

Status: Done

## Goal

Expose the toolkit through a usable command-line interface and a guided project creation flow.

## What is in place

- `create-startxkit` bootstrap command.
- `startxkit` CLI with subcommands:
  - `add module <name>`
  - `doctor`
  - `info`
- Interactive prompts for project creation.
- Interactive prompts for module creation.
- Graceful cancellation handling.

## Important files

- `packages/create-startxkit/src/index.ts`
- `packages/create-startxkit/src/run-create.ts`
- `packages/startxkit/src/cli.ts`
- `packages/startxkit/src/commands/add-module.command.ts`
- `packages/startxkit/src/commands/doctor.command.ts`
- `packages/startxkit/src/commands/info.command.ts`
- `packages/core/src/prompts/create-project.prompt.ts`
- `packages/core/src/prompts/add-module.prompt.ts`

## Behavior implemented

- Detects the package manager from the current environment.
- Prompts for framework, architecture, API prefix, logging, validation, Docker, tests, and install choices.
- Prints a project summary before generation.
- Shows project health checks and project metadata after creation.

## Current outcome

The repository already has a complete CLI shell for both generating new projects and extending existing ones.

