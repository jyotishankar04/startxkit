import fs from "fs-extra";
import path from "node:path";
import { packageRoot, workspaceRootFromCore } from "../utils/path";

export function resolveTemplatePath(...segments: string[]): string {
  const bundled = path.join(packageRoot(), "dist", "templates", ...segments);
  if (fs.pathExistsSync(bundled)) return bundled;
  return path.join(workspaceRootFromCore(), "packages", "templates", ...segments);
}
