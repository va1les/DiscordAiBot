const { Events, ChannelType } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const { client, author, channel } = message;

        if (channel?.type == ChannelType.DM && !author?.bot) {
            await client.functions.chatWithBot(client, message, message.author);
        };
    },
};
