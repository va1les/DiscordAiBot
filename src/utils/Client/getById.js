function getById(name) {
    const data = {
        emojis: {
            success: "✅",
            warn: "⚠",
            error: "❌",
            stats: "📊",
            delete: "🗑️",
            clear: "🧹",
            repeat: "🔁",
            role: "👤",
            tokens: "🎫",
            gpt: {
                icon: "🤖",
                roles: {
                    "pixtral-large": "🖼",
                    "programmer": "💻",
                    "scientist": "🔬",
                    "friend": "😊",
                    "psychologist": "🧠",
                    "study": "📚",
                    "ege": "📕",
                    "jokester": "😂",
                    "own": "👑"
                },
                models: {
                    "codestral-latest": "💻",
                    "mistral-large-latest": "👤",
                    "pixtral-large-latest": "🖼",
                },
            },
        },
        colors: {
            default: 2829617
        },
        time: {
            msk: new Date().toLocaleTimeString('ru', { timeZone: 'Europe/Moscow', timeStyle: 'short' }) // 20:00 (пример)
        },
    };

    const parts = name.split('.');
    let w = data;
    for (let part of parts) {
        if (w[part] != undefined) {
            w = w[part];
        } else {
            return data.emojis.error;
        };
    };

    return w;
};

module.exports = getById;