import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileCode2,
  GitBranch,
  Layers,
  Package,
  ShieldCheck,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";

const COMMANDS = [
  {
    command: "npm create @startxkit@latest",
    title: "Create a backend",
    desc: "Launches the interactive scaffold flow for a new TypeScript API.",
  },
  {
    command: "npx @startxkit/cli add module users",
    title: "Add a module",
    desc: "Generates route, controller, service, repository, interface, and validation files based on the selected layer.",
  },
  {
    command: "npx @startxkit/cli doctor",
    title: "Check the project",
    desc: "Validates StartXKit config, framework, architecture, package manager, and module directory.",
  },
  {
    command: "npx @startxkit/cli info",
    title: "Print project info",
    desc: "Shows framework, language, architecture, module directory, API prefix, and validation choices.",
  },
];

const PROMPTS = [
  "Project name",
  "Framework: Express, Fastify, Hono",
  "Architecture: Minimal, Modular, Layered",
  "API prefix: /api/v1, /api, none, custom",
  "Package manager: pnpm, npm, yarn, bun",
  "Optional CORS, env config, Zod, logger, Docker, Vitest",
];

const FEATURES = [
  {
    icon: Zap,
    title: "Interactive setup",
    desc: "A create command asks the right project questions and writes a runnable backend.",
  },
  {
    icon: Layers,
    title: "Architecture presets",
    desc: "Choose minimal, modular, or layered structure before files are generated.",
  },
  {
    icon: Wrench,
    title: "Optional plumbing",
    desc: "Generate CORS, env config, validation, logging, error handling, Docker, and tests when needed.",
  },
  {
    icon: Package,
    title: "Module generator",
    desc: "Add feature modules later without manually wiring route registration.",
  },
  {
    icon: GitBranch,
    title: "Framework-native output",
    desc: "Generated projects stay close to Express, Fastify, or Hono instead of hiding behind a runtime.",
  },
  {
    icon: ShieldCheck,
    title: "Clear MVP boundary",
    desc: "No auth, database, ORM, Prisma, Drizzle, Mongoose, OAuth, JWT, or sessions yet.",
  },
];

const FRAMEWORKS = [
  {
    name: "Express",
    href: "/docs/frameworks/express",
    desc: "Classic Node.js API projects with middleware, routes, controllers, and optional Express error handling.",
  },
  {
    name: "Fastify",
    href: "/docs/frameworks/fastify",
    desc: "Fastify projects with plugin-friendly server setup and generated feature modules.",
  },
  {
    name: "Hono",
    href: "/docs/frameworks/hono",
    desc: "Small Hono projects for lightweight APIs with native route mounting.",
  },
];

const FILE_TREE = [
  "my-api/",
  "  src/",
  "    server.ts",
  "    app.ts",
  "    modules/",
  "      health/",
  "      users/",
  "        users.route.ts",
  "        users.controller.ts",
  "        users.service.ts",
  "        users.repository.ts",
  "    routes/index.ts",
  "  startxkit.config.json",
  "  package.json",
];

function CliPreview() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="absolute -left-4 top-28 hidden rounded-md bg-amber-200 px-3 py-1 text-xs font-semibold text-zinc-950 shadow-lg shadow-amber-950/20 sm:block">
        create
      </div>
      <div className="absolute -right-4 top-48 hidden rounded-md bg-indigo-400 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-indigo-950/30 sm:block">
        add module
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#10111b] shadow-2xl shadow-black/30 ring-1 ring-white/5">
        <div className="flex h-12 items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-4">
          <span className="size-2.5 rounded-full bg-[#ff6b6b]" />
          <span className="size-2.5 rounded-full bg-[#ffd166]" />
          <span className="size-2.5 rounded-full bg-[#06d6a0]" />
          <div className="ml-4 flex h-full items-center gap-1 text-xs text-zinc-300">
            <span className="flex h-full items-center gap-2 border-x border-white/10 bg-white/[0.05] px-4 text-white">
              <Terminal className="size-3.5 text-emerald-300" />
              terminal
            </span>
            <span className="hidden px-3 sm:inline">startxkit.config.json</span>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-[1fr_0.9fr] sm:p-6">
          <div className="font-mono text-sm leading-7">
            <p className="text-emerald-300">$ npm create @startxkit@latest</p>
            <p className="text-zinc-500">Welcome to StartXKit</p>
            <p className="text-zinc-200">Project name: my-api</p>
            <p className="text-zinc-200">Framework: Fastify</p>
            <p className="text-zinc-200">Architecture: Layered</p>
            <p className="text-zinc-200">API prefix: /api/v1</p>
            <p className="text-zinc-200">Validation: Zod</p>
            <p className="text-zinc-200">Logger: Pino</p>
            <p className="text-indigo-300">$ npx @startxkit/cli add module users</p>
            <p className="text-amber-200">Generated files: 6</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4 font-mono text-xs leading-6 text-zinc-300">
            <div className="mb-3 flex items-center gap-2 text-zinc-100">
              <FileCode2 className="size-3.5 text-amber-200" />
              generated tree
            </div>
            {FILE_TREE.map((line) => (
              <p key={line} className={line.endsWith("/") ? "text-sky-300" : ""}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-hidden bg-background text-foreground">
      <section className="relative px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.2),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.06),transparent_42%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(129,140,248,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_42%)]" />
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[1.25rem] border border-border/70 bg-card/75 p-4 shadow-2xl shadow-zinc-950/10 backdrop-blur dark:bg-zinc-950/75 dark:shadow-black/30 sm:p-8 lg:p-12">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Terminal className="size-3.5 text-primary" />
                TypeScript backend generator CLI
              </div>

              <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
                Scaffold a backend from the{" "}
                <span className="bg-gradient-to-r from-amber-300 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                  command line.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
                StartXKit is a TypeScript CLI toolkit for generating Express,
                Fastify, and Hono boilerplates. Run one create command, choose
                the project shape, then add feature modules as your API grows.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/docs/getting-started"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/docs/cli/add-module"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background/70 px-5 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  CLI commands
                  <ChevronRight className="size-4" />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs font-medium text-muted-foreground">
                {["TypeScript only today", "No database lock-in", "Express, Fastify, Hono"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5"
                  >
                    <Check className="size-3.5 text-emerald-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-14">
              <CliPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">CLI workflow</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">
              Commands this repo actually ships
            </h2>
          </div>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Read the docs
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {COMMANDS.map((item) => (
            <div key={item.command} className="rounded-lg border border-border bg-card p-5">
              <code className="rounded-md bg-muted px-2 py-1 font-mono text-sm text-foreground">
                {item.command}
              </code>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div>
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-primary">
              <Terminal className="size-5" />
            </div>
            <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              The create flow is the main product.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              StartXKit asks for the framework, architecture, API prefix,
              package manager, and optional features, then writes a runnable
              project with a health module and config file.
            </p>
            <div className="mt-6 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Terminal className="size-4 text-primary" />
                <code className="font-mono text-foreground">
                  npm create @startxkit@latest
                </code>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {PROMPTS.map((prompt) => (
              <div
                key={prompt}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{prompt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-medium text-primary">Generated targets</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">
              Pick the framework before scaffolding
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {FRAMEWORKS.map((framework) => (
              <Link
                href={framework.href}
                key={framework.name}
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-background"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">{framework.name}</span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {framework.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
              <ShieldCheck className="size-4" />
              MVP scope is intentional
            </div>
            <h2 className="text-2xl font-semibold tracking-normal">
              Start with backend structure, not auth or database opinions.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              The current CLI generates simple request/response handlers,
              modules, docs, config, and project scaffolds. Auth, databases,
              ORMs, Prisma, Drizzle, Mongoose, JWT, OAuth, and sessions are
              roadmap items.
            </p>
          </div>
          <Link
            href="/docs/roadmap"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            View roadmap
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
