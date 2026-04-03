import { test, expect } from "bun:test";
import { expandTilde, resolveAlias } from "./resolve.ts";
import { homedir } from "node:os";

test("expandTilde: ~ alone", () => {
  expect(expandTilde("~")).toBe(homedir());
});

test("expandTilde: ~/path", () => {
  expect(expandTilde("~/code")).toBe(homedir() + "/code");
});

test("expandTilde: no tilde", () => {
  expect(expandTilde("/usr/local")).toBe("/usr/local");
});

test("resolveAlias: known alias", () => {
  const config = { code: "~/code" };
  const result = resolveAlias(config, "code");
  expect(result).toBe(homedir() + "/code");
});

test("resolveAlias: unknown alias throws", () => {
  const config = { code: "~/code" };
  expect(() => resolveAlias(config, "nope")).toThrow("Unknown alias: nope");
});

test("resolveAlias: absolute path unchanged", () => {
  const config = { tmp: "/tmp/test" };
  expect(resolveAlias(config, "tmp")).toBe("/tmp/test");
});
