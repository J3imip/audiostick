import { message } from "telegraf/filters";
import { Scenes } from "telegraf";
import { CreateStickerContext } from "../../interfaces/CreateSticker";
import { yesNoKeyboard } from "../../keyboards/yesNo";

export const CreateNameScene = new Scenes.BaseScene<CreateStickerContext>("CreateName");

CreateNameScene.enter(async(ctx: CreateStickerContext) => {
  await ctx.reply("Придумайте название стикера:");
});

CreateNameScene.on(message("text"), async(ctx: CreateStickerContext) => {
  ctx.scene.state.name = ctx.message["text"];
  if(ctx.scene.state.type == "voice") {
    return await ctx.reply("Подписать стикер?", { 
      reply_markup: yesNoKeyboard
    });
  }
  await ctx.scene.enter("CreateAuthor", ctx.scene.state);
});

CreateNameScene.on("callback_query", async(ctx: CreateStickerContext) => {
  await ctx.answerCbQuery();
  ctx.scene.state.sign = ctx.callbackQuery["data"] == "yes" ? true : false;
  await ctx.scene.enter("CreateAuthor", ctx.scene.state);
});
