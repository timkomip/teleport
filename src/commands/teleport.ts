import { loadConfig } from "../config.ts";
import { resolveAlias } from "../resolve.ts";

export async function teleportCommand(alias: string): Promise<void> {
  const config = await loadConfig();
  const path = resolveAlias(config, alias);
  process.stdout.write(path);
}
