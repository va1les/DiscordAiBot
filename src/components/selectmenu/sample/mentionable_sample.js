const { MessageFlags } = require("discord.js");

module.exports = {
	name: "mentionable_sample",
	type: "selectmenu",

	async execute(interaction) {
		if (!interaction.isMentionableSelectMenu()) return;

		return interaction.reply({ content: `${interaction.values[0]}`, flags: MessageFlags.Ephemeral });
	},
};
