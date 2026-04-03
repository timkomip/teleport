const SHELL_FUNCTION = `t() {
  if [ $# -eq 0 ]; then
    teleport list
    return
  fi
  local result
  result="$(teleport "$@")"
  if [ $? -eq 0 ] && [ -n "$result" ]; then
    cd "$result"
  fi
}`;

const SUPPORTED_SHELLS = ["zsh", "bash"];

export function initCommand(shell: string): void {
  if (!SUPPORTED_SHELLS.includes(shell)) {
    throw new Error(`Unsupported shell: ${shell}. Supported: ${SUPPORTED_SHELLS.join(", ")}`);
  }
  // Same function works for both zsh and bash
  process.stdout.write(SHELL_FUNCTION + "\n");
}
