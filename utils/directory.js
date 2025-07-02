import fs from 'fs-extra';
import chalk from 'chalk';
import ask from './ask.js';

export function isDirectoryNotEmpty(path) {
    return fs.readdirSync(path).length > 0;
}

export async function handleExistingDirConflict(dirpath) {
    const files = fs.readdirSync(dirpath);
    if (files.length === 0) return;

    const { action } = await ask({
        type: 'select',
        name: 'action',
        message: chalk.yellow('Current directory is not empty. Choose how to proceed:'),
        choices: [
            { title: 'Cancel operation', value: 'cancel' },
            { title: 'Remove existing files and continue', value: 'remove' },
            { title: 'Ignore files and continue', value: 'ignore' }
        ]
    });

    if (action === 'cancel') {
        console.log(chalk.red('\n✖ Operation cancelled by user.'));
        process.exit(1);
    }

    if (action === 'remove') {
        try {
            fs.emptyDirSync(dirpath);
            console.log(chalk.gray('✔ Existing files removed.\n'));
            return 'removed';
        } catch (error) {
            console.error(chalk.red('Failed to remove existing files:'), err);
            process.exit(1);
        }
    }

    if (action === 'ignore') {
        console.log(chalk.gray('⚠ Proceeding with existing files in directory.'));
        return 'ignored';
    }
}