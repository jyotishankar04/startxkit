# 007 - Package Management and Version Resolution

Status: Done

## Goal

Resolve dependency versions safely and install them with the detected package manager.

## What is in place

- Package manager detection from the active user agent.
- Wrapper for command execution.
- Dependency version lookup with fallback versions.
- Best-effort npm registry resolution with offline-safe fallback behavior.
- Project dependency installation after scaffold generation.

## Important files

- `packages/core/src/package-manager/detect-package-manager.ts`
- `packages/core/src/package-manager/dependency-versions.ts`
- `packages/core/src/package-manager/install-dependencies.ts`
- `packages/core/src/package-manager/run-command.ts`

## Behavior implemented

- Chooses a stable package version when registry metadata is available.
- Falls back to pinned known-good versions when the registry cannot be reached.
- Supports `npm`, `pnpm`, `yarn`, and `bun`.

## Current outcome

Generated projects receive concrete dependency versions instead of unresolved placeholders, which makes the starter output more reliable.

