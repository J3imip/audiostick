export const cancel = () => async(ctx, next: Function) => {
  try {
    if(ctx.message.text === "/cancel") {
      await ctx.scene.leave();
      await ctx.reply("Действие отменено.");
    }

    return next();
  } catch(err) {
    return next();
  }
}
