import { 
  BaseEntity, 
  Column, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { Author } from "./Author";

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Author, (author) => author.category,
  { cascade: true })
  authors: Author;
}
