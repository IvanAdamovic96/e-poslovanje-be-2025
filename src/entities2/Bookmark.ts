import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("fk_bookmark_user_idx", ["userId"], {})
@Entity("bookmark", { schema: "eposlovanje" })
export class Bookmark {
  @PrimaryGeneratedColumn({ type: "int", name: "bookmark_id", unsigned: true })
  bookmarkId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "movie_id", unsigned: true })
  movieId: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.bookmarks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
