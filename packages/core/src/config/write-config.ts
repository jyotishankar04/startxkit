import path from "node:path";
import type { StartXKitConfig } from "../types/config";
import { writeJson } from "../utils/fs";

export async function writeConfig(targetDir: string, config: StartXKitConfig): Promise<void> {
  await writeJson(path.join(targetDir, "startxkit.config.json"), config);
}
