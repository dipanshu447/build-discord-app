import config from './config.js';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { registerCommands } from './handlers/commandHandler.js';
import { registerEvents } from './handlers/eventHandler.js';

// Create the client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});
client.commands = new Collection();

try {
    console.log("Bot is starting...");
    await registerCommands(client);
    registerEvents(client);
    client.login(config.token);
} catch (error) {
    console.error('Failed to start bot:', error);
}