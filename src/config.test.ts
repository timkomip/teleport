import { test, expect, beforeEach, afterEach } from "bun:test";
import { loadConfig } from "./config.ts";
import { join } from "node:path";

const tmpDir = join(import.meta.dir, "../.test-tmp");

beforeEach(async () => {
  await Bun.$`mkdir -p ${tmpDir}`;
});

afterEach(async () => {
  await Bun.$`rm -rf ${tmpDir}`;
  delete process.env.TELEPORT_CONFIG;
});

test("loads config from TELEPORT_CONFIG env var", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "home: ~/\ncode: ~/code\n");
  process.env.TELEPORT_CONFIG = configPath;

  const config = await loadConfig();
  expect(config).toEqual({ home: "~/", code: "~/code" });
});

test("throws on missing config", async () => {
  process.env.TELEPORT_CONFIG = join(tmpDir, "nonexistent.yaml");
  // Clear XDG to avoid finding real config
  const origXdg = process.env.XDG_CONFIG_HOME;
  process.env.XDG_CONFIG_HOME = tmpDir;

  await expect(loadConfig()).rejects.toThrow("No config found");

  if (origXdg) process.env.XDG_CONFIG_HOME = origXdg;
  else delete process.env.XDG_CONFIG_HOME;
});

test("throws on non-object YAML", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "- item1\n- item2\n");
  process.env.TELEPORT_CONFIG = configPath;

  await expect(loadConfig()).rejects.toThrow("Invalid config");
});

test("throws on non-string values", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "code: 42\n");
  process.env.TELEPORT_CONFIG = configPath;

  await expect(loadConfig()).rejects.toThrow('value for "code" must be a string');
});

test("returns empty config for empty YAML", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "");
  process.env.TELEPORT_CONFIG = configPath;

  const config = await loadConfig();
  expect(config).toEqual({});
});
