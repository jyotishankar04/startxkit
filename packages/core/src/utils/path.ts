import path from "node:path";
import { fileURLToPath } from "node:url";

export const cwd = () => process.cwd();

export function packageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.basename(currentDir) === "utils"
    ? path.resolve(currentDir, "..", "..")
    : path.resolve(currentDir, "..");
}

export function workspaceRootFromCore(): string {
  return path.resolve(packageRoot(), "..", "..");
}
