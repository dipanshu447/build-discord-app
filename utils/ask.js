import prompts from 'prompts';
import chalk from 'chalk';

export default async function ask(question) {
    const response = await prompts(question, {
        oncancel: () => {
            console.log(chalk.red('\n✖ Operation cancelled by user.'));
            process.exit(1);
        }
    })

    return response;
}