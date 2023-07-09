import { Scenes } from "telegraf";
import { CreateStickerContext } from "../../interfaces/CreateSticker";
import { yesNoKeyboard } from "../../keyboards/yesNo";

export const CreateStickScene = new Scenes.BaseScene<CreateStickerContext>("CreateStick");

CreateStickScene.enter(async(ctx: CreateStickerContext) => {
  await ctx.reply("Добавлять аудио-волну?", {
    reply_markup: yesNoKeyboard
  });
});

CreateStickScene.on("callback_query", async(ctx: CreateStickerContext) => {
  ctx.scene.state.stick = ctx.callbackQuery["data"] == "yes" ? true : false;
  await ctx.scene.enter("CreateAuthor", ctx.scene.state);
});
