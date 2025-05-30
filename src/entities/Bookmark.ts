import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bikes } from "./Bikes";
import { User } from "./User";
import type { BikeModel } from "../models/bike.model";

@Index("fk_bookmark_user_idx", ["userId"], {})
@Index("fk_bookmark_bikes_idx", ["bikeId"], {})
@Entity("bookmark", { schema: "bikes-praktikum" })
export class Bookmark {
  @PrimaryGeneratedColumn({ type: "int", name: "bookmark_id", unsigned: true })
  bookmarkId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "bike_id", unsigned: true })
  bikeId: number;

  bike: BikeModel | null

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;


  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Bikes, (bikes) => bikes.bookmarks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "bike_id", referencedColumnName: "bikeId" }])
  bike: Bikes;

  @ManyToOne(() => User, (user) => user.bookmarks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
