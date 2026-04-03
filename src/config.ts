import { homedir } from "node:os";
import { join } from "node:path";

export type TeleportConfig = Record<string, string>;

function configPaths(): string[] {
  const paths: string[] = [];

  const envPath = process.env.TELEPORT_CONFIG;
  if (envPath) paths.push(envPath);

  const xdg = process.env.XDG_CONFIG_HOME || join(homedir(), ".config");
  paths.push(join(xdg, "teleport", "teleport.yaml"));

  paths.push(join(homedir(), "teleport.yaml"));

  return paths;
}

export async function findConfigPath(): Promise<string> {
  for (const path of configPaths()) {
    const file = Bun.file(path);
    if (await file.exists()) {
      return path;
    }
  }
  throw new Error(
    "No config found. Create teleport.yaml at ~/.config/teleport/teleport.yaml or set $TELEPORT_CONFIG",
  );
}

export async function loadConfig(): Promise<TeleportConfig> {
  for (const path of configPaths()) {
    const file = Bun.file(path);
    if (await file.exists()) {
      const text = await file.text();
      const parsed = Bun.YAML.parse(text);

      if (parsed === null || parsed === undefined) return {};

      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error(`Invalid config: expected key-value pairs in ${path}`);
      }

      const config: TeleportConfig = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value !== "string") {
          throw new Error(`Invalid config: value for "${key}" must be a string in ${path}`);
        }
        config[key] = value;
      }
      return config;
    }
  }

  throw new Error(
    "No config found. Create teleport.yaml at ~/.config/teleport/teleport.yaml or set $TELEPORT_CONFIG",
  );
}
