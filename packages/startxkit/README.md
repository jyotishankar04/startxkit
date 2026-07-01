# @startxkit/cli

Project CLI for existing StartXKit projects.

Install or run it with `npx` after creating a StartXKit project:

```sh
npx @startxkit/cli add module users
```

## Commands

### Add A Module

```sh
npx @startxkit/cli add module users
```

The command reads `startxkit.config.json` and generates files using the project's framework and architecture.

Layer choices:

| Choice | Files |
| --- | --- |
| Route + Controller | route, controller |
| Route + Controller + Service | route, controller, service |
| Route + Controller + Service + Repository | route, controller, service, repository |
| Full | route, controller, service, repository, interface, validator |

### Doctor

```sh
npx @startxkit/cli doctor
```

Checks that the current directory has a valid StartXKit config, package file, module directory, framework, architecture, and package manager.

### Info

```sh
npx @startxkit/cli info
```

Prints the active project configuration.

## Architecture-Aware Output

### Modular

```text
src/
  modules/
    users/
      users.route.ts
      users.controller.ts
      users.service.ts
```

### Layered

```text
src/
  routes/
    users.route.ts
  controllers/
    users.controller.ts
  services/
    users.service.ts
```

### Minimal

```text
src/
  routes/
    users.route.ts
```

## Create A New Project

For new projects, use the create package:

```sh
npm create @startxkit@latest
```

## License

MIT
