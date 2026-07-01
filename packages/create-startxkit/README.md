# @startxkit/create

Interactive project creator for StartXKit.

Use it with npm's create flow:

```sh
npm create @startxkit@latest
```

This launches prompts and writes a complete backend project.

## What It Creates

- TypeScript backend project
- Express, Fastify, or Hono server setup
- Minimal, modular, or layered architecture
- Health endpoint
- `startxkit.config.json`
- `package.json`
- `tsconfig.json`
- Optional CORS, env config, validation, logging, error handler, dependency injection, tests, and Docker

## Recommended First Setup

For a first project, choose:

| Prompt | Value |
| --- | --- |
| Framework | Express |
| Architecture | Modular |
| API prefix | `/api/v1` |
| CORS | Yes |
| Env config | Yes |
| Validation | Zod |
| Logger | Pino or Console |
| Error handler | Yes |
| Dependency injection | Yes |
| Testing | Vitest |

Then run:

```sh
cd my-api
pnpm dev
```

Open:

```text
http://localhost:4000/api/v1/health
```

## Add Features Later

Inside a generated project:

```sh
npx @startxkit/cli add module users
```

## Supported In The MVP

- TypeScript
- Express
- Fastify
- Hono
- Minimal architecture
- Modular architecture
- Layered architecture

## Not Included Yet

- Auth
- Database setup
- ORM setup
- JavaScript templates
- NestJS

## License

MIT
