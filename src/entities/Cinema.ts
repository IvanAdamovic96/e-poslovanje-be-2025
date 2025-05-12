import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Hall } from "./Hall";

@Index("uq_cinema_name", ["name"], { unique: true })
@Entity("cinema", { schema: "eposlovanje" })
export class Cinema {
  @PrimaryGeneratedColumn({ type: "int", name: "cinema_id", unsigned: true })
  cinemaId: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("varchar", { name: "location", length: 255 })
  location: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Hall, (hall) => hall.cinema)
  halls: Hall[];
}
