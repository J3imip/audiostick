import { Scenes } from "telegraf";
import { CreateStickerContext } from "../../interfaces/CreateSticker";
import { editActions } from "../../keyboards/editActions";

export const EditStickerScene = new Scenes.BaseScene<CreateStickerContext>("EditSticker");

EditStickerScene.enter(async(ctx) => {
  const chatId = ctx.chosenInlineResult.from.id;
  await ctx.telegram.sendMessage(chatId, `Выберите действие:`, {
    reply_markup: editActions
  });
});
