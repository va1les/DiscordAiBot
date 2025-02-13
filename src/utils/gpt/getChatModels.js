const { mistral_api_key } = require(`../../../config.json`)

function getChatModels(client) {
    return [
        {
            label: `Model: Codestral`,
            value: `codestral-latest`,
            emoji: client.functions.getById(`emojis.gpt.models.codestral-latest`),
            enabled: true,
            description: "Специализированная на генерации кода.",
            api_url: "https://api.mistral.ai/v1/chat/completions",
            token: mistral_api_key,
        },
        {
            label: `Model: Mistral Large`,
            value: `mistral-large-latest`,
            emoji: client.functions.getById(`emojis.gpt.models.mistral-large-latest`),
            enabled: true,
            description: "Предназначена для высокопроизводительных задач, таких как сложные рассуждения, многоязычная обработка и сложные корпоративные приложения.",
            api_url: "https://api.mistral.ai/v1/chat/completions",
            token: mistral_api_key,
        },
        {
            label: `Model: Pixtral Large`,
            value: `pixtral-large-latest`,
            emoji: client.functions.getById(`emojis.gpt.models.pixtral-large-latest`),
            enabled: true,
            description: "Способна одновременно обрабатывать текстовые и визуальные данные.",
            api_url: "https://api.mistral.ai/v1/chat/completions",
            token: mistral_api_key,
        },
    ];
};

module.exports = getChatModels;