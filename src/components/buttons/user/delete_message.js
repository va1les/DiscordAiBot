const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, MessageFlags } = require("discord.js");

module.exports = {
    name: "delete_message",
    type: "button",
    options: {
        cooldown: 1,
    },
    async execute(interaction) {
        if (!interaction.isButton()) return;

        await interaction.deleteReply().catch(async () => {
            await interaction.message.delete().catch();
        });
    },
};