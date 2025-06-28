import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { Routes, REST } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
const foldersPath = path.join(__dirname, 'commands');

console.log('Starting command deploy script...');
const commands = [];
const rest = new REST().setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        const commandsFolder = fs.readdirSync(foldersPath);
        console.log(`Reading from folder: ${foldersPath}`);

        for (const folder of commandsFolder) {
            console.log(`Found folder: ${folder}`);
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                console.log(`Processing file: ${file}`);
                const filePath = path.join(commandsPath, file);
                const command = (await import(pathToFileURL(filePath).href)).default;
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }

        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.APP_ID),
            { body: commands },
        );

        // Optional: for registering commands in a single guild for testing
        // const data = await rest.put(
        //     Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
        //     { body: commands }
        // );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})()