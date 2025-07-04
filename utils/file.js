import fs from 'fs-extra';
import path from 'path';
import { cancel, note } from '@clack/prompts';
import { selectPrompt } from './prompts.js';
import color from 'picocolors';

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
    const files = [];
    conflictFiles.forEach(file => {
        files.push(color.red(file));
    });
    note(
        files.join('\n'),
        color.yellow('The following files already exist and may conflict:')
    );

    const action = await selectPrompt({
        message: 'How would you like to proceed?',
        options: [
            { value: 'cancel', label: 'Cancel operation' },
            { value: 'overwrite', label: 'Remove existing conflicting files and continue' },
            { value: 'skip', label: 'Skip existing files and continue' }
        ]
    });

    if (action === 'cancel') {
        cancel('Operation cancelled by user.');
        process.exit(1);
    }

    return action === 'overwrite';
}