# teleport

`teleport` is a small Bun-powered CLI for resolving directory aliases to absolute paths, plus a shell helper (`t`) that lets you jump to those directories quickly.

## What it does

Given a YAML config like this:

```yaml
home: ~/
code: ~/code
teleport: ~/code/teleport
```

You can:

- print a resolved path with `teleport code`
- list aliases with `teleport list`
- install a shell helper with `teleport init zsh` or `teleport init bash`
- jump directly with `t code`

## Prerequisites

- [Bun](https://bun.com)
- `zsh` or `bash` if you want the `t` shell helper

## Clone and set up

```bash
git clone <your-repo-url>
cd teleport
bun install
```

## Development

Run the CLI directly during development:

```bash
bun run src/cli.ts help
```

Run tests:

```bash
bun test
```

Build the standalone executable:

```bash
bun run build
```

This produces:

- `dist/teleport`

## Install locally without publishing

This project is not meant to be published to npm yet, but you can still install it locally on your machine.

### Option 1: symlink the built binary (recommended)

After building:

```bash
bun run build
ln -sf "$(pwd)/dist/teleport" "$HOME/.local/bin/teleport"
```

Make sure `$HOME/.local/bin` is on your `PATH`.

### Option 2: `bun link`

If you prefer Bun's linking workflow, you can register the package locally:

```bash
bun install
bun run build
bun link
```

See `bun link --help` or Bun's docs for the exact linking workflow you want on your machine.

## Shell setup

`teleport` prints paths, but changing directories has to happen in your current shell. For that, add the helper function to your shell config.

### zsh

Add this to `~/.zshrc`:

```bash
eval "$(teleport init zsh)"
```

Then reload your shell:

```bash
source ~/.zshrc
```

### bash

Add this to `~/.bashrc`:

```bash
eval "$(teleport init bash)"
```

Then reload your shell:

```bash
source ~/.bashrc
```

After that, you can jump with:

```bash
t code
```

## Configuration

`teleport` looks for config files in this order:

1. `$TELEPORT_CONFIG`
2. `$XDG_CONFIG_HOME/teleport/teleport.yaml`
3. `~/teleport.yaml`

Example config:

```yaml
home: ~/
code: ~/code
teleport: ~/code/teleport
```

A sample file is included at:

- `teleport.example.yaml`

## Usage

```text
Usage: teleport <alias>       Resolve alias and print path
       teleport list           List all aliases
       teleport init <shell>   Output shell function (zsh, bash)
       teleport help           Show this help
```

Examples:

```bash
teleport code
teleport list
teleport init zsh
```

## Notes

- `teleport` resolves aliases to absolute paths.
- `t` is the function that actually changes directories in your shell.
- If no config file is found, the CLI exits with an error telling you where to create one.
