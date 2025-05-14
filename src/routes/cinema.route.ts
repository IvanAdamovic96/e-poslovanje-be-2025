import { Router } from "express";
import { CinemaService } from "../services/cinema.service";
import { defineRequest } from "../utils";

export const CinemaRoute = Router();

CinemaRoute.get('/', async (req, res) => {
    await defineRequest(res, async () => {
        return await CinemaService.getCinemas()
    })
})

CinemaRoute.get('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await CinemaService.getCinemaById(id)
    })
})

CinemaRoute.post('/', async (req, res) => {
    await defineRequest(res, async () => {
        await CinemaService.createCinema(req.body)
    })
})

CinemaRoute.put('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await CinemaService.updateCinema(id, req.body)
    })
})


CinemaRoute.delete('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await CinemaService.deleteCinemaById(id)
    })
})


