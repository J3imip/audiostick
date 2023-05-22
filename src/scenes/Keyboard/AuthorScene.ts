import { Scenes } from "telegraf";
import { KeyboardContext } from "../../interfaces/Keyboard";
import { Author } from "../../entities/Author";
import { authorsKeyboard } from "../../keyboards/authorsKeyboard";

export const KeyboardAuthorScene = new Scenes.BaseScene<KeyboardContext>("KeyboardAuthor");

KeyboardAuthorScene.enter(async(ctx: KeyboardContext) => {
  await ctx.editMessageText("Выбери автора:", {
    reply_markup: await authorsKeyboard(ctx)
  });
});

KeyboardAuthorScene.on("callback_query", async(ctx: KeyboardContext) => {
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
      await ctx.scene.enter("KeyboardCategory", ctx.scene.state);

      break;
    }
    case "page": {
      await ctx.answerCbQuery("Страница " + (ctx.scene.state.page + 1).toString())
      break;
    }
    default: {
      const chosenAuthor = await Author.findOneBy({ id: ctx.callbackQuery["data"] });

      ctx.scene.state.author = chosenAuthor;

      ctx.scene.state.page = 0;
      await ctx.scene.enter("KeyboardSticker", ctx.scene.state);

      break;
    }
  }
});
