import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Projection } from "./Projection";
import { User } from "./User";

@Index("fk_reservation_projection_idx", ["projectionId"], {})
@Index("fk_reservation_user_idx", ["userId"], {})
@Entity("reservation", { schema: "eposlovanje" })
export class Reservation {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "reservation_id",
    unsigned: true,
  })
  reservationId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "projection_id", unsigned: true })
  projectionId: number;

  @Column("int", { name: "num_of_seats", unsigned: true })
  numOfSeats: number;

  @Column("datetime", { name: "watched_at", nullable: true })
  watchedAt: Date | null;

  @Column("text", { name: "comment", nullable: true })
  comment: string | null;

  @Column("int", { name: "rating", nullable: true, unsigned: true })
  rating: number | null;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Projection, (projection) => projection.reservations, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "projection_id", referencedColumnName: "projectionId" }])
  projection: Projection;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
