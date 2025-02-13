const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	uid: { type: String, required: true },
	gpt: {
		model: { type: String, default: `mistral-large-latest` },
		style: { type: String, default: `casual_chat` },
		tokens: { type: Number, default: 10 },
		chat: { type: Array, default: [] },
	},
});

module.exports = mongoose.model('User', UserSchema);