import 'dotenv/config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Setup __dirname in ES module
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

// Create the client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});
console.log("Bot is starting...");

(async () => {
    client.commands = new Collection();
    const foldersPath = path.join(__dirname, 'commands');
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

    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = (await import(pathToFileURL(filePath).href)).default;

        if (!event.name || typeof event.execute !== 'function') {
            console.log(`[WARNING] The event at ${filePath} is missing a "name" or "execute" function.`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

        console.log(`Registered event: ${event.name} (${event.once ? 'once' : 'on'})`);
    }

    client.login(process.env.DISCORD_TOKEN);
})()