import { IsNull, Unique } from "typeorm"
import { AppDataSource } from "../db"
import { Bikes } from "../entities/Bikes"
import type { BikeModel } from "../models/bike.model"
import { BookmarkService } from "./bookmark.service"
import { Bookmark } from "../entities/Bookmark"

const repo = AppDataSource.getRepository(Bikes)
const bookmarkRepo = AppDataSource.getRepository(Bookmark)

export class BikeService {

    //get all
    static async getBikes() {
        return await repo.find({
            select: {
                bikeId: true,
                vin: true,
                brand: true,
                model: true,
                year: true,
                category: true,
                displacement: true,
                power: true,
                torque: true,
                fuel: true,
                transmission: true,
                color: true,
                price: true,
                description: true,
                image: true,
                engineType: true,
                cooling: true,
                weight: true,
                createdAt: true,
                updatedAt: true
            },
            where: {
                deletedAt: IsNull()
            }
        })
    }

    static async getBikeById(id: number) {
        const data = await repo.findOne({
            where: {
                bikeId: id,
                deletedAt: IsNull()
            }
        })

        if (data == null) {
            throw new Error('NOT_FOUND')
        }
        return data
    }


    

    static async createBike(model: Bikes) {
        await repo.save({
            vin: model.vin,
            brand: model.brand,
            model: model.model,
            year: model.year,
            category: model.category,
            displacement: model.displacement,
            power: model.power,
            torque: model.torque,
            fuel: model.fuel,
            transmission: model.transmission,
            color: model.color,
            price: model.price,
            description: model.description,
            image: model.image,
            engineType: model.engineType,
            cooling: model.cooling,
            weight: model.weight,
            createdAt: new Date()
        })
    }

    static async updateBike(id: number, model: Bikes) {
        const bike = await this.getBikeById(id)
        bike.vin = model.vin
        bike.brand = model.brand
        bike.model = model.model
        bike.year = model.year
        bike.category = model.category
        bike.displacement = model.displacement
        bike.power = model.power
        bike.torque = model.torque
        bike.fuel = model.fuel
        bike.transmission = model.transmission
        bike.color = model.color
        bike.price = model.price
        bike.description = model.description
        bike.image = model.image
        bike.engineType = model.engineType
        bike.cooling = model.cooling
        bike.weight = model.weight
        bike.updatedAt = new Date()
        await repo.save(bike)
    }

    static async deleteBikeById(id: number) {
        const bike = await this.getBikeById(id)

        const bookmarks = await bookmarkRepo.find({
            where: {
                bikeId: id,
                deletedAt: IsNull()
            }
        })

        if (bookmarks == null)
            throw new Error("NOT_FOUND")

        for (const bookmark of bookmarks) {
            bookmark.deletedAt = new Date()
        }

        await AppDataSource.transaction(async () => {
            await repo.save(bike)
            if (bookmarks.length > 0) {
                await bookmarkRepo.save(bookmarks)
            }
        })
    }
}