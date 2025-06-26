import chalk from 'chalk';

export async function printSuccess(folderName, targetPath, packageName, version = 'v1.0.0') {
    const indent = '│ ';
    const borderTop = '┌';
    const borderBottom = '└';

    const lines = [
        `● Version : ${chalk.white(version)}`,
        `● Project name : ${chalk.white(folderName)}`,
        `● Package name : ${chalk.white(packageName)}`,
        '',
        chalk.green.bold(`Files scaffolded at: ${targetPath}`),
        '',
        chalk.blue.bold('Next steps:'),
        `${chalk.yellow('>')} ${chalk.italic('cd')} ${chalk.white(folderName)}`,
        `${chalk.yellow('>')} ${chalk.italic('npm install')}`,
        `${chalk.yellow('>')} ${chalk.italic('rename')} ${chalk.white('.env.example')} ${chalk.italic('to')} ${chalk.whiteBright('.env')}`,
        `${chalk.yellow('>')} ${chalk.italic('add your bot token to')} ${chalk.white('.env')}`,
        `${chalk.yellow('>')} ${chalk.italic('npm start')}`
    ];

    console.log(chalk.gray(borderTop));
    for (const line of lines) {
        if (line === '') {
            console.log(chalk.gray(indent));
        } else {
            console.log(chalk.gray(indent + line));
        }
    }
    console.log(chalk.gray(borderBottom));
}