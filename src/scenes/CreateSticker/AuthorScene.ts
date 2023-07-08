import { message } from "telegraf/filters";
import { Scenes } from "telegraf";
import { CreateStickerContext } from "../../interfaces/CreateSticker";
import { Author } from "../../entities/Author";
import { createSticker } from "../../utils/createSticker";

export const CreateAuthorScene = new Scenes.BaseScene<CreateStickerContext>("CreateAuthor");

CreateAuthorScene.enter(async(ctx: CreateStickerContext) => {
  await ctx.reply("Напишите название автора:");
});

CreateAuthorScene.on(message("text"), async(ctx: CreateStickerContext) => {
  const author = await Author.findOne({ 
    where: {
      name: ctx.message["text"] 
    }, 
    relations: ["category"]
  });
  ctx.scene.state.author = author;

  if(!author) {
    ctx.scene.state.author = ctx.message["text"];

    return await ctx.scene.enter("CreateCategory", ctx.scene.state);
  }

  await createSticker(ctx);
});
