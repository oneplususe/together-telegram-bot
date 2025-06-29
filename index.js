import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Telegram bot init
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Together AI setup
const openai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

const userStates = {};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  if (!userStates[chatId]) {
    userStates[chatId] = {
      isFollowed: false,
    };
  }

  const state = userStates[chatId];

  if (!state.isFollowed) {
    bot.sendMessage(
      chatId,
      "❌ You are not following me on Instagram! If you want to use this bot, please FIRST follow me on INSTAGRAM Right Now 🛡️",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📸 Visit Instagram",
                url: "https://instagram.com/mr__hamzaaa",
              },
            ],
            [
              {
                text: "✅ I have followed",
                callback_data: "followed",
              },
            ],
          ],
        },
      }
    );
    return;
  }

  // Protection: If someone talks bad about developer
  const lowerText = msg.text.toLowerCase();
  if (lowerText.includes("hamza khan") && lowerText.includes("bad")) {
    bot.sendMessage(
      chatId,
      "⚠️ Please don’t say anything bad about my developer Hamza Khan! 🚫"
    );
    return;
  }

  bot.sendMessage(chatId, "Bot is Typing...🤖");

  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/Llama-3-70b-chat-hf",
      messages: [
        {
          role: "system",
          content: "You are a smart AI created by Hamza Khan. Answer politely and smartly.",
        },
        {
          role: "user",
          content: msg.text,
        },
      ],
    });

    const aiReply = completion.choices[0].message.content;
    bot.sendMessage(chatId, aiReply);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Sorry, something went wrong!");
  }
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const state = userStates[chatId];

  if (query.data === "followed") {
    state.isFollowed = true;
    bot.answerCallbackQuery(query.id, {
      text: "✅ You are now verified! You can use the bot 🤖",
    });
    bot.sendMessage(chatId, "✅ Successfully verified! You can now use the bot. 🤖");
  }
});
