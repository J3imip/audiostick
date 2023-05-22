import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Sticker } from "./entities/Sticker";
import { Author } from "./entities/Author";
import { Category } from "./entities/Category";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  entities: [
    User, 
    Sticker,
    Author,
    Category
  ]
});
