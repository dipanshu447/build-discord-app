#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { selectPrompt, textPrompt } from './utils/prompts.js';
import { help, version, yesall } from './utils/flags.js';
import { handleExistingDirConflict, isDirectoryNotEmpty } from './utils/directory.js';
import { handleExistingFileConflicts } from './utils/file.js';
import { log, note, outro, spinner } from '@clack/prompts';
import color from 'picocolors';
import { parseCLIArgs } from './utils/args.js';
import cloneTemplate from './utils/cloneTempalte.js';

const knownFlags = ['--version', '-v', '--help', '-h', '--yes', '-y', '--pkgname', '-p', '--lang', '-l'];
const supportedLangs = ['js'];
const args = process.argv.slice(2);
let {
    foldername,
    firstArg,
    unknownFlags,
    pkgArg,
    langArg,
    hasYesFlag
} = parseCLIArgs(args, knownFlags);
let packageName = pkgArg || '';
let language = langArg || '';
const isCurrentDir = foldername === '.';
let targetPath = isCurrentDir ? process.cwd() : path.join(process.cwd(), foldername);

if (firstArg === '--help' || firstArg === '-h') help();
if (firstArg === '--version' || firstArg === '-v') version();
if (hasYesFlag) skipInteraction();

if (isCurrentDir) {
    foldername = '';
    targetPath = process.cwd();
};

function skipInteraction() {
    const presentFolder = foldername || '';
    const { folderName, pkgName, lang } = yesall(presentFolder);
    foldername = isCurrentDir ? '.' : folderName;
    packageName = pkgName;
    language = lang;

    if (foldername == '.') {
        global.allowOverwrite = true;
    }
}

if (unknownFlags.length > 0) {
    log.error(color.red(`Error: Unknown option(s): ${unknownFlags.join(', ')}`));
    log.info(`Use ${color.bold('-h')} or ${color.bold('--help')} to view available options.`);
    process.exit(1);
}

(async () => {
    if (isCurrentDir) log.info('Creating bot in the current directory.');
    if ((!foldername || foldername.trim() === '') && !isCurrentDir) {
        const folder = await textPrompt({
            message: 'Project name:',
            placeholder: `my-discord-bot`,
            initialValue: 'my-discord-bot',
            validate(value) {
                if (value.length === 0) return 'Folder name can\'t be empty';
            }
        });
        foldername = folder;
        targetPath = path.join(process.cwd(), foldername);
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
                if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)) return 'Invalid name. Use: lowercase, numbers, -, ~, . only';
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
        note(color.whiteBright(color.bold(supportedLangs.join(', '))), 'Try one of:');
        process.exit(1);
    }

    if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*)?[a-z0-9-~][a-z0-9-._~]*$/.test(packageName)) {
        log.error(color.red('Invalid package name. Use: lowercase, numbers, -, ~, . only'));
        process.exit(1);
    }
    
    const [major] = process.versions.node.split('.').map(Number);
    if (major < 18) {
        log.warn(color.yellow('Node.js v18+ is recommended for best compatibility.'));
    }
    
    const spin = spinner();
    spin.start('Creating your discord bot...');

    const templatePath = await cloneTemplate(language);
    if (!templatePath || !(await fs.pathExists(templatePath))) {
        log.error(color.red('Could not locate or download the template files.'));
        process.exit(1);
    }

    if (isCurrentDir && fs.existsSync(targetPath)) {
        if (isDirectoryNotEmpty(targetPath)) {
            const dirAction = await handleExistingDirConflict(targetPath);
            if (dirAction === 'ignored') global.allowOverwrite = !(await handleExistingFileConflicts(templatePath, targetPath));
        }
    }

    try {
        if (!isCurrentDir) {
            if (fs.existsSync(targetPath)) {
                const isEmpty = (await fs.readdir(targetPath)).length === 0;
                if (!isEmpty) {
                    log.error(color.red("Folder already exists and is not empty. Please use a different name or choose a different option."));
                    process.exit(1);
                }
            } else {
                fs.mkdirSync(targetPath);
            }
        }
        spin.message('Copying starter files...');
        if (isCurrentDir) {
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
        note([
            !isCurrentDir ? color.dim(color.gray(`cd ${foldername}`)) : null,
            color.dim(color.gray('npm install')),
            color.dim(color.gray('Rename .env.example to .env')),
            color.dim(color.gray('Add your bot token to .env')),
            color.dim(color.gray('npm run register')),
            color.dim(color.gray('npm start'))
        ].filter(Boolean).join('\n'), 'Next Steps:');
        outro(color.italic('Having issues?' + color.blueBright(' https://github.com/dipanshu447/create-discord-bot/issues ')));
    } catch (error) {
        log.error(color.red("Unexpected error occurred:"), error);
    }
})()