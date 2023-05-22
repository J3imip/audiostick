import { Scenes } from "telegraf";
import { CreateStickerContext } from "../../interfaces/CreateSticker";
import { typesKeyboard } from "../../keyboards/typesKeyboard";

export const CreateTypeScene = new Scenes.BaseScene<CreateStickerContext>("CreateType");

CreateTypeScene.enter(async(ctx: CreateStickerContext) => {
  await ctx.reply("Выберите тип стикера:", {
    reply_markup: typesKeyboard
  });
});

CreateTypeScene.on("callback_query", async(ctx: CreateStickerContext) => {
  await ctx.answerCbQuery();
  ctx.scene.state.type = ctx.callbackQuery["data"];

  await ctx.scene.enter("CreateName", ctx.scene.state);
});
