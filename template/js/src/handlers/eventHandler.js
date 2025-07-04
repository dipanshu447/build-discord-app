import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

// Setup __dirname in ES module
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

export async function registerEvents(client) {
    const eventsPath = path.join(__dirname, '../events');
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
}