const SHELL_FUNCTION = `t() {
  local result
  result="$(teleport "$@")"
  local code=$?
  if [ $code -eq 0 ] && [ -n "$result" ]; then
    local lines
    lines=$(echo "$result" | wc -l)
    if [ "$lines" -eq 1 ] && [ -d "$result" ]; then
      cd "$result"
    else
      echo "$result"
    fi
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
