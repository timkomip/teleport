# Teleport

A Bun-powered CLI for jumping to directories by alias. Config is YAML, shell integration via `eval "$(teleport init zsh)"`.

## Stack

- **Runtime:** Bun (not Node.js). Use `bun` for everything: running, testing, building, installing.
- **Language:** TypeScript
- **Formatting:** oxfmt (`bun run fmt` to fix, `bun run fmt:check` to verify)
- **Linting:** oxlint (`bun run lint`)
- **Testing:** `bun test`
- **Build:** `bun run build` (compiles standalone binary to `dist/teleport`)

## Project structure

```
src/cli.ts              CLI entry point, arg parsing, routes to commands
src/commands/            One file per subcommand (init, list, config, teleport)
src/config.ts            Config loading (YAML, multiple search paths)
src/resolve.ts           Alias resolution and tilde expansion
index.ts                 Re-exports src/cli.ts
lefthook.yml             Pre-commit hooks config
teleport.example.yaml    Example config file
```

## Commands

```
bun install              Install dependencies
bun test                 Run tests
bun run build            Compile standalone binary
bun run fmt              Format code
bun run fmt:check        Check formatting without writing
bun run lint             Run linter
bun run check            Run fmt:check + lint + test (all three)
bun run dev              Run CLI in dev mode
```

## Before finishing any change

Always verify your changes pass all checks before committing:

```
bun run check
```

This runs formatting, linting, and tests. Pre-commit hooks (via lefthook) enforce this automatically, but run it yourself first to catch issues early.

If formatting fails, fix with `bun run fmt` and re-run.

## Conventions

- Use Bun APIs over Node.js equivalents (`Bun.file` over `fs`, `Bun.YAML` for YAML parsing, `Bun.$` for shell commands)
- Tests live next to source files (`*.test.ts`)
- One command per file in `src/commands/`
- Config resolution order: `$TELEPORT_CONFIG` → `$XDG_CONFIG_HOME/teleport/teleport.yaml` → `~/teleport.yaml`
