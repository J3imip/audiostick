import { Composer } from "telegraf";
import { Video } from "telegraf/typings/core/types/typegram";
import { CreateStickerContext } from "../interfaces/CreateSticker";
import { message } from 'telegraf/filters';
import { CustomSession } from "../interfaces/Session";
import { User, UserRole } from "../entities/User";

export const composer = new Composer<CreateStickerContext>();

composer.on(message("video"), async(ctx: CreateStickerContext) => {
  if(ctx.session.user.role != "admin") return;
  const video: Video = ctx.message['video'];

  ctx.scene.enter("CreateType", { video: video });
});

composer.command("newAdmin", async(ctx: CustomSession) => {
  try {
    if(ctx.session.user.role != "admin") return;
    const id: number = ctx.message["text"].split(" ")[1];
    
    const user = await User.findOneBy({ id });
    user.role = UserRole.ADMIN;
    user.save();

    await ctx.reply(`Пользователь с id ${user.id} теперь администратор!`);
  } catch (error) {
    await ctx.reply("Произошла ошибка!")
  }
});

composer.command("removeAdmin", async(ctx: CustomSession) => {
  try {
    if(ctx.session.user.role != "admin") return;
    const id: number = ctx.message["text"].split(" ")[1];
    
    const user = await User.findOneBy({ id });
    user.role = UserRole.USER;
    user.save();

    await ctx.reply(`Пользователь с id ${user.id} больше не администратор!`);
  } catch (error) {
    await ctx.reply("Произошла ошибка!")
  }
});
