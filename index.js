#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { selectPrompt, textPrompt } from './utils/prompts.js';
import { help, version, yesall } from './utils/flags.js';
import { handleExistingDirConflict, isDirectoryNotEmpty } from './utils/directory.js';
import { handleExistingFileConflicts } from './utils/file.js';
import { cancel, intro, log, note, outro, spinner } from '@clack/prompts';
import color from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const knownFlags = ['--version', '-v', '--help', '-h', '--yes', '-y', '--pkgname', '-p', '--lang', '-l'];
const supportedLangs = ['js'];
const args = process.argv.slice(2);
const firstArgs = args[0];
const getArgValue = (flag) => {
    const index = args.indexOf(flag);
    return index !== -1 && args[index + 1] && !args[index + 1].startsWith('-') ? args[index + 1] : null;
}
let foldername = args.find(arg => !arg.startsWith('-')) || '';
const useCurrentdir = foldername === '.';
let targetPath = useCurrentdir ? process.cwd() : path.join(process.cwd(), foldername);
let packageName = '';
let language = '';
const pkgArg = getArgValue('--pkgname') || getArgValue('-p');
const langArg = getArgValue('--lang') || getArgValue('-l');
if (pkgArg) packageName = pkgArg;
if (langArg) language = langArg;
let cleanupInProgress = false;
if (useCurrentdir) foldername = '';

process.on('SIGINT', async () => {
    if (cleanupInProgress) return;
    cleanupInProgress = true;

    const pathToClean = targetPath || (foldername ? path.join(process.cwd(), foldername) : null);

    log.info(color.yellow('\nCleaning up before exit...'));
    if (foldername && fs.existsSync(pathToClean)) {
        try {
            await fs.remove(pathToClean);
            log.info(`Removed partial installation: ${pathToClean}`);
        } catch (err) {
            log.error(color.red('Cleanup failed:'), err.message);
        }
    }

    cancel('Operation cancelled by user.');
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
    log.error(color.red(`Error: Unknown option(s): ${unknownFlags.join(', ')}`));
    log.info(`Use ${color.bold('-h')} or ${color.bold('--help')} to view available options.`);
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
    intro(color.bgBlue(color.bold(color.black(' create-discord-bot '))));
    if(useCurrentdir) log.info('Creating bot in the current directory.');
    if ((!foldername || foldername.trim() === '') && !useCurrentdir) {
        const folder = await textPrompt({
            message: 'Project name:',
            placeholder: `my-discord-bot`,
            initialValue: 'my-discord-bot',
            validate(value) {
                if (value.length === 0) return 'Folder name can\'t be empty';
            }
        });
        foldername = folder;
    }

    if (!packageName || packageName.trim() === '') {
        const defaultPkgName = foldername
            ? foldername.toLowerCase().trim().replace(/\s+/g, '-')
            : 'my-discord-bot';

        const pkgname = await textPrompt({
            message: 'Package name:',
            initialValue: defaultPkgName,
            placeholder: defaultPkgName,
            validate(name) {
                if (!/^[a-zA-Z0-9-_]+$/.test(name)) return 'Only letters, numbers, dashes, and underscores are allowed.';
            }
        });
        packageName = pkgname;
    }

    if (!language || language.trim() === '') {
        const lang = await selectPrompt({
            message: 'Select a language for your bot:',
            options: [
                { value: 'js', label: 'JavaScript', hint: 'recommended' },
                { value: null, label: 'TypeScript', hint: 'coming soon', disabled: true },
                { value: null, label: 'Python', hint: 'coming soon', disabled: true },
            ],
        })
        language = lang;
    }

    if (!supportedLangs.includes(language)) {
        log.error(color.red(`Language "${language}" is not supported.`));
        const tempLangFols = await fs.readdir(path.join(__dirname, 'template'));
        note(color.whiteBright(color.bold(tempLangFols.join(', '))),'Try one of:');
        process.exit(1);
    }

    targetPath = useCurrentdir ? process.cwd() : path.join(process.cwd(), foldername);
    const templatePath = path.join(__dirname, 'template', language);

    if (useCurrentdir && fs.existsSync(targetPath)) {
        if (isDirectoryNotEmpty(targetPath)) {
            const dirAction = await handleExistingDirConflict(targetPath);
            if (dirAction === 'ignored') global.allowOverwrite = !(await handleExistingFileConflicts(templatePath, targetPath));
        }
    }

    const [major] = process.versions.node.split('.').map(Number);
    if (major < 18) {
        log.warn(color.yellow('Node.js v18+ is recommended for best compatibility.'));
    }

    const spin = spinner();
    spin.start('Creating your discord bot...');
    await new Promise(res => setTimeout(res, 500));
    try {
        if (!useCurrentdir) {
            if (fs.existsSync(targetPath)) {
                log.error(color.red("Folder already exists. Please use a different name."));
                process.exit(1);
            }
            fs.mkdirSync(targetPath);
        }
        spin.message('Copying starter files...');
        if (useCurrentdir) {
            for (const file of await fs.readdir(templatePath)) {
                const src = path.join(templatePath, file);
                const dest = path.join(targetPath, file);

                if (!global.allowOverwrite || !(await fs.pathExists(dest))) {
                    await fs.copy(src, dest);
                }
            }
        } else {
            await fs.copy(templatePath, targetPath);
        }
        spin.message('Adding package details...');
        const pkgpath = path.join(targetPath, 'package.json');
        const pkgData = await fs.readJson(pkgpath);
        pkgData.name = packageName;
        await fs.writeJson(pkgpath, pkgData, { spaces: 2 });
        await new Promise(res => setTimeout(res, 700));
        spin.stop('Project setup completed!');
        note(`${color.dim(color.gray(`cd ${foldername}`))}\n${color.dim(color.gray('npm install'))}\n${color.dim(color.gray('Rename .env.example to .env'))}\n${color.dim(color.gray('Add your bot token to .env'))}\n${color.dim(color.gray('npm start'))}`,'Next Steps:');
        outro(color.italic('Having issues?' + color.blueBright(' https://github.com/dipanshu447/create-discord-bot/issues ')));
    } catch (error) {
        console.error(error);
    }
})()