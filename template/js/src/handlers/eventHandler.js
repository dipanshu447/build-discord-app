import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

// Setup __dirname in ES module
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

export async function registerEvents(client) {
    try {
        const eventsPath = path.join(__dirname, '../events');
        const eventFolder = fs.readdirSync(eventsPath);
        for (const entry of eventFolder) {
            const entryPath = path.join(eventsPath, entry);
            const isDirectory = fs.statSync(entryPath).isDirectory();
            if (isDirectory) {
                const eventFiles = fs.readdirSync(entryPath).filter(file => file.endsWith('.js'));
                for (const file of eventFiles) {
                    const filePath = path.join(entryPath, file);
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
            } else if (entry.endsWith('.js')) {
                const event = (await import(pathToFileURL(entryPath).href)).default;
                if (!event.name || typeof event.execute !== 'function') {
                    console.log(`[WARNING] The event at ${entryPath} is missing a "name" or "execute" function.`);
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
    } catch (error) {
        console.error(error);
    }

}