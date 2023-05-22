import { 
  BaseEntity, 
  Column, 
  CreateDateColumn, 
  Entity, 
  JoinTable, 
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn, 
} from "typeorm";
import { Sticker } from "./Sticker";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ default: false })
  is_banned: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @ManyToMany(() => Sticker)
  @JoinTable()
  stickers: Sticker[];

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
