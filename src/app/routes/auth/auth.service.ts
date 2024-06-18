import * as jose from "jose";
import {TUserData, TUserLogin} from "./auth.model";
import prisma from "../../../prisma/prisma-client";
import bcrypt from 'bcrypt'
import {ApiError} from "../../middleware/errorHandler";
import generator from 'generate-password'
import {sendMail} from "../../mailer/nodemailer";
import {tokenStore} from "../../stores/tokens";
import {randomUUID} from "node:crypto";

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export const checkLink = async (link: string) => prisma
    .resetLink
    .findUniqueOrThrow({where: {id: link}})
    .catch((err) => {
        throw ApiError.BadRequest('Link not found')
    })

export const login = async (userLogin: TUserLogin) => {
    const user = await prisma.user
        .findUnique({where: {email: userLogin.email}})

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
    return prisma
        .token
        .delete({where: {userId: userData.id}})
}

export const generateLink = async (email: string, origin: string) => {
    const user = await prisma.user.findUnique({where: {email}})
    if (!user)
        throw ApiError.BadRequest('Email do not find')

    const {id, ...userData} = user
    const resetLink = await prisma.resetLink.upsert({
        where: {userId: id},
        update: {},
        create: {userId: id}
    })

    await sendMail(email, 'Установка пароля', `${origin}/login?reset=${resetLink.id}`)

    return resetLink
}

export const resetPassword = async (link: string, password: string) => {
    const dbLink = await prisma
        .resetLink
        .findUnique({where: {id: link}})
    if (!dbLink)
        throw ApiError.BadRequest('Incorrect link')

    await prisma
        .resetLink
        .delete({where: {id: link}})

    const hashPass = await bcrypt.hash(password, 2)

    return prisma
        .user
        .update({
            where: {id: dbLink.userId},
            data: {password: hashPass}
        })
}

export const updateAccessToken = async (refreshToken: string | Uint8Array) => {
    const userData = await getPayloadRefresh(refreshToken)
    if (!userData)
        throw ApiError.Unauthorized('Incorrect token')
    return generateAccessToken(userData)
}

export const validateIdForTokens = (id: string) => {
    const tokens = tokenStore.get(id)
    if (!tokens)
        throw ApiError.BadRequest('Incorrect id')
    tokenStore.delete(id)
    return tokens
}

export const saveTokens = (refresh: string, access: string) => {
    const id = crypto.randomUUID()
    tokenStore.set(id, {refresh, access})
    return id
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