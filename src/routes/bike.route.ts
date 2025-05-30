import { Router } from "express";
import { defineRequest } from "../utils";
import { BikeService } from "../services/bike.service";
import { UserService } from "../services/user.service";

export const BikeRoute = Router()

BikeRoute.get('/', async (req, res) => {
    await defineRequest(res, async () => {
        return await BikeService.getBikes()
    })
})

BikeRoute.get('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await BikeService.getBikeById(id)
    })
})

/* BikeRoute.get('/brands', async (req, res) => {
    await defineRequest(res, async () => {
        return await BikeService.getBikeBrands()
    })
}) */


BikeRoute.post('/',UserService.validateToken, async (req, res) => {
    await defineRequest(res, async () =>
        await BikeService.createBike(req.body)
    )
})

BikeRoute.put('/edit/:id',UserService.validateToken, async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await BikeService.updateBike(id, req.body)
    })
})

BikeRoute.delete('/:id',UserService.validateToken, async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await BikeService.deleteBikeById(id)
    })
})