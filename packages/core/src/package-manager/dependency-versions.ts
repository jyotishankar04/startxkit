const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const fallbackDependencyVersions: Record<string, string> = {
  "@hono/node-server": "^1.13.7",
  "@types/cors": "^2.8.17",
  "@types/express": "^5.0.0",
  "@types/node": "^22.10.2",
  cors: "^2.8.5",
  dotenv: "^16.4.7",
  express: "^4.21.2",
  fastify: "^5.2.1",
  hono: "^4.6.14",
  pino: "^9.5.0",
  tsx: "^4.19.2",
  typescript: "^5.7.2",
  vitest: "^2.1.8",
  zod: "^3.24.1",
};

export function fallbackDependencyVersion(packageName: string): string {
  return fallbackDependencyVersions[packageName] ?? "latest";
}

interface NpmMetadata {
  versions?: Record<string, unknown>;
  time?: Record<string, string>;
  "dist-tags"?: {
    latest?: string;
  };
}

type FetchPackageMetadata = (packageName: string) => Promise<NpmMetadata>;

const versionCache = new Map<string, string>();

function encodePackageName(packageName: string): string {
  return packageName.startsWith("@") ? `@${packageName.slice(1).replace("/", "%2F")}` : packageName;
}

async function fetchPackageMetadata(packageName: string): Promise<NpmMetadata> {
  const response = await fetch(`https://registry.npmjs.org/${encodePackageName(packageName)}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch npm metadata for ${packageName}.`);
  }

  return (await response.json()) as NpmMetadata;
}

function isPrerelease(version: string): boolean {
  return version.includes("-");
}

function compareVersionsDesc(left: string, right: string): number {
  const leftParts = left.split(".").map((part) => Number.parseInt(part, 10));
  const rightParts = right.split(".").map((part) => Number.parseInt(part, 10));

  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const leftValue = leftParts[index];
    const rightValue = rightParts[index];
    const leftPart = typeof leftValue === "number" && Number.isFinite(leftValue) ? leftValue : 0;
    const rightPart = typeof rightValue === "number" && Number.isFinite(rightValue) ? rightValue : 0;
    if (leftPart !== rightPart) return rightPart - leftPart;
  }

  return 0;
}

export function toCompatibleRange(version: string): string {
  return version.startsWith("^") ? version : `^${version}`;
}

export function selectStableVersion(
  metadata: NpmMetadata,
  now = new Date(),
  minimumAgeMs = ONE_WEEK_MS,
): string | undefined {
  const latest = metadata["dist-tags"]?.latest;
  const latestPublishedAt = latest ? metadata.time?.[latest] : undefined;

  if (latest && !isPrerelease(latest) && latestPublishedAt) {
    const ageMs = now.getTime() - new Date(latestPublishedAt).getTime();
    if (ageMs >= minimumAgeMs) return latest;
  }

  return Object.keys(metadata.versions ?? {})
    .filter((version) => !isPrerelease(version))
    .filter((version) => {
      const publishedAt = metadata.time?.[version];
      if (!publishedAt) return false;
      return now.getTime() - new Date(publishedAt).getTime() >= minimumAgeMs;
    })
    .sort(compareVersionsDesc)[0];
}

export async function resolveDependencyVersion(
  packageName: string,
  options: {
    fetchMetadata?: FetchPackageMetadata;
    now?: Date;
    minimumAgeMs?: number;
  } = {},
): Promise<string> {
  const cached = versionCache.get(packageName);
  if (cached) return cached;

  try {
    const metadata = await (options.fetchMetadata ?? fetchPackageMetadata)(packageName);
    const version = selectStableVersion(metadata, options.now, options.minimumAgeMs);
    if (version) {
      const range = toCompatibleRange(version);
      versionCache.set(packageName, range);
      return range;
    }
  } catch {
    // Registry lookups are best-effort; generation must remain usable offline.
  }

  return fallbackDependencyVersion(packageName);
}

export async function resolveDependencyVersions(
  dependencies: Record<string, string>,
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.keys(dependencies).map(async (name) => [name, await resolveDependencyVersion(name)] as const),
  );

  return Object.fromEntries(entries);
}
