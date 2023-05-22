import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export const yesNoKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [[
    {
      text: "Да ✅",
      callback_data: "yes"
    },
    {
      text: "Нет ❌",
      callback_data: "no"
    }
  ]]
};
