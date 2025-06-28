import chalk from 'chalk';

export function help() {
  console.log(`
Usage:
  create-discord-bot <folder-name>
  create-discord-bot .              Scaffold in current directory
  create-discord-bot -y .           Use defaults in current directory (non-interactive)

Options:
  --help, -h        Show this help message
  --version, -v     Show CLI version
  --yes, -y         Generate with default options (JavaScript, my-discord-bot)
  --pkgname, -p     Set the package name (e.g., -p cool-bot)
  --lang, -l        Set the language (e.g., -l js)

Notes:
  - If no <folder-name> is provided, you will be prompted to enter one.
  - You can use '.' to initialize the bot in the current directory.

Having issues? Feel free to open an issue at:
https://github.com/dipanshu447/create-discord-bot/issues
`);
  process.exit(0);
}

export function version() {
  console.log('v1.0.0');
  process.exit(0);
}

export function yesall(folderFromArg = null) {
  const folderName = folderFromArg || 'my-discord-bot';
  const pkgName = folderName.toLowerCase().trim().replace(/\s+/g, '-');
  const lang = 'js';

  console.log(chalk.cyan(`\nSkipping prompts. Using default options...`));
  return { folderName, pkgName, lang };
}