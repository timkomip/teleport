import { test, expect, beforeEach, afterEach } from "bun:test";
import { join } from "node:path";
import { homedir } from "node:os";

const tmpDir = join(import.meta.dir, "../.test-tmp");
const cli = join(import.meta.dir, "cli.ts");

beforeEach(async () => {
  await Bun.$`mkdir -p ${tmpDir}`;
});

afterEach(async () => {
  await Bun.$`rm -rf ${tmpDir}`;
});

function run(args: string[], env: Record<string, string> = {}) {
  return Bun.$`bun ${cli} ${args}`.env({
    ...process.env,
    ...env,
  }).quiet().nothrow();
}

test("help output", async () => {
  const result = await run(["help"]);
  expect(result.stdout.toString()).toContain("Usage: teleport");
  expect(result.exitCode).toBe(0);
});

test("--help flag", async () => {
  const result = await run(["--help"]);
  expect(result.stdout.toString()).toContain("Usage: teleport");
});

test("no args lists aliases", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "code: ~/code\nhome: ~/\n");

  const result = await run([], { TELEPORT_CONFIG: configPath });
  const out = result.stdout.toString();
  expect(out).toContain("code");
  expect(out).toContain("~/code");
  expect(result.exitCode).toBe(0);
});

test("init zsh outputs shell function", async () => {
  const result = await run(["init", "zsh"]);
  const out = result.stdout.toString();
  expect(out).toContain("t()");
  expect(out).toContain('cd "$result"');
  expect(result.exitCode).toBe(0);
});

test("init bash outputs shell function", async () => {
  const result = await run(["init", "bash"]);
  expect(result.stdout.toString()).toContain("t()");
  expect(result.exitCode).toBe(0);
});

test("init with unsupported shell fails", async () => {
  const result = await run(["init", "fish"]);
  expect(result.stderr.toString()).toContain("Unsupported shell");
  expect(result.exitCode).toBe(1);
});

test("init without shell arg fails", async () => {
  const result = await run(["init"]);
  expect(result.stderr.toString()).toContain("Usage:");
  expect(result.exitCode).toBe(1);
});

test("teleport alias resolves path", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "code: ~/code\nhome: ~/\n");

  const result = await run(["code"], { TELEPORT_CONFIG: configPath });
  expect(result.stdout.toString()).toBe(homedir() + "/code");
  expect(result.exitCode).toBe(0);
});

test("unknown alias fails", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "code: ~/code\n");

  const result = await run(["nope"], { TELEPORT_CONFIG: configPath });
  expect(result.stderr.toString()).toContain("Unknown alias: nope");
  expect(result.exitCode).toBe(1);
});

test("list shows aliases", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "code: ~/code\nhome: ~/\n");

  const result = await run(["list"], { TELEPORT_CONFIG: configPath });
  const out = result.stdout.toString();
  expect(out).toContain("code");
  expect(out).toContain("~/code");
  expect(out).toContain("home");
  expect(out).toContain("~/");
  expect(result.exitCode).toBe(0);
});
