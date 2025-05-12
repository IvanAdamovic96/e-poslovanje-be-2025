import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Cinema } from "../entities/Cinema";

const repo = AppDataSource.getRepository(Cinema)

export class CinemaService {

    //get all
    static async getCinemas(){
        return await repo.find({
            select: {
                cinemaId: true,
                name: true,
                location: true,
                createdAt: true,
                updatedAt: true
                //ne trebamo vracati deletedAt
            },
            where: {
                deletedAt: IsNull()
            }
        })
    }

    //get by Id
    static async getCinemaById(id: number){
        const data = await repo.findOne({
            where: {
                cinemaId: id,
                deletedAt: IsNull()
            }
        })

        if(data == null){
            throw new Error('NOT_FOUND')
        }
        return data
    }

    //create
    static async createCinema(model: Cinema){
        await repo.save({
            name: model.name,
            location: model.location,
            createdAt: new Date()
        })
    }

    //update
    static async updateCinema(id: number, model: Cinema){
        const cinema = await this.getCinemaById(id)
        cinema.name = model.name
        cinema.location = model.location
        cinema.updatedAt = new Date()
        await repo.save(cinema)
    }

    //delete
    static async deleteCinemaById(id: number){
        const cinema = await this.getCinemaById(id)
        cinema.deletedAt = new Date()
        repo.save(cinema)
    }


}