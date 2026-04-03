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
  return Bun.$`bun ${cli} ${args}`
    .env({
      ...process.env,
      ...env,
    })
    .quiet()
    .nothrow();
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

test("no args shows help on stderr and exits 1", async () => {
  const result = await run([]);
  expect(result.stderr.toString()).toContain("Usage: teleport");
  expect(result.exitCode).toBe(1);
});

test("init zsh outputs shell function and completion", async () => {
  const result = await run(["init", "zsh"]);
  const out = result.stdout.toString();
  expect(out).toContain("t()");
  expect(out).toContain('cd "$result"');
  expect(out).toContain("_t()");
  expect(out).toContain("compdef _t t");
  expect(out).toContain("_describe");
  expect(result.exitCode).toBe(0);
});

test("init bash outputs shell function and completion", async () => {
  const result = await run(["init", "bash"]);
  const out = result.stdout.toString();
  expect(out).toContain("t()");
  expect(out).toContain("_t()");
  expect(out).toContain("complete -F _t t");
  expect(out).toContain("compgen");
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

test("config prints config path", async () => {
  const configPath = join(tmpDir, "teleport.yaml");
  await Bun.write(configPath, "code: ~/code\n");

  const result = await run(["config"], { TELEPORT_CONFIG: configPath });
  expect(result.stdout.toString().trim()).toBe(configPath);
  expect(result.exitCode).toBe(0);
});

test("config fails when no config exists", async () => {
  const result = await run(["config"], {
    TELEPORT_CONFIG: join(tmpDir, "nonexistent.yaml"),
    XDG_CONFIG_HOME: tmpDir,
  });
  expect(result.stderr.toString()).toContain("No config found");
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
