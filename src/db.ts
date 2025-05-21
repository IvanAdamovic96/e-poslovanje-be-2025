import { configDotenv } from "dotenv";
import { DataSource } from "typeorm";
import { Bookmark } from "./entities/Bookmark";
import { Bikes } from "./entities/Bikes";
import { Reservation } from "./entities/Reservation";
import { User } from "./entities/User";


configDotenv()

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        /* Bookmark, Cinema, Hall, Projection, Reservation, User, */
        Bikes, Bookmark, Reservation, User
    ],
    logging: false
})

