import { Router } from "express";
import { defineRequest } from "../utils";
import { ReservationService } from "../services/reservation.service";
import { UserService } from "../services/user.service";

export const ReservationRoute = Router()


ReservationRoute.get('/', UserService.validateToken, async (req: any, res) => {
    await defineRequest(res, async () => {
        const userId = req.user.id;
        return await ReservationService.getReservationsByUserId(userId);
    });
});

ReservationRoute.get('/:id', UserService.validateToken, async (req: any, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await ReservationService.getReservationById(id, req.user.email)
    })
});


ReservationRoute.post('/', UserService.validateToken, async (req: any, res) => {
    await defineRequest(res, async () => {
        const userId = req.user.id;
        const { bikeId } = req.body;
        return await ReservationService.createReservation(userId, bikeId);
    });
})

//payment
ReservationRoute.put('/:id/pay', UserService.validateToken, async (req: any, res) => {
    await defineRequest(res, async () => {
        const userId = Number(req.params.id);
        return await ReservationService.payReservation(userId, req.user.email);
    });
});

ReservationRoute.delete('/:id', UserService.validateToken, async (req: any, res) => {
    await defineRequest(res, async () => {
        const reservationId = parseInt(req.params.id);
        const userId = req.user.id;
        return await ReservationService.deleteReservation(reservationId, userId);
    });
}
);