const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, MessageFlags } = require("discord.js");

module.exports = {
    name: "clear_chat",
    type: "button",
    options: {
        cooldown: 1,
    },
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { client, user } = interaction;

        await client.functions.updateOne("user", { uid: user.id }, { $set: { "gpt.chat": [] } });
        await interaction.reply({ content: `${client.functions.getById(`emojis.clear`)} История чата была очищена.`, flags: MessageFlags.Ephemeral }).catch();
    },
};