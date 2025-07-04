import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

// Setup __dirname in ES module
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

export async function registerCommands(client) {
    const foldersPath = path.join(__dirname, '../commands');
    const commandsFolder = fs.readdirSync(foldersPath);

    for (const folder of commandsFolder) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = (await import(pathToFileURL(filePath).href)).default;
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}