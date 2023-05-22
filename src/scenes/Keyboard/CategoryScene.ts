import { Scenes } from "telegraf";
import { KeyboardContext } from "../../interfaces/Keyboard";
import { categoriesKeyboard } from "../../keyboards/categoriesKeyboard";
import { Category } from "../../entities/Category";

export const KeyboardCategoryScene = new Scenes.BaseScene<KeyboardContext>("KeyboardCategory");

KeyboardCategoryScene.enter(async(ctx: KeyboardContext) => {
  if(!ctx.scene.state.message) {
    ctx.scene.state.message = await ctx.reply("Выбери категорию:", {
      reply_markup: await categoriesKeyboard(ctx)
    });
  } else {
    await ctx.editMessageText("Выбери автора:", {
      reply_markup: await categoriesKeyboard(ctx)
    });
  }
});

KeyboardCategoryScene.on("callback_query", async(ctx: KeyboardContext) => {
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
    case "page": {
      await ctx.answerCbQuery("Страница " + (ctx.scene.state.page + 1).toString())
      break;
    }
    default: {
      const chosenCategory = await Category.findOneBy({ id: ctx.callbackQuery["data"] });

      ctx.scene.state.category = chosenCategory;

      ctx.scene.state.page = 0;
      await ctx.scene.enter("KeyboardAuthor", ctx.scene.state);
      break;
    }
  }
});
