const T_FUNCTION = `t() {
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

const ZSH_COMPLETION = `_t() {
  local -a aliases
  aliases=(\${(f)"$(teleport list --completion 2>/dev/null)"})
  _describe 'alias' aliases
}
compdef _t t`;

const BASH_COMPLETION = `_t() {
  local cur aliases
  cur="\${COMP_WORDS[COMP_CWORD]}"
  aliases="$(teleport list --completion 2>/dev/null | cut -d: -f1)"
  COMPREPLY=($(compgen -W "\${aliases}" -- "\${cur}"))
}
complete -F _t t`;

const SUPPORTED_SHELLS = ["zsh", "bash"];

export function initCommand(shell: string): void {
  if (!SUPPORTED_SHELLS.includes(shell)) {
    throw new Error(`Unsupported shell: ${shell}. Supported: ${SUPPORTED_SHELLS.join(", ")}`);
  }

  const completion = shell === "zsh" ? ZSH_COMPLETION : BASH_COMPLETION;
  process.stdout.write(T_FUNCTION + "\n\n" + completion + "\n");
}
