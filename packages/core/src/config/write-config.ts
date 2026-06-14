import path from "node:path";
import type { BackendKitConfig } from "../types/config";
import { writeJson } from "../utils/fs";

export async function writeConfig(targetDir: string, config: BackendKitConfig): Promise<void> {
  await writeJson(path.join(targetDir, "backendkit.config.json"), config);
}
