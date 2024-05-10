import prisma from "../../../prisma/prisma-client";
import {TUser} from "./user.model";
import {ApiError} from "../../middleware/errorHandler";
import bcrypt from "bcrypt";
import {tokenStore} from "../../stores/tokens";

export const getByLogin = async (login?: string) => {
    try {
        const user = await prisma.user.findUnique({where: {login}})
        if (!user)
            throw ApiError.BadRequest('Not found user')

        const {password, ...userData} = user
        return userData
    } catch (e) {
        throw ApiError.BadRequest(e)
    }
}
export const add = async (user: TUser) => {
    const hashPassword = await bcrypt.hash(user.password, 2)
    return prisma.user.create({data: {...user, password: hashPassword}})
        .catch(err => {
            throw ApiError.BadRequest(err)
        })
}

export const edit = ({id, ...rest}: TUser) =>
    prisma.user.update({
        where: {id},
        data: rest
    })
    .catch(err => {
        throw ApiError.BadRequest(err)
    })
export const deleteByLogin = (login?: string) =>
    prisma.user.delete({where: {login}})
        .catch(err => {
            throw ApiError.BadRequest(err)
        })