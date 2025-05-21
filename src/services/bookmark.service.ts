import { IsNull } from "typeorm"
import { AppDataSource } from "../db"
import { Bookmark } from "../entities/Bookmark"
import { User } from "../entities/User"
import { BikeService } from "./bike.service"


const bookmarkRepo = AppDataSource.getRepository(Bookmark)
const userRepo = AppDataSource.getRepository(User)

export class BookmarkService {
    static async getBookmarksByUserId(id: number) {
        const data = await bookmarkRepo.find({
            select: {
                bookmarkId: true,
                bikeId: true,
                createdAt: true
            },
            where: {
                userId: id,
                deletedAt: IsNull()
            }
        })

        if (data.length > 0) {
            for (let bookmark of data) {
                const bike = await BikeService.getBikeById(bookmark.bikeId)
                bookmark.bike = bike
            }
        }

        return data
    }

    static async createBookmark(email: string, bikeId: number) {
        const user = await userRepo.findOne({
            select: {
                userId: true
            },
            where: {
                email: email,
                deletedAt: IsNull()
            }
        })

        if (user == null)
            throw new Error("NOT_FOUND")

        const exists = await bookmarkRepo.existsBy({
            userId: user.userId,
            bikeId: bikeId,
            deletedAt: IsNull()
            }
        )

        if (exists)
            throw new Error('BIKE_ALREADY_SAVED')

        await bookmarkRepo.save({
            userId: user.userId,
            bikeId: bikeId,
            createdAt: new Date()
        })
    }

    static async deleteBookmark(id: number) {
        const bookmark = await bookmarkRepo.findOne({
            where: {
                bookmarkId: id,
                deletedAt: IsNull()
            }
        })

        if (bookmark == null)
            throw new Error("NOT_FOUND")

        bookmark.deletedAt = new Date()
        await bookmarkRepo.save(bookmark)
    }
}