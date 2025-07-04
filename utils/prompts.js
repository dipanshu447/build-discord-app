import { text, cancel, isCancel, select } from "@clack/prompts";

export async function textPrompt(options) {
    const value = await text(options);
    if (isCancel(value)) {
        cancel('Operation cancelled by user.');
        process.exit(0);
    }
    return value;
}

export async function selectPrompt(options) {
    const value = await select(options);
    if (isCancel(value)) {
        cancel('Operation cancelled by user.');
        process.exit(0);
    }
    return value;
}