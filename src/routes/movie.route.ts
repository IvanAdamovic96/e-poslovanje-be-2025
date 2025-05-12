import { Router, type Request, type Response } from "express";
import { MovieService } from "../services/movie.service";
import { defineRequest } from "../utils";

export const MovieRoute = Router();

MovieRoute.get('/:id', async (req: Request, res: Response) => {

    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        const rsp = await MovieService.getMovieById(id)
        return rsp.data
    })

})




