import { Router } from "express";
import { defineRequest } from "../utils";
import { UserService } from "../services/user.service";
import type { User } from "../entities/User";

export const UserRoute = Router()

UserRoute.post('/login', async (req, res) => {
    await defineRequest(res, async () =>
        await UserService.login(req.body.email, req.body.password)
    )
})

UserRoute.post('/register', async (req, res) => {
    await defineRequest(res, async () =>
        await UserService.register(req.body)
    )
})

UserRoute.get('/self', async (req: any, res) => {
    await defineRequest(res, async () =>
        await UserService.self(req.user.email)
    )
})

UserRoute.put('/', UserService.validateToken, async (req: any, res) => {
    await defineRequest(res, async () => {
        const userId = req.user.id;
        const updatedUserData: Partial<User> = req.body;
        return await UserService.updateUser(userId, updatedUserData);
    });
}
);


UserRoute.post('/refresh', async (req, res) => {
    await defineRequest(res, async () => {
        const auth = req.headers['authorization']
        const token = auth && auth.split(' ')[1]

        if (token == undefined)
            throw new Error('REFRESH_TOKEN_MISSING')

        return await UserService.refreshToken(token)
    })
})





/* UserRoute.post('/login', async (req, res) => {
    await defineRequest(res, async () => {
        const tokens = await UserService.login(req.body.email, req.body.password)
        return res.status(200).json(tokens);
    })
})

UserRoute.post('/refresh', async (req, res) => {
    await defineRequest(res, async () => {
        const auth = req.headers['authorization']
        const token = auth && auth.split(' ')[1]

        if(token == undefined)
            throw new Error('REFRESH_TOKEN_MISSING')

        return await UserService.refreshToken(token)
    })
}) */