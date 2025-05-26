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

export enum ReservationStatus {
  PENDING_PAYMENT = 'pending_payment',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Index("fk_reservation_bikes_idx", ["bikeId"], {})
@Index("fk_reservation_user_idx", ["userId"], {})
@Entity("reservation", { schema: "bikes-praktikum" })
export class Reservation {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "reservation_id",
    unsigned: true,
  })
  reservationId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "bike_id", unsigned: true })
  bikeId: number;

  @Column("decimal", { name: "total_price", precision: 10, scale: 2 })
  totalPrice: string;

  @Column("datetime", { name: "reserved_until", nullable: true })
  reservedUntil: Date | null;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING_PAYMENT,
    name: 'status'
  })
  status: ReservationStatus;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Bikes, (bikes) => bikes.reservations, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "bike_id", referencedColumnName: "bikeId" }])
  bike: Bikes;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
