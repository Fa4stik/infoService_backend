import * as jose from "jose";
import {TUserData, TUserLogin} from "./auth.model";
import prisma from "../../../prisma/prisma-client";
import bcrypt from 'bcrypt'
import {ApiError} from "../../middleware/errorHandler";

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export const login = async (userLogin: TUserLogin) => {
    const user = await prisma.user
        .findUnique({where: {login: userLogin.login}})

    if (!user)
        throw ApiError.BadRequest('User not found')

    const isCorrectPassword = await bcrypt.compare(userLogin.password, user.password);

    if (!isCorrectPassword)
        throw ApiError.BadRequest('Incorrect password')

    const {password, ...userData} = user
    const tokens = await generateTokens(userData)

    await prisma.token.upsert({
        where: {userId: user.id},
        update: {refreshToken: tokens.refreshToken},
        create: {
            userId: user.id ?? '',
            refreshToken: tokens.refreshToken
        }
    })

    return {
        ...tokens,
        userData
    }
}

export const logout = async (refreshToken: string | Uint8Array) => {
    const userData = await getPayloadRefresh(refreshToken)
    if (!userData)
        throw ApiError.Unauthorized('Incorrect data token')
    return prisma.token.delete({where: {userId: userData.id}})
}

export const updateAccessToken = async (refreshToken: string | Uint8Array) => {
    const userData = await getPayloadRefresh(refreshToken)
    if (!userData)
        throw ApiError.Unauthorized('Incorrect token')
    return generateAccessToken(userData)
}

const getPayloadRefresh = async (refreshToken: string | Uint8Array) => {
    const {payload} = await jose.jwtVerify(refreshToken, secret)

    if (!payload)
        throw ApiError.Unauthorized('Not found payload')
    const userData = payload as TUserData

    const refreshFromDB = await prisma.token
        .findUnique({where: {userId: userData.id}})

    return refreshFromDB && refreshFromDB.refreshToken === refreshToken
        ? userData
        : null
}

export const getPayloadAccess = async (accessToken: string | Uint8Array) => {
    const {payload} = await jose.jwtVerify(accessToken, secret)
    if (!payload)
        throw ApiError.Unauthorized('Invalid access token')
    const userData = payload as TUserData
    const count = await prisma.user.count({where: {id: userData.id}})
    return count !== 0
        ? payload as TUserData
        : null
}

const generateAccessToken = async (user: TUserData) =>
    new jose.SignJWT(user)
        .setProtectedHeader({alg: 'HS256'})
        .setExpirationTime('15d')
        .sign(secret)

const generateRefreshToken = async (user: TUserData) =>
    new jose.SignJWT(user)
        .setProtectedHeader({alg: 'HS256'})
        .setExpirationTime('30d')
        .sign(secret)

const generateTokens = async (user: TUserData) => {
    const accessToken = await generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user)
    return {accessToken, refreshToken}
}