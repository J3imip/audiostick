import { InlineQueryResult } from "telegraf/typings/core/types/typegram";
import { Sticker } from "../entities/Sticker";
import Fuse from 'fuse.js'

export default async function searchEngine(
  offset: number, 
  query: string
): Promise<InlineQueryResult[]> {
  const recipes: InlineQueryResult[] = [];
  const stickers = await Sticker.createQueryBuilder('sticker')
    .leftJoinAndSelect('sticker.author', 'author')
    .leftJoinAndSelect('author.category', 'category')
    .select([
      'sticker.id', 
      'sticker.url', 
      'sticker.name', 
      'sticker.type', 
      'sticker.uses',
      'author.name',
      'category.name'
    ])
    .where('sticker.url IS NOT NULL')
    .orderBy('sticker.id', 'DESC') 
    .getMany();

  const fuse = new Fuse(stickers, { 
    keys: ['name', 'author.name', 'author.category.name'], 
    includeScore: true,
    minMatchCharLength: 2,
    shouldSort: true,
    threshold: 0.35
  });

  const searched = fuse.search(query);

  const results = chunkArray(searched, 30);

  if(offset >= results.length) return;

  results[offset].forEach(async(el: Fuse.FuseResult<Sticker>) => {
    const sticker = el.item;

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

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunkedArray: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunkedArray.push(chunk);
  }
  return chunkedArray;
}

