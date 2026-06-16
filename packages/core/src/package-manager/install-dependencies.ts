import type { PackageManager } from "../types/config";
import { runCommand } from "./run-command";

export async function installDependencies(packageManager: PackageManager, cwd: string): Promise<void> {
  await runCommand(packageManager, ["install"], cwd);
}
