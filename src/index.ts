import express, { type Request, type Response } from 'express'
import cors from 'cors'
import morgan from 'morgan';
import { configDotenv } from 'dotenv';
import { AppDataSource } from './db';
import { UserRoute } from './routes/user.route';
import { UserService } from './services/user.service';
import { BikeRoute } from './routes/bike.route';
import { BookmarkRoute } from './routes/bookmark.route';
import { ReservationRoute } from './routes/reservation.route';

const app = express();
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Application routes

app.use('/bikes', BikeRoute)
app.use(UserService.validateToken);
app.use('/user', UserRoute)
app.use('/bookmark', BookmarkRoute)
app.use('/reservation', ReservationRoute)


//404 Not Found
app.get('{/*path}', function (req, res) {
    res.status(404).json({
        message: 'NOT FOUND',
        timestamp: new Date()
    })
})

configDotenv()
const port = Number(process.env.SERVER_PORT)

AppDataSource.initialize()
    .then(() => {
        console.log('Connected to database')
        app.listen(port, () => {
            console.log(`Server radi na portu: ${port}`)
        })
    })
    .catch((e) => console.log('Database connection failed', e))

