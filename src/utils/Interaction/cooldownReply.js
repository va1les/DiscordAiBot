const { EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('../../bot');

async function cooldownReply(interaction, expirationTime, deleteMessage = false) {
    const timeLeft = (expirationTime - (Date.now() / 1000)).toFixed(1);
    const Embed = new EmbedBuilder()
        .setAuthor({ name: `Лимит использования`, iconURL: `https://i.imgur.com/TzNgR0R.png` })
        .setDescription(`Подождите **${timeLeft}**с. перед повторным использованием взаимодействия.`)
        .setColor("Red")
        .setTimestamp();

    const delete5 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId(`delete_message`).setEmoji(client.functions.getById(`emojis.delete`)).setStyle(ButtonStyle.Secondary)])

    if (interaction?.deferred) {
        return interaction.editReply({
            embeds: [Embed],
            components: deleteMessage ? [delete5] : [],
        }).catch();
    } else if (interaction?.replied) {
        return interaction.followUp({
            embeds: [Embed],
            components: deleteMessage ? [delete5] : [],
            flags: MessageFlags.Ephemeral
        }).catch();
    } else {
        return interaction.reply({
            embeds: [Embed],
            components: deleteMessage ? [delete5] : [],
            flags: MessageFlags.Ephemeral
        }).catch();
    };
};

module.exports = cooldownReply;