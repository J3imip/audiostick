import { Composer } from "telegraf";
import { CustomSession } from "../interfaces/Session";
import { getInlineResults } from "../utils/getInlineResult";
import { Sticker } from "../entities/Sticker";
import { User } from "../entities/User";

export const composer = new Composer<CustomSession>();

composer.start(async(ctx: CustomSession) => {
  await ctx.scene.enter("KeyboardCategory");
});

composer.on("inline_query", async(ctx: CustomSession) => {
  const offset = Number(ctx.inlineQuery.offset) || 0;

  const results = await getInlineResults(ctx.session.user, offset, ctx.inlineQuery.query);

  await ctx.answerInlineQuery(results, {
    cache_time: -1,
    next_offset: results?.length >= 30 ? (offset + 1).toString() : null
  });
});

composer.on("chosen_inline_result", async(ctx: CustomSession) => {
  const resultId = ctx.chosenInlineResult.result_id;

  await Sticker.createQueryBuilder()
    .update()
    .set({ uses: () => "uses + 1" })
    .where("id = :id", {id: resultId})
    .execute();

  if(
    ctx.chosenInlineResult.query[0] == "+"
  ) {
    const user = await User.findOne({
      where: { id: ctx.session.user.id },
      relations: {
        stickers: true
      }
    });

    const sticker = await Sticker.findOneBy({ id: parseInt(ctx.chosenInlineResult.result_id) });

    if (user && sticker) {
      if (!user.stickers) {
        user.stickers = []; 
      }
      user.stickers.push(sticker);
      await user.save();
    }
  } else if(
    ctx.chosenInlineResult.query[0] == "-"
  ) {
    const user = await User.findOne({
      where: { id: ctx.session.user.id },
      relations: {
        stickers: true
      }
    });

    const sticker = await Sticker.findOneBy({ id: parseInt(ctx.chosenInlineResult.result_id) });

    if (!user || !user.stickers) {
      return;
    }

    const stickerIndex = user.stickers.findIndex((s) => s.id === sticker.id);

    if (user && sticker) {
      user.stickers.splice(stickerIndex, 1);
      await user.save();
    }
  }
  if(ctx.session.user.role == "admin") {
    await ctx.scene.enter("EditSticker");
  }
});
