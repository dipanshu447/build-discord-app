import fs from 'fs-extra';
import { selectPrompt } from './prompts.js';
import color from 'picocolors';
import { log, spinner } from '@clack/prompts';

export function isDirectoryNotEmpty(path) {
    return fs.readdirSync(path).length > 0;
}

export async function handleExistingDirConflict(dirpath) {
    const files = fs.readdirSync(dirpath);
    if (files.length === 0) return;
    const spin = spinner();

    const action = await selectPrompt({
        message: color.yellow('Current directory is not empty. Choose how to proceed:'),
        options: [
            { value: 'cancel', label: 'Cancel operation' },
            { value: 'remove', label: 'Remove existing files and continue', hint: 'recommended' },
            { value: 'ignore', label: 'Ignore files and continue' }
        ]
    });

    if (action === 'cancel') {
        log.error(color.red('Operation cancelled by user.'));
        process.exit(1);
    }

    if (action === 'remove') {
        try {
            spin.start("Removing Existing files")
            await fs.emptyDir(dirpath);
            spin.stop(color.green('Existing files removed.'));
            return 'removed';
        } catch (error) {
            log.error(color.red('Failed to remove existing files:'),error);
            process.exit(1);
        }
    }

    if (action === 'ignore') {
        log.warning(color.yellow('Proceeding with existing files in directory.'));
        return 'ignored';
    }
}