import { teleportCommand } from "./commands/teleport.ts";
import { initCommand } from "./commands/init.ts";
import { listCommand } from "./commands/list.ts";

const HELP = `Usage: teleport <alias>       Resolve alias and print path
       teleport list           List all aliases
       teleport init <shell>   Output shell function (zsh, bash)
       teleport help           Show this help

Setup: eval "$(teleport init zsh)"  # add to .zshrc
Then:  t <alias>                    # teleport to directory`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(HELP);
    process.exit(1);
  }

  if (args[0] === "help" || args[0] === "--help" || args[0] === "-h") {
    console.log(HELP);
    process.exit(0);
  }

  const command = args[0]!;

  try {
    switch (command) {
      case "init": {
        const shell = args[1];
        if (!shell) {
          console.error("Usage: teleport init <zsh|bash>");
          process.exit(1);
        }
        initCommand(shell);
        break;
      }
      case "list":
        await listCommand();
        break;
      default:
        await teleportCommand(command);
        break;
    }
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

main();
