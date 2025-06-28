import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('get server information.'),
    async execute(interaction) {
        interaction.reply(`${interaction.guild.name} has ${interaction.guild.memberCount} members.`);
    },
}