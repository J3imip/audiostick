import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export const editActions: InlineKeyboardMarkup = {
  inline_keyboard: [[
    {
      text: "Изменить название 📋",
      callback_data: "name"
    },
    {
      text: "Изменить автора 👨",
      callback_data: "author"
    }
  ], [
    {
      text: "Удалить стикер ❌",
      callback_data: "delete"
    }
  ]]
};
