import { Context, Scenes } from "telegraf";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { Author } from "../entities/Author";
import { Message } from "telegraf/typings/core/types/typegram";

interface CreateSession extends Scenes.SceneSession {
  user: User;
}

export interface KeyboardContext extends Context {
	session: CreateSession;
	scene: Scenes.SceneContextScene<KeyboardContext, Scenes.SceneSessionData> & {
    state: {
      category: Category;
      author: Author;
      page: number;
      maxPages: number;
      message: Message;
      stickers: Message[];
    }
  }
}

