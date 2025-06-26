import { Events } from "discord.js";

export default {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return; // ignore other bot messages

        try {
            if (message.content === 'ping') {
                await message.reply('pong!');
                await message.react('👋');
            }
        } catch (error) {
            console.error('Error replying to message:', error);
            
            // Attempt to notify the user, if permissions allow
            try {
                await message.reply('⚠️ Something went wrong while processing your message.');
            } catch (err) {
                console.error('Also failed to send error message:', err);
            }
        }
    }
}