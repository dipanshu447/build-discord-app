import 'dotenv/config';

const config = { 
    token: process.env.DISCORD_TOKEN,
    guildid: process.env.GUILD_ID,
    appid: process.env.APP_ID,
};

export default config;