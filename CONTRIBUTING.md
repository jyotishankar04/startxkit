# Contributing to StartXKit

Thanks for helping improve StartXKit.

StartXKit is a TypeScript monorepo for generating backend projects with Express, Fastify, and Hono. Contributions should keep generated projects readable, predictable, and easy to extend.

## Project Setup

Install dependencies:

```sh
pnpm install
```

Build all packages:

```sh
pnpm build
```

Run type checks:

```sh
pnpm typecheck
```

Run tests:

```sh
pnpm test
```

## Repository Structure

```text
apps/
  docs/                  # Documentation site
packages/
  core/                  # Generators, template rendering, config helpers
  create-startxkit/      # Interactive project creation CLI
  startxkit/             # Project CLI: add module, doctor, info
  templates/             # Framework and architecture templates
examples/                # Generated example projects
```

## Development Workflow

1. Create a focused branch.
2. Make the smallest change that solves the issue.
3. Add or update tests when generator behavior changes.
4. Run the relevant checks.
5. Update docs when behavior, commands, templates, or public APIs change.
6. Open a pull request with a clear summary and test notes.

## Template Changes

Template changes need extra care because they affect generated projects.

When changing templates:

- Keep minimal, modular, and layered architectures distinct.
- Keep framework-specific patterns idiomatic.
- Make sure generated TypeScript compiles.
- Avoid adding dependencies unless the selected feature requires them.
- Keep generated code simple enough for users to understand.

Architecture rules:

- Minimal: route files with inline handlers.
- Modular: feature folders under `src/modules/{feature}`.
- Layered: top-level `src/routes`, `src/controllers`, `src/services`, `src/repositories`, `src/interfaces`, and `src/validators`.

## Testing Generator Changes

At minimum, run:

```sh
pnpm --filter @startxkit/core test
pnpm typecheck
pnpm build
```

For template changes, also generate a temporary project and compile it:

```sh
npm create @startxkit@latest
cd my-api
pnpm install
pnpm typecheck
```

If the change affects `add module`, test each module depth:

- Route + Controller
- Route + Controller + Service
- Route + Controller + Service + Repository
- Full

## Documentation Changes

Docs live in:

```text
apps/docs/content/docs
```

Use clear language and keep docs aligned with generated output. If a generated folder layout changes, update the architecture docs and relevant CLI docs.

Build docs before submitting docs changes:

```sh
pnpm --filter docs build
```

## Commit Style

Use short, direct commit messages:

```text
Fix layered module generation
Add package READMEs
Update docs for Fastify CORS
```

Prefer one focused commit per logical change.

## Pull Request Checklist

Before opening a PR, confirm:

- [ ] The change is scoped and easy to review.
- [ ] Tests pass.
- [ ] Type checks pass.
- [ ] Build passes when relevant.
- [ ] Docs are updated when behavior changes.
- [ ] Generated examples or smoke tests were checked for template changes.

## Release Notes

If the change affects users, update:

```text
apps/docs/content/docs/changelog.mdx
```

Mention what changed, why it matters, and whether users need to do anything.

## Not In Scope For The Current MVP

The current MVP intentionally excludes:

- Auth
- Database setup
- ORM setup
- JavaScript templates
- NestJS
- GraphQL
- WebSockets
- Deployment templates

Discuss these before opening large implementation PRs.
