import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { Author } from "../entities/Author";
import { KeyboardContext } from "../interfaces/Keyboard";
import { prevNextKeyboard } from "./prevNextKeyboard";
import cutString from "../utils/cutString";
import { backKeyboard } from "./backKeyboard";

export async function authorsKeyboard(ctx: KeyboardContext): Promise<InlineKeyboardMarkup > {
  if(!ctx.scene.state.page) ctx.scene.state.page = 0;

  const resultKeyboard: InlineKeyboardMarkup = {inline_keyboard:[]};

  const authors = await Author.createQueryBuilder('author')
    .select([
      'author.id', 
      'author.name'
    ])
    .where(
      'author.category = :categoryId', 
      { categoryId: ctx.scene.state.category.id }
    )
    .orderBy('author.id', 'ASC') 
    .skip(ctx.scene.state.page * 14)
    .take(14)
    .getMany();

  const authorsCount = await Author.createQueryBuilder('author')
    .where(
      'author.category = :categoryId', 
      { categoryId: ctx.scene.state.category.id }
    )
    .getCount()

  if(authorsCount <= 14) {
    ctx.scene.state.maxPages = 0;
  } else if(authorsCount > 14) {
    ctx.scene.state.maxPages = Math.floor(authorsCount / 14);
  }

  for (let i = 0; i < authors.length; i++) {
    if(i == authors.length - 1) {
      resultKeyboard.inline_keyboard.push([{
        text: cutString(authors[i].name),
        callback_data: authors[i].id.toString()
      }]);
      break;
    }

    resultKeyboard.inline_keyboard.push([{
      text: cutString(authors[i].name),
      callback_data: authors[i].id.toString()
    }, {
      text: cutString(authors[i + 1].name),
      callback_data: authors[i + 1].id.toString()
    }]);

    if(authors[i+1]) i++;
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
