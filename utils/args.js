import { log } from "@clack/prompts";
import color from "picocolors";

export function parseCLIArgs(args, knownFlags) {
    const firstArg = args[0];

    const getArgValue = (flag) => {
        const index = args.indexOf(flag);
        return index !== -1 && args[index + 1] && !args[index + 1].startsWith('-') ? args[index + 1] : null;
    };

    const hasYesFlag = args.includes('--yes') || args.includes('-y');
    const positionalArg = args.find(arg => !arg.startsWith('-')) || '';

    if(hasYesFlag && positionalArg && positionalArg !== '.'){
        log.warn(color.yellow(`Note: Positional argument "${positionalArg}" is ignored in --yes mode.`));
    }

    const foldername = hasYesFlag ? (positionalArg === '.' ? '.' : '') : positionalArg;
    const unknownFlags = args.filter(arg => arg.startsWith('-') && !knownFlags.includes(arg));

    const pkgArg = getArgValue('--pkgname') || getArgValue('-p');
    const langArg = getArgValue('--lang') || getArgValue('-l');

    return {
        foldername,
        firstArg,
        unknownFlags,
        pkgArg,
        langArg
    }
}