#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import { fileURLToPath } from 'url';
import { printSuccess } from './utils/printsuccess.js';
import ora from 'ora';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let foldername = process.argv[2];
let packageName = foldername?.toLowerCase().replace(/\s+/g, '-');
let language = 'js';
(async () => {
    if (!foldername || foldername.trim() === '') {
        const res = await prompts([
            {
                type: 'text',
                name: 'folder',
                message: 'Project name:',
                initial: `my-discord-bot`
            },
            {
                type: 'text',
                name: 'pkgname',
                message: 'Package name:',
                initial: (prev) => prev.toLowerCase().replace(/\s+/g, '-')
            },
            {
                type: 'select',
                name: 'language',
                message: 'Select a language for your bot:',
                choices: [
                    { title: 'JavaScript', value: 'js' },
                    { title: 'TypeScript (coming soon)', value: null, disabled: true },
                    { title: 'Python (coming soon)', value: null, disabled: true },
                ],
                initial: 0
            }
        ]);

        foldername = res.folder;
        packageName = res.pkgname;
        language = res.language;
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
    } catch (error) {
        spinner.fail('Something went wrong!');
        console.error(error);
    }
})()


// undertsand fs, path from node js
// also make a readme.md in the template on how to use and stuff
// think ur missing something