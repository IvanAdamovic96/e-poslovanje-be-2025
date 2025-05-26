import { In, IsNull, MoreThan, Not } from "typeorm";
import { AppDataSource } from "../db";
import { Bikes } from "../entities/Bikes";
import { Reservation, ReservationStatus } from "../entities/Reservation";
import { UserService } from "./user.service";

const reservationRepo = AppDataSource.getRepository(Reservation);
const bikeRepo = AppDataSource.getRepository(Bikes);

const RESERVATION_HOLD_HOURS = 120;

export class ReservationService {

    static async createReservation(userId: number, bikeId: number,) {

        const FIXED_RESERVATION_FEE = 100.00;

        const bike = await bikeRepo.findOne({
            where: {
                bikeId: bikeId,
                deletedAt: IsNull(),

            }
        });

        if (!bike) {
            throw new Error("BIKE_NOT_FOUND_OR_UNAVAILABLE");
        }

        const reservedUntil = new Date();
        reservedUntil.setHours(reservedUntil.getHours() + RESERVATION_HOLD_HOURS);

        await reservationRepo.save({
            userId: userId,
            bikeId: bikeId,
            totalPrice: String(FIXED_RESERVATION_FEE),
            reservedUntil: reservedUntil,
            status: ReservationStatus.PENDING_PAYMENT,
            createdAt: new Date()
        })

    }



    static async getReservationsByUserId(userId: number): Promise<Reservation[]> {
        return await reservationRepo.find({
            where: {
                userId: userId,
                deletedAt: IsNull()
            },
            relations: ["bike"]
        });
    }


    static async deleteReservation(reservationId: number, userId: number): Promise<Reservation> {
        return await AppDataSource.transaction(async transaction => {
            const reservation = await transaction.findOne(Reservation, {
                where: {
                    reservationId: reservationId,
                    userId: userId,
                    deletedAt: IsNull(),
                    status: Not(ReservationStatus.COMPLETED)
                }
            });

            if (!reservation) {
                throw new Error("Reservation not found!");
            }

            reservation.status = ReservationStatus.CANCELLED;
            reservation.deletedAt = new Date();
            
            return await transaction.save(reservation);

        });
    }



}