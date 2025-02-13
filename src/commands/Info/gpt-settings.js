const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, InteractionContextType, TextInputStyle } = require('discord.js')
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders');
const { developers } = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt-settings')
        .setDescription("GPT Settings").setContexts(InteractionContextType.BotDM),
    options: {
        DM: true,
    },
    async execute(interaction) {
        const { client, user } = interaction;

        await interaction.deferReply({ withResponse: true, flags: MessageFlags.Ephemeral }).catch();

        const models = client.functions.getChatModels(client);
        const options = client.functions.getChatStyles(client);

        async function updateEmbed(interaction) {
            const user_data = await client.functions.findOne("user", { uid: user.id });
            const gpt_data = user_data?.gpt;
            const filteredModels = models.filter(o => o?.enabled == true);
            const modelOptions = filteredModels.length > 0 ? filteredModels : [models[0]];

            const select_model = new StringSelectMenuBuilder()
                .setCustomId(`select-model`)
                .setPlaceholder(`Модель чат-бота`)
                .setOptions(
                    modelOptions.map(option =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(option.label)
                            .setValue(option.value)
                            .setDescription(option?.description.length > 100 ? option?.description.slice(0, 97) + `...` : option?.description)
                            .setEmoji(option.emoji)
                            .setDefault(gpt_data?.model == option.value)
                    )
                );

            const filteredRoles = options.filter(o => o?.enabled == true && o?.models?.includes(gpt_data?.model));
            const roleOptions = filteredRoles.length > 0 ? filteredRoles : [options[0]];

            const select_role = new StringSelectMenuBuilder()
                .setCustomId(`select-role`)
                .setPlaceholder(`Роль чат-бота`)
                .setOptions(
                    roleOptions.map(option =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(option.label)
                            .setValue(option.value)
                            .setDescription(option?.description.length > 100 ? option?.description.slice(0, 97) + `...` : option?.description)
                            .setEmoji(option.emoji)
                            .setDefault(gpt_data?.style == option.value)
                    )
                );

            const clear_chat = new ButtonBuilder().setCustomId(`clear_chat`).setStyle(ButtonStyle.Secondary).setEmoji(client.functions.getById(`emojis.clear`));
            const tokens_plus = new ButtonBuilder().setCustomId(`tokens+`).setStyle(ButtonStyle.Secondary).setEmoji(client.functions.getById(`emojis.tokens`));

            const model_row = new ActionRowBuilder().addComponents([select_model]);
            const role_row = new ActionRowBuilder().addComponents([select_role]);
            const buttons_row = new ActionRowBuilder().addComponents([clear_chat]);
            if (developers.includes(user.id)) buttons_row.addComponents([tokens_plus]);
            const content = {
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.functions.getById("emojis.gpt.icon")} Настройки gpt`.toUpperCase())
                        .setDescription(`\`\`\`js\nTokens: ${gpt_data?.tokens || 0}\nModel: ${gpt_data?.model}\nRole: ${gpt_data?.style}\nChat: ${gpt_data?.chat?.length || 0} msg\`s\`\`\``)
                        .setColor(client.functions.getById(`colors.default`))
                ],
                components: [model_row, role_row, buttons_row],
            };

            if (interaction?.deferred) {
                return await interaction.editReply(content).catch();
            } else {
                return await interaction.update(content).catch();
            };
        };

        const reply = await updateEmbed(interaction);
        const collector = reply.createMessageComponentCollector({ time: 10 * 1000 * 60 });

        collector.on("collect", async (i) => {
            if (i.customId == `select-model`) {
                const model = i?.values?.[0];

                await client.functions.updateOne("user", { uid: user.id }, { $set: { "gpt.model": model, "gpt.style": options.filter(o => o?.enabled == true && o?.models?.includes(model))?.[0]?.value, "gpt.chat": [] } });
                return await updateEmbed(i);
            };

            if (i.customId == `select-role`) {
                const style = i?.values?.[0];

                await client.functions.updateOne("user", { uid: user.id }, { $set: { "gpt.style": style, "gpt.chat": [] } });
                return await updateEmbed(i);
            };

            if (i.customId.startsWith(`tokens`)) {
                const tokens = i.customId.replace(`tokens`, ``);

                const modal = new ModalBuilder()
                    .setTitle(`Own Role`).setCustomId(`own-role-modal-${client.functions.randomId(2)}`);

                const userId = new TextInputBuilder().setLabel(`user ID`).setPlaceholder(`${user.id}`).setCustomId(`tokens-user-id`).setStyle(TextInputStyle.Short);
                const tokensAmount = new TextInputBuilder().setLabel(`tokens amount`).setPlaceholder(`10`).setCustomId(`tokens-amount`).setStyle(TextInputStyle.Short);

                const rows = [
                    new ActionRowBuilder().addComponents([userId]),
                    new ActionRowBuilder().addComponents([tokensAmount]),
                ];

                modal.addComponents(rows);

                await i.showModal(modal).catch(() => { return; });

                const filter = (m) => m.customId == `${modal.data.custom_id}` && m.user.id == user.id;
                const submitted = await i.awaitModalSubmit({ max: 1, time: 5 * 60 * 1000, filter });
                if (submitted) {
                    const userId = submitted.fields.getTextInputValue("tokens-user-id");
                    const tokensAmount = Number(submitted.fields.getTextInputValue("tokens-amount"));
                    if (isNaN(tokensAmount)) return await submitted.reply({ content: `${client.functions.getById(`emojis.error`)} Пожалуйста, введите число.`, flags: MessageFlags.Ephemeral }).catch();

                    const updated_user_data = await client.functions.updateOne("user", { uid: userId }, { $inc: { "gpt.tokens": tokensAmount } });
                    return await submitted.reply({
                        content: `${client.functions.getById(`emojis.success`)} <@${userId}>, теперь имеет **${updated_user_data?.gpt?.tokens}** токенов`, flags: MessageFlags.Ephemeral
                    }).catch();
                };
            };
        });
    },
};