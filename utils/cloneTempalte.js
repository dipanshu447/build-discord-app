import degit from "degit";
import { log } from '@clack/prompts';
import { join } from "path";
import { tmpdir } from 'os';
import color from "picocolors";

export default async function cloneTemplates(lang) {
    const tempPath = join(tmpdir(), `create-discord-app-${Date.now()}`);
    const repoPath = `dipanshu447/create-discord-app-templates/${lang}`;

    const emitter = degit(repoPath, {
        cache: false,
        force: true,
        verbose: false,
    });

    try {
        await emitter.clone(tempPath);
        return tempPath;
    } catch (error) {
        log.error(color.red(`Failed to fetch template from GitHub.`));
        log.error(color.red(error.message));
        process.exit(1);
    }
}