import {Request, Response, NextFunction} from 'express'
import {getPayloadAccess} from "../routes/auth/auth.service";
import {ApiError} from "./errorHandler";
import prisma from "../../prisma/prisma-client";

const checkToken = (req: Request) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]
    if (!accessToken)
        throw ApiError.Unauthorized('Not found access token', 401)
    return accessToken
}

const getUserData = async (accessToken: string) => {
    const userData = await getPayloadAccess(accessToken)
        .catch(() => {
            throw ApiError.Unauthorized('Time of session died', 401)
        })
    console.log(userData)
    if (!userData)
        throw ApiError.Unauthorized('Incorrect access token')

    return userData
}

export const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = checkToken(req)
        await getUserData(accessToken)

        next()
    } catch (e) {
        next(e)
    }
}

export const adminHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = checkToken(req)
        const userData = await getUserData(accessToken)
        const userDb = await prisma
            .user
            .findUnique({where: {id: userData.id}})

        if (!userDb)
            throw ApiError.BadRequest('Not found user')

        if (userDb.role === 'USER')
            throw ApiError.Unauthorized('Access denied')

        next()
    } catch (e) {
        next(e)
    }
}