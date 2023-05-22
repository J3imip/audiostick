import { InlineQueryResult } from "telegraf/typings/core/types/typegram";
import { Sticker } from "../entities/Sticker";
import searchEngine from "./searchEngine";
import { User } from "../entities/User";

export async function getInlineResults(user: User, offset: number, query: string): Promise<InlineQueryResult[]> {
  if(
    query[0] === "+"
  ) {
    query = query.substring(2);
  }

  if(query == "изб" || query[0] === "-") {
    return await toInlineKeyboard(user);
  }

  if(query.length <= 0) 
    return await getAll(offset);
  else if(query.length > 0)
    return await searchEngine(offset, query);
}

async function toInlineKeyboard(user: User): Promise<InlineQueryResult[]> {
  const stickers = (await User.findOne({
    where: { id: user.id },
    relations: {
      stickers: true
    }
  })).stickers;

  if(!stickers) return;

  const recipes: InlineQueryResult[] = [];

  for (const stickerEl of stickers) {
    const sticker = await Sticker.findOne({
      where: { id: stickerEl.id },
      relations: {
        author: true
      }
    });

    if (sticker.type == "voice") {
      recipes.push({
        type: "audio",
        id: sticker.id.toString(),
        title: sticker.name,
        audio_url: sticker.url,
        performer: `${sticker.author.name} ♪ ${sticker.uses}`
      });
    } else {
      recipes.push({
        type: "video",
        id: sticker.id.toString(),
        mime_type: "video/mp4",
        title: sticker.name,
        video_url: sticker.url,
        thumb_url: sticker.url,
        description: `${sticker.author.name} ♪ ${sticker.uses}`
      });
    }
  }
  
  return recipes;
}

async function getAll(offset: number): Promise<InlineQueryResult[]> {
  const results = await Sticker.createQueryBuilder('sticker')
    .leftJoinAndSelect('sticker.author', 'author')
    .select([
      'sticker.id', 
      'sticker.url', 
      'sticker.name', 
      'sticker.type', 
      'sticker.uses',
      'author.name'
    ])
    .where('sticker.url IS NOT NULL')
    .orderBy('sticker.id', 'DESC') 
    .skip(offset * 30)
    .take(30)
    .getMany();

  const recipes: InlineQueryResult[] = [];

  results.forEach(sticker => {
    if(sticker.type == "voice") {
      recipes.push({
        type: "audio",
        id: sticker.id.toString(),
        title: sticker.name,
        audio_url: sticker.url,
        performer: `${sticker.author.name} ♪ ${sticker.uses}`
      })
    } else {
      recipes.push({
        type: "video",
        id: sticker.id.toString(),
        mime_type: "video/mp4",
        title: sticker.name,
        video_url: sticker.url,
        thumb_url: sticker.url,
        description: `${sticker.author.name} ♪ ${sticker.uses}`
      })

    }
  });

  return recipes;
}
