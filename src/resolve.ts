import { homedir } from "node:os";
import { resolve } from "node:path";
import type { TeleportConfig } from "./config.ts";

export function expandTilde(path: string): string {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return homedir() + path.slice(1);
  return path;
}

export function resolveAlias(config: TeleportConfig, alias: string): string {
  const value = config[alias];
  if (value === undefined) {
    throw new Error(`Unknown alias: ${alias}`);
  }
  return resolve(expandTilde(value));
}
