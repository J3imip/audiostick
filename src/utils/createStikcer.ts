import { File, Message } from "telegraf/typings/core/types/typegram";
import { CreateStickerContext } from "../interfaces/CreateSticker";
import { Path } from "typescript";
import { Author } from "../entities/Author";
import { Sticker } from "../entities/Sticker";
import { Category } from "../entities/Category";
import { logger } from "../winston";
import { Video } from "./converter";

export async function createSticker(ctx: CreateStickerContext) {
  try {
    const message: Message = await ctx.reply("<i>Секунду...</i>", {parse_mode: "HTML"});

    const sticker = ctx.scene.state;
    const video: File = await ctx.telegram.getFile(sticker.video.file_id);

    let videoPath: Path, 
        voicePath: Path;

    let fileSize: number;

    const vid = new Video(video);
    await vid.downloadVideo();

    if(sticker.type == "video") {
      videoPath = await vid.compress();

      const sended = 
        await ctx.replyWithVideoNote({ source: videoPath });
      
      fileSize = sended.video_note.file_size;

      await vid.delete();
    } else if(sticker.type == "voice") {
      voicePath = await vid.toVoice();

      const sended = await ctx.replyWithVoice({ source: voicePath }, {
        caption: sticker.sign ? sticker.name : ""
      });

      fileSize = sended.voice.file_size;

      await vid.delete();
    }

    let stickerPostgres = await Sticker.findOne({
      where: {
        name: sticker.name,
        author: {
          id: (sticker.author as Author).id
        },
        type: sticker.type
      },
      relations: ['author', 'author.category']
    });

    if(!stickerPostgres) {
      stickerPostgres = await Sticker.create({
        type: sticker.type,
        name: sticker.name,
        author: sticker.author as Author,
        fileSize: fileSize
      }).save();
    } else {
      await ctx.reply("Такой стикер уже существует!");
      return;
    }

    const category = await Category.findOneBy({ 
      id: (sticker.author as Author).category.id 
    });

    await ctx.reply(`
<b>Новый стикер создан успешно! ✅</b>
<b>Тип:</b> ${stickerPostgres.type == "voice" ? "голосовое" : "видеосообщение"}
<b>Название:</b> ${stickerPostgres.name}
<b>Автор:</b> ${stickerPostgres.author.name}
<b>Категория:</b> ${category.name}`, 
    {parse_mode: "HTML"});

    await ctx.deleteMessage(message.message_id);
    await ctx.scene.leave();
  } catch (error) {
    logger.error(error);
  }
}
