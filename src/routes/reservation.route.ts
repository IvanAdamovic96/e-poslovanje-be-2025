import { Router } from "express";
import { defineRequest } from "../utils";
import { ReservationService } from "../services/reservation.service";
import { UserService } from "../services/user.service";

export const ReservationRoute = Router()

/* ReservationRoute.get('/', async (req: any, res) => {
    await defineRequest(res, async () =>
        await ReservationService.getReservations(req.user.email)
    )
}) */

ReservationRoute.post('/', UserService.validateToken, async (req: any, res) => {

    await defineRequest(res, async () => {

        const userId = req.user.id;

        const { bikeId } = req.body;

        if (!userId || typeof userId !== 'number') {
            res.status(401).json({ message: 'User not authenticated or userId missing.' });
            return;
        }
        if (!bikeId || typeof bikeId !== 'number') {
            res.status(400).json({ message: 'Bike ID is required and must be a number.' });
            return;
        }
        return await ReservationService.createReservation(userId, bikeId);
    });
})

ReservationRoute.get('/', UserService.validateToken, async (req: any, res) => {
        await defineRequest(res, async () => {
            const userId = req.user.id;

            if (!userId || typeof userId !== 'number') {
                res.status(401).json({ message: 'User not authenticated or userId missing.' });
                return;
            }

            return await ReservationService.getReservationsByUserId(userId);
        });
    }
);


ReservationRoute.delete('/:id', UserService.validateToken, async (req: any, res) => {
        await defineRequest(res, async () => {
            const reservationId = parseInt(req.params.id);
            const userId = req.user.id;

            if (isNaN(reservationId)) {
                res.status(400).json({ message: 'Invalid reservation ID provided.' });
                return;
            }
            if (!userId || typeof userId !== 'number') {
                res.status(401).json({ message: 'User not authenticated or userId missing.' });
                return;
            }
            return await ReservationService.deleteReservation(reservationId, userId);
        });
    }
);