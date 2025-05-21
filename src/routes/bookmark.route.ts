import { Router } from "express"
import { defineRequest } from "../utils"
import { BookmarkService } from "../services/bookmark.service"

export const BookmarkRoute = Router()

BookmarkRoute.post('/bikes/:id', async (req: any, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await BookmarkService.createBookmark(req.user.email, id)
    })
})

BookmarkRoute.delete('/:id', async (req: any, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await BookmarkService.deleteBookmark(id)
    })
})