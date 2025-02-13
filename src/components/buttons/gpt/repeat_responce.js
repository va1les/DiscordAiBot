const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, MessageFlags } = require("discord.js");

module.exports = {
    name: "repeat_responce",
    type: "button",
    options: {
        cooldown: 30,
    },
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { client, user, channel, message } = interaction;

        const user_data = await client.functions.findOne("user", { uid: user.id });
        const gpt_data = user_data?.gpt;

        const messageId = message.id;
        const chat_message = gpt_data?.chat?.find(m => messageId == m?.message?.id);
        if (!chat_message) {
            return await interaction.reply({ content: `${client.functions.getById(`error`)} Сообщение не найдено или чат был очищен.`, flags: MessageFlags.Ephemeral }).catch();
        } else {
            await interaction.deferUpdate().catch();
            return await client.functions.chatWithBot(client, interaction.message, user, chat_message?.user?.content);
        };
    },
};