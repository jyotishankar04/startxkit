import fs from "fs-extra";
import path from "node:path";

export async function pathExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

export async function ensureEmptyDir(dir: string): Promise<void> {
  await fs.emptyDir(dir);
}

export async function writeJson(filePath: string, value: unknown): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeJson(filePath, value, { spaces: 2 });
}
