import { Scenes } from "telegraf";
import { CreateStickerContext } from "../../interfaces/CreateSticker";
import { message } from "telegraf/filters";
import { Category } from "../../entities/Category";
import { createSticker } from "../../utils/createStikcer";
import { Author } from "../../entities/Author";

export const CreateCategoryScene = new Scenes.BaseScene<CreateStickerContext>("CreateCategory");

CreateCategoryScene.enter(async(ctx: CreateStickerContext) => {
  await ctx.reply("Напишите название категории автора (Меморезка, Фильмы...):");
});

CreateCategoryScene.on(message("text"), async(ctx: CreateStickerContext) => {
  let category = await Category.findOneBy({ name: ctx.message["text"] });
  if(!category) {
    category = await Category.create({
      name: ctx.message["text"]
    }).save();
  }
  
  ctx.scene.state.author = await Author.create({
    name: ctx.scene.state.author.toString(),
    category
  }).save();

  await createSticker(ctx);
});
