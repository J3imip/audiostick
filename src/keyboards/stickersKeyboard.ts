import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { KeyboardContext } from "../interfaces/Keyboard";
import { prevNextKeyboard } from "./prevNextKeyboard";
import cutString from "../utils/cutString";
import { backKeyboard } from "./backKeyboard";
import { Sticker } from "../entities/Sticker";

export async function stickersKeyboard(ctx: KeyboardContext): Promise<InlineKeyboardMarkup> {
  if(!ctx.scene.state.page) ctx.scene.state.page = 0;

  const resultKeyboard: InlineKeyboardMarkup = {inline_keyboard:[]};

  const stickers = await Sticker.createQueryBuilder('sticker')
    .select([
      'sticker.id', 
      'sticker.name',
    ])
    .leftJoin('sticker.author', 'author') 
    .where(
      'author.id = :authorId AND sticker.url IS NOT NULL', 
      { authorId: ctx.scene.state.author.id }
    )
    .orderBy('sticker.id', 'ASC') 
    .skip(ctx.scene.state.page * 14)
    .take(14)
    .getMany();

  const stickersCount = await Sticker.createQueryBuilder('sticker')
    .leftJoin('sticker.author', 'author')
    .where(
      'author.id = :authorId', 
      { authorId: ctx.scene.state.author.id }
    )
    .getCount();

  if(stickersCount <= 14) {
    ctx.scene.state.maxPages = 0;
  } else if(stickersCount > 14) {
    ctx.scene.state.maxPages = Math.floor(stickersCount / 14);
  }

  for (let i = 0; i < stickers.length; i++) {
    if(i == stickers.length - 1) {
      resultKeyboard.inline_keyboard.push([{
        text: cutString(stickers[i].name),
        callback_data: stickers[i].id.toString()
      }]);
      break;
    }

    resultKeyboard.inline_keyboard.push([{
      text: cutString(stickers[i].name),
      callback_data: stickers[i].id.toString()
    }, {
      text: cutString(stickers[i + 1].name),
      callback_data: stickers[i + 1].id.toString()
    }]);

    if(stickers[i+1]) i++;
  }

  if(ctx.scene.state.maxPages > 0) {
    resultKeyboard.inline_keyboard.push(prevNextKeyboard(
      ctx.scene.state.page, 
      ctx.scene.state.maxPages
    ));
  }

  resultKeyboard.inline_keyboard.push([backKeyboard]);

  return resultKeyboard;
}
