# 🤖 Discord AI Bot (Mistral-Based)

Этот бот для Discord использует **Mistral AI** и поддерживает три модели: **Codestral, Mistral Large, Pixtral Large**.  
Бот может сохранять историю чатов, поддерживает различные стили общения и использует систему токенов для контроля запросов.

---

## 📌 Возможности
👉 **3 модели ИИ:** Codestral, Mistral Large, Pixtral Large  
👉 **Выбор стиля общения** для каждой модели  
👉 **Сохранение истории чатов**  
👉 **Система токенов** (1 запрос = 1 токен)  
👉 **Настройка токенов через `/gpt-settings`** (разработчик может управлять токенами)  
👉 **Гибкая настройка через `config.json`**  

---

## 💞 Установка

### 1️⃣ Установка зависимостей
```sh
npm install
```

---

### 2️⃣ Настройка конфигурации
Создай и настрой `config.json`:
```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "mongo_url": "YOUR_MONGODB_URL",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID",
  "mistral_api_key": "MISTRAL_API_KEY",
  "developers": ["USER_ID_1"]
}
```
🔹 **`token`** – Токен бота из [Discord Developer Portal](https://discord.com/developers/applications)  
🔹 **`mongo_url`** – Ссылка на базу данных MongoDB  
🔹 **`clientId`** – ID бота  
🔹 **`guildId`** – ID сервера  
🔹 **`mistral_api_key`** – Ключ API Mistral  

---

### 3️⃣ Запуск бота
```sh
node index.js
```

---

## ⚙️ Использование

### 🎯 Основные команды:
- `/gpt-settings` – Настройки чат-бота (разработчик может управлять токенами)

**📌 Внимание!** Если у пользователя нет токенов, бот не будет отвечать.

---

## 📚 Полезные ссылки
- [Mistral API](https://console.mistral.ai/)
- [Discord.js Документация](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)

---

## 👨‍💻 Контакты
📩 **Telegram:** [@s0bakennn](https://t.me/s0bakennn)  
🌀 **Discord:** [va1les](https://discord.com/users/550336142160035840)  