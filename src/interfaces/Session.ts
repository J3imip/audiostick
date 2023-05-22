import { Context, Scenes } from "telegraf";
import { User } from "../entities/User";

interface NewSession extends Scenes.SceneSession {
  user: User;
}

export interface CustomSession extends Context {
  session: NewSession;
  scene: Scenes.SceneContextScene<CustomSession>;
}
