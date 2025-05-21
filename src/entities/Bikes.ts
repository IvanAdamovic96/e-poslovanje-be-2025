import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bookmark } from "./Bookmark";
import { Reservation } from "./Reservation";
import type { BikeModel } from "../models/bike.model";

@Index("uq_bikes_vin", ["vin"], { unique: true })
@Entity("bikes", { schema: "bikes-praktikum" })
export class Bikes {
  @PrimaryGeneratedColumn({ type: "int", name: "bike_id", unsigned: true })
  bikeId: number;

  @Column("varchar", { name: "vin", unique: true, length: 255 })
  vin: string;

  @Column("varchar", { name: "brand", length: 255 })
  brand: string;

  @Column("varchar", { name: "model", length: 255 })
  model: string;

  @Column("int", { name: "year" })
  year: number;

  @Column("varchar", { name: "category", length: 255 })
  category: string;

  @Column("int", { name: "displacement" })
  displacement: number;

  @Column("decimal", { name: "power", precision: 5, scale: 2 })
  power: string;

  @Column("decimal", { name: "torque", precision: 5, scale: 2 })
  torque: string;

  @Column("varchar", { name: "fuel", length: 255 })
  fuel: string;

  @Column("varchar", { name: "transmission", length: 255 })
  transmission: string;

  @Column("varchar", { name: "color", length: 255 })
  color: string;

  @Column("decimal", { name: "price", precision: 10, scale: 2 })
  price: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("text", { name: "image" })
  image: string;

  @Column("varchar", { name: "engine_type", length: 255 })
  engineType: string;

  @Column("varchar", { name: "cooling", length: 255 })
  cooling: string;

  @Column("int", { name: "weight" })
  weight: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.bike)
  bookmarks: Bookmark[];

  @OneToMany(() => Reservation, (reservation) => reservation.bike)
  reservations: Reservation[];

}
