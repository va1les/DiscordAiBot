const { EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { mistral_api_key } = require("../../../config.json");
const axios = require('axios');

const mistral_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const deepseek_API_URL = 'https://api.gpt.com/v1/chat/completions';
const chat_mistral_api_key_URL = 'https://api.openai.com/v1/chat/completions';

async function chatWithBot(client, message, user, c = null) {
    try {
        const author = user;
        const channel = message?.channel;
        const content = c ? c : message?.content;

        const { cooldowns } = client;
        if (!cooldowns.has(`chatBotCooldown`)) cooldowns.set(`chatBotCooldown`, new Collection());

        const delete5 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId(`delete_message`).setEmoji(client.functions.getById(`emojis.delete`)).setStyle(ButtonStyle.Secondary)])

        const now = Date.now();
        const timestamps = cooldowns.get(`chatBotCooldown`);
        const cooldownAmount = 20_000;

        if (timestamps.has(author.id)) {
            const expirationTime = timestamps.get(author.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);

                return await client.functions.cooldownReply(message, expiredTimestamp, true);
            };
        };

        const user_data = await client.functions.findOne("user", { uid: author.id });
        if (user_data?.new) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ iconURL: client.user.displayAvatarURL(), name: `Инструкция: ${client.user.username}`.toUpperCase() })
                    .setDescription(`- Каждое сообщение в этом чате отправляется боту.\n- Установлен кулдаун на отправку сообщений — **10-20 секунд**.\n- При смене роли история чата будет сброшена.\n- Одно сообщение — **1** токен (у Вас **${user_data?.gpt?.tokens}** токенов)`)
                    .setColor(client.functions.getById(`colors.default`))
                ], components: [delete5],
            }).catch();
        };

        if (user_data?.gpt?.tokens <= 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setAuthor({ name: `Лимит использования`, iconURL: `https://i.imgur.com/TzNgR0R.png` })
                    .setDescription(`У вас закончились токены. Пополните баланс, чтобы продолжить использование.`)
                    .setColor("Red")
                    .setTimestamp()], components: [delete5],
            }).catch();
        };

        const gpt_data = user_data?.gpt;

        const chat_models = client.functions.getChatModels(client);
        const model = chat_models.find(s => s?.value == gpt_data?.model);
        if (!model) return await message.reply({ content: `${client.functions.getById(`error`)} Не удалось найти модель \`${gpt_data?.model}\`. Используйте команду \`/gpt-settings\`, чтобы выбрать доступную **модель** заново.` }).catch();

        const chat_styles = client.functions.getChatStyles(client);
        const style = chat_styles.find(s => s?.value == gpt_data?.style);
        if (!style) return await message.reply({ content: `${client.functions.getById(`error`)} Не удалось найти роль \`${gpt_data?.style}\`. Используйте команду \`/gpt-settings\`, чтобы выбрать доступную **роль** заново.` }).catch();

        const system_message = style?.system_message;

        const reply = await message.reply({ content: `**${client.user.username}** думает...` }).catch();
        await channel.sendTyping().catch();

        timestamps.set(author.id, now);
        setTimeout(() => timestamps.delete(author.id), cooldownAmount);

        const user_message = {
            role: "user",
            content: [{
                "type": "text",
                "text": content
            }],
        };

        if (message?.attachments?.size > 0 && gpt_data?.model != "pixtral-large-latest") return await message.reply({ content: `${client.functions.getById(`error`)} Для работы с изображениями вызовите команду \`/gpt-settings\` и выберите модель \`pixtral-large-latest\`.` }).catch();
        if (message?.attachments?.size > 0) {
            for (const [_, attachment] of message.attachments) {
                user_message.content.push({
                    "type": "image_url",
                    "image_url": attachment.url,
                });
            };
        };

        const chat_messages = gpt_data?.chat || [];
        const messages = [];
        if (system_message) messages.push({ role: "system", content: system_message });
        if (chat_messages?.length > 0) messages.push(...chat_messages.map(m => { return { role: m.role, content: m.content } }));
        messages.push(user_message);

        const response = await axios.post(model?.api_url || mistral_API_URL, {
            model: model?.value,
            messages: messages,
        }, {
            headers: {
                'Authorization': `Bearer ${model?.token}`,
                'Content-Type': 'application/json',
            },
        });

        const bot_message = response.data.choices[0].message.content;

        const chunks = [];
        for (let i = 0; i < bot_message.length; i += 4096) {
            chunks.push(bot_message.slice(i, i + 4096));
        };

        const embeds = [];
        for (const chunk of chunks) {
            if (embeds.length == 10) break;
            const embed = new EmbedBuilder()
                .setDescription(chunk.replaceAll(`####`, `###`))
                .setColor(client.functions.getById(`colors.default`));

            embeds.push(embed);
        };

        const components = [new ActionRowBuilder().setComponents([
            new ButtonBuilder().setCustomId(`clear_chat`).setStyle(ButtonStyle.Secondary).setEmoji(client.functions.getById(`emojis.clear`)),
            new ButtonBuilder().setCustomId(`repeat_responce`).setStyle(ButtonStyle.Secondary).setEmoji(client.functions.getById(`emojis.repeat`)),
        ])];

        // ембеды отправляем разными сообщениями, потому-что лимит символов на сообщение в ембедах — 6000
        for (let i = 0; i < embeds.length; i++) {
            if (i == 0) {
                await reply.edit({
                    content: `-# ${gpt_data?.model} - ${gpt_data?.style}`,
                    embeds: [embeds[i]],
                    components: i == embeds.length - 1 ? components : [],
                }).catch();
            } else {
                await channel.send({
                    embeds: [embeds[i]],
                    components: i == embeds.length - 1 ? components : [],
                }).catch();
            };
        };

        messages.push(
            { role: "user", content: content },
            { role: "assistant", content: bot_message, user: { id: author.id, content }, message: { id: reply.id } },
        );

        await client.functions.updateOne("user", { uid: author.id }, { $set: { "gpt.chat": messages }, $inc: { "gpt.tokens": -1 } });
    } catch (error) {
        console.log(error.message);
        return await message.react(client.functions.getById("emojis.error")).catch();
    };
};

module.exports = chatWithBot;