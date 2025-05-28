import { In, IsNull, MoreThan, Not } from "typeorm";
import { AppDataSource } from "../db";
import { Bikes } from "../entities/Bikes";
import { Reservation, ReservationStatus } from "../entities/Reservation";
import { UserService } from "./user.service";
import { dataExists } from "../utils";
import axios from "axios";
import type { User } from "../entities/User";
import { configDotenv } from "dotenv";
import { BikeService } from "./bike.service";

const reservationRepo = AppDataSource.getRepository(Reservation);
const bikeRepo = AppDataSource.getRepository(Bikes);
configDotenv()

const RESERVATION_HOLD_HOURS = 120;
const FIXED_RESERVATION_FEE = 100.00;

export class ReservationService {

    static async createReservation(userId: number, bikeId: number,) {



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


    static async getReservationById(id: number, email: string) {
        const data = await reservationRepo.findOne({
            where: {
                reservationId: id,
                userId: await UserService.getUserIdByEmail(email),
                deletedAt: IsNull()
            },
            relations: {
                bike: true
            }
        })

        return dataExists(data)
    }



    static async getSimpleReservationById(id: number, email: string) {
        const data = await reservationRepo.findOneBy({
            reservationId: id,
            userId: await UserService.getUserIdByEmail(email),
            paidAt: IsNull(),
            deletedAt: IsNull()
        })
        return dataExists(data)
    }


    static async payReservation(id: number, email: string) {
        const user: User = await UserService.getUserByEmail(email)
        const data: Reservation = await reservationRepo.findOneOrFail({
            select: {
                reservationId: true,
                bikeId: true,
                totalPrice: true,
                bike: true,
                createdAt: true,
            },
            where: {
                reservationId: id,
                userId: user.userId,
                deletedAt: IsNull()
            },
            relations: {
                bike: true
            }
        })

        const bike = await BikeService.getBikeById(data.bikeId)


        //const movie = await MovieService.getMovieById(data.projection.movieId)
        const rsp = await axios.request({
            url: 'https://sim.purs.singidunum.ac.rs/api/invoice',
            method: 'POST',
            data: {
                indeks: process.env.PURS_TOKEN,
                token: process.env.PURS_TOKEN,
                customer: `${user.firstName} ${user.lastName}`,
                address: user.email,
                taxId: user.phone,
                items: [{
                    name: `${bike.brand} ${bike.model} ${new Date(data.createdAt).toLocaleString('sr-RS')}`,
                    amount: data.bike.price,
                    price: data.totalPrice
                }]
            }
        })

        // Save as paid
        const res = await reservationRepo.findOneByOrFail({
            reservationId: id,
            userId: user.userId,
            deletedAt: IsNull()
        })

        res.status = ReservationStatus.COMPLETED
        res.paidAt = new Date()
        res.transactionId = rsp.data.token
        reservationRepo.save(res)
    }



    /* static async payReservation(id: number, email: string) {
        const user: User = UserService.getUserByEmail(email)

        const data: Reservation = await reservationRepo.findOneOrFail({
            select: {
                reservationId: true,
                bikeId: true,
                totalPrice: true,
                bike: true,
                createdAt: true,

            },
            where: {
                reservationId: id,
                userId: user.userId,
                deletedAt: IsNull()
            }
        })

        const res: Reservation = await this.getSimpleReservationById(id, email)

        const rsp = await axios.request({
            url: 'https://sim.purs.singidunum.ac.rs/api/invoice',
            method: 'POST',
            data: {
                indeks: process.env.PURS_TOKEN,
                token: process.env.PURS_TOKEN,
                customer: `${user.firstName} ${user.lastName}`,
                address: user.email,
                taxId: user.phone,
                items: [{
                    name: res.bike.model,
                    amount: res.bike.brand,
                    price: res.totalPrice
                }]
            }
        })


        const reservation = await reservationRepo.findOneByOrFail({

        })

    } */




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