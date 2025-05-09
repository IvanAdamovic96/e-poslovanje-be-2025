import express, { type Request, type Response } from 'express'
import cors from 'cors'
import axios from 'axios';

const app = express()
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'PSEP 2025'
    })
})

app.get('/:mid', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.mid)
        const rsp = await axios.get('https://movie.pequla.com/api/movie/' + id)

        res.json(rsp.data)

    } catch {
        res.status(400).json({
            message: 'Error'
        })
    }
})

app.listen(3000, () => {
    console.log("server radi")
})