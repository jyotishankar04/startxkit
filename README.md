# BackendKit

BackendKit is a TypeScript CLI toolkit for generating backend boilerplates for Express, Fastify, and Hono.

## MVP Scope

BackendKit creates simple runnable backend projects and adds modules with routes, controllers, services, repositories, simple request/response handlers, project config, and generated documentation.

## Usage

Create a project:

```bash
npm create backendkit@latest
```

Add a module inside a generated project:

```bash
npx backendkit add module users
```

Check a project:

```bash
npx backendkit doctor
```

Print project info:

```bash
npx backendkit info
```

## Supported

- TypeScript
- Express
- Fastify
- Hono
- Minimal architecture
- Modular architecture
- Layered architecture
- Optional CORS for Express
- Optional env config
- Optional Zod validation
- Optional console or Pino dependency selection
- Optional error handler for Express
- Optional dependency injection for generated modules
- Optional Docker files
- Simple generated modules
- Simple CRUD request/response handlers

## Not Supported Yet

- Auth
- Database
- ORM
- Prisma
- Drizzle
- Mongoose
- OAuth
- JWT
- Session management
- NestJS
- JavaScript templates

## Development

Install dependencies:

```bash
pnpm install
```

Build all packages:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

## Roadmap

- Auth generators
- Database and ORM adapters
- NestJS support
- JavaScript templates
- More validation options
- Richer generated test suites
