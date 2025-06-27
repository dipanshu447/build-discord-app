import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ask from './ask.js';

export async function handleExistingFileConflicts (templatePath, targetPath) {
    const templateFiles = await fs.readdir(templatePath);
    const conflictFiles = [];

    for (const file of templateFiles) {
        const targetFile = path.join(targetPath, file);
        if (await fs.pathExists(targetFile)) {
            conflictFiles.push(targetFile);
        }
    }

    if (conflictFiles.length === 0) return false;

    console.log(chalk.yellow('\n⚠ The following files already exist and may conflict:'));
    conflictFiles.forEach(file => {
        console.log(`  ${chalk.red(file)}`);
    });

    const { action } = await ask({
        type: 'select',
        name: 'action',
        message: 'How would you like to proceed?',
        choices: [
            { title: 'Cancel operation', value: 'cancel' },
            { title: 'Remove existing conflicting files and continue', value: 'overwrite' },
            { title: 'Skip existing files and continue', value: 'skip' }
        ]
    });

    if (action === 'cancel') {
        console.log(chalk.red('\n✖ Operation cancelled by user.'));
        process.exit(1);
    }

    return action === 'overwrite';
}