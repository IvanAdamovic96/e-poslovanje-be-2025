import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Hall } from "./Hall";
import { Reservation } from "./Reservation";

@Index("fk_projection_hall_idx", ["hallId"], {})
@Entity("projection", { schema: "eposlovanje" })
export class Projection {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "projection_id",
    unsigned: true,
  })
  projectionId: number;

  @Column("int", { name: "hall_id", unsigned: true })
  hallId: number;

  @Column("int", { name: "movie_id", unsigned: true })
  movieId: number;

  @Column("varchar", { name: "time", length: 45 })
  time: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "update_at", nullable: true })
  updateAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Hall, (hall) => hall.projections, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "hall_id", referencedColumnName: "hallId" }])
  hall: Hall;

  @OneToMany(() => Reservation, (reservation) => reservation.projection)
  reservations: Reservation[];
}
