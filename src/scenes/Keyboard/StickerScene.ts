import { Scenes } from "telegraf";
import { KeyboardContext } from "../../interfaces/Keyboard";
import { stickersKeyboard } from "../../keyboards/stickersKeyboard";
import { Sticker } from "../../entities/Sticker";
import { logger } from "../../winston";

export const KeyboardStickerScene = new Scenes.BaseScene<KeyboardContext>("KeyboardSticker");

KeyboardStickerScene.enter(async(ctx: KeyboardContext) => {
  ctx.scene.state.stickers = [];

  await ctx.editMessageText("Выбери стикер:", {
    reply_markup: await stickersKeyboard(ctx)
  });
});

KeyboardStickerScene.on("callback_query", async(ctx: KeyboardContext) => {
  await ctx.answerCbQuery();

  switch (ctx.callbackQuery["data"]) {
    case "prev": {
      ctx.scene.state.page--;
      await ctx.scene.reenter();

      break;
    }
    case "next": {
      ctx.scene.state.page++;
      await ctx.scene.reenter();

      break;
    }
    case "back": {
      ctx.scene.state.page = 0;

      try {
        ctx.scene.state.stickers.forEach(async(sticker) => {
          await ctx.telegram.deleteMessage(sticker.chat.id, sticker.message_id);
        });
      } catch(error) {
        logger.error(error.message);
      }

      ctx.scene.state.stickers = [];

      await ctx.scene.enter("KeyboardAuthor", ctx.scene.state);

      break;
    }
    case "page": {
      await ctx.answerCbQuery("Страница " + (ctx.scene.state.page + 1).toString())
      break;
    }
    default: {
      const sticker = await Sticker.findOneBy({ id: ctx.callbackQuery["data"] });

      if(sticker.type == "voice") {
        ctx.scene.state.stickers.push(await ctx.telegram.sendAudio(ctx.chat.id, sticker.url));
      } else {
        ctx.scene.state.stickers.push(await ctx.telegram.sendVideoNote(ctx.chat.id, sticker.url));
      }

      break;
    }
  }
});
