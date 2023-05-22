import { Scenes, Telegraf, session } from "telegraf";
import { getUser } from "./middlewares/getUser";
import { AppDataSource } from "./typeormConf";
import { Postgres } from "@telegraf/session/pg";
import { SessionStore } from "@telegraf/session/types";
import { CreateStickerContext } from "./interfaces/CreateSticker";
import { KeyboardContext } from "./interfaces/Keyboard";
import * as admin from "./composers/admin";
import * as user from "./composers/user";
import * as group from "./composers/group";
import * as dotenv from "dotenv";
import { CreateTypeScene } from "./scenes/CreateSticker/TypeScene";
import { CreateNameScene } from "./scenes/CreateSticker/NameScene";
import { CreateAuthorScene} from "./scenes/CreateSticker/AuthorScene";
import { CreateCategoryScene } from "./scenes/CreateSticker/CategoryScene";
import * as fs from "fs";
import path from "path";
import { Path } from "typescript";
import { cancel } from "./middlewares/cancel";
import { KeyboardAuthorScene } from "./scenes/Keyboard/AuthorScene";
import { KeyboardCategoryScene } from "./scenes/Keyboard/CategoryScene";
import { KeyboardStickerScene } from "./scenes/Keyboard/StickerScene";

dotenv.config();

try {
  const dirs: Path[] = [
    `${process.env.STORAGE_PATH}/voices/` as Path,
    `${process.env.STORAGE_PATH}/videos/` as Path,
  ];
  dirs.forEach(dir => {
    fs.mkdirSync(
      path.join(__dirname, dir), 
      {recursive: true}
    );

    fs.chmodSync(dir, 0o777);
  })
} catch {}

const bot = new Telegraf(process.env.BOT_TOKEN!, { 
  telegram: {
    apiRoot: `http://${process.env.API_HOST}:8081`,
  }
});

const stage = new Scenes.Stage<CreateStickerContext | KeyboardContext>([
  CreateTypeScene,
  CreateCategoryScene,
  CreateAuthorScene,
  CreateNameScene,
  KeyboardAuthorScene,
  KeyboardCategoryScene,
  KeyboardStickerScene
], {ttl: 100});

//custom storage of session in postgresql
const store: SessionStore<object> = Postgres({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

//connect to postgresql database
AppDataSource.initialize();

//session and stage initialization
bot.use(session({ store }));
bot.use(stage.middleware());

//middlewares
bot.use(getUser());
bot.use(cancel());

//composers
bot.use(admin.composer);
bot.use(user.composer);
bot.use(group.composer);

bot.launch({
  dropPendingUpdates: true,
});


//enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));