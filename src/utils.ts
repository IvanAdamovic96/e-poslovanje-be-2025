import type { Response } from "express";

export async function defineRequest(response: Response, callback: Function) {

    try {
        const data = await callback()
        if (data == null) {
            response.status(204).send()
            return
        }
        response.json(data)

    } catch (e: any) {
        const code = e.message == 'NOT_FOUND' ? 404 : 500

        response.status(code).json({
            message: e.message ?? 'Error',
            timestamp: new Date()
        })
    }
}

export function dataExists(data: any) {
    if (data == null)
        throw new Error('NOT_FOUND')
    return data
}