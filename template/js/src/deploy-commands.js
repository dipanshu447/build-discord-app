import fs from 'node:fs';
import path from 'node:path';
import { Routes, REST } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'node:url';
import config from './config.js';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
const foldersPath = path.join(__dirname, 'commands');

console.log('Starting command deploy script...');
const commands = [];
const rest = new REST().setToken(config.token);
(async () => {
    try {
        const commandsFolder = fs.readdirSync(foldersPath);
        console.log(`Reading from folder: ${foldersPath}`);
        for (const entry of commandsFolder) {
            const entryPath = path.join(foldersPath, entry);
            const isDirectory = fs.statSync(entryPath).isDirectory();
            if (isDirectory) {
                console.log(`Found folder: ${entry}`);
                const commandFiles = fs.readdirSync(entryPath).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    console.log(`Processing file: ${file}`);
                    const filePath = path.join(entryPath, file);
                    const command = (await import(pathToFileURL(filePath).href)).default;
                    if ('data' in command && 'execute' in command) {
                        commands.push(command.data.toJSON());
                    } else {
                        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                    }
                }
            } else if (entry.endsWith('.js')) {
                console.log(`Processing file: ${entry}`);
                const command = (await import(pathToFileURL(entryPath).href)).default;
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${entryPath} is missing a required "data" or "execute" property.`);
                }
            }
        }

        if (commands.length === 0) {
            console.warn('⚠️ No valid commands found to register.');
            return;
        }
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // const data = await rest.put(
        //     Routes.applicationCommands(config.appid),
        //     { body: commands },
        // );

        // Optional: for registering commands in a single guild for testing
        const data = await rest.put(
            Routes.applicationGuildCommands(config.appid, config.guildid),
            { body: commands }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})()