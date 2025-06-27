#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { printSuccess } from './utils/printsuccess.js';
import ora from 'ora';
import ask from './utils/ask.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let foldername = process.argv[2];
let packageName = '';
let language = '';

// pending not done
const knownFlags = ['--version', '-v', '--help', '-h'];
const args = process.argv.slice(2);

if (args.includes('--version') || args.includes('-v')) {
    console.log('v1.0.0');
    process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  create-discord-bot <folder-name>

Note: If no <folder-name> is provided, you will be prompted to enter one interactively.

Options:
  --version, -v   Show CLI version
  --help, -h      Show this help message
`);

    process.exit(0);
}

const unknownFlags = args.filter(arg => arg.startsWith('-') && !knownFlags.includes(arg));

if (unknownFlags.length > 0) {
    console.log(chalk.red(`\nError: Unknown option(s): ${unknownFlags.join(', ')}`));
    console.log(chalk.gray('Use -h or --help to view available options.'));
    process.exit(1);
}

process.on('SIGINT', () => {
    console.log(chalk.red('\n✖ Operation cancelled by user.'));
    process.exit(1);
});

(async () => {
    if (!foldername || foldername.trim() === '') {
        const { folder } = await ask({
            type: 'text',
            name: 'folder',
            message: 'Project name:',
            initial: `my-discord-bot`
        });

        foldername = folder;
    }

    if (!packageName || packageName.trim() === '') {
        const defaultPkgName = foldername
        ? foldername.toLowerCase().trim().replace(/\s+/g, '-')
        : 'my-discord-bot';

        const { pkgname } = await ask({
            type: 'text',
            name: 'pkgname',
            message: 'Package name:',
            initial: defaultPkgName,
            validate: name =>
                /^[a-zA-Z0-9-_]+$/.test(name) ||
                'Only letters, numbers, dashes, and underscores are allowed.'
        });
        packageName = pkgname;
    }

    if (!language || language.trim() === '') {
        const { lang } = await ask({
            type: 'select',
            name: 'lang',
            message: 'Select a language for your bot:',
            choices: [
                { title: 'JavaScript', value: 'js' },
                { title: 'TypeScript (coming soon)', value: null, disabled: true },
                { title: 'Python (coming soon)', value: null, disabled: true },
            ],
            initial: 0
        });

        language = lang;
    }

    if (!packageName || packageName.trim() === '') {
        console.log(chalk.red('Package name cannot be empty.'));
        process.exit(1);
    }

    const targetPath = path.join(process.cwd(), foldername);
    const templatePath = path.join(__dirname, 'template', language);

    if (fs.existsSync(targetPath)) {
        console.log(chalk.red("Folder already exists. Please use a different name."));
        process.exit(1);
    }

    const [major] = process.versions.node.split('.').map(Number);
    if (major < 18) {
        console.log(chalk.yellow('Node.js v18+ is recommended for best compatibility.'));
    }

    console.log(chalk.green('\n✓ Summary'));
    console.log(chalk.gray(`  Project name  : ${foldername}`));
    console.log(chalk.gray(`  Package name  : ${packageName}`));
    console.log(chalk.gray(`  Language      : ${language === 'js' ? 'JavaScript' : language}\n`));

    const spinner = ora('Creating your discord bot \n').start();
    await new Promise(res => setTimeout(res, 500));
    try {
        fs.mkdirSync(targetPath);
        spinner.text = 'Copying starter files...';
        await fs.copy(templatePath, targetPath);
        spinner.text = 'Adding package details...';
        const pkgpath = path.join(targetPath, 'package.json');
        const pkgData = await fs.readJson(pkgpath);
        pkgData.name = packageName;
        await fs.writeJson(pkgpath, pkgData, { spaces: 2 })
        await new Promise(res => setTimeout(res, 700));
        spinner.succeed('Project setup completed!');
        await printSuccess(foldername, targetPath, packageName);
        console.log(chalk.yellowBright('\nYour Discord bot is ready!'));
    } catch (error) {
        spinner.fail('Something went wrong!');
        console.error(error);
    }
})()


// make a readme for the create-discord-bot
/* 
    - -y && -yes for my cli tool to generate the template in default names
    - Allow passing --pkgname and --lang as CLI args
    - . current directory template copying feature
    - think of error ways
    - whats esm? do i need that in my project?
*/