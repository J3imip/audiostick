import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { Category } from "../entities/Category";
import { prevNextKeyboard } from "./prevNextKeyboard";
import { KeyboardContext } from "../interfaces/Keyboard";
import cutString from "../utils/cutString";

export async function categoriesKeyboard(ctx: KeyboardContext): Promise<InlineKeyboardMarkup> {
  if(!ctx.scene.state.page) ctx.scene.state.page = 0;

  const resultKeyboard: InlineKeyboardMarkup = {inline_keyboard:[]};

  const categories = await Category.createQueryBuilder('category')
    .select([
      'category.id', 
      'category.name'
    ])
    .orderBy('category.id', 'ASC') 
    .skip(ctx.scene.state.page * 14)
    .take(14)
    .getMany();

  const categoriesCount = await Category.count();

  if(categoriesCount <= 14) {
    ctx.scene.state.maxPages = 0;
  } else if(categoriesCount > 14) {
    ctx.scene.state.maxPages = Math.floor(categoriesCount / 14);
  }

  for (let i = 0; i < categories.length; i++) {
    if(i == categories.length - 1) {
      resultKeyboard.inline_keyboard.push([{
        text: cutString(categories[i].name),
        callback_data: categories[i].id.toString()
      }]);
      break;
    }

    resultKeyboard.inline_keyboard.push([{
      text: cutString(categories[i].name),
      callback_data: categories[i].id.toString()
    }, {
      text: cutString(categories[i + 1].name),
      callback_data: categories[i + 1].id.toString()
    }]);

    if(categories[i+1]) i++;
  }

  if(ctx.scene.state.maxPages > 0) {
    resultKeyboard.inline_keyboard.push(prevNextKeyboard(
      ctx.scene.state.page, 
      ctx.scene.state.maxPages
    ));
  }

  return resultKeyboard;
}
