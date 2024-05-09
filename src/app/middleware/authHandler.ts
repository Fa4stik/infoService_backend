import {Request, Response, NextFunction} from 'express'
import {getPayloadAccess} from "../routes/auth/auth.service";
import {ApiError} from "./errorHandler";

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']
        const accessToken = authHeader && authHeader.split(' ')[1]
        if (!accessToken)
            throw ApiError.Unauthorized('Not found access token')

        const userData = await getPayloadAccess(accessToken)
        if (!userData)
            throw ApiError.Unauthorized('Incorrect access token')

        next()
    } catch (e) {
        next(e)
    }
}