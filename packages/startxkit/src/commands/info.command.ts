import pc from "picocolors";
import { isStartXKitError, readConfig } from "@startxkit/core";

export async function infoCommand(): Promise<void> {
  try {
    const config = await readConfig();
    console.log(
      [
        `${pc.bold("StartXKit")} ${config.version}`,
        `Framework: ${config.framework}`,
        `Language: ${config.language}`,
        `Architecture: ${config.architecture}`,
        `Module directory: ${config.moduleDir}`,
        `API prefix: ${config.apiPrefix || "none"}`,
        `Validation: ${config.validation}`,
        "Auth: disabled",
        "Database: disabled",
        "ORM: disabled",
      ].join("\n"),
    );
  } catch (error) {
    console.error(pc.red(isStartXKitError(error) ? error.message : "Info failed."));
    process.exit(1);
  }
}
