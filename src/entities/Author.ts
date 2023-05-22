import { 
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  ManyToOne
} from "typeorm";
import { Sticker } from "./Sticker";
import { Category } from "./Category";

@Entity('author')
export class Author extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Sticker, (sticker) => sticker.author)
  stickers: Sticker[];

  @ManyToOne(() => Category, (category) => category.authors)
  category: Category;
}
