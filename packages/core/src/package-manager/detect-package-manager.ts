import type { PackageManager } from "../types/config";

export function detectPackageManager(userAgent = process.env.npm_config_user_agent): PackageManager {
  if (userAgent?.startsWith("pnpm")) return "pnpm";
  if (userAgent?.startsWith("yarn")) return "yarn";
  if (userAgent?.startsWith("bun")) return "bun";
  return "npm";
}
