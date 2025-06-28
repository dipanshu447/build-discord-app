import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('provides user info'),
    async execute(interaction) {
        await interaction.reply(`${interaction.user.username} ran the command, who joined at ${interaction.member.joinedAt}.`);
    },
}