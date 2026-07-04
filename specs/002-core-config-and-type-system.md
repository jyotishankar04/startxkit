# 002 - Core Config and Type System

Status: Done

## Goal

Define the shared config schema, supported options, and validation rules used by the CLI and generators.

## What is in place

- Shared config types for:
  - framework
  - language
  - architecture
  - package manager
  - validation library
  - logger option
- Runtime config validation for `startxkit.config.json`.
- Config file read and write helpers.
- Error handling for invalid or missing project config.

## Important files

- `packages/core/src/types/config.ts`
- `packages/core/src/config/validate-config.ts`
- `packages/core/src/config/read-config.ts`
- `packages/core/src/config/write-config.ts`
- `packages/core/src/utils/errors.ts`

## Behavior implemented

- Rejects unsupported framework, language, architecture, package manager, and validation values.
- Verifies the project was created by StartXKit before running project commands.
- Persists `startxkit.config.json` in generated projects.

## Current outcome

The CLI can reliably detect whether it is operating inside a valid StartXKit project and can load the metadata needed to add modules later.

