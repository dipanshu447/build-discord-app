import { log } from '@clack/prompts';
import color from 'picocolors';

export function help() {
  log.message(
    `${color.bold('Usage:')}
  create-discord-bot <folder-name>
  create-discord-bot .              Scaffold in current directory
  create-discord-bot -y .           Use defaults in current directory (non-interactive)

${color.bold('Options:')}
  --help    | -h    Show this help message
  --version | -v    Show CLI version
  --yes     | -y    Generate with default options (JavaScript, my-discord-bot)
  --pkgname | -p    Set the package name (e.g., -p cool-bot)
  --lang    | -l    Set the language (e.g., -l js)

${color.bold('Notes:')}
  - If no <folder-name> is provided, you will be prompted to enter one.
  - You can use '.' to initialize the bot in the current directory.
  - Flags like --yes must come first to be recognized.

${color.bold('Having issues?')} Feel free to open an issue at:
${color.blue('https://github.com/dipanshu447/create-discord-bot/issues')}`
  );
  process.exit(0);
}

export function version() {
  console.log('v1.0.0');
  process.exit(0);
}

export function yesall() {
  const folderName = 'my-discord-bot';
  const pkgName = folderName.toLowerCase().trim().replace(/\s+/g, '-');
  const lang = 'js';

  log.info(color.cyan(`Skipping prompts. Using default options...`));
  return { folderName, pkgName, lang };
}