export function parseCLIArgs(args, knownFlags) {
    const firstArg = args[0];

    const getArgValue = (flag) => {
        const index = args.indexOf(flag);
        return index !== -1 && args[index + 1] && !args[index + 1].startsWith('-') ? args[index + 1] : null;
    };

    let folderName = args.find(arg => !arg.startsWith('-')) || '';
    const unknownFlags = args.filter(arg => arg.startsWith('-') && !knownFlags.includes(arg));

    const pkgArg = getArgValue('--pkgname') || getArgValue('-p');
    const langArg = getArgValue('--lang') || getArgValue('-l');

    return {
        folderName,
        firstArg,
        unknownFlags,
        pkgArg,
        langArg
    }
}