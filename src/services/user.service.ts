import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { User } from "../entities/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { Response } from "express";
import { MovieService } from "./movie.service";
import { BikeService } from "./bike.service";
import { BookmarkService } from "./bookmark.service";

const repo = AppDataSource.getRepository(User)
const tokenSecret = process.env.JWT_SECRET
const accessTTL = process.env.JWT_ACCESS_TTL
const refreshTTL = process.env.JWT_REFRESH_TTL


export class UserService {

    static async login(email: string, password: string) {
        const user = await this.getUserByEmail(email)
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                id: user.userId,
                email: user.email,
            }

            return {
                email: user.email,
                access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, tokenSecret!, { expiresIn: refreshTTL })
            }
        }

        throw new Error('EMAIL_OR_PASSWORD_INCORRECT')
    }


    static async register(model: User) {
        const hashed = await bcrypt.hash(model.password, 12)

        await repo.save({
            firstName: model.firstName,
            lastName: model.lastName,
            email: model.email,
            phone: model.phone,
            password: hashed,
            createdAt: new Date()
        })
    }


    static async self(email: string) {
        const data = await repo.findOne({
            select: {
                userId: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                /* bookmarks: {
                    bookmarkId: true,
                    bikeId: true,
                    createdAt: true
                } */
            },
            where: {
                email: email,
                deletedAt: IsNull(),
                /* bookmarks: {
                    deletedAt: IsNull()
                } */
            },
            /* relations: {
                bookmarks: true
            } */
        })

        if (data == null) {
            throw new Error('NOT_FOUND')
        }



        //saved bikes / bookmarks
        /*  const ids = data.bookmarks.map(b=> b.bikeId)
         const list = await BikeService.getBikeById(bike) */

        /* if (data.bookmarks.length > 0) {
            for (let bookmark of data.bookmarks) {
                const bike = await BikeService.getBikeById(bookmark.bikeId)
                bookmark.bike = bike
            }
        } */

        data.bookmarks = await BookmarkService.getBookmarksByUserId(data.userId)
        
        return data
    }


    static async refreshToken(token: string) {
        const decoded: any = jwt.verify(token, tokenSecret!)
        const user = await this.getUserByEmail(decoded.email)
        const payload = {
            id: user.userId,
            email: user.email,
        }

        return {
            email: user.email,
            access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL }),
            refresh: token
        }
    }

    static async validateToken(req: any, res: Response, next: Function) {
        const whitelisted = [
            '/user/login',
            '/user/refresh',
            '/user/register',
            /* '/bikes', */
        ]

        if (whitelisted.includes(req.path)) {
            next()
            return
        }

        const auth = req.headers['authorization']
        const token = auth && auth.split(' ')[1]

        if (token == undefined) {
            res.status(401).json({
                message: 'NO_TOKEN_FOUND',
                timestamp: new Date(),
                redirect: '/user/login'
            })
            return
        }

        jwt.verify(token, tokenSecret!, (err: any, user: any) => {
            if (err) {
                res.status(403).json({
                    message: 'INVALID_TOKEN',
                    timestamp: new Date(),
                    redirect: '/user/login'
                })
                return
            }

            req.user = user
            next()
        })
    }

    static async getUserByEmail(email: string) {
        const data = await repo.findOne({
            where: {
                email: email,
                deletedAt: IsNull()
            }
        })

        if (data == null)
            throw new Error('NOT_FOUND')

        return data
    }
}