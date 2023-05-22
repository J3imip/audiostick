import { Composer, Context } from "telegraf";
import { channelPost } from "telegraf/filters";
import { Sticker } from "../entities/Sticker";

export const composer = new Composer<Context>();

composer.on(channelPost("voice"), async(ctx) => {
  if(
    !ctx.channelPost.chat.username &&
    process.env.ADMIN_CHANNEL != ctx.channelPost.chat.username
  ) {
    return;
  }

  const url = `https://t.me/${process.env.ADMIN_CHANNEL}/${ctx.channelPost.message_id}`;
  const fileSize = ctx.channelPost.voice.file_size;

  // a little bit risky solution, but the only thing that i invented.
  await Sticker.update({ fileSize }, { url, fileSize: null });
});

composer.on(channelPost("video_note"), async(ctx) => {
  if(
    !ctx.channelPost.chat.username &&
    process.env.ADMIN_CHANNEL != ctx.channelPost.chat.username
  ) {
    return;
  }

  const url = `https://t.me/${process.env.ADMIN_CHANNEL}/${ctx.channelPost.message_id}`;
  const fileSize = ctx.channelPost.video_note.file_size;

  // a little bit risky solution, but the only thing that i invented.
  await Sticker.update({ fileSize }, { url, fileSize: null });
});
