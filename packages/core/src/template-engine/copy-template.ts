import fs from "fs-extra";
import path from "node:path";
import prettier from "prettier";
import { renderTemplate } from "./render-template";

const codeExtensions = new Set([".ts", ".tsx", ".js", ".json", ".md", ".yml", ".yaml"]);

async function formatOutput(filePath: string, content: string): Promise<string> {
  const extension = path.extname(filePath);
  if (!codeExtensions.has(extension)) return content;

  try {
    const config = await prettier.resolveConfig(filePath);
    return await prettier.format(content, { ...config, filepath: filePath });
  } catch {
    return content;
  }
}

export async function copyTemplate(
  templateDir: string,
  targetDir: string,
  variables: Record<string, unknown>,
): Promise<string[]> {
  const written: string[] = [];
  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(templateDir, entry.name);
    const renderedName = renderTemplate(entry.name.replace(/\.hbs$/, ""), variables);
    const targetPath = path.join(targetDir, renderedName);

    if (entry.isDirectory()) {
      written.push(...(await copyTemplate(sourcePath, targetPath, variables)));
      continue;
    }

    const source = await fs.readFile(sourcePath, "utf8");
    const rendered = renderTemplate(source, variables);
    await fs.ensureDir(path.dirname(targetPath));
    await fs.writeFile(targetPath, await formatOutput(targetPath, rendered));
    written.push(targetPath);
  }

  return written;
}
