import { loadConfig } from "../config.ts";

export async function listCommand(opts: { completion?: boolean } = {}): Promise<void> {
  const config = await loadConfig();
  const entries = Object.entries(config);

  if (opts.completion) {
    for (const [alias, path] of entries) {
      console.log(`${alias}:${path}`);
    }
    return;
  }

  if (entries.length === 0) {
    console.log("No aliases configured.");
    return;
  }

  const maxKey = Math.max(...entries.map(([k]) => k.length));

  for (const [alias, path] of entries) {
    console.log(`  ${alias.padEnd(maxKey)}  ${path}`);
  }
}
