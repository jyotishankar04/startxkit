# 003 - Template Engine and File Rendering

Status: Done

## Goal

Render template files into real project files and format generated output.

## What is in place

- Handlebars-based template rendering.
- Recursive template copying for nested folders.
- File-name rendering for `*.hbs` templates.
- Automatic formatting for generated code and docs files when possible.
- Template root resolution for workspace source templates and built package templates.

## Important files

- `packages/core/src/template-engine/render-template.ts`
- `packages/core/src/template-engine/copy-template.ts`
- `packages/core/src/template-engine/resolve-template-path.ts`
- `packages/core/src/utils/path.ts`

## Behavior implemented

- Reads templates from `packages/templates` during development.
- Falls back to bundled `dist/templates` assets when published.
- Formats generated TypeScript, JSON, Markdown, and YAML files with Prettier.

## Current outcome

The generator layer can materialize whole project trees from template directories without hand-writing each output file.

