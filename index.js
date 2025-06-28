#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { printSuccess } from './utils/printsuccess.js';
import ora from 'ora';
import ask from './utils/ask.js';
import { help, version, yesall } from './utils/flags.js';
import { handleExistingDirConflict, isDirectoryNotEmpty } from './utils/directory.js';
import { handleExistingFileConflicts } from './utils/file.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const knownFlags = ['--version', '-v', '--help', '-h', '--yes', '-y', '--pkgname', '-p', '--lang', '-l'];
const args = process.argv.slice(2);
const firstArgs = args[0];
const getArgValue = (flag) => {
    const index = args.indexOf(flag);
    return index !== -1 && args[index + 1] && !args[index + 1].startsWith('-') ? args[index + 1] : null;
}

let foldername = args.find(arg => !arg.startsWith('-')) || '';
const useCurrentdir = foldername === '.';
let packageName = '';
let language = '';
const packageNameArg = getArgValue('--pkgname') || getArgValue('-p');
const langNameArg = getArgValue('--lang') || getArgValue('-l');
if (packageNameArg) packageName = packageNameArg;
if (langNameArg) language = langNameArg;
let cleanupInProgress = false;
if (useCurrentdir) foldername = '';

process.on('SIGINT', async () => {
    if (cleanupInProgress) return;
    cleanupInProgress = true;

    const pathToClean = targetPath || (foldername ? path.join(process.cwd(), foldername) : null);

    console.log(chalk.yellow('\nCleaning up before exit...'));
    if (foldername && fs.existsSync(pathToClean)) {
        try {
            await fs.remove(pathToClean);
            console.log(chalk.gray(`  Removed partial installation: ${pathToClean}`));
        } catch (err) {
            console.error(chalk.red('  Cleanup failed:'), err.message);
        }
    }

    console.log(chalk.red('\n✖ Operation cancelled by user.'));
    process.exit(1);
});

function skipInteraction() {
    const { folderName, pkgName, lang } = yesall(foldername);
    foldername = folderName;
    packageName = pkgName;
    language = lang;
}

const unknownFlags = args.filter(arg => arg.startsWith('-') && !knownFlags.includes(arg));
if (unknownFlags.length > 0) {
    console.log(chalk.red(`\nError: Unknown option(s): ${unknownFlags.join(', ')}`));
    console.log(chalk.gray('Use -h or --help to view available options.'));
    process.exit(1);
}

const flagActions = {
    '--help': help,
    '-h': help,
    '--version': version,
    '-v': version,
    '--yes': skipInteraction,
    '-y': skipInteraction
};

if (flagActions[firstArgs]) {
    flagActions[firstArgs]();
}

(async () => {
    if ((!foldername || foldername.trim() === '') && !useCurrentdir) {
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

        if (!lang) {
            console.log(chalk.red('\n⚠ Language selection was cancelled or invalid.'));
            process.exit(1);
        }

        language = lang;
    }

    if (!language || typeof language !== 'string') {
        console.log(chalk.red('\nInvalid or unsupported language selected.'));
        process.exit(1);
    }

    const targetPath = useCurrentdir ? process.cwd() : path.join(process.cwd(), foldername);
    const templatePath = path.join(__dirname, 'template', language);
    if (!fs.existsSync(templatePath)) {
        console.log(chalk.red(`\nLanguage "${language}" is not supported.`));
        const tempLangFols = await fs.readdir(path.join(__dirname, 'template'));
        console.log(chalk.gray('Try one of: ') + chalk.whiteBright(tempLangFols.join(', ')));
        process.exit(1);
    }

    if (useCurrentdir && fs.existsSync(targetPath)) {
        if (isDirectoryNotEmpty(targetPath)) {
            const dirAction = await handleExistingDirConflict(targetPath);
            if (dirAction === 'ignored') global.skipExistingFiles = !(await handleExistingFileConflicts(templatePath, targetPath));
        } else {
            console.log(chalk.red("Folder already exists. Please use a different name."));
            process.exit(1);
        }
    }


    if (!packageName || packageName.trim() === '') {
        console.log(chalk.red('Package name cannot be empty.'));
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
        if (!useCurrentdir) fs.mkdirSync(targetPath);
        spinner.text = 'Copying starter files...';
        if (useCurrentdir) {
            for (const file of await fs.readdir(templatePath)) {
                const src = path.join(templatePath, file);
                const dest = path.join(targetPath, file);

                if (!global.skipExistingFiles || !(await fs.pathExists(dest))) {
                    await fs.copy(src, dest);
                }
            }
        } else {
            await fs.copy(templatePath, targetPath);
        }
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
    - MIGRATE TO CLACK JS
*/