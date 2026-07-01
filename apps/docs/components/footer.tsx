import Link from "next/link";
import { Github, Terminal } from "lucide-react";

const FOOTER_LINKS = {
  docs: [
    { label: "Introduction", href: "/docs" },
    { label: "Getting Started", href: "/docs/getting-started" },
    { label: "Roadmap", href: "/docs/roadmap" },
  ],
  frameworks: [
    { label: "Express", href: "/docs/frameworks/express" },
    { label: "Fastify", href: "/docs/frameworks/fastify" },
    { label: "Hono", href: "/docs/frameworks/hono" },
  ],
  architectures: [
    { label: "Minimal", href: "/docs/architectures/minimal" },
    { label: "Modular", href: "/docs/architectures/modular" },
    { label: "Layered", href: "/docs/architectures/layered" },
  ],
  cli: [
    { label: "add module", href: "/docs/cli/add-module" },
    { label: "doctor", href: "/docs/cli/doctor" },
    { label: "info", href: "/docs/cli/info" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg border bg-muted/50 text-primary">
                <Terminal className="size-4" />
              </div>
              <span className="text-lg font-semibold">StartXKit</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              TypeScript CLI toolkit for scaffolding production-ready backend
              boilerplates. Express, Fastify, and Hono in seconds.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([key, links]) => (
            <div key={key}>
              <h4 className="mb-4 font-semibold capitalize">{key}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 StartXKit. MIT Licensed.
          </p>
          <a
            href="https://github.com/jyotishankar04/startxkit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
