import { 
  BaseEntity, 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToMany, 
  ManyToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn
} from "typeorm";
import { User } from "./User";
import { Author } from "./Author";

export enum StickerType {
  VOICE = 'voice',
  VIDEO = 'video'
}

@Entity('sticker')
export class Sticker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  url: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ default: 0 })
  uses: number;

  @Column({
    type: 'enum',
    enum: StickerType
  })
  type: StickerType;

  @ManyToMany(() => User, user => user.stickers)
  users: User[];

  @ManyToOne(() => Author, (author) => author.stickers)
  author: Author;

  @CreateDateColumn({ 
    type: "timestamp", 
    default: () => "CURRENT_TIMESTAMP(6)" 
  })
  created_at: Date;

  @UpdateDateColumn({ 
    type: "timestamp", 
    default: () => "CURRENT_TIMESTAMP(6)", 
      onUpdate: "CURRENT_TIMESTAMP(6)" 
  })
  updated_at: Date;
}
