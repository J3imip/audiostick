import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

export function prevNextKeyboard(page: number, max: number): InlineKeyboardButton[] {
  const result: InlineKeyboardButton[] = [];

  if(page > 0) {
    result.push({
      text: "◀️ Назад",
      callback_data: `prev`
    });
  }

  result.push( {
    text: `Страница ${page + 1}`,
    callback_data: "page"
  });

  if(page < max) {
    result.push( {
      text: "Вперед ▶️",
      callback_data: `next`
    });
  }

  return result;
};
