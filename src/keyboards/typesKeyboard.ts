import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export const typesKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [[
    {
      text: "Видеосообщение 🎞",
      callback_data: "video"
    },
    {
      text: "Голосовое 🎤",
      callback_data: "voice"
    }
  ]]
};
