import { Context, Scenes } from "telegraf";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { StickerType } from "../entities/Sticker";
import { Video } from "telegraf/typings/core/types/typegram";
import { Author } from "../entities/Author";

interface CreateSession extends Scenes.SceneSession {
  user: User;
}

export interface EditStickerContext extends Context {
	session: CreateSession;
	scene: Scenes.SceneContextScene<CreateStickerContext, Scenes.SceneSessionData> & {
    state: {
      video: Video;
      type: StickerType;
      name: string;
      category: Category;
      author: Author | string;
      stick: boolean;
      sign: boolean;
    }
  }
}
